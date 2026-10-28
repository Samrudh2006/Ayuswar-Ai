/**
 * AyuSwar AI — Patient Health Information (PHI) Pre-Prompt Sentinel Hook
 * scripts/privacy_prompt_hook.js
 * 
 * Demonstrates Antigravity's new message-aware hook capability:
 * Inspects `user_message` before the agent processes it to catch accidental
 * leaks of Indian patient identifiers (Aadhaar, Phone Numbers, ABHA IDs).
 */

export function sanitizeUserMessage(userMessage) {
  if (!userMessage || typeof userMessage !== 'string') return userMessage;

  // 1. Indian Aadhaar Format (12 digits, spaced or hyphenated: 0000 0000 0000)
  const aadhaarRegex = /\b\d{4}[\s\-]\d{4}[\s\-]\d{4}\b/g;

  // 2. Indian Phone Number (+91 or 10-digit mobile starting with 6,7,8,9)
  const phoneRegex = /(?:\+91[\s\-]?)?[6-9]\d{9}\b/g;

  // 3. Indian ABHA ID (14 digits)
  const abhaRegex = /\b\d{2}-\d{4}-\d{4}-\d{4}\b/g;

  let sanitized = userMessage;
  let matchesFound = 0;

  if (aadhaarRegex.test(sanitized)) {
    sanitized = sanitized.replace(aadhaarRegex, '[REDACTED-AADHAAR]');
    matchesFound++;
  }

  if (phoneRegex.test(sanitized)) {
    sanitized = sanitized.replace(phoneRegex, '[REDACTED-PHONE]');
    matchesFound++;
  }

  if (abhaRegex.test(sanitized)) {
    sanitized = sanitized.replace(abhaRegex, '[REDACTED-ABHA-ID]');
    matchesFound++;
  }

  return {
    isClean: matchesFound === 0,
    matchesFound,
    sanitizedMessage: sanitized
  };
}

// Self-test
const testSample = "Patient Lakshmi with Aadhaar 9842 1204 8831 and phone +919876543210 reported shortness of breath.";
const result = sanitizeUserMessage(testSample);
console.log("Original Prompt:", testSample);
console.log("Sanitized Prompt:", result.sanitizedMessage);
console.log("Redactions Applied:", result.matchesFound);
