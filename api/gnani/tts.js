/**
 * AyuSwar AI — Gnani Timbre Indic TTS Proxy
 * POST /api/gnani/tts
 * 
 * Secure Serverless Gateway:
 * - Credentials (GNANI_API_KEY) come EXCLUSIVELY from server environment variables.
 * - Enforces text length limits (max 2000 characters).
 * - Upstream host validated against security allowlist.
 * - Rate limited (best-effort burst protection).
 * - Zero-leak audit logging: Never logs synthesized text.
 */

import { validateUpstreamUrl, checkRateLimit, logSafeApiAccess, sanitizeClientError } from '../_lib/security.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50kb'
    }
  }
};

export default async function handler(req, res) {
  const startTime = Date.now();
  const route = '/api/gnani/tts';

  // 1. Method check
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    logSafeApiAccess({ route, method: req.method, status: 405, durationMs: Date.now() - startTime });
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 2. Content-Type check
  const contentType = req.headers['content-type'] || '';
  if (!contentType.includes('application/json')) {
    logSafeApiAccess({ route, method: req.method, status: 415, durationMs: Date.now() - startTime });
    return res.status(415).json({ error: 'Unsupported Media Type: application/json required' });
  }

  // 3. Rate limiting (20 synthesis requests per minute)
  const rateLimitResult = checkRateLimit(req, 20);
  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', String(rateLimitResult.retryAfterSec));
    logSafeApiAccess({ route, method: req.method, status: 429, durationMs: Date.now() - startTime, clientNote: 'TTS rate limit' });
    return res.status(429).json({
      error: 'TTS synthesis rate limit exceeded. Please wait before retrying.',
      retryAfterSec: rateLimitResult.retryAfterSec
    });
  }

  // 4. Server-side credentials check (Fail closed)
  const apiKey = process.env.GNANI_API_KEY;
  if (!apiKey || apiKey.includes('placeholder')) {
    logSafeApiAccess({ route, method: req.method, status: 503, durationMs: Date.now() - startTime, clientNote: 'GNANI_API_KEY unset' });
    return res.status(503).json({
      error: 'Gnani TTS service unavailable: Server credentials are not configured.',
      available: false,
      fallbackRequired: true
    });
  }

  const { text, language = 'te-IN', voice, model = 'timbre-v2.5' } = req.body || {};

  // 5. Input Validation
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    logSafeApiAccess({ route, method: req.method, status: 400, durationMs: Date.now() - startTime });
    return res.status(400).json({ error: 'Invalid or missing text string for TTS synthesis' });
  }

  if (text.length > 2000) {
    logSafeApiAccess({ route, method: req.method, status: 400, durationMs: Date.now() - startTime, clientNote: 'Text length > 2000' });
    return res.status(400).json({ error: 'Text exceeds maximum length limit of 2000 characters' });
  }

  const ttsEndpoint = process.env.GNANI_TTS_ENDPOINT || 'https://api.vachana.ai/api/v1/tts/inference';

  // Validate upstream host
  const urlCheck = validateUpstreamUrl(ttsEndpoint);
  if (!urlCheck.valid) {
    logSafeApiAccess({ route, method: req.method, status: 500, durationMs: Date.now() - startTime, clientNote: 'Invalid upstream host' });
    return res.status(500).json({
      error: 'Server security configuration error: Upstream host not in allowlist.',
      available: false,
      fallbackRequired: true
    });
  }

  const defaultVoice = voice || (language.startsWith('te') ? 'Nalini' : 'Nalini');
  const safeLang = String(language).slice(0, 10);
  const safeModel = String(model).slice(0, 30);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const upstreamRes = await fetch(ttsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key-ID': apiKey,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        text: text.trim(),
        voice: defaultVoice,
        model: safeModel,
        language: safeLang,
        speed: 1.0,
        audio_config: {
          sample_rate: 24000,
          num_channels: 1,
          sample_width: 2,
          encoding: 'linear_pcm',
          container: 'wav'
        }
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (upstreamRes.ok) {
      const audioBuffer = await upstreamRes.arrayBuffer();
      res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime });
      return res.status(200).send(Buffer.from(audioBuffer));
    } else {
      logSafeApiAccess({ route, method: req.method, status: upstreamRes.status, durationMs: Date.now() - startTime, clientNote: `Upstream HTTP ${upstreamRes.status}` });
      return res.status(502).json({
        error: `Gnani TTS service returned HTTP ${upstreamRes.status}`,
        fallbackRequired: true
      });
    }
  } catch (err) {
    clearTimeout(timeoutId);
    const isTimeout = err.name === 'AbortError';
    logSafeApiAccess({ route, method: req.method, status: 504, durationMs: Date.now() - startTime, clientNote: isTimeout ? 'Timeout' : 'Upstream fetch failure' });
    return res.status(504).json({
      error: isTimeout ? 'Gnani TTS upstream request timed out (>15s)' : sanitizeClientError(err),
      fallbackRequired: true
    });
  }
}
