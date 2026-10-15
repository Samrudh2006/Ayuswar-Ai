import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PrescriptionPreviewView() {
  const { isDemoMode } = useApp();

  const handlePrint = () => {
    window.print();
  };

  const SAMPLE_RX = {
    patientName: 'Narayana Rao (Sample Patient)',
    vernacularName: 'నారాయణ రావు',
    abhaId: 'DEMO-ABHA-91-4521-8932',
    age: 58,
    gender: 'Male',
    date: new Date().toLocaleDateString('en-GB'),
    doctorName: 'Dr. Priya Sharma, MD',
    doctorSpecialty: 'Pulmonology & Internal Medicine',
    regNumber: 'DEMO-HPR-8921-9942',
    facilityName: 'District Hospital OPD Consultation Suite',
    diagnosis: 'Type-2 Diabetes Mellitus with Mild Bronchial Airway Irritation (ICD-10: E11.9 / J45.9)',
    vitals: 'BP: 130/85 mmHg, HR: 76 bpm, SpO2: 98%, Fasting Blood Sugar: 128 mg/dL',
    medications: [
      {
        name: 'Pantoprazole 40mg (Yellow Tablet)',
        vernacular: 'ప్యాంటోప్రజోల్ 40mg (పసుపు గోళీ)',
        generic: 'Pantoprazole 40mg Gastro-resistant (PMBJP Jan Aushadhi)',
        dosage: '1 Tablet Daily',
        timing: 'Morning: 08:30 AM (Before Breakfast • Empty Stomach)',
        duration: '30 Days'
      },
      {
        name: 'Metformin 500mg SR (Pink Tablet)',
        vernacular: 'మెట్‌ఫార్మిన్ 500mg (గులాబీ గోళీ)',
        generic: 'Metformin 500mg Prolonged-Release (PMBJP Jan Aushadhi)',
        dosage: '1 Tablet Daily',
        timing: 'Night: 08:30 PM (After Dinner)',
        duration: '30 Days'
      }
    ]
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '850px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#008B8B', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Home</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#0A2540', fontSize: '13px', fontWeight: 700 }}>ABDM FHIR Prescription Specimen</span>
      </div>

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 850, color: '#0A2540', marginBottom: '4px' }}>
            ABDM FHIR R4 Prescription Preview
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            Bilingual visual prescription slip with Jan Aushadhi generic mapping and timing instructions.
          </p>
        </div>

        <button
          onClick={handlePrint}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#0A2540',
            fontSize: '13px',
            fontWeight: 750,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Printer size={15} color="#008B8B" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Persistent Specimen Warning */}
      <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShieldAlert size={18} color="#D97706" />
        <span style={{ fontSize: '12.5px', color: '#92400E', fontWeight: 750 }}>
          HL7 FHIR R4 SPECIMEN — CLINICIAN REVIEW REQUIRED — NOT A VALID PHARMACY DISPENSE PRESCRIPTION
        </span>
      </div>

      {/* Prescription Document Sheet */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        boxShadow: '0 8px 30px rgba(10,37,64,0.06)',
        padding: '36px',
        position: 'relative'
      }}>
        {/* Clinician Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #008B8B', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#0A2540', marginBottom: '2px' }}>
              {SAMPLE_RX.doctorName}
            </h2>
            <div style={{ fontSize: '13px', color: '#008B8B', fontWeight: 750 }}>
              {SAMPLE_RX.doctorSpecialty}
            </div>
            <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
              Medical Reg No: {SAMPLE_RX.regNumber} • {SAMPLE_RX.facilityName}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0A2540' }}>Date: {SAMPLE_RX.date}</div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>FHIR R4 Bundle #RX-2025-0941</div>
          </div>
        </div>

        {/* Patient Demographics */}
        <div style={{ background: '#F8FAFC', borderRadius: '12px', padding: '16px', marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '13px' }}>
          <div>
            <span style={{ color: '#64748B' }}>Patient Name: </span>
            <strong style={{ color: '#0A2540' }}>{SAMPLE_RX.patientName} ({SAMPLE_RX.vernacularName})</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Age / Gender: </span>
            <strong style={{ color: '#0A2540' }}>{SAMPLE_RX.age}y / {SAMPLE_RX.gender}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>ABHA ID: </span>
            <strong style={{ color: '#0A2540', fontFamily: 'monospace' }}>{SAMPLE_RX.abhaId}</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Recorded Vitals: </span>
            <span style={{ color: '#0A2540' }}>{SAMPLE_RX.vitals}</span>
          </div>
        </div>

        {/* Clinical Diagnosis */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '4px' }}>
            Clinical Diagnosis:
          </div>
          <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>
            {SAMPLE_RX.diagnosis}
          </div>
        </div>

        {/* Prescription Symbol & Medication Table */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '24px', fontWeight: 900, color: '#008B8B', fontFamily: 'serif', marginBottom: '10px' }}>
            ℞
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {SAMPLE_RX.medications.map((med, idx) => (
              <div key={idx} style={{ border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px 16px', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: '#0A2540' }}>{idx + 1}. {med.name}</strong>
                    <div style={{ fontSize: '12px', color: '#008B8B', fontWeight: 700 }}>{med.vernacular}</div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 750, color: '#475569', background: '#F1F5F9', padding: '3px 8px', borderRadius: '6px' }}>
                    {med.duration}
                  </span>
                </div>
                <div style={{ fontSize: '12.5px', color: '#334155', marginTop: '6px' }}>
                  <strong>Dosage & Timing:</strong> {med.timing}
                </div>
                <div style={{ fontSize: '11.5px', color: '#059669', background: '#ECFDF5', padding: '4px 8px', borderRadius: '6px', marginTop: '6px', display: 'inline-block' }}>
                  Jan Aushadhi Equivalent: {med.generic}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor Signature & Specimen Footer */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '11px', color: '#94A3B8' }}>
            Generated via AyuSwar Clinical Prototype • Draft Specimen Only
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ borderBottom: '1px solid #0A2540', width: '180px', marginBottom: '4px' }} />
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#0A2540' }}>{SAMPLE_RX.doctorName}</div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>Attending Physician Digital Signature (Sandbox Verification)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
