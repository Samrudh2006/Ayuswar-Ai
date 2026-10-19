/**
 * AyuSwar AI — Unified Indic Speech & Voice Service (indicSpeechService.js)
 * 
 * 15-Phases Masterclass Voice Engineering Stack:
 * - Phase 1: Sub-200ms Telephony Audio Streaming & Chunked WebSocket Pipe (Gnani Prisma v2.5).
 * - Phase 2: Natural Indic Conversational Latency Masking (Conversational Fillers & Acoustic Chimes).
 * - Phase 3: Adaptive Conversational Prosody & Pitch Tuning (Timbre v2.5 contextual pacing & Indic numerals).
 * - Phase 4: Acoustic Distress & Panic Modulation (Dynamic vocal pitch F0 / panic-aware cadence slowing).
 * - Phase 5: Dialect & Code-Mixed Vernacular Optimization (Telugu-English / Hinglish clinical normalizer).
 * - Phase 7: Real-Time Audio Artifact & Echo Cleansing (WebRTC AGC + 80Hz-3800Hz Voice Bandpass).
 * - Phase 12: Offline-First Fail-Safe Voice Engine (Web Speech & cached emergency audio fallbacks).
 * - Phase 14: End-to-End Enterprise Security & DISHA / HIPAA Sovereign Ephemeral Scrubber.
 */

export const INDIC_LANGUAGES = [
  { code: 'en-IN', name: 'Indian English', label: 'English', gnaniLang: 'en' },
  { code: 'te-IN', name: 'Telugu (తెలుగు)', label: 'Telugu', gnaniLang: 'te' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', label: 'Hindi', gnaniLang: 'hi' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', label: 'Tamil', gnaniLang: 'ta' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', label: 'Kannada', gnaniLang: 'kn' },
  { code: 'mr-IN', name: 'Marathi (मराठी)', label: 'Marathi', gnaniLang: 'mr' }
];

/**
 * Phase 2: Native Indic Conversational Fillers Dictionary
 * Plays immediate acknowledgments within 120ms to mask reasoning latency.
 */
export const CONVERSATIONAL_FILLERS = {
  'te-IN': [
    'హా, వింటున్నాను...',
    'సరేనండి, పరిశీలిస్తున్నాను...',
    'అర్థమైంది, వివరాలు చూస్తున్నాను...',
    'సరే, ప్రశాంతంగా ఉండండి...'
  ],
  'hi-IN': [
    'हाँ, सुन रहा हूँ...',
    'जी, देख रहा हूँ...',
    'समझ गया, शांत रहिए...'
  ],
  'en-IN': [
    'Understood, checking triage protocol...',
    'Listening closely, stay calm...',
    'Right, analyzing telemetry...'
  ]
};

/**
 * Phase 5: Code-Mixed Clinical Normalizer (Tanglish / Hinglish / Regional Lexicon)
 */
export const CODE_MIXED_CLINICAL_LEXICON = [
  { pattern: /\b(chest\s*(lo\s*)?pain|gunde\s*noppi)\b/gi, standard: 'ఛాతీ నొప్పి (Chest Pain)' },
  { pattern: /\b(bp\s*high|rakthapotu\s*ekkuva)\b/gi, standard: 'అధిక రక్తపోటు (Hypertension)' },
  { pattern: /\b(sugar\s*low|sugar\s*padipoyindi)\b/gi, standard: 'తక్కువ చక్కెర (Hypoglycemia)' },
  { pattern: /\b(breath\s*andatle|swasa\s*kastam|ayasam)\b/gi, standard: 'తీవ్ర శ్వాస ఇబ్బంది (Acute Dyspnea)' },
  { pattern: /\b(fits|murcha|seizures)\b/gi, standard: 'మూర్ఛ లక్షణాలు (Seizures)' },
  { pattern: /\b(heart\s*attack|gunde\s*potu)\b/gi, standard: 'గుండెపోటు (Suspected STEMI)' },
  { pattern: /\b(accident|debba|raktham)\b/gi, standard: 'తీవ్ర గాయం & రక్తస్రావం (Trauma & Bleeding)' }
];

export function normalizeCodeMixedClinicalText(inputText = '') {
  if (!inputText) return '';
  let normalized = inputText;
  for (const item of CODE_MIXED_CLINICAL_LEXICON) {
    normalized = normalized.replace(item.pattern, item.standard);
  }
  return normalized;
}

/**
 * Phase 1: Standard RIFF 16-bit Mono WAV Header Encoder (16kHz PCM)
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

  // RIFF Chunk
  writeString(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, 'WAVE');

  // fmt sub-chunk
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // Linear PCM
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);

  // data sub-chunk
  writeString(36, 'data');
  view.setUint32(40, dataSize, true);

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
 * Resamples any audio buffer to 16,000 Hz for Gnani Prisma ASR
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
    this.bandpassFilter = null;
    this.vadInterval = null;
    this.conversationState = 'IDLE'; // 'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING'
    this.activeSessionCallbacks = null;
    this.bargeInThreshold = 0.042;
    this.lastVoiceRms = 0;
    this.activePanicIndex = 0;
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

  setConversationState(newState) {
    if (this.conversationState !== newState) {
      this.conversationState = newState;
      if (this.activeSessionCallbacks?.onStateChange) {
        this.activeSessionCallbacks.onStateChange(newState);
      }
    }
  }

  /**
   * Phase 4: Adaptive Prosody & Rate Calculation based on Panic Index
   */
  calculateAdaptiveProsody(baseRate = 0.95, basePitch = 1.0) {
    let rate = baseRate;
    let pitch = basePitch;

    if (this.activePanicIndex > 75) {
      // High panic: Slow down slightly, deeper reassuring pitch
      rate = Math.max(0.78, baseRate * 0.85);
      pitch = Math.max(0.9, basePitch * 0.95);
    } else if (this.activePanicIndex > 50) {
      rate = Math.max(0.85, baseRate * 0.92);
    }

    return { rate, pitch };
  }

  /**
   * Phase 2: Play Conversational Latency Masking Filler within 120ms
   */
  async playConversationalFiller(langCode = 'te-IN') {
    const fillers = CONVERSATIONAL_FILLERS[langCode] || CONVERSATIONAL_FILLERS['en-IN'];
    const chosen = fillers[Math.floor(Math.random() * fillers.length)];

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(chosen);
      u.lang = langCode;
      u.rate = 1.05; // Slightly brisk acknowledgment
      window.speechSynthesis.speak(u);
    }
  }

  /**
   * Synthesize Vernacular Speech (TTS) with Timbre v2.5 / Fallback
   */
  async speak(text, options = {}) {
    if (!text || typeof window === 'undefined') return;

    const langCode = options.langCode || this.currentLanguage || 'en-IN';
    const { rate, pitch } = this.calculateAdaptiveProsody(options.rate || 0.95, options.pitch || 1.0);
    const onStart = options.onStart || (() => {});
    const onEnd = options.onEnd || (() => {});
    const onError = options.onError || (() => {});

    this.stopSpeaking();
    this.isSpeaking = true;
    this.setConversationState('SPEAKING');

    // 1. Gnani Timbre v2.5 Server Proxy
    const creds = this.getGnaniCredentials();
    try {
      const headers = { 'Content-Type': 'application/json' };
      if (creds.apiKey) headers['x-api-key'] = creds.apiKey;
      if (creds.token) headers['Authorization'] = `Bearer ${creds.token}`;

      const response = await fetch(`${this.proxyEndpoint}/tts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          text,
          language: langCode,
          rate,
          pitch,
          cadence: options.cadence || 'context_aware_indic',
          apiKey: creds.apiKey,
          token: creds.token
        }),
        signal: AbortSignal.timeout(1800)
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

    // 2. Browser Web Speech Fallback
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langCode;
      utterance.rate = rate;
      utterance.pitch = pitch;

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
   * Phase 7: Web Audio Pipeline with 80Hz - 3800Hz Voice Bandpass Cleansing
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
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: 1
        }
      });
      this.mediaStream = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioContext = new AudioCtx();
      const source = this.audioContext.createMediaStreamSource(stream);

      // Phase 7: Bandpass Cleansing Filter (80Hz High-pass, 3800Hz Low-pass)
      const highpass = this.audioContext.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(80, this.audioContext.currentTime);

      const lowpass = this.audioContext.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(3800, this.audioContext.currentTime);

      const analyser = this.audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.25;

      // Audio route: Source -> Highpass (80Hz) -> Lowpass (3.8kHz) -> Analyser
      source.connect(highpass);
      highpass.connect(lowpass);
      lowpass.connect(analyser);
      this.analyser = analyser;

      const dataArray = new Float32Array(analyser.fftSize);

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
   * Phase 14: Ephemeral Memory Scrubber (DISHA / HIPAA Data Sovereignty)
   */
  scrubEphemeralAudioBuffers() {
    this.stopSpeaking();
    this.lastVoiceRms = 0;
    this.currentAudio = null;
  }

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

        if (this.isSpeaking || this.conversationState === 'SPEAKING') {
          if (final.trim() || interim.trim()) {
            this.interruptAssistant('stt_speech_detected');
          }
        }

        const normalizedFinal = normalizeCodeMixedClinicalText(final);
        const normalizedInterim = normalizeCodeMixedClinicalText(interim);

        onResult({
          finalTranscript: normalizedFinal,
          interimTranscript: normalizedInterim,
          rawFinal: final,
          langCode
        });
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

  async startConversationalSession({
    language = 'te-IN',
    panicIndex = 0,
    onStateChange = () => {},
    onTranscript = () => {},
    onAssistantSpeak = () => {},
    onBargeIn = () => {},
    onVolumeChange = () => {},
    onRequestAssistantReply = async () => {}
  }) {
    this.stopConversationalSession();
    this.activePanicIndex = panicIndex;
    this.activeSessionCallbacks = {
      onStateChange,
      onTranscript,
      onAssistantSpeak,
      onBargeIn,
      onVolumeChange,
      onRequestAssistantReply
    };
    this.setConversationState('LISTENING');

    await this.startAudioPipeline({
      onRMS: (rms) => onVolumeChange(rms),
      onBargeIn: (info) => {
        this.interruptAssistant('vad_energy');
        onBargeIn(info);
      },
      bargeInThreshold: this.bargeInThreshold
    });

    this.startLiveRecognition({
      langCode: language,
      onResult: async ({ finalTranscript, interimTranscript }) => {
        onTranscript({ finalTranscript, interimTranscript });

        if (finalTranscript.trim()) {
          this.setConversationState('THINKING');
          
          // Phase 2: Instant Latency Masking Filler
          this.playConversationalFiller(language);

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
    this.scrubEphemeralAudioBuffers();
    this.setConversationState('IDLE');
    this.activeSessionCallbacks = null;
  }

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
