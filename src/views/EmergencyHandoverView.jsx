import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function EmergencyHandoverView() {
  const { isDemoMode } = useApp();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '36px 24px', maxWidth: '900px', margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
        <Link to="/emergency" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0F4C5C', textDecoration: 'none', fontSize: '13px', fontWeight: 700 }}>
          <ArrowLeft size={16} />
          <span>Emergency Triage</span>
        </Link>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ color: '#081C24', fontSize: '13px', fontWeight: 700 }}>Paramedic Handover Record</span>
      </div>

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: 850, color: '#081C24', marginBottom: '4px' }}>
            Emergency Pre-Hospital Handover Record
          </h1>
          <p style={{ fontSize: '13px', color: '#64748B' }}>
            Standardized digital clinical transfer document between 108 ALS paramedics and receiving hospital trauma bay.
          </p>
        </div>

        <button
          onClick={handlePrint}
          style={{
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid #CBD5E1',
            background: '#FFFFFF',
            color: '#081C24',
            fontSize: '13px',
            fontWeight: 750,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Printer size={15} color="#0F4C5C" />
          <span>Print / Export PDF</span>
        </button>
      </div>

      {/* Simulation Watermark Banner */}
      <div style={{ background: '#FFFBEB', border: '1.5px solid #FCD34D', borderRadius: '12px', padding: '14px 18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <ShieldAlert size={18} color="#D97706" />
        <span style={{ fontSize: '12.5px', color: '#92400E', fontWeight: 750 }}>
          PROTOTYPE SPECIMEN: This document is a software simulation artifact. Not an official legal hospital record.
        </span>
      </div>

      {/* Handover Document Paper Container */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #CBD5E1',
        boxShadow: '0 8px 30px rgba(10,37,64,0.06)',
        padding: '36px',
        position: 'relative'
      }}>
        {/* Document Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0A2540', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#081C24' }}>
              SANJIVANI-108 EMERGENCY MEDICAL SERVICES
            </div>
            <div style={{ fontSize: '12px', color: '#475569' }}>
              Government Health Transport & Trauma Transit Network (Simulation Record)
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#DC2626', background: '#FEE2E2', padding: '3px 8px', borderRadius: '6px', display: 'inline-block' }}>
              TRIAGE RED: CATEGORY 1
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
              Handover ID: SIM-HO-849201
            </div>
          </div>
        </div>

        {/* Section 1: Demographics & Transit */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px', fontSize: '13px' }}>
          <div>
            <span style={{ color: '#64748B' }}>Patient Name: </span>
            <strong style={{ color: '#081C24' }}>Narayana Rao (Sample Patient)</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Age / Gender: </span>
            <strong style={{ color: '#081C24' }}>58 Years / Male</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Transit Unit: </span>
            <strong style={{ color: '#081C24' }}>ALS-108-AP-9942 (Senior EMT Unit)</strong>
          </div>
          <div>
            <span style={{ color: '#64748B' }}>Incident Location: </span>
            <strong style={{ color: '#081C24' }}>Kurnool Old City, Andhra Pradesh</strong>
          </div>
        </div>

        {/* Section 2: Vitals at Scene */}
        <div style={{ background: '#FAF8F5', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#081C24', textTransform: 'uppercase', marginBottom: '10px' }}>
            Pre-Hospital Vital Signs Baseline:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
            <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Blood Pressure</div>
              <div style={{ fontSize: '15px', fontWeight: 850, color: '#DC2626' }}>90/60 mmHg</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Heart Rate</div>
              <div style={{ fontSize: '15px', fontWeight: 850, color: '#081C24' }}>118 bpm</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Oxygen (SpO2)</div>
              <div style={{ fontSize: '15px', fontWeight: 850, color: '#D97706' }}>91% on room air</div>
            </div>
            <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>GCS Scale</div>
              <div style={{ fontSize: '15px', fontWeight: 850, color: '#081C24' }}>14/15</div>
            </div>
          </div>
        </div>

        {/* Section 3: Primary Clinical Impression & Interventions */}
        <div style={{ marginBottom: '24px', fontSize: '13px', lineHeight: 1.6 }}>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#081C24', textTransform: 'uppercase', marginBottom: '8px' }}>
            Pre-Hospital Clinical Assessment:
          </div>
          <p style={{ color: '#334155', margin: '0 0 10px 0' }}>
            <strong>Suspected Diagnosis:</strong> Acute Coronary Syndrome (STEMI) with profound diaphoresis, substernal crushing chest pain, and radiation to left mandible and arm.
          </p>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#081C24', textTransform: 'uppercase', marginBottom: '6px' }}>
            Interventions Administered In-Transit:
          </div>
          <ul style={{ color: '#334155', margin: 0, paddingLeft: '20px' }}>
            <li>High-flow oxygen administered via non-rebreather mask at 10 L/min (SpO2 stabilized to 97%).</li>
            <li>12-lead ECG telemetry transmitted to receiving cath-lab team.</li>
            <li>Continuous ECG cardiac rhythm monitoring active.</li>
          </ul>
        </div>

        {/* Section 4: Receiving Hospital & Signatures */}
        <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Receiving Facility:</div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#081C24' }}>Government General Hospital (Trauma Center)</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>Destination Bay: Red Bay #02</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ borderBottom: '1px solid #0A2540', width: '180px', marginBottom: '4px' }} />
            <div style={{ fontSize: '11px', color: '#475569' }}>Lead Paramedic Handover Signature (Simulated Protocol)</div>
          </div>
        </div>
      </div>
    </div>
  );
}
