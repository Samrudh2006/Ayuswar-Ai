import React, { useState, useRef } from 'react';
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
  ArrowUpRight
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
  onOpenDoctorAuthModal,
  onOpenPatientAuthModal
}) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [selectedFeatureModalKey, setSelectedFeatureModalKey] = useState(null);
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);
  
  // Before vs After Toggle
  const [comparisonMode, setComparisonMode] = useState('after'); // 'before' | 'after'

  // Interactive 4-Step Pipeline Step
  const [activePipelineStep, setActivePipelineStep] = useState(0);

  // Pan-India Language Carousel & Audio State
  const [selectedLanguageRegion, setSelectedLanguageRegion] = useState('all');
  const [playingLangSample, setPlayingLangSample] = useState(null);
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
      q: 'How does AyuSwar AI handle chaotic, noisy Indian rural OPD environments?',
      a: 'AyuSwar AI integrates client-side WebAudio Voice Activity Detection (VAD) with adaptive spectral noise suppression, feeding clean 16 kHz PCM audio chunks into Gnani.ai Prisma v2.5. This isolates doctor-patient speech from ceiling fans, crowd murmur, and ambient hospital traffic.'
    },
    {
      q: 'How does the model understand rural colloquial dialects rather than standard book words?',
      a: 'We built a specialized Vernacular Clinical Semantic Resolver that maps regional metaphors (e.g. Telugu "గుండెల్లో దడ" or Hindi "पसली चलना") directly into standardized WHO ICD-10 and SNOMED-CT ontologies, ensuring medical accuracy while preserving patient natural expression.'
    },
    {
      q: 'How does the Spoken Audio-Prescription solve medication non-compliance?',
      a: 'Over 600M Indian citizens struggle with medical reading literacy. Powered by Gnani.ai Timbre v2.5, AyuSwar converts complex dosages into simple, color-coded spoken instructions (e.g., "Take this blue pill after dinner") with synchronized glowing karaoke pill visuals on their phone.'
    },
    {
      q: 'Is AyuSwar AI compliant with the National Health Authority ABDM guidelines?',
      a: 'Yes. Every clinical encounter automatically synthesizes an official ABDM FHIR R4 JSON document bundle including Patient, Condition, Observation, and MedicationRequest resources, ready for Ayushman Bharat Digital Mission registry linking.'
    }
  ];

  return (
    <div style={{ position: 'relative', overflow: 'hidden', background: '#F8FAFC' }}>
      {/* =========================================================================
          HERO SECTION (WITH AUTHENTIC AYUSHMAN CLINIC BACKGROUND IMAGE)
          ========================================================================= */}
      {/* Prominently Visible Ayushman Bharat Health Clinic Background */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '56%',
        height: '100%',
        minHeight: '680px',
        backgroundImage: 'url(/assets/ayuswar_hero_bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center right',
        opacity: 0.65,
        maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 12%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,1) 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.2) 12%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,1) 100%)',
        pointerEvents: 'none',
        zIndex: 0
      }}></div>

      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '52px 24px 70px 24px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '40px',
          alignItems: 'center'
        }}>
          {/* Left Column: Typography, Feature Pills, & CTAs */}
          <div>
            {/* Pill Badge: VOICE AI FOR BHARAT */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '30px',
              background: 'rgba(0, 139, 139, 0.08)',
              border: '1.5px solid rgba(0, 139, 139, 0.25)',
              color: '#008B8B',
              fontSize: '12px',
              fontWeight: 800,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '20px'
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
              fontSize: '66px',
              lineHeight: 1.08,
              fontWeight: 850,
              color: '#0A2540',
              letterSpacing: '-1.5px',
              marginBottom: '20px'
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

            {/* Subtitle */}
            <p style={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontSize: '18px',
              lineHeight: 1.6,
              color: '#475569',
              maxWidth: '560px',
              marginBottom: '36px',
              fontWeight: 450
            }}>
              <strong style={{ color: '#0A2540' }}>AyuSwar AI</strong> is the Ambient Clinical Voice OS that listens, understands and speaks – in every Indian language. Built for every doctor, in every corner of Bharat.
            </p>

            {/* 5 Feature Icons Row (Each opens separate comprehensive feature matter modal) */}
            <div style={{
              display: 'flex',
              alignItems: 'stretch',
              gap: '12px',
              marginBottom: '36px',
              flexWrap: 'wrap'
            }}>
              {features.map((item) => {
                const IconComponent = item.icon;
                const isSelected = activeFeature === item.id;
                const featureKeyMap = [
                  'ambient_listening',
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
                      background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setSelectedFeatureModalKey('clinical_studio_overview')}
                className="btn-primary"
                style={{ fontSize: '16px', padding: '14px 30px' }}
                title="View Live Clinical Studio Architecture"
              >
                <span>Explore Live Studio</span>
                <ArrowRight size={18} />
              </button>

              <button 
                onClick={onOpenTechModal}
                className="btn-outline"
                style={{ fontSize: '15px', padding: '13px 26px' }}
                title="View Technical Architecture & HLD Diagram"
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(10, 37, 64, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Play size={12} fill="#0A2540" />
                </div>
                <span>Architecture & HLD</span>
              </button>
            </div>
          </div>

          {/* Right Column: Doctor Portrait with Radiating Soundwave Rings & Clinic Backdrop */}
          <div style={{
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px 0'
          }}>
            <div style={{
              position: 'relative',
              width: '460px',
              height: '460px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Soft ambient clinic glow backdrop */}
              <div style={{
                position: 'absolute',
                width: '420px',
                height: '420px',
                borderRadius: '50%',
                backgroundImage: 'url(/assets/ayuswar_hero_bg.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(30px)',
                opacity: 0.28,
                zIndex: 0
              }}></div>

              {/* Outer Cyan Sound Ring */}
              <div style={{
                position: 'absolute',
                width: '440px',
                height: '440px',
                borderRadius: '50%',
                border: '1.5px solid rgba(0, 139, 139, 0.35)',
                boxShadow: '0 0 30px rgba(0, 139, 139, 0.1)',
                animation: 'pulseGlow 4s ease-in-out infinite',
                zIndex: 1
              }}></div>

              {/* Middle Amber Sound Ring */}
              <div style={{
                position: 'absolute',
                width: '380px',
                height: '380px',
                borderRadius: '50%',
                border: '1.5px dashed rgba(217, 119, 6, 0.35)',
                animation: 'rotateSlow 40s linear infinite'
              }}></div>

              {/* Decorative Audio Frequency Bars on Left & Right */}
              <div style={{
                position: 'absolute',
                left: '-25px',
                top: '46%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                zIndex: 3
              }}>
                <span style={{ width: '3px', height: '14px', background: '#008B8B', borderRadius: '3px' }}></span>
                <span style={{ width: '3px', height: '28px', background: '#008B8B', borderRadius: '3px' }}></span>
                <span style={{ width: '3px', height: '48px', background: '#008B8B', borderRadius: '3px' }}></span>
                <span style={{ width: '3px', height: '34px', background: '#008B8B', borderRadius: '3px' }}></span>
                <span style={{ width: '3px', height: '18px', background: '#008B8B', borderRadius: '3px' }}></span>
              </div>

              <div style={{
                position: 'absolute',
                right: '-25px',
                top: '46%',
                transform: 'translateY(-50%)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                zIndex: 3
              }}>
                <span style={{ width: '3px', height: '16px', background: '#D97706', borderRadius: '3px' }}></span>
                <span style={{ width: '3px', height: '32px', background: '#D97706', borderRadius: '3px' }}></span>
                <span style={{ width: '3px', height: '46px', background: '#D97706', borderRadius: '3px' }}></span>
                <span style={{ width: '3px', height: '24px', background: '#D97706', borderRadius: '3px' }}></span>
                <span style={{ width: '3px', height: '12px', background: '#D97706', borderRadius: '3px' }}></span>
              </div>

              {/* Doctor Avatar Portrait Frame */}
              <div style={{
                width: '320px',
                height: '320px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '4px solid #ffffff',
                boxShadow: '0 20px 50px rgba(10, 37, 64, 0.18)',
                position: 'relative',
                zIndex: 2,
                background: 'linear-gradient(135deg, #e6f7f8 0%, #ffffff 100%)'
              }}>
                <img 
                  src="/assets/dr_ananya_avatar.jpg" 
                  alt="Dr. Ananya — AyuSwar Virtual Attending Physician"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center top'
                  }}
                  onError={(e) => {
                    e.target.src = '/assets/ayuswar_hero_banner.jpg';
                  }}
                />
              </div>

              {/* Floating ABDM Compliant Badge */}
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '-10px',
                zIndex: 10,
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(12px)',
                border: '1.5px solid rgba(0, 139, 139, 0.3)',
                boxShadow: '0 12px 30px rgba(10, 37, 64, 0.12)',
                borderRadius: '16px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                animation: 'floatSlow 4s ease-in-out infinite'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'rgba(0, 139, 139, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#008B8B'
                }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: 750,
                    color: '#0A2540',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    ABDM Compliant
                    <span style={{
                      fontSize: '9px',
                      background: '#10B981',
                      color: '#ffffff',
                      padding: '1px 5px',
                      borderRadius: '8px',
                      fontWeight: 700
                    }}>FHIR R4</span>
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#64748B', fontWeight: 500 }}>
                    Secured. Private. Trusted. Built for Bharat.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>



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
      <section id="impact-section" style={{ maxWidth: '1380px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            THE NATIONAL HEALTHCARE GAP
          </div>
          <h2 style={{ fontSize: '38px', color: '#0A2540', marginBottom: '16px' }}>
            Why Indian Healthcare Cannot Rely on Typing or English
          </h2>
          <p style={{ fontSize: '16px', color: '#5A7184', lineHeight: 1.6 }}>
            In primary health centers across rural India, doctors are overwhelmed by patient volume while citizens are locked out of their own medical records by language and literacy barriers.
          </p>

          {/* Before vs After Interactive Toggle */}
          <div style={{ display: 'inline-flex', padding: '4px', background: '#E2E8F0', borderRadius: '30px', marginTop: '20px' }}>
            <button
              onClick={() => setComparisonMode('before')}
              style={{
                padding: '8px 22px',
                borderRadius: '24px',
                border: 'none',
                background: comparisonMode === 'before' ? '#EF4444' : 'transparent',
                color: comparisonMode === 'before' ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: 750,
                cursor: 'pointer',
                transition: 'all 160ms ease'
              }}
            >
              Without AyuSwar (Status Quo)
            </button>
            <button
              onClick={() => setComparisonMode('after')}
              style={{
                padding: '8px 22px',
                borderRadius: '24px',
                border: 'none',
                background: comparisonMode === 'after' ? '#008B8B' : 'transparent',
                color: comparisonMode === 'after' ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: 750,
                cursor: 'pointer',
                transition: 'all 160ms ease'
              }}
            >
              With AyuSwar AI (Ambient Closed-Loop)
            </button>
          </div>
        </div>

        {/* Dynamic Comparison Cards */}
        {comparisonMode === 'before' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="bento-card" style={{ borderLeft: '4px solid #EF4444', background: '#FFF5F5' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Status Quo: Clinical Burnout</div>
              <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>1.5 Minutes per Patient</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                Doctors rush through 80+ daily OPD encounters, scribbling illegible abbreviations on paper with zero time for preventive counseling.
              </p>
            </div>
            <div className="bento-card" style={{ borderLeft: '4px solid #EF4444', background: '#FFF5F5' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Status Quo: Zero Digital Health</div>
              <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>Lost Longitudinal History</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                Paper prescription slips are regularly lost or ruined by water. Subsequent doctors have zero access to prior diagnoses or allergies.
              </p>
            </div>
            <div className="bento-card" style={{ borderLeft: '4px solid #EF4444', background: '#FFF5F5' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase', marginBottom: '6px' }}>Status Quo: Fatal Medication Errors</div>
              <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>45% Non-Adherence</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                Illiterate patients confuse morning and evening pills, taking insulin or hypertensive pills incorrectly, resulting in preventable ER admissions.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="bento-card" style={{ borderLeft: '4px solid #008B8B', background: '#F0FDFA' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#008B8B', textTransform: 'uppercase', marginBottom: '6px' }}>With AyuSwar: Zero-Touch Scribing</div>
              <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>Zero Keyboard Required</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                Doctor looks at the patient, talks naturally in mixed Telugu/Hindi/English. AyuSwar transcribes and structures the ABDM EHR passively.
              </p>
            </div>
            <div className="bento-card" style={{ borderLeft: '4px solid #008B8B', background: '#F0FDFA' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#008B8B', textTransform: 'uppercase', marginBottom: '6px' }}>With AyuSwar: Official ABDM FHIR R4</div>
              <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>Instant ABHA Digital Sync</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                Standardized structured JSON bundle automatically linked to the patient's Ayushman Bharat Health Account with QR verification.
              </p>
            </div>
            <div className="bento-card" style={{ borderLeft: '4px solid #008B8B', background: '#F0FDFA' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#008B8B', textTransform: 'uppercase', marginBottom: '6px' }}>With AyuSwar: Spoken Audio-Rx</div>
              <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>Native Spoken Pills Guide</h3>
              <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                Illiterate patients listen to Dr. Ananya's voice in Telugu/Hindi on WhatsApp with glowing karaoke pill schedules!
              </p>
            </div>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 3: HOW AYUSWAR WORKS — INTERACTIVE STEPPED PIPELINE
          ========================================================================= */}
      <section style={{ background: '#F1F5F9', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              CLOSED-LOOP VERNACULAR PIPELINE
            </div>
            <h2 style={{ fontSize: '38px', color: '#0A2540', marginBottom: '16px' }}>
              From Ambient Doctor-Patient Spoken Words to Color-Coded Audio-Rx
            </h2>
            <p style={{ fontSize: '16px', color: '#5A7184', lineHeight: 1.6 }}>
              A zero-touch voice engine powered by Gnani.ai Prisma & Timbre, operating synchronously in the background without altering clinical workflow.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
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
            ].map((st, i) => (
              <div 
                key={i} 
                onClick={() => setActivePipelineStep(i)}
                className="glass-panel" 
                style={{ 
                  padding: '28px 22px', 
                  position: 'relative',
                  cursor: 'pointer',
                  border: activePipelineStep === i ? '2px solid #008B8B' : '1px solid rgba(255,255,255,0.8)',
                  boxShadow: activePipelineStep === i ? '0 12px 30px rgba(0, 139, 139, 0.15)' : 'none',
                  transition: 'all 200ms ease'
                }}
              >
                <div style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  fontFamily: 'Outfit, sans-serif',
                  color: activePipelineStep === i ? '#008B8B' : 'rgba(0, 139, 139, 0.25)',
                  marginBottom: '12px'
                }}>
                  {st.step}
                </div>
                <h3 style={{ fontSize: '17px', color: '#0A2540', marginBottom: '10px' }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: 6 DEEP-TECH MOATS (CLICKABLE FOR DETAILED TECHNICAL MATTER)
          ========================================================================= */}
      <section style={{ maxWidth: '1380px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 850, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            ENGINEERING EXCELLENCE
          </div>
          <h2 style={{ fontSize: '38px', color: '#0A2540', marginBottom: '16px' }}>
            6 Deep-Tech Moats That Define AyuSwar AI
          </h2>
          <p style={{ fontSize: '16px', color: '#5A7184' }}>
            Click on any moat to inspect the dedicated mathematical architecture, algorithms, and Indic clinical benchmarks.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {/* Moat 1: Acoustic Respiratory Stethoscope */}
          <div className="bento-card" onClick={() => setSelectedFeatureModalKey('acoustic_biomarkers')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0, 139, 139, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008B8B' }}>
                <Activity size={22} />
              </div>
              <ArrowUpRight size={18} color="#008B8B" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Acoustic Respiratory Stethoscope
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55, marginBottom: '12px' }}>
              Implements spectral centroid, rolloff, and jitter metrics derived from IISc Bangalore’s Coswara research to classify dry vs wet cough and pediatric stridor directly from ambient microphone input.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#008B8B' }}>View Acoustic Architecture & Specs →</div>
          </div>

          {/* Moat 2: Vernacular Ontology Resolver */}
          <div className="bento-card" onClick={() => setSelectedFeatureModalKey('multilingual_transcription')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                <Languages size={22} />
              </div>
              <ArrowUpRight size={18} color="#D97706" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Vernacular Semantic Resolver
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55, marginBottom: '12px' }}>
              Translates regional colloquial metaphors (e.g., Telugu "గుండెల్లో దడ" or Hindi "पसली चलना") into formal WHO ICD-10 (R00.2) and SNOMED-CT clinical tokens in real-time.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#D97706' }}>View Indic NLP Architecture & Specs →</div>
          </div>

          {/* Moat 3: Karaoke Spoken Audio-Rx */}
          <div className="bento-card" onClick={() => setSelectedFeatureModalKey('spoken_audio_rx')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                <Volume2 size={22} />
              </div>
              <ArrowUpRight size={18} color="#10B981" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Synchronized Karaoke Audio-Rx
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55, marginBottom: '12px' }}>
              Pairs Gnani.ai Timbre v2.5 voice synthesis with active, word-by-word visual glowing highlights across color-coded morning, afternoon, and night pill schedule cards.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#10B981' }}>View Timbre Voice Architecture & Specs →</div>
          </div>

          {/* Moat 4: OpenCV Blister Strip Scanner */}
          <div className="bento-card" onClick={() => setSelectedFeatureModalKey('prescription_scanner')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
                <Scan size={22} />
              </div>
              <ArrowUpRight size={18} color="#6366F1" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              OpenCV Blister Strip Scanner
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55, marginBottom: '12px' }}>
              Computer vision pipeline detects physical medicine packaging contours, runs text bounding-box extraction, and verifies against India’s National Formulary to prevent double-dosing.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#6366F1' }}>View Computer Vision Architecture & Specs →</div>
          </div>

          {/* Moat 5: Drug-Drug Interaction Sentinel */}
          <div className="bento-card" onClick={() => setSelectedFeatureModalKey('cdss_safety')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                <ShieldCheck size={22} />
              </div>
              <ArrowUpRight size={18} color="#EF4444" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Clinical Decision Support (CDSS)
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55, marginBottom: '12px' }}>
              Autonomous safety agent flags CYP450 contraindications, age-adjusted pediatric dosages, and patient comorbidities (e.g., Peptic Ulcers + NSAIDs) with immediate audible warnings.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#EF4444' }}>View Pharmacopeia Architecture & Specs →</div>
          </div>

          {/* Moat 6: ABDM FHIR R4 Bundle Generator */}
          <div className="bento-card" onClick={() => setSelectedFeatureModalKey('abdm_fhir')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}>
                <FileCheck size={22} />
              </div>
              <ArrowUpRight size={18} color="#0EA5E9" />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Official ABDM FHIR R4 Standard
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55, marginBottom: '12px' }}>
              1-click export of verified Ayushman Bharat Digital Mission JSON bundles and QR-code enabled print summaries that link patient ABHA health accounts.
            </p>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#0EA5E9' }}>View FHIR Schema Architecture & Specs →</div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: PAN-INDIA LINGUISTIC COVERAGE CAROUSEL WITH LIVE TIMBRE AUDIO!
          ========================================================================= */}
      <section style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          {/* Header & Carousel Arrow Controls */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
                PAN-INDIA LINGUISTIC COVERAGE
              </div>
              <h2 style={{ fontSize: '38px', color: '#0A2540', marginBottom: '8px' }}>
                Listening & Speaking in 50+ Dialects Across Bharat
              </h2>
              <p style={{ fontSize: '15px', color: '#5A7184' }}>
                Click any card to hear live voice synthesis generated by Gnani.ai Timbre v2.5.
              </p>
            </div>

            {/* Region Filter Buttons & Scroll Arrows */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '6px', background: '#E2E8F0', padding: '3px', borderRadius: '24px' }}>
                {['all', 'South', 'North', 'West', 'East'].map((region) => (
                  <button
                    key={region}
                    onClick={() => setSelectedLanguageRegion(region)}
                    style={{
                      padding: '5px 14px',
                      borderRadius: '20px',
                      border: 'none',
                      background: selectedLanguageRegion.toLowerCase() === region.toLowerCase() ? '#008B8B' : 'transparent',
                      color: selectedLanguageRegion.toLowerCase() === region.toLowerCase() ? '#ffffff' : '#475569',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {region === 'all' ? 'All India' : region}
                  </button>
                ))}
              </div>

              {/* Side Scroll Arrows (< and >) */}
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => scrollCarousel('left')}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#ffffff',
                    border: '1.5px solid #CBD5E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#0A2540'
                  }}
                  title="Scroll Left"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: '#0A2540',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: '#ffffff'
                  }}
                  title="Scroll Right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Horizontal Scrollable Carousel Container */}
          <div 
            ref={carouselScrollRef}
            style={{
              display: 'flex',
              gap: '18px',
              overflowX: 'auto',
              paddingBottom: '16px',
              scrollSnapType: 'x mandatory'
            }}
          >
            {filteredLanguages.map((lang) => {
              const isPlaying = playingLangSample === lang.id;
              return (
                <div
                  key={lang.id}
                  style={{
                    minWidth: '310px',
                    maxWidth: '310px',
                    background: isPlaying ? 'linear-gradient(135deg, rgba(0, 139, 139, 0.08) 0%, rgba(217, 119, 6, 0.05) 100%)' : '#ffffff',
                    border: isPlaying ? '2px solid #008B8B' : '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '22px',
                    boxShadow: isPlaying ? '0 12px 30px rgba(0, 139, 139, 0.15)' : '0 4px 14px rgba(10, 37, 64, 0.03)',
                    scrollSnapAlign: 'start',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    transition: 'all 200ms ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540' }}>{lang.name}</div>
                      <div style={{ fontSize: '17px', fontWeight: 800, color: '#008B8B' }}>{lang.native}</div>
                    </div>

                    <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '14px' }}>
                      {lang.state}
                    </div>

                    <div style={{
                      background: '#F1F5F9',
                      padding: '12px',
                      borderRadius: '10px',
                      fontSize: '13px',
                      color: '#1E293B',
                      fontStyle: 'italic',
                      lineHeight: 1.5,
                      marginBottom: '16px'
                    }}>
                      "{lang.sample}"
                    </div>
                  </div>

                  {/* Play Voice Sample Button with Live Equalizer */}
                  <button
                    onClick={() => handlePlayLanguageSample(lang)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '24px',
                      border: isPlaying ? '1.5px solid #008B8B' : '1px solid #CBD5E1',
                      background: isPlaying ? '#008B8B' : '#ffffff',
                      color: isPlaying ? '#ffffff' : '#0A2540',
                      fontSize: '12.5px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      transition: 'all 160ms ease'
                    }}
                  >
                    {isPlaying ? <Pause size={14} /> : <Play size={14} fill={isPlaying ? "#ffffff" : "#0A2540"} />}
                    <span>{isPlaying ? 'Playing Timbre Voice...' : 'Play Vernacular Voice Sample'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION
          ========================================================================= */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: '46px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
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
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  transition: 'all 200ms ease'
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
                    fontWeight: 700,
                    color: '#0A2540'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#ffffff', overflow: 'hidden' }}>
                <img src="/assets/ayuswar_logo.jpg" alt="AyuSwar AI" style={{ width: '100%', height: '100%' }} />
              </div>
              <span style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Outfit, sans-serif' }}>
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
    </div>
  );
}
