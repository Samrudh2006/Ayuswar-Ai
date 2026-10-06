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

/**
 * AyuSwar AI — Root Application Orchestrator
 * Architecture Decision:
 * - Public Landing Page is a stunning full-width, edge-to-edge marketing showcase (no sidebar crowding!).
 * - Interactive elements on the landing page explain features with deep dedicated matter (no premature redirects).
 * - Workspaces require role-based authentication:
 *   • Doctor Portal: Verified ABDM Healthcare Professional Registry (HPR).
 *   • Patient Portal: Verified ABHA Citizen Health Account.
 * - The Collapsible Sidebar ONLY activates inside authenticated workspaces.
 */
export default function App() {
  const [activeView, setActiveView] = useState('landing');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTechModalOpen, setIsTechModalOpen] = useState(false);
  const [isDoctorAuthModalOpen, setIsDoctorAuthModalOpen] = useState(false);
  const [isPatientAuthModalOpen, setIsPatientAuthModalOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [selectedEncounterIndex, setSelectedEncounterIndex] = useState(0);

  // Authenticated profiles (null by default until verified login)
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [patientProfile, setPatientProfile] = useState(null);

  const handleDoctorLoginSuccess = (profile) => {
    setDoctorProfile(profile);
    setActiveView('doctor_portal');
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

  // Determine if we are in app workspace mode (needs sidebar)
  const isAppWorkspaceMode = activeView !== 'landing';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Top Navigation Bar */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenTechModal={() => setIsTechModalOpen(true)}
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
            onOpenDoctorAuthModal={() => setIsDoctorAuthModalOpen(true)}
            onOpenPatientAuthModal={() => setIsPatientAuthModalOpen(true)}
          />
        </main>
      )}

      {activeView === 'doctor_portal' && (
        <main style={{ flex: 1 }}>
          <DoctorPortal 
            doctorProfile={doctorProfile || {
              doctorName: 'Dr. Priya Sharma',
              specialty: 'Pulmonologist',
              hprId: 'ABHA-HPR-8921-9942',
              facility: 'District Hospital / Tier-1 Pulmonology OPD'
            }}
            onSelectEncounterAndLaunch={handleLaunchEncounterFromDoctorQueue}
            onOpenTechModal={() => setIsTechModalOpen(true)}
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
