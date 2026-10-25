/**
 * AyuSwar AI — Gnani Prisma Indic STT / ASR Proxy
 * POST /api/gnani/stt
 * 
 * Secure Serverless Gateway:
 * - Credentials (GNANI_API_KEY) come EXCLUSIVELY from server environment variables.
 * - Enforces audio payload size limits (10MB max).
 * - Upstream host validated against security allowlist.
 * - Rate limited (best-effort burst protection).
 * - Zero-leak audit logging: Never logs audio data or transcripts.
 */

import { validateUpstreamUrl, checkRateLimit, logSafeApiAccess, sanitizeClientError } from '../_lib/security.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

export default async function handler(req, res) {
  const startTime = Date.now();
  const route = '/api/gnani/stt';

  // 1. Method check
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    logSafeApiAccess({ route, method: req.method, status: 405, durationMs: Date.now() - startTime });
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Rate limiting (15 audio requests per minute)
  const rateLimitResult = checkRateLimit(req, 15);
  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', String(rateLimitResult.retryAfterSec));
    logSafeApiAccess({ route, method: req.method, status: 429, durationMs: Date.now() - startTime, clientNote: 'Audio rate limit' });
    return res.status(429).json({
      error: 'Audio processing rate limit exceeded. Please wait before retrying.',
      retryAfterSec: rateLimitResult.retryAfterSec
    });
  }

  // 3. Server-side credentials check (Fail closed)
  const apiKey = process.env.GNANI_STT_KEY || process.env.GNANI_API_KEY;
  if (!apiKey || apiKey.includes('placeholder')) {
    logSafeApiAccess({ route, method: req.method, status: 503, durationMs: Date.now() - startTime, clientNote: 'GNANI_API_KEY unset' });
    return res.status(503).json({
      error: 'Gnani STT service unavailable: Server credentials are not configured.',
      available: false,
      fallbackRequired: true
    });
  }

  const sttEndpoint = process.env.GNANI_STT_ENDPOINT || process.env.GNANI_ASR_ENDPOINT || 'https://api.vachana.ai/stt/v3';

  // Validate upstream host
  const urlCheck = validateUpstreamUrl(sttEndpoint);
  if (!urlCheck.valid) {
    logSafeApiAccess({ route, method: req.method, status: 500, durationMs: Date.now() - startTime, clientNote: 'Invalid upstream host' });
    return res.status(500).json({
      error: 'Server security configuration error: Upstream host not in allowlist.',
      available: false,
      fallbackRequired: true
    });
  }

  try {
    let audioBuffer = null;
    let languageCode = 'te-IN';

    // Handle JSON payload ({ audioBase64, language_code }) or raw body
    const contentType = req.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      const { audioBase64, language_code } = req.body || {};
      if (!audioBase64) {
        logSafeApiAccess({ route, method: req.method, status: 400, durationMs: Date.now() - startTime });
        return res.status(400).json({ error: 'Missing audioBase64 payload in request body' });
      }
      audioBuffer = Buffer.from(audioBase64, 'base64');
      if (language_code) languageCode = String(language_code).slice(0, 10);
    } else if (Buffer.isBuffer(req.body)) {
      audioBuffer = req.body;
      languageCode = req.headers['x-language-code'] || 'te-IN';
    } else if (typeof req.body === 'string') {
      audioBuffer = Buffer.from(req.body, 'base64');
      languageCode = req.headers['x-language-code'] || 'te-IN';
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      logSafeApiAccess({ route, method: req.method, status: 400, durationMs: Date.now() - startTime });
      return res.status(400).json({ error: 'No audio data received for transcription' });
    }

    // Size limit check (max 10MB)
    if (audioBuffer.length > 10 * 1024 * 1024) {
      logSafeApiAccess({ route, method: req.method, status: 413, durationMs: Date.now() - startTime });
      return res.status(413).json({ error: 'Audio file exceeds 10MB limit' });
    }

    // Ensure valid RIFF WAV container for Gnani STT backend ffmpeg decoder
    let validWavBuffer = audioBuffer;
    if (audioBuffer.length < 4 || audioBuffer.toString('ascii', 0, 4) !== 'RIFF') {
      const header = Buffer.alloc(44);
      header.write('RIFF', 0);
      header.writeUInt32LE(36 + audioBuffer.length, 4);
      header.write('WAVE', 8);
      header.write('fmt ', 12);
      header.writeUInt32LE(16, 16);
      header.writeUInt16LE(1, 20); // PCM
      header.writeUInt16LE(1, 22); // mono
      header.writeUInt32LE(16000, 24); // 16kHz
      header.writeUInt32LE(32000, 28); // byte rate (16000 * 2)
      header.writeUInt16LE(2, 32); // block align
      header.writeUInt16LE(16, 34); // 16 bits
      header.write('data', 36);
      header.writeUInt32LE(audioBuffer.length, 40);
      validWavBuffer = Buffer.concat([header, audioBuffer]);
    }

    // Build standard multipart form data as required by Gnani v3 STT
    const formData = new FormData();
    const audioBlob = new Blob([validWavBuffer], { type: 'audio/wav' });
    formData.append('audio_file', audioBlob, 'audio.wav');
    formData.append('language_code', languageCode);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const upstreamRes = await fetch(sttEndpoint, {
      method: 'POST',
      headers: {
        'X-API-Key-ID': apiKey,
        'x-api-key': apiKey,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Origin': 'https://vachana.ai',
        'Referer': 'https://vachana.ai/'
      },
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      const transcript = data.transcript || data.text || data.transcription || (data.result && data.result[0]?.transcript) || '';

      logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime });
      return res.status(200).json({
        transcript: transcript.trim(),
        languageCode,
        provider: 'gnani_stt',
        model: 'Gnani Prisma v3'
      });
    } else {
      logSafeApiAccess({ route, method: req.method, status: upstreamRes.status, durationMs: Date.now() - startTime, clientNote: `Upstream error ${upstreamRes.status}` });
      return res.status(502).json({
        error: `Upstream speech recognition returned HTTP ${upstreamRes.status}. Falling back to browser speech.`,
        fallbackRequired: true
      });
    }
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    logSafeApiAccess({ route, method: req.method, status: 504, durationMs: Date.now() - startTime, clientNote: isTimeout ? 'Timeout' : 'Upstream fetch failure' });
    return res.status(504).json({
      error: isTimeout ? 'Gnani STT transcription timed out (>15s).' : sanitizeClientError(err),
      fallbackRequired: true
    });
  }
}
