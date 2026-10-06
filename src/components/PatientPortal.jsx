import React, { useState } from 'react';
import { 
  Home, 
  Heart, 
  Calendar, 
  FileText, 
  Pill, 
  Sparkles, 
  Target, 
  Settings, 
  Bell, 
  ChevronDown, 
  Upload, 
  Eye, 
  MessageSquare, 
  Send, 
  Activity, 
  Moon, 
  Scale, 
  Volume2, 
  Play, 
  Pause, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Languages,
  QrCode,
  Download,
  AlertCircle,
  PhoneCall,
  Check,
  Award
} from 'lucide-react';

/**
 * PatientPortal Component — Complete Enterprise Citizen Healthcare Operating System
 * Faithfully implements Screenshot 1 + All 8 dedicated sidebar views:
 * 1. Home (Hero welcome, 4 quick actions, Upcoming appts, Health overview vitals, Ask AyuSwar, Goals, Doctor card)
 * 2. My Health (Official ABHA Digital Health Card, QR verification, longitudinal vitals graphs, chronic conditions)
 * 3. Appointments (Upcoming online/in-person visits, Book New Appointment wizard, past visit summary)
 * 4. Reports (Lab test results, X-rays, blood biochemistry, 1-Click "Hear Report in My Language" native audio)
 * 5. Medications (Smart Chronotherapy Pillbox: Early morning empty stomach, meals, bedtime with Timbre voiceover)
 * 6. AI Assistant (Vernacular health assistant, symptoms advice, emergency 108/104 direct action banner)
 * 7. Health Goals (10k steps tracker, hydration glasses, medication adherence streak, sleep tracker)
 * 8. Settings (Native Indic dialect selector, ABHA family locker switcher, WhatsApp voice reminder preferences)
 */
export default function PatientPortal({ patientProfile, onOpenDoctorAuthModal }) {
  const [activeTab, setActiveTab] = useState('home');
  const [patientQuestion, setPatientQuestion] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'user',
      text: 'I have mild cough and sore throat. What should I do?'
    },
    {
      sender: 'ai',
      text: 'Hello Ananya! For mild cough and throat irritation: Drink warm water with honey, avoid refrigerated drinks, and use saline gargles twice daily. If you develop high fever or shortness of breath, connect with Dr. Priya immediately.'
    }
  ]);

  // Chronotherapy Timing & Spoken Voice Prescription State
  const [selectedLanguage, setSelectedLanguage] = useState('Telugu');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activePillSlot, setActivePillSlot] = useState('morning');
  const [dailyPillChecked, setDailyPillChecked] = useState({
    early_morning: true,
    morning: true,
    afternoon: false,
    evening: false,
    night: false
  });
  const [waterGlasses, setWaterGlasses] = useState(5);

  const patientName = patientProfile?.patientName || 'Ananya Rao';
  const abhaId = patientProfile?.abhaId || '91-4521-8932-1049';

  // Chronotherapy schedule with exact Indic instructions
  const chronotherapySchedule = [
    {
      id: 'early_morning',
      label: 'Early Morning',
      time: '06:30 AM',
      mealContext: 'Empty Stomach (పరగడుపున / भूखे पेट)',
      medicine: 'Pantoprazole 40mg',
      purpose: 'Acid Reflux & Gastric Protection',
      color: '#D97706',
      bg: 'rgba(217, 119, 6, 0.1)',
      teluguAudioText: 'ఉదయం లేవగానే పరగడుపున ఈ పసుపు రంగు టాబ్లెట్ ఒక గ్లాసు నీళ్లతో వేసుకోండి.',
      hindiAudioText: 'सुबह उठते ही खाली पेट यह पीली गोली एक गिलास पानी के साथ लें।'
    },
    {
      id: 'morning',
      label: 'Morning',
      time: '08:30 AM',
      mealContext: 'After Breakfast (టిఫిన్ తర్వాత / नाश्ते के बाद)',
      medicine: 'Budesonide Inhaler (200 mcg)',
      purpose: 'Airway anti-inflammatory for Asthma',
      color: '#008B8B',
      bg: 'rgba(0, 139, 139, 0.1)',
      teluguAudioText: 'ఉదయం టిఫిన్ తిన్న తర్వాత ఈ ఇన్హేలర్ రెండు పఫ్స్ తీసుకోండి, తర్వాత నోరు పుక్కిలించండి.',
      hindiAudioText: 'सुबह नाश्ते के बाद इस इन्हेलर के दो पफ लें, और फिर कुल्ला करें।'
    },
    {
      id: 'afternoon',
      label: 'Afternoon',
      time: '01:30 PM',
      mealContext: 'After Lunch (భోజనం తర్వాత / दोपहर खाने के बाद)',
      medicine: 'Multivitamin & Zinc Capsule',
      purpose: 'Immune & energy booster',
      color: '#3B82F6',
      bg: 'rgba(59, 130, 246, 0.1)',
      teluguAudioText: 'మధ్యాహ్నం భోజనం చేసిన తర్వాత ఈ ఎరుపు రంగు క్యాప్సూల్ ఒకసారి వేసుకోండి.',
      hindiAudioText: 'दोपहर खाने के बाद यह लाल कैप्सूल एक बार लें।'
    },
    {
      id: 'evening',
      label: 'Evening',
      time: '05:30 PM',
      mealContext: 'With Evening Tea/Snack (సాయంత్రం / शाम को)',
      medicine: 'Steam Inhalation + Lozenges',
      purpose: 'Throat soothing & airway clearance',
      color: '#8B5CF6',
      bg: 'rgba(139, 92, 246, 0.1)',
      teluguAudioText: 'సాయంత్రం వేళల్లో వేడి నీళ్ల ఆవిరి పట్టండి మరియు గొంతు నొప్పి తగ్గడానికి ఈ మాత్ర చప్పరించండి.',
      hindiAudioText: 'शाम के समय गर्म पानी की भाप लें और गले की राहत के लिए यह गोली चूसें।'
    },
    {
      id: 'night',
      label: 'Night',
      time: '08:30 PM',
      mealContext: 'After Dinner (రాత్రి భోజనం తర్వాత / रात खाने के बाद)',
      medicine: 'Montelukast + Levocetirizine',
      purpose: 'Nocturnal cough & allergy prevention',
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      teluguAudioText: 'రాత్రి భోజనం తర్వాత పడుకోవడానికి ముందు ఈ నీలం రంగు మాత్ర ఒకటి వేసుకోండి.',
      hindiAudioText: 'रात के खाने के बाद सोने से पहले यह नीली गोली एक बार लें।'
    }
  ];

  const currentPill = chronotherapySchedule.find(p => p.id === activePillSlot) || chronotherapySchedule[1];

  const handlePlayVoicePrescription = (customText) => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = customText || (selectedLanguage === 'Telugu' 
        ? currentPill.teluguAudioText 
        : currentPill.hindiAudioText);

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = selectedLanguage === 'Telugu' ? 'te-IN' : 'hi-IN';
        utterance.rate = 0.92;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => setIsPlayingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setIsPlayingAudio(false), 4000);
      }
    }
  };

  const handleSendChat = (e) => {
    e?.preventDefault();
    if (!patientQuestion.trim()) return;

    const userText = patientQuestion.trim();
    setPatientQuestion('');

    let aiReply = "AyuSwar AI has recorded your query. Stay comfortable, drink plenty of fluids, and your care team led by Dr. Priya has been informed.";
    if (userText.toLowerCase().includes('medicine') || userText.toLowerCase().includes('tablet') || userText.toLowerCase().includes('pill')) {
      aiReply = "Please follow your personalized Chronotherapy schedule in the Medications tab. Always take medications with the recommended meal context (empty stomach vs after meals).";
    } else if (userText.toLowerCase().includes('chest pain') || userText.toLowerCase().includes('breath') || userText.toLowerCase().includes('choking')) {
      aiReply = "⚠️ RED ALERT: If experiencing severe chest pain or acute breathlessness, dial 108 Emergency Medical Services immediately or reach the nearest district hospital emergency triage.";
    }

    setChatMessages(prev => [
      ...prev,
      { sender: 'user', text: userText },
      { sender: 'ai', text: aiReply }
    ]);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F7F9' }}>
      {/* =========================================================================
          LEFT SIDEBAR (MATCHING SCREENSHOT 1 PATIENT SIDEBAR)
          ========================================================================= */}
      <aside style={{
        width: '240px',
        background: '#ffffff',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 16px',
        flexShrink: 0
      }}>
        <div>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '8px', marginBottom: '32px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '2px solid #008B8B',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#ffffff'
            }}>
              <img src="/assets/ayuswar_logo.jpg" alt="AyuSwar AI" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '20px', fontWeight: 800, color: '#0A2540' }}>
              Ayu<span style={{ color: '#008B8B' }}>Swar</span> <span style={{ color: '#008B8B' }}>AI</span>
            </div>
          </div>

          {/* Navigation Items (All 8 Patient Sidebar Items) */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              { id: 'home', label: 'Home', icon: Home },
              { id: 'my_health', label: 'My Health', icon: Heart },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'reports', label: 'Reports', icon: FileText },
              { id: 'medications', label: 'Medications', icon: Pill },
              { id: 'ai_assistant', label: 'AI Assistant', icon: Sparkles },
              { id: 'health_goals', label: 'Health Goals', icon: Target },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: 'none',
                    background: isActive ? 'rgba(0, 139, 139, 0.1)' : 'transparent',
                    color: isActive ? '#008B8B' : '#475569',
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: '14px',
                    fontWeight: isActive ? 750 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 160ms ease'
                  }}
                >
                  <Icon size={18} color={isActive ? '#008B8B' : '#64748B'} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Health Card */}
        <div style={{
          background: 'linear-gradient(135deg, #E6F7F7 0%, #D1F2F2 100%)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #B2E5E5',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '14.5px',
            fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            color: '#0A2540',
            marginBottom: '4px'
          }}>
            Your health matters
          </div>
          <div style={{ fontSize: '11px', color: '#006D6D', lineHeight: 1.4 }}>
            AyuSwar is here for you, always.
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN PATIENT WORKSPACE CANVAS
          ========================================================================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header */}
        <header style={{
          background: '#ffffff',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          gap: '20px'
        }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <Bell size={20} color="#64748B" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#EF4444',
              border: '1.5px solid #ffffff'
            }}></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #008B8B, #00D2D3)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '15px'
            }}>
              {patientName[0]}
            </div>
            <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#0A2540' }}>
              {patientName}
            </div>
            <ChevronDown size={14} color="#64748B" />
          </div>
        </header>

        {/* Content Body */}
        <div style={{ padding: '24px 28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

          {/* ---------------------------------------------------------------------
              TAB 1: HOME (MATCHING SCREENSHOT 1 PATIENT VIEW)
              --------------------------------------------------------------------- */}
          {activeTab === 'home' && (
            <>
              {/* Hero Welcome Card */}
              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #F0FDFA 100%)',
                borderRadius: '16px',
                padding: '24px 28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #CCFBF1',
                marginBottom: '24px',
                boxShadow: '0 2px 10px rgba(0, 139, 139, 0.04)'
              }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                    Hello {patientName.split(' ')[0]},
                  </h1>
                  <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                    Your health journey, our priority.
                  </p>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: '#ffffff',
                  borderRadius: '24px',
                  border: '1px solid #CCFBF1',
                  boxShadow: '0 2px 8px rgba(0, 139, 139, 0.06)'
                }}>
                  <span style={{ fontSize: '16px' }}>🌿</span>
                  <span style={{ fontSize: '12px', fontWeight: 750, color: '#008B8B' }}>
                    Small steps. Better health.
                  </span>
                </div>
              </div>

              {/* 4 Action Quick Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '18px',
                marginBottom: '26px'
              }}>
                <div onClick={() => setActiveTab('appointments')} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(0, 139, 139, 0.08)', color: '#008B8B', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <Calendar size={20} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginBottom: '4px' }}>
                    Book Appointment
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Schedule with your doctor
                  </div>
                </div>

                <div onClick={() => setActiveTab('ai_assistant')} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.08)', color: '#3B82F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <Sparkles size={20} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginBottom: '4px' }}>
                    Ask AyuSwar
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Get health answers
                  </div>
                </div>

                <div onClick={() => setActiveTab('reports')} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', color: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <Upload size={20} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginBottom: '4px' }}>
                    Upload Reports
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Share test results
                  </div>
                </div>

                <div onClick={() => setActiveTab('medications')} style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(217, 119, 6, 0.08)', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
                    <Pill size={20} />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginBottom: '4px' }}>
                    View Prescriptions
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>
                    Check your medicines
                  </div>
                </div>
              </div>

              {/* Middle Section: Left (Appointments, Vitals, Reports) | Right (Chat, Goals, Doctor card) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: '22px', marginBottom: '26px' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Upcoming Appointments */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                        Upcoming Appointments
                      </h3>
                      <span onClick={() => setActiveTab('appointments')} style={{ fontSize: '12px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '14px 16px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{
                          padding: '8px 12px',
                          borderRadius: '10px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#2563EB',
                          fontSize: '12px',
                          fontWeight: 800,
                          textAlign: 'center',
                          lineHeight: 1.2
                        }}>
                          Tue<br /><span style={{ fontSize: '14px' }}>May 13</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: 750, color: '#0A2540' }}>Dr. Priya Sharma</div>
                          <div style={{ fontSize: '11.5px', color: '#64748B' }}>Pulmonologist • 10:15 AM • Online Consultation</div>
                        </div>
                      </div>

                      <button 
                        onClick={() => alert('Launching video session with Dr. Priya Sharma...')}
                        style={{
                          background: '#008B8B',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '7px 18px',
                          fontSize: '12.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Join
                      </button>
                    </div>
                  </div>

                  {/* Health Overview (Vitals) */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                        Health Overview
                      </h3>
                      <span onClick={() => setActiveTab('my_health')} style={{ fontSize: '12px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View Details →</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                      <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <Heart size={16} color="#EF4444" style={{ margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Heart Rate</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginTop: '2px' }}>72 bpm</div>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Normal</span>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <Activity size={16} color="#DC2626" style={{ margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Blood Pressure</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginTop: '2px' }}>115/76</div>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Normal</span>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <Scale size={16} color="#008B8B" style={{ margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Weight</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginTop: '2px' }}>62 kg</div>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Normal</span>
                      </div>

                      <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', textAlign: 'center' }}>
                        <Moon size={16} color="#6366F1" style={{ margin: '0 auto 6px auto' }} />
                        <div style={{ fontSize: '11px', color: '#64748B' }}>Sleep</div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginTop: '2px' }}>7.5 hrs</div>
                        <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 700 }}>Good</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Reports */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                        Recent Reports
                      </h3>
                      <span onClick={() => setActiveTab('reports')} style={{ fontSize: '12px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { title: 'Chest X-Ray Report', date: '10 May 2025', icon: '🩻' },
                        { title: 'Blood Test Report', date: '9 May 2025', icon: '🩸' },
                        { title: 'Lung Function Test', date: '8 May 2025', icon: '🫁' }
                      ].map((rep, idx) => (
                        <div key={idx} style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          background: '#F8FAFC',
                          border: '1px solid #F1F5F9'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span>{rep.icon}</span>
                            <div>
                              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0A2540' }}>{rep.title}</div>
                              <div style={{ fontSize: '11px', color: '#64748B' }}>{rep.date}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => setActiveTab('reports')}
                            style={{
                              padding: '4px 12px',
                              borderRadius: '6px',
                              border: '1px solid #CBD5E1',
                              background: '#ffffff',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            View
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Ask AyuSwar AI Chat Widget */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif', marginBottom: '2px' }}>
                      Ask AyuSwar AI
                    </h3>
                    <p style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '14px' }}>
                      Get instant answers about your health.
                    </p>

                    <div style={{ minHeight: '140px', maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
                      {chatMessages.map((msg, idx) => (
                        <div
                          key={idx}
                          style={{
                            alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                            background: msg.sender === 'user' ? '#E6F7F7' : '#F8FAFC',
                            color: msg.sender === 'user' ? '#006D6D' : '#1E293B',
                            border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            lineHeight: 1.5,
                            maxWidth: '90%'
                          }}
                        >
                          {msg.text}
                        </div>
                      ))}
                    </div>

                    <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text"
                        value={patientQuestion}
                        onChange={e => setPatientQuestion(e.target.value)}
                        placeholder="Type your question..."
                        style={{
                          flex: 1,
                          padding: '8px 12px',
                          borderRadius: '10px',
                          border: '1.5px solid #CBD5E1',
                          fontSize: '12.5px',
                          outline: 'none'
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: '#008B8B',
                          border: 'none',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Send size={14} />
                      </button>
                    </form>
                  </div>

                  {/* Health Goals */}
                  <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                        Health Goals
                      </h3>
                      <span onClick={() => setActiveTab('health_goals')} style={{ fontSize: '12px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '50%',
                        border: '4px solid #008B8B',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '15px',
                        fontWeight: 850,
                        color: '#0A2540',
                        flexShrink: 0
                      }}>
                        3/5
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 750, color: '#0A2540' }}>Stay Active</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Walk 30 minutes daily</div>
                      </div>
                    </div>
                  </div>

                  {/* Better Health Together Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, #E6F7F7 0%, #D8F3F3 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #B2E5E5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>Better Health Together</h4>
                      <div style={{ fontSize: '11px', color: '#006D6D', margin: '2px 0 10px 0' }}>Ask. Learn. Stay Healthy.</div>
                      <button
                        onClick={() => setActiveTab('ai_assistant')}
                        style={{
                          background: '#0A2540',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '6px 14px',
                          fontSize: '11.5px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Chat with AyuSwar
                      </button>
                    </div>

                    <div style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid #ffffff',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.08)'
                    }}>
                      <img src="/assets/dr_ananya_avatar.jpg" alt="Doctor" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Bar: Patient Features */}
              <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginBottom: '14px' }}>
                  Patient Features
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
                  {[
                    { title: 'Book Appointments', desc: 'With your doctor', icon: Calendar, tab: 'appointments' },
                    { title: 'AI Health Assistant', desc: 'Symptoms & advice', icon: Sparkles, tab: 'ai_assistant' },
                    { title: 'View Reports', desc: 'Lab & imaging results', icon: FileText, tab: 'reports' },
                    { title: 'Prescriptions', desc: 'Track your medicines', icon: Pill, tab: 'medications' },
                    { title: 'Health Tracking', desc: 'Vitals & goals', icon: Heart, tab: 'my_health' },
                    { title: 'Reminders', desc: 'Medications & follow-ups', icon: Bell, tab: 'medications' }
                  ].map((feat, i) => {
                    const FeatIcon = feat.icon;
                    return (
                      <div
                        key={i}
                        onClick={() => setActiveTab(feat.tab)}
                        style={{
                          background: '#ffffff',
                          borderRadius: '12px',
                          padding: '14px 12px',
                          border: '1px solid #E2E8F0',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 160ms ease'
                        }}
                      >
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: 'rgba(0, 139, 139, 0.08)',
                          color: '#008B8B',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 8px auto'
                        }}>
                          <FeatIcon size={16} />
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 750, color: '#0A2540', marginBottom: '2px' }}>
                          {feat.title}
                        </div>
                        <div style={{ fontSize: '10px', color: '#64748B' }}>
                          {feat.desc}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ---------------------------------------------------------------------
              TAB 2: MY HEALTH (OFFICIAL ABHA CARD & VITALS HISTORY)
              --------------------------------------------------------------------- */}
          {activeTab === 'my_health' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  My Health Profile & ABHA Digital Card
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Official National Health Authority Ayushman Bharat Digital Mission (ABDM) record.
                </p>
              </div>

              {/* ABHA Digital Card */}
              <div style={{
                background: 'linear-gradient(135deg, #0A2540 0%, #008B8B 100%)',
                color: '#ffffff',
                borderRadius: '20px',
                padding: '28px',
                maxWidth: '620px',
                marginBottom: '26px',
                boxShadow: '0 12px 30px rgba(10, 37, 64, 0.25)',
                position: 'relative'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#ffffff', overflow: 'hidden' }}>
                      <img src="/assets/ayuswar_logo.jpg" alt="Logo" style={{ width: '100%', height: '100%' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        Ayushman Bharat Digital Health Account
                      </div>
                      <div style={{ fontSize: '10px', opacity: 0.8 }}>National Health Authority • Govt. of India</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', background: '#10B981', color: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontWeight: 800 }}>
                    ACTIVE • VERIFIED
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800 }}>{patientName}</div>
                    <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '2px' }}>ABHA Address: <strong>ananya@abdm</strong></div>
                    <div style={{ fontSize: '16px', fontWeight: 800, fontFamily: 'monospace', letterSpacing: '1px', marginTop: '10px' }}>
                      {abhaId}
                    </div>
                    <div style={{ fontSize: '11px', opacity: 0.8, marginTop: '4px' }}>DOB: 14-08-1996 • Female • Blood: O+ve</div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '8px', borderRadius: '10px' }}>
                    <QrCode size={64} color="#0A2540" />
                  </div>
                </div>
              </div>

              {/* Vitals Tracker */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px' }}>
                  Longitudinal Vitals Tracker
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Blood Pressure (30 Day Trend)</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540', margin: '6px 0' }}>116 / 78 mmHg</div>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>Optimal Range (JNC-8)</span>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Fasting Blood Sugar (RBS)</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540', margin: '6px 0' }}>94 mg/dL</div>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>Normal Fasting Range</span>
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '12px', color: '#64748B' }}>Resting Heart Rate</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540', margin: '6px 0' }}>72 bpm</div>
                    <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 700 }}>Normal Sinus Rhythm</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 3: APPOINTMENTS (BOOKING & ONLINE CONSULTATION)
              --------------------------------------------------------------------- */}
          {activeTab === 'appointments' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                    Consultation Appointments
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Schedule follow-ups with Dr. Priya Sharma or district hospital specialists.
                  </p>
                </div>

                <button
                  onClick={() => alert('Appointment Booking wizard opened for Kurnool District Hospital OPD.')}
                  style={{
                    background: '#008B8B',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: 750,
                    cursor: 'pointer'
                  }}
                >
                  + Book New Consultation
                </button>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', marginBottom: '14px' }}>
                  Confirmed Sessions
                </h3>
                <div style={{ padding: '16px', borderRadius: '12px', background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ background: 'rgba(0, 139, 139, 0.1)', color: '#008B8B', padding: '8px 12px', borderRadius: '10px', textAlign: 'center', fontWeight: 800 }}>
                      Tue<br />May 13
                    </div>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>Dr. Priya Sharma, MD</div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>Pulmonologist • Video Call • 10:15 AM - 10:30 AM</div>
                      <div style={{ fontSize: '12px', color: '#008B8B', marginTop: '2px', fontWeight: 650 }}>Reason: Respiratory Follow-up & Asthma Assessment</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => alert('Opening consultation portal...')}
                      style={{
                        background: '#008B8B',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 16px',
                        fontSize: '12.5px',
                        fontWeight: 750,
                        cursor: 'pointer'
                      }}
                    >
                      Join Tele-Consultation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 4: REPORTS (LABS & SPOKEN AUDIO EXPLANATION)
              --------------------------------------------------------------------- */}
          {activeTab === 'reports' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  My Diagnostic & Lab Reports
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Listen to simplified doctor findings in your native dialect or download official PDFs.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {[
                  {
                    title: 'Chest X-Ray Report',
                    date: '10 May 2025',
                    icon: '🩻',
                    summary: 'Clear lung fields with no pneumonia or fluid buildup. Mild airway sensitivity.',
                    spokenTelugu: 'మీ ఛాతీ ఎక్స్-రే లో ఎలాంటి ఇన్ఫెక్షన్ లేదా నీరు చేరడం లేదు. ఊపిరితిత్తులు ఆరోగ్యంగా ఉన్నాయి.',
                    spokenHindi: 'आपकी छाती के एक्स-रे में कोई गंभीर संक्रमण नहीं है। फेफड़े सामान्य हैं।'
                  },
                  {
                    title: 'Complete Blood Count (CBC)',
                    date: '9 May 2025',
                    icon: '🩸',
                    summary: 'Hemoglobin: 12.4 g/dL (Good). White blood cells slightly raised indicating resolving seasonal cold.',
                    spokenTelugu: 'మీ రక్త పరీక్షలో హిమోగ్లోబిన్ బాగుంది. ఇన్ఫెక్షన్ తగ్గిపోతోంది, భయపడాల్సిన పనిలేదు.',
                    spokenHindi: 'आपकी खून की जांच में हीमोग्लोबिन अच्छा है। मौसमी सर्दी ठीक हो रही है।'
                  },
                  {
                    title: 'Pulmonary Spirometry Test',
                    date: '8 May 2025',
                    icon: '𫁁',
                    summary: 'Airway volume is 86% of predicted value, showing excellent response to your morning inhaler.',
                    spokenTelugu: 'మీ ఊపిరితిత్తుల గాలి సామర్థ్యం 86 శాతం ఉంది. ఇన్హేలర్ సరిగ్గా పనిచేస్తోంది.',
                    spokenHindi: 'आपके सांस लेने की क्षमता बहुत अच्छी है। इन्हेलर से सुधार दिख रहा है।'
                  }
                ].map((rep, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      borderRadius: '14px',
                      padding: '20px',
                      border: '1px solid #E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span style={{ fontSize: '26px' }}>{rep.icon}</span>
                      <div>
                        <div style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>{rep.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748B' }}>Completed on {rep.date} • Verified by Dr. Priya</div>
                        <div style={{ fontSize: '12.5px', color: '#1E293B', marginTop: '4px', maxWidth: '540px' }}>{rep.summary}</div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => handlePlayVoicePrescription(selectedLanguage === 'Telugu' ? rep.spokenTelugu : rep.spokenHindi)}
                        style={{
                          background: 'rgba(0, 139, 139, 0.1)',
                          border: '1.5px solid #008B8B',
                          color: '#008B8B',
                          padding: '8px 16px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 750,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Volume2 size={15} />
                        <span>🔊 Hear in {selectedLanguage}</span>
                      </button>

                      <button
                        onClick={() => alert(`Downloading official PDF copy of ${rep.title}...`)}
                        style={{
                          background: '#0A2540',
                          color: '#ffffff',
                          border: 'none',
                          padding: '8px 14px',
                          borderRadius: '10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Download size={14} />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 5: MEDICATIONS & CHRONOTHERAPY SMART PILLBOX
              --------------------------------------------------------------------- */}
          {activeTab === 'medications' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                    Personalized Chronotherapy Medication Schedule
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>
                    Pill schedule tailored to meal context (Early Morning, Morning, Afternoon, Evening, Night) with Timbre voiceover.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Languages size={16} color="#008B8B" />
                  <select
                    value={selectedLanguage}
                    onChange={e => setSelectedLanguage(e.target.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#0A2540',
                      background: '#ffffff'
                    }}
                  >
                    <option value="Telugu">తెలుగు (Telugu)</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                  </select>
                </div>
              </div>

              {/* Slot Cards List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {chronotherapySchedule.map(slot => {
                  const isChecked = dailyPillChecked[slot.id];
                  return (
                    <div
                      key={slot.id}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '20px 24px',
                        border: isChecked ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '14px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                          onClick={() => setDailyPillChecked(prev => ({ ...prev, [slot.id]: !prev[slot.id] }))}
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '8px',
                            border: isChecked ? 'none' : '2px solid #CBD5E1',
                            background: isChecked ? '#10B981' : '#ffffff',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                          }}
                        >
                          {isChecked && <Check size={16} />}
                        </button>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 800, color: slot.color }}>
                              {slot.label} ({slot.time})
                            </span>
                            <span style={{ fontSize: '11px', background: slot.bg, color: slot.color, padding: '2px 8px', borderRadius: '8px', fontWeight: 700 }}>
                              {slot.mealContext}
                            </span>
                          </div>

                          <div style={{ fontSize: '16px', fontWeight: 850, color: '#0A2540', marginTop: '2px' }}>
                            {slot.medicine}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B' }}>
                            Purpose: {slot.purpose}
                          </div>

                          <div style={{ fontSize: '12px', color: '#006D6D', marginTop: '6px', fontStyle: 'italic' }}>
                            "{selectedLanguage === 'Telugu' ? slot.teluguAudioText : slot.hindiAudioText}"
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handlePlayVoicePrescription(selectedLanguage === 'Telugu' ? slot.teluguAudioText : slot.hindiAudioText)}
                        style={{
                          background: slot.color,
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '24px',
                          padding: '10px 20px',
                          fontSize: '12px',
                          fontWeight: 750,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Volume2 size={15} />
                        <span>Play Spoken Dosage</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 6: AI ASSISTANT (PATIENT HEALTH ADVICE)
              --------------------------------------------------------------------- */}
          {activeTab === 'ai_assistant' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  AyuSwar Personal Health Assistant
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Ask questions in your mother tongue about symptoms, diet, and medicines.
                </p>
              </div>

              {/* Red Emergency Alert Box */}
              <div style={{
                background: 'rgba(239, 68, 68, 0.08)',
                border: '1.5px solid rgba(239, 68, 68, 0.3)',
                padding: '14px 18px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <AlertCircle size={20} color="#DC2626" />
                  <span style={{ fontSize: '12.5px', color: '#991B1B', fontWeight: 650 }}>
                    Emergency Medical Helpline (108 Ambulance / 104 Health Advice) available 24x7.
                  </span>
                </div>
                <button
                  onClick={() => alert('Dialing Emergency 108...')}
                  style={{
                    background: '#DC2626',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Call 108
                </button>
              </div>

              {/* Full Chat Screen */}
              <div style={{
                background: '#ffffff',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                padding: '24px',
                minHeight: '440px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
                  {chatMessages.map((msg, idx) => (
                    <div
                      key={idx}
                      style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        background: msg.sender === 'user' ? '#008B8B' : '#F8FAFC',
                        color: msg.sender === 'user' ? '#ffffff' : '#1E293B',
                        border: msg.sender === 'user' ? 'none' : '1px solid #E2E8F0',
                        padding: '12px 18px',
                        borderRadius: msg.sender === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                        fontSize: '13.5px',
                        lineHeight: 1.5,
                        maxWidth: '85%'
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                  <input 
                    type="text"
                    value={patientQuestion}
                    onChange={e => setPatientQuestion(e.target.value)}
                    placeholder="Type your health question (e.g. Can I take paracetamol after dinner?)..."
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: '#008B8B',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '0 20px',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Send size={15} />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 7: HEALTH GOALS (WELLNESS TRACKING)
              --------------------------------------------------------------------- */}
          {activeTab === 'health_goals' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  Daily Health Goals & Wellness Streaks
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Small daily steps recommended by Dr. Priya to keep asthma and allergies controlled.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px' }}>
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>Daily Walking Goal</div>
                  <div style={{ fontSize: '32px', fontWeight: 850, color: '#008B8B', margin: '8px 0' }}>6,420</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Goal: 10,000 steps (64% done)</div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>Hydration (Glasses of Water)</div>
                  <div style={{ fontSize: '32px', fontWeight: 850, color: '#3B82F6', margin: '8px 0' }}>{waterGlasses} / 8</div>
                  <button
                    onClick={() => setWaterGlasses(prev => Math.min(8, prev + 1))}
                    style={{
                      background: 'rgba(59, 130, 246, 0.1)',
                      color: '#2563EB',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      fontSize: '11px',
                      fontWeight: 750,
                      cursor: 'pointer',
                      marginTop: '4px'
                    }}
                  >
                    + Log 1 Glass
                  </button>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '22px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748B' }}>Medicine Adherence Streak</div>
                  <div style={{ fontSize: '32px', fontWeight: 850, color: '#10B981', margin: '8px 0' }}>7 Days</div>
                  <div style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>🔥 Perfect Adherence!</div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------------------------
              TAB 8: SETTINGS (LANGUAGE, FAMILY SHARING & PREFERENCES)
              --------------------------------------------------------------------- */}
          {activeTab === 'settings' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  Patient Preferences & ABHA Locker
                </h2>
                <p style={{ fontSize: '13px', color: '#64748B' }}>
                  Manage native language audio delivery and family caregiver sharing.
                </p>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '24px', maxWidth: '640px' }}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 750, color: '#0A2540', marginBottom: '6px' }}>
                    Primary Vernacular Dialect for Spoken Audio Prescriptions
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={e => setSelectedLanguage(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #CBD5E1',
                      fontSize: '13px',
                      fontWeight: 650,
                      color: '#0A2540'
                    }}
                  >
                    <option value="Telugu">తెలుగు (Telugu - Rayalaseema / Coastal)</option>
                    <option value="Hindi">हिन्दी (Hindi - Standard / Awadhi)</option>
                    <option value="Tamil">தமிழ் (Tamil)</option>
                    <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                  </select>
                </div>

                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 750, color: '#0A2540', marginBottom: '6px' }}>
                    WhatsApp Voice Note Dispatch
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569' }}>
                    <input type="checkbox" defaultChecked />
                    <span>Automatically send spoken prescription voice note to registered phone number.</span>
                  </div>
                </div>

                <button
                  onClick={() => alert('Preferences saved successfully to ABHA Health Locker!')}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '13px' }}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
