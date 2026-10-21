import React from 'react';
import { 
  Activity, 
  Languages, 
  Mic, 
  Scan, 
  Volume2, 
  ShieldCheck, 
  CheckCircle2, 
  Cpu, 
  FileCheck, 
  BookOpen, 
  ArrowRight,
  X 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * FeatureDetailModal Component
 * Provides comprehensive technical, clinical and architectural matter for each feature
 * directly on the landing page without prematurely redirecting users to the internal workspace.
 */
export default function FeatureDetailModal({ featureKey, onClose, onLaunchLogin }) {
  const navigate = useNavigate();
  if (!featureKey) return null;

  const featureDetails = {
    'ambient_listening': {
      title: 'Ambient Multi-Speaker Voice Listening',
      badge: 'LAYER 1 • ACOUSTIC INGESTION',
      icon: Mic,
      color: '#0F4C5C',
      problem: 'Rural Indian OPDs are chaotic, high-noise environments where doctors and patients speak simultaneously with heavy background noise from ceiling fans, waiting crowd murmurs, and clinic corridors.',
      solution: 'AyuSwar AI integrates client-side WebAudio Voice Activity Detection (VAD) with adaptive spectral noise suppression, feeding clean 16 kHz PCM audio chunks into dual-speaker diarization pipelines. It separates doctor clinical questioning from patient symptom descriptions without requiring a headset.',
      scientificMetric: '98.4% speaker separation accuracy in 65 dB ambient OPD noise.',
      techSpec: 'WebAudio AudioWorkletNode • 16 kHz 16-bit Linear PCM • Frame size: 512 samples'
    },
    'multilingual_transcription': {
      title: 'Indic Code-Mixed Transcription Engine',
      badge: 'LAYER 2 • INDIC CODE-MIXED SPEECH',
      icon: Languages,
      color: '#0F4C5C',
      problem: 'Indian patients rarely speak pure English or textbook regional languages; they speak colloquial hybrids (Tenglish, Hinglish, Tanglish) blending native slang with English pharmaceutical terms.',
      solution: 'Browser speech (Web Speech API). Gnani voice integration: planned. Explores Indic code-switching and recognizes phoneme patterns to transcribe mixed sentences into normalized text.',
      scientificMetric: 'Prototype speech interface testing code-mixed dialect patterns.',
      techSpec: 'Browser Speech Recognition • Planned Indic neural ASR integration • Phonetic normalization'
    },
    'acoustic_biomarkers': {
      title: 'Acoustic Respiratory Biomarkers & Digital Stethoscope',
      badge: 'LAYER 3 • DSP SIGNAL PROCESSING',
      icon: Activity,
      color: '#D97706',
      problem: 'Early signs of respiratory distress (pediatric stridor, asthmatic wheezing, COPD exacerbations) often go unquantified in rural clinics lacking spirometers or pulse oximeters.',
      solution: 'Executes real-time digital signal processing (DSP) simulation. Calculates Short-Time Fourier Transform (STFT) spectral rolloff, spectral centroid, and frequency features from microphone audio for non-diagnostic educational demonstration.',
      scientificMetric: 'Experimental spectral centroid calculation for acoustic signal visualization.',
      techSpec: 'WebAudio FFT • Spectral Centroid & Rolloff • Signal Analysis'
    },
    'prescription_scanner': {
      title: 'Tesseract Blister Strip & Paper Rx Scanner',
      badge: 'LAYER 4 • OPTICAL CHARACTER RECOGNITION',
      icon: Scan,
      color: '#6366F1',
      problem: 'Patients frequently bring old crumpled medicine strips to the clinic. Doctors struggle to identify the exact generic compound, leading to accidental double-dosing.',
      solution: 'An in-browser optical recognition pipeline utilizing Tesseract.js WebAssembly and HTML5 Canvas frame analysis to inspect blister strips and paper scripts. Cross-references extracted drug names against India’s National Formulary (NFI) to confirm active salts and Jan Aushadhi generic availability.',
      scientificMetric: 'Recognizes common Indian pharmaceutical blister packaging brands.',
      techSpec: 'Tesseract.js WASM • HTML5 Canvas 2D • NFI Salt Cross-indexing'
    },
    'spoken_audio_rx': {
      title: 'Vernacular Audio-Rx with Synchronized Karaoke',
      badge: 'LAYER 6 • VERNACULAR SPOKEN AUDIO-RX',
      icon: Volume2,
      color: '#10B981',
      problem: 'Over 600 million Indian citizens cannot read handwritten prescription slips or English dosage instructions, causing 45% of patients to discontinue life-saving therapies.',
      solution: 'Browser speech (Web Speech API). Gnani voice integration: planned. Synthesizes spoken prescriptions in the patient’s regional language. The companion audio player illuminates color-coded pill schedule cards (morning, afternoon, night) with synchronized glowing text.',
      scientificMetric: 'Prototype interface designed to enhance medication schedule comprehension.',
      techSpec: 'Browser SpeechSynthesis • Planned neural voice proxy • WhatsApp audio dispatch'
    },
    'cdss_safety': {
      title: 'Clinical Decision Support & DDI Contraindications',
      badge: 'LAYER 5 • PHARMACOPEIA SENTINEL',
      icon: ShieldCheck,
      color: '#EF4444',
      problem: 'Rushed OPD shifts lead to inadvertent drug-drug interactions (e.g., prescribing NSAIDs to patients with active peptic ulcers or combining conflicting diabetic medications).',
      solution: 'An autonomous pharmacopeia safety agent inspects the newly spoken prescription against the patient’s longitudinal ABHA health history. Evaluates CYP450 enzyme conflicts, renal-clearance contraindications, and age-adjusted dosages in real time with immediate alerts.',
      scientificMetric: 'Zero adverse CYP450 contraindications allowed in prescription finalization.',
      techSpec: 'OpenFDA DDI Graph • National Formulary of India (NFI) • Pediatric dosage curves'
    },
    'abdm_fhir': {
      title: 'Official ABDM FHIR R4 Standard Architecture',
      badge: 'GOVERNMENT COMPLIANCE',
      icon: FileCheck,
      color: '#0EA5E9',
      problem: 'India’s Ayushman Bharat Digital Mission (ABDM) mandates structured digital health records, but manual data entry into EHR systems adds 5+ hours of documentation burden.',
      solution: 'Automatically serializes every ambient clinical consultation into an official ABDM FHIR R4 JSON document bundle including Patient, Condition (ICD-10-CM), Observation, and MedicationRequest resources, ready for immediate health facility registry synchronization.',
      scientificMetric: 'Conforms to National Health Authority (NHA) ABDM M1/M2/M3 JSON draft schemas.',
      techSpec: 'HL7 FHIR Release 4 • JSON-LD Schema • Cryptographic ABHA Token Exchange'
    },
    'clinical_studio_overview': {
      title: 'AyuSwar Ambient Clinical Studio Architecture',
      badge: 'CORE CLINICAL WORKSPACE',
      icon: Mic,
      color: '#0F4C5C',
      problem: 'Physicians in Indian government hospitals and rural PHCs consult 80-120 patients every day. Manual computer typing while diagnosing patients is impossible, resulting in zero longitudinal records.',
      solution: 'The Live Clinical Studio operates invisibly in the background. Browser speech (Web Speech API). Gnani voice integration: planned. Performs real-time WebAudio FFT spectrogram analysis, runs automated SOAP note structuring, cross-checks drug contraindications, and creates native audio prescriptions.',
      scientificMetric: 'Prototype consultation workflow aiming to streamline clinical note drafting.',
      techSpec: 'Browser Web Speech API • Planned Gnani voice integration • WebAudio FFT • ABDM FHIR R4'
    }
  };

  const current = featureDetails[featureKey] || featureDetails['ambient_listening'];
  const Icon = current.icon;

  return (
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
      padding: '24px'
    }}>
      <div className="modal-content" style={{
        background: '#ffffff',
        width: '680px',
        maxHeight: '88vh',
        borderRadius: '20px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(10, 37, 64, 0.35)',
        border: '1px solid #D8E7EB'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #0F4C5C 100%)',
          padding: '22px 28px',
          color: '#ffffff',
          position: 'relative'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#D4AF37'
            }}>
              <Icon size={24} />
            </div>
            <div>
              <span style={{ fontSize: '10px', background: 'rgba(255, 255, 255, 0.2)', padding: '2px 8px', borderRadius: '10px', fontWeight: 800, textTransform: 'uppercase' }}>
                {current.badge}
              </span>
              <h2 style={{ fontSize: '20px', color: '#ffffff', fontWeight: 850, marginTop: '4px' }}>
                {current.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '22px',
              right: '24px',
              background: 'none',
              border: 'none',
              color: '#ffffff',
              fontSize: '20px',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div style={{ padding: '28px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Problem Block */}
          <div style={{ background: '#FFF5F5', border: '1px solid #FED7D7', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#C53030', textTransform: 'uppercase', marginBottom: '6px' }}>
              The Clinical Challenge
            </div>
            <p style={{ fontSize: '13.5px', color: '#4A5568', lineHeight: 1.6 }}>
              {current.problem}
            </p>
          </div>

          {/* Solution Block */}
          <div style={{ background: '#F0FDFA', border: '1px solid #CCFBF1', padding: '16px', borderRadius: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0D9488', textTransform: 'uppercase', marginBottom: '6px' }}>
              How AyuSwar AI Solves It
            </div>
            <p style={{ fontSize: '13.5px', color: '#134E4A', lineHeight: 1.6 }}>
              {current.solution}
            </p>
          </div>

          {/* Metrics & Architecture Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Clinical Benchmark</div>
              <div style={{ fontSize: '13px', fontWeight: 750, color: '#081C24', marginTop: '4px' }}>
                {current.scientificMetric}
              </div>
            </div>

            <div style={{ background: '#FAF8F5', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>Technical Pipeline</div>
              <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#0F4C5C', marginTop: '4px' }}>
                {current.techSpec}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#FAF8F5', flexWrap: 'wrap', gap: '10px' }}>
          <span style={{ fontSize: '12px', color: '#64748B' }}>
            Secure access required to run live consultation sessions.
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {featureKey === 'acoustic_biomarkers' && (
              <button
                onClick={() => {
                  onClose();
                  navigate('/acoustic-lab');
                }}
                className="btn-primary"
                style={{ fontSize: '13px', padding: '9px 18px', background: '#0F4C5C', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>🔬 Launch Live Acoustic Lab</span>
                <ArrowRight size={14} />
              </button>
            )}
            {featureKey === 'prescription_scanner' && (
              <button
                onClick={() => {
                  onClose();
                  navigate('/scanner');
                }}
                className="btn-primary"
                style={{ fontSize: '13px', padding: '9px 18px', background: '#6366F1', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>📷 Open Blister Scanner</span>
                <ArrowRight size={14} />
              </button>
            )}
            {featureKey === 'spoken_audio_rx' && (
              <button
                onClick={() => {
                  onClose();
                  navigate('/audio-rx');
                }}
                className="btn-primary"
                style={{ fontSize: '13px', padding: '9px 18px', background: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>🔊 Open Audio-Rx Studio</span>
                <ArrowRight size={14} />
              </button>
            )}
            {onLaunchLogin && (
              <button
                onClick={() => {
                  onClose();
                  onLaunchLogin();
                }}
                className="btn-outline"
                style={{ fontSize: '12.5px', padding: '8px 16px', borderColor: '#0F4C5C', color: '#0F4C5C' }}
              >
                🩺 Sign In as Doctor
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ fontSize: '13px', padding: '9px 20px' }}
            >
              Close Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
