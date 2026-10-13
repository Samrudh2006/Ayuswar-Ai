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
import AssistantWorkspaceView from './views/AssistantWorkspaceView';
import DoctorProfileSelectView from './views/DoctorProfileSelectView';
import PatientProfileSelectView from './views/PatientProfileSelectView';

import { useApp } from './context/AppContext';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentDoctor, setCurrentDoctor, currentPatient, setCurrentPatient } = useApp();
  const [isSanjivaniModalOpen, setIsSanjivaniModalOpen] = useState(false);
  const [isDoctorAuthModalOpen, setIsDoctorAuthModalOpen] = useState(false);
  const [isPatientAuthModalOpen, setIsPatientAuthModalOpen] = useState(false);

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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F8FAFC', position: 'relative' }}>
      {/* Accessible Enterprise Top Navbar */}
      <Navbar 
        onOpenSanjivani={() => setIsSanjivaniModalOpen(true)}
        onOpenDoctorAuth={() => setIsDoctorAuthModalOpen(true)}
        onOpenPatientAuth={() => setIsPatientAuthModalOpen(true)}
      />

      {/* Main Routed Content Workspace */}
      <main style={{ flex: 1 }}>
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

          {/* Dedicated Voice Assistant Workspace */}
          <Route path="/assistant" element={<AssistantWorkspaceView />} />

          {/* Demo Profile Selection */}
          <Route path="/auth/doctor" element={<DoctorProfileSelectView />} />
          <Route path="/auth/patient" element={<PatientProfileSelectView />} />

          {/* Doctor & Patient Portals */}
          <Route 
            path="/doctor-portal" 
            element={
              <DoctorPortal 
                doctorProfile={currentDoctor} 
                onOpenConsultationSession={() => {}} 
              />
            } 
          />
          <Route 
            path="/patient-portal" 
            element={
              <PatientPortal 
                patientProfile={currentPatient} 
              />
            } 
          />
          <Route 
            path="/clinical-console" 
            element={
              <ClinicalConsole 
                doctorProfile={currentDoctor} 
              />
            } 
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

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

      {/* Floating Ambient Voice Assistant (Hidden during Sanjivani console to prevent duplicate assistant overlap) */}
      {!isSanjivaniModalOpen && location.pathname !== '/sanjivani' && !location.pathname.startsWith('/emergency') && (
        <FloatingAssistant 
          activeView="landing"
          doctorProfile={currentDoctor}
          patientProfile={currentPatient}
          onOpenDoctorPortal={() => setIsDoctorAuthModalOpen(true)}
          onOpenPatientPortal={() => setIsPatientAuthModalOpen(true)}
          onOpenSanjivani={() => setIsSanjivaniModalOpen(true)}
        />
      )}
    </div>
  );
}
