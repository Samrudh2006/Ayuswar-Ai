import React, { useState, useEffect } from 'react';
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
import DynamicIsland from './components/DynamicIsland';
import SpotlightCommand from './components/SpotlightCommand';
import MacDock from './components/MacDock';

/**
 * AyuSwar AI — Root Application Orchestrator (macOS / Apple Grade Suite)
 * Features:
 * - Apple-grade Dynamic Island Top HUD with fluid morphing and live waveform audio state.
 * - macOS Spotlight Command Palette (⌘K / Ctrl+K) for instant fuzzy search across ABDM records & tools.
 * - macOS Floating Glass Bottom Dock with spring icon magnification.
 * - Role-based ABDM HPR Doctor and ABHA Patient workflows.
 */
export default function App() {
  const [activeView, setActiveView] = useState('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isDoctorAuthModalOpen, setIsDoctorAuthModalOpen] = useState(false);
  const [isPatientAuthModalOpen, setIsPatientAuthModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  const [islandMode, setIslandMode] = useState('ready'); // 'ready' | 'listening' | 'synthesizing' | 'playing' | 'abdm'
  const [selectedEncounterIndex, setSelectedEncounterIndex] = useState(0);

  // Authenticated profiles (null by default until verified login)
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);

  // Global Keyboard Shortcut: Cmd+K or Ctrl+K for macOS Spotlight
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSpotlightOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleDoctorLoginSuccess = (profile) => {
    setDoctorProfile(profile);
    setActiveView('doctor_portal');
    setIslandMode('abdm');
    setTimeout(() => setIslandMode('ready'), 3500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutDoctor = () => {
    setDoctorProfile(null);
    setActiveView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePatientLoginSuccess = (profile) => {
    setPatientProfile(profile);
    setActiveView('patient_portal');
    setIslandMode('abdm');
    setTimeout(() => setIslandMode('ready'), 3500);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutPatient = () => {
    setPatientProfile(null);
    setActiveView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchEncounterFromDoctorQueue = (encounterIndex) => {
    setSelectedEncounterIndex(encounterIndex);
    setActiveView('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC', position: 'relative' }}>
      {/* Apple-Style Dynamic Island Top Floating HUD */}
      <DynamicIsland 
        mode={islandMode}
        activeLanguage={patientProfile?.language || 'Telugu'}
        patientName={patientProfile?.patientName || 'Ananya Rao'}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
      />

      {/* Top Navigation Bar */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenTechModal={() => setIsTechModalOpen(true)}
        onOpenDoctorAuthModal={() => setIsDoctorAuthModalOpen(true)}
        onOpenPatientAuthModal={() => setIsPatientAuthModalOpen(true)}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        doctorProfile={doctorProfile}
        patientProfile={patientProfile}
        onLogoutDoctor={handleLogoutDoctor}
        onLogoutPatient={handleLogoutPatient}
      />

      {/* Main View Container */}
      {activeView === 'landing' && (
        <main style={{ flex: 1, paddingBottom: '70px' }}>
          <HeroLanding 
            onLaunchStudio={() => setIsDoctorAuthModalOpen(true)} 
            onOpenTechModal={() => setIsTechModalOpen(true)}
            onOpenDoctorAuthModal={() => setIsDoctorAuthModalOpen(true)}
            onOpenPatientAuthModal={() => setIsPatientAuthModalOpen(true)}
          />
        </main>
      )}

      {activeView === 'doctor_portal' && (
        <main style={{ flex: 1, paddingBottom: '80px' }}>
          <DoctorPortal 
            doctorProfile={doctorProfile || {
              doctorName: 'Dr. Priya Sharma, MD',
              specialty: 'Pulmonologist & Critical Care',
              hprId: 'ABHA-HPR-8921-9942',
              facility: 'Kurnool District Hospital (ABDM PHC #1402)'
            }}
            onSelectEncounterAndLaunch={handleLaunchEncounterFromDoctorQueue}
            onOpenTechModal={() => setIsTechModalOpen(true)}
            onLogoutDoctor={handleLogoutDoctor}
            registeredPatients={patientProfile?.familyMembers || []}
          />
        </main>
      )}

      {activeView === 'patient_portal' && (
        <main style={{ flex: 1, paddingBottom: '80px' }}>
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
          />
        </main>
      )}

      {(activeView === 'console' || activeView === 'tech_specs') && (
        <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 68px)', paddingBottom: '70px' }}>
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

      {/* macOS Floating Glass Bottom Dock with Icon Magnification */}
      <MacDock 
        activeView={activeView}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDoctorPortal={() => {
          if (!doctorProfile) {
            setIsDoctorAuthModalOpen(true);
          } else {
            setActiveView('doctor_portal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenPatientPortal={() => {
          if (!patientProfile) {
            setIsPatientAuthModalOpen(true);
          } else {
            setActiveView('patient_portal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenSpotlight={() => setIsSpotlightOpen(true)}
        onOpenTechModal={() => setIsTechModalOpen(true)}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        unreadCount={2}
      />

      {/* macOS Spotlight Command Palette Modal (⌘K) */}
      <SpotlightCommand 
        isOpen={isSpotlightOpen}
        onClose={() => setIsSpotlightOpen(false)}
        onNavigate={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenDoctorPortal={() => {
          if (!doctorProfile) {
            setIsDoctorAuthModalOpen(true);
          } else {
            setActiveView('doctor_portal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenPatientPortal={() => {
          if (!patientProfile) {
            setIsPatientAuthModalOpen(true);
          } else {
            setActiveView('patient_portal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenTechModal={() => setIsTechModalOpen(true)}
        onTriggerVoiceRx={(lang) => {
          setIslandMode('listening');
          setTimeout(() => {
            setIslandMode('synthesizing');
            setTimeout(() => {
              setIslandMode('playing');
              setTimeout(() => setIslandMode('ready'), 4000);
            }, 2000);
          }, 3000);
        }}
      />

      {/* Ambient Floating AI Voice Assistant Widget (5-State Indic Audio Engine) */}
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
    </div>
  );
}

