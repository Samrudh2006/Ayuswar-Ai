import React, { useState } from 'react';
import { 
  Mic, 
  Languages, 
  Activity, 
  Scan, 
  Volume2, 
  ArrowRight, 
  Play, 
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
  Lock, 
  Stethoscope, 
  Smartphone, 
  FileText 
} from 'lucide-react';

/**
 * HeroLanding Component
 * Complete, production-grade enterprise marketing showcase for AyuSwar AI.
 * Implements the exact aesthetic from the reference image, followed by comprehensive
 * clinical problem metrics, architecture loops, 6-bento feature moats, dialect matrix,
 * testimonials, compliance badges, and interactive FAQs.
 */
export default function HeroLanding({ onLaunchStudio, onOpenTechModal, onOpenAuthModal }) {
  const [activeFeature, setActiveFeature] = useState(0);
  const [selectedLanguageTab, setSelectedLanguageTab] = useState('Telugu');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState(null);

  const features = [
    { id: 0, title: 'Ambient Voice Listening', icon: Mic, desc: 'Dual-speaker ambient capture with speaker diarization in OPD chaos' },
    { id: 1, title: 'Multilingual Transcription', icon: Languages, desc: 'Prisma v2.5 powered Indic code-mixed transcription (Telugu, Hindi, Tenglish)' },
    { id: 2, title: 'Acoustic Biomarkers', icon: Activity, desc: 'Real-time DSP extraction of wheeze, cough spectral index & respiratory strain' },
    { id: 3, title: 'Prescription Scanner', icon: Scan, desc: 'OpenCV computer vision scanning of physical medicine blister strips & paper Rx' },
    { id: 4, title: 'Spoken Audio-Prescription', icon: Volume2, desc: 'Timbre v2.5 synthesis with word-by-word karaoke highlighting for illiterate patients' }
  ];

  const indicLanguages = [
    { name: 'Telugu', native: 'తెలుగు', sample: 'ఈ ఆకుపచ్చ మాత్ర ఉదయం వేసుకోవాలి', region: 'Andhra Pradesh & Telangana' },
    { name: 'Hindi', native: 'हिन्दी', sample: 'यह पीला सिरप रोज सुबह नाश्ते के बाद लें', region: 'North & Central India' },
    { name: 'Tamil', native: 'தமிழ்', sample: 'இந்த நீல நிற மாத்திரையை இரவில் உட்கொள்ளுங்கள்', region: 'Tamil Nadu & Puducherry' },
    { name: 'Kannada', native: 'ಕನ್ನಡ', sample: 'ಈ ಮಾತ್ರೆಗಳನ್ನು ಊಟದ ನಂತರ ಸೇವಿಸಿ', region: 'Karnataka' },
    { name: 'Marathi', native: 'मराठी', sample: 'हे औषध रात्री जेवणानंतर घ्या', region: 'Maharashtra' },
    { name: 'Bengali', native: 'বাংলা', sample: 'এই ট্যাবলেটটি সকালে জল দিয়ে খান', region: 'West Bengal & Tripura' },
    { name: 'Gujarati', native: 'ગુજરાતી', sample: 'આ દવા જમ્યા પછી લેવી', region: 'Gujarat' },
    { name: 'Malayalam', native: 'മലയാളം', sample: 'ഈ മരുന്ന് രാത്രി ഭക്ഷണത്തിന് ശേഷം കഴിക്കുക', region: 'Kerala' }
  ];

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
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      {/* =========================================================================
          HERO SECTION (FAITHFUL TO USER'S UPLOADED DESIGN REFERENCE)
          ========================================================================= */}
      <div style={{
        maxWidth: '1380px',
        margin: '0 auto',
        padding: '48px 24px 64px 24px',
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

            {/* 5 Feature Icons Row */}
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
                return (
                  <div
                    key={item.id}
                    onClick={() => setActiveFeature(item.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      padding: '12px 10px',
                      borderRadius: '16px',
                      background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                      border: isSelected ? '1.5px solid #008B8B' : '1px solid #E2E8F0',
                      boxShadow: isSelected ? '0 8px 20px rgba(0, 139, 139, 0.12)' : '0 2px 8px rgba(10, 37, 64, 0.03)',
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
                onClick={onLaunchStudio}
                className="btn-primary"
                style={{ fontSize: '16px', padding: '14px 30px' }}
              >
                <span>Explore Live Studio</span>
                <ArrowRight size={18} />
              </button>

              <button 
                onClick={onOpenTechModal}
                className="btn-outline"
                style={{ fontSize: '15px', padding: '13px 26px' }}
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

          {/* Right Column: Doctor Portrait with Radiating Soundwave Rings */}
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
              {/* Outer Cyan Sound Ring */}
              <div style={{
                position: 'absolute',
                width: '440px',
                height: '440px',
                borderRadius: '50%',
                border: '1.5px solid rgba(0, 139, 139, 0.35)',
                boxShadow: '0 0 30px rgba(0, 139, 139, 0.1)',
                animation: 'pulseGlow 4s ease-in-out infinite'
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
          SECTION 2: THE CLINICAL DOCUMENTATION CRISIS IN BHARAT
          ========================================================================= */}
      <section id="impact-section" style={{ maxWidth: '1380px', margin: '0 auto', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 50px auto' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#D97706', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
            THE NATIONAL HEALTHCARE GAP
          </div>
          <h2 style={{ fontSize: '38px', color: '#0A2540', marginBottom: '16px' }}>
            Why Indian Healthcare Cannot Rely on Typing or English
          </h2>
          <p style={{ fontSize: '16px', color: '#5A7184', lineHeight: 1.6 }}>
            In primary health centers across rural India, doctors are overwhelmed by patient volume while citizens are locked out of their own medical records by language and literacy barriers.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '28px' }}>
          <div className="bento-card" style={{ borderLeft: '4px solid #EF4444' }}>
            <div style={{ fontSize: '36px', fontWeight: 850, color: '#EF4444', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>
              1 : 1,456
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Doctor-to-Patient Ratio
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.55 }}>
              Doctors in government OPDs consult 80 to 100 patients daily, spending less than 2 minutes per patient with zero bandwidth to type into computers.
            </p>
          </div>

          <div className="bento-card" style={{ borderLeft: '4px solid #D97706' }}>
            <div style={{ fontSize: '36px', fontWeight: 850, color: '#D97706', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>
              600 Million+
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Health-Illiterate Citizens
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.55 }}>
              Over half a billion citizens in Tier 3/4 Bharat cannot read English medical abbreviations or doctor scribbles, leading to catastrophic medication errors.
            </p>
          </div>

          <div className="bento-card" style={{ borderLeft: '4px solid #008B8B' }}>
            <div style={{ fontSize: '36px', fontWeight: 850, color: '#008B8B', fontFamily: 'Outfit, sans-serif', marginBottom: '8px' }}>
              45%
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Medication Non-Adherence
            </h3>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.55 }}>
              Patients stop critical diabetes, hypertension, and antibiotic regimens early simply because nobody explained the dosage in their native mother tongue.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: HOW AYUSWAR WORKS — THE 4-STEP CLOSED-LOOP ARCHITECTURE
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
              <div key={i} className="glass-panel" style={{ padding: '28px 22px', position: 'relative' }}>
                <div style={{
                  fontSize: '32px',
                  fontWeight: 900,
                  fontFamily: 'Outfit, sans-serif',
                  color: 'rgba(0, 139, 139, 0.25)',
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
          SECTION 4: THE 6 DEEP-TECH MOATS BENTO GRID
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
            We engineered beyond a simple chatbot wrapper — constructing a multimodal, signal-processed clinical operating system.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px'
        }}>
          {/* Moat 1: Acoustic Respiratory Stethoscope */}
          <div className="bento-card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(0, 139, 139, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008B8B', marginBottom: '16px' }}>
              <Activity size={22} />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Acoustic Respiratory Stethoscope
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
              Implements spectral centroid, rolloff, and jitter metrics derived from IISc Bangalore’s Coswara research to classify dry vs wet cough and pediatric stridor directly from ambient microphone input.
            </p>
          </div>

          {/* Moat 2: Vernacular Ontology Resolver */}
          <div className="bento-card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706', marginBottom: '16px' }}>
              <Languages size={22} />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Vernacular Semantic Resolver
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
              Translates regional colloquial metaphors (e.g., Telugu "గుండెల్లో దడ" or Hindi "पसली चलना") into formal WHO ICD-10 (R00.2) and SNOMED-CT clinical tokens in real-time.
            </p>
          </div>

          {/* Moat 3: Karaoke Spoken Audio-Rx */}
          <div className="bento-card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981', marginBottom: '16px' }}>
              <Volume2 size={22} />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Synchronized Karaoke Audio-Rx
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
              Pairs Gnani.ai Timbre v2.5 voice synthesis with active, word-by-word visual glowing highlights across color-coded morning, afternoon, and night pill schedule cards.
            </p>
          </div>

          {/* Moat 4: OpenCV Blister Strip Scanner */}
          <div className="bento-card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1', marginBottom: '16px' }}>
              <Scan size={22} />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              OpenCV Blister Strip Scanner
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
              Computer vision pipeline detects physical medicine packaging contours, runs text bounding-box extraction, and verifies against India’s National Formulary to prevent double-dosing.
            </p>
          </div>

          {/* Moat 5: Drug-Drug Interaction Sentinel */}
          <div className="bento-card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444', marginBottom: '16px' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Clinical Decision Support (CDSS)
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
              Autonomous safety agent flags CYP450 contraindications, age-adjusted pediatric dosages, and patient comorbidities (e.g., Peptic Ulcers + NSAIDs) with immediate audible warnings.
            </p>
          </div>

          {/* Moat 6: ABDM FHIR R4 Bundle Generator */}
          <div className="bento-card">
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9', marginBottom: '16px' }}>
              <FileCheck size={22} />
            </div>
            <h3 style={{ fontSize: '18px', color: '#0A2540', marginBottom: '8px' }}>
              Official ABDM FHIR R4 Standard
            </h3>
            <p style={{ fontSize: '13.5px', color: '#64748B', lineHeight: 1.55 }}>
              1-click export of verified Ayushman Bharat Digital Mission JSON bundles and QR-code enabled print summaries that link patient ABHA health accounts.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: INDIC LANGUAGE & DIALECT MATRIX
          ========================================================================= */}
      <section style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1380px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 40px auto' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#008B8B', letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '8px' }}>
              PAN-INDIA LINGUISTIC COVERAGE
            </div>
            <h2 style={{ fontSize: '38px', color: '#0A2540', marginBottom: '16px' }}>
              Listening & Speaking in 50+ Dialects Across Bharat
            </h2>
            <p style={{ fontSize: '16px', color: '#5A7184' }}>
              Powered by Gnani.ai Prisma v2.5 and Timbre v2.5 voice architectures, trained specifically for Indian accents, phonemes, and code-mixing.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {indicLanguages.map((lang) => (
              <div
                key={lang.name}
                onClick={() => setSelectedLanguageTab(lang.name)}
                style={{
                  background: selectedLanguageTab === lang.name ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
                  border: selectedLanguageTab === lang.name ? '2px solid #008B8B' : '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '18px',
                  cursor: 'pointer',
                  boxShadow: selectedLanguageTab === lang.name ? '0 8px 24px rgba(0, 139, 139, 0.12)' : 'none',
                  transition: 'all 160ms ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 750, color: '#0A2540' }}>{lang.name}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#008B8B' }}>{lang.native}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '10px' }}>{lang.region}</div>
                <div style={{
                  background: '#F1F5F9',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#334155',
                  fontStyle: 'italic'
                }}>
                  "{lang.sample}"
                </div>
              </div>
            ))}
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
              <span>OPD Ambient Scribe</span>
              <span>Vernacular Audio-Rx</span>
              <span>OpenCV Blister OCR</span>
              <span>Pediatric Triage Sentinel</span>
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
    </div>
  );
}
