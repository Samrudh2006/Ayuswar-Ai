/**
 * AyuSwar AI — Gnani Indic Speech Services Status Endpoint
 * GET /api/gnani/status
 * 
 * Verifies live operational status of Gnani Speech Services (Prisma STT & Timbre TTS).
 * Keys (GNANI_API_KEY) are configured exclusively server-side and NEVER exposed to clients.
 */

import { validateUpstreamUrl, checkRateLimit, logSafeApiAccess } from '../_lib/security.js';

let lastSuccessTime = null;

export default async function handler(req, res) {
  const startTime = Date.now();
  const route = '/api/gnani/status';

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    logSafeApiAccess({ route, method: req.method, status: 405, durationMs: Date.now() - startTime });
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate limiting (Allow up to 60 status checks per minute)
  const rateLimitResult = checkRateLimit(req, 60);
  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', String(rateLimitResult.retryAfterSec));
    logSafeApiAccess({ route, method: req.method, status: 429, durationMs: Date.now() - startTime });
    return res.status(429).json({ error: 'Rate limit exceeded for status probes.' });
  }

  const apiKey = process.env.GNANI_TTS_KEY || process.env.GNANI_STT_KEY || process.env.GNANI_API_KEY;
  const upstreamBase = 'https://api.vachana.ai';

  if (!apiKey || apiKey.includes('placeholder')) {
    logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime, clientNote: 'GNANI_API_KEY unset' });
    return res.status(200).json({
      available: false,
      status: 'UNCONFIGURED',
      provider: 'browser_fallback',
      models: {
        stt: 'Browser Web SpeechRecognition (Client Fallback)',
        tts: 'Browser Web SpeechSynthesis (Client Fallback)'
      },
      latencyMs: null,
      lastSuccessTime: lastSuccessTime,
      reason: 'GNANI_API_KEY unset on server. Using safe browser speech fallback.'
    });
  }

  // Validate upstream host
  const urlCheck = validateUpstreamUrl(upstreamBase);
  if (!urlCheck.valid) {
    logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime, clientNote: 'Invalid upstream host' });
    return res.status(200).json({
      available: false,
      status: 'UNAVAILABLE',
      provider: 'browser_fallback',
      models: {
        stt: 'Browser Web SpeechRecognition (Client Fallback)',
        tts: 'Browser Web SpeechSynthesis (Client Fallback)'
      },
      latencyMs: null,
      lastSuccessTime: lastSuccessTime,
      reason: 'Upstream speech host is not in the approved allowlist.'
    });
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    // Test genuine synthesis capability on Gnani API rather than simple homepage ping
    const probeRes = await fetch('https://api.vachana.ai/api/v1/tts/inference', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key-ID': apiKey,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        text: 'ఆయుస్వర్',
        voice: 'Nalini',
        model: 'timbre-v2.5',
        language: 'te-IN',
        speed: 1.0,
        audio_config: { sample_rate: 16000, num_channels: 1, sample_width: 2, encoding: 'linear_pcm', container: 'wav' }
      }),
      signal: controller.signal
    }).catch(err => {
      return { ok: false, status: 503, error: err.message };
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (probeRes && (probeRes.status === 200 || probeRes.ok)) {
      lastSuccessTime = new Date().toISOString();
      logSafeApiAccess({ route, method: req.method, status: 200, durationMs: latencyMs, clientNote: 'Live inference probe verified' });
      return res.status(200).json({
        available: true,
        status: 'LIVE',
        provider: 'gnani',
        verifiedCapability: 'SYNTHESIS_AND_KEY_AUTHENTICATED',
        models: {
          stt: 'Gnani Prisma v3 STT',
          tts: 'Gnani Timbre v2.5 / v3.0'
        },
        latencyMs,
        lastSuccessTime
      });
    } else {
      const status = probeRes?.status || 500;
      logSafeApiAccess({ route, method: req.method, status: 200, durationMs: latencyMs, clientNote: `Upstream HTTP ${status}` });
      return res.status(200).json({
        available: false,
        status: 'UNAVAILABLE',
        provider: 'browser_fallback',
        models: {
          stt: 'Browser Web SpeechRecognition (Client Fallback)',
          tts: 'Browser Web SpeechSynthesis (Client Fallback)'
        },
        latencyMs,
        lastSuccessTime,
        reason: status === 401 || status === 403
          ? 'Invalid or unauthorized GNANI_API_KEY. Using safe browser speech fallback.'
          : `Gnani speech service returned HTTP ${status}. Using safe browser speech fallback.`
      });
    }
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    logSafeApiAccess({ route, method: req.method, status: 200, durationMs: latencyMs, clientNote: 'Gnani status check error' });
    return res.status(200).json({
      available: false,
      status: 'UNAVAILABLE',
      provider: 'browser_fallback',
      models: {
        stt: 'Browser Web SpeechRecognition (Client Fallback)',
        tts: 'Browser Web SpeechSynthesis (Client Fallback)'
      },
      latencyMs: null,
      lastSuccessTime: lastSuccessTime,
      reason: err.name === 'AbortError' ? 'Gnani probe timed out (>6s)' : 'Speech service probe error'
    });
  }
}
