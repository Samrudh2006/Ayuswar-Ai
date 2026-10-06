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
 * Connects the multi-portal architecture:
 * 1. Public Showcase (World-class marketing site)
 * 2. Doctor Portal (Live Outpatient Queue & Physician KPIs)
 * 3. Clinical Studio (Live Ambient Scribe & Karaoke Audio-Rx Telemetry)
 * 4. Patient Portal (Citizen ABHA Digital Card & Spoken Audio Pillbox)
 * 5. Tech Specs (Deep-tech HLD, LLD & DSP Math)
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
  };

  const handleLogoutDoctor = () => {
    setDoctorProfile(null);
    setActiveView('landing');
  };

  const handleLaunchEncounterFromDoctorQueue = (encounterIndex) => {
    setSelectedEncounterIndex(encounterIndex);
    setActiveView('console');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Top Navigation Bar */}
      <Navbar 
        activeView={activeView} 
        setActiveView={setActiveView} 
        onOpenTechModal={() => setActiveView('tech_specs')}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        doctorProfile={doctorProfile}
        onLogoutDoctor={handleLogoutDoctor}
      />

      {/* Main Layout Body with Collapsible Sidebar */}
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

        {/* View Routing Surface */}
        <main style={{ flex: 1, overflowY: 'auto' }}>
          {activeView === 'landing' && (
            <HeroLanding 
              onLaunchStudio={() => {
                setActiveView('console');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              onOpenTechModal={() => setActiveView('tech_specs')}
              onOpenAuthModal={() => setIsAuthModalOpen(true)}
            />
          )}

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
              onLaunchConsole={() => setActiveView('console')}
            />
          )}
        </main>
      </div>

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

      {/* Deep-Tech Telemetry Modal Fallback */}
      <ArchitectureModal 
        isOpen={isTechModalOpen}
        onClose={() => setIsTechModalOpen(false)}
      />
    </div>
  );
}
