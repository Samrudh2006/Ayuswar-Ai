/**
 * AyuSwar AI — Clinical Triage & Domain Registry
 * Maps medical conditions to specialized attending physicians,
 * Indic chronotherapy schedules, and diagnostic report templates.
 */

export const DOCTOR_REGISTRY = {
  pulmonology: {
    id: 'doc_priya',
    doctorName: 'Dr. Priya Sharma, MD',
    specialty: 'Pulmonology & Critical Care',
    department: 'Chest & Respiratory Medicine',
    facility: 'Kurnool District Hospital (ABDM PHC #1402)',
    hprId: 'ABHA-HPR-8921-9942',
    nmcRegNo: 'NMC-TS-2016-48291',
    experience: '14 years',
    avatar: '/assets/dr_ananya_avatar.jpg',
    specialtyDomain: 'respiratory'
  },
  cardiology: {
    id: 'doc_rajesh',
    doctorName: 'Dr. Rajesh Verma, MD, DM',
    specialty: 'Cardiology & Diabetology',
    department: 'Cardiovascular & Metabolic Medicine',
    facility: 'Nizam Heart & Metabolism Center',
    hprId: 'ABHA-HPR-4412-8091',
    nmcRegNo: 'NMC-AP-2012-31049',
    experience: '18 years',
    avatar: '/assets/dr_ananya_avatar.jpg',
    specialtyDomain: 'cardiometabolic'
  },
  general: {
    id: 'doc_kavitha',
    doctorName: 'Dr. Kavitha Reddy, MBBS, MS',
    specialty: 'General Medicine & Family Health',
    department: 'Primary Care & Community Medicine',
    facility: 'Gandhi Memorial Hospital',
    hprId: 'ABHA-HPR-7729-3310',
    nmcRegNo: 'NMC-TS-2018-59203',
    experience: '10 years',
    avatar: '/assets/dr_ananya_avatar.jpg',
    specialtyDomain: 'general'
  },
  pediatrics: {
    id: 'doc_vikram',
    doctorName: 'Dr. Vikram Seth, MBBS, MD (Pediatrics)',
    specialty: 'Pediatrics & Neonatology',
    department: 'Child Health & Pediatric Critical Care',
    facility: 'Niloufer Children Hospital & ABDM Hub',
    hprId: 'ABHA-HPR-5521-1049',
    nmcRegNo: 'NMC-TS-2014-38290',
    experience: '16 years',
    avatar: '/assets/dr_ananya_avatar.jpg',
    specialtyDomain: 'pediatrics'
  },
  orthopedics: {
    id: 'doc_meenakshi',
    doctorName: 'Dr. Meenakshi Sundaram, MS (Ortho)',
    specialty: 'Orthopedics & Joint Replacement',
    department: 'Musculoskeletal & Trauma Surgery',
    facility: 'Apollo Bone & Joint Institute',
    hprId: 'ABHA-HPR-3319-8802',
    nmcRegNo: 'NMC-AP-2011-20941',
    experience: '20 years',
    avatar: '/assets/dr_ananya_avatar.jpg',
    specialtyDomain: 'orthopedics'
  },
  neurology: {
    id: 'doc_arishti',
    doctorName: 'Dr. Arishti Banerjee, MD, DM (Neuro)',
    specialty: 'Neurology & Stroke Medicine',
    department: 'Neurosciences & Cognitive Disorders',
    facility: 'National Institute of Neurosciences',
    hprId: 'ABHA-HPR-9920-4138',
    nmcRegNo: 'NMC-TS-2015-77412',
    experience: '15 years',
    avatar: '/assets/dr_ananya_avatar.jpg',
    specialtyDomain: 'neurology'
  }
};

/**
 * Intelligent Clinical Triage Engine:
 * Assigns doctor and domain based on patient condition string.
 */
export function triagePatientCondition(condition = '') {
  const condLower = (condition || '').toLowerCase();

  if (
    condLower.includes('asthma') ||
    condLower.includes('breath') ||
    condLower.includes('pulmon') ||
    condLower.includes('bronch') ||
    condLower.includes('lung') ||
    condLower.includes('wheeze') ||
    condLower.includes('cough') ||
    condLower.includes('copd')
  ) {
    return {
      domain: 'respiratory',
      doctor: DOCTOR_REGISTRY.pulmonology,
      domainLabel: 'Respiratory & Pulmonology'
    };
  }

  if (
    condLower.includes('child') ||
    condLower.includes('pediatric') ||
    condLower.includes('infant') ||
    condLower.includes('baby') ||
    condLower.includes('chinna')
  ) {
    return {
      domain: 'pediatrics',
      doctor: DOCTOR_REGISTRY.pediatrics,
      domainLabel: 'Pediatrics & Child Care'
    };
  }

  if (
    condLower.includes('joint') ||
    condLower.includes('bone') ||
    condLower.includes('knee') ||
    condLower.includes('arthritis') ||
    condLower.includes('fracture') ||
    condLower.includes('ortho')
  ) {
    return {
      domain: 'orthopedics',
      doctor: DOCTOR_REGISTRY.orthopedics,
      domainLabel: 'Orthopedics & Joint Care'
    };
  }

  if (
    condLower.includes('neuro') ||
    condLower.includes('headache') ||
    condLower.includes('migraine') ||
    condLower.includes('stroke') ||
    condLower.includes('seizure') ||
    condLower.includes('vertigo')
  ) {
    return {
      domain: 'neurology',
      doctor: DOCTOR_REGISTRY.neurology,
      domainLabel: 'Neurology & Brain Sciences'
    };
  }

  if (
    condLower.includes('diabet') ||
    condLower.includes('sugar') ||
    condLower.includes('hypertens') ||
    condLower.includes('bp') ||
    condLower.includes('heart') ||
    condLower.includes('cardiac') ||
    condLower.includes('angina') ||
    condLower.includes('cholesterol') ||
    condLower.includes('metabolic')
  ) {
    return {
      domain: 'cardiometabolic',
      doctor: DOCTOR_REGISTRY.cardiology,
      domainLabel: 'Cardiometabolic & Diabetology'
    };
  }

  return {
    domain: 'general',
    doctor: DOCTOR_REGISTRY.general,
    domainLabel: 'General Medicine & Family Health'
  };
}

/**
 * Generates custom clinical data (chronotherapy pillbox + diagnostic reports)
 * tailored to the patient's condition and assigned doctor.
 */
export function generateClinicalProfile(patientName, condition, language = 'Telugu') {
  const triage = triagePatientCondition(condition);
  const doc = triage.doctor;

  if (triage.domain === 'respiratory') {
    return {
      domain: 'respiratory',
      assignedDoctor: doc,
      vitals: { bp: '118/76', hr: '76 bpm', spo2: '98%', peakFlow: '380 L/min' },
      chronotherapySchedule: [
        {
          id: 'resp_1',
          label: 'EARLY MORNING',
          time: '06:30 AM',
          mealContext: 'Empty Stomach (పరగడుపున / खाली पेट)',
          medicine: 'Budesonide 200mcg Rotacap',
          purpose: 'Maintenance airway anti-inflammatory inhaler',
          color: '#008B8B',
          bg: 'rgba(0, 139, 139, 0.1)',
          teluguAudioText: 'ఉదయం లేవగానే ఖాళీ కడుపుతో బుడెసోనైడ్ ఇన్హేలర్ ఒక పఫ్ తీసుకోండి. తర్వాత నోరు పుక్కిలించి ఉమ్మేయండి.',
          hindiAudioText: 'सुबह उठकर खाली पेट बुडेसोनाइड इन्हेलर का एक पफ लें और उसके बाद पानी से कुल्ला करें।'
        },
        {
          id: 'resp_2',
          label: 'MORNING',
          time: '08:30 AM',
          mealContext: 'After Breakfast (టిఫిన్ తర్వాత / नाश्ते के बाद)',
          medicine: 'Levolin 50mcg Inhaler',
          purpose: 'Bronchodilator for exercise and morning cough relief',
          color: '#0284C7',
          bg: 'rgba(2, 132, 199, 0.1)',
          teluguAudioText: 'టిఫిన్ తిన్న తర్వాత లెవోలిన్ ఇన్హేలర్ ఉపయోగించండి. శ్వాస తేలికవుతుంది.',
          hindiAudioText: 'नाश्ते के बाद लेवोलिन इन्हेलर लें ताकि सांस लेने में आसानी हो।'
        },
        {
          id: 'resp_3',
          label: 'NIGHT',
          time: '08:30 PM',
          mealContext: 'After Dinner (రాత్రి భోజనం తర్వాత / रात खाने के बाद)',
          medicine: 'Montelukast 10mg + Bilastine 20mg',
          purpose: 'Nocturnal bronchospasm & allergy prevention',
          color: '#7C3AED',
          bg: 'rgba(124, 58, 237, 0.1)',
          teluguAudioText: 'రాత్రి భోజనం ముగిశాక మోంటెలుకాస్ట్ టాబ్లెట్ వేసుకోండి. రాత్రి నిద్రలో దగ్గు రాకుండా ఉంటుంది.',
          hindiAudioText: 'रात के खाने के बाद मोंटेलुकास्ट की गोली लें ताकि रात को खांसी न उठे।'
        }
      ],
      reportsList: [
        {
          id: 101,
          title: 'Pulmonary Spirometry / PFT Test',
          date: '10 May 2025',
          icon: '🫁',
          doctor: doc.doctorName,
          summary: 'FEV1 is 86% of predicted. Reversible bronchial obstruction showing prompt response to inhaler.',
          spokenTelugu: 'మీ ఊపిరితిత్తుల పనితీరు 86 శాతం ఉంది. ఇన్హేలర్ వేసుకున్న తర్వాత శ్వాసనాళాలు బాగా తెరుచుకుంటున్నాయి.',
          spokenHindi: 'आपकी सांस नली की क्षमता 86 प्रतिशत है। इन्हेलर से फेफड़ों में अच्छा सुधार दिख रहा है।'
        },
        {
          id: 102,
          title: 'Chest X-Ray (PA View)',
          date: '8 May 2025',
          icon: '🩻',
          doctor: doc.doctorName,
          summary: 'Clear bilateral lung fields. No pneumonic consolidation or pleural effusion.',
          spokenTelugu: 'ఛాతీ ఎక్స్-రే లో ఎలాంటి నిమోనియా లేదా ఇన్ఫెక్షన్ లేదు. గుండె మరియు ఊపిరితిత్తులు క్లియర్ గా ఉన్నాయి.',
          spokenHindi: 'छाती के एक्स-रे में कोई निमोनिया या संक्रमण नहीं है। फेफड़े बिल्कुल साफ हैं।'
        }
      ]
    };
  }

  if (triage.domain === 'cardiometabolic') {
    return {
      domain: 'cardiometabolic',
      assignedDoctor: doc,
      vitals: { bp: '136/86', hr: '74 bpm', spo2: '97%', rbs: '118 mg/dL', hba1c: '6.8%' },
      chronotherapySchedule: [
        {
          id: 'card_1',
          label: 'EARLY MORNING',
          time: '06:30 AM',
          mealContext: 'Empty Stomach (పరగడుపున / खाली पेट)',
          medicine: 'Telmisartan 40mg + Amlodipine 5mg',
          purpose: '24-hour blood pressure stabilization & renal protection',
          color: '#008B8B',
          bg: 'rgba(0, 139, 139, 0.1)',
          teluguAudioText: 'ఉదయం పరగడుపున టెల్మిసార్టన్ బీపీ మాత్ర వేసుకోండి. రోజంతా రక్తపోటు అదుపులో ఉంటుంది.',
          hindiAudioText: 'सुबह खाली पेट टेल्मिसार्टन की बीपी की दवा लें ताकि पूरा दिन ब्लड प्रेशर सामान्य रहे।'
        },
        {
          id: 'card_2',
          label: 'MORNING',
          time: '08:30 AM',
          mealContext: 'After Breakfast (టిఫిన్ తర్వాత / नाश्ते के बाद)',
          medicine: 'Metformin 500mg SR + Glimepiride 1mg',
          purpose: 'Post-prandial glucose control',
          color: '#D97706',
          bg: 'rgba(217, 119, 6, 0.1)',
          teluguAudioText: 'టిఫిన్ చేసిన వెంటనే మెట్‌ఫార్మిన్ షుగర్ మాత్ర వేసుకోండి. కడుపు మంట లేకుండా చక్కెర అదుపులో ఉంటుంది.',
          hindiAudioText: 'नाश्ता करने के तुरंत बाद मेटफॉर्मिन शुगर की गोली लें। पेट में गैस नहीं बनेगी।'
        },
        {
          id: 'card_3',
          label: 'NIGHT',
          time: '08:30 PM',
          mealContext: 'After Dinner (రాత్రి భోజనం తర్వాత / रात खाने के बाद)',
          medicine: 'Atorvastatin 10mg',
          purpose: 'Circadian nocturnal cholesterol synthesis reduction',
          color: '#4F46E5',
          bg: 'rgba(79, 70, 229, 0.1)',
          teluguAudioText: 'రాత్రి భోజనం తర్వాత అటోర్వాస్టాటిన్ కొలెస్ట్రాల్ మాత్ర వేసుకోండి. గుండెకు రక్షణ లభిస్తుంది.',
          hindiAudioText: 'रात के खाने के बाद एटोरवास्टेटिन की गोली लें। यह कोलेस्ट्रॉल को कम करती है।'
        }
      ],
      reportsList: [
        {
          id: 201,
          title: 'Glycated Hemoglobin (HbA1c) & Fasting Sugar',
          date: '9 May 2025',
          icon: '🩸',
          doctor: doc.doctorName,
          summary: 'HbA1c: 6.8% (Target met). Fasting Blood Sugar: 114 mg/dL. Good metabolic adherence.',
          spokenTelugu: 'మీ హెచ్‌బీఏ1సి 6.8 శాతం ఉంది. రక్తంలో చక్కెర స్థాయిలు లక్ష్యం మేరకు చక్కగా అదుపులో ఉన్నాయి.',
          spokenHindi: 'आपका एचबीए1सी 6.8 प्रतिशत है। शुगर का स्तर बिल्कुल नियंत्रण में है।'
        },
        {
          id: 202,
          title: '12-Lead Resting Electrocardiogram (ECG)',
          date: '7 May 2025',
          icon: '📈',
          doctor: doc.doctorName,
          summary: 'Normal Sinus Rhythm. Heart Rate: 72 bpm. PR & QTc intervals within normal limits.',
          spokenTelugu: 'ఈసీజీ రిపోర్టు సాధారణంగా ఉంది. గుండె కొట్టుకునే వేగం 72 వద్ద క్రమబద్ధంగా ఉంది.',
          spokenHindi: 'ईसीजी रिपोर्ट बिल्कुल सामान्य है। दिल की धड़कन 72 प्रति मिनट की गति से सही चल रही है।'
        }
      ]
    };
  }

  // General & Pediatric Domain
  return {
    domain: 'general',
    assignedDoctor: doc,
    vitals: { bp: '116/74', hr: '80 bpm', spo2: '99%', temp: '99.2°F' },
    chronotherapySchedule: [
      {
        id: 'gen_1',
        label: 'MORNING',
        time: '08:30 AM',
        mealContext: 'After Breakfast (టిఫిన్ తర్వాత / नाश्ते के बाद)',
        medicine: 'Paracetamol 650mg SOS',
        purpose: 'Fever and body ache relief after meals',
        color: '#008B8B',
        bg: 'rgba(0, 139, 139, 0.1)',
        teluguAudioText: 'టిఫిన్ తిన్న తర్వాత పారాసిటమాల్ వేసుకోండి. జ్వరం మరియు ఒంటి నొప్పులు తగ్గుతాయి.',
        hindiAudioText: 'नाश्ता करने के बाद पैरासिटामोल लें ताकि बुखार और दर्द में आराम मिले।'
      },
      {
        id: 'gen_2',
        label: 'AFTERNOON',
        time: '01:30 PM',
        mealContext: 'After Lunch (భోజనం తర్వాత / दोपहर खाने के बाद)',
        medicine: 'Zinc 50mg + Vitamin C 500mg',
        purpose: 'Immune cell restoration & tissue recovery',
        color: '#16A34A',
        bg: 'rgba(22, 163, 74, 0.1)',
        teluguAudioText: 'మధ్యాహ్న భోజనం తర్వాత విటమిన్ సి మరియు జింక్ మాత్ర వేసుకోండి. రోగనిరోధక శక్తి పెరుగుతుంది.',
        hindiAudioText: 'दोपहर खाने के बाद विटामिन सी और जिंक की गोली लें ताकि कमजोरी दूर हो।'
      },
      {
        id: 'gen_3',
        label: 'NIGHT',
        time: '08:30 PM',
        mealContext: 'After Dinner (రాత్రి భోజనం తర్వాత / रात खाने के बाद)',
        medicine: 'Cetirizine 10mg / Levocetirizine',
        purpose: 'Symptom relief for allergic rhinitis and sore throat',
        color: '#D97706',
        bg: 'rgba(217, 119, 6, 0.1)',
        teluguAudioText: 'రాత్రి భోజనం తర్వాత సెటిరిజిన్ వేసుకోండి. జలుబు, తుమ్ములు తగ్గి హాయిగా నిద్రపడుతుంది.',
        hindiAudioText: 'रात खाने के बाद सेटिरिज़िन लें ताकि छींकें और जुकाम कम हो और अच्छी नींद आए।'
      }
    ],
    reportsList: [
      {
        id: 301,
        title: 'Complete Blood Count (CBC) with Platelets',
        date: '9 May 2025',
        icon: '🔬',
        doctor: doc.doctorName,
        summary: 'Hemoglobin: 12.8 g/dL. Platelet count: 2.4 Lakhs/mcL. Resolving seasonal viral cold.',
        spokenTelugu: 'రక్త పరీక్షలో ప్లేట్‌లెట్లు 2.4 లక్షలతో సాధారణంగా ఉన్నాయి. సాధారణ సీజనల్ జలుబు మాత్రమే.',
        spokenHindi: 'सीबीसी रिपोर्ट में प्लेटलेट्स 2.4 लाख हैं। केवल सामान्य मौसमी जुकाम के लक्षण हैं।'
      },
      {
        id: 302,
        title: 'Dengue & Typhoid Antigen Serology',
        date: '8 May 2025',
        icon: '🧪',
        doctor: doc.doctorName,
        summary: 'NS1 Antigen Negative. Widal Test Negative. No bacterial or mosquito-borne infection.',
        spokenTelugu: 'డెంగ్యూ మరియు టైఫాయిడ్ పరీక్షలు నెగెటివ్ వచ్చాయి. తీవ్రమైన ఇన్ఫెక్షన్ ఏమీ లేదు.',
        spokenHindi: 'डेंगू और टाइफाइड दोनों की जांच नेगेटिव आई है। कोई गंभीर संक्रमण नहीं है।'
      }
    ]
  };
}
