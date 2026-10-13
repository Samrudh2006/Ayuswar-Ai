/**
 * AyuSwar AI — Unified Indic Speech & Voice Service (indicSpeechService.js)
 * 
 * Architecture:
 * 1. Provider Isolation:
 *    - Gnani.ai Production ASR/TTS: Requires an authorized server-side backend proxy
 *      to protect API keys. Direct client-side VITE_* key bundling is prohibited for security.
 *    - Browser Web Speech Fallback: Standard W3C SpeechSynthesis and webkitSpeechRecognition.
 *    - Explicit Provider Labeling: UI clearly reports whether audio is processed via
 *      Gnani Server Proxy, Browser Fallback, or is Unavailable.
 * 2. Shared Language Synchronization:
 *    - Respects global language selection ('en-IN', 'te-IN', 'hi-IN', etc.).
 *    - Safely stops and restarts live ASR recognition when language changes.
 */

export const INDIC_LANGUAGES = [
  { code: 'en-IN', name: 'Indian English', label: 'English', gnaniLang: 'en' },
  { code: 'te-IN', name: 'Telugu (తెలుగు)', label: 'Telugu', gnaniLang: 'te' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', label: 'Hindi', gnaniLang: 'hi' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', label: 'Tamil', gnaniLang: 'ta' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', label: 'Kannada', gnaniLang: 'kn' },
  { code: 'mr-IN', name: 'Marathi (मराठी)', label: 'Marathi', gnaniLang: 'mr' }
];

export class IndicSpeechService {
  constructor() {
    this.currentRecognition = null;
    this.currentLanguage = 'en-IN';
    this.activeProvider = 'browser_fallback'; // 'gnani_proxy' | 'browser_fallback' | 'unavailable'
    this.proxyEndpoint = '/api/gnani';
    this.isSpeaking = false;
  }

  getProviderInfo() {
    return {
      provider: this.activeProvider,
      isGnani: this.activeProvider === 'gnani_proxy',
      label: this.activeProvider === 'gnani_proxy'
        ? 'Gnani.ai Indic Neural Voice (Server Proxy)'
        : 'Browser Web Speech API (Client Fallback)',
      notes: this.activeProvider === 'gnani_proxy'
        ? 'Connected to server-side Gnani speech proxy.'
        : 'Server Gnani proxy not active in this client bundle; using browser SpeechSynthesis and SpeechRecognition.'
    };
  }

  /**
   * Synthesize Vernacular Speech (TTS)
   * Honest fallback: uses browser speechSynthesis with clear callback notifications.
   */
  async speak(text, options = {}) {
    if (!text || typeof window === 'undefined') return;

    const langCode = options.langCode || this.currentLanguage || 'en-IN';
    const rate = options.rate || 0.95;
    const onStart = options.onStart || (() => {});
    const onEnd = options.onEnd || (() => {});
    const onError = options.onError || (() => {});

    // Cancel any ongoing audio
    this.stopSpeaking();

    // 1. Attempt Server-Side Gnani Proxy if configured
    try {
      const response = await fetch(`${this.proxyEndpoint}/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, language: langCode }),
        signal: AbortSignal.timeout(1500) // Fast failover if proxy is not running
      });

      if (response.ok) {
        this.activeProvider = 'gnani_proxy';
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;
        
        audio.onplay = () => {
          this.isSpeaking = true;
          onStart({ provider: 'gnani_proxy' });
        };
        audio.onended = () => {
          this.isSpeaking = false;
          onEnd();
        };
        audio.onerror = (e) => {
          this.isSpeaking = false;
          onError('Gnani audio playback failed');
        };
        await audio.play();
        return;
      }
    } catch {
      // Server proxy not active — fallback to standard browser TTS
      this.activeProvider = 'browser_fallback';
    }

    // 2. Standard Web Speech Synthesis Fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = rate;

      utterance.onstart = () => {
        this.isSpeaking = true;
        onStart({ provider: 'browser_fallback' });
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        onEnd();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        onError(e?.error || 'Speech synthesis error');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      onError('Web Speech Synthesis is not supported in this browser.');
    }
  }

  stopSpeaking() {
    this.isSpeaking = false;
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
      } catch {}
      this.currentAudio = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Start Live Microphone Speech Recognition (ASR)
   * Safely captures audio via browser SpeechRecognition with honest provider attribution.
   */
  startLiveRecognition({
    langCode = 'en-IN',
    onResult = () => {},
    onError = () => {},
    onStatusChange = () => {}
  }) {
    this.stopLiveRecognition();

    const SpeechRecognition = typeof window !== 'undefined'
      ? (window.SpeechRecognition || window.webkitSpeechRecognition)
      : null;

    if (!SpeechRecognition) {
      onError('Browser SpeechRecognition API is not supported in this browser. Please use Chrome, Edge, or a compatible browser.');
      return null;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = langCode;
      this.currentLanguage = langCode;

      recognition.onstart = () => {
        onStatusChange({ isListening: true, langCode, provider: 'browser_fallback' });
      };

      recognition.onresult = (event) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            final += transcript;
          } else {
            interim += transcript;
          }
        }
        onResult({ finalTranscript: final, interimTranscript: interim, langCode });
      };

      recognition.onerror = (event) => {
        let userMessage = event.error;
        if (event.error === 'not-allowed') {
          userMessage = 'Microphone permission denied. Please grant microphone access in browser settings.';
        } else if (event.error === 'no-speech') {
          userMessage = 'No speech detected. Please speak into your microphone.';
        } else if (event.error === 'network') {
          userMessage = 'Speech recognition network error. Please check your internet connection.';
        }
        onError(userMessage);
      };

      recognition.onend = () => {
        onStatusChange({ isListening: false, langCode });
      };

      recognition.start();
      this.currentRecognition = recognition;
      return recognition;
    } catch (err) {
      onError(`Failed to start recognition: ${err.message}`);
      return null;
    }
  }

  stopLiveRecognition() {
    if (this.currentRecognition) {
      try {
        this.currentRecognition.stop();
      } catch {}
      this.currentRecognition = null;
    }
  }

  /**
   * Safely update recognition language
   */
  updateLanguage(newLangCode, callbacks = {}) {
    this.currentLanguage = newLangCode;
    if (this.currentRecognition) {
      this.stopLiveRecognition();
      return this.startLiveRecognition({
        langCode: newLangCode,
        ...callbacks
      });
    }
    return null;
  }
}

export const speechService = new IndicSpeechService();
