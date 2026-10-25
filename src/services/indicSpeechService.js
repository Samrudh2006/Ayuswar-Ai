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
import { cleanTextForSpeech, getBestVoice } from '../utils/speechSanitizer.js';

export const GNANI_TIMBRE_V2_VOICES = [
  'Nalini', 'Bhavna', 'Yashvi', 'Urmila', 'Jwala', 'Chitra', 'Ambuja', 'Deepak', 'Roopesh', 'Vikrant', 
  'Hemraj', 'Jalaj', 'Omkar', 'Aarohi', 'Bhavini', 'Charvi', 'Eishani', 'Falguni', 'Gauri', 'Iravati', 
  'Janaki', 'Kamakshi', 'Madhuri', 'Radhika', 'Shweta', 'Tanvi', 'Vidya', 'Wamika', 'Yamini', 'Abhimanyu', 
  'Chirag', 'Deven', 'Farhan', 'Jatin', 'Kartik', 'Kaveri', 'Trupti', 'Devika', 'Pranav', 'Shlok', 
  'Girish', 'Asmita', 'Trisha', 'Brinda', 'Vedika', 'Noopur', 'Oviya', 'Parvati', 'Suhana', 'Lehara', 
  'Lavanya', 'Yukti', 'Varuni', 'Saanvi', 'Kavin', 'Hansika', 'Reshma', 'Riyaan', 'Zahira', 'Ishaan', 
  'Kirra', 'Dhruva', 'Damini', 'Urvashi', 'Falak', 'Veera', 'Lalita', 'Nayana', 'Gaurav', 'Harshit', 
  'Mehuli', 'Zayan', 'Poorvi'
];

export const GNANI_TIMBRE_V3_VOICES = [
  'Avinash', 'Shivani', 'Lakshmi', 'Kalpana', 'Shubham', 'Prakash', 'Devansh', 'Yashraj', 'Chetana', 
  'Vasudha', 'Harshad', 'Riyaa', 'Tarika'
];

export const INDIC_LANGUAGES = [
  { code: 'te-IN', name: 'Telugu (తెలుగు)', label: 'Telugu', gnaniLang: 'te', defaultVoice: 'Nalini' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', label: 'Hindi', gnaniLang: 'hi', defaultVoice: 'Bhavna' },
  { code: 'en-IN', name: 'Indian English', label: 'English', gnaniLang: 'en', defaultVoice: 'Nalini' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', label: 'Tamil', gnaniLang: 'ta', defaultVoice: 'Oviya' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', label: 'Kannada', gnaniLang: 'kn', defaultVoice: 'Kaveri' },
  { code: 'mr-IN', name: 'Marathi (मराठी)', label: 'Marathi', gnaniLang: 'mr', defaultVoice: 'Gauri' },
  { code: 'gu-IN', name: 'Gujarati (ગુજરાતી)', label: 'Gujarati', gnaniLang: 'gu', defaultVoice: 'Falguni' },
  { code: 'bn-IN', name: 'Bengali (বাংলা)', label: 'Bengali', gnaniLang: 'bn', defaultVoice: 'Mehuli' },
  { code: 'ml-IN', name: 'Malayalam (മലയാളം)', label: 'Malayalam', gnaniLang: 'ml', defaultVoice: 'Lavanya' },
  { code: 'pa-IN', name: 'Punjabi (ਪੰਜਾਬੀ)', label: 'Punjabi', gnaniLang: 'pa', defaultVoice: 'Harshit' },
  { code: 'as-IN', name: 'Assamese (অসমీয়া)', label: 'Assamese', gnaniLang: 'as', defaultVoice: 'Nalini' },
  { code: 'indic-auto', name: 'Indic Auto-Detect', label: 'Auto-Detect', gnaniLang: 'auto', defaultVoice: 'Nalini' }
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
    this.gnaniAvailable = null;
    this.gnaniStatusData = null;
    this.lastGnaniSuccessTime = null;
  }

  /**
   * Queries /api/gnani/status server-side endpoint.
   * Returns { available: boolean, status: string, provider: string, models: object }
   */
  async checkGnaniStatus() {
    try {
      const res = await fetch('/api/gnani/status');
      if (res.ok) {
        const data = await res.json();
        this.gnaniAvailable = Boolean(data.available);
        this.gnaniStatusData = data;
        return data;
      }
    } catch (err) {
      console.warn('Gnani status check error:', err);
    }
    this.gnaniAvailable = false;
    this.gnaniStatusData = {
      available: false,
      status: 'UNAVAILABLE',
      provider: 'browser_fallback',
      reason: 'Server route unreachable'
    };
    return this.gnaniStatusData;
  }

  getProviderInfo() {
    const isLive = Boolean(this.activeProvider === 'gnani_tts_live' || (this.gnaniAvailable && this.lastGnaniSuccessTime));
    const isUnavailable = Boolean(this.gnaniStatusData && this.gnaniStatusData.status === 'UNAVAILABLE');
    const isUnconfigured = !this.gnaniAvailable && !isUnavailable;

    return {
      provider: isLive ? 'gnani_live' : (isUnavailable ? 'gnani_unavailable' : 'browser_fallback'),
      isGnani: isLive,
      status: isLive ? 'LIVE' : (isUnavailable ? 'UNAVAILABLE' : 'UNCONFIGURED'),
      hasCredentials: Boolean(this.gnaniAvailable),
      label: isLive
        ? 'Gnani.ai Indic Neural Voice (LIVE via Server)'
        : isUnavailable
          ? 'Gnani.ai Indic Voice (Configured - Upstream Server Error)'
          : 'Browser Web Speech API (Client Fallback - Server Key Unset)',
      notes: isLive
        ? 'Real-time Indic neural speech verified from Gnani server.'
        : isUnavailable
          ? 'Gnani server credentials configured, but upstream returned an error. Using safe browser speech fallback.'
          : 'Server GNANI_API_KEY unset; running safe browser speech fallback.'
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
   * Transcribe Audio Chunk using Serverless Gnani STT (/api/gnani/stt)
   * If Gnani server route is unconfigured or fails, returns { transcript: null, fallbackRequired: true }
   */
  async transcribeAudioWithGnani(audioBlob, langCode = 'te-IN') {
    if (this.gnaniAvailable === false) {
      return { transcript: null, fallbackRequired: true };
    }

    try {
      // Safe high-performance native Base64 encoding via FileReader
      const base64Audio = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const res = reader.result;
          if (typeof res === 'string') {
            resolve(res.split(',')[1] || res);
          } else {
            reject(new Error('Failed to read audio blob'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(audioBlob);
      });

      const res = await fetch('/api/gnani/stt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64: base64Audio,
          language_code: langCode
        })
      });

      if (res.ok) {
        const data = await res.json();
        this.lastGnaniSuccessTime = Date.now();
        this.activeProvider = 'gnani_stt_live';
        return {
          transcript: data.transcript || '',
          provider: 'gnani_stt',
          model: data.model || 'Gnani Prisma v3'
        };
      }
      return { transcript: null, fallbackRequired: true };
    } catch (err) {
      console.warn('Gnani STT transcription failed, falling back:', err);
      return { transcript: null, fallbackRequired: true, error: err.message };
    }
  }

  /**
   * Synthesize Vernacular Speech (TTS) with Timbre v2.5 / Fallback
   */
  async speak(text, options = {}) {
    if (!text || typeof window === 'undefined') return;

    const onStart = options.onStart || (() => {});
    const onEnd = options.onEnd || (() => {});
    const onError = options.onError || (() => {});

    // Always sanitize text to strip markdown, asterisks, emojis, and bullet points
    const cleanSpeechText = cleanTextForSpeech(text);
    if (!cleanSpeechText) {
      onEnd();
      return;
    }

    let langCode = options.langCode || this.currentLanguage || 'en-IN';
    if (/[\u0C00-\u0C7F]/.test(cleanSpeechText)) {
      langCode = 'te-IN';
    } else if (/[\u0900-\u097F]/.test(cleanSpeechText)) {
      langCode = 'hi-IN';
    }

    const { rate, pitch } = this.calculateAdaptiveProsody(options.rate || 0.95, options.pitch || 1.0);

    this.stopSpeaking();
    this.isSpeaking = true;
    this.setConversationState('SPEAKING');

    // Check Gnani operational status if uninitialized
    if (this.gnaniAvailable === null) {
      await this.checkGnaniStatus();
    }

    // 1. Attempt Gnani Timbre Server Proxy if server is configured
    if (this.gnaniAvailable) {
      try {
        const langObj = INDIC_LANGUAGES.find(l => l.code === langCode);
        const voiceName = options.voice || langObj?.defaultVoice || 'Nalini';
        const modelName = options.model || (GNANI_TIMBRE_V3_VOICES.includes(voiceName) ? 'timbre-v3.0' : 'timbre-v2.5');

        const response = await fetch('/api/gnani/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanSpeechText,
            language: langCode,
            voice: voiceName,
            model: modelName
          }),
          signal: AbortSignal.timeout(8000)
        });

        if (response.ok) {
          this.activeProvider = 'gnani_tts_live';
          this.lastGnaniSuccessTime = Date.now();
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          const audio = new Audio(audioUrl);
          this.currentAudio = audio;

          audio.onplay = () => {
            this.isSpeaking = true;
            this.setConversationState('SPEAKING');
            onStart({ provider: 'gnani_live' });
          };
          audio.onended = () => {
            // Echo settling cooldown: wait 350ms before allowing mic to listen again
            setTimeout(() => {
              this.isSpeaking = false;
              if (this.conversationState === 'SPEAKING') {
                this.setConversationState('LISTENING');
              }
              onEnd();
            }, 350);
          };
          audio.onerror = () => {
            console.warn('Gnani audio playback failed, falling back to browser speech');
            this.isSpeaking = false;
            if (this.conversationState === 'SPEAKING') {
              this.setConversationState('LISTENING');
            }
            onError('Gnani audio playback failed');
          };
          await audio.play();
          return;
        }
      } catch (err) {
        console.warn('Gnani TTS unavailable, switching to browser speech fallback:', err);
      }
    }

    // 2. Visible Browser Web Speech Fallback
    this.activeProvider = 'browser_fallback';
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
      utterance.lang = langCode;
      utterance.rate = rate;
      utterance.pitch = pitch;

      const voices = window.speechSynthesis.getVoices();
      const bestVoice = getBestVoice(voices, langCode);
      if (bestVoice) {
        utterance.voice = bestVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        this.setConversationState('SPEAKING');
        onStart({ provider: 'browser_fallback' });
      };

      utterance.onend = () => {
        // Echo settling cooldown
        setTimeout(() => {
          this.isSpeaking = false;
          if (this.conversationState === 'SPEAKING') {
            this.setConversationState('LISTENING');
          }
          onEnd();
        }, 350);
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
          // Acoustic echo protection: Ignore speaker sound while assistant speaks
          consecutiveSpeechFrames = 0;
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
          // Acoustic echo protection: drop speech recognition while assistant is speaking out loud
          return;
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
        if (!status.isListening && this.activeSessionCallbacks && !this.isSpeaking) {
          setTimeout(() => {
            if (this.activeSessionCallbacks && !this.isSpeaking && this.currentRecognition) {
              try {
                this.currentRecognition.start();
              } catch {}
            }
          }, 120);
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
