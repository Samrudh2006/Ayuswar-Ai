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
import NotificationDrawer from './components/NotificationDrawer';

/**
 * AyuSwar AI — Root Application Orchestrator
 * Architecture Decision:
 * - Public Landing Page is a stunning full-width, edge-to-edge marketing showcase (no sidebar crowding!).
 * - The Collapsible Sidebar ONLY activates when entering application workspaces:
 *   Doctor Portal, Clinical Studio, Patient Portal, and Tech Specs.
 */
export default function App() {
  const [activeView, setActiveView] = useState('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [selectedEncounterIndex, setSelectedEncounterIndex] = useState(0);

  // Authenticated doctor profile
  const [doctorProfile, setDoctorProfile] = useState({
    doctorName: 'Dr. Ananya Sharma, MD',
    hprId: 'ABHA-HPR-8921-9942',
    facility: 'Kurnool District Hospital (ABDM PHC #1402)'
  });

  const handleLoginSuccess = (profile) => {
    setDoctorProfile(profile);
    setActiveView('doctor_portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutDoctor = () => {
    setDoctorProfile(null);
    setActiveView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLaunchEncounterFromDoctorQueue = (encounterIndex) => {
    setSelectedEncounterIndex(encounterIndex);
    setActiveView('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine if we are in app workspace mode (needs sidebar)
  const isAppWorkspaceMode = activeView !== 'landing';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Top Navigation Bar */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenTechModal={() => {
          setActiveView('tech_specs');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        doctorProfile={doctorProfile}
        onLogoutDoctor={handleLogoutDoctor}
      />

      {/* Main View Container */}
      {isAppWorkspaceMode ? (
        // App Workspace Layout with Collapsible Sidebar
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
            {activeView === 'doctor_portal' && (
              <DoctorPortal 
                doctorProfile={doctorProfile}
                onSelectEncounterAndLaunch={handleLaunchEncounterFromDoctorQueue}
              />
            )}

            {activeView === 'console' && (
              <ClinicalConsole 
                doctorProfile={doctorProfile}
                initialEncounterIndex={selectedEncounterIndex}
              />
            )}

            {activeView === 'patient_portal' && (
              <PatientPortal />
            )}

            {activeView === 'tech_specs' && (
              <TechSpecsView 
                onLaunchConsole={() => {
                  setActiveView('console');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            )}
          </main>
        </div>
      ) : (
        // Full-Width Landing Page (No sidebar squeezing the marketing site!)
        <main style={{ flex: 1 }}>
          <HeroLanding 
            onLaunchStudio={() => {
              setActiveView('console');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            onOpenTechModal={() => {
              setActiveView('tech_specs');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            onOpenDoctorPortal={() => {
              setActiveView('doctor_portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPatientPortal={() => {
              setActiveView('patient_portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </main>
      )}

      {/* Real-Time Clinical Notification Drawer */}
      <NotificationDrawer 
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
      />

      {/* Doctor Authentication Modal */}
      <DoctorAuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Architecture Telemetry Modal Fallback */}
      <ArchitectureModal 
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
      />
    </div>
  );
}
