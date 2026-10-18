import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw } from 'lucide-react';
import { checkEvonStatus, EVON_MODEL_METADATA } from '../services/gnaniEvonService';

/**
 * EvonStatusChip Component
 * Requirement (4): Chip shows LIVE only after a real 200 response from /api/evon/status
 * Displays model name, latency (ms), and last-success time.
 * If unset/unavailable, shows a clear 'Evon unavailable' state and indicates FALLBACK mode.
 */
export default function EvonStatusChip({ compact = false, showDetails = false }) {
  const [statusData, setStatusData] = useState({
    status: 'CHECKING',
    available: false,
    model: EVON_MODEL_METADATA.modelId,
    latencyMs: null,
    lastSuccessTime: null,
    reason: null
  });
  const [isChecking, setIsChecking] = useState(false);

  const fetchStatus = async () => {
    setIsChecking(true);
    try {
      const res = await checkEvonStatus();
      setStatusData(res);
    } catch (err) {
      setStatusData({
        status: 'UNAVAILABLE',
        available: false,
        model: EVON_MODEL_METADATA.modelId,
        latencyMs: null,
        lastSuccessTime: null,
        reason: err.message
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const isLive = statusData.status === 'LIVE' && statusData.available;

  const formatLastSuccess = (isoStr) => {
    if (!isoStr) return 'Never in this session';
    try {
      return new Date(isoStr).toLocaleTimeString('en-IN', { hour12: false });
    } catch {
      return isoStr;
    }
  };

  if (compact) {
    return (
      <div 
        onClick={fetchStatus}
        title={isLive 
          ? `Evon 30B LIVE · Latency: ${statusData.latencyMs}ms · Last Success: ${formatLastSuccess(statusData.lastSuccessTime)}` 
          : `Evon Offline · Rule-based Fallback Active (Not Evon) · ${statusData.reason || 'Server env vars unset'} · Click to re-check`
        }
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '3px 8px',
          borderRadius: '12px',
          background: isLive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${isLive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(239, 68, 68, 0.3)'}`,
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 700,
          color: isLive ? '#10B981' : '#EF4444'
        }}
      >
        <span style={{
          width: '7px',
          height: '7px',
          borderRadius: '50%',
          background: isLive ? '#10B981' : '#EF4444',
          boxShadow: isLive ? '0 0 6px #10B981' : 'none',
          display: 'inline-block'
        }} />
        <span>{isLive ? '● EVON 30B: LIVE' : '○ EVON: OFFLINE — Rule-based Fallback Active (Not Evon)'}</span>
        {isChecking && <RefreshCw size={10} style={{ animation: 'spin 1s linear infinite' }} />}
      </div>
    );
  }

  return (
    <div style={{
      background: isLive ? 'rgba(6, 78, 59, 0.35)' : 'rgba(15, 23, 42, 0.65)',
      borderRadius: '10px',
      border: `1px solid ${isLive ? '#059669' : '#334155'}`,
      padding: '10px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      color: '#F8FAFC'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '6px',
            background: isLive ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : '#334155',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}>
            <Cpu size={14} />
          </div>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Gnani Evon (30B-A3B)</span>
              <span style={{
                fontSize: '9px',
                padding: '1px 6px',
                borderRadius: '4px',
                fontWeight: 800,
                background: isLive ? '#10B981' : '#F59E0B',
                color: isLive ? '#FFFFFF' : '#0A2540'
              }}>
                {isLive ? 'LIVE (200 OK)' : 'Rule-based FALLBACK (Not Evon)'}
              </span>
            </div>
            <div style={{ fontSize: '10px', color: '#94A3B8' }}>
              {isLive ? statusData.model : 'Evon unavailable on server — using Rule-based FALLBACK (Not Evon)'}
            </div>
          </div>
        </div>

        <button
          onClick={fetchStatus}
          disabled={isChecking}
          title="Refresh Evon server status check"
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '6px',
            color: '#E2E8F0',
            padding: '4px 8px',
            fontSize: '10.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <RefreshCw size={11} style={{ animation: isChecking ? 'spin 1s linear infinite' : 'none' }} />
          <span>{isChecking ? 'Checking...' : 'Check Status'}</span>
        </button>
      </div>

      {(showDetails || isLive || statusData.reason) && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '10.5px',
          color: '#CBD5E1',
          paddingTop: '4px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {isLive ? (
            <>
              <div>⚡ Latency: <strong style={{ color: '#10B981' }}>{statusData.latencyMs} ms</strong></div>
              <div>🕒 Last Success: <strong>{formatLastSuccess(statusData.lastSuccessTime)}</strong></div>
              <div>🔒 Route: <code>/api/evon/chat</code></div>
            </>
          ) : (
            <div style={{ color: '#FCD34D' }}>
              ⚠️ Reason: {statusData.reason || 'Server credentials (EVON_BASE_URL / EVON_API_KEY) not configured.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
