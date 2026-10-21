import React, { useState, useEffect } from 'react';
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
  Mic, 
  Pill, 
  Activity, 
  Sparkles, 
  ChevronDown, 
  Building2, 
  Shield, 
  Users, 
  Globe, 
  Clock, 
  Check, 
  CheckCircle2, 
  KeyRound, 
  RotateCcw 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DOCTOR_REGISTRY } from '../data/clinicalRegistry';
import { DEMO_PATIENTS } from '../data/demoData';

/**
 * UnifiedAuthView
 * 
 * Pixel-perfect dual-mode authentication view matching AyuSwar AI design specifications:
 * - Left Panel: Photorealistic rural PHC background image with high-end dark gradient vignette,
 *   authentic clinic doctor consultation visual, live PHC badge, voice scribing highlights,
 *   simulated clinical doctor testimonial, and ABDM sandbox architecture compliance footer.
 *   Remains identical across both Login and Sign Up for a unified single-product feel.
 * - Right Panel:
 *    * Mode 'login': Role switcher, 1-tap demo credentials autofill, clear password visibility,
 *      role-aware destination routing, ABHA biometric login, and DPDP privacy card.
 *    * Mode 'signup': 3-Step Guided Journey:
 *      ① Create Account (role-specific details, password check)
 *      ② Verify Contact (6-digit OTP verification with demo auto-fill)
 *      ③ Account Ready (profile overview + direct role-aware dashboard entry)
 */
export default function UnifiedAuthView({ defaultUserType = 'doctor' }) {
  const navigate = useNavigate();
  const { setCurrentDoctor, setCurrentPatient } = useApp();

  // Mode: 'login' | 'signup'
  const [authMode, setAuthMode] = useState('login');

  // Sign Up Stepper: 1: Create Account | 2: Verify Contact | 3: Account Ready
  const [signupStep, setSignupStep] = useState(1);

  // Role Type: 'doctor' | 'patient' | 'hospital'
  const [userType, setUserType] = useState(defaultUserType);

  // Login Form State (Clean defaults, never prefilled without user action)
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Form State
  const [signupForm, setSignupForm] = useState({
    fullName: '',
    licenseNumber: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    preferredLanguage: 'Telugu',
    preferredTimezone: '(GMT+05:30) Asia/Kolkata',
    referralCode: ''
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP Verification State (Step 2)
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [resendCooldown, setResendCooldown] = useState(45);

  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Countdown for OTP resend
  useEffect(() => {
    let interval = null;
    if (authMode === 'signup' && signupStep === 2 && resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [authMode, signupStep, resendCooldown]);

  // Password requirement validators
  const pwd = signupForm.password || '';
  const pwdRequirements = {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd)
  };

  // Switch role type handler
  const handleUserTypeChange = (type) => {
    setUserType(type);
  };

  // 1-Tap Demo Account Autofill for Login
  const handleFillDemoAccount = (role) => {
    setUserType(role);
    if (role === 'doctor') {
      setIdentifier('dr.priya@kurnoolphc.abdm.in');
      setPassword('DoctorDemo#2026');
      setToastMessage('Loaded Demo Doctor (Dr. Priya Sharma, MD)');
    } else if (role === 'patient') {
      setIdentifier('lakshmi.amma@91-8842-1920-5511');
      setPassword('PatientDemo#2026');
      setToastMessage('Loaded Demo Patient (Lakshmi Amma)');
    } else {
      setIdentifier('phc.kurnool@abdm.gov.in');
      setPassword('HospitalDemo#2026');
      setToastMessage('Loaded Demo Facility (Kurnool PHC #1402)');
    }
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1-Tap Autofill for Sign Up (to test the 3-step flow smoothly)
  const handleFillDemoSignup = () => {
    if (userType === 'doctor') {
      setSignupForm({
        fullName: 'Dr. Ananya Rao',
        licenseNumber: 'APMC-2024-91823',
        email: 'dr.ananya@kurnoolphc.abdm.in',
        mobile: '+91 98480 22338',
        password: 'DoctorSafe@2026',
        confirmPassword: 'DoctorSafe@2026',
        preferredLanguage: 'Telugu',
        preferredTimezone: '(GMT+05:30) Asia/Kolkata',
        referralCode: 'GNANI-PHC-2026'
      });
    } else if (userType === 'hospital') {
      setSignupForm({
        fullName: 'Kurnool PHC Sub-Center #14',
        licenseNumber: 'HFR-ABDM-884920',
        email: 'subcenter14.kurnool@abdm.gov.in',
        mobile: '+91 94401 55220',
        password: 'HospitalSafe@2026',
        confirmPassword: 'HospitalSafe@2026',
        preferredLanguage: 'Telugu',
        preferredTimezone: '(GMT+05:30) Asia/Kolkata',
        referralCode: 'GNANI-HFR-2026'
      });
    } else {
      setSignupForm({
        fullName: 'Lakshmi Amma',
        licenseNumber: '91-8842-1920-5511',
        email: 'lakshmi.amma@bharat.in',
        mobile: '+91 90000 00001',
        password: 'CitizenSafe@2026',
        confirmPassword: 'CitizenSafe@2026',
        preferredLanguage: 'Telugu',
        preferredTimezone: '(GMT+05:30) Asia/Kolkata',
        referralCode: 'AYUSWAR-CARE'
      });
    }
    setToastMessage('Demo sign-up form filled. Click "Continue to Verification"');
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Submit Login Handler with Role-Aware Redirection
  const handleLoginSubmit = (e) => {
    e?.preventDefault();
    if (!identifier) {
      setToastMessage('Please enter your mobile, email, or click a 1-tap demo account.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);

      if (userType === 'doctor' || userType === 'hospital') {
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
    }, 600);
  };

  // Sign-Up Step 1 -> Step 2
  const handleProceedToOtp = (e) => {
    e?.preventDefault();
    if (!signupForm.fullName) {
      setToastMessage('Please provide your full name');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }
    setIsLoading(true);
    setToastMessage('Sending 6-digit verification code...');
    setTimeout(() => {
      setIsLoading(false);
      setSignupStep(2);
      setResendCooldown(45);
      setToastMessage('Demo OTP sent: 884210');
      setTimeout(() => setToastMessage(null), 3000);
    }, 500);
  };

  // Autofill OTP helper
  const handleAutoFillOtp = () => {
    setOtpDigits(['8', '8', '4', '2', '1', '0']);
    setToastMessage('Demo OTP 884210 filled');
    setTimeout(() => setToastMessage(null), 1500);
  };

  // Sign-Up Step 2 -> Step 3
  const handleVerifyOtp = (e) => {
    e?.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setToastMessage('Please enter all 6 digits of the verification code');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    setIsLoading(true);
    setToastMessage('Verifying OTP credentials with ABDM sandbox gateway...');

    setTimeout(() => {
      setIsLoading(false);
      setSignupStep(3);
      setToastMessage('Account verified successfully!');
      setTimeout(() => setToastMessage(null), 2000);
    }, 600);
  };

  // Sign-Up Step 3 Complete -> Enter Role Dashboard
  const handleCompleteRegistration = () => {
    if (userType === 'doctor' || userType === 'hospital') {
      setCurrentDoctor({
        id: 'doc_new',
        doctorName: signupForm.fullName || 'Dr. Ananya Rao',
        specialty: userType === 'hospital' ? 'Hospital Medical Superintendent' : 'General Medicine & OPD',
        facility: userType === 'hospital' ? (signupForm.fullName || 'Kurnool PHC Facility') : 'Kurnool District PHC Facility #1402',
        experience: '8 years',
        hprId: signupForm.licenseNumber || 'dr.ananya@hpr.abdm',
        avatar: '/assets/dr_ananya_avatar.jpg'
      });
      navigate('/doctor-portal');
    } else {
      setCurrentPatient({
        id: 'pat_new',
        name: signupForm.fullName || 'Lakshmi Amma',
        age: 58,
        gender: 'Female',
        language: signupForm.preferredLanguage || 'Telugu',
        abhaId: signupForm.licenseNumber || '91-8842-1920-5511',
        phone: signupForm.mobile || '+91-9000000001',
        village: 'Kurnool Rural'
      });
      navigate('/patient-portal');
    }
  };

  // ABHA Direct Biometric Login Handler
  const handleAbhaLogin = () => {
    setIsLoading(true);
    setToastMessage('Authenticating with National Health Authority ABHA Gateway Sandbox...');
    
    setTimeout(() => {
      setIsLoading(false);
      setToastMessage(null);
      if (userType === 'doctor' || userType === 'hospital') {
        setCurrentDoctor(DOCTOR_REGISTRY.pulmonology);
        navigate('/doctor-portal');
      } else {
        setCurrentPatient(DEMO_PATIENTS[0]);
        navigate('/patient-portal');
      }
    }, 700);
  };

  return (
    <div 
      className="auth-layout-container"
      style={{
        height: '100vh',
        maxHeight: '100vh',
        overflow: 'hidden',
        background: '#FFFFFF',
        display: 'flex',
        alignItems: 'stretch',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}
    >
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
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
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
          LEFT PANEL: IMMERSIVE PHOTOREALISTIC RURAL HEALTHCARE HERO BACKGROUND
          Identical across Login and Sign Up for a unified, cohesive experience.
          ========================================================================= */}
      <div 
        className="auth-hero-panel"
        style={{
          flex: '1 1 50%',
          maxWidth: '50%',
          height: '100vh',
          maxHeight: '100vh',
          backgroundImage: 'url(/assets/auth_left_hero_bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          padding: 'clamp(20px, 2.5vw, 36px)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflowY: 'auto',
          borderRight: '1px solid #E2E8F0',
          boxSizing: 'border-box'
        }}
      >
        {/* Clean Vignette for Crisp Contrast & Optimal Image Visibility */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(4, 12, 23, 0.78) 0%, rgba(6, 21, 38, 0.48) 50%, rgba(4, 12, 23, 0.88) 100%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* Ambient Teal Radial Accent */}
        <div style={{
          position: 'absolute',
          top: '25%',
          left: '25%',
          width: '420px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(0, 210, 211, 0.16) 0%, rgba(0, 139, 139, 0.04) 55%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        {/* =========================================================================
            ROW 1: TOP-LEFT (BRAND LOGO) & TOP-RIGHT (LIVE PHC BADGE)
            ========================================================================= */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Top-Left: Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '13px',
              background: 'rgba(7, 26, 46, 0.9)',
              border: '1.5px solid #00D2D3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px rgba(0, 210, 211, 0.4)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}>
              <Activity size={24} color="#00D2D3" />
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 900, color: '#FFFFFF', fontFamily: 'Outfit, sans-serif', letterSpacing: '-0.3px' }}>
                AyuSwar AI
              </div>
              <div style={{ fontSize: '11px', color: '#00D2D3', fontWeight: 700, letterSpacing: '0.2px' }}>
                Care starts with a conversation
              </div>
            </div>
          </div>

          {/* Top-Right: Live PHC Status Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(4, 120, 87, 0.35)',
            border: '1px solid rgba(52, 211, 153, 0.5)',
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: 800,
            color: '#34D399',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#34D399', display: 'inline-block', boxShadow: '0 0 8px #34D399' }} />
            <span>Live in 1,400+ PHCs</span>
          </div>
        </div>

        {/* =========================================================================
            ROW 2: CENTER (HEADLINE, EKG PULSE & CORE INDIC FEATURES)
            ========================================================================= */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          margin: 'auto 0',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          padding: '16px 0'
        }}>
          {/* Main Headline */}
          <h1 style={{
            fontSize: 'clamp(28px, 2.7vw, 40px)',
            fontWeight: 900,
            color: '#FFFFFF',
            lineHeight: 1.18,
            letterSpacing: '-0.7px',
            marginBottom: '12px',
            fontFamily: 'Outfit, sans-serif',
            maxWidth: '520px'
          }}>
            AI-Powered Vernacular<br />
            Healthcare for <span style={{ color: '#00D2D3' }}>Bharat</span>
          </h1>

          {/* Heartbeat EKG Pulse Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '14px' }}>
            <svg width="64" height="18" viewBox="0 0 68 18" fill="none">
              <path d="M0 9H20L24 2L29 16L34 5L39 13L43 9H68" stroke="#00D2D3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ fontSize: '11.5px', color: '#00D2D3', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Real-Time Acoustic Scribing
            </span>
          </div>

          {/* Description */}
          <p style={{
            fontSize: '14px',
            color: '#E2E8F0',
            lineHeight: 1.6,
            maxWidth: '470px',
            marginBottom: '20px'
          }}>
            Empowering doctors and rural healthcare teams across India with zero-typing ambient OPD consultation, vernacular audio prescriptions, and instant ABDM interoperability.
          </p>

          {/* 3 Sleek Feature Chips */}
          <div className="auth-hero-desktop-only" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px', maxWidth: '500px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(7, 26, 46, 0.75)',
              border: '1px solid rgba(0, 210, 211, 0.4)',
              padding: '6px 14px',
              borderRadius: '24px',
              fontSize: '12px',
              fontWeight: 750,
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}>
              <Mic size={14} color="#00D2D3" />
              <span>Zero-Typing OPD Scribe</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(7, 26, 46, 0.75)',
              border: '1px solid rgba(0, 210, 211, 0.4)',
              padding: '6px 14px',
              borderRadius: '24px',
              fontSize: '12px',
              fontWeight: 750,
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}>
              <Globe size={14} color="#00D2D3" />
              <span>22+ Indic Languages</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(7, 26, 46, 0.75)',
              border: '1px solid rgba(0, 210, 211, 0.4)',
              padding: '6px 14px',
              borderRadius: '24px',
              fontSize: '12px',
              fontWeight: 750,
              color: '#FFFFFF',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}>
              <Pill size={14} color="#00D2D3" />
              <span>PMBJP Generic Rx Engine</span>
            </div>
          </div>
        </div>

        {/* =========================================================================
            ROW 3: BOTTOM-LEFT (DOCTOR TESTIMONIAL) & BOTTOM-RIGHT (ABDM ARCHITECTURE)
            ========================================================================= */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          width: '100%',
          gap: '14px',
          flexWrap: 'wrap'
        }}>
          {/* Bottom-Left: Clinical Scenario Testimonial */}
          <div className="auth-hero-desktop-only" style={{
            background: 'rgba(7, 21, 38, 0.82)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(0, 210, 211, 0.35)',
            borderRadius: '16px',
            padding: '14px 18px',
            maxWidth: '380px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ color: '#00D2D3', fontSize: '10.5px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.6px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Sparkles size={12} />
                <span>Simulated Clinical Scenario (Demo)</span>
              </span>
              <span style={{ fontSize: '10px', color: '#34D399', fontWeight: 800, background: 'rgba(52, 211, 153, 0.15)', padding: '2px 7px', borderRadius: '10px' }}>
                ● Live Demo
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#E2E8F0', fontStyle: 'italic', lineHeight: 1.45, margin: 0 }}>
              "AyuSwar AI allows me to speak naturally with patients in Telugu and Hindi while ambiently drafting accurate SOAP notes in real time."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#FFFFFF' }}>Dr. Priya Sharma, MD (Simulated Lead)</div>
                <div style={{ fontSize: '10px', color: '#94A3B8' }}>Kurnool PHC • APMC-2018-88421 (Demo)</div>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(0, 210, 211, 0.15)',
                padding: '3px 8px',
                borderRadius: '14px',
                border: '1px solid rgba(0, 210, 211, 0.4)',
                fontSize: '10px',
                fontWeight: 800,
                color: '#00D2D3'
              }}>
                <ShieldCheck size={11} />
                <span>Demo Scenario</span>
              </div>
            </div>
          </div>

          {/* Bottom-Right: ABDM Architecture & DPDP Act Trust Card */}
          <div className="auth-hero-desktop-only" style={{
            background: 'rgba(4, 14, 27, 0.85)',
            borderRadius: '16px',
            border: '1.5px solid rgba(255, 255, 255, 0.14)',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            maxWidth: '320px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.4)',
            boxSizing: 'border-box'
          }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              background: 'rgba(0, 210, 211, 0.16)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Lock size={17} color="#00D2D3" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF' }}>
                ABDM Sandbox Architecture
              </div>
              <div style={{ fontSize: '10.5px', color: '#94A3B8', marginTop: '2px', lineHeight: 1.35 }}>
                DPDP Act 2023 Principles • Ephemeral local processing
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          RIGHT PANEL: FRAMED 4-SIDED CLINICAL CARD (LOGIN & 3-STEP SIGN UP)
          ========================================================================= */}
      <div 
        className="auth-form-panel-wrapper"
        style={{
          flex: '1 1 50%',
          maxWidth: '50%',
          height: '100vh',
          maxHeight: '100vh',
          overflow: 'hidden',
          background: '#F8FAFC',
          padding: 'clamp(10px, 1.2vw, 18px)',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box'
        }}
      >
        <div 
          className="auth-form-panel"
          style={{
            flex: 1,
            height: '100%',
            background: '#FFFFFF',
            borderRadius: '24px',
            border: '2.5px solid #0F766E',
            boxShadow: '0 16px 40px -10px rgba(10, 37, 64, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
            padding: 'clamp(14px, 1.6vw, 22px) clamp(18px, 2.5vw, 36px)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            boxSizing: 'border-box',
            position: 'relative'
          }}
        >
        {/* Top Header Row with Government & National Health Gateway Accreditations */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {authMode === 'signup' && signupStep > 1 ? (
              <button
                type="button"
                onClick={() => setSignupStep(prev => prev - 1)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 18px',
                  borderRadius: '24px',
                  border: '2px solid #2DD4BF',
                  background: 'linear-gradient(135deg, #044E4E 0%, #0D9488 100%)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.2px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(4, 78, 78, 0.35)',
                  transition: 'all 150ms ease'
                }}
              >
                <ArrowLeft size={14} color="#5EEAD4" />
                <span>Back to Step {signupStep - 1}</span>
              </button>
            ) : authMode === 'signup' ? (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 20px',
                  borderRadius: '24px',
                  border: '2px solid #2DD4BF',
                  background: 'linear-gradient(135deg, #044E4E 0%, #0D9488 100%)',
                  color: '#FFFFFF',
                  fontSize: '13px',
                  fontWeight: 800,
                  letterSpacing: '0.2px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(4, 78, 78, 0.35)',
                  transition: 'all 150ms ease'
                }}
              >
                <ArrowLeft size={14} color="#5EEAD4" />
                <span>Back to Login</span>
              </button>
            ) : null}

            {/* Official NHA Gateway Pill Badge with Golden Highlight (Shown ONLY in Login Mode) */}
            {authMode === 'login' && (
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
                border: '1.5px solid #F59E0B',
                padding: '7px 16px',
                borderRadius: '24px',
                fontSize: '12px',
                fontWeight: 900,
                color: '#B45309',
                boxShadow: '0 2px 10px rgba(245, 158, 11, 0.22)',
                letterSpacing: '0.2px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B', boxShadow: '0 0 8px #F59E0B', display: 'inline-block' }} />
                <span>NHA ABDM Sandbox Gateway #1402</span>
              </div>
            )}
          </div>

          {/* Highlighted Back to Home Button */}
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 20px',
              borderRadius: '24px',
              border: '2px solid #2DD4BF',
              background: 'linear-gradient(135deg, #044E4E 0%, #0D9488 100%)',
              color: '#FFFFFF',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.2px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(4, 78, 78, 0.35)',
              transition: 'all 150ms ease'
            }}
          >
            <span>Back to Home</span>
            <ArrowRight size={14} color="#5EEAD4" />
          </button>
        </div>

        {/* Center Form Container - Generous width eliminating side whitespace */}
        <div 
          className="auth-form-container"
          style={{
            maxWidth: '720px',
            width: '100%',
            margin: '0 auto',
            padding: '4px 0 14px 0',
            position: 'relative'
          }}
        >
          {authMode === 'signup' ? (
            <div>
              {/* Sign Up Title */}
              <div style={{ marginBottom: '12px' }}>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: 900,
                  color: '#0A2540',
                  fontFamily: 'Outfit, sans-serif',
                  letterSpacing: '-0.5px',
                  marginBottom: '2px'
                }}>
                  Create your <span style={{ color: '#008B8B' }}>AyuSwar AI</span> account
                </h2>
              <p style={{ fontSize: '12.5px', color: '#64748B', margin: 0 }}>
                Join India's vernacular ambient clinical intelligence platform
              </p>
            </div>

            {/* Login / Sign Up Tab Switcher (keeps states feeling like same product) */}
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #E2E8F0',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setSignupStep(1); }}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2.5px solid transparent',
                  marginBottom: '-2px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: '#64748B',
                  cursor: 'pointer'
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                style={{
                  flex: 1,
                  padding: '9px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '2.5px solid #008B8B',
                  marginBottom: '-2px',
                  fontSize: '13.5px',
                  fontWeight: 800,
                  color: '#008B8B',
                  cursor: 'pointer'
                }}
              >
                Sign Up
              </button>
            </div>

            {/* 3-Step Stepper Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '22px',
              padding: '0 10px'
            }}>
              {/* Step 1: Create Account */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: signupStep >= 1 ? '#008B8B' : '#F1F5F9',
                  color: signupStep >= 1 ? '#FFFFFF' : '#64748B',
                  border: signupStep >= 1 ? '1.5px solid #008B8B' : '1.5px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 4px auto'
                }}>
                  {signupStep > 1 ? <Check size={16} /> : '1'}
                </div>
                <div style={{ fontSize: '11px', fontWeight: signupStep === 1 ? 800 : 650, color: signupStep === 1 ? '#008B8B' : '#64748B' }}>
                  ① Create Account
                </div>
              </div>

              {/* Connecting Line 1 */}
              <div style={{ flex: 1, height: '2px', background: signupStep >= 2 ? '#008B8B' : '#E2E8F0', margin: '0 8px 14px 8px' }} />

              {/* Step 2: Verify Contact */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: signupStep >= 2 ? '#008B8B' : '#F1F5F9',
                  color: signupStep >= 2 ? '#FFFFFF' : '#64748B',
                  border: signupStep >= 2 ? '1.5px solid #008B8B' : '1.5px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 4px auto'
                }}>
                  {signupStep > 2 ? <Check size={16} /> : '2'}
                </div>
                <div style={{ fontSize: '11px', fontWeight: signupStep === 2 ? 800 : 650, color: signupStep === 2 ? '#008B8B' : '#64748B' }}>
                  ② Verify Contact
                </div>
              </div>

              {/* Connecting Line 2 */}
              <div style={{ flex: 1, height: '2px', background: signupStep >= 3 ? '#008B8B' : '#E2E8F0', margin: '0 8px 14px 8px' }} />

              {/* Step 3: Account Ready */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: signupStep === 3 ? '#047857' : '#F1F5F9',
                  color: signupStep === 3 ? '#FFFFFF' : '#64748B',
                  border: signupStep === 3 ? '1.5px solid #047857' : '1.5px solid #CBD5E1',
                  fontWeight: 800,
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 4px auto'
                }}>
                  {signupStep === 3 ? <Check size={16} /> : '3'}
                </div>
                <div style={{ fontSize: '11px', fontWeight: signupStep === 3 ? 800 : 650, color: signupStep === 3 ? '#047857' : '#64748B' }}>
                  ③ Account Ready
                </div>
              </div>
            </div>

            {/* STEP 1: CREATE ACCOUNT */}
            {signupStep === 1 && (
              <div>
                {/* 1-Tap Demo Fill Helper */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1px dashed #CBD5E1',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '8px'
                }}>
                  <div style={{ fontSize: '11.5px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="#008B8B" />
                    <span>Demo mode: Test signup workflow without manual typing:</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleFillDemoSignup}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid #008B8B',
                      background: '#E6F7F8',
                      color: '#044E4E',
                      fontSize: '11px',
                      fontWeight: 750,
                      cursor: 'pointer'
                    }}
                  >
                    ⚡ Auto-Fill Demo Details
                  </button>
                </div>

                {/* Role Selector: "I am a *" */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#1E293B', marginBottom: '8px' }}>
                    Account Type <span style={{ color: '#DC2626' }}>*</span>
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                    {/* Role 1: Doctor */}
                    <button
                      type="button"
                      onClick={() => handleUserTypeChange('doctor')}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '10px',
                        border: userType === 'doctor' ? '2px solid #008B8B' : '1.5px solid #E2E8F0',
                        background: userType === 'doctor' ? '#F0FDFA' : '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <Stethoscope size={22} color={userType === 'doctor' ? '#008B8B' : '#64748B'} />
                      <div style={{ fontSize: '11.5px', fontWeight: 750, color: userType === 'doctor' ? '#008B8B' : '#334155', textAlign: 'center', lineHeight: 1.25 }}>
                        Doctor /<br />Clinical Lead
                      </div>
                    </button>

                    {/* Role 2: Patient */}
                    <button
                      type="button"
                      onClick={() => handleUserTypeChange('patient')}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '10px',
                        border: userType === 'patient' ? '2px solid #008B8B' : '1.5px solid #E2E8F0',
                        background: userType === 'patient' ? '#F0FDFA' : '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <Users size={22} color={userType === 'patient' ? '#008B8B' : '#64748B'} />
                      <div style={{ fontSize: '11.5px', fontWeight: 750, color: userType === 'patient' ? '#008B8B' : '#334155', textAlign: 'center', lineHeight: 1.25 }}>
                        Patient /<br />Caregiver
                      </div>
                    </button>

                    {/* Role 3: Hospital */}
                    <button
                      type="button"
                      onClick={() => handleUserTypeChange('hospital')}
                      style={{
                        padding: '12px 10px',
                        borderRadius: '10px',
                        border: userType === 'hospital' ? '2px solid #008B8B' : '1.5px solid #E2E8F0',
                        background: userType === 'hospital' ? '#F0FDFA' : '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <Building2 size={22} color={userType === 'hospital' ? '#008B8B' : '#64748B'} />
                      <div style={{ fontSize: '11.5px', fontWeight: 750, color: userType === 'hospital' ? '#008B8B' : '#334155', textAlign: 'center', lineHeight: 1.25 }}>
                        Hospital /<br />Health Centre
                      </div>
                    </button>
                  </div>
                </div>

                {/* 2-Column Sign Up Form */}
                <form onSubmit={handleProceedToOtp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Row 1: Full Name & License */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        Full Name <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          value={signupForm.fullName}
                          onChange={(e) => setSignupForm({ ...signupForm, fullName: e.target.value })}
                          placeholder={userType === 'doctor' ? 'e.g. Dr. Ananya Rao' : (userType === 'hospital' ? 'e.g. Kurnool PHC Facility' : 'e.g. Lakshmi Amma')}
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            borderRadius: '9px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            color: '#0A2540',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ position: 'absolute', left: '11px', top: '10px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <User size={16} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        {userType === 'doctor' ? 'Medical Council / License' : (userType === 'hospital' ? 'Facility Registry (HFR) ID' : 'ABHA Number / Mobile')} <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="text"
                          required
                          value={signupForm.licenseNumber}
                          onChange={(e) => setSignupForm({ ...signupForm, licenseNumber: e.target.value })}
                          placeholder={userType === 'doctor' ? 'e.g. APMC-2018-88421' : (userType === 'hospital' ? 'e.g. HFR-ABDM-104928' : 'e.g. 91-8842-1920-5511')}
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            borderRadius: '9px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            color: '#0A2540',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ position: 'absolute', left: '11px', top: '10px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <ShieldCheck size={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Email ID & Mobile Number */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        Email ID <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="email"
                          required
                          value={signupForm.email}
                          onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                          placeholder="your.email@domain.com"
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            borderRadius: '9px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            color: '#0A2540',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ position: 'absolute', left: '11px', top: '10px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <Mail size={16} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        Mobile Number <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type="tel"
                          required
                          value={signupForm.mobile}
                          onChange={(e) => setSignupForm({ ...signupForm, mobile: e.target.value })}
                          placeholder="+91 98480 22338"
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            borderRadius: '9px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            color: '#0A2540',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ position: 'absolute', left: '11px', top: '10px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <Phone size={16} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Password & Confirm Password */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        Password <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showSignupPassword ? 'text' : 'password'}
                          required
                          value={signupForm.password}
                          onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                          placeholder="Create a strong password"
                          style={{
                            width: '100%',
                            padding: '10px 36px 10px 36px',
                            borderRadius: '9px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            color: '#0A2540',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ position: 'absolute', left: '11px', top: '10px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <Lock size={16} />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '9px',
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer'
                          }}
                        >
                          {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        Confirm Password <span style={{ color: '#DC2626' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                          placeholder="Confirm your password"
                          style={{
                            width: '100%',
                            padding: '10px 36px 10px 36px',
                            borderRadius: '9px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            color: '#0A2540',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                        <div style={{ position: 'absolute', left: '11px', top: '10px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <Lock size={16} />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          style={{
                            position: 'absolute',
                            right: '10px',
                            top: '9px',
                            background: 'transparent',
                            border: 'none',
                            color: '#94A3B8',
                            cursor: 'pointer'
                          }}
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Requirement Badges */}
                  <div style={{
                    background: '#F8FAFC',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '11px',
                    color: '#64748B',
                    flexWrap: 'wrap'
                  }}>
                    <span style={{ fontWeight: 700, color: '#334155' }}>Password must contain:</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: pwdRequirements.length ? '#047857' : '#94A3B8' }}>
                      <Check size={12} /> At least 8 characters
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: pwdRequirements.uppercase ? '#047857' : '#94A3B8' }}>
                      <Check size={12} /> One uppercase letter
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: pwdRequirements.number ? '#047857' : '#94A3B8' }}>
                      <Check size={12} /> One number
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: pwdRequirements.special ? '#047857' : '#94A3B8' }}>
                      <Check size={12} /> One special character
                    </span>
                  </div>

                  {/* Row 4: Preferred Language */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        Primary Language (OPD Scribing)
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={signupForm.preferredLanguage}
                          onChange={(e) => setSignupForm({ ...signupForm, preferredLanguage: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            borderRadius: '9px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            color: '#0A2540',
                            outline: 'none',
                            appearance: 'none',
                            cursor: 'pointer',
                            background: '#FFFFFF'
                          }}
                        >
                          <option value="Telugu">Telugu (తెలుగు)</option>
                          <option value="Hindi">Hindi (हिन्दी)</option>
                          <option value="English">Indian English</option>
                          <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                          <option value="Tamil">Tamil (தமிழ்)</option>
                          <option value="Marathi">Marathi (मराठी)</option>
                        </select>
                        <div style={{ position: 'absolute', left: '11px', top: '10px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <Globe size={16} />
                        </div>
                        <div style={{ position: 'absolute', right: '11px', top: '12px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 700, color: '#334155', marginBottom: '5px' }}>
                        Timezone
                      </label>
                      <div style={{ position: 'relative' }}>
                        <select
                          value={signupForm.preferredTimezone}
                          onChange={(e) => setSignupForm({ ...signupForm, preferredTimezone: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 36px',
                            borderRadius: '9px',
                            border: '1.5px solid #CBD5E1',
                            fontSize: '13px',
                            color: '#0A2540',
                            outline: 'none',
                            appearance: 'none',
                            cursor: 'pointer',
                            background: '#FFFFFF'
                          }}
                        >
                          <option value="(GMT+05:30) Asia/Kolkata">(GMT+05:30) Asia/Kolkata (IST)</option>
                          <option value="(GMT+00:00) UTC">(GMT+00:00) UTC</option>
                        </select>
                        <div style={{ position: 'absolute', left: '11px', top: '10px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <Clock size={16} />
                        </div>
                        <div style={{ position: 'absolute', right: '11px', top: '12px', color: '#94A3B8', pointerEvents: 'none' }}>
                          <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit CTA: Continue to Verification */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    style={{
                      width: '100%',
                      padding: '13px 20px',
                      borderRadius: '10px',
                      border: 'none',
                      background: '#006D6D',
                      color: '#FFFFFF',
                      fontSize: '14px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(0, 109, 109, 0.35)',
                      marginTop: '4px',
                      transition: 'all 180ms ease'
                    }}
                  >
                    <span>{isLoading ? 'Processing...' : 'Continue to Verification (Step 2)'}</span>
                    <ArrowRight size={17} />
                  </button>

                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748B' }}>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => { setAuthMode('login'); setSignupStep(1); }}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#008B8B',
                        fontWeight: 800,
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      Login here
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 2: VERIFY CONTACT (OTP VERIFICATION) */}
            {signupStep === 2 && (
              <div style={{ padding: '10px 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    background: '#F0FDFA',
                    border: '1.5px solid #00D2D3',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 12px auto',
                    boxShadow: '0 4px 16px rgba(0, 210, 211, 0.25)'
                  }}>
                    <KeyRound size={26} color="#008B8B" />
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540', marginBottom: '6px' }}>
                    Verify Your Contact
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', maxWidth: '420px', margin: '0 auto' }}>
                    A 6-digit confirmation code was dispatched to{' '}
                    <strong style={{ color: '#0A2540' }}>{signupForm.email || signupForm.mobile || 'your contact'}</strong>.
                  </p>
                </div>

                {/* 1-Tap Demo OTP Pill */}
                <div style={{
                  background: '#F0FDFA',
                  border: '1.5px dashed #008B8B',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#044E4E' }}>
                      ⚡ Simulated Verification Code: <span style={{ letterSpacing: '2px', color: '#008B8B', fontSize: '14px' }}>884210</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Safe simulated sandbox OTP for instant evaluation.
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#008B8B',
                      color: '#FFFFFF',
                      fontSize: '11.5px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    Auto-Fill 884210
                  </button>
                </div>

                {/* 6-Digit OTP Inputs */}
                <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                    {otpDigits.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-box-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          const newDigits = [...otpDigits];
                          newDigits[index] = val;
                          setOtpDigits(newDigits);
                          if (val && index < 5) {
                            const nextBox = document.getElementById(`otp-box-${index + 1}`);
                            if (nextBox) nextBox.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
                            const prevBox = document.getElementById(`otp-box-${index - 1}`);
                            if (prevBox) prevBox.focus();
                          }
                        }}
                        style={{
                          width: '46px',
                          height: '52px',
                          textAlign: 'center',
                          fontSize: '20px',
                          fontWeight: 800,
                          borderRadius: '10px',
                          border: digit ? '2px solid #008B8B' : '1.5px solid #CBD5E1',
                          background: digit ? '#F0FDFA' : '#FFFFFF',
                          color: '#0A2540',
                          outline: 'none'
                        }}
                      />
                    ))}
                  </div>

                  {/* Resend Cooldown Timer */}
                  <div style={{ textAlign: 'center', fontSize: '12px', color: '#64748B' }}>
                    {resendCooldown > 0 ? (
                      <span>Resend code in <strong style={{ color: '#008B8B' }}>{resendCooldown}s</strong></span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setResendCooldown(45);
                          setToastMessage('New demo code dispatched: 884210');
                          setTimeout(() => setToastMessage(null), 2500);
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#008B8B',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <RotateCcw size={13} />
                        <span>Resend Verification Code</span>
                      </button>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginTop: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setSignupStep(1)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        background: '#FFFFFF',
                        color: '#334155',
                        fontSize: '13px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      style={{
                        padding: '12px 20px',
                        borderRadius: '10px',
                        border: 'none',
                        background: '#044E4E',
                        color: '#FFFFFF',
                        fontSize: '13.5px',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(4, 78, 78, 0.35)'
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>{isLoading ? 'Verifying OTP...' : 'Verify & Complete Account'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* STEP 3: ACCOUNT READY (ROLE-AWARE COMPLETION SCREEN) */}
            {signupStep === 3 && (
              <div style={{ padding: '10px 0', textAlign: 'center' }}>
                <div style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #047857 0%, #10B981 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  boxShadow: '0 0 28px rgba(16, 185, 129, 0.45)',
                  color: '#FFFFFF'
                }}>
                  <Check size={36} strokeWidth={3} />
                </div>

                <h3 style={{ fontSize: '24px', fontWeight: 900, color: '#0A2540', marginBottom: '6px', fontFamily: 'Outfit, sans-serif' }}>
                  Account Ready!
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748B', maxWidth: '440px', margin: '0 auto 20px auto', lineHeight: 1.5 }}>
                  Welcome to AyuSwar AI. Your account has been verified and provisioned in the ABDM Sandbox environment.
                </p>

                {/* Profile Confirmation Card */}
                <div style={{
                  background: '#F8FAFC',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  textAlign: 'left',
                  maxWidth: '460px',
                  margin: '0 auto 22px auto',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.03)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: '#E6F7F8',
                        color: '#008B8B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {userType === 'doctor' ? <Stethoscope size={18} /> : userType === 'hospital' ? <Building2 size={18} /> : <User size={18} />}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>
                          {signupForm.fullName || (userType === 'doctor' ? 'Dr. Ananya Rao' : 'Lakshmi Amma')}
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>
                          {userType === 'doctor' ? 'Clinical Lead' : (userType === 'hospital' ? 'Facility Command' : 'Citizen Health Profile')}
                        </div>
                      </div>
                    </div>
                    <span style={{
                      background: '#DCFCE7',
                      color: '#15803D',
                      fontSize: '11px',
                      fontWeight: 800,
                      padding: '3px 8px',
                      borderRadius: '12px',
                      border: '1px solid #BBF7D0'
                    }}>
                      ✓ Verified
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                    <div>
                      <span style={{ color: '#64748B' }}>{userType === 'doctor' ? 'HPR License:' : (userType === 'hospital' ? 'HFR Facility:' : 'ABHA Number:')}</span>
                      <div style={{ fontWeight: 750, color: '#0A2540' }}>{signupForm.licenseNumber || (userType === 'doctor' ? 'APMC-2024-91823' : '91-8842-1920-5511')}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Primary Language:</span>
                      <div style={{ fontWeight: 750, color: '#0A2540' }}>{signupForm.preferredLanguage || 'Telugu (తెలుగు)'}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Registered Contact:</span>
                      <div style={{ fontWeight: 750, color: '#0A2540' }}>{signupForm.email || signupForm.mobile || '+91 98480 22338'}</div>
                    </div>
                    <div>
                      <span style={{ color: '#64748B' }}>Designated Workspace:</span>
                      <div style={{ fontWeight: 750, color: '#008B8B' }}>
                        {userType === 'doctor' ? 'Doctor Clinical Console' : (userType === 'hospital' ? 'Hospital Command Center' : 'Patient Health Locker')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role-Aware Destination Button */}
                <button
                  type="button"
                  onClick={handleCompleteRegistration}
                  style={{
                    width: '100%',
                    maxWidth: '460px',
                    padding: '14px 24px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#044E4E',
                    color: '#FFFFFF',
                    fontSize: '14.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 16px rgba(4, 78, 78, 0.4)',
                    transition: 'all 180ms ease'
                  }}
                >
                  <span>
                    {userType === 'doctor' 
                      ? 'Enter Clinical OPD Workspace' 
                      : (userType === 'hospital' 
                        ? 'Enter Hospital Operations Dashboard' 
                        : 'Enter Patient Health Locker')}
                  </span>
                  <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ===================================================================
              VIEW 2: LOGIN MODE
              =================================================================== */
          <div>
            {/* Main Title & Subtitle */}
            <div style={{ marginBottom: '14px' }}>
              <h2 style={{
                fontSize: '32px',
                fontWeight: 900,
                color: '#0A2540',
                fontFamily: 'Outfit, sans-serif',
                letterSpacing: '-0.5px',
                marginBottom: '4px',
                lineHeight: 1.2
              }}>
                Welcome <span style={{ color: '#008B8B' }}>Back!</span>
              </h2>
              <p style={{ fontSize: '14.5px', color: '#475569', margin: 0, fontWeight: 500 }}>
                Login to your AyuSwar AI account
              </p>
            </div>

            {/* Login / Sign Up Tab Switcher */}
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #E2E8F0',
              marginBottom: '16px'
            }}>
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '3px solid #008B8B',
                  marginBottom: '-2px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#008B8B',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setSignupStep(1); }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '3px solid transparent',
                  marginBottom: '-2px',
                  fontSize: '15px',
                  fontWeight: 800,
                  color: '#64748B',
                  cursor: 'pointer',
                  transition: 'all 150ms ease'
                }}
              >
                Sign Up
              </button>
            </div>

            {/* 1-Tap Quick Demo Accounts Selector (Safe, labeled, no prefilled fake personal data) */}
            <div style={{
              background: '#F0FDFA',
              border: '1.5px dashed #008B8B',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#044E4E', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={15} color="#008B8B" />
                  <span>1-Tap Demo Credentials:</span>
                </span>
                <span style={{
                  fontSize: '11px',
                  color: '#0F766E',
                  fontWeight: 800,
                  background: '#CCFBF1',
                  padding: '3px 9px',
                  borderRadius: '12px'
                }}>
                  Safe Demo Login
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => handleFillDemoAccount('doctor')}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: userType === 'doctor' && identifier ? '2px solid #008B8B' : '1.5px solid #CBD5E1',
                    background: userType === 'doctor' && identifier ? '#E6F7F8' : '#FFFFFF',
                    color: '#0A2540',
                    fontSize: '12.5px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: userType === 'doctor' && identifier ? '0 2px 6px rgba(0, 139, 139, 0.2)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  🩺 Demo Doctor
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemoAccount('patient')}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: userType === 'patient' && identifier ? '2px solid #008B8B' : '1.5px solid #CBD5E1',
                    background: userType === 'patient' && identifier ? '#E6F7F8' : '#FFFFFF',
                    color: '#0A2540',
                    fontSize: '12.5px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: userType === 'patient' && identifier ? '0 2px 6px rgba(0, 139, 139, 0.2)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  👤 Demo Patient
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemoAccount('hospital')}
                  style={{
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: userType === 'hospital' && identifier ? '2px solid #008B8B' : '1.5px solid #CBD5E1',
                    background: userType === 'hospital' && identifier ? '#E6F7F8' : '#FFFFFF',
                    color: '#0A2540',
                    fontSize: '12.5px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    boxShadow: userType === 'hospital' && identifier ? '0 2px 6px rgba(0, 139, 139, 0.2)' : 'none',
                    transition: 'all 150ms ease'
                  }}
                >
                  🏥 Demo Facility
                </button>
              </div>
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* User Type Selector Dropdown */}
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  Account Role
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={userType}
                    onChange={(e) => handleUserTypeChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      background: '#F8FAFC',
                      fontSize: '14.5px',
                      color: '#0A2540',
                      fontWeight: 650,
                      appearance: 'none',
                      cursor: 'pointer',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="doctor">Doctor / Clinical Healthcare Lead</option>
                    <option value="patient">Citizen / Patient (ABHA Health Locker)</option>
                    <option value="hospital">Hospital / Rural Health Centre Command</option>
                  </select>
                  <div style={{ position: 'absolute', left: '14px', top: '13px', pointerEvents: 'none', color: '#008B8B' }}>
                    {userType === 'doctor' ? <Stethoscope size={19} /> : userType === 'hospital' ? <Building2 size={19} /> : <User size={19} />}
                  </div>
                  <div style={{ position: 'absolute', right: '14px', top: '15px', pointerEvents: 'none', color: '#64748B' }}>
                    <ChevronDown size={16} />
                  </div>
                </div>
              </div>

              {/* Identifier: Mobile Number / Email ID */}
              <div>
                <label style={{ display: 'block', fontSize: '13.5px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                  Mobile Number / Email ID / ABHA ID
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={userType === 'doctor' ? 'e.g. dr.priya@kurnoolphc.abdm.in' : (userType === 'hospital' ? 'e.g. phc.kurnool@abdm.gov.in' : 'e.g. lakshmi.amma@91-8842-1920-5511')}
                    style={{
                      width: '100%',
                      padding: '12px 16px 12px 44px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      background: '#FFFFFF',
                      fontSize: '14.5px',
                      color: '#0A2540',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ position: 'absolute', left: '14px', top: '14px', pointerEvents: 'none', color: '#94A3B8' }}>
                    <Phone size={18} />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13.5px', fontWeight: 800, color: '#0F172A' }}>
                    Password
                  </label>
                  <a 
                    href="#forgot" 
                    onClick={(e) => { e.preventDefault(); setToastMessage('ABDM OTP recovery dispatched to registered mobile.'); }}
                    style={{ fontSize: '12.5px', fontWeight: 750, color: '#008B8B', textDecoration: 'none', cursor: 'pointer' }}
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
                      padding: '12px 44px 12px 44px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      background: '#FFFFFF',
                      fontSize: '14.5px',
                      color: '#0A2540',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <div style={{ position: 'absolute', left: '14px', top: '14px', pointerEvents: 'none', color: '#94A3B8' }}>
                    <Lock size={18} />
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '13px',
                      top: '12px',
                      background: 'transparent',
                      border: 'none',
                      color: '#94A3B8',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Checkbox Row: Remember Me & Secure Login */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', padding: '2px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: '#334155' }}>
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#008B8B', cursor: 'pointer' }}
                  />
                  <span style={{ fontWeight: 600 }}>Remember me</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#008B8B', fontWeight: 800, fontSize: '12.5px' }}>
                  <ShieldCheck size={16} />
                  <span>Secure Login</span>
                </div>
              </div>

              {/* Role-Aware Main CTA Button */}
              <button
                type="submit"
                disabled={isLoading}
                style={{
                  width: '100%',
                  padding: '13.5px 24px',
                  borderRadius: '11px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #044E4E 0%, #008B8B 100%)',
                  color: '#FFFFFF',
                  fontSize: '15.5px',
                  fontWeight: 800,
                  letterSpacing: '0.2px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow: '0 4px 16px rgba(4, 78, 78, 0.35)',
                  transition: 'all 180ms ease'
                }}
              >
                <span>
                  {isLoading 
                    ? 'Authenticating...' 
                    : (userType === 'doctor' 
                      ? 'Login to Clinical OPD Workspace' 
                      : userType === 'hospital' 
                        ? 'Login to Hospital Operations' 
                        : 'Login to Patient Health Locker')}
                </span>
                <ArrowRight size={18} />
              </button>

              {/* Divider */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                margin: '2px 0',
                color: '#94A3B8',
                fontSize: '12px',
                fontWeight: 800
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
                  padding: '11.5px 20px',
                  borderRadius: '11px',
                  border: '1.5px solid #CBD5E1',
                  background: '#FFFFFF',
                  color: '#0A2540',
                  fontSize: '14.5px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '9px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.04)',
                  transition: 'all 150ms ease'
                }}
              >
                <Fingerprint size={19} color="#008B8B" />
                <span>Login with ABHA (ABDM Sandbox)</span>
              </button>
            </form>

            {/* Bottom Privacy Notice Card (Honest, accurate description) */}
            <div style={{
              background: '#F0FDF4',
              borderRadius: '11px',
              border: '1.5px solid #BBF7D0',
              padding: '11px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              marginTop: '14px',
              boxSizing: 'border-box'
            }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: '#047857',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Shield size={15} color="#FFFFFF" />
              </div>
              <div style={{ fontSize: '11.5px', color: '#166534', lineHeight: 1.4 }}>
                <strong style={{ fontSize: '12px' }}>Client-side simulation • Your privacy matters</strong><br />
                AyuSwar AI processes audio locally in your browser session with zero unconsented cloud storage. Read our{' '}
                <Link to="/privacy" style={{ color: '#047857', fontWeight: 800, textDecoration: 'underline' }}>
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  </div>
);
}
