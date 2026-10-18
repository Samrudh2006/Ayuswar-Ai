import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import HeroLanding from './components/HeroLanding';
import DetailedModuleView from './components/DetailedModuleView';
import DoctorPortal from './components/DoctorPortal';
import ClinicalConsole from './components/ClinicalConsole';
import PatientPortal from './components/PatientPortal';
import FloatingAssistant from './components/FloatingAssistant';
import SanjivaniEmergencyModal from './components/SanjivaniEmergencyModal';
import DoctorAuthModal from './components/DoctorAuthModal';
import PatientAuthModal from './components/PatientAuthModal';
import WhatsAppAudioRxModal from './components/WhatsAppAudioRxModal';
import MobileInnovationHubModal from './components/MobileInnovationHubModal';
import TeleconsultModal from './components/TeleconsultModal';
import VitalsRppgModal from './components/VitalsRppgModal';
import PillVisionScannerModal from './components/PillVisionScannerModal';
import LiveScribeSessionModal from './components/LiveScribeSessionModal';
import SeoHead from './components/SeoHead';
import MobileAppBottomNav from './components/MobileAppBottomNav';
import DemoRecordingOverlay from './components/DemoRecordingOverlay';

// Dedicated Full-Page Routed Views
import ArchitectureView from './views/ArchitectureView';
import PrescriptionScannerView from './views/PrescriptionScannerView';
import AudioRxStudioView from './views/AudioRxStudioView';
import AcousticBiomarkerLabView from './views/AcousticBiomarkerLabView';
import ClinicalBenchmarkView from './views/ClinicalBenchmarkView';
import IndicLanguageMatrixView from './views/IndicLanguageMatrixView';
import DatasetExplorerView from './views/DatasetExplorerView';
import EmergencyTriageView from './views/EmergencyTriageView';
import EmergencyHandoverView from './views/EmergencyHandoverView';
import PrescriptionPreviewView from './views/PrescriptionPreviewView';


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
      setIsDoctorAuthModalOpen(true);
    }
  };

  const isDedicatedPortal = 
    location.pathname.startsWith('/doctor-portal') || 
    location.pathname.startsWith('/patient-portal') || 
    location.pathname.startsWith('/clinical-console');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', position: 'relative' }}>
      {/* Dynamic SEO, AEO, and GEO Route Metadata Manager */}
      <SeoHead />

      {/* Accessible Enterprise Top Navbar (Only on public website routes) */}
      {!isDedicatedPortal && (
        <Navbar 
          onOpenSanjivani={() => setIsSanjivaniModalOpen(true)}
          onOpenDoctorAuth={() => setIsDoctorAuthModalOpen(true)}
          onOpenPatientAuth={() => setIsPatientAuthModalOpen(true)}
          onOpenInnovationHub={() => setIsInnovationHubOpen(true)}
        />
      )}

      {/* Main Routed Content Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', height: isDedicatedPortal ? '100vh' : 'auto' }}>
        <Routes>
          {/* Public Home & Marketing */}
          <Route 
            path="/" 
            element={
              <HeroLanding 
                onOpenSanjivaniModal={() => setIsSanjivaniModalOpen(true)}
                onOpenDoctorAuthModal={() => setIsDoctorAuthModalOpen(true)}
                onOpenPatientAuthModal={() => setIsPatientAuthModalOpen(true)}
                onLaunchStudio={() => setIsDoctorAuthModalOpen(true)}
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

          {/* Interactive Medical Vision Scanner */}
          <Route path="/scanner" element={<PrescriptionScannerView />} />

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

          {/* Dedicated Auth Routes */}
          <Route 
            path="/auth/doctor" 
            element={
              currentDoctor ? (
                <Navigate to="/doctor-portal" replace />
              ) : (
                <DoctorAuthModal 
                  isOpen={true} 
                  onClose={() => navigate('/')} 
                  onLoginSuccess={(doc) => {
                    handleDoctorLoginSuccess(doc);
                    navigate('/doctor-portal');
                  }} 
                />
              )
            } 
          />
          <Route 
            path="/auth/patient" 
            element={
              currentPatient ? (
                <Navigate to="/patient-portal" replace />
              ) : (
                <PatientAuthModal 
                  isOpen={true} 
                  onClose={() => navigate('/')} 
                  onLoginSuccess={(pat) => {
                    handlePatientLoginSuccess(pat);
                    navigate('/patient-portal');
                  }} 
                />
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
              currentDoctor ? (
                <ClinicalConsole 
                  doctorProfile={currentDoctor} 
                />
              ) : (
                <Navigate to="/auth/doctor" replace />
              )
            } 
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Global Prototype Disclaimer Footer Banner (Only on public showcase routes) */}
      {!isDedicatedPortal && (
        <footer style={{
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
      <SanjivaniEmergencyModal 
        isOpen={isSanjivaniModalOpen}
        onClose={() => setIsSanjivaniModalOpen(false)}
      />

      {/* Clinician Authentication & OPD Login Modal */}
      <DoctorAuthModal
        isOpen={isDoctorAuthModalOpen}
        onClose={() => setIsDoctorAuthModalOpen(false)}
        onLoginSuccess={handleDoctorLoginSuccess}
      />

      {/* Patient ABHA Citizen Login Modal */}
      <PatientAuthModal
        isOpen={isPatientAuthModalOpen}
        onClose={() => setIsPatientAuthModalOpen(false)}
        onLoginSuccess={handlePatientLoginSuccess}
      />

      {/* Floating Ambient Voice Assistant (Role-aware across landing, doctor, and patient portals) */}
      {!isSanjivaniModalOpen && location.pathname !== '/sanjivani' && !location.pathname.startsWith('/emergency') && (
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

      {/* 14-Phase Mobile Clinical Innovation Hub Modal */}
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

      {/* Phase 1: WebRTC Telemedicine Video Call Modal */}
      <TeleconsultModal 
        isOpen={isTeleconsultOpen}
        onClose={() => setIsTeleconsultOpen(false)}
        patientName={currentPatient?.patientName || 'Narayana Rao'}
        doctorName={currentDoctor?.doctorName || 'Dr. Priya Sharma, MD'}
      />

      {/* Phase 10: Vitals-rPPG Contactless Camera Scanner Modal */}
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

      {/* Phase 7: Pill-Vision Computer Vision Scanner Modal */}
      <PillVisionScannerModal 
        isOpen={isPillVisionOpen}
        onClose={() => setIsPillVisionOpen(false)}
      />

      {/* Phase 2: Live Ambient Voice Scribe Session Modal */}
      {currentPatient && (
        <LiveScribeSessionModal 
          isOpen={isLiveScribeOpen}
          onClose={() => setIsLiveScribeOpen(false)}
          patientData={currentPatient}
          doctorName={currentDoctor?.doctorName || 'Dr. Priya Sharma, MD'}
        />
      )}

      {/* Global Fixed Mobile Bottom Navigation Bar (Active on Mobile Screens) */}
      <MobileAppBottomNav 
        onOpenSanjivani={() => setIsSanjivaniModalOpen(true)}
        onOpenDoctorAuth={() => setIsDoctorAuthModalOpen(true)}
        onOpenPatientAuth={() => setIsPatientAuthModalOpen(true)}
      />

      {/* Demo Recording Mode Overlay (Active only with ?demo-record=1) */}
      <DemoRecordingOverlay />
    </div>
  );
}
