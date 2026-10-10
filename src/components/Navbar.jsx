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
  onSelectModule,
  onOpenTechModal, 
  onOpenDatasetModal,
  onOpenAcousticLab,
  onOpenBenchmarkSuite,
  onOpenSanjivaniModal,
  onOpenPrescriptionPdf,
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
            position: 'relative',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 168, 150, 0.4)',
            border: '2.5px solid #008B8B',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#061626',
            flexShrink: 0
          }}>
            <img 
              src="/assets/ayuswar_master_emblem.png" 
              alt="AyuSwar AI Master Clinical Emblem" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontWeight: 900,
                fontSize: '26px',
                color: '#0A2540',
                letterSpacing: '-0.5px'
              }}>
                Ayu<span style={{ color: '#008B8B' }}>Swar</span> <span style={{ color: '#D97706', fontSize: '21px' }}>AI</span>
              </span>
            </div>
            <div style={{
              fontSize: '9.5px',
              fontWeight: 800,
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              color: '#475569',
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
                    onSelectModule ? onSelectModule('opd_ambient_scribe') : setActiveView('landing');
                    setSolutionsOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(0, 139, 139, 0.05)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>OPD Ambient Scribe</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Real-time dual-speaker clinical dictation</div>
                </div>
                <div 
                  onClick={() => {
                    onSelectModule ? onSelectModule('vernacular_audio_rx') : setActiveView('landing');
                    setSolutionsOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>Vernacular Audio-Rx</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Timbre v2.5 spoken dosage instructions</div>
                </div>
                <div 
                  onClick={() => {
                    onSelectModule ? onSelectModule('opencv_strip_scanner') : setActiveView('landing');
                    setSolutionsOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>OpenCV Strip Scanner</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>Computer vision blister strip validation</div>
                </div>
                <div 
                  onClick={() => {
                    onSelectModule ? onSelectModule('sanjivani_108_sos') : onOpenSanjivaniModal();
                    setSolutionsOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#DC2626' }}>🚨 Sanjivani-108 SOS Dispatch</div>
                  <div style={{ fontSize: '11px', color: '#EF4444' }}>Acoustic distress triage & Evon parallel rescue</div>
                </div>
                <div 
                  onClick={() => {
                    onOpenPrescriptionPdf && onOpenPrescriptionPdf();
                    setSolutionsOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(2, 132, 199, 0.06)', border: '1px solid rgba(2, 132, 199, 0.25)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7' }}>📄 Official ABDM Prescription (PDF)</div>
                  <div style={{ fontSize: '11px', color: '#0369A1' }}>Bilingual Rx, QR Code & HPR Digital Stamp</div>
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={() => {
              onSelectModule ? onSelectModule('technology_hld') : onOpenTechModal();
            }}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'Outfit, sans-serif',
              fontSize: '14.5px',
              fontWeight: activeView === 'module_detail' ? 750 : 500,
              color: activeView === 'module_detail' ? '#008B8B' : '#0B2545',
              cursor: 'pointer',
              padding: '6px 4px'
            }}
          >
            Technology & HLD
          </button>

          <button 
            onClick={() => {
              onSelectModule ? onSelectModule('clinical_impact') : setActiveView('landing');
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
                    onSelectModule ? onSelectModule('kaggle_dataset_hub') : (onOpenDatasetModal && onOpenDatasetModal());
                    setResourcesOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(0, 139, 139, 0.06)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#008B8B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🔬</span> Kaggle Clinical Dataset Hub
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>54 ICD-10 diseases & IISc Coswara acoustic data</div>
                </div>

                <div 
                  onClick={() => {
                    onSelectModule ? onSelectModule('acoustic_biomarker_lab') : (onOpenAcousticLab && onOpenAcousticLab());
                    setResourcesOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(2, 132, 199, 0.08)', border: '1px solid rgba(2, 132, 199, 0.2)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0284C7', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🎙️</span> Acoustic AI & Vocal Biomarker Lab
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>IISc Coswara & Mayo Clinic voice disease detection</div>
                </div>

                <div 
                  onClick={() => {
                    onSelectModule ? onSelectModule('clinical_benchmark_suite') : (onOpenBenchmarkSuite && onOpenBenchmarkSuite());
                    setResourcesOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>⚡</span> 24-Point Clinical Test Suite & Benchmarks
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>Automated test runner & comparative radar matrix</div>
                </div>
                <div 
                  onClick={() => {
                    onSelectModule ? onSelectModule('indic_voice_benchmarks') : onOpenTechModal();
                    setResourcesOpen(false);
                  }}
                  style={{ padding: '10px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(0, 139, 139, 0.05)' }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>Indic Voice Benchmarks</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>50+ dialects WER & acoustic accuracy</div>
                </div>
                <div 
                  onClick={() => {
                    onSelectModule ? onSelectModule('abdm_fhir_whitepaper') : onOpenTechModal();
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
        </nav>

        {/* Portals Access & Login CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeView === 'landing' ? (
            // Clean, unauthenticated landing page header
            <>
              <button 
                onClick={onOpenSanjivaniModal}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  padding: '7px 14px',
                  borderRadius: '24px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                  color: '#FFFFFF',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 0 14px rgba(239, 68, 68, 0.45)',
                  letterSpacing: '0.2px'
                }}
                title="Sanjivani-108: Acoustic Distress Triage & Emergency Dispatch"
              >
                <span style={{ display: 'inline-block', width: '7px', height: '7px', borderRadius: '50%', background: '#FFFFFF' }} />
                <span>🚨 108 Sanjivani</span>
              </button>

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
