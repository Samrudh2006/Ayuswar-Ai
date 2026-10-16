import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Stethoscope, 
  User, 
  Activity, 
  ShieldCheck, 
  ArrowLeft, 
  Volume2, 
  Languages, 
  Sparkles,
  Layers,
  HeartPulse
} from 'lucide-react';
import { useApp, SUPPORTED_LANGUAGES } from '../context/AppContext';

export default function PortalRoleBar({ 
  currentDoctorName, 
  currentPatientName,
  onLaunchLiveScribe,
  onQuickSwitchEncounter
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLanguage, setSelectedLanguage } = useApp();

  const isDoctor = location.pathname.startsWith('/doctor-portal');
  const isPatient = location.pathname.startsWith('/patient-portal');
  const isConsole = location.pathname.startsWith('/clinical-console');

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0F172A 0%, #1E293B 100%)',
      borderBottom: '1px solid #334155',
      color: '#F8FAFC',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      flexWrap: 'wrap',
      fontSize: '0.82rem',
      position: 'sticky',
      top: '64px',
      zIndex: 40,
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
    }}>
      {/* Left: Persona Context & Back to Landing */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#CBD5E1',
            borderRadius: '6px',
            padding: '4px 8px',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          title="Return to Public Presentation Landing"
        >
          <ArrowLeft size={13} />
          <span>Exit to Landing</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            width: '20px', 
            height: '20px', 
            borderRadius: '50%', 
            background: isDoctor ? '#0284C7' : (isPatient ? '#10B981' : '#8B5CF6'),
            color: '#FFFFFF'
          }}>
            {isDoctor ? <Stethoscope size={11} /> : (isPatient ? <User size={11} /> : <Activity size={11} />)}
          </span>
          <span style={{ fontWeight: 700, color: '#F1F5F9' }}>
            {isDoctor && `OPD Console: ${currentDoctorName || 'Dr. Priya Sharma, MD'}`}
            {isPatient && `Citizen Locker: ${currentPatientName || 'Ananya Rao (ABHA)'}`}
            {isConsole && 'Live Clinical Telemetry Workspace'}
          </span>
        </div>

        {/* DPDP Act Ram Ingestion Indicator */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '2px 8px',
          borderRadius: '999px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#34D399',
          fontSize: '0.72rem',
          fontWeight: 650
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981' }}></span>
          <span>DPDP Act RAM Mode</span>
        </div>
      </div>

      {/* Center: Instant Dashboard Persona Switcher */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: '#020617',
        padding: '3px',
        borderRadius: '8px',
        border: '1px solid #334155',
        gap: '2px'
      }}>
        <button
          onClick={() => navigate('/doctor-portal')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: isDoctor ? 'linear-gradient(135deg, #0284C7, #0369A1)' : 'transparent',
            color: isDoctor ? '#FFFFFF' : '#94A3B8'
          }}
          title="Switch to Doctor OPD Operating System"
        >
          <Stethoscope size={13} />
          <span>Doctor OPD</span>
        </button>

        <button
          onClick={() => navigate('/patient-portal')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: isPatient ? 'linear-gradient(135deg, #10B981, #059669)' : 'transparent',
            color: isPatient ? '#FFFFFF' : '#94A3B8'
          }}
          title="Switch to Citizen ABHA Health Portal"
        >
          <User size={13} />
          <span>Patient Portal</span>
        </button>

        <button
          onClick={() => navigate('/clinical-console')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '6px',
            border: 'none',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            background: isConsole ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)' : 'transparent',
            color: isConsole ? '#FFFFFF' : '#94A3B8'
          }}
          title="Switch to Live Telemetry & Diarization Console"
        >
          <Activity size={13} />
          <span>Clinical Console</span>
        </button>
      </div>

      {/* Right: Quick Actions & Dialect Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Quick Launch Rayalaseema Scenario */}
        <button
          onClick={() => {
            if (isConsole && onQuickSwitchEncounter) {
              onQuickSwitchEncounter(0);
            } else {
              navigate('/clinical-console');
            }
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px 10px',
            borderRadius: '6px',
            background: 'rgba(56, 189, 248, 0.12)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38BDF8',
            fontSize: '0.75rem',
            fontWeight: 650,
            cursor: 'pointer'
          }}
          title="Load Rayalaseema Telugu COPD Encounter (Farmer case)"
        >
          <HeartPulse size={12} />
          <span>Rayalaseema Demo</span>
        </button>

        {/* Dialect Quick Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Languages size={13} color="#94A3B8" />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            style={{
              background: '#0F172A',
              border: '1px solid #475569',
              color: '#E2E8F0',
              borderRadius: '5px',
              padding: '3px 6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {SUPPORTED_LANGUAGES.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.label} ({lang.name})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
