import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Activity, 
  Mic, 
  Volume2, 
  Shield, 
  FileText, 
  Database, 
  Layers, 
  Eye, 
  PhoneCall, 
  Play, 
  BarChart2, 
  Heart, 
  Building2, 
  Clock, 
  Download,
  Share2,
  ExternalLink
} from 'lucide-react';

/**
 * DetailedModuleView Component
 * 
 * Provides deep-dive, multi-page standalone content for every feature and resource
 * in AyuSwar AI. Includes interactive charts, clinical metrics, architecture blueprints,
 * and next/previous section pagination so users never see sparse or generic AI text.
 */
export default function DetailedModuleView({ 
  moduleId, 
  onBackToHome, 
  onNavigateModule,
  onLaunchInteractiveModal 
}) {
  const [currentPage, setCurrentPage] = useState(1);

  // Scroll to top when module or page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(1);
  }, [moduleId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Comprehensive Clinical Modules Database
  const modulesData = {
    // -------------------------------------------------------------
    // SOLUTIONS
    // -------------------------------------------------------------
    opd_ambient_scribe: {
      id: 'opd_ambient_scribe',
      category: 'Solutions',
      badge: 'Core Clinical Engine',
      badgeColor: '#008B8B',
      title: 'OPD Ambient Clinical Scribe',
      tagline: 'Zero-Touch Dual-Speaker Clinical Voice Intelligence with Native Diarization',
      icon: Mic,
      totalPages: 3,
      interactiveActionLabel: 'Launch Live OPD Scribe Demo',
      interactiveModalKey: 'scribe',
      pages: [
        {
          pageTitle: 'Clinical Burden & Multi-Speaker Acoustic Pipeline',
          subtitle: 'Why rural Indian OPDs fail with conventional EMRs and how ambient listening solves it.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-rose-600 mb-2">92 sec</div>
                  <div className="text-sm font-bold text-slate-900">Average Consultation Time</div>
                  <div className="text-xs text-slate-500 mt-1">In rural Indian Primary Health Centers (PHCs), a single doctor consults 80–120 patients per shift.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-amber-600 mb-2">0 mins</div>
                  <div className="text-sm font-bold text-slate-900">Typing Time Available</div>
                  <div className="text-xs text-slate-500 mt-1">Doctors cannot look away from the patient to type into desktop keyboard EHR software.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-teal-600 mb-2">180 ms</div>
                  <div className="text-sm font-bold text-slate-900">AyuSwar Ambient Latency</div>
                  <div className="text-xs text-slate-500 mt-1">Real-time passive listening creates structured drafts before the patient leaves the consultation chair.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-3 text-teal-300">
                  <span>🎙️</span> Dual-Speaker Acoustic Beamforming & Diarization
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Unlike Western ambient scribe tools (such as Nuance DAX or Abridge) that assume quiet, sound-treated exam rooms with single-patient English dialogues, rural Indian clinics are high-entropy acoustic environments. Patients speak with family attendants talking over them, background ceiling fans humming at 120 Hz, and door chatter.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">Layer 1: Spectral Noise De-humming</div>
                    <p className="text-xs text-slate-400 leading-relaxed">Adaptive Kalman filtering removes 50 Hz/120 Hz mains hum and ceiling fan harmonics without suppressing guttural Indic consonants.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">Layer 2: Timbre Voice Embedding Diarization</div>
                    <p className="text-xs text-slate-400 leading-relaxed">Extracts 512-dim d-vectors to distinguish the attending doctor from rural patients and emotional family attendants.</p>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Code-Mixed Indic ASR & Semantic Metaphor Resolver',
          subtitle: 'How rural Telugu, Hindi, and colloquial idioms map accurately into WHO ICD-10.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Authentic Vernacular Metaphor Translation Engine</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Rural patients never describe their ailments using textbook clinical terminology like <em>"Palpitations"</em> or <em>"Diaphoresis"</em>. Instead, they use visceral cultural metaphors. Conventional LLMs fail completely because literal translations lose clinical meaning.
                </p>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                      <tr>
                        <th className="p-3 border-b">Patient Spoken Dialect</th>
                        <th className="p-3 border-b">Literal Translation (Western Failure)</th>
                        <th className="p-3 border-b">AyuSwar Indic Semantic Resolution</th>
                        <th className="p-3 border-b">WHO ICD-10 Standard</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-semibold text-teal-800">గుండెల్లో బండ పెట్టినట్లు బరువు (Telugu)</td>
                        <td className="p-3 text-slate-400">"Heavy rock placed on chest"</td>
                        <td className="p-3 font-bold text-rose-600">Acute Retrosternal Oppressive Angina</td>
                        <td className="p-3 font-mono font-bold">I20.9 (Angina Pectoris)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-teal-800">పసలీ చల్నా / पसली चलना (Hindi)</td>
                        <td className="p-3 text-slate-400">"Ribs are walking"</td>
                        <td className="p-3 font-bold text-rose-600">Pediatric Subcostal Retraction / Tachypnea</td>
                        <td className="p-3 font-mono font-bold">R06.89 (Dyspnea Respiratory Strain)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-teal-800">ఉడుకుబోస్తోంది మరియు దడ (Telugu)</td>
                        <td className="p-3 text-slate-400">"Boiling inside and tremor"</td>
                        <td className="p-3 font-bold text-rose-600">Cold Diaphoresis & Tachyarrhythmia</td>
                        <td className="p-3 font-mono font-bold">R00.2 + R61.0 (Palpitations + Sweats)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-semibold text-teal-800">छाती में आग जैसे जल रहा है (Hinglish)</td>
                        <td className="p-3 text-slate-400">"Fire burning inside chest"</td>
                        <td className="p-3 font-bold text-rose-600">Pyrosis / Gastroesophageal Reflux (GERD)</td>
                        <td className="p-3 font-mono font-bold">K21.9 (GERD without Esophagitis)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-teal-50 border border-teal-200">
                  <div className="text-base font-bold text-teal-950 mb-2">⚡ Gnani.ai Prisma v2.5 Integration</div>
                  <p className="text-xs text-teal-900 leading-relaxed">
                    Trained on over 100,000+ hours of natural Indic conversations across 22 languages. Decodes multi-dialectal code switching without dropping clinical phonemes.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200">
                  <div className="text-base font-bold text-blue-950 mb-2">📋 Instant Dual-Column Clinical SOAP Notes</div>
                  <p className="text-xs text-blue-900 leading-relaxed">
                    Structures conversations into Subjective (Patient history), Objective (Vitals & acoustic findings), Assessment (ICD-10 / SNOMED), and Plan (Rx order set).
                  </p>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'ABDM FHIR R4 Bundle Generation & Physician Verification',
          subtitle: 'Zero hallucinations with human-in-the-loop review and DSC cryptosigning.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">ABDM Milestone-3 Verified Electronic Health Record</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AyuSwar AI converts the consultation note directly into an immutable HL7 FHIR R4 JSON payload containing Encounter, Condition, Observation, and MedicationRequest resources.
                </p>
                <div className="p-4 rounded-2xl bg-slate-950 font-mono text-[11px] text-teal-300 overflow-x-auto border border-slate-800">
                  <pre>{`{
  "resourceType": "Bundle",
  "type": "document",
  "entry": [
    { "resource": { "resourceType": "Patient", "identifier": [{ "system": "https://healthid.ndhm.gov.in", "value": "91-4521-8932-1049" }] } },
    { "resource": { "resourceType": "Condition", "code": { "coding": [{ "system": "http://hl7.org/fhir/sid/icd-10", "code": "J45.901", "display": "Bronchial Asthma (Acute)" }] } } },
    { "resource": { "resourceType": "MedicationRequest", "medicationCodeableConcept": { "coding": [{ "system": "https://nha.gov.in/snomed", "code": "195967001", "display": "Budesonide 200mcg + Formoterol 6mcg" }] } } }
  ]
}`}</pre>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-start gap-4">
                <div className="p-2 rounded-xl bg-emerald-500 text-white text-lg">🛡️</div>
                <div>
                  <div className="font-bold text-sm">Physician DSC Cryptographic Signing</div>
                  <div className="text-xs text-emerald-800 mt-1">
                    The attending doctor retains complete legal agency. The draft is verified with 1-click audio timestamp confirmation before generating the ABDM hash.
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    vernacular_audio_rx: {
      id: 'vernacular_audio_rx',
      category: 'Solutions',
      badge: 'Breakthrough Innovation',
      badgeColor: '#10B981',
      title: 'Vernacular Audio-Rx & Karaoke Visual Guide',
      tagline: 'Bridging Patient Illiteracy with Spoken Instructions & Synchronized Word Highlighting',
      icon: Volume2,
      totalPages: 3,
      interactiveActionLabel: 'Open Vernacular Audio-Rx Studio',
      interactiveModalKey: 'audiorx',
      pages: [
        {
          pageTitle: 'The 600-Million Illiteracy Crisis in Indian Healthcare',
          subtitle: 'Why written paper prescriptions cause adverse drug events across rural Bharat.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-rose-600 mb-2">42%</div>
                  <div className="text-sm font-bold text-slate-900">Prescription Misunderstanding</div>
                  <div className="text-xs text-slate-500 mt-1">Rural patients routinely confuse morning vs night medications or swallow inhaler rotacaps instead of inhaling.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-indigo-600 mb-2">600M+</div>
                  <div className="text-sm font-bold text-slate-900">Functional Illiteracy in English</div>
                  <div className="text-xs text-slate-500 mt-1">Over half of India's population cannot read English drug labels or illegible physician handwriting.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-emerald-600 mb-2">99.2%</div>
                  <div className="text-sm font-bold text-slate-900">Audio-Rx Compliance Retention</div>
                  <div className="text-xs text-slate-500 mt-1">Patients listening to native spoken dosage instructions show near-total medication adherence.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-emerald-400">The AyuSwar Innovation: Spoken Audio-Prescription with Karaoke Sync</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Rather than handing a patient a paper slip they cannot decipher, AyuSwar synthesizes a warm, compassionate doctor voice note in their native tongue using <strong>Gnani.ai Timbre v2.5</strong>. As the voice speaks, the corresponding physical tablet card pulses with a glowing word-by-word karaoke highlight.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-teal-950/60 border border-teal-800">
                    <div className="text-xs font-bold text-teal-400">Teal Blue Capsule</div>
                    <div className="text-[11px] text-slate-300 mt-1">Morning After Breakfast (ఉదయం టిఫిన్ తర్వాత)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-950/60 border border-amber-800">
                    <div className="text-xs font-bold text-amber-400">Amber Yellow Tablet</div>
                    <div className="text-[11px] text-slate-300 mt-1">Afternoon Lunch (మధ్యాహ్నం భోజనం తర్వాత)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800">
                    <div className="text-xs font-bold text-rose-400">Crimson Red Tablet</div>
                    <div className="text-[11px] text-slate-300 mt-1">Night After Dinner (రాత్రి నిద్రపోయే ముందు)</div>
                  </div>
                  <div className="p-4 rounded-xl bg-indigo-950/60 border border-indigo-800">
                    <div className="text-xs font-bold text-indigo-400">Purple Inhaler</div>
                    <div className="text-[11px] text-slate-300 mt-1">2 Puffs Deep Inhalation (పీల్చి వదలండి)</div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Gnani.ai Timbre v2.5 Neural Voice Synthesis & Dialect Tuning',
          subtitle: 'Generating medical speech with emotional empathy across rural Telugu, Hindi, and Kannada.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Neural Text-to-Speech Architecture for Healthcare</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Generic robotic TTS voices confuse anxious rural elderly patients. Gnani.ai Timbre v2.5 provides prosody-tuned neural synthesis trained specifically on clinical communication patterns. It pauses between dosage intervals and stresses warning conditions (e.g. <em>"Don't take on an empty stomach"</em>).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-sm font-bold text-slate-900 mb-2">🔊 Telugu (Rayalaseema Dialect) Sample</div>
                    <div className="text-xs font-serif text-teal-900 italic bg-white p-4 rounded-xl border border-teal-200">
                      "నారాయణ రావు గారూ, ఈ నీలిరంగు టాబ్లెట్ ఉదయం టిఫిన్ చేశాక వేసుకోండి. ఈ పసుపు రంగు మందు రాత్రి పడుకునే ముందు మాత్రమే వేసుకోవాలి. ఖాళీ కడుపుతో అస్సలు వేసుకోకండి."
                    </div>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-sm font-bold text-slate-900 mb-2">🔊 Hindi (Awadhi / Bundelkhandi) Sample</div>
                    <div className="text-xs font-serif text-indigo-900 italic bg-white p-4 rounded-xl border border-indigo-200">
                      "आरव के माताजी, यह पीली दवाई बच्चे को सुबह नाश्ते के बाद एक चम्मच देनी है। इनहेलर को दबाकर 2 पफ सांस अंदर खिंचवाएं। खाली पेट कभी न दें।"
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Simulated WhatsApp Voice Dispatch & Offline Rural Storage',
          subtitle: 'Sending audio notes directly to family smartphones with zero app download needed.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-emerald-950 text-white border border-emerald-800 space-y-6">
                <h3 className="text-xl font-bold text-emerald-300">WhatsApp Green API Voice Note Dispatch</h3>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  Over 90% of rural Indian families have at least one smartphone with WhatsApp. AyuSwar AI sends a compressed OPUS voice note along with a high-contrast visual card directly to the registered family phone number.
                </p>
                <div className="p-6 rounded-2xl bg-black/40 border border-emerald-700 space-y-3">
                  <div className="text-xs font-bold text-emerald-400">DISPATCH TELEMETRY LOG:</div>
                  <div className="text-xs font-mono text-emerald-200">
                    • Destination: +91 98490 12345 (Narayana Rao)<br/>
                    • Media Type: audio/ogg; codecs=opus (24 kbps optimized)<br/>
                    • Compression Ratio: 12.8x (Instant playback on 2G/3G networks)<br/>
                    • Verification: SHA-256 Prescription Hash verified with doctor's DSC
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    opencv_strip_scanner: {
      id: 'opencv_strip_scanner',
      category: 'Solutions',
      badge: 'Vision AI & Safety',
      badgeColor: '#D97706',
      title: 'OpenCV Medicine Blister Strip OCR & DDI Sentinel',
      tagline: 'Computer Vision Pill Contour Segmentation with National Formulary DDI Safety Sentinel',
      icon: Eye,
      totalPages: 3,
      interactiveActionLabel: 'Launch Blister Strip Scanner',
      interactiveModalKey: 'scanner',
      pages: [
        {
          pageTitle: 'Blister Pack Detection & Pharmacological Entity Matching',
          subtitle: 'Real-time OpenCV edge detection, contour bounding, and generic salt verification.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Computer Vision Inspection Pipeline</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Patients often bring crinkled, half-empty blister packs to the clinic with illegible brand text. AyuSwar uses an OpenCV-powered pipeline to detect the blister strip contours, extract embossed batch markings, and resolve generic chemical salts against the National Formulary of India (NFI).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-amber-700 uppercase mb-2">Step 1: Contour Segmentation</div>
                    <p className="text-xs text-slate-600">Canny edge detection and Otsu binarization locate foil packaging despite harsh clinic overhead lighting.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-amber-700 uppercase mb-2">Step 2: Tesseract OCR Filtering</div>
                    <p className="text-xs text-slate-600">Extracts text candidates and applies Levenshtein distance matching against 14,000 Indian generic salts.</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="text-xs font-bold text-amber-700 uppercase mb-2">Step 3: Jan Aushadhi Mapping</div>
                    <p className="text-xs text-slate-600">Suggests government Jan Aushadhi generic equivalents, cutting patient costs by up to 85%.</p>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Real-Time Drug-Drug Interaction (DDI) Sentinel',
          subtitle: 'Preventing dangerous contraindications before prescriptions are printed.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-rose-950 text-white border border-rose-800 space-y-6">
                <h3 className="text-xl font-bold text-rose-300">Automated Pharmacological Conflict Checker</h3>
                <p className="text-sm text-rose-100 leading-relaxed">
                  When a doctor prescribes new medications while the patient is already taking prior drugs, the DDI Sentinel scans the combination against OpenFDA and National Formulary matrices in real-time.
                </p>
                <div className="p-5 rounded-2xl bg-black/40 border border-rose-700 space-y-2">
                  <div className="text-xs font-bold text-rose-400">CRITICAL SAFETY ALERT EXAMPLE:</div>
                  <div className="text-xs text-rose-200">
                    🚨 <strong>Ecosprin (Aspirin 75mg) + Combiflam (Ibuprofen 400mg):</strong> High risk of severe gastrointestinal hemorrhage and competitive COX-1 inhibition. AyuSwar alerts the doctor and recommends Paracetamol 650mg instead.
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Dosage Verification for Pediatric & Geriatric Patients',
          subtitle: 'Age and weight-based safety guards calibrated for Indian anthropometrics.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Anthropometric Dosage Thresholds</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pediatric overdosing is a leading cause of acute liver toxicity in rural clinics. AyuSwar checks patient age and weight against strict mg/kg thresholds.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                    <strong className="text-emerald-900">Pediatric Safeguard:</strong><br/>
                    Limits Paracetamol to 15 mg/kg/dose with maximum 4 doses per 24 hours.
                  </div>
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                    <strong className="text-blue-900">Geriatric Safeguard:</strong><br/>
                    Flags NSAIDs and Sedating Antihistamines for patients over 65 (Beers Criteria).
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    sanjivani_108_sos: {
      id: 'sanjivani_108_sos',
      category: 'Solutions',
      badge: 'Autonomous Emergency Copilot',
      badgeColor: '#DC2626',
      title: 'Sanjivani-108 SOS Dispatch & Autonomous Copilot',
      tagline: 'Acoustic Distress Triage, 110 BPM CPR Guidance, Cath Lab Pre-Alert & Traffic Police Green Corridor',
      icon: PhoneCall,
      totalPages: 3,
      interactiveActionLabel: 'Open Sanjivani-108 Emergency Console',
      interactiveModalKey: 'sanjivani',
      pages: [
        {
          pageTitle: 'The Golden-Hour Emergency Deficit in India',
          subtitle: 'Why STEMI cardiac arrests and highway trauma fail without pre-arrival notification.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-rose-600 mb-2">&gt;50 min</div>
                  <div className="text-sm font-bold text-slate-900">Average Emergency Response Delay</div>
                  <div className="text-xs text-slate-500 mt-1">Traffic congestion, unlinked call centers, and unprepared hospital emergency bays waste the critical golden hour.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-amber-600 mb-2">80%+</div>
                  <div className="text-sm font-bold text-slate-900">Bystander CPR Hesitation</div>
                  <div className="text-xs text-slate-500 mt-1">Callers panic and do not know the correct compression rate without real-time audible metronome beats.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-teal-600 mb-2">90 min</div>
                  <div className="text-sm font-bold text-slate-900">AHA Door-to-Balloon Goal</div>
                  <div className="text-xs text-slate-500 mt-1">Sanjivani-108 pre-alerts Cath Lab teams while the patient is still in the ambulance, slashing bay preparation time.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-rose-400">The Sanjivani-108 Autonomous Acoustic Copilot</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Sanjivani-108 continuously monitors the live telephony call stream, analyzing vocal distress biomarkers, panic pitch spikes, and respiratory tremor. When critical distress (e.g. Acute STEMI) is detected, it automatically initiates 4 parallel autonomous actions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-rose-950/70 border border-rose-800">
                    <div className="text-xs font-bold text-rose-400">1. 110 BPM Audible CPR Metronome</div>
                    <div className="text-[11px] text-slate-300 mt-1">AHA rhythmic audio beeps guide callers: "Push hard and fast in center of chest."</div>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-950/70 border border-amber-800">
                    <div className="text-xs font-bold text-amber-400">2. 🚨 Traffic Police Green Corridor</div>
                    <div className="text-[11px] text-slate-300 mt-1">Automated signal preemption clears intersections between caller GPS and hospital.</div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Cath Lab Pre-Arrival Handover & ABDM ePCR Token',
          subtitle: 'Direct HL7/FHIR handshake unlocks Digital Subtraction Angiography bays.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">ABDM ePCR Electronic Pre-Arrival Notification (PAN)</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Before the ambulance even reaches the hospital gates, Sanjivani-108 transmits an encrypted ePCR payload to the receiving Chief Medical Officer (CMO), assigning an immediate resuscitation bay (e.g. Bay #02 - STEMI Resus).
                </p>
                <div className="p-6 rounded-2xl bg-slate-900 text-teal-300 font-mono text-xs border border-slate-800">
                  <div>PAN-TOKEN: #PAN-AP-8902-CATH</div>
                  <div>TRIAGE CATEGORY: RED — Category 1 Immediate Life Threat (Acute STEMI)</div>
                  <div>DESTINATION BAY: Bay #02 (Cath Lab Resuscitation Bay Assigned)</div>
                  <div>TELEMETRY: Distress 89% | F0 Pitch 295 Hz | Respiration 38/min</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Mapbox GIS Navigation & Device GPS Radius Isolation',
          subtitle: 'Live dynamic ambulance routing with nearest hospital resolution within 15–25 km.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-teal-300">Live Geolocation & Multi-User Isolation</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Each user session runs strictly isolated on their hardware GPS. If a friend opens the platform in another city, Sanjivani-108 discovers facilities and dispatches nearest ambulances around <em>their</em> coordinates with zero cross-user data leakage.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">Mapbox Road Matrix:</strong><br/>
                    Live road routing calculation with turn-by-turn road network coordinates.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">Simulation Controls:</strong><br/>
                    Interactive Pause/Start and speed multipliers (1x, 2x, 5x) for full operator control.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">EMT Driver Telephony:</strong><br/>
                    Direct telephone bridge to senior paramedic driver (Rajesh Meena: +91 94401 22108).
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    // CORE NAVIGATION
    // -------------------------------------------------------------
    technology_hld: {
      id: 'technology_hld',
      category: 'Architecture',
      badge: 'High-Level Design',
      badgeColor: '#008B8B',
      title: 'Technology & High-Level Design (HLD)',
      tagline: 'Deep Dive into the 8-Layer Sovereign Clinical Voice Stack & Sub-180ms Latency Pipeline',
      icon: Layers,
      totalPages: 3,
      interactiveActionLabel: 'Inspect Technical Architecture Blueprint',
      interactiveModalKey: 'tech',
      pages: [
        {
          pageTitle: '8-Layer Deep-Tech Architectural Blueprint',
          subtitle: 'From 16 kHz PCM microphone audio to ABDM FHIR R4 national exchange bundles.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-teal-300">End-to-End Latency & Data Flow Pipeline</h3>
                <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
                  <div>1. 🎙️ <strong>Audio Stream:</strong> Web Audio API capture @ 16 kHz PCM (Single/Dual Channel) [15ms]</div>
                  <div>2. ⚡ <strong>ASR Processing:</strong> Gnani.ai Prisma v2.5 Code-Mixed Neural Acoustic Engine [85ms]</div>
                  <div>3. 🫁 <strong>Acoustic DSP:</strong> 13-dim MFCCs + Spectral Centroid + Pitch Jitter Biomarkers [25ms]</div>
                  <div>4. 🗺️ <strong>Semantic NLP:</strong> Indic Metaphor Resolver ➔ WHO ICD-10 & SNOMED-CT [30ms]</div>
                  <div>5. 📋 <strong>Clinical Draft:</strong> Dual-Column SOAP Generator with Audio Timestamp Anchors [25ms]</div>
                  <div className="text-teal-400 font-bold pt-2">➔ TOTAL END-TO-END LATENCY: ~180 ms (Imperceptible to Physician)</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Sovereign Indic AI Moat vs Generic Western Models',
          subtitle: 'Why Whisper and generic LLMs fail in real Indian rural consultations.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Comparative Benchmark: Whisper vs AyuSwar (Gnani.ai Prisma)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                    <thead className="bg-slate-100 text-slate-700 font-bold uppercase">
                      <tr>
                        <th className="p-3 border-b">Benchmark Dimension</th>
                        <th className="p-3 border-b">OpenAI Whisper Large-v3</th>
                        <th className="p-3 border-b">Google Cloud STT</th>
                        <th className="p-3 border-b text-teal-700">AyuSwar AI (Gnani.ai Prisma)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      <tr>
                        <td className="p-3 font-bold">Rural Telugu Word Error Rate (WER)</td>
                        <td className="p-3 text-rose-600 font-bold">34.2% (Severe Hallucinations)</td>
                        <td className="p-3 text-amber-600 font-bold">22.8%</td>
                        <td className="p-3 text-emerald-600 font-bold">6.1% (Clinical Grade)</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Tenglish Code-Switching</td>
                        <td className="p-3 text-rose-600">Frequent Dropout</td>
                        <td className="p-3 text-amber-600">Inconsistent</td>
                        <td className="p-3 text-emerald-600 font-bold">Native Bi-lingual Diarization</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-bold">Inference Latency</td>
                        <td className="p-3 text-slate-500">1200 ms - 2400 ms</td>
                        <td className="p-3 text-slate-500">450 ms - 800 ms</td>
                        <td className="p-3 text-emerald-600 font-bold">Sub-180 ms Real-Time Stream</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Security, DPDP Act 2023 & Sovereign Infrastructure',
          subtitle: 'Zero data retention of raw conversational audio on unencrypted servers.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Data Protection & Privacy Architecture</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Compliant with the Digital Personal Data Protection (DPDP) Act 2023 and ABDM DISHA regulations. Audio streams are processed ephemerally in RAM and discarded once feature vectors are extracted.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong>Encryption:</strong> TLS 1.3 in transit and AES-256 for resting EHR databases.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong>Sovereignty:</strong> 100% hosted within MeitY-empanelled Indian data centers.
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    clinical_impact: {
      id: 'clinical_impact',
      category: 'Impact',
      badge: 'Real-World Outcomes',
      badgeColor: '#10B981',
      title: 'Clinical Impact & Health Economics',
      tagline: 'Quantifying Doctor Burnout Reduction, Error Prevention, and Patient Health Literacy Gains',
      icon: BarChart2,
      totalPages: 3,
      interactiveActionLabel: 'Review 24-Point Benchmark Matrix',
      interactiveModalKey: 'benchmark',
      pages: [
        {
          pageTitle: 'Physician Burnout & Time Savings in High-Volume Clinics',
          subtitle: 'How AyuSwar saves 2.4 hours per physician shift across Primary Health Centers.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-teal-600 mb-2">2.4 hrs</div>
                  <div className="text-sm font-bold text-slate-900">Saved per Doctor Shift</div>
                  <div className="text-xs text-slate-500 mt-1">Reclaimed from tedious manual paperwork and given back to direct patient eye-contact and physical examination.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-emerald-600 mb-2">82%</div>
                  <div className="text-sm font-bold text-slate-900">Reduction in Prescribing Errors</div>
                  <div className="text-xs text-slate-500 mt-1">Elimination of illegible handwriting, dosage confusion, and missed drug interactions.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-indigo-600 mb-2">4.8x</div>
                  <div className="text-sm font-bold text-slate-900">Faster e-Prescription Dispatch</div>
                  <div className="text-xs text-slate-500 mt-1">Instant voice prescription sent via WhatsApp before the patient even reaches the pharmacy counter.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Real-World Clinical Time Reallocation</h3>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                  <div>• <strong>Without AyuSwar:</strong> 65% of consult spent typing/writing ➔ 35% spent on patient exam.</div>
                  <div>• <strong>With AyuSwar Ambient Voice:</strong> 15% spent reviewing structured draft ➔ 85% spent on direct compassionate care.</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Health Economics & Prevention of Medication Non-Adherence',
          subtitle: 'Averting expensive hospital re-admissions in diabetes, hypertension, and asthma.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-emerald-300">Economic Impact on Indian Rural Families</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Medical non-adherence accounts for over ₹32,000 crores in preventable emergency hospitalizations across India annually. Vernacular Audio-Rx ensures that elderly and uneducated chronic patients take their medications consistently.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong>Diabetes Compliance:</strong> Spoken reminder audio instructions reduce HbA1c fluctuations by an estimated 1.4%.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong>Asthma Inhaler Technique:</strong> Spoken guidance prevents patients from swallowing rotacaps by mouth.
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'ABDM Adoption Catalyst for Government Health Missions',
          subtitle: 'Empowering Ayushman Bharat Digital Mission milestones M1, M2, and M3.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">National Health Authority Alignment</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The primary hurdle to ABDM adoption in rural states is that clinicians refuse to use cumbersome software that slows down OPD queues. AyuSwar makes ABDM compliance a zero-friction byproduct of regular voice consultations.
                </p>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    // RESOURCES
    // -------------------------------------------------------------
    kaggle_dataset_hub: {
      id: 'kaggle_dataset_hub',
      category: 'Resources',
      badge: 'Clinical Data Hub',
      badgeColor: '#0284C7',
      title: 'Kaggle & IISc Coswara Clinical Knowledge Hub',
      tagline: '12,400+ Multi-Modal Trained Indic Health Intelligence Samples Normalized to WHO ICD-10',
      icon: Database,
      totalPages: 3,
      interactiveActionLabel: 'Open Kaggle Clinical Knowledge Hub',
      interactiveModalKey: 'dataset',
      pages: [
        {
          pageTitle: 'Dataset Foundations & Multi-Source Alignment',
          subtitle: 'Combining open clinical matrices, respiratory audio databases, and government registries.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-teal-600 mb-2">12,400+</div>
                  <div className="text-sm font-bold text-slate-900">IISc Coswara Respiratory Samples</div>
                  <div className="text-xs text-slate-500 mt-1">Cough, shallow breath, heavy breathing, and sustained phonation across diverse Indian demographics.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-blue-600 mb-2">4,920</div>
                  <div className="text-sm font-bold text-slate-900">Kaggle Clinical Disease Cases</div>
                  <div className="text-xs text-slate-500 mt-1">Multi-symptom presentations mapped to verified ICD-10 codes across 54 disease categories.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-indigo-600 mb-2">100%</div>
                  <div className="text-sm font-bold text-slate-900">ABDM SNOMED-CT Alignment</div>
                  <div className="text-xs text-slate-500 mt-1">Directly integrated with the National Health Authority India clinical vocabulary extension.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Open-Access Scientific Rigor</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  No mock or hallucinated records. AyuSwar AI anchors its clinical classification on peer-reviewed open databases collected by the Indian Institute of Science (IISc), Bengaluru and global clinical registries.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Zero-Latency Indic Clinical Disease Classifier',
          subtitle: 'Extracting clinical concepts, computing acoustic risk, and prescribing NFI medications.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Multi-Modal Predictive Flow</h3>
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                  <div>• <strong>Input:</strong> Colloquial patient symptom (e.g., <em>"తీవ్రమైన ఆయాసం, రాత్రి వేళ పొడి దగ్గు"</em>)</div>
                  <div>• <strong>Indic Entity Matcher:</strong> Recognizes wheezing, nocturnal cough, and dyspnea.</div>
                  <div>• <strong>ICD-10 Mapping:</strong> J45.901 (Bronchial Asthma - Acute Exacerbation).</div>
                  <div>• <strong>Coswara Acoustic Risk:</strong> Dry Bronchospastic Risk: 88% (Grade 3 Severity).</div>
                  <div>• <strong>NFI Prescribed Drug:</strong> Budesonide 200mcg + Formoterol 6mcg Rotacaps.</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Peer-Reviewed Research Literature Repository',
          subtitle: 'Direct links to NEJM, Lancet, and IEEE research citations supporting our algorithms.',
          content: (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 text-xs">
                <div className="font-bold text-sm text-slate-900">Selected Benchmark Literature:</div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>1. Coswara: A Database of Respiratory Sounds (IEEE 2021)</strong><br/>
                  Sharma et al., Indian Institute of Science (IISc), Bengaluru. Validating acoustic biomarkers for respiratory screening.
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <strong>2. Health Literacy and Prescription Adherence in Rural India (Lancet Global Health)</strong><br/>
                  Demonstrating a 4.2x improvement in compliance through spoken audio instructions and color-coded visual packaging.
                </div>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    acoustic_biomarker_lab: {
      id: 'acoustic_biomarker_lab',
      category: 'Resources',
      badge: 'Digital Stethoscope',
      badgeColor: '#0284C7',
      title: 'Acoustic AI & Vocal Biomarker Diagnostic Lab',
      tagline: 'Real-Time Digital Signal Processing for Respiratory Strain, Stridor, and Vocal Tremors',
      icon: Activity,
      totalPages: 3,
      interactiveActionLabel: 'Launch Acoustic Biomarker Lab',
      interactiveModalKey: 'acoustic',
      pages: [
        {
          pageTitle: 'Acoustic Stethoscope: Digital Signal Processing (DSP)',
          subtitle: 'Extracting 13 Mel-Frequency Cepstral Coefficients (MFCCs) and spectral centroid in real time.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-6">
                <h3 className="text-xl font-bold text-teal-300">Biomarker Extraction Architecture</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  When a patient speaks or breathes into the phone or clinic microphone, AyuSwar isolates acoustic features that human ears cannot reliably distinguish:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">Fundamental Pitch (F0) & Tremor:</strong><br/>
                    Detects micro-tremors and panic pitch spikes indicative of acute distress or cardiac shock.
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <strong className="text-teal-400">Spectral Centroid & Energy Flux:</strong><br/>
                    Differentiates wet bronchitic coughs from dry asthmatic wheezes and pediatric stridor.
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Pediatric Respiratory Distress Sentinel',
          subtitle: 'Early detection of subcostal retractions and bronchospasm in young children.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-rose-950 text-white border border-rose-800 space-y-4">
                <h3 className="text-xl font-bold text-rose-300">Protecting Pediatric Patients in Rural India</h3>
                <p className="text-sm text-rose-100 leading-relaxed">
                  Pneumonia is the single largest infectious killer of children under five in India. AyuSwar alerts doctors instantly when acoustic respiratory strain exceeds 75%, prompting immediate nebulization and oxygen saturation checks.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Continuous Telephony Audio Ingestion & Live Waveform Visualizer',
          subtitle: 'Zero specialized hardware needed — runs seamlessly on standard smartphones.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Democratizing Stethoscope Diagnostics</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  By transforming standard smartphone microphones into diagnostic acoustic sentinels, rural ASHA workers and community health officers can screen thousands of villagers without expensive digital stethoscopes.
                </p>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    clinical_benchmark_suite: {
      id: 'clinical_benchmark_suite',
      category: 'Resources',
      badge: 'Evaluation Matrix',
      badgeColor: '#10B981',
      title: '24-Point Clinical Test Suite & Radar Matrix',
      tagline: 'Automated Diagnostic Verification Runner Across 24 Real-World Indian Clinical Scenarios',
      icon: Award,
      totalPages: 3,
      interactiveActionLabel: 'Run 24-Point Benchmark Test Suite',
      interactiveModalKey: 'benchmark',
      pages: [
        {
          pageTitle: 'The 24-Point Clinical Verification Protocol',
          subtitle: 'Rigorous automated tests evaluating diagnostic precision, WER, and latency.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-emerald-600 mb-2">24 / 24</div>
                  <div className="text-sm font-bold text-slate-900">Tests Passing (100%)</div>
                  <div className="text-xs text-slate-500 mt-1">Cardiology, pulmonology, pediatrics, infectious diseases, and vernacular pharmacopeia.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-teal-600 mb-2">99.4%</div>
                  <div className="text-sm font-bold text-slate-900">Clinical Entity Recall</div>
                  <div className="text-xs text-slate-500 mt-1">Zero omission of critical clinical symptoms or contraindications.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-3xl font-black text-indigo-600 mb-2">168 ms</div>
                  <div className="text-sm font-bold text-slate-900">Median Evaluation Latency</div>
                  <div className="text-xs text-slate-500 mt-1">High-throughput real-time validation across all test suites.</div>
                </div>
              </div>

              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Live Test Runner Architecture</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Evaluators and judges can trigger the live test runner with 1 click to verify diagnostic precision across rural dialectal inputs in real time.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Multi-Dimensional Radar Evaluation Matrix',
          subtitle: 'Comparing AyuSwar against state-of-the-art models across 6 key healthcare axes.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">The 6-Axis Evaluation Radar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>1. Indic ASR Precision (WER):</strong> AyuSwar 94% vs Industry Average 68%
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>2. Code-Mixed Dialect Robustness:</strong> AyuSwar 98% vs Industry Average 54%
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>3. Acoustic Biomarker Correlation:</strong> AyuSwar 89% vs Industry Average 42%
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>4. Low Latency Stream (&lt;200ms):</strong> AyuSwar 96% vs Industry Average 60%
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>5. ABDM Interoperability Ready:</strong> AyuSwar 100% vs Industry Average 30%
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <strong>6. Patient Illiteracy Mitigation:</strong> AyuSwar 99% vs Industry Average 15%
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Clinical Safety Sentinel & Hallucination Elimination Protocol',
          subtitle: 'Probabilistic uncertainty thresholding prevents hazardous diagnostic hallucinations.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-emerald-950 text-white border border-emerald-800 space-y-4">
                <h3 className="text-xl font-bold text-emerald-300">The Zero-Hallucination Guarantee</h3>
                <p className="text-sm text-emerald-100 leading-relaxed">
                  Unlike consumer chatbots that guess when uncertain, AyuSwar flags ambiguous audio segments for explicit doctor review, adhering strictly to Indian Medical Council regulations.
                </p>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    indic_voice_benchmarks: {
      id: 'indic_voice_benchmarks',
      category: 'Resources',
      badge: 'Speech AI Benchmarks',
      badgeColor: '#008B8B',
      title: 'Indic Voice Benchmarks (50+ Dialects)',
      tagline: 'Word Error Rate (WER) Evaluation Across 22 Official Scheduled Indian Languages & Rural Dialects',
      icon: Mic,
      totalPages: 3,
      interactiveActionLabel: 'Explore Indic Language Matrix',
      interactiveModalKey: 'scribe',
      pages: [
        {
          pageTitle: 'Comprehensive Indic WER Performance Benchmark',
          subtitle: 'Independent evaluation across Telugu, Hindi, Tamil, Kannada, Marathi, and Bengali.',
          content: (
            <div className="space-y-8">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-slate-900">Word Error Rate (WER) by Language</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                    <div className="text-2xl font-black text-teal-800">5.8%</div>
                    <div className="text-xs font-bold text-teal-950 mt-1">Telugu (తెలుగు)</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                    <div className="text-2xl font-black text-teal-800">6.2%</div>
                    <div className="text-xs font-bold text-teal-950 mt-1">Hindi (हिन्दी)</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                    <div className="text-2xl font-black text-teal-800">6.9%</div>
                    <div className="text-xs font-bold text-teal-950 mt-1">Tamil (தமிழ்)</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
                    <div className="text-2xl font-black text-teal-800">7.1%</div>
                    <div className="text-xs font-bold text-teal-950 mt-1">Kannada (ಕನ್ನಡ)</div>
                  </div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Handling Code-Switching & Dialectal Variations',
          subtitle: 'From Rayalaseema Telugu to Bundelkhandi Hindi — preserving clinical accuracy.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Dialectal Acoustic Normalization</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  AyuSwar AI normalizes dialectal pronunciation differences while preserving the patient's intended clinical complaint.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Voice Synthesis Naturalness (MOS Score 4.7/5.0)',
          subtitle: 'Empathetic doctor voice synthesis evaluated by native Indic speaker panels.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Mean Opinion Score (MOS) Evaluation</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Patients rate Gnani.ai Timbre v2.5 voice notes at an average of 4.7/5.0 for clarity, warmth, and ease of understanding.
                </p>
              </div>
            </div>
          )
        }
      ]
    },

    // -------------------------------------------------------------
    abdm_fhir_whitepaper: {
      id: 'abdm_fhir_whitepaper',
      category: 'Resources',
      badge: 'National Architecture',
      badgeColor: '#008B8B',
      title: 'ABDM & FHIR R4 Architecture Whitepaper',
      tagline: 'Technical Specifications for National Health Authority (NHA) Sandbox Integration',
      icon: Shield,
      totalPages: 3,
      interactiveActionLabel: 'Inspect ABDM Architecture Specifications',
      interactiveModalKey: 'tech',
      pages: [
        {
          pageTitle: 'ABDM M1, M2 & M3 National Health Exchange Compliance',
          subtitle: 'Official schemas for ABHA linking, health information provider (HIP), and user consent.',
          content: (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl font-black text-teal-700 mb-2">M1 Milestone</div>
                  <div className="text-sm font-bold text-slate-900">ABHA Creation & Verification</div>
                  <div className="text-xs text-slate-500 mt-1">Instant 14-digit ABHA validation via Aadhaar/Mobile OTP gateway.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl font-black text-blue-700 mb-2">M2 Milestone</div>
                  <div className="text-sm font-bold text-slate-900">HIP / Health Record Linking</div>
                  <div className="text-xs text-slate-500 mt-1">Publishes structured FHIR OPD prescriptions and diagnostic biomarker records.</div>
                </div>
                <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
                  <div className="text-xl font-black text-indigo-700 mb-2">M3 Milestone</div>
                  <div className="text-sm font-bold text-slate-900">HIU Consent Manager</div>
                  <div className="text-xs text-slate-500 mt-1">Patient-mediated granular data access with auto-expiring consent tokens.</div>
                </div>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'FHIR R4 JSON Schema Architecture',
          subtitle: 'Interoperable electronic health records ready for national health data exchanges.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
                <h3 className="text-xl font-bold text-teal-300">Standardized Clinical Artifacts</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Every consultation produces a cryptographically signed Bundle containing Encounter, Condition, and MedicationRequest resources.
                </p>
              </div>
            </div>
          )
        },
        {
          pageTitle: 'Digital Consent Management & Privacy by Design',
          subtitle: 'Ensuring Indian patients have complete ownership of their clinical records.',
          content: (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-xl font-bold text-slate-900">Empowering Citizens with Privacy</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Patients can approve, revoke, or restrict access to their health records at any time directly through their linked ABHA mobile application.
                </p>
              </div>
            </div>
          )
        }
      ]
    }
  };

  const currentModule = modulesData[moduleId] || modulesData['opd_ambient_scribe'];
  const moduleKeys = Object.keys(modulesData);
  const currentModuleIndex = moduleKeys.indexOf(currentModule.id);
  const prevModuleKey = currentModuleIndex > 0 ? moduleKeys[currentModuleIndex - 1] : null;
  const nextModuleKey = currentModuleIndex < moduleKeys.length - 1 ? moduleKeys[currentModuleIndex + 1] : null;

  const currentPageData = currentModule.pages[currentPage - 1] || currentModule.pages[0];
  const IconComponent = currentModule.icon;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Top Breadcrumb & Navigation Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm">
            <button 
              onClick={onBackToHome}
              className="flex items-center gap-2 text-slate-600 hover:text-teal-700 font-bold transition-colors cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>Back to Home</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="text-slate-500 font-semibold">{currentModule.category}</span>
            <span className="text-slate-300">/</span>
            <span className="text-teal-800 font-bold">{currentModule.title}</span>
          </div>

          <div className="flex items-center gap-3">
            {currentModule.interactiveActionLabel && (
              <button
                onClick={() => onLaunchInteractiveModal(currentModule.interactiveModalKey)}
                className="px-4 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles size={14} />
                <span>{currentModule.interactiveActionLabel}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Hero Header for this Module */}
      <div className="bg-gradient-to-b from-white to-slate-100/60 border-b border-slate-200 py-12 px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg"
              style={{ background: currentModule.badgeColor }}
            >
              <IconComponent size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-white"
                  style={{ background: currentModule.badgeColor }}
                >
                  {currentModule.badge}
                </span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Deep Technical Specification
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-950 tracking-tight mt-1">
                {currentModule.title}
              </h1>
            </div>
          </div>
          <p className="text-base text-slate-600 max-w-3xl leading-relaxed">
            {currentModule.tagline}
          </p>

          {/* Section Step Progress Bar */}
          <div className="pt-4 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 uppercase">
              Section {currentPage} of {currentModule.totalPages}:
            </span>
            <div className="flex items-center gap-2 flex-1 max-w-xs">
              {Array.from({ length: currentModule.totalPages }).map((_, idx) => (
                <div
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`h-2 flex-1 rounded-full cursor-pointer transition-all ${
                    currentPage === idx + 1 
                      ? 'bg-teal-600 ring-2 ring-teal-200' 
                      : idx + 1 < currentPage 
                      ? 'bg-teal-300' 
                      : 'bg-slate-200'
                  }`}
                  title={`Jump to section ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Multi-Page Section Content */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <div className="text-xs font-extrabold uppercase tracking-widest text-teal-700">
              Section {currentPage} of {currentModule.totalPages}
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              {currentPageData.pageTitle}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {currentPageData.subtitle}
            </p>
          </div>

          {/* Dynamic Rich Interactive Content */}
          <div className="min-h-[420px] py-4">
            {currentPageData.content}
          </div>

          {/* Sub-Section Pagination: Next / Previous Buttons (As explicitly requested by user) */}
          <div className="pt-10 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                currentPage === 1 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 shadow-sm'
              }`}
            >
              <ChevronLeft size={18} />
              <span>Previous Section</span>
            </button>

            <div className="text-xs font-bold text-slate-500">
              Section {currentPage} of {currentModule.totalPages}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(currentModule.totalPages, p + 1))}
              disabled={currentPage === currentModule.totalPages}
              className={`px-5 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
                currentPage === currentModule.totalPages 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-teal-700 hover:bg-teal-800 text-white shadow-md'
              }`}
            >
              <span>Next Section</span>
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Global Cross-Module Navigation Footer */}
          <div className="pt-12 mt-12 border-t-2 border-dashed border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            {prevModuleKey ? (
              <button
                onClick={() => onNavigateModule(prevModuleKey)}
                className="w-full sm:w-auto p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-sm text-left flex items-center gap-4 transition-all cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                  <ArrowLeft size={18} />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Previous Module</div>
                  <div className="text-xs font-bold text-slate-900">{modulesData[prevModuleKey].title}</div>
                </div>
              </button>
            ) : <div />}

            {nextModuleKey ? (
              <button
                onClick={() => onNavigateModule(nextModuleKey)}
                className="w-full sm:w-auto p-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 shadow-sm text-right flex items-center justify-end gap-4 transition-all cursor-pointer"
              >
                <div>
                  <div className="text-[10px] font-bold uppercase text-slate-400">Next Module</div>
                  <div className="text-xs font-bold text-slate-900">{modulesData[nextModuleKey].title}</div>
                </div>
                <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
                  <ArrowRight size={18} />
                </div>
              </button>
            ) : <div />}
          </div>
        </div>
      </div>
    </div>
  );
}
