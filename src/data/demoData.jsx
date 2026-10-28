import React from 'react';

/**
 * AyuSwar AI — Shared Realistic Demo Dataset (demoData.jsx)
 * 
 * Strict Honesty & Integrity Principles:
 * 1. All records and entities are explicitly fictional and prefixed with "DEMO-".
 * 2. All calendar dates are computed dynamically at runtime relative to new Date().
 * 3. Never contains hardcoded past years/months (no static "12 May 2025").
 * 4. Prescriptions use standard generic molecules with clear non-clinical demo notices.
 * 5. Provides the unified, consistent single source of truth for both Doctor and Patient portals.
 */

// --- Runtime Relative Date Utility Helpers ---

export function getRuntimeDate(offsetDays = 0, hour = 10, minute = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  d.setHours(hour, minute, 0, 0);
  return d;
}

export function formatDemoDate(offsetDays = 0, options = {}) {
  const d = getRuntimeDate(offsetDays);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options
  });
}

export function formatDemoTime(hour = 10, minute = 0) {
  const d = new Date();
  d.setHours(hour, minute, 0, 0);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function getRelativeDaysLabel(offsetDays = 0) {
  if (offsetDays === 0) return 'Today';
  if (offsetDays === -1) return 'Yesterday';
  if (offsetDays === 1) return 'Tomorrow';
  if (offsetDays < 0) return `${Math.abs(offsetDays)} days ago`;
  return `In ${offsetDays} days`;
}

// --- Reusable Honest Sample Data Badge ---

export function SampleDataChip({ style = {}, text = 'Sample data' }) {
  return (
    <span
      className="sample-data-chip"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '10.5px',
        fontWeight: 750,
        color: '#475569',
        background: '#FAF8F5',
        border: '1px solid #CBD5E1',
        padding: '2px 8px',
        borderRadius: '12px',
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
        verticalAlign: 'middle',
        userSelect: 'none',
        ...style
      }}
      title="Fictional synthetic record for research demonstration"
    >
      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#94A3B8' }} />
      <span>{text}</span>
    </span>
  );
}

// --- 8 Fictional Indian Patients Across Regions ---

export const DEMO_PATIENTS = [
  {
    id: 'DEMO-P001',
    name: 'Lakshmi Amma (fictional)',
    age: 58,
    gender: 'F',
    genderLabel: 'Female',
    phone: '+91-9XXX-XXX-001',
    village: 'Guntur Rural PHC Catchment',
    language: 'Telugu (తెలుగు)',
    langCode: 'te',
    abhaId: '91-4521-8932-1001',
    abhaNumber: '91-4521-8932-1001',
    abhaAddress: 'lakshmi.amma@abdm',
    hprId: 'HPR-IN-2024-99824',
    doctorName: 'Dr. Priya Sharma, MD',
    hfrId: 'HFR-AP-KRN-0042',
    facilityName: 'Guntur Rural Model PHC',
    icd10: 'E11.9',
    icd10Desc: 'Type 2 Diabetes Mellitus without complications',
    snomedCt: '44054006',
    snomedDesc: 'Type 2 diabetes mellitus (disorder)',
    conditions: ['Type 2 Diabetes Mellitus', 'Essential Hypertension'],
    primaryCondition: 'Type 2 Diabetes Mellitus',
    lastVisitOffset: -3,
    nextVisitOffset: 1,
    avatar: '👵',
    bloodGroup: 'B+',
    allergies: ['Penicillin (mild rash)'],
    vitalsHistory: [
      { offsetDays: 0, bp: '132/84 mmHg', pulse: '76 bpm', weight: '63 kg', spo2: '98%' },
      { offsetDays: -14, bp: '138/88 mmHg', pulse: '78 bpm', weight: '63.5 kg', spo2: '97%' },
      { offsetDays: -45, bp: '144/92 mmHg', pulse: '82 bpm', weight: '64 kg', spo2: '97%' }
    ],
    encounters: [
      {
        id: 'DEMO-ENC-101',
        offsetDays: -3,
        complaint: 'Early morning dizziness and mild numbness in feet',
        doctorNote: 'Fasting capillary blood glucose 142 mg/dL. Adjusted evening dosage. Emphasized walking and diabetic foot care.',
        status: 'Completed',
        icd10: 'E11.9',
        snomedCt: '44054006',
        hprId: 'HPR-IN-2024-99824',
        hfrId: 'HFR-AP-KRN-0042'
      },
      {
        id: 'DEMO-ENC-102',
        offsetDays: -45,
        complaint: 'Routine quarterly chronic care review and prescription refill',
        doctorNote: 'Blood pressure slightly above target. Reinforced low-salt diet and compliance tracking via vernacular audio notes.',
        status: 'Completed',
        icd10: 'I10',
        snomedCt: '38341003',
        hprId: 'HPR-IN-2024-99824',
        hfrId: 'HFR-AP-KRN-0042'
      }
    ],
    prescriptions: [
      {
        id: 'DEMO-RX-101',
        drugName: 'Metformin Hydrochloride (Prolonged Release)',
        dosage: '500 mg',
        frequency: '1 tablet twice daily after meals (as prescribed)',
        duration: '30 days',
        instructionsVernacular: 'ఉదయం మరియు రాత్రి భోజనం తర్వాత మాత్ర తీసుకోండి. (Take after food morning & night)',
        offsetDays: -3,
        notes: 'Demo data - not medical advice.'
      },
      {
        id: 'DEMO-RX-102',
        drugName: 'Telmisartan Tablets IP',
        dosage: '40 mg',
        frequency: '1 tablet once daily morning (as prescribed)',
        duration: '30 days',
        instructionsVernacular: 'ఉదయం టిఫిన్ తర్వాత ఒక మాత్ర. (One tablet daily after breakfast)',
        offsetDays: -3,
        notes: 'Demo data - not medical advice.'
      }
    ],
    reports: [
      {
        id: 'DEMO-LAB-101',
        title: 'Glycated Hemoglobin (HbA1c)',
        result: '7.1% (Controlled)',
        offsetDays: -3,
        status: 'REVIEWED',
        facility: 'Guntur District Diagnostic Centre'
      },
      {
        id: 'DEMO-LAB-102',
        title: 'Serum Creatinine & eGFR',
        result: '0.9 mg/dL (Normal)',
        offsetDays: -3,
        status: 'REVIEWED',
        facility: 'Guntur District Diagnostic Centre'
      }
    ]
  },
  {
    id: 'DEMO-P002',
    name: 'Ramesh Patel (fictional)',
    age: 48,
    gender: 'M',
    genderLabel: 'Male',
    phone: '+91-9XXX-XXX-002',
    village: 'Mehsana Sub-district',
    language: 'Hindi (हिन्दी)',
    langCode: 'hi',
    abhaId: '91-8842-1923-1002',
    abhaNumber: '91-8842-1923-1002',
    abhaAddress: 'ramesh.patel@abdm',
    hprId: 'HPR-IN-2024-99824',
    doctorName: 'Dr. Priya Sharma, MD',
    hfrId: 'HFR-GJ-MSH-0018',
    facilityName: 'Mehsana Model CHC',
    icd10: 'J45.901',
    icd10Desc: 'Bronchial Asthma with acute exacerbation',
    snomedCt: '195967001',
    snomedDesc: 'Asthma (disorder)',
    conditions: ['Chronic Bronchial Asthma', 'Seasonal Cough'],
    primaryCondition: 'Chronic Bronchial Asthma',
    lastVisitOffset: -7,
    nextVisitOffset: 0, // Today!
    avatar: '👨',
    bloodGroup: 'O+',
    allergies: ['Dust mites', 'Cold air trigger'],
    vitalsHistory: [
      { offsetDays: 0, bp: '124/80 mmHg', pulse: '82 bpm', weight: '71 kg', spo2: '96%' },
      { offsetDays: -7, bp: '126/82 mmHg', pulse: '88 bpm', weight: '71 kg', spo2: '95%' },
      { offsetDays: -30, bp: '120/78 mmHg', pulse: '76 bpm', weight: '70.5 kg', spo2: '98%' }
    ],
    encounters: [
      {
        id: 'DEMO-ENC-201',
        offsetDays: -7,
        complaint: 'Nocturnal cough and wheezing after seasonal temperature drop',
        doctorNote: 'Bilateral mild expiratory wheeze. Inhalation technique demonstrated. Advised warm water gargles and spacer device.',
        status: 'Completed',
        icd10: 'J45.901',
        snomedCt: '195967001',
        hprId: 'HPR-IN-2024-99824',
        hfrId: 'HFR-GJ-MSH-0018'
      }
    ],
    prescriptions: [
      {
        id: 'DEMO-RX-201',
        drugName: 'Budesonide + Formoterol Inhalation Powder',
        dosage: '200 mcg / 6 mcg per actuation',
        frequency: '2 puffs twice daily with spacer (as prescribed)',
        duration: '30 days',
        instructionsVernacular: 'सुबह और शाम 2 कश लें। मुंह को पानी से कुल्ला करें। (Rinse mouth after inhalation)',
        offsetDays: -7,
        notes: 'Demo data - not medical advice.'
      }
    ],
    reports: [
      {
        id: 'DEMO-LAB-201',
        title: 'Peak Expiratory Flow Rate (PEFR)',
        result: '390 L/min (Amber Zone)',
        offsetDays: -7,
        status: 'REVIEWED',
        facility: 'Mehsana Community Health Centre'
      },
      {
        id: 'DEMO-LAB-202',
        title: 'Complete Blood Count with Absolute Eosinophil Count',
        result: 'AEC 440 cells/mcL (Mildly Elevated)',
        offsetDays: 0,
        status: 'PENDING REVIEW',
        facility: 'Mehsana Community Health Centre'
      }
    ]
  },
  {
    id: 'DEMO-P003',
    name: 'Ananya Rao (fictional)',
    age: 28,
    gender: 'F',
    genderLabel: 'Female',
    phone: '+91-9XXX-XXX-003',
    village: 'Kurnool Urban Colony',
    language: 'Telugu (తెలుగు)',
    langCode: 'te',
    abhaId: '91-4521-8932-1003',
    abhaNumber: '91-4521-8932-1003',
    abhaAddress: 'ananya.rao@abdm',
    hprId: 'HPR-IN-2024-99824',
    doctorName: 'Dr. Priya Sharma, MD',
    hfrId: 'HFR-AP-KRN-0042',
    facilityName: 'Kurnool Urban Model PHC',
    icd10: 'J30.9',
    icd10Desc: 'Allergic rhinitis, unspecified',
    snomedCt: '61582004',
    snomedDesc: 'Allergic rhinitis (disorder)',
    conditions: ['Allergic Rhinitis', 'Occasional Exercise Wheeze'],
    primaryCondition: 'Allergic Rhinitis',
    lastVisitOffset: -12,
    nextVisitOffset: 4,
    avatar: '👩',
    bloodGroup: 'A+',
    allergies: ['Pollen', 'Strong perfumes'],
    vitalsHistory: [
      { offsetDays: -12, bp: '116/74 mmHg', pulse: '72 bpm', weight: '54 kg', spo2: '99%' },
      { offsetDays: -60, bp: '118/76 mmHg', pulse: '74 bpm', weight: '54 kg', spo2: '99%' }
    ],
    encounters: [
      {
        id: 'DEMO-ENC-301',
        offsetDays: -12,
        complaint: 'Sneezing bouts in morning and watery eyes',
        doctorNote: 'Nasal mucosa pale and swollen. Prescribed oral antihistamine and saline nasal spray.',
        status: 'Completed',
        icd10: 'J30.9',
        snomedCt: '61582004',
        hprId: 'HPR-IN-2024-99824',
        hfrId: 'HFR-AP-KRN-0042'
      }
    ],
    prescriptions: [
      {
        id: 'DEMO-RX-301',
        drugName: 'Levocetirizine Dihydrochloride Tablets',
        dosage: '5 mg',
        frequency: '1 tablet once daily at night (as prescribed)',
        duration: '10 days',
        instructionsVernacular: 'రాత్రి నిద్రపోయే ముందు ఒక మాత్ర తీసుకోండి. (Take 1 tablet before sleep)',
        offsetDays: -12,
        notes: 'Demo data - not medical advice.'
      }
    ],
    reports: [
      {
        id: 'DEMO-LAB-301',
        title: 'Total Serum IgE Level',
        result: '185 IU/mL (Moderate Atopy)',
        offsetDays: -12,
        status: 'REVIEWED',
        facility: 'Kurnool Medical College Labs'
      }
    ]
  },
  {
    id: 'DEMO-P004',
    name: 'Narayana Murthy (fictional)',
    age: 64,
    gender: 'M',
    genderLabel: 'Male',
    phone: '+91-9XXX-XXX-004',
    village: 'Mandya Rural Catchment',
    language: 'Kannada (ಕನ್ನಡ)',
    langCode: 'kn',
    abhaId: '91-3312-7845-1004',
    abhaNumber: '91-3312-7845-1004',
    abhaAddress: 'narayana.murthy@abdm',
    hprId: 'HPR-IN-2024-99824',
    doctorName: 'Dr. Priya Sharma, MD',
    hfrId: 'HFR-KA-MDY-0077',
    facilityName: 'Mandya Model Rural Hospital',
    icd10: 'I25.9',
    icd10Desc: 'Chronic ischemic heart disease, unspecified',
    snomedCt: '414545008',
    snomedDesc: 'Ischemic heart disease (disorder)',
    conditions: ['Ischemic Heart Disease (Stable)', 'Hyperlipidemia'],
    primaryCondition: 'Ischemic Heart Disease (Stable)',
    lastVisitOffset: -2,
    nextVisitOffset: 0, // Today!
    avatar: '👴',
    bloodGroup: 'AB+',
    allergies: ['None known'],
    vitalsHistory: [
      { offsetDays: 0, bp: '128/82 mmHg', pulse: '68 bpm', weight: '68 kg', spo2: '98%' },
      { offsetDays: -2, bp: '130/84 mmHg', pulse: '70 bpm', weight: '68 kg', spo2: '98%' },
      { offsetDays: -30, bp: '136/86 mmHg', pulse: '72 bpm', weight: '69 kg', spo2: '97%' }
    ],
    encounters: [
      {
        id: 'DEMO-ENC-401',
        offsetDays: -2,
        complaint: 'Routine cardiac follow-up; reports no chest heaviness on climbing stairs',
        doctorNote: 'Cardiovascular examination normal. S1/S2 heard clearly, no murmurs. ECG rhythm stable.',
        status: 'Completed',
        icd10: 'I25.9',
        snomedCt: '414545008',
        hprId: 'HPR-IN-2024-99824',
        hfrId: 'HFR-KA-MDY-0077'
      }
    ],
    prescriptions: [
      {
        id: 'DEMO-RX-401',
        drugName: 'Atorvastatin Calcium IP',
        dosage: '20 mg',
        frequency: '1 tablet once daily at night (as prescribed)',
        duration: '60 days',
        instructionsVernacular: 'ರಾತ್ರಿ ಮಲಗುವ ಮುನ್ನ ಒಂದು ಮಾತ್ರೆ ತೆಗೆದುಕೊಳ್ಳಿ. (Take 1 tablet before sleeping)',
        offsetDays: -2,
        notes: 'Demo data - not medical advice.'
      }
    ],
    reports: [
      {
        id: 'DEMO-LAB-401',
        title: '12-Lead Electrocardiogram (ECG)',
        result: 'Normal sinus rhythm with non-specific T-wave flattening',
        offsetDays: -2,
        status: 'REVIEWED',
        facility: 'Mandya District Hospital'
      },
      {
        id: 'DEMO-LAB-402',
        title: 'Lipid Profile (Fasting)',
        result: 'Total Cholesterol: 172 mg/dL, LDL: 94 mg/dL',
        offsetDays: 0,
        status: 'PENDING REVIEW',
        facility: 'Mandya District Hospital'
      }
    ]
  },
  {
    id: 'DEMO-P005',
    name: 'Meera Mukherjee (fictional)',
    age: 34,
    gender: 'F',
    genderLabel: 'Female',
    phone: '+91-9XXX-XXX-005',
    village: 'Howrah Municipal Ward 12',
    language: 'Bengali (বাংলা)',
    langCode: 'bn',
    abhaId: '91-7721-6549-1005',
    abhaNumber: '91-7721-6549-1005',
    abhaAddress: 'meera.mukherjee@abdm',
    hprId: 'HPR-IN-2024-99824',
    doctorName: 'Dr. Priya Sharma, MD',
    hfrId: 'HFR-WB-HWR-0012',
    facilityName: 'Howrah Municipal Health Centre',
    icd10: 'E03.9',
    icd10Desc: 'Hypothyroidism, unspecified',
    snomedCt: '40930008',
    snomedDesc: 'Hypothyroidism (disorder)',
    conditions: ['Primary Hypothyroidism', 'Iron Deficiency Anemia'],
    primaryCondition: 'Primary Hypothyroidism',
    lastVisitOffset: -18,
    nextVisitOffset: 2,
    avatar: '👩',
    bloodGroup: 'O-',
    allergies: ['Sulfa drugs'],
    vitalsHistory: [
      { offsetDays: -18, bp: '112/72 mmHg', pulse: '66 bpm', weight: '58 kg', spo2: '99%' },
      { offsetDays: -90, bp: '110/70 mmHg', pulse: '64 bpm', weight: '59.5 kg', spo2: '98%' }
    ],
    encounters: [
      {
        id: 'DEMO-ENC-501',
        offsetDays: -18,
        complaint: 'Generalized lethargy, brittle nails, and hair thinning',
        doctorNote: 'Thyroid profile requested. Emphasized taking thyroxine on completely empty stomach 1 hour before tea.',
        status: 'Completed',
        icd10: 'E03.9',
        snomedCt: '40930008',
        hprId: 'HPR-IN-2024-99824',
        hfrId: 'HFR-WB-HWR-0012'
      }
    ],
    prescriptions: [
      {
        id: 'DEMO-RX-501',
        drugName: 'Levothyroxine Sodium IP',
        dosage: '50 mcg',
        frequency: '1 tablet early morning empty stomach (as prescribed)',
        duration: '90 days',
        instructionsVernacular: 'সকালে খালি পেটে এক গ্লাস জল দিয়ে খান। (Take with plain water on empty stomach)',
        offsetDays: -18,
        notes: 'Demo data - not medical advice.'
      }
    ],
    reports: [
      {
        id: 'DEMO-LAB-501',
        title: 'Serum Thyroid Stimulating Hormone (TSH)',
        result: '3.42 mIU/L (Within Target Range)',
        offsetDays: -18,
        status: 'REVIEWED',
        facility: 'Howrah Diagnostic Unit'
      }
    ]
  },
  {
    id: 'DEMO-P006',
    name: 'Murugan Pillai (fictional)',
    age: 52,
    gender: 'M',
    genderLabel: 'Male',
    phone: '+91-9XXX-XXX-006',
    village: 'Tirunelveli Rural Block',
    language: 'Tamil (தமிழ்)',
    langCode: 'ta',
    abhaId: '91-6643-9821-1006',
    abhaNumber: '91-6643-9821-1006',
    abhaAddress: 'murugan.pillai@abdm',
    hprId: 'HPR-IN-2024-99824',
    doctorName: 'Dr. Priya Sharma, MD',
    hfrId: 'HFR-TN-TIR-0089',
    facilityName: 'Tirunelveli Rural Block PHC',
    icd10: 'M17.11',
    icd10Desc: 'Primary osteoarthritis, right knee',
    snomedCt: '239873007',
    snomedDesc: 'Osteoarthritis of knee (disorder)',
    conditions: ['Osteoarthritis of Right Knee', 'Mild Hyperuricemia'],
    primaryCondition: 'Osteoarthritis of Right Knee',
    lastVisitOffset: -5,
    nextVisitOffset: 6,
    avatar: '👨',
    bloodGroup: 'A+',
    allergies: ['None reported'],
    vitalsHistory: [
      { offsetDays: -5, bp: '128/84 mmHg', pulse: '74 bpm', weight: '76 kg', spo2: '98%' },
      { offsetDays: -35, bp: '130/86 mmHg', pulse: '76 bpm', weight: '77 kg', spo2: '98%' }
    ],
    encounters: [
      {
        id: 'DEMO-ENC-601',
        offsetDays: -5,
        complaint: 'Pain in right knee after agricultural walking; mild morning stiffness',
        doctorNote: 'Crepitus felt on passive knee flexion. Prescribed paracetamol on demand, quadriceps strengthening exercises.',
        status: 'Completed',
        icd10: 'M17.11',
        snomedCt: '239873007',
        hprId: 'HPR-IN-2024-99824',
        hfrId: 'HFR-TN-TIR-0089'
      }
    ],
    prescriptions: [
      {
        id: 'DEMO-RX-601',
        drugName: 'Paracetamol IP (Fast Release)',
        dosage: '650 mg',
        frequency: '1 tablet when knee pain is severe, after food (as prescribed)',
        duration: '15 days',
        instructionsVernacular: 'வலி இருக்கும் போது உணவு உண்ட பின் சாப்பிடவும். (Take after food only during pain)',
        offsetDays: -5,
        notes: 'Demo data - not medical advice.'
      }
    ],
    reports: [
      {
        id: 'DEMO-LAB-601',
        title: 'Digital X-Ray Right Knee (AP & Lateral Weight-bearing)',
        result: 'Grade 2 joint space narrowing in medial compartment',
        offsetDays: -5,
        status: 'REVIEWED',
        facility: 'Tirunelveli Sub-district Radiology'
      }
    ]
  },
  {
    id: 'DEMO-P007',
    name: 'Sunita Deshmukh (fictional)',
    age: 41,
    gender: 'F',
    genderLabel: 'Female',
    phone: '+91-9XXX-XXX-007',
    village: 'Satara Valley Sector',
    language: 'Marathi (मराठी)',
    langCode: 'mr',
    abhaId: '91-5512-4432-1007',
    abhaNumber: '91-5512-4432-1007',
    abhaAddress: 'sunita.deshmukh@abdm',
    hprId: 'HPR-IN-2024-99824',
    doctorName: 'Dr. Priya Sharma, MD',
    hfrId: 'HFR-MH-SAT-0034',
    facilityName: 'Satara Model Civic Health Centre',
    icd10: 'K21.9',
    icd10Desc: 'Gastro-esophageal reflux disease without esophagitis',
    snomedCt: '235595009',
    snomedDesc: 'Gastroesophageal reflux disease (disorder)',
    conditions: ['Gastroesophageal Reflux Disease (GERD)', 'Dyspepsia'],
    primaryCondition: 'Gastroesophageal Reflux Disease',
    lastVisitOffset: -10,
    nextVisitOffset: 3, // Upcoming teleconsult
    avatar: '👩',
    bloodGroup: 'B+',
    allergies: ['Aspirin (triggers acidity)'],
    vitalsHistory: [
      { offsetDays: -10, bp: '120/78 mmHg', pulse: '70 bpm', weight: '60 kg', spo2: '99%' },
      { offsetDays: -40, bp: '122/80 mmHg', pulse: '72 bpm', weight: '60.5 kg', spo2: '99%' }
    ],
    encounters: [
      {
        id: 'DEMO-ENC-701',
        offsetDays: -10,
        complaint: 'Sour eructations, burning sensation in chest after spicy food',
        doctorNote: 'Epigastric tenderness absent. Prescribed proton pump inhibitor for 14 days and advised small frequent meals.',
        status: 'Completed',
        icd10: 'K21.9',
        snomedCt: '235595009',
        hprId: 'HPR-IN-2024-99824',
        hfrId: 'HFR-MH-SAT-0034'
      }
    ],
    prescriptions: [
      {
        id: 'DEMO-RX-701',
        drugName: 'Pantoprazole Gastro-Resistant Tablets IP',
        dosage: '40 mg',
        frequency: '1 tablet once daily 30 minutes before breakfast (as prescribed)',
        duration: '14 days',
        instructionsVernacular: 'सकाळी नाश्त्यापूर्वी अर्धा तास आधी गोळी घ्या. (Take 30 mins before breakfast)',
        offsetDays: -10,
        notes: 'Demo data - not medical advice.'
      }
    ],
    reports: [
      {
        id: 'DEMO-LAB-701',
        title: 'Serum Helicobacter pylori Antibody Titre',
        result: 'Negative',
        offsetDays: -10,
        status: 'REVIEWED',
        facility: 'Satara Civic Diagnostics'
      }
    ]
  },
  {
    id: 'DEMO-P008',
    name: 'Harpreet Singh (fictional)',
    age: 71,
    gender: 'M',
    genderLabel: 'Male',
    phone: '+91-9XXX-XXX-008',
    village: 'Gurdaspur Border Tehsil',
    language: 'Hindi (हिन्दी)',
    langCode: 'hi',
    abhaId: '91-9981-1278-1008',
    abhaNumber: '91-9981-1278-1008',
    abhaAddress: 'harpreet.singh@abdm',
    hprId: 'HPR-IN-2024-99824',
    doctorName: 'Dr. Priya Sharma, MD',
    hfrId: 'HFR-PB-GUR-0056',
    facilityName: 'Gurdaspur Civil Hospital',
    icd10: 'J44.9',
    icd10Desc: 'Chronic obstructive pulmonary disease, unspecified',
    snomedCt: '13645005',
    snomedDesc: 'Chronic obstructive lung disease (disorder)',
    conditions: ['Chronic Obstructive Pulmonary Disease (COPD)', 'Mild Prostatism'],
    primaryCondition: 'COPD (Stage II Moderate)',
    lastVisitOffset: -1,
    nextVisitOffset: 8,
    avatar: '👴',
    bloodGroup: 'O+',
    allergies: ['Sulfa drugs'],
    vitalsHistory: [
      { offsetDays: -1, bp: '136/86 mmHg', pulse: '84 bpm', weight: '65 kg', spo2: '94%' },
      { offsetDays: -15, bp: '138/88 mmHg', pulse: '86 bpm', weight: '65 kg', spo2: '93%' },
      { offsetDays: -60, bp: '140/90 mmHg', pulse: '82 bpm', weight: '66 kg', spo2: '94%' }
    ],
    encounters: [
      {
        id: 'DEMO-ENC-801',
        offsetDays: -1,
        complaint: 'Morning chronic productive cough with white mucoid sputum',
        doctorNote: 'Bilateral scattered rhonchi. No fever or purulent change. Reinforced adherence to maintenance bronchodilator.',
        status: 'Completed',
        icd10: 'J44.9',
        snomedCt: '13645005',
        hprId: 'HPR-IN-2024-99824',
        hfrId: 'HFR-PB-GUR-0056'
      }
    ],
    prescriptions: [
      {
        id: 'DEMO-RX-801',
        drugName: 'Tiotropium Bromide Inhalation Powder',
        dosage: '18 mcg per capsule',
        frequency: 'Inhale contents of 1 rotacap once daily via rotahaler (as prescribed)',
        duration: '30 days',
        instructionsVernacular: 'प्रतिदिन एक कैप्सूल रोटाहेलर से सांस में खींचे। (Inhale through device, do not swallow)',
        offsetDays: -1,
        notes: 'Demo data - not medical advice.'
      }
    ],
    reports: [
      {
        id: 'DEMO-LAB-801',
        title: 'Post-Bronchodilator Spirometry (FEV1 / FVC)',
        result: 'FEV1/FVC: 0.64, FEV1: 62% predicted (Stage II Moderate Obstruction)',
        offsetDays: -1,
        status: 'REVIEWED',
        facility: 'Gurdaspur Civil Hospital'
      }
    ]
  }
];

// --- 12 Runtime-Relative Appointments (Past, Today, Upcoming) ---

export const DEMO_APPOINTMENTS = [
  // Past Completed Appointments
  {
    id: 'DEMO-APT-001',
    patientId: 'DEMO-P005',
    patientName: 'Meera Mukherjee (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '09:30 AM',
    offsetDays: -4,
    dateFormatted: formatDemoDate(-4),
    relativeLabel: getRelativeDaysLabel(-4),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Completed',
    token: 'T-01',
    reason: 'Thyroid dosage adjustment & report review'
  },
  {
    id: 'DEMO-APT-002',
    patientId: 'DEMO-P001',
    patientName: 'Lakshmi Amma (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '11:15 AM',
    offsetDays: -3,
    dateFormatted: formatDemoDate(-3),
    relativeLabel: getRelativeDaysLabel(-3),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Completed',
    token: 'T-04',
    reason: 'Fasting blood sugar check & foot review'
  },
  {
    id: 'DEMO-APT-003',
    patientId: 'DEMO-P004',
    patientName: 'Narayana Murthy (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '02:00 PM',
    offsetDays: -2,
    dateFormatted: formatDemoDate(-2),
    relativeLabel: getRelativeDaysLabel(-2),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Completed',
    token: 'T-07',
    reason: 'Cardiac follow-up & ECG review'
  },
  {
    id: 'DEMO-APT-004',
    patientId: 'DEMO-P008',
    patientName: 'Harpreet Singh (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '04:30 PM',
    offsetDays: -1,
    dateFormatted: formatDemoDate(-1),
    relativeLabel: getRelativeDaysLabel(-1),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Completed',
    token: 'T-11',
    reason: 'COPD seasonal review & inhaler adherence check'
  },

  // Today's Appointments (0 Days Offset)
  {
    id: 'DEMO-APT-005',
    patientId: 'DEMO-P002',
    patientName: 'Ramesh Patel (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '10:00 AM',
    offsetDays: 0,
    dateFormatted: formatDemoDate(0),
    relativeLabel: getRelativeDaysLabel(0),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Upcoming',
    token: 'T-02',
    reason: 'Asthma follow-up & peak flow check'
  },
  {
    id: 'DEMO-APT-006',
    patientId: 'DEMO-P004',
    patientName: 'Narayana Murthy (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '11:45 AM',
    offsetDays: 0,
    dateFormatted: formatDemoDate(0),
    relativeLabel: getRelativeDaysLabel(0),
    type: 'Teleconsult',
    isTeleconsult: true,
    status: 'Upcoming',
    token: 'T-05',
    reason: 'Lipid profile review teleconsult'
  },
  {
    id: 'DEMO-APT-007',
    patientId: 'DEMO-P001',
    patientName: 'Lakshmi Amma (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '03:15 PM',
    offsetDays: 0,
    dateFormatted: formatDemoDate(0),
    relativeLabel: getRelativeDaysLabel(0),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Upcoming',
    token: 'T-09',
    reason: 'Postprandial sugar verification'
  },

  // Upcoming Appointments over next 10 days
  {
    id: 'DEMO-APT-008',
    patientId: 'DEMO-P005',
    patientName: 'Meera Mukherjee (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '10:30 AM',
    offsetDays: 2,
    dateFormatted: formatDemoDate(2),
    relativeLabel: getRelativeDaysLabel(2),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Upcoming',
    token: 'T-03',
    reason: 'Iron supplementation tolerance check'
  },
  {
    id: 'DEMO-APT-009',
    patientId: 'DEMO-P007',
    patientName: 'Sunita Deshmukh (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '02:30 PM',
    offsetDays: 3,
    dateFormatted: formatDemoDate(3),
    relativeLabel: getRelativeDaysLabel(3),
    type: 'Teleconsult',
    isTeleconsult: true,
    status: 'Upcoming',
    token: 'T-06',
    reason: 'GERD symptom recovery teleconsult'
  },
  {
    id: 'DEMO-APT-010',
    patientId: 'DEMO-P003',
    patientName: 'Ananya Rao (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '11:00 AM',
    offsetDays: 4,
    dateFormatted: formatDemoDate(4),
    relativeLabel: getRelativeDaysLabel(4),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Upcoming',
    token: 'T-04',
    reason: 'Allergy immunotherapy follow-up'
  },
  {
    id: 'DEMO-APT-011',
    patientId: 'DEMO-P006',
    patientName: 'Murugan Pillai (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '09:45 AM',
    offsetDays: 6,
    dateFormatted: formatDemoDate(6),
    relativeLabel: getRelativeDaysLabel(6),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Upcoming',
    token: 'T-01',
    reason: 'Knee physiotherapy exercise review'
  },
  {
    id: 'DEMO-APT-012',
    patientId: 'DEMO-P008',
    patientName: 'Harpreet Singh (fictional)',
    doctorName: 'Dr. Priya Sharma, MD',
    time: '03:45 PM',
    offsetDays: 8,
    dateFormatted: formatDemoDate(8),
    relativeLabel: getRelativeDaysLabel(8),
    type: 'In-Person',
    isTeleconsult: false,
    status: 'Upcoming',
    token: 'T-08',
    reason: 'Spirometry repeat and inhaler technique evaluation'
  }
];

// Helper to look up a patient by ID
export function getDemoPatientById(id) {
  return DEMO_PATIENTS.find(p => p.id === id) || DEMO_PATIENTS[0];
}

// Helper to get appointments for a specific patient
export function getDemoAppointmentsForPatient(patientId) {
  return DEMO_APPOINTMENTS.filter(a => a.patientId === patientId);
}
