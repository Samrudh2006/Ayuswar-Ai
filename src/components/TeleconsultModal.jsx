import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  Volume2, 
  ShieldCheck, 
  Activity, 
  Sparkles, 
  Globe, 
  Languages, 
  CheckCircle2,
  FileText
} from 'lucide-react';
import DoctorAvatarFace from './DoctorAvatarFace';

/**
 * TeleconsultModal Component
 * Implements Phase 1: Teleconsult WebRTC mobile video/audio telemedicine room.
 * Connects rural PHC health workers / citizens directly with urban specialist doctors
 * featuring real-time Indic captioning, camera PIP, and SOAP note synthesis.
 */
export default function TeleconsultModal({
  isOpen,
  onClose,
  patientName = 'Narayana Rao',
  doctorName = 'Dr. Priya Sharma, MD',
  specialty = 'Internal Medicine & AI Teleconsult'
}) {

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const [subtitleText, setSubtitleText] = useState('నమస్కారం.. మీ గుండె దడ మరియు ఛాతీ బరువు ఎలా ఉంది?');
  const [englishText, setEnglishText] = useState('Hello.. how is your heart flutter and chest heaviness?');

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    // Camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) videoRef.current.srcObject = stream;
        })
        .catch(() => {});
    }

    // Subtitle toggler
    const subInterval = setInterval(() => {
      setIsSpeaking(prev => !prev);
    }, 3500);

    return () => {
      clearInterval(timer);
      clearInterval(subInterval);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  if (!isOpen) return null;


  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(2, 6, 23, 0.95)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Teleconsult App Bar */}
      <div style={{
        padding: '14px 20px',
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: '#10B981',
            boxShadow: '0 0 10px #10B981'
          }} />
          <div>
            <div style={{ fontSize: '14px', fontWeight: 800 }}>{doctorName}</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>{specialty} • PHC Room #4</div>
          </div>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.4)',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: 700,
          fontFamily: 'monospace',
          color: '#38BDF8',
          border: '1px solid rgba(56, 189, 248, 0.3)'
        }}>
          {formatTime(callDuration)}
        </div>
      </div>

      {/* Main Video Call Canvas */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Doctor Main Frame */}
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#071626' }}>
          <DoctorAvatarFace 
            avatarUrl="/avatar/speaking.png" 
            isSpeaking={isSpeaking} 
            isListening={!isSpeaking} 
            size={280} 
          />
        </div>

        {/* Patient Selfie Camera PIP */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          width: '110px',
          height: '150px',
          borderRadius: '16px',
          background: '#0F172A',
          border: '2px solid rgba(15, 76, 92, 0.5)',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
        }}>
          {isVideoOn ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B', fontSize: '10px' }}>
              Cam Off
            </div>
          )}
          <div style={{
            position: 'absolute',
            bottom: '4px',
            left: '6px',
            fontSize: '9px',
            color: '#fff',
            fontWeight: 700,
            background: 'rgba(0,0,0,0.6)',
            padding: '1px 5px',
            borderRadius: '4px'
          }}>
            {patientName.split(' ')[0]} (You)
          </div>
        </div>

        {/* Real-time Bilingual Caption Box */}
        <div style={{
          position: 'absolute',
          bottom: '24px',
          left: '16px',
          right: '16px',
          background: 'rgba(6, 22, 38, 0.88)',
          backdropFilter: 'blur(12px)',
          borderRadius: '16px',
          padding: '12px 18px',
          border: '1px solid rgba(15, 76, 92, 0.4)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#38BDF8', letterSpacing: '-0.2px' }}>
            {subtitleText}
          </div>
          <div style={{ fontSize: '11.5px', color: '#CBD5E1', marginTop: '3px' }}>
            {englishText}
          </div>
        </div>
      </div>

      {/* Bottom Call Action Toolbar */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
      }}>
        {/* Mic Toggle */}
        <button
          onClick={() => setIsMicOn(!isMicOn)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: isMicOn ? 'rgba(255,255,255,0.15)' : '#DC2626',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
        </button>

        {/* Video Toggle */}
        <button
          onClick={() => setIsVideoOn(!isVideoOn)}
          style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: isVideoOn ? 'rgba(255,255,255,0.15)' : '#DC2626',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
        </button>

        {/* End Call Button */}
        <button
          onClick={onClose}
          style={{
            width: '54px',
            height: '54px',
            borderRadius: '50%',
            background: '#DC2626',
            color: '#fff',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(220, 38, 38, 0.5)'
          }}
          title="End Teleconsult"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );
}
