import React, { useState, useEffect, useRef } from 'react';

/**
 * AyuSwar AI — Apple macOS Spotlight Command Palette
 * Global Quick Command Center (⌘K / Ctrl+K)
 * Provides instant fuzzy search across ABDM records, Indic clinical dictionaries,
 * patients, prescriptions, language voices, and diagnostic tools.
 */
export default function SpotlightCommand({
  isOpen,
  onClose,
  onNavigate,
  onSelectPatient,
  onTriggerVoiceRx,
  onOpenTechModal,
  onOpenDoctorPortal,
  onOpenPatientPortal
}) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  // Command & search items catalog
  const searchItems = [
    // Workspaces & Fast Portals
    {
      id: 'ws_doctor',
      category: 'Workspaces',
      icon: '🩺',
      title: 'Doctor Clinical Workspace (ABDM HPR)',
      subtitle: 'Triage queue, FHIR documentation, differential diagnosis',
      shortcut: '↵ Doc',
      action: () => {
        if (onOpenDoctorPortal) onOpenDoctorPortal();
        onClose();
      }
    },
    {
      id: 'ws_patient',
      category: 'Workspaces',
      icon: '👤',
      title: 'Patient Health Locker (ABHA Verified)',
      subtitle: 'Chronotherapy pillbox, spoken Rx in Telugu/Hindi, QR pass',
      shortcut: '↵ Pat',
      action: () => {
        if (onOpenPatientPortal) onOpenPatientPortal();
        onClose();
      }
    },
    {
      id: 'ws_console',
      category: 'Workspaces',
      icon: '🎙️',
      title: 'Live Ambient Clinical Console',
      subtitle: 'Real-time multi-dialect Indic speech recognition & SOAP notes',
      shortcut: '↵ Console',
      action: () => {
        if (onNavigate) onNavigate('console');
        onClose();
      }
    },

    // Patients & Clinical Records
    {
      id: 'pat_ananya',
      category: 'Patients',
      icon: '🫁',
      title: 'Ananya Rao (28F) — Acute Asthma & Wheezing',
      subtitle: 'ABHA: 91-4521-8932-1049 • Telugu Audio Rx • Dr. Priya Sharma',
      badge: 'Assigned Pulmonology',
      action: () => {
        if (onSelectPatient) onSelectPatient('Ananya Rao');
        if (onOpenPatientPortal) onOpenPatientPortal();
        onClose();
      }
    },
    {
      id: 'pat_suresh',
      category: 'Patients',
      icon: '❤️',
      title: 'Suresh Kumar (54M) — Type 2 Diabetes & Hypertension',
      subtitle: 'ABHA: 91-8832-1049-7712 • Hindi Audio Rx • Dr. Rajesh Verma',
      badge: 'Assigned Cardiology',
      action: () => {
        if (onSelectPatient) onSelectPatient('Suresh Kumar');
        if (onOpenPatientPortal) onOpenPatientPortal();
        onClose();
      }
    },
    {
      id: 'pat_kavitha',
      category: 'Patients',
      icon: '🩹',
      title: 'Kavitha Patel (42F) — Acute Gastroenteritis & Dehydration',
      subtitle: 'ABHA: 91-3310-9482-6651 • Gujarati/English Rx • Dr. Kavitha Reddy',
      badge: 'General Medicine',
      action: () => {
        if (onSelectPatient) onSelectPatient('Kavitha Patel');
        if (onOpenPatientPortal) onOpenPatientPortal();
        onClose();
      }
    },

    // Indic Voice Engines
    {
      id: 'lang_te',
      category: 'Indic Voice Models',
      icon: '🗣️',
      title: 'Telugu Clinical Acoustic Model (Rayalaseema / Telangana)',
      subtitle: '24kHz Studio TTS • Chronotherapy Dosage Word-Highlighting',
      badge: 'Ready (99.4% Acc)',
      action: () => {
        if (onTriggerVoiceRx) onTriggerVoiceRx('Telugu');
        onClose();
      }
    },
    {
      id: 'lang_hi',
      category: 'Indic Voice Models',
      icon: '🗣️',
      title: 'Hindi Clinical Acoustic Model (Standard / Awadhi)',
      subtitle: 'High fidelity Indic phoneme translation for OPD patients',
      badge: 'Ready (99.6% Acc)',
      action: () => {
        if (onTriggerVoiceRx) onTriggerVoiceRx('Hindi');
        onClose();
      }
    },
    {
      id: 'lang_ta',
      category: 'Indic Voice Models',
      icon: '🗣️',
      title: 'Tamil Medical Voice Synthesizer',
      subtitle: 'Real-time patient instructions for South-Zone PHCs',
      badge: 'Ready (99.1% Acc)',
      action: () => {
        if (onTriggerVoiceRx) onTriggerVoiceRx('Tamil');
        onClose();
      }
    },

    // Telemetry & Architecture
    {
      id: 'tech_specs',
      category: 'Architecture',
      icon: '⚡',
      title: 'Inspect AyuSwar Microservices Architecture',
      subtitle: 'ABDM Milestones M1/M2/M3, FHIR Bundles, Whisper Indic Fine-tunes',
      shortcut: '⌘T',
      action: () => {
        if (onOpenTechModal) onOpenTechModal();
        onClose();
      }
    }
  ];

  // Filter items based on user search query
  const filteredItems = searchItems.filter(item => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });

  // Focus input automatically when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Keyboard navigation inside spotlight
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + (filteredItems.length || 1)) % (filteredItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredItems, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="spotlight-backdrop"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        paddingLeft: '16px',
        paddingRight: '16px'
      }}
    >
      <div 
        className="spotlight-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '640px',
          background: 'rgba(255, 255, 255, 0.94)',
          backdropFilter: 'blur(36px) saturate(200%)',
          WebkitBackdropFilter: 'blur(36px) saturate(200%)',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.9)',
          boxShadow: '0 30px 60px -12px rgba(10, 37, 64, 0.25), 0 0 0 1px rgba(10, 37, 64, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Top Search Input Bar */}
        <div 
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
            gap: '12px'
          }}
        >
          <span style={{ fontSize: '20px', color: '#008B8B', display: 'flex', alignItems: 'center' }}>
            🔍
          </span>
          <input 
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Spotlight Search: Patients, ABDM HPR, Spoken Rx, Languages..."
            style={{
              flex: 1,
              border: 'none',
              background: 'transparent',
              fontSize: '16px',
              fontWeight: 500,
              color: '#0A2540',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 650, color: '#64748B', background: '#F1F5F9', padding: '3px 7px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              ESC
            </span>
          </div>
        </div>

        {/* Results List */}
        <div 
          style={{
            maxHeight: '380px',
            overflowY: 'auto',
            padding: '8px'
          }}
        >
          {filteredItems.length === 0 ? (
            <div style={{ padding: '32px 16px', textAlign: 'center', color: '#64748B' }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>🔎</div>
              <div style={{ fontSize: '14px', fontWeight: 600 }}>No matching clinical records or tools found</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>Try searching "Ananya", "Asthma", "Telugu", or "Doctor"</div>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    background: isSelected ? 'linear-gradient(135deg, rgba(0, 139, 139, 0.12) 0%, rgba(0, 168, 150, 0.08) 100%)' : 'transparent',
                    border: isSelected ? '1px solid rgba(0, 139, 139, 0.25)' : '1px solid transparent',
                    transition: 'all 120ms ease',
                    marginBottom: '2px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div 
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: isSelected ? '#008B8B' : '#F1F5F9',
                        color: isSelected ? '#FFFFFF' : '#0A2540',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '18px',
                        flexShrink: 0,
                        transition: 'background 140ms ease'
                      }}
                    >
                      {item.icon}
                    </div>

                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '13.5px', fontWeight: 700, color: '#0A2540', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </span>
                        {item.badge && (
                          <span style={{ fontSize: '10px', fontWeight: 700, color: '#008B8B', background: '#E6F7F8', padding: '1px 6px', borderRadius: '6px', flexShrink: 0 }}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '1px' }}>
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '12px', flexShrink: 0 }}>
                    <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600 }}>
                      {item.category}
                    </span>
                    {isSelected && (
                      <span style={{ fontSize: '11px', color: '#008B8B', fontWeight: 700 }}>
                        ↵
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* macOS Bottom Quick Footer */}
        <div 
          style={{
            padding: '10px 18px',
            background: 'rgba(248, 250, 252, 0.9)',
            borderTop: '1px solid rgba(226, 232, 240, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: '#64748B'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span><strong style={{ color: '#0A2540' }}>↑↓</strong> Navigate</span>
            <span><strong style={{ color: '#0A2540' }}>↵</strong> Select</span>
            <span><strong style={{ color: '#0A2540' }}>ESC</strong> Close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#00A896' }} />
            <span>AyuSwar Spotlight v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
