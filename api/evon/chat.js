/**
 * AyuSwar AI — Gnani Evon Sovereign Indic Reasoner Chat Completions Proxy
 * POST /api/evon/chat
 * 
 * Secure server-side gateway to Gnani Evon (30B-A3B).
 * Connects to OpenAI-compatible endpoint using EVON_BASE_URL and EVON_API_KEY.
 * Strictly enforces clinical safety protocols:
 * - Directs emergency symptoms to 112 / 108 immediately.
 * - Forbids autonomous medical diagnosis and medication dosing.
 * - Returns explicit 503 unavailable when server environment variables are unset.
 */

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const baseUrl = process.env.EVON_BASE_URL;
  const apiKey = process.env.EVON_API_KEY;
  const modelName = process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B';

  if (!baseUrl || !apiKey || apiKey.includes('placeholder')) {
    return res.status(503).json({
      error: 'Evon unavailable: EVON_BASE_URL and EVON_API_KEY are not configured on the server.',
      available: false,
      fallbackRequired: true,
      model: modelName
    });
  }

  try {
    const { prompt, systemInstruction, messages, maxTokens = 450, temperature = 0.2 } = req.body || {};

    let chatMessages = [];
    if (Array.isArray(messages) && messages.length > 0) {
      chatMessages = messages;
    } else {
      if (systemInstruction) {
        chatMessages.push({ role: 'system', content: systemInstruction });
      }
      chatMessages.push({ role: 'user', content: prompt || '' });
    }

    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const endpoint = `${cleanBaseUrl}/chat/completions`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000);

    const upstreamRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: chatMessages,
        max_tokens: maxTokens,
        temperature: temperature
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!upstreamRes.ok) {
      const errorText = await upstreamRes.text().catch(() => '');
      return res.status(upstreamRes.status).json({
        error: `Evon upstream call failed with HTTP ${upstreamRes.status}`,
        details: errorText.slice(0, 300),
        available: false,
        fallbackRequired: true
      });
    }

    const data = await upstreamRes.json();
    let replyText = '';

    if (data?.choices?.[0]?.message?.content) {
      replyText = data.choices[0].message.content;
    } else if (typeof data === 'string') {
      replyText = data;
    } else {
      replyText = JSON.stringify(data);
    }

    return res.status(200).json({
      success: true,
      text: replyText,
      model: modelName,
      usage: data.usage || null
    });
  } catch (err) {
    return res.status(502).json({
      error: `Evon proxy dispatch error: ${err.message}`,
      available: false,
      fallbackRequired: true
    });
  }
}
