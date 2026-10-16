import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Route metadata mapping for dynamic SEO, AEO, and GEO optimization.
 * Automatically updates document.title, canonical URL, meta description,
 * and Open Graph / Twitter card tags on client-side route transitions.
 */
const ROUTE_METADATA = {
  '/': {
    title: 'AyuSwar AI — Ambient Clinical Voice Scribe & Triage Prototype | Indic Health AI',
    description: 'AyuSwar AI is a prototype demo on synthetic data. Not a medical device. Not for diagnosis. Ambient clinical voice scribe exploring vernacular transcription in Telugu, Hindi, and English with draft ABDM FHIR R4 schema formatting.',
    keywords: 'AyuSwar AI, Clinical Voice Scribe, Indic Voice AI, Telugu Medical Speech, ABDM FHIR R4, Primary Health Center AI, Rayalaseema Health Tech, DPDP Act 2023',
    section: 'Home'
  },
  '/solutions': {
    title: 'Clinical Solutions & Workflows — AyuSwar AI Indic Healthcare Prototype',
    description: 'Explore ambient clinical documentation, spoken Audio-Rx patient adherence cards, blister pack computer vision scanning, and simulated 108 emergency triage protocols.',
    keywords: 'Ambient Scribing, Audio-Rx, Spoken Prescription, Medicine Blister Scanner, Emergency Triage, ABDM Integration',
    section: 'Solutions'
  },
  '/technology': {
    title: 'Deep-Tech Architectural Blueprint — AyuSwar AI Technical Specifications',
    description: 'Zero-cloud ephemeral RAM audio pipeline, quantized edge ONNX speech transcription, deterministic SNOMED CT and WHO ICD-10 ontology crosswalk, and HL7 FHIR R4 JSON schemas.',
    keywords: 'Edge AI Architecture, Ephemeral RAM Audio, DPDP Act 2023, SNOMED CT Crosswalk, ICD-10 Mapping, FHIR R4 JSON',
    section: 'Technology'
  },
  '/scanner': {
    title: 'Computer Vision Medicine Scanner Demo — AyuSwar AI Pharmaceutical OCR',
    description: 'Interactive demonstration of synthetic medicine blister strip scanning, optical character recognition, Jan Aushadhi generic substitution mapping, and dosage scheduling.',
    keywords: 'Medicine Strip Scanner, Pharmaceutical OCR, Jan Aushadhi Generic Medicine, Drug Interaction Demo, Computer Vision Health',
    section: 'Scanner'
  },
  '/audio-rx': {
    title: 'Spoken Audio-Rx Studio — Vernacular Prescription Adherence for Patients',
    description: 'High-contrast vernacular spoken prescription playback with word-by-word karaoke synchronization in Telugu, Hindi, and English to eliminate rural patient medication errors.',
    keywords: 'Spoken Audio-Rx, Vernacular Prescription, Telugu Audio Dosage, Patient Adherence Bharat, WhatsApp Health Audio',
    section: 'Audio-Rx'
  },
  '/acoustic-lab': {
    title: 'Non-Diagnostic Acoustic Signal Processing Lab — AyuSwar AI DSP Explorer',
    description: 'Interactive browser DSP demonstration analyzing vocal audio frequencies, spectral centroid, zero-crossing rate, and spectrograms. For non-diagnostic educational signal exploration.',
    keywords: 'Acoustic Signal Processing, Audio Biomarkers Demo, Vocal Frequency Analysis, Web Audio API DSP, Non-Diagnostic Biomarkers',
    section: 'Acoustic Lab'
  },
  '/language-matrix': {
    title: 'Indic Language & Dialect Matrix — Regional Speech Recognition Support',
    description: 'Vernacular clinical speech support covering Telugu (Rayalaseema, Telangana, Coastal Andhra, Uttarandhra), Hindi dialects, and Indian English with colloquial idiom translation.',
    keywords: 'Indic Language Matrix, Telugu Dialects Healthcare, Rayalaseema Telugu Speech AI, Colloquial Medical Idioms, Vernacular Health ASR',
    section: 'Language Matrix'
  },
  '/benchmarks': {
    title: 'Clinical Contract & Architectural Benchmarks — AyuSwar AI Verification Suite',
    description: 'Real-time execution of 24 contract tests verifying DPDP Act 2023 ephemeral RAM safety, non-diagnostic boundaries, ABDM FHIR R4 schema integrity, and offline edge resilience.',
    keywords: 'Clinical Benchmarks, Automated Contract Tests, DPDP Act Compliance, FHIR Validation, Health AI Verification',
    section: 'Benchmarks'
  },
  '/datasets': {
    title: 'Synthetic Clinical Datasets & Idiom Lexicon — AyuSwar AI Open Corpus',
    description: 'Explore synthetic rural OPD consultation transcripts, bilingual doctor-patient dialogues, and colloquial Telugu phrase crosswalks mapped to standard SNOMED CT clinical codes.',
    keywords: 'Synthetic Clinical Datasets, Indic OPD Transcripts, Telugu Clinical Idioms, Open Health Data, Kaggle Health Corpus',
    section: 'Datasets'
  },
  '/emergency': {
    title: 'Sanjivani 108 Simulated Emergency Distress Triage — AyuSwar AI Prototype',
    description: 'Simulated 108 emergency distress demonstration featuring bilingual conversational triage, GPS ambulance tracking simulation, CPR guidance metronome, and hospital pre-alert telemetry.',
    keywords: 'Simulated 108 Emergency, Sanjivani Emergency Triage, CPR Metronome Demo, Ambulance Telemetry Simulation, Emergency Protocol Bharat',
    section: 'Emergency'
  },
  '/prescription/preview': {
    title: 'ABDM FHIR R4 Prescription Preview — AyuSwar AI Structured Record',
    description: 'Preview draft electronic health record with HL7 FHIR R4 JSON serialization, digital prescription formatting, and Jan Aushadhi generic substitution for physician review.',
    keywords: 'ABDM FHIR R4, Electronic Prescription Record, Jan Aushadhi Generic, Digital Health Bharat, FHIR JSON Preview',
    section: 'Prescription'
  },
  '/doctor-portal': {
    title: 'Clinician Consultation Portal — AyuSwar AI Doctor Workspace',
    description: 'Ambient consultation workflow console for attending physicians: live vernacular scribing, draft SOAP notes generation, SNOMED coding review, and instant FHIR export.',
    keywords: 'Doctor OPD Portal, Ambient Clinical Scribe, SOAP Notes Generator, Rural Health Physician Console, Telemedicine Scribe',
    section: 'Doctor Portal'
  },
  '/patient-portal': {
    title: 'Citizen ABHA Health Record Portal — AyuSwar AI Patient Hub',
    description: 'Accessible patient portal for reviewing vernacular audio prescriptions, dosage reminder schedules, Jan Aushadhi cost savings, and Ayushman Bharat health records.',
    keywords: 'Patient Health Portal, ABHA Health Record, Vernacular Spoken Rx, Medicine Reminders, Ayushman Bharat Citizen App',
    section: 'Patient Portal'
  }
};

/**
 * SeoHead component: Injects and synchronizes SEO, AEO, and GEO metadata in the DOM.
 */
export default function SeoHead() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    
    // Resolve matching route or fallback to base
    let meta = ROUTE_METADATA[pathname];
    if (!meta) {
      if (pathname.startsWith('/solutions/')) {
        meta = {
          title: 'Specialized Clinical Module — AyuSwar AI Indic Healthcare Prototype',
          description: 'Deep-dive into specialized clinical intelligence modules designed for high-volume Indian primary health centers.',
          keywords: 'AyuSwar AI, Clinical Module, Primary Health Center, ABDM FHIR',
          section: 'Solutions'
        };
      } else {
        meta = ROUTE_METADATA['/'];
      }
    }

    // 1. Update document title
    document.title = meta.title;

    // Helper to set or create meta tag
    const setMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // 2. Update Core SEO description & keywords
    setMetaTag('name', 'description', meta.description);
    setMetaTag('name', 'keywords', meta.keywords);

    // 3. Update Open Graph Protocol tags
    const canonicalUrl = `https://ayuswar-ai.vercel.app${pathname === '/' ? '' : pathname}`;
    setMetaTag('property', 'og:title', meta.title);
    setMetaTag('property', 'og:description', meta.description);
    setMetaTag('property', 'og:url', canonicalUrl);

    // 4. Update Twitter Card tags
    setMetaTag('name', 'twitter:title', meta.title);
    setMetaTag('name', 'twitter:description', meta.description);

    // 5. Update Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

  }, [location]);

  return null;
}
