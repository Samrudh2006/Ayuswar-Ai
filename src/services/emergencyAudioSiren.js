/**
 * AyuSwar AI — Sanjivani-108 Audio Siren Synthesizer
 * 
 * Generates authentic two-tone and wailing emergency vehicle sirens
 * directly using the browser's Web Audio API with zero external audio assets.
 */

class EmergencySirenSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.oscillator = null;
    this.gainNode = null;
    this.lfo = null;
    this.lfoGain = null;
    this.isPlaying = false;
    this.volume = 0.15; // Safe, pleasant default volume
  }

  init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
  }

  start(mode = 'wail') {
    this.init();
    if (!this.audioCtx) return;

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    if (this.isPlaying) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    // Main carrier oscillator
    this.oscillator = ctx.createOscillator();
    this.oscillator.type = 'sawtooth';

    // Master gain
    this.gainNode = ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.001, now);
    this.gainNode.gain.exponentialRampToValueAtTime(this.volume, now + 0.1);

    // Lowpass filter to mellow harsh high frequencies
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1600, now);

    if (mode === 'two-tone') {
      // European/Indian two-tone (Hi-Lo: 960Hz and 770Hz)
      this.oscillator.frequency.setValueAtTime(960, now);
      
      this.lfo = ctx.createOscillator();
      this.lfo.type = 'square';
      this.lfo.frequency.setValueAtTime(1.6, now); // switches every ~0.6 sec

      this.lfoGain = ctx.createGain();
      this.lfoGain.gain.setValueAtTime(95, now);

      this.lfo.connect(this.oscillator.frequency);
      this.lfo.start(now);
    } else {
      // Smooth emergency wail siren (650Hz to 1050Hz sinusoidal modulation)
      this.oscillator.frequency.setValueAtTime(850, now);

      this.lfo = ctx.createOscillator();
      this.lfo.type = 'sine';
      this.lfo.frequency.setValueAtTime(0.85, now); // ~1.1 second cycle

      this.lfoGain = ctx.createGain();
      this.lfoGain.gain.setValueAtTime(200, now);

      this.lfo.connect(this.oscillator.frequency);
      this.lfo.start(now);
    }

    this.oscillator.connect(filter);
    filter.connect(this.gainNode);
    this.gainNode.connect(ctx.destination);

    this.oscillator.start(now);
    this.isPlaying = true;
  }

  stop() {
    if (!this.isPlaying || !this.audioCtx) return;
    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
    }

    setTimeout(() => {
      try {
        if (this.oscillator) {
          this.oscillator.stop();
          this.oscillator.disconnect();
          this.oscillator = null;
        }
        if (this.lfo) {
          this.lfo.stop();
          this.lfo.disconnect();
          this.lfo = null;
        }
      } catch (e) {
        // Safe disposal
      }
      this.isPlaying = false;
    }, 180);
  }

  setVolume(newVol) {
    this.volume = Math.max(0.01, Math.min(1.0, newVol));
    if (this.gainNode && this.audioCtx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.audioCtx.currentTime, 0.05);
    }
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start('wail');
      return true;
    }
  }
}

export const emergencySiren = new EmergencySirenSynthesizer();
