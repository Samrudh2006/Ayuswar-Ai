import React, { useState, useEffect, useRef } from 'react';
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
  Send,
  MessageSquare
} from 'lucide-react';
import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters';
import WhatsAppAudioRxModal from './WhatsAppAudioRxModal';

/**
 * ClinicalConsole Component
 * High-performance clinical telemetry workspace for ambient OPD encounters.
 * Integrates WebAudio FFT visualizers, dual-speaker diarization, IISc Coswara biomarkers,
 * colloquial-to-ICD10 ontology mapping, Timbre v2.5 karaoke speech, and ABDM FHIR R4 export.
 */
export default function ClinicalConsole({ doctorProfile, initialEncounterIndex = 0 }) {
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

  // OpenCV Strip Scanner Simulation
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

  // Toggle Live Microphone
  const toggleLiveMic = () => {
    if (isLiveMicActive) {
      setIsLiveMicActive(false);
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      setMicVolume(20);
    } else {
      setIsLiveMicActive(true);
      micIntervalRef.current = setInterval(() => {
        setMicVolume(Math.floor(30 + Math.random() * 60));
      }, 100);
    }
  };

  useEffect(() => {
    return () => {
      if (audioRxTimerRef.current) clearInterval(audioRxTimerRef.current);
      if (dialogueTimerRef.current) clearInterval(dialogueTimerRef.current);
      if (micIntervalRef.current) clearInterval(micIntervalRef.current);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 80px 24px' }}>
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
              background: 'linear-gradient(135deg, #0A2540 0%, #008B8B 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '18px'
            }}>
              {currentEncounter.patient.name.charAt(0)}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '18px', color: '#0A2540', fontWeight: 800 }}>
                  {currentEncounter.patient.name}
                </h2>
                <span style={{ fontSize: '12px', background: '#E2E8F0', padding: '2px 8px', borderRadius: '12px', fontWeight: 650, color: '#334155' }}>
                  {currentEncounter.patient.gender}, {currentEncounter.patient.age}y
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(0, 139, 139, 0.12)', color: '#008B8B', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                  ABHA: {currentEncounter.patient.abhaId}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
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
                  border: selectedEncounterIndex === idx ? '2px solid #008B8B' : '1px solid #D8E7EB',
                  background: selectedEncounterIndex === idx ? 'rgba(0, 139, 139, 0.12)' : '#ffffff',
                  color: selectedEncounterIndex === idx ? '#008B8B' : '#0B2545',
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
          <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Heart size={12} color="#EF4444" /> Blood Pressure
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>{currentEncounter.vitals.bp}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Activity size={12} color="#008B8B" /> Heart Rate
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>{currentEncounter.vitals.heartRate}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Droplets size={12} color="#3B82F6" /> SpO2 Oxygen
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>{currentEncounter.vitals.spo2}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Thermometer size={12} color="#D97706" /> Temperature
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>{currentEncounter.vitals.temp}</div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '8px 12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '10.5px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Sparkles size={12} color="#8B5CF6" /> Blood Sugar
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>{currentEncounter.vitals.bloodSugar}</div>
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
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540' }}>
                  Ambient Multi-Speaker Transcript
                </h3>
                <div style={{ fontSize: '11px', color: '#5A7184' }}>
                  Powered by Gnani.ai Prisma v2.5 Code-Mixed STT Engine
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
              {currentEncounter.dialogue.slice(0, visibleDialogueCount).map((turn, i) => {
                const isDoc = turn.speaker.includes('Doctor');
                return (
                  <div
                    key={i}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      background: isDoc ? 'rgba(10, 37, 64, 0.04)' : 'rgba(0, 139, 139, 0.07)',
                      borderLeft: isDoc ? '3.5px solid #0A2540' : '3.5px solid #008B8B'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: isDoc ? '#0A2540' : '#008B8B' }}>
                        {turn.speaker}
                      </span>
                      <span style={{ fontSize: '10px', color: '#94A3B8' }}>{turn.time}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#1E293B', lineHeight: 1.5 }}>
                      {turn.text}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: WebAudio FFT Spectrogram & Code-Switching Radar */}
          <div className="dark-telemetry-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Activity size={18} color="#00D2D3" />
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
                      background: i % 2 === 0 ? 'linear-gradient(to top, #008B8B, #00D2D3)' : 'linear-gradient(to top, #D97706, #FBBF24)',
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
              <span style={{ color: '#94A3B8' }}>Phonetic Code-Switching Ratio:</span>
              <span style={{ color: '#00D2D3', fontWeight: 750 }}>
                62% {currentEncounter.langCode.startsWith('te') ? 'Telugu' : 'Hindi'} + 28% Clinical English + 10% Colloquial
              </span>
            </div>
          </div>

          {/* Card 3: Acoustic Respiratory Biomarkers HUD (IISc Coswara Algorithm) */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Activity size={18} color="#D97706" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>
                Acoustic Respiratory Biomarkers (IISc Coswara Dataset DSP)
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Respiratory Effort & Strain</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>
                  {currentEncounter.acousticBiomarkers.respiratoryEffort}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Cough Acoustic Signature</div>
                <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#0A2540', marginTop: '2px' }}>
                  {currentEncounter.acousticBiomarkers.coughType}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Vocal Jitter & Shimmer</div>
                <div style={{ fontSize: '13px', fontWeight: 750, color: '#008B8B', marginTop: '2px' }}>
                  {currentEncounter.acousticBiomarkers.jitterPercent} / {currentEncounter.acousticBiomarkers.shimmerDb}
                </div>
              </div>

              <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
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
              <Cpu size={18} color="#008B8B" />
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>
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
                    background: '#F8FAFC',
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
                      background: 'rgba(0, 139, 139, 0.12)',
                      color: '#008B8B',
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
          {/* Card 5: Spoken Vernacular Audio-Rx (Timbre v2.5) with Word Karaoke */}
          <div className="glass-panel" style={{
            padding: '24px',
            border: '2px solid rgba(0, 139, 139, 0.35)',
            boxShadow: '0 16px 36px rgba(0, 139, 139, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Volume2 size={22} color="#008B8B" />
                <h3 style={{ fontSize: '16px', fontWeight: 850, color: '#0A2540' }}>
                  Spoken Vernacular Audio-Rx (Timbre v2.5)
                </h3>
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#ffffff',
                background: '#D97706',
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
              background: 'linear-gradient(135deg, rgba(0, 139, 139, 0.08) 0%, rgba(217, 119, 6, 0.05) 100%)',
              marginBottom: '16px',
              border: '1px solid rgba(0, 139, 139, 0.2)'
            }}>
              <div style={{
                position: 'relative',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2.5px solid #008B8B',
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
                    background: 'rgba(0, 139, 139, 0.9)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2px'
                  }}>
                    <span style={{ width: '2px', height: '6px', background: '#ffffff', animation: 'waveOscillate 0.5s infinite' }}></span>
                    <span style={{ width: '2px', height: '10px', background: '#ffffff', animation: 'waveOscillate 0.5s infinite 0.1s' }}></span>
                    <span style={{ width: '2px', height: '7px', background: '#ffffff', animation: 'waveOscillate 0.5s infinite 0.2s' }}></span>
                  </div>
                )}
              </div>

              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>
                  Dr. Ananya — Virtual Attending
                </div>
                <div style={{ fontSize: '11px', color: '#5A7184' }}>
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
            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0A2540', marginBottom: '10px' }}>
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
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
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
                      <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>{med.name}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{med.colorLabel}</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: '12px', fontWeight: 700, color: '#008B8B' }}>
                    {med.timing}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: OpenCV Blister Strip Scanner & Safety Guard */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="#D97706" />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>
                  OpenCV Blister Strip Scanner
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
          VERNACULAR WHATSAPP AUDIO-RX MODAL (TIMBRE v2.5)
          ========================================================================= */}
      <WhatsAppAudioRxModal 
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        patientData={{
          name: currentEncounter.patient.name,
          vernacularName: currentEncounter.language.includes('Telugu') ? 'నారాయణ రావు' : 'आरव कुमार',
          phone: '+91 98490 12345',
          cleanPhone: '919849012345',
          age: currentEncounter.patient.age,
          gender: currentEncounter.patient.gender,
          abhaId: currentEncounter.patient.abhaId,
          language: currentEncounter.language,
          langCode: currentEncounter.langCode || 'te-IN'
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
                <FileText size={18} color="#00D2D3" />
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #008B8B', paddingBottom: '14px', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', color: '#0A2540', fontWeight: 850 }}>AYUSWAR HEALTH CLINIC</h3>
                <div style={{ fontSize: '11px', color: '#64748B' }}>ABDM Government Certified Health Center #1402</div>
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
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540', marginBottom: '8px' }}>Rx Medications:</div>
              {currentEncounter.medications.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px dashed #E2E8F0', fontSize: '12.5px' }}>
                  <span><strong>{m.name}</strong> ({m.colorLabel})</span>
                  <span>{m.timing} — {m.duration}</span>
                </div>
              ))}
            </div>

            {/* QR Code Audio-Rx */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', background: '#0A2540', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px' }}>
                <QrCode size={48} />
              </div>
              <div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0A2540' }}>Scan to Listen in {currentEncounter.language}</div>
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
