/**
 * AyuSwar AI — Gnani Evon Sovereign Indic Reasoner Status Endpoint
 * GET /api/evon/status
 * 
 * Verifies live connectivity to Gnani Evon via server-side OpenAI-compatible endpoint.
 * Credentials (EVON_BASE_URL, EVON_API_KEY) are NEVER exposed to the frontend client.
 */

let lastSuccessTime = null;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = req.headers['x-evon-base-url'] || process.env.EVON_BASE_URL || 'https://router.huggingface.co/v1';
  const apiKey = req.headers['x-evon-api-key'] || req.headers['x-api-key'] || process.env.EVON_API_KEY;
  const modelName = process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B';

  if (!baseUrl || !apiKey || apiKey.includes('placeholder')) {
    return res.status(200).json({
      status: 'UNAVAILABLE',
      available: false,
      model: modelName,
      latencyMs: null,
      lastSuccessTime: lastSuccessTime,
      reason: 'EVON_BASE_URL or EVON_API_KEY unset on server'
    });
  }

  const startTime = Date.now();
  try {
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const endpoint = `${cleanBaseUrl}/chat/completions`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    // Minimal 1-token health probe to verify OpenAI-compatible completions endpoint
    const upstreamRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: [{ role: 'user', content: 'ping' }],
        max_tokens: 1,
        temperature: 0.1
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    const latencyMs = Date.now() - startTime;

    if (upstreamRes.ok) {
      lastSuccessTime = new Date().toISOString();
      return res.status(200).json({
        status: 'LIVE',
        available: true,
        model: modelName,
        latencyMs,
        lastSuccessTime
      });
    } else {
      const errorText = await upstreamRes.text().catch(() => '');
      return res.status(200).json({
        status: 'UNAVAILABLE',
        available: false,
        model: modelName,
        latencyMs,
        lastSuccessTime,
        reason: `Upstream Evon returned HTTP ${upstreamRes.status}: ${errorText.slice(0, 150)}`
      });
    }
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    return res.status(200).json({
      status: 'UNAVAILABLE',
      available: false,
      model: modelName,
      latencyMs,
      lastSuccessTime,
      reason: err.name === 'AbortError' ? 'Evon status check timed out (>8s)' : `Evon probe error: ${err.message}`
    });
  }
}
