import React, { useState, useEffect } from 'react';
import { CheckCircle2, Volume2 } from 'lucide-react';

/**
 * PatientHealthGoalsTab — Daily Health Goals & Longitudinal Wellness Streaks
 * Extracted modular component for PatientPortal.
 */
export default function PatientHealthGoalsTab({
  assignedDoctor,
  activeDemoPatient,
  patientProfile
}) {
  // Goal states
  const [dailySteps, setDailySteps] = useState(6420);
  const stepsGoal = 10000;
  const [waterGlasses, setWaterGlasses] = useState(5);
  const waterGoal = 8;
  const adherenceStreak = 7;
  
  // Blood Pressure & Resting Pulse
  const [bpSystolic, setBpSystolic] = useState(118);
  const [bpDiastolic, setBpDiastolic] = useState(78);
  const [restingPulse, setRestingPulse] = useState(72);
  const [bpLogNotification, setBpLogNotification] = useState('');

  // Blood Sugar & Glycemic Control
  const [fastingSugar, setFastingSugar] = useState(96);
  const [postMealSugar, setPostMealSugar] = useState(128);
  const [sugarLogNotification, setSugarLogNotification] = useState('');

  // Circadian Sleep & Recovery
  const [sleepHours, setSleepHours] = useState(7.5);
  const deepSleepPercent = 24;
  const sleepScore = 88;

  // Respiratory Peak Expiratory Flow Rate (PEFR) - Asthma Green Zone
  const [peakFlowRate, setPeakFlowRate] = useState(460);
  const peakFlowPersonalBest = 520;

  // WHO Dietary Salt / Sodium Intake
  const [sodiumMg, setSodiumMg] = useState(1650);

  // Interactive Guided Pranayama / Anulom Vilom Breathing Exercise
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState('Inhale'); // 'Inhale' | 'Hold' | 'Exhale'
  const [breathingTimer, setBreathingTimer] = useState(4);
  const [breathingCyclesCompleted, setBreathingCyclesCompleted] = useState(3);

  // Interactive Guided Breathing Timer Cycle
  useEffect(() => {
    let interval = null;
    if (isBreathingActive) {
      interval = setInterval(() => {
        setBreathingTimer(prev => {
          if (prev <= 1) {
            setBreathingPhase(currentPhase => {
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              if (currentPhase === 'Exhale') {
                setBreathingCyclesCompleted(c => c + 1);
                return 'Inhale';
              }
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isBreathingActive]);

  const doctorName = assignedDoctor?.doctorName || 'Dr. Priya Sharma, MD';
  const conditionName = activeDemoPatient?.primaryCondition || patientProfile?.condition || 'Asthma & Chronic Care';

  return (
    <div>
      {/* Header Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, #0A2540 0%, #0D3B66 50%, #0F4C5C 100%)', 
        borderRadius: '20px', 
        padding: '24px 28px', 
        color: '#ffffff',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        boxShadow: '0 10px 25px rgba(10, 37, 64, 0.12)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span style={{ 
              background: 'rgba(15, 76, 92, 0.45)', 
              padding: '4px 10px', 
              borderRadius: '20px', 
              fontSize: '11px', 
              fontWeight: 800, 
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              color: '#FFFFFF',
              border: '1px solid rgba(255,255,255,0.3)' 
            }}>
              ABDM Chronotherapy & Wellness Care Plan (PLANNED)
            </span>
            <span style={{ fontSize: '12px', color: '#93C5FD' }}>• Supervised by {doctorName}</span>
          </div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'Outfit, sans-serif', margin: '0 0 6px 0', color: '#FFFFFF' }}>
            Daily Health Goals & Longitudinal Wellness Streaks
          </h2>
          <p style={{ fontSize: '13px', color: '#F1F5F9', margin: 0, maxWidth: '650px', lineHeight: 1.5 }}>
            Self-marked daily wellness progress and manual habit tracking for <strong>{conditionName}</strong>. Self-entered records; no automatic sensor tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', padding: '12px 18px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '11px', color: '#F8FAFC', fontWeight: 700 }}>Daily Compliance <span style={{ fontSize: '9px', opacity: 0.9 }}>(sample)</span></div>
            <div style={{ fontSize: '22px', fontWeight: 850, color: '#34D399' }}>94%</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)', padding: '12px 18px', borderRadius: '14px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '11px', color: '#F8FAFC', fontWeight: 700 }}>Active Streak</div>
            <div style={{ fontSize: '22px', fontWeight: 850, color: '#FDE047' }}>{adherenceStreak} Days 🔥</div>
          </div>
        </div>
      </div>

      {/* Toast feedback if logged */}
      {(bpLogNotification || sugarLogNotification) && (
        <div style={{ 
          background: '#ECFDF5', 
          border: '1px solid #10B981', 
          borderRadius: '12px', 
          padding: '12px 18px', 
          marginBottom: '20px', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          color: '#065F46',
          fontSize: '13px',
          fontWeight: 650
        }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{bpLogNotification || sugarLogNotification}</span>
        </div>
      )}

      {/* 3x3 Clinical Goals Grid */}
      <div className="patient-goals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '18px', width: '100%' }}>
        
        {/* 1. Daily Walking & Steps Goal */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>Daily Physical Activity</span>
              <span style={{ background: 'rgba(15, 76, 92, 0.1)', color: '#0F4C5C', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                {Math.round((dailySteps / stepsGoal) * 100)}% Reached
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 850, color: '#0F4C5C', margin: '4px 0 2px 0' }}>
              {dailySteps.toLocaleString()}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>
              Target: {stepsGoal.toLocaleString()} steps • {(dailySteps * 0.00075).toFixed(1)} km • {Math.round(dailySteps * 0.038)} kcal
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: '8px', background: '#FAF8F5', borderRadius: '6px', overflow: 'hidden', marginBottom: '14px' }}>
              <div style={{ width: `${Math.min(100, (dailySteps / stepsGoal) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #0F4C5C 0%, #2DD4BF 100%)', borderRadius: '6px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setDailySteps(s => s + 500)}
              style={{ flex: 1, background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px', fontSize: '11.5px', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
            >
              +500 Steps
            </button>
            <button
              onClick={() => setDailySteps(s => s + 1000)}
              style={{ flex: 1, background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px', fontSize: '11.5px', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
            >
              +1k Steps
            </button>
            <button
              onClick={() => setDailySteps(0)}
              style={{ background: '#FEE2E2', border: 'none', borderRadius: '8px', padding: '6px 10px', fontSize: '11.5px', fontWeight: 700, color: '#DC2626', cursor: 'pointer' }}
              title="Reset for new day"
            >
              ↺
            </button>
          </div>
        </div>

        {/* 2. Smart Hydration Logger */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>Smart Hydration Logger</span>
              <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#2563EB', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                {(waterGlasses * 0.25).toFixed(2)} / 2.0 Liters
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 850, color: '#2563EB', margin: '4px 0 2px 0' }}>
              {waterGlasses} <span style={{ fontSize: '18px', fontWeight: 600, color: '#64748B' }}>/ {waterGoal} glasses</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>
              Recommended: 250ml every 90 mins to maintain airway mucosal hydration.
            </div>

            {/* Visual 8 glasses row */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              {Array.from({ length: 8 }).map((_, idx) => (
                <div 
                  key={idx}
                  style={{
                    flex: 1,
                    height: '24px',
                    borderRadius: '6px',
                    background: idx < waterGlasses ? '#3B82F6' : '#E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800
                  }}
                >
                  💧
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setWaterGlasses(w => Math.min(12, w + 1))}
              style={{ flex: 2, background: 'rgba(59, 130, 246, 0.1)', color: '#1D4ED8', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '8px', padding: '6px', fontSize: '11.5px', fontWeight: 750, cursor: 'pointer' }}
            >
              + Log 1 Glass (250ml)
            </button>
            <button
              onClick={() => setWaterGlasses(w => Math.max(0, w - 1))}
              style={{ flex: 1, background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px', fontSize: '11.5px', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}
            >
              -1 Glass
            </button>
          </div>
        </div>

        {/* 3. Chronotherapy Pillbox Adherence Streak */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>Chronotherapy Streak</span>
              <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                100% On-Time
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 850, color: '#10B981', margin: '4px 0 2px 0' }}>
              {adherenceStreak} Days <span style={{ fontSize: '18px' }}>🔥</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>
              Early morning, post-lunch, & bedtime pillbox intake verified.
            </div>

            {/* 7-day checklist */}
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '4px', marginBottom: '14px' }}>
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#10B981', color: '#ffffff', fontSize: '12px', fontWeight: 850, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                    ✓
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>{day}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              alert('Audio Feedback: మీ మందుల క్రమం అద్భుతంగా ఉంది! డాక్టర్ ప్రియా గారు సూచించిన విధంగా అన్ని మందులు సమయానికి వేసుకుంటున్నారు.');
            }}
            style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '6px', fontSize: '11.5px', fontWeight: 750, color: '#166534', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
          >
            <Volume2 size={13} />
            <span>Hear Praise in Telugu</span>
          </button>
        </div>

        {/* 4. Cardiovascular Blood Pressure & Resting Pulse */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>Blood Pressure & Pulse</span>
              <span style={{ 
                background: bpSystolic < 120 && bpDiastolic < 80 ? '#ECFDF5' : '#FEF3C7', 
                color: bpSystolic < 120 && bpDiastolic < 80 ? '#059669' : '#D97706', 
                fontSize: '11px', 
                fontWeight: 800, 
                padding: '3px 8px', 
                borderRadius: '12px' 
              }}>
                {bpSystolic < 120 && bpDiastolic < 80 ? 'Optimal Class I' : 'Pre-Hypertensive'}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 850, color: '#081C24', margin: '4px 0 2px 0' }}>
              {bpSystolic} / {bpDiastolic} <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>mmHg</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>
              Resting Heart Rate: <strong>{restingPulse} bpm</strong> (Normal Sinus Rhythm)
            </div>

            <div className="patient-bp-subgrid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginBottom: '12px', width: '100%' }}>
              <div>
                <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>Systolic</label>
                <input
                  type="number"
                  value={bpSystolic}
                  onChange={e => setBpSystolic(Number(e.target.value))}
                  style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>Diastolic</label>
                <input
                  type="number"
                  value={bpDiastolic}
                  onChange={e => setBpDiastolic(Number(e.target.value))}
                  style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700 }}
                />
              </div>
              <div>
                <label style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>Pulse</label>
                <input
                  type="number"
                  value={restingPulse}
                  onChange={e => setRestingPulse(Number(e.target.value))}
                  style={{ width: '100%', padding: '4px 6px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', fontWeight: 700 }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setBpLogNotification(`Vitals Logged: ${bpSystolic}/${bpDiastolic} mmHg at ${restingPulse} bpm recorded to ABHA.`);
              setTimeout(() => setBpLogNotification(''), 4000);
            }}
            style={{ background: '#0A2540', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '7px', fontSize: '11.5px', fontWeight: 750, cursor: 'pointer' }}
          >
            Log Vitals Reading
          </button>
        </div>

        {/* 5. Glycemic Fasting & Post-Meal Sugar Tracker */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>Blood Glucose (RBS / FBS)</span>
              <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                Normoglycemic
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 850, color: '#081C24', margin: '4px 0 2px 0' }}>
              {fastingSugar} <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>FBS</span> • {postMealSugar} <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>PPBS</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>
              Target: FBS &lt; 100 mg/dL • Est. HbA1c: <strong>5.6%</strong> (Controlled)
            </div>

            <div style={{ background: '#FAF8F5', padding: '8px 10px', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '11px', color: '#475569', marginBottom: '12px' }}>
              Morning fasting reading recorded before Metformin tablet. No nocturnal hypoglycemia symptoms.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => {
                setFastingSugar(94);
                setSugarLogNotification('Fasting sugar 94 mg/dL logged.');
                setTimeout(() => setSugarLogNotification(''), 4000);
              }}
              style={{ flex: 1, background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px', fontSize: '11px', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
            >
              Log Fasting (94)
            </button>
            <button
              onClick={() => {
                setPostMealSugar(124);
                setSugarLogNotification('Post-lunch sugar 124 mg/dL logged.');
                setTimeout(() => setSugarLogNotification(''), 4000);
              }}
              style={{ flex: 1, background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px', fontSize: '11px', fontWeight: 700, color: '#0F172A', cursor: 'pointer' }}
            >
              Log Post-Meal (124)
            </button>
          </div>
        </div>

        {/* 6. Circadian Sleep Duration & Nocturnal Recovery */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>Sleep & Circadian Rhythm</span>
              <span style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366F1', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                Restorative
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 850, color: '#4F46E5', margin: '4px 0 2px 0' }}>
              {sleepHours} hrs <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>(Score: {sleepScore}/100)</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>
              Deep Sleep: <strong>{deepSleepPercent}% (1h 48m)</strong> • REM: <strong>22%</strong> • Sleep debt: 0m
            </div>

            <div style={{ background: '#F5F3FF', padding: '8px 10px', borderRadius: '8px', border: '1px solid #DDD6FE', fontSize: '11px', color: '#5B21B6', marginBottom: '12px' }}>
              🌙 <strong>Nocturnal Asthma Protection:</strong> Optimal circadian sleep prevents 4:00 AM bronchial airway dips and cortisol surges.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setSleepHours(h => +(h + 0.5).toFixed(1))}
              style={{ flex: 1, background: '#EDE9FE', border: 'none', borderRadius: '8px', padding: '6px', fontSize: '11.5px', fontWeight: 750, color: '#6D28D9', cursor: 'pointer' }}
            >
              + 30m Sleep
            </button>
            <button
              onClick={() => setSleepHours(h => Math.max(4, +(h - 0.5).toFixed(1)))}
              style={{ flex: 1, background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '6px', fontSize: '11.5px', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}
            >
              - 30m Sleep
            </button>
          </div>
        </div>

        {/* 7. Respiratory Peak Flow Rate (PEFR) - Asthma Green Zone */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>Peak Expiratory Flow (PEFR)</span>
              <span style={{ 
                background: peakFlowRate >= 0.8 * peakFlowPersonalBest ? '#ECFDF5' : peakFlowRate >= 0.5 * peakFlowPersonalBest ? '#FEF3C7' : '#FEE2E2', 
                color: peakFlowRate >= 0.8 * peakFlowPersonalBest ? '#059669' : peakFlowRate >= 0.5 * peakFlowPersonalBest ? '#D97706' : '#DC2626', 
                fontSize: '11px', 
                fontWeight: 800, 
                padding: '3px 8px', 
                borderRadius: '12px' 
              }}>
                {peakFlowRate >= 0.8 * peakFlowPersonalBest ? '🟩 Green Zone (>80%)' : peakFlowRate >= 0.5 * peakFlowPersonalBest ? '🟨 Yellow Zone' : '🟥 Red Zone'}
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 850, color: '#0F4C5C', margin: '4px 0 2px 0' }}>
              {peakFlowRate} <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>L/min</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>
              {Math.round((peakFlowRate / peakFlowPersonalBest) * 100)}% of personal best ({peakFlowPersonalBest} L/min). Normal bronchodilation.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Adjust:</span>
              <input 
                type="range" 
                min="250" 
                max="550" 
                step="10"
                value={peakFlowRate}
                onChange={e => setPeakFlowRate(Number(e.target.value))}
                style={{ flex: 1, accentColor: '#0F4C5C' }}
              />
            </div>
          </div>

          <div style={{ fontSize: '11px', color: '#065F46', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 10px', borderRadius: '8px', fontWeight: 650 }}>
            GINA Guideline: Airways fully responsive to morning Budesonide inhaler.
          </div>
        </div>

        {/* 8. WHO Dietary Sodium & Salt Restriction */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 750, color: '#081C24' }}>WHO Dietary Sodium Limit</span>
              <span style={{ background: '#ECFDF5', color: '#059669', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                Safe Range
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 850, color: '#081C24', margin: '4px 0 2px 0' }}>
              {sodiumMg.toLocaleString()} <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 600 }}>/ 2,000 mg max</span>
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '12px' }}>
              Equivalent to ~4.1g salt (within WHO safe threshold &lt; 5g/day).
            </div>

            {/* Salt progress meter */}
            <div style={{ width: '100%', height: '8px', background: '#FAF8F5', borderRadius: '6px', overflow: 'hidden', marginBottom: '12px' }}>
              <div style={{ width: `${(sodiumMg / 2000) * 100}%`, height: '100%', background: '#F59E0B', borderRadius: '6px' }} />
            </div>

            <div style={{ fontSize: '11px', color: '#475569', lineHeight: 1.4, marginBottom: '8px' }}>
              🌿 <strong>Dietary Advice:</strong> Avoided salted pickles (ooragaya) and papads at lunch. Drumstick and bottle gourd curry consumed.
            </div>
          </div>

          <button
            onClick={() => setSodiumMg(prev => Math.min(2200, prev + 150))}
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '8px', padding: '6px', fontSize: '11.5px', fontWeight: 700, color: '#B45309', cursor: 'pointer' }}
          >
            + Log Evening Snack Sodium (+150mg)
          </button>
        </div>

        {/* 9. Interactive Guided Pranayama & Box Breathing */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '2px solid #0F4C5C', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 8px 20px rgba(15, 76, 92, 0.08)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F4C5C' }}>Guided Pranayama (శ్వాసక్రియ)</span>
              <span style={{ background: isBreathingActive ? '#ECFDF5' : '#F1F5F9', color: isBreathingActive ? '#059669' : '#64748B', fontSize: '11px', fontWeight: 800, padding: '3px 8px', borderRadius: '12px' }}>
                {isBreathingActive ? 'Active Live' : 'Ready'}
              </span>
            </div>

            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              {/* Pulsating breathing circle */}
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: breathingPhase === 'Inhale' 
                  ? 'radial-gradient(circle, #2DD4BF 0%, #0F4C5C 100%)' 
                  : breathingPhase === 'Hold' 
                  ? 'radial-gradient(circle, #FBBF24 0%, #D97706 100%)' 
                  : 'radial-gradient(circle, #60A5FA 0%, #2563EB 100%)',
                color: '#ffffff',
                margin: '0 auto 10px auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isBreathingActive ? '0 0 25px rgba(15, 76, 92, 0.5)' : 'none',
                transition: 'all 0.5s ease',
                transform: breathingPhase === 'Inhale' ? 'scale(1.1)' : breathingPhase === 'Exhale' ? 'scale(0.92)' : 'scale(1.0)'
              }}>
                <span style={{ fontSize: '20px', fontWeight: 900 }}>{breathingTimer}s</span>
                <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>{breathingPhase}</span>
              </div>

              <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24' }}>
                {breathingPhase === 'Inhale' ? 'Inhale Deeply (శ్వాస తీసుకోండి)' : breathingPhase === 'Hold' ? 'Hold Breath (ఆగండి)' : 'Exhale Slowly (శ్వాస వదలండి)'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                {breathingCyclesCompleted} cycles completed today • Reduces bronchial spasm
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setIsBreathingActive(a => !a)}
              style={{ 
                flex: 2, 
                background: isBreathingActive ? '#DC2626' : '#0F4C5C', 
                color: '#ffffff', 
                border: 'none', 
                borderRadius: '8px', 
                padding: '7px', 
                fontSize: '11.5px', 
                fontWeight: 750, 
                cursor: 'pointer' 
              }}
            >
              {isBreathingActive ? 'Pause Exercise' : 'Start 1-Min Pranayama'}
            </button>
            <button
              onClick={() => {
                setIsBreathingActive(false);
                setBreathingPhase('Inhale');
                setBreathingTimer(4);
              }}
              style={{ flex: 1, background: '#FAF8F5', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '7px', fontSize: '11.5px', fontWeight: 700, color: '#64748B', cursor: 'pointer' }}
            >
              Reset
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
