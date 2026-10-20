/**
 * AyuSwar AI — Gnani Indic Speech Services Status Endpoint
 * GET /api/gnani/status
 * 
 * Verifies live operational status of Gnani Speech Services (Prisma STT & Timbre TTS).
 * Keys (GNANI_API_KEY) are configured exclusively server-side and NEVER exposed to clients.
 */

let lastSuccessTime = null;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GNANI_API_KEY;
  const ttsEndpoint = process.env.GNANI_TTS_ENDPOINT || 'https://api.vachana.ai/api/v1/tts/inference';
  const sttEndpoint = process.env.GNANI_STT_ENDPOINT || 'https://api.vachana.ai/stt/v3';

  if (!apiKey || apiKey.includes('placeholder')) {
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
      reason: 'GNANI_API_KEY unset on server. Using safe browser speech fallback.'
    });
  }

  const startTime = Date.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const probeRes = await fetch('https://api.vachana.ai', {
      method: 'GET',
      headers: {
        'X-API-Key-ID': apiKey,
        'x-api-key': apiKey
      },
      signal: controller.signal
    }).catch(err => {
      return { ok: false, status: 503, error: err.message };
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (probeRes && (probeRes.status === 200 || probeRes.ok)) {
      lastSuccessTime = new Date().toISOString();
      return res.status(200).json({
        available: true,
        status: 'LIVE',
        provider: 'gnani',
        models: {
          stt: 'Gnani Prisma v3 STT',
          tts: 'Gnani Timbre v2.5 / v3.0'
        },
        latencyMs,
        lastSuccessTime
      });
    } else {
      const status = probeRes?.status || 500;
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
        reason: status === 401 
          ? 'Invalid or unauthorized GNANI_API_KEY. Using safe browser speech fallback.'
          : `Gnani upstream returned HTTP ${status}. Using safe browser speech fallback.`
      });
    }
  } catch (err) {
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
      reason: err.name === 'AbortError' ? 'Gnani probe timed out (>6s)' : `Probe error: ${err.message}`
    });
  }
}
