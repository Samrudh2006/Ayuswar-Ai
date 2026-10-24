import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import FloatingAssistant from './components/FloatingAssistant';
import DoctorAuthModal from './components/DoctorAuthModal';
import PatientAuthModal from './components/PatientAuthModal';
import WhatsAppAudioRxModal from './components/WhatsAppAudioRxModal';
import MobileInnovationHubModal from './components/MobileInnovationHubModal';
import TeleconsultModal from './components/TeleconsultModal';
import VitalsRppgModal from './components/VitalsRppgModal';
import PillVisionScannerModal from './components/PillVisionScannerModal';
import LiveScribeSessionModal from './components/LiveScribeSessionModal';
import SeoHead from './components/SeoHead';
import MobilePwaInstallBanner from './components/MobilePwaInstallBanner';
import DemoRecordingOverlay from './components/DemoRecordingOverlay';
import CookieConsentBanner from './components/CookieConsentBanner';

import MintIvoryWaveBackground from './components/MintIvoryWaveBackground';
import { initAllRoutesPreload } from './utils/routePreloader';

// Route-Level Code-Split Components (Lazy loaded on demand to minimize initial bundle size)
const DetailedModuleView = React.lazy(() => import('./components/DetailedModuleView'));
const DoctorPortal = React.lazy(() => import('./components/DoctorPortal'));
const ClinicalConsole = React.lazy(() => import('./components/ClinicalConsole'));
const PatientPortal = React.lazy(() => import('./components/PatientPortal'));
const SanjivaniEmergencyModal = React.lazy(() => import('./components/SanjivaniEmergencyModal'));
const ArchitectureView = React.lazy(() => import('./views/ArchitectureView'));
const PrescriptionScannerView = React.lazy(() => import('./views/PrescriptionScannerView'));
const AudioRxStudioView = React.lazy(() => import('./views/AudioRxStudioView'));
const AcousticBiomarkerLabView = React.lazy(() => import('./views/AcousticBiomarkerLabView'));
const ClinicalBenchmarkView = React.lazy(() => import('./views/ClinicalBenchmarkView'));
const IndicLanguageMatrixView = React.lazy(() => import('./views/IndicLanguageMatrixView'));
const DatasetExplorerView = React.lazy(() => import('./views/DatasetExplorerView'));
const EmergencyTriageView = React.lazy(() => import('./views/EmergencyTriageView'));
const EmergencyHandoverView = React.lazy(() => import('./views/EmergencyHandoverView'));
const PrescriptionPreviewView = React.lazy(() => import('./views/PrescriptionPreviewView'));
const PrivacyPolicyView = React.lazy(() => import('./views/PrivacyPolicyView'));
const TermsOfServiceView = React.lazy(() => import('./views/TermsOfServiceView'));
const NotFoundView = React.lazy(() => import('./views/NotFoundView'));
const UnifiedAuthView = React.lazy(() => import('./views/UnifiedAuthView'));

function RouteLoadingFallback() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '14px',
      background: '#FAF8F5',
      color: '#0F4C5C',
      fontFamily: 'Outfit, sans-serif'
    }}>
      <div style={{
        width: '38px',
        height: '38px',
        border: '3px solid rgba(15, 76, 92, 0.15)',
        borderTopColor: '#0F4C5C',
        borderRadius: '50%',
        animation: 'ayuswar-spin 0.75s linear infinite'
      }} />
      <span style={{ fontSize: '13px', fontWeight: 650, color: '#091E26', letterSpacing: '0.02em' }}>
        Loading clinical module...
      </span>
      <style>{`
        @keyframes ayuswar-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.body.style.overflow = '';
  }, [pathname]);

  return null;
}

import { useApp } from './context/AppContext';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    doctorProfile: currentDoctor, 
    setDoctorProfile: setCurrentDoctor, 
    patientProfile: currentPatient, 
    setPatientProfile: setCurrentPatient 
  } = useApp();
  const [isSanjivaniModalOpen, setIsSanjivaniModalOpen] = useState(false);
  const [isDoctorAuthModalOpen, setIsDoctorAuthModalOpen] = useState(false);
  const [isPatientAuthModalOpen, setIsPatientAuthModalOpen] = useState(false);
  const [isWhatsAppAudioRxModalOpen, setIsWhatsAppAudioRxModalOpen] = useState(false);

  // 14-Phase Mobile Innovation Suite Modals State
  const [isInnovationHubOpen, setIsInnovationHubOpen] = useState(false);
  const [isTeleconsultOpen, setIsTeleconsultOpen] = useState(false);
  const [isVitalsRppgOpen, setIsVitalsRppgOpen] = useState(false);
  const [isPillVisionOpen, setIsPillVisionOpen] = useState(false);
  const [isLiveScribeOpen, setIsLiveScribeOpen] = useState(false);

  // Mobile Web Audio Autoplay Unlock on First Touch/Click
  React.useEffect(() => {
    const unlockAudio = () => {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === 'suspended') {
            ctx.resume();
          }
        }
      } catch {}
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
    window.addEventListener('touchstart', unlockAudio, { passive: true, once: true });
    window.addEventListener('click', unlockAudio, { passive: true, once: true });
    return () => {
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  // Preload route chunks during idle time for instantaneous 0ms page navigation
  React.useEffect(() => {
    initAllRoutesPreload();
  }, []);

  // Mobile Hardware Back Button Handling for Active Full-Screen Modals
  const anyModalOpen = 
    isSanjivaniModalOpen || 
    isDoctorAuthModalOpen || 
    isPatientAuthModalOpen || 
    isWhatsAppAudioRxModalOpen || 
    isInnovationHubOpen || 
    isTeleconsultOpen || 
    isVitalsRppgOpen || 
    isPillVisionOpen || 
    isLiveScribeOpen;

  React.useEffect(() => {
    if (!anyModalOpen) return;

    window.history.pushState({ modalOpen: true }, '');

    const handlePopState = () => {
      setIsSanjivaniModalOpen(false);
      setIsDoctorAuthModalOpen(false);
      setIsPatientAuthModalOpen(false);
      setIsWhatsAppAudioRxModalOpen(false);
      setIsInnovationHubOpen(false);
      setIsTeleconsultOpen(false);
      setIsVitalsRppgOpen(false);
      setIsPillVisionOpen(false);
      setIsLiveScribeOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [anyModalOpen]);

  const handleDoctorLoginSuccess = (docProfile) => {
    setCurrentDoctor(docProfile);
    setIsDoctorAuthModalOpen(false);
    navigate('/doctor-portal');
  };

  const handlePatientLoginSuccess = (patientProfile) => {
    setCurrentPatient(patientProfile);
    setIsPatientAuthModalOpen(false);
    navigate('/patient-portal');
  };

  const handleLaunchInteractiveModal = (modalKey) => {
    if (modalKey === 'sanjivani') {
      setIsSanjivaniModalOpen(true);
    } else if (modalKey === 'scanner') {
      navigate('/scanner');
    } else if (modalKey === 'acoustic' || modalKey === 'acoustic_lab') {
      navigate('/acoustic-lab');
    } else if (modalKey === 'language_matrix') {
      navigate('/language-matrix');
    } else if (modalKey === 'audiorx') {
      navigate('/audio-rx');
    } else if (modalKey === 'tech' || modalKey === 'architecture') {
      navigate('/technology');
    } else if (modalKey === 'benchmark' || modalKey === 'benchmark_suite') {
      navigate('/benchmarks');
    } else if (modalKey === 'dataset' || modalKey === 'kaggle_hub') {
      navigate('/datasets');
    } else if (modalKey === 'scribe' || modalKey === 'console') {
      navigate('/clinical-console');
    }
  };

  const isDedicatedPortal = 
    location.pathname.startsWith('/doctor-portal') || 
    location.pathname.startsWith('/patient-portal') || 
    location.pathname.startsWith('/clinical-console') ||
    location.pathname.startsWith('/auth') ||
    location.pathname === '/login';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'transparent', position: 'relative' }}>
      {/* Route-Change Instant Scroll to Top and Body Overflow Reset */}
      <ScrollToTop />

      {/* Signature AyuSwar Mint-Ivory Vector Wave Canvas (Active on every screen) */}
      <MintIvoryWaveBackground />

      {/* Mobile PWA Add-To-Home-Screen Install Banner (Shown on public landing/website pages) */}
      {!isDedicatedPortal && <MobilePwaInstallBanner />}

      {/* Accessible Skip-To-Content for Screen Readers & Keyboard Navigation */}
      <a href="#main-content" className="skip-to-content-link">
        Skip to main content
      </a>

      {/* Dynamic SEO, AEO, and GEO Route Metadata Manager */}
      <SeoHead />

      {/* Accessible Enterprise Top Navbar (Only on public website routes) */}
      {!isDedicatedPortal && (
        <Navbar 
          onOpenSanjivani={() => setIsSanjivaniModalOpen(true)}
          onOpenDoctorAuth={() => navigate('/auth/doctor')}
          onOpenPatientAuth={() => navigate('/auth/patient')}
          onOpenInnovationHub={() => setIsInnovationHubOpen(true)}
        />
      )}

      {/* Main Routed Content Workspace */}
      <main 
        id="main-content"
        className={isDedicatedPortal ? 'portal-canvas-main' : 'app-public-main'}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', height: isDedicatedPortal ? '100vh' : 'auto', position: 'relative', zIndex: 1 }}
      >
        <React.Suspense fallback={<RouteLoadingFallback />}>
          <Routes>
            {/* Public Home & Marketing */}
            <Route 
            path="/" 
            element={
              <HeroLanding 
                onOpenSanjivaniModal={() => setIsSanjivaniModalOpen(true)}
                onOpenDoctorAuthModal={() => navigate('/auth/doctor')}
                onOpenPatientAuthModal={() => navigate('/auth/patient')}
                onLaunchStudio={() => navigate('/auth/doctor')}
                onOpenAcousticLab={() => navigate('/acoustic-lab')}
                onOpenTechModal={() => navigate('/technology')}
                onOpenDatasetModal={() => navigate('/datasets')}
                onOpenBenchmarkSuite={() => navigate('/benchmarks')}
              />
            } 
          />

          {/* Dedicated Solution & Resource Specifications */}
          <Route 
            path="/solutions" 
            element={
              <DetailedModuleView 
                moduleId="opd_ambient_scribe" 
                onLaunchInteractiveModal={handleLaunchInteractiveModal}
              />
            } 
          />
          <Route 
            path="/solutions/:moduleId" 
            element={
              <DetailedModuleView 
                onLaunchInteractiveModal={handleLaunchInteractiveModal}
              />
            } 
          />

          {/* Deep-Tech Architectural Blueprint */}
          <Route path="/technology" element={<ArchitectureView />} />

          {/* Interactive Medical Vision Scanner & Aliases */}
          <Route path="/scanner" element={<PrescriptionScannerView />} />
          <Route path="/scanrx" element={<Navigate to="/scanner" replace />} />
          <Route path="/scan-rx" element={<Navigate to="/scanner" replace />} />

          {/* Spoken Dosage & Karaoke Rx Studio */}
          <Route path="/audio-rx" element={<AudioRxStudioView />} />

          {/* Non-Diagnostic Acoustic Signal Processing Lab */}
          <Route path="/acoustic-lab" element={<AcousticBiomarkerLabView />} />

          {/* 24 Executed Unit & Contract Assertions */}
          <Route path="/benchmarks" element={<ClinicalBenchmarkView />} />

          {/* Indic Language Support & Dialect Matrix */}
          <Route path="/language-matrix" element={<IndicLanguageMatrixView />} />

          {/* Clinical Knowledge & Colloquial Lexicon Reference */}
          <Route path="/datasets" element={<DatasetExplorerView />} />

          {/* Simulated Emergency Distress Triage */}
          <Route 
            path="/emergency" 
            element={
              <EmergencyTriageView 
                onOpenFullConsole={() => setIsSanjivaniModalOpen(true)}
              />
            } 
          />
          <Route 
            path="/sanjivani" 
            element={
              <SanjivaniEmergencyModal 
                isOpen={true} 
                onClose={() => navigate('/')} 
              />
            } 
          />
          <Route path="/emergency/handover" element={<EmergencyHandoverView />} />

          {/* ABDM FHIR R4 Prescription Preview */}
          <Route path="/prescription/preview" element={<PrescriptionPreviewView />} />

          {/* Dedicated Unified Split-Screen Auth Routes (Matching Visual Mockup) */}
          <Route 
            path="/login" 
            element={
              currentDoctor ? (
                <Navigate to="/doctor-portal" replace />
              ) : currentPatient ? (
                <Navigate to="/patient-portal" replace />
              ) : (
                <UnifiedAuthView defaultUserType="doctor" />
              )
            } 
          />
          <Route 
            path="/auth" 
            element={
              currentDoctor ? (
                <Navigate to="/doctor-portal" replace />
              ) : currentPatient ? (
                <Navigate to="/patient-portal" replace />
              ) : (
                <UnifiedAuthView defaultUserType="doctor" />
              )
            } 
          />
          <Route 
            path="/auth/doctor" 
            element={
              currentDoctor ? (
                <Navigate to="/doctor-portal" replace />
              ) : (
                <UnifiedAuthView defaultUserType="doctor" />
              )
            } 
          />
          <Route 
            path="/auth/patient" 
            element={
              currentPatient ? (
                <Navigate to="/patient-portal" replace />
              ) : (
                <UnifiedAuthView defaultUserType="patient" />
              )
            } 
          />

          {/* Doctor & Patient Portals (Strict Authentication Required - Redirect to auth) */}
          <Route 
            path="/doctor-portal" 
            element={
              currentDoctor ? (
                <DoctorPortal 
                  doctorProfile={currentDoctor} 
                  onSelectEncounterAndLaunch={() => navigate('/clinical-console')}
                  onOpenTechModal={() => navigate('/technology')}
                  onOpenDatasetModal={() => navigate('/datasets')}
                  onLogoutDoctor={() => {
                    setCurrentDoctor(null);
                    navigate('/');
                  }}
                />
              ) : (
                <Navigate to="/auth/doctor" replace />
              )
            } 
          />
          <Route 
            path="/patient-portal" 
            element={
              currentPatient ? (
                <PatientPortal 
                  patientProfile={currentPatient} 
                  onOpenDoctorAuthModal={() => {
                    if (currentDoctor) {
                      navigate('/doctor-portal');
                    } else {
                      setIsDoctorAuthModalOpen(true);
                    }
                  }}
                  onLogoutPatient={() => {
                    setCurrentPatient(null);
                    navigate('/');
                  }}
                  onSwitchPatient={(newProfile) => setCurrentPatient(newProfile)}
                />
              ) : (
                <Navigate to="/auth/patient" replace />
              )
            } 
          />
          <Route 
            path="/clinical-console" 
            element={
              <ClinicalConsole 
                doctorProfile={currentDoctor || { doctorName: 'Dr. Priya Sharma, MD', registrationNumber: 'MCI-98421-AP', specialty: 'General & Preventive Medicine' }} 
              />
            } 
          />

          {/* Legal & Compliance Routes */}
          <Route path="/privacy" element={<PrivacyPolicyView />} />
          <Route path="/terms" element={<TermsOfServiceView />} />

          {/* Custom 404 Route */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
        </React.Suspense>
      </main>

      {/* DPDP Act 2023 & Ephemeral Consent Banner */}
      <CookieConsentBanner />

      {/* Global Prototype Disclaimer Footer Banner (Only on public showcase routes) */}
      {!isDedicatedPortal && (
        <footer 
          className="site-footer"
          style={{
          background: '#0F172A',
          color: '#E2E8F0',
          borderTop: '1px solid #334155',
          padding: '12px 20px',
          textAlign: 'center',
          fontSize: '12.5px',
          fontWeight: 650,
          zIndex: 30,
          position: 'relative'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#F59E0B' }}></span>
            <span>AyuSwar AI is a prototype demo on synthetic data. Not a medical device. Not for diagnosis.</span>
          </div>
        </footer>
      )}

      {/* Sanjivani-108 Masterclass Operational GIS Console Modal */}
      {isSanjivaniModalOpen && (
        <React.Suspense fallback={null}>
          <SanjivaniEmergencyModal 
            isOpen={isSanjivaniModalOpen}
            onClose={() => setIsSanjivaniModalOpen(false)}
          />
        </React.Suspense>
      )}

      {/* Clinician Authentication & OPD Login Modal */}
      {isDoctorAuthModalOpen && (
        <DoctorAuthModal
          isOpen={isDoctorAuthModalOpen}
          onClose={() => setIsDoctorAuthModalOpen(false)}
          onLoginSuccess={handleDoctorLoginSuccess}
        />
      )}

      {/* Patient ABHA Citizen Login Modal */}
      {isPatientAuthModalOpen && (
        <PatientAuthModal
          isOpen={isPatientAuthModalOpen}
          onClose={() => setIsPatientAuthModalOpen(false)}
          onLoginSuccess={handlePatientLoginSuccess}
        />
      )}

      {/* Floating Ambient Voice Assistant (Role-aware across landing, doctor, and patient portals) */}
      {!isSanjivaniModalOpen && location.pathname !== '/sanjivani' && !location.pathname.startsWith('/emergency') && !location.pathname.startsWith('/auth') && (
        <FloatingAssistant 
          activeView={
            location.pathname.startsWith('/doctor-portal') 
              ? 'doctor_portal' 
              : (location.pathname.startsWith('/patient-portal') 
                ? 'patient_portal' 
                : (location.pathname.startsWith('/clinical-console') ? 'console' : 'landing'))
          }
          doctorProfile={currentDoctor}
          onOpenSanjivani={() => setIsSanjivaniModalOpen(true)}
          onOpenClinicalConsole={() => {
            if (currentDoctor) {
              navigate('/clinical-console');
            } else {
              setIsDoctorAuthModalOpen(true);
            }
          }}
          onOpenWhatsAppRx={() => setIsWhatsAppAudioRxModalOpen(true)}
        />
      )}

      {/* Universal WhatsApp Vernacular Spoken Audio-Rx Modal */}
      {isWhatsAppAudioRxModalOpen && (
        <WhatsAppAudioRxModal 
          isOpen={isWhatsAppAudioRxModalOpen}
          onClose={() => setIsWhatsAppAudioRxModalOpen(false)}
          patientData={{
            name: currentPatient?.patientName || 'Narayana Rao',
            vernacularName: 'నారాయణ రావు',
            phone: '+91 98490 12345',
            cleanPhone: '919849012345',
            age: currentPatient?.age || 58,
            gender: currentPatient?.gender || 'Male',
            abhaId: currentPatient?.abhaId || '91-4521-8932-1049',
            language: currentPatient?.language || 'Telugu',
            langCode: 'te-IN'
          }}
          doctorName={currentDoctor?.doctorName || 'Dr. Priya Sharma, MD'}
          initialLanguage="te"
        />
      )}

      {/* 14-Phase Mobile Clinical Innovation Hub Modal */}
      {isInnovationHubOpen && (
        <MobileInnovationHubModal 
          isOpen={isInnovationHubOpen}
          onClose={() => setIsInnovationHubOpen(false)}
          onOpenTeleconsult={() => setIsTeleconsultOpen(true)}
          onOpenScribe={() => setIsLiveScribeOpen(true)}
          onOpenAbha={() => {
            if (currentPatient) navigate('/patient-portal');
            else setIsPatientAuthModalOpen(true);
          }}
          onOpenScanner={() => navigate('/scanner')}
          onOpenPillVision={() => setIsPillVisionOpen(true)}
          onOpenGeoBeacon={() => setIsSanjivaniModalOpen(true)}
          onOpenAudioRx={() => setIsWhatsAppAudioRxModalOpen(true)}
          onOpenVitalsRppg={() => setIsVitalsRppgOpen(true)}
        />
      )}

      {/* Phase 1: WebRTC Telemedicine Video Call Modal */}
      {isTeleconsultOpen && (
        <TeleconsultModal 
          isOpen={isTeleconsultOpen}
          onClose={() => setIsTeleconsultOpen(false)}
          patientName={currentPatient?.patientName || 'Narayana Rao'}
          doctorName={currentDoctor?.doctorName || 'Dr. Priya Sharma, MD'}
        />
      )}

      {/* Phase 10: Vitals-rPPG Contactless Camera Scanner Modal */}
      {isVitalsRppgOpen && (
        <VitalsRppgModal 
          isOpen={isVitalsRppgOpen}
          onClose={() => setIsVitalsRppgOpen(false)}
          onSaveVitals={(vitals) => {
            if (currentPatient) {
              setCurrentPatient(prev => ({
                ...prev,
                vitals: { ...prev.vitals, hr: vitals.heartRate, spo2: vitals.spo2 }
              }));
            }
          }}
        />
      )}

      {/* Phase 7: Pill-Vision Computer Vision Scanner Modal */}
      {isPillVisionOpen && (
        <PillVisionScannerModal 
          isOpen={isPillVisionOpen}
          onClose={() => setIsPillVisionOpen(false)}
        />
      )}

      {/* Phase 2: Live Ambient Voice Scribe Session Modal */}
      {isLiveScribeOpen && currentPatient && (
        <LiveScribeSessionModal 
          isOpen={isLiveScribeOpen}
          onClose={() => setIsLiveScribeOpen(false)}
          patientData={currentPatient}
          doctorName={currentDoctor?.doctorName || 'Dr. Priya Sharma, MD'}
        />
      )}


      {/* Demo Recording Mode Overlay (Active only with ?demo-record=1) */}
      <DemoRecordingOverlay />
    </div>
  );
}
