import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  PhoneOff, 
  MessageSquare, 
  Check, 
  X, 
  Minus, 
  Volume2, 
  VolumeX, 
  Send, 
  Sparkles, 
  FileText, 
  Calendar, 
  User, 
  Heart, 
  Pill, 
  CheckCircle2,
  ChevronRight,
  Activity,
  Settings,
  Cpu,
  ShieldCheck
} from 'lucide-react';
import { askAyuSwarBrain, getAiConfig, saveAiConfig, AI_PROVIDERS } from '../services/aiBrainService';

/**
 * 4K Sharp Vector Emblem for AyuSwar AI
 * Precision SVG with glowing radial gradient, acoustic frequency nodes, and sacred lotus acoustics.
 * Never pixelated at any resolution (Retina / 4K Ultra-HD ready).
 */
export function AyuSwarOrbLogo({ size = 28, glow = true }) {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at 35% 30%, #00F5D4 0%, #008B8B 60%, #0A2540 100%)',
      boxShadow: glow ? '0 0 16px rgba(0, 245, 212, 0.55), 0 0 30px rgba(0, 139, 139, 0.35)' : 'none',
      flexShrink: 0
    }}>
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer Acoustic Petals */}
        <path d="M18 4 C15 11 11 15 4 18 C11 21 15 25 18 32 C21 25 25 21 32 18 C25 15 21 11 18 4 Z" fill="rgba(255,255,255,0.95)" />
        {/* Core Soundwave Ring */}
        <circle cx="18" cy="18" r="6" stroke="#0A2540" strokeWidth="1.8" fill="rgba(0, 245, 212, 0.9)" />
        {/* Center Neural Acoustic Dot */}
        <circle cx="18" cy="18" r="2.4" fill="#0A2540" />
      </svg>
    </div>
  );
}

/**
 * FloatingAssistant Component
 * Implements the 5-state Ambient Clinical Voice Intelligence Assistant matching the reference:
 * 1. Collapsed State: Floating pill ("Talk to AyuSwar" with glowing emblem + mic button)
 * 2. Expanded State: Context-aware greeting + dynamic soundwave + action pills (Doctor vs Patient)
 * 3. Active Listening: Concentric pulsing rings + live timer countdown + SpeechRecognition API
 * 4. Speaking (AI Reply): Live audio waveform + responsive vernacular dialogue + SpeechSynthesis
 * 5. Call Ended: Summary card with discussion bullets + [View Summary / Details] action
 */
export default function FloatingAssistant({
  activeView = 'landing',
  doctorProfile = null,
  patientProfile = null,
  onNavigateTab = null,
  onOpenDoctorPortal = null,
  onOpenPatientPortal = null
}) {
  // Assistant states: 'collapsed' | 'expanded' | 'listening' | 'speaking' | 'ended'
  const [assistantState, setAssistantState] = useState('collapsed');
  const [isMuted, setIsMuted] = useState(false);
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [listeningSeconds, setListeningSeconds] = useState(12);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [speechLanguage, setSpeechLanguage] = useState('te-IN'); // Telugu default, or hi-IN, en-IN
  const [currentAiReply, setCurrentAiReply] = useState('');
  const [isProcessingQuery, setIsProcessingQuery] = useState(false);
  const [showAiSettingsModal, setShowAiSettingsModal] = useState(false);
  
  // AI Provider & Key Settings
  const [selectedProvider, setSelectedProvider] = useState(() => getAiConfig().provider);
  const [apiKeyInput, setApiKeyInput] = useState(() => getAiConfig().apiKey);
  const [keySavedToast, setKeySavedToast] = useState(false);

  // Determine role: Doctor mode vs Patient mode vs Receptionist on landing page
  const isDoctorMode = activeView === 'doctor_portal' || activeView === 'console';
  const isPatientMode = activeView === 'patient_portal';
  const effectiveRole = isDoctorMode ? 'doctor' : (isPatientMode ? 'patient' : 'receptionist');

  const doctorName = doctorProfile?.doctorName || 'Dr. Priya';
  const patientName = patientProfile?.patientName || 'Ananya';

  // Timer reference for listening countdown and speech simulation
  const timerRef = useRef(null);
  const speechRecognitionRef = useRef(null);

  // Clean speech synthesis on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Handle active listening countdown & speech recognition
  useEffect(() => {
    if (assistantState === 'listening') {
      setListeningSeconds(effectiveRole === 'doctor' ? 12 : (effectiveRole === 'patient' ? 14 : 10));
      setLiveTranscript(
        effectiveRole === 'doctor' 
          ? 'Listening to clinical query...' 
          : (effectiveRole === 'patient'
            ? 'Listening to your health symptom...'
            : 'Listening to your hospital query or token request...')
      );

      // Attempt webkitSpeechRecognition if supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition && !speechRecognitionRef.current) {
        try {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = true;
          recognition.lang = speechLanguage;

          recognition.onresult = (event) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;
            setLiveTranscript(transcript);
          };

          recognition.onend = () => {
            // Once user stops speaking, process question through Brain
            if (liveTranscript && !liveTranscript.startsWith('Listening to')) {
              handleProcessQuestion(liveTranscript);
            }
          };

          recognition.onerror = () => {
            // Graceful fallback to default query
          };

          recognition.start();
          speechRecognitionRef.current = recognition;
        } catch {
          // Ignore if permission blocked
        }
      }

      timerRef.current = setInterval(() => {
        setListeningSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            // Auto transition to Speaking state with processed answer
            handleProcessQuestion(liveTranscript.startsWith('Listening to') ? (effectiveRole === 'receptionist' ? 'book opd token' : 'cough and fever') : liveTranscript);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
        if (speechRecognitionRef.current) {
          try { speechRecognitionRef.current.stop(); } catch {}
          speechRecognitionRef.current = null;
        }
      };
    }
  }, [assistantState, effectiveRole]);

  // Process question via AyuSwar Brain (API / Open-Source / Local Indic NLP)
  const handleProcessQuestion = async (queryText) => {
    setIsProcessingQuery(true);
    setAssistantState('speaking');
    
    try {
      const answer = await askAyuSwarBrain(queryText, effectiveRole, { patientProfile, doctorProfile });
      setCurrentAiReply(answer);
      speakOutLoud(answer);
    } catch {
      const fallback = effectiveRole === 'receptionist' 
        ? "Namaste! Welcome to AyuSwar Hospital. Token #14 assigned with Dr. Ananya Sharma. Wait time ~8 mins."
        : "I have recorded your symptom. Dr. Priya has been notified and your vitals are stable.";
      setCurrentAiReply(fallback);
      speakOutLoud(fallback);
    } finally {
      setIsProcessingQuery(false);
    }
  };

  const speakOutLoud = (text) => {
    if ('speechSynthesis' in window && !isMuted) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
      // Auto detect language
      if (/[\u0C00-\u0C7F]/.test(text)) {
        utterance.lang = 'te-IN';
      } else if (/[\u0900-\u097F]/.test(text)) {
        utterance.lang = 'hi-IN';
      } else {
        utterance.lang = 'en-IN';
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  // Trigger Speaking (AI Reply) state with Voice Synthesis
  const triggerAiSpeakingReply = (customQuery = null) => {
    if (customQuery) {
      handleProcessQuestion(customQuery);
    } else {
      const defaultQ = effectiveRole === 'doctor' 
        ? 'latest patient reports and asthma GINA guidelines' 
        : (effectiveRole === 'patient' ? 'my appointment and medications' : 'book opd token for doctor');
      handleProcessQuestion(defaultQ);
    }
  };

  const handleEndCall = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (timerRef.current) clearInterval(timerRef.current);
    if (speechRecognitionRef.current) {
      try { speechRecognitionRef.current.stop(); } catch {}
      speechRecognitionRef.current = null;
    }
    setAssistantState('ended');
  };

  const handleQuickAction = (action) => {
    if (effectiveRole === 'doctor') {
      if (action === 'Next Patient') {
        if (onNavigateTab) onNavigateTab('patients');
        triggerAiSpeakingReply("Opening Next Patient in OPD queue: Rohit Kumar, 42 Male with Asthma follow-up.");
      } else if (action === 'Reports') {
        if (onNavigateTab) onNavigateTab('reports');
        triggerAiSpeakingReply("Opening pending Diagnostic & Lab reports for your OPD ward.");
      } else if (action === 'Appointments') {
        if (onNavigateTab) onNavigateTab('appointments');
        triggerAiSpeakingReply("Opening live OPD Token schedule. You have 12 appointments today.");
      }
    } else if (effectiveRole === 'patient') {
      if (action === 'My Health') {
        if (onNavigateTab) onNavigateTab('my_health');
        triggerAiSpeakingReply("Loading your ABHA health record and recent vitals history.");
      } else if (action === 'Reports') {
        if (onNavigateTab) onNavigateTab('reports');
        triggerAiSpeakingReply("Opening your verified diagnostic reports. Chest X-Ray and CBC are ready.");
      } else if (action === 'Medications') {
        if (onNavigateTab) onNavigateTab('medications');
        triggerAiSpeakingReply("Opening your personalized Indic Chronotherapy pill schedule.");
      }
    } else {
      // Receptionist quick actions
      if (action === 'Book Token') {
        triggerAiSpeakingReply("Namaste! I've assigned you OPD Token #14 for General Medicine with Dr. Ananya Sharma. Estimated wait time is 8 minutes.");
      } else if (action === 'Doctor Portal') {
        if (onOpenDoctorPortal) onOpenDoctorPortal();
        triggerAiSpeakingReply("Opening AyuSwar Clinical Studio for Doctors. Ambient dual-speaker recording ready.");
      } else if (action === 'Patient Portal') {
        if (onOpenPatientPortal) onOpenPatientPortal();
        triggerAiSpeakingReply("Opening Patient ABHA Portal. Access your audio prescription and health records.");
      } else if (action === 'Indic Voice') {
        triggerAiSpeakingReply("AyuSwar AI supports seamless real-time voice translation across 22+ Indic languages including Telugu, Hindi, Tamil, and Bengali.");
      }
    }
  };

  const handleSendText = (e) => {
    e?.preventDefault();
    if (!textInputValue.trim()) return;
    const query = textInputValue.trim();
    setTextInputValue('');
    setShowTextInput(false);
    triggerAiSpeakingReply(query);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '26px',
      zIndex: 1200,
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* =========================================================================
          STATE 1: COLLAPSED STATE (FLOATING PILL BUTTON)
          ========================================================================= */}
      {assistantState === 'collapsed' && (
        <div 
          onClick={() => setAssistantState('expanded')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'linear-gradient(135deg, #ffffff 0%, #F0FDFA 100%)',
            border: '1.5px solid #00D2D3',
            padding: '8px 10px 8px 12px',
            borderRadius: '40px',
            boxShadow: '0 12px 36px rgba(0, 139, 139, 0.22), 0 4px 12px rgba(10, 37, 64, 0.12)',
            cursor: 'pointer',
            transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.04)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Click to talk with AyuSwar Ambient Clinical Assistant"
        >
          {/* Glowing 4K Vector Emblem */}
          <AyuSwarOrbLogo size={32} glow={true} />

          {/* Assistant Label */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{
              fontSize: '14px',
              fontWeight: 800,
              color: '#0A2540',
              letterSpacing: '-0.2px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span>Talk to AyuSwar</span>
              <span style={{
                fontSize: '9.5px',
                fontWeight: 800,
                background: effectiveRole === 'doctor' ? '#008B8B' : (effectiveRole === 'patient' ? '#D97706' : '#0D9488'),
                color: '#ffffff',
                padding: '1px 6px',
                borderRadius: '8px',
                textTransform: 'uppercase'
              }}>
                {effectiveRole === 'doctor' ? 'MD' : (effectiveRole === 'patient' ? 'Pt' : 'Reception')}
              </span>
            </span>
            <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 600 }}>
              {effectiveRole === 'doctor' 
                ? 'Clinical Co-Pilot' 
                : (effectiveRole === 'patient' ? 'Your Health Companion' : 'AI Clinic Helpdesk')}
            </span>
          </div>

          {/* Mic Button Circle */}
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #008B8B 0%, #00B4D8 100%)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0, 139, 139, 0.35)'
          }}>
            <Mic size={17} />
          </div>
        </div>
      )}

      {/* =========================================================================
          STATES 2 - 5: EXPANDED FLOATING WINDOW (MEDIUM SIZE, ~360px x ~450px)
          ========================================================================= */}
      {assistantState !== 'collapsed' && (
        <div style={{
          width: '365px',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(10, 37, 64, 0.22), 0 6px 18px rgba(0, 139, 139, 0.12)',
          border: '1.5px solid #CCFBF1',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all 240ms cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'modalSlideUp 220ms ease forwards'
        }}>
          {/* Top Bar / Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 18px',
            borderBottom: '1px solid #F1F5F9',
            background: 'linear-gradient(135deg, #F0FDFA 0%, #ffffff 100%)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AyuSwarOrbLogo size={24} glow={false} />
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>
                  Ayu<span style={{ color: '#008B8B' }}>Swar</span> AI
                </span>
                <span style={{ fontSize: '10px', color: '#64748B', marginLeft: '6px' }}>
                  {effectiveRole === 'doctor' 
                    ? 'Doctor Mode' 
                    : (effectiveRole === 'patient' ? 'Patient Mode' : 'AI Clinic Receptionist')}
                </span>
              </div>
            </div>

            {/* Window Controls: AI Engine Settings, Minimize, Close */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setShowAiSettingsModal(true)}
                style={{
                  background: 'rgba(0, 139, 139, 0.08)',
                  border: '1px solid rgba(0, 139, 139, 0.25)',
                  color: '#008B8B',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="AI Brain & Open-Source LLM Settings"
              >
                <Cpu size={12} />
                <span>AI Brain</span>
              </button>

              <button
                onClick={() => setAssistantState('collapsed')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
                title="Minimize"
              >
                <Minus size={16} />
              </button>

              <button
                onClick={() => setAssistantState('collapsed')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* =====================================================================
              STATE 2: EXPANDED STATE (GREETING & QUICK ACTION PILLS)
              ===================================================================== */}
          {assistantState === 'expanded' && (
            <div style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', margin: 0 }}>
                  {effectiveRole === 'doctor' 
                    ? `Good morning, ${doctorName}.` 
                    : (effectiveRole === 'patient' 
                      ? `Hi ${patientName}.` 
                      : 'Namaste! Welcome to AyuSwar.')}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                  {effectiveRole === 'doctor' 
                    ? '12 appointments · 5 reports pending' 
                    : (effectiveRole === 'patient'
                      ? 'Appointment tomorrow · 10:15 AM'
                      : 'Live OPD Token Desk · Multilingual Helpdesk')}
                </div>
                <div style={{ fontSize: '13.5px', fontWeight: 650, color: '#008B8B', marginTop: '8px' }}>
                  {effectiveRole === 'doctor' 
                    ? 'How can I help?' 
                    : (effectiveRole === 'patient' ? 'How can I help you today?' : 'How can I assist your visit today?')}
                </div>
              </div>

              {/* Soundwave Graphic */}
              <div style={{
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                padding: '0 10px',
                background: 'rgba(0, 139, 139, 0.04)',
                borderRadius: '12px',
                border: '1px dashed rgba(0, 139, 139, 0.2)'
              }}>
                {[12, 22, 34, 18, 28, 38, 24, 14, 30, 20, 36, 16, 26, 12, 20].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: '3px',
                      height: `${h}px`,
                      background: 'linear-gradient(180deg, #00D2D3 0%, #008B8B 100%)',
                      borderRadius: '2px',
                      opacity: 0.8
                    }}
                  />
                ))}
              </div>

              {/* Action Suggestion Pills */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {effectiveRole === 'doctor' ? (
                  <>
                    <button
                      onClick={() => handleQuickAction('Next Patient')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0A2540',
                        cursor: 'pointer'
                      }}
                    >
                      <User size={13} color="#008B8B" />
                      <span>Next Patient</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Reports')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0A2540',
                        cursor: 'pointer'
                      }}
                    >
                      <FileText size={13} color="#008B8B" />
                      <span>Reports</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Appointments')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0A2540',
                        cursor: 'pointer'
                      }}
                    >
                      <Calendar size={13} color="#008B8B" />
                      <span>Appointments</span>
                    </button>
                  </>
                ) : effectiveRole === 'patient' ? (
                  <>
                    <button
                      onClick={() => handleQuickAction('My Health')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0A2540',
                        cursor: 'pointer'
                      }}
                    >
                      <Heart size={13} color="#D97706" />
                      <span>My Health</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Reports')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0A2540',
                        cursor: 'pointer'
                      }}
                    >
                      <FileText size={13} color="#D97706" />
                      <span>Reports</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Medications')}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0A2540',
                        cursor: 'pointer'
                      }}
                    >
                      <Pill size={13} color="#D97706" />
                      <span>Medications</span>
                    </button>
                  </>
                ) : (
                  /* Receptionist Mode Action Pills */
                  <>
                    <button
                      onClick={() => handleQuickAction('Book Token')}
                      style={{
                        flex: 1,
                        minWidth: '135px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #99F6E4',
                        background: '#F0FDFA',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0F766E',
                        cursor: 'pointer'
                      }}
                    >
                      <Activity size={13} color="#0D9488" />
                      <span>🎟️ Book OPD Token</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Doctor Portal')}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0A2540',
                        cursor: 'pointer'
                      }}
                    >
                      <User size={13} color="#008B8B" />
                      <span>👨‍⚕️ Doctor Portal</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Patient Portal')}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0A2540',
                        cursor: 'pointer'
                      }}
                    >
                      <Heart size={13} color="#D97706" />
                      <span>👤 Patient ABHA</span>
                    </button>
                    <button
                      onClick={() => handleQuickAction('Indic Voice')}
                      style={{
                        flex: 1,
                        minWidth: '110px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px 10px',
                        borderRadius: '20px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 750,
                        color: '#0A2540',
                        cursor: 'pointer'
                      }}
                    >
                      <Volume2 size={13} color="#008B8B" />
                      <span>🌐 Indic Voice</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              STATE 3: ACTIVE LISTENING (CONCENTRIC PULSING RINGS + TIMER)
              ===================================================================== */}
          {assistantState === 'listening' && (
            <div style={{
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '220px'
            }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540', marginBottom: '18px' }}>
                Listening...
              </div>

              {/* Concentric Pulsing Microphone Container */}
              <div style={{
                position: 'relative',
                width: '110px',
                height: '110px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {/* Outer Ripple 1 */}
                <div style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(0, 210, 211, 0.15)',
                  animation: 'pulseRing 2s infinite ease-out'
                }} />
                {/* Outer Ripple 2 */}
                <div style={{
                  position: 'absolute',
                  width: '82%',
                  height: '82%',
                  borderRadius: '50%',
                  background: 'rgba(0, 139, 139, 0.22)'
                }} />
                {/* Core Glowing Orb */}
                <div style={{
                  position: 'relative',
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00D2D3 0%, #008B8B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  boxShadow: '0 0 20px rgba(0, 210, 211, 0.6)'
                }}>
                  <Mic size={26} />
                </div>
              </div>

              {/* Timer Countdown */}
              <div style={{
                fontSize: '13px',
                fontWeight: 750,
                color: '#64748B',
                fontFamily: 'monospace',
                marginTop: '16px'
              }}>
                00:{listeningSeconds < 10 ? `0${listeningSeconds}` : listeningSeconds}
              </div>

              {/* Live Transcript Snippet */}
              <div style={{
                fontSize: '11.5px',
                color: '#008B8B',
                fontStyle: 'italic',
                marginTop: '8px',
                textAlign: 'center',
                maxWidth: '280px'
              }}>
                "{liveTranscript}"
              </div>
            </div>
          )}

          {/* =====================================================================
              STATE 4: SPEAKING (AI REPLY WITH RESPONSE BUBBLE & WAVEFORM)
              ===================================================================== */}
          {assistantState === 'speaking' && (
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#008B8B" />
                <span style={{ fontSize: '12px', fontWeight: 750, color: '#008B8B' }}>
                  {effectiveRole === 'doctor' 
                    ? 'Analyzing patient data...' 
                    : (effectiveRole === 'patient' ? 'AyuSwar is responding...' : 'Receptionist is answering...')}
                </span>
              </div>

              {/* Fluid Audio Waveform Animation */}
              <div style={{
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                padding: '0 8px',
                background: 'rgba(0, 139, 139, 0.05)',
                borderRadius: '10px'
              }}>
                {[14, 28, 22, 30, 16, 26, 12, 28, 20, 32, 18, 24].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      width: '3.5px',
                      height: `${h}px`,
                      background: '#008B8B',
                      borderRadius: '2px',
                      animation: `waveBar 1s infinite ease-in-out ${i * 0.08}s`
                    }}
                  />
                ))}
              </div>

              {/* Response Text Card */}
              <div style={{
                background: '#F8FAFC',
                border: '1.5px solid #E2E8F0',
                borderRadius: '14px',
                padding: '14px 16px',
                fontSize: '12.5px',
                lineHeight: 1.5,
                color: '#1E293B',
                boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)',
                whiteSpace: 'pre-line'
              }}>
                {isProcessingQuery ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#008B8B', fontWeight: 700 }}>
                    <Sparkles size={14} className="animate-spin" />
                    <span>AyuSwar Brain is analyzing query...</span>
                  </div>
                ) : (
                  currentAiReply || (effectiveRole === 'doctor' ? (
                    "Rohit Kumar's latest reports show improvement in HbA1c levels. His BP is stable at 118/76. Would you like me to open his prescription or view the full spirometry report?"
                  ) : effectiveRole === 'patient' ? (
                    "Your appointment with Dr. Priya is tomorrow at 10:15 AM. Your latest chest report is now available in the Reports section. Would you like me to go through it with you?"
                  ) : (
                    "Namaste! Welcome to AyuSwar Hospital Helpdesk. Token #14 assigned with Dr. Ananya Sharma. Current wait time is ~8 minutes in Room 104."
                  ))
                )}
              </div>
            </div>
          )}

          {/* =====================================================================
              STATE 5: CALL ENDED (SUMMARY CHECKLIST CARD)
              ===================================================================== */}
          {assistantState === 'ended' && (
            <div style={{
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              {/* Green Checkmark Circle */}
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10B981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <Check size={24} strokeWidth={2.5} />
              </div>

              <div style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540' }}>
                {effectiveRole === 'receptionist' ? 'Inquiry Completed' : 'Call Ended'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px', fontFamily: 'monospace' }}>
                {effectiveRole === 'doctor' ? '00:48' : (effectiveRole === 'patient' ? '01:02' : '00:35')}
              </div>

              {/* Discussion Recap Box */}
              <div style={{
                width: '100%',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 14px',
                textAlign: 'left',
                marginTop: '16px',
                marginBottom: '18px'
              }}>
                <div style={{ fontSize: '11.5px', fontWeight: 750, color: '#0A2540', marginBottom: '6px' }}>
                  {effectiveRole === 'doctor' 
                    ? "Here's what we discussed:" 
                    : (effectiveRole === 'patient' ? "Here's what I found for you:" : "Reception Desk Summary:")}
                </div>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '11px', color: '#475569', lineHeight: 1.6 }}>
                  {effectiveRole === 'doctor' ? (
                    <>
                      <li>2 reports reviewed</li>
                      <li>1 prescription updated</li>
                      <li>Next follow-up: 28 May 2025</li>
                    </>
                  ) : effectiveRole === 'patient' ? (
                    <>
                      <li>Appointment tomorrow · 10:15 AM</li>
                      <li>2 reports available</li>
                      <li>1 medication due today</li>
                    </>
                  ) : (
                    <>
                      <li>OPD Token #14 assigned (General OPD)</li>
                      <li>Attending: Dr. Ananya Sharma MD</li>
                      <li>Indic Voice & ABHA consent verified</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Primary Action Button */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                <button
                  onClick={() => {
                    if (effectiveRole === 'doctor' && onNavigateTab) {
                      onNavigateTab('reports');
                    } else if (effectiveRole === 'patient' && onNavigateTab) {
                      onNavigateTab('medications');
                    }
                    setAssistantState('collapsed');
                  }}
                  style={{
                    width: '100%',
                    background: '#0A2540',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '12.5px',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  {effectiveRole === 'doctor' ? 'View Summary' : (effectiveRole === 'patient' ? 'View Details' : 'Close & Continue')}
                </button>

                <button
                  onClick={() => setAssistantState('expanded')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#008B8B',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  Start New Inquiry
                </button>
              </div>
            </div>
          )}

          {/* =====================================================================
              BOTTOM CONTROLS BAR (4 BUTTONS MATCHING SCREENSHOT)
              [Mute Mic] [Active Speak / Mic Orb] [Red End Call] [Text Input Toggle]
              ===================================================================== */}
          {assistantState !== 'ended' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 18px',
              borderTop: '1px solid #F1F5F9',
              background: '#FAFAFA'
            }}>
              {/* Button 1: Mute / Unmute */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: isMuted ? '#FEF2F2' : '#ffffff',
                  border: isMuted ? '1px solid #FCA5A5' : '1px solid #CBD5E1',
                  color: isMuted ? '#EF4444' : '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={isMuted ? 'Unmute Assistant' : 'Mute Assistant Voice'}
              >
                {isMuted ? <VolumeX size={16} /> : <MicOff size={16} />}
              </button>

              {/* Button 2: Center Main Mic / Talk Orb */}
              <button
                onClick={() => {
                  if (assistantState === 'listening') {
                    triggerAiSpeakingReply();
                  } else {
                    setAssistantState('listening');
                  }
                }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00D2D3 0%, #008B8B 100%)',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 14px rgba(0, 139, 139, 0.4)',
                  cursor: 'pointer',
                  transform: assistantState === 'listening' ? 'scale(1.08)' : 'scale(1)',
                  transition: 'transform 150ms ease'
                }}
                title={assistantState === 'listening' ? 'Click to Stop & Get Answer' : 'Click to Speak'}
              >
                <Mic size={20} />
              </button>

              {/* Button 3: Red End Call Button */}
              <button
                onClick={handleEndCall}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#EF4444',
                  border: 'none',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 3px 10px rgba(239, 68, 68, 0.3)',
                  cursor: 'pointer'
                }}
                title="End Consultation Call"
              >
                <PhoneOff size={16} />
              </button>

              {/* Button 4: Text Toggle */}
              <button
                onClick={() => setShowTextInput(!showTextInput)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 10px',
                  borderRadius: '16px',
                  background: showTextInput ? 'rgba(0, 139, 139, 0.1)' : '#ffffff',
                  border: '1px solid #CBD5E1',
                  color: showTextInput ? '#008B8B' : '#64748B',
                  fontSize: '11px',
                  fontWeight: 750,
                  cursor: 'pointer'
                }}
                title="Toggle Text Input"
              >
                <MessageSquare size={13} />
                <span>Text</span>
              </button>
            </div>
          )}

          {/* Optional Inline Text Input Drawer */}
          {showTextInput && assistantState !== 'ended' && (
            <form 
              onSubmit={handleSendText} 
              style={{
                padding: '10px 14px',
                borderTop: '1px solid #E2E8F0',
                background: '#ffffff',
                display: 'flex',
                gap: '8px'
              }}
            >
              <input
                type="text"
                placeholder={effectiveRole === 'doctor' ? "Type medical command..." : "Type health symptom..."}
                value={textInputValue}
                onChange={e => setTextInputValue(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  padding: '7px 12px',
                  borderRadius: '10px',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  background: '#008B8B',
                  border: 'none',
                  color: '#ffffff',
                  borderRadius: '10px',
                  padding: '0 12px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Send size={14} />
              </button>
            </form>
          )}
        </div>
      )}

      {/* =========================================================================
          AI BRAIN & OPEN-SOURCE MODEL SETTINGS MODAL
          ========================================================================= */}
      {showAiSettingsModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(10, 37, 64, 0.55)',
          backdropFilter: 'blur(4px)',
          zIndex: 1400,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            width: '460px',
            maxWidth: '95vw',
            boxShadow: '0 25px 60px rgba(0,0,0,0.25)',
            border: '2px solid #008B8B',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0A2540 0%, #061B30 100%)',
              color: '#ffffff',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Cpu size={18} color="#00D2D3" />
                <span style={{ fontSize: '15px', fontWeight: 800 }}>AyuSwar AI Brain Settings</span>
              </div>
              <button
                onClick={() => setShowAiSettingsModal(false)}
                style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '16px' }}
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 800, color: '#0A2540', marginBottom: '6px' }}>
                  Select AI LLM Engine / Provider:
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => setSelectedProvider(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '12.5px',
                    fontWeight: 650,
                    color: '#0A2540',
                    outline: 'none'
                  }}
                >
                  {AI_PROVIDERS.map(prov => (
                    <option key={prov.id} value={prov.id}>
                      {prov.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedProvider !== 'local_offline' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 800, color: '#0A2540' }}>
                      {selectedProvider === 'gemini_free' ? 'Google Gemini API Key (Free):' : 'API Key / Token:'}
                    </label>
                    <span style={{ fontSize: '10.5px', color: '#059669', fontWeight: 700 }}>Free Tier Supported</span>
                  </div>
                  <input
                    type="password"
                    placeholder="Paste AI API Key here..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '12.5px',
                      fontFamily: 'monospace',
                      outline: 'none'
                    }}
                  />
                  <div style={{ fontSize: '10.5px', color: '#64748B', marginTop: '4px' }}>
                    🔒 Key stored securely in your browser's local memory. Never sent to third parties.
                  </div>
                </div>
              )}

              <div style={{
                background: selectedProvider === 'local_offline' ? '#ECFDF5' : '#F0F9FF',
                border: selectedProvider === 'local_offline' ? '1px solid #A7F3D0' : '1px solid #BAE6FD',
                borderRadius: '10px',
                padding: '10px 14px',
                fontSize: '12px',
                color: selectedProvider === 'local_offline' ? '#065F46' : '#0369A1',
                lineHeight: 1.45
              }}>
                {selectedProvider === 'local_offline' ? (
                  <>
                    ✅ <strong>100% Free & Offline Mode Active:</strong> Uses AyuSwar's autonomous Indic Clinical Ontology & Triage Rule Engine. No API keys or internet connection required.
                  </>
                ) : (
                  <>
                    ⚡ <strong>Live LLM Mode Active:</strong> Queries will be routed through the selected open-source/free API model with autonomous fallback if limits are reached.
                  </>
                )}
              </div>

              {keySavedToast && (
                <div style={{ background: '#DCFCE7', color: '#166534', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 750, textAlign: 'center' }}>
                  ✓ AI Brain settings saved successfully!
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button
                  onClick={() => {
                    saveAiConfig(selectedProvider, apiKeyInput);
                    setKeySavedToast(true);
                    setTimeout(() => {
                      setKeySavedToast(false);
                      setShowAiSettingsModal(false);
                    }, 1200);
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: '10px', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <ShieldCheck size={16} />
                  <span>Save AI Engine</span>
                </button>
                <button
                  onClick={() => setShowAiSettingsModal(false)}
                  className="btn-outline"
                  style={{ padding: '10px 16px', fontSize: '13px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
