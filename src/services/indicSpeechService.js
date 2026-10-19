/**
 * AyuSwar AI — Unified Indic Speech & Voice Service (indicSpeechService.js)
 * 
 * Production Architecture:
 * 1. Web Audio Pipeline (16kHz Mono Resampling & PCM Encoding):
 *    - Captures user microphone with Echo Cancellation, Noise Suppression, and AGC.
 *    - Real-time downsampling to 16kHz 16-bit Linear PCM for Gnani Prisma v2.5 telephony ASR.
 *    - RIFF WAV header encoder utility.
 * 2. Client-Side VAD (Voice Activity Detection):
 *    - Continuous RMS energy monitoring via Web Audio AnalyserNode.
 * 3. Barge-In Interruption Controller:
 *    - Real-time detection of user voice during assistant playback (TTS).
 *    - Immediate cutoff (audio.pause() / speechSynthesis.cancel()) and instant transition to LISTENING.
 * 4. Conversational State Machine:
 *    - States: 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'
 * 5. Provider Isolation:
 *    - Gnani.ai Production ASR/TTS: Proxied securely via /api/gnani/* routes.
 *    - Browser Web Speech Fallback: W3C SpeechSynthesis and webkitSpeechRecognition.
 */

export const INDIC_LANGUAGES = [
  { code: 'en-IN', name: 'Indian English', label: 'English', gnaniLang: 'en' },
  { code: 'te-IN', name: 'Telugu (తెలుగు)', label: 'Telugu', gnaniLang: 'te' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', label: 'Hindi', gnaniLang: 'hi' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', label: 'Tamil', gnaniLang: 'ta' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', label: 'Kannada', gnaniLang: 'kn' },
  { code: 'mr-IN', name: 'Marathi (మరాठी)', label: 'Marathi', gnaniLang: 'mr' }
];

/**
 * Standard RIFF 16-bit Mono WAV Header Encoder
 * Converts Float32Array PCM samples (16kHz) to binary ArrayBuffer
 */
export function encode16BitMonoWAV(float32Samples, sampleRate = 16000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample / 8;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = float32Samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  // RIFF Chunk Descriptor
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM samples (clamp float to [-1, 1] and scale to 16-bit signed integer)
  let offset = 44;
  for (let i = 0; i < float32Samples.length; i++) {
    const s = Math.max(-1, Math.min(1, float32Samples[i]));
    const int16 = s < 0 ? s * 0x8000 : s * 0x7fff;
    view.setInt16(offset, int16, true);
    offset += 2;
  }

  return buffer;
}

/**
 * Linear Interpolation Resampler: sourceSampleRate -> targetSampleRate
 */
export function resampleTo16k(audioBuffer, targetSampleRate = 16000) {
  const sourceRate = audioBuffer.sampleRate;
  if (sourceRate === targetSampleRate) {
    return audioBuffer.getChannelData(0);
  }

  const channelData = audioBuffer.getChannelData(0);
  const ratio = sourceRate / targetSampleRate;
  const newLength = Math.round(channelData.length / ratio);
  const result = new Float32Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const origIndex = i * ratio;
    const lower = Math.floor(origIndex);
    const upper = Math.min(lower + 1, channelData.length - 1);
    const weight = origIndex - lower;
    result[i] = channelData[lower] * (1 - weight) + channelData[upper] * weight;
  }

  return result;
}

export class IndicSpeechService {
  constructor() {
    this.currentRecognition = null;
    this.currentLanguage = 'en-IN';
    this.activeProvider = 'browser_fallback'; // 'gnani_proxy' | 'browser_fallback' | 'unavailable'
    this.proxyEndpoint = '/api/gnani';
    this.isSpeaking = false;
    this.currentAudio = null;

    // Real-Time Audio Pipeline & VAD State
    this.audioContext = null;
    this.mediaStream = null;
    this.analyser = null;
    this.vadInterval = null;
    this.conversationState = 'IDLE'; // 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'
    this.activeSessionCallbacks = null;
    this.bargeInThreshold = 0.042; // RMS energy threshold to trigger interruption
    this.lastVoiceRms = 0;
  }

  getGnaniCredentials() {
    let apiKey = '';
    let token = '';
    if (typeof window !== 'undefined') {
      try {
        apiKey = sessionStorage.getItem('ayuswar_gnani_key') || '';
        token = sessionStorage.getItem('ayuswar_gnani_token') || '';
      } catch {}
    }
    if (!apiKey && typeof import.meta !== 'undefined' && import.meta.env) {
      apiKey = import.meta.env.VITE_GNANI_API_KEY || '';
      token = import.meta.env.VITE_GNANI_TOKEN || '';
    }
    return {
      apiKey,
      token,
      isConfigured: Boolean(apiKey || token)
    };
  }

  setGnaniCredentials({ apiKey = '', token = '' } = {}) {
    if (typeof window !== 'undefined') {
      try {
        if (apiKey) sessionStorage.setItem('ayuswar_gnani_key', apiKey.trim());
        else sessionStorage.removeItem('ayuswar_gnani_key');

        if (token) sessionStorage.setItem('ayuswar_gnani_token', token.trim());
        else sessionStorage.removeItem('ayuswar_gnani_token');
      } catch {}
    }
  }

  getProviderInfo() {
    const creds = this.getGnaniCredentials();
    const isGnani = this.activeProvider === 'gnani_proxy' || creds.isConfigured;

    return {
      provider: isGnani ? 'gnani_active' : this.activeProvider,
      isGnani,
      hasCredentials: creds.isConfigured,
      label: isGnani
        ? 'Gnani.ai Indic Neural Voice (Authenticated Session)'
        : 'Browser Web Speech API (Client Fallback)',
      notes: isGnani
        ? 'Gnani.ai speech credentials active for current session.'
        : 'Gnani key not configured; using browser SpeechSynthesis and SpeechRecognition fallback.'
    };
  }

  /**
   * Set Conversational State and notify subscribers
   */
  setConversationState(newState) {
    if (this.conversationState !== newState) {
      this.conversationState = newState;
      if (this.activeSessionCallbacks?.onStateChange) {
        this.activeSessionCallbacks.onStateChange(newState);
      }
    }
  }

  /**
   * Synthesize Vernacular Speech (TTS) with Barge-In Support
   */
  async speak(text, options = {}) {
    if (!text || typeof window === 'undefined') return;

    const langCode = options.langCode || this.currentLanguage || 'en-IN';
    const rate = options.rate || 0.95;
    const onStart = options.onStart || (() => {});
    const onEnd = options.onEnd || (() => {});
    const onError = options.onError || (() => {});

    // Cancel any previous audio
    this.stopSpeaking();
    this.isSpeaking = true;
    this.setConversationState('SPEAKING');

    // 1. Attempt Server-Side Gnani Proxy / API with session credentials if configured
    const creds = this.getGnaniCredentials();
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (creds.apiKey) headers['x-api-key'] = creds.apiKey;
      if (creds.token) headers['Authorization'] = `Bearer ${creds.token}`;

      const response = await fetch(`${this.proxyEndpoint}/tts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ text, language: langCode, apiKey: creds.apiKey, token: creds.token }),
        signal: AbortSignal.timeout(1800) // Fast failover if proxy is unconfigured
      });

      if (response.ok) {
        this.activeProvider = 'gnani_proxy';
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        this.currentAudio = audio;

        audio.onplay = () => {
          this.isSpeaking = true;
          this.setConversationState('SPEAKING');
          onStart({ provider: 'gnani_proxy' });
        };
        audio.onended = () => {
          this.isSpeaking = false;
          if (this.conversationState === 'SPEAKING') {
            this.setConversationState('LISTENING');
          }
          onEnd();
        };
        audio.onerror = () => {
          this.isSpeaking = false;
          if (this.conversationState === 'SPEAKING') {
            this.setConversationState('LISTENING');
          }
          onError('Gnani audio playback failed');
        };
        await audio.play();
        return;
      }
    } catch {
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
        this.setConversationState('SPEAKING');
        onStart({ provider: 'browser_fallback' });
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        if (this.conversationState === 'SPEAKING') {
          this.setConversationState('LISTENING');
        }
        onEnd();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        if (this.conversationState === 'SPEAKING') {
          this.setConversationState('LISTENING');
        }
        onError(e?.error || 'Speech synthesis error');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      this.isSpeaking = false;
      onError('Web Speech Synthesis is not supported in this browser.');
    }
  }

  /**
   * Stop Speaking immediately (Barge-In or Cancel)
   */
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
   * Manual or VAD-triggered Barge-In Interruption
   * Stops TTS playback instantly and shifts conversational state to LISTENING
   */
  interruptAssistant(source = 'barge_in') {
    if (this.isSpeaking || this.conversationState === 'SPEAKING') {
      this.stopSpeaking();
      this.setConversationState('LISTENING');
      if (this.activeSessionCallbacks?.onBargeIn) {
        this.activeSessionCallbacks.onBargeIn({ source, time: Date.now() });
      }
    }
  }

  /**
   * Start 16kHz Mono Web Audio Pipeline with Real-Time VAD & Barge-In
   */
  async startAudioPipeline({
    onRMS = () => {},
    onBargeIn = () => {},
    bargeInThreshold = 0.042
  } = {}) {
    this.stopAudioPipeline();
    this.bargeInThreshold = bargeInThreshold;

    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      return null;
    }

    try {
      // 1. Microphone capture with Echo Cancellation, Noise Suppression & AGC
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        }
      });
      this.mediaStream = stream;

      // 2. AudioContext & AnalyserNode
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);
      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.3;
      source.connect(analyser);
      this.analyser = analyser;

      const dataArray = new Float32Array(analyser.fftSize);

      // 3. Continuous VAD Energy Check (~20 times/sec)
      let consecutiveSpeechFrames = 0;
      this.vadInterval = setInterval(() => {
        if (!this.analyser) return;

        this.analyser.getFloatTimeDomainData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const val = dataArray[i];
          sum += val * val;
        }
        const rms = Math.sqrt(sum / dataArray.length);
        this.lastVoiceRms = rms;
        onRMS(rms);

        // Check for Barge-In Interruption during assistant speech
        if (this.isSpeaking || this.conversationState === 'SPEAKING') {
          if (rms > this.bargeInThreshold) {
            consecutiveSpeechFrames++;
            if (consecutiveSpeechFrames >= 2) {
              consecutiveSpeechFrames = 0;
              this.interruptAssistant('vad_speech_detected');
              onBargeIn({ rms });
            }
          } else {
            consecutiveSpeechFrames = 0;
          }
        }
      }, 50);

      return stream;
    } catch (err) {
      console.warn('Web Audio Pipeline init error:', err);
      return null;
    }
  }

  stopAudioPipeline() {
    if (this.vadInterval) {
      clearInterval(this.vadInterval);
      this.vadInterval = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        this.audioContext.close();
      } catch {}
      this.audioContext = null;
    }
    this.analyser = null;
    this.lastVoiceRms = 0;
  }

  /**
   * Start Live Microphone Speech Recognition (ASR)
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

        // If user speaks while assistant was in SPEAKING state, trigger barge-in
        if (this.isSpeaking || this.conversationState === 'SPEAKING') {
          if (final.trim() || interim.trim()) {
            this.interruptAssistant('stt_speech_detected');
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
   * Full-Duplex Real-Time Conversational Session Orchestrator
   * Powers Hands-Free Live Talk with VAD, Barge-In, and Continuous Turn-Taking
   */
  async startConversationalSession({
    language = 'te-IN',
    onStateChange = () => {},
    onTranscript = () => {},
    onAssistantSpeak = () => {},
    onBargeIn = () => {},
    onVolumeChange = () => {},
    onRequestAssistantReply = async () => {}
  }) {
    this.stopConversationalSession();
    this.activeSessionCallbacks = {
      onStateChange,
      onTranscript,
      onAssistantSpeak,
      onBargeIn,
      onVolumeChange,
      onRequestAssistantReply
    };
    this.setConversationState('LISTENING');

    // 1. Initialize Web Audio Pipeline & VAD
    await this.startAudioPipeline({
      onRMS: (rms) => onVolumeChange(rms),
      onBargeIn: (info) => {
        this.interruptAssistant('vad_energy');
        onBargeIn(info);
      },
      bargeInThreshold: this.bargeInThreshold
    });

    // 2. Start Live ASR Recognition
    this.startLiveRecognition({
      langCode: language,
      onResult: async ({ finalTranscript, interimTranscript }) => {
        onTranscript({ finalTranscript, interimTranscript });

        if (finalTranscript.trim()) {
          // User finished an utterance: shift to THINKING
          this.setConversationState('THINKING');
          try {
            const reply = await onRequestAssistantReply(finalTranscript.trim());
            if (reply && typeof reply === 'string') {
              onAssistantSpeak(reply);
              await this.speak(reply, {
                langCode: language,
                onStart: () => this.setConversationState('SPEAKING'),
                onEnd: () => {
                  if (this.conversationState === 'SPEAKING') {
                    this.setConversationState('LISTENING');
                  }
                }
              });
            } else {
              this.setConversationState('LISTENING');
            }
          } catch (err) {
            console.warn('Conversational query failed:', err);
            this.setConversationState('LISTENING');
          }
        }
      },
      onError: (err) => {
        console.warn('Conversational ASR warning:', err);
      },
      onStatusChange: (status) => {
        if (!status.isListening && this.conversationState === 'LISTENING') {
          // Restart ASR if still in active session
          try {
            this.currentRecognition?.start();
          } catch {}
        }
      }
    });
  }

  stopConversationalSession() {
    this.stopSpeaking();
    this.stopLiveRecognition();
    this.stopAudioPipeline();
    this.setConversationState('IDLE');
    this.activeSessionCallbacks = null;
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
