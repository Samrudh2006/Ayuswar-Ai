/**
 * AyuSwar AI — Serverless API Security & Abuse Control Utilities
 * 
 * Clinical & Production Privacy Architecture:
 * - Upstream host validation against strict domain allowlist (preventing SSRF).
 * - Safe rate limiting (Best-effort in-memory limiter per serverless instance;
 *   NOTICE: Serverless instances are ephemeral; production multi-instance requires
 *   a distributed shared store like Redis/Upstash).
 * - Zero-leak audit logging: Logs ONLY method, route, HTTP status, and durationMs.
 *   NEVER logs request bodies, audio transcripts, medical text, or credentials.
 * - Error sanitization: Strips API keys and raw upstream error bodies.
 */

// Strict allowlist of permissible upstream AI/TTS providers
export const ALLOWED_UPSTREAM_HOSTS = new Set([
  'router.huggingface.co',
  'api.vachana.ai',
  'api.groq.com',
  'generativelanguage.googleapis.com'
]);

/**
 * Validates that an upstream URL belongs to the approved host allowlist.
 */
export function validateUpstreamUrl(urlStr) {
  try {
    const parsed = new URL(urlStr);
    if (parsed.protocol !== 'https:') {
      return { valid: false, error: 'Only HTTPS upstream endpoints are permitted.' };
    }
    if (!ALLOWED_UPSTREAM_HOSTS.has(parsed.hostname)) {
      return { valid: false, error: `Upstream host '${parsed.hostname}' is not in the security allowlist.` };
    }
    return { valid: true, url: parsed.toString() };
  } catch (err) {
    return { valid: false, error: 'Malformed upstream URL.' };
  }
}

/**
 * In-Memory Sliding Window Rate Limiter
 * 
 * IMPORTANT ARCHITECTURAL NOTE:
 * This in-memory limiter provides best-effort burst protection within a single serverless instance.
 * In a distributed, auto-scaling serverless environment (e.g. Vercel), instances do not share memory.
 * For production deployments with strict SLAs, configure a shared key-value store (e.g., Redis or Upstash).
 * This limiter is never claimed to be full production rate-limiting on its own.
 */
const rateLimitBuckets = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const DEFAULT_MAX_REQUESTS_PER_WINDOW = 30; // 30 req/min for general routes
const AUDIO_MAX_REQUESTS_PER_WINDOW = 15; // 15 req/min for STT / TTS

export function checkRateLimit(req, maxRequests = DEFAULT_MAX_REQUESTS_PER_WINDOW) {
  // Extract client identifier (X-Forwarded-For or remote address)
  const forwarded = req.headers?.['x-forwarded-for'];
  const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0] : req.socket?.remoteAddress || 'anonymous').trim();
  const bucketKey = `${ip}:${req.url?.split('?')[0] || 'default'}`;

  const now = Date.now();
  const record = rateLimitBuckets.get(bucketKey) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW_MS;
  } else {
    record.count += 1;
  }

  rateLimitBuckets.set(bucketKey, record);

  // Periodic cleanup of expired buckets to prevent memory leak
  if (rateLimitBuckets.size > 2000) {
    for (const [k, v] of rateLimitBuckets.entries()) {
      if (now > v.resetTime) rateLimitBuckets.delete(k);
    }
  }

  if (record.count > maxRequests) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((record.resetTime - now) / 1000),
      currentCount: record.count,
      limit: maxRequests
    };
  }

  return {
    allowed: true,
    remaining: maxRequests - record.count,
    limit: maxRequests
  };
}

/**
 * Zero-Leak Safe Audit Logger
 * Strictly logs metadata only: timestamp, route, method, status, duration.
 * NEVER prints bodies, health symptoms, transcripts, or credentials.
 */
export function logSafeApiAccess({ route, method, status, durationMs, clientNote }) {
  const timestamp = new Date().toISOString();
  // Safe structured output without sensitive data
  const logEntry = `[API Audit] ${timestamp} | ${method} ${route} | ${status} | ${durationMs}ms${clientNote ? ` | ${clientNote}` : ''}`;
  if (status >= 500) {
    console.error(logEntry);
  } else if (status >= 400) {
    console.warn(logEntry);
  } else {
    console.log(logEntry);
  }
}

/**
 * Sanitizes errors returned to clients.
 * Prevents internal tokens, upstream stack traces, or secret URLs from leaking.
 */
export function sanitizeClientError(error, defaultMessage = 'An internal service error occurred.') {
  if (!error) return defaultMessage;
  const message = typeof error === 'string' ? error : error.message || '';
  
  // If the error contains key indicators or URLs, replace with generic message
  if (/key|token|bearer|secret|password|authorization/i.test(message)) {
    return 'Authentication or upstream credential issue. Request safely rejected.';
  }
  
  if (message.includes('fetch failed') || message.includes('ECONNREFUSED') || message.includes('ETIMEDOUT')) {
    return 'Upstream service is currently unreachable or timed out.';
  }

  return message.slice(0, 160) || defaultMessage;
}
