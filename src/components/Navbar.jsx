import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Languages,
  Activity,
  AlertTriangle,
  Menu,
  X,
  Stethoscope,
  Users,
  PhoneCall,
  Sparkles,
  Bot,
  ExternalLink,
  Layers,
  Cpu,
  BarChart3,
  BookOpen,
  Scan,
  Volume2
} from 'lucide-react';
import { useApp, SUPPORTED_LANGUAGES } from '../context/AppContext';
import AyuSwarLogoReveal from './AyuSwarLogoReveal';

export default function Navbar({ 
  onOpenSanjivani, 
  onOpenDoctorAuth, 
  onOpenPatientAuth,
  onOpenInnovationHub
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    selectedLanguage,
    setSelectedLanguage,
    isDemoMode,
    toggleDemoMode,
    doctorProfile,
    patientProfile
  } = useApp();
  const currentDoctor = doctorProfile;
  const currentPatient = patientProfile;

  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const solutionsRef = useRef(null);
  const resourcesRef = useRef(null);
  const langRef = useRef(null);

  // Close dropdowns on outside click or escape
  useEffect(() => {
    function handleClickOutside(event) {
      if (solutionsRef.current && !solutionsRef.current.contains(event.target)) {
        setSolutionsOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setResourcesOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangMenuOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSolutionsOpen(false);
        setResourcesOpen(false);
        setLangMenuOpen(false);
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setSolutionsOpen(false);
    setResourcesOpen(false);
    setLangMenuOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const currentPath = location.pathname;

  const isSolutionsActive = currentPath.startsWith('/solutions') || currentPath === '/scanner' || currentPath === '/audio-rx' || currentPath === '/acoustic-lab';
  const isResourcesActive = currentPath === '/datasets' || currentPath === '/language-matrix';
  const isTechActive = currentPath === '/technology';
  const isImpactActive = currentPath === '/benchmarks';
  const isEmergencyActive = currentPath.startsWith('/emergency');
  const isDoctorActive = currentPath.startsWith('/doctor-portal') || currentPath === '/auth/doctor';
  const isPatientActive = currentPath.startsWith('/patient-portal') || currentPath === '/auth/patient';

  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  const navItemStyle = (isActive) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '7px 12px',
    borderRadius: 8,
    border: isActive ? '1px solid #0F4C5C' : '1px solid transparent',
    background: isActive ? '#EEF6F8' : 'transparent',
    color: isActive ? '#0F4C5C' : '#091E26',
    fontWeight: isActive ? 700 : 500,
    fontSize: '0.875rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: 'none',
    userSelect: 'none'
  });

  const dropdownMenuStyle = {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: 6,
    background: '#ffffff',
    border: '1px solid #D1E1E6',
    borderRadius: 10,
    boxShadow: '0 12px 30px -5px rgba(15, 76, 92, 0.14), 0 8px 12px -6px rgba(15, 76, 92, 0.06)',
    padding: '8px',
    minWidth: 295,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    gap: 3
  };

  const dropdownItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    padding: '10px 12px',
    borderRadius: 8,
    background: isActive ? '#EEF6F8' : 'transparent',
    color: isActive ? '#0F4C5C' : '#091E26',
    fontWeight: isActive ? 650 : 500,
    fontSize: '0.85rem',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.12s ease',
    textAlign: 'left',
    border: 'none',
    width: '100%',
    boxSizing: 'border-box'
  });

  return (
    <>
      {/* Persistent Demo Mode Banner if active */}
      {isDemoMode && (
        <div style={{
          background: '#fef3c7',
          borderBottom: '1px solid #fde68a',
          color: '#92400e',
          padding: '6px 16px',
          fontSize: '0.775rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          textAlign: 'center'
        }}>
          <AlertTriangle size={14} color="#b45309" />
          <span>Synthetic demo data mode active — All records, metrics, and profiles are simulated fixtures.</span>
          <button
            onClick={() => toggleDemoMode(false)}
            style={{
              background: '#f59e0b',
              color: '#fff',
              border: 'none',
              borderRadius: 4,
              padding: '2px 8px',
              fontSize: '0.725rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginLeft: 8
            }}
          >
            Switch to Empty Live Mode
          </button>
        </div>
      )}

      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 900,
        background: '#FAF8F5',
        borderBottom: '1px solid #D1E1E6',
        boxShadow: '0 1px 4px 0 rgba(15, 76, 92, 0.06)'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '100%',
          padding: '10px clamp(16px, 2.5vw, 32px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}>
          {/* Brand Logo & Title with SVG Line-Draw Reveal */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0
            }}
          >
            <AyuSwarLogoReveal variant="navbar" showText={true} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="desktop-nav"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flexWrap: 'wrap'
            }}
            aria-label="Main Navigation"
          >
            <Link
              to="/"
              style={navItemStyle(currentPath === '/')}
              aria-current={currentPath === '/' ? 'page' : undefined}
            >
              Home
            </Link>

            {/* Solutions Dropdown */}
            <div ref={solutionsRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setSolutionsOpen(!solutionsOpen);
                  setResourcesOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') setSolutionsOpen(true);
                }}
                style={navItemStyle(isSolutionsActive)}
                aria-expanded={solutionsOpen}
                aria-haspopup="true"
                aria-current={isSolutionsActive ? 'true' : undefined}
              >
                <span>Solutions</span>
                <ChevronDown size={14} style={{ transform: solutionsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </button>

              {solutionsOpen && (
                <div style={dropdownMenuStyle} role="menu">
                  <Link
                    to="/solutions/opd_ambient_scribe"
                    onClick={() => setSolutionsOpen(false)}
                    style={dropdownItemStyle(currentPath === '/solutions/opd_ambient_scribe')}
                    role="menuitem"
                  >
                    <Stethoscope size={17} color="#0e7490" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 650, color: '#0f172a', whiteSpace: 'nowrap' }}>OPD Ambient Scribe</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 1 }}>Vernacular consultation drafting</div>
                    </div>
                  </Link>

                  <Link
                    to="/scanner"
                    onClick={() => setSolutionsOpen(false)}
                    style={dropdownItemStyle(currentPath === '/scanner')}
                    role="menuitem"
                  >
                    <Scan size={17} color="#0e7490" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 650, color: '#0f172a', whiteSpace: 'nowrap' }}>Blister Strip Scanner</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 1 }}>OCR & PMBJP generic pricing</div>
                    </div>
                  </Link>

                  <Link
                    to="/audio-rx"
                    onClick={() => setSolutionsOpen(false)}
                    style={dropdownItemStyle(currentPath === '/audio-rx')}
                    role="menuitem"
                  >
                    <Volume2 size={17} color="#0e7490" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 650, color: '#0f172a', whiteSpace: 'nowrap' }}>Vernacular Audio-Rx Studio</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 1 }}>Spoken dosage instructions</div>
                    </div>
                  </Link>

                  <Link
                    to="/acoustic-lab"
                    onClick={() => setSolutionsOpen(false)}
                    style={dropdownItemStyle(currentPath === '/acoustic-lab')}
                    role="menuitem"
                  >
                    <Activity size={17} color="#0e7490" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 650, color: '#0f172a', whiteSpace: 'nowrap' }}>Acoustic Biomarker Lab</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 1 }}>Non-diagnostic audio DSP features</div>
                    </div>
                  </Link>

                  <Link
                    to="/emergency"
                    onClick={() => setSolutionsOpen(false)}
                    style={dropdownItemStyle(currentPath === '/emergency')}
                    role="menuitem"
                  >
                    <PhoneCall size={17} color="#dc2626" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 650, color: '#dc2626', whiteSpace: 'nowrap' }}>Sanjivani-108 Emergency GIS</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 1 }}>Live ambulance telemetry & CPR metronome</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Technology */}
            <Link
              to="/technology"
              style={navItemStyle(isTechActive)}
              aria-current={isTechActive ? 'page' : undefined}
            >
              Technology
            </Link>

            {/* Clinical Impact / Benchmarks */}
            <Link
              to="/benchmarks"
              style={navItemStyle(isImpactActive)}
              aria-current={isImpactActive ? 'page' : undefined}
            >
              Clinical Impact
            </Link>

            {/* Resources Dropdown */}
            <div ref={resourcesRef} style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => {
                  setResourcesOpen(!resourcesOpen);
                  setSolutionsOpen(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown') setResourcesOpen(true);
                }}
                style={navItemStyle(isResourcesActive)}
                aria-expanded={resourcesOpen}
                aria-haspopup="true"
                aria-current={isResourcesActive ? 'true' : undefined}
              >
                <span>Resources</span>
                <ChevronDown size={14} style={{ transform: resourcesOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </button>

              {resourcesOpen && (
                <div style={dropdownMenuStyle} role="menu">
                  <Link
                    to="/language-matrix"
                    onClick={() => setResourcesOpen(false)}
                    style={dropdownItemStyle(currentPath === '/language-matrix')}
                    role="menuitem"
                  >
                    <Languages size={17} color="#0e7490" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 650, color: '#0f172a', whiteSpace: 'nowrap' }}>Indic Language Matrix</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 1 }}>ASR & TTS provider status</div>
                    </div>
                  </Link>

                  <Link
                    to="/datasets"
                    onClick={() => setResourcesOpen(false)}
                    style={dropdownItemStyle(currentPath === '/datasets')}
                    role="menuitem"
                  >
                    <BookOpen size={17} color="#0e7490" style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontWeight: 650, color: '#0f172a', whiteSpace: 'nowrap' }}>Clinical Knowledge & Lexicon</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: 1 }}>ICD-10 taxonomy & colloquial phrases</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* End of Main Nav Links */}
          </nav>

          {/* Right Controls: Language Selector, Demo Toggle, Portals, Mobile Hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Sanjivani-108 Dedicated Emergency GIS Button (Best Vivid Red Color) */}
            <button
              type="button"
              onClick={onOpenSanjivani ? onOpenSanjivani : () => navigate('/sanjivani')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #D64550 0%, #B91C1C 100%)',
                color: '#ffffff',
                fontSize: '0.825rem',
                fontWeight: 750,
                border: '1.5px solid #E53E3E',
                boxShadow: '0 2px 10px rgba(214, 69, 80, 0.35)',
                cursor: 'pointer',
                letterSpacing: '0.2px',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(214, 69, 80, 0.55)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 10px rgba(214, 69, 80, 0.35)';
              }}
              title="Launch Live Sanjivani-108 Emergency Operational Console"
            >
              <PhoneCall size={14} style={{ animation: 'sanjivaniEmergencyPulse 1s infinite' }} />
              <span className="sanjivani-btn-desktop">🚨 Sanjivani-108</span>
              <span className="sanjivani-btn-mobile" style={{ display: 'none' }}>🚨 108</span>
            </button>

            {/* Shared Language Selector */}
            <div ref={langRef} className="desktop-lang-picker" style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 6,
                  border: '1px solid #D1E1E6',
                  background: '#FAF8F5',
                  color: '#091E26',
                  fontSize: '0.8rem',
                  fontWeight: 650,
                  cursor: 'pointer'
                }}
                aria-label={`Language selector. Current: ${currentLangObj.name}`}
              >
                <Languages size={14} color="#0F4C5C" />
                <span>{currentLangObj.label}</span>
                <ChevronDown size={12} />
              </button>

              {langMenuOpen && (
                <div style={{ ...dropdownMenuStyle, minWidth: 180, right: 0, left: 'auto' }} role="menu">
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setSelectedLanguage(l.code);
                        setLangMenuOpen(false);
                      }}
                      style={{
                        ...dropdownItemStyle(selectedLanguage === l.code),
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{l.name}</span>
                      {selectedLanguage === l.code && <span style={{ color: '#0F4C5C', fontWeight: 700 }}>✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Doctor Login Quick Action (Visible on desktop) */}
            <button
              type="button"
              className="navbar-doctor-pill desktop-only-pill"
              onClick={() => {
                if (doctorProfile) navigate('/doctor-portal');
                else if (onOpenDoctorAuth) onOpenDoctorAuth();
                else navigate('/auth/doctor');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 8,
                background: isDoctorActive ? '#0F4C5C' : '#FAF8F5',
                color: isDoctorActive ? '#ffffff' : '#0F4C5C',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: '1px solid',
                borderColor: isDoctorActive ? '#0F4C5C' : '#D1E1E6',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              title="Doctor Clinical Login & OPD Workspace"
            >
              <Stethoscope size={14} color={isDoctorActive ? '#ffffff' : '#0F4C5C'} />
              <span>{doctorProfile ? 'Doctor (Active)' : 'Doctor'}</span>
            </button>

            {/* Patient Login Quick Action (Visible on desktop) */}
            <button
              type="button"
              className="navbar-patient-pill desktop-only-pill"
              onClick={() => {
                if (patientProfile) navigate('/patient-portal');
                else if (onOpenPatientAuth) onOpenPatientAuth();
                else navigate('/auth/patient');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 10px',
                borderRadius: 8,
                background: isPatientActive ? '#0F4C5C' : '#FAF8F5',
                color: isPatientActive ? '#ffffff' : '#0F4C5C',
                fontSize: '0.8rem',
                fontWeight: 700,
                border: '1px solid',
                borderColor: isPatientActive ? '#0F4C5C' : '#D1E1E6',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              title="Patient ABHA Citizen Login"
            >
              <Users size={14} color={isPatientActive ? '#ffffff' : '#0F4C5C'} />
              <span>{patientProfile ? 'Patient (ABHA)' : 'Patient'}</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                padding: '7px 9px',
                borderRadius: 8,
                border: '1.5px solid #cbd5e1',
                background: mobileMenuOpen ? '#0F4C5C' : '#f8fafc',
                color: mobileMenuOpen ? '#ffffff' : '#0A2540',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease'
              }}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div 
            className="mobile-slide-drawer"
            style={{
              padding: '16px 20px 24px 20px',
              background: '#ffffff',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              boxShadow: '0 12px 32px rgba(10, 37, 64, 0.12)',
              animation: 'slideDownNav 0.22s ease-out'
            }}
          >
            {/* Sanjivani-108 Dedicated Mobile Emergency Dispatch Card */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenSanjivani) onOpenSanjivani();
                else navigate('/sanjivani');
              }}
              style={{
                background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
                color: '#ffffff',
                border: '1.5px solid #EF4444',
                borderRadius: 12,
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(220, 38, 38, 0.4)',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <PhoneCall size={20} color="#ffffff" style={{ animation: 'sanjivaniEmergencyPulse 1s infinite' }} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#FFFFFF' }}>
                    🚨 Sanjivani-108 Emergency GIS
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#FECACA' }}>
                    Live Ambulance Dispatch & Triage
                  </div>
                </div>
              </div>
              <span style={{ fontSize: '11px', background: '#FFFFFF', color: '#DC2626', padding: '3px 8px', borderRadius: '8px', fontWeight: 800 }}>
                SOS
              </span>
            </button>

            {/* Top Quick Action Cards: Doctor Portal & Patient Portal */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 2 }}>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (doctorProfile) navigate('/doctor-portal');
                  else if (onOpenDoctorAuth) onOpenDoctorAuth();
                  else navigate('/auth/doctor');
                }}
                style={{
                  background: 'linear-gradient(135deg, #0A2540 0%, #0F4C5C 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(15, 76, 92, 0.28)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Stethoscope size={20} color="#D4AF37" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Doctor Portal</div>
                  <div style={{ fontSize: '0.675rem', opacity: 0.85 }}>
                    {doctorProfile ? 'Open OPD Workspace' : 'Sign In / Register'}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (patientProfile) navigate('/patient-portal');
                  else if (onOpenPatientAuth) onOpenPatientAuth();
                  else navigate('/auth/patient');
                }}
                style={{
                  background: 'linear-gradient(135deg, #0A2540 0%, #D97706 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '12px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.28)',
                  textAlign: 'center'
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={20} color="#FBBF24" />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Patient Portal</div>
                  <div style={{ fontSize: '0.675rem', opacity: 0.85 }}>
                    {patientProfile ? 'Open ABHA Card' : 'Sign In / ABHA'}
                  </div>
                </div>
              </button>
            </div>

            {/* 14-Phase Mobile Clinical Innovation Suite Launcher Card */}
            {onOpenInnovationHub && (
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInnovationHub();
                }}
                style={{
                  background: 'linear-gradient(135deg, #061626 0%, #0F3254 100%)',
                  color: '#ffffff',
                  border: '1.5px solid rgba(212, 175, 55, 0.4)',
                  borderRadius: 12,
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Sparkles size={18} color="#D4AF37" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#FFFFFF' }}>
                      🚀 14-Phase Mobile Innovation Suite
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>
                      Teleconsult, Scribe, Pill-Vision, rPPG Vitals, Offline-Sync
                    </div>
                  </div>
                </div>
                <span style={{ fontSize: '11px', background: 'rgba(212, 175, 55, 0.2)', color: '#D4AF37', padding: '3px 8px', borderRadius: '10px', fontWeight: 800 }}>
                  OPEN
                </span>
              </button>
            )}

            {/* Language Selector in Drawer */}
            <div style={{ background: '#FAF8F5', padding: '10px 12px', borderRadius: 10, border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '0.725rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Languages size={13} color="#0F4C5C" />
                <span>Select Language</span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setSelectedLanguage(l.code);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: 20,
                      border: selectedLanguage === l.code ? '1.5px solid #0F4C5C' : '1px solid #CBD5E1',
                      background: selectedLanguage === l.code ? '#E6F7F8' : '#ffffff',
                      color: selectedLanguage === l.code ? '#0F4C5C' : '#334155',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>

            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/')}>Home</Link>
            
            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginTop: 4 }}>
              Solutions
            </div>
            <Link to="/solutions/opd_ambient_scribe" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/solutions/opd_ambient_scribe')}>
              OPD Ambient Scribe
            </Link>
            <Link to="/scanner" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/scanner')}>
              Blister Strip Scanner
            </Link>
            <Link to="/audio-rx" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/audio-rx')}>
              Vernacular Audio-Rx Studio
            </Link>
            <Link to="/acoustic-lab" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/acoustic-lab')}>
              Acoustic Biomarker Lab
            </Link>

            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginTop: 4 }}>
              Technical & Evidence
            </div>
            <Link to="/technology" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(isTechActive)}>
              Technology & Architecture
            </Link>
            <Link to="/benchmarks" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(isImpactActive)}>
              Clinical Impact (24 Tests)
            </Link>
            <Link to="/language-matrix" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/language-matrix')}>
              Indic Language Matrix
            </Link>
            <Link to="/datasets" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/datasets')}>
              Knowledge & Lexicon
            </Link>

            <div style={{ fontWeight: 700, fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', marginTop: 4 }}>
              Clinical Workspaces & Profiles
            </div>
            <Link to="/emergency" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(isEmergencyActive)}>
              Emergency Triage & CPR Metronome
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (doctorProfile) navigate('/doctor-portal');
                else if (onOpenDoctorAuth) onOpenDoctorAuth();
                else navigate('/auth/doctor');
              }}
              style={dropdownItemStyle(isDoctorActive)}
            >
              OPD Clinician Console {doctorProfile ? '(Active)' : '(Login / Register)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                if (patientProfile) navigate('/patient-portal');
                else if (onOpenPatientAuth) onOpenPatientAuth();
                else navigate('/auth/patient');
              }}
              style={dropdownItemStyle(isPatientActive)}
            >
              Citizen Health Record {patientProfile ? '(Active)' : '(Login / Register)'}
            </button>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Clinical Simulation Data:</span>
              <button
                onClick={() => toggleDemoMode()}
                style={{
                  padding: '4px 10px',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  background: isDemoMode ? '#fef3c7' : '#f1f5f9',
                  color: isDemoMode ? '#92400e' : '#475569',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {isDemoMode ? 'Active (Fixtures)' : 'Disabled (Empty)'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
