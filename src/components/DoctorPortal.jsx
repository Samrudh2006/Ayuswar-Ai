import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  FileText, 
  Search, 
  Bell, 
  ChevronDown, 
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
  LogOut
} from 'lucide-react';

/**
 * DoctorPortal Component — Complete Enterprise Physician Operating System
 * Faithfully implements Screenshot 1 + All 8 dedicated sidebar views:
 * 1. Dashboard (KPIs, OPD appointments, AI assistant, Analytics chart, Recent reports, Features)
 * 2. Patients (Full OPD registry, risk triage, ABHA IDs, longitudinal EHR & vitals)
 * 3. AI Assistant (Dedicated clinical co-pilot, GINA/ICMR guidelines, DDI checker, differential diagnosis)
 * 4. Appointments (OPD queue master, live token display, waiting times, triage priority)
 * 5. Reports & Lab (X-Ray DICOM viewer, CBC, Spirometry PFT, 12-lead ECG, ABDM FHIR R4 export)
 * 6. Prescriptions (Active e-Rx, NFI formulary checker, OpenCV blister OCR scanner, Timbre spoken-Rx)
 * 7. Clinical Library (WHO ICD-10 taxonomy, colloquial Indic symptom resolver, clinical protocols)
 * 8. Settings (ABDM HPR credentials, hospital facility #1402, WebAudio mic VAD calibration)
 */
export default function DoctorPortal({ 
  doctorProfile, 
  onSelectEncounterAndLaunch, 
  onOpenTechModal, 
  onLogoutDoctor, 
  registeredPatients = [] 
}) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsRange, setAnalyticsRange] = useState('weekly');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiCategory, setAiCategory] = useState('guidelines'); // 'guidelines' | 'ddi' | 'ddx' | 'vernacular'
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedPatientModal, setSelectedPatientModal] = useState(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [patientTriageFilter, setPatientTriageFilter] = useState('all');

  // Physician Settings State Suite
  const [docScribeEngine, setDocScribeEngine] = useState('gnani_prisma');
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

  // OPD Registry with domain tags
  const patientsList = [
    {
      id: 0,
      token: 'OPD-101',
      name: 'Narayana Rao',
      vernacular: 'నారాయణ రావు',
      age: 58,
      gender: 'Male',
      language: 'Telugu (Rayalaseema)',
      abhaId: '91-4521-8932-1049',
      chiefComplaint: 'Chest heaviness & Palpitations (గుండెల్లో దడ)',
      triage: 'Urgent',
      triageColor: '#D97706',
      vitals: { bp: '140/90', hr: '88 bpm', spo2: '96%', rbs: '168 mg/dL' },
      history: 'Known Type-2 Diabetes (7 yrs), Mild Hypertension. Smoker (quit 2 yrs ago).',
      allergies: 'Sulfa Drugs',
      encounterIndex: 0,
      domain: 'cardiometabolic'
    },
    {
      id: 1,
      token: 'OPD-102',
      name: 'Aarav Kumar',
      vernacular: 'आरव कुमार',
      age: 4,
      gender: 'Male',
      language: 'Hindi (Awadhi / UP)',
      abhaId: '91-8821-4432-9012',
      chiefComplaint: 'Pediatric Subcostal Retraction & Nocturnal Cough (पसली चलना)',
      triage: 'Critical',
      triageColor: '#EF4444',
      vitals: { bp: '95/62', hr: '124 bpm', spo2: '94%', temp: '101.4°F' },
      history: 'Recurrent wheezing since age 2. Mother reports persistent cough waking him at night.',
      allergies: 'None documented',
      encounterIndex: 1,
      domain: 'respiratory'
    },
    {
      id: 2,
      token: 'OPD-103',
      name: 'Ananya Rao',
      vernacular: 'అనన్య రావు',
      age: 28,
      gender: 'Female',
      language: 'Telugu / English',
      abhaId: '91-4521-8932-1049',
      chiefComplaint: 'Acute High-Grade Pyrexia & Dry Airway Wheeze',
      triage: 'Moderate',
      triageColor: '#3B82F6',
      vitals: { bp: '115/76', hr: '72 bpm', spo2: '99%', temp: '102.1°F' },
      history: 'Seasonal allergic rhinitis & bronchial sensitivity.',
      allergies: 'Penicillin (mild rash)',
      encounterIndex: 1,
      domain: 'respiratory'
    },
    {
      id: 3,
      token: 'OPD-104',
      name: 'Rohit Kumar',
      vernacular: 'रोहित कुमार',
      age: 42,
      gender: 'Male',
      language: 'Hindi',
      abhaId: '91-2391-0943-7721',
      chiefComplaint: 'Asthma Follow-up & Exercise Dyspnea',
      triage: 'Stable',
      triageColor: '#10B981',
      vitals: { bp: '122/80', hr: '78 bpm', spo2: '98%', rbs: '104 mg/dL' },
      history: 'Extrinsic bronchial asthma. Uses Budesonide inhaler.',
      allergies: 'Aspirin (Bronchospasm)',
      encounterIndex: 0,
      domain: 'respiratory'
    },
    {
      id: 4,
      token: 'OPD-105',
      name: 'Suresh Babu',
      vernacular: 'సురేష్ బాబు',
      age: 56,
      gender: 'Male',
      language: 'Telugu',
      abhaId: '91-5542-8812-3301',
      chiefComplaint: 'Type-2 Diabetes HbA1c Review & Dyslipidemia',
      triage: 'Stable',
      triageColor: '#10B981',
      vitals: { bp: '134/84', hr: '74 bpm', spo2: '98%', rbs: '142 mg/dL' },
      history: 'Type-2 Diabetes (11 yrs). On Metformin & Statin.',
      allergies: 'No known allergies',
      encounterIndex: 2,
      domain: 'cardiometabolic'
    },
    {
      id: 5,
      token: 'OPD-106',
      name: 'Meera Nair',
      vernacular: 'മീര നായർ',
      age: 34,
      gender: 'Female',
      language: 'Malayalam / English',
      abhaId: '91-6632-1923-4411',
      chiefComplaint: 'Post-viral productive cough & wheezing',
      triage: 'Moderate',
      triageColor: '#3B82F6',
      vitals: { bp: '118/74', hr: '82 bpm', spo2: '97%', temp: '99.1°F' },
      history: 'Mild allergic bronchitis. Non-smoker.',
      allergies: 'No known allergies',
      encounterIndex: 0,
      domain: 'respiratory'
    }
  ];

  const formattedRegistered = (registeredPatients || []).map((rp, idx) => ({
    id: `reg_${idx}`,
    token: `OPD-${201 + idx}`,
    name: rp.patientName,
    vernacular: rp.patientName,
    age: rp.age || 40,
    gender: rp.gender || 'Female',
    language: rp.language || 'Telugu',
    abhaId: rp.abhaId,
    chiefComplaint: `${rp.condition || 'Consultation'} (${rp.relation || 'Registered Citizen'})`,
    triage: 'Moderate',
    triageColor: '#3B82F6',
    vitals: rp.vitals || { bp: '120/80', hr: '76 bpm', spo2: '98%' },
    history: `Registered via Family Health Locker. Condition: ${rp.condition}`,
    allergies: 'None documented',
    encounterIndex: 0,
    domain: rp.domain || (rp.condition?.toLowerCase().includes('diabet') || rp.condition?.toLowerCase().includes('hypertens') ? 'cardiometabolic' : (rp.condition?.toLowerCase().includes('asthma') ? 'respiratory' : 'general'))
  }));

  const allPatients = [...formattedRegistered, ...patientsList];

  const domainPatients = allPatients.filter(p => {
    if (isRespiratoryDoctor) return p.domain === 'respiratory';
    if (isCardioDoctor) return p.domain === 'cardiometabolic';
    return true; // General sees all
  });

  const appointments = [
    {
      id: 0,
      patientName: 'Rohit Kumar',
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

  const recentReports = [
    { 
      id: 1, 
      title: 'Chest X-Ray (PA View)', 
      patient: 'Rohit Kumar', 
      date: '10 May 2025', 
      icon: '🩻', 
      modality: 'Radiology',
      findings: 'Lungs hyperinflated with flattening of hemidiaphragms. No focal consolidation, pneumothorax, or pleural effusion. Cardiac shadow normal.',
      impression: 'Features suggestive of chronic obstructive airway disease / bronchial asthma in remission.'
    },
    { 
      id: 2, 
      title: 'Complete Blood Count (CBC)', 
      patient: 'Ananya Rao', 
      date: '9 May 2025', 
      icon: '🩸', 
      modality: 'Pathology',
      findings: 'Hb: 12.4 g/dL (Normal: 12-15) | Total Leukocytes: 11,200 /mcL (Mild Leukocytosis) | Neutrophils: 76% | Platelets: 2.45 Lakhs | ESR: 22 mm/hr.',
      impression: 'Mild neutrophilic leukocytosis consistent with acute infectious or inflammatory etiology.'
    },
    { 
      id: 3, 
      title: 'Spirometry / Pulmonary Function Test', 
      patient: 'Meera Nair', 
      date: '8 May 2025', 
      icon: '🫁', 
      modality: 'Pulmonology',
      findings: 'FEV1: 2.10 L (78% of predicted) | FVC: 2.75 L (86% of predicted) | FEV1/FVC Ratio: 0.76 | Post-bronchodilator reversibility: +14% improvement.',
      impression: 'Mild reversible obstructive airway pattern responsive to inhaled short-acting beta2 agonists.'
    },
    { 
      id: 4, 
      title: '12-Lead Electrocardiogram (ECG)', 
      patient: 'Suresh Babu', 
      date: '7 May 2025', 
      icon: '📈', 
      modality: 'Cardiology',
      findings: 'Heart Rate: 74 bpm. Normal Sinus Rhythm. PR interval: 156 ms. QRS duration: 88 ms. QTc: 418 ms. No pathologic Q waves or ST-T elevation.',
      impression: 'Normal resting 12-lead electrocardiogram without ischemic changes.'
    }
  ];

  const [aiResponses, setAiResponses] = useState([
    {
      q: 'What are the latest treatment guidelines for mild asthma in adults?',
      a: 'Based on GINA 2025 Global Asthma Guidelines:\n• Track 1 (Preferred): As-needed low-dose ICS-formoterol is the first-line controller & reliever to reduce severe exacerbations.\n• Track 2: Daily low-dose inhaled corticosteroid (ICS) plus as-needed SABA.\n• Safety Alert: Never prescribe SABA alone without ICS due to increased risk of asthma-related death.'
    }
  ]);

  const handleAskAi = (e) => {
    e?.preventDefault();
    if (!aiPrompt.trim()) return;

    const newQuery = aiPrompt.trim();
    setAiPrompt('');

    let answer = `AyuSwar AI Clinical Recommendation for "${newQuery}":\n• Evaluated against India National Formulary (NFI) & WHO ICD-10 protocols.\n• In Tier-1/2/3 OPD environments: Ensure vitals stability, cross-verify CYP450 drug interactions, and generate patient spoken instructions in their native dialect.`;
    
    if (newQuery.toLowerCase().includes('diabetes') || newQuery.toLowerCase().includes('sugar') || newQuery.toLowerCase().includes('metformin')) {
      answer = 'ICMR Guidelines for Type-2 Diabetes:\n• First-Line Therapy: Metformin 500mg post-breakfast/post-dinner with gradual titration to 2000mg/day.\n• HbA1c Target: < 7.0% for healthy adults; individualized to < 7.5% in elderly patients.\n• Chronotherapy Instruction: Instruct patient to take Metformin strictly after food to reduce gastrointestinal irritation.';
    } else if (newQuery.toLowerCase().includes('cough') || newQuery.toLowerCase().includes('stridor') || newQuery.toLowerCase().includes('wheeze')) {
      answer = 'IISc Coswara Respiratory Analysis:\n• Pediatric nocturnal cough with chest in-drawing requires immediate nebulized budesonide (0.5mg) + salbutamol.\n• Spectral centroid analysis (>2.8 kHz) indicates active subcostal airway resistance.\n• Avoid oral antibiotics unless productive purulent sputum with documented bacterial pneumonia signs.';
    } else if (newQuery.toLowerCase().includes('ddi') || newQuery.toLowerCase().includes('interaction') || newQuery.toLowerCase().includes('nsaid')) {
      answer = 'Pharmacopeia DDI Sentinel:\n• Absolute Contraindication: Prescribing NSAIDs (e.g., Aceclofenac/Ibuprofen) in active peptic ulcer disease or with oral anticoagulants.\n• Recommendation: Switch to Paracetamol 650mg SOS or topical counter-irritants.';
    }

    setAiResponses(prev => [{ q: newQuery, a: answer }, ...prev]);
  };

  const filteredPatients = domainPatients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
                          p.token.toLowerCase().includes(patientSearchTerm.toLowerCase()) ||
                          p.chiefComplaint.toLowerCase().includes(patientSearchTerm.toLowerCase());
    const matchesTriage = patientTriageFilter === 'all' || p.triage.toLowerCase() === patientTriageFilter.toLowerCase();
    return matchesSearch && matchesTriage;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F7F9' }}>
      {/* =========================================================================
          LEFT SIDEBAR (MATCHING SCREENSHOT 1 DOCTOR SIDEBAR)
          ========================================================================= */}
      <aside style={{
        width: '240px',
        background: '#ffffff',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0
      }}>
        <div>
          {/* Brand Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', marginBottom: '32px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid #008B8B',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff'
            }}>
              <img src="/assets/ayuswar_logo.jpg" alt="AyuSwar AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0A2540' }}>
              Ayu<span style={{ color: '#008B8B' }}>Swar</span> <span style={{ color: '#008B8B' }}>AI</span>
            </div>
          </div>

          {/* Navigation Items (All 8 Sidebar Items) */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'patients', label: 'Patients', icon: Users },
              { id: 'ai_assistant', label: 'AI Assistant', icon: Sparkles },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'reports', label: 'Reports & Lab', icon: FileText },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
              { id: 'clinical_library', label: 'Clinical Library', icon: BookOpen },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? 'rgba(0, 139, 139, 0.1)' : 'transparent',
                    color: isActive ? '#008B8B' : '#475569',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontWeight: isActive ? 750 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 160ms ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#008B8B' : '#64748B'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Co-Pilot Card */}
        <div style={{
          background: 'linear-gradient(135deg, #E6F7F7 0%, #D1F2F2 100%)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #B2E5E5',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            color: '#0A2540',
            marginBottom: '4px'
          }}>
            AyuSwar AI
          </div>
          <div style={{ fontSize: '11px', color: '#006D6D', lineHeight: 1.4 }}>
            Your AI co-pilot for better healthcare
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN PHYSICIAN OPERATING CANVAS
          ========================================================================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{
          background: '#ffffff',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          {/* Universal Search Bar */}
          <div style={{ position: 'relative', width: '380px' }}>
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
                background: '#F8FAFC',
                fontSize: '13px',
                color: '#0F172A',
                outline: 'none'
              }}
            />
          </div>

          {/* Profile, Switcher & Logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', position: 'relative' }}>
            <div style={{ position: 'relative', cursor: 'pointer' }} title="2 Pending Critical Notifications">
              <Bell size={20} color="#64748B" />
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#EF4444',
                border: '1.5px solid #ffffff'
              }}></span>
            </div>

            {/* Single Doctor Login Badge (No Switcher) */}
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '6px 14px',
                borderRadius: '14px',
                background: 'rgba(0, 139, 139, 0.06)',
                border: '1.5px solid rgba(0, 139, 139, 0.22)'
              }}
              title="Verified Physician ABDM Session (Single Doctor Login)"
            >
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '2px solid #008B8B',
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
                  <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>{doctorName}</span>
                  <span style={{ fontSize: '9px', background: '#DCFCE7', color: '#166534', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    NMC VERIFIED
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#008B8B', fontWeight: 650 }}>
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
                    <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                      Good Morning, Dr. Priya
                    </h1>
                    <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      Here's what's happening with your patiwar today.
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
                  background: '#F8FAFC',
                  fontSize: '12.5px',
                  fontWeight: 650,
                  color: '#475569'
                }}>
                  <Calendar size={14} color="#008B8B" />
                  <span>Mon, 12 May 2025</span>
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
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0, 139, 139, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008B8B' }}>
                      <Users size={18} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Total Patients</div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 850, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>48</div>
                  <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 650, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={13} />
                    <span>↑ 12% vs. last week</span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                      <Calendar size={18} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Today's Appointments</div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 850, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>12</div>
                  <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 650, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={13} />
                    <span>↑ 2% vs. yesterday</span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                      <Activity size={18} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>AI Consultations</div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 850, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>8</div>
                  <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 650, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={13} />
                    <span>↑ 32% vs. last week</span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                      <FileText size={18} />
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Pending Reports</div>
                  </div>
                  <div style={{ fontSize: '28px', fontWeight: 850, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>5</div>
                  <div style={{ fontSize: '11.5px', color: '#EF4444', fontWeight: 650, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingDown size={13} />
                    <span>↓ 40% vs. last week</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Appointments + AI Assistant */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px', marginBottom: '24px' }}>
                {/* Today's Appointments */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                      Today's Appointments
                    </h3>
                    <span onClick={() => setActiveTab('appointments')} style={{ fontSize: '12.5px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {appointments.map(item => (
                      <div 
                        key={item.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '12px',
                          background: '#F8FAFC',
                          border: '1px solid #F1F5F9'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: '#E2E8F0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 700,
                            color: '#475569'
                          }}>
                            {item.patientName[0]}
                          </div>
                          <div>
                            <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#0A2540' }}>{item.patientName}</div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>{item.age} y • {item.gender}</div>
                          </div>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A2540' }}>{item.time}</div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>{item.type}</div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 750,
                            padding: '4px 10px',
                            borderRadius: '12px',
                            background: item.statusBg,
                            color: item.statusColor
                          }}>
                            {item.status}
                          </span>
                          {onSelectEncounterAndLaunch && (
                            <button
                              onClick={() => onSelectEncounterAndLaunch(item.encounterIndex)}
                              title="Launch AyuSwar Live Ambient Scribe Consultation"
                              style={{
                                background: '#008B8B',
                                border: 'none',
                                borderRadius: '8px',
                                color: '#ffffff',
                                padding: '6px 10px',
                                fontSize: '11px',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Mic size={12} />
                              <span>Scribe</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Clinical Assistant Widget */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                      AI Clinical Assistant
                    </h3>
                    <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', padding: '2px 6px', borderRadius: '8px', fontWeight: 800 }}>
                      New
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                    Ask about symptoms, guidelines, drug interactions and more.
                  </p>

                  <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
                    {aiResponses.map((res, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{
                          alignSelf: 'flex-end',
                          background: '#E6F7F7',
                          color: '#006D6D',
                          padding: '8px 12px',
                          borderRadius: '12px 12px 2px 12px',
                          fontSize: '12px',
                          fontWeight: 650,
                          maxWidth: '85%'
                        }}>
                          {res.q}
                        </div>
                        <div style={{
                          alignSelf: 'flex-start',
                          background: '#F8FAFC',
                          border: '1px solid #E2E8F0',
                          color: '#1E293B',
                          padding: '12px 14px',
                          borderRadius: '12px 12px 12px 2px',
                          fontSize: '12px',
                          lineHeight: 1.5,
                          whiteSpace: 'pre-line',
                          maxWidth: '95%'
                        }}>
                          {res.a}
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAskAi} style={{ display: 'flex', gap: '8px' }}>
                    <input 
                      type="text"
                      value={aiPrompt}
                      onChange={e => setAiPrompt(e.target.value)}
                      placeholder="Ask treatment guidelines or DDI conflicts..."
                      style={{
                        flex: 1,
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1.5px solid #E2E8F0',
                        fontSize: '12.5px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: '#0A2540',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '0 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Send size={13} />
                      <span>Ask</span>
                    </button>
                  </form>
                </div>
              </div>

              {/* Bottom Section: Analytics + Reports */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px', marginBottom: '28px' }}>
                {/* Patient Analytics */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                      Patient Analytics
                    </h3>
                    <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '10px' }}>
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
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#008B8B' }}></span>
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

                      <path d="M 40,120 Q 110,95 180,135 T 320,110 T 460,90 L 500,85" fill="none" stroke="#008B8B" strokeWidth="3" />
                      <path d="M 40,145 Q 110,135 180,120 T 320,95 T 460,75 L 500,80" fill="none" stroke="#3B82F6" strokeWidth="3" />

                      <circle cx="180" cy="135" r="4" fill="#008B8B" />
                      <circle cx="320" cy="110" r="4" fill="#008B8B" />
                      <circle cx="460" cy="90" r="4" fill="#008B8B" />

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
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                      Recent Reports
                    </h3>
                    <span onClick={() => setActiveTab('reports')} style={{ fontSize: '12.5px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {recentReports.map(rep => (
                      <div
                        key={rep.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 12px',
                          borderRadius: '12px',
                          background: '#F8FAFC',
                          border: '1px solid #F1F5F9'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '18px' }}>{rep.icon}</span>
                          <div>
                            <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>{rep.title}</div>
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
                            color: '#0A2540',
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
              TAB 2: PATIENTS (COMPREHENSIVE OPD REGISTRY & LONGITUDINAL EHR)
              --------------------------------------------------------------------- */}
          {activeTab === 'patients' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                    Outpatient Registry & EHR Records
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Manage patients, inspect ABHA digital health cards, and trigger ambient voice documentation.
                  </p>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['all', 'critical', 'urgent', 'moderate', 'stable'].map(tf => (
                    <button
                      key={tf}
                      onClick={() => setPatientTriageFilter(tf)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '20px',
                        border: 'none',
                        background: patientTriageFilter === tf ? '#0A2540' : '#E2E8F0',
                        color: patientTriageFilter === tf ? '#ffffff' : '#475569',
                        fontSize: '12px',
                        fontWeight: 700,
                        textTransform: 'capitalize',
                        cursor: 'pointer'
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Table Grid */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                        background: 'rgba(0, 139, 139, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '16px',
                        color: '#008B8B'
                      }}>
                        {pat.token.split('-')[1]}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>{pat.name}</span>
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
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedPatientModal(pat)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '10px',
                            border: '1.5px solid #CBD5E1',
                            background: '#ffffff',
                            color: '#0A2540',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          View EHR
                        </button>

                        <button
                          onClick={() => onSelectEncounterAndLaunch(pat.encounterIndex)}
                          style={{
                            padding: '8px 16px',
                            borderRadius: '10px',
                            border: 'none',
                            background: '#008B8B',
                            color: '#ffffff',
                            fontSize: '12px',
                            fontWeight: 750,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
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

          {/* ---------------------------------------------------------------------
              TAB 3: AI CLINICAL ASSISTANT (ADVANCED CO-PILOT VIEW)
              --------------------------------------------------------------------- */}
          {activeTab === 'ai_assistant' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={22} color="#008B8B" />
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                    AI Clinical Co-Pilot & Decision Support
                  </h2>
                </div>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Evidence-based clinical assistance calibrated for Indian healthcare guidelines (ICMR, GINA, WHO ICD-10, NFI).
                </p>
              </div>

              {/* Modes Pill Selector */}
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {[
                  { id: 'guidelines', label: 'Clinical Guidelines (GINA / ICMR)' },
                  { id: 'ddi', label: 'Drug Contraindications & CYP450' },
                  { id: 'ddx', label: 'Differential Diagnosis (DDx)' },
                  { id: 'vernacular', label: 'Indic Semantic Translation' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setAiCategory(cat.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '10px',
                      border: aiCategory === cat.id ? '1.5px solid #008B8B' : '1px solid #E2E8F0',
                      background: aiCategory === cat.id ? 'rgba(0, 139, 139, 0.08)' : '#ffffff',
                      color: aiCategory === cat.id ? '#008B8B' : '#64748B',
                      fontSize: '12.5px',
                      fontWeight: 750,
                      cursor: 'pointer'
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Chat Thread */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                minHeight: '440px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', overflowY: 'auto' }}>
                  {aiResponses.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{
                        alignSelf: 'flex-end',
                        background: '#0A2540',
                        color: '#ffffff',
                        padding: '10px 16px',
                        borderRadius: '14px 14px 2px 14px',
                        fontSize: '13px',
                        fontWeight: 650,
                        maxWidth: '80%'
                      }}>
                        {item.q}
                      </div>

                      <div style={{
                        alignSelf: 'flex-start',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        padding: '16px 20px',
                        borderRadius: '14px 14px 14px 2px',
                        fontSize: '13.5px',
                        color: '#1E293B',
                        lineHeight: 1.6,
                        whiteSpace: 'pre-line',
                        maxWidth: '90%'
                      }}>
                        {item.a}
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleAskAi} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <input 
                    type="text"
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder="Enter clinical symptoms, medication names, or dosage queries..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13.5px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#008B8B',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0 24px',
                      fontSize: '13.5px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Send size={16} />
                    <span>Query AI</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 4: APPOINTMENTS (OPD QUEUE MASTER & TOKEN MANAGER)
              --------------------------------------------------------------------- */}
          {activeTab === 'appointments' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                    OPD Consultation Queue & Schedules
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Real-time outpatient queue management for Kurnool District Hospital OPD.
                  </p>
                </div>

                <div style={{
                  padding: '8px 16px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '20px',
                  color: '#065F46',
                  fontSize: '12.5px',
                  fontWeight: 750
                }}>
                  Now Serving: Token #OPD-102 (Aarav Kumar)
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Checked-in Waiting</div>
                  <div style={{ fontSize: '24px', fontWeight: 850, color: '#0A2540', marginTop: '4px' }}>7 Patients</div>
                  <div style={{ fontSize: '11px', color: '#D97706', marginTop: '2px' }}>Avg wait: 14 mins</div>
                </div>

                <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Completed Today</div>
                  <div style={{ fontSize: '24px', fontWeight: 850, color: '#10B981', marginTop: '4px' }}>21 Patients</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Time saved: 2.8 hrs</div>
                </div>

                <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Scheduled Slots</div>
                  <div style={{ fontSize: '24px', fontWeight: 850, color: '#3B82F6', marginTop: '4px' }}>35 Total</div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>Shift ends 02:00 PM</div>
                </div>
              </div>

              {/* Appointments List */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px' }}>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '16px' }}>
                  Live Queue Sequence
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {patientsList.map(item => (
                    <div
                      key={item.id}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '12px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#008B8B', fontFamily: 'monospace' }}>
                          {item.token}
                        </span>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 750, color: '#0A2540' }}>{item.name}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>{item.chiefComplaint}</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '10px', background: `${item.triageColor}18`, color: item.triageColor }}>
                          {item.triage}
                        </span>

                        <button
                          onClick={() => onSelectEncounterAndLaunch(item.encounterIndex)}
                          style={{
                            padding: '6px 14px',
                            borderRadius: '8px',
                            background: '#0A2540',
                            color: '#ffffff',
                            border: 'none',
                            fontSize: '11.5px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Call to Room 1
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 5: REPORTS & LAB (DIAGNOSTIC & RADIOLOGY HUB)
              --------------------------------------------------------------------- */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  Diagnostic Pathology & Imaging Hub
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Inspect lab results, chest X-rays, spirometry PFT curves, and export verified ABDM FHIR R4 documents.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '18px' }}>
                {recentReports.map(rep => (
                  <div
                    key={rep.id}
                    style={{
                      background: '#ffffff',
                      borderRadius: '16px',
                      padding: '22px',
                      border: '1px solid #E2E8F0',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '24px' }}>{rep.icon}</span>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>{rep.title}</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>{rep.modality} • {rep.date}</div>
                        </div>
                      </div>
                      <span style={{ fontSize: '10px', background: '#E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                        {rep.patient}
                      </span>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '12.5px', color: '#334155', lineHeight: 1.5, marginBottom: '14px' }}>
                      <strong>Findings:</strong> {rep.findings}
                    </div>

                    <div style={{ fontSize: '12px', color: '#059669', fontWeight: 700, marginBottom: '14px' }}>
                      Impression: {rep.impression}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setSelectedReport(rep)}
                        style={{
                          flex: 1,
                          padding: '7px',
                          borderRadius: '8px',
                          border: '1.5px solid #008B8B',
                          background: 'transparent',
                          color: '#008B8B',
                          fontSize: '12px',
                          fontWeight: 750,
                          cursor: 'pointer'
                        }}
                      >
                        Inspect DICOM / Lab Data
                      </button>

                      <button
                        onClick={() => alert(`ABDM FHIR R4 DiagnosticReport bundle serialized for ${rep.patient} (${rep.title}). Ready for Health Information Exchange (HIE).`)}
                        style={{
                          padding: '7px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: '#0A2540',
                          color: '#ffffff',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Export FHIR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 6: PRESCRIPTIONS (E-RX, NFI FORMULARY & BLISTER SCANNER)
              --------------------------------------------------------------------- */}
          {activeTab === 'prescriptions' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  E-Prescriptions, Formulary & Blister OCR
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Digitally sign clinical regimens, cross-verify against the National Formulary of India (NFI), and synthesize spoken audio.
                </p>
              </div>

              {/* Active Prescriptions Table */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', marginBottom: '22px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px' }}>
                  Today's Active Regimens
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { id: 1, patient: 'Narayana Rao', med: 'Pantoprazole 40mg + Metformin 500mg', schedule: 'Early Morning (06:30 AM) + Post-dinner (08:30 PM)', status: 'Active • Timbre Telugu Synthesized' },
                    { id: 2, patient: 'Aarav Kumar', med: 'Budesonide Nebulization (0.5mg) + Salbutamol', schedule: 'BD (Morning 08:30 AM & Night 08:30 PM)', status: 'Active • Timbre Hindi Synthesized' },
                    { id: 3, patient: 'Rohit Kumar', med: 'Budesonide Formoterol Inhaler (200/6mcg)', schedule: '2 Puffs BD with saline mouth rinse', status: 'Active • Verified' }
                  ].map(rx => (
                    <div
                      key={rx.id}
                      style={{
                        padding: '14px 18px',
                        borderRadius: '12px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>{rx.patient}</div>
                        <div style={{ fontSize: '13px', color: '#008B8B', fontWeight: 700, marginTop: '2px' }}>{rx.med}</div>
                        <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>Timing: {rx.schedule}</div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: '11px', color: '#059669', background: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
                          {rx.status}
                        </span>
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
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  Clinical Library & Indic Vernacular Ontology
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Direct translation matrix from regional Indian colloquial expressions to WHO ICD-10 & SNOMED-CT standards.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  {[
                    { vernacular: 'గుండెల్లో దడ (Gundello Dada)', lang: 'Telugu', clinical: 'Palpitations & Cardiac Flutter', icd: 'ICD-10: R00.2', snomed: 'SNOMED: 80313002' },
                    { vernacular: 'పసలీ చల్నా (Pasli Chalna)', lang: 'Hindi', clinical: 'Subcostal Retraction / Dyspnea', icd: 'ICD-10: R06.02', snomed: 'SNOMED: 267036007' },
                    { vernacular: 'తల దిమ్ము (Tala Dimmu)', lang: 'Telugu', clinical: 'Vascular Vertigo & Lightheadedness', icd: 'ICD-10: R42', snomed: 'SNOMED: 404640003' },
                    { vernacular: 'छाती में जकड़न (Chhati me Jakdan)', lang: 'Hindi', clinical: 'Bronchial Spasm & Chest Tightness', icd: 'ICD-10: R07.89', snomed: 'SNOMED: 29857009' }
                  ].map((item, idx) => (
                    <div key={idx} style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#008B8B' }}>{item.vernacular}</div>
                      <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>Region: {item.lang}</div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A2540' }}>{item.clinical}</div>
                      <div style={{ fontSize: '11.5px', color: '#475569', marginTop: '6px' }}>
                        <code>{item.icd}</code> • <code>{item.snomed}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 8: SETTINGS (ABDM HPR CREDENTIALS & HARDWARE CALIBRATION)
              --------------------------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div>
              <div style={{ 
                background: 'linear-gradient(135deg, #0A2540 0%, #1E3A8A 50%, #008B8B 100%)', 
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
                      background: 'rgba(0, 139, 139, 0.3)', 
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
                    Configure ambient acoustic ingestion, Gnani.ai Prisma v2.5 voice models, automated ICD-10/SNOMED coding, and Class-3 DSC digital prescription signing.
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

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {/* 1. ABDM HPR Registry */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} color="#008B8B" />
                    <span>ABDM Healthcare Professional Registry (HPR)</span>
                  </h3>
                  <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.8 }}>
                    <div>Practitioner Name: <strong>{doctorName}</strong></div>
                    <div>HPR Token ID: <code>ABHA-HPR-8921-9942-IN</code></div>
                    <div>Medical Council: <strong>National Medical Commission (NMC) AP-67420</strong></div>
                    <div>Facility: <strong>{doctorProfile?.facility || 'Kurnool District Hospital (HFR #1402)'}</strong></div>
                    <div>ABDM Milestones: <span style={{ color: '#059669', fontWeight: 750 }}>M1 (Registry) • M2 (HIP Record Provider) • M3 (HIU)</span></div>
                  </div>
                </div>

                {/* 2. Microphone & AudioWorklet VAD Calibration */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mic size={18} color="#2563EB" />
                    <span>Microphone & Acoustic VAD Calibration</span>
                  </h3>
                  
                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0A2540', marginBottom: '4px' }}>
                      Clinical Ambient Scribe Engine
                    </label>
                    <select
                      value={docScribeEngine}
                      onChange={e => setDocScribeEngine(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1.5px solid #CBD5E1', fontSize: '12.5px', fontWeight: 650 }}
                    >
                      <option value="gnani_prisma">Gnani.ai Prisma v2.5 (Sub-dialectal Indic Model)</option>
                      <option value="google_medlm">Google MedLM Clinical Ambient (Bio-Clinical)</option>
                      <option value="whisper_indic">Whisper Large-v3 (Fine-tuned Telugu/Hindi)</option>
                    </select>
                  </div>

                  <div style={{ marginBottom: '12px' }}>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#0A2540', marginBottom: '4px' }}>
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
                    Sampling Rate: <strong>16,000 Hz Linear PCM</strong> • Diarization: <strong style={{ color: '#008B8B' }}>Doctor / Patient Dual-Channel</strong>
                  </div>
                </div>

                {/* 3. Clinical AI Guardrails & Auto-Coding */}
                <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px', border: '1px solid #E2E8F0' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Stethoscope size={18} color="#059669" />
                    <span>Clinical Guardrails & Auto-Coding</span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#0A2540' }}>Automated ICD-10 & SNOMED CT Extraction</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Maps colloquial Indian phrases to clinical billing codes</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docAutoCoding}
                        onChange={e => setDocAutoCoding(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#008B8B', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#0A2540' }}>Drug-Drug Interaction (DDI) & Allergy Sentinel</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Real-time alert before confirming e-Prescription</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docDdiSentinel}
                        onChange={e => setDocDdiSentinel(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#DC2626', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#0A2540' }}>NFI Formulary Generic Drug Preference</div>
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
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileCheck size={18} color="#D97706" />
                    <span>Digital Signature & Tele-OPD Dispatch</span>
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#0A2540' }}>Class-3 DSC e-Signature Stamp</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Cryptographic PKI e-sign on official OPD Rx sheets</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docDigitalSign}
                        onChange={e => setDocDigitalSign(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#D97706', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#0A2540' }}>ABDM Gateway Auto-Sync</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Transmit FHIR R4 encounter bundle upon consultation sign-off</div>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={docAbdmAutoSync}
                        onChange={e => setDocAbdmAutoSync(e.target.checked)}
                        style={{ width: '18px', height: '18px', accentColor: '#059669', cursor: 'pointer' }}
                      />
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '10px', background: '#F8FAFC', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                      <div>
                        <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#0A2540' }}>Automatic WhatsApp Spoken Audio Dispatch</div>
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

      {/* Report Modal */}
      {selectedReport && (
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
          background: 'rgba(10, 37, 64, 0.5)'
        }}>
          <div style={{ background: '#ffffff', width: '520px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{selectedReport.icon}</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540' }}>{selectedReport.title}</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '12px' }}>
              Patient: <strong>{selectedReport.patient}</strong> • Modality: {selectedReport.modality} • Date: {selectedReport.date}
            </div>
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '13px', lineHeight: 1.5, color: '#1E293B', marginBottom: '12px' }}>
              <strong>Clinical Findings:</strong><br />
              {selectedReport.findings}
            </div>
            <div style={{ background: 'rgba(16, 185, 129, 0.08)', padding: '12px', borderRadius: '10px', fontSize: '12.5px', color: '#065F46', fontWeight: 650 }}>
              <strong>Impression:</strong> {selectedReport.impression}
            </div>
            <button 
              onClick={() => setSelectedReport(null)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '18px', padding: '10px', fontSize: '13px' }}
            >
              Close Diagnostic Inspector
            </button>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
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
          background: 'rgba(10, 37, 64, 0.5)'
        }}>
          <div style={{ background: '#ffffff', width: '560px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540' }}>{selectedPatientModal.name} ({selectedPatientModal.vernacular})</h3>
                <div style={{ fontSize: '12px', color: '#64748B' }}>Token: <strong>{selectedPatientModal.token}</strong> • ABHA: <code>{selectedPatientModal.abhaId}</code></div>
              </div>
              <button onClick={() => setSelectedPatientModal(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', background: '#F8FAFC', padding: '12px', borderRadius: '10px', marginBottom: '14px', textAlign: 'center', fontSize: '12px' }}>
              <div>BP<br /><strong>{selectedPatientModal.vitals.bp}</strong></div>
              <div>HR<br /><strong>{selectedPatientModal.vitals.hr}</strong></div>
              <div>SpO2<br /><strong>{selectedPatientModal.vitals.spo2}</strong></div>
              <div>Triage<br /><strong style={{ color: selectedPatientModal.triageColor }}>{selectedPatientModal.triage}</strong></div>
            </div>

            <div style={{ fontSize: '13px', color: '#1E293B', lineHeight: 1.5, marginBottom: '10px' }}>
              <strong>Chief Complaint:</strong> {selectedPatientModal.chiefComplaint}
            </div>

            <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.5, marginBottom: '10px' }}>
              <strong>Medical History:</strong> {selectedPatientModal.history}
            </div>

            <div style={{ fontSize: '12.5px', color: '#DC2626', background: 'rgba(239, 68, 68, 0.08)', padding: '10px', borderRadius: '8px', marginBottom: '16px' }}>
              <strong>Allergy Sentinel:</strong> {selectedPatientModal.allergies}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => {
                  const encIdx = selectedPatientModal.encounterIndex;
                  setSelectedPatientModal(null);
                  onSelectEncounterAndLaunch(encIdx);
                }}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '13px' }}
              >
                Launch Ambient Voice Scribe
              </button>
              <button 
                onClick={() => setSelectedPatientModal(null)}
                className="btn-outline"
                style={{ padding: '10px 18px', fontSize: '13px' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
