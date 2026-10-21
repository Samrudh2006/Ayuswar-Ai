import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  Heart, 
  AlertCircle, 
  ArrowRight, 
  CheckCircle2, 
  ChevronLeft,
  Users,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PatientProfileSelectView() {
  const navigate = useNavigate();
  const { currentPatient, setCurrentPatient } = useApp();
  const [selectedId, setSelectedId] = useState(currentPatient?.id || 'pat_narayana');

  const demoPatients = [
    {
      id: 'pat_narayana',
      name: 'Narayana Swamy (నారాయణ స్వామి)',
      age: 64,
      gender: 'Male',
      language: 'Telugu',
      condition: 'Chronic COPD & Airway Wheeze',
      primaryComplaint: 'ఆయాసం, పీకల్లో పిల్లికూతలు, రాత్రి వేళ తీవ్రమైన దగ్గు',
      prescriptionsCount: 3,
      assignedDoctor: 'Dr. Priya Sharma (Pulmonology)',
      tag: 'Pulmonology Scenario'
    },
    {
      id: 'pat_saraswathi',
      name: 'Saraswathi Devi (సరస్వతీ దేవి)',
      age: 58,
      gender: 'Female',
      language: 'Telugu',
      condition: 'Type-2 Diabetes & Hypertension',
      primaryComplaint: 'పాదాల్లో తిమ్మిర్లు, నీరసం, రక్తపోటు హెచ్చుతగ్గులు',
      prescriptionsCount: 4,
      assignedDoctor: 'Dr. Rajesh Verma (Cardiometabolic)',
      tag: 'Cardiometabolic Scenario'
    },
    {
      id: 'pat_chinna',
      name: 'Master Chinna (చిన్నారి విష్ణు)',
      age: 6,
      gender: 'Male',
      language: 'Telugu',
      condition: 'Pediatric Acute Bronchospasm',
      primaryComplaint: 'శ్వాస తీసుకోవడంలో ఇబ్బంది, పక్కటెముకలు లోపలికి లాగడం (Chest Retraction)',
      prescriptionsCount: 2,
      assignedDoctor: 'Dr. Vikram Reddy (Pediatrics)',
      tag: 'Pediatrics Scenario'
    },
    {
      id: 'pat_lakshmi',
      name: 'Lakshmi Bai (లక్ష్మీ బాయి)',
      age: 48,
      gender: 'Female',
      language: 'Hindi',
      condition: 'Osteoarthritis Knee Joint & Backache',
      primaryComplaint: 'घुटनों में तेज दर्द, चलने में असमर्थ, सुबह जकड़न',
      prescriptionsCount: 2,
      assignedDoctor: 'Dr. Meenakshi Iyer (Orthopedics)',
      tag: 'Orthopedics Scenario'
    }
  ];

  const handleSelectAndProceed = (pat) => {
    const profile = {
      ...pat,
      isDemoProfile: true,
      demoAbhaId: 'SANDBOX-ABHA-9145',
      timestamp: '2026-10-23T14:28:10.000Z'
    };
    setCurrentPatient(profile);
    navigate('/patient-portal');
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-navy-700)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
          <ChevronLeft size={16} /> Return to Home
        </Link>
      </div>

      <div style={{ background: '#FAF8F5', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <Users size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Citizen Health Record Selection (Sandbox)</h1>
              <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: 999, fontWeight: 600 }}>
                Sandbox Environment
              </span>
            </div>
            <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '0.925rem', lineHeight: 1.5 }}>
              Select a pre-configured patient record to inspect the Citizen Portal, vernacular Audio-Rx instructions, and consultation history.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 18, background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10 }}>
          <AlertCircle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.825rem', color: '#92400e', lineHeight: 1.45 }}>
            <strong>Sandbox Notice:</strong> No live government ABHA citizen credentials, Aadhaar tokens, or biometric inputs are handled by this system. All records below are synthetic scenario fixtures for testing accessibility and vernacular audio output.
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: 14, fontWeight: 700 }}>Pre-Configured Patient Scenarios</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {demoPatients.map((pat) => {
          const isSelected = selectedId === pat.id;
          return (
            <div
              key={pat.id}
              onClick={() => setSelectedId(pat.id)}
              style={{
                background: '#fff',
                border: isSelected ? '2px solid #0284c7' : '1px solid #cbd5e1',
                borderRadius: 12,
                padding: 18,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 12px rgba(2, 132, 199, 0.12)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, background: '#FAF8F5', color: '#475569', padding: '2px 8px', borderRadius: 4 }}>
                    {pat.tag}
                  </span>
                  {isSelected && <CheckCircle2 size={18} color="#0284c7" />}
                </div>

                <div style={{ fontWeight: 700, fontSize: '1.025rem', color: '#0f172a', marginBottom: 4 }}>
                  {pat.name}
                </div>
                <div style={{ fontSize: '0.825rem', color: '#64748b', marginBottom: 10 }}>
                  {pat.gender}, {pat.age} yrs • Preferred Language: <strong>{pat.language}</strong>
                </div>

                <div style={{ background: '#FAF8F5', padding: 10, borderRadius: 8, fontSize: '0.8rem', color: '#334155', marginBottom: 10 }}>
                  <div style={{ fontWeight: 600, color: '#0f172a', marginBottom: 2 }}>Condition:</div>
                  <div>{pat.condition}</div>
                </div>

                <div style={{ fontSize: '0.775rem', color: '#64748b', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{pat.primaryComplaint}"
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAndProceed(pat);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: isSelected ? '#0284c7' : '#f1f5f9',
                    color: isSelected ? '#fff' : '#1e293b',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                >
                  <span>Open Citizen Portal</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
