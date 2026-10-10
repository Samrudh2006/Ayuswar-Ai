/**
 * Sanjivani-108 Clinical Emergency Scenarios & Dialect Profiles
 * Used for instant live testing alongside physical microphone input.
 */

export const SANJIVANI_EMERGENCY_SCENARIOS = [
  {
    id: 'stemi_hindi_delhi',
    title: 'Cardiac Arrest / Acute STEMI (Old Delhi)',
    language: 'Hindi / Hinglish',
    region: 'Chandni Chowk, Delhi',
    callerPersona: 'Ramesh (Anxious Son, 32)',
    patientDescription: 'Father (62M) collapsed on floor holding chest with profuse sweating',
    transcript: 'अरे भैया जल्दी एम्बुलेंस भेजो! पापा अचानक बेहोश हो गए हैं, छाती पकड़ के फर्श पर गिर पड़े! बहुत पसीना आ रहा है और सांस नहीं ले पा रहे! चांदनी चौक, लाल मंदिर के पास वाली गली में हैं हम!',
    spokenPhonetic: 'Arrey bhaiya jaldi ambulance bhejo! Papa achanak behosh ho gaye hain, chhati pakad ke farsh par gir pade! Bahut paseena aa raha hai aur saans nahi le pa rahe! Chandni Chowk, Lal Mandir ke paas wali gali mein hain hum!',
    audioDurationSec: 8.5,
    acousticPanicIndex: 94,
    pitchF0: 310, // Spiked from normal 130Hz
    hyperventilationRpm: 34,
    detectedNoiseArtifacts: ['Caller Hyperventilation', 'High Vocal Strain', 'Domestic Distress Shriek'],
    extractedLandmark: 'Lal Mandir, Chandni Chowk, Delhi',
    estimatedGps: { lat: 28.6562, lon: 77.2315 },
    triageLevel: 'RED',
    condition: 'Acute STEMI / Suspected Myocardial Infarction',
    icd10: 'I21.9',
    agentAGuidanceHindi: 'रमेश जी, शांत रहिए, एम्बुलेंस निकल चुकी है! फोन को स्पीकर पर डालिए। पापा को पीठ के बल फर्श पर सीधा लिटाएं। संजीवनी बीट शुरू हो रही है, सीने के बीच में दोनों हाथों से 2 इंच गहरा दबाइए!',
    cprPacingNeeded: true
  },
  {
    id: 'pediatric_telugu_kurnool',
    title: 'Pediatric Stridor & Respiratory Distress (Kurnool)',
    language: 'Telugu / English Code-Mix',
    region: 'Kurnool District, Andhra Pradesh',
    callerPersona: 'Lakshmi (Distressed Mother, 26)',
    patientDescription: 'Son (3M) severe dyspnea, subcostal retractions, cyanotic lips',
    transcript: 'సార్ బాబుకి ఊపిరి ఆడట్లేదు సార్! ఛాతీ లోపలికి పోతోంది, పెదవులు నీలంగా మారుతున్నాయి! దయచేసి అర్జెంట్‌గా అంబులెన్స్ పంపండి! కర్నూలు కలెక్టరేట్ రోడ్, రాజీవ్ గాంధీ సర్కిల్ దగ్గర ఉన్నాము!',
    spokenPhonetic: 'Sir baabuki oopiri aadatledu sir! Chhati lopalki potondi, pedavulu neelamga maarutunnayi! Dayachesi urgently ambulance pampandi! Kurnool Collectorate Road, Rajiv Gandhi Circle daggara unnamu!',
    audioDurationSec: 9.2,
    acousticPanicIndex: 89,
    pitchF0: 295,
    hyperventilationRpm: 38,
    detectedNoiseArtifacts: ['Infant Wheeze/Stridor', 'Mother Sobbing Cadence', 'Traffic Background'],
    extractedLandmark: 'Rajiv Gandhi Circle, Collectorate Road, Kurnool',
    estimatedGps: { lat: 15.8281, lon: 78.0373 },
    triageLevel: 'RED',
    condition: 'Pediatric Status Asthmaticus / Airway Constriction',
    icd10: 'J45.901',
    agentAGuidanceTelugu: 'లక్ష్మి గారు, భయపడకండి, అడ్వాన్స్డ్ పీడియాట్రిక్ అంబులెన్స్ బయలుదేరింది! బాబుని నిటారుగా ఒడిలో కూర్చోబెట్టండి. మెడ చుట్టూ బట్టలు వదులు చేయండి. ఇన్హేలర్ ఉంటే వెంటనే 2 పఫ్స్ ఇవ్వండి.',
    cprPacingNeeded: false
  },
  {
    id: 'highway_trauma_tanglish',
    title: 'NH-44 Highway Polytrauma (Krishnagiri)',
    language: 'Tamil / English (Tanglish)',
    region: 'NH-44 Toll Plaza, Krishnagiri',
    callerPersona: 'Karthik (Highway Bystander, 28)',
    patientDescription: 'Driver pinned in damaged vehicle with heavy arterial bleeding',
    transcript: 'Hello 108! Major accident on NH-44 highway near Krishnagiri Toll! Lorry crash aayiruchu, car driver cabin-la trapped aagi irukkaru, blood neraiya bleed aaguthu! Romba emergency, send ambulance with cutter fast!',
    spokenPhonetic: 'Hello 108! Major accident on NH-44 highway near Krishnagiri Toll! Lorry crash aayiruchu, car driver cabin-la trapped aagi irukkaru, blood neraiya bleed aaguthu! Romba emergency, send ambulance with cutter fast!',
    audioDurationSec: 7.8,
    acousticPanicIndex: 96,
    pitchF0: 275,
    hyperventilationRpm: 32,
    detectedNoiseArtifacts: ['Highway Truck Engine Roar', 'Metal Debris Impact', 'High Ambient Wind'],
    extractedLandmark: 'NH-44 Toll Plaza, Krishnagiri',
    estimatedGps: { lat: 12.5266, lon: 78.2144 },
    triageLevel: 'RED',
    condition: 'High-Velocity Highway Polytrauma & Hemorrhagic Shock',
    icd10: 'T07',
    agentAGuidanceTamil: 'Karthik, calm-aa irunga! Rescue unit with hydraulic cutters dispatched! Ratham vara idathula oru thuni vachu direct-aa amukki pidinga. Kazhuthaiyum mudhugaiyum asaikka koodadhu!',
    cprPacingNeeded: false
  }
];
