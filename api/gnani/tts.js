/**
 * AyuSwar AI — Gnani Timbre Indic TTS Proxy
 * POST /api/gnani/tts
 * 
 * Secure server-side gateway to Gnani Timbre v2.5 / v3.0 Indic TTS API.
 * Follows official Gnani (api.vachana.ai) specification:
 * - Endpoint: POST https://api.vachana.ai/api/v1/tts/inference
 * - Headers: X-API-Key-ID: <GNANI_API_KEY>, Content-Type: application/json
 * - Payload: { text, voice, model, language }
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const apiKey = process.env.GNANI_API_KEY;
  if (!apiKey || apiKey.includes('placeholder')) {
    return res.status(503).json({
      error: 'Gnani API key not configured on server',
      available: false,
      fallbackRequired: true
    });
  }

  const { text, language = 'te-IN', voice, model = 'timbre-v2.5' } = req.body || {};

  // Input Validation
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Invalid or missing text string for TTS synthesis' });
  }

  if (text.length > 2000) {
    return res.status(400).json({ error: 'Text exceeds maximum length limit of 2000 characters' });
  }

  const ttsEndpoint = process.env.GNANI_TTS_ENDPOINT || 'https://api.vachana.ai/api/v1/tts/inference';
  const defaultVoice = voice || (language.startsWith('te') ? 'Nalini' : language.startsWith('hi') ? 'Nalini' : 'Nalini');

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
        model: model || 'timbre-v2.5',
        language: language
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (upstreamRes.ok) {
      const audioBuffer = await upstreamRes.arrayBuffer();
      res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'audio/wav');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      return res.status(200).send(Buffer.from(audioBuffer));
    } else {
      let errText = await upstreamRes.text().catch(() => '');
      if (apiKey && errText.includes(apiKey)) errText = errText.replaceAll(apiKey, '[REDACTED]');
      return res.status(upstreamRes.status).json({
        error: `Gnani TTS service returned HTTP ${upstreamRes.status}`,
        details: errText.slice(0, 160),
        fallbackRequired: true
      });
    }
  } catch (err) {
    clearTimeout(timeoutId);
    return res.status(502).json({
      error: err.name === 'AbortError' ? 'Gnani TTS upstream request timed out' : 'TTS gateway connection error',
      fallbackRequired: true
    });
  }
}
