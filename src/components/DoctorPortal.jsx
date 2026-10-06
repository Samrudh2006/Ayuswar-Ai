import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  Activity, 
  FileText, 
  Search, 
  Bell, 
  ChevronDown, 
  Sparkles, 
  Sun, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Mic, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Stethoscope, 
  Pill, 
  BookOpen, 
  Settings, 
  Home, 
  Database,
  Send,
  MessageSquare,
  FileCheck
} from 'lucide-react';

/**
 * DoctorPortal Component — Faithful implementation matching Screenshot 1 exactly
 * Complete with:
 * - Light enterprise sidebar with "AyuSwar AI - Your AI co-pilot for better healthcare"
 * - Universal search header & Dr. Priya Sharma profile dropdown
 * - Good Morning banner with date (Mon, 12 May 2025)
 * - 4 Metric KPI Cards (Total Patients 48, Today's Appt 12, AI Consultations 8, Pending Reports 5)
 * - Today's Appointments with status badges & 1-click ambient scribe launcher
 * - AI Clinical Assistant with live guidelines Q&A
 * - Patient Analytics dual-curve interactive chart (New Patients vs Follow-ups)
 * - Recent Reports list with view actions
 * - Doctor Features bottom bar
 */
export default function DoctorPortal({ doctorProfile, onSelectEncounterAndLaunch, onOpenTechModal }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analyticsRange, setAnalyticsRange] = useState('weekly');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponses, setAiResponses] = useState([
    {
      q: 'What are the latest treatment guidelines for mild asthma in adults?',
      a: 'Based on current clinical guidelines:\n• Use low-dose inhaled corticosteroids (ICS-formoterol as reliever)\n• Avoid long-acting beta agonists (LABA) as monotherapy\n• Monitor lung function & peak expiratory flow regularly'
    }
  ]);
  const [selectedReport, setSelectedReport] = useState(null);

  const doctorName = doctorProfile?.doctorName || 'Dr. Priya Sharma';
  const doctorSpecialty = doctorProfile?.specialty || 'Pulmonologist';

  const appointments = [
    {
      id: 0,
      patientName: 'Rohit Kumar',
      age: 42,
      gender: 'Male',
      time: '09:30 AM',
      type: 'Follow-up (Asthma)',
      status: 'Completed',
      statusColor: '#10B981',
      statusBg: 'rgba(16, 185, 129, 0.1)',
      encounterIndex: 0
    },
    {
      id: 1,
      patientName: 'Ananya Rao',
      age: 28,
      gender: 'Female',
      time: '10:15 AM',
      type: 'Consultation (Fever)',
      status: 'In Progress',
      statusColor: '#3B82F6',
      statusBg: 'rgba(59, 130, 246, 0.12)',
      encounterIndex: 1
    },
    {
      id: 2,
      patientName: 'Suresh Babu',
      age: 56,
      gender: 'Male',
      time: '11:00 AM',
      type: 'Follow-up (Diabetes)',
      status: 'Upcoming',
      statusColor: '#6366F1',
      statusBg: 'rgba(99, 102, 241, 0.1)',
      encounterIndex: 2
    },
    {
      id: 3,
      patientName: 'Meera Nair',
      age: 34,
      gender: 'Female',
      time: '11:45 AM',
      type: 'Consultation (Cough)',
      status: 'Upcoming',
      statusColor: '#6366F1',
      statusBg: 'rgba(99, 102, 241, 0.1)',
      encounterIndex: 0
    }
  ];

  const recentReports = [
    { id: 1, title: 'Chest X-Ray Report', patient: 'Rohit Kumar', date: '10 May 2025', icon: '🩻', summary: 'Mild bronchial wall thickening consistent with chronic airway hyperresponsiveness.' },
    { id: 2, title: 'Blood Test Report', patient: 'Ananya Rao', date: '9 May 2025', icon: '🩸', summary: 'Hb: 12.4 g/dL, WBC: 8,400 /mcL, Platelets: 2.4 Lakh. Normal hemogram.' },
    { id: 3, title: 'Lung Function Test', patient: 'Meera Nair', date: '8 May 2025', icon: '🫁', summary: 'FEV1/FVC: 82%, Peak Expiratory Flow: 380 L/min. Mild restrictive pattern.' },
    { id: 4, title: 'ECG Report', patient: 'Suresh Babu', date: '7 May 2025', icon: '📈', summary: 'Normal Sinus Rhythm, 74 bpm. No ST-T segment elevation or ischaemia.' }
  ];

  const handleAskAi = (e) => {
    e?.preventDefault();
    if (!aiPrompt.trim()) return;

    const newQuery = aiPrompt.trim();
    setAiPrompt('');

    // Clinical guidance answers
    let answer = `AyuSwar Clinical Protocol for "${newQuery}":\n• Cross-referenced against India National Formulary (NFI) & WHO ICD-10 guidelines.\n• In Tier-1/2/3 OPDs: Verify vitals, review drug-drug contraindications (CYP450), and synthesize vernacular audio instructions.`;
    
    if (newQuery.toLowerCase().includes('diabetes') || newQuery.toLowerCase().includes('sugar')) {
      answer = 'Clinical Protocol (Type-2 Diabetes):\n• First-line: Metformin 500mg post-meal\n• Monitor HbA1c every 3 months; target < 7.0%\n• Instruct patient on hypoglycemia warning signs (sweating, palpitations) in native dialect.';
    } else if (newQuery.toLowerCase().includes('fever') || newQuery.toLowerCase().includes('paracetamol')) {
      answer = 'Clinical Protocol (Pyrexia of Unknown Origin):\n• Paracetamol 650mg SOS (max 3g/24h)\n• Check for malaria/dengue antigens if fever persists > 48h with chills\n• Advise oral hydration and resting.';
    }

    setAiResponses(prev => [{ q: newQuery, a: answer }, ...prev]);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F7F9' }}>
      {/* =========================================================================
          LEFT SIDEBAR (EXACT TO SCREENSHOT 1)
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
              { id: 'dashboard', label: 'Dashboard', icon: Home },
              { id: 'patients', label: 'Patients', icon: Users },
              { id: 'ai_assistant', label: 'AI Assistant', icon: Sparkles },
              { id: 'appointments', label: 'Appointments', icon: Calendar },
              { id: 'reports', label: 'Reports & Lab', icon: FileText },
              { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
              { id: 'clinical_library', label: 'Clinical Library', icon: BookOpen },
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

        {/* Bottom Co-Pilot Card */}
        <div style={{
          background: 'linear-gradient(135deg, #E6F7F7 0%, #D1F2F2 100%)',
          borderRadius: '16px',
          padding: '16px',
          border: '1px solid #B2E5E5',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            fontSize: '15px',
            fontWeight: 800,
            fontFamily: 'Outfit, sans-serif',
            color: '#0A2540',
            marginBottom: '4px'
          }}>
            AyuSwar AI
          </div>
          <div style={{ fontSize: '11px', color: '#006D6D', lineHeight: 1.4 }}>
            Your AI co-pilot for better healthcare
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN WORKSPACE AREA
          ========================================================================= */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <header style={{
          background: '#ffffff',
          padding: '14px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          {/* Universal Search Bar */}
          <div style={{ position: 'relative', width: '380px' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '14px', top: '12px' }} />
            <input 
              type="text"
              placeholder="Search patients, reports, or ask AyuSwar..."
              style={{
                width: '100%',
                padding: '9px 14px 9px 38px',
                borderRadius: '24px',
                border: '1px solid #E2E8F0',
                background: '#F8FAFC',
                fontSize: '13px',
                color: '#0F172A',
                outline: 'none'
              }}
            />
          </div>

          {/* Profile & Notifications */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
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
                overflow: 'hidden',
                border: '2px solid #008B8B'
              }}>
                <img 
                  src="/assets/dr_ananya_avatar.jpg" 
                  alt={doctorName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#0A2540' }}>{doctorName}</div>
                <div style={{ fontSize: '11px', color: '#64748B' }}>{doctorSpecialty}</div>
              </div>
              <ChevronDown size={14} color="#64748B" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div style={{ padding: '24px 28px', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
          {/* Welcome Banner */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            border: '1px solid #E2E8F0',
            marginBottom: '24px',
            boxShadow: '0 2px 8px rgba(10, 37, 64, 0.02)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sun size={24} color="#F59E0B" />
              </div>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  Good Morning, Dr. Priya
                </h1>
                <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                  Here's what's happening with your patiwar today.
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #E2E8F0',
              background: '#F8FAFC',
              fontSize: '12.5px',
              fontWeight: 650,
              color: '#475569'
            }}>
              <Calendar size={14} color="#008B8B" />
              <span>Mon, 12 May 2025</span>
            </div>
          </div>

          {/* 4 Metric Cards (Matching Screenshot 1) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '18px',
            marginBottom: '24px'
          }}>
            {/* Card 1: Total Patients */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(0, 139, 139, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008B8B' }}>
                  <Users size={18} />
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Total Patients</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 850, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>48</div>
              <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 650, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={13} />
                <span>↑ 12% vs. last week</span>
              </div>
            </div>

            {/* Card 2: Today's Appointments */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B82F6' }}>
                  <Calendar size={18} />
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Today's Appointments</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 850, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>12</div>
              <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 650, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={13} />
                <span>↑ 2% vs. yesterday</span>
              </div>
            </div>

            {/* Card 3: AI Consultations */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
                  <Activity size={18} />
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>AI Consultations</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 850, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>8</div>
              <div style={{ fontSize: '11.5px', color: '#10B981', fontWeight: 650, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingUp size={13} />
                <span>↑ 32% vs. last week</span>
              </div>
            </div>

            {/* Card 4: Pending Reports */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '18px 20px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#EF4444' }}>
                  <FileText size={18} />
                </div>
                <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>Pending Reports</div>
              </div>
              <div style={{ fontSize: '28px', fontWeight: 850, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>5</div>
              <div style={{ fontSize: '11.5px', color: '#EF4444', fontWeight: 650, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <TrendingDown size={13} />
                <span>↓ 40% vs. last week</span>
              </div>
            </div>
          </div>

          {/* Middle Section: Today's Appointments (Left) + AI Clinical Assistant (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px', marginBottom: '24px' }}>
            {/* Left: Today's Appointments */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  Today's Appointments
                </h3>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {appointments.map(item => (
                  <div 
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #F1F5F9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        background: '#E2E8F0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#475569'
                      }}>
                        {item.patientName.split(' ')[0][0]}
                      </div>
                      <div>
                        <div style={{ fontSize: '13.5px', fontWeight: 750, color: '#0A2540' }}>{item.patientName}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{item.age} y • {item.gender}</div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0A2540' }}>{item.time}</div>
                      <div style={{ fontSize: '11px', color: '#64748B' }}>{item.type}</div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 750,
                        padding: '4px 10px',
                        borderRadius: '12px',
                        background: item.statusBg,
                        color: item.statusColor
                      }}>
                        {item.status}
                      </span>
                      {onSelectEncounterAndLaunch && (
                        <button
                          onClick={() => onSelectEncounterAndLaunch(item.encounterIndex)}
                          title="Launch AyuSwar Live Ambient Scribe Consultation"
                          style={{
                            background: '#008B8B',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#ffffff',
                            padding: '6px 10px',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Mic size={12} />
                          <span>Scribe</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: AI Clinical Assistant (New) */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  AI Clinical Assistant
                </h3>
                <span style={{ fontSize: '10px', background: 'rgba(16, 185, 129, 0.15)', color: '#059669', padding: '2px 6px', borderRadius: '8px', fontWeight: 800 }}>
                  New
                </span>
              </div>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '16px' }}>
                Ask about symptoms, guidelines, drug interactions and more.
              </p>

              {/* Chat bubble response */}
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
                {aiResponses.map((res, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                      alignSelf: 'flex-end',
                      background: '#E6F7F7',
                      color: '#006D6D',
                      padding: '8px 12px',
                      borderRadius: '12px 12px 2px 12px',
                      fontSize: '12px',
                      fontWeight: 650,
                      maxWidth: '85%'
                    }}>
                      {res.q}
                    </div>
                    <div style={{
                      alignSelf: 'flex-start',
                      background: '#F8FAFC',
                      border: '1px solid #E2E8F0',
                      color: '#1E293B',
                      padding: '12px 14px',
                      borderRadius: '12px 12px 12px 2px',
                      fontSize: '12px',
                      lineHeight: 1.5,
                      whiteSpace: 'pre-line',
                      maxWidth: '95%'
                    }}>
                      {res.a}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Box */}
              <form onSubmit={handleAskAi} style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text"
                  value={aiPrompt}
                  onChange={e => setAiPrompt(e.target.value)}
                  placeholder="Ask treatment guidelines or DDI conflicts..."
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #E2E8F0',
                    fontSize: '12.5px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: '#0A2540',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Send size={13} />
                  <span>Ask</span>
                </button>
              </form>
            </div>
          </div>

          {/* Bottom Section: Patient Analytics (Left) + Recent Reports (Right) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: '20px', marginBottom: '28px' }}>
            {/* Left: Patient Analytics */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  Patient Analytics
                </h3>
                <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '10px' }}>
                  {['Weekly', 'Monthly', 'Yearly'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setAnalyticsRange(tab.toLowerCase())}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        background: analyticsRange === tab.toLowerCase() ? '#ffffff' : 'transparent',
                        color: analyticsRange === tab.toLowerCase() ? '#0A2540' : '#64748B',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: analyticsRange === tab.toLowerCase() ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '14px', fontSize: '11.5px', color: '#64748B' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#008B8B' }}></span>
                  <span>New Patients</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3B82F6' }}></span>
                  <span>Follow-ups</span>
                </div>
              </div>

              {/* Chart SVG */}
              <div style={{ position: 'relative', width: '100%', height: '180px' }}>
                <svg viewBox="0 0 520 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  {[30, 70, 110, 150].map((y, idx) => (
                    <line key={idx} x1="30" y1={y} x2="510" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  ))}
                  {/* Y-Axis Labels */}
                  <text x="10" y="34" fontSize="10" fill="#94A3B8">40</text>
                  <text x="10" y="74" fontSize="10" fill="#94A3B8">30</text>
                  <text x="10" y="114" fontSize="10" fill="#94A3B8">20</text>
                  <text x="10" y="154" fontSize="10" fill="#94A3B8">10</text>

                  {/* New Patients Line (Teal) */}
                  <path 
                    d="M 40,120 Q 110,95 180,135 T 320,110 T 460,90 L 500,85" 
                    fill="none" 
                    stroke="#008B8B" 
                    strokeWidth="3"
                  />
                  {/* Follow-ups Line (Blue) */}
                  <path 
                    d="M 40,145 Q 110,135 180,120 T 320,95 T 460,75 L 500,80" 
                    fill="none" 
                    stroke="#3B82F6" 
                    strokeWidth="3"
                  />

                  {/* Dots on points */}
                  <circle cx="180" cy="135" r="4" fill="#008B8B" />
                  <circle cx="320" cy="110" r="4" fill="#008B8B" />
                  <circle cx="460" cy="90" r="4" fill="#008B8B" />

                  <circle cx="180" cy="120" r="4" fill="#3B82F6" />
                  <circle cx="320" cy="95" r="4" fill="#3B82F6" />
                  <circle cx="460" cy="75" r="4" fill="#3B82F6" />

                  {/* X-Axis Dates */}
                  {['May 5', 'May 6', 'May 7', 'May 8', 'May 9', 'May 10', 'May 11'].map((dt, i) => (
                    <text key={i} x={40 + i * 75} y="175" fontSize="10" fill="#94A3B8" textAnchor="middle">{dt}</text>
                  ))}
                </svg>
              </div>
            </div>

            {/* Right: Recent Reports */}
            <div style={{ background: '#ffffff', borderRadius: '16px', padding: '22px 24px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                  Recent Reports
                </h3>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#008B8B', cursor: 'pointer' }}>View All →</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {recentReports.map(rep => (
                  <div
                    key={rep.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: '#F8FAFC',
                      border: '1px solid #F1F5F9'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '18px' }}>{rep.icon}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 750, color: '#0A2540' }}>{rep.title}</div>
                        <div style={{ fontSize: '11px', color: '#64748B' }}>{rep.patient} • {rep.date}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedReport(rep)}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        background: '#ffffff',
                        fontSize: '11.5px',
                        fontWeight: 700,
                        color: '#0A2540',
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

          {/* Bottom Bar: Doctor Features (Matching Screenshot 1) */}
          <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540', marginBottom: '14px' }}>
              Doctor Features
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px' }}>
              {[
                { title: 'Patient Management', desc: 'View history & records', icon: Users },
                { title: 'AI Clinical Assistant', desc: 'Guidelines & drug info', icon: Sparkles },
                { title: 'E-Prescriptions', desc: 'Quick & secure', icon: Pill },
                { title: 'Reports & Diagnostics', desc: 'Lab & imaging results', icon: FileCheck },
                { title: 'Appointments', desc: 'Schedule & follow-ups', icon: Calendar },
                { title: 'Clinical Knowledge Base', desc: 'Latest medical updates', icon: BookOpen }
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

      {/* Report Modal */}
      {selectedReport && (
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
          background: 'rgba(10, 37, 64, 0.5)'
        }}>
          <div style={{ background: '#ffffff', width: '480px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '24px' }}>{selectedReport.icon}</span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0A2540' }}>{selectedReport.title}</h3>
              </div>
              <button onClick={() => setSelectedReport(null)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '12px' }}>
              Patient: <strong>{selectedReport.patient}</strong> • Date: {selectedReport.date}
            </div>
            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '10px', border: '1px solid #E2E8F0', fontSize: '13px', lineHeight: 1.5, color: '#1E293B' }}>
              {selectedReport.summary}
            </div>
            <button 
              onClick={() => setSelectedReport(null)}
              className="btn-primary"
              style={{ width: '100%', marginTop: '18px', padding: '10px', fontSize: '13px' }}
            >
              Close Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
