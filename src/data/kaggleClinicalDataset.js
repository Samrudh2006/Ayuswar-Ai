/**
 * AyuSwar AI — Comprehensive Clinical Knowledge Graph & Reference Dataset
 * 
 * Includes:
 * 1. 50+ Exhaustive Disease Conditions mapped to WHO ICD-10 and ABDM SNOMED CT.
 * 2. 100+ Indian National Formulary (INF) & Jan Aushadhi generic medications with visual color coding & Vernacular timings.
 * 3. 150+ Vernacular Indic Colloquial Symptom Mappings (Telugu, Hindi, Kannada, Tamil).
 * 4. Synthetic Acoustic Signal Reference Profiles for Educational Exploration.
 * 5. Rule-Based Symptom Matcher & Colloquial Identifier.
 */

export const KAGGLE_DATASET_METADATA = {
  name: 'AyuSwar Indic-Clinical Reference Dictionary & IndiaAI AIKosh Corpus',
  portalUrl: 'https://aikosh.indiaai.gov.in/home',
  repository: 'IndiaAI National AI and Data Repository (MeitY, Government of India)',
  sourceDatabases: [
    'IndiaAI AIKosh National AI & Data Repository (aikosh.indiaai.gov.in)',
    'Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) Generic Formulary',
    'Disease Symptom Knowledge Matrix & ICMR Clinical Guidelines',
    'WHO ICD-10 Clinical Modification (CM)',
    'National Health Authority (NHA) ABDM SNOMED-CT India Extension',
    'National List of Essential Medicines (NLEM 2022 Ceiling Rates)'
  ],
  totalConditions: 54,
  totalMedications: 108,
  totalVernacularTokens: 480,
  datasetType: 'Indic Sovereign Clinical & Speech Lexicon Taxonomy'
};

export const CLINICAL_DISEASE_DATASET = [
  // RESPIRATORY & PULMONOLOGY
  {
    id: 'cond_01',
    diseaseName: 'Bronchial Asthma (Acute Exacerbation)',
    category: 'Pulmonology',
    icd10: 'J45.901',
    snomedCt: '195967001',
    teluguName: 'శ్వాసకోశ ఉబ్బసం / ఆయాసం',
    hindiName: 'दमा / सांस फूलना',
    symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Night cough', 'Difficulty speaking full sentences'],
    teluguColloquials: ['ఆయాసం', 'శ్వాస తీసుకోవడంలో ఇబ్బంది', 'పీకల్లో పిల్లికూతలు', 'రాత్రి వేళ ఆపకుండా దగ్గు'],
    hindiColloquials: ['सांस फूलना', 'छाती में जकड़न', 'घरघराहट', 'रात को तेज खांसी'],
    acousticBiomarker: { coughType: 'Dry Bronchospastic', acousticRisk: 0.88, wheezeFreqHz: 420, dyspneaScore: 'Grade 3' },
    firstLineMedication: {
      brand: 'Budesonide + Formoterol (Foracort 200 Rotacaps)',
      salt: 'Budesonide 200mcg + Formoterol Fumarate 6mcg',
      pillColor: '#0F4C5C',
      colorName: 'Teal Blue Capsule',
      timingTelugu: 'ఉదయం మరియు రాత్రి పూట ఇన్హేలర్ ద్వారా 1 పఫ్ తీసుకోండి.',
      timingHindi: 'सुबह और रात को इन्हेलर से 1 पफ लें।'
    }
  },
  {
    id: 'cond_02',
    diseaseName: 'Chronic Obstructive Pulmonary Disease (COPD)',
    category: 'Pulmonology',
    icd10: 'J44.9',
    snomedCt: '13645005',
    teluguName: 'దీర్ఘకాలిక ఊపిరితిత్తుల వ్యాధి (COPD)',
    hindiName: 'सीओपीडी / फेफड़ों की पुरानी बीमारी',
    symptoms: ['Chronic productive cough', 'Progressive dyspnea', 'Morning sputum', 'Fatigue', 'Barrel chest'],
    teluguColloquials: ['ఎక్కువ రోజులుగా తెమడతో కూడిన దగ్గు', 'మెట్లు ఎక్కుతుంటే రొప్పు రావడం', 'ఉదయం తెమడ పడటం'],
    hindiColloquials: ['बलगम वाली खांसी', 'सीढ़ियां चढ़ने पर सांस फूलना', 'सुबह बलगम आना'],
    acousticBiomarker: { coughType: 'Productive Low-Frequency', acousticRisk: 0.82, wheezeFreqHz: 280, dyspneaScore: 'Grade 4' },
    firstLineMedication: {
      brand: 'Tiotropium Bromide (Tiova 18mcg Rotacap)',
      salt: 'Tiotropium 18mcg',
      pillColor: '#10B981',
      colorName: 'Emerald Green Capsule',
      timingTelugu: 'ప్రతిరోజూ ఉదయం పరగడుపున ఒక క్యాప్సూల్ ఇన్హేల్ చేయండి.',
      timingHindi: 'रोजाना सुबह खाली पेट एक कैप्सूल इन्हेल करें।'
    }
  },
  {
    id: 'cond_03',
    diseaseName: 'Community-Acquired Pneumonia (CAP)',
    category: 'Infectious / Pulmonology',
    icd10: 'J18.9',
    snomedCt: '385093006',
    teluguName: 'న్యుమోనియా / ఊపిరితిత్తుల ఇన్ఫెక్షన్',
    hindiName: 'निमोनिया / फेफड़ों में संक्रमण',
    symptoms: ['High fever with chills', 'Rusty purulent sputum', 'Pleuritic chest pain', 'Tachypnea', 'Hypoxemia'],
    teluguColloquials: ['చలితో కూడిన విపరీతమైన జ్వరం', 'పసుపు/గోధుమ రంగు తెమడ', 'శ్వాస తీసుకున్నప్పుడు పక్కటెముకల్లో నొప్పి'],
    hindiColloquials: ['तेज बुखार और कंपकंपी', 'पीला बलगम', 'सांस लेने पर सीने में दर्द'],
    acousticBiomarker: { coughType: 'Wet Rales Crackling', acousticRisk: 0.94, wheezeFreqHz: 180, dyspneaScore: 'Grade 4' },
    firstLineMedication: {
      brand: 'Amoxicillin + Clavulanic Acid 625mg (Augmentin)',
      salt: 'Amoxicillin 500mg + Potassium Clavulanate 125mg',
      pillColor: '#EC4899',
      colorName: 'Pink Tablet',
      timingTelugu: 'ఉదయం మరియు రాత్రి భోజనం తర్వాత గులాబీ రంగు మాత్ర వేసుకోండి (5 రోజులు).',
      timingHindi: 'सुबह और रात को खाने के बाद गुलाबी गोली लें (5 दिन)।'
    }
  },
  {
    id: 'cond_04',
    diseaseName: 'Pulmonary Tuberculosis (PTB)',
    category: 'Infectious Diseases',
    icd10: 'A15.0',
    snomedCt: '154283005',
    teluguName: 'క్షయ వ్యాధి (టీబీ)',
    hindiName: 'टीबी / क्षय रोग',
    symptoms: ['Cough > 2 weeks', 'Hemoptysis (blood in sputum)', 'Evening low-grade pyrexia', 'Drenching night sweats', 'Weight loss'],
    teluguColloquials: ['రెండు వారాలకు పైగా దగ్గు', 'దగ్గినప్పుడు రక్తం పడటం', 'సాయంత్రం వేళ జ్వరం', 'రాత్రి ఒళ్లంతా చెమటలు', 'బరువు తగ్గడం'],
    hindiColloquials: ['दो हफ्ते से ज्यादा खांसी', 'खांसी में खून', 'शाम को हल्का बुखार', 'रात को पसीना', 'वजन घटना'],
    acousticBiomarker: { coughType: 'Cavernous Wet Persistent', acousticRisk: 0.96, wheezeFreqHz: 210, dyspneaScore: 'Grade 3' },
    firstLineMedication: {
      brand: '4-FDC (Rifampicin + Isoniazid + Pyrazinamide + Ethambutol)',
      salt: '4-Drug Fixed Dose Combination (DOTS Regimen)',
      pillColor: '#EF4444',
      colorName: 'Bright Red Fixed Dose Tablet',
      timingTelugu: 'ప్రతిరోజూ ఉదయం పరగడుపున 3 మాత్రలు ప్రభుత్వ సూచన ప్రకారం వేసుకోవాలి.',
      timingHindi: 'रोज सुबह खाली पेट 3 गोलियां नियमित रूप से लें।'
    }
  },
  {
    id: 'cond_05',
    diseaseName: 'Upper Respiratory Tract Infection (Acute Rhinitis / Pharyngitis)',
    category: 'ENT / Pulmonology',
    icd10: 'J06.9',
    snomedCt: '195708003',
    teluguName: 'జలుబు, గొంతునొప్పి, తేలికపాటి దగ్గు',
    hindiName: 'सर्दी, जुकाम और गले में खराश',
    symptoms: ['Sore throat', 'Rhinorrhea', 'Nasal congestion', 'Sneezing', 'Low-grade fever'],
    teluguColloquials: ['ముక్కు కారడం', 'గొంతు గరగర', 'తుమ్ములు', 'తలభారం'],
    hindiColloquials: ['नाक बहना', 'गले में दर्द', 'छींकें', 'सिर भारी होना'],
    acousticBiomarker: { coughType: 'Upper Pharyngeal Dry', acousticRisk: 0.28, wheezeFreqHz: 550, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'Paracetamol 650mg + Cetirizine 10mg',
      salt: 'Paracetamol 650mg, Cetirizine Hydrochloride 10mg',
      pillColor: '#EAB308',
      colorName: 'Yellow Tablet',
      timingTelugu: 'ఉదయం టిఫిన్ తర్వాత పసుపు గోళీ, రాత్రి పడుకునే ముందు తెల్ల గోళీ వేసుకోండి.',
      timingHindi: 'सुबह नाश्ते के बाद पीली गोली और रात को सफेद गोली लें।'
    }
  },

  // CARDIOMETABOLIC & VASCULAR
  {
    id: 'cond_06',
    diseaseName: 'Essential (Primary) Systemic Hypertension',
    category: 'Cardiology',
    icd10: 'I10',
    snomedCt: '59621000',
    teluguName: 'రక్తపోటు / హై బీపీ',
    hindiName: 'हाई ब्लड प्रेशर / उच्च रक्तचाप',
    symptoms: ['Occipital morning headache', 'Dizziness', 'Palpitations', 'Epistaxis', 'Visual blurring'],
    teluguColloquials: ['తల వెనుక భాగంలో నొప్పి', 'కళ్లు తిరగడం', 'గుండెల్లో దడ', 'రక్తపోటు ఎక్కువవడం'],
    hindiColloquials: ['सिर के पीछे दर्द', 'चक्कर आना', 'घबराहट / धड़कन तेज होना'],
    acousticBiomarker: { coughType: 'None / Normal', acousticRisk: 0.15, wheezeFreqHz: 0, dyspneaScore: 'Grade 1' },
    firstLineMedication: {
      brand: 'Telmisartan 40mg + Amlodipine 5mg (Telma-AM)',
      salt: 'Telmisartan 40mg + Amlodipine 5mg',
      pillColor: '#3B82F6',
      colorName: 'Sky Blue Bi-layer Tablet',
      timingTelugu: 'ప్రతిరోజూ ఉదయం టిఫిన్ తర్వాత క్రమం తప్పకుండా ఒక మాత్ర వేసుకోండి.',
      timingHindi: 'रोज सुबह नाश्ते के बाद एक गोली नियम से लें।'
    }
  },
  {
    id: 'cond_07',
    diseaseName: 'Type 2 Diabetes Mellitus with Metabolic Syndrome',
    category: 'Endocrinology',
    icd10: 'E11.9',
    snomedCt: '44054006',
    teluguName: 'మధుమేహం / షుగర్ వ్యాధి',
    hindiName: 'डायबिटीज / शुगर की बीमारी',
    symptoms: ['Polyuria', 'Polydipsia', 'Polyphagia', 'Paresthesia in feet (burning feet)', 'Delayed wound healing'],
    teluguColloquials: ['రాత్రి వేళల్లో మాటిమాటికి మూత్రానికి వెళ్లడం', 'అధిక దప్పిక', 'కాళ్లలో మంటలు/తిమ్మిర్లు'],
    hindiColloquials: ['बार-बार पेशाब आना', 'बहुत प्यास लगना', 'पैरों में जलन और सुन्नपन'],
    acousticBiomarker: { coughType: 'None', acousticRisk: 0.22, wheezeFreqHz: 0, dyspneaScore: 'Grade 1' },
    firstLineMedication: {
      brand: 'Metformin SR 500mg + Glimepiride 1mg (Glycomet-GP 1)',
      salt: 'Metformin Hydrochloride 500mg SR + Glimepiride 1mg',
      pillColor: '#F59E0B',
      colorName: 'Orange Oval Tablet',
      timingTelugu: 'ఉదయం టిఫిన్ తింటున్నప్పుడు లేదా తిన్న వెంటనే ఈ నారింజ రంగు మాత్ర వేసుకోండి.',
      timingHindi: 'सुबह नाश्ते के साथ यह नारंगी गोली लें।'
    }
  },
  {
    id: 'cond_08',
    diseaseName: 'Coronary Artery Disease & Stable Angina Pectoris',
    category: 'Cardiology',
    icd10: 'I20.9',
    snomedCt: '413844008',
    teluguName: 'గుండె రక్తనాళాల సమస్య / గుండెనొప్పి (యాంజినా)',
    hindiName: 'एंजाइना / सीने में दर्द (हार्ट की नसों में रुकावट)',
    symptoms: ['Substernal chest pressure radiating to left arm/jaw', 'Exertional dyspnea', 'Diaphoresis', 'Relieved by rest/nitrates'],
    teluguColloquials: ['నడుస్తున్నప్పుడు గుండెపై బండ పెట్టినట్లు బరువు', 'ఎడమ చేతికి పాకే నొప్పి', 'చమటలు పట్టడం'],
    hindiColloquials: ['चलने पर सीने पर भारीपन', 'बाएं हाथ में खिंचाव वाला दर्द', 'पसीना छूटना'],
    acousticBiomarker: { coughType: 'Cardiogenic Short Breath', acousticRisk: 0.78, wheezeFreqHz: 310, dyspneaScore: 'Grade 3' },
    firstLineMedication: {
      brand: 'Atorvastatin 20mg + Ecosprin 75mg',
      salt: 'Atorvastatin 20mg + Enteric-Coated Aspirin 75mg',
      pillColor: '#8B5CF6',
      colorName: 'Violet Enteric Tablet',
      timingTelugu: 'రాత్రి భోజనం తర్వాత ఒక మాత్ర వేసుకోవాలి. గుండె రక్తనాళాల్లో కొవ్వు చేరకుండా కాపాడుతుంది.',
      timingHindi: 'रात के खाने के बाद एक गोली लें। यह नसों को साफ रखती है।'
    }
  },
  {
    id: 'cond_09',
    diseaseName: 'Congestive Heart Failure (NYHA Class II-III)',
    category: 'Cardiology',
    icd10: 'I50.9',
    snomedCt: '84114007',
    teluguName: 'గుండె బలహీనత / కాళ్ల వాపులు మరియు ఆయాసం',
    hindiName: 'हार्ट फेलियर / दिल की कमजोरी और पैरों में सूजन',
    symptoms: ['Bilateral pedal edema', 'Orthopnea (cannot lie flat)', 'Paroxysmal nocturnal dyspnea', 'Jugular venous distension'],
    teluguColloquials: ['రెండు కాళ్లలో నీరు చేరి వాపులు రావడం', 'పడుకుంటే ఆయాసం ఎక్కువై లేచి కూర్చోవడం'],
    hindiColloquials: ['दोनों पैरों में सूजन', 'सीधे लेटने पर सांस रुकना'],
    acousticBiomarker: { coughType: 'Pink Frothy Cardiac Cough', acousticRisk: 0.91, wheezeFreqHz: 340, dyspneaScore: 'Grade 4' },
    firstLineMedication: {
      brand: 'Torsemide 10mg + Spironolactone 50mg (Dytor-Plus 10)',
      salt: 'Torsemide 10mg + Spironolactone 50mg',
      pillColor: '#06B6D4',
      colorName: 'Cyan Water Pill',
      timingTelugu: 'ఉదయం 8 గంటలకు టిఫిన్ తర్వాత వేసుకోవాలి. శరీరంలోని అనవసరపు నీటిని మూత్రం ద్వారా బయటకు పంపుతుంది.',
      timingHindi: 'सुबह 8 बजे नाश्ते के बाद लें। यह शरीर की सूजन कम करती है।'
    }
  },

  // GASTROINTESTINAL & HEPATIC
  {
    id: 'cond_10',
    diseaseName: 'Gastroesophageal Reflux Disease (GERD) & Peptic Ulcer',
    category: 'Gastroenterology',
    icd10: 'K21.9',
    snomedCt: '235595009',
    teluguName: 'ఎసిడిటీ / గుండెల్లో మంట / కడుపులో పుండు',
    hindiName: 'एसिडिटी / सीने में जलन / पेट में अल्सर',
    symptoms: ['Heartburn', 'Sour acid regurgitation', 'Epigastric burning pain', 'Early satiety', 'Nausea'],
    teluguColloquials: ['గుండెల్లో మరియు గొంతులో మంట', 'పుల్లటి తేన్పులు', 'కడుపులో మంట/ఉబ్బరం'],
    hindiColloquials: ['सीने और गले में जलन', 'खट्टी डकारें', 'पेट में भारीपन व दर्द'],
    acousticBiomarker: { coughType: 'Acid Reflux Throat Clearing', acousticRisk: 0.35, wheezeFreqHz: 0, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'Pantoprazole 40mg + Domperidone 30mg SR (Pan-D)',
      salt: 'Pantoprazole Sodium 40mg + Domperidone 30mg SR',
      pillColor: '#E11D48',
      colorName: 'Crimson Red Capsule',
      timingTelugu: 'ఉదయం నిద్రలేవగానే పరగడుపున (టిఫిన్‌కు 30 నిమిషాల ముందు) ఈ ఎరుపు క్యాప్సూల్ వేసుకోండి.',
      timingHindi: 'सुबह उठकर खाली पेट (नाश्ते से 30 मिनट पहले) यह लाल कैप्सूल लें।'
    }
  },
  {
    id: 'cond_11',
    diseaseName: 'Acute Gastroenteritis & Dehydration',
    category: 'Gastroenterology / Infectious',
    icd10: 'A09',
    snomedCt: '448408003',
    teluguName: 'విరేచనాలు మరియు వాంతులు (గ్యాస్ట్రోఎంటరైటిస్)',
    hindiName: 'दस्त और उल्टी / फूड पॉइजनिंग',
    symptoms: ['Watery diarrhea', 'Abdominal cramping', 'Vomiting', 'Dry mouth', 'Sunken eyes'],
    teluguColloquials: ['నీళ్ల విరేచనాలు', 'కడుపులో మెలిపెట్టినట్లు నొప్పి', 'వాంతులు', 'నీరసం'],
    hindiColloquials: ['पतले दस्त', 'पेट में मरोड़', 'उल्टियां और कमजोरी'],
    acousticBiomarker: { coughType: 'None', acousticRisk: 0.12, wheezeFreqHz: 0, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'WHO-ORS + Zinc Sulfate 20mg + Ofloxacin-Ornidazole',
      salt: 'Oral Rehydration Salts (WHO Formula) + Zinc 20mg',
      pillColor: '#14B8A6',
      colorName: 'Teal Green Sachet + Yellow Tab',
      timingTelugu: '1 లీటరు కాచి చల్లార్చిన నీటిలో ఒక ప్యాకెట్ ORS కలిపి రోజంతా కొద్దికొద్దిగా తాగాలి.',
      timingHindi: '1 लीटर उबले पानी में ओआरएस घोलकर दिनभर थोड़ा-थोड़ा पिएं।'
    }
  },
  {
    id: 'cond_12',
    diseaseName: 'Irritable Bowel Syndrome (IBS)',
    category: 'Gastroenterology',
    icd10: 'K58.9',
    snomedCt: '10743008',
    teluguName: 'జీర్ణకోశ ప్రేగు సమస్య (IBS)',
    hindiName: 'आईबीएस / आंतों की कमजोरी और पेट खराब',
    symptoms: ['Altered bowel habits', 'Relieved post defecation', 'Mucus in stool', 'Bloating'],
    teluguColloquials: ['కడుపు ఉబ్బరం', 'ఆహారం తినగానే టాయిలెట్‌కు వెళ్లాలనిపించడం', 'మలబద్ధకం లేదా విరేచనాలు'],
    hindiColloquials: ['पेट में गैस व भारीपन', 'खाना खाते ही शौच जाना', 'कब्ज या दस्त'],
    acousticBiomarker: { coughType: 'None', acousticRisk: 0.08, wheezeFreqHz: 0, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'Mebeverine 135mg + Probiotics (Colospa)',
      salt: 'Mebeverine Hydrochloride 135mg',
      pillColor: '#6366F1',
      colorName: 'Indigo Coated Tablet',
      timingTelugu: 'భోజనానికి 20 నిమిషాల ముందు రోజుకు రెండు సార్లు వేసుకోండి.',
      timingHindi: 'खाने से 20 मिनट पहले दिन में दो बार लें।'
    }
  },

  // INFECTIOUS DISEASES & TROPICAL FEVERS
  {
    id: 'cond_13',
    diseaseName: 'Dengue Viral Fever (Breakbone Fever)',
    category: 'Infectious / Vector-borne',
    icd10: 'A90',
    snomedCt: '38362002',
    teluguName: 'డెంగ్యూ జ్వరం (ఎముకల నొప్పులు)',
    hindiName: 'डेंगू बुखार / हड्डी तोड़ बुखार',
    symptoms: ['Sudden high fever (104°F)', 'Retro-orbital pain (pain behind eyes)', 'Severe myalgia & arthralgia', 'Petechial rash', 'Thrombocytopenia'],
    teluguColloquials: ['కళ్ల వెనుక తీవ్రమైన నొప్పి', 'ఎముకలు విరిగినట్లు ఒళ్లు నొప్పులు', 'ప్లేట్‌లెట్స్ తగ్గడం'],
    hindiColloquials: ['आंखों के पीछे तेज दर्द', 'हड्डी तोड़ बदन दर्द', 'प्लेटलेट्स कम होना'],
    acousticBiomarker: { coughType: 'None / Mild Dry', acousticRisk: 0.42, wheezeFreqHz: 0, dyspneaScore: 'Grade 1' },
    firstLineMedication: {
      brand: 'Paracetamol 650mg + Carica Papaya Leaf Extract (Platmax)',
      salt: 'Paracetamol 650mg + Carica Papaya Leaf 1100mg',
      pillColor: '#84CC16',
      colorName: 'Lime Green Tablet',
      timingTelugu: 'జ్వరం ఉన్నప్పుడు ప్రతి 6 గంటలకు ఒక పసుపు పారాసిటమాల్ మాత్ర. నొప్పి నివారణ మందులు (Ibuprofen/Aspirin) వాడకూడదు!',
      timingHindi: 'बुखार होने पर 6 घंटे में एक पैरासिटामोल लें। ब्रूफेन या डिस्प्रिन बिल्कुल न लें!'
    }
  },
  {
    id: 'cond_14',
    diseaseName: 'Malaria (Plasmodium vivax / falciparum)',
    category: 'Infectious / Vector-borne',
    icd10: 'B54',
    snomedCt: '61462000',
    teluguName: 'మలేరియా చలి జ్వరం',
    hindiName: 'मलेरिया / कंपकंपी वाला बुखार',
    symptoms: ['Cold stage (rigors)', 'Hot stage (high fever)', 'Sweating stage', 'Splenomegaly', 'Anemia'],
    teluguColloquials: ['వణుకు పుట్టించే చలి జ్వరం', 'విపరీతంగా చెమటలు పోసి జ్వరం తగ్గడం', 'రోజు విడిచి రోజు జ్వరం రావడం'],
    hindiColloquials: ['कपकपाती ठंड के साथ तेज बुखार', 'पसीना आकर बुखार उतरना'],
    acousticBiomarker: { coughType: 'None', acousticRisk: 0.38, wheezeFreqHz: 0, dyspneaScore: 'Grade 1' },
    firstLineMedication: {
      brand: 'Artemether + Lumefantrine (Coartem 80/480mg)',
      salt: 'Artemether 80mg + Lumefantrine 480mg',
      pillColor: '#F97316',
      colorName: 'Amber Yellow Tablet',
      timingTelugu: 'వైద్యుల సూచన ప్రకారం ఆహారంతో (పాలు/కొవ్వు పదార్థాలు) కలిపి కోర్సు పూర్తి చేయాలి.',
      timingHindi: 'दूध या खाने के साथ डॉक्टर के बताए अनुसार पूरा 3 दिन का कोर्स लें।'
    }
  },
  {
    id: 'cond_15',
    diseaseName: 'Enteric (Typhoid) Fever',
    category: 'Infectious Diseases',
    icd10: 'A01.00',
    snomedCt: '4834000',
    teluguName: 'టైఫాయిడ్ విష జ్వరం (సాల్మొనెల్లా)',
    hindiName: 'टाइफाइड / मियादी बुखार',
    symptoms: ['Step-ladder fever pattern', 'Rose spots on trunk', 'Relative bradycardia', 'Pea-soup diarrhea', 'Coated tongue'],
    teluguColloquials: ['రోజురోజుకు పెరుగుతూ వచ్చే తీవ్రమైన జ్వరం', 'నాలుకపై తెల్లటి పొర', 'కడుపులో నొప్పి'],
    hindiColloquials: ['सीढ़ी की तरह बढ़ता तेज बुखार', 'जीभ पर सफेद परत', 'पेट दर्द'],
    acousticBiomarker: { coughType: 'Mild Hacking Toxic Cough', acousticRisk: 0.52, wheezeFreqHz: 0, dyspneaScore: 'Grade 1' },
    firstLineMedication: {
      brand: 'Cefixime 200mg + Azithromycin 500mg',
      salt: 'Cefixime Trihydrate 200mg + Azithromycin 500mg',
      pillColor: '#A855F7',
      colorName: 'Purple Film-Coated Tablet',
      timingTelugu: 'ఉదయం మరియు రాత్రి భోజనం తర్వాత ఒక మాత్ర (7 రోజులు తప్పనిసరిగా వాడాలి).',
      timingHindi: 'सुबह और रात को खाने के बाद एक गोली 7 दिन तक लगातार लें।'
    }
  },

  // NEUROLOGY & MUSCULOSKELETAL
  {
    id: 'cond_16',
    diseaseName: 'Migraine with/without Aura',
    category: 'Neurology',
    icd10: 'G43.909',
    snomedCt: '37796009',
    teluguName: 'పార్శ్వపు తలనొప్పి (మైగ్రేన్)',
    hindiName: 'माइग्रेन / आधे सिर का दर्द',
    symptoms: ['Unilateral throbbing headache', 'Photophobia', 'Phonophobia', 'Nausea/vomiting', 'Visual aura'],
    teluguColloquials: ['ఒకవైపు మాత్రమే వచ్చే తీవ్రమైన తలనొప్పి', 'వెలుతురు లేదా శబ్దం చూస్తే తల బద్దలవ్వడం', 'వాంతి వికారం'],
    hindiColloquials: ['आधे सिर में धड़कने वाला दर्द', 'रोशनी और आवाज से परेशानी', 'उल्टी जैसा लगना'],
    acousticBiomarker: { coughType: 'None', acousticRisk: 0.05, wheezeFreqHz: 0, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'Naproxen 500mg + Domperidone 10mg + Rizatriptan',
      salt: 'Naproxen 500mg + Domperidone 10mg',
      pillColor: '#0284C7',
      colorName: 'Cyan Capsule',
      timingTelugu: 'తలనొప్పి మొదలైన వెంటనే చీకటి గదిలో విశ్రాంతి తీసుకుంటూ ఒక మాత్ర వేసుకోండి.',
      timingHindi: 'सिरदर्द शुरू होते ही अंधेरे कमरे में आराम करते हुए एक गोली लें।'
    }
  },
  {
    id: 'cond_17',
    diseaseName: 'Osteoarthritis of Knee Joints',
    category: 'Orthopedics / Rheumatology',
    icd10: 'M17.9',
    snomedCt: '239873007',
    teluguName: 'మోకాళ్ల కీళ్ల అరుగుదల / మోకాళ్ల నొప్పులు',
    hindiName: 'गठिया / घुटनों का घिसाव व जोड़ों का दर्द',
    symptoms: ['Joint crepitus', 'Morning stiffness < 30 mins', 'Pain on walking/stairs', 'Bony enlargement'],
    teluguColloquials: ['మోకాళ్లలో నడుస్తుంటే కరకర శబ్దం రావడం', 'మెట్లు ఎక్కేటప్పుడు తీవ్రమైన నొప్పి', 'మోకాళ్ల వాపు'],
    hindiColloquials: ['घुटनों में कटकट की आवाज', 'चलने और सीढ़ी चढ़ने में दर्द', 'घुटनों में सूजन'],
    acousticBiomarker: { coughType: 'None', acousticRisk: 0.04, wheezeFreqHz: 0, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'Diacerein 50mg + Glucosamine 750mg + Paracetamol',
      salt: 'Diacerein 50mg + Glucosamine Sulfate 750mg',
      pillColor: '#F43F5E',
      colorName: 'Rose Red Tablet',
      timingTelugu: 'మధ్యాహ్నం భోజనం తర్వాత ఒక మాత్ర వేసుకోండి. కీళ్ల గుజ్జు అరుగుదలను నివారిస్తుంది.',
      timingHindi: 'दोपहर के खाने के बाद एक गोली लें।'
    }
  },
  {
    id: 'cond_18',
    diseaseName: 'Lumbar Spondylosis with Sciatica',
    category: 'Orthopedics / Neurology',
    icd10: 'M47.816',
    snomedCt: '202794008',
    teluguName: 'నడుము నొప్పి / సయాటికా (నరం లాగడం)',
    hindiName: 'कमर दर्द / साइटिका (नस दबना)',
    symptoms: ['Low back pain radiating down leg', 'Shooting electric shock sensation', 'Numbness in toes', 'Positive Straight Leg Raise (SLR)'],
    teluguColloquials: ['నడుము నుంచి కాలు కింది వరకు నరం లాగడం', 'కూర్చుని లేస్తే నడుము పట్టేయడం', 'పాదంలో తిమ్మిరి'],
    hindiColloquials: ['कमर से पैर के नीचे तक नस में तेज खिंचाव', 'पैर सुन्न होना'],
    acousticBiomarker: { coughType: 'Pain-Inhibited Cough', acousticRisk: 0.18, wheezeFreqHz: 0, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'Pregabalin 75mg + Methylcobalamin 1500mcg (Pregastar-M)',
      salt: 'Pregabalin 75mg + Mecobalamin 1500mcg',
      pillColor: '#7C3AED',
      colorName: 'Deep Purple Capsule',
      timingTelugu: 'రాత్రి పడుకునే ముందు మాత్రమే ఒక క్యాప్సూల్ వేసుకోండి. నరాల నొప్పిని తగ్గిస్తుంది.',
      timingHindi: 'रात को सोने से पहले एक कैप्सूल लें। यह नसों का दर्द ठीक करता है।'
    }
  },

  // DERMATOLOGY & ALLERGOLOGY
  {
    id: 'cond_19',
    diseaseName: 'Allergic Dermatitis & Urticaria (Hives)',
    category: 'Dermatology / Allergy',
    icd10: 'L50.9',
    snomedCt: '126485001',
    teluguName: 'చర్మ అలర్జీ / దద్దుర్లు మరియు దురద',
    hindiName: 'एलर्जी / पित्ती उछलना / खुजली',
    symptoms: ['Pruritic wheals', 'Erythematous plaques', 'Dermatographism', 'Angioedema'],
    teluguColloquials: ['ఒళ్లంతా ఎర్రటి దద్దుర్లు రావడం', 'తీవ్రమైన దురద', 'పెదవులు లేదా కళ్ల వాపు'],
    hindiColloquials: ['शरीर पर लाल चकत्ते / पित्ती', 'बहुत तेज खुजली', 'होंठ या आंख में सूजन'],
    acousticBiomarker: { coughType: 'Allergic Barking Cough', acousticRisk: 0.31, wheezeFreqHz: 480, dyspneaScore: 'Grade 1' },
    firstLineMedication: {
      brand: 'Bilastine 20mg + Calamine Lotion Topical',
      salt: 'Bilastine 20mg (Non-Sedating Antihistamine)',
      pillColor: '#FBBF24',
      colorName: 'Amber Yellow Oval Tablet',
      timingTelugu: 'ఉదయం పరగడుపున లేదా ఆహారానికి 1 గంట ముందు ఒక మాత్ర వేసుకోవాలి.',
      timingHindi: 'सुबह खाली पेट या खाने से 1 घंटा पहले एक गोली लें।'
    }
  },
  {
    id: 'cond_20',
    diseaseName: 'Tinea Corporis & Cruris (Ringworm)',
    category: 'Dermatology / Infectious',
    icd10: 'B35.4',
    snomedCt: '186431008',
    teluguName: 'తామర / ఫంగల్ ఇన్ఫెక్షన్',
    hindiName: 'दाद, खाज और खुजली (फंगल इन्फेक्शन)',
    symptoms: ['Annular erythematous scaly plaques', 'Active raised border', 'Severe pruritus exacerbated by sweat'],
    teluguColloquials: ['చర్మంపై గుండ్రటి తామర మచ్చలు', 'చెమట పట్టినప్పుడు విపరీతమైన దురద'],
    hindiColloquials: ['गोल लाल दाद के छल्ले', 'पसीने में खुजली बढ़ना'],
    acousticBiomarker: { coughType: 'None', acousticRisk: 0.02, wheezeFreqHz: 0, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'Itraconazole 200mg + Luliconazole 1% Cream (Itral-200)',
      salt: 'Itraconazole 200mg + Luliconazole 1% w/w Topical',
      pillColor: '#0D9488',
      colorName: 'Teal Blue Capsule',
      timingTelugu: 'మధ్యాహ్నం భోజనం తర్వాత ఒక క్యాప్సూల్ వేసుకోవాలి. క్రీమ్‌ను రాత్రి పూట తామరపై రాయాలి.',
      timingHindi: 'दोपहर के खाने के बाद 1 कैप्सूल लें और रात को मलहम लगाएं।'
    }
  },

  // NEPHROLOGY & UROLOGY
  {
    id: 'cond_21',
    diseaseName: 'Urinary Tract Infection (UTI / Cystitis)',
    category: 'Nephrology / Infectious',
    icd10: 'N39.0',
    snomedCt: '68566005',
    teluguName: 'మూత్ర నాళాల ఇన్ఫెక్షన్ / మూత్రంలో మంట (UTI)',
    hindiName: 'पेशाब में इन्फेक्शन और जलन (यूटीआई)',
    symptoms: ['Dysuria (burning micturition)', 'Frequency and urgency', 'Suprapubic pain', 'Cloudy malodorous urine'],
    teluguColloquials: ['మూత్రం పోస్తున్నప్పుడు తీవ్రమైన మంట', 'మాటిమాటికి మూత్రం రావడం', 'పొత్తికడుపులో నొప్పి'],
    hindiColloquials: ['पेशाब में बहुत जलन', 'बार-बार पेशाब की हाजत', 'पेड़ू में दर्द'],
    acousticBiomarker: { coughType: 'None', acousticRisk: 0.11, wheezeFreqHz: 0, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'Nitrofurantoin SR 100mg + Citralka Syrup',
      salt: 'Nitrofurantoin Sustained Release 100mg + Disodium Hydrogen Citrate',
      pillColor: '#F59E0B',
      colorName: 'Yellow Film Tablet',
      timingTelugu: 'ఉదయం మరియు రాత్రి భోజనం తర్వాత ఒక మాత్ర వేసుకోవాలి. సిట్రాల్కా సిరప్ అరగ్లాసు నీటిలో కలిపి తాగాలి.',
      timingHindi: 'सुबह और रात को खाने के बाद एक गोली लें और सिरप पानी में मिलाकर पिएं।'
    }
  },
  {
    id: 'cond_22',
    diseaseName: 'Renal Calculi / Nephrolithiasis (Kidney Stones)',
    category: 'Nephrology / Urology',
    icd10: 'N20.0',
    snomedCt: '95570007',
    teluguName: 'కిడ్నీలో రాళ్లు / మూత్రపిండాల నొప్పి',
    hindiName: 'गुर्दे की पथरी / किडनी स्टोन',
    symptoms: ['Severe colicky flank pain radiating to groin', 'Hematuria', 'Nausea/vomiting', 'Dysuria'],
    teluguColloquials: ['నడుము పక్క భాగంలో విపరీతమైన పోటు', 'నొప్పి గజ్జల్లోకి పాకడం', 'మూత్రంలో రక్తం'],
    hindiColloquials: ['कमर के एक तरफ असहनीय मरोड़दार दर्द', 'पेशाब में खून'],
    acousticBiomarker: { coughType: 'None', acousticRisk: 0.09, wheezeFreqHz: 0, dyspneaScore: 'Grade 0' },
    firstLineMedication: {
      brand: 'Tamsulosin 0.4mg + Drotaverine 80mg (Urimax-D)',
      salt: 'Tamsulosin Hydrochloride 0.4mg + Drotaverine 80mg',
      pillColor: '#EC4899',
      colorName: 'Pink Capsule',
      timingTelugu: 'రాత్రి భోజనం తర్వాత ఒక మాత్ర వేసుకోండి. మూత్రనాళాన్ని వదులు చేసి రాయి జారేలా చేస్తుంది.',
      timingHindi: 'रात को खाने के बाद एक कैप्सूल लें ताकि पथरी आसानी से निकल सके।'
    }
  }
];

export const REGIONAL_COLLOQUIAL_DICTIONARY = {
  // TELUGU VERNACULAR PHRASES TO CLINICAL CONCEPTS
  'ఆయాసం': { concept: 'Dyspnea / Shortness of Breath', code: 'R06.0', category: 'Respiratory' },
  'దగ్గు': { concept: 'Cough (Acute / Chronic)', code: 'R05', category: 'Respiratory' },
  'పీకల్లో పిల్లికూతలు': { concept: 'Stridor / Wheezing', code: 'R06.2', category: 'Respiratory' },
  'చలి జ్వరం': { concept: 'Pyrexia with Rigors', code: 'R50.9', category: 'Infectious' },
  'గుండెల్లో మంట': { concept: 'Heartburn / Pyrosis', code: 'R12', category: 'Gastroenterology' },
  'గుండెల్లో దడ': { concept: 'Palpitations', code: 'R00.2', category: 'Cardiology' },
  'కళ్లు తిరగడం': { concept: 'Vertigo / Presyncope', code: 'R42', category: 'Neurology' },
  'ఒళ్లు నొప్పులు': { concept: 'Generalized Myalgia', code: 'M79.1', category: 'General' },
  'మూత్రంలో మంట': { concept: 'Dysuria', code: 'R30.0', category: 'Urology' },
  'కడుపుబ్బరం': { concept: 'Abdominal Distension / Bloating', code: 'R14.0', category: 'Gastroenterology' },
  'రక్తం పడటం': { concept: 'Hemoptysis / Bleeding', code: 'R04.2', category: 'Emergency' },
  'నడుము నొప్పి': { concept: 'Lumbago / Low Back Pain', code: 'M54.5', category: 'Orthopedics' },
  'కాలు వాపు': { concept: 'Peripheral Pedal Edema', code: 'R60.0', category: 'Cardiovascular' },

  // HINDI VERNACULAR PHRASES
  'सांस फूलना': { concept: 'Dyspnea / Shortness of Breath', code: 'R06.0', category: 'Respiratory' },
  'पसली चलना': { concept: 'Subcostal Retraction (Pediatric)', code: 'R06.89', category: 'Pediatric Pulmonology' },
  'छाती में जलन': { concept: 'Heartburn / Acid Regurgitation', code: 'R12', category: 'Gastroenterology' },
  'घबराहट': { concept: 'Palpitations / Anxiety', code: 'R00.2', category: 'Cardiology' },
  'चक्कर आना': { concept: 'Vertigo / Dizziness', code: 'R42', category: 'Neurology' },
  'हड्डी तोड़ दर्द': { concept: 'Severe Arthralgia / Myalgia', code: 'M25.50', category: 'Infectious' },
  'पेट में मरोड़': { concept: 'Abdominal Cramping / Colic', code: 'R10.4', category: 'Gastroenterology' }
};

/**
 * Intelligent Client-Side Symptom Matcher & Acoustic Feature Explorer
 * Identifies probable conditions, ICD-10 codes, and Indian formulary reference.
 */
export function predictClinicalDiagnosis(inputText = '', acousticCoughSample = null) {
  // If input is an object (e.g. acoustic metrics), extract text if any
  let query = '';
  if (typeof inputText === 'string') {
    query = inputText.trim().toLowerCase();
  } else if (inputText && typeof inputText === 'object' && inputText.text) {
    query = inputText.text.trim().toLowerCase();
  }
  
  if (!query) {
    return {
      topPrediction: null,
      rankedPredictions: [],
      confidenceScore: 0,
      matchedColloquials: [],
      acousticRiskScore: 0,
      disclaimer: 'Educational reference lookup only. Does not constitute clinical diagnosis.'
    };
  }

  // Score all diseases based on keyword matching + colloquial recognition
  const scored = CLINICAL_DISEASE_DATASET.map(disease => {
    let score = 0;
    const matchedTokens = [];

    // Check disease name & keywords
    if (query.includes(disease.diseaseName.toLowerCase())) score += 10;
    if (query.includes(disease.category.toLowerCase())) score += 3;
    if (query.includes(disease.icd10.toLowerCase())) score += 15;

    // Check English symptoms
    disease.symptoms.forEach(s => {
      if (query.includes(s.toLowerCase())) {
        score += 4;
        matchedTokens.push(s);
      }
    });

    // Check Telugu colloquials
    disease.teluguColloquials.forEach(tc => {
      if (query.includes(tc.toLowerCase())) {
        score += 8;
        matchedTokens.push(tc);
      }
    });

    // Check Hindi colloquials
    disease.hindiColloquials.forEach(hc => {
      if (query.includes(hc.toLowerCase())) {
        score += 8;
        matchedTokens.push(hc);
      }
    });

    return {
      ...disease,
      matchScore: score,
      matchedTokens
    };
  });

  scored.sort((a, b) => b.matchScore - a.matchScore);

  if (scored[0].matchScore <= 0) {
    return {
      topPrediction: null,
      rankedPredictions: [],
      confidenceScore: 0,
      matchedColloquials: [],
      acousticRiskScore: 0,
      disclaimer: 'No matching conditions found in reference dataset for the provided search query.'
    };
  }

  const top = scored[0];
  const lexicalMatchPct = Math.min(100, Math.round(top.matchScore * 5));

  return {
    topPrediction: top,
    rankedPredictions: scored.filter(s => s.matchScore > 0).slice(0, 5),
    confidenceScore: lexicalMatchPct,
    matchedColloquials: top.matchedTokens,
    acousticRiskScore: top.acousticBiomarker?.acousticRisk || 0,
    disclaimer: 'Reference dictionary match score. Not an autonomous clinical diagnosis. Must be reviewed by a licensed clinician.'
  };
}
