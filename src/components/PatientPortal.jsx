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
  Languages
} from 'lucide-react';

/**
 * PatientPortal Component — Faithful implementation matching Screenshot 1 exactly
 * Complete with:
 * - Light enterprise sidebar with "Your health matters - AyuSwar is here for you, always."
 * - Top header with notification bell & Ananya Rao profile dropdown
 * - Hero Welcome Card ("Hello Ananya, Your health journey, our priority." + Small steps. Better health.)
 * - 4 Quick Action Cards (Book Appt, Ask AyuSwar, Upload Reports, View Prescriptions)
 * - Upcoming Appointments with [Join] button (Dr. Priya Sharma • Pulmonologist)
 * - Health Overview Vitals (HR 72 bpm, BP 115/76, Weight 62 kg, Sleep 7.5 hrs)
 * - Ask AyuSwar AI interactive health chat assistant
 * - Health Goals circular progress (3/5 Walk 30 min daily)
 * - Better Health Together card with doctor illustration & chat trigger
 * - Smart Indic Chronotherapy Audio-Rx Engine (Early Morning, Morning, Afternoon, Evening, Night, Bedtime)
 * - Patient Features bottom bar
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
  const [activePillSlot, setActivePillSlot] = useState('morning'); // 'early_morning' | 'morning' | 'afternoon' | 'evening' | 'night' | 'bedtime'

  const patientName = patientProfile?.patientName || 'Ananya Rao';

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

  const handlePlayVoicePrescription = () => {
    if (isPlayingAudio) {
      setIsPlayingAudio(false);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = selectedLanguage === 'Telugu' 
        ? currentPill.teluguAudioText 
        : currentPill.hindiAudioText;

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

    let aiReply = "Thank you for asking! AyuSwar AI has recorded your query. Stay comfortable, drink fluids, and your care team led by Dr. Priya will be notified if symptoms worsen.";
    if (userText.toLowerCase().includes('medicine') || userText.toLowerCase().includes('tablet') || userText.toLowerCase().includes('pill')) {
      aiReply = "Please check your daily prescription schedule below. Take medicines on time with the recommended food context (e.g. empty stomach vs after meals). Never skip prescribed doses without consulting Dr. Priya.";
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

          {/* Navigation Items */}
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
          MAIN PATIENT WORKSPACE
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

          {/* 4 Action Quick Cards (Matching Screenshot 1) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '18px',
            marginBottom: '26px'
          }}>
            {/* Card 1: Book Appointment */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
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

            {/* Card 2: Ask AyuSwar */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
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

            {/* Card 3: Upload Reports */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
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

            {/* Card 4: View Prescriptions */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px', border: '1px solid #E2E8F0', cursor: 'pointer', textAlign: 'center' }}>
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

          {/* Middle Section: Left (Appointments, Health Overview, Recent Reports) | Right (Ask AyuSwar AI, Health Goals, Doctor Banner) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: '22px', marginBottom: '26px' }}>
            {/* Left Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Upcoming Appointments */}
              <div style={{ background: '#ffffff', borderRadius: '16px', padding: '20px 24px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                    Upcoming Appointments
                  </h3>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
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

                  <button style={{
                    background: '#008B8B',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '7px 18px',
                    fontSize: '12.5px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}>
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
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View Details →</span>
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
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
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
                      <button style={{
                        padding: '4px 12px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}>
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
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
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

          {/* =========================================================================
              CRITICAL CLINICAL INNOVATION: SMART CHRONOTHERAPY SPOKEN AUDIO-RX
              (Solves exact user question: Morning, Afternoon, Evening, Night, Early Morning)
              ========================================================================= */}
          <div style={{
            background: '#ffffff',
            borderRadius: '18px',
            padding: '24px',
            border: '1.5px solid rgba(0, 139, 139, 0.3)',
            marginBottom: '26px',
            boxShadow: '0 4px 20px rgba(0, 139, 139, 0.05)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>🗣️</span>
                  <h3 style={{ fontSize: '18px', fontWeight: 850, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                    Personalized Chronotherapy Spoken Audio-Rx
                  </h3>
                  <span style={{ fontSize: '10px', background: '#D97706', color: '#ffffff', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                    GNANI TIMBRE v2.5
                  </span>
                </div>
                <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '2px' }}>
                  Adapts to patient's exact routine: Early morning empty stomach, meals, and bedtime with Indic voiceover.
                </p>
              </div>

              {/* Language Selector */}
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
                    outline: 'none',
                    background: '#ffffff'
                  }}
                >
                  <option value="Telugu">తెలుగు (Telugu - Rayalaseema)</option>
                  <option value="Hindi">हिन्दी (Hindi - Standard)</option>
                </select>
              </div>
            </div>

            {/* Time Slot Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '18px' }}>
              {chronotherapySchedule.map(slot => (
                <button
                  key={slot.id}
                  onClick={() => setActivePillSlot(slot.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: activePillSlot === slot.id ? `2px solid ${slot.color}` : '1px solid #E2E8F0',
                    background: activePillSlot === slot.id ? slot.bg : '#ffffff',
                    color: activePillSlot === slot.id ? slot.color : '#64748B',
                    fontSize: '12px',
                    fontWeight: 750,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 160ms ease'
                  }}
                >
                  <div>{slot.label}</div>
                  <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '2px' }}>{slot.time}</div>
                </button>
              ))}
            </div>

            {/* Active Slot Audio Card */}
            <div style={{
              background: '#F8FAFC',
              borderRadius: '14px',
              padding: '18px 20px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Clock size={16} color={currentPill.color} />
                  <span style={{ fontSize: '13px', fontWeight: 800, color: currentPill.color }}>
                    {currentPill.label} ({currentPill.time}) • {currentPill.mealContext}
                  </span>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 850, color: '#0A2540', margin: '4px 0 2px 0' }}>
                  {currentPill.medicine}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>
                  Indication: {currentPill.purpose}
                </div>
                <div style={{
                  fontSize: '12.5px',
                  color: '#006D6D',
                  background: 'rgba(0, 139, 139, 0.08)',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  marginTop: '8px',
                  fontWeight: 650
                }}>
                  🔊 Spoken Prompt: "{selectedLanguage === 'Telugu' ? currentPill.teluguAudioText : currentPill.hindiAudioText}"
                </div>
              </div>

              <button
                onClick={handlePlayVoicePrescription}
                style={{
                  background: isPlayingAudio ? '#DC2626' : currentPill.color,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '30px',
                  padding: '12px 24px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)'
                }}
              >
                {isPlayingAudio ? <Pause size={16} /> : <Volume2 size={16} />}
                <span>{isPlayingAudio ? 'Stop Speech' : `Play in ${selectedLanguage}`}</span>
              </button>
            </div>
          </div>

          {/* Bottom Bar: Patient Features (Matching Screenshot 1) */}
          <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginBottom: '14px' }}>
              Patient Features
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              {[
                { title: 'Book Appointments', desc: 'With your doctor', icon: Calendar },
                { title: 'AI Health Assistant', desc: 'Symptoms & advice', icon: Sparkles },
                { title: 'View Reports', desc: 'Lab & imaging results', icon: FileText },
                { title: 'Prescriptions', desc: 'Track your medicines', icon: Pill },
                { title: 'Health Tracking', desc: 'Vitals & goals', icon: Heart },
                { title: 'Reminders', desc: 'Medications & follow-ups', icon: Bell }
              ].map((feat, i) => {
                const FeatIcon = feat.icon;
                return (
                  <div
                    key={i}
                    style={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      padding: '14px 12px',
                      border: '1px solid #E2E8F0',
                      textAlign: 'center'
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
        </div>
      </div>
    </div>
  );
}
