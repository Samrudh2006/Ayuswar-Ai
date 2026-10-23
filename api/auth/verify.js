/**
 * AyuSwar AI — Server-Side Token Verification Endpoint
 * POST /api/auth/verify
 * 
 * Verifies Supabase Bearer tokens server-side using server-only environment variables.
 * Keys (SUPABASE_SERVICE_ROLE_KEY) are NEVER bundled or exposed to frontend clients.
 */

import { checkRateLimit, logSafeApiAccess, sanitizeClientError } from '../_lib/security.js';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10kb'
    }
  }
};

export default async function handler(req, res) {
  const startTime = Date.now();
  const route = '/api/auth/verify';

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    logSafeApiAccess({ route, method: req.method, status: 405, durationMs: Date.now() - startTime });
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Rate limiting (60 checks / min)
  const rateLimit = checkRateLimit(req, 60);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', String(rateLimit.retryAfterSec));
    logSafeApiAccess({ route, method: req.method, status: 429, durationMs: Date.now() - startTime });
    return res.status(429).json({ error: 'Rate limit exceeded for token verification.' });
  }

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    logSafeApiAccess({ route, method: req.method, status: 401, durationMs: Date.now() - startTime, clientNote: 'Missing token' });
    return res.status(401).json({ authenticated: false, error: 'Missing authorization bearer token.' });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const apiKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !apiKey || apiKey.includes('placeholder')) {
    // Graceful unconfigured state
    logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime, clientNote: 'Supabase unconfigured' });
    return res.status(200).json({
      authenticated: false,
      configured: false,
      message: 'Supabase server credentials unset. Running in prototype safeguard mode.'
    });
  }

  try {
    const response = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': apiKey
      }
    });

    if (response.ok) {
      const user = await response.json();
      logSafeApiAccess({ route, method: req.method, status: 200, durationMs: Date.now() - startTime, clientNote: 'Token verified' });
      return res.status(200).json({
        authenticated: true,
        configured: true,
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          role: user.user_metadata?.role || 'patient'
        }
      });
    }

    logSafeApiAccess({ route, method: req.method, status: 401, durationMs: Date.now() - startTime, clientNote: 'Invalid token' });
    return res.status(401).json({
      authenticated: false,
      configured: true,
      error: 'Invalid or expired session token.'
    });
  } catch (err) {
    logSafeApiAccess({ route, method: req.method, status: 500, durationMs: Date.now() - startTime, clientNote: 'Verification error' });
    return res.status(500).json({
      authenticated: false,
      error: sanitizeClientError(err, 'Failed to verify authentication token.')
    });
  }
}
