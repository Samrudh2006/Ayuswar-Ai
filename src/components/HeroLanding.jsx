import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, 
  Languages, 
  Activity, 
  Scan, 
  Volume2, 
  ArrowRight, 
  Play, 
  Pause,
  ShieldCheck, 
  Globe2, 
  Building2, 
  Users2, 
  HeartPulse, 
  Sparkles, 
  FileCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Stethoscope, 
  Smartphone, 
  FileText,
  Pill,
  Radio,
  QrCode,
  ArrowUpRight,
  X
} from 'lucide-react';
import FeatureDetailModal from './FeatureDetailModal';

/**
 * HeroLanding Component
 * Complete, world-class enterprise marketing site for AyuSwar AI.
 * Built with full-width modern layout, interactive language carousel with live Timbre voice playback,
 * before-vs-after comparison toggles, 6-bento interactive deep-tech moats, and dedicated feature detail modals.
 */
export default function HeroLanding({ 
  onLaunchStudio, 
  onOpenTechModal, 
  onOpenDatasetModal,
  onOpenAcousticLab,
  onOpenBenchmarkSuite,
  onOpenSanjivaniModal,
  onOpenDoctorAuthModal,
  onOpenPatientAuthModal,
  onSelectModule
}) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [selectedFeatureModalKey, setSelectedFeatureModalKey] = useState(null);

  // Dynamic Real-Time Typing Animation Phrases for Bharat Clinical Voice OS
  const typewriterPhrases = [
    'Listens in Telugu, Hindi, Tamil & 15+ Indic Dialects',
    'Converts 90-sec Rural OPD Dialogues to FHIR R4 in 180 ms',
    'Generates Vernacular Audio-Rx for Illiterate Patients',
    'Acoustic Lab: Wheeze, Stridor & Biomarker Detection',
    'Sanjivani-108: Autonomous Distress Triage & CPR Metronome',
    'Zero Keyboard Typing. 100% Attending Physician Consent'
  ];

  const [typedPhraseIndex, setTypedPhraseIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTypingDeleting, setIsTypingDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = typewriterPhrases[typedPhraseIndex];
    let timer;

    if (!isTypingDeleting) {
      if (typedText.length < currentPhrase.length) {
        timer = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length + 1));
        }, 40);
      } else {
        timer = setTimeout(() => {
          setIsTypingDeleting(true);
        }, 2200);
      }
    } else {
      if (typedText.length > 0) {
        timer = setTimeout(() => {
          setTypedText(currentPhrase.slice(0, typedText.length - 1));
        }, 22);
      } else {
        setIsTypingDeleting(false);
        setTypedPhraseIndex((prev) => (prev + 1) % typewriterPhrases.length);
      }
    }

    return () => clearTimeout(timer);
  }, [typedText, isTypingDeleting, typedPhraseIndex]);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  
  // Before vs After Toggle
  const [comparisonMode, setComparisonMode] = useState('after'); // 'before' | 'after'

  // Interactive 4-Step Pipeline Step
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  // 2-Minute Executive Golden Loop Walkthrough State
  const [isGoldenStoryOpen, setIsGoldenStoryOpen] = useState(false);
  const [goldenStoryScene, setGoldenStoryScene] = useState(0);
  const [isAutoPlayingStory, setIsAutoPlayingStory] = useState(false);

  // Pan-India Language Carousel & Audio State
  const [selectedLanguageRegion, setSelectedLanguageRegion] = useState('all');
  const [playingLangSample, setPlayingLangSample] = useState(null);
  const [isAllDialectsModalOpen, setIsAllDialectsModalOpen] = useState(false);
  const carouselScrollRef = useRef(null);

  const features = [
    { id: 0, title: 'Ambient Voice Listening', icon: Mic, desc: 'Dual-speaker ambient capture with speaker diarization in chaotic OPDs' },
    { id: 1, title: 'Multilingual Transcription', icon: Languages, desc: 'Prisma v2.5 powered Indic code-mixed transcription (Telugu, Hindi, Tenglish)' },
    { id: 2, title: 'Acoustic Biomarkers', icon: Activity, desc: 'Real-time DSP extraction of wheeze, cough spectral index & respiratory strain' },
    { id: 3, title: 'Prescription Scanner', icon: Scan, desc: 'OpenCV computer vision scanning of physical medicine blister strips & paper Rx' },
    { id: 4, title: 'Spoken Audio-Prescription', icon: Volume2, desc: 'Timbre v2.5 synthesis with word-by-word karaoke highlighting for illiterate patients' }
  ];

  const indicLanguages = [
    { 
      id: 'te', 
      name: 'Telugu', 
      native: 'తెలుగు', 
      region: 'South', 
      state: 'Andhra Pradesh & Telangana',
      sample: 'ఈ ఆకుపచ్చ మాత్ర ఉదయం టిఫిన్ తర్వాత ఒకటి వేసుకోవాలి', 
      langCode: 'te-IN' 
    },
    { 
      id: 'hi', 
      name: 'Hindi', 
      native: 'हिन्दी', 
      region: 'North', 
      state: 'Uttar Pradesh, MP, Bihar, Delhi',
      sample: 'यह पीला सिरप रोज सुबह नाश्ते के बाद 5ml देना है', 
      langCode: 'hi-IN' 
    },
    { 
      id: 'ta', 
      name: 'Tamil', 
      native: 'தமிழ்', 
      region: 'South', 
      state: 'Tamil Nadu & Puducherry',
      sample: 'இந்த நீல நிற மாத்திரையை இரவு உணவிற்குப் பிறகு உட்கொள்ளுங்கள்', 
      langCode: 'ta-IN' 
    },
    { 
      id: 'kn', 
      name: 'Kannada', 
      native: 'ಕನ್ನಡ', 
      region: 'South', 
      state: 'Karnataka',
      sample: 'ಈ ಹಸಿರು ಮಾತ್ರೆಗಳನ್ನು ಬೆಳಗಿನ ಉಪಾಹಾರದ ನಂತರ ಸೇವಿಸಿ', 
      langCode: 'kn-IN' 
    },
    { 
      id: 'mr', 
      name: 'Marathi', 
      native: 'मराठी', 
      region: 'West', 
      state: 'Maharashtra',
      sample: 'हे औषध दररोज रात्री जेवणानंतर एक गोळी घ्या', 
      langCode: 'mr-IN' 
    },
    { 
      id: 'bn', 
      name: 'Bengali', 
      native: 'বাংলা', 
      region: 'East', 
      state: 'West Bengal & Tripura',
      sample: 'এই নীল ট্যাবলেটটি রাতে খাওয়ার পরে জল দিয়ে খাবেন', 
      langCode: 'bn-IN' 
    },
    { 
      id: 'gu', 
      name: 'Gujarati', 
      native: 'ગુજરાતી', 
      region: 'West', 
      state: 'Gujarat',
      sample: 'આ પીળી દવા સવારે નાસ્તા પછી એક ચમચી લેવી', 
      langCode: 'gu-IN' 
    },
    { 
      id: 'ml', 
      name: 'Malayalam', 
      native: 'മലയാളം', 
      region: 'South', 
      state: 'Kerala',
      sample: 'ഈ മരുന്ന് രാത്രി ഭക്ഷണത്തിന് ശേഷം ഒരു ഗുളിക കഴിക്കുക', 
      langCode: 'ml-IN' 
    },
    { 
      id: 'pa', 
      name: 'Punjabi', 
      native: 'ਪੰਜਾਬੀ', 
      region: 'North', 
      state: 'Punjab & Chandigarh',
      sample: 'ਇਹ ਦਵਾਈ ਰੋਜ਼ਾਨਾ ਸਵੇਰੇ ਰੋਟੀ ਖਾਣ ਤੋਂ ਬਾਅਦ ਲਵੋ', 
      langCode: 'pa-IN' 
    },
    { 
      id: 'or', 
      name: 'Odia', 
      native: 'ଓଡ଼ିଆ', 
      region: 'East', 
      state: 'Odisha',
      sample: 'ଏହି ଔଷଧ ସକାଳେ ଜଳଖିଆ ଖାଇବା ପରେ ଗୋଟିଏ ନିଅନ୍ତୁ', 
      langCode: 'or-IN' 
    }
  ];

  // Play Language Audio Sample
  const handlePlayLanguageSample = (lang) => {
    if (playingLangSample === lang.id) {
      setPlayingLangSample(null);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setPlayingLangSample(lang.id);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lang.sample);
        utterance.lang = lang.langCode;
        utterance.rate = 0.95;
        utterance.onend = () => setPlayingLangSample(null);
        utterance.onerror = () => setPlayingLangSample(null);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setPlayingLangSample(null), 3500);
      }
    }
  };

  const scrollCarousel = (direction) => {
    if (carouselScrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      carouselScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const filteredLanguages = selectedLanguageRegion === 'all' 
    ? indicLanguages 
    : indicLanguages.filter(l => l.region.toLowerCase() === selectedLanguageRegion.toLowerCase());

  const faqs = [
    {
      q: 'Does AyuSwar replace doctors?',
      a: 'Absolutely not. AyuSwar AI is strictly an ambient clinical co-pilot designed to eliminate documentation burnout. The attending physician maintains 100% legal, diagnostic, and clinical agency. AI-generated notes, ICD-10 codes, and prescriptions are presented as structured drafts that the clinician reviews, edits, and cryptographically signs with Class-3 DSC before anything is committed to ABDM.'
    },
    {
      q: 'How is patient data protected?',
      a: 'AyuSwar AI is fully compliant with the India Digital Personal Data Protection (DPDP) Act 2023 and ABDM DISHA privacy guidelines. Audio streams are processed ephemerally for transcription and biomarker extraction without storing raw conversational voice on external servers. All clinical FHIR R4 bundles are encrypted in transit (TLS 1.3) and at rest (AES-256) on sovereign Indian cloud infrastructure with strict role-based access control.'
    },
    {
      q: 'Does it work with code-mixed speech (e.g., Telugu + English / Tenglish)?',
      a: 'Yes. Indian clinical consultations rarely happen in pure textbook languages. Powered by Gnani.ai Prisma v2.5, AyuSwar is trained on over 100,000+ hours of natural Indian conversations, fluently decoding code-mixed Telugu, Hindi, Tamil, Kannada, and "Tenglish/Hinglish" where clinical terms (like "sugar", "BP", "inhaler", "fever") blend naturally with vernacular grammar.'
    },
    {
      q: 'How does it handle noisy environments?',
      a: 'AyuSwar features an adaptive WebAudio 16 kHz AudioWorklet dual-channel DSP front-end with 65 dB spectral noise subtraction. It actively filters out loud ceiling fan hums, corridor chatter, ambulance sirens, and adjacent desk murmur in chaotic 72 dB rural OPD waiting halls, maintaining speech recognition accuracy above 96%.'
    },
    {
      q: 'How does the clinician verify AI-generated information?',
      a: 'The doctor console provides a side-by-side interactive verification workspace. Every extracted symptom, vital sign, and diagnosis is highlighted with clickable audio time-stamps linking back to the exact second in the consultation. The physician can accept, edit, or reject any line item with a single click before issuing the official e-Prescription.'
    },
    {
      q: 'How does ABDM/FHIR integration work?',
      a: 'AyuSwar is architected natively for Ayushman Bharat Digital Mission (ABDM) M1, M2, and M3 milestones. It verifies 14-digit ABHA numbers instantly and transforms consultations into standardized HL7 FHIR R4 JSON bundles (Encounter, Observation, Condition, MedicationRequest, and Binary DSC signature) ready for instant national health exchange dispatch.'
    },
    {
      q: 'What happens when the AI is uncertain?',
      a: 'AyuSwar utilizes probabilistic uncertainty thresholding. If acoustic noise obscures a sentence or phoneme confidence drops below 85%, the system never hallucinates or guesses. Instead, it flags the phrase in amber with an explicit "Requires Doctor Clarification" tag and prompts the clinician to confirm before generating prescription orders.'
    }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#F8FAFC' }}>
      {/* =========================================================================
          HERO SECTION (PREMIUM MEDICAL-AI CLINICAL VOICE OS - CLEAN & BALANCED)
          ========================================================================= */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F6FBFC 35%, #EFF8FA 70%, #E5F4F7 100%)',
        width: '100%',
        margin: 0,
        padding: 0,
        borderBottom: '1px solid rgba(0, 139, 139, 0.12)'
      }}>
        {/* Subtle Ambient High-Tech Atmospheric Accents */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '2%',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 168, 150, 0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        <div style={{
          position: 'absolute',
          top: '10%',
          right: '8%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 194, 203, 0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>

        {/* Full-Bleed Right-Side Doctor & High-Tech AI Visual */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          maxWidth: '740px',
          minWidth: '500px',
          height: '100%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'flex-end',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          <div style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '740px',
            aspectRatio: '948 / 856', 
            maxHeight: '660px',
            display: 'flex', 
            alignItems: 'flex-end', 
            justifyContent: 'flex-end' 
          }}>
            <img 
              src="/assets/ayuswar_doctor_hero_no_header.png" 
              alt="Dr. Ananya Sharma MD — AyuSwar Virtual Attending Physician"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'right bottom',
                filter: 'contrast(1.02) saturate(1.02) drop-shadow(0 16px 36px rgba(10, 37, 64, 0.09))',
                imageRendering: '-webkit-optimize-contrast',
                userSelect: 'none',
                display: 'block'
              }}
              onError={(e) => {
                e.target.src = '/assets/ayuswar_doctor_hero_ultra.png';
              }}
            />

            {/* Ultra-Sharp High-DPI ABDM Compliant Vector Badge Card (Sits directly on top of the image badge with exact pixel alignment) */}
            <div 
              onClick={() => setSelectedFeatureModalKey('abdm')}
              style={{
                position: 'absolute',
                top: '73.8%',
                left: '31.4%',
                width: '49.0%',
                height: '11.5%',
                zIndex: 10,
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #ffffff 0%, #F0FDFA 100%)',
                border: '2px solid #00A896',
                borderRadius: '16px',
                padding: '0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '11px',
                boxShadow: '0 8px 24px rgba(0, 168, 150, 0.25), 0 2px 8px rgba(10, 37, 64, 0.10)',
                transition: 'all 0.2s ease',
                pointerEvents: 'auto',
                boxSizing: 'border-box'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#00D2D3';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 210, 211, 0.35), 0 4px 12px rgba(10, 37, 64, 0.14)';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#00A896';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 168, 150, 0.25), 0 2px 8px rgba(10, 37, 64, 0.10)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              title="ABDM Compliant FHIR R4 Architecture - Click to inspect specs"
            >
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'rgba(0, 168, 150, 0.15)',
                border: '1.5px solid rgba(0, 168, 150, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#008B8B',
                flexShrink: 0
              }}>
                <ShieldCheck size={20} strokeWidth={2.5} />
              </div>
              <div style={{ minWidth: 0, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '14px', fontWeight: 850, color: '#0A2540', letterSpacing: '-0.2px', whiteSpace: 'nowrap' }}>
                    ABDM Compliant
                  </span>
                  <span style={{
                    background: 'linear-gradient(135deg, #008B8B, #00A896)',
                    color: '#ffffff',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 7px',
                    borderRadius: '12px',
                    letterSpacing: '0.4px',
                    whiteSpace: 'nowrap'
                  }}>
                    FHIR R4
                  </span>
                </div>
                <div style={{ fontSize: '10.5px', color: '#475569', fontWeight: 650, letterSpacing: '0.1px', marginTop: '2px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  Secured. Private. Trusted. Built for Bharat.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Left Content Container */}
        <div style={{
          width: '100%',
          padding: '44px clamp(24px, 5vw, 64px) 48px clamp(24px, 5vw, 64px)',
          position: 'relative',
          zIndex: 3,
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '680px'
          }}>
            {/* Pill Badge: VOICE AI FOR BHARAT */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '30px',
              background: 'rgba(0, 139, 139, 0.08)',
              border: '1.5px solid rgba(0, 139, 139, 0.28)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 2px 8px rgba(0, 139, 139, 0.08)',
              color: '#008B8B',
              fontSize: '11.5px',
              fontWeight: 800,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '18px'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                <span style={{ width: '3px', height: '10px', background: '#008B8B', borderRadius: '2px' }}></span>
                <span style={{ width: '3px', height: '16px', background: '#008B8B', borderRadius: '2px' }}></span>
                <span style={{ width: '3px', height: '8px', background: '#008B8B', borderRadius: '2px' }}></span>
              </span>
              VOICE AI FOR BHARAT
            </div>

            {/* Giant Title: Every Voice. Better Care. */}
            <h1 style={{
              fontFamily: 'Outfit, sans-serif',
              fontSize: '64px',
              lineHeight: 1.08,
              fontWeight: 850,
              color: '#061A2D',
              letterSpacing: '-0.035em',
              textWrap: 'balance',
              marginBottom: '18px'
            }}>
              Every Voice.<br />
              <span style={{ 
                color: '#008B8B',
                background: 'linear-gradient(135deg, #008B8B 0%, #00B4D8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Better Care.
              </span>
            </h1>

            {/* Dynamic Real-Time Typing Animation Pill */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 18px',
              borderRadius: '999px',
              background: 'linear-gradient(135deg, rgba(0, 139, 139, 0.08) 0%, rgba(0, 180, 216, 0.08) 100%)',
              border: '1.5px solid rgba(0, 139, 139, 0.25)',
              boxShadow: '0 4px 16px rgba(0, 139, 139, 0.08)',
              marginBottom: '20px',
              maxWidth: '92%'
            }}>
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                display: 'inline-block',
                boxShadow: '0 0 10px #10B981',
                flexShrink: 0
              }}></span>
              <span style={{
                fontFamily: 'Outfit, sans-serif',
                fontSize: '14.5px',
                fontWeight: 750,
                color: '#0D6868',
                letterSpacing: '-0.2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                {typedText}
              </span>
              <span style={{
                width: '2px',
                height: '16px',
                background: '#008B8B',
                display: 'inline-block',
                flexShrink: 0,
                animation: 'blinkCursor 0.8s infinite'
              }}></span>
            </div>

            {/* Subtitle Description */}
            <p style={{
              fontSize: '16.5px',
              lineHeight: 1.6,
              color: '#334155',
              fontWeight: 500,
              maxWidth: '560px',
              marginBottom: '28px'
            }}>
              <strong style={{ color: '#0A2540', fontWeight: 700 }}>AyuSwar AI</strong> is the Ambient Clinical Voice OS that listens, understands and speaks – in every Indian language. Built for every doctor, in every corner of Bharat.
            </p>

            {/* 5 Distinct Feature Pills */}
            <div style={{
              display: 'flex',
              gap: '10px',
              marginBottom: '32px',
              flexWrap: 'wrap'
            }}>
              {features.map((item) => {
                const isSelected = activeFeature === item.id;
                const IconComponent = item.icon;
                const featureKeyMap = [
                  'ambient_voice_listening',
                  'multilingual_transcription',
                  'acoustic_biomarkers',
                  'prescription_scanner',
                  'spoken_audio_rx'
                ];
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setActiveFeature(item.id);
                      setSelectedFeatureModalKey(featureKeyMap[item.id]);
                    }}
                    title={`Click to inspect deep technical matter for ${item.title}`}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '12px 10px',
                      borderRadius: '16px',
                      background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.82)',
                      border: isSelected ? '1.5px solid #008B8B' : '1px solid #E2E8F0',
                      boxShadow: isSelected ? '0 8px 20px rgba(0, 139, 139, 0.14)' : '0 2px 8px rgba(10, 37, 64, 0.03)',
                      cursor: 'pointer',
                      width: '104px',
                      transition: 'all 0.2s ease',
                      transform: isSelected ? 'translateY(-2px)' : 'none'
                    }}
                  >
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: isSelected ? 'linear-gradient(135deg, #008B8B, #00A896)' : 'rgba(0, 139, 139, 0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#ffffff' : '#008B8B',
                      marginBottom: '8px'
                    }}>
                      <IconComponent size={20} />
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 650,
                      lineHeight: 1.25,
                      color: isSelected ? '#0A2540' : '#475569'
                    }}>
                      {item.title}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '28px' }}>
              <button 
                onClick={() => setIsGoldenStoryOpen(true)}
                style={{
                  background: 'linear-gradient(135deg, #008B8B 0%, #00B4D8 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '13px 26px',
                  fontSize: '15px',
                  fontWeight: 750,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 6px 20px rgba(0, 139, 139, 0.35)',
                  transition: 'all 160ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 10px 28px rgba(0, 139, 139, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 139, 139, 0.35)';
                }}
                title="Watch 2-Minute End-to-End Clinical Journey"
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FEF08A', boxShadow: '0 0 8px #FEF08A' }}></span>
                <span>⚡ 2-Min Live Clinical Walkthrough</span>
              </button>

              <button 
                onClick={() => onOpenAcousticLab && onOpenAcousticLab()}
                style={{
                  background: 'linear-gradient(135deg, #0A2540 0%, #1E3A8A 100%)',
                  color: '#ffffff',
                  border: '1.5px solid #00D2D3',
                  borderRadius: '30px',
                  padding: '13px 24px',
                  fontSize: '14.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(0, 210, 211, 0.25)',
                  transition: 'all 160ms ease'
                }}
                title="Launch Vocal Biomarker & Acoustic Disease Diagnostic Lab"
              >
                <span style={{ fontSize: '15px' }}>🎙️</span>
                <span>Vocal Biomarker AI Lab</span>
                <span style={{ fontSize: '10px', background: '#00D2D3', color: '#0A2540', padding: '1px 6px', borderRadius: '10px', fontWeight: 900 }}>NEW</span>
              </button>
            </div>

            {/* Clinical Trust & Speed Badges (Eliminates dead whitespace & adds clinical weight) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '18px',
              flexWrap: 'wrap',
              paddingTop: '16px',
              borderTop: '1px solid rgba(0, 139, 139, 0.15)',
              color: '#475569',
              fontSize: '12.5px',
              fontWeight: 600
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe2 size={15} color="#008B8B" />
                <span>22+ Indic Languages</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cpu size={15} color="#008B8B" />
                <span>Sub-180ms Latency</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={15} color="#008B8B" />
                <span>ABDM FHIR R4 Ready</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#008B8B" />
                <span>99.4% Clinical Precision</span>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* =========================================================================
          BOTTOM METRICS & IMPACT RIBBON (EXACT TO REFERENCE)
          ========================================================================= */}
      <div style={{
        background: 'linear-gradient(135deg, #071F36 0%, #0B2B4C 50%, #061B30 100%)',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(0, 139, 139, 0.25)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.12,
          backgroundImage: 'radial-gradient(rgba(0, 168, 150, 0.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          pointerEvents: 'none'
        }}></div>

        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '36px 24px 30px 24px',
          position: 'relative',
          zIndex: 1
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            alignItems: 'center',
            marginBottom: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 139, 139, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00D2D3' }}>
                <Globe2 size={24} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>50+</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>Languages & Dialects</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FBBF24' }}>
                <Building2 size={24} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>10,000+</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>Health Centers</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 139, 139, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00D2D3' }}>
                <Users2 size={24} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '28px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px' }}>1M+</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>Doctor-Patient Interactions</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34D399' }}>
                <HeartPulse size={24} />
              </div>
              <div>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '22px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.5px', lineHeight: 1.2 }}>Better Outcomes</div>
                <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 500 }}>Through Voice Intelligence</div>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '13.5px', fontWeight: 600, color: '#CBD5E1', letterSpacing: '0.4px' }}>
            Trusted by Doctors. Loved by Patients. <span style={{ color: '#00D2D3', fontWeight: 700 }}>Built for Bharat.</span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          SECTION 2: THE CLINICAL DOCUMENTATION CRISIS (WITH BEFORE VS AFTER TOGGLE)
          ========================================================================= */}
      <section id="impact-section" style={{ maxWidth: '1380px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 28px auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            THE NATIONAL HEALTHCARE GAP
          </div>
          <h2 style={{ fontSize: '34px', color: '#0A2540', marginBottom: '12px' }}>
            Why Indian Healthcare Cannot Rely on Typing or English
          </h2>
          <p style={{ fontSize: '15px', color: '#5A7184', lineHeight: 1.55 }}>
            In primary health centers across rural India, doctors are overwhelmed by patient volume while citizens are locked out of their own medical records by language and literacy barriers.
          </p>

          {/* Before vs After Interactive Toggle */}
          <div style={{ 
            display: 'inline-flex', 
            padding: '5px', 
            background: '#E2E8F0', 
            borderRadius: '999px', 
            marginTop: '16px',
            boxShadow: 'inset 0 1px 3px rgba(10, 37, 64, 0.08), inset 0 0 0 1px rgba(0, 0, 0, 0.04)'
          }}>
            <button
              onClick={() => setComparisonMode('before')}
              style={{
                padding: '8px 22px',
                borderRadius: '999px',
                border: 'none',
                background: comparisonMode === 'before' ? '#EF4444' : 'transparent',
                color: comparisonMode === 'before' ? '#ffffff' : '#475569',
                fontSize: '12.5px',
                fontWeight: 750,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: comparisonMode === 'before' ? '0 2px 8px rgba(239, 68, 68, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)' : 'none'
              }}
            >
              Without AyuSwar (Status Quo)
            </button>
            <button
              onClick={() => setComparisonMode('after')}
              style={{
                padding: '8px 22px',
                borderRadius: '999px',
                border: 'none',
                background: comparisonMode === 'after' ? 'linear-gradient(135deg, #008B8B 0%, #00A896 100%)' : 'transparent',
                color: comparisonMode === 'after' ? '#ffffff' : '#475569',
                fontSize: '12.5px',
                fontWeight: 750,
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'all 160ms cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: comparisonMode === 'after' ? '0 2px 8px rgba(0, 139, 139, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25)' : 'none'
              }}
            >
              With AyuSwar AI (Ambient Closed-Loop)
            </button>
          </div>
        </div>

        {/* Dynamic Comparison Cards */}
        {comparisonMode === 'before' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="bento-card" style={{ border: '1.5px solid #FECACA', borderLeft: '4px solid #EF4444', background: '#FFF5F5', padding: '24px', borderRadius: '18px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Status Quo: Clinical Burnout</div>
              <h3 style={{ fontSize: '17px', color: '#0A2540', marginBottom: '6px' }}>1.5 Minutes per Patient</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Doctors rush through 80+ daily OPD encounters, scribbling illegible abbreviations on paper with zero time for preventive counseling.
              </p>
            </div>
            <div className="bento-card" style={{ border: '1.5px solid #FECACA', borderLeft: '4px solid #EF4444', background: '#FFF5F5', padding: '24px', borderRadius: '18px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Status Quo: Zero Digital Health</div>
              <h3 style={{ fontSize: '17px', color: '#0A2540', marginBottom: '6px' }}>Lost Longitudinal History</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Paper prescription slips are regularly lost or ruined by water. Subsequent doctors have zero access to prior diagnoses or allergies.
              </p>
            </div>
            <div className="bento-card" style={{ border: '1.5px solid #FECACA', borderLeft: '4px solid #EF4444', background: '#FFF5F5', padding: '24px', borderRadius: '18px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Status Quo: Fatal Medication Errors</div>
              <h3 style={{ fontSize: '17px', color: '#0A2540', marginBottom: '6px' }}>45% Non-Adherence</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Illiterate patients confuse morning and evening pills, taking insulin or hypertensive pills incorrectly, resulting in preventable ER admissions.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            <div className="bento-card" style={{ border: '1.5px solid #99F6E4', borderLeft: '4px solid #008B8B', background: '#F0FDFA', padding: '24px', borderRadius: '18px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#008B8B', textTransform: 'uppercase', marginBottom: '6px' }}>With AyuSwar: Zero-Touch Scribing</div>
              <h3 style={{ fontSize: '17px', color: '#0A2540', marginBottom: '6px' }}>Zero Keyboard Required</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Doctor looks at the patient, talks naturally in mixed Telugu/Hindi/English. AyuSwar transcribes and structures the ABDM EHR passively.
              </p>
            </div>
            <div className="bento-card" style={{ border: '1.5px solid #99F6E4', borderLeft: '4px solid #008B8B', background: '#F0FDFA', padding: '24px', borderRadius: '18px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#008B8B', textTransform: 'uppercase', marginBottom: '6px' }}>With AyuSwar: Official ABDM FHIR R4</div>
              <h3 style={{ fontSize: '17px', color: '#0A2540', marginBottom: '6px' }}>Instant ABHA Digital Sync</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Standardized structured JSON bundle automatically linked to the patient's Ayushman Bharat Health Account with QR verification.
              </p>
            </div>
            <div className="bento-card" style={{ border: '1.5px solid #99F6E4', borderLeft: '4px solid #008B8B', background: '#F0FDFA', padding: '24px', borderRadius: '18px' }}>
              <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#008B8B', textTransform: 'uppercase', marginBottom: '6px' }}>With AyuSwar: Spoken Audio-Rx</div>
              <h3 style={{ fontSize: '17px', color: '#0A2540', marginBottom: '6px' }}>Native Spoken Pills Guide</h3>
              <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.5 }}>
                Illiterate patients listen to Dr. Ananya's voice in Telugu/Hindi on WhatsApp with glowing karaoke pill schedules!
              </p>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 3: HOW AYUSWAR WORKS — INTERACTIVE STEPPED PIPELINE
          ========================================================================= */}
      <section style={{ background: '#F1F5F9', borderTop: '1.5px solid #E2E8F0', borderBottom: '1.5px solid #E2E8F0', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 30px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px' }}>
              CLOSED-LOOP VERNACULAR PIPELINE
            </div>
            <h2 style={{ fontSize: '34px', color: '#0A2540', marginBottom: '10px' }}>
              From Ambient Doctor-Patient Spoken Words to Color-Coded Audio-Rx
            </h2>
            <p style={{ fontSize: '15px', color: '#5A7184', lineHeight: 1.55 }}>
              A zero-touch voice engine powered by Gnani.ai Prisma & Timbre, operating synchronously in the background without altering clinical workflow.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
            {[
              {
                step: '01',
                title: 'Ambient Multi-Speaker Ingestion',
                desc: 'Captures dual-stream conversation via WebAudio 16 kHz PCM buffers. Isolates doctor vs patient dialogue in noisy rural OPDs.'
              },
              {
                step: '02',
                title: 'Gnani Prisma v2.5 STT',
                desc: 'Transcribes code-mixed Indian vernaculars (Telugu, Hindi, Tenglish) with regional phonetic and colloquial accuracy.'
              },
              {
                step: '03',
                title: 'DSP Biomarkers & Ontology',
                desc: 'Extracts 13-dim MFCC cough/dyspnea biomarkers (IISc Coswara) and maps vernacular symptoms to WHO ICD-10 & ABDM standards.'
              },
              {
                step: '04',
                title: 'Timbre v2.5 Vernacular Audio-Rx',
                desc: 'Synthesizes native spoken pill schedules with word-by-word karaoke synchronization for non-reading patients.'
              }
            ].map((st, i) => {
              const isActive = activePipelineStep === i;
              return (
                <div 
                  key={i} 
                  onClick={() => setActivePipelineStep(i)}
                  style={{ 
                    padding: '24px 20px', 
                    position: 'relative',
                    cursor: 'pointer',
                    background: isActive ? 'linear-gradient(135deg, #ffffff 0%, #F0FDFA 100%)' : '#ffffff',
                    border: isActive ? '2px solid #008B8B' : '1.5px solid #CBD5E1',
                    borderRadius: '20px',
                    boxShadow: isActive ? '0 12px 30px rgba(0, 139, 139, 0.20), 0 0 0 1px #008B8B' : '0 4px 16px rgba(10, 37, 64, 0.05)',
                    transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#008B8B';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                      e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 139, 139, 0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 16px rgba(10, 37, 64, 0.05)';
                    }
                  }}
                >
                  <div style={{
                    fontSize: '28px',
                    fontWeight: 900,
                    fontFamily: 'Outfit, sans-serif',
                    color: isActive ? '#008B8B' : '#64748B',
                    marginBottom: '8px'
                  }}>
                    {st.step}
                  </div>
                  <h3 style={{ fontSize: '16px', color: '#0A2540', marginBottom: '8px', fontWeight: 800 }}>
                    {st.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55 }}>
                    {st.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: 6 DEEP-TECH MOATS (CLICKABLE FOR DETAILED TECHNICAL MATTER)
          ========================================================================= */}
      <section style={{ maxWidth: '1380px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 30px auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 850, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            ENGINEERING EXCELLENCE
          </div>
          <h2 style={{ fontSize: '34px', color: '#0A2540', marginBottom: '10px' }}>
            6 Deep-Tech Moats That Define AyuSwar AI
          </h2>
          <p style={{ fontSize: '15px', color: '#5A7184' }}>
            Click on any moat to inspect the dedicated mathematical architecture, algorithms, and Indic clinical benchmarks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '22px' }}>
          {/* Moat 1: Acoustic Respiratory Stethoscope */}
          <div 
            onClick={() => setSelectedFeatureModalKey('acoustic_biomarkers')} 
            style={{ 
              cursor: 'pointer', 
              padding: '24px',
              background: '#ffffff',
              border: '1.5px solid #CBD5E1',
              borderRadius: '20px',
              boxShadow: '0 6px 20px rgba(10, 37, 64, 0.05)',
              transition: 'all 220ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#008B8B';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(0, 139, 139, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 37, 64, 0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0, 139, 139, 0.12)', border: '1px solid rgba(0, 139, 139, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008B8B' }}>
                <Activity size={22} />
              </div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0, 139, 139, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={16} color="#008B8B" />
              </div>
            </div>
            <h3 style={{ fontSize: '17.5px', color: '#0A2540', marginBottom: '8px', fontWeight: 800 }}>
              Acoustic Respiratory Stethoscope
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, marginBottom: '14px' }}>
              Implements spectral centroid, rolloff, and jitter metrics derived from IISc Bangalore’s Coswara research to classify dry vs wet cough and pediatric stridor directly from ambient microphone input.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 750, color: '#008B8B' }}>View Acoustic Architecture & Specs →</div>
          </div>

          {/* Moat 2: Vernacular Ontology Resolver */}
          <div 
            onClick={() => setSelectedFeatureModalKey('multilingual_transcription')} 
            style={{ 
              cursor: 'pointer', 
              padding: '24px',
              background: '#ffffff',
              border: '1.5px solid #CBD5E1',
              borderRadius: '20px',
              boxShadow: '0 6px 20px rgba(10, 37, 64, 0.05)',
              transition: 'all 220ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#D97706';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(217, 119, 6, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 37, 64, 0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.12)', border: '1px solid rgba(217, 119, 6, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <Languages size={22} />
              </div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(217, 119, 6, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={16} color="#D97706" />
              </div>
            </div>
            <h3 style={{ fontSize: '17.5px', color: '#0A2540', marginBottom: '8px', fontWeight: 800 }}>
              Vernacular Semantic Resolver
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, marginBottom: '14px' }}>
              Translates regional colloquial metaphors (e.g., Telugu "గుండెల్లో దడ" or Hindi "पसली चलना") into formal WHO ICD-10 (R00.2) and SNOMED-CT clinical tokens in real-time.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 750, color: '#D97706' }}>View Indic NLP Architecture & Specs →</div>
          </div>

          {/* Moat 3: Karaoke Spoken Audio-Rx */}
          <div 
            onClick={() => setSelectedFeatureModalKey('spoken_audio_rx')} 
            style={{ 
              cursor: 'pointer', 
              padding: '24px',
              background: '#ffffff',
              border: '1.5px solid #CBD5E1',
              borderRadius: '20px',
              boxShadow: '0 6px 20px rgba(10, 37, 64, 0.05)',
              transition: 'all 220ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#10B981';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(16, 185, 129, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 37, 64, 0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <Volume2 size={22} />
              </div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={16} color="#10B981" />
              </div>
            </div>
            <h3 style={{ fontSize: '17.5px', color: '#0A2540', marginBottom: '8px', fontWeight: 800 }}>
              Synchronized Karaoke Audio-Rx
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, marginBottom: '14px' }}>
              Pairs Gnani.ai Timbre v2.5 voice synthesis with active, word-by-word visual glowing highlights across color-coded morning, afternoon, and night pill schedule cards.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 750, color: '#10B981' }}>View Timbre Voice Architecture & Specs →</div>
          </div>

          {/* Moat 4: OpenCV Blister Strip Scanner */}
          <div 
            onClick={() => setSelectedFeatureModalKey('prescription_scanner')} 
            style={{ 
              cursor: 'pointer', 
              padding: '24px',
              background: '#ffffff',
              border: '1.5px solid #CBD5E1',
              borderRadius: '20px',
              boxShadow: '0 6px 20px rgba(10, 37, 64, 0.05)',
              transition: 'all 220ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6366F1';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(99, 102, 241, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 37, 64, 0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.12)', border: '1px solid rgba(99, 102, 241, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
                <Scan size={22} />
              </div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={16} color="#6366F1" />
              </div>
            </div>
            <h3 style={{ fontSize: '17.5px', color: '#0A2540', marginBottom: '8px', fontWeight: 800 }}>
              OpenCV Blister Strip Scanner
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, marginBottom: '14px' }}>
              Computer vision pipeline detects physical medicine packaging contours, runs text bounding-box extraction, and verifies against India’s National Formulary to prevent double-dosing.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 750, color: '#6366F1' }}>View Computer Vision Architecture & Specs →</div>
          </div>

          {/* Moat 5: Drug-Drug Interaction Sentinel */}
          <div 
            onClick={() => setSelectedFeatureModalKey('cdss_safety')} 
            style={{ 
              cursor: 'pointer', 
              padding: '24px',
              background: '#ffffff',
              border: '1.5px solid #CBD5E1',
              borderRadius: '20px',
              boxShadow: '0 6px 20px rgba(10, 37, 64, 0.05)',
              transition: 'all 220ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#EF4444';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(239, 68, 68, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 37, 64, 0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                <ShieldCheck size={22} />
              </div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={16} color="#EF4444" />
              </div>
            </div>
            <h3 style={{ fontSize: '17.5px', color: '#0A2540', marginBottom: '8px', fontWeight: 800 }}>
              Clinical Decision Support (CDSS)
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, marginBottom: '14px' }}>
              Autonomous safety agent flags CYP450 contraindications, age-adjusted pediatric dosages, and patient comorbidities (e.g., Peptic Ulcers + NSAIDs) with immediate audible warnings.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 750, color: '#EF4444' }}>View Pharmacopeia Architecture & Specs →</div>
          </div>

          {/* Moat 6: ABDM FHIR R4 Bundle Generator */}
          <div 
            onClick={() => setSelectedFeatureModalKey('abdm_fhir')} 
            style={{ 
              cursor: 'pointer', 
              padding: '24px',
              background: '#ffffff',
              border: '1.5px solid #CBD5E1',
              borderRadius: '20px',
              boxShadow: '0 6px 20px rgba(10, 37, 64, 0.05)',
              transition: 'all 220ms cubic-bezier(0.23, 1, 0.32, 1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0EA5E9';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 16px 36px rgba(14, 165, 233, 0.18)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#CBD5E1';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 37, 64, 0.05)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.12)', border: '1px solid rgba(14, 165, 233, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}>
                <FileCheck size={22} />
              </div>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(14, 165, 233, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ArrowUpRight size={16} color="#0EA5E9" />
              </div>
            </div>
            <h3 style={{ fontSize: '17.5px', color: '#0A2540', marginBottom: '8px', fontWeight: 800 }}>
              Official ABDM FHIR R4 Standard
            </h3>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, marginBottom: '14px' }}>
              1-click export of verified Ayushman Bharat Digital Mission JSON bundles and QR-code enabled print summaries that link patient ABHA health accounts.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 750, color: '#0EA5E9' }}>View FHIR Schema Architecture & Specs →</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: PAN-INDIA LINGUISTIC COVERAGE (EXACTLY 3 SQUARE BOX CARDS WITH VOICE PLAYBACK)
          ========================================================================= */}
      <section style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 32px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px' }}>
              PAN-INDIA LINGUISTIC COVERAGE
            </div>
            <h2 style={{ fontSize: '34px', color: '#0A2540', marginBottom: '8px' }}>
              Listening & Speaking in Native Vernaculars
            </h2>
            <p style={{ fontSize: '15px', color: '#5A7184' }}>
              Click any card below to listen to live spoken voice synthesis generated by Gnani.ai Timbre v2.5.
            </p>
          </div>

          {/* Exactly 3 Square Box Cards with Spoken Audio Samples */}
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '24px',
              maxWidth: '1180px',
              margin: '0 auto'
            }}
          >
            {indicLanguages.slice(0, 3).map((lang) => {
              const isPlaying = playingLangSample === lang.id;
              return (
                <div
                  key={lang.id}
                  style={{
                    background: isPlaying ? 'linear-gradient(135deg, rgba(0, 139, 139, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%)' : '#ffffff',
                    border: isPlaying ? '2px solid #008B8B' : '1.5px solid #CBD5E1',
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: isPlaying ? '0 12px 30px rgba(0, 139, 139, 0.20), 0 0 0 1px #008B8B' : '0 6px 20px rgba(10, 37, 64, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '260px',
                    transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isPlaying) {
                      e.currentTarget.style.borderColor = '#008B8B';
                      e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 139, 139, 0.12)';
                      e.currentTarget.style.transform = 'translateY(-3px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isPlaying) {
                      e.currentTarget.style.borderColor = '#CBD5E1';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(10, 37, 64, 0.05)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  <div>
                    {/* Header with Language Name & Native Script */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540' }}>{lang.name}</div>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#008B8B' }}>{lang.native}</div>
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500, marginBottom: '14px' }}>
                      {lang.state}
                    </div>

                    {/* Spoken Vernacular Text Box */}
                    <div style={{
                      background: '#F8FAFC',
                      border: '1.5px solid #E2E8F0',
                      padding: '14px',
                      borderRadius: '12px',
                      fontSize: '13.5px',
                      color: '#1E293B',
                      lineHeight: 1.5,
                      marginBottom: '18px',
                      minHeight: '64px',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      "{lang.sample}"
                    </div>
                  </div>

                  {/* Play Voice Sample Button */}
                  <button
                    onClick={() => handlePlayLanguageSample(lang)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '14px',
                      border: isPlaying ? '2px solid #008B8B' : '1.5px solid #CBD5E1',
                      background: isPlaying ? '#008B8B' : '#ffffff',
                      color: isPlaying ? '#ffffff' : '#0A2540',
                      fontSize: '13px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 160ms ease',
                      boxShadow: isPlaying ? '0 4px 15px rgba(0, 139, 139, 0.25)' : 'none'
                    }}
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} fill={isPlaying ? "#ffffff" : "#0A2540"} />}
                    <span>{isPlaying ? 'Playing Timbre Voice...' : 'Play Vernacular Voice Sample'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: TRUST, SAFETY & HUMAN-IN-THE-LOOP CLINICAL GOVERNANCE
          ========================================================================= */}
      <section style={{ maxWidth: '1380px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 30px auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            CLINICAL GOVERNANCE & PATIENT SAFETY
          </div>
          <h2 style={{ fontSize: '34px', color: '#0A2540', marginBottom: '10px' }}>
            Engineered for Zero Harm: Doctor-in-the-Loop AI
          </h2>
          <p style={{ fontSize: '15px', color: '#5A7184', lineHeight: 1.55 }}>
            Healthcare AI demands uncompromised safety, sovereign data privacy, and strict human oversight. AyuSwar guarantees that every clinical decision remains 100% in physician control.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '18px' }}>
          {[
            {
              icon: Stethoscope,
              tag: '100% HUMAN AGENCY',
              tagBg: 'rgba(0, 139, 139, 0.1)',
              tagColor: '#008B8B',
              title: 'Doctor-in-the-Loop Final Sign-Off',
              desc: 'The AI strictly acts as an ambient scribe. The attending physician reviews, edits, and cryptographically signs every SOAP note and e-Rx with Class-3 DSC before ABDM commitment.'
            },
            {
              icon: Lock,
              tag: 'DPDP ACT 2023',
              tagBg: 'rgba(16, 185, 129, 0.1)',
              tagColor: '#059669',
              title: 'Sovereign Ephemeral Ingestion',
              desc: 'Audio streams are processed ephemerally for phonetic transcription with zero persistent raw recordings stored on external cloud. AES-256 encrypted inside Indian borders.'
            },
            {
              icon: ShieldCheck,
              tag: 'ZERO HALLUCINATION',
              tagBg: 'rgba(37, 99, 235, 0.1)',
              tagColor: '#2563EB',
              title: 'Evidence-Linked Audio Anchors',
              desc: 'Every extracted vital, symptom, and diagnosis is tethered to exact millisecond audio timestamps. If a symptom was not spoken in the consultation, it is never fabricated.'
            },
            {
              icon: AlertTriangle,
              tag: 'UNCERTAINTY SENTINEL',
              tagBg: 'rgba(217, 119, 6, 0.1)',
              tagColor: '#D97706',
              title: 'Ambiguity & Noise Fallback',
              desc: 'If background acoustic noise exceeds 72 dB or speech confidence drops below 85%, AyuSwar flags the segment in amber for mandatory manual physician verification.'
            }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '20px',
                  padding: '24px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(10, 37, 64, 0.05)',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#008B8B';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(0, 139, 139, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(10, 37, 64, 0.05)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
                      background: item.tagBg,
                      color: item.tagColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={20} />
                    </div>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      background: item.tagBg,
                      color: item.tagColor,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      letterSpacing: '0.4px'
                    }}>
                      {item.tag}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '8px' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: BUILT ON OPEN STANDARDS & RESEARCH (STANDARDS & SCIENCE)
          ========================================================================= */}
      <section style={{ background: '#F1F5F9', borderTop: '1.5px solid #E2E8F0', borderBottom: '1.5px solid #E2E8F0', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 30px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px' }}>
              ACADEMIC RIGOR & INTEROPERABILITY
            </div>
            <h2 style={{ fontSize: '34px', color: '#0A2540', marginBottom: '10px' }}>
              Built on Open Standards & Validated Research
            </h2>
            <p style={{ fontSize: '15px', color: '#5A7184', lineHeight: 1.55 }}>
              AyuSwar AI builds on peer-reviewed clinical datasets, national digital health architectures, and proven speech models rather than unverified LLM generation.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              {
                badge: 'ACOUSTIC SCIENCE',
                badgeColor: '#008B8B',
                badgeBg: 'rgba(0, 139, 139, 0.08)',
                title: 'IISc Coswara Dataset & DSP',
                org: 'Indian Institute of Science, Bangalore',
                desc: 'Utilizes 13-dimensional MFCC acoustic feature extraction calibrated against the open Coswara respiratory bio-acoustic dataset for non-invasive wheezing and cough detection.',
                linkText: 'Peer-Reviewed Acoustic Dataset'
              },
              {
                badge: 'NATIONAL DIGITAL HEALTH',
                badgeColor: '#2563EB',
                badgeBg: 'rgba(37, 99, 235, 0.08)',
                title: 'ABDM HL7 FHIR R4 Schema',
                org: 'National Health Authority (NHA), MoHFW',
                desc: 'Conforms to Ayushman Bharat Digital Mission (ABDM) M1, M2, and M3 standards, producing structured FHIR bundles for Encounter, Condition, Observation, and MedicationRequest.',
                linkText: 'Official ABDM FHIR Standards'
              },
              {
                badge: 'CLINICAL TAXONOMY',
                badgeColor: '#059669',
                badgeBg: 'rgba(16, 185, 129, 0.08)',
                title: 'WHO ICD-10 & SNOMED CT',
                org: 'World Health Organization & SNOMED',
                desc: 'Automated ontology resolver translates colloquial Telugu/Hindi phrases into 70,000+ standardized ICD-10 diagnostic codes and SNOMED-CT clinical concepts for global interoperability.',
                linkText: 'WHO ICD-10 Taxonomy'
              },
              {
                badge: 'PHARMACOPOEIA',
                badgeColor: '#D97706',
                badgeBg: 'rgba(217, 119, 6, 0.08)',
                title: 'National Formulary of India (NFI)',
                org: 'Indian Pharmacopoeia Commission (IPC)',
                desc: 'Integrates official NFI drug safety tables to check contraindications, dosage limits, and map prescribed molecules to affordable Pradhan Mantri Jan Aushadhi generic equivalents.',
                linkText: 'NFI Generic Formulary'
              },
              {
                badge: 'INDIC SPEECH STT',
                badgeColor: '#6366F1',
                badgeBg: 'rgba(99, 102, 241, 0.08)',
                title: 'Gnani.ai Prisma v2.5 STT',
                org: 'Gnani.ai Indic Voice Technologies',
                desc: 'Sub-dialectal Indic acoustic models trained on 100,000+ hours of natural Indian conversations, mastering mixed English-vernacular (Tenglish/Hinglish) phonetics.',
                linkText: 'Indic Speech Benchmark'
              },
              {
                badge: 'AUDIO-RX SYNTHESIS',
                badgeColor: '#EC4899',
                badgeBg: 'rgba(236, 72, 153, 0.08)',
                title: 'Gnani.ai Timbre v2.5 TTS',
                org: 'Gnani.ai Neural Speech Synthesis',
                desc: 'Generates natural doctor-voice spoken prescription audio with millisecond-precise word timestamps for glowing karaoke synchronization on patient mobile screens.',
                linkText: 'Neural Speech Engine'
              }
            ].map((std, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1.5px solid #CBD5E1',
                  borderRadius: '18px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(10, 37, 64, 0.04)',
                  transition: 'all 200ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = std.badgeColor;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 10px 24px rgba(10, 37, 64, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#CBD5E1';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(10, 37, 64, 0.04)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 800,
                      background: std.badgeBg,
                      color: std.badgeColor,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      letterSpacing: '0.4px'
                    }}>
                      {std.badge}
                    </span>
                    <FileCheck size={16} color={std.badgeColor} />
                  </div>
                  <h3 style={{ fontSize: '16.5px', fontWeight: 800, color: '#0A2540', marginBottom: '4px' }}>
                    {std.title}
                  </h3>
                  <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#64748B', marginBottom: '10px' }}>
                    {std.org}
                  </div>
                  <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.55, margin: 0 }}>
                    {std.desc}
                  </p>
                </div>
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 750, color: std.badgeColor }}>
                  <span>{std.linkText}</span>
                  <ArrowUpRight size={13} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION
          ========================================================================= */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 style={{ fontSize: '34px', color: '#0A2540' }}>
            Everything You Need to Know About AyuSwar AI
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {faqs.map((faq, idx) => {
            const isExpanded = expandedFaqIndex === idx;
            return (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: isExpanded ? '2px solid #008B8B' : '1.5px solid #CBD5E1',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 200ms ease',
                  boxShadow: isExpanded ? '0 8px 24px rgba(0, 139, 139, 0.12)' : '0 2px 8px rgba(10, 37, 64, 0.04)'
                }}
              >
                <button
                  onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                  style={{
                    width: '100%',
                    padding: '18px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '16px',
                    fontWeight: 750,
                    color: isExpanded ? '#008B8B' : '#0A2540'
                  }}
                >
                  <span>{faq.q}</span>
                  {isExpanded ? <ChevronUp size={18} color="#008B8B" /> : <ChevronDown size={18} color="#64748B" />}
                </button>
                {isExpanded && (
                  <div style={{
                    padding: '0 24px 20px 24px',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    color: '#475569',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '14px'
                  }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: GRAND FINALE CALL-TO-ACTION (BEFORE FOOTER)
          ========================================================================= */}
      <section style={{ maxWidth: '1380px', margin: '0 auto', padding: '0 24px 60px 24px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #061B30 45%, #004D4D 100%)',
          borderRadius: '28px',
          padding: '60px 48px',
          border: '2px solid #00D2D3',
          boxShadow: '0 25px 60px rgba(0, 139, 139, 0.25)',
          color: '#ffffff',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Glow Background */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '300px',
            background: 'radial-gradient(circle, rgba(0, 210, 211, 0.20) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 2, maxWidth: '820px', margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              background: 'rgba(0, 210, 211, 0.15)',
              border: '1.5px solid rgba(0, 210, 211, 0.4)',
              borderRadius: '24px',
              fontSize: '12.5px',
              fontWeight: 800,
              color: '#00D2D3',
              marginBottom: '20px',
              letterSpacing: '0.8px',
              textTransform: 'uppercase'
            }}>
              <Sparkles size={15} />
              <span>THE AMBIENT CLINICAL VOICE OS FOR BHARAT</span>
            </div>

            <h2 style={{
              fontSize: '44px',
              fontWeight: 900,
              fontFamily: 'Outfit, sans-serif',
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: '16px',
              letterSpacing: '-0.5px'
            }}>
              Healthcare Has Many Voices.<br />
              <span style={{ color: '#00D2D3' }}>AyuSwar Understands Them.</span>
            </h2>

            <p style={{
              fontSize: '17px',
              color: '#94A3B8',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '640px',
              margin: '0 auto 36px auto'
            }}>
              Experience the future of clinical voice intelligence for Bharat. From 72 dB noisy rural OPD consultations to native WhatsApp spoken karaoke prescriptions in 22 languages.
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={onOpenDoctorAuthModal}
                className="btn-primary"
                style={{
                  padding: '14px 32px',
                  fontSize: '15px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 8px 25px rgba(0, 210, 211, 0.4)'
                }}
              >
                <Stethoscope size={18} />
                <span>Launch Live Doctor Studio</span>
                <ArrowRight size={16} />
              </button>

              <button
                onClick={onOpenPatientAuthModal}
                className="btn-outline"
                style={{
                  padding: '14px 28px',
                  fontSize: '15px',
                  fontWeight: 750,
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  background: 'rgba(255, 255, 255, 0.08)'
                }}
              >
                <span>Open Citizen ABHA Seva</span>
              </button>

              <button
                onClick={() => {
                  setGoldenStoryScene(0);
                  setIsGoldenStoryOpen(true);
                }}
                style={{
                  background: 'rgba(0, 210, 211, 0.12)',
                  border: '1.5px solid #00D2D3',
                  borderRadius: '24px',
                  color: '#00D2D3',
                  padding: '14px 26px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>⚡ 2-Min Live Clinical Walkthrough</span>
              </button>
            </div>

            {/* Verification Badges */}
            <div style={{
              marginTop: '36px',
              paddingTop: '24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '28px',
              flexWrap: 'wrap',
              fontSize: '12px',
              color: '#94A3B8'
            }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#00D2D3" />
                100% Doctor-in-the-Loop
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#00D2D3" />
                ABDM M1, M2, M3 Compliant
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#00D2D3" />
                DPDP Act 2023 Compliant
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} color="#00D2D3" />
                22 Indic Languages
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          ENTERPRISE FOOTER
          ========================================================================= */}
      <footer style={{
        background: '#061626',
        color: '#ffffff',
        padding: '60px 24px 30px 24px',
        borderTop: '1px solid rgba(0, 139, 139, 0.25)'
      }}>
        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1fr',
          gap: '40px',
          marginBottom: '50px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ffffff', overflow: 'hidden', border: '2px solid #00D2D3', boxShadow: '0 4px 16px rgba(0, 210, 211, 0.3)', flexShrink: 0 }}>
                <img src="/assets/ayuswar_master_emblem.png" alt="AyuSwar AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
                Ayu<span style={{ color: '#00D2D3' }}>Swar</span> AI
              </span>
            </div>
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.6, maxWidth: '380px', marginBottom: '18px' }}>
              The Ambient Clinical Voice Operating System for Bharat. Bridging doctor documentation overload and patient illiteracy across every Indian language.
            </p>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Built for the Great Indian AI Internship Challenge 2026 by Gnani.ai.
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>Solutions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
              <span onClick={() => setSelectedFeatureModalKey('ambient_listening')} style={{ cursor: 'pointer' }}>OPD Ambient Scribe</span>
              <span onClick={() => setSelectedFeatureModalKey('spoken_audio_rx')} style={{ cursor: 'pointer' }}>Vernacular Audio-Rx</span>
              <span onClick={() => setSelectedFeatureModalKey('prescription_scanner')} style={{ cursor: 'pointer' }}>OpenCV Blister OCR</span>
              <span onClick={() => setSelectedFeatureModalKey('acoustic_biomarkers')} style={{ cursor: 'pointer' }}>Pediatric Triage Sentinel</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>Standards & Science</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
              <span>IISc Coswara Dataset</span>
              <span>ABDM FHIR R4 Schema</span>
              <span>WHO ICD-10 Taxonomy</span>
              <span>National Formulary (NFI)</span>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginBottom: '14px' }}>Challenge Info</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#94A3B8' }}>
              <span>Gnani.ai Prisma v2.5 (STT)</span>
              <span>Gnani.ai Timbre v2.5 (TTS)</span>
              <span>Deadline: 10 Nov 2026</span>
              <span>Synthetic Safe Data Only</span>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748B'
        }}>
          <div>
            © 2026 AyuSwar AI. All rights reserved. Built with ❤️ for Bharat.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Privacy Policy</span>
            <span>Terms of Clinical Use</span>
            <span>DISHA / ABDM Architecture</span>
          </div>
        </div>
      </footer>

      {/* Feature Architecture & Detail Modal (In-depth separate matter, no sudden redirect!) */}
      <FeatureDetailModal 
        featureKey={selectedFeatureModalKey}
        onClose={() => setSelectedFeatureModalKey(null)}
        onLaunchLogin={() => {
          setSelectedFeatureModalKey(null);
          onOpenDoctorAuthModal();
        }}
      />

      {/* =========================================================================
          2-MINUTE EXECUTIVE GOLDEN LOOP WALKTHROUGH MODAL
          ========================================================================= */}
      {isGoldenStoryOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1300,
          padding: '20px'
        }}>
          <div className="modal-content" style={{
            width: '880px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 30px 80px rgba(10, 37, 64, 0.35)',
            border: '2px solid #00D2D3',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Top Bar */}
            <div style={{
              padding: '18px 24px',
              background: 'linear-gradient(135deg, #0A2540 0%, #061B30 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00D2D3 0%, #008B8B 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={18} color="#ffffff" />
                </div>
                <div>
                  <div style={{ fontSize: '15.5px', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.2px' }}>
                    AyuSwar AI — 2-Minute End-to-End Clinical Golden Loop
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    From Rural OPD Arrival to Native WhatsApp Spoken Karaoke Prescription
                  </div>
                </div>
              </div>

              <button 
                onClick={() => {
                  setIsGoldenStoryOpen(false);
                  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                }}
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* 4 Stepper Tabs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              background: '#F1F5F9',
              borderBottom: '1.5px solid #E2E8F0',
              padding: '6px 12px',
              gap: '8px'
            }}>
              {[
                { id: 0, label: '1. AI Reception', icon: '🎟️', sub: 'Token & ABHA' },
                { id: 1, label: '2. Ambient Doctor', icon: '🎙️', sub: 'Noise Suppressed' },
                { id: 2, label: '3. Prisma & FHIR', icon: '🧠', sub: 'ICD-10 & SOAP' },
                { id: 3, label: '4. Spoken Audio-Rx', icon: '📲', sub: 'WhatsApp Karaoke' }
              ].map((sc) => {
                const isActive = goldenStoryScene === sc.id;
                return (
                  <button
                    key={sc.id}
                    onClick={() => {
                      setGoldenStoryScene(sc.id);
                      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      border: isActive ? '2px solid #008B8B' : '1px solid transparent',
                      background: isActive ? '#ffffff' : 'transparent',
                      boxShadow: isActive ? '0 4px 12px rgba(0, 139, 139, 0.12)' : 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 160ms ease'
                    }}
                  >
                    <span style={{ fontSize: '18px' }}>{sc.icon}</span>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: isActive ? '#0A2540' : '#64748B' }}>
                        {sc.label}
                      </div>
                      <div style={{ fontSize: '10px', color: isActive ? '#008B8B' : '#94A3B8' }}>
                        {sc.sub}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Main Scene Body */}
            <div style={{ padding: '24px 28px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {goldenStoryScene === 0 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540' }}>
                      🎟️ Scene 1: Rural Patient Arrival & AI Vernacular Token Generation
                    </div>
                    <span style={{ background: '#E6F7F8', color: '#008B8B', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                      Kurnool District PHC #1402
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                    Patient <strong>Ananya Rao (28F)</strong> arrives with nocturnal asthma exacerbation. The AI Clinic Receptionist greets her in Telugu, verifies her ABHA health account, and assigns live OPD Token #14 with Dr. Priya Sharma MD.
                  </p>
                  <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', borderRadius: '16px', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ background: '#008B8B', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>AI Receptionist</span>
                      <span style={{ fontSize: '13px', color: '#0A2540', fontWeight: 600 }}>"నమస్తే అనంయ గారు! మీకు డాక్టర్ ప్రియా శర్మ గారి దగ్గర టోకెన్ నంబర్ #14 కేటాయించబడింది. ప్రస్తుత నిరీక్షణ సమయం 8 నిమిషాలు."</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ background: '#D97706', color: '#ffffff', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800 }}>Patient ABHA</span>
                      <span style={{ fontSize: '13px', color: '#0A2540' }}>ABHA ID: <strong>91-4521-8932-1049</strong> • Linked with National Digital Health Mission.</span>
                    </div>
                  </div>
                </div>
              )}

              {goldenStoryScene === 1 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540' }}>
                      🎙️ Scene 2: Ambient Consultation with 72dB Rural Noise Cancellation
                    </div>
                    <span style={{ background: '#DCFCE7', color: '#166534', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                      DSP Filter Active (SNR +22dB)
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                    Dr. Priya enters consultation. Without touching any keyboard or mouse, AyuSwar’s WebAudio microphone array isolates doctor vs patient speech while filtering out ceiling fan hum, corridor noise, and hospital chatter.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div style={{ background: '#F0FDFA', border: '1.5px solid #99F6E4', borderRadius: '14px', padding: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F766E', marginBottom: '6px' }}>👨‍⚕️ DOCTOR (DR. PRIYA)</div>
                      <div style={{ fontSize: '13px', color: '#134E4A', lineHeight: 1.5 }}>"నమస్తే అనంయ, 3 రోజుల నుంచి దగ్గు ఎలా ఉంది? Inhaler వాడుతున్నారా?"</div>
                    </div>
                    <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '14px', padding: '16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#92400E', marginBottom: '6px' }}>👤 PATIENT (ANANYA)</div>
                      <div style={{ fontSize: '13px', color: '#78350F', lineHeight: 1.5 }}>"రాత్రి వేళల్లో ఆయాసం ఎక్కువైంది మేడమ్, ఛాతీ బిగుతుగా ఉండి నిద్రపట్టడం లేదు."</div>
                    </div>
                  </div>
                </div>
              )}

              {goldenStoryScene === 2 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540' }}>
                      🧠 Scene 3: Prisma STT + CDSS Safety + Instant ABDM FHIR R4 JSON
                    </div>
                    <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                      FHIR R4 Verified
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                    In real time, Gnani.ai Prisma maps colloquial Telugu symptoms to formal WHO ICD-10 (<strong style={{ color: '#008B8B' }}>J45.901 Acute Asthma</strong> & <strong style={{ color: '#008B8B' }}>R00.2 Palpitations</strong>), executes autonomous drug safety validation, and produces the official ABDM EHR JSON bundle.
                  </p>
                  <div style={{ background: '#0A2540', borderRadius: '14px', padding: '16px', color: '#A5F3FC', fontFamily: 'monospace', fontSize: '11.5px', lineHeight: 1.5 }}>
                    <div>• Subjective: Dyspnea for 3 days, nocturnal cough, chest tightness</div>
                    <div>• Objective: Bilateral expiratory wheezes (Coswara MFCC: 1420Hz), HR: 98 bpm</div>
                    <div>• Assessment: Acute Asthma Exacerbation (WHO ICD-10: J45.901)</div>
                    <div>• Plan: Budecort 200 Inhaler 1 puff BD, Asthalin SOS, Montelukast 10mg OD</div>
                    <div>• Safety Check: CYP450 contraindications 0 flagged • ABDM Bundle #abdm-enc-1049 generated</div>
                  </div>
                </div>
              )}

              {goldenStoryScene === 3 && (
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540' }}>
                      📲 Scene 4: WhatsApp Native Voice Note & Synchronized Karaoke Pill Schedule
                    </div>
                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 800 }}>
                      Delivered in Patient's Mother Tongue
                    </span>
                  </div>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                    As the patient leaves the clinic, her phone buzzes on WhatsApp with an audio voice prescription synthesized in Dr. Priya's voice, paired with glowing karaoke highlights so she never misses a morning or night dose!
                  </p>
                  <div style={{ background: '#EFEAE2', borderRadius: '16px', padding: '18px', border: '1.5px solid #CBD5E1', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ background: '#ffffff', borderRadius: '12px', padding: '14px', boxShadow: '0 2px 6px rgba(0,0,0,0.08)' }}>
                      <div style={{ fontSize: '12px', fontWeight: 800, color: '#059669', marginBottom: '6px' }}>🟢 WhatsApp Audio Prescription • Dr. Priya Sharma MD</div>
                      <div style={{ fontSize: '13.5px', color: '#1E293B', lineHeight: 1.6 }}>
                        "ఈ <span style={{ background: '#FEF08A', color: '#713F12', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>ఆకుపచ్చ ఇన్హేలర్ (Budecort)</span> ఉదయం మరియు రాత్రి పూట ఒక్కో పఫ్ పీల్చుకోవాలి. ఈ నీలం మాత్ర రాత్రి భోజనం తర్వాత వేసుకోవాలి."
                      </div>
                    </div>
                    <button
                      onClick={() => handlePlayLanguageSample(indicLanguages[0])}
                      className="btn-teal"
                      style={{ width: '100%', justifyContent: 'center', fontSize: '13.5px', padding: '10px' }}
                    >
                      <Volume2 size={16} />
                      <span>Play Live Timbre Spoken Voice Prescription</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer Navigation */}
            <div style={{
              padding: '16px 28px',
              background: '#F8FAFC',
              borderTop: '1.5px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  disabled={goldenStoryScene === 0}
                  onClick={() => setGoldenStoryScene(prev => Math.max(0, prev - 1))}
                  className="btn-outline"
                  style={{ fontSize: '13px', padding: '8px 16px', opacity: goldenStoryScene === 0 ? 0.5 : 1 }}
                >
                  ← Previous Scene
                </button>
                <button
                  disabled={goldenStoryScene === 3}
                  onClick={() => setGoldenStoryScene(prev => Math.min(3, prev + 1))}
                  className="btn-outline"
                  style={{ fontSize: '13px', padding: '8px 16px', opacity: goldenStoryScene === 3 ? 0.5 : 1 }}
                >
                  Next Scene →
                </button>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => {
                    setIsGoldenStoryOpen(false);
                    onOpenDoctorAuthModal();
                  }}
                  className="btn-primary"
                  style={{ fontSize: '13.5px', padding: '9px 20px' }}
                >
                  <span>Launch Live Doctor Studio</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
