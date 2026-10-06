import React, { useState, useEffect } from 'react';

/**
 * AyuSwar AI — Apple-Style Dynamic Island
 * Floating intelligent HUD with fluid morphing physics, real-time waveform visualizers,
 * and multi-state Indic audio/clinical telemetry.
 */
export default function DynamicIsland({
  mode = 'ready', // 'ready' | 'listening' | 'synthesizing' | 'playing' | 'abdm'
  activeLanguage = 'Telugu',
  spokenText = '',
  onToggleRecord,
  onOpenConsole,
  onOpenSpotlight,
  patientName = 'Ananya Rao'
}) {
  const [islandState, setIslandState] = useState(mode);
  const [isExpanded, setIsExpanded] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Sync with incoming mode prop if changed
  useEffect(() => {
    setIslandState(mode);
  }, [mode]);

  // Recording duration timer
  useEffect(() => {
    let interval = null;
    if (islandState === 'listening') {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(interval);
  }, [islandState]);

  const formatDuration = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        pointerEvents: 'auto',
        transition: 'all 360ms cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div 
        className="dynamic-island-shell"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'rgba(9, 14, 24, 0.94)',
          backdropFilter: 'blur(32px) saturate(210%)',
          WebkitBackdropFilter: 'blur(32px) saturate(210%)',
          border: islandState === 'listening' ? '1px solid rgba(239, 68, 68, 0.5)' : '1px solid rgba(255, 255, 255, 0.16)',
          borderRadius: isExpanded ? '28px' : '40px',
          padding: isExpanded ? '14px 22px' : '8px 18px',
          boxShadow: islandState === 'listening' 
            ? '0 16px 40px -4px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.3)' 
            : '0 16px 40px -6px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: isExpanded ? 'column' : 'row',
          alignItems: 'center',
          gap: isExpanded ? '12px' : '10px',
          color: '#FFFFFF',
          cursor: 'pointer',
          minWidth: isExpanded ? '380px' : '260px',
          maxWidth: '92vw',
          userSelect: 'none'
        }}
      >
        {/* Compact Default Pill State */}
        {!isExpanded && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '12px' }}>
            {/* Left Status Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {islandState === 'listening' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#EF4444', animation: 'pulse 1s infinite' }} />
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '14px' }}>
                    {[8, 14, 10, 16, 6].map((h, i) => (
                      <div 
                        key={i} 
                        style={{
                          width: '2.5px',
                          height: `${h}px`,
                          backgroundColor: '#EF4444',
                          borderRadius: '2px',
                          animation: `waveBar 0.8s ease-in-out infinite ${i * 0.15}s`
                        }} 
                      />
                    ))}
                  </div>
                </div>
              ) : islandState === 'synthesizing' ? (
                <span style={{ fontSize: '12px', animation: 'spin 1.5s linear infinite' }}>⚡</span>
              ) : islandState === 'playing' ? (
                <div style={{ display: 'flex', gap: '2px', alignItems: 'center', height: '12px' }}>
                  {[6, 12, 8, 14].map((h, i) => (
                    <div 
                      key={i} 
                      style={{
                        width: '2px',
                        height: `${h}px`,
                        backgroundColor: '#00A896',
                        borderRadius: '2px',
                        animation: `waveBar 0.6s ease-in-out infinite ${i * 0.12}s`
                      }} 
                    />
                  ))}
                </div>
              ) : (
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#00E5FF', boxShadow: '0 0 10px #00E5FF' }} />
              )}
              
              <span style={{ fontSize: '11.5px', fontWeight: 650, letterSpacing: '0.01em', color: '#F1F5F9' }}>
                {islandState === 'listening' ? `Rec [${activeLanguage}]` :
                 islandState === 'synthesizing' ? 'Synthesizing SOAP...' :
                 islandState === 'playing' ? 'Audio Rx Playing' :
                 islandState === 'abdm' ? 'ABDM Verified' :
                 'AyuSwar AI Active'}
              </span>
            </div>

            {/* Right Quick Telemetry */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {islandState === 'listening' ? (
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#FCA5A5', fontFamily: 'monospace' }}>
                  {formatDuration(duration)}
                </span>
              ) : (
                <span style={{ fontSize: '10.5px', color: '#94A3B8', background: 'rgba(255, 255, 255, 0.1)', padding: '2px 7px', borderRadius: '10px' }}>
                  ⌘K
                </span>
              )}
            </div>
          </div>
        )}

        {/* Expanded Rich State */}
        {isExpanded && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Top Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px' }}>
                  {islandState === 'listening' ? '🎙️' : islandState === 'playing' ? '🔊' : '🩺'}
                </span>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#FFFFFF' }}>
                    {islandState === 'listening' ? `Live Speech-to-Text (${activeLanguage})` :
                     islandState === 'playing' ? 'Spoken Chronotherapy Prescription' :
                     islandState === 'synthesizing' ? 'Indic Clinical Reasoning Engine' :
                     'AyuSwar Neural Co-Pilot'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94A3B8' }}>
                    Patient: {patientName} • ABDM HPR Network
                  </div>
                </div>
              </div>

              <button 
                onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: 'none',
                  color: '#FFFFFF',
                  borderRadius: '50%',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            </div>

            {/* Audio Waveform / Realtime Transcript simulation */}
            {islandState === 'listening' && (
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '14px', padding: '10px 14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '11px', color: '#EF4444', fontWeight: 700 }}>● LIVE RECORDING</span>
                  <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#FFFFFF' }}>{formatDuration(duration)}</span>
                </div>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '28px', justifyContent: 'center' }}>
                  {[12, 24, 18, 28, 14, 20, 26, 15, 22, 16, 25, 19, 10, 24, 14, 20].map((h, i) => (
                    <div 
                      key={i} 
                      style={{
                        width: '3.5px',
                        height: `${h}px`,
                        backgroundColor: i % 2 === 0 ? '#EF4444' : '#F87171',
                        borderRadius: '3px',
                        animation: `waveBar 0.7s ease-in-out infinite ${i * 0.08}s`
                      }} 
                    />
                  ))}
                </div>
                <div style={{ fontSize: '11px', color: '#E2E8F0', marginTop: '6px', fontStyle: 'italic', textAlign: 'center' }}>
                  "రోజూ రాత్రి భోజనం తర్వాత ఒక మాత్ర నీటితో తీసుకోండి..."
                </div>
              </div>
            )}

            {/* Playing State Waveform */}
            {islandState === 'playing' && (
              <div style={{ background: 'rgba(0, 0, 0, 0.4)', borderRadius: '14px', padding: '10px 14px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#00A896', fontWeight: 700 }}>♫ INDIC NATURAL AUDIO TTS</span>
                  <span style={{ fontSize: '11px', color: '#94A3B8' }}>24kHz Studio Neural</span>
                </div>
                <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '22px', justifyContent: 'center' }}>
                  {[8, 16, 12, 20, 10, 18, 14, 22, 15, 12, 18, 9, 14].map((h, i) => (
                    <div 
                      key={i} 
                      style={{
                        width: '3px',
                        height: `${h}px`,
                        backgroundColor: '#00A896',
                        borderRadius: '2px',
                        animation: `waveBar 0.6s ease-in-out infinite ${i * 0.1}s`
                      }} 
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quick Interactive Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '2px' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (islandState === 'listening') {
                    setIslandState('synthesizing');
                    setTimeout(() => setIslandState('ready'), 2000);
                  } else {
                    setIslandState('listening');
                  }
                }}
                style={{
                  background: islandState === 'listening' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(0, 168, 150, 0.2)',
                  border: islandState === 'listening' ? '1px solid #EF4444' : '1px solid #00A896',
                  color: '#FFFFFF',
                  padding: '7px 10px',
                  borderRadius: '12px',
                  fontSize: '11.5px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                {islandState === 'listening' ? '⏹ Stop & Transcribe' : '🎙️ Test Voice Rx'}
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onOpenSpotlight) onOpenSpotlight();
                  setIsExpanded(false);
                }}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: '#FFFFFF',
                  padding: '7px 10px',
                  borderRadius: '12px',
                  fontSize: '11.5px',
                  fontWeight: 650,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                🔍 Spotlight (⌘K)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
