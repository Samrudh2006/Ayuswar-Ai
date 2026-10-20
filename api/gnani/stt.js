/**
 * AyuSwar AI — Gnani Prisma Indic STT / ASR Proxy
 * POST /api/gnani/stt
 * 
 * Secure server-side gateway to Gnani Prisma v2.5 / v3.0 Indic STT API.
 * Follows official Gnani (api.vachana.ai) specification:
 * - Endpoint: POST https://api.vachana.ai/stt/v3
 * - Headers: X-API-Key-ID: <GNANI_API_KEY>
 * - Form Data: audio_file (binary), language_code (BCP-47 e.g. te-IN)
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    }
  }
};

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

  const sttEndpoint = process.env.GNANI_STT_ENDPOINT || process.env.GNANI_ASR_ENDPOINT || 'https://api.vachana.ai/stt/v3';

  try {
    let audioBuffer = null;
    let languageCode = 'te-IN';

    // Handle JSON payload ({ audioBase64, language_code }) or raw body
    if (req.headers['content-type']?.includes('application/json')) {
      const { audioBase64, language_code } = req.body || {};
      if (!audioBase64) {
        return res.status(400).json({ error: 'Missing audioBase64 payload in request body' });
      }
      audioBuffer = Buffer.from(audioBase64, 'base64');
      if (language_code) languageCode = language_code;
    } else if (Buffer.isBuffer(req.body)) {
      audioBuffer = req.body;
      languageCode = req.headers['x-language-code'] || 'te-IN';
    } else if (typeof req.body === 'string') {
      audioBuffer = Buffer.from(req.body, 'base64');
      languageCode = req.headers['x-language-code'] || 'te-IN';
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({ error: 'No audio data received for transcription' });
    }

    // Size limit check (max 10MB)
    if (audioBuffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: 'Audio file exceeds 10MB limit' });
    }

    // Build standard multipart form data as required by Gnani v3 STT
    const formData = new FormData();
    const audioBlob = new Blob([audioBuffer], { type: 'audio/wav' });
    formData.append('audio_file', audioBlob, 'audio.wav');
    formData.append('language_code', languageCode);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const upstreamRes = await fetch(sttEndpoint, {
      method: 'POST',
      headers: {
        'X-API-Key-ID': apiKey,
        'x-api-key': apiKey
      },
      body: formData,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (upstreamRes.ok) {
      const data = await upstreamRes.json();
      const transcript = data.transcript || data.text || data.transcription || (data.result && data.result[0]?.transcript) || '';

      return res.status(200).json({
        transcript: transcript.trim(),
        languageCode,
        provider: 'gnani_stt',
        model: 'Gnani Prisma v3',
        raw: data
      });
    } else {
      let errText = await upstreamRes.text().catch(() => '');
      if (apiKey && errText.includes(apiKey)) errText = errText.replaceAll(apiKey, '[REDACTED]');
      return res.status(upstreamRes.status).json({
        error: `Gnani STT returned HTTP ${upstreamRes.status}`,
        details: errText.slice(0, 160),
        fallbackRequired: true
      });
    }
  } catch (err) {
    return res.status(502).json({
      error: err.name === 'AbortError' ? 'Gnani STT upstream request timed out' : 'STT gateway connection error',
      fallbackRequired: true
    });
  }
}
