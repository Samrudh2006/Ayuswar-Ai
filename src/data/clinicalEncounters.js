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
      abhaAddress: 'narayana.rao@abdm',
      hprId: 'HPR-IN-2024-99824',
      doctorName: 'Dr. Priya Sharma, MD',
      hfrId: 'HFR-AP-KRN-0042',
      facilityName: 'Kurnool Model Rural PHC',
      icd10: 'I25.9',
      icd10Desc: 'Chronic ischemic heart disease',
      snomedCt: '414545008',
      snomedDesc: 'Ischemic heart disease (disorder)',
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
      abhaAddress: 'aarav.kumar@abdm',
      hprId: 'HPR-IN-2024-99824',
      doctorName: 'Dr. Priya Sharma, MD',
      hfrId: 'HFR-UP-VNS-0015',
      facilityName: 'Varanasi Rural CHC',
      icd10: 'J20.9',
      icd10Desc: 'Acute bronchitis, unspecified',
      snomedCt: '10509002',
      snomedDesc: 'Acute bronchitis (disorder)',
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
      abhaAddress: 'sunitha.reddy@abdm',
      hprId: 'HPR-IN-2024-99824',
      doctorName: 'Dr. Priya Sharma, MD',
      hfrId: 'HFR-TG-HYD-0021',
      facilityName: 'Area Hospital Malakpet',
      icd10: 'I10',
      icd10Desc: 'Essential (primary) hypertension',
      snomedCt: '38341003',
      snomedDesc: 'Hypertensive disorder (disorder)',
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
  },
  {
    id: 'tamil_geriatric',
    title: 'Rural Tamil Nadu — Diabetic Neuropathy & Joint Care',
    language: 'Tamil (தமிழ்)',
    langCode: 'ta-IN',
    patient: {
      name: 'Thirunavukkarasu (திருநாவுக்கரசு)',
      age: 62,
      gender: 'Male',
      abhaId: '91-6632-1198-4421',
      location: 'Madurai Rural PHC, Tamil Nadu',
      abhaAddress: 'meenakshi.amma@abdm',
      hprId: 'HPR-IN-2024-99824',
      doctorName: 'Dr. Priya Sharma, MD',
      hfrId: 'HFR-TN-MDU-0063',
      facilityName: 'Madurai Model Primary Health Centre',
      icd10: 'M17.9',
      icd10Desc: 'Osteoarthritis of knee, unspecified',
      snomedCt: '239873007',
      snomedDesc: 'Osteoarthritis of knee (disorder)',
    },
    audioDuration: '22s',
    dialogue: [
      { speaker: 'Patient', text: 'டாக்டர் ஐயா, ரெண்டு மாசமா முழங்கால் வலி அதிகமா இருக்கு. ராத்திரியில் பாதத்தில் சுளீர்னு ஊசி குத்துற மாதிரி எரிச்சல் இருக்கு.', time: '0:02' },
      { speaker: 'Doctor', text: 'திருநாவுக்கரசு அவர்களே, சர்க்கரை அளவு 192 இருக்கு. நரம்பு பலவீனத்தால் இந்த எரிச்சல் வருது. பிரிகபாலின் மற்றும் மெட்ஃபார்மின் மாத்திரை மாற்றித் தருகிறேன்.', time: '0:12' },
      { speaker: 'Patient', text: 'இந்த மாத்திரையை எப்படி சாப்பிடணும் ஐயா? மறதி அதிகமா இருக்கு.', time: '0:19' }
    ],
    acousticBiomarkers: {
      respiratoryEffort: 'Normal (22%)',
      coughType: 'None detected',
      vocalTremor: 'Mild Geriatric Frailty (29%)',
      spectralCentroid: '1820 Hz',
      jitterPercent: '1.24%',
      shimmerDb: '0.34 dB',
      riskCategory: 'Chronic Vigilance'
    },
    vernacularMappings: [
      { dialect: 'முழங்கால் வலி (Muzhangal Vali)', clinicalTerm: 'Bilateral Knee Arthralgia', icd10: 'M25.561', snomed: '239720000' },
      { dialect: 'பாதத்தில் எரிச்சல் (Padhathil Erichal)', clinicalTerm: 'Diabetic Peripheral Neuropathy', icd10: 'E11.42', snomed: '230572002' }
    ],
    vitals: {
      bp: '136/84 mmHg',
      heartRate: '78 bpm',
      spo2: '98%',
      temp: '98.4 °F',
      bloodSugar: '192 mg/dL'
    },
    medications: [
      {
        name: 'Pregabalin 75mg',
        type: 'Neuropathic Analgesic',
        color: '#6366F1',
        colorLabel: 'நீல மாத்திரை (Blue Pill)',
        timing: 'Night before sleep',
        slot: 'night',
        dose: '1 capsule',
        duration: '30 days',
        audioInstructionTelugu: 'இந்த நீல நிற மாத்திரையை இரவு தூங்குவதற்கு முன் ஒரு மாத்திரை போட வேண்டும்.'
      },
      {
        name: 'Metformin 500mg SR',
        type: 'Antidiabetic Biguanide',
        color: '#10B981',
        colorLabel: 'பச்சை மாத்திரை (Green Pill)',
        timing: 'Morning after breakfast',
        slot: 'morning',
        dose: '1 tablet',
        duration: '30 days',
        audioInstructionTelugu: 'இந்த பச்சை நிற மாத்திரையை காலை உணவு சாப்பிட்ட பின் ஒன்று போட வேண்டும்.'
      }
    ],
    fullAudioRxTelugu: 'திருநாவுக்கரசு அவர்களே, கவனமாகக் கேளுங்கள்: இந்த பச்சை மாத்திரை காலையில் சாப்பிட வேண்டும். இந்த நீல மாத்திரை இரவில் படுக்கும் போது போட வேண்டும். இனிப்பு உணவுகளைக் குறைக்கவும்.',
    karaokeWordsTelugu: [
      { word: 'திருநாவுக்கரசு அவர்களே,', start: 0, end: 900 },
      { word: 'கவனமாகக் கேளுங்கள்:', start: 900, end: 1900 },
      { word: 'இந்த பச்சை மாத்திரை', start: 1900, end: 3200 },
      { word: 'காலையில் சாப்பிட வேண்டும்.', start: 3200, end: 4700 },
      { word: 'இந்த நீல மாத்திரை', start: 4700, end: 6000 },
      { word: 'இரவில் படுக்கும் போது போடவும்.', start: 6000, end: 7800 },
      { word: 'இனிப்பு உணவுகளைக் குறைக்கவும்.', start: 7800, end: 9800 }
    ],
    drugInteractionNotice: 'No critical CYP450 interactions detected between Metformin and Pregabalin.'
  },
  {
    id: 'kannada_maternal',
    title: 'Rural Karnataka — Maternal Antenatal & Anemia Triage',
    language: 'Kannada (ಕನ್ನಡ)',
    langCode: 'kn-IN',
    patient: {
      name: 'Lakshmi Gowda (ಲಕ್ಷ್ಮಿ ಗೌಡ)',
      age: 26,
      gender: 'Female',
      abhaId: '91-7741-2091-8833',
      location: 'Mandya Rural CHC, Karnataka',
      abhaAddress: 'soumya.gowda@abdm',
      hprId: 'HPR-IN-2024-99824',
      doctorName: 'Dr. Priya Sharma, MD',
      hfrId: 'HFR-KA-MYS-0041',
      facilityName: 'Mysuru Rural Maternal & Child Health Centre',
      icd10: 'O26.9',
      icd10Desc: 'Pregnancy-related condition, unspecified',
      snomedCt: '198992004',
      snomedDesc: 'Antenatal care (regime/therapy)',
    },
    audioDuration: '24s',
    dialogue: [
      { speaker: 'Patient', text: 'ಡಾಕ್ಟರೇ, ಐದು ತಿಂಗಳ ಗರ್ಭಿಣಿ. ಬೆಳಗ್ಗೆ ಎದ್ದಾಗ ತುಂಬಾ ಸುಸ್ತು ಮತ್ತು ತಲೆತಿರುಗುವಿಕೆ ಬರುತ್ತೆ. ಊಟ ಸೇರುತ್ತಿಲ್ಲ.', time: '0:02' },
      { speaker: 'Doctor', text: 'ಲಕ್ಷ್ಮಿ ಅವರೇ, ರಕ್ತ ಪರೀಕ್ಷೆಯಲ್ಲಿ ಹಿಮೋಗ್ಲೋಬಿನ್ 9.4 ಬಂದಿದೆ. ಸ್ವಲ್ಪ ರಕ್ತಹೀನತೆ ಇದೆ. ಕಬ್ಬಿಣದ ಅಂಶದ ಕೆಂಪು ಮಾತ್ರೆ ಮತ್ತು ವಾಂತಿ ನಿಲ್ಲಲು ಮಾತ್ರೆ ಬರೆಯುತ್ತಿದ್ದೇನೆ.', time: '0:12' },
      { speaker: 'Patient', text: 'ಹಾಲಿನ ಜೊತೆ ತಗೋಬೇಕಾ ಡಾಕ್ಟರೇ ಅಥವಾ ನೀರಿನ ಜೊತೆನಾ?', time: '0:20' }
    ],
    acousticBiomarkers: {
      respiratoryEffort: 'Normal (16%)',
      coughType: 'None detected',
      vocalTremor: 'Mild Gestational Fatigue (24%)',
      spectralCentroid: '2150 Hz',
      jitterPercent: '0.98%',
      shimmerDb: '0.26 dB',
      riskCategory: 'Antenatal Monitored'
    },
    vernacularMappings: [
      { dialect: 'ಸುಸ್ತು ಮತ್ತು ತಲೆತಿರುಗುವಿಕೆ (Susthu & Thale)', clinicalTerm: 'Gestational Anemia / Presyncope', icd10: 'O99.012', snomed: '271737000' },
      { dialect: 'ಊಟ ಸೇರುತ್ತಿಲ್ಲ (Oota Seruttilla)', clinicalTerm: 'Hyperemesis / Morning Sickness', icd10: 'O21.0', snomed: '267029007' }
    ],
    vitals: {
      bp: '110/70 mmHg',
      heartRate: '82 bpm',
      spo2: '99%',
      temp: '98.6 °F',
      bloodSugar: '96 mg/dL (Hb: 9.4 g/dL)'
    },
    medications: [
      {
        name: 'Ferrous Ascorbate + Folic Acid 100mg',
        type: 'Hematinic Supplement',
        color: '#DC2626',
        colorLabel: 'ಕೆಂಪು ಮಾತ್ರೆ (Red Tablet)',
        timing: 'Afternoon after lunch',
        slot: 'afternoon',
        dose: '1 tablet',
        duration: '90 days',
        audioInstructionTelugu: 'ಈ ಕೆಂಪು ಗುಳಿಗೆಯನ್ನು ಮಧ್ಯಾಹ್ನ ಊಟದ ನಂತರ ನಿಂಬೆ ನೀರಿನ ಜೊತೆ ತೆಗೆದುಕೊಳ್ಳಿ.'
      },
      {
        name: 'Doxylamine + Pyridoxine 10mg/10mg',
        type: 'Antiemetic Antihistamine',
        color: '#F59E0B',
        colorLabel: 'ಹಳದಿ ಮಾತ್ರೆ (Yellow Tablet)',
        timing: 'Night before bedtime',
        slot: 'night',
        dose: '1 tablet',
        duration: '14 days',
        audioInstructionTelugu: 'ಈ ಹಳದಿ ಗುಳಿಗೆಯನ್ನು ರಾತ್ರಿ ಮಲಗುವ ಮುಂಚೆ ತೆಗೆದುಕೊಳ್ಳಿ.'
      }
    ],
    fullAudioRxTelugu: 'ಲಕ್ಷ್ಮಿ ಅವರೇ, ಗಮನವಿಟ್ಟು ಕೇಳಿ: ಈ ಕೆಂಪು ಗುಳಿಗೆಯನ್ನು ಮಧ್ಯಾಹ್ನ ಊಟದ ನಂತರ ನೀರಿನ ಜೊತೆ ತೆಗೆದುಕೊಳ್ಳಿ, ಹಾಲಿನ ಜೊತೆ ಬೇಡ. ಹಳದಿ ಗುಳಿಗೆಯನ್ನು ರಾತ್ರಿ ಮಲಗುವ ಮುಂಚೆ ತೆಗೆದುಕೊಳ್ಳಿ.',
    karaokeWordsTelugu: [
      { word: 'ಲಕ್ಷ್ಮಿ ಅವರೇ,', start: 0, end: 700 },
      { word: 'ಗಮನವಿಟ್ಟು ಕೇಳಿ:', start: 700, end: 1500 },
      { word: 'ಈ ಕೆಂಪು ಗುಳಿಗೆಯನ್ನು', start: 1500, end: 2800 },
      { word: 'ಮಧ್ಯಾಹ್ನ ಊಟದ ನಂತರ', start: 2800, end: 4100 },
      { word: 'ನೀರಿನ ಜೊತೆ ತೆಗೆದುಕೊಳ್ಳಿ.', start: 4100, end: 5400 },
      { word: 'ಹಳದಿ ಗುಳಿಗೆಯನ್ನು', start: 5400, end: 6700 },
      { word: 'ರಾತ್ರಿ ಮಲಗುವ ಮುಂಚೆ ತೆಗೆದುಕೊಳ್ಳಿ.', start: 6700, end: 8900 }
    ],
    drugInteractionNotice: 'Safe Antenatal Protocol: Take Iron with Vitamin C (Lemon Water) for 4x absorption.'
  },
  {
    id: 'marathi_pulmonary',
    title: 'Rural Maharashtra — Chronic Pulmonary Bronchitis',
    language: 'Marathi (मराठी)',
    langCode: 'mr-IN',
    patient: {
      name: 'Dattatray Shinde (दत्तात्रय शिंदे)',
      age: 54,
      gender: 'Male',
      abhaId: '91-3319-8802-5147',
      location: 'Pune Rural PHC, Maharashtra',
      abhaAddress: 'dattatray.more@abdm',
      hprId: 'HPR-IN-2024-99824',
      doctorName: 'Dr. Priya Sharma, MD',
      hfrId: 'HFR-MH-PUN-0092',
      facilityName: 'Pune Rural Primary Health Centre',
      icd10: 'J44.1',
      icd10Desc: 'COPD with acute exacerbation',
      snomedCt: '13645005',
      snomedDesc: 'Chronic obstructive lung disease (disorder)',
    },
    audioDuration: '26s',
    dialogue: [
      { speaker: 'Patient', text: 'डॉक्टर साहेब, शेतात काम करताना छातीत घरघर आवाज होतो आणि खूप दम भरतो. खोकल्यातून पिवळा कफ पडतो.', time: '0:02' },
      { speaker: 'Doctor', text: 'दत्तात्रय काका, स्टेथॉस्कोप तपासणीत श्वासनलिकेत सूज (Wheezing) जाणवते आहे. मी इनहेलर आणि कफ सिरप लिहून देत आहे. शेतात जाताना मास्क वापरा.', time: '0:13' },
      { speaker: 'Patient', text: 'हा पंप कसा ओढायचा साहेब? मला नीट समजावून सांगा.', time: '0:21' }
    ],
    acousticBiomarkers: {
      respiratoryEffort: 'High Strain (72%)',
      coughType: 'Productive Chronic Wheeze',
      vocalTremor: 'Exertional Tremor (41%)',
      spectralCentroid: '2680 Hz',
      jitterPercent: '2.10%',
      shimmerDb: '0.55 dB',
      riskCategory: 'High Vigilance'
    },
    vernacularMappings: [
      { dialect: 'छातीत घरघर (Chhatit Gharghar)', clinicalTerm: 'Bilateral Expiratory Wheeze / Ronchi', icd10: 'R06.2', snomed: '56018004' },
      { dialect: 'दम भरतो (Dam Bharto)', clinicalTerm: 'Exertional Dyspnea (COPD Phenotype)', icd10: 'R06.02', snomed: '282845006' }
    ],
    vitals: {
      bp: '128/82 mmHg',
      heartRate: '86 bpm',
      spo2: '95%',
      temp: '98.6 °F',
      bloodSugar: '110 mg/dL'
    },
    medications: [
      {
        name: 'Salbutamol Inhaler 100mcg',
        type: 'Beta-2 Bronchodilator',
        color: '#0284C7',
        colorLabel: 'निळा पंप (Blue Inhaler)',
        timing: 'Twice daily (Morning & Evening)',
        slot: 'morning',
        dose: '2 puffs',
        duration: '30 days',
        audioInstructionTelugu: 'हा निळा पंप दिवसातून दोनदा दोन पफ तोंडातून खोल श्वास घेऊन ओढायचा आहे.'
      },
      {
        name: 'Ambroxol + Levocetirizine Syrup',
        type: 'Mucolytic Expectorant',
        color: '#D97706',
        colorLabel: 'केशरी बाटली (Orange Syrup)',
        timing: 'Morning & Night after meals',
        slot: 'night',
        dose: '10ml twice daily',
        duration: '7 days',
        audioInstructionTelugu: 'हे केशरी औषध जेवणानंतर दहा मिली सकाळी आणि रात्री घ्यावे.'
      }
    ],
    fullAudioRxTelugu: 'दत्तात्रय काका, लक्ष देऊन ऐका: हा निळा इनहेलर पंप दिवसातून दोनदा दोन पफ ओढायचा आहे. हे केशरी सिरप जेवणानंतर दहा मिली घ्या. शेतात जाताना नाकाला रुमाल किंवा मास्क नक्की लावा.',
    karaokeWordsTelugu: [
      { word: 'दत्तात्रय काका,', start: 0, end: 700 },
      { word: 'लक्ष देऊन ऐका:', start: 700, end: 1500 },
      { word: 'हा निळा इनहेलर पंप', start: 1500, end: 2900 },
      { word: 'दिवसातून दोनदा दोन पफ ओढा.', start: 2900, end: 4600 },
      { word: 'केशरी सिरप जेवणानंतर', start: 4600, end: 6000 },
      { word: 'दहा मिली घ्यावे.', start: 6000, end: 7200 },
      { word: 'मास्क नक्की लावा.', start: 7200, end: 8800 }
    ],
    drugInteractionNotice: 'Inhaler Technique Verified: Rinse mouth with warm water after inhalation.'
  },
  {
    id: 'bengali_gi',
    title: 'Rural West Bengal — Acid Peptic Disease & Dyspepsia',
    language: 'Bengali (বাংলা)',
    langCode: 'bn-IN',
    patient: {
      name: 'Debabrata Ghosh (দেবব্রত ঘোষ)',
      age: 48,
      gender: 'Male',
      abhaId: '91-4412-9981-6723',
      location: 'Burdwan Rural Hospital, West Bengal',
      abhaAddress: 'debabrata.ghosh@abdm',
      hprId: 'HPR-IN-2024-99824',
      doctorName: 'Dr. Priya Sharma, MD',
      hfrId: 'HFR-WB-BRD-0051',
      facilityName: 'Burdwan Rural Hospital',
      icd10: 'K21.9',
      icd10Desc: 'Gastro-esophageal reflux disease',
      snomedCt: '235595009',
      snomedDesc: 'Gastroesophageal reflux disease (disorder)',
    },
    audioDuration: '23s',
    dialogue: [
      { speaker: 'Patient', text: 'ডাক্তারবাবু, এক মাস ধরে বুকে প্রচণ্ড জ্বালা আর পেট ফাঁপা লাগছে। তেল-ঝাল খেলে টক ঢেকুর ওঠে।', time: '0:02' },
      { speaker: 'Doctor', text: 'দেবব্রত বাবু, আপনার গ্যাস্ট্রাইটিসের সমস্যা হয়েছে। আমি সকালে খালি পেটে খাওয়ার জন্য রাবেপ্রাজল এবং রাতে এন্টাসিড সিরাপ লিখে দিচ্ছি। চা ও তেলেভাজা বন্ধ করুন।', time: '0:12' },
      { speaker: 'Patient', text: 'ওষুধগুলো খাওয়ার নিয়মটা বাংলায় একটু বলে দেবেন ডাক্তারবাবু?', time: '0:19' }
    ],
    acousticBiomarkers: {
      respiratoryEffort: 'Normal (14%)',
      coughType: 'None detected',
      vocalTremor: 'Slight Discomfort (18%)',
      spectralCentroid: '1910 Hz',
      jitterPercent: '0.88%',
      shimmerDb: '0.22 dB',
      riskCategory: 'Controlled'
    },
    vernacularMappings: [
      { dialect: 'বুকে জ্বালা (Buke Jwala)', clinicalTerm: 'Pyrosis / Acid Reflux', icd10: 'K21.9', snomed: '698065002' },
      { dialect: 'পেট ফাঁপা (Pet Phapa)', clinicalTerm: 'Abdominal Meteorism / Dyspepsia', icd10: 'R14.0', snomed: '236077008' }
    ],
    vitals: {
      bp: '124/80 mmHg',
      heartRate: '74 bpm',
      spo2: '98%',
      temp: '98.4 °F',
      bloodSugar: '130 mg/dL'
    },
    medications: [
      {
        name: 'Rabeprazole 20mg + Domperidone 30mg SR',
        type: 'Proton Pump Inhibitor + Prokinetic',
        color: '#EAB308',
        colorLabel: 'হলুদ ক্যাপসুল (Yellow Capsule)',
        timing: 'Early morning 30 mins before breakfast',
        slot: 'morning',
        dose: '1 capsule',
        duration: '14 days',
        audioInstructionTelugu: 'এই হলুদ ক্যাপসুলটি প্রতিদিন সকালে ঘুম থেকে উঠে খালি পেটে জল দিয়ে খাবেন।'
      },
      {
        name: 'Oxetacaine + Aluminium Hydroxide Gel',
        type: 'Antacid Gel',
        color: '#EC4899',
        colorLabel: 'গোলাপি সিরাপ (Pink Gel)',
        timing: 'Night 1 hour after dinner',
        slot: 'night',
        dose: '10ml',
        duration: '10 days',
        audioInstructionTelugu: 'এই গোলাপি জেলটি রাতে খাওয়ার এক ঘণ্টা পরে দশ মিলি খাবেন।'
      }
    ],
    fullAudioRxTelugu: 'দেবব্রত বাবু, মন দিয়ে শুনুন: এই হলুদ ক্যাপসুলটি রোজ সকালে খালি পেটে এক গ্লাস জল দিয়ে খাবেন। আর গোলাপি সিরাপটি রাতে শোওয়ার আগে খাবেন। অতিরিক্ত চা ও তেলেভাজা খাবেন না।',
    karaokeWordsTelugu: [
      { word: 'দেবব্রত বাবু,', start: 0, end: 700 },
      { word: 'মন দিয়ে শুনুন:', start: 700, end: 1500 },
      { word: 'এই হলুদ ক্যাপসুলটি', start: 1500, end: 2800 },
      { word: 'সকালে খালি পেটে খাবেন।', start: 2800, end: 4300 },
      { word: 'গোলাপি সিরাপটি রাতে', start: 4300, end: 5700 },
      { word: 'শোওয়ার আগে খাবেন।', start: 5700, end: 7100 },
      { word: 'তেলেভাজা খাবেন না।', start: 7100, end: 8700 }
    ],
    drugInteractionNotice: 'No interaction risk: Generic Rabeprazole + Domperidone matches Jan Aushadhi generic guidelines.'
  }
];

