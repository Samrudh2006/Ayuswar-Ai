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
  User,
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
import { preloadModule } from '../utils/routePreloader';

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
  const [loginOpen, setLoginOpen] = useState(false);

  const solutionsRef = useRef(null);
  const resourcesRef = useRef(null);
  const langRef = useRef(null);
  const loginRef = useRef(null);

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
      if (loginRef.current && !loginRef.current.contains(event.target)) {
        setLoginOpen(false);
      }
    }
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setSolutionsOpen(false);
        setResourcesOpen(false);
        setLangMenuOpen(false);
        setMobileMenuOpen(false);
        setLoginOpen(false);
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
    setLoginOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const [isMobileNavbar, setIsMobileNavbar] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobileNavbar(window.innerWidth <= 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
        <div className="navbar-header-inner" style={{
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
                    onMouseEnter={() => preloadModule('/solutions/opd_ambient_scribe')}
                    onFocus={() => preloadModule('/solutions/opd_ambient_scribe')}
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
                    onMouseEnter={() => preloadModule('/scanner')}
                    onFocus={() => preloadModule('/scanner')}
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
                    onMouseEnter={() => preloadModule('/audio-rx')}
                    onFocus={() => preloadModule('/audio-rx')}
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
                    onMouseEnter={() => preloadModule('/acoustic-lab')}
                    onFocus={() => preloadModule('/acoustic-lab')}
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
                    onMouseEnter={() => {
                      preloadModule('/emergency');
                      preloadModule('sanjivani_modal');
                    }}
                    onFocus={() => {
                      preloadModule('/emergency');
                      preloadModule('sanjivani_modal');
                    }}
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
              onMouseEnter={() => preloadModule('/technology')}
              onFocus={() => preloadModule('/technology')}
              style={navItemStyle(isTechActive)}
              aria-current={isTechActive ? 'page' : undefined}
            >
              Technology
            </Link>

            {/* Clinical Impact / Benchmarks */}
            <Link
              to="/benchmarks"
              onMouseEnter={() => preloadModule('/benchmarks')}
              onFocus={() => preloadModule('/benchmarks')}
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
                onMouseEnter={() => {
                  preloadModule('/language-matrix');
                  preloadModule('/datasets');
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
                    onMouseEnter={() => preloadModule('/language-matrix')}
                    onFocus={() => preloadModule('/language-matrix')}
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
                    onMouseEnter={() => preloadModule('/datasets')}
                    onFocus={() => preloadModule('/datasets')}
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
          <div className="navbar-right-controls" style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            {/* Sanjivani-108 Dedicated Emergency GIS Button (Best Vivid Red Color) */}
            <button
              type="button"
              className="navbar-sanjivani-btn"
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
                preloadModule('sanjivani_modal');
                preloadModule('/emergency');
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
              <span>{isMobileNavbar ? '108' : 'Sanjivani-108'}</span>
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

            {/* Unified Login Dropdown (Ensures desktop navbar fits cleanly on 1 line) */}
            <div ref={loginRef} className="desktop-only-pill" style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setLoginOpen(!loginOpen)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: (isDoctorActive || isPatientActive) ? '#0F4C5C' : '#FAF8F5',
                  color: (isDoctorActive || isPatientActive) ? '#ffffff' : '#0F4C5C',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  border: '1px solid',
                  borderColor: (isDoctorActive || isPatientActive) ? '#0F4C5C' : '#D1E1E6',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={() => {
                  preloadModule('/auth/doctor');
                  preloadModule('/auth/patient');
                  preloadModule('/doctor-portal');
                  preloadModule('/patient-portal');
                }}
                aria-expanded={loginOpen}
                aria-haspopup="true"
                title="Login to Doctor OPD Workspace or Patient ABHA Portal"
              >
                <User size={14} color={(isDoctorActive || isPatientActive) ? '#ffffff' : '#0F4C5C'} />
                <span>{doctorProfile ? 'Doctor (Active)' : (patientProfile ? 'Patient (Active)' : 'Login')}</span>
                <ChevronDown size={12} style={{ transform: loginOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </button>

              {loginOpen && (
                <div style={{ ...dropdownMenuStyle, minWidth: 200, right: 0, left: 'auto' }} role="menu">
                  <button
                    type="button"
                    onMouseEnter={() => {
                      preloadModule('/doctor-portal');
                      preloadModule('/auth/doctor');
                    }}
                    onClick={() => {
                      setLoginOpen(false);
                      if (doctorProfile) navigate('/doctor-portal');
                      else if (onOpenDoctorAuth) onOpenDoctorAuth();
                      else navigate('/auth/doctor');
                    }}
                    style={{ ...dropdownItemStyle(isDoctorActive), width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
                    role="menuitem"
                  >
                    <Stethoscope size={16} color="#0F4C5C" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 650, color: '#0f172a' }}>Doctor Login</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Clinical OPD workspace</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onMouseEnter={() => {
                      preloadModule('/patient-portal');
                      preloadModule('/auth/patient');
                    }}
                    onClick={() => {
                      setLoginOpen(false);
                      if (patientProfile) navigate('/patient-portal');
                      else if (onOpenPatientAuth) onOpenPatientAuth();
                      else navigate('/auth/patient');
                    }}
                    style={{ ...dropdownItemStyle(isPatientActive), width: '100%', textAlign: 'left', border: 'none', background: 'transparent' }}
                    role="menuitem"
                  >
                    <Users size={16} color="#0F4C5C" style={{ flexShrink: 0 }} />
                    <div>
                      <div style={{ fontWeight: 650, color: '#0f172a' }}>Patient Login</div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>ABHA Citizen Portal</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

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

        {/* Mobile Slide-in Sidebar (Sheet) & Backdrop Overlay */}
        {mobileMenuOpen && (
          <>
            {/* Backdrop Blur Overlay */}
            <div 
              className="mobile-sidebar-backdrop"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(9, 30, 38, 0.45)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                zIndex: 9998,
                animation: 'fadeInBackdrop 0.2s ease'
              }}
            />

            {/* Slide-in Sidebar Panel */}
            <aside 
              className="mobile-sidebar-panel"
              role="dialog"
              aria-label="Navigation Menu"
              aria-modal="true"
              style={{
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                width: '320px',
                maxWidth: '85vw',
                background: '#FFFFFF',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '-10px 0 36px rgba(10, 37, 64, 0.22)',
                animation: 'slideInRight 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                borderLeft: '1px solid #E2E8F0'
              }}
            >
              {/* Sidebar Header */}
              <div style={{
                padding: '16px 18px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: '#FAF8F5'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <AyuSwarLogoReveal size={30} showText={false} />
                  <div>
                    <div style={{ fontWeight: 850, fontSize: '1rem', color: '#0F4C5C', letterSpacing: '-0.2px' }}>
                      AyuSwar AI
                    </div>
                    <div style={{ fontSize: '0.675rem', color: '#64748B', fontWeight: 600 }}>
                      Clinical Navigation Menu
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: '1px solid #CBD5E1',
                    background: '#FFFFFF',
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                  }}
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Sidebar Scrollable Body */}
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '14px 16px 24px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}>
                {/* Top Quick Action Cards: Doctor Portal & Patient Portal */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
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
                      borderRadius: 10,
                      padding: '10px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(15, 76, 92, 0.25)',
                      textAlign: 'center'
                    }}
                  >
                    <Stethoscope size={18} color="#D4AF37" />
                    <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Doctor Portal</div>
                    <div style={{ fontSize: '0.625rem', opacity: 0.85 }}>
                      {doctorProfile ? 'Open OPD' : 'Sign In'}
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
                      borderRadius: 10,
                      padding: '10px 8px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)',
                      textAlign: 'center'
                    }}
                  >
                    <Users size={18} color="#FBBF24" />
                    <div style={{ fontWeight: 800, fontSize: '0.8rem' }}>Patient Portal</div>
                    <div style={{ fontSize: '0.625rem', opacity: 0.85 }}>
                      {patientProfile ? 'Open ABHA' : 'ABHA Login'}
                    </div>
                  </button>
                </div>

                <Link to="/" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/')}>
                  <div style={{ fontWeight: 750, color: currentPath === '/' ? '#0F4C5C' : '#091E26' }}>🏠 Home Landing</div>
                </Link>
                
                {/* Solutions Section */}
                <div style={{ fontWeight: 800, fontSize: '0.725rem', color: '#0F4C5C', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Clinical Solutions (5)</span>
                </div>
                
                <Link to="/solutions/opd_ambient_scribe" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/solutions/opd_ambient_scribe')}>
                  <Stethoscope size={18} color="#0F4C5C" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.825rem' }}>OPD Ambient Scribe</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Vernacular consultation drafting</div>
                  </div>
                </Link>
                
                <Link to="/scanner" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/scanner')}>
                  <Scan size={18} color="#0E7490" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.825rem' }}>Blister Strip Scanner</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>OCR & PMBJP generic pricing</div>
                  </div>
                </Link>
                
                <Link to="/audio-rx" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/audio-rx')}>
                  <Volume2 size={18} color="#6366F1" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.825rem' }}>Vernacular Audio-Rx Studio</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Spoken dosage instructions</div>
                  </div>
                </Link>
                
                <Link to="/acoustic-lab" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/acoustic-lab')}>
                  <Activity size={18} color="#0E7490" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.825rem' }}>Acoustic Biomarker Lab</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Non-diagnostic audio DSP features</div>
                  </div>
                </Link>

                <Link to="/emergency" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(isEmergencyActive)}>
                  <PhoneCall size={18} color="#DC2626" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#DC2626', fontSize: '0.825rem' }}>Sanjivani-108 Emergency GIS</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Live ambulance telemetry & CPR</div>
                  </div>
                </Link>

                {/* Technology Section */}
                <div style={{ fontWeight: 800, fontSize: '0.725rem', color: '#0F4C5C', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Technology & Evidence</span>
                </div>

                <Link to="/technology" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(isTechActive)}>
                  <Layers size={18} color="#0F4C5C" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.825rem' }}>Technology & Architecture</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Deep-Tech pipeline HLD & terminal</div>
                  </div>
                </Link>

                <Link to="/benchmarks" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(isImpactActive)}>
                  <BarChart3 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.825rem' }}>Clinical Impact & Validation</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>24 QA test suite & workflow model</div>
                  </div>
                </Link>

                {/* Resources Section (2 Things) */}
                <div style={{ fontWeight: 800, fontSize: '0.725rem', color: '#0F4C5C', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span>Resources (2 Modules)</span>
                </div>

                <Link to="/language-matrix" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/language-matrix')}>
                  <Languages size={18} color="#0E7490" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.825rem' }}>Indic Language Matrix</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>22 Scheduled languages & dialects</div>
                  </div>
                </Link>

                <Link to="/datasets" onClick={() => setMobileMenuOpen(false)} style={dropdownItemStyle(currentPath === '/datasets')}>
                  <BookOpen size={18} color="#D97706" style={{ flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.825rem' }}>Clinical Knowledge & Lexicon</div>
                    <div style={{ fontSize: '0.7rem', color: '#64748B' }}>ICD-10 taxonomy & colloquial phrases</div>
                  </div>
                </Link>
              </div>

              {/* Sidebar Footer */}
              <div style={{
                padding: '12px 16px',
                borderTop: '1px solid #E2E8F0',
                background: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Simulation Data:</span>
                <button
                  type="button"
                  onClick={() => toggleDemoMode()}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid #CBD5E1',
                    background: isDemoMode ? '#FEF3C7' : '#FFFFFF',
                    color: isDemoMode ? '#92400E' : '#475569',
                    fontSize: '0.725rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isDemoMode ? 'Active (Fixtures)' : 'Disabled (Empty)'}
                </button>
              </div>
            </aside>
          </>
        )}
      </header>
    </>
  );
}
