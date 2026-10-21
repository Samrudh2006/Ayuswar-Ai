import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Heart, 
  Calendar, 
  FileText, 
  Pill, 
  Sparkles, 
  Target, 
  Settings, 
  Bell, 
  ChevronDown, 
  Upload, 
  Eye, 
  MessageSquare, 
  Send, 
  Activity, 
  Moon, 
  Scale, 
  Volume2, 
  Play, 
  Pause, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Languages,
  QrCode,
  Download,
  AlertCircle,
  PhoneCall,
  Check,
  Award,
  LogOut,
  Plus,
  X,
  Menu,
  FileCheck,
  UploadCloud,
  Droplets,
  Wind,
  Zap,
  RefreshCw,
  Smartphone,
  Sliders,
  Shield,
  WifiOff,
  Mic,
  MicOff
} from 'lucide-react';
import { askAyuSwarBrain } from '../services/aiBrainService';
import { speechService } from '../services/indicSpeechService';
import AbhaDigitalCard from './AbhaDigitalCard';
import WhatsAppAudioRxModal from './WhatsAppAudioRxModal';
import AuthenticQrCode from './AuthenticQrCode';
import ClinicalNotificationsDrawer from './ClinicalNotificationsDrawer';
import PatientHealthGoalsTab from './patient/PatientHealthGoalsTab';
import { checkDrugInteractions, calculateMewsScore, getJanAushadhiGenericInfo } from '../data/clinicalSafetySentinel';
import { DEMO_PATIENTS, DEMO_APPOINTMENTS, formatDemoDate, getRelativeDaysLabel, SampleDataChip } from '../data/demoData';

/**
 * PatientPortal Component — Complete Enterprise Citizen Healthcare Operating System
 * Faithfully implements Screenshot 1 + All 8 dedicated sidebar views:
 * 1. Home (Hero welcome, 4 quick actions, Upcoming appts, Health overview vitals, Ask AyuSwar, Goals, Doctor card)
 * 2. My Health (Official ABHA Digital Health Card, QR verification, longitudinal vitals graphs, chronic conditions)
 * 3. Appointments (Upcoming online/in-person visits, Book New Appointment wizard, past visit summary)
 * 4. Reports (Lab test results, X-rays, blood biochemistry, 1-Click "Hear Report in My Language" native audio)
 * 5. Medications (Smart Chronotherapy Pillbox: Early morning empty stomach, meals, bedtime with spoken voiceover)
 * 6. AI Assistant (Vernacular health assistant, symptoms advice, emergency 108/104 direct action banner)
 * 7. Health Goals (10k steps tracker, hydration glasses, medication adherence streak, sleep tracker)
 * 8. Settings (Native Indic dialect selector, ABHA family locker switcher, WhatsApp voice reminder preferences)
 */
export default function PatientPortal({ 
  patientProfile, 
  onOpenDoctorAuthModal, 
  onLogoutPatient, 
  onSwitchPatient,
  appointmentsQueue = [],
  onBookAppointment
}) {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showWhatsAppRxModal, setShowWhatsAppRxModal] = useState(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);
  
  // Book Consultation Modal State
  const [isBookConsultationModalOpen, setIsBookConsultationModalOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState('Dr. Priya Sharma, MD');
  const [bookingSpecialty, setBookingSpecialty] = useState('Pulmonology & Critical Care');
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingTime, setBookingTime] = useState('10:00 AM');
  const [bookingMode, setBookingMode] = useState('In-Person OPD');
  const [bookingReason, setBookingReason] = useState('ఛాతీలో అసౌకర్యం మరియు శ్వాస తీసుకోవడంలో ఇబ్బంది (Chest discomfort & dyspnea)');
  const [bookingSuccessToast, setBookingSuccessToast] = useState(false);

  const [patientQuestion, setPatientQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'user',
      text: 'I have mild cough and sore throat. What should I do?'
    },
    {
      sender: 'ai',
      text: 'Hello! For mild cough and throat irritation: Drink warm water with honey, avoid refrigerated drinks, and use saline gargles twice daily. If you develop high fever or shortness of breath, connect with Dr. Priya immediately.'
    }
  ]);

  // Multi-patient profiles available for switching - sourced directly from shared DEMO_PATIENTS
  const availablePatients = DEMO_PATIENTS.map(dp => ({
    patientName: dp.name,
    age: dp.age,
    gender: dp.genderLabel || (dp.gender === 'F' ? 'Female' : 'Male'),
    language: dp.language,
    abhaId: dp.abhaId,
    condition: dp.primaryCondition,
    facility: `${dp.village} Health Centre`,
    phone: dp.phone,
    vitalsHistory: dp.vitalsHistory,
    reports: dp.reports,
    prescriptions: dp.prescriptions
  }));

  const assignedDoctor = patientProfile?.assignedDoctor || {
    doctorName: 'Dr. Priya Sharma, MD',
    specialty: 'Pulmonologist & Critical Care',
    facility: 'District Hospital OPD'
  };

  const familyListToDisplay = (patientProfile?.familyMembers && patientProfile.familyMembers.length > 0)
    ? patientProfile.familyMembers
    : availablePatients;
  const hasFamilyLocker = familyListToDisplay.length > 1;

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isUploadReportModalOpen, setIsUploadReportModalOpen] = useState(false);
  const [isAddMedicationModalOpen, setIsAddMedicationModalOpen] = useState(false);
  const [showPrintRxModal, setShowPrintRxModal] = useState(false);
  const [plannedNotice, setPlannedNotice] = useState(null);

  const showPlannedNotice = (featureName) => {
    setPlannedNotice(featureName);
    setTimeout(() => setPlannedNotice(null), 3500);
  };

  // Chronotherapy Timing & Spoken Voice Prescription State
  const [selectedLanguage, setSelectedLanguage] = useState(patientProfile?.language || 'Telugu');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePillSlot, setActivePillSlot] = useState('morning');
  const [dailyPillChecked, setDailyPillChecked] = useState({
    early_morning: true,
    morning: true,
    afternoon: false,
    evening: false,
    night: false
  });

  // --- Enhanced Settings Suite State ---
  const [voicePersona, setVoicePersona] = useState('female_compassionate');
  const [speechTempo, setSpeechTempo] = useState('1.0x');
  const [autoPlayAudio, setAutoPlayAudio] = useState(false);
  
  // Omnichannel Dispatches & Notifications
  const [enableWhatsAppData, setEnableWhatsAppData] = useState(true);
  const [enableIvrPhoneCalls, setEnableIvrPhoneCalls] = useState(true);
  const [enableSmsRegional, setEnableSmsRegional] = useState(true);
  const [preferredReminderTime, setPreferredReminderTime] = useState('06:30 AM');
  
  // Emergency Caregiver Escalation
  const [emergencyContactName, setEmergencyContactName] = useState('K. Rajesh (Son / Caregiver)');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98480 22334');
  const [emergencyAutoTransmit108, setEmergencyAutoTransmit108] = useState(true);

  // ABDM / ABHA Health Locker & Consent Governance
  const [consentDurationDays, setConsentDurationDays] = useState(30);
  const [autoShareEmergencyRecords, setAutoShareEmergencyRecords] = useState(true);
  const [fhirDataMasking, setFhirDataMasking] = useState(false);

  // Rural PHC Offline Mode & Low Data
  const [offlineVoiceCaching, setOfflineVoiceCaching] = useState(true);
  const [lowDataAudioCodec, setLowDataAudioCodec] = useState(true);
  const [cacheSizeMb, setCacheSizeMb] = useState('14.2 MB');
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);


  const patientName = patientProfile?.patientName || patientProfile?.name || DEMO_PATIENTS[0].name;
  const abhaId = patientProfile?.abhaId || DEMO_PATIENTS[0].abhaId;
  const activeDemoPatient = DEMO_PATIENTS.find(p => p.name === patientName || p.id === patientProfile?.id || p.abhaId === abhaId) || DEMO_PATIENTS[0];

  // Dynamic Reactive Diagnostic Reports List (Relative dates)
  const [reportsList, setReportsList] = useState(patientProfile?.reportsList || [
    {
      id: 1,
      title: 'Chest X-Ray Report',
      date: formatDemoDate(-3),
      icon: '🩻',
      doctor: assignedDoctor.doctorName,
      summary: 'Clear lung fields with no pneumonia or fluid buildup. Mild airway sensitivity.',
      spokenTelugu: 'మీ ఛాతీ ఎక్స్-రే లో ఎలాంటి ఇన్ఫెక్షన్ లేదా నీరు చేరడం లేదు. ఊపిరితిత్తులు ఆరోగ్యంగా ఉన్నాయి.',
      spokenHindi: 'आपकी छाती के एक्स-रे में कोई गंभीर संक्रमण नहीं है। फेफड़े सामान्य हैं।'
    },
    {
      id: 2,
      title: 'Complete Blood Count (CBC)',
      date: formatDemoDate(-4),
      icon: '🩸',
      doctor: 'Dr. Priya Sharma',
      summary: 'Hemoglobin: 12.4 g/dL (Good). White blood cells slightly raised indicating resolving seasonal cold.',
      spokenTelugu: 'మీ రక్త పరీక్షలో హిమోగ్లోబిన్ బాగుంది. ఇన్ఫెక్షన్ తగ్గిపోతోంది, భయపడాల్సిన పనిలేదు.',
      spokenHindi: 'आपकी खून की जांच में हीमोग्लोबिन अच्छा है। मौसमी सर्दी ठीक हो रही है।'
    },
    {
      id: 3,
      title: 'Pulmonary Spirometry Test',
      date: formatDemoDate(-7),
      icon: '𫁁',
      doctor: 'Dr. Priya Sharma',
      summary: 'Airway volume is 86% of predicted value, showing excellent response to your morning inhaler.',
      spokenTelugu: 'మీ ఊపిరితిత్తుల గాలి సామర్థ్యం 86 శాతం ఉంది. ఇన్హేలర్ సరిగ్గా పనిచేస్తోంది.',
      spokenHindi: 'आपके सांस लेने की क्षमता बहुत अच्छी है। इन्हेलर से सुधार दिख रहा है।'
    }
  ]);

  // Upload Report Form State
  const [newReportTitle, setNewReportTitle] = useState('HbA1c & Fasting Blood Glucose');
  const [newReportDoctor, setNewReportDoctor] = useState('Dr. Priya Sharma');
  const [newReportDate, setNewReportDate] = useState(formatDemoDate(0));
  const [newReportSummary, setNewReportSummary] = useState('HbA1c: 6.4% (Good Control). Fasting Blood Sugar: 104 mg/dL. Renal function intact.');
  const [newReportTelugu, setNewReportTelugu] = useState('మీ రక్తంలో చక్కెర స్థాయిలు అదుపులో ఉన్నాయి. హెచ్‌బీఏ1సి 6.4 శాతం ఉంది.');
  const [newReportHindi, setNewReportHindi] = useState('आपके खून में शुगर का स्तर नियंत्रण में है। दवाएं ठीक से काम कर रही हैं।');
  const [isAiScanningReport, setIsAiScanningReport] = useState(false);

  // Dynamic Reactive Chronotherapy Medications Schedule
  const [chronotherapySchedule, setChronotherapySchedule] = useState([
    {
      id: 'early_morning',
      label: 'Early Morning',
      time: '06:30 AM',
      mealContext: 'Empty Stomach (పరగడుపున / भूखे पेट)',
      medicine: 'Pantoprazole 40mg',
      purpose: 'Acid Reflux & Gastric Protection',
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.1)',
      teluguAudioText: 'ఉదయం లేవగానే పరగడుపున ఈ పసుపు రంగు టాబ్లెట్ ఒక గ్లాసు నీళ్లతో వేసుకోండి.',
      hindiAudioText: 'सुबह उठते ही खाली पेट यह पीली गोली एक गिलास पानी के साथ लें।'
    },
    {
      id: 'morning',
      label: 'Morning',
      time: '08:30 AM',
      mealContext: 'After Breakfast (టిఫిన్ తర్వాత / नाश्ते के बाद)',
      medicine: 'Budesonide Inhaler (200 mcg)',
      purpose: 'Airway anti-inflammatory for Asthma',
      color: '#0F4C5C',
      bg: 'rgba(15, 76, 92, 0.1)',
      teluguAudioText: 'ఉదయం టిఫిన్ తిన్న తర్వాత ఈ ఇన్హేలర్ రెండు పఫ్స్ తీసుకోండి, తర్వాత నోరు పుక్కిలించండి.',
      hindiAudioText: 'सुबह नाश्ते के बाद इस इन्हेलर के दो पफ लें, और फिर कुल्ला करें।'
    },
    {
      id: 'afternoon',
      label: 'Afternoon',
      time: '01:30 PM',
      mealContext: 'After Lunch (భోజనం తర్వాత / दोपहर खाने के बाद)',
      medicine: 'Multivitamin & Zinc Capsule',
      purpose: 'Immune & energy booster',
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.1)',
      teluguAudioText: 'మధ్యాహ్నం భోజనం చేసిన తర్వాత ఈ ఎరుపు రంగు క్యాప్సూల్ ఒకసారి వేసుకోండి.',
      hindiAudioText: 'दोपहर खाने के बाद यह लाल कैप्सूल एक बार लें।'
    },
    {
      id: 'evening',
      label: 'Evening',
      time: '05:30 PM',
      mealContext: 'With Evening Tea/Snack (సాయంత్రం / शाम को)',
      medicine: 'Steam Inhalation + Lozenges',
      purpose: 'Throat soothing & airway clearance',
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.1)',
      teluguAudioText: 'సాయంత్రం వేళల్లో వేడి నీళ్ల ఆవిరి పట్టండి మరియు గొంతు నొప్పి తగ్గడానికి ఈ మాత్ర చప్పరించండి.',
      hindiAudioText: 'शाम के समय गर्म पानी की भाप लें और गले की राहत के लिए यह गोली चूसें।'
    },
    {
      id: 'night',
      label: 'Night',
      time: '08:30 PM',
      mealContext: 'After Dinner (రాత్రి భోజనం తర్వాత / रात खाने के बाद)',
      medicine: 'Montelukast + Levocetirizine',
      purpose: 'Nocturnal cough & allergy prevention',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      teluguAudioText: 'రాత్రి భోజనం తర్వాత పడుకోవడానికి ముందు ఈ నీలం రంగు మాత్ర ఒకటి వేసుకోండి.',
      hindiAudioText: 'रात के खाने के बाद सोने से पहले यह नीली गोली एक बार लें।'
    }
  ]);

  // Manual Add Medicine Form State
  const [manualMedName, setManualMedName] = useState('Paracetamol 650mg');
  const [manualSlot, setManualSlot] = useState('morning');
  const [manualMealContext, setManualMealContext] = useState('After Meals (భోజనం తర్వాత)');
  const [manualPurpose, setManualPurpose] = useState('Fever & Bodyache relief');
  const [manualTeluguAudio, setManualTeluguAudio] = useState('జ్వరం లేదా ఒళ్ళు నొప్పులు ఉన్నప్పుడు భోజనం తర్వాత ఈ టాబ్లెట్ వేసుకోండి.');
  const [manualHindiAudio, setManualHindiAudio] = useState('बुखार या बदन दर्द होने पर खाना खाने के बाद यह गोली लें।');

  const currentPill = chronotherapySchedule.find(p => p.id === activePillSlot) || chronotherapySchedule[1];

  // Dynamic Synchronization with Selected Citizen or Family Member
  useEffect(() => {
    if (patientProfile?.chronotherapySchedule) {
      setChronotherapySchedule(patientProfile.chronotherapySchedule);
    }
    if (patientProfile?.reportsList) {
      setReportsList(patientProfile.reportsList);
    }
    if (patientProfile?.language) {
      setSelectedLanguage(patientProfile.language);
    }
    if (patientProfile?.assignedDoctor?.doctorName) {
      setNewReportDoctor(patientProfile.assignedDoctor.doctorName);
    }
  }, [patientProfile]);

  const handlePlayVoicePrescription = (customText) => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = customText || (selectedLanguage === 'Telugu' 
        ? currentPill.teluguAudioText 
        : currentPill.hindiAudioText);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = selectedLanguage === 'Telugu' ? 'te-IN' : 'hi-IN';
        utterance.rate = 0.92;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 4000);
      }
    }
  };

  const [isOpdMicListening, setIsOpdMicListening] = useState(false);

  const toggleOpdSpeechRecognition = async () => {
    if (isOpdMicListening) {
      speechService.stopLiveRecognition();
      setIsOpdMicListening(false);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const targetLang = selectedLanguage === 'Telugu' ? 'te-IN' : (selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN');
      setIsOpdMicListening(true);

      speechService.startLiveRecognition({
        langCode: targetLang,
        onResult: ({ finalTranscript, interimTranscript }) => {
          const spoken = finalTranscript || interimTranscript;
          if (spoken) {
            setPatientQuestion(spoken);
            if (finalTranscript.trim()) {
              handleSendChatWithText(finalTranscript.trim());
              setIsOpdMicListening(false);
            }
          }
        },
        onError: () => {
          setIsOpdMicListening(false);
        },
        onStatusChange: ({ isListening }) => {
          setIsOpdMicListening(isListening);
        }
      });
    } catch {
      setIsOpdMicListening(false);
      alert('Please grant microphone permission to speak to OPD Assistant.');
    }
  };

  const handleSendChatWithText = async (textToSend) => {
    if (!textToSend || !textToSend.trim()) return;
    const userText = textToSend.trim();
    setPatientQuestion('');

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'ai', text: 'Analyzing symptom against ICMR guidelines...' }
    ]);

    const targetLang = selectedLanguage === 'Telugu' ? 'te-IN' : (selectedLanguage === 'Hindi' ? 'hi-IN' : 'en-IN');

    try {
      const aiReply = await askAyuSwarBrain(userText, 'patient');
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { sender: 'ai', text: aiReply };
        return updated;
      });

      // Speak reply aloud with barge-in support
      await speechService.speak(aiReply, { langCode: targetLang });
    } catch {
      const fallbackReply = "AyuSwar AI has recorded your query. Stay comfortable, drink plenty of fluids, and your care team led by Dr. Priya has been informed.";
      setChatMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = { 
          sender: 'ai', 
          text: fallbackReply 
        };
        return updated;
      });
      await speechService.speak(fallbackReply, { langCode: targetLang });
    }
  };

  const handleSendChat = async (e) => {
    e?.preventDefault();
    if (!patientQuestion.trim()) return;
    handleSendChatWithText(patientQuestion);
  };

  const isCollapsedView = isSidebarCollapsed && !mobileDrawerOpen;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F7F9' }}>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileDrawerOpen && (
        <div
          className="mobile-drawer-backdrop"
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(3px)',
            zIndex: 95
          }}
        />
      )}

      {/* =========================================================================
          LEFT SIDEBAR (MATCHING SCREENSHOT 1 PATIENT SIDEBAR WITH COLLAPSIBLE ARROW)
          ========================================================================= */}
      <aside 
        className={`patient-portal-aside ${mobileDrawerOpen ? 'mobile-open' : ''}`}
        style={{
          width: isCollapsedView ? '76px' : '240px',
          height: '100vh',
          position: 'sticky',
          top: 0,
          background: '#ffffff',
          borderRight: '1px solid #E2E8F0',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: isCollapsedView ? '20px 10px' : '20px 16px',
          flexShrink: 0,
          overflow: 'visible',
          zIndex: 96,
          transition: 'width 200ms cubic-bezier(0.2, 0, 0, 1), left 250ms ease-in-out'
        }}
      >
        {/* Mobile Close X Button */}
        <button
          className="portal-mobile-close-btn"
          onClick={() => setMobileDrawerOpen(false)}
          style={{
            display: 'none',
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: '#FAF8F5',
            border: 'none',
            borderRadius: '50%',
            width: '28px',
            height: '28px',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            zIndex: 70
          }}
          aria-label="Close menu"
        >
          <X size={16} />
        </button>

        {/* Collapse / Expand Toggle Arrow Button (Fixed & Never Clipped) */}
        <button
          className="portal-desktop-collapse-btn"
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          style={{
            position: 'absolute',
            top: '22px',
            right: '-12px',
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: '#ffffff',
            border: '1.5px solid #CBD5E1',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 60,
            color: '#0F4C5C',
            transition: 'all 0.15s ease'
          }}
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {/* Logo */}
          <div 
            onClick={() => window.location.href = '/'}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              paddingLeft: isCollapsedView ? '2px' : '8px', 
              marginBottom: '32px', 
              cursor: 'pointer',
              justifyContent: isCollapsedView ? 'center' : 'flex-start'
            }}
            title="AyuSwar AI — Return to Website"
          >
            <div style={{
              width: isCollapsedView ? '44px' : '50px',
              height: isCollapsedView ? '44px' : '50px',
              borderRadius: '50%',
              border: '2px solid #D4AF37',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#FAF8F5',
              boxShadow: '0 4px 14px rgba(15, 76, 92, 0.2)',
              flexShrink: 0,
              padding: '2px'
            }}>
              <img src="/assets/ayuswar_emblem_mark.png" alt="AyuSwar AI" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            {!isCollapsedView && (
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '21px', fontWeight: 800, color: '#091E26', whiteSpace: 'nowrap' }}>
                Ayu<span style={{ color: '#0F4C5C' }}>Swar</span> <span style={{ color: '#D4AF37' }}>AI</span>
              </div>
            )}
          </div>

          {/* Navigation Items (All 8 Patient Sidebar Items) */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'my_health', label: 'My Health', icon: Heart },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'medications', label: 'Medications', icon: Pill },
              { id: 'health_goals', label: 'Health Goals', icon: Target },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileDrawerOpen(false);
                  }}
                  title={item.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsedView ? 'center' : 'flex-start',
                    gap: isCollapsedView ? '0' : '12px',
                    padding: isCollapsedView ? '10px 0' : '10px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? 'rgba(15, 76, 92, 0.1)' : 'transparent',
                    color: isActive ? '#0F4C5C' : '#475569',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontWeight: isActive ? 750 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 160ms ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#0F4C5C' : '#64748B'} />
                  {!isCollapsedView && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Health Card */}
        {isCollapsedView ? (
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              padding: '12px 0', 
              borderTop: '1px solid #E2E8F0' 
            }}
            title="AyuSwar Health Companion"
          >
            <Heart size={20} color="#0F4C5C" />
          </div>
        ) : (
          <div style={{
            background: 'linear-gradient(135deg, #E6F7F7 0%, #D1F2F2 100%)',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid #B2E5E5',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '14.5px',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              color: '#081C24',
              marginBottom: '4px'
            }}>
              Your health matters
            </div>
            <div style={{ fontSize: '11px', color: '#006D6D', lineHeight: 1.4 }}>
              AyuSwar is here for you, always.
            </div>
          </div>
        )}
      </aside>

      {/* =========================================================================
          MAIN PATIENT WORKSPACE CANVAS
          ========================================================================= */}
      <div className="patient-portal-main-canvas" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{
          background: '#ffffff',
          padding: '12px clamp(12px, 2vw, 28px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          gap: '12px'
        }}>
          {/* Left: Mobile 3-Lines Hamburger Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              className="portal-mobile-menu-btn"
              onClick={() => setMobileDrawerOpen(true)}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                background: '#FAF8F5',
                color: '#0F4C5C',
                cursor: 'pointer',
                flexShrink: 0
              }}
              title="Open Citizen Navigation Menu"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>
            <span className="patient-portal-title" style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>
              Citizen Health Dashboard
            </span>
          </div>

          {/* Right Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setActiveTab('settings')}
            style={{ 
              cursor: 'pointer',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: activeTab === 'settings' ? '1.5px solid #0F4C5C' : '1px solid #E2E8F0',
              background: activeTab === 'settings' ? 'rgba(15, 76, 92, 0.1)' : '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms ease',
              padding: 0
            }} 
            title="Citizen Settings & ABHA Locker Preferences"
          >
            <Settings size={18} color={activeTab === 'settings' ? '#0F4C5C' : '#64748B'} />
          </button>

          <button 
            onClick={() => setIsNotificationsDrawerOpen(true)}
            style={{ 
              position: 'relative', 
              cursor: 'pointer',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              border: isNotificationsDrawerOpen ? '1.5px solid #0F4C5C' : '1px solid #E2E8F0',
              background: isNotificationsDrawerOpen ? 'rgba(15, 76, 92, 0.1)' : '#F8FAFC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 150ms ease',
              padding: 0
            }} 
            title="Citizen Health Alerts & Reminders"
            aria-label="Open Health Notifications"
          >
            <Bell size={18} color={isNotificationsDrawerOpen ? '#0F4C5C' : '#64748B'} />
            <span style={{
              position: 'absolute',
              top: '7px',
              right: '7px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#EF4444',
              border: '1.5px solid #ffffff'
            }}></span>
          </button>

          {/* Profile Trigger */}
          <div 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '12px',
              background: isProfileMenuOpen ? 'rgba(15, 76, 92, 0.08)' : 'transparent',
              transition: 'background 140ms ease',
              position: 'relative'
            }}
            title="Click to Switch Citizen Profile"
          >
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #0F4C5C, #D4AF37)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px',
              flexShrink: 0
            }}>
              {patientName[0]}
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#081C24' }}>{patientName}</div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>{abhaId}</div>
            </div>
            <ChevronDown size={14} color="#64748B" style={{ transform: isProfileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 180ms ease' }} />

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div 
                onClick={e => e.stopPropagation()}
                style={{
                  position: 'absolute',
                  top: '52px',
                  right: '0',
                  width: '320px',
                  background: '#ffffff',
                  borderRadius: '16px',
                  boxShadow: '0 18px 45px rgba(10, 37, 64, 0.16)',
                  border: '1px solid #E2E8F0',
                  padding: '14px',
                  zIndex: 200
                }}
              >
                <div style={{ paddingBottom: '10px', borderBottom: '1px solid #F1F5F9', marginBottom: '10px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: '#64748B', letterSpacing: '0.6px' }}>
                    Active Citizen ABHA Session
                  </div>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>
                    {patientName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#0F4C5C', fontWeight: 650 }}>
                    Health ID: {abhaId} • Demo Profile
                  </div>
                </div>

                <div style={{ fontSize: '11px', fontWeight: 750, color: '#475569', marginBottom: '8px' }}>
                  {hasFamilyLocker ? 'Switch Patient Account / Family Locker (కుటుంబ ఖాతా):' : 'Account Locker (Single Citizen Profile):'}
                </div>
                
                {hasFamilyLocker ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {familyListToDisplay.map((pat, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (onSwitchPatient) onSwitchPatient(pat);
                          setIsProfileMenuOpen(false);
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '8px 10px',
                          borderRadius: '10px',
                          border: pat.patientName === patientName ? '1.5px solid #0F4C5C' : '1px solid #E2E8F0',
                          background: pat.patientName === patientName ? 'rgba(15, 76, 92, 0.05)' : '#ffffff',
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 750, color: '#081C24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{pat.patientName}</span>
                            {pat.relation && (
                              <span style={{ fontSize: '9.5px', background: '#FEF3C7', color: '#92400E', padding: '1px 5px', borderRadius: '4px', fontWeight: 700 }}>
                                {pat.relation}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                            {pat.condition || 'General Health'} • Assigned: <strong>{pat.assignedDoctor?.doctorName || 'Dr. Priya Sharma'}</strong>
                          </div>
                        </div>
                        {pat.patientName === patientName && <Check size={14} color="#0F4C5C" />}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '8px 10px', background: '#FAF8F5', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '11.5px', color: '#64748B' }}>
                    Single Citizen Account. No family members were registered during signup.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Prominent Header Logout Button */}
          <button
            onClick={() => {
              if (onLogoutPatient) onLogoutPatient();
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FEF2F2',
              border: '1.5px solid #FCA5A5',
              color: '#DC2626',
              padding: '7px 14px',
              borderRadius: '18px',
              fontSize: '12px',
              fontWeight: 750,
              cursor: 'pointer',
              transition: 'all 140ms ease'
            }}
            title="Securely exit patient seva portal"
          >
            <LogOut size={13} />
            <span>Logout</span>
          </button>
        </div>
      </header>

        {/* Content Body */}
        <div style={{ padding: '24px 28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

          {/* ---------------------------------------------------------------------
              TAB 1: HOME (MATCHING SCREENSHOT 1 PATIENT VIEW)
              --------------------------------------------------------------------- */}
          {activeTab === 'home' && (
            <>
              {/* Hero Welcome Card */}
              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #F0FDFA 100%)',
                borderRadius: '16px',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #CCFBF1',
                marginBottom: '24px',
                boxShadow: '0 2px 10px rgba(15, 76, 92, 0.04)'
              }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                    Hello {patientName.split(' ')[0]},
                  </h1>
                  <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                    Your health journey, our priority.
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid #CCFBF1',
                  boxShadow: '0 2px 8px rgba(15, 76, 92, 0.06)'
                }}>
                  <span style={{ fontSize: '16px' }}>🌿</span>
                  <span style={{ fontSize: '12px', fontWeight: 750, color: '#0F4C5C' }}>
                    Small steps. Better health.
                  </span>
                </div>
              </div>

              {/* 4 Action Quick Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '18px',
                marginBottom: '26px'
              }}>
                <div onClick={() => setActiveTab('appointments')} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(15, 76, 92, 0.08)', color: '#0F4C5C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <Calendar size={20} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginBottom: '4px' }}>
                    Book Appointment
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Schedule with your doctor
                  </div>
                </div>

                <div onClick={() => setActiveTab('my_health')} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(15, 76, 92, 0.08)', color: '#0F4C5C', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <Heart size={20} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginBottom: '4px' }}>
                    My Health
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    ABHA Card & Vitals
                  </div>
                </div>

                <div onClick={() => setActiveTab('reports')} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <Upload size={20} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginBottom: '4px' }}>
                    Upload Reports
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Share test results
                  </div>
                </div>

                <div onClick={() => setActiveTab('medications')} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.08)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <Pill size={20} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginBottom: '4px' }}>
                    View Prescriptions
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Check your medicines
                  </div>
                </div>
              </div>

              {/* Middle Section: Left (Appointments, Vitals, Reports) | Right (Chat, Goals, Doctor card) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: '22px', marginBottom: '26px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Upcoming Appointments */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                        Upcoming Appointments
                      </h3>
                      <span onClick={() => setActiveTab('appointments')} style={{ fontSize: '12px', fontWeight: 700, color: '#0F4C5C', cursor: 'pointer' }}>View All →</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: '#FAF8F5',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#2563EB',
                          fontSize: '12px',
                          fontWeight: 800,
                          textAlign: 'center',
                          lineHeight: 1.2
                        }}>
                          Tue<br /><span style={{ fontSize: '14px' }}>May 13</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 750, color: '#081C24' }}>{assignedDoctor.doctorName}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>{assignedDoctor.specialty} • 10:15 AM • Online Consultation</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => alert(`Launching video session with ${assignedDoctor.doctorName}...`)}
                        style={{
                          background: '#0F4C5C',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '7px 18px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Join
                      </button>
                    </div>
                  </div>

                  {/* Health Overview (Vitals) */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                          Health Overview
                        </h3>
                        {(() => {
                          const mews = calculateMewsScore({ bpSystolic: bpSystolic || 118, hr: restingPulse || 72, spo2: 98 });
                          return (
                            <span style={{ fontSize: '11px', background: mews.riskBg, color: mews.riskColor, padding: '2px 8px', borderRadius: '10px', fontWeight: 800, border: `1px solid ${mews.riskColor}33` }}>
                              MEWS {mews.score}: {mews.riskLevel}
                            </span>
                          );
                        })()}
                      </div>
                      <span onClick={() => setActiveTab('my_health')} style={{ fontSize: '12px', fontWeight: 700, color: '#0F4C5C', cursor: 'pointer' }}>View Details →</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                      <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <Heart size={16} color="#EF4444" style={{ margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Heart Rate</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>72 bpm</div>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Normal</span>
                      </div>

                      <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <Activity size={16} color="#DC2626" style={{ margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Blood Pressure</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>115/76</div>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Normal</span>
                      </div>

                      <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <Scale size={16} color="#0F4C5C" style={{ margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Weight</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>62 kg</div>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Normal</span>
                      </div>

                      <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <Moon size={16} color="#6366F1" style={{ margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Sleep</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginTop: '2px' }}>7.5 hrs</div>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Good</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Reports */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                        Recent Reports
                      </h3>
                      <span onClick={() => setActiveTab('reports')} style={{ fontSize: '12px', fontWeight: 700, color: '#0F4C5C', cursor: 'pointer' }}>View All →</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { title: 'Chest X-Ray Report', date: formatDemoDate(-3), icon: '🩻' },
                        { title: 'Blood Test Report', date: formatDemoDate(-5), icon: '🩸' },
                        { title: 'Lung Function Test', date: formatDemoDate(-7), icon: '🫁' }
                      ].map((rep, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: '#FAF8F5',
                          border: '1px solid #F1F5F9'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>{rep.icon}</span>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#081C24' }}>{rep.title}</div>
                              <div style={{ fontSize: '11px', color: '#64748B' }}>{rep.date}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => setActiveTab('reports')}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              background: '#ffffff',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Ask AyuSwar AI Chat Widget */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif', marginBottom: '2px' }}>
                      Ask AyuSwar AI
                    </h3>
                    <p style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '14px' }}>
                      Get instant answers about your health.
                    </p>

                    <div style={{ minHeight: '140px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            background: msg.sender === 'user' ? '#E6F7F7' : '#F8FAFC',
                            color: msg.sender === 'user' ? '#006D6D' : '#1E293B',
                            border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            lineHeight: 1.5,
                            maxWidth: '90%'
                          }}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text"
                        value={patientQuestion}
                        onChange={e => setPatientQuestion(e.target.value)}
                        placeholder="Type your question..."
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '12.5px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: '#0F4C5C',
                          border: 'none',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>

                  {/* Health Goals */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                        Health Goals
                      </h3>
                      <span onClick={() => setActiveTab('health_goals')} style={{ fontSize: '12px', fontWeight: 700, color: '#0F4C5C', cursor: 'pointer' }}>View All →</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        border: '4px solid #0F4C5C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        fontWeight: 850,
                        color: '#081C24',
                        flexShrink: 0
                      }}>
                        3/5
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 750, color: '#081C24' }}>Stay Active</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Walk 30 minutes daily</div>
                      </div>
                    </div>
                  </div>

                  {/* Better Health Together Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, #E6F7F7 0%, #D8F3F3 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #B2E5E5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>Better Health Together</h4>
                      <div style={{ fontSize: '11px', color: '#006D6D', margin: '2px 0 10px 0' }}>Ask. Learn. Stay Healthy.</div>
                      <button
                        onClick={() => setActiveTab('my_health')}
                        style={{
                          background: '#0A2540',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 14px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        View Health Records
                      </button>
                    </div>

                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #ffffff',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                    }}>
                      <img src="/assets/dr_ananya_avatar.jpg" alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ---------------------------------------------------------------------
              TAB 2: MY HEALTH (HEALTH ID CARD & VITALS HISTORY)
              --------------------------------------------------------------------- */}
          {activeTab === 'my_health' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                    My Health Profile & Health ID Card
                  </h2>
                  <SampleDataChip />
                </div>
                <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                  Fictional patient health identifier and self-entered historical vitals.
                </p>
              </div>

              {/* Honest Health ID (demo) Card */}
              <div style={{ marginBottom: '24px', maxWidth: '580px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #0A2540 0%, #0F3B3B 55%, #006666 100%)',
                  borderRadius: '20px',
                  padding: '24px',
                  color: '#ffffff',
                  boxShadow: '0 12px 32px rgba(10, 37, 64, 0.22)',
                  border: '1.5px solid rgba(212, 175, 55, 0.3)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px', fontWeight: 850, letterSpacing: '-0.2px' }}>Health ID (demo)</span>
                        <SampleDataChip style={{ background: 'rgba(255,255,255,0.15)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)' }} />
                      </div>
                      <div style={{ fontSize: '11px', color: '#A5F3FC', marginTop: '2px' }}>
                        AyuSwar AI Fictional Health Demonstration Record
                      </div>
                    </div>
                    <div style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      background: 'rgba(255,255,255,0.12)',
                      border: '1px solid rgba(255,255,255,0.25)',
                      borderRadius: '12px',
                      padding: '3px 9px',
                      color: '#E0F2FE'
                    }}>
                      DEMO ONLY
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #D4AF37 0%, #0F4C5C 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      flexShrink: 0
                    }}>
                      {activeDemoPatient?.avatar || '👤'}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '18px', fontWeight: 900, color: '#ffffff' }}>
                        {activeDemoPatient?.name || patientName}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#93C5FD', marginTop: '2px' }}>
                        Age: {activeDemoPatient?.age || 58} y • Gender: {activeDemoPatient?.genderLabel || 'Female'} • Blood: {activeDemoPatient?.bloodGroup || 'B+'}
                      </div>
                      <div style={{ fontSize: '15px', fontWeight: 800, fontFamily: 'monospace', color: '#5EEAD4', marginTop: '4px' }}>
                        {activeDemoPatient?.abhaId || abhaId}
                      </div>
                    </div>
                  </div>

                  {/* ABDM Planned Line */}
                  <div style={{
                    fontSize: '11px',
                    color: '#CBD5E1',
                    background: 'rgba(0,0,0,0.25)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px dashed rgba(255,255,255,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '6px'
                  }}>
                    <span>ABDM / ABHA official government network linking: <strong>PLANNED</strong></span>
                    <span style={{ fontSize: '10px', color: '#94A3B8' }}>Non-production demonstration</span>
                  </div>
                </div>
              </div>

              {/* Vitals Tracker (Self-entered Demo Values) */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>
                    Longitudinal Vitals Tracker
                  </h3>
                  <span style={{ fontSize: '11px', color: '#64748B', background: '#FAF8F5', padding: '4px 10px', borderRadius: '10px', fontWeight: 700 }}>
                    Self-entered demo values - not measured by this app.
                  </span>
                </div>
                <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                  Historical patient recordings from community health worker visits. Computed from logged record entries.
                </p>

                {/* Vitals History Table / Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '18px' }}>
                  {(activeDemoPatient?.vitalsHistory || [
                    { offsetDays: 0, bp: '132/84 mmHg', pulse: '76 bpm', weight: '63 kg', spo2: '98%' },
                    { offsetDays: -14, bp: '138/88 mmHg', pulse: '78 bpm', weight: '63.5 kg', spo2: '97%' }
                  ]).map((v, i) => (
                    <div key={i} style={{ background: '#FAF8F5', padding: '14px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '11px', color: '#0F4C5C', fontWeight: 800, marginBottom: '6px' }}>
                        {formatDemoDate(v.offsetDays || 0)} ({getRelativeDaysLabel(v.offsetDays || 0)})
                      </div>
                      <div style={{ fontSize: '13px', color: '#081C24', marginBottom: '3px' }}>
                        BP: <strong>{v.bp}</strong>
                      </div>
                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '3px' }}>
                        Pulse: <strong>{v.pulse}</strong> • SpO2: <strong>{v.spo2}</strong>
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                        Weight: <strong>{v.weight}</strong>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ fontSize: '11px', color: '#94A3B8', fontStyle: 'italic' }}>
                  Note: Health parameters reflect demo simulation data. Always seek professional physician evaluation for clinical readings.
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 3: APPOINTMENTS (BOOKING & ONLINE CONSULTATION)
              --------------------------------------------------------------------- */}
          {activeTab === 'appointments' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                      Consultation Appointments
                    </h2>
                    <SampleDataChip />
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Schedule follow-ups with Dr. Priya Sharma or district hospital specialists.
                  </p>
                </div>

                <button
                  onClick={() => setIsBookConsultationModalOpen(true)}
                  style={{
                    background: '#0F4C5C',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(15, 76, 92, 0.25)'
                  }}
                >
                  <Plus size={16} />
                  <span>Book New Consultation</span>
                </button>
              </div>

              {bookingSuccessToast && (
                <div style={{
                  background: '#ECFDF5',
                  border: '1.5px solid #10B981',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  color: '#065F46',
                  fontSize: '13px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  marginBottom: '16px'
                }}>
                  <CheckCircle2 size={18} color="#10B981" />
                  <span>Consultation Request Sent! Doctor will review and assign your OPD Room Token instantly.</span>
                </div>
              )}

              {/* Interactive Book Consultation Modal */}
              {isBookConsultationModalOpen && (
                <div className="modal-overlay" style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'rgba(6, 22, 38, 0.8)',
                  backdropFilter: 'blur(8px)',
                  padding: '20px'
                }}>
                  <div className="modal-content" style={{
                    background: '#ffffff',
                    width: '560px',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px rgba(10, 37, 64, 0.35)',
                    border: '1px solid #D8E7EB'
                  }}>
                    {/* Header */}
                    <div style={{
                      background: 'linear-gradient(135deg, #0A2540 0%, #0F4C5C 100%)',
                      padding: '20px 24px',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <Calendar size={22} color="#2DD4BF" />
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
                            Book Clinical Consultation
                          </h3>
                          <div style={{ fontSize: '11.5px', color: '#CCFBF1' }}>
                            Kurnool District Hospital • ABDM Health Facility #1402
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsBookConsultationModalOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '18px' }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Body Form */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Select Doctor */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Select Consulting Specialist
                        </label>
                        <select
                          value={bookingDoctor}
                          onChange={e => {
                            setBookingDoctor(e.target.value);
                            if (e.target.value.includes('Priya')) setBookingSpecialty('Pulmonology & Critical Care');
                            else if (e.target.value.includes('Rajesh')) setBookingSpecialty('Cardiology & Hypertension');
                            else setBookingSpecialty('General Medicine');
                          }}
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '13px', fontWeight: 700, color: '#081C24' }}
                        >
                          <option value="Dr. Priya Sharma, MD">Dr. Priya Sharma, MD (Pulmonology & Critical Care)</option>
                          <option value="Dr. Rajesh Varma, MD, DM">Dr. Rajesh Varma, MD, DM (Cardiology & Heart Health)</option>
                          <option value="Dr. Sneha Reddy, MBBS, DNB">Dr. Sneha Reddy, MBBS (General Medicine & Diabetology)</option>
                          <option value="Dr. Amit Patel, MD">Dr. Amit Patel, MD (Pediatrics & Child Care)</option>
                        </select>
                      </div>

                      {/* Select Date */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Select Consultation Date
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {['Today', 'Tomorrow', 'Wed, May 14', 'Thu, May 15'].map(d => (
                            <button
                              key={d}
                              type="button"
                              onClick={() => setBookingDate(d)}
                              style={{
                                flex: 1,
                                padding: '8px 10px',
                                borderRadius: '8px',
                                border: bookingDate === d ? '2px solid #0F4C5C' : '1px solid #CBD5E1',
                                background: bookingDate === d ? 'rgba(15, 76, 92, 0.1)' : '#ffffff',
                                color: bookingDate === d ? '#0F4C5C' : '#475569',
                                fontSize: '12px',
                                fontWeight: 750,
                                cursor: 'pointer'
                              }}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Select Time Slot */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Select Preferred Time Slot
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                          {['09:30 AM', '10:15 AM', '11:30 AM', '02:30 PM', '03:15 PM', '04:00 PM', '05:00 PM', '06:00 PM'].map(slot => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setBookingTime(slot)}
                              style={{
                                padding: '8px',
                                borderRadius: '8px',
                                border: bookingTime === slot ? '2px solid #0F4C5C' : '1px solid #E2E8F0',
                                background: bookingTime === slot ? '#0A2540' : '#F8FAFC',
                                color: bookingTime === slot ? '#ffffff' : '#475569',
                                fontSize: '11.5px',
                                fontWeight: 750,
                                cursor: 'pointer',
                                textAlign: 'center'
                              }}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Consultation Mode */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Consultation Mode
                        </label>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          {['In-Person OPD (Hospital Visit)', 'Video / Telehealth Call'].map(m => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setBookingMode(m.split(' ')[0])}
                              style={{
                                flex: 1,
                                padding: '9px 12px',
                                borderRadius: '10px',
                                border: bookingMode.includes(m.split(' ')[0]) ? '2px solid #0F4C5C' : '1px solid #E2E8F0',
                                background: bookingMode.includes(m.split(' ')[0]) ? 'rgba(15, 76, 92, 0.08)' : '#ffffff',
                                color: bookingMode.includes(m.split(' ')[0]) ? '#0F4C5C' : '#475569',
                                fontSize: '12px',
                                fontWeight: 750,
                                cursor: 'pointer'
                              }}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Chief Complaint / Symptoms */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Symptoms / Chief Complaint (తెలుగు / हिन्दी / English)
                        </label>
                        <input
                          type="text"
                          value={bookingReason}
                          onChange={e => setBookingReason(e.target.value)}
                          placeholder="e.g. ఛాతీలో దడ మరియు దగ్గు (Chest discomfort & cough)"
                          style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12.5px', color: '#081C24', boxSizing: 'border-box' }}
                        />
                      </div>

                      {/* Submit Booking Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (onBookAppointment) {
                            onBookAppointment({
                              patientName: patientName,
                              vernacular: selectedLanguage === 'Telugu' ? 'అనన్య రావు' : 'अनन्या राव',
                              phone: emergencyPhone || '+91 98480 22334',
                              age: patientProfile?.age || 28,
                              gender: patientProfile?.gender || 'Female',
                              language: selectedLanguage,
                              abhaId: abhaId,
                              doctorName: bookingDoctor,
                              specialty: bookingSpecialty,
                              date: bookingDate,
                              time: bookingTime,
                              mode: bookingMode,
                              reason: bookingReason
                            });
                          }
                          setIsBookConsultationModalOpen(false);
                          setBookingSuccessToast(true);
                          setTimeout(() => setBookingSuccessToast(false), 5000);
                        }}
                        style={{
                          background: 'linear-gradient(135deg, #0F4C5C 0%, #065F46 100%)',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '13px',
                          fontSize: '14px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(15, 76, 92, 0.3)',
                          marginTop: '6px'
                        }}
                      >
                        <CheckCircle2 size={18} />
                        <span>Confirm & Send Booking Request to Doctor</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Upcoming and Past Appointments from Shared Demo Dataset */}
              {(() => {
                const patientAppts = DEMO_APPOINTMENTS.filter(a => a.patientId === activeDemoPatient.id);
                const allAppts = patientAppts.length > 0 ? patientAppts : DEMO_APPOINTMENTS;
                
                const upcomingAppts = allAppts
                  .filter(a => a.status === 'Upcoming' || a.offsetDays >= 0)
                  .sort((a, b) => a.offsetDays - b.offsetDays);
                
                const pastAppts = allAppts
                  .filter(a => a.status === 'Completed' || a.offsetDays < 0)
                  .sort((a, b) => b.offsetDays - a.offsetDays);

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Upcoming Appointments Card */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>
                            Upcoming Consultations
                          </h3>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            Runtime-relative scheduled visits with your care team
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(15, 76, 92, 0.1)', color: '#0F4C5C', padding: '3px 10px', borderRadius: '12px' }}>
                          {upcomingAppts.length} Scheduled
                        </span>
                      </div>

                      {upcomingAppts.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', background: '#FAF8F5', borderRadius: '12px', border: '1px dashed #CBD5E1' }}>
                          <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 10px 0' }}>No upcoming appointments scheduled.</p>
                          <button
                            onClick={() => setIsBookConsultationModalOpen(true)}
                            style={{ background: '#0F4C5C', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '12px', fontWeight: 750, cursor: 'pointer' }}
                          >
                            + Request Follow-up
                          </button>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                          {upcomingAppts.map((appt) => {
                            const isToday = appt.offsetDays === 0;
                            const isTeleconsult = appt.isTeleconsult || appt.type === 'Teleconsult';

                            return (
                              <div
                                key={appt.id}
                                style={{
                                  padding: '16px 20px',
                                  borderRadius: '14px',
                                  background: isToday ? '#FFFBEB' : '#F8FAFC',
                                  border: isToday ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  flexWrap: 'wrap',
                                  gap: '14px'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '220px', flex: 1 }}>
                                  <div style={{
                                    background: isToday ? '#FEF3C7' : 'rgba(15, 76, 92, 0.1)',
                                    color: isToday ? '#D97706' : '#0F4C5C',
                                    padding: '8px 12px',
                                    borderRadius: '10px',
                                    textAlign: 'center',
                                    fontWeight: 800,
                                    fontSize: '12px',
                                    flexShrink: 0
                                  }}>
                                    {formatDemoDate(appt.offsetDays)}<br />
                                    <span style={{ fontSize: '11px', fontWeight: 650 }}>{appt.time}</span>
                                    <div style={{ fontSize: '10px', marginTop: '2px', opacity: 0.85 }}>({getRelativeDaysLabel(appt.offsetDays)})</div>
                                  </div>

                                  <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>{appt.doctorName}</span>
                                      {isTeleconsult ? (
                                        <span style={{ fontSize: '10px', background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '1px 6px', borderRadius: '6px', fontWeight: 750 }}>
                                          📹 Teleconsult
                                        </span>
                                      ) : (
                                        <span style={{ fontSize: '10px', background: '#F0FDF4', color: '#166534', border: '1px solid #BBF7D0', padding: '1px 6px', borderRadius: '6px', fontWeight: 750 }}>
                                          🏥 In-Person OPD
                                        </span>
                                      )}
                                      <span style={{ fontSize: '10px', background: '#FAF8F5', color: '#475569', padding: '1px 6px', borderRadius: '6px', fontFamily: 'monospace' }}>
                                        {appt.id}
                                      </span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                                      {appt.specialty || 'General Medicine'} • {appt.facility || 'District Hospital OPD'}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#0F4C5C', marginTop: '2px', fontWeight: 650 }}>
                                      Reason: {appt.reason || 'Routine follow-up'}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  {isTeleconsult ? (
                                    <button
                                      onClick={() => showPlannedNotice('Teleconsultation video room integration is a planned feature.')}
                                      style={{
                                        background: '#0F4C5C',
                                        color: '#ffffff',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '8px 14px',
                                        fontSize: '12px',
                                        fontWeight: 750,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        minHeight: '44px'
                                      }}
                                    >
                                      <span>Join Call</span>
                                      <span style={{ fontSize: '9px', background: 'rgba(255,255,255,0.25)', padding: '1px 5px', borderRadius: '6px', fontWeight: 800 }}>PLANNED</span>
                                    </button>
                                  ) : (
                                    <a
                                      href="https://www.google.com/maps/search/?api=1&query=District+Hospital+OPD+Kurnool"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{
                                        background: '#FAF8F5',
                                        color: '#081C24',
                                        border: '1px solid #CBD5E1',
                                        borderRadius: '8px',
                                        padding: '8px 14px',
                                        fontSize: '12px',
                                        fontWeight: 750,
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        minHeight: '44px',
                                        boxSizing: 'border-box'
                                      }}
                                    >
                                      Get Directions ↗
                                    </a>
                                  )}

                                  <button
                                    onClick={() => showPlannedNotice('Appointment rescheduling is a planned feature.')}
                                    style={{
                                      background: '#ffffff',
                                      color: '#64748B',
                                      border: '1px solid #E2E8F0',
                                      borderRadius: '8px',
                                      padding: '8px 12px',
                                      fontSize: '12px',
                                      fontWeight: 750,
                                      cursor: 'pointer',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px',
                                      minHeight: '44px'
                                    }}
                                  >
                                    <span>Reschedule</span>
                                    <span style={{ fontSize: '9px', background: '#FAF8F5', color: '#64748B', padding: '1px 5px', borderRadius: '6px', fontWeight: 800 }}>PLANNED</span>
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Past Completed Visits Card */}
                    <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>
                            Past Completed Visits & Summaries
                          </h3>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            Historical encounters logged in your demo health record
                          </div>
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 800, background: '#FAF8F5', color: '#475569', padding: '3px 10px', borderRadius: '12px' }}>
                          {pastAppts.length} Completed
                        </span>
                      </div>

                      {pastAppts.length === 0 ? (
                        <div style={{ padding: '20px', textAlign: 'center', background: '#FAF8F5', borderRadius: '12px', color: '#64748B', fontSize: '13px' }}>
                          No past consultation records on file.
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {pastAppts.map((past) => (
                            <div
                              key={past.id}
                              style={{
                                padding: '14px 18px',
                                borderRadius: '12px',
                                background: '#FAF8F5',
                                border: '1px solid #E2E8F0',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '12px'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                  background: '#E2E8F0',
                                  color: '#334155',
                                  padding: '6px 10px',
                                  borderRadius: '8px',
                                  textAlign: 'center',
                                  fontSize: '11px',
                                  fontWeight: 750,
                                  minWidth: '80px'
                                }}>
                                  {formatDemoDate(past.offsetDays)}
                                </div>
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#081C24' }}>{past.doctorName}</span>
                                    <span style={{ fontSize: '10px', background: '#ECFDF5', color: '#065F46', padding: '1px 6px', borderRadius: '6px', fontWeight: 750 }}>
                                      COMPLETED
                                    </span>
                                  </div>
                                  <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                                    {past.type} • Reason: {past.reason || 'Clinical consultation'}
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => setActiveTab('reports')}
                                style={{
                                  background: 'rgba(15, 76, 92, 0.1)',
                                  color: '#0F4C5C',
                                  border: '1px solid rgba(15, 76, 92, 0.25)',
                                  borderRadius: '8px',
                                  padding: '8px 14px',
                                  fontSize: '11.5px',
                                  fontWeight: 750,
                                  cursor: 'pointer',
                                  minHeight: '44px'
                                }}
                              >
                                View Diagnostic Reports →
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>
                );
              })()}
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 4: REPORTS (LABS & SPOKEN AUDIO EXPLANATION + UPLOAD FEATURE)
              --------------------------------------------------------------------- */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                    My Diagnostic & Lab Reports
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Listen to simplified doctor findings in your native dialect or download official PDFs.
                  </p>
                </div>

                {/* Upload New Diagnostic Report Button */}
                <button
                  onClick={() => setIsUploadReportModalOpen(true)}
                  style={{
                    background: '#0F4C5C',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(15, 76, 92, 0.25)',
                    transition: 'all 140ms ease'
                  }}
                >
                  <Upload size={16} />
                  <span>+ Upload New Diagnostic Report</span>
                </button>
              </div>

              {/* Reports List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {reportsList.map((rep, idx) => (
                  <div
                    key={rep.id || idx}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      padding: '20px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '26px' }}>{rep.icon || '📄'}</span>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>{rep.title}</span>
                          {rep.isNew && (
                            <span style={{ fontSize: '10px', background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0', padding: '1px 6px', borderRadius: '6px', fontWeight: 750 }}>
                              ✨ REVIEWED
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Completed on {rep.date} • Reviewed by {rep.doctor || 'Dr. Priya Sharma'}</div>
                        <div style={{ fontSize: '12.5px', color: '#1E293B', marginTop: '4px', maxWidth: '540px' }}>{rep.summary}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => handlePlayVoicePrescription(selectedLanguage === 'Telugu' ? rep.spokenTelugu : rep.spokenHindi)}
                        style={{
                          background: 'rgba(15, 76, 92, 0.1)',
                          border: '1.5px solid #0F4C5C',
                          color: '#0F4C5C',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 750,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Volume2 size={15} />
                        <span>🔊 Hear in {selectedLanguage}</span>
                      </button>

                      <button
                        onClick={() => alert(`Downloading official PDF copy of ${rep.title}...`)}
                        style={{
                          background: '#0A2540',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Download size={14} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload Report Modal */}
              {isUploadReportModalOpen && (
                <div className="modal-overlay" style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}>
                  <div className="modal-content" style={{
                    background: '#ffffff',
                    width: '540px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px rgba(10, 37, 64, 0.35)',
                    border: '1px solid #D8E7EB',
                    maxHeight: '90vh',
                    overflowY: 'auto'
                  }}>
                    {/* Modal Header */}
                    <div style={{
                      background: 'linear-gradient(135deg, #0A2540 0%, #0F4C5C 100%)',
                      padding: '20px 24px',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UploadCloud size={22} color="#D4AF37" />
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                            Upload Diagnostic / Lab Report
                          </h3>
                          <div style={{ fontSize: '11px', color: '#E0F2FE', opacity: 0.9 }}>
                            Automated AI OCR & Vernacular Voiceover (Browser speech)
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsUploadReportModalOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '18px' }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Modal Form */}
                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Dropzone */}
                      <div style={{
                        border: '2px dashed #0F4C5C',
                        borderRadius: '14px',
                        padding: '24px 16px',
                        textAlign: 'center',
                        background: 'rgba(15, 76, 92, 0.04)',
                        cursor: 'pointer'
                      }}>
                        <UploadCloud size={32} color="#0F4C5C" style={{ margin: '0 auto 8px auto' }} />
                        <div style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>
                          Drag & drop diagnostic PDF, DICOM, or scan image
                        </div>
                        <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                          Supports PDF, JPEG, PNG, DICOM up to 25 MB
                        </div>
                      </div>

                      {/* Title & Date */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                            Report Name / Test Type
                          </label>
                          <input
                            type="text"
                            value={newReportTitle}
                            onChange={e => setNewReportTitle(e.target.value)}
                            placeholder="e.g. HbA1c Blood Test"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12.5px' }}
                          />
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                            Test Date
                          </label>
                          <input
                            type="text"
                            value={newReportDate}
                            onChange={e => setNewReportDate(e.target.value)}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12.5px' }}
                          />
                        </div>
                      </div>

                      {/* Doctor / Verifier */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Ordering Physician / Lab Name
                        </label>
                        <input
                          type="text"
                          value={newReportDoctor}
                          onChange={e => setNewReportDoctor(e.target.value)}
                          placeholder="Dr. Priya Sharma (Pulmonologist)"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12.5px' }}
                        />
                      </div>

                      {/* AI OCR Extraction Simulator Button */}
                      <div style={{
                        background: '#F0FDFA',
                        border: '1px solid #CCFBF1',
                        borderRadius: '12px',
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 750, color: '#065F46' }}>
                            AyuSwar Indic Bio-Scribe AI
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>
                            Extracts clinical biomarkers & translates to Telugu / Hindi speech
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setIsAiScanningReport(true);
                            setTimeout(() => {
                              setIsAiScanningReport(false);
                              setNewReportSummary('HbA1c: 6.4% (Good Control). Fasting Blood Sugar: 104 mg/dL. Renal function intact.');
                              setNewReportTelugu('మీ రక్తంలో చక్కెర స్థాయిలు అదుపులో ఉన్నాయి. హెచ్‌బీఏ1సి 6.4 శాతం ఉంది.');
                              setNewReportHindi('आपके खून में शुगर का स्तर नियंत्रण में है। दवाएं ठीक से काम कर रही हैं।');
                            }, 700);
                          }}
                          style={{
                            background: '#0F4C5C',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '11.5px',
                            fontWeight: 750,
                            cursor: 'pointer'
                          }}
                        >
                          {isAiScanningReport ? 'Scanning...' : 'Auto-Extract (OCR)'}
                        </button>
                      </div>

                      {/* Summary */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Clinical Findings & Summary
                        </label>
                        <textarea
                          rows={2}
                          value={newReportSummary}
                          onChange={e => setNewReportSummary(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12px' }}
                        />
                      </div>

                      {/* Spoken Dialect Audio Scripts */}
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Telugu Audio Script (తెలుగు వాయిస్ సారాంశం)
                        </label>
                        <input
                          type="text"
                          value={newReportTelugu}
                          onChange={e => setNewReportTelugu(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12px' }}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="button"
                        onClick={() => {
                          const newRep = {
                            id: Date.now(),
                            title: newReportTitle,
                            date: newReportDate,
                            icon: '🧪',
                            doctor: newReportDoctor,
                            summary: newReportSummary,
                            spokenTelugu: newReportTelugu,
                            spokenHindi: newReportHindi,
                            isNew: true
                          };
                          setReportsList([newRep, ...reportsList]);
                          setIsUploadReportModalOpen(false);
                          alert('Report uploaded and verified! You can now listen to the spoken explanation in your native language.');
                        }}
                        style={{
                          background: '#0F4C5C',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '13.5px',
                          fontWeight: 750,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px'
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Verify & Add to My Reports</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 5: MEDICATIONS & CHRONOTHERAPY SMART PILLBOX
              --------------------------------------------------------------------- */}
          {activeTab === 'medications' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                    Personalized Chronotherapy Medication Schedule
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Pill schedule tailored to meal context (Early Morning, Morning, Afternoon, Evening, Night) with spoken voiceover (Browser speech).
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  {/* Auto-synced prescription badge */}
                  <div style={{
                    background: '#ECFDF5',
                    color: '#065F46',
                    border: '1px solid #A7F3D0',
                    padding: '6px 12px',
                    borderRadius: '10px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>🟢</span>
                    <span>Auto-synced with {assignedDoctor.doctorName}'s e-Prescription</span>
                  </div>

                  {/* Add Medication Manually Button */}
                  <button
                    onClick={() => setIsAddMedicationModalOpen(true)}
                    style={{
                      background: '#D97706',
                      color: '#ffffff',
                      border: 'none',
                      padding: '7px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(217, 119, 6, 0.25)'
                    }}
                  >
                    <Plus size={15} />
                    <span>Add Medication Manually</span>
                  </button>

                  <button
                    onClick={() => setShowPrintRxModal(true)}
                    style={{
                      background: '#ffffff',
                      color: '#0F4C5C',
                      border: '1.5px solid #0F4C5C',
                      borderRadius: '10px',
                      padding: '7px 14px',
                      fontSize: '12px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={15} color="#0F4C5C" />
                    <span>View Official Signed Rx Slip</span>
                  </button>

                  <button
                    onClick={() => setShowWhatsAppRxModal(true)}
                    style={{
                      background: '#25D366',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 2px 8px rgba(37, 211, 102, 0.35)'
                    }}
                  >
                    <Send size={14} />
                    <span>Receive on WhatsApp (ఆడియో నోట్)</span>
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Languages size={16} color="#0F4C5C" />
                    <select
                      value={selectedLanguage}
                      onChange={e => setSelectedLanguage(e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '12px',
                        fontWeight: 750,
                        color: '#081C24',
                        background: '#ffffff'
                      }}
                    >
                      <option value="Telugu">తెలుగు (Telugu)</option>
                      <option value="Hindi">हिन्दी (Hindi)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Add Medication Manually Modal */}
              {isAddMedicationModalOpen && (
                <div className="modal-overlay" style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 1300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}>
                  <div className="modal-content" style={{
                    background: '#ffffff',
                    width: '500px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 25px 60px rgba(10, 37, 64, 0.35)',
                    border: '1px solid #D8E7EB'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #0A2540 0%, #D97706 100%)',
                      padding: '20px 24px',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Pill size={22} color="#FDE047" />
                        <div>
                          <h3 style={{ fontSize: '17px', fontWeight: 800, margin: 0 }}>
                            Add Medication Manually
                          </h3>
                          <div style={{ fontSize: '11px', color: '#FEF3C7', opacity: 0.9 }}>
                            Set meal timing, dosage & auto-generate voice instructions
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setIsAddMedicationModalOpen(false)}
                        style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '18px' }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Medicine Name & Strength
                        </label>
                        <input
                          type="text"
                          value={manualMedName}
                          onChange={e => setManualMedName(e.target.value)}
                          placeholder="e.g. Metformin 500mg or Pantoprazole"
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12.5px' }}
                        />
                      </div>

                      {/* Chronotherapy Slot */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                            Timing Slot
                          </label>
                          <select
                            value={manualSlot}
                            onChange={e => {
                              setManualSlot(e.target.value);
                              if (e.target.value === 'early_morning') {
                                setManualMealContext('Empty Stomach (పరగడుపున / खाली पेट)');
                              } else if (e.target.value === 'morning') {
                                setManualMealContext('After Breakfast (టిఫిన్ తర్వాత / नाश्ते के बाद)');
                              } else if (e.target.value === 'afternoon') {
                                setManualMealContext('After Lunch (భోజనం తర్వాత / दोपहर खाने के बाद)');
                              } else if (e.target.value === 'evening') {
                                setManualMealContext('Evening Tea/Snack (సాయంత్రం / शाम को)');
                              } else if (e.target.value === 'night') {
                                setManualMealContext('After Dinner (రాత్రి భోజనం తర్వాత / रात खाने के बाद)');
                              }
                            }}
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12px' }}
                          >
                            <option value="early_morning">🌅 Early Morning (Empty Stomach)</option>
                            <option value="morning">☀️ Morning (After Breakfast)</option>
                            <option value="afternoon">🍛 Afternoon (After Lunch)</option>
                            <option value="evening">☕ Evening (Tea Time)</option>
                            <option value="night">🌙 Night (After Dinner)</option>
                          </select>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                            Indication / Purpose
                          </label>
                          <input
                            type="text"
                            value={manualPurpose}
                            onChange={e => setManualPurpose(e.target.value)}
                            placeholder="e.g. Sugar control"
                            style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12.5px' }}
                          />
                        </div>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                          Telugu Voice Instruction (తెలుగు సూచన)
                        </label>
                        <input
                          type="text"
                          value={manualTeluguAudio}
                          onChange={e => setManualTeluguAudio(e.target.value)}
                          style={{ width: '100%', padding: '9px 12px', borderRadius: '10px', border: '1.5px solid #CBD5E1', fontSize: '12px' }}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const newSlotItem = {
                            id: `manual_${Date.now()}`,
                            label: manualSlot.replace('_', ' ').toUpperCase(),
                            time: manualSlot === 'early_morning' ? '06:30 AM' : (manualSlot === 'morning' ? '08:30 AM' : (manualSlot === 'afternoon' ? '01:30 PM' : '08:30 PM')),
                            mealContext: manualMealContext,
                            medicine: manualMedName,
                            purpose: manualPurpose,
                            color: '#0F4C5C',
                            bg: 'rgba(15, 76, 92, 0.1)',
                            teluguAudioText: manualTeluguAudio,
                            hindiAudioText: manualHindiAudio
                          };
                          setChronotherapySchedule([...chronotherapySchedule, newSlotItem]);
                          setIsAddMedicationModalOpen(false);
                          alert(`${manualMedName} added to your chronotherapy schedule!`);
                        }}
                        style={{
                          background: '#D97706',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '12px',
                          padding: '12px',
                          fontSize: '13.5px',
                          fontWeight: 750,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          marginTop: '6px'
                        }}
                      >
                        <CheckCircle2 size={16} />
                        <span>Add to Smart Chronotherapy Pillbox</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* DDI Safety Sentinel Status Banner */}
              {(() => {
                const ddiAlerts = checkDrugInteractions(chronotherapySchedule.map(s => s.medicine));
                return (
                  <div style={{
                    background: ddiAlerts.length > 0 ? '#FEF2F2' : '#F0FDF4',
                    border: ddiAlerts.length > 0 ? '1.5px solid #FCA5A5' : '1.5px solid #BBF7D0',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <ShieldCheck size={18} color={ddiAlerts.length > 0 ? '#DC2626' : '#15803D'} />
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: ddiAlerts.length > 0 ? '#991B1B' : '#166534' }}>
                          {ddiAlerts.length > 0 ? `Clinical Sentinel Alert: ${ddiAlerts.length} Potential Drug-Drug Interaction Detected` : 'Clinical Safety Sentinel: All Active Prescriptions Safe'}
                        </div>
                        <div style={{ fontSize: '11px', color: ddiAlerts.length > 0 ? '#B91C1C' : '#15803D' }}>
                          {ddiAlerts.length > 0 ? (selectedLanguage === 'Telugu' ? ddiAlerts[0].alertTelugu : ddiAlerts[0].alertHindi) : 'Cross-checked against WHO & ICMR Standard Treatment Guidelines (STG) 2025. Zero contraindications.'}
                        </div>
                      </div>
                    </div>
                    <span style={{ fontSize: '10.5px', background: ddiAlerts.length > 0 ? '#FEE2E2' : '#DCFCE7', color: ddiAlerts.length > 0 ? '#991B1B' : '#15803D', padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
                      {ddiAlerts.length > 0 ? 'Review Needed' : 'STG 2025 Compliant'}
                    </span>
                  </div>
                );
              })()}

              {/* Slot Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {chronotherapySchedule.map(slot => {
                  const isChecked = dailyPillChecked[slot.id];
                  const janInfo = getJanAushadhiGenericInfo(slot.medicine);
                  return (
                    <div
                      key={slot.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        border: isChecked ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                          onClick={() => setDailyPillChecked(prev => ({ ...prev, [slot.id]: !prev[slot.id] }))}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: isChecked ? 'none' : '2px solid #CBD5E1',
                            background: isChecked ? '#10B981' : '#ffffff',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          {isChecked && <Check size={16} />}
                        </button>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: slot.color }}>
                              {slot.label} ({slot.time})
                            </span>
                            <span style={{ fontSize: '11px', background: slot.bg, color: slot.color, padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                              {slot.mealContext}
                            </span>
                          </div>

                          <div style={{ fontSize: '16px', fontWeight: 850, color: '#081C24', marginTop: '2px' }}>
                            {slot.medicine}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            Purpose: {slot.purpose}
                          </div>

                          {/* Jan Aushadhi Generic & Savings Data */}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontWeight: 750, border: '1px solid #BBF7D0' }}>
                              Jan Aushadhi Generic: {janInfo.genericName}
                            </span>
                            <span style={{ fontSize: '11px', color: '#475569' }}>
                              Branded MRP: <s style={{ color: '#94A3B8' }}>₹{janInfo.brandedMrp}</s> → Jan Aushadhi: <strong style={{ color: '#0D9488' }}>₹{janInfo.janAushadhiPrice}</strong>
                            </span>
                            <span style={{ fontSize: '10.5px', background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                              Save {janInfo.savingsPercent}%
                            </span>
                            <span style={{ fontSize: '10px', background: '#FAF8F5', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: 650 }}>
                              {janInfo.nlemCeiling}
                            </span>
                          </div>

                          <div style={{ fontSize: '12px', color: '#006D6D', marginTop: '6px', fontStyle: 'italic' }}>
                            "{selectedLanguage === 'Telugu' ? slot.teluguAudioText : slot.hindiAudioText}"
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePlayVoicePrescription(selectedLanguage === 'Telugu' ? slot.teluguAudioText : slot.hindiAudioText)}
                        style={{
                          background: slot.color,
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '24px',
                          padding: '10px 20px',
                          fontSize: '12px',
                          fontWeight: 750,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Volume2 size={15} />
                        <span>Play Spoken Dosage</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 6: AI ASSISTANT (PATIENT HEALTH ADVICE)
              --------------------------------------------------------------------- */}
          {activeTab === 'ai_assistant' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                  AyuSwar Personal Health Assistant
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Ask questions in your mother tongue about symptoms, diet, and medicines.
                </p>
              </div>

              {/* Red Emergency Alert Box */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                padding: '14px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={20} color="#DC2626" />
                  <span style={{ fontSize: '12.5px', color: '#991B1B', fontWeight: 650 }}>
                    Emergency Medical Helpline (108 Ambulance / 104 Health Advice) available 24x7.
                  </span>
                </div>
                <button
                  onClick={() => alert('Dialing Emergency 108...')}
                  style={{
                    background: '#DC2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Call 108
                </button>
              </div>

              {/* Full Chat Screen */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                minHeight: '440px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.sender === 'user' ? '#0F4C5C' : '#F8FAFC',
                        color: msg.sender === 'user' ? '#ffffff' : '#1E293B',
                        border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                        padding: '12px 18px',
                        borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        fontSize: '13.5px',
                        lineHeight: 1.5,
                        maxWidth: '85%'
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <input 
                    type="text"
                    value={patientQuestion}
                    onChange={e => setPatientQuestion(e.target.value)}
                    placeholder="Type your health question (e.g. Can I take paracetamol after dinner?)..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={toggleOpdSpeechRecognition}
                    style={{
                      background: isOpdMicListening ? '#EF4444' : '#F1F5F9',
                      color: isOpdMicListening ? '#FFFFFF' : '#0F4C5C',
                      border: isOpdMicListening ? 'none' : '1.5px solid #0F4C5C',
                      borderRadius: '12px',
                      padding: '0 16px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isOpdMicListening ? '0 0 12px rgba(239, 68, 68, 0.5)' : 'none'
                    }}
                    title={isOpdMicListening ? "Listening... click to stop" : "Speak your question aloud"}
                  >
                    {isOpdMicListening ? <Mic size={16} className="animate-pulse" /> : <Mic size={16} />}
                    <span>{isOpdMicListening ? 'Listening...' : 'Voice'}</span>
                  </button>

                  <button
                    type="submit"
                    style={{
                      background: '#0F4C5C',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0 20px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Send size={15} />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 7: HEALTH GOALS (WELLNESS TRACKING)
              --------------------------------------------------------------------- */}
          {activeTab === 'health_goals' && (
            <PatientHealthGoalsTab
              assignedDoctor={assignedDoctor}
              activeDemoPatient={activeDemoPatient}
              patientProfile={patientProfile}
            />
          )}

          {/* ---------------------------------------------------------------------
              TAB 8: SETTINGS (INDIC DIALECT, OMNICHANNEL DISPATCH, ABHA CONSENT & PRIVACY)
              --------------------------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div>
              {/* Header Banner */}
              <div style={{ 
                background: 'linear-gradient(135deg, #0A2540 0%, #1E3A8A 50%, #0F4C5C 100%)', 
                borderRadius: '20px', 
                padding: '24px 28px', 
                color: '#ffffff',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 10px 25px rgba(10, 37, 64, 0.12)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ 
                      background: 'rgba(15, 76, 92, 0.3)', 
                      padding: '4px 10px', 
                      borderRadius: '20px', 
                      fontSize: '11px', 
                      fontWeight: 800, 
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(255,255,255,0.2)' 
                    }}>
                      National Health Authority ABDM Governance
                    </span>
                    <span style={{ fontSize: '12px', color: '#93C5FD' }}>• ABHA: <code>{abhaId}</code></span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: '0 0 6px 0' }}>
                    Citizen Preferences, Audio Engine & Security Suite
                  </h2>
                  <p style={{ fontSize: '13px', color: '#E2E8F0', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
                    Configure vernacular dialect nuance, multi-modal WhatsApp & IVR dispatches, emergency 108 caregiver escalation, and granular family data sharing permissions.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSettingsSavedToast(true);
                    setTimeout(() => setSettingsSavedToast(false), 4000);
                  }}
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(15, 76, 92, 0.4)' }}
                >
                  <ShieldCheck size={16} />
                  <span>Save All Settings</span>
                </button>
              </div>

              {/* Toast Feedback */}
              {settingsSavedToast && (
                <div style={{ 
                  background: '#ECFDF5', 
                  border: '1.5px solid #10B981', 
                  borderRadius: '12px', 
                  padding: '14px 20px', 
                  marginBottom: '22px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  color: '#065F46',
                  fontSize: '13.5px',
                  fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)'
                }}>
                  <CheckCircle2 size={20} color="#10B981" />
                  <span>All preferences, audio engines, and ABHA consent policies successfully updated and synced with Kurnool Health Registry!</span>
                </div>
              )}

              {/* Settings Sections Grid (2 Columns) */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '22px' }}>
                
                {/* 1. AyuSwar Indic Voice & Dialect Engine */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(15, 76, 92, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F4C5C' }}>
                      <Languages size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>Indic Voice & Dialect Synthesis</h3>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Configure pronunciation, regional idioms, and tempo</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 750, color: '#081C24', marginBottom: '6px' }}>
                      Primary Vernacular Dialect
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={e => setSelectedLanguage(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #CBD5E1',
                        fontSize: '13px',
                        fontWeight: 650,
                        color: '#081C24'
                      }}
                    >
                      <option value="Telugu">తెలుగు (Telugu - Rayalaseema & Coastal Dialect)</option>
                      <option value="Hindi">हिन्दी (Hindi - Awadhi / Standard Khari Boli)</option>
                      <option value="Tamil">தமிழ் (Tamil - Madurai / Chennai Colloquial)</option>
                      <option value="Kannada">ಕನ್ನಡ (Kannada - Old Mysuru & Hubballi)</option>
                      <option value="Marathi">मराठी (Marathi - Deshi / Vidarbha)</option>
                      <option value="Bengali">বাংলা (Bengali - Rarh & Sundarbans)</option>
                      <option value="Odia">ଓଡ଼ିଆ (Odia - Coastal Cuttack)</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#081C24', marginBottom: '6px' }}>
                        Voice Persona & Tone (Browser Speech)
                      </label>
                      <select
                        value={voicePersona}
                        onChange={e => setVoicePersona(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 650 }}
                      >
                        <option value="female_compassionate">Dr. Priya (Empathetic Female)</option>
                        <option value="male_calm">Dr. Rajesh (Senior Male Physician)</option>
                        <option value="elder_warm">ASHA Sister (Maternal Guide)</option>
                        <option value="maternal_sister">Community Health Worker (Warm)</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#081C24', marginBottom: '6px' }}>
                        Speech Tempo / Playback Speed
                      </label>
                      <select
                        value={speechTempo}
                        onChange={e => setSpeechTempo(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 650 }}
                      >
                        <option value="0.75x">0.75x (Slow & Clear — Best for elderly)</option>
                        <option value="1.0x">1.0x (Standard Conversational)</option>
                        <option value="1.25x">1.25x (Brisk Clinical)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Auto-Play Spoken Narrations</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Instantly read lab reports and pills when opened</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={autoPlayAudio} 
                      onChange={e => setAutoPlayAudio(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#0F4C5C', cursor: 'pointer' }}
                    />
                  </div>
                </div>

                {/* 2. Omnichannel Alerts & Tele-Dispatch */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(37, 99, 235, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                      <Smartphone size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>Omnichannel Tele-Dispatch</h3>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>WhatsApp Voice Notes, IVR Phone Calls & Regional SMS</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>WhatsApp Audio Prescriptions</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Send .opus audio note + Telugu PDF after doctor visit</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={enableWhatsAppData} 
                        onChange={e => setEnableWhatsAppData(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Automated IVR Phone Call Reminders</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Phone rings for elderly patients who cannot read screens</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={enableIvrPhoneCalls} 
                        onChange={e => setEnableIvrPhoneCalls(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Unicode Regional SMS Alerts</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>2G network fallback in native Telugu script (మీ మందుల సమయం)</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={enableSmsRegional} 
                        onChange={e => setEnableSmsRegional(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#D97706', cursor: 'pointer' }}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 650 }}>Scheduled Dispatch Slot:</span>
                    <select
                      value={preferredReminderTime}
                      onChange={e => setPreferredReminderTime(e.target.value)}
                      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700 }}
                    >
                      <option value="06:30 AM">06:30 AM (Early Morning Empty Stomach)</option>
                      <option value="08:30 AM">08:30 AM (Post-Breakfast)</option>
                      <option value="01:00 PM">01:00 PM (Post-Lunch)</option>
                      <option value="08:30 PM">08:30 PM (Post-Dinner & Bedtime)</option>
                    </select>
                  </div>
                </div>

                {/* 3. Emergency Caregiver Escalation & 108 SOS */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#DC2626' }}>
                      <PhoneCall size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>Emergency Caregiver Escalation</h3>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Designated contact & automated 108 ambulance dispatch</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#081C24', marginBottom: '4px' }}>
                      Primary Caregiver / Attendant Name
                    </label>
                    <input
                      type="text"
                      value={emergencyContactName}
                      onChange={e => setEmergencyContactName(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 650 }}
                    />
                  </div>

                  <div style={{ marginBottom: '14px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#081C24', marginBottom: '4px' }}>
                      Emergency Mobile Number
                    </label>
                    <input
                      type="text"
                      value={emergencyPhone}
                      onChange={e => setEmergencyPhone(e.target.value)}
                      style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '13px', fontWeight: 650 }}
                    />
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FEF2F2', border: '1px solid #FECACA', cursor: 'pointer', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#991B1B' }}>Auto-Transmit GPS & ABHA Summary to 108</div>
                      <div style={{ fontSize: '11px', color: '#B91C1C' }}>Transmits live vitals & allergy sentinel if SOS is triggered</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={emergencyAutoTransmit108} 
                      onChange={e => setEmergencyAutoTransmit108(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#DC2626', cursor: 'pointer' }}
                    />
                  </label>

                  <button
                    onClick={() => alert(`Simulated Alert Sent to Caregiver ${emergencyContactName} (${emergencyPhone}): "AyuSwar Alert: Emergency test ping successful. Patient is stable."`)}
                    style={{ width: '100%', background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '8px', fontSize: '12px', fontWeight: 750, color: '#081C24', cursor: 'pointer' }}
                  >
                    Send Test Ping to Caregiver Mobile
                  </button>
                </div>

                {/* 4. ABDM & ABHA Health Locker Consent Governance */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>ABDM Consent Governance</h3>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>National Health Authority digital health locker permissions</div>
                    </div>
                  </div>

                  <div style={{ background: '#FAF8F5', padding: '12px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', color: '#64748B' }}>ABHA Number Status:</span>
                      <span style={{ fontSize: '11px', background: '#FAF8F5', color: '#475569', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>ABHA integration: PLANNED</span>
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', fontFamily: 'monospace' }}>
                      {abhaId}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#081C24' }}>Consent Duration Expiry:</span>
                    <select
                      value={consentDurationDays}
                      onChange={e => setConsentDurationDays(Number(e.target.value))}
                      style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 650 }}
                    >
                      <option value={7}>7 Days (Temporary)</option>
                      <option value={30}>30 Days (Recommended)</option>
                      <option value={90}>90 Days (Quarterly Chronic Care)</option>
                      <option value={365}>1 Year (Full Coverage)</option>
                    </select>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer', marginBottom: '14px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 750, color: '#081C24' }}>Auto-Grant Specialist Access</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>Allow {assignedDoctor.doctorName} to access prior discharge records</div>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={autoShareEmergencyRecords} 
                      onChange={e => setAutoShareEmergencyRecords(e.target.checked)}
                      style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: 'pointer' }}
                    />
                  </label>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => alert(`Downloading Official Government ABHA Card for ${patientName} (ABHA: ${abhaId}) with bilingual QR code...`)}
                      style={{ flex: 1, background: '#0F4C5C', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '8px', fontSize: '11.5px', fontWeight: 750, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <Download size={13} />
                      <span>ABHA Card PDF</span>
                    </button>
                    <button
                      onClick={() => alert(`Exporting FHIR R4 JSON Bundle (Encounters, Observations, MedicationRequests) for ${patientName}...`)}
                      style={{ flex: 1, background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '8px', fontSize: '11.5px', fontWeight: 700, color: '#081C24', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      <FileCheck size={13} />
                      <span>FHIR R4 JSON</span>
                    </button>
                  </div>
                </div>

                {/* 5. Family Locker & Caregiver Privacy Controls */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>Family Locker Sharing Permissions</h3>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Manage view permissions across registered family members</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#475569', marginBottom: '12px' }}>
                    Linked Accounts: <strong>{familyListToDisplay.map(f => f.patientName).join(', ')}</strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Shared Medication Dashboard</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Caregiver can view which pills have been taken today</div>
                      </div>
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        style={{ width: '18px', height: '18px', accentColor: '#D97706', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Sensitive Diagnostic Masking</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Mask private psychiatric, fertility or oncology records</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={fhirDataMasking}
                        onChange={e => setFhirDataMasking(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#D97706', cursor: 'pointer' }}
                      />
                    </label>
                  </div>

                  <div style={{ fontSize: '11.5px', background: '#FEF3C7', padding: '10px', borderRadius: '8px', color: '#92400E' }}>
                    🔒 <strong>Privacy Guard:</strong> Individual consent artifacts adhere to India Digital Personal Data Protection (DPDP) Act 2023.
                  </div>
                </div>

                {/* 6. Rural PHC Offline Mode & Low Data Compression */}
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284C7' }}>
                      <WifiOff size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>Offline Mode & Rural Network Optimization</h3>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Zero-internet spoken audio playback for rural PHC visits</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Offline Spoken Rx Caching</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Keep regional voice prescriptions cached locally on device</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={offlineVoiceCaching}
                        onChange={e => setOfflineVoiceCaching(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#0284C7', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Low-Bandwidth Audio Compression</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Transmits audio at 12 kbps Opus to preserve 2G cellular data</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={lowDataAudioCodec}
                        onChange={e => setLowDataAudioCodec(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#0284C7', cursor: 'pointer' }}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#F0F9FF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #BAE6FD' }}>
                    <div style={{ fontSize: '12px', color: '#0369A1', fontWeight: 700 }}>
                      Device Cache: <strong>{cacheSizeMb}</strong>
                    </div>
                    <button
                      onClick={() => {
                        setCacheSizeMb('0.0 MB');
                        alert('Local offline audio cache cleared successfully.');
                      }}
                      style={{ background: '#0284C7', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', fontWeight: 750, cursor: 'pointer' }}
                    >
                      Clear Cache
                    </button>
                  </div>
                </div>

              </div>

              {/* Bottom Action Footer */}
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => alert('Preferences restored to clinical baseline for Rayalaseema region.')}
                  style={{ background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '12px 20px', fontSize: '13px', fontWeight: 700, color: '#475569', cursor: 'pointer' }}
                >
                  Reset to Clinical Defaults
                </button>
                <button
                  onClick={() => {
                    setSettingsSavedToast(true);
                    setTimeout(() => setSettingsSavedToast(false), 4000);
                  }}
                  className="btn-primary"
                  style={{ padding: '12px 28px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Check size={16} />
                  <span>Save All Preferences to ABHA Locker</span>
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
      {/* Official Color Printable Prescription Modal for Patient */}
      {showPrintRxModal && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10, 37, 64, 0.75)',
          backdropFilter: 'blur(6px)',
          padding: '20px'
        }}>
          <div className="printable-rx-container" style={{
            background: '#ffffff',
            width: '680px',
            maxHeight: '94vh',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #D8E7EB'
          }}>
            {/* Header / Actions Bar */}
            <div style={{
              background: '#0A2540',
              color: '#ffffff',
              padding: '14px 22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FileCheck size={20} color="#D4AF37" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Official Signed Prescription Slip</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>National ABDM Standard R4 • Digitally Signed</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => window.print()}
                  className="btn-primary"
                  style={{
                    padding: '7px 14px',
                    fontSize: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    borderRadius: '8px'
                  }}
                >
                  <Download size={14} />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  onClick={() => setShowPrintRxModal(false)}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    color: '#ffffff',
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Body */}
            <div style={{ padding: '26px 30px', overflowY: 'auto', flex: 1, color: '#1E293B', fontFamily: 'Inter, sans-serif' }}>
              
              {/* Government / Hospital Letterhead */}
              <div style={{
                borderBottom: '2px solid #0F4C5C',
                paddingBottom: '16px',
                marginBottom: '16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#D97706', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                    Government of India • Ministry of Health & Family Welfare
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#081C24', margin: '3px 0' }}>
                    {assignedDoctor.facility || 'Kurnool District Hospital (ABDM PHC #1402)'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Department of {assignedDoctor.specialty} • National Health Authority HFR ID: HFR-AP-14029
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F4C5C' }}>{assignedDoctor.doctorName}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{assignedDoctor.nmcRegNo || 'NMC-TS-2016-48291'}</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>HPR: {assignedDoctor.hprId || 'ABHA-HPR-8921-9942'}</div>
                </div>
              </div>

              {/* Patient Barcode & Demographics Grid */}
              <div style={{
                background: '#FAF8F5',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '18px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                fontSize: '12px'
              }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>PATIENT NAME</span>
                  <strong style={{ color: '#081C24', fontSize: '13px' }}>{patientName}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>AGE / GENDER</span>
                  <strong style={{ color: '#081C24' }}>{patientProfile?.age || 28} Yrs • {patientProfile?.gender || 'Female'}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>ABHA ID</span>
                  <strong style={{ color: '#081C24', fontFamily: 'monospace' }}>{abhaId}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>DATE OF ISSUE</span>
                  <strong style={{ color: '#081C24' }}>23/10/2026</strong>
                </div>
              </div>

              {/* Vitals & Clinical Assessment */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 750, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Recorded Vitals & Condition
                </div>
                <div style={{ fontSize: '12.5px', background: '#FAF8F5', padding: '8px 12px', borderRadius: '8px', color: '#334155', marginBottom: '8px' }}>
                  BP: {patientProfile?.vitals?.bp || '120/80 mmHg'} • Pulse: {patientProfile?.vitals?.hr || '76 bpm'} • SpO2: {patientProfile?.vitals?.spo2 || '98%'}
                </div>
                <div style={{ fontSize: '13px', color: '#081C24', background: 'rgba(15, 76, 92, 0.08)', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid #0F4C5C' }}>
                  <strong>Provisional Diagnosis: </strong> {patientProfile?.condition || 'Seasonal Bronchial Sensitivity & Allergic Airway Reactivity'}
                </div>
              </div>

              {/* Prescribed Medications Table */}
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '20px', color: '#0F4C5C', fontWeight: 900, fontFamily: 'serif' }}>℞</span>
                  <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#081C24', textTransform: 'uppercase' }}>
                    Prescribed Medications (Jan Aushadhi Generic Optimized)
                  </span>
                </div>

                <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <thead>
                      <tr style={{ background: '#FAF8F5', borderBottom: '1px solid #E2E8F0', color: '#475569', textAlign: 'left' }}>
                        <th style={{ padding: '10px 12px' }}>Medicine & Generic Equivalent</th>
                        <th style={{ padding: '10px 12px' }}>Timing & Indic Context</th>
                        <th style={{ padding: '10px 12px' }}>Instructions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(patientProfile?.chronotherapySchedule || [
                        { medicine: 'Pantoprazole 40mg (పసుపు గోళీ)', time: '08:30 AM', mealContext: 'Empty stomach (పరగడుపున)', purpose: 'Acidity & Reflux' },
                        { medicine: 'Metformin 500mg SR (గులాబీ గోళీ)', time: '08:30 PM', mealContext: 'After dinner (భోజనం తర్వాత)', purpose: 'Glucose Control' }
                      ]).map((med, mIdx) => (
                        <tr key={mIdx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <strong style={{ color: '#081C24', fontSize: '12.5px' }}>{med.medicine}</strong>
                            <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 650, marginTop: '2px' }}>
                              ✓ PMBJP Generic Equivalent Mapped
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#081C24', fontWeight: 600 }}>
                            {med.time} ({med.mealContext})
                          </td>
                          <td style={{ padding: '10px 12px', color: '#475569' }}>
                            {med.purpose || 'As directed by physician'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* QR Verification & DSC e-Signature Footer */}
              <div style={{
                borderTop: '2px dashed #CBD5E1',
                paddingTop: '16px',
                marginTop: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <AuthenticQrCode 
                    value={`https://ayuswar-ai.vercel.app/patient-portal?abha=${abhaId}&pt=${encodeURIComponent(patientName)}`}
                    size={68}
                    isDoctor={false}
                    showCenterBadge={false}
                  />
                  <div style={{ fontSize: '11px', color: '#64748B', maxWidth: '240px' }}>
                    ABDM Health Record Token: <strong>HRT-DEMO-9942</strong><br />
                    Encrypted with SHA-256 digital certificate. Scannable via any smartphone camera.
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    display: 'inline-block',
                    border: '1.5px solid #0F4C5C',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    background: 'rgba(15, 76, 92, 0.05)',
                    marginBottom: '4px'
                  }}>
                    <div style={{ fontSize: '10px', color: '#0F4C5C', fontWeight: 800 }}>CLASS-3 DIGITAL SIGNATURE (DSC)</div>
                    <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#081C24' }}>{assignedDoctor.doctorName}</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>Attending Physician (Demo)</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Generated via AyuSwar Ambient Clinical AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Vernacular Audio-Rx Modal */}
      <WhatsAppAudioRxModal 
        isOpen={showWhatsAppRxModal}
        onClose={() => setShowWhatsAppRxModal(false)}
        patientData={{
          name: patientName,
          vernacularName: selectedLanguage === 'Telugu' ? 'నారాయణ రావు' : 'आरव कुमार',
          phone: emergencyPhone || '+91 98490 12345',
          cleanPhone: '919849012345',
          age: patientProfile?.age || 28,
          gender: patientProfile?.gender || 'Female',
          abhaId: abhaId,
          language: selectedLanguage,
          langCode: selectedLanguage === 'Telugu' ? 'te-IN' : 'hi-IN'
        }}
        doctorName={assignedDoctor.doctorName}
        initialLanguage={selectedLanguage === 'Telugu' ? 'te' : 'hi'}
      />

      {/* Native Mobile Bottom Navigation Bar (Visible only on mobile < 768px) */}
      <nav 
        className="portal-mobile-bottom-nav"
        style={{
          display: 'none',
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '62px',
          background: '#ffffff',
          borderTop: '1px solid #E2E8F0',
          boxShadow: '0 -4px 16px rgba(15, 23, 42, 0.08)',
          zIndex: 80,
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 8px',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
        aria-label="Mobile Navigation"
      >
        {[
          { id: 'home', label: 'Home', icon: Home },
          { id: 'my_health', label: 'My Health', icon: Heart },
          { id: 'appointments', label: 'Appts', icon: Calendar },
          { id: 'medications', label: 'Meds', icon: Pill },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                  try { navigator.vibrate(12); } catch {}
                }
                setActiveTab(tab.id);
              }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
                background: 'transparent',
                border: 'none',
                color: isActive ? '#0F4C5C' : '#64748B',
                cursor: 'pointer',
                padding: '6px 0',
                transition: 'all 0.15s ease',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <div style={{
                position: 'relative',
                padding: '2px 14px',
                borderRadius: '16px',
                background: isActive ? 'rgba(15, 76, 92, 0.12)' : 'transparent',
                transition: 'all 0.15s ease'
              }}>
                <Icon size={19} color={isActive ? '#0F4C5C' : '#64748B'} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span style={{
                fontSize: '10px',
                fontWeight: isActive ? 800 : 500,
                letterSpacing: '-0.1px'
              }}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Real-time Citizen Health Notifications Drawer */}
      <ClinicalNotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        mode="patient"
        userProfile={patientProfile}
        onActionClick={(item) => {
          if (item.actionType === 'listen_rx') {
            setShowWhatsAppRxModal(true);
          } else if (item.actionType === 'prescriptions') {
            setActiveTab('medications');
          } else if (item.actionType === 'health_records') {
            setActiveTab('my_health');
          } else if (item.actionType === 'scanner') {
            window.location.href = '/scanner';
          }
        }}
      />

      {/* Planned Notice Toast */}
      {plannedNotice && (
        <div style={{
          position: 'fixed',
          bottom: '80px',
          right: '24px',
          zIndex: 2000,
          background: '#0A2540',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(10,37,64,0.35)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          fontWeight: 700,
          border: '1px solid rgba(212, 175, 55, 0.3)',
          maxWidth: '90vw'
        }}>
          <span style={{ fontSize: '10px', background: '#FEF3C7', color: '#92400E', padding: '2px 8px', borderRadius: '6px', fontWeight: 800 }}>PLANNED</span>
          <span>{plannedNotice}</span>
        </div>
      )}
    </div>
  );
}
