/**
 * AyuSwar AI — Gnani Evon Sovereign Indic Reasoner Status Endpoint
 * GET /api/evon/status
 * 
 * Verifies live operational connectivity to Gnani Evon.
 * Credentials (EVON_BASE_URL, EVON_API_KEY) come EXCLUSIVELY from server environment variables.
 * Header-supplied keys or base URLs are strictly forbidden.
 */

import { validateUpstreamUrl, checkRateLimit, logSafeApiAccess } from '../_lib/security.js';

let lastSuccessTime = null;

export default async function handler(req, res) {
  const startTime = Date.now();
  const route = '/api/evon/status';

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

  const baseUrl = process.env.EVON_BASE_URL || 'https://router.huggingface.co/v1';
  const apiKey = process.env.EVON_API_KEY;
  const modelName = process.env.EVON_MODEL_NAME || 'gnani/gnani-evon-v3.3-30B-A3B';

  if (!baseUrl || !apiKey || apiKey.includes('placeholder')) {
    logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime, clientNote: 'Secrets unset' });
    return res.status(200).json({
      status: 'UNAVAILABLE',
      available: false,
      model: modelName,
      latencyMs: null,
      lastSuccessTime: lastSuccessTime,
      reason: 'EVON_BASE_URL or EVON_API_KEY unset on server'
    });
  }

  // Validate upstream URL against allowlist
  const urlCheck = validateUpstreamUrl(baseUrl);
  if (!urlCheck.valid) {
    logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime, clientNote: 'Invalid upstream host' });
    return res.status(200).json({
      status: 'UNAVAILABLE',
      available: false,
      model: modelName,
      latencyMs: null,
      lastSuccessTime: lastSuccessTime,
      reason: 'Upstream host is not in the approved allowlist.'
    });
  }

  try {
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const endpoint = `${cleanBaseUrl}/chat/completions`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

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
      logSafeApiAccess({ route, method: req.method, status: 200, durationMs: latencyMs, clientNote: 'Live ping verified' });
      return res.status(200).json({
        status: 'LIVE',
        available: true,
        model: modelName,
        latencyMs,
        lastSuccessTime
      });
    } else {
      logSafeApiAccess({ route, method: req.method, status: 200, durationMs: latencyMs, clientNote: `Upstream HTTP ${upstreamRes.status}` });
      return res.status(200).json({
        status: 'UNAVAILABLE',
        available: false,
        model: modelName,
        latencyMs,
        lastSuccessTime,
        reason: `Upstream returned HTTP ${upstreamRes.status}`
      });
    }
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    logSafeApiAccess({ route, method: req.method, status: 200, durationMs: latencyMs, clientNote: 'Status check error' });
    return res.status(200).json({
      status: 'UNAVAILABLE',
      available: false,
      model: modelName,
      latencyMs,
      lastSuccessTime,
      reason: err.name === 'AbortError' ? 'Evon status check timed out (>8s)' : 'Unable to connect to upstream service'
    });
  }
}
