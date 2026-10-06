export const CLINICAL_ENCOUNTERS = [
  {
    id: 'telugu_cardio',
    title: 'Rural Andhra — Cardiology Encounter',
    language: 'Telugu (Rayalaseema)',
    langCode: 'te-IN',
    patient: {
      name: 'Narayana Rao (నారాయణ రావు)',
      age: 58,
      gender: 'Male',
      abhaId: '91-4521-8932-1049',
      location: 'Kurnool PHC, Andhra Pradesh',
    },
    audioDuration: '24s',
    dialogue: [
      { speaker: 'Patient', text: 'డాక్టర్ గారు, రెండు రోజుల నుండి గుండెల్లో దడగా ఉండి ఉడుకుబోస్తోంది. మెట్లు ఎక్కితే ఆయాసం వస్తుంది. నాకు షుగర్ కూడా ఉంది.', time: '0:02' },
      { speaker: 'Doctor', text: 'నారాయణ రావు గారు, బీపీ 140/90 ఉంది. పల్స్ కాస్త వేగంగా ఉంది. ముందుగా ఎకోస్ప్రిన్ 75mg రాత్రికి, మెట్‌ఫార్మిన్ 500mg ఉదయం రాస్తున్నాను. ఉప్పు తగ్గించాలి.', time: '0:12' },
      { speaker: 'Patient', text: 'ఈ మందులు ఎప్పుడు వేసుకోవాలి సార్? నాకు చదవడం రాదు.', time: '0:20' }
    ],
    acousticBiomarkers: {
      respiratoryEffort: 'Moderate (64%)',
      coughType: 'Non-productive / Exertional Wheeze',
      vocalTremor: 'Elevated Strain (38%)',
      spectralCentroid: '2410 Hz',
      jitterPercent: '1.82%',
      shimmerDb: '0.42 dB',
      riskCategory: 'High Vigilance'
    },
    vernacularMappings: [
      { dialect: 'గుండెల్లో దడ (Dada)', clinicalTerm: 'Palpitations', icd10: 'R00.2', snomed: '80313002' },
      { dialect: 'ఉడుకుబోస్తోంది (Udukubothondi)', clinicalTerm: 'Diaphoresis / Hot Flushes', icd10: 'R61.0', snomed: '52613005' },
      { dialect: 'మెట్లు ఎక్కితే ఆయాసం', clinicalTerm: 'Exertional Dyspnea (NYHA II)', icd10: 'R06.02', snomed: '282845006' }
    ],
    vitals: {
      bp: '140/90 mmHg',
      heartRate: '88 bpm',
      spo2: '96%',
      temp: '98.4 °F',
      bloodSugar: '184 mg/dL'
    },
    medications: [
      {
        name: 'Ecosprin 75mg',
        type: 'Antiplatelet',
        color: '#3B82F6',
        colorLabel: 'నీలం మాత్ర (Blue Pill)',
        timing: 'Night after dinner',
        slot: 'night',
        dose: '1 tablet',
        duration: '30 days',
        audioInstructionTelugu: 'ఈ నీలం రంగు మాత్ర (ఎకోస్ప్రిన్) రాత్రి భోజనం తర్వాత ఒకటే వేసుకోవాలి.'
      },
      {
        name: 'Metformin 500mg',
        type: 'Antidiabetic',
        color: '#10B981',
        colorLabel: 'ఆకుపచ్చ మాత్ర (Green Pill)',
        timing: 'Morning after breakfast',
        slot: 'morning',
        dose: '1 tablet',
        duration: '30 days',
        audioInstructionTelugu: 'ఈ ఆకుపచ్చ మాత్ర (మెట్‌ఫార్మిన్) ఉదయం టిఫిన్ తిన్న తర్వాత ఒకటి వేసుకోవాలి.'
      }
    ],
    fullAudioRxTelugu: 'నారాయణ రావు గారు, వినండి: ఈ ఆకుపచ్చ రంగు మాత్ర ఉదయం టిఫిన్ తర్వాత ఒకటి వేసుకోవాలి. ఈ నీలం రంగు మాత్ర రాత్రి భోజనం తర్వాత ఒకటి వేసుకోవాలి. కూరల్లో ఉప్పు బాగా తగ్గించండి.',
    karaokeWordsTelugu: [
      { word: 'నారాయణ', start: 0, end: 600 },
      { word: 'రావు గారు,', start: 600, end: 1200 },
      { word: 'వినండి:', start: 1200, end: 1800 },
      { word: 'ఈ ఆకుపచ్చ', start: 1800, end: 2600 },
      { word: 'రంగు మాత్ర', start: 2600, end: 3400 },
      { word: 'ఉదయం టిఫిన్ తర్వాత', start: 3400, end: 4600 },
      { word: 'ఒకటి వేసుకోవాలి.', start: 4600, end: 5800 },
      { word: 'ఈ నీలం రంగు మాత్ర', start: 5800, end: 7200 },
      { word: 'రాత్రి భోజనం తర్వాత', start: 7200, end: 8600 },
      { word: 'ఒకటి వేసుకోవాలి.', start: 8600, end: 9800 },
      { word: 'ఉప్పు తగ్గించండి.', start: 9800, end: 11500 }
    ],
    drugInteractionNotice: 'Verified Safe: No adverse CYP450 contraindications detected between Ecosprin and Metformin.'
  },
  {
    id: 'hindi_pediatric',
    title: 'Rural UP — Pediatric Respiratory Triage',
    language: 'Hindi (Awadhi / Hindi)',
    langCode: 'hi-IN',
    patient: {
      name: 'Aarav Kumar (आरव कुमार)',
      age: 4,
      gender: 'Male',
      abhaId: '91-8841-3312-9014',
      location: 'Varanasi Rural CHC, Uttar Pradesh',
    },
    audioDuration: '28s',
    dialogue: [
      { speaker: 'Patient (Mother)', text: 'डॉक्टर साहब, बच्चे को तीन दिन से पसली चल रही है और रात को बहुत तेज सूखी खांसी आती है। बुखार 101 डिग्री है।', time: '0:03' },
      { speaker: 'Doctor', text: 'सांस की गति 42 प्रति मिनट है, फेफड़ों में घरघराहट है। हम नेबुलाइजेशन करेंगे और एजिथ्रोमाइसिन सिरप 5ml दे रहे हैं।', time: '0:14' },
      { speaker: 'Patient (Mother)', text: 'दवा कैसे पिलानी है डॉक्टर साहब? समझा दीजिए।', time: '0:22' }
    ],
    acousticBiomarkers: {
      respiratoryEffort: 'High Strain (79%)',
      coughType: 'Severe Paroxysmal Stridor',
      vocalTremor: 'High Pediatric Distress',
      spectralCentroid: '3180 Hz',
      jitterPercent: '2.45%',
      shimmerDb: '0.68 dB',
      riskCategory: 'Urgent Triage (Amber Alert)'
    },
    vernacularMappings: [
      { dialect: 'पसली चल रही है (Pasli Chalna)', clinicalTerm: 'Subcostal Retraction / Tachypnea', icd10: 'R06.03', snomed: '271825005' },
      { dialect: 'सूखी खांसी (Sukhi Khansi)', clinicalTerm: 'Non-productive Nocturnal Cough', icd10: 'R05.1', snomed: '49727002' },
      { dialect: 'घरघराहट (Ghargharahat)', clinicalTerm: 'Bronchial Wheezing / Ronchi', icd10: 'R06.2', snomed: '56018004' }
    ],
    vitals: {
      bp: '95/62 mmHg',
      heartRate: '124 bpm',
      spo2: '94%',
      temp: '101.2 °F',
      bloodSugar: 'Normal'
    },
    medications: [
      {
        name: 'Azithromycin Oral Suspension 200mg/5ml',
        type: 'Antibiotic Macrolide',
        color: '#F59E0B',
        colorLabel: 'पीला सिरप (Yellow Bottle)',
        timing: 'Morning after breakfast',
        slot: 'morning',
        dose: '5ml once daily',
        duration: '3 days',
        audioInstructionTelugu: 'यह पीला सिरप रोज सुबह नाश्ते के बाद 5ml देना है।'
      },
      {
        name: 'Paracetamol Syrup 120mg/5ml',
        type: 'Antipyretic',
        color: '#EF4444',
        colorLabel: 'लाल सिरप (Red Bottle)',
        timing: 'When fever > 100°F (SOS)',
        slot: 'afternoon',
        dose: '5ml as needed (max 3 times)',
        duration: '3 days',
        audioInstructionTelugu: 'यह लाल सिरप केवल तभी दें जब बुखार 100 डिग्री से ज्यादा हो।'
      }
    ],
    fullAudioRxTelugu: 'आरव की माता जी, ध्यान से सुनें: यह पीला सिरप रोज सुबह 5ml देना है, 3 दिन तक। और यह लाल सिरप सिर्फ तब देना है जब बुखार आए। बच्चे को गुनगुने पानी की पट्टी दें।',
    karaokeWordsTelugu: [
      { word: 'आरव की', start: 0, end: 500 },
      { word: 'माता जी,', start: 500, end: 1100 },
      { word: 'ध्यान से सुनें:', start: 1100, end: 1900 },
      { word: 'यह पीला सिरप', start: 1900, end: 2800 },
      { word: 'रोज सुबह नाश्ते के बाद', start: 2800, end: 4100 },
      { word: '5ml देना है,', start: 4100, end: 5200 },
      { word: 'लगातार 3 दिन तक।', start: 5200, end: 6500 },
      { word: 'और लाल सिरप', start: 6500, end: 7700 },
      { word: 'सिर्फ बुखार आने पर दें।', start: 7700, end: 9500 }
    ],
    drugInteractionNotice: 'Pediatric Safety Verified: Correct weight-adjusted Azithromycin dosage (10mg/kg/day).'
  },
  {
    id: 'tenglish_metro',
    title: 'Hyderabad Urban — Hypertensive & Migraine OPD',
    language: 'Tenglish (Telugu-English Hybrid)',
    langCode: 'te-IN',
    patient: {
      name: 'Sunitha Reddy (సునీత రెడ్డి)',
      age: 44,
      gender: 'Female',
      abhaId: '91-3291-7721-5082',
      location: 'Area Hospital Malakpet, Telangana',
    },
    audioDuration: '20s',
    dialogue: [
      { speaker: 'Patient', text: 'Doctor, last one week nunchi severe head heaviness undi, especially morning time lo. Night sleep sarigga pattatledu and dizziness vastondi.', time: '0:02' },
      { speaker: 'Doctor', text: 'Sunitha garu, BP 154/96 undi, blood pressure elevated. I am starting Telmisartan 40mg once a day, early morning empty stomach.', time: '0:11' },
      { speaker: 'Patient', text: 'Daily vadala doctor? Any side effects?', time: '0:17' }
    ],
    acousticBiomarkers: {
      respiratoryEffort: 'Normal (18%)',
      coughType: 'None detected',
      vocalTremor: 'Mild Stress Jitter (22%)',
      spectralCentroid: '1940 Hz',
      jitterPercent: '1.10%',
      shimmerDb: '0.29 dB',
      riskCategory: 'Controlled'
    },
    vernacularMappings: [
      { dialect: 'Head heaviness / తల భారం', clinicalTerm: 'Tension-Type Vascular Cephalea', icd10: 'G44.2', snomed: '398057008' },
      { dialect: 'Dizziness / కళ్ళు తిరగడం', clinicalTerm: 'Benign Presyncope / Orthostatic Vertigo', icd10: 'R42', snomed: '386705008' }
    ],
    vitals: {
      bp: '154/96 mmHg',
      heartRate: '76 bpm',
      spo2: '99%',
      temp: '98.6 °F',
      bloodSugar: '112 mg/dL'
    },
    medications: [
      {
        name: 'Telmisartan 40mg',
        type: 'ARB Antihypertensive',
        color: '#8B5CF6',
        colorLabel: 'వైలెట్ మాత్ర (Violet Tablet)',
        timing: 'Morning early with water',
        slot: 'morning',
        dose: '1 tablet daily',
        duration: '30 days',
        audioInstructionTelugu: 'ఈ వైలెట్ రంగు మాత్ర ఉదయం నిద్రలేవగానే ఒక గ్లాసు నీళ్లతో రోజూ వేసుకోవాలి.'
      }
    ],
    fullAudioRxTelugu: 'సునీత గారు, ఈ వైలెట్ రంగు మాత్రను రోజూ ఉదయం నిద్రలేవగానే ఒక గ్లాసు నీళ్లతో వేసుకోండి. క్రమం తప్పకుండా బీపీ చెక్ చేయించుకోండి.',
    karaokeWordsTelugu: [
      { word: 'సునీత గారు,', start: 0, end: 800 },
      { word: 'ఈ వైలెట్ రంగు మాత్రను', start: 800, end: 2200 },
      { word: 'రోజూ ఉదయం', start: 2200, end: 3200 },
      { word: 'ఒక గ్లాసు నీళ్లతో', start: 3200, end: 4500 },
      { word: 'వేసుకోండి.', start: 4500, end: 5500 },
      { word: 'క్రమం తప్పకుండా', start: 5500, end: 6800 },
      { word: 'బీపీ చెక్ చేయించుకోండి.', start: 6800, end: 8500 }
    ],
    drugInteractionNotice: 'Renal panel check recommended after 4 weeks of Telmisartan therapy.'
  }
];
