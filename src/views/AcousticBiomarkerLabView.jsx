import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mic, 
  Square, 
  Activity, 
  Volume2, 
  VolumeX,
  AlertCircle, 
  Upload, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  FileAudio, 
  Cpu,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeAcousticSignals, ACOUSTIC_CLUSTER_PROFILES } from '../services/clinicalMlInferenceEngine';
import { speechService } from '../services/indicSpeechService';
import { reasonAcousticBiomarkerWithEvon } from '../services/gnaniEvonService';
import EvonStatusChip from '../components/EvonStatusChip';
import { earshotDescribe, earshotMatch } from '../services/acousticReasoningService';
import { computeAcousticDspMetrics, LAB_STATES } from '../services/acousticDspEngine';

export default function AcousticBiomarkerLabView() {
  const { isDemoMode } = useApp();

  // Explicit State Machine: AWAITING_AUDIO | RECORDING | ANALYSING | SUCCESS | ERROR
  const [labState, setLabState] = useState(LAB_STATES.AWAITING_AUDIO);
  const [errorMessage, setErrorMessage] = useState(null);

  const [visualizerMode, setVisualizerMode] = useState('spectrum'); // 'oscilloscope' | 'spectrum'
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [activeSoundName, setActiveSoundName] = useState(null);
  const [liveToneHz, setLiveToneHz] = useState(220);
  const [isToneActive, setIsToneActive] = useState(false);

  // Real-time Audio Diagnostics & Sampler State
  const [vuLevel, setVuLevel] = useState(0);
  const [detectedWheezeHz, setDetectedWheezeHz] = useState(null);
  const [isSamplingAudio, setIsSamplingAudio] = useState(false);
  const [samplingDuration, setSamplingDuration] = useState(0);
  const [sampleSummary, setSampleSummary] = useState(null);
  const samplingStartTimeRef = useRef(0);

  // Gnani Speech Services Server Status (Server-side keys only)
  const [gnaniSpeechStatus, setGnaniSpeechStatus] = useState(null);

  useEffect(() => {
    fetch('/api/gnani/status')
      .then(res => res.json())
      .then(data => setGnaniSpeechStatus(data))
      .catch(() => setGnaniSpeechStatus({ available: false, status: 'UNAVAILABLE' }));
  }, []);

  // Measured DSP Metrics: null on initial load (no placeholders, no default fake values)
  const [dspMetrics, setDspMetrics] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [evonAcousticResult, setEvonAcousticResult] = useState(null);
  const [isEvonAcousticReasoning, setIsEvonAcousticReasoning] = useState(false);

  const handleRunEvonAcousticReasoning = async () => {
    if (!dspMetrics) return;
    setIsEvonAcousticReasoning(true);
    try {
      const res = await reasonAcousticBiomarkerWithEvon(dspMetrics, 'Patient phonation test');
      setEvonAcousticResult(res);
    } catch (err) {
      console.warn('Evon acoustic reasoning error:', err);
    } finally {
      setIsEvonAcousticReasoning(false);
    }
  };

  // Earshot Local Acoustic Reasoning State (Zero-Shot Matching on measured features)
  const [earshotSemanticQuery, setEarshotSemanticQuery] = useState('respiratory wheeze');
  const [earshotMatchResult, setEarshotMatchResult] = useState(null);

  const handleTestEarshotSemanticMatch = (query) => {
    if (!dspMetrics) return;
    const q = query || earshotSemanticQuery;
    setEarshotSemanticQuery(q);
    const res = earshotMatch({
      dominantFreqHz: detectedWheezeHz || dspMetrics.pitchF0 || 220,
      spectralCentroid: dspMetrics.spectralCentroid || 1200,
      hnrDb: dspMetrics.hnrDb || 19.5
    }, q);
    setEarshotMatchResult(res);
  };

  // Live acoustic description from Earshot AST grounding (computed only when dspMetrics exist)
  const currentEarshotDescription = dspMetrics ? earshotDescribe({
    dominantFreqHz: detectedWheezeHz || dspMetrics.pitchF0 || 220,
    spectralCentroid: dspMetrics.spectralCentroid || 1200,
    hnrDb: dspMetrics.hnrDb || 19.5
  }) : null;

  // Spoken Acoustic Biomarker Telemetry Readout
  const [isSpeakingReadout, setIsSpeakingReadout] = useState(false);
  const [readoutProvider, setReadoutProvider] = useState(null);

  const handleSpeakAcousticReadout = async () => {
    if (isSpeakingReadout) {
      speechService.stopSpeaking();
      setIsSpeakingReadout(false);
      return;
    }

    if (!dspMetrics) return;

    const registerText = dspMetrics.pitchF0 === null
      ? 'Aperiodic or unvoiced signal'
      : dspMetrics.pitchF0 < 165
        ? 'Low Register'
        : dspMetrics.pitchF0 > 260
          ? 'High Register'
          : 'Mid Register';

    const readoutText = dspMetrics.pitchF0 !== null
      ? `Acoustic Phonation Telemetry. Fundamental pitch frequency is ${dspMetrics.pitchF0} Hertz, categorized as ${registerText}. Harmonics to Noise Ratio is ${dspMetrics.hnrDb || 'unavailable'} decibels.`
      : `Acoustic Phonation Telemetry. Audio is unvoiced with spectral centroid of ${dspMetrics.spectralCentroid || 'unavailable'} Hertz. Fundamental pitch frequency is unavailable.`;

    setIsSpeakingReadout(true);
    await speechService.speak(readoutText, {
      langCode: 'en-IN',
      onStart: (info) => {
        setReadoutProvider(info?.provider || 'browser_fallback');
      },
      onEnd: () => {
        setIsSpeakingReadout(false);
      },
      onError: () => {
        setIsSpeakingReadout(false);
      }
    });
  };

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const activeOscillatorRef = useRef(null);
  const activeSourceRef = useRef(null);
  const fileInputRef = useRef(null);
  const samplingTimerRef = useRef(null);
  const processorRef = useRef(null);
  const recordedPcmChunksRef = useRef([]);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      if (samplingTimerRef.current) clearInterval(samplingTimerRef.current);
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
      if (processorRef.current) { try { processorRef.current.disconnect(); } catch {} }
      if (activeOscillatorRef.current) { try { activeOscillatorRef.current.stop(); } catch {} }
      if (activeSourceRef.current) { try { activeSourceRef.current.stop(); } catch {} }
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  const getOrCreateAudioContext = () => {
    if (!audioContextRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    if (!analyserRef.current) {
      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.85;
      analyserRef.current = analyser;
    }
    return { ctx: audioContextRef.current, analyser: analyserRef.current };
  };

  const stopAllAudio = () => {
    if (samplingTimerRef.current) {
      clearInterval(samplingTimerRef.current);
      samplingTimerRef.current = null;
    }
    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch {}
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (activeOscillatorRef.current) {
      try { activeOscillatorRef.current.stop(); } catch {}
      activeOscillatorRef.current = null;
    }
    if (activeSourceRef.current) {
      try { activeSourceRef.current.stop(); } catch {}
      activeSourceRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsRecordingMic(false);
    setIsPlayingSound(false);
    setIsToneActive(false);
    setIsSamplingAudio(false);
    setActiveSoundName(null);
    setVuLevel(0);
  };

  // -------------------------------------------------------------
  // RESET ACTION: Clears all previous results and returns to AWAITING_AUDIO
  // -------------------------------------------------------------
  const handleReset = () => {
    stopAllAudio();
    if (fileInputRef.current) fileInputRef.current.value = '';
    setLabState(LAB_STATES.AWAITING_AUDIO);
    setErrorMessage(null);
    setDspMetrics(null);
    setAnalysisResult(null);
    setSampleSummary(null);
    setDetectedWheezeHz(null);
    setSamplingDuration(0);
    setEarshotMatchResult(null);
    setEvonAcousticResult(null);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    // Redraw empty canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#061626';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  // -------------------------------------------------------------
  // Live Continuous Microphone Capture (Monitoring only)
  // -------------------------------------------------------------
  const handleToggleLiveMic = async () => {
    if (isRecordingMic) {
      stopAllAudio();
      return;
    }

    stopAllAudio();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const { ctx, analyser } = getOrCreateAudioContext();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      setIsRecordingMic(true);
      startVisualizerLoop();
    } catch (err) {
      alert('Microphone access unavailable or denied: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // Microphone Phonation Recording (Direct PCM capture into DSP pipeline)
  // -------------------------------------------------------------
  const handleTogglePhonationSampling = async () => {
    if (isSamplingAudio) {
      handleStopPhonationSampling();
      return;
    }

    stopAllAudio();
    handleReset();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const { ctx, analyser } = getOrCreateAudioContext();
      const source = ctx.createMediaStreamSource(stream);
      source.connect(analyser);

      // Raw PCM accumulation via ScriptProcessorNode
      const processor = ctx.createScriptProcessor(2048, 1, 1);
      recordedPcmChunksRef.current = [];
      processor.onaudioprocess = (e) => {
        const input = e.inputBuffer.getChannelData(0);
        recordedPcmChunksRef.current.push(new Float32Array(input));
      };
      source.connect(processor);

      const silentGain = ctx.createGain();
      silentGain.gain.setValueAtTime(0, ctx.currentTime);
      processor.connect(silentGain);
      silentGain.connect(ctx.destination);
      processorRef.current = processor;

      setIsRecordingMic(true);
      setIsSamplingAudio(true);
      setLabState(LAB_STATES.RECORDING);
      samplingStartTimeRef.current = Date.now();
      startVisualizerLoop();

      samplingTimerRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - samplingStartTimeRef.current) / 1000);
        setSamplingDuration(elapsed);
        if (elapsed >= 120) {
          handleStopPhonationSampling();
        }
      }, 500);
    } catch (err) {
      setLabState(LAB_STATES.ERROR);
      setErrorMessage('Microphone access unavailable or denied: ' + err.message);
    }
  };

  const handleStopPhonationSampling = () => {
    if (samplingTimerRef.current) {
      clearInterval(samplingTimerRef.current);
      samplingTimerRef.current = null;
    }

    setIsSamplingAudio(false);
    setIsRecordingMic(false);

    if (processorRef.current) {
      try { processorRef.current.disconnect(); } catch {}
      processorRef.current = null;
    }

    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }

    // Explicit Transition: ANALYSING
    setLabState(LAB_STATES.ANALYSING);

    const chunks = recordedPcmChunksRef.current;
    if (!chunks || chunks.length === 0) {
      setLabState(LAB_STATES.ERROR);
      setErrorMessage('Could not analyse this audio: no audio frames were captured.');
      return;
    }

    let totalLen = 0;
    for (const c of chunks) totalLen += c.length;
    const concatenatedPcm = new Float32Array(totalLen);
    let offset = 0;
    for (const c of chunks) {
      concatenatedPcm.set(c, offset);
      offset += c.length;
    }

    const { ctx } = getOrCreateAudioContext();
    const sampleRate = ctx.sampleRate || 44100;

    try {
      const metrics = computeAcousticDspMetrics(concatenatedPcm, sampleRate);
      setDspMetrics(metrics);
      if (metrics.isVoiced) {
        setAnalysisResult(analyzeAcousticSignals({
          pitchF0: metrics.pitchF0,
          jitterPct: metrics.jitterPct,
          shimmerPct: metrics.shimmerPct,
          hnrDb: metrics.hnrDb,
          spectralCentroid: metrics.spectralCentroid
        }));
      } else {
        setAnalysisResult(null);
      }
      setSampleSummary({
        fileName: 'Microphone Phonation Recording',
        durationSec: metrics.durationSec,
        totalFrames: metrics.totalFrames,
        voicedFrames: metrics.voicedFrames,
        isVoiced: metrics.isVoiced,
        metrics: metrics
      });
      setLabState(LAB_STATES.SUCCESS);
    } catch (err) {
      setLabState(LAB_STATES.ERROR);
      setErrorMessage(err.message || 'Could not analyse this audio. Please try again.');
    }
  };

  // -------------------------------------------------------------
  // File Upload Decoder & Real DSP Analysis
  // -------------------------------------------------------------
  const handleAudioFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input value so re-selecting same file triggers onChange
    e.target.value = '';

    stopAllAudio();
    handleReset();

    // Transition immediately to ANALYSING (tied strictly to real decode & compute promise)
    setLabState(LAB_STATES.ANALYSING);

    try {
      const { ctx, analyser } = getOrCreateAudioContext();
      const arrayBuffer = await file.arrayBuffer();

      let audioBuffer;
      try {
        audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      } catch {
        setLabState(LAB_STATES.ERROR);
        setErrorMessage('Could not analyse this audio: unsupported format or corrupt audio file.');
        return;
      }

      if (!audioBuffer || audioBuffer.length === 0 || audioBuffer.duration === 0) {
        setLabState(LAB_STATES.ERROR);
        setErrorMessage('Could not analyse this audio: audio file contains no samples.');
        return;
      }

      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      let metrics;
      try {
        metrics = computeAcousticDspMetrics(channelData, sampleRate);
      } catch (dspErr) {
        setLabState(LAB_STATES.ERROR);
        setErrorMessage(dspErr.message || 'Could not analyse this audio. Please try again.');
        return;
      }

      // Success: store verified physical measurements
      setDspMetrics(metrics);
      if (metrics.isVoiced) {
        setAnalysisResult(analyzeAcousticSignals({
          pitchF0: metrics.pitchF0,
          jitterPct: metrics.jitterPct,
          shimmerPct: metrics.shimmerPct,
          hnrDb: metrics.hnrDb,
          spectralCentroid: metrics.spectralCentroid
        }));
      } else {
        setAnalysisResult(null);
      }

      setSampleSummary({
        fileName: file.name,
        durationSec: metrics.durationSec,
        totalFrames: metrics.totalFrames,
        voicedFrames: metrics.voicedFrames,
        isVoiced: metrics.isVoiced,
        metrics: metrics
      });

      setLabState(LAB_STATES.SUCCESS);

      // Play audio through Web Audio graph for live canvas visualizer feedback
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      activeSourceRef.current = source;
      setIsPlayingSound(true);
      setActiveSoundName(file.name);

      source.onended = () => {
        setIsPlayingSound(false);
        setActiveSoundName(null);
      };

      source.start(0);
      startVisualizerLoop();
    } catch (err) {
      setLabState(LAB_STATES.ERROR);
      setErrorMessage(err.message || 'Could not analyse this audio. Please try again.');
    }
  };

  // -------------------------------------------------------------
  // Sample Audio: 1-Click Reference Voice Signal Analysis (F0 = 120 Hz)
  // -------------------------------------------------------------
  const handleLoadSampleVoice = async () => {
    stopAllAudio();
    setLabState(LAB_STATES.ANALYSING);
    setErrorMessage(null);

    try {
      let arrayBuffer;
      try {
        const res = await fetch('/audio/sample_synthetic_vowel_120hz.wav');
        if (!res.ok) throw new Error('Fetch status ' + res.status);
        arrayBuffer = await res.arrayBuffer();
      } catch (fetchErr) {
        // Fallback: generate pure harmonic vowel at known F0 = 120 Hz in memory
        const sampleRate = 44100;
        const duration = 2.0;
        const totalSamples = Math.floor(sampleRate * duration);
        const buffer = new ArrayBuffer(44 + totalSamples * 2);
        const view = new DataView(buffer);
        const writeString = (offset, str) => {
          for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
        };
        writeString(0, 'RIFF');
        view.setUint32(4, 36 + totalSamples * 2, true);
        writeString(8, 'WAVE');
        writeString(12, 'fmt ');
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true);
        view.setUint16(22, 1, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * 2, true);
        view.setUint16(32, 2, true);
        view.setUint16(34, 16, true);
        writeString(36, 'data');
        view.setUint32(40, totalSamples * 2, true);
        for (let i = 0; i < totalSamples; i++) {
          const t = i / sampleRate;
          const s = 0.55 * Math.sin(2 * Math.PI * 120 * t) +
                    0.25 * Math.sin(2 * Math.PI * 240 * t) +
                    0.12 * Math.sin(2 * Math.PI * 360 * t) +
                    0.06 * Math.sin(2 * Math.PI * 480 * t);
          const val = Math.max(-1, Math.min(1, s)) * 32767;
          view.setInt16(44 + i * 2, val, true);
        }
        arrayBuffer = buffer;
      }

      const { ctx, analyser } = getOrCreateAudioContext();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer.slice(0));
      const channelPcm = audioBuffer.getChannelData(0);

      const metrics = computeAcousticDspMetrics(channelPcm, audioBuffer.sampleRate);
      setDspMetrics(metrics);

      if (metrics.isVoiced) {
        setAnalysisResult(analyzeAcousticSignals({
          pitchF0: metrics.pitchF0,
          jitterPct: metrics.jitterPct,
          shimmerPct: metrics.shimmerPct,
          hnrDb: metrics.hnrDb,
          spectralCentroidHz: metrics.spectralCentroid,
          register: metrics.pitchRegister
        }));
      } else {
        setAnalysisResult(null);
      }

      setSampleSummary({
        fileName: 'synthetic_vowel_120hz.wav (Sample Audio)',
        durationSec: metrics.durationSec,
        totalFrames: metrics.totalFrames,
        voicedFrames: metrics.voicedFrames,
        isVoiced: metrics.isVoiced,
        metrics: metrics
      });

      setLabState(LAB_STATES.SUCCESS);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      activeSourceRef.current = source;
      setIsPlayingSound(true);
      setActiveSoundName('Sample Audio (Synthetic Vowel 120 Hz)');

      source.onended = () => {
        setIsPlayingSound(false);
        setActiveSoundName(null);
      };

      source.start(0);
      startVisualizerLoop();
    } catch (err) {
      setLabState(LAB_STATES.ERROR);
      setErrorMessage(err.message || 'Could not load and analyse sample audio.');
    }
  };

  // -------------------------------------------------------------
  // Synthetic Breath / Vocal Biomarker Tone Synthesizer (Simulation)
  // -------------------------------------------------------------
  const playSyntheticBiomarkerSound = (profileKey) => {
    stopAllAudio();

    const { ctx, analyser } = getOrCreateAudioContext();
    const profile = ACOUSTIC_CLUSTER_PROFILES[profileKey];
    if (!profile) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    if (profileKey === 'asthma_wheeze') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);
      filter.Q.setValueAtTime(8, ctx.currentTime);
    } else if (profileKey === 'pediatric_stridor') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
    } else if (profileKey === 'pneumonia_rales') {
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
    } else if (profileKey === 'neurological_tremor') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(136, ctx.currentTime);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, ctx.currentTime);
      lfoGain.gain.setValueAtTime(25, ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(profile.f0Mean || 135, ctx.currentTime);
    }

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    activeOscillatorRef.current = osc;
    setIsPlayingSound(true);
    setActiveSoundName(profile.label);

    osc.onended = () => {
      setIsPlayingSound(false);
      setActiveSoundName(null);
    };

    osc.start();
    osc.stop(ctx.currentTime + 3.2);

    startVisualizerLoop();
  };

  // -------------------------------------------------------------
  // Live Tone Slider Generator
  // -------------------------------------------------------------
  const handleToggleLiveTone = (freq) => {
    const targetFreq = freq || liveToneHz;

    if (isToneActive && activeOscillatorRef.current) {
      stopAllAudio();
      return;
    }

    stopAllAudio();
    const { ctx, analyser } = getOrCreateAudioContext();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(targetFreq, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);

    osc.connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);

    activeOscillatorRef.current = osc;
    setIsToneActive(true);
    setIsPlayingSound(true);
    setActiveSoundName(`${targetFreq} Hz Sine Tone`);

    osc.start();
    startVisualizerLoop();
  };

  const handleToneSliderChange = (e) => {
    const newHz = Number(e.target.value);
    setLiveToneHz(newHz);

    if (activeOscillatorRef.current && audioContextRef.current) {
      activeOscillatorRef.current.frequency.setValueAtTime(newHz, audioContextRef.current.currentTime);
      setActiveSoundName(`${newHz} Hz Sine Tone`);
    }
  };

  // -------------------------------------------------------------
  // Real-Time Canvas Visualizer (Oscilloscope / Spectrum Bars)
  // Note: Only draws visual feedback and VU meter. Never overwrites dspMetrics.
  // -------------------------------------------------------------
  const startVisualizerLoop = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    const canvas = canvasRef.current;
    const analyser = analyserRef.current;
    if (!canvas || !analyser) return;

    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const timeData = new Uint8Array(bufferLength);
    const freqData = new Uint8Array(bufferLength);

    const render = () => {
      analyser.getByteTimeDomainData(timeData);
      analyser.getByteFrequencyData(freqData);

      ctx.fillStyle = '#061626';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      let sumSquares = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = (timeData[i] - 128) / 128.0;
        sumSquares += v * v;
      }
      const rms = Math.sqrt(sumSquares / bufferLength);

      if (visualizerMode === 'oscilloscope') {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#00F5D4';
        ctx.shadowColor = '#00F5D4';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        const barCount = 48;
        const barWidth = (canvas.width / barCount) - 2;

        for (let i = 0; i < barCount; i++) {
          const index = Math.floor(i * (bufferLength / barCount) * 0.5);
          const barHeight = (freqData[index] / 255) * canvas.height * 0.9;
          const x = i * (barWidth + 2);
          const y = canvas.height - barHeight;

          const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
          grad.addColorStop(0, '#0F4C5C');
          grad.addColorStop(0.5, '#00F5D4');
          grad.addColorStop(1, '#D4AF37');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);
        }

        // Frequency guides
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px monospace';
        ctx.fillText('100 Hz', 10, 18);
        ctx.fillText('1 kHz (Speech Mids)', canvas.width * 0.35, 18);
        ctx.fillText('4 kHz (Treble)', canvas.width - 90, 18);
      }

      // VU level feedback
      setVuLevel(Math.min(100, Math.round(rms * 280)));

      // Wheeze detection for live feedback
      const sampleRate = audioContextRef.current ? audioContextRef.current.sampleRate : 44100;
      const nyquist = sampleRate / 2;
      const minBin = Math.floor((350 / nyquist) * bufferLength);
      const maxBin = Math.floor((900 / nyquist) * bufferLength);
      let peakVal = 0, peakBin = 0, avgVal = 0, binCount = 0;
      for (let b = minBin; b <= maxBin; b++) {
        const val = freqData[b];
        avgVal += val;
        binCount++;
        if (val > peakVal) {
          peakVal = val;
          peakBin = b;
        }
      }
      const localAvg = binCount > 0 ? avgVal / binCount : 1;
      if (peakVal > 90 && (peakVal / (localAvg + 1)) > 2.2) {
        setDetectedWheezeHz(Math.round((peakBin * nyquist) / bufferLength));
      } else {
        setDetectedWheezeHz(null);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  useEffect(() => {
    if (isPlayingSound || isRecordingMic || isToneActive) {
      startVisualizerLoop();
    }
  }, [visualizerMode]);

  return (
    <div className="acoustic-lab-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px 20px', fontFamily: 'system-ui, sans-serif' }}>
      {/* Top Navigation Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: 10 }}>
        <Link 
          to="/doctor-portal" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#0F4C5C', textDecoration: 'none', fontWeight: 750, fontSize: '13px' }}
        >
          <ArrowLeft size={16} />
          <span>Back to Doctor Portal</span>
        </Link>

        {/* Status Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '11px',
            background: '#F1F5F9',
            border: '1px solid #CBD5E1',
            color: '#334155',
            padding: '5px 12px',
            borderRadius: 16,
            fontWeight: 800
          }}>
            DEMO / PROTOTYPE LAB
          </span>

          <span style={{
            fontSize: '11px',
            background: '#E6F7F8',
            border: '1px solid #99F6E4',
            color: '#0F4C5C',
            padding: '5px 12px',
            borderRadius: 16,
            fontWeight: 800
          }}>
            Browser-based DSP - prototype analysis
          </span>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 12px',
              borderRadius: 16,
              background: gnaniSpeechStatus?.available ? '#E6F7F8' : '#F1F5F9',
              border: '1px solid',
              borderColor: gnaniSpeechStatus?.available ? '#0F4C5C' : '#CBD5E1',
              color: gnaniSpeechStatus?.available ? '#0F4C5C' : '#475569',
              fontSize: '11px',
              fontWeight: 800
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: gnaniSpeechStatus?.available ? '#10B981' : '#94A3B8' }} />
            <span>{gnaniSpeechStatus?.available ? 'Gnani Speech: LIVE' : 'Speech: Browser Fallback'}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 76, 92, 0.1)', color: '#0F4C5C', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
          <Activity size={14} />
          <span>VOCAL BIOMARKER & ACOUSTIC SIGNAL LAB</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#081C24', marginBottom: '10px' }}>
          Vocal Biomarker & Acoustic Signal Lab
        </h1>
        <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6, marginBottom: '10px' }}>
          Real-time physical digital signal processing (DSP) extracting fundamental frequency (F0), Harmonics-to-Noise Ratio (HNR), and perturbation metrics. Research signal viewer, not for clinical diagnosis.
        </p>
      </div>

      {/* Non-Diagnostic Disclaimer Banner */}
      <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '14px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <AlertCircle size={20} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E', marginBottom: '2px' }}>
            PHYSICAL SIGNAL OBSERVATIONS NOTICE (RESEARCH & BENCHMARK PROTOTYPE)
          </div>
          <p style={{ fontSize: '12px', color: '#B45309', margin: 0, lineHeight: 1.5 }}>
            Acoustic features displayed are physical audio engineering measurements (fundamental frequency F0, HNR, Jitter, Shimmer, and spectral centroid). Not an FDA/CDSCO approved diagnostic device. Does not produce medical diagnoses.
          </p>
        </div>
      </div>

      {/* Main Lab Grid */}
      <div className="acoustic-lab-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))', gap: '20px' }}>
        
        {/* Left Column: Visualizer, Controls, Tone Generator */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Visualizer Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>
                Acoustic Frequency Spectrum
              </h3>
              {activeSoundName && (
                <div style={{ fontSize: '11px', color: '#0F4C5C', fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Volume2 size={12} />
                  <span>Playing: {activeSoundName}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={() => setVisualizerMode(visualizerMode === 'oscilloscope' ? 'spectrum' : 'oscilloscope')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#FAF8F5',
                  color: '#081C24',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {visualizerMode === 'oscilloscope' ? 'Switch to Spectrum Bars' : 'Switch to Waveform'}
              </button>

              {(isRecordingMic || isPlayingSound || isToneActive) && (
                <button
                  type="button"
                  onClick={stopAllAudio}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#EF4444',
                    color: '#FFFFFF',
                    fontSize: '11.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Square size={12} fill="#FFF" />
                  <span>Stop</span>
                </button>
              )}
            </div>
          </div>

          {/* Canvas Screen */}
          <canvas
            ref={canvasRef}
            width={540}
            height={180}
            style={{
              width: '100%',
              height: '180px',
              borderRadius: '12px',
              background: '#061626',
              boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)'
            }}
          />

          {/* Real-time Dynamic VU Decibel Meter */}
          <div style={{ background: '#0F172A', padding: '10px 14px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#94A3B8' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: vuLevel > 10 ? '#00F5D4' : '#475569' }} />
                <span>Audio Input Level (VU / RMS):</span>
              </span>
              <span style={{ fontFamily: 'monospace', color: vuLevel > 60 ? '#F59E0B' : '#00F5D4', fontWeight: 800 }}>
                {vuLevel > 0 ? `${vuLevel}% (${-(60 - Math.round(vuLevel * 0.55))} dBFS)` : 'Idle (Ambient Gate)'}
              </span>
            </div>
            <div style={{ height: 6, background: '#1E293B', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${vuLevel}%`,
                height: '100%',
                background: vuLevel > 75 ? 'linear-gradient(90deg, #F59E0B, #EF4444)' : 'linear-gradient(90deg, #0F4C5C, #00F5D4)',
                borderRadius: 3,
                transition: 'width 0.08s ease'
              }} />
            </div>
          </div>

          {/* Narrow-band resonance indicator */}
          {detectedWheezeHz && (
            <div style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1.5px solid #F59E0B',
              borderRadius: '10px',
              padding: '10px 14px',
              color: '#B45309',
              fontSize: '12px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '16px' }}>🎶</span>
                <span>Narrow-Band Resonant Peak Detected (~{detectedWheezeHz} Hz)</span>
              </div>
            </div>
          )}

          {/* Action Row: Continuous Mic, Record Phonation, Upload Audio & Reset */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10 }}>
            <button
              type="button"
              onClick={handleToggleLiveMic}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: 'none',
                background: isRecordingMic && !isSamplingAudio ? '#DC2626' : 'linear-gradient(135deg, #0F4C5C 0%, #006666 100%)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isRecordingMic && !isSamplingAudio ? <Square size={16} fill="#FFF" /> : <Mic size={16} />}
              <span>{isRecordingMic && !isSamplingAudio ? 'Stop Continuous' : 'Continuous Mic'}</span>
            </button>

            <button
              id="acoustic-lab-sample-btn"
              type="button"
              onClick={handleLoadSampleVoice}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: 'none',
                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                color: '#FFFFFF',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              title="Load reference synthetic sample voice and compute physical DSP metrics"
            >
              <Sparkles size={16} />
              <span>Sample Audio</span>
            </button>

            <button
              id="acoustic-lab-upload-btn"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                background: '#FAF8F5',
                color: '#081C24',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Upload size={16} color="#0F4C5C" />
              <span>Upload Audio</span>
            </button>
            <input 
              id="acoustic-lab-file-input"
              ref={fileInputRef} 
              type="file" 
              accept="audio/*" 
              style={{ display: 'none' }} 
              onChange={handleAudioFileUpload}
            />

            <button
              id="acoustic-lab-reset-btn"
              type="button"
              onClick={handleReset}
              style={{
                padding: '12px 14px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                background: '#FAF8F5',
                color: '#334155',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              title="Clear all results and return to awaiting audio input"
            >
              <RotateCcw size={16} color="#475569" />
              <span>Reset</span>
            </button>
          </div>

          {/* Interactive Live Tone Slider */}
          <div style={{ background: '#FAF8F5', padding: '14px 16px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                <Sliders size={14} color="#0F4C5C" />
                <span>Interactive Acoustic Tone Generator:</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleLiveTone(liveToneHz)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: isToneActive ? '#EF4444' : '#0F4C5C',
                  color: '#FFFFFF',
                  fontSize: '11px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                {isToneActive ? 'Mute Tone' : 'Play Tone'}
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input
                type="range"
                min="80"
                max="2000"
                step="5"
                value={liveToneHz}
                onChange={handleToneSliderChange}
                style={{ flex: 1, cursor: 'pointer', accentColor: '#0F4C5C' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 850, color: '#081C24', minWidth: '60px', textAlign: 'right', fontFamily: 'monospace' }}>
                {liveToneHz} Hz
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginTop: 4 }}>
              <span>80 Hz (Low Bass)</span>
              <span>440 Hz (Concert Pitch A4)</span>
              <span>2000 Hz (High Frequency)</span>
            </div>
          </div>

          {/* Extracted Physical DSP Metrics: RENDERED ONLY ON SUCCESS */}
          {labState === LAB_STATES.SUCCESS && dspMetrics && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Extracted Physical DSP Metrics:
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Pitch F0 (Vocal Fundamental)</span>
                  <div style={{ fontSize: '18px', fontWeight: 850, color: '#081C24' }}>
                    {dspMetrics.pitchF0 !== null ? `${dspMetrics.pitchF0} Hz` : 'Unavailable'}
                  </div>
                </div>
                <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Pitch Register (Measured F0)</span>
                  <div style={{ fontSize: '15px', fontWeight: 850, color: '#0F4C5C' }}>
                    {dspMetrics.pitchRegister}
                  </div>
                </div>
                <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Harmonics-to-Noise Ratio (HNR)</span>
                  <div style={{ fontSize: '18px', fontWeight: 850, color: '#081C24' }}>
                    {dspMetrics.hnrDb !== null ? `${dspMetrics.hnrDb} dB` : 'Unavailable'}
                  </div>
                </div>
                <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Spectral Centroid</span>
                  <div style={{ fontSize: '18px', fontWeight: 850, color: '#081C24' }}>
                    {dspMetrics.spectralCentroid !== null ? `${dspMetrics.spectralCentroid} Hz` : 'Unavailable'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reference Presets */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
              Synthetic Reference Tone Signatures (SIMULATION):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {[
                { key: 'normal_phonation', label: '135 Hz Baseline Tone', icon: '🟢', sub: '135Hz Harmonic Tone (Synthetic)' },
                { key: 'asthma_wheeze', label: '440 Hz Whistle Tone', icon: '🔵', sub: '440Hz Resonant Audio (Synthetic)' },
                { key: 'pediatric_stridor', label: '880 Hz High Pitch Tone', icon: '⚠️', sub: '880Hz Audio Tone (Synthetic)' },
                { key: 'pneumonia_rales', label: 'Adventitious Burst', icon: '🟠', sub: 'Audio Burst Pattern (Synthetic)' },
                { key: 'neurological_tremor', label: '5.5 Hz Modulated Tone', icon: '🟣', sub: '5.5Hz Modulated Tone (Synthetic)' }
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => playSyntheticBiomarkerSound(item.key)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid',
                    borderColor: activeSoundName === ACOUSTIC_CLUSTER_PROFILES[item.key]?.label ? '#0F4C5C' : '#E2E8F0',
                    background: activeSoundName === ACOUSTIC_CLUSTER_PROFILES[item.key]?.label ? '#E6F7F8' : '#FFFFFF',
                    color: '#081C24',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: '12px' }}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', marginTop: 2 }}>
                    {item.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: State Machine Managed Display Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* STATE 1: AWAITING_AUDIO */}
          {labState === LAB_STATES.AWAITING_AUDIO && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px dashed #CBD5E1',
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}>
              <div style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: '#E6F7F8',
                color: '#0F4C5C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <FileAudio size={32} />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 850, color: '#081C24', margin: '0 0 8px 0' }}>
                Awaiting audio input
              </h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', maxWidth: '440px', lineHeight: 1.6, margin: '0 0 24px 0' }}>
                Load sample audio or upload an audio file (.wav, .mp3) to measure physical acoustic parameters (F0 fundamental frequency, HNR, jitter, and shimmer).
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 16px',
                borderRadius: '20px',
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                fontSize: '12px',
                color: '#475569',
                fontWeight: 700
              }}>
                <span>Use the action controls on the left to load sample audio or upload a file</span>
              </div>
            </div>
          )}

          {/* STATE 2: RECORDING */}
          {labState === LAB_STATES.RECORDING && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '2px solid #EF4444',
              padding: '40px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
                fontSize: '18px',
                fontWeight: 900
              }}>
                {samplingDuration}s
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 850, color: '#991B1B', margin: '0 0 8px 0' }}>
                Recording Audio Phonation ({samplingDuration}s)
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '420px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                Live audio waveform and VU meter are active. Sustain phonation or record sample, then click "Stop & Analyze".
              </p>
              <button
                type="button"
                onClick={handleStopPhonationSampling}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#DC2626',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                <Square size={14} fill="#FFF" />
                <span>Stop & Analyze</span>
              </button>
            </div>
          )}

          {/* STATE 3: ANALYSING */}
          {labState === LAB_STATES.ANALYSING && (
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E2E8F0',
              padding: '48px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}>
              <div style={{
                width: 44,
                height: 44,
                border: '4px solid #E2E8F0',
                borderTopColor: '#0F4C5C',
                borderRadius: '50%',
                animation: 'ayuswar-spin 0.75s linear infinite',
                marginBottom: '16px'
              }} />
              <h3 style={{ fontSize: '18px', fontWeight: 850, color: '#081C24', margin: '0 0 8px 0' }}>
                Analysing...
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '380px', lineHeight: 1.6, margin: 0 }}>
                Computing fundamental frequency, harmonics, and cycle perturbation via browser-based DSP engine.
              </p>
            </div>
          )}

          {/* STATE 4: ERROR */}
          {labState === LAB_STATES.ERROR && (
            <div style={{
              background: '#FEF2F2',
              borderRadius: '16px',
              border: '1.5px solid #FCA5A5',
              padding: '40px 24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '400px'
            }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: '#FEE2E2',
                color: '#DC2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <AlertCircle size={28} />
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 850, color: '#991B1B', margin: '0 0 8px 0' }}>
                Could not analyse this audio
              </h3>
              <p style={{ fontSize: '13.5px', color: '#B91C1C', maxWidth: '440px', lineHeight: 1.6, margin: '0 0 20px 0' }}>
                {errorMessage || 'Could not analyse this audio. Please try again with valid audio.'}
              </p>
              <button
                type="button"
                onClick={handleReset}
                style={{
                  padding: '8px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#0F4C5C',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Reset & Try Again
              </button>
            </div>
          )}

          {/* STATE 5: SUCCESS */}
          {labState === LAB_STATES.SUCCESS && dspMetrics && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Telemetry Card */}
              <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#0F4C5C', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Measured Acoustic Telemetry
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: 850, color: '#081C24', margin: '2px 0 0 0' }}>
                      {sampleSummary?.fileName || 'Audio Sample Analysis'}
                    </h3>
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '11px', background: '#E6F7F8', color: '#0F4C5C', padding: '4px 10px', borderRadius: 12, fontWeight: 800, border: '1px solid #99F6E4' }}>
                      Browser-based DSP - prototype analysis
                    </span>
                    <button
                      id="acoustic-lab-reset-analysis-btn"
                      type="button"
                      onClick={handleReset}
                      style={{
                        padding: '4px 12px',
                        borderRadius: 8,
                        border: '1px solid #CBD5E1',
                        background: '#F8FAFC',
                        color: '#334155',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Reset Analysis
                    </button>
                  </div>
                </div>

                {/* Metadata summary */}
                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px', background: '#F8FAFC', padding: '8px 12px', borderRadius: 8 }}>
                  <span>Duration: <strong>{sampleSummary?.durationSec}s</strong></span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span>Total Frames: <strong>{sampleSummary?.totalFrames}</strong></span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span>Voiced Frames: <strong>{sampleSummary?.voicedFrames}</strong></span>
                  <span style={{ margin: '0 8px' }}>•</span>
                  <span>Signal: <strong>{dspMetrics.isVoiced ? 'Voiced Periodic Signal' : 'Unvoiced / Aperiodic Signal'}</strong></span>
                </div>

                {/* Metrics Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Fundamental Pitch (F0)</span>
                    <div style={{ fontSize: '20px', fontWeight: 900, color: dspMetrics.pitchF0 !== null ? '#081C24' : '#64748B' }}>
                      {dspMetrics.pitchF0 !== null ? `${dspMetrics.pitchF0} Hz` : 'unavailable'}
                    </div>
                  </div>
                  <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Pitch Register</span>
                    <div style={{ fontSize: '15px', fontWeight: 850, color: '#0F4C5C' }}>
                      {dspMetrics.pitchRegister}
                    </div>
                  </div>
                  <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Harmonics-to-Noise Ratio (HNR)</span>
                    <div style={{ fontSize: '18px', fontWeight: 850, color: dspMetrics.hnrDb !== null ? '#081C24' : '#64748B' }}>
                      {dspMetrics.hnrDb !== null ? `${dspMetrics.hnrDb} dB` : 'unavailable'}
                    </div>
                  </div>
                  <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Spectral Centroid</span>
                    <div style={{ fontSize: '18px', fontWeight: 850, color: dspMetrics.spectralCentroid !== null ? '#081C24' : '#64748B' }}>
                      {dspMetrics.spectralCentroid !== null ? `${dspMetrics.spectralCentroid} Hz` : 'unavailable'}
                    </div>
                  </div>
                  <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Cycle Jitter Perturbation</span>
                    <div style={{ fontSize: '18px', fontWeight: 850, color: dspMetrics.jitterPct !== null ? '#081C24' : '#64748B' }}>
                      {dspMetrics.jitterPct !== null ? `${dspMetrics.jitterPct}%` : 'unavailable'}
                    </div>
                  </div>
                  <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                    <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Cycle Shimmer Perturbation</span>
                    <div style={{ fontSize: '18px', fontWeight: 850, color: dspMetrics.shimmerPct !== null ? '#081C24' : '#64748B' }}>
                      {dspMetrics.shimmerPct !== null ? `${dspMetrics.shimmerPct}%` : 'unavailable'}
                    </div>
                  </div>
                </div>

                {/* Honest Unvoiced Notice */}
                {!dspMetrics.isVoiced && (
                  <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                    ℹ️ <strong>Unvoiced Audio Detected:</strong> Input contains acoustic energy without harmonic periodicity. Fundamental frequency (F0) and cycle perturbation metrics (Jitter, Shimmer) are honestly reported as unavailable.
                  </div>
                )}

                {/* Voice Readout Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: '10px', flexWrap: 'wrap', gap: 10 }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F766E' }}>
                      Acoustic Telemetry Voice Readout
                    </div>
                    <div style={{ fontSize: '11px', color: '#115E59' }}>
                      {readoutProvider === 'gnani_live'
                        ? '🟢 Gnani Timbre TTS (LIVE Audio Verified)'
                        : gnaniSpeechStatus?.available
                          ? '🟡 Gnani Timbre TTS (Ready via Server)'
                          : '⚪ Browser Web Speech API Fallback (GNANI_API_KEY unset)'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSpeakAcousticReadout}
                    style={{
                      padding: '6px 14px',
                      borderRadius: 6,
                      border: 'none',
                      background: isSpeakingReadout ? '#EF4444' : '#0F4C5C',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6
                    }}
                  >
                    <Volume2 size={13} />
                    <span>{isSpeakingReadout ? 'Stop Voice' : '🔊 Speak Readout'}</span>
                  </button>
                </div>
              </div>

              {/* Statistical Baseline Cluster Distance (Only when analysisResult exists) */}
              {analysisResult && (
                <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F4C5C', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                    Acoustic Reference Pattern Distance
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '16px' }}>
                    Mathematical Gaussian similarity distance against standard voice literature profiles. Physical signal matching only — not a clinical disease diagnosis.
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {analysisResult.allAcousticMatches?.slice(0, 4).map((match, idx) => (
                      <div key={match.key}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 750, color: '#081C24' }}>{match.label}</span>
                          <span style={{ color: '#64748B', fontFamily: 'monospace' }}>Distance Score: {match.similarityScore}/100</span>
                        </div>
                        <div style={{ height: '8px', background: '#FAF8F5', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{
                            width: `${match.similarityScore}%`,
                            height: '100%',
                            background: idx === 0 ? 'linear-gradient(90deg, #0F4C5C 0%, #00F5D4 100%)' : '#94A3B8',
                            borderRadius: '4px',
                            transition: 'width 0.4s ease'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Gnani Evon Sovereign Indic Voice Physics Synthesis */}
              <div style={{
                background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                borderRadius: '16px',
                border: '1.5px solid #00F5D4',
                padding: '20px',
                color: '#F8FAFC'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #00F5D4 0%, #0F4C5C 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#081C24'
                    }}>
                      <Cpu size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>Gnani Evon (30B-A3B)</span>
                        <span style={{ fontSize: '9px', background: 'rgba(0,245,212,0.2)', color: '#00F5D4', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(0,245,212,0.4)', fontWeight: 800 }}>
                          ACOUSTIC REASONER
                        </span>
                      </div>
                      <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                        Mixture-of-Experts Voice Physics Synthesis (/api/evon/chat)
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <EvonStatusChip compact={true} />
                    <button
                      onClick={handleRunEvonAcousticReasoning}
                      disabled={isEvonAcousticReasoning}
                      style={{
                        background: 'linear-gradient(135deg, #00F5D4 0%, #0F4C5C 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#081C24',
                        padding: '7px 14px',
                        fontSize: '11.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Sparkles size={13} />
                      <span>{isEvonAcousticReasoning ? 'Synthesizing...' : 'Synthesize Evon 30B'}</span>
                    </button>
                  </div>
                </div>

                {evonAcousticResult ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '12px' }}>
                    {evonAcousticResult.isFallback ? (
                      <div style={{
                        background: '#FFFBEB',
                        border: '1px solid #FCD34D',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        fontSize: '11.5px',
                        color: '#92400E'
                      }}>
                        <div style={{ fontWeight: 800, marginBottom: '2px', color: '#B45309' }}>
                          🛡️ [Rule-based Fallback (Not Evon)]
                        </div>
                        <div>
                          Evon server route unavailable ({evonAcousticResult.error || 'Server env vars unset'}). 
                          Showing deterministic physical acoustic observations without LLM inference.
                        </div>
                      </div>
                    ) : (
                      <>
                        {evonAcousticResult.isEvonLive && evonAcousticResult.thoughtTrace && (
                          <div style={{
                            background: 'rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            borderRadius: '8px',
                            padding: '10px 12px',
                            fontFamily: 'monospace',
                            fontSize: '11px',
                            color: '#93C5FD',
                            lineHeight: '1.5'
                          }}>
                            <div style={{ color: '#38BDF8', fontWeight: 700, marginBottom: '2px', fontSize: '9.5px', textTransform: 'uppercase' }}>
                              LIVE EVON Reasoning Trace:
                            </div>
                            {evonAcousticResult.thoughtTrace}
                          </div>
                        )}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          fontSize: '12px',
                          color: '#E2E8F0',
                          lineHeight: '1.55'
                        }}>
                          {evonAcousticResult.finalAnswer}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '6px', lineHeight: '1.5' }}>
                    Tap "Synthesize Evon 30B" to reason across measured physical parameters (F0: {dspMetrics.pitchF0 ? dspMetrics.pitchF0 + 'Hz' : 'unavailable'}, HNR: {dspMetrics.hnrDb ? dspMetrics.hnrDb + 'dB' : 'unavailable'}).
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Clinical Safety Protocol Footer */}
          <div style={{ background: '#FAF8F5', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '16px', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
            <strong>Clinical Safety Protocol:</strong> Quantitative physical acoustics vary with recording equipment, microphone distance, ambient noise, and vocal technique. Features serve as digital engineering aids and cannot substitute for physical auscultation, stethoscopy, or spirometry.
          </div>
        </div>
      </div>
    </div>
  );
}
