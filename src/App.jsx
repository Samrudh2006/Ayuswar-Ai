import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HeroLanding from './components/HeroLanding';
import DoctorPortal from './components/DoctorPortal';
import ClinicalConsole from './components/ClinicalConsole';
import PatientPortal from './components/PatientPortal';
import TechSpecsView from './components/TechSpecsView';
import ArchitectureModal from './components/ArchitectureModal';
import DoctorAuthModal from './components/DoctorAuthModal';
import PatientAuthModal from './components/PatientAuthModal';
import NotificationDrawer from './components/NotificationDrawer';
import FloatingAssistant from './components/FloatingAssistant';
import DatasetExplorerModal from './components/DatasetExplorerModal';
import AcousticBiomarkerLabModal from './components/AcousticBiomarkerLabModal';
import ClinicalBenchmarkTestSuiteModal from './components/ClinicalBenchmarkTestSuiteModal';
import SanjivaniEmergencyModal from './components/SanjivaniEmergencyModal';
import DetailedModuleView from './components/DetailedModuleView';
import AbdmPrescriptionPdfModal from './components/AbdmPrescriptionPdfModal';

/**
 * AyuSwar AI — Root Application Orchestrator
 * Architecture Decision:
 * - Public Landing Page is a stunning full-width, edge-to-edge marketing showcase (no sidebar crowding!).
 * - Interactive elements on the landing page explain features with deep dedicated matter (no premature redirects).
 * - Workspaces require role-based authentication:
 *   • Doctor Portal: Verified ABDM Healthcare Professional Registry (HPR).
 *   • Patient Portal: Verified ABHA Citizen Health Account.
 *   • Acoustic AI Biomarker Lab: Live vocal disease diagnostic laboratory.
 *   • 24-Point Clinical Test Suite: Automated clinical assertion and benchmark verification harness.
 *   • Sanjivani-108: Autonomous Acoustic Distress Triage & Emergency Dispatch Agent.
 * - Multi-Doctor & Multi-Patient account switching supported with session state persistence.
 * - Floating Voice Assistant (5-state ambient AI assistant) mounted with real-time Indic voice capabilities.
 */
export default function App() {
  const [activeView, setActiveView] = useState('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isDoctorAuthModalOpen, setIsDoctorAuthModalOpen] = useState(false);
  const [isPatientAuthModalOpen, setIsPatientAuthModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isDatasetModalOpen, setIsDatasetModalOpen] = useState(false);
  const [isAcousticLabOpen, setIsAcousticLabOpen] = useState(false);
  const [isBenchmarkSuiteOpen, setIsBenchmarkSuiteOpen] = useState(false);
  const [isSanjivaniModalOpen, setIsSanjivaniModalOpen] = useState(false);
  const [isPrescriptionPdfOpen, setIsPrescriptionPdfOpen] = useState(false);
  const [selectedEncounterIndex, setSelectedEncounterIndex] = useState(0);
  const [selectedModuleId, setSelectedModuleId] = useState('opd_ambient_scribe');

  const handleSelectModule = (modId) => {
    setSelectedModuleId(modId);
    setActiveView('module_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchInteractiveModal = (modalKey) => {
    if (modalKey === 'scribe' || modalKey === 'console') {
      if (doctorProfile) {
        setActiveView('console');
      } else {
        setIsDoctorAuthModalOpen(true);
      }
    } else if (modalKey === 'sanjivani') {
      setIsSanjivaniModalOpen(true);
    } else if (modalKey === 'acoustic_lab') {
      setIsAcousticLabOpen(true);
    } else if (modalKey === 'kaggle_hub' || modalKey === 'dataset') {
      setIsDatasetModalOpen(true);
    } else if (modalKey === 'benchmark_suite') {
      setIsBenchmarkSuiteOpen(true);
    } else if (modalKey === 'prescription_pdf' || modalKey === 'pdf_rx') {
      setIsPrescriptionPdfOpen(true);
    } else if (modalKey === 'patient_portal') {
      if (patientProfile) {
        setActiveView('patient_portal');
      } else {
        setIsPatientAuthModalOpen(true);
      }
    }
  };

  // Authenticated profiles (null by default until verified login)
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);

  // Shared Real-Time Appointments & OPD Queue (Syncs Patient Portal bookings to Doctor Portal queue)
  const [appointmentsQueue, setAppointmentsQueue] = useState([
    {
      id: 'appt_101',
      token: 'OPD-101',
      patientName: 'Narayana Rao',
      vernacular: 'నారాయణ రావు',
      phone: '+91 98490 12345',
      age: 58,
      gender: 'Male',
      language: 'Telugu (Rayalaseema)',
      abhaId: '91-4521-8932-1049',
      doctorName: 'Dr. Priya Sharma, MD',
      specialty: 'Pulmonology & Critical Care',
      date: 'Today',
      time: '09:30 AM',
      mode: 'In-Person OPD',
      reason: 'Chest heaviness & Palpitations (గుండెల్లో దడ)',
      triage: 'Urgent',
      triageColor: '#D97706',
      status: 'confirmed', // 'pending' | 'confirmed' | 'in_progress' | 'completed'
      room: 'OPD Room 1',
      domain: 'cardiometabolic'
    },
    {
      id: 'appt_102',
      token: 'OPD-102',
      patientName: 'Aarav Kumar',
      vernacular: 'आरव कुमार',
      phone: '+91 99887 65432',
      age: 4,
      gender: 'Male',
      language: 'Hindi (Awadhi)',
      abhaId: '91-8821-4432-9012',
      doctorName: 'Dr. Priya Sharma, MD',
      specialty: 'Pulmonology & Critical Care',
      date: 'Today',
      time: '10:00 AM',
      mode: 'In-Person OPD',
      reason: 'Pediatric Subcostal Retraction & Nocturnal Cough (पसली चलना)',
      triage: 'Critical',
      triageColor: '#EF4444',
      status: 'confirmed',
      room: 'OPD Room 1',
      domain: 'respiratory'
    },
    {
      id: 'appt_103',
      token: 'OPD-103',
      patientName: 'Ananya Rao',
      vernacular: 'అనన్య రావు',
      phone: '+91 98480 22334',
      age: 28,
      gender: 'Female',
      language: 'Telugu / English',
      abhaId: '91-4521-8932-1049',
      doctorName: 'Dr. Priya Sharma, MD',
      specialty: 'Pulmonology & Critical Care',
      date: 'Tue, May 13',
      time: '10:15 AM',
      mode: 'Video Call',
      reason: 'Acute High-Grade Pyrexia & Dry Airway Wheeze',
      triage: 'Moderate',
      triageColor: '#3B82F6',
      status: 'confirmed',
      room: 'Tele-Room A',
      domain: 'respiratory'
    }
  ]);

  const handleBookAppointment = (newAppt) => {
    const formattedAppt = {
      id: `appt_${Date.now()}`,
      token: `OPD-${100 + appointmentsQueue.length + 1}`,
      patientName: newAppt.patientName || (patientProfile?.patientName || 'Ananya Rao'),
      vernacular: newAppt.vernacular || (patientProfile?.vernacular || 'అనన్య రావు'),
      phone: newAppt.phone || '+91 98480 22334',
      age: newAppt.age || (patientProfile?.age || 28),
      gender: newAppt.gender || (patientProfile?.gender || 'Female'),
      language: newAppt.language || (patientProfile?.language || 'Telugu'),
      abhaId: newAppt.abhaId || (patientProfile?.abhaId || '91-4521-8932-1049'),
      doctorName: newAppt.doctorName || 'Dr. Priya Sharma, MD',
      specialty: newAppt.specialty || 'Pulmonologist & Critical Care',
      date: newAppt.date || 'Tomorrow',
      time: newAppt.time || '10:00 AM',
      mode: newAppt.mode || 'In-Person OPD',
      reason: newAppt.reason || 'General Consultation & Health Assessment',
      triage: newAppt.triage || 'Moderate',
      triageColor: '#3B82F6',
      status: 'pending', // Pending doctor acceptance
      room: 'Queue Room 1',
      domain: 'respiratory'
    };
    setAppointmentsQueue(prev => [formattedAppt, ...prev]);
  };

  const handleAcceptAppointment = (apptId) => {
    setAppointmentsQueue(prev => prev.map(a => {
      if (a.id === apptId) {
        return {
          ...a,
          status: 'confirmed',
          room: 'OPD Consultation Room 1'
        };
      }
      return a;
    }));
  };

  const handleDoctorLoginSuccess = (profile) => {
    setDoctorProfile(profile);
    setIsDoctorAuthModalOpen(false);
    setActiveView('doctor_portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePatientLoginSuccess = (profile) => {
    setPatientProfile(profile);
    setIsPatientAuthModalOpen(false);
    setActiveView('patient_portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutDoctor = () => {
    setDoctorProfile(null);
    setActiveView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutPatient = () => {
    setPatientProfile(null);
    setActiveView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchEncounterFromDoctorQueue = (index) => {
    setSelectedEncounterIndex(index);
    setActiveView('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Top Navigation Bar */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onSelectModule={handleSelectModule}
        onOpenTechModal={() => setIsTechModalOpen(true)}
        onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
        onOpenAcousticLab={() => setIsAcousticLabOpen(true)}
        onOpenBenchmarkSuite={() => setIsBenchmarkSuiteOpen(true)}
        onOpenSanjivaniModal={() => setIsSanjivaniModalOpen(true)}
        onOpenPrescriptionPdf={() => setIsPrescriptionPdfOpen(true)}
        onOpenDoctorAuthModal={() => setIsDoctorAuthModalOpen(true)}
        onOpenPatientAuthModal={() => setIsPatientAuthModalOpen(true)}
        doctorProfile={doctorProfile}
        patientProfile={patientProfile}
        onLogoutDoctor={handleLogoutDoctor}
        onLogoutPatient={handleLogoutPatient}
      />

      {/* Main View Container */}
      {activeView === 'landing' && (
        <main style={{ flex: 1 }}>
          <HeroLanding 
            onLaunchStudio={() => setIsDoctorAuthModalOpen(true)} 
            onOpenTechModal={() => setIsTechModalOpen(true)}
            onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
            onOpenAcousticLab={() => setIsAcousticLabOpen(true)}
            onOpenBenchmarkSuite={() => setIsBenchmarkSuiteOpen(true)}
            onOpenSanjivaniModal={() => setIsSanjivaniModalOpen(true)}
            onOpenDoctorAuthModal={() => setIsDoctorAuthModalOpen(true)}
            onOpenPatientAuthModal={() => setIsPatientAuthModalOpen(true)}
            onSelectModule={handleSelectModule}
          />
        </main>
      )}

      {activeView === 'module_detail' && (
        <main style={{ flex: 1, minHeight: 'calc(100vh - 68px)', background: '#F8FAFC' }}>
          <DetailedModuleView
            moduleId={selectedModuleId}
            onBackToHome={() => {
              setActiveView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateModule={handleSelectModule}
            onLaunchInteractiveModal={handleLaunchInteractiveModal}
          />
        </main>
      )}

      {activeView === 'doctor_portal' && (
        <main style={{ flex: 1 }}>
          <DoctorPortal 
            doctorProfile={doctorProfile || {
              doctorName: 'Dr. Priya Sharma, MD',
              specialty: 'Pulmonologist & Critical Care',
              hprId: 'ABHA-HPR-8921-9942',
              facility: 'Kurnool District Hospital (ABDM PHC #1402)'
            }}
            onSelectEncounterAndLaunch={handleLaunchEncounterFromDoctorQueue}
            onOpenTechModal={() => setIsTechModalOpen(true)}
            onOpenDatasetModal={() => setIsDatasetModalOpen(true)}
            onLogoutDoctor={handleLogoutDoctor}
            registeredPatients={patientProfile?.familyMembers || []}
            appointmentsQueue={appointmentsQueue}
            onAcceptAppointment={handleAcceptAppointment}
          />
        </main>
      )}

      {activeView === 'patient_portal' && (
        <main style={{ flex: 1 }}>
          <PatientPortal 
            patientProfile={patientProfile || {
              patientName: 'Ananya Rao',
              age: 28,
              gender: 'Female',
              language: 'Telugu',
              abhaId: '91-4521-8932-1049'
            }}
            onOpenDoctorAuthModal={() => setIsDoctorAuthModalOpen(true)}
            onLogoutPatient={handleLogoutPatient}
            onSwitchPatient={(newPat) => setPatientProfile(newPat)}
            appointmentsQueue={appointmentsQueue}
            onBookAppointment={handleBookAppointment}
          />
        </main>
      )}

      {(activeView === 'console' || activeView === 'tech_specs') && (
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 68px)' }}>
          <Sidebar 
            activeView={activeView} 
            setActiveView={setActiveView} 
            onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
            unreadNotificationsCount={2}
            doctorProfile={doctorProfile}
            isCollapsed={isSidebarCollapsed}
            setIsCollapsed={setIsSidebarCollapsed}
          />

          <main style={{ flex: 1, overflowY: 'auto', background: '#F8FAFC' }}>
            {activeView === 'console' && (
              <ClinicalConsole 
                doctorProfile={doctorProfile}
                initialEncounterIndex={selectedEncounterIndex}
              />
            )}

            {activeView === 'tech_specs' && (
              <TechSpecsView 
                onLaunchConsole={() => {
                  if (doctorProfile) {
                    setActiveView('console');
                  } else {
                    setIsDoctorAuthModalOpen(true);
                  }
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </main>
        </div>
      )}

      {/* Ambient Floating AI Voice Assistant Widget (Hidden during full-screen emergency / lab modals to avoid occlusion) */}
      {!isSanjivaniModalOpen && !isBenchmarkSuiteOpen && !isAcousticLabOpen && (
        <FloatingAssistant 
          activeView={activeView}
          doctorProfile={doctorProfile}
          patientProfile={patientProfile}
          onOpenDoctorPortal={() => {
            if (!doctorProfile) {
              setIsDoctorAuthModalOpen(true);
            } else {
              setActiveView('doctor_portal');
            }
          }}
          onOpenPatientPortal={() => {
            if (!patientProfile) {
              setIsPatientAuthModalOpen(true);
            } else {
              setActiveView('patient_portal');
            }
          }}
        />
      )}

      {/* Real-Time Clinical Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />

      {/* Doctor Authentication Modal */}
      <DoctorAuthModal 
        isOpen={isDoctorAuthModalOpen}
        onClose={() => setIsDoctorAuthModalOpen(false)}
        onLoginSuccess={handleDoctorLoginSuccess}
      />

      {/* Patient Authentication Modal */}
      <PatientAuthModal 
        isOpen={isPatientAuthModalOpen}
        onClose={() => setIsPatientAuthModalOpen(false)}
        onLoginSuccess={handlePatientLoginSuccess}
      />

      {/* Architecture Telemetry Modal Fallback */}
      <ArchitectureModal 
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
      />

      {/* Kaggle & IISc Coswara Multi-Modal Clinical Dataset Hub */}
      <DatasetExplorerModal 
        isOpen={isDatasetModalOpen}
        onClose={() => setIsDatasetModalOpen(false)}
      />

      {/* Acoustic AI & Vocal Biomarker Diagnostic Laboratory Modal */}
      <AcousticBiomarkerLabModal
        isOpen={isAcousticLabOpen}
        onClose={() => setIsAcousticLabOpen(false)}
      />

      {/* 24-Point Automated Clinical Test Suite & Benchmark Matrix Modal */}
      <ClinicalBenchmarkTestSuiteModal
        isOpen={isBenchmarkSuiteOpen}
        onClose={() => setIsBenchmarkSuiteOpen(false)}
      />

      {/* Sanjivani-108 Autonomous Acoustic Distress Triage & Emergency Dispatch Agent Modal */}
      <SanjivaniEmergencyModal
        isOpen={isSanjivaniModalOpen}
        onClose={() => setIsSanjivaniModalOpen(false)}
      />

      {/* Official ABDM FHIR Clinical PDF Prescription Export & Print Modal */}
      <AbdmPrescriptionPdfModal
        isOpen={isPrescriptionPdfOpen}
        onClose={() => setIsPrescriptionPdfOpen(false)}
      />
    </div>
  );
}
