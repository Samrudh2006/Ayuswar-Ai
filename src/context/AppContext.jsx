import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const SUPPORTED_LANGUAGES = [
  { code: 'en-IN', name: 'English (India)', label: 'English', vernacular: 'English', voiceCode: 'en-IN' },
  { code: 'te-IN', name: 'Telugu (తెలుగు)', label: 'Telugu', vernacular: 'తెలుగు', voiceCode: 'te-IN' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', label: 'Hindi', vernacular: 'हिन्दी', voiceCode: 'hi-IN' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', label: 'Tamil', vernacular: 'தமிழ்', voiceCode: 'ta-IN' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', label: 'Kannada', vernacular: 'ಕನ್ನಡ', voiceCode: 'kn-IN' },
  { code: 'mr-IN', name: 'Marathi (मराठी)', label: 'Marathi', vernacular: 'मराठी', voiceCode: 'mr-IN' }
];

export const DEFAULT_DOCTOR_PROFILE = {
  id: 'doc_priya',
  doctorName: 'Dr. Priya Sharma, MD',
  hprId: 'DEMO-HPR-8921-9942',
  nmcRegNo: 'DEMO-NMC-TS-2016-48291',
  specialty: 'Pulmonology & Critical Care',
  department: 'Chest & Respiratory Medicine',
  facility: 'Kurnool District Hospital (ABDM PHC #1402)',
  experience: '14 years',
  avatar: '/assets/dr_ananya_avatar.jpg',
  specialtyDomain: 'respiratory',
  isExplicitLogin: true
};

export const DEFAULT_PATIENT_PROFILE = {
  id: 'DEMO-P001',
  name: 'Lakshmi Amma',
  patientName: 'Lakshmi Amma',
  vernacularName: 'లక్ష్మి అమ్మ',
  age: 58,
  gender: 'Female',
  genderLabel: 'Female',
  language: 'Telugu (తెలుగు)',
  abhaId: '91-4521-8932-1049',
  phone: '+91 98480 22338',
  village: 'Kurnool Rural',
  isExplicitLogin: true
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  // Shared persistent language selection — default English (en-IN), Telugu (te-IN) available
  const [selectedLanguage, setSelectedLanguageState] = useState(() => {
    try {
      return localStorage.getItem('ayuswar_selected_language') || 'en-IN';
    } catch {
      return 'en-IN';
    }
  });

  const setSelectedLanguage = useCallback((langCode) => {
    setSelectedLanguageState(langCode);
    try {
      localStorage.setItem('ayuswar_selected_language', langCode);
    } catch (e) {
      console.warn('Could not persist language preference:', e);
    }
  }, []);

  // Demo mode vs Live Mode: Live mode starts empty. Demo mode opt-in displays persistent banner.
  const [isDemoMode, setIsDemoMode] = useState(() => {
    try {
      return localStorage.getItem('ayuswar_demo_mode') === 'true';
    } catch {
      return false;
    }
  });

  const toggleDemoMode = useCallback((val) => {
    const nextVal = typeof val === 'boolean' ? val : !isDemoMode;
    setIsDemoMode(nextVal);
    try {
      localStorage.setItem('ayuswar_demo_mode', String(nextVal));
    } catch (e) {
      console.warn('Could not persist demo mode state:', e);
    }
  }, [isDemoMode]);

  const DEFAULT_DOCTOR = DEFAULT_DOCTOR_PROFILE;
  const DEFAULT_PATIENT = DEFAULT_PATIENT_PROFILE;

  // Authenticated profiles (starts as null until clinician / citizen explicitly logs in or registers)
  const [doctorProfile, setDoctorProfileState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('ayuswar_doctor_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Cleanse legacy automatic demo fallback if present
        if (parsed?.hprId === '91-8842-1923-4410' && !parsed?.isExplicitLogin) {
          sessionStorage.removeItem('ayuswar_doctor_profile');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const setDoctorProfile = useCallback((profile) => {
    setDoctorProfileState(profile);
    try {
      if (profile) {
        sessionStorage.setItem('ayuswar_doctor_profile', JSON.stringify({ ...profile, isExplicitLogin: true }));
      } else {
        sessionStorage.removeItem('ayuswar_doctor_profile');
      }
    } catch (e) {
      console.warn('Could not persist doctor profile:', e);
    }
  }, []);

  const [patientProfile, setPatientProfileState] = useState(() => {
    try {
      const saved = sessionStorage.getItem('ayuswar_patient_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Cleanse legacy automatic demo fallback if present
        if (parsed?.abhaId === '91-4521-8820-9102' && !parsed?.isExplicitLogin) {
          sessionStorage.removeItem('ayuswar_patient_profile');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const setPatientProfile = useCallback((profile) => {
    setPatientProfileState(profile);
    try {
      if (profile) {
        sessionStorage.setItem('ayuswar_patient_profile', JSON.stringify({ ...profile, isExplicitLogin: true }));
      } else {
        sessionStorage.removeItem('ayuswar_patient_profile');
      }
    } catch (e) {
      console.warn('Could not persist patient profile:', e);
    }
  }, []);

  // Active ASR/TTS Speech Provider Status
  const [speechProviderStatus, setSpeechProviderStatus] = useState({
    provider: 'browser_fallback', // 'browser_fallback' | 'gnani_unverified' | 'unavailable'
    asrActive: false,
    ttsActive: false,
    label: 'Browser Web Speech (Client Fallback)',
    isRealProviderVerified: false,
    note: 'Server-side Gnani credentials not configured in this environment. Using standard Web Speech API.'
  });

  // OPD Queue: Empty in live mode, populated with fixtures in demo mode
  const [appointmentsQueue, setAppointmentsQueue] = useState([]);

  useEffect(() => {
    if (isDemoMode) {
      setAppointmentsQueue([
        {
          id: 'demo_appt_101',
          token: 'DEMO-101',
          patientName: 'Demo Patient 01',
          vernacular: 'నారాయణ రావు (Demo)',
          phone: '+91 90000 00001',
          age: 58,
          gender: 'Male',
          language: 'Telugu',
          abhaId: 'DEMO-ABHA-0001',
          doctorName: 'Dr. Priya Sharma, MD',
          specialty: 'Pulmonology & Critical Care',
          date: 'Today',
          time: '09:30 AM',
          status: 'Waiting',
          chiefComplaint: 'Synthetic test scenario: cough and shortness of breath',
          vitals: 'BP: 130/85, HR: 78 bpm, SpO2: 97%',
          priority: 'Normal',
          isSyntheticFixture: true
        }
      ]);
    } else {
      setAppointmentsQueue([]);
    }
  }, [isDemoMode]);

  const value = {
    selectedLanguage,
    setSelectedLanguage,
    isDemoMode,
    toggleDemoMode,
    // Canonical doctor state + aliases for backwards-compatibility
    doctorProfile,
    setDoctorProfile,
    currentDoctor: doctorProfile,
    setCurrentDoctor: setDoctorProfile,
    // Canonical patient state + aliases for backwards-compatibility
    patientProfile,
    setPatientProfile,
    currentPatient: patientProfile,
    setCurrentPatient: setPatientProfile,
    speechProviderStatus,
    setSpeechProviderStatus,
    appointmentsQueue,
    setAppointmentsQueue,
    currentLangObj: SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage) || SUPPORTED_LANGUAGES[0]
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
