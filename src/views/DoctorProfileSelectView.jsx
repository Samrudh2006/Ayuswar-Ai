import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  UserCheck, 
  Stethoscope, 
  Building2, 
  AlertCircle,
  ArrowRight,
  Info,
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';
import { DOCTOR_REGISTRY } from '../data/clinicalRegistry';
import { useApp } from '../context/AppContext';

export default function DoctorProfileSelectView() {
  const navigate = useNavigate();
  const { currentDoctor, setCurrentDoctor, isDemoMode } = useApp();
  const [selectedId, setSelectedId] = useState(currentDoctor?.id || 'doc_priya');

  const doctorList = [
    {
      id: 'doc_priya',
      name: 'Dr. Priya Sharma, MD',
      specialty: 'Pulmonology & Critical Care',
      facility: 'Kurnool District Hospital (Sandbox Hub)',
      experience: '14 years',
      specialtyDomain: 'respiratory',
      avatarLabel: 'PS'
    },
    {
      id: 'doc_rajesh',
      name: 'Dr. Rajesh Verma, MD, DM',
      specialty: 'Cardiology & Intensive Care',
      facility: 'Guntur General Hospital (Sandbox Hub)',
      experience: '18 years',
      specialtyDomain: 'cardiometabolic',
      avatarLabel: 'RV'
    },
    {
      id: 'doc_vikram',
      name: 'Dr. Vikram Reddy, MD, DCH',
      specialty: 'Pediatrics & Neonatal Care',
      facility: 'Anantapur MCH Center (Sandbox Hub)',
      experience: '11 years',
      specialtyDomain: 'pediatrics',
      avatarLabel: 'VR'
    },
    {
      id: 'doc_meenakshi',
      name: 'Dr. Meenakshi Iyer, MS',
      specialty: 'Orthopedics & Trauma',
      facility: 'Tirupati District Hospital (Sandbox Hub)',
      experience: '15 years',
      specialtyDomain: 'orthopedics',
      avatarLabel: 'MI'
    },
    {
      id: 'doc_arishti',
      name: 'Dr. Arishti Nair, DM',
      specialty: 'Neurology & Neuro-rehab',
      facility: 'NIMS Hyderabad (Sandbox Affiliate)',
      experience: '12 years',
      specialtyDomain: 'neurology',
      avatarLabel: 'AN'
    }
  ];

  const handleSelectAndProceed = (doc) => {
    const registryEntry = DOCTOR_REGISTRY[doc.id.replace('doc_', '')] || DOCTOR_REGISTRY.pulmonology;
    const profile = {
      ...registryEntry,
      id: doc.id,
      doctorName: doc.name,
      specialty: doc.specialty,
      department: doc.specialty,
      facility: doc.facility,
      experience: doc.experience,
      specialtyDomain: doc.specialtyDomain,
      hprId: 'SANDBOX-HPR-48291',
      isDemoProfile: true
    };
    setCurrentDoctor(profile);
    navigate('/doctor-portal');
  };

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 16px' }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--color-navy-700)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 600 }}>
          <ChevronLeft size={16} /> Return to Home
        </Link>
      </div>

      <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 24, marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#0e7490', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
            <Stethoscope size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#0f172a', fontWeight: 700 }}>Clinician Profile Selection (Sandbox OPD)</h1>
              <span style={{ fontSize: '0.75rem', background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: 999, fontWeight: 600 }}>
                Sandbox Environment
              </span>
            </div>
            <p style={{ margin: '8px 0 0 0', color: '#475569', fontSize: '0.925rem', lineHeight: 1.5 }}>
              Select a pre-configured clinician profile to preview the Clinical Console, OPD Queue, and Audio Scribe workflows.
            </p>
          </div>
        </div>

        <div style={{ marginTop: 18, background: '#fffbeb', border: '1px solid #fef3c7', borderRadius: 8, padding: '12px 14px', display: 'flex', gap: 10 }}>
          <AlertCircle size={18} color="#b45309" style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: '0.825rem', color: '#92400e', lineHeight: 1.45 }}>
            <strong>Sandbox Notice:</strong> Operating in sandbox verification mode without connecting to live ABDM production registries. No live biometric credentials are requested or stored. Profiles are pre-configured test fixtures for workflow validation.
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.125rem', color: '#1e293b', marginBottom: 14, fontWeight: 700 }}>Available Clinician Profiles</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {doctorList.map((doc) => {
          const isSelected = selectedId === doc.id;
          return (
            <div 
              key={doc.id}
              onClick={() => setSelectedId(doc.id)}
              style={{
                background: '#fff',
                border: isSelected ? '2px solid #0e7490' : '1px solid #cbd5e1',
                borderRadius: 12,
                padding: 18,
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 4px 12px rgba(14, 116, 144, 0.12)' : 'none'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 21, background: isSelected ? '#0e7490' : '#e2e8f0', color: isSelected ? '#fff' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.95rem' }}>
                    {doc.avatarLabel}
                  </div>
                  {isSelected && <CheckCircle2 size={20} color="#0e7490" />}
                </div>

                <div style={{ fontWeight: 700, fontSize: '1.025rem', color: '#0f172a', marginBottom: 4 }}>
                  {doc.name}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#0e7490', fontWeight: 600, marginBottom: 8 }}>
                  {doc.specialty}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: '#64748b', marginBottom: 6 }}>
                  <Building2 size={14} />
                  <span>{doc.facility}</span>
                </div>
                <div style={{ fontSize: '0.775rem', color: '#64748b' }}>
                  Experience: {doc.experience}
                </div>
              </div>

              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAndProceed(doc);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    borderRadius: 8,
                    background: isSelected ? '#0e7490' : '#f1f5f9',
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
                  <span>Launch Console as {doc.name.split(' ')[1]}</span>
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
