/**
 * clinicalTelemetry.js — AyuSwar AI Observability & Audio Auto-Recovery Sentinel
 * 
 * Provides:
 * 1. Global Audio Mutex: Ensures only one active speech/audio player is audible at any moment.
 * 2. AudioContext Auto-Recovery: Transparently wakes up suspended or closed Web Audio contexts
 *    upon user interaction without throw/crash.
 * 3. Clinical Telemetry Logger: Captures microphone permission issues, acoustic anomalies,
 *    and frontend exceptions with offline persistence.
 * 4. DPDP Act 2023 Invariant: Zero audio samples, biometric voiceprints, or PII ever logged.
 */

// Global Audio Mutex Controller
class GlobalAudioMutex {
  constructor() {
    this.activePlayer = null;
    this.activeAudioElement = null;
  }

  acquire(playerIdentifier, stopCallback) {
    if (this.activePlayer && this.activePlayer !== playerIdentifier) {
      if (typeof this.stopCallback === 'function') {
        try {
          this.stopCallback();
        } catch (e) {
          console.warn('[AudioMutex] Error stopping previous player:', e);
        }
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
    }
    this.activePlayer = playerIdentifier;
    this.stopCallback = stopCallback;
  }

  release(playerIdentifier) {
    if (this.activePlayer === playerIdentifier) {
      this.activePlayer = null;
      this.stopCallback = null;
    }
  }

  stopAll() {
    if (typeof this.stopCallback === 'function') {
      try { this.stopCallback(); } catch {}
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try { window.speechSynthesis.cancel(); } catch {}
    }
    this.activePlayer = null;
    this.stopCallback = null;
  }
}

export const audioMutex = new GlobalAudioMutex();

/**
 * Resilient AudioContext Auto-Recovery
 * Resumes suspended or corrupted Web Audio contexts safely.
 */
export const recoverAudioContext = async (audioCtx) => {
  if (!audioCtx) return null;

  try {
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume();
    }
    if (audioCtx.state === 'closed') {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      return new AudioContextClass({ latencyHint: 'interactive', sampleRate: 16000 });
    }
    return audioCtx;
  } catch (err) {
    clinicalTelemetry.logEvent('AUDIO_CONTEXT_RECOVERY_FAILED', { error: err.message });
    return audioCtx;
  }
};

/**
 * Clinical Telemetry & Error Logger
 */
const TELEMETRY_STORAGE_KEY = 'ayuswar_telemetry_events_v1';
const MAX_LOCAL_EVENTS = 50;

class ClinicalTelemetryService {
  constructor() {
    this.memoryBuffer = [];
  }

  logEvent(eventName, payload = {}) {
    const event = {
      event: eventName,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      online: typeof navigator !== 'undefined' ? navigator.onLine : true,
      data: payload
    };

    // Keep recent events in memory
    this.memoryBuffer.push(event);
    if (this.memoryBuffer.length > MAX_LOCAL_EVENTS) {
      this.memoryBuffer.shift();
    }

    // Persist to localStorage for diagnostic support
    try {
      if (typeof localStorage !== 'undefined') {
        const raw = localStorage.getItem(TELEMETRY_STORAGE_KEY);
        const existing = raw ? JSON.parse(raw) : [];
        existing.push(event);
        if (existing.length > MAX_LOCAL_EVENTS) existing.shift();
        localStorage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(existing));
      }
    } catch {}

    // Dispatch custom event for UI banners or debugging
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ayuswar:telemetry_event', { detail: event }));
    }
  }

  logMicError(error) {
    this.logEvent('MICROPHONE_CAPTURE_ERROR', {
      name: error?.name || 'UnknownError',
      message: error?.message || 'Failed to acquire user audio stream'
    });
  }

  getRecentEvents() {
    return [...this.memoryBuffer];
  }

  clear() {
    this.memoryBuffer = [];
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(TELEMETRY_STORAGE_KEY);
      }
    } catch {}
  }
}

export const clinicalTelemetry = new ClinicalTelemetryService();

