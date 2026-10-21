import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Volume2, 
  VolumeX, 
  PhoneOff, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Heart, 
  Wifi, 
  Globe, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Users
} from 'lucide-react';
import DoctorAvatarFace from './DoctorAvatarFace';

export const DOCTOR_PERSONAS = [
  {
    id: 'priya',
    name: 'Dr. Priya Sharma, MD',
    role: 'Senior Clinical Attending · AI Teleconsult',
    avatar: '/avatar/idle.png',
    avatarFrames: {
      idle: '/avatar/idle.png',
      listening: '/avatar/listening.png',
      blink: '/avatar/blink.png',
      speaking: '/avatar/speaking.png'
    },
    specialty: 'Internal Medicine & AI Diagnostics'
  },
  {
    id: 'ananya',
    name: 'Dr. Ananya Sharma, MD',
    role: 'OPD Helpdesk & Indic Voice Triage Lead',
    avatar: '/avatar/idle.png',
    avatarFrames: {
      idle: '/avatar/idle.png',
      listening: '/avatar/listening.png',
      blink: '/avatar/blink.png',
      speaking: '/avatar/speaking.png'
    },
    specialty: 'OPD Clinical Triage'
  },
  {
    id: 'sanjivani',
    name: 'Dr. Sanjivani — 108 Lead',
    role: 'Critical ALS Tele-Trauma Consultant',
    avatar: '/assets/sanjivani_doctor_avatar.jpg',
    specialty: 'Emergency Critical Care'
  }
];

/**
 * DoctorAvatarVideoCall Component
 * High-fidelity 2-Way Interactive AI Doctor Tele-Presence & Video Call
 * Features:
 * - Lifelike Animated Doctor Avatar (Eye Blinking, Anatomical Lip-Sync, 3D Head Sway, WebRTC Scanlines)
 * - Real-time 2-Way Video: Patient Selfie WebCam PIP (Picture-In-Picture) with native getUserMedia
 * - Multi-Doctor Persona Switcher (Dr. Priya with Hospital Clinic Background, Dr. Ananya, Dr. Sanjivani)
 * - Multi-Language Vernacular Subtitles (Telugu, Hindi, English, Tamil) with synced karaoke
 * - Full call toolbar (Mic, Cam, Speaker, Language, Expand/Cinema, End Call)
 */
export default function DoctorAvatarVideoCall({
  mode = 'opd', // 'opd' | 'emergency'
  doctorName = null,
  doctorRole = null,
  avatarUrl = null,
  isSpeaking = false,
  isListening = false,
  liveSubtitle = '',
  englishTranslation = '',
  language = 'te-IN',
  onLanguageChange = null,
  isAudioMuted = false,
  onToggleMute = null,
  isMicActive = false,
  onToggleMic = null,
  onEndCall = null,
  isExpanded = false,
  onToggleExpand = null,
  patientName = 'You (Patient)',
  elapsedSeconds = 0,
  emergencyMeta = null // { cprBpm: 110, distress: 89, unit: 'A-12' }
}) {
  const isEmergency = mode === 'emergency';
  const [selectedPersonaId, setSelectedPersonaId] = useState(isEmergency ? 'sanjivani' : 'priya');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const activePersona = DOCTOR_PERSONAS.find(p => p.id === selectedPersonaId) || DOCTOR_PERSONAS[0];
  const effectiveDoctorName = doctorName || activePersona.name;
  const effectiveDoctorRole = doctorRole || activePersona.role;
  const effectiveAvatarUrl = avatarUrl || activePersona.avatar;
  const effectiveAvatarFrames = activePersona.avatarFrames || null;

  // Manage WebCam video stream for Patient PIP
  useEffect(() => {
    let active = true;

    async function setupCamera() {
      if (isCameraOn) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: { ideal: 320 }, height: { ideal: 240 }, facingMode: 'user' },
            audio: false
          });
          if (!active) {
            stream.getTracks().forEach(t => t.stop());
            return;
          }
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setCameraError(false);
        } catch (err) {
          console.warn('Webcam access was not granted or not available:', err);
          setCameraError(true);
          setIsCameraOn(false);
        }
      } else {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(t => t.stop());
          streamRef.current = null;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
    }

    setupCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, [isCameraOn]);

  const toggleCamera = () => {
    setIsCameraOn(prev => !prev);
  };

  const formatTimer = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const themeColor = isEmergency ? '#DC2626' : '#0F4C5C';
  const themeAccent = isEmergency ? '#EF4444' : '#00F5D4';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
      background: isEmergency ? '#050A14' : '#041322',
      borderRadius: '16px',
      overflow: 'hidden',
      border: isEmergency ? '1.5px solid rgba(220, 38, 38, 0.4)' : '1.5px solid rgba(15, 76, 92, 0.45)',
      boxShadow: isEmergency 
        ? '0 12px 36px rgba(220, 38, 38, 0.25), inset 0 1px 0 rgba(255,255,255,0.1)' 
        : '0 16px 40px rgba(15, 76, 92, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
      position: 'relative',
      transition: 'all 280ms cubic-bezier(0.16, 1, 0.3, 1)'
    }}>
      {/* =========================================================================
          TOP VIDEO TELE-CONSULTATION HUD (CALL STATUS, DOCTOR SWITCHER, EXPAND)
          ========================================================================= */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 12px',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.2) 100%)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        pointerEvents: 'auto'
      }}>
        {/* Left: Live Connection Badge & Timer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: isEmergency ? 'rgba(220, 38, 38, 0.85)' : 'rgba(16, 185, 129, 0.85)',
            padding: '3px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            fontWeight: 800,
            color: '#FFFFFF',
            boxShadow: isEmergency ? '0 0 10px rgba(239, 68, 68, 0.8)' : '0 0 10px rgba(16, 185, 129, 0.8)'
          }}>
            <span style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#FFFFFF',
              animation: 'greenRadarBlink 1.4s infinite'
            }} />
            <span>{isEmergency ? '108 ALS LIVE' : 'LIVE HD 5G'}</span>
          </div>

          <span style={{ fontSize: '11px', color: '#F1F5F9', fontWeight: 700, fontFamily: 'monospace' }}>
            {formatTimer(elapsedSeconds)}
          </span>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            color: '#94A3B8',
            fontSize: '9.5px',
            background: 'rgba(0,0,0,0.45)',
            padding: '2px 6px',
            borderRadius: '6px'
          }}>
            <ShieldCheck size={11} color={themeAccent} />
            <span>ABDM Encrypted</span>
          </div>

          <span style={{
            fontSize: '8.5px',
            background: 'rgba(245, 158, 11, 0.2)',
            color: '#FCD34D',
            border: '1px solid rgba(245, 158, 11, 0.35)',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 800,
            letterSpacing: '0.02em'
          }}>
            PROTOTYPE DEMO
          </span>
        </div>

        {/* Right: Persona Switcher & Cinema Expand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* Doctor Persona Switcher Dropdown */}
          <select
            value={selectedPersonaId}
            onChange={(e) => setSelectedPersonaId(e.target.value)}
            title="Switch Doctor Persona"
            style={{
              background: 'rgba(0, 0, 0, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#F1F5F9',
              borderRadius: '6px',
              padding: '3px 6px',
              fontSize: '9.5px',
              fontWeight: 750,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            <option value="priya" style={{ background: '#0A2540' }}>Dr. Priya (Hospital)</option>
            <option value="ananya" style={{ background: '#0A2540' }}>Dr. Ananya (OPD)</option>
            <option value="sanjivani" style={{ background: '#0A2540' }}>Dr. Sanjivani (108 ER)</option>
          </select>

          {onToggleExpand && (
            <button
              onClick={onToggleExpand}
              title={isExpanded ? "Collapse video" : "Expand to Cinema Teleconsultation"}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '3px 6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '9.5px',
                fontWeight: 700,
                backdropFilter: 'blur(8px)',
                transition: 'background 160ms ease'
              }}
            >
              {isExpanded ? <Minimize2 size={11} /> : <Maximize2 size={11} />}
              <span>{isExpanded ? 'Dock' : 'Cinema'}</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          MAIN DOCTOR VIDEO STREAM VIEWPORT WITH ANIMATED FACE ENGINE
          ========================================================================= */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: isExpanded ? '340px' : '230px',
        overflow: 'hidden',
        background: '#030D18',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Realistic Animated Doctor Face Engine */}
        <DoctorAvatarFace
          avatarUrl={effectiveAvatarUrl}
          avatarFrames={effectiveAvatarFrames}
          doctorName={effectiveDoctorName}
          isSpeaking={isSpeaking}
          isListening={isListening}
          isEmergency={isEmergency}
        />

        {/* Doctor Info Card Overlay (Bottom Left of Video) */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          left: '12px',
          zIndex: 10,
          background: 'rgba(5, 15, 28, 0.88)',
          padding: '6px 12px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(8px)',
          maxWidth: '260px'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 850,
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span>{effectiveDoctorName}</span>
            <CheckCircle2 size={12} color={themeAccent} />
          </div>
          <div style={{ fontSize: '9.5px', color: '#94A3B8', marginTop: '1px' }}>
            {effectiveDoctorRole}
          </div>
          <div style={{ fontSize: '8.5px', color: '#FCD34D', marginTop: '3px', fontWeight: 700 }}>
            AI assistant, not a doctor. Prototype demo.
          </div>
        </div>

        {/* Emergency 110 BPM CPR Visual Metronome Badge (If Emergency Mode) */}
        {isEmergency && emergencyMeta?.cprBpm && (
          <div style={{
            position: 'absolute',
            top: '42px',
            left: '12px',
            zIndex: 10,
            background: 'rgba(220, 38, 38, 0.9)',
            padding: '4px 10px',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 0 14px rgba(220, 38, 38, 0.8)'
          }}>
            <Heart size={12} style={{ animation: 'sanjivaniEmergencyPulse 0.54s infinite' }} fill="#FFF" />
            <span>{emergencyMeta.cprBpm} BPM CPR PACER</span>
          </div>
        )}

        {/* Active Listening Concentric Waves when User Speaks */}
        {isListening && (
          <div style={{
            position: 'absolute',
            top: '45%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '120px',
            pointerEvents: 'none',
            zIndex: 7
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `2px solid ${themeAccent}`,
              animation: 'radarWave 1.8s infinite ease-out'
            }} />
            <div style={{
              position: 'absolute',
              inset: '18%',
              borderRadius: '50%',
              border: `1.5px solid ${themeAccent}`,
              animation: 'radarWave 1.8s infinite ease-out 0.4s'
            }} />
          </div>
        )}

        {/* =======================================================================
            PATIENT PICTURE-IN-PICTURE (PIP) SELF-VIEW
            ======================================================================= */}
        <div style={{
          position: 'absolute',
          bottom: '10px',
          right: '12px',
          width: isExpanded ? '110px' : '88px',
          height: isExpanded ? '85px' : '68px',
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#0F172A',
          border: '1.5px solid rgba(255, 255, 255, 0.25)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.65)',
          zIndex: 15,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms ease'
        }}>
          {isCameraOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: 'scaleX(-1)' // Mirror selfie preview
              }}
            />
          ) : (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              color: '#94A3B8'
            }}>
              <User size={isExpanded ? 24 : 18} color="#CBD5E1" />
              <span style={{ fontSize: '8.5px', fontWeight: 700, color: '#CBD5E1' }}>
                {patientName.split(' ')[0]}
              </span>
              <span style={{ fontSize: '7px', color: '#64748B' }}>
                Cam Off
              </span>
            </div>
          )}

          {/* Quick Camera Flip Toggle on PIP */}
          <button
            onClick={toggleCamera}
            title={isCameraOn ? "Turn camera off" : "Turn camera on"}
            style={{
              position: 'absolute',
              bottom: '3px',
              right: '3px',
              background: isCameraOn ? 'rgba(0, 0, 0, 0.7)' : themeColor,
              border: 'none',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer',
              zIndex: 16
            }}
          >
            {isCameraOn ? <VideoOff size={10} /> : <Video size={10} />}
          </button>
        </div>
      </div>

      {/* =========================================================================
          SYNCHRONIZED BILINGUAL SUBTITLES (KARAOKE CAPTIONS)
          ========================================================================= */}
      <div style={{
        background: '#04101D',
        padding: '10px 14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        minHeight: '62px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: '4px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={12} color={themeAccent} />
          <span style={{ fontSize: '9.5px', fontWeight: 800, color: themeAccent, letterSpacing: '0.04em' }}>
            {isSpeaking 
              ? (isEmergency ? '108 TRIAGE VOICE SYNTHESIS' : 'DOCTOR CONSULTATION FEED')
              : (isListening ? 'LISTENING TO YOUR VOICE...' : 'LIVE CLINICAL AUDIO')}
          </span>
          <span style={{ fontSize: '9px', color: '#64748B', marginLeft: 'auto', fontFamily: 'monospace' }}>
            {language === 'te-IN' ? 'తెలుగు' : (language === 'hi-IN' ? 'हिन्दी' : (language === 'ta-IN' ? 'தமிழ்' : 'English'))}
          </span>
        </div>

        {/* Live Subtitle Vernacular Text */}
        <div style={{
          fontSize: isExpanded ? '13px' : '11.5px',
          fontWeight: 650,
          color: '#F8FAFC',
          lineHeight: 1.45,
          textShadow: '0 1px 3px rgba(0,0,0,0.5)',
          maxHeight: '48px',
          overflowY: 'auto'
        }}>
          {liveSubtitle || (isEmergency 
            ? "108 Telephony Connected. Monitoring acute chest pain and vitals. Pacing CPR at 110 BPM."
            : "Namaste! Dr. Ananya is here with you. Please describe your symptoms or ask any health question.")}
        </div>

        {/* English Translation Sub-bullet (if native language active) */}
        {englishTranslation && (
          <div style={{ fontSize: '10px', color: '#94A3B8', fontStyle: 'italic' }}>
            "{englishTranslation}"
          </div>
        )}
      </div>

      {/* =========================================================================
          VIDEO CALL ACTION TOOLBAR (MIC, CAM, MUTE, LANGUAGE, END CALL)
          ========================================================================= */}
      <div style={{
        padding: '10px 14px',
        background: '#020912',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px'
      }}>
        {/* Left Controls: Audio Mute & Language */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              title={isAudioMuted ? "Unmute Doctor Audio" : "Mute Doctor Audio"}
              style={{
                background: isAudioMuted ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                border: isAudioMuted ? '1px solid #EF4444' : '1px solid rgba(255, 255, 255, 0.15)',
                color: isAudioMuted ? '#EF4444' : '#E2E8F0',
                borderRadius: '8px',
                padding: '6px 9px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '10px',
                fontWeight: 700
              }}
            >
              {isAudioMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          )}

          {/* Language Selector */}
          {onLanguageChange && (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              title="Select Video Call Language"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#E2E8F0',
                borderRadius: '8px',
                padding: '5px 8px',
                fontSize: '10px',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="te-IN" style={{ background: '#0A2540', color: '#FFF' }}>తెలుగు (Telugu)</option>
              <option value="hi-IN" style={{ background: '#0A2540', color: '#FFF' }}>हिन्दी (Hindi)</option>
              <option value="en-IN" style={{ background: '#0A2540', color: '#FFF' }}>English (India)</option>
              <option value="ta-IN" style={{ background: '#0A2540', color: '#FFF' }}>தமிழ் (Tamil)</option>
            </select>
          )}
        </div>

        {/* Center Controls: Big Primary Microphone & Camera Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Patient Camera Toggle */}
          <button
            onClick={toggleCamera}
            title={isCameraOn ? "Turn off your camera" : "Turn on your camera"}
            style={{
              background: isCameraOn ? 'rgba(0, 245, 212, 0.15)' : 'rgba(255, 255, 255, 0.08)',
              border: isCameraOn ? `1px solid ${themeAccent}` : '1px solid rgba(255, 255, 255, 0.15)',
              color: isCameraOn ? themeAccent : '#CBD5E1',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 160ms ease'
            }}
          >
            {isCameraOn ? <Video size={16} /> : <VideoOff size={16} />}
          </button>

          {/* Primary Voice Mic Button */}
          {onToggleMic && (
            <button
              onClick={onToggleMic}
              title={isMicActive ? "Stop speaking" : "Speak to Doctor"}
              style={{
                background: isMicActive 
                  ? (isEmergency ? '#DC2626' : '#0F4C5C') 
                  : (isEmergency ? 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)' : 'linear-gradient(135deg, #D4AF37 0%, #0F4C5C 100%)'),
                border: 'none',
                borderRadius: '50%',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: isMicActive 
                  ? (isEmergency ? '0 0 16px rgba(220, 38, 38, 0.9)' : '0 0 16px rgba(0, 245, 212, 0.9)')
                  : '0 4px 12px rgba(0,0,0,0.4)',
                transform: isMicActive ? 'scale(1.08)' : 'scale(1)',
                transition: 'all 180ms cubic-bezier(0.34, 1.4, 0.64, 1)'
              }}
            >
              {isMicActive ? <MicOff size={20} /> : <Mic size={20} />}
            </button>
          )}
        </div>

        {/* Right Controls: Red End Video Call Button */}
        <div>
          {onEndCall && (
            <button
              onClick={onEndCall}
              title="End Video Consultation"
              style={{
                background: '#EF4444',
                border: 'none',
                borderRadius: '8px',
                padding: '7px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 2px 10px rgba(239, 68, 68, 0.45)',
                transition: 'background 160ms ease'
              }}
            >
              <PhoneOff size={13} />
              <span>End Call</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
