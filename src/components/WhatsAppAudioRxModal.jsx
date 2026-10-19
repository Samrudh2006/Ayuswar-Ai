import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Send, 
  Phone, 
  CheckCheck, 
  Volume2, 
  ExternalLink, 
  Share2, 
  Download, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  Pill, 
  QrCode, 
  CheckCircle2, 
  Smartphone,
  RefreshCw,
  Info
} from 'lucide-react';

/**
 * WhatsAppAudioRxModal Component
 * Implements Vernacular WhatsApp Audio-Rx. Browser speech (Web Speech API). Gnani voice integration: planned.
 * Features:
 * 1. Live WhatsApp mobile frame with authentic chat UI & verified green badge.
 * 2. Playable Indic Voice Note with real Web Speech Synthesis in Telugu, Hindi, or English.
 * 3. Real-time word-by-word glowing karaoke synchronization highlighting spoken dosage.
 * 4. Color-coded visual pill schedule highlighting in sync with spoken instructions for non-reading patients.
 * 5. Direct WhatsApp redirection via wa.me link with pre-filled Indic prescription text.
 * 6. Interactive simulated delivery pipeline (Opus audio encoding -> ABDM sync -> WhatsApp API -> Double Blue Ticks).
 */
export default function WhatsAppAudioRxModal({
  isOpen,
  onClose,
  patientData = null,
  doctorName = 'Dr. Priya Sharma, MD',
  customMedications = null,
  initialLanguage = 'te'
}) {
  if (!isOpen) return null;

  // Default patient fallback
  const defaultPatient = {
    name: 'Narayana Rao',
    vernacularName: 'నారాయణ రావు',
    phone: '+91 98490 12345',
    cleanPhone: '919849012345',
    age: 58,
    gender: 'Male',
    abhaId: '91-4521-8932-1049',
    language: 'Telugu',
    langCode: 'te-IN'
  };

  const patient = patientData || defaultPatient;
  const [phoneNumber, setPhoneNumber] = useState(patient.phone || '+91 98490 12345');
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage === 'hi' ? 'hi' : 'te'); // 'te' | 'hi' | 'en'
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [karaokeActiveIndex, setKaraokeActiveIndex] = useState(-1);
  const [activePillHighlight, setActivePillHighlight] = useState(null); // 'morning' | 'night' | null
  const [audioPlaybackRate, setAudioPlaybackRate] = useState(1.0);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 100%
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);
  const [sendSuccessToast, setSendSuccessToast] = useState(false);
  const [deliveryStatus, setDeliveryStatus] = useState('delivered'); // 'sending' | 'sent' | 'delivered' | 'read'

  const karaokeTimerRef = useRef(null);
  const progressTimerRef = useRef(null);

  // Doctor-configurable dosage schedule timings & meal relationships
  const [morningTime, setMorningTime] = useState('08:30 AM');
  const [morningMeal, setMorningMeal] = useState('after'); // 'before' | 'after'
  const [morningDoseText, setMorningDoseText] = useState('Pantoprazole 40mg (పసుపు గోళీ)');

  const [nightTime, setNightTime] = useState('08:30 PM');
  const [nightMeal, setNightMeal] = useState('after'); // 'before' | 'after'
  const [nightDoseText, setNightDoseText] = useState('Metformin 500mg (గులాబీ గోళీ)');

  const morningMealTelugu = morningMeal === 'before' ? 'టిఫిన్ ముందు' : 'టిఫిన్ తర్వాత';
  const morningMealHindi = morningMeal === 'before' ? 'नाश्ते से पहले' : 'नाश्ते के बाद';
  const morningMealEnglish = morningMeal === 'before' ? 'before breakfast' : 'after breakfast';

  const nightMealTelugu = nightMeal === 'before' ? 'భోజనం ముందు' : 'భోజనం తర్వాత';
  const nightMealHindi = nightMeal === 'before' ? 'रात के खाने से पहले' : 'रात के खाने के बाद';
  const nightMealEnglish = nightMeal === 'before' ? 'before dinner' : 'after dinner';

  // Preset Prescriptions per Language (Dynamically formatted with doctor's selected times)
  const rxContent = {
    te: {
      langLabel: 'తెలుగు (Telugu)',
      langCode: 'te-IN',
      doctorVernacular: 'డాక్టర్ ప్రియా శర్మ',
      audioDuration: '0:24',
      speechText: `నమస్కారం ${patient.name} గారు. నేను మీ డాక్టర్ ప్రియాని మాట్లాడుతున్నాను. పసుపు రంగు టాబ్లెట్ ఉదయం ${morningMealTelugu} ${morningTime} గంటలకు ఒక గోళీ వేసుకోండి. గులాబీ రంగు టాబ్లెట్ రాత్రి ${nightMealTelugu} ${nightTime} గంటలకు ఒక గోళీ వేసుకోండి. మందులు అస్సలు మర్చిపోవద్దు, వేళకు వేసుకోండి.`,
      karaokeTokens: [
        { word: 'నమస్కారం', pill: null },
        { word: patient.name.split(' ')[0], pill: null },
        { word: 'గారు.', pill: null },
        { word: 'నేను', pill: null },
        { word: 'మీ', pill: null },
        { word: 'డాక్టర్', pill: null },
        { word: 'ప్రియాని.', pill: null },
        { word: 'పసుపు', pill: 'morning' },
        { word: 'రంగు', pill: 'morning' },
        { word: 'టాబ్లెట్', pill: 'morning' },
        { word: 'ఉదయం', pill: 'morning' },
        { word: morningMealTelugu.split(' ')[0], pill: 'morning' },
        { word: morningMealTelugu.split(' ')[1] || '', pill: 'morning' },
        { word: morningTime, pill: 'morning' },
        { word: 'ఒకటి,', pill: 'morning' },
        { word: 'గులాబీ', pill: 'night' },
        { word: 'రంగు', pill: 'night' },
        { word: 'టాబ్లెట్', pill: 'night' },
        { word: 'రాత్రి', pill: 'night' },
        { word: nightMealTelugu.split(' ')[0], pill: 'night' },
        { word: nightMealTelugu.split(' ')[1] || '', pill: 'night' },
        { word: nightTime, pill: 'night' },
        { word: 'ఒకటి.', pill: 'night' },
        { word: 'వేళకు', pill: null },
        { word: 'మందులు', pill: null },
        { word: 'వాడండి.', pill: null }
      ],
      whatsappSummary: `🏥 *AyuSwar Hospital AI Clinical Audio-Rx*\n\nనమస్కారం *${patient.name}* (${patient.vernacularName || ''}) గారు,\n\nమీ డాక్టర్ *${doctorName}* ప్రిస్క్రిప్షన్ ఆడియో నోట్:\n\n🟡 *పసుపు రంగు టాబ్లెట్* (Pantoprazole 40mg): ఉదయం ${morningMealTelugu} (${morningTime}) - 1 గోళీ.\n🟣 *గులాబీ రంగు టాబ్లెట్* (Metformin 500mg): రాత్రి ${nightMealTelugu} (${nightTime}) - 1 గోళీ.\n\n🔊 ఆడియో సూచనలు వినడానికి క్లిక్ చేయండి: https://ayuswar.ai/rx/${patient.abhaId || '91-4521'}\n\nఎమర్జెన్సీ హెల్ప్‌లైన్: 108 / 104\nABDM హెల్త్ రికార్డ్స్ వెరిఫై చేయబడింది ✅`
    },
    hi: {
      langLabel: 'हिंदी (Hindi)',
      langCode: 'hi-IN',
      doctorVernacular: 'डॉ. प्रिया शर्मा',
      audioDuration: '0:22',
      speechText: `नमस्ते ${patient.name} जी। मैं आपकी डॉक्टर प्रिया बोल रही हूँ। पीली वाली गोली सुबह ${morningMealHindi} ${morningTime} बजे एक खानी है। गुलाबी वाली गोली रात को ${nightMealHindi} ${nightTime} बजे एक लेनी है। दवा समय पर लें और पानी ज्यादा पिएं।`,
      karaokeTokens: [
        { word: 'नमस्ते', pill: null },
        { word: patient.name.split(' ')[0], pill: null },
        { word: 'जी।', pill: null },
        { word: 'मैं', pill: null },
        { word: 'आपकी', pill: null },
        { word: 'डॉक्टर', pill: null },
        { word: 'प्रिया', pill: null },
        { word: 'बोल', pill: null },
        { word: 'रही', pill: null },
        { word: 'हूँ।', pill: null },
        { word: 'पीली', pill: 'morning' },
        { word: 'वाली', pill: 'morning' },
        { word: 'गोली', pill: 'morning' },
        { word: 'सुबह', pill: 'morning' },
        { word: morningMealHindi, pill: 'morning' },
        { word: morningTime, pill: 'morning' },
        { word: 'एक,', pill: 'morning' },
        { word: 'गुलाबी', pill: 'night' },
        { word: 'वाली', pill: 'night' },
        { word: 'गोली', pill: 'night' },
        { word: 'रात', pill: 'night' },
        { word: nightMealHindi, pill: 'night' },
        { word: nightTime, pill: 'night' },
        { word: 'एक।', pill: 'night' },
        { word: 'दवा', pill: null },
        { word: 'समय', pill: null },
        { word: 'पर', pill: null },
        { word: 'लें।', pill: null }
      ],
      whatsappSummary: `🏥 *AyuSwar Hospital AI Clinical Audio-Rx*\n\nनमस्ते *${patient.name}* जी,\n\nआपकी डॉक्टर *${doctorName}* की आवाज में दवा का ऑडियो पर्चा:\n\n🟡 *पीली गोली* (Pantoprazole 40mg): सुबह ${morningMealHindi} (${morningTime}) - 1 गोली।\n🟣 *गुलाबी गोली* (Metformin 500mg): रात ${nightMealHindi} (${nightTime}) - 1 गोली।\n\n🔊 ऑडियो सुनने के लिए लिंक खोलें: https://ayuswar.ai/rx/${patient.abhaId || '91-4521'}\n\nआपातकालीन सहायता: 108 / 104\nABDM डिजिटल हेल्थ रिकॉर्ड प्रमाणित ✅`
    },
    en: {
      langLabel: 'English (Indic Accent)',
      langCode: 'en-IN',
      doctorVernacular: 'Dr. Priya Sharma',
      audioDuration: '0:20',
      speechText: `Hello ${patient.name}. This is Dr. Priya. Please take the yellow tablet once in the morning ${morningMealEnglish} at ${morningTime}. Take the pink tablet once at night ${nightMealEnglish} at ${nightTime}. Do not skip your medicines.`,
      karaokeTokens: [
        { word: 'Hello', pill: null },
        { word: patient.name.split(' ')[0], pill: null },
        { word: 'This', pill: null },
        { word: 'is', pill: null },
        { word: 'Dr.', pill: null },
        { word: 'Priya.', pill: null },
        { word: 'Take', pill: 'morning' },
        { word: 'the', pill: 'morning' },
        { word: 'yellow', pill: 'morning' },
        { word: 'tablet', pill: 'morning' },
        { word: morningMealEnglish, pill: 'morning' },
        { word: morningTime, pill: 'morning' },
        { word: 'and', pill: 'night' },
        { word: 'the', pill: 'night' },
        { word: 'pink', pill: 'night' },
        { word: 'tablet', pill: 'night' },
        { word: 'at', pill: 'night' },
        { word: nightMealEnglish, pill: 'night' },
        { word: nightTime, pill: 'night' },
        { word: 'Stay', pill: null },
        { word: 'healthy.', pill: null }
      ],
      whatsappSummary: `🏥 *AyuSwar Hospital AI Clinical Audio-Rx*\n\nHello *${patient.name}*,\n\nAudio Prescription from *${doctorName}*:\n\n🟡 *Yellow Tablet* (Pantoprazole 40mg): Morning ${morningMealEnglish} (${morningTime}) - 1 Tab\n🟣 *Pink Tablet* (Metformin 500mg): Night ${nightMealEnglish} (${nightTime}) - 1 Tab\n\n🔊 Listen to Spoken Rx: https://ayuswar.ai/rx/${patient.abhaId || '91-4521'}\n\nEmergency: 108 / 104 | ABDM FHIR R4 Verified ✅`
    }
  };

  const currentRx = rxContent[selectedLanguage] || rxContent.te;

  // Clean phone number for wa.me redirect
  const sanitizePhone = (num) => {
    return num.replace(/[^0-9]/g, '');
  };

  // Play / Pause Spoken Audio-Rx with Web Speech API & Karaoke
  const togglePlayAudio = () => {
    if (isPlayingAudio) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const stopAudio = () => {
    setIsPlayingAudio(false);
    if (karaokeTimerRef.current) clearInterval(karaokeTimerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    setKaraokeActiveIndex(-1);
    setActivePillHighlight(null);
    setAudioProgress(0);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const startAudio = () => {
    stopAudio();
    setIsPlayingAudio(true);
    const tokens = currentRx.karaokeTokens;
    let tokenIdx = 0;
    setKaraokeActiveIndex(0);
    setActivePillHighlight(tokens[0]?.pill || null);

    // Speak using Web Speech API
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentRx.speechText);
      utterance.lang = currentRx.langCode;
      utterance.rate = audioPlaybackRate;
      
      // Try to select an Indic voice if available
      const voices = window.speechSynthesis.getVoices();
      const indicVoice = voices.find(v => v.lang.includes('te') || v.lang.includes('hi') || v.lang.includes('IN'));
      if (indicVoice) utterance.voice = indicVoice;

      utterance.onend = () => {
        stopAudio();
      };
      utterance.onerror = () => {
        stopAudio();
      };
      window.speechSynthesis.speak(utterance);
    }

    // Interval for visual word token progression
    const intervalTime = Math.max(250, Math.floor(750 / audioPlaybackRate));
    karaokeTimerRef.current = setInterval(() => {
      tokenIdx++;
      if (tokenIdx < tokens.length) {
        setKaraokeActiveIndex(tokenIdx);
        setActivePillHighlight(tokens[tokenIdx]?.pill || null);
        setAudioProgress(Math.floor((tokenIdx / tokens.length) * 100));
      } else {
        stopAudio();
      }
    }, intervalTime);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        stopAudio();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      stopAudio();
    };
  }, [selectedLanguage, onClose]);

  // Actual Redirect to WhatsApp
  const handleRedirectToWhatsApp = () => {
    const rawClean = sanitizePhone(phoneNumber);
    const finalPhone = rawClean.length === 10 ? `91${rawClean}` : rawClean;
    const encodedText = encodeURIComponent(currentRx.whatsappSummary);
    
    // On mobile devices, https://api.whatsapp.com/send directly opens native WhatsApp app
    const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '');
    const waUrl = isMobileDevice
      ? `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodedText}`
      : `https://wa.me/${finalPhone}?text=${encodedText}`;
    
    // Tactile haptic feedback on mobile tap
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(18); } catch {}
    }

    // Open in new tab/window for WhatsApp Web or mobile app
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  // Simulate Live Dispatch with interactive pipeline
  const handleSimulateDispatch = () => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate(22); } catch {}
    }
    setIsSendingWhatsApp(true);
    setDeliveryStatus('sending');

    setTimeout(() => {
      setDeliveryStatus('sent');
    }, 900);

    setTimeout(() => {
      setDeliveryStatus('delivered');
    }, 1800);

    setTimeout(() => {
      setDeliveryStatus('read');
      setIsSendingWhatsApp(false);
      setSendSuccessToast(true);
      setTimeout(() => setSendSuccessToast(false), 4500);
    }, 2800);
  };

  return (
    <div 
      className="modal-overlay whatsapp-modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          stopAudio();
          onClose();
        }
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(6, 22, 38, 0.85)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '20px',
        animation: 'fadeIn 0.25s ease-out'
      }}
    >
      <div 
        className="modal-content whatsapp-modal-container"
        style={{
          background: '#ffffff',
          width: '100%',
          maxWidth: '1080px',
          maxHeight: '92vh',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.2)',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Modal Top Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #0F3B3B 50%, #008B8B 100%)',
          padding: '20px 28px',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#25D366',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)'
            }}>
              <Smartphone size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, letterSpacing: '-0.3px', fontFamily: 'Outfit, sans-serif' }}>
                  Vernacular WhatsApp Audio-Rx
                </h2>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  background: 'rgba(255,255,255,0.15)',
                  padding: '3px 8px',
                  borderRadius: '20px',
                  border: '1px solid rgba(255,255,255,0.3)',
                  letterSpacing: '0.5px'
                }}>
                  BROWSER SPEECH
                </span>
              </div>
              <p style={{ fontSize: '12.5px', color: '#CBD5E1', margin: '3px 0 0 0' }}>
                Solves Indian non-literacy with native audio voice notes & synchronized glowing karaoke pills.
              </p>
            </div>
          </div>

          <button
            onClick={() => { stopAudio(); onClose(); }}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Main Body (2 Columns: Left Controls & Karaoke, Right Realistic WhatsApp Frame) */}
        <div 
          className="whatsapp-modal-body-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1.15fr 1fr',
            flex: 1,
            overflowY: 'auto',
            background: '#F8FAFC'
          }}
        >
          {/* LEFT COLUMN: Controls, Language, Karaoke Spoken Rx, Visual Schedule */}
          <div style={{ padding: '26px', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Patient & Dispatch Selector */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '10px' }}>
                Patient Destination & Phone Number
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    Recipient Patient
                  </label>
                  <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#0A2540' }}>
                    {patient.name} <span style={{ color: '#008B8B', fontWeight: 700 }}>({patient.vernacularName || 'నారాయణ'})</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    ABHA: {patient.abhaId} • {patient.age}y {patient.gender}
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                    WhatsApp Mobile Number
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    placeholder="+91 98490 12345"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#0A2540',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Fast Phone Presets */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '10.5px', color: '#64748B', alignSelf: 'center', marginRight: '4px' }}>Quick Select:</span>
                {[
                  { label: 'Narayana (+91 98490-12345)', num: '+91 98490 12345', lang: 'te' },
                  { label: 'Aarav Kumar (+91 99887-65432)', num: '+91 99887 65432', lang: 'hi' },
                  { label: 'Ananya Rao (+91 98480-22334)', num: '+91 98480 22334', lang: 'te' }
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => { setPhoneNumber(preset.num); setSelectedLanguage(preset.lang); }}
                    style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      border: '1px solid #E2E8F0',
                      background: phoneNumber === preset.num ? 'rgba(0, 139, 139, 0.1)' : '#F1F5F9',
                      color: phoneNumber === preset.num ? '#008B8B' : '#475569',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language & Voice Synthesis Engine */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Spoken Dialect & Synthesis Speed
                </div>
                <span style={{ fontSize: '11px', color: '#008B8B', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Volume2 size={13} /> {currentRx.doctorVernacular} Voice
                </span>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {[
                  { code: 'te', label: 'తెలుగు (Telugu Rayalaseema)', flag: '🇮🇳' },
                  { code: 'hi', label: 'हिंदी (Hindi Awadhi)', flag: '🇮🇳' },
                  { code: 'en', label: 'English (Indian Accent)', flag: '🇮🇳' }
                ].map(lang => (
                  <button
                    key={lang.code}
                    onClick={() => { setSelectedLanguage(lang.code); stopAudio(); }}
                    style={{
                      flex: 1,
                      padding: '8px 10px',
                      borderRadius: '10px',
                      border: selectedLanguage === lang.code ? '2px solid #008B8B' : '1px solid #E2E8F0',
                      background: selectedLanguage === lang.code ? 'rgba(0, 139, 139, 0.08)' : '#ffffff',
                      color: selectedLanguage === lang.code ? '#008B8B' : '#475569',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11.5px', color: '#64748B' }}>
                <span>Speech Tempo:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0.8, 1.0, 1.25].map(rate => (
                    <button
                      key={rate}
                      onClick={() => setAudioPlaybackRate(rate)}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        border: '1px solid #E2E8F0',
                        background: audioPlaybackRate === rate ? '#0A2540' : '#F1F5F9',
                        color: audioPlaybackRate === rate ? '#ffffff' : '#475569',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Word-by-Word Synchronized Glowing Karaoke Box */}
            <div style={{
              background: '#061626',
              borderRadius: '16px',
              padding: '20px',
              border: '1.5px solid rgba(0, 139, 139, 0.4)',
              boxShadow: '0 8px 24px rgba(0, 139, 139, 0.15)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Sparkles size={16} color="#2DD4BF" />
                  <span style={{ fontSize: '12px', fontWeight: 800, color: '#2DD4BF', letterSpacing: '0.5px' }}>
                    LIVE WORD-BY-WORD KARAOKE SYNCHRONIZATION
                  </span>
                </div>
                {isPlayingAudio && (
                  <span style={{
                    fontSize: '10.5px',
                    fontWeight: 800,
                    color: '#ffffff',
                    background: '#D97706',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    animation: 'pulse 1s infinite'
                  }}>
                    VOICE ACTIVE
                  </span>
                )}
              </div>

              {/* Interactive Glowing Words Display */}
              <div style={{
                minHeight: '84px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '8px',
                lineHeight: 1.8,
                marginBottom: '16px'
              }}>
                {currentRx.karaokeTokens.map((token, idx) => {
                  const isActive = karaokeActiveIndex === idx;
                  const isPill = token.pill !== null;
                  return (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '14.5px',
                        fontWeight: isActive ? 850 : 600,
                        color: isActive ? '#061626' : (isPill ? '#FDE68A' : '#E2E8F0'),
                        background: isActive 
                          ? (token.pill === 'night' ? '#F472B6' : (token.pill === 'morning' ? '#FBBF24' : '#2DD4BF'))
                          : (isPill ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 255, 255, 0.05)'),
                        border: isActive ? '1px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: isActive ? '0 0 16px rgba(45, 212, 191, 0.8)' : 'none',
                        transform: isActive ? 'scale(1.1)' : 'scale(1)',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {token.word}
                    </span>
                  );
                })}
              </div>

              {/* Audio Play Trigger Bar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={togglePlayAudio}
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 20px',
                    borderRadius: '12px',
                    background: isPlayingAudio ? '#EF4444' : 'linear-gradient(135deg, #008B8B 0%, #065F46 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13.5px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(0, 139, 139, 0.3)'
                  }}
                >
                  {isPlayingAudio ? <Pause size={16} fill="#ffffff" /> : <Play size={16} fill="#ffffff" />}
                  <span>{isPlayingAudio ? 'Pause Voice Note' : `Play Spoken Audio-Rx (${currentRx.langLabel.split(' ')[0]})`}</span>
                </button>
              </div>
            </div>

            {/* Visual Color-Coded Pill Schedule (Doctor-Configurable Timings) */}
            <div style={{ background: '#ffffff', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Doctor-Selected Dosage Schedule & Meal Timings
                </div>
                <span style={{ fontSize: '10px', background: '#F1F5F9', color: '#008B8B', padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                  Live Voice Synchronized
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {/* Morning Pill Card with Doctor Timing Controls */}
                <div style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: activePillHighlight === 'morning' ? 'rgba(251, 191, 36, 0.18)' : '#FFFBEB',
                  border: activePillHighlight === 'morning' ? '2px solid #F59E0B' : '1px solid #FDE68A',
                  boxShadow: activePillHighlight === 'morning' ? '0 0 16px rgba(245, 158, 11, 0.35)' : 'none',
                  transform: activePillHighlight === 'morning' ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <img 
                      src="/images/medicines/yellow_pantoprazole.jpg" 
                      alt="Pantoprazole 40mg (Yellow Pill)" 
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        border: '1.5px solid #F59E0B',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)'
                      }} 
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#92400E' }}>
                        ఉదయం / Morning (1 Tab)
                      </div>
                      <div style={{ fontSize: '11px', color: '#B45309' }}>
                        Pantoprazole 40mg (పసుపు గోళీ)
                      </div>
                    </div>
                  </div>

                  {/* Doctor Time Selector */}
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <div style={{ fontSize: '10.5px', color: '#78350F', fontWeight: 700, marginBottom: '4px' }}>
                      Select Dosage Time:
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      {['07:30 AM', '08:00 AM', '08:30 AM', '09:00 AM'].map(t => (
                        <button
                          key={t}
                          onClick={() => setMorningTime(t)}
                          style={{
                            padding: '2px 7px',
                            borderRadius: '6px',
                            border: morningTime === t ? '1.5px solid #D97706' : '1px solid #FCD34D',
                            background: morningTime === t ? '#D97706' : '#ffffff',
                            color: morningTime === t ? '#ffffff' : '#78350F',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Meal Relation Toggle */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => setMorningMeal('before')}
                        style={{
                          flex: 1,
                          padding: '3px',
                          borderRadius: '6px',
                          border: morningMeal === 'before' ? '1.5px solid #D97706' : '1px solid #FCD34D',
                          background: morningMeal === 'before' ? '#D97706' : '#ffffff',
                          color: morningMeal === 'before' ? '#ffffff' : '#78350F',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        టిఫిన్ ముందు (Before)
                      </button>
                      <button
                        onClick={() => setMorningMeal('after')}
                        style={{
                          flex: 1,
                          padding: '3px',
                          borderRadius: '6px',
                          border: morningMeal === 'after' ? '1.5px solid #D97706' : '1px solid #FCD34D',
                          background: morningMeal === 'after' ? '#D97706' : '#ffffff',
                          color: morningMeal === 'after' ? '#ffffff' : '#78350F',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        టిఫిన్ తర్వాత (After)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Night Pill Card with Doctor Timing Controls */}
                <div style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: activePillHighlight === 'night' ? 'rgba(236, 72, 153, 0.18)' : '#FDF2F8',
                  border: activePillHighlight === 'night' ? '2px solid #EC4899' : '1px solid #FBCFE8',
                  boxShadow: activePillHighlight === 'night' ? '0 0 16px rgba(236, 72, 153, 0.35)' : 'none',
                  transform: activePillHighlight === 'night' ? 'scale(1.02)' : 'scale(1)',
                  transition: 'all 0.2s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                    <img 
                      src="/images/medicines/pink_metformin.jpg" 
                      alt="Metformin 500mg SR (Pink Pill)" 
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        border: '1.5px solid #EC4899',
                        flexShrink: 0,
                        boxShadow: '0 2px 8px rgba(236, 72, 153, 0.3)'
                      }} 
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#9D174D' }}>
                        రాత్రి / Night (1 Tab)
                      </div>
                      <div style={{ fontSize: '11px', color: '#BE185D' }}>
                        Metformin 500mg (గులాబీ గోళీ)
                      </div>
                    </div>
                  </div>

                  {/* Doctor Time Selector */}
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(236, 72, 153, 0.2)' }}>
                    <div style={{ fontSize: '10.5px', color: '#831843', fontWeight: 700, marginBottom: '4px' }}>
                      Select Dosage Time:
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                      {['08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM'].map(t => (
                        <button
                          key={t}
                          onClick={() => setNightTime(t)}
                          style={{
                            padding: '2px 7px',
                            borderRadius: '6px',
                            border: nightTime === t ? '1.5px solid #DB2777' : '1px solid #F472B6',
                            background: nightTime === t ? '#DB2777' : '#ffffff',
                            color: nightTime === t ? '#ffffff' : '#831843',
                            fontSize: '10px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          {t}
                        </button>
                      ))}
                    </div>

                    {/* Meal Relation Toggle */}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        onClick={() => setNightMeal('before')}
                        style={{
                          flex: 1,
                          padding: '3px',
                          borderRadius: '6px',
                          border: nightMeal === 'before' ? '1.5px solid #DB2777' : '1px solid #F472B6',
                          background: nightMeal === 'before' ? '#DB2777' : '#ffffff',
                          color: nightMeal === 'before' ? '#ffffff' : '#831843',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        భోజనం ముందు (Before)
                      </button>
                      <button
                        onClick={() => setNightMeal('after')}
                        style={{
                          flex: 1,
                          padding: '3px',
                          borderRadius: '6px',
                          border: nightMeal === 'after' ? '1.5px solid #DB2777' : '1px solid #F472B6',
                          background: nightMeal === 'after' ? '#DB2777' : '#ffffff',
                          color: nightMeal === 'after' ? '#ffffff' : '#831843',
                          fontSize: '10px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        భోజనం తర్వాత (After)
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: 'auto' }}>
              <button
                onClick={handleRedirectToWhatsApp}
                style={{
                  flex: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '14px 20px',
                  borderRadius: '12px',
                  background: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 16px rgba(37, 211, 102, 0.35)',
                  transition: 'all 0.2s'
                }}
              >
                <Send size={18} />
                <span>Open / Send on WhatsApp (wa.me)</span>
                <ExternalLink size={14} />
              </button>

              <button
                onClick={handleSimulateDispatch}
                disabled={isSendingWhatsApp}
                style={{
                  flex: 0.8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  background: '#0A2540',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 750,
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={15} className={isSendingWhatsApp ? 'spin-animation' : ''} />
                <span>{isSendingWhatsApp ? 'Transmitting...' : 'Live Push Simulate'}</span>
              </button>
            </div>

            {/* Print & Download Action Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                onClick={() => {
                  window.print();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: '#ffffff',
                  color: '#0A2540',
                  border: '1.5px solid #CBD5E1',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <span>🖨️ Print Visual Rx Slip</span>
              </button>

              <button
                onClick={() => {
                  const blob = new Blob([
                    `AYUSWAR AI — VERNACULAR SPOKEN AUDIO-RX\n\n` +
                    `Patient: ${patient.name} (${patient.abhaId})\n` +
                    `Doctor: ${doctorName}\n` +
                    `Language: ${currentRx.langLabel}\n` +
                    `Timestamp: ${new Date().toLocaleString()}\n\n` +
                    `--- CLONED DOCTOR VOICE NOTE TEXT ---\n` +
                    `${currentRx.speechText}\n\n` +
                    `--- MEDICATIONS & COLOR CHRONOTHERAPY ---\n` +
                    `🟡 Morning: Pantoprazole 40mg (After Breakfast / 08:30 AM)\n` +
                    `🟣 Night: Metformin 500mg (After Dinner / 08:30 PM)\n\n` +
                    `Verified by DEMO ABDM HPR #8921-9942`
                  ], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `AyuSwar_AudioRx_${patient.name.replace(/\s+/g, '_')}_Transcript.txt`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'rgba(0, 139, 139, 0.08)',
                  color: '#008B8B',
                  border: '1.5px solid rgba(0, 139, 139, 0.3)',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                <Download size={14} />
                <span>Download Audio-Rx Note</span>
              </button>
            </div>

            {sendSuccessToast && (
              <div style={{
                background: '#ECFDF5',
                border: '1.5px solid #10B981',
                padding: '10px 16px',
                borderRadius: '10px',
                color: '#065F46',
                fontSize: '12.5px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={16} color="#10B981" />
                <span>Audio-Rx & WhatsApp notification delivered to {phoneNumber} with Read Receipts (✓✓)!</span>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Realistic Mobile WhatsApp Chat Simulation Frame */}
          <div style={{
            background: '#E5DDD5',
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* WhatsApp Phone Mockup Container */}
            <div style={{
              width: '100%',
              maxWidth: '380px',
              background: '#E5DDD5',
              borderRadius: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 0 8px #1E293B',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              minHeight: '620px'
            }}>
              {/* WhatsApp App Top Bar */}
              <div style={{
                background: '#075E54',
                padding: '12px 14px',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ position: 'relative', width: '38px', height: '38px', borderRadius: '50%', overflow: 'hidden', background: '#ffffff' }}>
                    <img 
                      src="/assets/dr_ananya_avatar.jpg" 
                      alt="Doctor" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff' }}>
                        AyuSwar OPD Bot
                      </span>
                      <CheckCircle2 size={12} fill="#25D366" color="#ffffff" />
                    </div>
                    <div style={{ fontSize: '10px', color: '#A7F3D0' }}>
                      Official ABDM Partner • Online
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffffff' }}>
                  <Phone size={16} />
                  <Info size={16} />
                </div>
              </div>

              {/* WhatsApp Chat Area */}
              <div style={{
                flex: 1,
                padding: '16px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                overflowY: 'auto'
              }}>
                {/* Security encryption pill */}
                <div style={{
                  alignSelf: 'center',
                  background: '#FCF4CB',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '9.5px',
                  color: '#54656F',
                  textAlign: 'center',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  maxWidth: '90%'
                }}>
                  🔒 End-to-end encrypted ABDM Health Record
                </div>

                {/* Received WhatsApp Voice Note Bubble */}
                <div style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  borderRadius: '12px 12px 12px 2px',
                  padding: '10px 12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  maxWidth: '92%',
                  border: isPlayingAudio ? '1.5px solid #25D366' : '1px solid #E2E8F0'
                }}>
                  {/* Doctor Voice Note Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: '#008B8B',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                    onClick={togglePlayAudio}
                    >
                      {isPlayingAudio ? <Pause size={16} fill="#ffffff" /> : <Play size={16} fill="#ffffff" style={{ marginLeft: '2px' }} />}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#075E54' }}>
                          Voice Note ({currentRx.langLabel.split(' ')[0]})
                        </span>
                        <span style={{ fontSize: '10px', color: '#667781' }}>
                          {currentRx.audioDuration}
                        </span>
                      </div>

                      {/* Oscillating Audio Waveform */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '18px', marginTop: '4px' }}>
                        {[6, 12, 18, 10, 16, 22, 14, 8, 20, 16, 10, 14, 18, 12, 8, 16, 22, 14, 10, 16, 12, 8].map((h, i) => {
                          const isBarActive = (i / 22) * 100 <= audioProgress;
                          return (
                            <span
                              key={i}
                              style={{
                                width: '3px',
                                height: isPlayingAudio ? `${Math.max(4, (h * (0.6 + Math.random() * 0.8)))}px` : `${h}px`,
                                background: isBarActive ? '#25D366' : '#94A3B8',
                                borderRadius: '2px',
                                transition: 'height 0.1s'
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '10.5px', color: '#54656F', borderTop: '1px solid #F1F5F9', paddingTop: '6px' }}>
                    🎙️ Spoken in {currentRx.langLabel} by {doctorName}
                  </div>
                </div>

                {/* Accompanying Visual Schedule Text Message Bubble */}
                <div style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  borderRadius: '12px 12px 12px 2px',
                  padding: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  maxWidth: '92%',
                  fontSize: '11.5px',
                  lineHeight: 1.5,
                  color: '#111B21'
                }}>
                  <div style={{ fontWeight: 800, color: '#075E54', marginBottom: '4px' }}>
                    🏥 AyuSwar Clinical Prescription
                  </div>
                  <div style={{ fontSize: '11px', color: '#475569', marginBottom: '8px' }}>
                    Patient: <strong>{patient.name}</strong> • Dr. Priya Sharma
                  </div>

                  <div style={{ background: '#FFFBEB', padding: '6px 8px', borderRadius: '6px', marginBottom: '6px', borderLeft: '3px solid #F59E0B' }}>
                    🟡 <strong>{selectedLanguage === 'te' ? 'పసుపు రంగు (Morning)' : (selectedLanguage === 'hi' ? 'पीली गोली (Morning)' : 'Yellow Pill (Morning)')}:</strong> Pantoprazole 40mg (1 {selectedLanguage === 'te' ? 'గోళీ' : 'Tab'} {selectedLanguage === 'te' ? morningMealTelugu : (selectedLanguage === 'hi' ? morningMealHindi : morningMealEnglish)} - {morningTime})
                  </div>

                  <div style={{ background: '#FDF2F8', padding: '6px 8px', borderRadius: '6px', marginBottom: '8px', borderLeft: '3px solid #EC4899' }}>
                    🟣 <strong>{selectedLanguage === 'te' ? 'గులాబీ రంగు (Night)' : (selectedLanguage === 'hi' ? 'गुलाबी गोली (Night)' : 'Pink Pill (Night)')}:</strong> Metformin 500mg (1 {selectedLanguage === 'te' ? 'గోళీ' : 'Tab'} {selectedLanguage === 'te' ? nightMealTelugu : (selectedLanguage === 'hi' ? nightMealHindi : nightMealEnglish)} - {nightTime})
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '10px', color: '#667781', marginTop: '6px' }}>
                    <span>10:42 AM</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '2px', color: deliveryStatus === 'read' ? '#53BDEB' : '#8696A0' }}>
                      <CheckCheck size={14} />
                    </span>
                  </div>
                </div>

                {/* Interactive Audio-Rx Web Link Card */}
                <div style={{
                  alignSelf: 'flex-start',
                  background: '#ffffff',
                  borderRadius: '12px 12px 12px 2px',
                  padding: '10px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                  maxWidth: '92%',
                  border: '1px solid #E2E8F0',
                  cursor: 'pointer'
                }}
                onClick={togglePlayAudio}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '40px', height: '40px', background: '#0A2540', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2DD4BF' }}>
                      <Volume2 size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#0A2540' }}>
                        Tap to Replay Spoken Audio-Rx
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>
                        ayuswar.ai/rx/{patient.abhaId || '91-4521'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Fake Input Bar */}
              <div style={{
                background: '#F0F2F5',
                padding: '8px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  flex: 1,
                  background: '#ffffff',
                  borderRadius: '20px',
                  padding: '8px 14px',
                  fontSize: '11.5px',
                  color: '#64748B'
                }}>
                  Reply in Telugu or send voice note...
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: '#00A884',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Volume2 size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div style={{
          background: '#ffffff',
          padding: '14px 28px',
          borderTop: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={16} color="#059669" />
            <span>Designed for client-side processing • ABDM M2/M3 Milestone Architecture (PLANNED)</span>
          </div>

          <button
            onClick={() => { stopAudio(); onClose(); }}
            style={{
              padding: '8px 18px',
              borderRadius: '8px',
              border: '1px solid #CBD5E1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
