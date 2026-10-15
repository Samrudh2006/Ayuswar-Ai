import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Clock, 
  Volume2 
} from 'lucide-react';

/**
 * NotificationDrawer Component
 * Senior-level real-time clinical telemetry slide-over drawer.
 * Displays streaming events from speech recognizer, DSP signal processors, and ABDM gateways.
 */
export default function NotificationDrawer({ isOpen, onClose }) {
  const [filter, setFilter] = useState('all');

  const alerts = [
    {
      id: 1,
      category: 'dsp',
      type: 'warning',
      title: 'Acoustic Wheeze Biomarker Flagged',
      detail: 'STFT spectral rolloff shifted above 2.4 kHz during patient speech. Exertional dyspnea tagged in ICD-10 R06.02.',
      timestamp: 'Just now',
      icon: Activity,
      color: '#D97706'
    },
    {
      id: 2,
      category: 'voice',
      type: 'success',
      title: 'Speech Buffer Synchronized',
      detail: 'Telugu-English multi-speaker diarization buffer synchronized. Browser speech (Web Speech API). Gnani voice integration: planned.',
      timestamp: '2 mins ago',
      icon: Volume2,
      color: '#008B8B'
    },
    {
      id: 3,
      category: 'safety',
      type: 'success',
      title: 'DDI Pharmacopeia Safety Screen Passed',
      detail: 'Zero CYP450 contraindications between Ecosprin 75mg and Metformin 500mg.',
      timestamp: '5 mins ago',
      icon: ShieldCheck,
      color: '#10B981'
    },
    {
      id: 4,
      category: 'abdm',
      type: 'info',
      title: 'ABDM FHIR R4 Bundle Synthesized',
      detail: 'Encounter package tagged to DEMO ABHA ID: DEMO-91-4521-8932-1049.',
      timestamp: '12 mins ago',
      icon: CheckCircle2,
      color: '#3B82F6'
    }
  ];

  if (!isOpen) return null;

  const filteredAlerts = filter === 'all' ? alerts : alerts.filter(a => a.category === filter);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1200,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(6, 26, 45, 0.55)',
      backdropFilter: 'blur(8px)'
    }}>
      <div style={{
        width: '420px',
        height: '100%',
        background: '#ffffff',
        boxShadow: '-10px 0 40px rgba(10, 37, 64, 0.25)',
        display: 'flex',
        flexDirection: 'column',
        animation: 'slideInRight 220ms cubic-bezier(0.23, 1, 0.32, 1)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #0A2540 0%, #008B8B 100%)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Bell size={20} color="#00D2D3" />
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#ffffff' }}>
                Clinical Telemetry & Alerts
              </h3>
              <div style={{ fontSize: '11px', color: '#E0F2FE', opacity: 0.85 }}>
                Real-time Voice & ABDM Pipeline Logs
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#ffffff', fontSize: '18px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        {/* Filter Pills */}
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          gap: '8px',
          background: '#F8FAFC'
        }}>
          {['all', 'voice', 'dsp', 'safety', 'abdm'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '4px 10px',
                borderRadius: '12px',
                border: filter === tab ? '1.5px solid #008B8B' : '1px solid #CBD5E1',
                background: filter === tab ? 'rgba(0, 139, 139, 0.12)' : '#ffffff',
                color: filter === tab ? '#008B8B' : '#64748B',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                textTransform: 'uppercase'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Alerts List */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filteredAlerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                style={{
                  padding: '14px',
                  borderRadius: '12px',
                  background: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      background: `${alert.color}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: alert.color
                    }}>
                      <Icon size={14} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#0A2540' }}>
                      {alert.title}
                    </span>
                  </div>
                  <span style={{ fontSize: '10.5px', color: '#94A3B8' }}>{alert.timestamp}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, paddingLeft: '32px' }}>
                  {alert.detail}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{ padding: '14px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC', textAlign: 'center' }}>
          <button
            onClick={onClose}
            className="btn-outline"
            style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '8px' }}
          >
            Dismiss Drawer
          </button>
        </div>
      </div>
    </div>
  );
}
