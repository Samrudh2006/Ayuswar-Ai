import React, { useState } from 'react';
import { 
  Stethoscope, 
  ChevronDown, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Activity, 
  FileCode2, 
  BookOpen, 
  CheckCircle2, 
  LogOut,
  Pill,
  Radio,
  ArrowRight
} from 'lucide-react';

/**
 * Navbar Component
 * Enterprise navigation bar.
 * Provides explicit, secure access to Doctor Portal and Patient Seva Portal,
 * with role-based authenticated session indicators.
 */
export default function Navbar({ 
  activeView, 
  setActiveView, 
  onOpenTechModal, 
  onOpenDoctorAuthModal,
  onOpenPatientAuthModal,
  doctorProfile,
  patientProfile,
  onLogoutDoctor,
  onLogoutPatient
}) {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(216, 231, 235, 0.8)',
      boxShadow: '0 4px 20px rgba(10, 37, 64, 0.03)'
    }}>
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        {/* Brand Logo & Tagline */}
        <div 
          onClick={() => {
            setActiveView('landing');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', userSelect: 'none' }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(0, 139, 139, 0.28)',
            border: '2px solid #008B8B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ffffff'
          }}>
            <img 
              src="/assets/ayuswar_logo.jpg" 
              alt="AyuSwar AI Emblem" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <Stethoscope size={22} color="#008B8B" style={{ position: 'absolute' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 850,
                fontSize: '23px',
                color: '#0A2540',
                letterSpacing: '-0.5px'
              }}>
                Ayu<span style={{ color: '#008B8B' }}>Swar</span> <span style={{ color: '#D97706', fontSize: '19px' }}>AI</span>
              </span>
            </div>
            <div style={{
              fontSize: '8px',
              fontWeight: 750,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#5A7184',
              marginTop: '-2px'
            }}>
              Ambient Clinical Voice Intelligence
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <button 
            onClick={() => {
              setActiveView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14.5px',
              fontWeight: activeView === 'landing' ? 750 : 500,
              color: activeView === 'landing' ? '#008B8B' : '#0B2545',
              cursor: 'pointer',
              padding: '6px 4px'
            }}
          >
            Home
          </button>

          {/* Solutions Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button 
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14.5px',
                fontWeight: 500,
                color: '#0B2545',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 4px'
              }}
            >
              <span>Solutions</span>
              <ChevronDown size={14} color="#64748B" />
            </button>

            {solutionsOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '280px',
                background: '#ffffff',
                border: '1px solid #D8E7EB',
                borderRadius: '14px',
                boxShadow: '0 12px 36px rgba(10, 37, 64, 0.12)',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                zIndex: 200
              }}>
                <div 
                  onClick={() => {
                    const el = document.getElementById('solutions-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setSolutionsOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(0, 139, 139, 0.05)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>OPD Ambient Scribe</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Real-time dual-speaker clinical dictation</div>
                </div>
                <div 
                  onClick={() => {
                    const el = document.getElementById('solutions-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setSolutionsOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>Vernacular Audio-Rx</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Timbre v2.5 spoken dosage instructions</div>
                </div>
                <div 
                  onClick={() => {
                    const el = document.getElementById('solutions-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    setSolutionsOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>OpenCV Strip Scanner</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Computer vision blister strip validation</div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={onOpenTechModal}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14.5px',
              fontWeight: activeView === 'tech_specs' ? 750 : 500,
              color: activeView === 'tech_specs' ? '#008B8B' : '#0B2545',
              cursor: 'pointer',
              padding: '6px 4px'
            }}
          >
            Technology & HLD
          </button>

          <button 
            onClick={() => {
              setActiveView('landing');
              setTimeout(() => {
                const el = document.getElementById('impact-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14.5px',
              fontWeight: 500,
              color: '#0B2545',
              cursor: 'pointer',
              padding: '6px 4px'
            }}
          >
            Clinical Impact
          </button>

          {/* Resources Dropdown */}
          <div 
            style={{ position: 'relative' }}
            onMouseEnter={() => setResourcesOpen(true)}
            onMouseLeave={() => setResourcesOpen(false)}
          >
            <button 
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14.5px',
                fontWeight: 500,
                color: '#0B2545',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: '6px 4px'
              }}
            >
              <span>Resources</span>
              <ChevronDown size={14} color="#64748B" />
            </button>

            {resourcesOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                width: '270px',
                background: '#ffffff',
                border: '1px solid #D8E7EB',
                borderRadius: '14px',
                boxShadow: '0 12px 36px rgba(10, 37, 64, 0.12)',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                zIndex: 200
              }}>
                <div 
                  onClick={() => {
                    onOpenTechModal();
                    setResourcesOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(0, 139, 139, 0.05)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>Indic Voice Benchmarks</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>50+ dialects WER & acoustic accuracy</div>
                </div>
                <div 
                  onClick={() => {
                    onOpenTechModal();
                    setResourcesOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>ABDM & FHIR R4 Whitepaper</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Consent management & HPR gateway</div>
                </div>
              </div>
            )}
          </div>

          {/* Clinical Studio LIVE link */}
          <button 
            onClick={() => setActiveView('console')}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14.5px',
              fontWeight: 700,
              color: '#008B8B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 4px'
            }}
          >
            <span>Clinical Studio</span>
            <span style={{
              background: '#10B981',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 800,
              padding: '2px 6px',
              borderRadius: '10px',
              letterSpacing: '0.5px'
            }}>LIVE</span>
          </button>
        </nav>

        {/* Portals Access & Login CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeView === 'landing' ? (
            // Clean, unauthenticated landing page header
            <>
              <button 
                onClick={onOpenDoctorAuthModal}
                className="btn-outline"
                style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '24px' }}
                title="Sign in as Physician / Hospital Administrator"
              >
                <Stethoscope size={15} color="#008B8B" />
                <span>Doctor Portal</span>
              </button>

              <button 
                onClick={onOpenPatientAuthModal}
                className="btn-outline"
                style={{ fontSize: '13px', padding: '8px 16px', borderRadius: '24px', borderColor: 'rgba(217, 119, 6, 0.4)', color: '#D97706' }}
                title="Sign in as Citizen / ABHA Patient"
              >
                <Pill size={15} color="#D97706" />
                <span>Patient Portal</span>
              </button>

              <button 
                onClick={() => setActiveView('console')}
                className="btn-primary"
                style={{ fontSize: '13px', padding: '8px 18px', borderRadius: '24px', background: '#0A2540', color: '#ffffff' }}
                title="Launch Live Clinical Studio"
              >
                <Sparkles size={14} color="#00E5C9" />
                <span>Launch Studio</span>
                <ArrowRight size={14} />
              </button>
            </>
          ) : (
            // In-workspace navigation header
            <>
              <button 
                onClick={() => {
                  setActiveView('landing');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-outline"
                style={{ fontSize: '12.5px', padding: '7px 14px', borderRadius: '20px' }}
              >
                <span>← Back to Overview</span>
              </button>

              {activeView === 'doctor_portal' && (
                <button 
                  onClick={() => {
                    onLogoutDoctor();
                    setActiveView('landing');
                  }}
                  className="btn-outline"
                  style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '20px', color: '#EF4444', borderColor: '#FCA5A5' }}
                >
                  <LogOut size={13} />
                  <span>Exit Portal</span>
                </button>
              )}

              {activeView === 'patient_portal' && (
                <button 
                  onClick={() => {
                    onLogoutPatient();
                    setActiveView('landing');
                  }}
                  className="btn-outline"
                  style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '20px', color: '#EF4444', borderColor: '#FCA5A5' }}
                >
                  <LogOut size={13} />
                  <span>Exit Portal</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
}
