import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Volume2, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Share2, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Camera, 
  Cpu, 
  QrCode,
  Smartphone,
  Heart,
  Thermometer,
  Droplets,
  Printer,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import AuthenticQrCode from './AuthenticQrCode';
import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters';
import WhatsAppAudioRxModal from './WhatsAppAudioRxModal';

/**
 * ClinicalConsole Component
 * High-performance clinical telemetry workspace for ambient OPD encounters.
 * Integrates WebAudio FFT visualizers, dual-speaker diarization, simulated acoustic features,
 * colloquial-to-ICD10 ontology mapping, vernacular karaoke speech, and ABDM FHIR R4 export.
 */
export default function ClinicalConsole({ doctorProfile, initialEncounterIndex = 0 }) {
  const navigate = useNavigate();
  const [selectedEncounterIndex, setSelectedEncounterIndex] = useState(initialEncounterIndex);
  const currentEncounter = CLINICAL_ENCOUNTERS[selectedEncounterIndex];

  // Audio Playback & Synchronized Karaoke
  const [isPlayingAudioRx, setIsPlayingAudioRx] = useState(false);
  const [karaokeActiveIndex, setKaraokeActiveIndex] = useState(-1);
  const audioRxTimerRef = useRef(null);

  // Live Consultation Simulation Flow
  const [isSimulatingEncounter, setIsSimulatingEncounter] = useState(false);
  const [visibleDialogueCount, setVisibleDialogueCount] = useState(3);
  const dialogueTimerRef = useRef(null);

  // Browser Microphone Telemetry
  const [isLiveMicActive, setIsLiveMicActive] = useState(false);
  const [micVolume, setMicVolume] = useState(20);
  const micIntervalRef = useRef(null);

  // Tesseract Strip Scanner Integration
  const [showVisionScanner, setShowVisionScanner] = useState(false);
  const [scannedStripStatus, setScannedStripStatus] = useState(null);
  
  // WhatsApp Vernacular Audio-Rx Modal
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showFhirModal, setShowFhirModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Switch encounter
  const handleSelectEncounter = (index) => {
    setSelectedEncounterIndex(index);
    setIsPlayingAudioRx(false);
    setKaraokeActiveIndex(-1);
    setVisibleDialogueCount(3);
    setScannedStripStatus(null);
    if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  };

  // Dialogue simulation replay
  const handleStartSimulation = () => {
    setIsSimulatingEncounter(true);
    setVisibleDialogueCount(1);
    let count = 1;
    if (dialogueTimerRef.current) clearInterval(dialogueTimerRef.current);
    
    dialogueTimerRef.current = setInterval(() => {
      count++;
      setVisibleDialogueCount(count);
      if (count >= currentEncounter.dialogue.length) {
        clearInterval(dialogueTimerRef.current);
        setIsSimulatingEncounter(false);
      }
    }, 2400);
  };

  // Play Spoken Audio-Rx with Word-by-Word Karaoke Synchronization
  const togglePlayAudioRx = () => {
    if (isPlayingAudioRx) {
      setIsPlayingAudioRx(false);
      if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
      setKaraokeActiveIndex(-1);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsPlayingAudioRx(true);
      const totalWords = currentEncounter.karaokeWordsTelugu.length;
      let currentIndex = 0;
      setKaraokeActiveIndex(0);

      // Trigger Web Speech API speech synthesis
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentEncounter.fullAudioRxTelugu);
        utterance.lang = currentEncounter.langCode;
        utterance.rate = 0.95;
        window.speechSynthesis.speak(utterance);
      }

      if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
      audioRxTimerRef.current = setInterval(() => {
        currentIndex++;
        if (currentIndex < totalWords) {
          setKaraokeActiveIndex(currentIndex);
        } else {
          clearInterval(audioRxTimerRef.current);
          setIsPlayingAudioRx(false);
          setKaraokeActiveIndex(-1);
        }
      }, 900);
    }
  };

  // Real Physical Microphone & WebAudio FFT Analyser
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const speechRecognitionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const [liveTranscriptionText, setLiveTranscriptionText] = useState('');
  const [micStatusMsg, setMicStatusMsg] = useState('');
  const [customTurns, setCustomTurns] = useState([]);

  // Toggle Live Physical Microphone & Continuous Speech Recognition
  const toggleLiveMic = async () => {
    if (isLiveMicActive) {
      // Cleanly stop all streams and audio contexts
      setIsLiveMicActive(false);
      setMicStatusMsg('');
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
        mediaStreamRef.current = null;
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch {}
        audioContextRef.current = null;
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch {}
        speechRecognitionRef.current = null;
      }
      setMicVolume(0);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;

        // 1. Real WebAudio FFT Frequency Analysis
        const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioCtxClass();
        audioContextRef.current = audioCtx;
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        analyserRef.current = analyser;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateRealVolume = () => {
          if (!analyserRef.current) return;
          analyserRef.current.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          const avg = sum / dataArray.length;
          const realDb = Math.min(100, Math.round((avg / 128) * 100));
          setMicVolume(realDb);
          animationFrameRef.current = requestAnimationFrame(updateRealVolume);
        };
        updateRealVolume();
        setIsLiveMicActive(true);
        setMicStatusMsg('Physical Microphone Active — Speak to Scribe Note');

        // 2. Real Continuous Web Speech Recognition
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRec) {
          const rec = new SpeechRec();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = currentEncounter.langCode || 'en-IN';

          rec.onresult = (e) => {
            let interim = '';
            let finalStr = '';
            for (let i = e.resultIndex; i < e.results.length; i++) {
              const transcript = e.results[i][0].transcript;
              if (e.results[i].isFinal) {
                finalStr += transcript + ' ';
              } else {
                interim += transcript;
              }
            }
            if (finalStr.trim()) {
              setCustomTurns(prev => [
                ...prev,
                {
                  speaker: 'Doctor (Physical Mic)',
                  text: finalStr.trim(),
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                }
              ]);
              setLiveTranscriptionText('');
            } else if (interim.trim()) {
              setLiveTranscriptionText(interim.trim());
            }
          };

          rec.onerror = (err) => {
            console.warn('Speech recognition warning:', err.error);
          };

          rec.onend = () => {
            if (mediaStreamRef.current && speechRecognitionRef.current) {
              try { speechRecognitionRef.current.start(); } catch {}
            }
          };

          speechRecognitionRef.current = rec;
          try { rec.start(); } catch {}
        }
      } catch (err) {
        console.warn('Physical microphone access error, using client audio generator:', err);
        setMicStatusMsg('Hardware mic permission not granted. Running local audio frequency simulator.');
        setIsLiveMicActive(true);
        micIntervalRef.current = setInterval(() => {
          setMicVolume(Math.floor(25 + Math.sin(Date.now() * 0.003) * 20));
        }, 150);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
      if (dialogueTimerRef.current) clearInterval(dialogueTimerRef.current);
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      if (audioContextRef.current) {
        try { audioContextRef.current.close(); } catch {}
      }
      if (speechRecognitionRef.current) {
        try { speechRecognitionRef.current.stop(); } catch {}
      }
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '20px 24px 80px 24px' }}>
      {/* Top Clinical Navigation Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={() => navigate('/doctor-portal')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid #CBD5E1',
            color: '#334155',
            fontSize: '13px',
            fontWeight: 650,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = '#F1F5F9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = '#ffffff'; }}
        >
          ← Return to Doctor OPD
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#64748B', fontWeight: 600 }}>
          <span>Ambient Clinical Telemetry Console</span>
          <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
          <span style={{ color: '#059669', fontWeight: 700 }}>Client Ephemeral Mode (SIMULATION)</span>
        </div>
      </div>
      {/* =========================================================================
          TOP PATIENT CLINICAL BANNER & VITALS TICKER
          ========================================================================= */}
      <div className="glass-panel" style={{ padding: '18px 24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0F4C5C 0%, #D4AF37 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px',
              boxShadow: '0 4px 14px rgba(15, 76, 92, 0.35)'
            }}>
              {currentEncounter.patient.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '18px', color: '#0F4C5C', fontWeight: 800 }}>
                  {currentEncounter.patient.name}
                </h2>
                <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '2px 8px', borderRadius: '12px', fontWeight: 650, color: '#334155' }}>
                  {currentEncounter.patient.gender}, {currentEncounter.patient.age}y
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(212, 175, 55, 0.16)', color: '#6A5005', border: '1px solid rgba(212, 175, 55, 0.4)', padding: '2px 8px', borderRadius: '12px', fontWeight: 750 }}>
                  ABHA: {currentEncounter.patient.abhaId}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#3D545E', marginTop: '2px' }}>
                Facility: {currentEncounter.patient.location} • Attending: {doctorProfile ? doctorProfile.doctorName : 'Dr. Ananya Sharma, MD'}
              </div>
            </div>
          </div>

          {/* Quick Scenario Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            {CLINICAL_ENCOUNTERS.map((enc, idx) => (
              <button
                key={enc.id}
                onClick={() => handleSelectEncounter(idx)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '12.5px',
                  fontWeight: 650,
                  fontFamily: 'Outfit, sans-serif',
                  border: selectedEncounterIndex === idx ? '2px solid #0F4C5C' : '1px solid #D1E1E6',
                  background: selectedEncounterIndex === idx ? 'rgba(15, 76, 92, 0.12)' : '#ffffff',
                  color: selectedEncounterIndex === idx ? '#0F4C5C' : '#091E26',
                  cursor: 'pointer',
                  transition: 'all 160ms ease'
                }}
              >
                {enc.language}
              </button>
            ))}

            <button
              onClick={toggleLiveMic}
              style={{
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '12.5px',
                fontWeight: 650,
                fontFamily: 'Outfit, sans-serif',
                border: isLiveMicActive ? '2px solid #EF4444' : '1px solid #D8E7EB',
                background: isLiveMicActive ? 'rgba(239, 68, 68, 0.12)' : '#ffffff',
                color: isLiveMicActive ? '#EF4444' : '#0B2545',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {isLiveMicActive ? <MicOff size={14} /> : <Mic size={14} />}
              <span>{isLiveMicActive ? 'Mute Live Mic' : 'Live Mic Stream'}</span>
            </button>
          </div>
        </div>

        {/* Vitals Ribbon */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #E2E8F0'
        }}>
          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '10px', border: '1px solid #D1E1E6' }}>
            <div style={{ fontSize: '10.5px', color: '#3D545E', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Heart size={12} color="#D64550" /> Blood Pressure
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.bp}</div>
          </div>

          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '10px', border: '1px solid #D1E1E6' }}>
            <div style={{ fontSize: '10.5px', color: '#3D545E', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={12} color="#0F4C5C" /> Heart Rate
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.heartRate}</div>
          </div>

          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '10px', border: '1px solid #D1E1E6' }}>
            <div style={{ fontSize: '10.5px', color: '#3D545E', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets size={12} color="#176579" /> SpO2 Oxygen
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.spo2}</div>
          </div>

          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '10px', border: '1px solid #D1E1E6' }}>
            <div style={{ fontSize: '10.5px', color: '#3D545E', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Thermometer size={12} color="#D4AF37" /> Temperature
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.temp}</div>
          </div>

          <div style={{ background: '#FAF8F5', padding: '8px 12px', borderRadius: '10px', border: '1px solid #D1E1E6' }}>
            <div style={{ fontSize: '10.5px', color: '#3D545E', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="#6D214F" /> Blood Sugar
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#091E26' }}>{currentEncounter.vitals.bloodSugar}</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BALANCED 2-COLUMN ERGONOMIC WORKSPACE
          ========================================================================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* =========================================================================
            COLUMN 1: AMBIENT DIALOGUE, SIGNAL DSP & ONTOLOGY
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Ambient Dialogue Transcript Stream */}
          <div className="glass-panel" style={{ padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F4C5C' }}>
                  Ambient Multi-Speaker Transcript
                </h3>
                <div style={{ fontSize: '11px', color: '#3D545E' }}>
                  Browser speech (Web Speech API). Gnani voice integration: planned.
                </div>
              </div>

              <button
                onClick={handleStartSimulation}
                disabled={isSimulatingEncounter}
                className="btn-outline"
                style={{ fontSize: '12px', padding: '7px 16px' }}
              >
                {isSimulatingEncounter ? 'Capturing Speech...' : 'Replay Dialogue Flow'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minHeight: '180px' }}>
              {[
                ...currentEncounter.dialogue.slice(0, visibleDialogueCount),
                ...customTurns
              ].map((turn, i) => {
                const isDoc = turn.speaker.includes('Doctor');
                return (
                  <div
                    key={i}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: isDoc ? 'rgba(15, 76, 92, 0.05)' : 'rgba(212, 175, 55, 0.08)',
                      borderLeft: isDoc ? '3.5px solid #0F4C5C' : '3.5px solid #D4AF37'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: isDoc ? '#0F4C5C' : '#6A5005' }}>
                        {turn.speaker}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748B' }}>{turn.time}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#091E26', lineHeight: 1.5, fontWeight: 500 }}>
                      {turn.text}
                    </div>
                  </div>
                );
              })}

              {liveTranscriptionText && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'rgba(15, 76, 92, 0.08)',
                  border: '1.5px dashed #0F4C5C',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  animation: 'pulse 1.5s infinite'
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} />
                  <div style={{ fontSize: '13.5px', color: '#0F4C5C', fontWeight: 650 }}>
                    Listening: "{liveTranscriptionText}..."
                  </div>
                </div>
              )}

              {micStatusMsg && (
                <div style={{ fontSize: '11px', color: '#64748B', fontStyle: 'italic', padding: '2px 4px' }}>
                  ℹ️ {micStatusMsg}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: WebAudio FFT Spectrogram & Code-Switching Radar */}
          <div className="dark-telemetry-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#D4AF37" />
                <h3 style={{ fontSize: '14px', color: '#ffffff', fontWeight: 750 }}>
                  Real-time WebAudio STFT Spectrogram & Code-Switching
                </h3>
              </div>
              <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>
                {isLiveMicActive ? `Live Mic (${micVolume} dB)` : '16 kHz PCM Stream'}
              </span>
            </div>

            {/* Sound Wave Spectrum Bars */}
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '60px', gap: '3px', marginBottom: '14px' }}>
              {[...Array(32)].map((_, i) => {
                const barHeight = isLiveMicActive 
                  ? Math.max(8, (micVolume * (1 + Math.sin(i * 0.4))) % 56)
                  : isPlayingAudioRx 
                    ? Math.max(10, (36 * (1 + Math.cos(i * 0.5 + Date.now() * 0.005))) % 54)
                    : Math.max(6, (22 * (1 + Math.sin(i * 0.5))) % 42);
                return (
                  <div 
                    key={i} 
                    style={{
                      flex: 1,
                      height: `${barHeight}px`,
                      background: i % 2 === 0 ? 'linear-gradient(to top, #0F4C5C, #D4AF37)' : 'linear-gradient(to top, #D97706, #FBBF24)',
                      borderRadius: '2px',
                      transition: 'height 0.12s ease'
                    }}
                  />
                );
              })}
            </div>

            {/* Dialect Breakdown Meter */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.06)',
              padding: '10px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '11.5px'
            }}>
              <span style={{ color: '#94A3B8' }}>Phonetic Code-Switching Ratio (sample model):</span>
              <span style={{ color: '#D4AF37', fontWeight: 750 }}>
                {currentEncounter.langCode.startsWith('te') ? 'Telugu' : 'Hindi'} + Clinical English + Colloquial (sample data)
              </span>
            </div>
          </div>

          {/* Card 3: Acoustic Respiratory Biomarkers HUD (DSP Signal Simulation) */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Activity size={18} color="#D97706" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>
                Acoustic Respiratory Biomarkers (Experimental DSP)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Respiratory Effort & Strain</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>
                  {currentEncounter.acousticBiomarkers.respiratoryEffort}
                </div>
              </div>

              <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Cough Acoustic Signature</div>
                <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#081C24', marginTop: '2px' }}>
                  {currentEncounter.acousticBiomarkers.coughType}
                </div>
              </div>

              <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Vocal Jitter & Shimmer</div>
                <div style={{ fontSize: '13px', fontWeight: 750, color: '#0F4C5C', marginTop: '2px' }}>
                  {currentEncounter.acousticBiomarkers.jitterPercent} / {currentEncounter.acousticBiomarkers.shimmerDb}
                </div>
              </div>

              <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Triage Risk Category</div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', marginTop: '2px' }}>
                  {currentEncounter.acousticBiomarkers.riskCategory}
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Vernacular Semantic Ontology Mapping */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Cpu size={18} color="#0F4C5C" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>
                Vernacular Metaphor → WHO ICD-10 & SNOMED Semantic Resolver
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {currentEncounter.vernacularMappings.map((map, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#FAF8F5',
                    border: '1px solid #E2E8F0',
                    fontSize: '12px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 800, color: '#D97706', fontSize: '13px' }}>{map.dialect}</div>
                    <div style={{ color: '#475569', fontSize: '12px' }}>{map.clinicalTerm}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      fontWeight: 800,
                      background: 'rgba(15, 76, 92, 0.12)',
                      color: '#0F4C5C',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}>
                      ICD-10: {map.icd10}
                    </span>
                    <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '3px' }}>
                      SNOMED-CT: {map.snomed}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            COLUMN 2: THE KILLER FEATURE — KARAOKE AUDIO-RX & VISION SCANNER
            ========================================================================= */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 5: Spoken Vernacular Audio-Rx with Word Karaoke */}
          <div className="glass-panel" style={{
            padding: '24px',
            border: '2px solid rgba(15, 76, 92, 0.35)',
            boxShadow: '0 16px 36px rgba(15, 76, 92, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Volume2 size={22} color="#0F4C5C" />
                <h3 style={{ fontSize: '16px', fontWeight: 850, color: '#0F4C5C' }}>
                  Spoken Vernacular Audio-Rx (Browser speech)
                </h3>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#5E4605',
                background: 'linear-gradient(135deg, #FFFDF5 0%, #FBF3D6 100%)',
                border: '1px solid #D4AF37',
                padding: '3px 8px',
                borderRadius: '12px'
              }}>
                SYNCHRONIZED KARAOKE
              </span>
            </div>

            {/* Doctor Ananya Speaking Avatar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 16px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(15, 76, 92, 0.07) 0%, rgba(212, 175, 55, 0.08) 100%)',
              marginBottom: '16px',
              border: '1px solid rgba(15, 76, 92, 0.2)'
            }}>
              <div style={{
                position: 'relative',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid #0F4C5C',
                flexShrink: 0
              }}>
                <img 
                  src="/assets/dr_ananya_avatar.jpg" 
                  alt="Dr. Ananya"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {isPlayingAudioRx && (
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '14px',
                    background: 'rgba(15, 76, 92, 0.92)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px'
                  }}>
                    <span style={{ width: '2px', height: '6px', background: '#D4AF37', animation: 'waveOscillate 0.5s infinite' }}></span>
                    <span style={{ width: '2px', height: '10px', background: '#ffffff', animation: 'waveOscillate 0.5s infinite 0.1s' }}></span>
                    <span style={{ width: '2px', height: '7px', background: '#D4AF37', animation: 'waveOscillate 0.5s infinite 0.2s' }}></span>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F4C5C' }}>
                  Dr. Ananya — Virtual Attending
                </div>
                <div style={{ fontSize: '11px', color: '#3D545E' }}>
                  Synthesizing spoken dosage instructions in {currentEncounter.language}
                </div>
              </div>
            </div>

            {/* Glowing Karaoke Word Display */}
            <div style={{
              background: '#061626',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px',
              minHeight: '88px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              lineHeight: 1.8
            }}>
              {currentEncounter.karaokeWordsTelugu.map((item, idx) => (
                <span
                  key={idx}
                  className={`karaoke-pill ${karaokeActiveIndex === idx ? 'active' : ''}`}
                >
                  {item.word}
                </span>
              ))}
            </div>

            {/* Audio Rx Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px', marginBottom: '18px' }}>
              <button
                onClick={togglePlayAudioRx}
                className="btn-teal"
                style={{ justifyContent: 'center', padding: '12px 14px', fontSize: '13px' }}
              >
                {isPlayingAudioRx ? <Pause size={15} /> : <Play size={15} fill="#ffffff" />}
                <span>{isPlayingAudioRx ? 'Pause Voice Note' : 'Play Vernacular Rx'}</span>
              </button>

              <button
                onClick={() => setShowWhatsAppModal(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px 14px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
                }}
              >
                <Smartphone size={16} />
                <span>WhatsApp Audio-Rx</span>
              </button>
            </div>

            {/* Visual Color-Coded Pill Schedule */}
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F4C5C', marginBottom: '10px' }}>
              Color-Coded Visual Pill Schedule for Patient:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentEncounter.medications.map((med, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: '#ffffff',
                    border: '1px solid #D1E1E6',
                    boxShadow: '0 2px 6px rgba(15, 76, 92, 0.04)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      background: med.color,
                      boxShadow: `0 0 8px ${med.color}`
                    }} />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 750, color: '#091E26' }}>{med.name}</div>
                      <div style={{ fontSize: '11px', color: '#3D545E' }}>{med.colorLabel}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#0F4C5C' }}>
                    {med.timing}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Tesseract Blister Strip Scanner & Safety Guard */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="#D4AF37" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0F4C5C' }}>
                  Tesseract Blister Strip Scanner
                </h3>
              </div>
              <button
                onClick={() => {
                  setScannedStripStatus('Analyzing medicine packaging contours & text...');
                  setTimeout(() => {
                    setScannedStripStatus('Detected: Ecosprin 75mg Gastro-resistant (Batch #IND-891). Verified safe against current prescription.');
                  }, 1200);
                }}
                className="btn-outline"
                style={{ fontSize: '12px', padding: '6px 14px' }}
              >
                Simulate Strip OCR
              </button>
            </div>

            {scannedStripStatus ? (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                color: '#065F46',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} />
                <span>{scannedStripStatus}</span>
              </div>
            ) : (
              <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.5 }}>
                Computer vision contour detection checks previous medicine strips to guard against fatal double-dosing and verify drug brand authenticity.
              </p>
            )}
          </div>

          {/* Card 7: Action Row (ABDM FHIR R4, WhatsApp Dispatch, Print QR) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            <button
              onClick={() => setShowFhirModal(true)}
              className="btn-outline"
              style={{ justifyContent: 'center', fontSize: '12px', padding: '10px 8px' }}
            >
              <FileText size={15} />
              <span>FHIR R4 JSON</span>
            </button>

            <button
              onClick={() => setShowWhatsAppModal(true)}
              className="btn-primary"
              style={{ justifyContent: 'center', fontSize: '12px', padding: '10px 8px', background: '#128C7E' }}
            >
              <Smartphone size={15} />
              <span>WhatsApp Rx</span>
            </button>

            <button
              onClick={() => setShowPrintModal(true)}
              className="btn-primary"
              style={{ justifyContent: 'center', fontSize: '12px', padding: '10px 8px' }}
            >
              <Printer size={15} />
              <span>Print QR Slip</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          VERNACULAR WHATSAPP AUDIO-RX MODAL
          ========================================================================= */}
      <WhatsAppAudioRxModal 
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        patientData={{
          name: currentEncounter.patient.name,
          vernacularName: currentEncounter.language.includes('Telugu') ? 'నారాయణ రావు' : 'आरव कुमार',
          phone: '+91 00000 00000 (Non-dialable Demo)',
          cleanPhone: '0000000000',
          age: currentEncounter.patient.age,
          gender: currentEncounter.patient.gender,
          abhaId: 'DEMO-ABHA-FIXTURE',
          language: currentEncounter.language,
          langCode: currentEncounter.langCode || 'en-IN'
        }}
        doctorName={doctorProfile?.doctorName || 'Dr. Priya Sharma, MD'}
        initialLanguage={currentEncounter.langCode?.includes('hi') ? 'hi' : 'te'}
      />

      {/* =========================================================================
          ABDM FHIR R4 JSON MODAL
          ========================================================================= */}
      {showFhirModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div className="modal-content" style={{
            width: '740px',
            maxHeight: '80vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#081D33',
            color: '#ffffff',
            borderRadius: '18px',
            overflow: 'hidden'
          }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={18} color="#D4AF37" />
                <h3 style={{ fontSize: '16px', color: '#ffffff' }}>Official ABDM FHIR R4 Encounter Bundle</h3>
              </div>
              <button 
                onClick={() => setShowFhirModal(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>
            <div style={{ padding: '20px', overflowY: 'auto', flex: 1, fontFamily: 'monospace', fontSize: '12px', color: '#A5F3FC' }}>
              <pre>{JSON.stringify({
                resourceType: "Bundle",
                id: `abdm-encounter-${currentEncounter.id}`,
                type: "document",
                timestamp: new Date().toISOString(),
                patient: {
                  name: currentEncounter.patient.name,
                  age: currentEncounter.patient.age,
                  gender: currentEncounter.patient.gender,
                  abhaId: currentEncounter.patient.abhaId,
                  facility: currentEncounter.patient.location
                },
                clinicalImpression: {
                  vernacularLanguage: currentEncounter.language,
                  icd10Conditions: currentEncounter.vernacularMappings.map(v => ({ code: v.icd10, display: v.clinicalTerm })),
                  acousticBiomarkers: currentEncounter.acousticBiomarkers
                },
                medicationRequests: currentEncounter.medications.map(m => ({
                  medication: m.name,
                  dosageInstruction: m.timing,
                  colorLabel: m.colorLabel
                }))
              }, null, 2)}</pre>
            </div>
            <div style={{ padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(currentEncounter, null, 2));
                  alert('FHIR R4 JSON copied to clipboard!');
                  setShowFhirModal(false);
                }}
                className="btn-teal"
                style={{ fontSize: '12px', padding: '8px 18px' }}
              >
                Copy FHIR JSON
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PRINTABLE QR PRESCRIPTION MODAL
          ========================================================================= */}
      {showPrintModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div className="modal-content" style={{
            width: '540px',
            background: '#ffffff',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            border: '1px solid #CBD5E1'
          }}>
            {/* Prescription Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #0F4C5C', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#081C24', fontWeight: 850 }}>AYUSWAR HEALTH CLINIC (DEMO)</h3>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Simulated PHC Demonstration Center #1402 • Synthetic Test Record</div>
              </div>
              <button onClick={() => setShowPrintModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Patient & Doctor details */}
            <div style={{ fontSize: '12.5px', color: '#334155', marginBottom: '18px', lineHeight: 1.6 }}>
              <div><strong>Patient:</strong> {currentEncounter.patient.name} ({currentEncounter.patient.age}y, {currentEncounter.patient.gender})</div>
              <div><strong>ABHA Health ID:</strong> {currentEncounter.patient.abhaId}</div>
              <div><strong>Prescribing Physician:</strong> {doctorProfile ? doctorProfile.doctorName : 'Dr. Ananya Sharma, MD'}</div>
            </div>

            {/* Prescribed Items */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#081C24', marginBottom: '8px' }}>Rx Medications:</div>
              {currentEncounter.medications.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0', fontSize: '12.5px' }}>
                  <span><strong>{m.name}</strong> ({m.colorLabel})</span>
                  <span>{m.timing} — {m.duration}</span>
                </div>
              ))}
            </div>

            {/* QR Code Audio-Rx */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#FAF8F5', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <AuthenticQrCode 
                value={`https://ayuswar-ai.vercel.app/audio-rx?enc=${currentEncounter.id}&lang=${encodeURIComponent(currentEncounter.language)}`}
                size={72}
                isDoctor={false}
                showCenterBadge={true}
              />
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#081C24' }}>Scan to Listen in {currentEncounter.language}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Illiterate patients can scan with any smartphone camera to replay voice instructions.</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button 
                onClick={() => { window.print(); setShowPrintModal(false); }}
                className="btn-primary" 
                style={{ fontSize: '13px', padding: '9px 20px' }}
              >
                Print Official Slip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
