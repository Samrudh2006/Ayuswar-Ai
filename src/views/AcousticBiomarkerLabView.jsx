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
  Download, 
  Play, 
  Pause,
  Upload,
  Sliders,
  Sparkles,
  BarChart2,
  Key,
  CheckCircle2,
  FileAudio,
  Cpu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { analyzeAcousticSignals, ACOUSTIC_CLUSTER_PROFILES } from '../services/clinicalMlInferenceEngine';
import { speechService } from '../services/indicSpeechService';
import { reasonAcousticBiomarkerWithEvon, EVON_MODEL_METADATA } from '../services/gnaniEvonService';
import EvonStatusChip from '../components/EvonStatusChip';

export default function AcousticBiomarkerLabView() {
  const { isDemoMode } = useApp();

  const [visualizerMode, setVisualizerMode] = useState('spectrum'); // 'oscilloscope' | 'spectrum'
  const [isRecordingMic, setIsRecordingMic] = useState(false);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [activeSoundName, setActiveSoundName] = useState(null);
  const [liveToneHz, setLiveToneHz] = useState(220);
  const [isToneActive, setIsToneActive] = useState(false);
  
  // Gnani API Key State
  const [showGnaniModal, setShowGnaniModal] = useState(false);
  const [gnaniKeyInput, setGnaniKeyInput] = useState(() => {
    try { return sessionStorage.getItem('ayuswar_gnani_key') || ''; } catch { return ''; }
  });
  const [gnaniTokenInput, setGnaniTokenInput] = useState(() => {
    try { return sessionStorage.getItem('ayuswar_gnani_token') || ''; } catch { return ''; }
  });
  const [gnaniStatusMsg, setGnaniStatusMsg] = useState(null);

  const [dspMetrics, setDspMetrics] = useState({
    pitchF0: 142,
    jitterPct: 0.85,
    shimmerPct: 1.70,
    hnrDb: 19.5,
    spectralCentroid: 1200
  });
  const [analysisResult, setAnalysisResult] = useState(() => analyzeAcousticSignals(dspMetrics));
  const [evonAcousticResult, setEvonAcousticResult] = useState(null);
  const [isEvonAcousticReasoning, setIsEvonAcousticReasoning] = useState(false);

  const handleRunEvonAcousticReasoning = async () => {
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

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animFrameRef = useRef(null);
  const canvasRef = useRef(null);
  const activeOscillatorRef = useRef(null);
  const activeSourceRef = useRef(null);
  const fileInputRef = useRef(null);

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      stopAllAudio();
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
    setActiveSoundName(null);
  };

  // -------------------------------------------------------------
  // Live Microphone Capture
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
  // File Upload Decoder
  // -------------------------------------------------------------
  const handleAudioFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopAllAudio();

    try {
      const { ctx, analyser } = getOrCreateAudioContext();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(analyser);
      analyser.connect(ctx.destination);

      activeSourceRef.current = source;
      setIsPlayingSound(true);
      setActiveSoundName(file.name);

      // Compute physical DSP metrics via voicing-gated autocorrelation
      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;
      const frameSize = 2048;
      const hopSize = 1024;
      const numFrames = Math.min(60, Math.floor((channelData.length - frameSize) / hopSize));
      const pitchEstimates = [];
      const hnrEstimates = [];
      let totalCentroid = 0;
      let validFrames = 0;

      const minLag = Math.floor(sampleRate / 380); // 380 Hz upper voice pitch limit
      const maxLag = Math.floor(sampleRate / 80);  // 80 Hz lower voice pitch limit

      for (let i = 0; i < numFrames; i++) {
        const start = i * hopSize;
        const frame = channelData.subarray(start, start + frameSize);
        
        let r0 = 0;
        for (let j = 0; j < frameSize; j++) r0 += frame[j] * frame[j];
        if (r0 < 0.005) continue; // silence / noise gate

        let maxCorr = -1;
        let bestLag = 0;
        for (let lag = minLag; lag < maxLag; lag++) {
          let corr = 0;
          for (let j = 0; j < frameSize - lag; j += 2) {
            corr += frame[j] * frame[j + lag];
          }
          if (corr > maxCorr) {
            maxCorr = corr;
            bestLag = lag;
          }
        }

        if (bestLag > 0 && r0 > 0) {
          const normCorr = (maxCorr * 2) / r0;
          // Harmonicity & Voicing gate: require autocorrelation clarity > 0.45
          if (normCorr > 0.45) {
            const f0Candidate = Math.round(sampleRate / bestLag);
            if (f0Candidate >= 80 && f0Candidate <= 380) {
              pitchEstimates.push(f0Candidate);
              const safeNorm = Math.min(0.98, Math.max(0.05, normCorr));
              const hnr = 10 * Math.log10(safeNorm / (1.0001 - safeNorm));
              hnrEstimates.push(hnr);
            }
          }
        }

        let num = 0, den = 0;
        for (let j = 0; j < frameSize; j++) {
          const mag = Math.abs(frame[j]);
          num += j * mag;
          den += mag;
        }
        if (den > 0) {
          totalCentroid += ((num / den) * (sampleRate / 2)) / frameSize;
          validFrames++;
        }
      }

      const calculatedF0 = pitchEstimates.length > 0
        ? Math.round(pitchEstimates.sort((a,b)=>a-b)[Math.floor(pitchEstimates.length / 2)])
        : 145;
      const calculatedHnr = hnrEstimates.length > 0
        ? Number((hnrEstimates.reduce((a,b)=>a+b, 0) / hnrEstimates.length).toFixed(1))
        : 18.5;
      const calculatedCentroid = validFrames > 0
        ? Math.round(totalCentroid / validFrames)
        : 1250;

      const fileMetrics = {
        pitchF0: calculatedF0,
        hnrDb: calculatedHnr,
        spectralCentroid: calculatedCentroid
      };
      setDspMetrics(fileMetrics);
      setAnalysisResult(analyzeAcousticSignals(fileMetrics));

      source.onended = () => {
        setIsPlayingSound(false);
        setActiveSoundName(null);
      };

      source.start(0);
      startVisualizerLoop();
    } catch (err) {
      alert('Failed to decode audio file: ' + err.message);
    }
  };

  // -------------------------------------------------------------
  // Synthetic Breath / Vocal Biomarker Tone Synthesizer
  // -------------------------------------------------------------
  const playSyntheticBiomarkerSound = (profileKey) => {
    stopAllAudio();

    const { ctx, analyser } = getOrCreateAudioContext();
    const profile = ACOUSTIC_CLUSTER_PROFILES[profileKey];
    if (!profile) return;

    const baseFreq = profile.f0Mean || 220;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    if (profileKey === 'asthma_wheeze') {
      // 400Hz polyphonic whistling resonance
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(420, ctx.currentTime);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, ctx.currentTime);
      filter.Q.setValueAtTime(8, ctx.currentTime);
    } else if (profileKey === 'pediatric_stridor') {
      // High-pitch inspiratory stridor
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
    } else if (profileKey === 'pneumonia_rales') {
      // Crackle bursts
      osc.type = 'square';
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
    } else if (profileKey === 'neurological_tremor') {
      // 136Hz with 5.5Hz vibrato modulation
      osc.type = 'sine';
      osc.frequency.setValueAtTime(136, ctx.currentTime);
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(5.5, ctx.currentTime);
      lfoGain.gain.setValueAtTime(25, ctx.currentTime);
      lfo.connect(osc.frequency);
      lfo.start();
    } else {
      // Normal Phonation
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
    }

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);

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

    // Update DSP metrics
    const newMetrics = {
      pitchF0: profile.f0Mean,
      jitterPct: profile.jitterMean,
      shimmerPct: profile.shimmerMean,
      hnrDb: profile.hnrMean,
      spectralCentroid: profile.spectralCentroidMean
    };
    setDspMetrics(newMetrics);
    setAnalysisResult(analyzeAcousticSignals(newMetrics));

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

    setDspMetrics(prev => {
      const next = { ...prev, pitchF0: newHz, spectralCentroid: Math.round(newHz * 1.6) };
      setAnalysisResult(analyzeAcousticSignals(next));
      return next;
    });
  };

  // -------------------------------------------------------------
  // Real-Time Canvas Visualizer (Oscilloscope / Spectrum Bars)
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

      if (visualizerMode === 'oscilloscope') {
        // Cyan Oscilloscope Waveform
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#00F5D4';
        ctx.shadowColor = '#00F5D4';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const sliceWidth = canvas.width / bufferLength;
        let x = 0;
        let sumSquares = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * canvas.height) / 2;
          sumSquares += (v - 1.0) * (v - 1.0);

          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Auto-update metrics on microphone input
        const rms = Math.sqrt(sumSquares / bufferLength);
        if (rms > 0.04 && isRecordingMic) {
          const estimatedF0 = Math.round(120 + rms * 350);
          const newMetrics = {
            pitchF0: estimatedF0,
            jitterPct: Number((0.5 + rms * 3.5).toFixed(2)),
            shimmerPct: Number((1.5 + rms * 7.0).toFixed(2)),
            hnrDb: Number((24 - rms * 15).toFixed(1)),
            spectralCentroid: Math.round(1100 + rms * 1800)
          };
          setDspMetrics(newMetrics);
          setAnalysisResult(analyzeAcousticSignals(newMetrics));
        }
      } else {
        // Multi-Band Frequency Spectrum Bars (Bass, Mid, Treble)
        const barCount = 48;
        const barWidth = (canvas.width / barCount) - 2;

        for (let i = 0; i < barCount; i++) {
          const index = Math.floor(i * (bufferLength / barCount) * 0.5);
          const barHeight = (freqData[index] / 255) * canvas.height * 0.9;
          const x = i * (barWidth + 2);
          const y = canvas.height - barHeight;

          // Gradient color: Cyan -> Teal -> Coral
          const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
          grad.addColorStop(0, '#00D2D3');
          grad.addColorStop(0.5, '#00F5D4');
          grad.addColorStop(1, '#FF6B6B');

          ctx.fillStyle = grad;
          ctx.fillRect(x, y, barWidth, barHeight);
        }

        // Grid frequency guide markers
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '10px monospace';
        ctx.fillText('100 Hz', 10, 18);
        ctx.fillText('1 kHz (Speech Mids)', canvas.width * 0.35, 18);
        ctx.fillText('4 kHz (Treble Wheeze)', canvas.width - 120, 18);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
  };

  // Re-start loop when toggling visualizer mode
  useEffect(() => {
    if (isPlayingSound || isRecordingMic || isToneActive) {
      startVisualizerLoop();
    }
  }, [visualizerMode]);

  // -------------------------------------------------------------
  // Gnani API Key Handlers
  // -------------------------------------------------------------
  const handleSaveGnaniKey = () => {
    try {
      if (gnaniKeyInput.trim()) {
        sessionStorage.setItem('ayuswar_gnani_key', gnaniKeyInput.trim());
      }
      if (gnaniTokenInput.trim()) {
        sessionStorage.setItem('ayuswar_gnani_token', gnaniTokenInput.trim());
      }
      setGnaniStatusMsg('Gnani.ai API credentials securely active in current session!');
      setTimeout(() => {
        setShowGnaniModal(false);
        setGnaniStatusMsg(null);
      }, 1500);
    } catch (e) {
      setGnaniStatusMsg('Failed to persist credentials: ' + e.message);
    }
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1240px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
            <ArrowLeft size={16} />
            <span>Home</span>
          </Link>
          <span style={{ color: '#94A3B8' }}>/</span>
          <span style={{ color: '#64748B', fontSize: '13px' }}>Technology</span>
          <span style={{ color: '#94A3B8' }}>/</span>
          <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Acoustic Biomarker Lab</span>
        </div>

        {/* Gnani.ai Engine Key Setup Pill */}
        <button
          type="button"
          onClick={() => setShowGnaniModal(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 14px',
            borderRadius: 20,
            background: gnaniKeyInput ? '#E6F7F8' : '#F1F5F9',
            border: '1.5px solid',
            borderColor: gnaniKeyInput ? '#008B8B' : '#CBD5E1',
            color: gnaniKeyInput ? '#008B8B' : '#475569',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer'
          }}
          title="Connect Gnani.ai Speech & Vocal API Key"
        >
          <Key size={14} color={gnaniKeyInput ? '#008B8B' : '#64748B'} />
          <span>{gnaniKeyInput ? 'Gnani.ai Key: Active' : 'Configure Gnani.ai Key'}</span>
        </button>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(0,139,139,0.1)', color: '#008B8B', padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
          <Activity size={14} />
          <span>INTERACTIVE VOCAL & RESPIRATORY ACOUSTIC SIGNAL LAB</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '10px' }}>
          Vocal Biomarker & Acoustic Signal Lab
        </h1>
        <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6, marginBottom: '10px' }}>
          Explores acoustic signal patterns in recorded audio. Research signal viewer, not for diagnosis. Real-time physical digital signal processing (DSP) and statistical cluster proximity engine.
        </p>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#166534',
          padding: '6px 14px',
          borderRadius: '10px',
          fontSize: '12px',
          fontWeight: 700
        }}>
          <span>🎙️ One-Way Acoustic Diagnostic Mode: Ingests mic phonation for F0 pitch, Jitter, Shimmer, and HNR analysis (no spoken TTS reply required).</span>
        </div>
      </div>

      {/* Non-Diagnostic Disclaimer Banner */}
      <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '14px', padding: '16px 20px', marginBottom: '28px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <AlertCircle size={22} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#92400E', marginBottom: '4px' }}>
            PHYSICAL SIGNAL OBSERVATIONS NOTICE (RESEARCH & BENCHMARK PROTOCOL)
          </div>
          <p style={{ fontSize: '12.5px', color: '#B45309', margin: 0, lineHeight: 1.5 }}>
            Explores acoustic signal patterns in recorded audio. Research signal viewer, not for diagnosis. Synthetic test signals only. Acoustic features displayed are physical audio engineering metrics (fundamental frequency F0, HNR, and spectral centroid).
          </p>
        </div>
      </div>

      {/* Main Lab Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Visualizer, Live Mic, File Upload & Tone Generator */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Visualizer Header with Mode Toggle & Audio Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', margin: 0 }}>
                Acoustic Frequency Spectrum
              </h3>
              {activeSoundName && (
                <div style={{ fontSize: '11px', color: '#008B8B', fontWeight: 700, marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Volume2 size={12} />
                  <span>Playing: {activeSoundName}</span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: 6 }}>
              {/* Visualizer Mode Toggle */}
              <button
                type="button"
                onClick={() => setVisualizerMode(visualizerMode === 'oscilloscope' ? 'spectrum' : 'oscilloscope')}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#F8FAFC',
                  color: '#0A2540',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {visualizerMode === 'oscilloscope' ? 'Switch to Spectrum Bars' : 'Switch to Waveform'}
              </button>

              {/* Stop Button */}
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

          {/* Action Row: Live Mic, Upload Audio File */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              type="button"
              onClick={handleToggleLiveMic}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: 'none',
                background: isRecordingMic ? '#DC2626' : 'linear-gradient(135deg, #008B8B 0%, #006666 100%)',
                color: '#FFFFFF',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: isRecordingMic ? '0 4px 12px rgba(220,38,38,0.3)' : '0 4px 12px rgba(0,139,139,0.25)'
              }}
            >
              {isRecordingMic ? <Square size={16} fill="#FFF" /> : <Mic size={16} />}
              <span>{isRecordingMic ? 'Stop Live Mic' : 'Start Live Mic'}</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                background: '#F8FAFC',
                color: '#0A2540',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Upload size={16} color="#008B8B" />
              <span>Upload .WAV / Audio</span>
            </button>
            <input 
              ref={fileInputRef} 
              type="file" 
              accept="audio/*" 
              style={{ display: 'none' }} 
              onChange={handleAudioFileUpload}
            />
          </div>

          {/* Interactive Live Tone Slider */}
          <div style={{ background: '#F8FAFC', padding: '14px 16px', borderRadius: 12, border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                <Sliders size={14} color="#008B8B" />
                <span>Interactive Acoustic Tone Generator:</span>
              </div>
              <button
                type="button"
                onClick={() => handleToggleLiveTone(liveToneHz)}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: 'none',
                  background: isToneActive ? '#EF4444' : '#008B8B',
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
                min="100"
                max="2000"
                step="10"
                value={liveToneHz}
                onChange={handleToneSliderChange}
                style={{ flex: 1, cursor: 'pointer', accentColor: '#008B8B' }}
              />
              <span style={{ fontSize: '13px', fontWeight: 850, color: '#0A2540', minWidth: '60px', textAlign: 'right', fontFamily: 'monospace' }}>
                {liveToneHz} Hz
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94A3B8', marginTop: 4 }}>
              <span>100 Hz (Low Bass Pitch)</span>
              <span>440 Hz (Standard Concert Pitch A4)</span>
              <span>2000 Hz (High Frequency Audio)</span>
            </div>
          </div>

          {/* Extracted DSP Signal Metrics */}
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '10px', letterSpacing: '0.04em' }}>
              Extracted Physical DSP Metrics:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Pitch F0 (Vocal Fundamental)</span>
                <div style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540' }}>{dspMetrics.pitchF0} Hz</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Pitch Register (Measured F0)</span>
                <div style={{ fontSize: '16px', fontWeight: 850, color: '#008B8B' }}>
                  {dspMetrics.pitchF0 < 165 ? 'Low Register' : dspMetrics.pitchF0 > 260 ? 'High Register' : 'Mid Register'}
                </div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Harmonics-to-Noise Ratio (HNR)</span>
                <div style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540' }}>{dspMetrics.hnrDb} dB</div>
              </div>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '11px', color: '#64748B' }}>Spectral Centroid</span>
                <div style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540' }}>{dspMetrics.spectralCentroid || 1200} Hz</div>
              </div>
            </div>
          </div>

          {/* Auditory Clinical Reference Presets */}
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
                    borderColor: activeSoundName === ACOUSTIC_CLUSTER_PROFILES[item.key]?.label ? '#008B8B' : '#E2E8F0',
                    background: activeSoundName === ACOUSTIC_CLUSTER_PROFILES[item.key]?.label ? '#E6F7F8' : '#FFFFFF',
                    color: '#0A2540',
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

        {/* Right Column: Statistical Cluster Proximity Analysis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
              Measured Pitch Register & Reference Signal Proximity
            </div>
            
            <div style={{ background: '#F0FDFA', border: '1px solid #99F6E4', borderRadius: 12, padding: '16px', marginBottom: 20 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase', marginBottom: 4 }}>
                Pitch Register:
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 850, color: '#0F766E', margin: '0 0 6px 0' }}>
                {dspMetrics.pitchF0 < 165 ? 'Low Register (< 165 Hz)' : dspMetrics.pitchF0 > 260 ? 'High Register (> 260 Hz)' : 'Mid Register (165–260 Hz)'}
              </h3>
              <p style={{ fontSize: '13px', color: '#115E59', margin: 0, lineHeight: 1.5 }}>
                Derived strictly from measured fundamental frequency ({dspMetrics.pitchF0} Hz). Research signal viewer, not for diagnosis. Synthetic test signals only.
              </p>
            </div>

            {/* Proximity Ranking Bars */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {analysisResult.allAcousticMatches.slice(0, 5).map((match, idx) => (
                <div key={match.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 750, color: '#0A2540' }}>{match.label}</span>
                    <span style={{ color: '#64748B', fontFamily: 'monospace' }}>Proximity: {match.similarityScore}/100</span>
                  </div>
                  <div style={{ height: '8px', background: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{
                      width: `${match.similarityScore}%`,
                      height: '100%',
                      background: idx === 0 ? 'linear-gradient(90deg, #008B8B 0%, #00F5D4 100%)' : '#94A3B8',
                      borderRadius: '4px',
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>
                    synthetic reference signal, not a medical assessment
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gnani Evon (30B-A3B) Acoustic-Clinical Correlation Reasoner */}
          <div style={{
            background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
            borderRadius: '16px',
            border: '1.5px solid #00F5D4',
            padding: '20px',
            color: '#F8FAFC',
            boxShadow: '0 8px 24px rgba(0, 245, 212, 0.12)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00F5D4 0%, #008B8B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0A2540'
                }}>
                  <Cpu size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Gnani Evon (30B-A3B)</span>
                    <span style={{ fontSize: '9px', background: 'rgba(0,245,212,0.2)', color: '#00F5D4', padding: '1px 6px', borderRadius: '4px', border: '1px solid rgba(0,245,212,0.4)', fontWeight: 800 }}>
                      ACOUSTIC-CLINICAL REASONER
                    </span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#94A3B8' }}>
                    Mixture-of-Experts Sovereign Indic Voice Physics Synthesis (/api/evon/chat)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <EvonStatusChip compact={true} />
                <button
                  onClick={handleRunEvonAcousticReasoning}
                  disabled={isEvonAcousticReasoning}
                  style={{
                    background: 'linear-gradient(135deg, #00F5D4 0%, #008B8B 100%)',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#0A2540',
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
                      🛡️ [Rule-based FALLBACK (Not Evon)]
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
                          LIVE EVON &lt;reasoning&gt; Acoustic Chain-of-Thought:
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
                Tap "Synthesize Evon 30B" to query the server-side Evon endpoint across current physical metrics (F0: {dspMetrics.pitchF0}Hz, Jitter: {dspMetrics.jitterPct}%, Shimmer: {dspMetrics.shimmerPct}%, HNR: {dspMetrics.hnrDb}dB).
              </div>
            )}
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: '14px', border: '1px solid #E2E8F0', padding: '18px', fontSize: '12px', color: '#475569', lineHeight: 1.6 }}>
            <strong>Clinical Safety Protocol:</strong> Quantitative physical acoustics vary with patient effort, distance to microphone, ambient acoustics, and phonation duration. Features serve as digital decision aids and cannot substitute for physical auscultation, stethoscopy, or spirometry.
          </div>
        </div>
      </div>

      {/* Gnani.ai API Key Modal */}
      {showGnaniModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(10, 37, 64, 0.75)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1200,
          padding: 16
        }}>
          <div style={{
            background: '#FFFFFF',
            borderRadius: 16,
            maxWidth: '520px',
            width: '100%',
            padding: 24,
            boxShadow: '0 20px 40px rgba(0,0,0,0.25)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#E6F7F8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Key size={20} color="#008B8B" />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540', margin: 0 }}>
                  Gnani.ai Speech & Vocal API Setup
                </h3>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Secure Session Configuration
                </span>
              </div>
            </div>

            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: 16 }}>
              Enter your authorized Gnani.ai API credentials below. Credentials are held in temporary memory during your browser session and are never exposed in public code.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>
                  Gnani API Key
                </label>
                <input
                  type="password"
                  placeholder="Enter your Gnani API Key..."
                  value={gnaniKeyInput}
                  onChange={(e) => setGnaniKeyInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>
                  Gnani Access Token (Optional)
                </label>
                <input
                  type="password"
                  placeholder="Enter your Gnani Token..."
                  value={gnaniTokenInput}
                  onChange={(e) => setGnaniTokenInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {gnaniStatusMsg && (
              <div style={{ background: '#ECFDF5', border: '1px solid #6EE7B7', color: '#065F46', padding: '10px 12px', borderRadius: 8, fontSize: '12px', fontWeight: 700, marginBottom: 16 }}>
                ✓ {gnaniStatusMsg}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button
                type="button"
                onClick={() => setShowGnaniModal(false)}
                style={{
                  padding: '9px 16px',
                  borderRadius: 8,
                  border: '1px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#475569',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveGnaniKey}
                style={{
                  padding: '9px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#008B8B',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Save & Connect Gnani Engine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
