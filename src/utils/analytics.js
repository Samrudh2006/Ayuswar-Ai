/**
 * AyuSwar AI — Client Analytics Helper (PostHog Integration)
 * Free 1,000,000 events/month tier.
 * Safe no-op if unconfigured or running offline.
 */

export function trackEvent(eventName, properties = {}) {
  try {
    if (typeof window !== 'undefined' && window.posthog && typeof window.posthog.capture === 'function') {
      window.posthog.capture(eventName, {
        timestamp: new Date().toISOString(),
        ...properties
      });
    }
  } catch (err) {
    // Non-blocking fallback
  }
}

export function identifyUser(distinctId, userProperties = {}) {
  try {
    if (typeof window !== 'undefined' && window.posthog && typeof window.posthog.identify === 'function') {
      window.posthog.identify(distinctId, userProperties);
    }
  } catch (err) {
    // Non-blocking fallback
  }
}
