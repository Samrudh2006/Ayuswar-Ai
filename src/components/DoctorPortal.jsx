import React, { useState } from 'react';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Search, 
  Plus, 
  Activity, 
  ShieldCheck, 
  Mic, 
  Radio, 
  Sparkles,
  Stethoscope,
  Heart,
  FileText
} from 'lucide-react';
import { CLINICAL_ENCOUNTERS } from '../data/clinicalEncounters';

/**
 * DoctorPortal Component
 * Real-world enterprise outpatient department (OPD) queue and clinical productivity dashboard.
 * Gives physicians instant triage oversight, queue status, and 1-click ambient session launching.
 */
export default function DoctorPortal({ doctorProfile, onSelectEncounterAndLaunch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQueueTab, setSelectedQueueTab] = useState('all');

  const opdQueue = [
    {
      id: 0,
      encounterRef: 0,
      tokenNumber: 'OPD-101',
      name: 'Narayana Rao (నారాయణ రావు)',
      age: 58,
      gender: 'Male',
      language: 'Telugu (Rayalaseema)',
      chiefComplaint: 'Chest heaviness, Palpitations & Hot Flashes',
      triageStatus: 'High Vigilance',
      triageColor: '#D97706',
      vitals: 'BP: 140/90 • HR: 88 bpm • SpO2: 96%',
      waitingTime: '12 mins',
      status: 'Ready for Ambient Consultation'
    },
    {
      id: 1,
      encounterRef: 1,
      tokenNumber: 'OPD-102',
      name: 'Aarav Kumar (आरव कुमार)',
      age: 4,
      gender: 'Male',
      language: 'Hindi (Awadhi / Hindi)',
      chiefComplaint: 'Pediatric Subcostal Retraction & Nocturnal Cough',
      triageStatus: 'Urgent Triage (Pediatric)',
      triageColor: '#EF4444',
      vitals: 'BP: 95/62 • HR: 124 bpm • SpO2: 94%',
      waitingTime: '8 mins',
      status: 'High Priority Queue'
    },
    {
      id: 2,
      encounterRef: 2,
      tokenNumber: 'OPD-103',
      name: 'Sunitha Reddy (సునీత రెడ్డి)',
      age: 44,
      gender: 'Female',
      language: 'Tenglish (Telugu-English)',
      chiefComplaint: 'Morning Vascular Headache & Presyncope',
      triageStatus: 'Controlled',
      triageColor: '#10B981',
      vitals: 'BP: 154/96 • HR: 76 bpm • SpO2: 99%',
      waitingTime: '24 mins',
      status: 'Waiting in Room #2'
    },
    {
      id: 3,
      encounterRef: 0,
      tokenNumber: 'OPD-104',
      name: 'Ramulamma (రాములమ్మ)',
      age: 65,
      gender: 'Female',
      language: 'Telugu (Rural Kurnool)',
      chiefComplaint: 'Diabetic Peripheral Neuropathy & Foot Numbness',
      triageStatus: 'Routine',
      triageColor: '#3B82F6',
      vitals: 'BP: 132/84 • HR: 72 bpm • SpO2: 98%',
      waitingTime: '35 mins',
      status: 'Waiting'
    },
    {
      id: 4,
      encounterRef: 0,
      tokenNumber: 'OPD-105',
      name: 'Venkat Swamy (వెంకట్ స్వామి)',
      age: 52,
      gender: 'Male',
      language: 'Telugu (Telangana Rural)',
      chiefComplaint: 'Exertional Wheezing & Chronic Productive Cough',
      triageStatus: 'Moderate',
      triageColor: '#D97706',
      vitals: 'BP: 128/82 • HR: 82 bpm • SpO2: 95%',
      waitingTime: '42 mins',
      status: 'Sputum Test Uploaded'
    }
  ];

  const filteredQueue = opdQueue.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tokenNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.language.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 24px 80px 24px' }}>
      {/* Doctor Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '3px solid #008B8B',
              boxShadow: '0 6px 18px rgba(0, 139, 139, 0.25)',
              flexShrink: 0
            }}>
              <img src="/assets/dr_ananya_avatar.jpg" alt="Dr. Ananya" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h1 style={{ fontSize: '24px', color: '#0A2540', fontWeight: 850 }}>
                  {doctorProfile ? doctorProfile.doctorName : 'Dr. Ananya Sharma, MD'}
                </h1>
                <span style={{ fontSize: '11px', background: 'rgba(16, 185, 129, 0.12)', color: '#065F46', padding: '3px 10px', borderRadius: '12px', fontWeight: 750 }}>
                  ABDM Verified Practitioner
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#5A7184', marginTop: '3px' }}>
                {doctorProfile ? doctorProfile.facility : 'Kurnool District Hospital (ABDM PHC #1402)'} • HPR ID: {doctorProfile ? doctorProfile.hprId : 'ABHA-HPR-8921-9942'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => onSelectEncounterAndLaunch(0)}
              className="btn-primary"
              style={{ fontSize: '14px', padding: '12px 24px' }}
            >
              <Radio size={16} />
              <span>Launch Live Ambient Scribe</span>
            </button>
          </div>
        </div>

        {/* Clinical KPI Metrics Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid #E2E8F0'
        }}>
          <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={15} color="#008B8B" /> Patients Consulted Today
            </div>
            <div style={{ fontSize: '26px', fontWeight: 850, color: '#0A2540', marginTop: '4px' }}>
              48 <span style={{ fontSize: '12px', color: '#10B981', fontWeight: 700 }}>+6 waiting</span>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={15} color="#D97706" /> Documentation Time Saved
            </div>
            <div style={{ fontSize: '26px', fontWeight: 850, color: '#0A2540', marginTop: '4px' }}>
              4.6 <span style={{ fontSize: '12px', color: '#64748B' }}>min / patient</span>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Activity size={15} color="#10B981" /> Indic Voice Accuracy
            </div>
            <div style={{ fontSize: '26px', fontWeight: 850, color: '#0A2540', marginTop: '4px' }}>
              98.4% <span style={{ fontSize: '11px', color: '#008B8B', fontWeight: 700 }}>Prisma v2.5</span>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', padding: '14px 18px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <AlertCircle size={15} color="#EF4444" /> Critical Clinical Red Flags
            </div>
            <div style={{ fontSize: '26px', fontWeight: 850, color: '#EF4444', marginTop: '4px' }}>
              3 <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700 }}>Triaged Safely</span>
            </div>
          </div>
        </div>
      </div>

      {/* OPD Waiting Queue Management */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h2 style={{ fontSize: '19px', color: '#0A2540', fontWeight: 850 }}>
              Live Outpatient Department Queue (Room 4)
            </h2>
            <div style={{ fontSize: '12px', color: '#5A7184' }}>
              Select any queued patient to immediately start or resume an ambient voice consultation.
            </div>
          </div>

          {/* Search Bar */}
          <div style={{ position: 'relative', width: '320px' }}>
            <input
              type="text"
              placeholder="Search by token, name, or language..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 14px 9px 36px',
                borderRadius: '20px',
                border: '1.5px solid #CBD5E1',
                fontSize: '12.5px'
              }}
            />
            <Search size={15} color="#64748B" style={{ position: 'absolute', left: '12px', top: '11px' }} />
          </div>
        </div>

        {/* Patient Queue Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredQueue.map((patient) => (
            <div
              key={patient.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderRadius: '14px',
                background: '#ffffff',
                border: '1px solid #E2E8F0',
                boxShadow: '0 2px 8px rgba(10, 37, 64, 0.03)',
                transition: 'all 160ms ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  background: '#0A2540',
                  color: '#ffffff',
                  padding: '6px 10px',
                  borderRadius: '8px'
                }}>
                  {patient.tokenNumber}
                </span>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#0A2540' }}>
                      {patient.name}
                    </span>
                    <span style={{ fontSize: '12px', color: '#64748B' }}>
                      ({patient.age}y, {patient.gender})
                    </span>
                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: 750,
                      background: 'rgba(0, 139, 139, 0.1)',
                      color: '#008B8B',
                      padding: '2px 8px',
                      borderRadius: '10px'
                    }}>
                      {patient.language}
                    </span>
                  </div>

                  <div style={{ fontSize: '12.5px', color: '#475569', marginTop: '4px' }}>
                    <strong>Complaint:</strong> {patient.chiefComplaint}
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '2px' }}>
                    {patient.vitals} • Waiting: {patient.waitingTime}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    color: patient.triageColor,
                    background: `${patient.triageColor}15`,
                    padding: '3px 10px',
                    borderRadius: '12px'
                  }}>
                    {patient.triageStatus}
                  </span>
                  <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                    {patient.status}
                  </div>
                </div>

                <button
                  onClick={() => onSelectEncounterAndLaunch(patient.encounterRef)}
                  className="btn-primary"
                  style={{ fontSize: '12.5px', padding: '9px 18px', borderRadius: '20px' }}
                >
                  <span>Start Ambient Scribe</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
