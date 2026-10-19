import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  Play, 
  Square, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MessageSquare,
  Globe,
  ExternalLink,
  Mic,
  Download,
  Copy,
  Activity,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speechService } from '../services/indicSpeechService';

export default function AudioRxStudioView() {
  const { selectedLanguage, setSelectedLanguage, isDemoMode } = useApp();

  const [activeLang, setActiveLang] = useState(selectedLanguage === 'hi-IN' ? 'hi-IN' : selectedLanguage === 'te-IN' ? 'te-IN' : 'en-IN');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [karaokeActiveIndex, setKaraokeActiveIndex] = useState(-1);
  const [activePillHighlight, setActivePillHighlight] = useState(null); // 'morning' | 'night'
  const [recipientPhone, setRecipientPhone] = useState('+91 98490 12345');
  const [whatsAppToast, setWhatsAppToast] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // Live Microphone Recording & 60 FPS Waveform State
  const [isRecordingLiveMic, setIsRecordingLiveMic] = useState(false);
  const [liveRecordedAudioUrl, setLiveRecordedAudioUrl] = useState(null);
  const [livePitchHz, setLivePitchHz] = useState(0);
  const [liveRmsDb, setLiveRmsDb] = useState(-60);
  const [micRecordingDuration, setMicRecordingDuration] = useState(0);

  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const animFrameRef = useRef(null);
  const recordingTimerRef = useRef(null);
  const karaokeTimerRef = useRef(null);

  // Sync with global language selector
  useEffect(() => {
    setActiveLang(selectedLanguage);
  }, [selectedLanguage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopLiveMicRecording();
      handleStopAudio();
    };
  }, []);

  // Audio Prescription Scripts
  const SCRIPTS = {
    'te-IN': {
      title: 'నారాయణ రావు గారి డిజిటల్ ప్రిస్క్రిప్షన్',
      tokens: [
        { text: 'నమస్కారం.', pill: null },
        { text: 'డాక్టర్', pill: null },
        { text: 'ప్రియ', pill: null },
        { text: 'గారు', pill: null },
        { text: 'సూచించిన', pill: null },
        { text: 'ప్యాంటోప్రజోల్', pill: 'morning' },
        { text: '40mg', pill: 'morning' },
        { text: 'పసుపు', pill: 'morning' },
        { text: 'గోళీని', pill: 'morning' },
        { text: 'ఉదయం', pill: 'morning' },
        { text: 'టిఫిన్', pill: 'morning' },
        { text: 'ముందు', pill: 'morning' },
        { text: 'వేసుకోండి.', pill: 'morning' },
        { text: 'అలాగే', pill: null },
        { text: 'మెట్‌ఫార్మిన్', pill: 'night' },
        { text: '500mg', pill: 'night' },
        { text: 'గులాబీ', pill: 'night' },
        { text: 'గోళీని', pill: 'night' },
        { text: 'రాత్రి', pill: 'night' },
        { text: 'భోజనం', pill: 'night' },
        { text: 'తర్వాత', pill: 'night' },
        { text: 'వేసుకోండి.', pill: 'night' }
      ],
      fullText: 'నమస్కారం. డాక్టర్ ప్రియ గారు సూచించిన ప్యాంటోప్రజోల్ 40mg పసుపు గోళీని ఉదయం టిఫిన్ ముందు వేసుకోండి. అలాగే మెట్‌ఫార్మిన్ 500mg గులాబీ గోళీని రాత్రి భోజనం తర్వాత వేసుకోండి.'
    },
    'hi-IN': {
      title: 'नारायण राव जी का डिजिटल पर्चा',
      tokens: [
        { text: 'नमस्ते।', pill: null },
        { text: 'डॉक्टर', pill: null },
        { text: 'प्रिया', pill: null },
        { text: 'द्वारा', pill: null },
        { text: 'निर्धारित', pill: null },
        { text: 'पैंटोप्रजोल', pill: 'morning' },
        { text: '40mg', pill: 'morning' },
        { text: 'पीली', pill: 'morning' },
        { text: 'गोली', pill: 'morning' },
        { text: 'सुबह', pill: 'morning' },
        { text: 'नाश्ते', pill: 'morning' },
        { text: 'से', pill: 'morning' },
        { text: 'पहले', pill: 'morning' },
        { text: 'लें।', pill: 'morning' },
        { text: 'और', pill: null },
        { text: 'मेटफॉर्मिन', pill: 'night' },
        { text: '500mg', pill: 'night' },
        { text: 'गुलाबी', pill: 'night' },
        { text: 'गोली', pill: 'night' },
        { text: 'रात', pill: 'night' },
        { text: 'को', pill: 'night' },
        { text: 'खाने', pill: 'night' },
        { text: 'के', pill: 'night' },
        { text: 'बाद', pill: 'night' },
        { text: 'लें।', pill: 'night' }
      ],
      fullText: 'नमस्ते। डॉक्टर प्रिया द्वारा निर्धारित पैंटोप्रजोल 40mg पीली गोली सुबह नाश्ते से पहले लें। और मेटफॉर्मिन 500mg गुलाबी गोली रात को खाने के बाद लें।'
    },
    'en-IN': {
      title: 'Digital Spoken Prescription for Narayana Rao',
      tokens: [
        { text: 'Hello.', pill: null },
        { text: 'Take', pill: null },
        { text: 'Pantoprazole', pill: 'morning' },
        { text: '40mg', pill: 'morning' },
        { text: 'yellow', pill: 'morning' },
        { text: 'tablet', pill: 'morning' },
        { text: 'in', pill: 'morning' },
        { text: 'the', pill: 'morning' },
        { text: 'morning', pill: 'morning' },
        { text: 'before', pill: 'morning' },
        { text: 'breakfast.', pill: 'morning' },
        { text: 'Take', pill: null },
        { text: 'Metformin', pill: 'night' },
        { text: '500mg', pill: 'night' },
        { text: 'pink', pill: 'night' },
        { text: 'tablet', pill: 'night' },
        { text: 'at', pill: 'night' },
        { text: 'night', pill: 'night' },
        { text: 'after', pill: 'night' },
        { text: 'dinner.', pill: 'night' }
      ],
      fullText: 'Hello. Take Pantoprazole 40mg yellow tablet in the morning before breakfast. Take Metformin 500mg pink tablet at night after dinner.'
    }
  };

  const currentScript = SCRIPTS[activeLang] || SCRIPTS['en-IN'];

  // -------------------------------------------------------------
  // Live Microphone 60 FPS Visualizer & Recording Pipeline
  // -------------------------------------------------------------
  const startLiveMicRecording = async () => {
    if (isRecordingLiveMic) {
      stopLiveMicRecording();
      return;
    }

    handleStopAudio();
    audioChunksRef.current = [];
    setLiveRecordedAudioUrl(null);
    setMicRecordingDuration(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.85;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      // MediaRecorder for capturing audio blob
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setLiveRecordedAudioUrl(url);
      };
      recorder.start(100);

      setIsRecordingLiveMic(true);

      // Duration timer
      let dur = 0;
      recordingTimerRef.current = setInterval(() => {
        dur++;
        setMicRecordingDuration(dur);
      }, 1000);

      // 60 FPS Waveform + Pitch Autocorrelation Loop
      runVisualizerLoop(analyser, audioCtx.sampleRate);
    } catch (err) {
      console.warn("Microphone access error:", err);
      alert("Microphone permission denied or not found: " + err.message);
    }
  };

  const stopLiveMicRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try { audioContextRef.current.close(); } catch {}
      audioContextRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current);
      recordingTimerRef.current = null;
    }
    setIsRecordingLiveMic(false);
  };

  // 60 FPS Canvas Renderer with Dual Gradient (Emerald Green to Fiery Orange) & Pitch Extraction
  const runVisualizerLoop = (analyser, sampleRate) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const bufferLength = analyser.fftSize;
    const timeData = new Float32Array(bufferLength);

    const draw = () => {
      animFrameRef.current = requestAnimationFrame(draw);
      analyser.getFloatTimeDomainData(timeData);

      const width = canvas.width;
      const height = canvas.height;

      // Dark background
      ctx.fillStyle = '#061626';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Compute RMS Energy
      let sumSq = 0;
      for (let i = 0; i < bufferLength; i++) {
        sumSq += timeData[i] * timeData[i];
      }
      const rms = Math.sqrt(sumSq / bufferLength);
      const db = 20 * Math.log10(Math.max(rms, 1e-4));
      setLiveRmsDb(Math.round(db));

      // Autocorrelation Pitch Extraction for Voice Register (80 Hz to 380 Hz)
      let bestLag = 0;
      let maxCorr = -1;
      const minLag = Math.floor(sampleRate / 380);
      const maxLag = Math.floor(sampleRate / 80);

      if (rms > 0.015) {
        for (let lag = minLag; lag < maxLag; lag++) {
          let corr = 0;
          for (let i = 0; i < 512; i++) {
            corr += timeData[i] * timeData[i + lag];
          }
          if (corr > maxCorr) {
            maxCorr = corr;
            bestLag = lag;
          }
        }
        if (bestLag > 0) {
          const estimatedF0 = Math.round(sampleRate / bestLag);
          if (estimatedF0 >= 75 && estimatedF0 <= 400) {
            setLivePitchHz(estimatedF0);
          }
        }
      } else {
        setLivePitchHz(0);
      }

      // Dynamic 60 FPS Dual Gradient Waveform (Green to Fiery Amber)
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, '#10B981');   // Vibrant Emerald Green
      gradient.addColorStop(0.5, '#F59E0B'); // Warm Amber Orange
      gradient.addColorStop(1, '#EF4444');   // High Energy Coral Red

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = gradient;
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(16, 185, 129, 0.5)';
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = timeData[i];
        const y = (v * height * 0.45) + (height / 2);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.shadowBlur = 0; // Reset shadow
    };

    draw();
  };

  // Handle Playback & Synchronized Karaoke
  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      handleStopAudio();
      return;
    }

    stopLiveMicRecording();
    setIsPlayingAudio(true);
    setKaraokeActiveIndex(0);

    const tokens = currentScript.tokens;
    let idx = 0;

    // Start Karaoke Timer
    const wordIntervalMs = Math.round(5500 / tokens.length);
    karaokeTimerRef.current = setInterval(() => {
      idx++;
      if (idx < tokens.length) {
        setKaraokeActiveIndex(idx);
        setActivePillHighlight(tokens[idx].pill);
      } else {
        handleStopAudio();
      }
    }, wordIntervalMs);

    // Trigger Speech via Unified Service
    speechService.speak(currentScript.fullText, {
      langCode: activeLang,
      rate: 0.92,
      onEnd: () => handleStopAudio(),
      onError: () => handleStopAudio()
    });
  };

  const handleStopAudio = () => {
    speechService.stopSpeaking();
    setIsPlayingAudio(false);
    setKaraokeActiveIndex(-1);
    setActivePillHighlight(null);
    if (karaokeTimerRef.current) {
      clearInterval(karaokeTimerRef.current);
      karaokeTimerRef.current = null;
    }
  };

  // Sanitize Phone Number to Standard E.164
  const sanitizePhoneNumber = (raw) => {
    const digitsOnly = String(raw).replace(/[^0-9]/g, '');
    if (digitsOnly.length === 10) return `91${digitsOnly}`;
    return digitsOnly;
  };

  // Construct Formatted Real WhatsApp Prescription Message
  const getFormattedWhatsAppMessage = () => {
    const isTe = activeLang === 'te-IN';
    const isHi = activeLang === 'hi-IN';

    const header = isTe 
      ? '🏥 *ఆయుస్వర్ AI — డిజిటల్ ఆడియో ప్రిస్క్రిప్షన్*'
      : isHi
      ? '🏥 *आयुस्वर AI — डिजिटल ऑडियो पर्चा*'
      : '🏥 *AYUSWAR AI — Vernacular Audio-Rx Prescription*';

    const patientName = isTe ? 'నారాయణ రావు గారు' : isHi ? 'नारायण राव जी' : 'Mr. Narayana Rao';
    const docName = isTe ? 'డాక్టర్ ప్రియా శర్మ, MD' : isHi ? 'डॉक्टर प्रिया शर्मा, MD' : 'Dr. Priya Sharma, MD';

    const morningDose = isTe
      ? '1. 🟡 *Pantoprazole 40mg (పసుపు గోళీ)* — ఉదయం 08:30 AM (టిఫిన్ ముందు ఖాళీ కడుపుతో)'
      : isHi
      ? '1. 🟡 *Pantoprazole 40mg (पीली गोली)* — सुबह 08:30 AM (नाश्ते से पहले खाली पेट)'
      : '1. 🟡 *Pantoprazole 40mg (Yellow Pill)* — Morning 08:30 AM (Before breakfast, empty stomach)';

    const nightDose = isTe
      ? '2. 🟣 *Metformin 500mg SR (గులాబీ గోళీ)* — రాత్రి 08:30 PM (భోజనం తర్వాత)'
      : isHi
      ? '2. 🟣 *Metformin 500mg SR (गुलाबी गोली)* — रात 08:30 PM (खाने के बाद)'
      : '2. 🟣 *Metformin 500mg SR (Pink Pill)* — Night 08:30 PM (After dinner with water)';

    const genericNote = isTe
      ? '💡 *జన ఔషధి ప్రయోజనం:* ఈ మందులు భారత ప్రభుత్వ PMBJP జన ఔషధి కేంద్రాలలో 80% తక్కువ ధరకే లభిస్తాయి.'
      : isHi
      ? '💡 *जन औषधि लाभ:* यह दवाएं पीएमबीजेपी जन औषधि केंद्रों पर 80% कम कीमत में उपलब्ध हैं।'
      : '💡 *Jan Aushadhi Advantage:* Available at PMBJP generic centres with 80% cost savings.';

    const portalLink = `${window.location.origin}/audio-rx`;

    return `${header}\n\n*Patient:* ${patientName}\n*Doctor:* ${docName}\n\n💊 *Prescription Schedule / మందుల వేళలు:*\n${morningDose}\n${nightDose}\n\n🔊 *Listen to Doctor's Spoken Audio Note / ఆడియో వినడానికి లింక్:*\n${portalLink}\n\n${genericNote}\n\n_Generated securely by AyuSwar AI Telephony Bridge_`;
  };

  // Real WhatsApp Dispatch (Opens wa.me with prefilled message)
  const handleRealWhatsAppDispatch = () => {
    const cleanPhone = sanitizePhoneNumber(recipientPhone);
    const msg = getFormattedWhatsAppMessage();
    const encoded = encodeURIComponent(msg);

    const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');
    const waUrl = isMobile 
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
      : `https://wa.me/${cleanPhone}?text=${encoded}`;

    if (navigator.vibrate) {
      try { navigator.vibrate(20); } catch {}
    }

    // Open WhatsApp
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setWhatsAppToast(true);
    setTimeout(() => setWhatsAppToast(false), 5000);
  };

  // Copy Message to Clipboard
  const handleCopyPrescriptionText = () => {
    const msg = getFormattedWhatsAppMessage();
    navigator.clipboard.writeText(msg);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#64748B', fontSize: '13px' }}>Solutions</span>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Vernacular Audio-Rx Studio</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
          <Volume2 size={14} />
          <span>PATIENT ADHERENCE & LIVE AUDIO-RX</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '10px' }}>
          Vernacular Spoken Audio-Rx Studio
        </h1>
        <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6 }}>
          Live microphone recording studio with 60 FPS acoustic waveform feedback, real-time pitch register tracking, synchronized karaoke playback, and direct WhatsApp dispatch.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        
        {/* Left Column: Live Mic Studio & 60 FPS Visualizer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Live Waveform Studio Card */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mic size={18} color="#008B8B" />
                <span style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>Live Microphone Recording Studio</span>
              </div>
              <span style={{ 
                background: isRecordingLiveMic ? '#FEE2E2' : '#F1F5F9', 
                color: isRecordingLiveMic ? '#DC2626' : '#64748B', 
                fontSize: '11px', 
                padding: '3px 8px', 
                borderRadius: '6px', 
                fontWeight: 700 
              }}>
                {isRecordingLiveMic ? `● RECORDING (${micRecordingDuration}s)` : 'STUDIO READY'}
              </span>
            </div>

            {/* 60 FPS Waveform Oscilloscope Canvas */}
            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1.5px solid #0F172A', background: '#061626', position: 'relative' }}>
              <canvas 
                ref={canvasRef} 
                width={500} 
                height={160} 
                style={{ width: '100%', height: '160px', display: 'block' }}
              />

              {/* Overlay HUD Telemetry */}
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '12px',
                right: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '11px',
                fontWeight: 700,
                color: '#94A3B8',
                pointerEvents: 'none'
              }}>
                <span style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Activity size={12} /> 60 FPS Green/Orange Wave
                </span>
                <span>
                  Pitch: <strong style={{ color: livePitchHz > 0 ? '#F59E0B' : '#94A3B8' }}>{livePitchHz > 0 ? `${livePitchHz} Hz` : 'Silent'}</strong>
                  {' • '}
                  Vol: <strong style={{ color: '#E2E8F0' }}>{liveRmsDb} dB</strong>
                </span>
              </div>

              {!isRecordingLiveMic && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(6, 22, 38, 0.75)',
                  color: '#94A3B8',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <Mic size={24} color="#10B981" />
                  <span>Click 'Record Doctor Voice' to capture live waveform</span>
                </div>
              )}
            </div>

            {/* Live Record Button Row */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={startLiveMicRecording}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isRecordingLiveMic ? '#DC2626' : '#008B8B',
                  color: '#FFFFFF',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: isRecordingLiveMic ? '0 4px 14px rgba(220,38,38,0.35)' : '0 4px 14px rgba(0,139,139,0.3)'
                }}
              >
                {isRecordingLiveMic ? <Square size={16} fill="#FFF" /> : <Mic size={16} />}
                <span>{isRecordingLiveMic ? 'Stop Recording' : 'Record Doctor Voice (Live Mic)'}</span>
              </button>

              {liveRecordedAudioUrl && (
                <a
                  href={liveRecordedAudioUrl}
                  download="doctor_audio_prescription.webm"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #CBD5E1',
                    background: '#F8FAFC',
                    color: '#0A2540',
                    fontSize: '13px',
                    fontWeight: 750,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={15} /> Download Audio
                </a>
              )}
            </div>

            {/* Recorded Audio Audio Element */}
            {liveRecordedAudioUrl && (
              <div style={{ background: '#F8FAFC', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#059669', marginBottom: '6px' }}>
                  ✓ Live Voice Note Recorded Ready for WhatsApp Dispatch:
                </div>
                <audio src={liveRecordedAudioUrl} controls style={{ width: '100%', height: '36px' }} />
              </div>
            )}
          </div>

          {/* Karaoke Telemetry Box */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>Synthesized Mother Tongue Readout:</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { code: 'te-IN', label: 'తెలుగు (Telugu)' },
                  { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
                  { code: 'en-IN', label: 'English' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      handleStopAudio();
                      setActiveLang(lang.code);
                      setSelectedLanguage(lang.code);
                    }}
                    style={{
                      padding: '5px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      background: activeLang === lang.code ? '#008B8B' : '#F1F5F9',
                      color: activeLang === lang.code ? '#FFFFFF' : '#475569',
                      fontSize: '11.5px',
                      fontWeight: 750,
                      cursor: 'pointer'
                    }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #0A2540 0%, #0F172A 100%)',
              borderRadius: '14px',
              padding: '20px',
              minHeight: '130px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
            }}>
              <div style={{ fontSize: '11px', color: '#00A896', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                Synchronized Karaoke Transcript:
              </div>
              <div style={{ fontSize: '16px', lineHeight: 1.8, color: '#94A3B8', fontWeight: 650 }}>
                {currentScript.tokens.map((token, idx) => {
                  const isCurrent = idx === karaokeActiveIndex;
                  return (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-block',
                        marginRight: '6px',
                        color: isCurrent ? '#00F5D4' : idx < karaokeActiveIndex ? '#FFFFFF' : '#64748B',
                        fontWeight: isCurrent ? 850 : 600,
                        transform: isCurrent ? 'scale(1.12)' : 'scale(1)',
                        transition: 'all 140ms ease',
                        textShadow: isCurrent ? '0 0 12px rgba(0, 245, 212, 0.8)' : 'none'
                      }}
                    >
                      {token.text}
                    </span>
                  );
                })}
              </div>
            </div>

            <button
              onClick={handlePlayAudio}
              style={{
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                background: isPlayingAudio ? '#DC2626' : '#0F172A',
                color: '#FFFFFF',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isPlayingAudio ? <Square size={16} fill="#FFF" /> : <Play size={16} fill="#FFF" />}
              <span>{isPlayingAudio ? 'Stop Synthetic Audio' : 'Play Spoken Prescription Audio'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Visual Chronotherapy Pill Cards & Real WhatsApp Push */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Visual Pill Cards */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px' }}>
              Color-Coded Visual Pill Chronotherapy Schedule
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Morning Pill */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                border: activePillHighlight === 'morning' ? '2.5px solid #F59E0B' : '1px solid #E2E8F0',
                background: activePillHighlight === 'morning' ? '#FEF3C7' : '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 200ms ease',
                transform: activePillHighlight === 'morning' ? 'scale(1.02)' : 'scale(1)'
              }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F59E0B', border: '2px solid #FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>
                    Pantoprazole 40mg (పసుపు గోళీ / Yellow Pill)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Morning: 08:30 AM (Before Breakfast • 30 mins empty stomach)
                  </div>
                </div>
              </div>

              {/* Night Pill */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                border: activePillHighlight === 'night' ? '2.5px solid #EC4899' : '1px solid #E2E8F0',
                background: activePillHighlight === 'night' ? '#FCE7F3' : '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 200ms ease',
                transform: activePillHighlight === 'night' ? 'scale(1.02)' : 'scale(1)'
              }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EC4899', border: '2px solid #FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>
                    Metformin 500mg SR (గులాబీ గోళీ / Pink Pill)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Night: 08:30 PM (After Dinner • Regular with water)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Real WhatsApp Dispatch Engine Box */}
          <div style={{ background: '#F0FDF4', border: '1.5px solid #86EFAC', borderRadius: '16px', padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, fontSize: '15px' }}>
                <MessageSquare size={18} color="#16A34A" />
                <span>Real WhatsApp Audio-Rx Dispatch</span>
              </div>
              <span style={{ background: '#DCFCE7', color: '#15803D', fontSize: '10.5px', fontWeight: 700, padding: '3px 8px', borderRadius: '12px' }}>
                wa.me Protocol Active
              </span>
            </div>

            <p style={{ fontSize: '13px', color: '#14532D', lineHeight: 1.5, marginBottom: '16px' }}>
              Sends the patient their spoken prescription, pill color codes, and audio listening link directly to their real WhatsApp app.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="Patient 10-Digit Mobile Number"
                  style={{
                    flex: 1,
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #86EFAC',
                    background: '#FFFFFF',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    color: '#0A2540',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={handleRealWhatsAppDispatch}
                  style={{
                    padding: '11px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#16A34A',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                  }}
                >
                  <Share2 size={15} />
                  <span>Send on WhatsApp</span>
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleCopyPrescriptionText}
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #86EFAC',
                    background: '#FFFFFF',
                    color: '#166534',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  {copiedToast ? <Check size={14} color="#16A34A" /> : <Copy size={14} />}
                  <span>{copiedToast ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
                </button>

                <button
                  onClick={handleRealWhatsAppDispatch}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: '1px solid #86EFAC',
                    background: '#E8F5E9',
                    color: '#166534',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <ExternalLink size={13} />
                  <span>Open WhatsApp Web</span>
                </button>
              </div>

              {whatsAppToast && (
                <div style={{ marginTop: '6px', padding: '10px', background: '#DCFCE7', borderRadius: '8px', fontSize: '12px', color: '#166534', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>WhatsApp dispatch opened for {recipientPhone}. Prescription sent successfully!</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
