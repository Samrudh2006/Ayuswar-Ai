import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, Globe, CheckCircle2, AlertCircle, ArrowLeft, Volume2, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';
import IndicLanguageMatrixBanner from '../components/IndicLanguageMatrixBanner';

export default function IndicLanguageMatrixView() {
  const { selectedLanguage, setSelectedLanguage, speechProviderStatus } = useApp();

  const SUPPORTED_DIALECT_DOMAINS = [
    {
      lang: 'Telugu (తెలుగు)',
      code: 'te-IN',
      asrEngine: 'Browser SpeechRecognition ( te-IN )',
      ttsEngine: 'Browser SpeechSynthesis ( te-IN )',
      status: 'Functional in Chrome/Edge',
      dialectRegions: [
        { region: 'Rayalaseema', sampleMetaphor: 'ఆయాసం, పీకల్లో పిల్లికూతలు (Wheezing)' },
        { region: 'Coastal Andhra', sampleMetaphor: 'గుండెల్లో మంట, పుల్లటి తేన్పులు (Acid Reflux)' },
        { region: 'Telangana', sampleMetaphor: 'కడుపుల నొప్పి, దడ పుడుతుంది (Palpitations)' }
      ],
      methodology: 'Lexical alignment with open colloquial terminology dictionaries and phoneme mapping.'
    },
    {
      lang: 'Indian English',
      code: 'en-IN',
      asrEngine: 'Browser SpeechRecognition ( en-IN )',
      ttsEngine: 'Browser SpeechSynthesis ( en-IN )',
      status: 'Functional in all supported browsers',
      dialectRegions: [
        { region: 'Standard Indian Clinical English', sampleMetaphor: 'Shortness of breath, nocturnal wheeze' }
      ],
      methodology: 'Direct W3C Web Speech API integration.'
    },
    {
      lang: 'Hindi (हिन्दी)',
      code: 'hi-IN',
      asrEngine: 'Browser SpeechRecognition ( hi-IN )',
      ttsEngine: 'Browser SpeechSynthesis ( hi-IN )',
      status: 'Functional in Chrome/Edge',
      dialectRegions: [
        { region: 'North Central', sampleMetaphor: 'सांस फूलना, पसली चलना (Pediatric Retraction)' },
        { region: 'Rural Hindi Dialect', sampleMetaphor: 'हड्डी तोड़ बदन दर्द (Severe Dengue-like Myalgia)' }
      ],
      methodology: 'Phonetic match against colloquial symptom references.'
    },
    {
      lang: 'Tamil (தமிழ்)',
      code: 'ta-IN',
      asrEngine: 'Browser SpeechRecognition ( ta-IN )',
      ttsEngine: 'Browser SpeechSynthesis ( ta-IN )',
      status: 'Functional in Chrome/Edge',
      dialectRegions: [
        { region: 'Tamil Nadu Regional', sampleMetaphor: 'மூச்சுத் திணறல் (Breathlessness)' }
      ],
      methodology: 'Unicode Indic script tokenization.'
    },
    {
      lang: 'Kannada (ಕನ್ನಡ)',
      code: 'kn-IN',
      asrEngine: 'Browser SpeechRecognition ( kn-IN )',
      ttsEngine: 'Browser SpeechSynthesis ( kn-IN )',
      status: 'Functional in Chrome/Edge',
      dialectRegions: [
        { region: 'Karnataka Regional', sampleMetaphor: 'ಉಸಿರಾಟದ ತೊಂದರೆ (Breathing Strain)' }
      ],
      methodology: 'Lexical Dravidian linguistic vocabulary mapping.'
    },
    {
      lang: 'Marathi (मराठी)',
      code: 'mr-IN',
      asrEngine: 'Browser SpeechRecognition ( mr-IN )',
      ttsEngine: 'Browser SpeechSynthesis ( mr-IN )',
      status: 'Functional in Chrome/Edge',
      dialectRegions: [
        { region: 'Maharashtra Regional', sampleMetaphor: 'श्वास घेण्यास त्रास (Dyspnea)' }
      ],
      methodology: 'Devanagari script tokenization & TTS voice inflection.'
    }
  ];

  return (
    <div className="indic-matrix-container" style={{ padding: '36px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F4C5C', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#D1E1E6' }}>/</span>
        <span style={{ color: '#3D545E', fontSize: '13px' }}>Resources</span>
        <span style={{ color: '#D1E1E6' }}>/</span>
        <span style={{ color: '#0F4C5C', fontSize: '13px', fontWeight: 700 }}>Indic Language Matrix</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 76, 92, 0.1)', color: '#0F4C5C', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
          <Globe size={14} />
          <span>VERNACULAR LANGUAGE CAPABILITY SPECIFICATION</span>
        </div>
        <h1 className="page-main-heading" style={{ fontSize: '32px', fontWeight: 850, color: '#0F4C5C', marginBottom: '10px' }}>
          Indic Language & Dialect Support Matrix
        </h1>
        <p className="page-main-subtext" style={{ fontSize: '15px', color: '#3D545E', maxWidth: '850px', lineHeight: 1.6 }}>
          Transparent documentation of Indic language speech recognition (ASR), speech synthesis (TTS), and regional colloquial symptom metaphors supported in this demonstration prototype.
        </p>
      </div>

      {/* Honest Provider Status Callout */}
      <div style={{ background: '#EEF6F8', border: '1.5px solid #D8EBEF', borderRadius: '14px', padding: '18px 22px', marginBottom: '32px', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
        <Shield size={22} color="#0F4C5C" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F4C5C', marginBottom: '4px' }}>
            Provider Transparency Notice: Client Web Speech API Active
          </div>
          <p style={{ fontSize: '13px', color: '#3D545E', lineHeight: 1.5, margin: 0 }}>
            In this prototype deployment, speech recognition and synthesis are powered directly by the browser's standard W3C Web Speech API. Word Error Rate (WER) metrics depend on the browser engine (e.g. Google Chrome / Microsoft Edge). Unmeasured or speculative accuracy figures are strictly omitted.
          </p>
        </div>
      </div>

      {/* Variable Font Morph & Regional Dialect Map Banner */}
      <IndicLanguageMatrixBanner />

      {/* Language Matrix Cards */}
      <div className="indic-matrix-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {SUPPORTED_DIALECT_DOMAINS.map((item) => {
          const isSelected = selectedLanguage === item.code;
          return (
            <div 
              key={item.code}
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                border: isSelected ? '2px solid #0F4C5C' : '1px solid #D1E1E6',
                boxShadow: isSelected ? '0 10px 25px rgba(15, 76, 92, 0.12)' : '0 4px 14px rgba(15, 76, 92, 0.04)',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                transition: 'all 200ms ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F4C5C', marginBottom: '2px' }}>
                    {item.lang}
                  </h3>
                  <span style={{ fontSize: '12px', color: '#3D545E', fontFamily: 'monospace' }}>
                    Language Code: {item.code}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedLanguage(item.code)}
                  style={{
                    background: isSelected ? '#0F4C5C' : '#FAF8F5',
                    color: isSelected ? '#FFFFFF' : '#0F4C5C',
                    border: isSelected ? 'none' : '1px solid #D1E1E6',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: isSelected ? '0 2px 8px rgba(15, 76, 92, 0.25)' : 'none'
                  }}
                >
                  {isSelected ? <CheckCircle2 size={13} /> : null}
                  <span>{isSelected ? 'Active Language' : 'Select'}</span>
                </button>
              </div>

              {/* Engine Details */}
              <div style={{ background: '#FAF8F5', borderRadius: '10px', border: '1px solid #E5ECEF', padding: '12px 14px', fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#3D545E' }}>Speech-to-Text (ASR):</span>
                  <span style={{ color: '#091E26', fontWeight: 700 }}>{item.asrEngine}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Text-to-Speech (TTS):</span>
                  <span style={{ color: '#081C24', fontWeight: 700 }}>{item.ttsEngine}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748B' }}>Integration Status:</span>
                  <span style={{ color: '#0D9488', fontWeight: 750 }}>{item.status}</span>
                </div>
              </div>

              {/* Dialect Metaphors */}
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Dialect Samples in Colloquial Dictionary:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {item.dialectRegions.map((region, idx) => (
                    <div key={idx} style={{ background: '#FAF8F5', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}>
                      <span style={{ fontWeight: 750, color: '#081C24' }}>{region.region}: </span>
                      <span style={{ color: '#334155' }}>"{region.sampleMetaphor}"</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: '11.5px', color: '#64748B', borderTop: '1px solid #F1F5F9', paddingTop: '10px', marginTop: 'auto' }}>
                <strong>Methodology:</strong> {item.methodology}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
