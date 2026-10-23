/**
 * AyuSwar AI — Gnani Evon Sovereign Indic Reasoner Chat Completions Proxy
 * POST /api/evon/chat
 * 
 * Secure Serverless Gateway:
 * - Credentials (EVON_BASE_URL, EVON_API_KEY) come EXCLUSIVELY from server environment variables.
 *   Header-supplied keys and custom upstream base URLs are strictly forbidden.
 * - Upstream host is strictly validated against an approved security allowlist.
 * - Safe rate limiting (best-effort in-memory burst protection per instance).
 * - Zero-leak audit logging: Never logs request bodies, transcripts, or patient text.
 * - Non-diagnostic guardrail: Enforces emergency 112/108 routing and forbids autonomous drug dosing.
 */

import { validateUpstreamUrl, checkRateLimit, logSafeApiAccess, sanitizeClientError } from '../_lib/security.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '100kb'
    }
  }
};

export default async function handler(req, res) {
  const startTime = Date.now();
  const route = '/api/evon/chat';

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

  // 3. Rate limiting (Best-effort in-memory serverless burst control)
  const rateLimitResult = checkRateLimit(req, 25);
  if (!rateLimitResult.allowed) {
    res.setHeader('Retry-After', String(rateLimitResult.retryAfterSec));
    logSafeApiAccess({ route, method: req.method, status: 429, durationMs: Date.now() - startTime, clientNote: 'Rate limited' });
    return res.status(429).json({
      error: 'Too Many Requests. Please pause between queries.',
      retryAfterSec: rateLimitResult.retryAfterSec
    });
  }

  // 4. Server-Side Environment Variables Only (Header keys/URLs strictly removed)
  const baseUrl = process.env.EVON_BASE_URL || 'https://router.huggingface.co/v1';
  const apiKey = process.env.EVON_API_KEY;
  const modelName = process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B';

  // Fail closed if secrets are missing or placeholder
  if (!apiKey || apiKey.includes('placeholder') || !baseUrl) {
    logSafeApiAccess({ route, method: req.method, status: 503, durationMs: Date.now() - startTime, clientNote: 'Unconfigured server secrets' });
    return res.status(503).json({
      error: 'Evon service unavailable: Required server environment credentials are not configured.',
      available: false,
      fallbackRequired: true,
      model: modelName
    });
  }

  // 5. Upstream host validation against strict security allowlist
  const urlValidation = validateUpstreamUrl(baseUrl);
  if (!urlValidation.valid) {
    logSafeApiAccess({ route, method: req.method, status: 500, durationMs: Date.now() - startTime, clientNote: 'Invalid upstream host' });
    return res.status(500).json({
      error: 'Server security configuration error: Upstream host is not in the approved allowlist.',
      available: false,
      fallbackRequired: true
    });
  }

  // 6. Request Body Validation
  const { prompt, systemInstruction, messages, maxTokens = 450, temperature = 0.2 } = req.body || {};

  if (!prompt && (!Array.isArray(messages) || messages.length === 0)) {
    logSafeApiAccess({ route, method: req.method, status: 400, durationMs: Date.now() - startTime });
    return res.status(400).json({ error: 'Invalid input: Missing required prompt or messages array.' });
  }

  // Bound maxTokens and temperature to safe ranges
  const safeTokens = Math.min(Math.max(1, parseInt(maxTokens, 10) || 450), 1024);
  const safeTemp = Math.min(Math.max(0.0, parseFloat(temperature) || 0.2), 1.0);

  let chatMessages = [];
  if (Array.isArray(messages) && messages.length > 0) {
    // Sanitize and bound messages length
    chatMessages = messages.slice(-10).map(m => ({
      role: (m.role === 'system' || m.role === 'assistant') ? m.role : 'user',
      content: String(m.content || '').slice(0, 4000)
    }));
  } else {
    if (systemInstruction) {
      chatMessages.push({ role: 'system', content: String(systemInstruction).slice(0, 2000) });
    }
    chatMessages.push({ role: 'user', content: String(prompt || '').slice(0, 4000) });
  }

  try {
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const endpoint = `${cleanBaseUrl}/chat/completions`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 18000);

    const upstreamRes = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: modelName,
        messages: chatMessages,
        max_tokens: safeTokens,
        temperature: safeTemp
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!upstreamRes.ok) {
      logSafeApiAccess({ route, method: req.method, status: upstreamRes.status, durationMs: Date.now() - startTime, clientNote: `Upstream error ${upstreamRes.status}` });
      return res.status(502).json({
        error: `Upstream Evon reasoner returned HTTP ${upstreamRes.status}. Falling back to rule-based safety guidance.`,
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
      replyText = '';
    }

    logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime });
    return res.status(200).json({
      success: true,
      text: replyText,
      model: modelName,
      usage: data.usage || null
    });
  } catch (err) {
    const isTimeout = err.name === 'AbortError';
    logSafeApiAccess({ route, method: req.method, status: 504, durationMs: Date.now() - startTime, clientNote: isTimeout ? 'Timeout' : 'Upstream fetch failure' });
    return res.status(504).json({
      error: isTimeout ? 'Evon reasoning call timed out (>18s).' : sanitizeClientError(err),
      available: false,
      fallbackRequired: true
    });
  }
}
