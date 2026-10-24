/**
 * AyuSwar Audio Experience Engine
 * Subtle, high-fidelity micro-interaction tactile audio feedback.
 * 
 * Synthesized using W3C Web Audio API (zero audio assets, 0ms latency).
 * Carefully calibrated to be soft, gentle, and non-intrusive (peak gain <= 0.045).
 */

let sharedAudioCtx = null;
let masterGainNode = null;
let isMuted = false;
let lastSoundTimestamp = 0;
const THROTTLE_MS = 30; // Prevents overlapping flutter on rapid pointer clicks

// Check user preferences in localStorage
try {
  const savedMute = localStorage.getItem('ayuswar_sound_muted');
  if (savedMute !== null) {
    isMuted = savedMute === 'true';
  }
} catch {
  isMuted = false;
}

/**
 * Get or initialize the shared AudioContext
 */
export function getSoundAudioContext() {
  if (typeof window === 'undefined') return null;
  
  if (!sharedAudioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    
    try {
      sharedAudioCtx = new AudioContextClass();
      masterGainNode = sharedAudioCtx.createGain();
      // Calibrated soft volume: -27dB equivalent (0.042)
      masterGainNode.gain.setValueAtTime(0.042, sharedAudioCtx.currentTime);
      masterGainNode.connect(sharedAudioCtx.destination);
    } catch {
      return null;
    }
  }

  // Auto-resume if browser suspended the audio context
  if (sharedAudioCtx.state === 'suspended') {
    sharedAudioCtx.resume().catch(() => {});
  }

  return sharedAudioCtx;
}

/**
 * Check if sound effects are muted
 */
export function isSoundMuted() {
  return isMuted;
}

/**
 * Set sound effects muted state
 */
export function setSoundMuted(mute) {
  isMuted = Boolean(mute);
  try {
    localStorage.setItem('ayuswar_sound_muted', String(isMuted));
  } catch {}
}

/**
 * Toggle sound effects mute state
 */
export function toggleSoundMute() {
  setSoundMuted(!isMuted);
  return isMuted;
}

/**
 * Set master volume level (0.0 to 0.1 max for subtle feedback)
 */
export function setSoundVolume(volume) {
  if (!sharedAudioCtx || !masterGainNode) return;
  const clamped = Math.max(0, Math.min(0.08, volume));
  masterGainNode.gain.setTargetAtTime(clamped, sharedAudioCtx.currentTime, 0.02);
}

/**
 * Primary sound playback engine for micro-interactions
 * 
 * Variants:
 *  - 'tap' / 'default': Warm tactile physical tap (subtle 820Hz -> 340Hz drop in 20ms)
 *  - 'tab': Soft crystalline switch tone for navbar/navigation tabs (1150Hz -> 680Hz in 26ms)
 *  - 'action': Smooth dual-harmonic chime for modal openers and primary actions (784Hz + 1175Hz)
 *  - 'toggle-on': Crisp tactile upward pop for switches/checkboxes (480Hz -> 760Hz in 18ms)
 *  - 'toggle-off': Crisp tactile downward pop (640Hz -> 380Hz in 18ms)
 *  - 'close': Soft low wooden tap for back/close buttons (520Hz -> 240Hz in 22ms)
 *  - 'emergency': Soft dual alert chime for Sanjivani 108 emergency actions (880Hz + 1046Hz)
 */
export function playClickSound(options = {}) {
  if (isMuted) return;

  const now = performance.now();
  if (now - lastSoundTimestamp < THROTTLE_MS) return;
  lastSoundTimestamp = now;

  const variant = typeof options === 'string' ? options : (options.variant || 'default');
  const volumeScale = typeof options === 'object' && options.volume ? options.volume : 1.0;

  try {
    const ctx = getSoundAudioContext();
    if (!ctx || !masterGainNode) return;

    const t = ctx.currentTime;

    // Common audio signal path: Oscillator -> LowPass Filter -> Gain Envelope -> Master Gain
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Warm organic low-pass filtering removes digital harshness
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, t);
    filter.Q.setValueAtTime(0.7, t);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(masterGainNode);

    switch (variant) {
      case 'tab': {
        // Soft crystalline navigation tab switch
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1150, t);
        osc.frequency.exponentialRampToValueAtTime(680, t + 0.026);

        const peakGain = 0.034 * volumeScale;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(peakGain, t + 0.002);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.028);

        osc.start(t);
        osc.stop(t + 0.03);
        break;
      }

      case 'action': {
        // Rich dual-harmonic gentle chime for key actions / modal popups
        osc.type = 'sine';
        osc.frequency.setValueAtTime(784, t); // G5
        osc.frequency.exponentialRampToValueAtTime(659, t + 0.045); // E5

        const peakGain = 0.038 * volumeScale;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(peakGain, t + 0.003);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.048);

        osc.start(t);
        osc.stop(t + 0.05);

        // Secondary subtle harmonic overtone
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'triangle';
          osc2.frequency.setValueAtTime(1175, t); // D6
          gain2.gain.setValueAtTime(0.0001, t);
          gain2.gain.linearRampToValueAtTime(0.016 * volumeScale, t + 0.004);
          gain2.gain.exponentialRampToValueAtTime(0.0001, t + 0.042);
          osc2.connect(filter);
          gain2.connect(masterGainNode);
          osc2.start(t);
          osc2.stop(t + 0.045);
        } catch {}
        break;
      }

      case 'toggle-on': {
        // Soft ascending tick for switches
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520, t);
        osc.frequency.exponentialRampToValueAtTime(840, t + 0.02);

        const peakGain = 0.032 * volumeScale;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(peakGain, t + 0.002);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

        osc.start(t);
        osc.stop(t + 0.025);
        break;
      }

      case 'toggle-off': {
        // Soft descending tick for switches
        osc.type = 'sine';
        osc.frequency.setValueAtTime(760, t);
        osc.frequency.exponentialRampToValueAtTime(420, t + 0.02);

        const peakGain = 0.028 * volumeScale;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(peakGain, t + 0.002);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

        osc.start(t);
        osc.stop(t + 0.025);
        break;
      }

      case 'close': {
        // Gentle warm down-tap for dismiss/close
        osc.type = 'triangle';
        filter.frequency.setValueAtTime(1800, t);
        osc.frequency.setValueAtTime(480, t);
        osc.frequency.exponentialRampToValueAtTime(240, t + 0.022);

        const peakGain = 0.030 * volumeScale;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(peakGain, t + 0.002);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.024);

        osc.start(t);
        osc.stop(t + 0.026);
        break;
      }

      case 'emergency': {
        // Crisp dual alert for emergency 108 controls (audible, clear, but soft & not harsh)
        osc.type = 'triangle';
        filter.frequency.setValueAtTime(3200, t);
        osc.frequency.setValueAtTime(880, t);
        osc.frequency.setValueAtTime(1046, t + 0.016);

        const peakGain = 0.045 * volumeScale;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(peakGain, t + 0.002);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

        osc.start(t);
        osc.stop(t + 0.042);
        break;
      }

      case 'default':
      case 'tap':
      default: {
        // Standard high-end tactile tap (ceramic/glass haptic feel)
        // Gentle downward pitch glide (840Hz -> 340Hz in 19ms)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(840, t);
        osc.frequency.exponentialRampToValueAtTime(340, t + 0.019);

        const peakGain = 0.038 * volumeScale;
        gainNode.gain.setValueAtTime(0.0001, t);
        gainNode.gain.linearRampToValueAtTime(peakGain, t + 0.0015);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, t + 0.021);

        osc.start(t);
        osc.stop(t + 0.023);
        break;
      }
    }
  } catch {
    // Fail gracefully without interrupting UI flow
  }
}

/** Convenience wrapper functions */
export const playSoftClick = () => playClickSound({ variant: 'tap' });
export const playTabSound = () => playClickSound({ variant: 'tab' });
export const playActionSound = () => playClickSound({ variant: 'action' });
export const playToggleSound = (checked) => playClickSound({ variant: checked ? 'toggle-on' : 'toggle-off' });
export const playCloseSound = () => playClickSound({ variant: 'close' });
export const playEmergencySound = () => playClickSound({ variant: 'emergency' });

/**
 * Universal Global Pointer-Down Audio Listener
 * 
 * Attaches to window/document and provides instant, tactile audio feedback
 * on every clickable element (buttons, links, navigation tabs, cards, toggles).
 * Zero latency on pointerdown (fires immediately when the finger or mouse touches).
 */
export function initGlobalClickSounds() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return () => {};

  const handlePointerDown = (event) => {
    // Only respond to primary mouse button or touch
    if (event.button !== undefined && event.button !== 0) return;

    const target = event.target;
    if (!target || !(target instanceof Element)) return;

    // Check for explicit no-sound attribute or disabled element
    const noSoundEl = target.closest('[data-no-sound="true"], [disabled], [aria-disabled="true"]');
    if (noSoundEl) return;

    // Find interactive container
    const interactiveEl = target.closest(
      'button, a, [role="button"], [role="tab"], input[type="button"], input[type="submit"], input[type="checkbox"], [role="switch"], .clickable, [data-clickable="true"]'
    );

    if (!interactiveEl) return;

    // 1. Emergency buttons (Sanjivani 108 / SOS)
    if (
      interactiveEl.hasAttribute('data-emergency') ||
      interactiveEl.classList.contains('emergency-btn') ||
      (interactiveEl.textContent && (interactiveEl.textContent.includes('108') || interactiveEl.textContent.includes('Emergency') || interactiveEl.textContent.includes('Sanjivani')))
    ) {
      playClickSound({ variant: 'emergency' });
      return;
    }

    // 2. Close / Dismiss buttons
    if (
      interactiveEl.getAttribute('aria-label') === 'Close' ||
      interactiveEl.classList.contains('modal-close') ||
      interactiveEl.querySelector('.lucide-x')
    ) {
      playClickSound({ variant: 'close' });
      return;
    }

    // 3. Navigation links & tabs
    if (
      interactiveEl.tagName.toLowerCase() === 'a' ||
      interactiveEl.getAttribute('role') === 'tab' ||
      interactiveEl.closest('nav') ||
      interactiveEl.classList.contains('tab-btn') ||
      interactiveEl.classList.contains('nav-link')
    ) {
      playClickSound({ variant: 'tab' });
      return;
    }

    // 4. Toggle switches & checkboxes
    if (
      interactiveEl.tagName.toLowerCase() === 'input' &&
      interactiveEl.getAttribute('type') === 'checkbox'
    ) {
      playClickSound({ variant: interactiveEl.checked ? 'toggle-off' : 'toggle-on' });
      return;
    }

    // 5. Action / Launch buttons
    if (
      interactiveEl.classList.contains('btn-primary') ||
      interactiveEl.classList.contains('action-btn')
    ) {
      playClickSound({ variant: 'action' });
      return;
    }

    // 6. Default tactile tap for all other buttons & interactive cards
    playClickSound({ variant: 'tap' });
  };

  // Use capture phase on pointerdown for fastest physical response before default click handlers
  window.addEventListener('pointerdown', handlePointerDown, { capture: true, passive: true });

  return () => {
    window.removeEventListener('pointerdown', handlePointerDown, { capture: true });
  };
}
