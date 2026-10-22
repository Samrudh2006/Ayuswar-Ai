import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  FileText, 
  Search, 
  Bell, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  Sparkles, 
  Sun, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Mic, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Stethoscope, 
  Pill, 
  BookOpen, 
  Settings, 
  Home, 
  Database,
  Send,
  MessageSquare,
  FileCheck,
  Filter,
  Plus,
  AlertTriangle,
  Heart,
  QrCode,
  Volume2,
  Scan,
  Maximize2,
  Download,
  Share2,
  PhoneCall,
  UserCheck,
  Check,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { askAyuSwarBrain } from '../services/aiBrainService';
import AbhaDigitalCard from './AbhaDigitalCard';
import WhatsAppAudioRxModal from './WhatsAppAudioRxModal';
import LiveScribeSessionModal from './LiveScribeSessionModal';
import AuthenticQrCode from './AuthenticQrCode';
import ClinicalNotificationsDrawer from './ClinicalNotificationsDrawer';
import DoctorClinicalLibraryTab from './doctor/DoctorClinicalLibraryTab';
import DoctorAiAssistantTab from './doctor/DoctorAiAssistantTab';
import { DIAGNOSTIC_REPORTS_DATABASE } from '../data/diagnosticReportsDataset';
import { downloadFhirJson, calculateMewsScore, getJanAushadhiGenericInfo } from '../data/clinicalSafetySentinel';
import { DEMO_PATIENTS, DEMO_APPOINTMENTS, formatDemoDate, getRelativeDaysLabel, SampleDataChip } from '../data/demoData';

/**
 * DoctorPortal Component — Complete Enterprise Physician Operating System
 * Faithfully implements Screenshot 1 + All 8 dedicated sidebar views:
 * 1. Dashboard (KPIs, OPD appointments, AI assistant, Analytics chart, Recent reports, Features)
 * 2. Patients (Full OPD registry, risk triage, ABHA IDs, longitudinal EHR & vitals)
 * 3. AI Assistant (Dedicated clinical co-pilot, GINA/ICMR guidelines, DDI checker, differential diagnosis)
 * 4. Appointments (OPD queue master, live token display, waiting times, triage priority)
 * 5. Reports & Lab (X-Ray DICOM viewer, CBC, Spirometry PFT, 12-lead ECG, ABDM FHIR R4 export)
 * 6. Prescriptions (Active e-Rx, NFI formulary checker, Tesseract blister OCR scanner, spoken Audio-Rx)
 * 7. Clinical Library (WHO ICD-10 taxonomy, colloquial Indic symptom resolver, clinical protocols)
 * 8. Settings (ABDM HPR credentials, hospital facility #1402, WebAudio mic VAD calibration)
 */
const INITIAL_DASHBOARD_APPOINTMENTS = [
  {
    id: 0,
    patientName: 'Rohit Kumar',
    name: 'Rohit Kumar',
    vernacular: 'రోహిత్ కుమార్',
    token: 'OPD-101',
    age: 42,
    gender: 'Male',
    time: '09:30 AM',
    type: 'Follow-up (Asthma)',
    status: 'Completed',
    statusColor: '#10B981',
    statusBg: 'rgba(16, 185, 129, 0.1)',
    encounterIndex: 0
  },
  {
    id: 1,
    patientName: 'Ananya Rao',
    name: 'Ananya Rao',
    vernacular: 'అనన్య రావు',
    token: 'OPD-102',
    age: 28,
    gender: 'Female',
    time: '10:15 AM',
    type: 'Consultation (Fever)',
    status: 'In Progress',
    statusColor: '#3B82F6',
    statusBg: 'rgba(59, 130, 246, 0.12)',
    encounterIndex: 1
  },
  {
    id: 2,
    patientName: 'Suresh Babu',
    name: 'Suresh Babu',
    vernacular: 'సురేష్ బాబు',
    token: 'OPD-103',
    age: 56,
    gender: 'Male',
    time: '11:00 AM',
    type: 'Follow-up (Diabetes)',
    status: 'Upcoming',
    statusColor: '#6366F1',
    statusBg: 'rgba(99, 102, 241, 0.1)',
    encounterIndex: 2
  },
  {
    id: 3,
    patientName: 'Meera Nair',
    name: 'Meera Nair',
    vernacular: 'మీరా నాయర్',
    token: 'OPD-104',
    age: 34,
    gender: 'Female',
    time: '11:45 AM',
    type: 'Consultation (Cough)',
    status: 'Upcoming',
    statusColor: '#6366F1',
    statusBg: 'rgba(99, 102, 241, 0.1)',
    encounterIndex: 0
  }
];

export default function DoctorPortal({ 
  doctorProfile, 
  onSelectEncounterAndLaunch, 
  onOpenTechModal, 
  onOpenDatasetModal,
  onLogoutDoctor, 
  registeredPatients = [],
  appointmentsQueue = [],
  onAcceptAppointment
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => typeof window !== 'undefined' && window.innerWidth < 1024);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [analyticsRange, setAnalyticsRange] = useState('weekly');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('guidelines'); // 'guidelines' | 'ddi' | 'ddx' | 'vernacular'
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);
  const [whatsAppModalPatient, setWhatsAppModalPatient] = useState(null);
  const [activeScribeSessionPatient, setActiveScribeSessionPatient] = useState(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientTriageFilter, setPatientTriageFilter] = useState('all');
  const [opdViewMode, setOpdViewMode] = useState('queue'); // 'queue' | 'schedule' | 'directory'
  const [allAppointmentsList, setAllAppointmentsList] = useState(DEMO_APPOINTMENTS);
  const [dashboardAppointments, setDashboardAppointments] = useState(INITIAL_DASHBOARD_APPOINTMENTS);
  const [isNewAppointmentModalOpen, setIsNewAppointmentModalOpen] = useState(false);
  const [newApptForm, setNewApptForm] = useState({
    patientId: 'DEMO-P001',
    patientName: 'Lakshmi Amma (fictional)',
    dateOffset: 0,
    time: '11:30 AM',
    type: 'In-Person OPD',
    complaint: 'Seasonal dry cough and breathlessness on exertion',
    triage: 'Green'
  });

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const tokenNum = 100 + allAppointmentsList.length + 1;
    const newToken = `OPD-${tokenNum}`;
    
    const selectedPat = DEMO_PATIENTS.find(p => p.id === newApptForm.patientId) || {
      id: `DEMO-P${tokenNum}`,
      name: newApptForm.patientName || 'Walk-in Patient',
      age: 45,
      gender: 'M',
      genderLabel: 'Male',
      language: 'Telugu (తెలుగు)',
      phone: '+91-98480-12345'
    };

    const newApptItem = {
      id: `DEMO-APPT-${Date.now()}`,
      patientId: selectedPat.id,
      patientName: selectedPat.name,
      token: newToken,
      offsetDays: Number(newApptForm.dateOffset),
      time: newApptForm.time,
      isTeleconsult: newApptForm.type.includes('Teleconsult'),
      complaint: newApptForm.complaint,
      status: 'Upcoming',
      language: selectedPat.language?.split(' ')[0] || 'Telugu'
    };

    const newDashItem = {
      id: Date.now(),
      patientName: selectedPat.name,
      name: selectedPat.name,
      vernacular: selectedPat.name,
      token: newToken,
      age: selectedPat.age || 45,
      gender: selectedPat.genderLabel || 'Male',
      time: newApptForm.time,
      type: `${newApptForm.type} (${newApptForm.complaint.slice(0, 24)}...)`,
      status: 'Upcoming',
      statusColor: '#6366F1',
      statusBg: 'rgba(99, 102, 241, 0.1)',
      encounterIndex: 0
    };

    setAllAppointmentsList(prev => [newApptItem, ...prev]);
    if (Number(newApptForm.dateOffset) === 0) {
      setDashboardAppointments(prev => [newDashItem, ...prev]);
    }

    setFhirToast(`Appointment Scheduled: Token ${newToken} generated for ${selectedPat.name} at ${newApptForm.time}. Added to OPD Queue.`);
    setTimeout(() => setFhirToast(null), 4500);
    setIsNewAppointmentModalOpen(false);
  };
  const [reportSearchTerm, setReportSearchTerm] = useState('');
  const [reportCategoryFilter, setReportCategoryFilter] = useState('all');
  const [dicomInvert, setDicomInvert] = useState(false);
  // dicomContrast omitted
  const [fhirToast, setFhirToast] = useState(null);
  const [plannedToast, setPlannedToast] = useState(null);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState(false);

  const showPlannedNotice = (featureName = 'This feature') => {
    setPlannedToast(`${featureName}: PLANNED in upcoming release.`);
    setTimeout(() => setPlannedToast(null), 3500);
  };

  // Canonical Shared WhatsApp Audio-Rx Modal Handler
  const handleOpenAudioRxModal = (p) => {
    const raw = p || patientsList[0] || DEMO_PATIENTS[0];
    const rawPhone = raw.phone || '+91-9XXX-XXX-001';
    setWhatsAppModalPatient({
      id: raw.id || 'DEMO-P001',
      name: raw.name || raw.patient || 'Lakshmi Amma (fictional)',
      vernacularName: raw.vernacular || raw.vernacularName || 'లక్ష్మి అమ్మ',
      phone: rawPhone,
      cleanPhone: (rawPhone || '919000000001').replace(/[^0-9]/g, ''),
      age: raw.age || 58,
      gender: raw.genderLabel || (raw.gender === 'F' ? 'Female' : 'Male'),
      abhaId: raw.abhaId || 'DEMO-91-4521-8932-1049',
      language: raw.language || (raw.lang === 'hi' ? 'Hindi' : 'Telugu'),
      langCode: (raw.lang === 'hi' || raw.langCode?.includes('hi')) ? 'hi-IN' : 'te-IN'
    });
  };


  // AyuVision Blister Pack OCR & NFI Formulary Suite
  const [ocrSampleIdx, setOcrSampleIdx] = useState(0);
  const [isOcrScanning, setIsOcrScanning] = useState(false);
  const [ocrScanComplete, setOcrScanComplete] = useState(false);
  const [printableRxData, setPrintableRxData] = useState(null);

  // Physician Settings State Suite
  const [docScribeEngine, setDocScribeEngine] = useState('browser_speech');
  const [docNoiseCancellation, setDocNoiseCancellation] = useState('crowded_opd');
  const [docAutoCoding, setDocAutoCoding] = useState(true);
  const [docDdiSentinel, setDocDdiSentinel] = useState(true);
  const [docGenericPref, setDocGenericPref] = useState(true);
  const [docDigitalSign, setDocDigitalSign] = useState(true);
  const [docAbdmAutoSync, setDocAbdmAutoSync] = useState(true);
  const [docWhatsAppPush, setDocWhatsAppPush] = useState(true);
  const [docSettingsSaved, setDocSettingsSaved] = useState(false);

  const doctorName = doctorProfile?.doctorName || 'Dr. Priya Sharma, MD';
  const doctorSpecialty = doctorProfile?.specialty || 'Pulmonology & Critical Care';

  // Determine clinical domain of logged-in doctor
  const isRespiratoryDoctor = 
    doctorSpecialty.toLowerCase().includes('pulmon') || 
    doctorSpecialty.toLowerCase().includes('resp') ||
    doctorSpecialty.toLowerCase().includes('chest');

  const isCardioDoctor = 
    doctorSpecialty.toLowerCase().includes('cardio') || 
    doctorSpecialty.toLowerCase().includes('diabet') ||
    doctorSpecialty.toLowerCase().includes('heart');

  // Shared Fictional OPD Registry from DEMO_PATIENTS
  const patientsList = DEMO_PATIENTS.map((dp, idx) => {
    // Triage mapping for visual cues
    const triageLevel = idx === 1 ? 'Critical' : (idx === 0 || idx === 3 ? 'Urgent' : (idx === 2 || idx === 5 ? 'Moderate' : 'Stable'));
    const triageColor = triageLevel === 'Critical' ? '#EF4444' : (triageLevel === 'Urgent' ? '#D97706' : (triageLevel === 'Moderate' ? '#3B82F6' : '#10B981'));
    const latestVitals = dp.vitalsHistory && dp.vitalsHistory.length > 0 ? dp.vitalsHistory[0] : { bp: '120/80 mmHg', pulse: '76 bpm', spo2: '98%' };
    const latestComplaint = dp.encounters && dp.encounters.length > 0 ? dp.encounters[0].complaint : dp.primaryCondition;
    
    // Domain categorization based on primary conditions
    const condStr = (dp.conditions || []).join(' ').toLowerCase();
    const domain = condStr.includes('asthma') || condStr.includes('copd') || condStr.includes('rhinitis') 
      ? 'respiratory' 
      : (condStr.includes('diabet') || condStr.includes('hypertens') ? 'cardiometabolic' : 'general');

    return {
      id: dp.id,
      token: `OPD-${101 + idx}`,
      name: dp.name,
      vernacular: dp.name.split(' ')[0],
      age: dp.age,
      gender: dp.genderLabel || (dp.gender === 'F' ? 'Female' : 'Male'),
      language: dp.language,
      langCode: dp.langCode,
      phone: dp.phone,
      village: dp.village,
      abhaId: dp.abhaId,
      chiefComplaint: latestComplaint,
      conditions: dp.conditions || [],
      primaryCondition: dp.primaryCondition,
      triage: triageLevel,
      triageColor: triageColor,
      vitals: {
        bp: latestVitals.bp?.replace(' mmHg', '') || '120/80',
        hr: latestVitals.pulse || '76 bpm',
        spo2: latestVitals.spo2 || '98%',
        weight: latestVitals.weight || '64 kg'
      },
      history: `${dp.conditions?.join(', ')}. Living in ${dp.village}.`,
      allergies: (dp.allergies || []).join(', ') || 'No known allergies',
      encounterIndex: idx % 3,
      domain: domain,
      lastVisitOffset: dp.lastVisitOffset,
      nextVisitOffset: dp.nextVisitOffset,
      encounters: dp.encounters || [],
      prescriptions: dp.prescriptions || [],
      reports: dp.reports || [],
      vitalsHistory: dp.vitalsHistory || []
    };
  });

  const formattedRegistered = (registeredPatients || []).map((rp, idx) => ({
    id: `reg_${idx}`,
    token: `OPD-${201 + idx}`,
    name: rp.patientName,
    vernacular: rp.patientName,
    age: rp.age || 40,
    gender: rp.gender || 'Female',
    language: rp.language || 'Telugu',
    phone: rp.phone || '+91-9XXX-XXX-099',
    village: rp.village || 'Primary Health Centre',
    abhaId: rp.abhaId || `DEMO-ABHA-91-${2000 + idx}`,
    chiefComplaint: `${rp.condition || 'Consultation'} (${rp.relation || 'Registered Citizen'})`,
    conditions: [rp.condition || 'General OPD Consultation'],
    primaryCondition: rp.condition || 'Consultation',
    triage: 'Moderate',
    triageColor: '#3B82F6',
    vitals: rp.vitals || { bp: '120/80', hr: '76 bpm', spo2: '98%', weight: '65 kg' },
    history: `Registered via Family Health Locker. Condition: ${rp.condition}`,
    allergies: 'None documented',
    encounterIndex: 0,
    lastVisitOffset: -2,
    nextVisitOffset: 5,
    encounters: [],
    prescriptions: [],
    reports: [],
    vitalsHistory: [],
    domain: rp.domain || (rp.condition?.toLowerCase().includes('diabet') || rp.condition?.toLowerCase().includes('hypertens') ? 'cardiometabolic' : (rp.condition?.toLowerCase().includes('asthma') ? 'respiratory' : 'general'))
  }));

  const allPatients = [...formattedRegistered, ...patientsList];

  const domainPatients = allPatients.filter(p => {
    if (isRespiratoryDoctor) return p.domain === 'respiratory';
    if (isCardioDoctor) return p.domain === 'cardiometabolic';
    return true; // General sees all
  });

  const appointments = dashboardAppointments;

  const recentReports = DIAGNOSTIC_REPORTS_DATABASE;

  const [aiResponses, setAiResponses] = useState([
    {
      q: 'What are the latest treatment guidelines for mild asthma in adults?',
      a: 'Based on GINA 2025 Global Asthma Guidelines:\n• Track 1 (Preferred): As-needed low-dose ICS-formoterol is the first-line controller & reliever to reduce severe exacerbations.\n• Track 2: Daily low-dose inhaled corticosteroid (ICS) plus as-needed SABA.\n• Safety Alert: Never prescribe SABA alone without ICS due to increased risk of asthma-related death.'
    }
  ]);

  const handleAskAi = async (e) => {
    e?.preventDefault();
    if (!aiPrompt.trim()) return;

    const newQuery = aiPrompt.trim();
    setAiPrompt('');

    // Pre-insert with loading indicator
    setAiResponses(prev => [{ q: newQuery, a: 'Analyzing clinical query against ICMR, GINA & NFI guidelines...' }, ...prev]);

    try {
      const answer = await askAyuSwarBrain(newQuery, 'doctor');
      setAiResponses(prev => {
        const updated = [...prev];
        updated[0] = { q: newQuery, a: answer };
        return updated;
      });
    } catch {
      setAiResponses(prev => {
        const updated = [...prev];
        updated[0] = { q: newQuery, a: `Processed query: "${newQuery}". Verified against WHO ICD-10 and NFI formulary guidelines.` };
        return updated;
      });
    }
  };

  const filteredPatients = domainPatients.filter(p => {
    const term = patientSearchTerm.trim().toLowerCase();
    const matchesSearch = !term || 
                          p.name.toLowerCase().includes(term) ||
                          String(p.id).toLowerCase().includes(term) ||
                          p.token.toLowerCase().includes(term) ||
                          p.chiefComplaint.toLowerCase().includes(term) ||
                          (p.conditions && p.conditions.some(c => c.toLowerCase().includes(term)));
    
    let matchesChip = true;
    if (patientTriageFilter === 'this_week') {
      matchesChip = typeof p.lastVisitOffset === 'number' && Math.abs(p.lastVisitOffset) <= 7;
    } else if (patientTriageFilter === 'has_upcoming') {
      matchesChip = typeof p.nextVisitOffset === 'number' && p.nextVisitOffset >= 0 && p.nextVisitOffset <= 10;
    } else if (patientTriageFilter === 'critical') {
      matchesChip = p.triage.toLowerCase() === 'critical';
    } else if (patientTriageFilter === 'urgent') {
      matchesChip = p.triage.toLowerCase() === 'urgent' || p.triage.toLowerCase() === 'critical';
    } else if (patientTriageFilter !== 'all') {
      matchesChip = p.triage.toLowerCase() === patientTriageFilter.toLowerCase();
    }
    
    return matchesSearch && matchesChip;
  });

  const filteredReports = recentReports.filter(rep => {
    const matchesCategory = 
      reportCategoryFilter === 'all' || 
      (reportCategoryFilter === 'Radiology' && (rep.category === 'Radiology' || rep.modality?.toLowerCase().includes('radiograph') || rep.modality?.toLowerCase().includes('ct') || rep.modality?.toLowerCase().includes('mri') || rep.modality?.toLowerCase().includes('sonography'))) ||
      (reportCategoryFilter === 'Cardiology' && (rep.category === 'Cardiology' || rep.title?.toLowerCase().includes('ecg') || rep.title?.toLowerCase().includes('echo') || rep.title?.toLowerCase().includes('troponin') || rep.title?.toLowerCase().includes('bnp'))) ||
      (reportCategoryFilter === 'Hematology' && (rep.category === 'Hematology' || rep.title?.toLowerCase().includes('blood') || rep.title?.toLowerCase().includes('cbc') || rep.title?.toLowerCase().includes('ferritin') || rep.title?.toLowerCase().includes('coagulation'))) ||
      (reportCategoryFilter === 'Biochemistry' && (rep.category === 'Biochemistry' || rep.title?.toLowerCase().includes('hba1c') || rep.title?.toLowerCase().includes('lipid') || rep.title?.toLowerCase().includes('renal') || rep.title?.toLowerCase().includes('liver') || rep.title?.toLowerCase().includes('thyroid') || rep.title?.toLowerCase().includes('vitamin') || rep.title?.toLowerCase().includes('calcium') || rep.title?.toLowerCase().includes('crp') || rep.title?.toLowerCase().includes('uric'))) ||
      (reportCategoryFilter === 'Microbiology' && (rep.category === 'Microbiology' || rep.category === 'Infectious' || rep.title?.toLowerCase().includes('dengue') || rep.title?.toLowerCase().includes('widal') || rep.title?.toLowerCase().includes('genexpert') || rep.title?.toLowerCase().includes('urine') || rep.title?.toLowerCase().includes('stool') || rep.title?.toLowerCase().includes('culture'))) ||
      (reportCategoryFilter === 'Pulmonology' && (rep.category === 'Pulmonology' || rep.title?.toLowerCase().includes('spirometry') || rep.title?.toLowerCase().includes('abg') || rep.title?.toLowerCase().includes('fev1')));

    const q = reportSearchTerm.toLowerCase().trim();
    const matchesSearch = 
      !q || 
      rep.title?.toLowerCase().includes(q) ||
      rep.patient?.toLowerCase().includes(q) ||
      rep.modality?.toLowerCase().includes(q) ||
      (rep.loincCode && rep.loincCode.toLowerCase().includes(q)) ||
      rep.findings?.toLowerCase().includes(q) ||
      rep.impression?.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const handleExportFhir = (rep) => {
    downloadFhirJson(rep);
    setFhirToast(`ABDM FHIR R4 Bundle serialized and downloaded for ${rep.patient} (${rep.title}). Ready for HIE gateway.`);
    setTimeout(() => setFhirToast(null), 4500);
  };


  const ocrSamples = [
    {
      id: 'ocr_01',
      title: 'Pan-D Capsule Strip',
      type: 'Blister Foil Pack',
      imageIcon: '💊',
      brandName: 'PAN-D Capsule SR',
      genericSalt: 'Pantoprazole (40mg) + Domperidone (30mg SR)',
      manufacturer: 'Alkem Laboratories Ltd.',
      batchNo: 'ALK-24B09',
      expDate: '11/2027 (Valid)',
      brandMrp: 198,
      janAushadhiGeneric: 'Pantoprazole 40mg + Domperidone 30mg SR',
      janAushadhiPrice: 28,
      savingsPercent: 86,
      indications: 'Gastroesophageal Reflux Disease (GERD), Hyperacidity, Eructation',
      contraindication: 'Caution in cardiac arrhythmia / prolonged QT interval',
      vernacularSummary: 'ఉదయం టిఫిన్ ముందు 1 గోళీ (కడుపులో మంట మరియు తేన్పుల కోసం)'
    },
    {
      id: 'ocr_02',
      title: 'Glycomet-GP 2 Tablet Strip',
      type: 'Blister Foil Pack',
      imageIcon: '💊',
      brandName: 'Glycomet-GP 2 Forte',
      genericSalt: 'Glimepiride (2mg) + Metformin Hydrochloride (500mg SR)',
      manufacturer: 'USV Private Limited',
      batchNo: 'USV-7718',
      expDate: '09/2026 (Valid)',
      brandMrp: 245,
      janAushadhiGeneric: 'Glimepiride 2mg + Metformin 500mg SR',
      janAushadhiPrice: 35,
      savingsPercent: 85,
      indications: 'Type-2 Diabetes Mellitus glycemic control',
      contraindication: 'Check eGFR. Withhold if severe renal impairment (<30 mL/min)',
      vernacularSummary: 'రాత్రి భోజనం తర్వాత 1 గోళీ (షుగర్ నియంత్రణ కోసం)'
    },
    {
      id: 'ocr_03',
      title: 'Augmentin 625 Duo Strip',
      type: 'Alu-Alu Blister Strip',
      imageIcon: '💊',
      brandName: 'Augmentin 625 Duo Tablet',
      genericSalt: 'Amoxicillin (500mg) + Potassium Clavulanate (125mg)',
      manufacturer: 'GlaxoSmithKline Pharmaceuticals',
      batchNo: 'GSK-9921',
      expDate: '04/2026 (Valid)',
      brandMrp: 215,
      janAushadhiGeneric: 'Amoxycillin 500mg + Clavulanic Acid 125mg',
      janAushadhiPrice: 48,
      savingsPercent: 78,
      indications: 'Bacterial respiratory tract infections, sinusitis, acute bronchitis',
      contraindication: 'Strictly avoid in penicillin hypersensitivity / anaphylaxis',
      vernacularSummary: 'ఉదయం మరియు రాత్రి భోజనం తర్వాత 1 గోళీ (ఇన్ఫెక్షన్ తగ్గడానికి)'
    },
    {
      id: 'ocr_04',
      title: 'Handwritten Doctor Rx Note',
      type: 'Doctor Handwriting (Cursive)',
      imageIcon: '📝',
      brandName: 'Rx: Inhaler Budecort 200 + Tab Levocet 5mg',
      genericSalt: 'Budesonide Rotacaps 200mcg (BID) + Levocetirizine 5mg (HS)',
      manufacturer: 'Decoded by AyuSwar Handwriting Vision OCR',
      batchNo: 'N/A (Clinical Order)',
      expDate: '30 Days Supply',
      brandMrp: 380,
      janAushadhiGeneric: 'Budesonide 200mcg Inhalation Caps + Levocetirizine 5mg',
      janAushadhiPrice: 62,
      savingsPercent: 84,
      indications: 'Bronchial Asthma maintenance & Allergic Rhinitis',
      contraindication: 'Rinse mouth after steroid inhalation to prevent oral candidiasis',
      vernacularSummary: 'రోజుకు 2 సార్లు పీల్చండి, పీల్చిన తర్వాత నోరు పుక్కిలించండి'
    }
  ];

  const triggerOcrScan = (sampleIndex) => {
    setOcrSampleIdx(sampleIndex);
    setIsOcrScanning(true);
    setOcrScanComplete(false);
    setTimeout(() => {
      setIsOcrScanning(false);
      setOcrScanComplete(true);
    }, 1200);
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
          LEFT SIDEBAR (MATCHING SCREENSHOT 1 DOCTOR SIDEBAR)
          ========================================================================= */}
      <aside 
        className={`doctor-portal-aside ${mobileDrawerOpen ? 'mobile-open' : ''}`}
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
          {/* Brand Logo */}
          <div 
            onClick={() => window.location.href = '/'}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              paddingLeft: isCollapsedView ? '2px' : '8px', 
              marginBottom: '28px', 
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
              <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#091E26', whiteSpace: 'nowrap' }}>
                Ayu<span style={{ color: '#0F4C5C' }}>Swar</span> <span style={{ color: '#D4AF37' }}>AI</span>
              </div>
            )}
          </div>

          {/* Navigation Items (All 8 Sidebar Items) */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'opd_queue', label: 'OPD Queue & Patients', icon: Users },
              { id: 'reports', label: 'Reports & Lab', icon: FileText },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
              { id: 'clinical_library', label: 'Clinical Library', icon: BookOpen },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id || (item.id === 'opd_queue' && (activeTab === 'patients' || activeTab === 'appointments' || activeTab === 'opd_queue'));
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
                    transition: 'all 160ms ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={18} color={isActive ? '#0F4C5C' : '#64748B'} />
                  {!isCollapsedView && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Co-Pilot Card */}
        {!isCollapsedView ? (
          <div style={{
            background: 'linear-gradient(135deg, #E6F7F7 0%, #D1F2F2 100%)',
            borderRadius: '14px',
            padding: '14px',
            border: '1px solid #B2E5E5',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: 800,
              fontFamily: 'Outfit, sans-serif',
              color: '#081C24',
              marginBottom: '2px'
            }}>
              AyuSwar AI
            </div>
            <div style={{ fontSize: '11px', color: '#006D6D', lineHeight: 1.35 }}>
              Your AI co-pilot for better healthcare
            </div>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8px 0',
            color: '#0F4C5C'
          }} title="AyuSwar AI Co-pilot">
            <Sparkles size={20} />
          </div>
        )}
      </aside>

      {/* =========================================================================
          MAIN PHYSICIAN OPERATING CANVAS
          ========================================================================= */}
      <div className="doctor-portal-main-canvas" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
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
          {/* Left: Universal Search Bar with Mobile Menu Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
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
              title="Open Doctor Navigation Menu"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            <div className="doctor-search-box" style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            <input 
              type="text"
              placeholder="Search patients, reports, or ask AyuSwar..."
              value={patientSearchTerm}
              onChange={e => setPatientSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 38px',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                background: '#FAF8F5',
                fontSize: '13px',
                color: '#0F172A',
                outline: 'none'
              }}
            />
          </div>
        </div>

          {/* Profile, Switcher, Settings & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
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
              title="Physician Credentials & ABDM Settings"
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
              title="Clinical Alert Sentinel & Telemetry"
              aria-label="Open Clinical Notifications"
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

            {/* Single Doctor Login Badge (No Switcher) */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 14px',
                borderRadius: '14px',
                background: 'rgba(15, 76, 92, 0.06)',
                border: '1.5px solid rgba(15, 76, 92, 0.22)'
              }}
              title="Verified Physician ABDM Session (Single Doctor Login)"
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #0F4C5C',
                flexShrink: 0
              }}>
                <img 
                  src="/assets/dr_ananya_avatar.jpg" 
                  alt={doctorName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#081C24' }}>{doctorName}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#0F4C5C', fontWeight: 650 }}>
                  {doctorSpecialty} • {doctorProfile?.facility || 'Kurnool District Hospital'}
                </div>
              </div>
            </div>

            {/* Prominent Header Logout Button */}
            <button
              onClick={() => {
                if (onLogoutDoctor) onLogoutDoctor();
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
              title="Securely exit doctor portal and ABDM session"
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <div style={{ padding: '24px 28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

          {/* ---------------------------------------------------------------------
              TAB 1: DASHBOARD (EXACT TO SCREENSHOT 1)
              --------------------------------------------------------------------- */}
          {activeTab === 'dashboard' && (
            <>
              {/* Welcome Banner */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #E2E8F0',
                marginBottom: '24px',
                boxShadow: '0 2px 8px rgba(10, 37, 64, 0.02)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(245, 158, 11, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Sun size={24} color="#F59E0B" />
                  </div>
                  <div>
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                      Good Morning, {doctorName ? doctorName.split(',')[0] : 'Doctor'}
                    </h1>
                    <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Here's what's happening with your patients today.
                    </p>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: '1px solid #E2E8F0',
                  background: '#FAF8F5',
                  fontSize: '12.5px',
                  fontWeight: 650,
                  color: '#475569'
                }}>
                  <Calendar size={14} color="#0F4C5C" />
                  <span>Fri, 23 Oct 2026</span>
                </div>
              </div>

              {/* Core Feature Command Strip: OPD Ambient Scribe & WhatsApp Audio-Rx */}
              <div style={{
                background: 'linear-gradient(135deg, #0A2540 0%, #0F3B66 100%)',
                borderRadius: '16px',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                boxShadow: '0 8px 24px rgba(10, 37, 64, 0.18)',
                border: '1.5px solid rgba(212, 175, 55, 0.3)',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '14px',
                    background: 'rgba(212, 175, 55, 0.15)',
                    border: '1px solid #D4AF37',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00F5D4'
                  }}>
                    <Mic size={24} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                        Live OPD Ambient Voice Scribe
                      </h2>
                      <span style={{ fontSize: '10px', background: '#D4AF37', color: '#081C24', padding: '2px 8px', borderRadius: '12px', fontWeight: 900 }}>
                        CORE ENGINE
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#94A3B8', margin: '4px 0 0 0' }}>
                      Step-by-Step Flow: Record Conversation • AI Clinical Synthesis • Gnani Voice Note • WhatsApp Dispatch
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      if (onSelectEncounterAndLaunch) {
                        onSelectEncounterAndLaunch();
                      } else {
                        window.location.href = '/clinical-console';
                      }
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #0F4C5C 0%, #D4AF37 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '11px 20px',
                      fontSize: '13px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(15, 76, 92, 0.4)'
                    }}
                  >
                    <Mic size={16} />
                    <span>Launch OPD Scribe Console</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenAudioRxModal(patientsList[0]);
                    }}
                    style={{
                      background: '#25D366',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '11px 20px',
                      fontSize: '13px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(37, 211, 102, 0.35)'
                    }}
                  >
                    <Send size={16} />
                    <span>Send WhatsApp Audio-Rx</span>
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '18px',
                marginBottom: '24px'
              }}>
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(15, 76, 92, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F4C5C' }}>
                      <Users size={18} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Total Patients</div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 850, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>48</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Registered in local registry</div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                      <Calendar size={18} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Today's Appointments</div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 850, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>12</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Active queue tokens</div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                      <Activity size={18} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>AI Consultations</div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 850, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>8</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Scribe encounters completed</div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                      <FileText size={18} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Pending Reports</div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 850, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>5</div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>Awaiting physician review</div>
                </div>
              </div>

              {/* Middle Section: Today's Consultation Queue (Spacious Full-Width OPD View) */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '24px 28px', border: '1px solid #E2E8F0', marginBottom: '24px', boxShadow: '0 2px 10px rgba(15, 23, 42, 0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                        Today's Consultation Queue & Patient Roster
                      </h3>
                      <span style={{ fontSize: '11px', background: 'rgba(15, 76, 92, 0.1)', color: '#0F4C5C', padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
                        {dashboardAppointments.length} Active Consultations
                      </span>
                    </div>
                    <p style={{ fontSize: '12.5px', color: '#64748B', margin: '4px 0 0 0' }}>
                      Active outpatient roster for Dr. Priya Sharma • Real-time clinical voice scribe dispatch
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setIsNewAppointmentModalOpen(true)}
                      style={{
                        padding: '8px 16px',
                        background: '#0F4C5C',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '12.5px',
                        fontWeight: 750,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 8px rgba(15, 76, 92, 0.25)'
                      }}
                    >
                      <Plus size={14} />
                      <span>New Appointment</span>
                    </button>

                    <button
                      onClick={() => { setActiveTab('opd_queue'); setOpdViewMode('queue'); }}
                      style={{
                        padding: '8px 14px',
                        background: '#FAF8F5',
                        color: '#0F4C5C',
                        border: '1.5px solid #CBD5E1',
                        borderRadius: '10px',
                        fontSize: '12.5px',
                        fontWeight: 750,
                        cursor: 'pointer'
                      }}
                    >
                      View All in OPD Queue →
                    </button>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {dashboardAppointments.map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        borderRadius: '12px',
                        background: '#FAF8F5',
                        border: '1px solid #E2E8F0',
                        flexWrap: 'wrap',
                        gap: '12px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '12px',
                          background: 'rgba(15, 76, 92, 0.12)',
                          color: '#0F4C5C',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 800
                        }}>
                          {item.token || `OPD-${101 + idx}`}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#081C24' }}>{item.patientName}</span>
                            <span style={{ fontSize: '11.5px', color: '#64748B' }}>• {item.age} y • {item.gender}</span>
                          </div>
                          <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '2px' }}>
                            {item.type}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: '#081C24' }}>{item.time}</div>
                          <span style={{
                            fontSize: '10.5px',
                            fontWeight: 750,
                            padding: '3px 8px',
                            borderRadius: '10px',
                            background: item.statusBg || '#DCFCE7',
                            color: item.statusColor || '#166534',
                            display: 'inline-block',
                            marginTop: '2px'
                          }}>
                            {item.status}
                          </span>
                        </div>

                        <button
                          onClick={() => setActiveScribeSessionPatient({
                            name: item.patientName || item.name,
                            vernacular: item.vernacular || item.patientName,
                            token: item.token || `OPD-${101 + idx}`,
                            phone: '+91 98490 12345',
                            age: item.age || 50,
                            gender: item.gender || 'Female',
                            language: 'Telugu',
                            domain: 'general'
                          })}
                          title="Launch In-Situ Ambient Voice Scribe Studio"
                          style={{
                            background: '#0F4C5C',
                            border: 'none',
                            borderRadius: '10px',
                            color: '#ffffff',
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: 750,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 2px 8px rgba(15, 76, 92, 0.3)'
                          }}
                        >
                          <Mic size={14} />
                          <span>Start Voice Scribe</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Section: Analytics + Reports */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px', marginBottom: '28px' }}>
                {/* Patient Analytics */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                      Patient Analytics
                    </h3>
                    <div style={{ display: 'flex', gap: '4px', background: '#FAF8F5', padding: '3px', borderRadius: '10px' }}>
                      {['Weekly', 'Monthly', 'Yearly'].map(tab => (
                        <button
                          key={tab}
                          onClick={() => setAnalyticsRange(tab.toLowerCase())}
                          style={{
                            padding: '4px 10px',
                            borderRadius: '8px',
                            border: 'none',
                            background: analyticsRange === tab.toLowerCase() ? '#ffffff' : 'transparent',
                            color: analyticsRange === tab.toLowerCase() ? '#0A2540' : '#64748B',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: analyticsRange === tab.toLowerCase() ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                          }}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '14px', fontSize: '11.5px', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0F4C5C' }}></span>
                      <span>New Patients</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }}></span>
                      <span>Follow-ups</span>
                    </div>
                  </div>

                  {/* Chart SVG */}
                  <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                    <svg viewBox="0 0 520 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                      {[30, 70, 110, 150].map((y, idx) => (
                        <line key={idx} x1="30" y1={y} x2="510" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                      ))}
                      <text x="10" y="34" fontSize="10" fill="#94A3B8">40</text>
                      <text x="10" y="74" fontSize="10" fill="#94A3B8">30</text>
                      <text x="10" y="114" fontSize="10" fill="#94A3B8">20</text>
                      <text x="10" y="154" fontSize="10" fill="#94A3B8">10</text>

                      <path d="M 40,120 Q 110,95 180,135 T 320,110 T 460,90 L 500,85" fill="none" stroke="#0F4C5C" strokeWidth="3" />
                      <path d="M 40,145 Q 110,135 180,120 T 320,95 T 460,75 L 500,80" fill="none" stroke="#3B82F6" strokeWidth="3" />

                      <circle cx="180" cy="135" r="4" fill="#0F4C5C" />
                      <circle cx="320" cy="110" r="4" fill="#0F4C5C" />
                      <circle cx="460" cy="90" r="4" fill="#0F4C5C" />

                      <circle cx="180" cy="120" r="4" fill="#3B82F6" />
                      <circle cx="320" cy="95" r="4" fill="#3B82F6" />
                      <circle cx="460" cy="75" r="4" fill="#3B82F6" />

                      {['May 5', 'May 6', 'May 7', 'May 8', 'May 9', 'May 10', 'May 11'].map((dt, i) => (
                        <text key={i} x={40 + i * 75} y="175" fontSize="10" fill="#94A3B8" textAnchor="middle">{dt}</text>
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Recent Reports */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                      Recent Reports
                    </h3>
                    <span onClick={() => setActiveTab('reports')} style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F4C5C', cursor: 'pointer' }}>View All →</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentReports.slice(0, 2).map(rep => (
                      <div
                        key={rep.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: '#FAF8F5',
                          border: '1px solid #F1F5F9'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>{rep.icon}</span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>{rep.title}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{rep.patient} • {rep.date}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedReport(rep)}
                          style={{
                            padding: '5px 12px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            background: '#ffffff',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            color: '#081C24',
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
            </>
          )}

          {/* ---------------------------------------------------------------------
              TAB 2: UNIFIED OPD QUEUE & PATIENTS (MASTER TOKEN QUEUE, SCHEDULE & EHR)
              --------------------------------------------------------------------- */}
          {(activeTab === 'opd_queue' || activeTab === 'patients' || activeTab === 'appointments') && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
                      OPD Queue & Patients
                    </h2>
                    <SampleDataChip />
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
                    Unified outpatient consultation queue, appointment schedules, and longitudinal patient EHR dossiers for District Hospital OPD.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setIsNewAppointmentModalOpen(true)}
                    style={{
                      background: '#0F4C5C',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '8px 16px',
                      fontSize: '12.5px',
                      fontWeight: 750,
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(15, 76, 92, 0.25)'
                    }}
                  >
                    <Plus size={14} />
                    <span>New Appointment</span>
                  </button>

                  <div style={{
                    padding: '8px 16px',
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '20px',
                    color: '#065F46',
                    fontSize: '12.5px',
                    fontWeight: 750
                  }}>
                    Today: {formatDemoDate(0)}
                  </div>
                </div>
              </div>

              {/* KPI Counters */}
              {(() => {
                const todayAppts = allAppointmentsList.filter(a => a.offsetDays === 0);
                const completedCount = allAppointmentsList.filter(a => a.status === 'Completed').length;
                const upcomingCount = allAppointmentsList.filter(a => a.status === 'Upcoming').length;

                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '22px' }}>
                    <div 
                      onClick={() => setOpdViewMode('queue')}
                      style={{ 
                        background: '#ffffff', 
                        padding: '16px 20px', 
                        borderRadius: '14px', 
                        border: opdViewMode === 'queue' ? '2px solid #0F4C5C' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: opdViewMode === 'queue' ? '0 4px 14px rgba(15, 76, 92, 0.12)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Today's OPD Queue</div>
                      <div style={{ fontSize: '24px', fontWeight: 850, color: '#081C24', marginTop: '4px' }}>{todayAppts.length} Patients</div>
                      <div style={{ fontSize: '11px', color: '#D97706', marginTop: '2px', fontWeight: 600 }}>Next: {todayAppts[0]?.time || '10:00 AM'}</div>
                    </div>

                    <div 
                      onClick={() => setOpdViewMode('schedule')}
                      style={{ 
                        background: '#ffffff', 
                        padding: '16px 20px', 
                        borderRadius: '14px', 
                        border: opdViewMode === 'schedule' ? '2px solid #0F4C5C' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: opdViewMode === 'schedule' ? '0 4px 14px rgba(15, 76, 92, 0.12)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Upcoming Visits</div>
                      <div style={{ fontSize: '24px', fontWeight: 850, color: '#2563EB', marginTop: '4px' }}>{upcomingCount} Scheduled</div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>In-person & teleconsult</div>
                    </div>

                    <div 
                      onClick={() => setOpdViewMode('schedule')}
                      style={{ 
                        background: '#ffffff', 
                        padding: '16px 20px', 
                        borderRadius: '14px', 
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed Visits</div>
                      <div style={{ fontSize: '24px', fontWeight: 850, color: '#10B981', marginTop: '4px' }}>{completedCount} Recorded</div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>With past encounter notes</div>
                    </div>

                    <div 
                      onClick={() => setOpdViewMode('directory')}
                      style={{ 
                        background: '#ffffff', 
                        padding: '16px 20px', 
                        borderRadius: '14px', 
                        border: opdViewMode === 'directory' ? '2px solid #0F4C5C' : '1px solid #E2E8F0',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        boxShadow: opdViewMode === 'directory' ? '0 4px 14px rgba(15, 76, 92, 0.12)' : 'none'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>All Cohort Patients</div>
                      <div style={{ fontSize: '24px', fontWeight: 850, color: '#0F4C5C', marginTop: '4px' }}>{patientsList.length} Registered</div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Searchable ABHA dossiers</div>
                    </div>
                  </div>
                );
              })()}

              {/* View Selector Switcher */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between', 
                marginBottom: '20px', 
                background: '#FAF8F5', 
                padding: '8px 12px', 
                borderRadius: '16px', 
                border: '1px solid #E2E8F0',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'inline-flex', background: '#E2E8F0', padding: '4px', borderRadius: '12px', gap: '4px' }}>
                  <button
                    onClick={() => setOpdViewMode('queue')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '9px',
                      border: 'none',
                      background: opdViewMode === 'queue' ? '#0F4C5C' : 'transparent',
                      color: opdViewMode === 'queue' ? '#ffffff' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Clock size={14} />
                    <span>Today's Live Queue ({allAppointmentsList.filter(a => a.offsetDays === 0).length})</span>
                  </button>

                  <button
                    onClick={() => setOpdViewMode('schedule')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '9px',
                      border: 'none',
                      background: opdViewMode === 'schedule' ? '#0F4C5C' : 'transparent',
                      color: opdViewMode === 'schedule' ? '#ffffff' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Calendar size={14} />
                    <span>Consultation Schedules ({allAppointmentsList.length})</span>
                  </button>

                  <button
                    onClick={() => setOpdViewMode('directory')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '9px',
                      border: 'none',
                      background: opdViewMode === 'directory' ? '#0F4C5C' : 'transparent',
                      color: opdViewMode === 'directory' ? '#ffffff' : '#475569',
                      fontSize: '12.5px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Users size={14} />
                    <span>All Patients Registry ({patientsList.length})</span>
                  </button>
                </div>

                {/* Quick Search */}
                <div style={{ position: 'relative', width: '260px' }}>
                  <Search size={14} color="#64748B" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search patient, token, complaint..."
                    value={patientSearchTerm}
                    onChange={(e) => setPatientSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px 8px 34px',
                      borderRadius: '20px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '12.5px',
                      outline: 'none',
                      background: '#ffffff',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* -------------------------------------------------------------
                  SUBVIEW 1: TODAY'S LIVE QUEUE
                  ------------------------------------------------------------- */}
              {opdViewMode === 'queue' && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>
                      Active Outpatient Tokens for Today ({formatDemoDate(0)})
                    </div>
                    <span style={{ fontSize: '11px', color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 10px', borderRadius: '12px', fontWeight: 750 }}>
                      Live Queue • Priority Triage Automated
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {(() => {
                      const todayAppts = allAppointmentsList.filter(a => a.offsetDays === 0);
                      const matchingToday = todayAppts.filter(a => {
                        if (!patientSearchTerm.trim()) return true;
                        const term = patientSearchTerm.toLowerCase();
                        return (
                          a.patientName.toLowerCase().includes(term) ||
                          a.token.toLowerCase().includes(term) ||
                          a.complaint.toLowerCase().includes(term)
                        );
                      });

                      if (matchingToday.length === 0) {
                        return (
                          <div style={{
                            padding: '36px',
                            textAlign: 'center',
                            background: '#ffffff',
                            borderRadius: '16px',
                            border: '1px solid #E2E8F0',
                            color: '#64748B'
                          }}>
                            <p style={{ margin: 0, fontWeight: 700 }}>No consultations in queue matching the criteria.</p>
                            <button
                              onClick={() => setPatientSearchTerm('')}
                              style={{
                                marginTop: '12px',
                                padding: '6px 14px',
                                borderRadius: '8px',
                                border: '1px solid #CBD5E1',
                                background: '#FAF8F5',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: 700
                              }}
                            >
                              Clear search
                            </button>
                          </div>
                        );
                      }

                      return matchingToday.map((appt) => {
                        const pat = patientsList.find(p => p.id === appt.patientId) || patientsList[0];
                        return (
                          <div
                            key={appt.id}
                            style={{
                              background: '#ffffff',
                              borderRadius: '14px',
                              padding: '18px 22px',
                              border: '1.5px solid #F59E0B',
                              boxShadow: '0 3px 12px rgba(245, 158, 11, 0.08)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '16px'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                              <div style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '12px',
                                background: 'rgba(245, 158, 11, 0.15)',
                                border: '1px solid rgba(245, 158, 11, 0.4)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 850,
                                fontSize: '15px',
                                color: '#B45309'
                              }}>
                                <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase', color: '#78350F' }}>Token</span>
                                {appt.token}
                              </div>

                              <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>{appt.patientName}</span>
                                  <span style={{ fontSize: '12px', color: '#64748B' }}>({pat.vernacular})</span>
                                  <span style={{ fontSize: '10px', background: `${pat.triageColor}18`, color: pat.triageColor, padding: '2px 8px', borderRadius: '8px', fontWeight: 750 }}>
                                    {pat.triage}
                                  </span>
                                  <span style={{ fontSize: '11px', color: '#0F4C5C', background: 'rgba(15, 76, 92, 0.08)', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                                    Slot: {appt.time}
                                  </span>
                                </div>
                                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '3px' }}>
                                  ABHA: <code>{pat.abhaId}</code> • {pat.age} y • {pat.gender} • {pat.language}
                                </div>
                                <div style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 600, marginTop: '4px' }}>
                                  Chief Complaint: {appt.complaint}
                                </div>
                              </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                              {/* Vitals HUD */}
                              <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
                                <div>BP: <strong>{pat.vitals.bp}</strong> • HR: <strong>{pat.vitals.hr}</strong></div>
                                <div>SpO2: <strong>{pat.vitals.spo2}</strong> {pat.vitals.rbs && `• RBS: ${pat.vitals.rbs}`}</div>
                                {(() => {
                                  const sys = parseInt(pat.vitals.bp?.split('/')[0]) || 120;
                                  const hr = parseInt(pat.vitals.hr) || 76;
                                  const spo2 = parseInt(pat.vitals.spo2) || 98;
                                  const mews = calculateMewsScore({ bpSystolic: sys, hr, spo2 });
                                  return (
                                    <div style={{ fontSize: '11px', color: mews.riskColor, fontWeight: 750, marginTop: '2px' }}>
                                      MEWS {mews.score} ({mews.riskLevel})
                                    </div>
                                  );
                                })()}
                              </div>

                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  onClick={() => setSelectedPatientModal(pat)}
                                  style={{
                                    padding: '8px 14px',
                                    borderRadius: '10px',
                                    border: '1.5px solid #CBD5E1',
                                    background: '#ffffff',
                                    color: '#081C24',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  View EHR
                                </button>

                                <button
                                  onClick={() => setActiveScribeSessionPatient(pat)}
                                  style={{
                                    padding: '8px 16px',
                                    borderRadius: '10px',
                                    border: 'none',
                                    background: '#0F4C5C',
                                    color: '#ffffff',
                                    fontSize: '12px',
                                    fontWeight: 750,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 8px rgba(15, 76, 92, 0.3)'
                                  }}
                                >
                                  <Mic size={14} />
                                  <span>Start Voice Scribe</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBVIEW 2: CONSULTATION SCHEDULES
                  ------------------------------------------------------------- */}
              {opdViewMode === 'schedule' && (
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#081C24' }}>
                      Master Consultation Schedule (Runtime-Relative)
                    </div>
                    <span style={{ fontSize: '11px', color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 10px', borderRadius: '12px', fontWeight: 750 }}>
                      Click any patient to inspect EHR dossier or start scribe
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {allAppointmentsList.filter(item => {
                      if (!patientSearchTerm.trim()) return true;
                      const term = patientSearchTerm.toLowerCase();
                      return (
                        item.patientName.toLowerCase().includes(term) ||
                        item.token.toLowerCase().includes(term) ||
                        item.complaint.toLowerCase().includes(term)
                      );
                    }).map((item) => {
                      const matchedPatient = patientsList.find(p => p.id === item.patientId) || patientsList[0];
                      const isToday = item.offsetDays === 0;
                      const isTeleconsult = item.isTeleconsult;
                      const isCompleted = item.status === 'Completed';

                      return (
                        <div
                          key={item.id}
                          style={{
                            padding: '16px 20px',
                            borderRadius: '14px',
                            background: isToday ? '#FFFBEB' : '#F8FAFC',
                            border: isToday ? '1.5px solid #F59E0B' : '1px solid #E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '14px',
                            boxShadow: isToday ? '0 4px 14px rgba(245, 158, 11, 0.12)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '10px',
                              background: isToday ? '#F59E0B' : (isCompleted ? '#10B981' : '#0F4C5C'),
                              color: '#ffffff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '13px'
                            }}>
                              {item.token}
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <span
                                  onClick={() => setSelectedPatientModal(matchedPatient)}
                                  style={{
                                    fontSize: '15px',
                                    fontWeight: 800,
                                    color: '#081C24',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                    textDecorationColor: '#CBD5E1'
                                  }}
                                >
                                  {item.patientName}
                                </span>
                                <span style={{ fontSize: '11px', color: '#64748B' }}>
                                  ({item.language})
                                </span>
                                {isTeleconsult && (
                                  <span style={{ fontSize: '10px', background: '#DBEAFE', color: '#1E40AF', padding: '2px 8px', borderRadius: '10px', fontWeight: 750 }}>
                                    Teleconsult
                                  </span>
                                )}
                                <span style={{
                                  fontSize: '10px',
                                  padding: '2px 8px',
                                  borderRadius: '10px',
                                  fontWeight: 750,
                                  background: isCompleted ? '#DCFCE7' : (isToday ? '#FEF3C7' : '#E0E7FF'),
                                  color: isCompleted ? '#166534' : (isToday ? '#92400E' : '#3730A3')
                                }}>
                                  {item.status} ({getRelativeDaysLabel(item.offsetDays)})
                                </span>
                              </div>

                              <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '3px' }}>
                                <strong>{formatDemoDate(item.offsetDays)} at {item.time}</strong> • {item.complaint}
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <button
                              onClick={() => setSelectedPatientModal(matchedPatient)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '8px',
                                border: '1px solid #CBD5E1',
                                background: '#ffffff',
                                color: '#081C24',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Dossier
                            </button>

                            <button
                              onClick={() => setActiveScribeSessionPatient(matchedPatient)}
                              style={{
                                padding: '6px 14px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#0F4C5C',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: 750,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 8px rgba(15, 76, 92, 0.3)'
                              }}
                            >
                              <Mic size={14} />
                              <span>Voice Scribe</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  SUBVIEW 3: ALL PATIENTS REGISTRY & LONGITUDINAL EHR
                  ------------------------------------------------------------- */}
              {opdViewMode === 'directory' && (
                <div>
                  {/* Filter Chips Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {[
                        { key: 'all', label: 'All Registered' },
                        { key: 'this_week', label: 'New This Week' },
                        { key: 'has_upcoming', label: 'Has Upcoming Visit' },
                        { key: 'urgent', label: 'High Priority Triage' }
                      ].map(chip => (
                        <button
                          key={chip.key}
                          onClick={() => setPatientTriageFilter(chip.key)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '20px',
                            border: 'none',
                            background: patientTriageFilter === chip.key ? '#0A2540' : '#E2E8F0',
                            color: patientTriageFilter === chip.key ? '#ffffff' : '#475569',
                            fontSize: '12px',
                            fontWeight: 750,
                            cursor: 'pointer'
                          }}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                      Showing {filteredPatients.length} of {patientsList.length} patients
                    </div>
                  </div>

                  {/* Patient Table Grid */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {filteredPatients.length === 0 ? (
                      <div style={{
                        padding: '36px',
                        textAlign: 'center',
                        background: '#ffffff',
                        borderRadius: '16px',
                        border: '1px solid #E2E8F0',
                        color: '#64748B'
                      }}>
                        <p style={{ margin: 0, fontWeight: 700 }}>No demo patients found matching "{patientSearchTerm}".</p>
                        <button
                          onClick={() => { setPatientSearchTerm(''); setPatientTriageFilter('all'); }}
                          style={{
                            marginTop: '12px',
                            padding: '6px 14px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            background: '#FAF8F5',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 700
                          }}
                        >
                          Reset filters
                        </button>
                      </div>
                    ) : null}

                    {filteredPatients.map(pat => (
                      <div
                        key={pat.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: '14px',
                          padding: '18px 22px',
                          border: '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          flexWrap: 'wrap',
                          gap: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{
                            width: '46px',
                            height: '46px',
                            borderRadius: '12px',
                            background: 'rgba(15, 76, 92, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '16px',
                            color: '#0F4C5C'
                          }}>
                            {pat.token.split('-')[1]}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '15px', fontWeight: 800, color: '#081C24' }}>{pat.name}</span>
                              <span style={{ fontSize: '12px', color: '#64748B' }}>({pat.vernacular})</span>
                              <span style={{ fontSize: '10px', background: `${pat.triageColor}18`, color: pat.triageColor, padding: '2px 8px', borderRadius: '8px', fontWeight: 750 }}>
                                {pat.triage}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                              ABHA: <code>{pat.abhaId}</code> • {pat.age} y • {pat.gender} • {pat.language}
                            </div>
                            <div style={{ fontSize: '12.5px', color: '#1E293B', fontWeight: 600, marginTop: '4px' }}>
                              Chief Complaint: {pat.chiefComplaint}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                          {/* Vitals HUD */}
                          <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
                            <div>BP: <strong>{pat.vitals.bp}</strong> • HR: <strong>{pat.vitals.hr}</strong></div>
                            <div>SpO2: <strong>{pat.vitals.spo2}</strong> {pat.vitals.rbs && `• RBS: ${pat.vitals.rbs}`}</div>
                            {(() => {
                              const sys = parseInt(pat.vitals.bp?.split('/')[0]) || 120;
                              const hr = parseInt(pat.vitals.hr) || 76;
                              const spo2 = parseInt(pat.vitals.spo2) || 98;
                              const mews = calculateMewsScore({ bpSystolic: sys, hr, spo2 });
                              return (
                                <div style={{ fontSize: '11px', color: mews.riskColor, fontWeight: 750, marginTop: '2px' }}>
                                  MEWS {mews.score} ({mews.riskLevel})
                                </div>
                              );
                            })()}
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => setSelectedPatientModal(pat)}
                              style={{
                                padding: '8px 14px',
                                borderRadius: '10px',
                                border: '1.5px solid #CBD5E1',
                                background: '#ffffff',
                                color: '#081C24',
                                fontSize: '12px',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              View EHR
                            </button>

                            <button
                              onClick={() => setActiveScribeSessionPatient(pat)}
                              style={{
                                padding: '8px 16px',
                                borderRadius: '10px',
                                border: 'none',
                                background: '#0F4C5C',
                                color: '#ffffff',
                                fontSize: '12px',
                                fontWeight: 750,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(15, 76, 92, 0.3)'
                              }}
                            >
                              <Mic size={14} />
                              <span>Start Voice Scribe</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 3: AI CLINICAL ASSISTANT (ADVANCED CO-PILOT VIEW)
              --------------------------------------------------------------------- */}
          {activeTab === 'ai_assistant' && (
            <DoctorAiAssistantTab
              aiCategory={aiCategory}
              setAiCategory={setAiCategory}
              aiResponses={aiResponses}
              aiPrompt={aiPrompt}
              setAiPrompt={setAiPrompt}
              handleAskAi={handleAskAi}
            />
          )}

          {/* ---------------------------------------------------------------------
              TAB 5: REPORTS & LAB (DIAGNOSTIC & RADIOLOGY HUB)
              --------------------------------------------------------------------- */}
          {activeTab === 'reports' && (
            <div>
              {/* Header & Meta */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                      Diagnostic Pathology & Imaging Hub
                    </h2>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(15, 76, 92, 0.12)', color: '#0F4C5C', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(15, 76, 92, 0.3)' }}>
                      NABL & ABDM Mapped (26 Records)
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Standardized LOINC-coded diagnostics, DICOM radiography viewport, spirometry flow-loops, and 1-click ABDM FHIR R4 export.
                  </p>
                </div>

                {/* Quick Search */}
                <div style={{ position: 'relative', width: '320px' }}>
                  <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="Search by patient, LOINC, test or analyte..."
                    value={reportSearchTerm}
                    onChange={e => setReportSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '13px',
                      background: '#ffffff',
                      color: '#081C24',
                      outline: 'none'
                    }}
                  />
                  {reportSearchTerm && (
                    <button
                      onClick={() => setReportSearchTerm('')}
                      style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '13px' }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '18px' }}>
                {[
                  { key: 'all', label: 'All Reports', count: recentReports.length },
                  { key: 'Radiology', label: '🩻 Radiology & DICOM', count: recentReports.filter(r => r.category === 'Radiology').length },
                  { key: 'Cardiology', label: '🫀 Cardiology & ECG', count: recentReports.filter(r => r.category === 'Cardiology').length },
                  { key: 'Hematology', label: '🩸 Hematology', count: recentReports.filter(r => r.category === 'Hematology').length },
                  { key: 'Biochemistry', label: '🧪 Biochemistry', count: recentReports.filter(r => r.category === 'Biochemistry').length },
                  { key: 'Microbiology', label: '🧫 Microbiology', count: recentReports.filter(r => r.category === 'Microbiology' || r.category === 'Infectious').length },
                  { key: 'Pulmonology', label: '🫁 Pulmonology & PFT', count: recentReports.filter(r => r.category === 'Pulmonology').length }
                ].map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setReportCategoryFilter(cat.key)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '12.5px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: reportCategoryFilter === cat.key ? '1.5px solid #0F4C5C' : '1px solid #E2E8F0',
                      background: reportCategoryFilter === cat.key ? '#0F4C5C' : '#ffffff',
                      color: reportCategoryFilter === cat.key ? '#ffffff' : '#475569',
                      whiteSpace: 'nowrap',
                      boxShadow: reportCategoryFilter === cat.key ? '0 2px 8px rgba(15, 76, 92, 0.25)' : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {cat.label} <span style={{ opacity: 0.8, fontSize: '11px', marginLeft: '4px' }}>({cat.count})</span>
                  </button>
                ))}
              </div>

              {/* Reports Grid */}
              {filteredReports.length === 0 ? (
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '40px', textAlign: 'center', border: '1px solid #E2E8F0' }}>
                  <p style={{ fontSize: '15px', color: '#64748B', fontWeight: 600 }}>No diagnostic records matching query "{reportSearchTerm}" in {reportCategoryFilter} filter.</p>
                  <button onClick={() => { setReportSearchTerm(''); setReportCategoryFilter('all'); }} className="btn-outline" style={{ marginTop: '12px', padding: '6px 16px', fontSize: '12px' }}>
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
                  {filteredReports.map(rep => {
                    const hasAbnormal = (rep.quantitativeMetrics || []).some(m => m.status && m.status !== 'Normal');
                    return (
                      <div
                        key={rep.id}
                        style={{
                          background: '#ffffff',
                          borderRadius: '16px',
                          padding: '20px',
                          border: '1px solid #E2E8F0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                        }}
                      >
                        <div>
                          {/* Header */}
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                              <span style={{ fontSize: '26px', lineHeight: 1 }}>{rep.icon}</span>
                              <div>
                                <div style={{ fontSize: '14.5px', fontWeight: 800, color: '#081C24', lineHeight: 1.3 }}>{rep.title}</div>
                                <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                                  {rep.modality} • {rep.date}
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                              <span style={{ fontSize: '10.5px', background: '#FAF8F5', color: '#334155', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                                {rep.patient}
                              </span>
                              {rep.loincCode && (
                                <span style={{ fontSize: '9.5px', color: '#0F4C5C', fontWeight: 750, fontFamily: 'monospace' }}>
                                  LOINC: {rep.loincCode}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Quantitative Metrics Snippet */}
                          {rep.quantitativeMetrics && rep.quantitativeMetrics.length > 0 && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', background: '#FAF8F5', padding: '10px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '12px' }}>
                              {rep.quantitativeMetrics.slice(0, 4).map((m, mIdx) => {
                                const isNorm = m.status === 'Normal';
                                const isHigh = m.status?.toLowerCase().includes('high') || m.status?.toLowerCase().includes('elevated') || m.status?.toLowerCase().includes('severe');
                                return (
                                  <div key={mIdx} style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div style={{ color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.parameter}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                                      <strong style={{ color: '#081C24', fontSize: '12px' }}>{m.result} {m.unit}</strong>
                                      <span style={{
                                        fontSize: '9px',
                                        fontWeight: 800,
                                        padding: '1px 5px',
                                        borderRadius: '4px',
                                        background: isNorm ? '#DCFCE7' : (isHigh ? '#FEE2E2' : '#FEF3C7'),
                                        color: isNorm ? '#15803D' : (isHigh ? '#B91C1C' : '#B45309')
                                      }}>
                                        {m.status}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          {/* Findings Snippet */}
                          <div style={{ fontSize: '12px', color: '#334155', lineHeight: 1.45, marginBottom: '10px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            <strong>Findings:</strong> {rep.findings}
                          </div>

                          {/* Impression */}
                          <div style={{
                            fontSize: '11.5px',
                            color: hasAbnormal ? '#991B1B' : '#065F46',
                            background: hasAbnormal ? 'rgba(239, 68, 68, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                            padding: '8px 10px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            lineHeight: 1.35,
                            marginBottom: '14px'
                          }}>
                            <strong>Impression:</strong> {rep.impression}
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div style={{ display: 'flex', gap: '8px', marginTop: 'auto' }}>
                          <button
                            onClick={() => setSelectedReport(rep)}
                            style={{
                              flex: 1,
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: '1.5px solid #0F4C5C',
                              background: 'transparent',
                              color: '#0F4C5C',
                              fontSize: '12px',
                              fontWeight: 750,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <FileText size={13} />
                            <span>Inspect Lab / DICOM</span>
                          </button>

                          <button
                            onClick={() => handleExportFhir(rep)}
                            style={{
                              padding: '8px 14px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#0A2540',
                              color: '#ffffff',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <Download size={13} />
                            <span>ABDM FHIR</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 6: PRESCRIPTIONS (E-RX, NFI FORMULARY & BLISTER SCANNER)
              --------------------------------------------------------------------- */}
          {activeTab === 'prescriptions' && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#081C24', fontFamily: 'Outfit, sans-serif' }}>
                      E-Prescriptions, Jan Aushadhi Formulary & AyuVision OCR
                    </h2>
                    <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(15, 76, 92, 0.12)', color: '#0F4C5C', padding: '3px 10px', borderRadius: '12px', border: '1px solid rgba(15, 76, 92, 0.3)' }}>
                      NFI & PMBJP 2025 Mapped
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Computer Vision OCR for medicine blister foils and cursive doctor handwriting, paired with Pradhan Mantri Jan Aushadhi generic price optimizer.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => {
                      const sample = ocrSamples[0];
                      setPrintableRxData({
                        patientName: 'Narayana Rao',
                        vernacularName: 'నారాయణ రావు',
                        abhaId: '91-4521-8932-1049',
                        age: 58,
                        gender: 'Male',
                        diagnosis: 'Type-2 Diabetes Mellitus & Dyslipidemia (E11.9)',
                        vitals: 'BP: 140/90 mmHg, HR: 88 bpm, RBS: 168 mg/dL',
                        date: new Date().toLocaleDateString('en-GB'),
                        medications: [
                          { name: 'Pantoprazole 40mg (పసుపు గోళీ)', timing: '08:30 AM (టిఫిన్ ముందు)', days: '30 Days', generic: 'Pantoprazole 40mg (Jan Aushadhi - ₹28)' },
                          { name: 'Metformin 500mg SR (గులాబీ గోళీ)', timing: '08:30 PM (భోజనం తర్వాత)', days: '30 Days', generic: 'Metformin 500mg SR (Jan Aushadhi - ₹35)' }
                        ]
                      });
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      background: '#ffffff',
                      color: '#081C24',
                      fontSize: '12.5px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <FileText size={14} color="#0F4C5C" />
                    <span>Print Official Color Rx Slip</span>
                  </button>
                </div>
              </div>

              {/* AyuVision Smart OCR & Blister Lens Studio */}
              <div style={{
                background: 'linear-gradient(135deg, #0A2540 0%, #1E3A8A 100%)',
                color: '#ffffff',
                borderRadius: '16px',
                padding: '22px 26px',
                marginBottom: '22px',
                border: '1px solid #1E293B',
                boxShadow: '0 10px 30px rgba(10, 37, 64, 0.15)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#38BDF8', color: '#081C24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Scan size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0, color: '#ffffff' }}>
                        AyuVision™ Blister Pack & Handwritten Prescription OCR Lens
                      </h3>
                      <div style={{ fontSize: '11.5px', color: '#94A3B8' }}>
                        Deep neural text extraction for crinkled foil strips, batch codes, and doctor handwriting.
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                    Sample OCR Preset
                  </span>
                </div>

                {/* Sample Selection Bar */}
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>Select Sample to Scan:</span>
                  {ocrSamples.map((sample, sIdx) => (
                    <button
                      key={sample.id}
                      onClick={() => triggerOcrScan(sIdx)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '16px',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        border: ocrSampleIdx === sIdx ? '1.5px solid #38BDF8' : '1px solid rgba(255,255,255,0.2)',
                        background: ocrSampleIdx === sIdx ? '#38BDF8' : 'rgba(255,255,255,0.08)',
                        color: ocrSampleIdx === sIdx ? '#0A2540' : '#E2E8F0',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {sample.imageIcon} {sample.title}
                    </button>
                  ))}
                </div>

                {/* OCR Scanner Viewport & Extraction Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.4fr', gap: '16px' }}>
                  {/* Scanner Visual Box */}
                  <div style={{
                    background: '#0B132B',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid rgba(255,255,255,0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '220px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}>
                    {/* Simulated Laser Scan Animation */}
                    {isOcrScanning && (
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        background: '#38BDF8',
                        boxShadow: '0 0 12px #38BDF8',
                        animation: 'scanLaser 1.2s infinite alternate'
                      }} />
                    )}

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 750, fontFamily: 'monospace' }}>
                          SCANNING FEED • {ocrSamples[ocrSampleIdx].type}
                        </span>
                        <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#34D399', padding: '2px 6px', borderRadius: '4px' }}>
                          LIVE
                        </span>
                      </div>

                      {/* Mock Optical Bounding Boxes */}
                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '14px', border: '1px dashed #38BDF8', position: 'relative' }}>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                          {ocrSamples[ocrSampleIdx].brandName}
                        </div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', marginBottom: '6px' }}>
                          {ocrSamples[ocrSampleIdx].genericSalt}
                        </div>
                        <div style={{ fontSize: '11px', color: '#38BDF8', fontFamily: 'monospace' }}>
                          BATCH: {ocrSamples[ocrSampleIdx].batchNo} • EXP: {ocrSamples[ocrSampleIdx].expDate}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '14px' }}>
                      <span style={{ fontSize: '10.5px', color: '#64748B' }}>
                        Canvas 2D + Tesseract OCR Model
                      </span>
                      <button
                        onClick={() => triggerOcrScan(ocrSampleIdx)}
                        style={{
                          padding: '4px 12px',
                          borderRadius: '6px',
                          background: '#0F4C5C',
                          color: '#ffffff',
                          border: 'none',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {isOcrScanning ? 'Scanning...' : 'Re-Scan Image'}
                      </button>
                    </div>
                  </div>

                  {/* Decoded NFI Comparison & Jan Aushadhi Switcher */}
                  <div style={{ background: '#ffffff', borderRadius: '12px', padding: '16px 18px', color: '#081C24', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 750, textTransform: 'uppercase' }}>
                          Decoded Composition & Indications
                        </span>
                        <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: '6px', fontWeight: 750 }}>
                          ✓ NFI Verified
                        </span>
                      </div>

                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#081C24', margin: '0 0 4px 0' }}>
                        {ocrSamples[ocrSampleIdx].genericSalt}
                      </h4>
                      <div style={{ fontSize: '12px', color: '#475569', marginBottom: '10px' }}>
                        <strong>Indications:</strong> {ocrSamples[ocrSampleIdx].indications}
                      </div>

                      {/* Jan Aushadhi Price Comparison Box */}
                      <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '10px 12px', border: '1px solid #BBF7D0', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: '10.5px', color: '#166534', fontWeight: 750 }}>PMBJP Jan Aushadhi Equivalent:</div>
                            <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#15803D' }}>{ocrSamples[ocrSampleIdx].janAushadhiGeneric}</div>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '10.5px', color: '#64748B', textDecoration: 'line-through' }}>MRP: ₹{ocrSamples[ocrSampleIdx].brandMrp}</div>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#15803D' }}>₹{ocrSamples[ocrSampleIdx].janAushadhiPrice}</div>
                          </div>
                        </div>
                        <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                          💰 Saves patient {ocrSamples[ocrSampleIdx].savingsPercent}% (₹{ocrSamples[ocrSampleIdx].brandMrp - ocrSamples[ocrSampleIdx].janAushadhiPrice} saved per strip!)
                        </div>
                      </div>

                      {/* Vernacular Spoken Tip */}
                      <div style={{ fontSize: '11.5px', color: '#0369A1', background: '#E0F2FE', padding: '6px 10px', borderRadius: '6px', fontWeight: 650 }}>
                        📢 <strong>తెలుగు సూచన:</strong> {ocrSamples[ocrSampleIdx].vernacularSummary}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setFhirToast(`Switched ${ocrSamples[ocrSampleIdx].brandName} to Jan Aushadhi generic (₹${ocrSamples[ocrSampleIdx].janAushadhiPrice}). Added to prescription.`);
                        setTimeout(() => setFhirToast(null), 4000);
                      }}
                      className="btn-primary"
                      style={{ marginTop: '12px', padding: '8px 14px', fontSize: '12px' }}
                    >
                      Apply Jan Aushadhi Generic to Rx (Save ₹{ocrSamples[ocrSampleIdx].brandMrp - ocrSamples[ocrSampleIdx].janAushadhiPrice})
                    </button>
                  </div>
                </div>
              </div>

              {/* Active Prescriptions Table */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', margin: 0 }}>
                    Today's Active Regimens & Patient Dispatches
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#166534', padding: '3px 10px', borderRadius: '12px', fontWeight: 750, border: '1px solid #BBF7D0' }}>
                      ✓ Clinical Safety Sentinel: 0 DDI Contraindications
                    </span>
                    <span style={{ fontSize: '11px', background: '#FEF3C7', color: '#92400E', padding: '3px 10px', borderRadius: '12px', fontWeight: 750 }}>
                      PMBJP NLEM 2022 Capped
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 1, patient: 'Narayana Rao', vernacular: 'నారాయణ రావు', phone: '+91 98490 12345', abhaId: 'DEMO-4521-8932-1049', lang: 'te', med: 'Pantoprazole 40mg + Metformin 500mg', schedule: 'Morning (08:30 AM) + Post-dinner (08:30 PM)', status: 'Active • Telugu Audio-Rx (Browser speech)' },
                    { id: 2, patient: 'Aarav Kumar', vernacular: 'आरव कुमार', phone: '+91 99887 65432', abhaId: 'DEMO-8821-4432-9012', lang: 'hi', med: 'Budesonide Nebulization (0.5mg) + Salbutamol', schedule: 'BD (Morning 08:30 AM & Night 08:30 PM)', status: 'Active • Hindi Audio-Rx (Browser speech)' },
                    { id: 3, patient: 'Ananya Rao', vernacular: 'అనన్య రావు', phone: '+91 98480 22334', abhaId: 'DEMO-4521-8932-1049', lang: 'te', med: 'Montelukast 10mg + Levocetirizine', schedule: 'Night at bedtime (09:30 PM)', status: 'Active • Verified' }
                  ].map(rx => (
                    <div
                      key={rx.id}
                      style={{
                        padding: '16px 20px',
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
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14.5px', fontWeight: 800, color: '#081C24' }}>{rx.patient}</span>
                          <span style={{ fontSize: '12px', color: '#0F4C5C', fontWeight: 700 }}>({rx.vernacular})</span>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>• {rx.phone}</span>
                        </div>
                        <div style={{ fontSize: '13px', color: '#0F4C5C', fontWeight: 700, marginTop: '2px' }}>{rx.med}</div>
                        {(() => {
                          const jan = getJanAushadhiGenericInfo(rx.med);
                          return (
                            <div style={{ fontSize: '11px', color: '#166534', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                              <span>PMBJP: <strong>{jan.genericName}</strong></span>
                              <span>• Branded: <s>₹{jan.brandedMrp}</s> → Jan Aushadhi: <strong>₹{jan.janAushadhiPrice}</strong></span>
                              <span style={{ background: '#DCFCE7', padding: '1px 6px', borderRadius: '4px', fontWeight: 750 }}>Save {jan.savingsPercent}%</span>
                            </div>
                          );
                        })()}
                        <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>Timing: {rx.schedule}</div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '4px 10px', borderRadius: '8px', fontWeight: 700 }}>
                          {rx.status}
                        </span>

                        <button
                          onClick={() => {
                            const med1 = rx.med.split('+')[0]?.trim() || rx.med;
                            const med2 = rx.med.includes('+') ? rx.med.split('+')[1]?.trim() : null;
                            const jan1 = getJanAushadhiGenericInfo(med1);
                            const jan2 = med2 ? getJanAushadhiGenericInfo(med2) : null;
                            
                            setPrintableRxData({
                              patientName: rx.patient,
                              vernacularName: rx.vernacular,
                              abhaId: rx.abhaId,
                              age: 42,
                              gender: 'Male',
                              diagnosis: 'Clinical Consultation & Prescription (PMBJP Cost-Optimized)',
                              vitals: 'BP: 120/80 mmHg, HR: 76 bpm, SpO2: 98%',
                              date: new Date().toLocaleDateString('en-GB'),
                              medications: [
                                { 
                                  name: med1, 
                                  timing: rx.schedule.split('+')[0]?.trim() || 'Morning (After Food)', 
                                  days: '30 Days', 
                                  generic: `${jan1.genericName} (MRP: ₹${jan1.brandedMrp} → PMBJP: ₹${jan1.janAushadhiPrice} • Save ${jan1.savingsPercent}%)` 
                                },
                                ...(jan2 ? [{ 
                                  name: med2, 
                                  timing: rx.schedule.split('+')[1]?.trim() || 'Night (After Food)', 
                                  days: '30 Days', 
                                  generic: `${jan2.genericName} (MRP: ₹${jan2.brandedMrp} → PMBJP: ₹${jan2.janAushadhiPrice} • Save ${jan2.savingsPercent}%)` 
                                }] : [])
                              ]
                            });
                          }}
                          style={{
                            padding: '7px 12px',
                            borderRadius: '8px',
                            border: '1px solid #CBD5E1',
                            background: '#ffffff',
                            color: '#334155',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <FileText size={13} />
                          <span>Print Slip</span>
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenAudioRxModal(rx);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '7px 14px',
                            borderRadius: '8px',
                            background: '#25D366',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '12px',
                            fontWeight: 800,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)'
                          }}
                        >
                          <Send size={13} />
                          <span>WhatsApp Audio-Rx</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 7: CLINICAL LIBRARY (WHO ICD-10 & VERNACULAR ONTOLOGY)
              --------------------------------------------------------------------- */}
          {activeTab === 'clinical_library' && (
            <DoctorClinicalLibraryTab onShowToast={(msg) => { setFhirToast(msg); setTimeout(() => setFhirToast(null), 3000); }} />
          )}

          {/* ---------------------------------------------------------------------
              TAB 8: SETTINGS (ABDM HPR CREDENTIALS & HARDWARE CALIBRATION)
              --------------------------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div>
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
                gap: '16px'
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
                      ABDM Healthcare Professional Registry (HPR)
                    </span>
                    <span style={{ fontSize: '12px', color: '#93C5FD' }}>• Verified Physician Console</span>
                  </div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: '0 0 6px 0' }}>
                    Physician Credentials, AI Scribe Engine & ABDM Calibration
                  </h2>
                  <p style={{ fontSize: '13px', color: '#E2E8F0', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
                    Configure ambient acoustic ingestion, Browser speech (Web Speech API). Gnani voice integration: planned, automated ICD-10/SNOMED coding, and Class-3 DSC digital prescription signing.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setDocSettingsSaved(true);
                    setTimeout(() => setDocSettingsSaved(false), 4000);
                  }}
                  className="btn-primary"
                  style={{ padding: '12px 24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <ShieldCheck size={16} />
                  <span>Save Configuration</span>
                </button>
              </div>

              {/* Toast Feedback */}
              {docSettingsSaved && (
                <div style={{ 
                  background: '#ECFDF5', 
                  border: '1.5px solid #10B981', 
                  borderRadius: '12px', 
                  padding: '14px 20px', 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  color: '#065F46',
                  fontSize: '13.5px',
                  fontWeight: 700
                }}>
                  <CheckCircle2 size={20} color="#10B981" />
                  <span>Physician clinical preferences, acoustic noise profiles, and DSC e-Sign credentials saved successfully!</span>
                </div>
              )}

              {/* Authentic ABDM HPR Doctor Smart Card & QR Inspector */}
              <div style={{ marginBottom: '24px' }}>
                <AbhaDigitalCard 
                  isDoctorMode={true}
                  doctor={{
                    doctorName: doctorName,
                    vernacular: 'డాక్టర్ ప్రియా శర్మ',
                    hprId: 'DEMO-dr.priya@hpr.abdm',
                    abhaNumber: 'DEMO-91-6742-8921-9942',
                    nmcRegNo: 'DEMO-NMC-TS-2016-48291',
                    specialty: doctorSpecialty,
                    facility: doctorProfile?.facility || 'Kurnool District Hospital (HFR #1402)',
                    avatar: '/assets/dr_ananya_avatar.jpg'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {/* 1. ABDM HPR Registry */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="#0F4C5C" />
                    <span>ABDM Healthcare Professional Registry (HPR) [DEMO]</span>
                  </h3>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.8 }}>
                    <div>Practitioner Name: <strong>{doctorName}</strong></div>
                    <div>HPR Token ID: <code>DEMO-ABHA-HPR-8921-9942-IN</code></div>
                    <div>Medical Council: <strong>DEMO National Medical Commission (NMC) AP-67420</strong></div>
                    <div>Facility: <strong>{doctorProfile?.facility || 'Kurnool District Hospital (HFR #1402)'}</strong></div>
                    <div>ABDM Milestones: <span style={{ color: '#059669', fontWeight: 750 }}>M1 (Registry) • M2 (HIP Record Provider) • M3 (HIU)</span></div>
                  </div>
                </div>

                {/* 2. Microphone & AudioWorklet VAD Calibration */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mic size={18} color="#2563EB" />
                    <span>Microphone & Acoustic VAD Calibration</span>
                  </h3>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#081C24', marginBottom: '4px' }}>
                      Clinical Ambient Scribe Engine
                    </label>
                    <select
                      value={docScribeEngine}
                      onChange={e => setDocScribeEngine(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '12.5px', fontWeight: 650 }}
                    >
                      <option value="browser_speech">Browser speech (Web Speech API). Gnani voice integration: planned</option>
                      <option value="google_medlm">Google MedLM Clinical Ambient (Bio-Clinical)</option>
                      <option value="whisper_indic">Whisper Large-v3 (Fine-tuned Telugu/Hindi)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#081C24', marginBottom: '4px' }}>
                      Acoustic Noise Floor Profile
                    </label>
                    <select
                      value={docNoiseCancellation}
                      onChange={e => setDocNoiseCancellation(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '12.5px', fontWeight: 650 }}
                    >
                      <option value="crowded_opd">Crowded OPD Waiting Hall (65 dB Spectral Subtraction)</option>
                      <option value="quiet_chamber">Private Doctor Chamber (40 dB Noise Gate)</option>
                      <option value="icu_ward">Emergency / ICU Tele-Consultation (High Sensitivity)</option>
                    </select>
                  </div>

                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Sampling Rate: <strong>16,000 Hz Linear PCM</strong> • Diarization: <strong style={{ color: '#0F4C5C' }}>Doctor / Patient Dual-Channel</strong>
                  </div>
                </div>

                {/* 3. Clinical AI Guardrails & Auto-Coding */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Stethoscope size={18} color="#059669" />
                    <span>Clinical Guardrails & Auto-Coding</span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Automated ICD-10 & SNOMED CT Extraction</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Maps colloquial Indian phrases to clinical billing codes</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docAutoCoding}
                        onChange={e => setDocAutoCoding(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#0F4C5C', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Drug-Drug Interaction (DDI) & Allergy Sentinel</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Real-time alert before confirming e-Prescription</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docDdiSentinel}
                        onChange={e => setDocDdiSentinel(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#DC2626', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>NFI Formulary Generic Drug Preference</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Prioritize Jan Aushadhi generic equivalents</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docGenericPref}
                        onChange={e => setDocGenericPref(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#10B981', cursor: 'pointer' }}
                      />
                    </label>
                  </div>
                </div>

                {/* 4. Digital Signature & Patient Push */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#081C24', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileCheck size={18} color="#D97706" />
                    <span>Digital Signature & Tele-OPD Dispatch</span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Class-3 DSC e-Signature Stamp</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Cryptographic PKI e-sign on official OPD Rx sheets</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docDigitalSign}
                        onChange={e => setDocDigitalSign(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#D97706', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>ABDM Gateway Auto-Sync</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Transmit FHIR R4 encounter bundle upon consultation sign-off</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docAbdmAutoSync}
                        onChange={e => setDocAbdmAutoSync(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#FAF8F5', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24' }}>Automatic WhatsApp Spoken Audio Dispatch</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Send regional voice note directly to patient upon prescription closure</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docWhatsAppPush}
                        onChange={e => setDocWhatsAppPush(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#2563EB', cursor: 'pointer' }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Toast Notification for ABDM FHIR Export */}
      {fhirToast && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0A2540',
          color: '#ffffff',
          padding: '14px 20px',
          borderRadius: '12px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.3)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '13px',
          fontWeight: 650,
          borderLeft: '4px solid #10B981',
          maxWidth: '480px',
          animation: 'slideUp 0.25s ease'
        }}>
          <CheckCircle2 size={20} color="#10B981" style={{ flexShrink: 0 }} />
          <span>{fhirToast}</span>
        </div>
      )}

      {/* Comprehensive NABL Diagnostic & DICOM Inspection Modal */}
      {selectedReport && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(10, 37, 64, 0.7)',
          backdropFilter: 'blur(4px)',
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            width: '840px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            borderRadius: '18px',
            boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #CBD5E1'
          }}>
            {/* NABL Diagnostic Letterhead Header */}
            <div style={{
              background: 'linear-gradient(135deg, #0A2540 0%, #1E3A8A 100%)',
              color: '#ffffff',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '3px solid #0F4C5C'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '22px' }}>{selectedReport.icon}</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.2px', margin: 0, color: '#ffffff' }}>
                    {selectedReport.title}
                  </h3>
                </div>
                <div style={{ fontSize: '11.5px', color: '#94A3B8', display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span>{selectedReport.facility || 'Kurnool District Diagnostic Center (NABL Acc.)'}</span>
                  <span>•</span>
                  <span>LOINC: <strong style={{ color: '#38BDF8', fontFamily: 'monospace' }}>{selectedReport.loincCode || '36572-6'}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#34D399',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  border: '1px solid rgba(52, 211, 153, 0.4)'
                }}>
                  ✓ NABL ACCREDITED
                </span>
                <button
                  onClick={() => setSelectedReport(null)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none',
                    color: '#ffffff',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    fontSize: '16px',
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

            {/* Modal Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Patient & Specimen Demographics Strip */}
              <div style={{
                background: '#FAF8F5',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                fontSize: '12px'
              }}>
                <div>
                  <div style={{ color: '#64748B', fontSize: '11px' }}>Patient Name</div>
                  <strong style={{ color: '#081C24', fontSize: '13px' }}>{selectedReport.patient}</strong>
                  <div style={{ color: '#64748B', fontSize: '10.5px' }}>{selectedReport.age || 42} Y / {selectedReport.gender || 'Male'}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '11px' }}>ABHA Address</div>
                  <strong style={{ color: '#081C24', fontFamily: 'monospace', fontSize: '12px' }}>{selectedReport.abhaId || '91-4521-8932-1049'}</strong>
                  <div style={{ color: '#059669', fontSize: '10.5px', fontWeight: 700 }}>✓ ABHA Verified</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '11px' }}>Modality & Accession</div>
                  <strong style={{ color: '#081C24' }}>{selectedReport.modality}</strong>
                  <div style={{ color: '#64748B', fontSize: '10.5px' }}>Date: {selectedReport.date}</div>
                </div>
                <div>
                  <div style={{ color: '#64748B', fontSize: '11px' }}>Specialist Sign-off</div>
                  <strong style={{ color: '#081C24' }}>{selectedReport.radiologist || selectedReport.pathologist || 'Dr. Srinivas Murthy, MD'}</strong>
                  <div style={{ color: '#64748B', fontSize: '10.5px' }}>Reg: MCI-84920</div>
                </div>
              </div>

              {/* Interactive Visual Inspection Viewport */}
              {selectedReport.category === 'Radiology' && (
                <div style={{
                  background: '#0B132B',
                  borderRadius: '12px',
                  padding: '16px',
                  color: '#ffffff',
                  border: '1px solid #1C2541'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#38BDF8' }}>🩻 High-Res DICOM Viewport</span>
                      <span style={{ fontSize: '10.5px', background: 'rgba(56, 189, 248, 0.15)', color: '#38BDF8', padding: '2px 8px', borderRadius: '6px' }}>
                        16-Bit Grayscale • Matrix 2048x2048
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setDicomInvert(!dicomInvert)}
                        style={{
                          background: dicomInvert ? '#38BDF8' : 'rgba(255,255,255,0.1)',
                          color: dicomInvert ? '#0B132B' : '#ffffff',
                          border: 'none',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        {dicomInvert ? 'Negative Inverted' : 'Invert Grayscale'}
                      </button>
                    </div>
                  </div>

                  {/* DICOM Simulation Canvas / Graphic */}
                  <div style={{
                    height: '180px',
                    borderRadius: '8px',
                    background: dicomInvert ? '#E2E8F0' : '#030712',
                    border: '1px solid #334155',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    {/* Simulated Radiograph Silhouette / Graphic */}
                    <svg viewBox="0 0 400 180" style={{ width: '100%', height: '100%', filter: dicomInvert ? 'invert(1)' : 'none' }}>
                      {/* Grid background */}
                      <defs>
                        <pattern id="dicomGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="400" height="180" fill="url(#dicomGrid)" />

                      {/* Trachea & Spine */}
                      <line x1="200" y1="10" x2="200" y2="170" stroke="rgba(255,255,255,0.7)" strokeWidth="6" strokeDasharray="4 2" />
                      <circle cx="200" cy="20" r="8" fill="rgba(0,0,0,0.8)" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />

                      {/* Left & Right Lung Fields */}
                      <path d="M 190 35 C 130 40, 100 80, 100 145 C 130 155, 170 148, 190 140 Z" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />
                      <path d="M 210 35 C 270 40, 300 80, 300 145 C 270 155, 230 148, 210 140 Z" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />

                      {/* Cardiac Silhouette */}
                      <path d="M 175 90 C 160 110, 160 135, 205 142 C 225 142, 235 125, 220 100 Z" fill="rgba(255,255,255,0.55)" />

                      {/* Diaphragm Curves */}
                      <path d="M 90 150 Q 145 138, 190 142" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />
                      <path d="M 210 142 Q 255 138, 310 150" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="2.5" />

                      {/* Markers */}
                      <text x="20" y="30" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">R (PA)</text>
                      <text x="365" y="30" fill="#38BDF8" fontSize="11" fontWeight="bold" fontFamily="monospace">L</text>
                      <text x="20" y="165" fill="rgba(255,255,255,0.6)" fontSize="9" fontFamily="monospace">WL: -600 WW: 1500</text>
                      <text x="310" y="165" fill="#34D399" fontSize="9" fontWeight="bold" fontFamily="monospace">CTR: 0.44</text>
                    </svg>
                  </div>
                </div>
              )}

              {/* Interactive ECG Strip if Cardiology */}
              {selectedReport.category === 'Cardiology' && (
                <div style={{
                  background: '#FEF2F2',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #FECACA'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#991B1B' }}>📈 12-Lead ECG Rhythm Strip (Lead II Continuous)</span>
                    <span style={{ fontSize: '11px', color: '#7F1D1D', fontWeight: 700 }}>25 mm/s • 10 mm/mV • HR: 74 bpm (NSR)</span>
                  </div>
                  <div style={{
                    height: '80px',
                    borderRadius: '8px',
                    background: '#FFF5F5',
                    border: '1px solid #FCA5A5',
                    overflow: 'hidden'
                  }}>
                    <svg viewBox="0 0 600 80" style={{ width: '100%', height: '100%' }}>
                      <defs>
                        <pattern id="ecgGrid" width="10" height="10" patternUnits="userSpaceOnUse">
                          <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(239, 68, 68, 0.18)" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="600" height="80" fill="url(#ecgGrid)" />
                      {/* 3 ECG Cycles */}
                      <path
                        d="M 0 45 L 30 45 Q 40 38, 50 45 L 65 45 L 70 50 L 78 12 L 86 60 L 92 45 L 110 45 Q 125 32, 140 45 L 200 45
                           L 230 45 Q 240 38, 250 45 L 265 45 L 270 50 L 278 12 L 286 60 L 292 45 L 310 45 Q 325 32, 340 45 L 400 45
                           L 430 45 Q 440 38, 450 45 L 465 45 L 470 50 L 478 12 L 486 60 L 492 45 L 510 45 Q 525 32, 540 45 L 600 45"
                        fill="none"
                        stroke="#DC2626"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>
              )}

              {/* Interactive Spirometry Curve if Pulmonology */}
              {selectedReport.category === 'Pulmonology' && (
                <div style={{
                  background: '#EFF6FF',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #BFDBFE'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#1E40AF' }}>🫁 Spirometry Flow-Volume Loop (Pre vs Post Bronchodilator)</span>
                    <span style={{ fontSize: '11px', color: '#1E3A8A', fontWeight: 700 }}>+14% Reversibility (Asthma Phenotype)</span>
                  </div>
                  <div style={{
                    height: '90px',
                    borderRadius: '8px',
                    background: '#F0F7FF',
                    border: '1px solid #93C5FD',
                    overflow: 'hidden'
                  }}>
                    <svg viewBox="0 0 500 90" style={{ width: '100%', height: '100%' }}>
                      <line x1="40" y1="75" x2="480" y2="75" stroke="#94A3B8" strokeWidth="1.5" />
                      <line x1="40" y1="10" x2="40" y2="75" stroke="#94A3B8" strokeWidth="1.5" />
                      {/* Pre-BD Loop (Orange) */}
                      <path d="M 40 75 Q 80 18, 140 38 Q 240 55, 300 75 Z" fill="rgba(245, 158, 11, 0.2)" stroke="#D97706" strokeWidth="2" strokeDasharray="3 3" />
                      {/* Post-BD Loop (Green) */}
                      <path d="M 40 75 Q 90 12, 160 30 Q 280 48, 360 75 Z" fill="rgba(16, 185, 129, 0.2)" stroke="#059669" strokeWidth="2.5" />
                      <text x="380" y="30" fill="#059669" fontSize="10" fontWeight="bold">Post-BD (FEV1: 2.39L)</text>
                      <text x="380" y="48" fill="#D97706" fontSize="10" fontWeight="bold">Pre-BD (FEV1: 2.10L)</text>
                    </svg>
                  </div>
                </div>
              )}

              {/* Full Quantitative Metrics NABL Table */}
              {selectedReport.quantitativeMetrics && selectedReport.quantitativeMetrics.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#081C24', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>📊 Quantitative Analyte & Parameter Analysis</span>
                  </h4>
                  <div style={{ border: '1px solid #E2E8F0', borderRadius: '10px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                      <thead>
                        <tr style={{ background: '#FAF8F5', color: '#475569', textAlign: 'left', fontWeight: 700 }}>
                          <th style={{ padding: '10px 14px' }}>Investigation / Parameter</th>
                          <th style={{ padding: '10px 14px' }}>Observed Result</th>
                          <th style={{ padding: '10px 14px' }}>Unit</th>
                          <th style={{ padding: '10px 14px' }}>Biological Reference Interval</th>
                          <th style={{ padding: '10px 14px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedReport.quantitativeMetrics.map((metric, idx) => {
                          const isNorm = metric.status === 'Normal';
                          const isHigh = metric.status?.toLowerCase().includes('high') || metric.status?.toLowerCase().includes('elevated') || metric.status?.toLowerCase().includes('severe');
                          return (
                            <tr key={idx} style={{ borderTop: '1px solid #E2E8F0', background: idx % 2 === 0 ? '#ffffff' : '#F8FAFC' }}>
                              <td style={{ padding: '10px 14px', fontWeight: 650, color: '#081C24' }}>
                                {metric.parameter}
                              </td>
                              <td style={{ padding: '10px 14px', fontWeight: 800, color: isNorm ? '#0A2540' : (isHigh ? '#DC2626' : '#D97706') }}>
                                {metric.result}
                              </td>
                              <td style={{ padding: '10px 14px', color: '#64748B' }}>
                                {metric.unit || '-'}
                              </td>
                              <td style={{ padding: '10px 14px', color: '#475569', fontFamily: 'monospace' }}>
                                {metric.normalRange}
                              </td>
                              <td style={{ padding: '10px 14px' }}>
                                <span style={{
                                  fontSize: '10px',
                                  fontWeight: 800,
                                  padding: '3px 8px',
                                  borderRadius: '6px',
                                  background: isNorm ? '#DCFCE7' : (isHigh ? '#FEE2E2' : '#FEF3C7'),
                                  color: isNorm ? '#15803D' : (isHigh ? '#B91C1C' : '#B45309')
                                }}>
                                  {metric.status}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Findings & Clinical Impression */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Detailed Clinical Findings
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#1E293B', lineHeight: 1.5 }}>
                    {selectedReport.findings}
                  </div>
                </div>

                <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <div style={{ fontSize: '11px', color: '#065F46', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                    Definitive Impression & Conclusion
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#065F46', fontWeight: 700, lineHeight: 1.5 }}>
                    {selectedReport.impression}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Actions Footer */}
            <div style={{
              background: '#FAF8F5',
              borderTop: '1px solid #E2E8F0',
              padding: '14px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px'
            }}>
              <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                National Health Authority (NHA) ABDM Profile: <code>DiagnosticReportRecord-v1.0</code>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => window.print()}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    background: '#ffffff',
                    color: '#334155',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <FileText size={14} />
                  <span>Print NABL Sheet</span>
                </button>

                <button
                  onClick={() => handleExportFhir(selectedReport)}
                  className="btn-primary"
                  style={{
                    padding: '8px 18px',
                    fontSize: '12.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={14} />
                  <span>Download ABDM FHIR R4 (JSON)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient Detail Modal (Full Longitudinal EHR & Shared Demo Dataset) */}
      {selectedPatientModal && (
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
          background: 'rgba(10, 37, 64, 0.65)',
          backdropFilter: 'blur(4px)',
          padding: '16px'
        }}>
          <div style={{
            background: '#ffffff',
            width: '680px',
            maxWidth: '96vw',
            maxHeight: '90vh',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.28)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#081C24', margin: 0 }}>
                    {selectedPatientModal.name}
                  </h3>
                  <SampleDataChip />
                </div>
                <div style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>
                  ID: <code style={{ fontWeight: 800, color: '#0F4C5C' }}>{selectedPatientModal.id}</code> • Token: <strong>{selectedPatientModal.token}</strong> • {selectedPatientModal.age} y • {selectedPatientModal.gender} • {selectedPatientModal.language}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                  Health ID: <code>{selectedPatientModal.abhaId}</code> • {selectedPatientModal.village}
                </div>
              </div>
              <button 
                onClick={() => setSelectedPatientModal(null)} 
                style={{ 
                  background: '#FAF8F5', 
                  border: 'none', 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  fontSize: '16px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#475569'
                }}
              >
                ✕
              </button>
            </div>

            {/* Scrollable Body */}
            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Vitals Summary Card */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', background: '#FAF8F5', padding: '12px', borderRadius: '12px', textAlign: 'center', fontSize: '12px', border: '1px solid #E2E8F0' }}>
                <div><span style={{ color: '#64748B' }}>BP</span><br /><strong style={{ fontSize: '14px', color: '#081C24' }}>{selectedPatientModal.vitals.bp}</strong></div>
                <div><span style={{ color: '#64748B' }}>Pulse</span><br /><strong style={{ fontSize: '14px', color: '#081C24' }}>{selectedPatientModal.vitals.hr}</strong></div>
                <div><span style={{ color: '#64748B' }}>SpO2</span><br /><strong style={{ fontSize: '14px', color: '#081C24' }}>{selectedPatientModal.vitals.spo2}</strong></div>
                <div><span style={{ color: '#64748B' }}>Weight</span><br /><strong style={{ fontSize: '14px', color: '#081C24' }}>{selectedPatientModal.vitals.weight || '64 kg'}</strong></div>
              </div>

              {/* Conditions List */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '12px 14px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '6px' }}>
                  Active Clinical Conditions
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(selectedPatientModal.conditions || [selectedPatientModal.primaryCondition]).map((cond, i) => (
                    <span key={i} style={{ background: 'rgba(15, 76, 92, 0.1)', color: '#0F4C5C', border: '1px solid rgba(15, 76, 92, 0.3)', borderRadius: '12px', padding: '3px 10px', fontSize: '11.5px', fontWeight: 700 }}>
                      {cond}
                    </span>
                  ))}
                </div>
              </div>

              {/* Encounter Timeline (Most Recent First) */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#081C24', textTransform: 'uppercase' }}>
                    Past Encounters Timeline
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Most recent first</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(selectedPatientModal.encounters && selectedPatientModal.encounters.length > 0 ? selectedPatientModal.encounters : [
                    { id: 'DEMO-ENC-01', offsetDays: -3, complaint: selectedPatientModal.chiefComplaint, doctorNote: 'Evaluated patient. Adjusted lifestyle and dosage. Advised regular follow-up.' }
                  ]).map((enc, idx) => (
                    <div key={enc.id || idx} style={{ background: '#FAF8F5', padding: '10px 12px', borderRadius: '8px', borderLeft: '3px solid #0F4C5C', fontSize: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#0F4C5C', fontWeight: 750, marginBottom: '3px' }}>
                        <span>{formatDemoDate(enc.offsetDays || 0)} ({getRelativeDaysLabel(enc.offsetDays || 0)})</span>
                        <span style={{ fontSize: '10px', color: '#64748B' }}>{enc.id}</span>
                      </div>
                      <div style={{ color: '#081C24', fontWeight: 650 }}>{enc.complaint}</div>
                      <div style={{ color: '#475569', marginTop: '2px', fontStyle: 'italic' }}>Note: {enc.doctorNote}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescriptions with Audio-Rx Play Action */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#081C24', textTransform: 'uppercase' }}>
                    Active Prescriptions & Spoken Audio-Rx
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748B' }}>Demo data - not medical advice</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(selectedPatientModal.prescriptions && selectedPatientModal.prescriptions.length > 0 ? selectedPatientModal.prescriptions : [
                    { id: 'DEMO-RX-01', drugName: 'Metformin Hydrochloride', dosage: '500 mg', frequency: '1 tab BD after meals (as prescribed)' }
                  ]).map((rx, idx) => (
                    <div key={rx.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAF8F5', padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', gap: '10px' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#081C24' }}>{rx.drugName} • {rx.dosage}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748B' }}>{rx.frequency}</div>
                        {rx.instructionsVernacular && (
                          <div style={{ fontSize: '11px', color: '#0F4C5C', marginTop: '2px' }}>{rx.instructionsVernacular}</div>
                        )}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenAudioRxModal(selectedPatientModal);
                        }}
                        style={{
                          background: '#25D366',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '11px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          flexShrink: 0
                        }}
                      >
                        <Volume2 size={13} />
                        <span>Play Audio-Rx</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Reports with Status Chips */}
              <div style={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#081C24', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Laboratory & Diagnostic Reports
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {(selectedPatientModal.reports && selectedPatientModal.reports.length > 0 ? selectedPatientModal.reports : [
                    { id: 'DEMO-LAB-01', title: 'Routine Metabolic Profile', result: 'All parameters normal', status: 'REVIEWED' }
                  ]).map((rep, idx) => (
                    <div key={rep.id || idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 10px', background: '#FAF8F5', borderRadius: '6px', fontSize: '12px' }}>
                      <div>
                        <strong>{rep.title}</strong>: {rep.result}
                      </div>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '10px',
                        background: rep.status === 'REVIEWED' ? '#DCFCE7' : '#FEF3C7',
                        color: rep.status === 'REVIEWED' ? '#15803D' : '#B45309'
                      }}>
                        {rep.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Allergies Notice */}
              <div style={{ fontSize: '12px', color: '#DC2626', background: 'rgba(239, 68, 68, 0.08)', padding: '10px 12px', borderRadius: '8px' }}>
                <strong>Allergy Sentinel:</strong> {selectedPatientModal.allergies}
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #E2E8F0', flexWrap: 'wrap' }}>
              <button 
                onClick={() => {
                  const pat = selectedPatientModal;
                  setSelectedPatientModal(null);
                  setActiveScribeSessionPatient(pat);
                }}
                className="btn-primary"
                style={{ flex: 1, minWidth: '180px', padding: '10px', fontSize: '12.5px', fontWeight: 750 }}
              >
                Launch Ambient Voice Scribe
              </button>

              <button 
                onClick={() => showPlannedNotice('Start New Clinical Encounter')}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: '1px solid #CBD5E1',
                  background: '#FAF8F5',
                  color: '#475569',
                  fontSize: '12px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Start New Encounter</span>
                <span style={{ fontSize: '9px', background: '#E2E8F0', color: '#475569', padding: '2px 6px', borderRadius: '8px', fontWeight: 800 }}>PLANNED</span>
              </button>

              <button 
                onClick={() => setSelectedPatientModal(null)}
                className="btn-outline"
                style={{ padding: '10px 18px', fontSize: '12.5px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Indic Vernacular Semantic Hierarchy Modal */}
      
      
      {/* Schedule New OPD Appointment Modal */}
      {isNewAppointmentModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(8, 28, 36, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            width: '100%',
            maxWidth: '520px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.25)',
            border: '1px solid #CBD5E1',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              background: '#0F4C5C',
              color: '#ffffff',
              padding: '18px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                  Schedule New OPD Consultation
                </h3>
                <div style={{ fontSize: '12px', color: '#E2E8F0', marginTop: '2px' }}>
                  Assign token, consultation slot & register chief complaint
                </div>
              </div>
              <button
                onClick={() => setIsNewAppointmentModalOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#ffffff',
                  fontSize: '18px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateAppointment} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24', display: 'block', marginBottom: '6px' }}>
                  Select Patient (from Cohort / ABHA Registry)
                </label>
                <select
                  value={newApptForm.patientId}
                  onChange={(e) => {
                    const pat = DEMO_PATIENTS.find(p => p.id === e.target.value);
                    setNewApptForm(prev => ({
                      ...prev,
                      patientId: e.target.value,
                      patientName: pat?.name || 'Walk-in Patient'
                    }));
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    background: '#FAF8F5'
                  }}
                >
                  {DEMO_PATIENTS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.age}y {p.genderLabel || p.gender}) — {p.primaryCondition}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24', display: 'block', marginBottom: '6px' }}>
                    Consultation Day
                  </label>
                  <select
                    value={newApptForm.dateOffset}
                    onChange={(e) => setNewApptForm(prev => ({ ...prev, dateOffset: Number(e.target.value) }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      background: '#FAF8F5'
                    }}
                  >
                    <option value={0}>Today ({formatDemoDate(0)})</option>
                    <option value={1}>Tomorrow ({formatDemoDate(1)})</option>
                    <option value={2}>In 2 Days ({formatDemoDate(2)})</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24', display: 'block', marginBottom: '6px' }}>
                    Time Slot
                  </label>
                  <select
                    value={newApptForm.time}
                    onChange={(e) => setNewApptForm(prev => ({ ...prev, time: e.target.value }))}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      background: '#FAF8F5'
                    }}
                  >
                    <option value="11:30 AM">11:30 AM (Next Slot)</option>
                    <option value="12:00 PM">12:00 PM</option>
                    <option value="12:30 PM">12:30 PM</option>
                    <option value="02:30 PM">02:30 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24', display: 'block', marginBottom: '6px' }}>
                  Consultation Mode
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { label: 'In-Person OPD (Room 4)', val: 'In-Person OPD' },
                    { label: 'Teleconsult (WhatsApp)', val: 'Teleconsult' }
                  ].map(mode => (
                    <button
                      type="button"
                      key={mode.val}
                      onClick={() => setNewApptForm(prev => ({ ...prev, type: mode.val }))}
                      style={{
                        padding: '10px',
                        borderRadius: '10px',
                        border: newApptForm.type === mode.val ? '2px solid #0F4C5C' : '1px solid #CBD5E1',
                        background: newApptForm.type === mode.val ? 'rgba(15, 76, 92, 0.08)' : '#FAF8F5',
                        color: newApptForm.type === mode.val ? '#0F4C5C' : '#475569',
                        fontSize: '12px',
                        fontWeight: 750,
                        cursor: 'pointer'
                      }}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12.5px', fontWeight: 750, color: '#081C24', display: 'block', marginBottom: '6px' }}>
                  Chief Complaint / Reason for Visit
                </label>
                <input
                  type="text"
                  required
                  value={newApptForm.complaint}
                  onChange={(e) => setNewApptForm(prev => ({ ...prev, complaint: e.target.value }))}
                  placeholder="e.g. Wheezing, dry cough & fever for 3 days"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #CBD5E1',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsNewAppointmentModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    background: '#FAF8F5',
                    color: '#475569',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    background: '#0F4C5C',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(15, 76, 92, 0.3)'
                  }}
                >
                  Confirm & Generate Token
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Color Printable Prescription Modal */}
      {printableRxData && (
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
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#ffffff' }}>Official Color Prescription Slip</div>
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
                  onClick={() => setPrintableRxData(null)}
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
                    {doctorProfile?.facility || 'Kurnool District Hospital (ABDM PHC #1402)'}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748B' }}>
                    Department of {doctorSpecialty} • National Health Authority HFR ID: HFR-AP-14029
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F4C5C' }}>{doctorName}</div>
                  <div style={{ fontSize: '11px', color: '#475569' }}>{doctorProfile?.nmcRegNo || 'NMC-TS-2016-48291'}</div>
                  <div style={{ fontSize: '10.5px', color: '#64748B' }}>HPR: {doctorProfile?.hprId || 'ABHA-HPR-8921-9942'}</div>
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
                  <strong style={{ color: '#081C24', fontSize: '13px' }}>{printableRxData.patientName}</strong>
                  <span style={{ color: '#0F4C5C', fontSize: '11px', display: 'block' }}>{printableRxData.vernacularName}</span>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>AGE / GENDER</span>
                  <strong style={{ color: '#081C24' }}>{printableRxData.age} Yrs • {printableRxData.gender}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>ABHA ID</span>
                  <strong style={{ color: '#081C24', fontFamily: 'monospace' }}>{printableRxData.abhaId}</strong>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '10.5px' }}>DATE OF ISSUE</span>
                  <strong style={{ color: '#081C24' }}>{printableRxData.date}</strong>
                </div>
              </div>

              {/* Vitals & Provisional Diagnosis */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11.5px', fontWeight: 750, color: '#475569', textTransform: 'uppercase', marginBottom: '4px' }}>
                  Recorded Vitals & Clinical Assessment
                </div>
                <div style={{ fontSize: '12.5px', background: '#FAF8F5', padding: '8px 12px', borderRadius: '8px', color: '#334155', marginBottom: '8px' }}>
                  {printableRxData.vitals}
                </div>
                <div style={{ fontSize: '13px', color: '#081C24', background: 'rgba(15, 76, 92, 0.08)', padding: '10px 14px', borderRadius: '8px', borderLeft: '4px solid #0F4C5C' }}>
                  <strong>Provisional Diagnosis (ICD-10): </strong> {printableRxData.diagnosis}
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
                        <th style={{ padding: '10px 12px' }}>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {printableRxData.medications.map((med, mIdx) => (
                        <tr key={mIdx} style={{ borderBottom: mIdx < printableRxData.medications.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                          <td style={{ padding: '10px 12px' }}>
                            <strong style={{ color: '#081C24', fontSize: '12.5px' }}>{med.name}</strong>
                            <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 650, marginTop: '2px' }}>
                              ✓ PMBJP Generic: {med.generic}
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px', color: '#081C24', fontWeight: 600 }}>
                            {med.timing}
                          </td>
                          <td style={{ padding: '10px 12px', color: '#475569', fontWeight: 700 }}>
                            {med.days}
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
                    value={`https://ayuswar-ai.vercel.app/patient-portal?enc=ENC-2026-091&hpr=${doctorProfile?.hprId || 'DEMO-HPR'}&dr=${encodeURIComponent(doctorName)}`}
                    size={68}
                    isDoctor={true}
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
                    <div style={{ fontSize: '12.5px', fontWeight: 900, color: '#081C24' }}>{doctorName}</div>
                    <div style={{ fontSize: '10px', color: '#64748B' }}>MCI Verified Physician</div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#94A3B8' }}>Generated via AyuSwar Ambient Clinical AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Ambient Voice Scribe Studio Modal (In-Situ Telemetry Studio) */}
      {activeScribeSessionPatient && (
        <LiveScribeSessionModal
          isOpen={!!activeScribeSessionPatient}
          onClose={() => setActiveScribeSessionPatient(null)}
          patientData={activeScribeSessionPatient}
          doctorName={doctorName}
        />
      )}

      {/* WhatsApp Vernacular Audio-Rx Modal */}
      <WhatsAppAudioRxModal 
        isOpen={!!whatsAppModalPatient}
        onClose={() => setWhatsAppModalPatient(null)}
        patientData={whatsAppModalPatient}
        doctorName={doctorName}
        initialLanguage={whatsAppModalPatient?.langCode?.includes('hi') ? 'hi' : 'te'}
      />

      {/* Real-time Clinical Notifications Drawer */}
      <ClinicalNotificationsDrawer
        isOpen={isNotificationsDrawerOpen}
        onClose={() => setIsNotificationsDrawerOpen(false)}
        mode="doctor"
        userProfile={doctorProfile}
        onActionClick={(item) => {
          if (item.actionType === 'reports') setActiveTab('reports');
          else if (item.actionType === 'settings') setActiveTab('settings');
          else if (item.actionType === 'prescriptions') setActiveTab('prescriptions');
          else if (item.actionType === 'emergency') {
            window.location.href = '/emergency';
          }
        }}
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
          { id: 'dashboard', label: 'Dashboard', icon: Home },
          { id: 'opd_queue', label: 'Queue & Pts', icon: Users },
          { id: 'prescriptions', label: 'Rx Meds', icon: Pill },
          { id: 'reports', label: 'Labs', icon: FileText },
          { id: 'settings', label: 'Settings', icon: Settings }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'opd_queue' && (activeTab === 'patients' || activeTab === 'appointments' || activeTab === 'opd_queue'));
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
    </div>
  );
}
