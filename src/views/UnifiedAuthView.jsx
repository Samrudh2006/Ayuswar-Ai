import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Stethoscope, 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ArrowRight, 
  Fingerprint, 
  CheckCircle2, 
  FileText, 
  Mic, 
  Pill, 
  Activity, 
  Sparkles,
  ChevronDown,
  Building2,
  Shield
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DOCTOR_REGISTRY } from '../data/clinicalRegistry';
import { DEMO_PATIENTS } from '../data/demoData';

/**
 * UnifiedAuthView
 * 
 * Pixel-perfect implementation of the AyuSwar AI Split-Screen Authentication Experience:
 * - Left Panel: Deep Navy Hero branding, acoustic microphone constellation hub, rural clinic illustration, and compliance trust badge.
 * - Right Panel: Modern crisp white card with Doctor/Citizen switcher, mobile/email login, password with eye toggle, ABHA biometric login, and DPDP privacy footer.
 */
export default function UnifiedAuthView({ defaultUserType = 'doctor' }) {
  const navigate = useNavigate();
  const { setCurrentDoctor, setCurrentPatient } = useApp();

  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [userType, setUserType] = useState(defaultUserType); // 'doctor' | 'patient'
  
  // Form Fields
  const [identifier, setIdentifier] = useState(
    defaultUserType === 'doctor' ? 'dr.priya@kurnoolphc.abdm.in' : 'lakshmi.amma@91-8842-1920-5511'
  );
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Handle User Type Switch
  const handleUserTypeChange = (type) => {
    setUserType(type);
    if (type === 'doctor') {
      setIdentifier('dr.priya@kurnoolphc.abdm.in');
    } else {
      setIdentifier('lakshmi.amma@91-8842-1920-5511');
    }
  };

  // Submit Handler
  const handleLoginSubmit = (e) => {
    e?.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (userType === 'doctor') {
        const doctorObj = DOCTOR_REGISTRY.pulmonology || {
          id: 'doc_priya',
          doctorName: 'Dr. Priya Sharma, MD',
          specialty: 'Pulmonology & Critical Care',
          facility: 'Kurnool District Hospital (ABDM PHC #1402)',
          experience: '14 years',
          hprId: 'dr.priya@hpr.abdm',
          avatar: '/assets/dr_ananya_avatar.jpg'
        };
        setCurrentDoctor(doctorObj);
        navigate('/doctor-portal');
      } else {
        const patientObj = DEMO_PATIENTS[0] || {
          id: 'pat_lakshmi',
          name: 'Lakshmi Amma',
          age: 58,
          gender: 'Female',
          language: 'Telugu',
          abhaId: '91-8842-1920-5511',
          phone: '+91-9000000001',
          village: 'Kurnool Rural'
        };
        setCurrentPatient(patientObj);
        navigate('/patient-portal');
      }
    }, 500);
  };

  // ABHA Direct Biometric Login Handler
  const handleAbhaLogin = () => {
    setIsLoading(true);
    setToastMessage('Authenticating with National Health Authority ABHA Gateway...');
    
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage(null);
      if (userType === 'doctor') {
        setCurrentDoctor(DOCTOR_REGISTRY.pulmonology);
        navigate('/doctor-portal');
      } else {
        setCurrentPatient(DEMO_PATIENTS[0]);
        navigate('/patient-portal');
      }
    }, 700);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#071526',
      display: 'flex',
      alignItems: 'stretch',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0A2540',
          color: '#ffffff',
          padding: '12px 24px',
          borderRadius: '12px',
          border: '1.5px solid #00D2D3',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          zIndex: 9999,
          fontSize: '13px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <Sparkles size={16} color="#00D2D3" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================================
          LEFT PANEL: BRAND HERO & ACOUSTIC HEALTHCARE ECOSYSTEM
          ========================================================================= */}
      <div 
        className="auth-hero-panel"
        style={{
          flex: '1 1 50%',
          background: 'linear-gradient(145deg, #050E1A 0%, #071526 50%, #0B1E36 100%)',
          padding: 'clamp(24px, 4vw, 48px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        {/* Subtle Ambient Radial Glow */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(0, 210, 211, 0.12) 0%, rgba(0, 139, 139, 0.04) 50%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        {/* Top: Logo & Tagline */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#071A2E',
              border: '1.5px solid #00D2D3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(0, 210, 211, 0.3)'
            }}>
              <Activity size={24} color="#00D2D3" />
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#FFFFFF', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.3px' }}>
                AyuSwar AI
              </div>
              <div style={{ fontSize: '11px', color: '#00D2D3', fontWeight: 600 }}>
                Care starts with a conversation
              </div>
            </div>
          </div>

          {/* Headline & EKG Line */}
          <h1 style={{
            fontSize: 'clamp(28px, 3.2vw, 42px)',
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.18,
            letterSpacing: '-0.8px',
            marginBottom: '12px',
            fontFamily: 'Outfit, sans-serif'
          }}>
            AI-Powered Vernacular<br />
            Healthcare for <span style={{ color: '#00D2D3' }}>Bharat</span>
          </h1>

          {/* Heartbeat EKG Pulse Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <svg width="60" height="16" viewBox="0 0 60 16" fill="none">
              <path d="M0 8H18L22 2L26 14L30 5L34 11L38 8H60" stroke="#00D2D3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <p style={{
            fontSize: '14.5px',
            color: '#94A3B8',
            lineHeight: 1.6,
            maxWidth: '520px',
            marginBottom: '32px'
          }}>
            AyuSwar AI helps doctors capture conversations, generate clinical notes, manage prescriptions, and deliver better care — in every language.
          </p>
        </div>

        {/* Central Constellation Graphic with 5 Nodes & Rural Health Centre Illustration */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '520px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Orbital Circle & Satellite Nodes Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '240px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Orbital Waveform Rings */}
            <div style={{
              position: 'absolute',
              width: '280px',
              height: '200px',
              borderRadius: '50%',
              border: '1px dashed rgba(0, 210, 211, 0.28)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              width: '210px',
              height: '140px',
              borderRadius: '50%',
              border: '1px solid rgba(0, 210, 211, 0.35)',
              pointerEvents: 'none'
            }} />

            {/* Acoustic Soundwave Lines radiating horizontally */}
            <div style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              left: '90px',
              pointerEvents: 'none'
            }}>
              {[12, 22, 16, 28, 14, 8].map((h, i) => (
                <div key={i} style={{ width: '2px', height: `${h}px`, background: '#00D2D3', opacity: 0.6, borderRadius: '2px' }} />
              ))}
            </div>
            <div style={{
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              right: '90px',
              pointerEvents: 'none'
            }}>
              {[8, 14, 28, 16, 22, 12].map((h, i) => (
                <div key={i} style={{ width: '2px', height: `${h}px`, background: '#00D2D3', opacity: 0.6, borderRadius: '2px' }} />
              ))}
            </div>

            {/* Central Glowing Mic */}
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #008B8B 0%, #00D2D3 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 32px rgba(0, 210, 211, 0.6), inset 0 0 12px rgba(255, 255, 255, 0.5)',
              zIndex: 10
            }}>
              <Mic size={32} color="#051322" strokeWidth={2.5} />
            </div>

            {/* Node 1: Voice Scribe (Top Left) */}
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '110px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#0A2540',
                border: '1.5px solid #00D2D3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 4px auto',
                boxShadow: '0 4px 14px rgba(0, 210, 211, 0.25)'
              }}>
                <FileText size={17} color="#00D2D3" />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>Voice Scribe</div>
              <div style={{ fontSize: '9px', color: '#94A3B8' }}>Zero typing</div>
            </div>

            {/* Node 2: Clinical Notes (Top Right) */}
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '110px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#0A2540',
                border: '1.5px solid #00D2D3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 4px auto',
                boxShadow: '0 4px 14px rgba(0, 210, 211, 0.25)'
              }}>
                <Activity size={17} color="#00D2D3" />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>Clinical Notes</div>
              <div style={{ fontSize: '9px', color: '#94A3B8' }}>AI Generated</div>
            </div>

            {/* Node 3: Smart Prescriptions (Far Left) */}
            <div style={{
              position: 'absolute',
              top: '85px',
              left: '10px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#0A2540',
                border: '1.5px solid #00D2D3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 4px auto',
                boxShadow: '0 4px 14px rgba(0, 210, 211, 0.25)'
              }}>
                <Pill size={17} color="#00D2D3" />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>Smart</div>
              <div style={{ fontSize: '9px', color: '#94A3B8' }}>Prescriptions</div>
            </div>

            {/* Node 4: ABDM & FHIR (Far Right) */}
            <div style={{
              position: 'absolute',
              top: '85px',
              right: '10px',
              textAlign: 'center'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: '#0A2540',
                border: '1.5px solid #00D2D3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 4px auto',
                boxShadow: '0 4px 14px rgba(0, 210, 211, 0.25)'
              }}>
                <ShieldCheck size={17} color="#00D2D3" />
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#FFFFFF' }}>ABDM & FHIR</div>
              <div style={{ fontSize: '9px', color: '#94A3B8' }}>Compliant</div>
            </div>

            {/* Node 5: Secure & Private (Bottom Center) */}
            <div style={{
              position: 'absolute',
              bottom: '5px',
              left: '50%',
              transform: 'translateX(-50%)',
              textAlign: 'center'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: '#0A2540',
                border: '1.5px solid #00D2D3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 3px auto',
                boxShadow: '0 4px 14px rgba(0, 210, 211, 0.25)'
              }}>
                <Lock size={15} color="#00D2D3" />
              </div>
              <div style={{ fontSize: '10.5px', fontWeight: 800, color: '#FFFFFF' }}>Secure & Private</div>
              <div style={{ fontSize: '8.5px', color: '#94A3B8' }}>Your data, protected</div>
            </div>
          </div>

          {/* Rural Health Centre Silhouette Graphic */}
          <div style={{
            width: '100%',
            maxWidth: '460px',
            marginTop: '12px',
            opacity: 0.9,
            display: 'flex',
            justifyContent: 'center'
          }}>
            <svg width="440" height="110" viewBox="0 0 440 110" fill="none">
              {/* Ground Line */}
              <line x1="10" y1="95" x2="430" y2="95" stroke="rgba(0, 210, 211, 0.35)" strokeWidth="1.5" />
              
              {/* Background Rural Health Centre Building */}
              <path d="M40 95V55L90 35L140 55V95H40Z" stroke="rgba(0, 210, 211, 0.25)" strokeWidth="1.5" fill="rgba(10, 37, 64, 0.4)" />
              {/* Red/Teal Cross atop PHC */}
              <rect x="87" y="22" width="6" height="14" fill="#00D2D3" opacity="0.8" rx="1" />
              <rect x="83" y="26" width="14" height="6" fill="#00D2D3" opacity="0.8" rx="1" />
              {/* Signboard */}
              <rect x="52" y="60" width="76" height="14" rx="2" stroke="rgba(0, 210, 211, 0.4)" fill="rgba(6, 22, 38, 0.7)" />
              <text x="90" y="70" textAnchor="middle" fill="#00D2D3" fontSize="6.5" fontWeight="700" letterSpacing="0.8">RURAL HEALTH CENTRE</text>

              {/* Consultation Desk in Foreground */}
              <rect x="230" y="68" width="100" height="27" rx="3" stroke="rgba(0, 210, 211, 0.4)" fill="rgba(10, 37, 64, 0.7)" />
              <line x1="245" y1="95" x2="245" y2="68" stroke="rgba(0, 210, 211, 0.4)" strokeWidth="1.5" />
              <line x1="315" y1="95" x2="315" y2="68" stroke="rgba(0, 210, 211, 0.4)" strokeWidth="1.5" />

              {/* Doctor Silhouette (Left of desk) */}
              {/* Head */}
              <circle cx="215" cy="46" r="10" stroke="#00D2D3" strokeWidth="1.5" fill="rgba(0, 210, 211, 0.15)" />
              {/* Stethoscope */}
              <path d="M211 54C211 58 219 58 219 54" stroke="#00D2D3" strokeWidth="1.5" strokeLinecap="round" />
              {/* Torso / Coat */}
              <path d="M198 75V62C198 57 206 55 215 55C224 55 232 57 232 62V75H198Z" stroke="#00D2D3" strokeWidth="1.5" fill="rgba(10, 37, 64, 0.6)" />
              {/* Chair */}
              <path d="M192 95V65H196" stroke="rgba(0, 210, 211, 0.3)" strokeWidth="1.5" />

              {/* Patient Silhouette (Right of desk, draped saree/shawl) */}
              {/* Head */}
              <circle cx="345" cy="48" r="9.5" stroke="#00D2D3" strokeWidth="1.5" fill="rgba(0, 210, 211, 0.15)" />
              {/* Torso */}
              <path d="M330 75V64C330 58 337 56 345 56C353 56 360 58 360 64V75H330Z" stroke="#00D2D3" strokeWidth="1.5" fill="rgba(10, 37, 64, 0.6)" />
              {/* Chair */}
              <path d="M366 95V67H362" stroke="rgba(0, 210, 211, 0.3)" strokeWidth="1.5" />

              {/* Subtle Acoustic Wave over Doctor-Patient Consultation */}
              <path d="M255 58C265 52 275 64 285 58C295 52 305 64 315 58" stroke="#00D2D3" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" strokeDasharray="2 3" />
            </svg>
          </div>
        </div>

        {/* Bottom: Trust & Compliance Card */}
        <div style={{
          background: 'rgba(10, 37, 64, 0.75)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          backdropFilter: 'blur(8px)',
          marginTop: '16px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'rgba(0, 210, 211, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Lock size={18} color="#00D2D3" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
              Secure. Compliant. Trusted.
            </div>
            <div style={{ fontSize: '11.5px', color: '#94A3B8', marginTop: '2px' }}>
              DPDP Act 2023 • ABDM • FHIR R4 • End-to-end Encryption
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: AUTHENTICATION FORM CARD
          ========================================================================= */}
      <div 
        className="auth-form-panel"
        style={{
          flex: '1 1 50%',
          background: '#FFFFFF',
          padding: 'clamp(24px, 4vw, 56px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRadius: '24px 0 0 24px',
          boxShadow: '-12px 0 40px rgba(0, 0, 0, 0.25)',
          overflowY: 'auto'
        }}
      >
        {/* Top Header Row with Back to Home Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1.5px solid #CBD5E1',
              background: '#FFFFFF',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 150ms ease'
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Form Container */}
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          {/* Main Title */}
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 900,
              color: '#0A2540',
              fontFamily: 'Outfit, sans-serif',
              letterSpacing: '-0.5px',
              marginBottom: '6px'
            }}>
              Welcome <span style={{ color: '#008B8B' }}>Back!</span>
            </h2>
            <p style={{ fontSize: '13.5px', color: '#64748B' }}>
              Login to your AyuSwar AI account
            </p>
          </div>

          {/* Login / Sign Up Tab Switcher */}
          <div style={{
            display: 'flex',
            borderBottom: '2px solid #E2E8F0',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: authMode === 'login' ? '2.5px solid #008B8B' : '2.5px solid transparent',
                marginBottom: '-2px',
                fontSize: '14px',
                fontWeight: 800,
                color: authMode === 'login' ? '#008B8B' : '#64748B',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setAuthMode('signup')}
              style={{
                flex: 1,
                padding: '10px 0',
                background: 'transparent',
                border: 'none',
                borderBottom: authMode === 'signup' ? '2.5px solid #008B8B' : '2.5px solid transparent',
                marginBottom: '-2px',
                fontSize: '14px',
                fontWeight: 800,
                color: authMode === 'signup' ? '#008B8B' : '#64748B',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Form Section Label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#0A2540' }}>
              <User size={16} color="#008B8B" />
              <span>{authMode === 'login' ? 'Login to your account' : 'Create your secure account'}</span>
            </div>

            {/* User Type Selector Dropdown */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                User Type
              </label>
              <div style={{ position: 'relative' }}>
                <select
                  value={userType}
                  onChange={(e) => handleUserTypeChange(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    background: '#F8FAFC',
                    fontSize: '13.5px',
                    color: '#0A2540',
                    fontWeight: 650,
                    appearance: 'none',
                    cursor: 'pointer',
                    outline: 'none'
                  }}
                >
                  <option value="doctor">Doctor / Healthcare Professional</option>
                  <option value="patient">Citizen / Patient</option>
                </select>
                <div style={{ position: 'absolute', left: '12px', top: '11px', pointerEvents: 'none', color: '#008B8B' }}>
                  {userType === 'doctor' ? <Stethoscope size={18} /> : <User size={18} />}
                </div>
                <div style={{ position: 'absolute', right: '12px', top: '13px', pointerEvents: 'none', color: '#64748B' }}>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Identifier: Mobile Number / Email ID */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                Mobile Number / Email ID
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter mobile number or email"
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '13.5px',
                    color: '#0A2540',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ position: 'absolute', left: '12px', top: '12px', pointerEvents: 'none', color: '#94A3B8' }}>
                  <Phone size={17} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                  Password
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => { e.preventDefault(); setToastMessage('ABDM OTP recovery dispatched to registered mobile.'); }}
                  style={{ fontSize: '11.5px', fontWeight: 700, color: '#008B8B', textDecoration: 'none', cursor: 'pointer' }}
                >
                  Forgot Password?
                </a>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 40px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    background: '#FFFFFF',
                    fontSize: '13.5px',
                    color: '#0A2540',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
                <div style={{ position: 'absolute', left: '12px', top: '12px', pointerEvents: 'none', color: '#94A3B8' }}>
                  <Lock size={17} />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '11px',
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Checkbox Row: Remember Me & Secure Login */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12.5px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#475569' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#008B8B', cursor: 'pointer' }}
                />
                <span>Remember me</span>
              </label>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#008B8B', fontWeight: 700, fontSize: '11.5px' }}>
                <ShieldCheck size={14} />
                <span>Secure Login</span>
              </div>
            </div>

            {/* Main CTA: Login Securely */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px 20px',
                borderRadius: '10px',
                border: 'none',
                background: '#044E4E',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(4, 78, 78, 0.35)',
                transition: 'all 180ms ease'
              }}
            >
              <ArrowRight size={17} />
              <span>{isLoading ? 'Authenticating...' : (authMode === 'login' ? 'Login Securely' : 'Create Account')}</span>
            </button>

            {/* Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              margin: '4px 0',
              color: '#94A3B8',
              fontSize: '11.5px',
              fontWeight: 700
            }}>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
              <span>OR</span>
              <div style={{ flex: 1, height: '1px', background: '#E2E8F0' }} />
            </div>

            {/* Secondary CTA: Login with ABHA (ABDM) */}
            <button
              type="button"
              onClick={handleAbhaLogin}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '11px 20px',
                borderRadius: '10px',
                border: '1.5px solid #CBD5E1',
                background: '#FFFFFF',
                color: '#0A2540',
                fontSize: '13px',
                fontWeight: 750,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'all 150ms ease'
              }}
            >
              <Fingerprint size={18} color="#008B8B" />
              <span>Login with ABHA (ABDM)</span>
            </button>
          </form>
        </div>

        {/* Bottom Privacy Notice Card */}
        <div style={{
          background: '#F0FDF4',
          borderRadius: '14px',
          border: '1px solid #BBF7D0',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '440px',
          width: '100%',
          margin: '24px auto 0 auto'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: '#047857',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Shield size={16} color="#FFFFFF" />
          </div>
          <div style={{ fontSize: '11.5px', color: '#166534', lineHeight: 1.4 }}>
            <strong>Your privacy matters</strong><br />
            We do not share your data with anyone. Read our{' '}
            <Link to="/privacy" style={{ color: '#047857', fontWeight: 800, textDecoration: 'underline' }}>
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
