import React, { useState } from 'react';
import { 
  Stethoscope, 
  ChevronDown, 
  Sparkles, 
  User, 
  ShieldCheck, 
  Layers, 
  Activity, 
  FileCode2, 
  BookOpen, 
  CheckCircle2, 
  LogOut 
} from 'lucide-react';

/**
 * Navbar Component
 * World-class enterprise navigation bar following Emil Kowalski's tactile design principles.
 * Includes dropdown menus, official Gnani model status, and ABDM Doctor login portal.
 */
export default function Navbar({ 
  activeView, 
  setActiveView, 
  onOpenTechModal, 
  onOpenAuthModal, 
  doctorProfile, 
  onLogoutDoctor,
  onNavigateSection 
}) {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.94)',
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
          onClick={() => setActiveView('landing')}
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
              padding: '6px 4px',
              transition: 'color 160ms ease'
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
                  onClick={() => { setActiveView('console'); setSolutionsOpen(false); }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(0, 139, 139, 0.05)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A2540' }}>OPD Ambient Scribe</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Real-time dual-speaker medical dictation</div>
                </div>
                <div 
                  onClick={() => { setActiveView('console'); setSolutionsOpen(false); }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A2540' }}>Vernacular Audio-Rx</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Timbre v2.5 spoken dosage instructions</div>
                </div>
                <div 
                  onClick={() => { setActiveView('console'); setSolutionsOpen(false); }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A2540' }}>OpenCV Strip Scanner</div>
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
              fontWeight: 500,
              color: '#0B2545',
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
                width: '260px',
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
                <div onClick={onOpenTechModal} style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A2540' }}>IISc Coswara Dataset</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>Acoustic cough & dyspnea biomarkers</div>
                </div>
                <div onClick={onOpenTechModal} style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A2540' }}>ABDM FHIR R4 Schema</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>Official National Health Authority spec</div>
                </div>
                <div onClick={onOpenTechModal} style={{ padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                  <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A2540' }}>Gnani API Integration</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>Prisma STT & Timbre TTS pipeline</div>
                </div>
              </div>
            )}
          </div>

          {/* Direct Switch to Clinical Studio */}
          <button 
            onClick={() => setActiveView('console')}
            style={{
              background: activeView === 'console' ? 'rgba(0, 139, 139, 0.1)' : 'transparent',
              border: activeView === 'console' ? '1.5px solid #008B8B' : '1px solid transparent',
              borderRadius: '20px',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              color: '#008B8B',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              transition: 'all 160ms ease'
            }}
          >
            <span>Clinical Studio</span>
            <span style={{
              background: '#008B8B',
              color: '#ffffff',
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: 750
            }}>LIVE</span>
          </button>
        </nav>

        {/* Doctor Login / Profile & CTA Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {doctorProfile ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1.5px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '24px',
              fontSize: '12.5px',
              color: '#065F46',
              fontWeight: 700
            }}>
              <CheckCircle2 size={16} color="#10B981" />
              <span>{doctorProfile.doctorName}</span>
              <button 
                onClick={onLogoutDoctor}
                title="Logout Doctor Session"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', display: 'flex', alignItems: 'center', padding: '0 2px' }}
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button 
              onClick={onOpenAuthModal}
              className="btn-outline"
              style={{ fontSize: '13px', padding: '8px 18px', borderRadius: '24px' }}
            >
              <User size={15} />
              <span>Doctor Portal</span>
            </button>
          )}

          {activeView === 'landing' ? (
            <button 
              onClick={() => setActiveView('console')}
              className="btn-primary"
              style={{ fontSize: '13.5px', padding: '10px 22px' }}
            >
              <Sparkles size={16} />
              <span>Launch Studio</span>
            </button>
          ) : (
            <button 
              onClick={() => setActiveView('landing')}
              className="btn-outline"
              style={{ fontSize: '13px', padding: '10px 18px' }}
            >
              <span>← Back to Overview</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
