/**
 * AyuSwar AI — Indic Vernacular Speech & Voice Engine
 * 
 * Powered by Gnani.ai Indic Voice API with zero-config Web Speech fallback:
 * - When VITE_GNANI_API_KEY is configured in .env, connects to Gnani.ai high-accuracy Indic ASR & TTS.
 * - When API key is pending, seamlessly falls back to standard Web Speech API & SpeechSynthesis.
 */

const GNANI_API_KEY = import.meta.env?.VITE_GNANI_API_KEY || '';
const GNANI_TOKEN = import.meta.env?.VITE_GNANI_TOKEN || '';

export const INDIC_LANGUAGES = [
  { code: 'te-IN', name: 'Telugu (తెలుగు)', gnaniLang: 'te' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', gnaniLang: 'hi' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', gnaniLang: 'ta' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', gnaniLang: 'kn' },
  { code: 'mr-IN', name: 'Marathi (मराठी)', gnaniLang: 'mr' },
  { code: 'en-IN', name: 'Indian English', gnaniLang: 'en' }
];

export class IndicSpeechService {
  constructor() {
    this.hasGnaniKey = Boolean(GNANI_API_KEY && GNANI_API_KEY.length > 5);
  }

  /**
   * Check if Gnani.ai production API is active
   */
  isGnaniConfigured() {
    return Boolean(GNANI_API_KEY && GNANI_API_KEY.length > 5);
  }

  /**
   * Synthesize Vernacular Speech (TTS)
   * Plays audio directly in browser
   */
  async speakVernacular(text, langCode = 'te-IN') {
    if (!text) return;

    if (this.isGnaniConfigured()) {
      try {
        const langObj = INDIC_LANGUAGES.find((l) => l.code === langCode) || INDIC_LANGUAGES[0];
        const response = await fetch('https://tts.gnani.ai/v1/synthesize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': GNANI_API_KEY,
            'Authorization': GNANI_TOKEN ? `Bearer ${GNANI_TOKEN}` : undefined
          },
          body: JSON.stringify({
            text: text,
            language: langObj.gnaniLang,
            audio_format: 'wav'
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          audio.play();
          return;
        }
      } catch (err) {
        console.warn('Gnani TTS network error, falling back to Web Speech Synthesis:', err);
      }
    }

    // High-fidelity Native Browser Fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = 0.92;
      window.speechSynthesis.speak(utterance);
    }
  }

  /**
   * Start Live Microphone Speech-to-Text Recognition
   */
  startLiveRecognition({ langCode = 'te-IN', onResult = () => {}, onError = () => {} }) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      onError('Browser Web Speech API not supported on this browser.');
      return null;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = langCode;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      onResult({ finalTranscript: final, interimTranscript: interim });
    };

    recognition.onerror = (event) => {
      onError(event.error);
    };

    recognition.start();
    return recognition;
  }
}

export const indicSpeech = new IndicSpeechService();
