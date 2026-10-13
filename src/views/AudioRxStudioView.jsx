import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Volume2, 
  Play, 
  Square, 
  Share2, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  MessageSquare,
  Globe,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { speechService } from '../services/indicSpeechService';

export default function AudioRxStudioView() {
  const { selectedLanguage, setSelectedLanguage, isDemoMode } = useApp();

  const [activeLang, setActiveLang] = useState(selectedLanguage === 'hi-IN' ? 'hi-IN' : selectedLanguage === 'te-IN' ? 'te-IN' : 'en-IN');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [karaokeActiveIndex, setKaraokeActiveIndex] = useState(-1);
  const [activePillHighlight, setActivePillHighlight] = useState(null); // 'morning' | 'night'
  const [recipientPhone, setRecipientPhone] = useState('+91 90000 00001');
  const [whatsAppToast, setWhatsAppToast] = useState(false);

  const karaokeTimerRef = useRef(null);

  // Sync with global language selector
  useEffect(() => {
    setActiveLang(selectedLanguage);
  }, [selectedLanguage]);

  // Audio Prescription Scripts
  const SCRIPTS = {
    'te-IN': {
      title: 'నారాయణ రావు గారి డిజిటల్ ప్రిస్క్రిప్షన్',
      tokens: [
        { text: 'నమస్కారం.', pill: null },
        { text: 'డాక్టర్', pill: null },
        { text: 'ప్రియ', pill: null },
        { text: 'గారు', pill: null },
        { text: 'సూచించిన', pill: null },
        { text: 'ప్యాంటోప్రజోల్', pill: 'morning' },
        { text: '40mg', pill: 'morning' },
        { text: 'పసుపు', pill: 'morning' },
        { text: 'గోళీని', pill: 'morning' },
        { text: 'ఉదయం', pill: 'morning' },
        { text: 'టిఫిన్', pill: 'morning' },
        { text: 'ముందు', pill: 'morning' },
        { text: 'వేసుకోండి.', pill: 'morning' },
        { text: 'అలాగే', pill: null },
        { text: 'మెట్‌ఫార్మిన్', pill: 'night' },
        { text: '500mg', pill: 'night' },
        { text: 'గులాబీ', pill: 'night' },
        { text: 'గోళీని', pill: 'night' },
        { text: 'రాత్రి', pill: 'night' },
        { text: 'భోజనం', pill: 'night' },
        { text: 'తర్వాత', pill: 'night' },
        { text: 'వేసుకోండి.', pill: 'night' }
      ],
      fullText: 'నమస్కారం. డాక్టర్ ప్రియ గారు సూచించిన ప్యాంటోప్రజోల్ 40mg పసుపు గోళీని ఉదయం టిఫిన్ ముందు వేసుకోండి. అలాగే మెట్‌ఫార్మిన్ 500mg గులాబీ గోళీని రాత్రి భోజనం తర్వాత వేసుకోండి.'
    },
    'hi-IN': {
      title: 'नारायण राव जी का डिजिटल पर्चा',
      tokens: [
        { text: 'नमस्ते।', pill: null },
        { text: 'डॉक्टर', pill: null },
        { text: 'प्रिया', pill: null },
        { text: 'द्वारा', pill: null },
        { text: 'निर्धारित', pill: null },
        { text: 'पैंटोप्रजोल', pill: 'morning' },
        { text: '40mg', pill: 'morning' },
        { text: 'पीली', pill: 'morning' },
        { text: 'गोली', pill: 'morning' },
        { text: 'सुबह', pill: 'morning' },
        { text: 'नाश्ते', pill: 'morning' },
        { text: 'से', pill: 'morning' },
        { text: 'पहले', pill: 'morning' },
        { text: 'लें।', pill: 'morning' },
        { text: 'और', pill: null },
        { text: 'मेटफॉर्मिन', pill: 'night' },
        { text: '500mg', pill: 'night' },
        { text: 'गुलाबी', pill: 'night' },
        { text: 'गोली', pill: 'night' },
        { text: 'रात', pill: 'night' },
        { text: 'को', pill: 'night' },
        { text: 'खाने', pill: 'night' },
        { text: 'के', pill: 'night' },
        { text: 'बाद', pill: 'night' },
        { text: 'लें।', pill: 'night' }
      ],
      fullText: 'नमस्ते। डॉक्टर प्रिया द्वारा निर्धारित पैंटोप्रजोल 40mg पीली गोली सुबह नाश्ते से पहले लें। और मेटफॉर्मिन 500mg गुलाबी गोली रात को खाने के बाद लें।'
    },
    'en-IN': {
      title: 'Digital Spoken Prescription for Narayana Rao',
      tokens: [
        { text: 'Hello.', pill: null },
        { text: 'Take', pill: null },
        { text: 'Pantoprazole', pill: 'morning' },
        { text: '40mg', pill: 'morning' },
        { text: 'yellow', pill: 'morning' },
        { text: 'tablet', pill: 'morning' },
        { text: 'in', pill: 'morning' },
        { text: 'the', pill: 'morning' },
        { text: 'morning', pill: 'morning' },
        { text: 'before', pill: 'morning' },
        { text: 'breakfast.', pill: 'morning' },
        { text: 'Take', pill: null },
        { text: 'Metformin', pill: 'night' },
        { text: '500mg', pill: 'night' },
        { text: 'pink', pill: 'night' },
        { text: 'tablet', pill: 'night' },
        { text: 'at', pill: 'night' },
        { text: 'night', pill: 'night' },
        { text: 'after', pill: 'night' },
        { text: 'dinner.', pill: 'night' }
      ],
      fullText: 'Hello. Take Pantoprazole 40mg yellow tablet in the morning before breakfast. Take Metformin 500mg pink tablet at night after dinner.'
    }
  };

  const currentScript = SCRIPTS[activeLang] || SCRIPTS['en-IN'];

  // Handle Playback & Synchronized Karaoke
  const handlePlayAudio = () => {
    if (isPlayingAudio) {
      handleStopAudio();
      return;
    }

    setIsPlayingAudio(true);
    setKaraokeActiveIndex(0);

    const tokens = currentScript.tokens;
    let idx = 0;

    // Start Karaoke Timer
    const wordIntervalMs = Math.round(5500 / tokens.length);
    karaokeTimerRef.current = setInterval(() => {
      idx++;
      if (idx < tokens.length) {
        setKaraokeActiveIndex(idx);
        setActivePillHighlight(tokens[idx].pill);
      } else {
        handleStopAudio();
      }
    }, wordIntervalMs);

    // Trigger Speech via Unified Service
    speechService.speak(currentScript.fullText, {
      langCode: activeLang,
      rate: 0.92,
      onEnd: () => handleStopAudio(),
      onError: () => handleStopAudio()
    });
  };

  const handleStopAudio = () => {
    speechService.stopSpeaking();
    setIsPlayingAudio(false);
    setKaraokeActiveIndex(-1);
    setActivePillHighlight(null);
    if (karaokeTimerRef.current) {
      clearInterval(karaokeTimerRef.current);
      karaokeTimerRef.current = null;
    }
  };

  const handleSimulateWhatsApp = () => {
    setWhatsAppToast(true);
    setTimeout(() => setWhatsAppToast(false), 3000);
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#64748B', fontSize: '13px' }}>Solutions</span>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>Vernacular Audio-Rx Studio</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(16, 185, 129, 0.1)', color: '#059669', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 800, marginBottom: '12px' }}>
          <Volume2 size={14} />
          <span>PATIENT ADHERENCE & SPOKEN AUDIO-RX</span>
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 850, color: '#0A2540', marginBottom: '10px' }}>
          Vernacular Spoken Audio-Rx Studio
        </h1>
        <p style={{ fontSize: '15px', color: '#5A7184', maxWidth: '850px', lineHeight: 1.6 }}>
          Synthesizes natural, empathetic spoken prescriptions in the patient's regional mother tongue. The companion audio player illuminates color-coded visual pill schedule cards with synchronized glowing karaoke text.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Left Column: Player & Karaoke Display */}
        <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Language Switcher */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>Language:</span>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { code: 'te-IN', label: 'తెలుగు (Telugu)' },
                { code: 'hi-IN', label: 'हिन्दी (Hindi)' },
                { code: 'en-IN', label: 'English' }
              ].map(lang => (
                <button
                  key={lang.code}
                  onClick={() => {
                    handleStopAudio();
                    setActiveLang(lang.code);
                    setSelectedLanguage(lang.code);
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeLang === lang.code ? '#008B8B' : '#F1F5F9',
                    color: activeLang === lang.code ? '#FFFFFF' : '#475569',
                    fontSize: '12px',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Karaoke Telemetry Box */}
          <div style={{
            background: 'linear-gradient(135deg, #0A2540 0%, #0F172A 100%)',
            borderRadius: '14px',
            padding: '24px',
            minHeight: '180px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)'
          }}>
            <div style={{ fontSize: '11px', color: '#00A896', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
              Synchronized Karaoke Transcript:
            </div>
            <div style={{ fontSize: '18px', lineHeight: 1.8, color: '#94A3B8', fontWeight: 650 }}>
              {currentScript.tokens.map((token, idx) => {
                const isCurrent = idx === karaokeActiveIndex;
                return (
                  <span
                    key={idx}
                    style={{
                      display: 'inline-block',
                      marginRight: '6px',
                      color: isCurrent ? '#00F5D4' : idx < karaokeActiveIndex ? '#FFFFFF' : '#64748B',
                      fontWeight: isCurrent ? 850 : 600,
                      transform: isCurrent ? 'scale(1.12)' : 'scale(1)',
                      transition: 'all 140ms ease',
                      textShadow: isCurrent ? '0 0 12px rgba(0, 245, 212, 0.8)' : 'none'
                    }}
                  >
                    {token.text}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Player Button */}
          <button
            onClick={handlePlayAudio}
            style={{
              padding: '14px',
              borderRadius: '12px',
              border: 'none',
              background: isPlayingAudio ? '#DC2626' : '#008B8B',
              color: '#FFFFFF',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: isPlayingAudio ? '0 4px 14px rgba(220,38,38,0.3)' : '0 4px 14px rgba(0,139,139,0.3)'
            }}
          >
            {isPlayingAudio ? <Square size={18} fill="#FFF" /> : <Play size={18} fill="#FFF" />}
            <span>{isPlayingAudio ? 'Stop Audio Readout' : 'Play Spoken Prescription Audio'}</span>
          </button>
        </div>

        {/* Right Column: Visual Pill Schedule & WhatsApp Simulation */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Visual Pill Cards */}
          <div style={{ background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px' }}>
              Color-Coded Visual Pill Chronotherapy Schedule
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Morning Pill */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                border: activePillHighlight === 'morning' ? '2.5px solid #F59E0B' : '1px solid #E2E8F0',
                background: activePillHighlight === 'morning' ? '#FEF3C7' : '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 200ms ease',
                transform: activePillHighlight === 'morning' ? 'scale(1.02)' : 'scale(1)'
              }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#F59E0B', border: '2px solid #FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>
                    Pantoprazole 40mg (పసుపు గోళీ / Yellow Pill)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Morning: 08:30 AM (Before Breakfast • 30 mins empty stomach)
                  </div>
                </div>
              </div>

              {/* Night Pill */}
              <div style={{
                padding: '16px',
                borderRadius: '12px',
                border: activePillHighlight === 'night' ? '2.5px solid #EC4899' : '1px solid #E2E8F0',
                background: activePillHighlight === 'night' ? '#FCE7F3' : '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                transition: 'all 200ms ease',
                transform: activePillHighlight === 'night' ? 'scale(1.02)' : 'scale(1)'
              }}>
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#EC4899', border: '2px solid #FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }} />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>
                    Metformin 500mg SR (గులాబీ గోళీ / Pink Pill)
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    Night: 08:30 PM (After Dinner • Regular with water)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Demonstration Dispatch Box */}
          <div style={{ background: '#F0FDF4', border: '1.5px solid #BBF7D0', borderRadius: '16px', padding: '22px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#166534', fontWeight: 800, fontSize: '14px', marginBottom: '8px' }}>
              <MessageSquare size={16} />
              <span>Patient WhatsApp Audio-Rx Push (Demonstration)</span>
            </div>
            <p style={{ fontSize: '12.5px', color: '#14532D', lineHeight: 1.5, marginBottom: '14px' }}>
              Simulates sending the patient their audio note link and medication timing schedule directly to their verified WhatsApp account.
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                value={recipientPhone}
                onChange={(e) => setRecipientPhone(e.target.value)}
                placeholder="+91 Phone Number"
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #86EFAC',
                  background: '#FFFFFF',
                  fontSize: '13px',
                  color: '#0A2540'
                }}
              />
              <button
                onClick={handleSimulateWhatsApp}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: 'none',
                  background: '#16A34A',
                  color: '#FFFFFF',
                  fontSize: '12.5px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Share2 size={14} />
                <span>Simulate Send</span>
              </button>
            </div>

            {whatsAppToast && (
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#15803D', fontWeight: 700 }}>
                ✓ Demonstration dispatch simulated for {recipientPhone}. (No real external message sent in demo mode).
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
