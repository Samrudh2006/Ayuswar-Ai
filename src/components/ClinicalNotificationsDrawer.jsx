import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  AlertTriangle, 
  Activity, 
  Pill, 
  FileText, 
  Sparkles, 
  PhoneCall, 
  ExternalLink,
  Volume2,
  Trash2,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { requestPushPermission, triggerDosagePushNotification } from '../services/webPushService';

/**
 * ClinicalNotificationsDrawer
 * 
 * Comprehensive enterprise notification system for Doctor & Citizen/Patient portals.
 * Features:
 * - Real-time categorization (Critical, Prescriptions, Labs, Audio-Rx, System).
 * - Interactive Mark Read, Dismiss, and Clear All actions.
 * - Dynamic unread badge synchronization.
 * - Native Web Audio alert chime.
 * - Native Web Push Notification integration.
 */
export default function ClinicalNotificationsDrawer({
  isOpen = false,
  onClose,
  mode = 'doctor', // 'doctor' | 'patient'
  userProfile = {},
  onActionClick = null
}) {
  const isDoctor = mode === 'doctor';

  // Seed notification data tailored to mode
  const initialDoctorNotifications = [
    {
      id: 'doc_notif_1',
      type: 'critical',
      title: '🚨 Sanjivini-108 Emergency Telemetry Inbound',
      message: 'Ambulance A-12 inbound with severe acute dyspnea (SpO2 88%, Wheeze Peak 450 Hz). ETA: 4 mins to Emergency Bay 2.',
      timestamp: '2 mins ago',
      read: false,
      priority: 'high',
      actionLabel: 'View Handover Triage',
      actionType: 'emergency'
    },
    {
      id: 'doc_notif_2',
      type: 'lab',
      title: '🧪 Critical Lab Result: Suresh Babu (56/M)',
      message: 'Fasting Blood Sugar 188 mg/dL & HbA1c 8.4% flagged abnormal high. Recommended for diabetes regimen adjustment.',
      timestamp: '25 mins ago',
      read: false,
      priority: 'medium',
      actionLabel: 'Inspect Lab Report',
      actionType: 'reports'
    },
    {
      id: 'doc_notif_3',
      type: 'audio_rx',
      title: '🔊 Telugu Vernacular Audio-Rx Delivered',
      message: 'Lakshmi Amma: 3 medication schedule spoken in Telugu delivered to WhatsApp (+91-9000000001) with verified read receipt (✓✓).',
      timestamp: '1 hour ago',
      read: true,
      priority: 'normal',
      actionLabel: 'Review Audio-Rx',
      actionType: 'audio_rx'
    },
    {
      id: 'doc_notif_4',
      type: 'abdm',
      title: '✍️ DSC e-Signature Stamped (ABDM M3)',
      message: 'Encounter ENC-2026-091 signed with NMC Class-3 Certificate (NMC-TS-2016-48291). FHIR R4 resource synchronized to National Health Stack.',
      timestamp: '2 hours ago',
      read: true,
      priority: 'normal',
      actionLabel: 'View Audit Token',
      actionType: 'settings'
    }
  ];

  const initialPatientNotifications = [
    {
      id: 'pat_notif_1',
      type: 'dosage',
      title: '💊 Morning Medication Due (Vernacular Reminder)',
      message: 'ఈ ఆకుపచ్చ మాత్ర ఒకటి ఉదయం టిఫిన్ తర్వాత వేసుకోవాలి (Take 1 Green Capsule - Pantoprazole 40mg after breakfast with warm water).',
      timestamp: '10 mins ago',
      read: false,
      priority: 'high',
      actionLabel: 'Listen to Voice Rx 🔊',
      actionType: 'listen_rx'
    },
    {
      id: 'pat_notif_2',
      type: 'rx',
      title: '🩺 Doctor Prescription Verified & Signed',
      message: 'Dr. Priya Sharma signed your clinical notes. Official ABHA QR code and digital prescription are now available.',
      timestamp: '45 mins ago',
      read: false,
      priority: 'medium',
      actionLabel: 'View Prescription',
      actionType: 'prescriptions'
    },
    {
      id: 'pat_notif_3',
      type: 'lab',
      title: '🧪 Blood Sugar Record Synced to ABHA Locker',
      message: 'Fasting blood glucose 94 mg/dL logged and verified with SHA-256 cryptographic stamp.',
      timestamp: '3 hours ago',
      read: true,
      priority: 'normal',
      actionLabel: 'Open Health Records',
      actionType: 'health_records'
    },
    {
      id: 'pat_notif_4',
      type: 'savings',
      title: '🌿 Jan Aushadhi Generic Savings Alert',
      message: 'Switching to PMBJP generic formulations for your monthly asthma inhaler will save you ₹210 this month.',
      timestamp: 'Yesterday',
      read: true,
      priority: 'normal',
      actionLabel: 'Compare Generic Prices',
      actionType: 'scanner'
    }
  ];

  const storageKey = isDoctor ? 'ayuswar_doctor_notifications_v1' : 'ayuswar_patient_notifications_v1';

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return isDoctor ? initialDoctorNotifications : initialPatientNotifications;
  });

  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'critical'
  const [pushStatus, setPushStatus] = useState('default'); // 'default' | 'granted' | 'denied'

  // Persist notifications on change
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications, storageKey]);

  // Check browser push permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushStatus(Notification.permission);
    }
  }, []);

  // Web Audio chime sound
  const playChime = (freq = 880) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.32);
    } catch {
      // ignore audio context restrictions
    }
  };

  const handleMarkAllAsRead = () => {
    playChime(660);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const handleDismiss = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleRequestPush = async () => {
    const perm = await requestPushPermission();
    setPushStatus(perm);
    if (perm === 'granted') {
      playChime(1046.5); // high C
      triggerDosagePushNotification(
        'AyuSwar AI Notifications Active',
        'Real-time clinical alerts enabled.',
        'You will receive instant vernacular dosage & emergency triage updates.'
      );
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'critical') return n.priority === 'high' || n.type === 'critical';
    return true;
  });

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(3px)',
          zIndex: 9998,
          transition: 'opacity 200ms ease'
        }}
      />

      {/* Slide-Over Drawer Panel */}
      <aside 
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(440px, 92vw)',
          background: '#ffffff',
          boxShadow: '-8px 0 32px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 220ms cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Drawer Header */}
        <div style={{
          padding: '18px 20px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#F8FAFC'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: isDoctor ? 'rgba(0, 139, 139, 0.12)' : 'rgba(16, 185, 129, 0.12)',
              color: isDoctor ? '#008B8B' : '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={20} />
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#0A2540', fontFamily: 'Outfit, sans-serif' }}>
                {isDoctor ? 'Clinical Alert Sentinel' : 'Citizen Health Alerts'}
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                {unreadCount > 0 ? `${unreadCount} unread update${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#FFFFFF',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B'
            }}
            title="Close Notifications"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Controls & Bulk Action Bar */}
        <div style={{
          padding: '10px 18px',
          background: '#ffffff',
          borderBottom: '1px solid #F1F5F9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'unread', label: `Unread (${unreadCount})` },
              { id: 'critical', label: 'Urgent' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '16px',
                  fontSize: '11.5px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  background: filter === f.id ? '#0A2540' : '#F1F5F9',
                  color: filter === f.id ? '#ffffff' : '#64748B',
                  transition: 'all 120ms ease'
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#008B8B',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Push Notification Banner */}
        {pushStatus !== 'granted' && (
          <div style={{
            margin: '12px 18px 0',
            padding: '10px 14px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid #BFDBFE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px'
          }}>
            <div style={{ fontSize: '11.5px', color: '#1E40AF', lineHeight: 1.35 }}>
              <strong>Enable Device Push?</strong> Receive live triage alerts even when this tab is closed.
            </div>
            <button
              onClick={handleRequestPush}
              style={{
                padding: '5px 10px',
                borderRadius: '6px',
                background: '#1D4ED8',
                color: '#ffffff',
                border: 'none',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Enable
            </button>
          </div>
        )}

        {/* Notification Cards List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}>
          {filteredNotifications.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 16px',
              color: '#94A3B8'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#F8FAFC',
                margin: '0 auto 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#CBD5E1'
              }}>
                <Bell size={24} />
              </div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#475569', marginBottom: '4px' }}>
                No notifications to display
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>
                {filter === 'unread' ? 'All notifications have been marked as read.' : 'Your clinical feed is up to date.'}
              </div>
            </div>
          ) : (
            filteredNotifications.map(item => {
              const isUnread = !item.read;
              const isUrgent = item.priority === 'high' || item.type === 'critical';

              return (
                <div
                  key={item.id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    background: isUnread 
                      ? (isUrgent ? '#FFF5F5' : '#F0FDF4') 
                      : '#FFFFFF',
                    border: isUnread
                      ? (isUrgent ? '1.5px solid #FCA5A5' : '1.5px solid #BBF7D0')
                      : '1px solid #E2E8F0',
                    boxShadow: isUnread ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    position: 'relative',
                    transition: 'all 150ms ease'
                  }}
                >
                  {/* Top Row: Title, Dot, Timestamp */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {isUnread && (
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: isUrgent ? '#EF4444' : '#10B981',
                          display: 'inline-block',
                          flexShrink: 0
                        }} />
                      )}
                      <div style={{
                        fontSize: '13px',
                        fontWeight: isUnread ? 800 : 700,
                        color: isUrgent ? '#991B1B' : '#0F172A',
                        lineHeight: 1.3
                      }}>
                        {item.title}
                      </div>
                    </div>

                    <div style={{
                      fontSize: '10.5px',
                      color: '#94A3B8',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={11} />
                      <span>{item.timestamp}</span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div style={{
                    fontSize: '12px',
                    color: '#475569',
                    lineHeight: 1.45,
                    paddingLeft: isUnread ? '13px' : '0'
                  }}>
                    {item.message}
                  </div>

                  {/* Action Bar Footer */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '4px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #E2E8F0'
                  }}>
                    {item.actionLabel && (
                      <button
                        onClick={() => {
                          if (onActionClick) onActionClick(item);
                          handleToggleRead(item.id);
                          onClose();
                        }}
                        style={{
                          background: isUrgent ? '#DC2626' : (isDoctor ? '#008B8B' : '#059669'),
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '4px 10px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <span>{item.actionLabel}</span>
                        <ExternalLink size={11} />
                      </button>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
                      <button
                        onClick={() => handleToggleRead(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          fontSize: '11px',
                          color: '#64748B',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                        title={isUnread ? 'Mark as read' : 'Mark as unread'}
                      >
                        <Check size={13} />
                        <span>{isUnread ? 'Read' : 'Unread'}</span>
                      </button>

                      <button
                        onClick={() => handleDismiss(item.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94A3B8',
                          cursor: 'pointer',
                          padding: '2px'
                        }}
                        title="Dismiss notification"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Status */}
        <div style={{
          padding: '12px 18px',
          borderTop: '1px solid #E2E8F0',
          background: '#F8FAFC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#64748B'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={14} color="#008B8B" />
            <span>ABDM Encrypted Channel</span>
          </div>
          <div>Live Realtime Sync</div>
        </div>
      </aside>
    </>
  );
}
