import React, { useState } from 'react';
import { ShieldCheck, Stethoscope, Building2, Tag, Copy, Check } from 'lucide-react';

/**
 * AbdmRegistryBadgeRow Component
 * Official National Health Authority (NHA) & Ayushman Bharat Digital Mission (ABDM) 
 * Linked Registry Identifiers & Clinical Coding Display.
 * 
 * Renders verified, scannable, and copyable badges for:
 * 1. 14-digit ABHA Number & PHR Address
 * 2. Healthcare Professional Registry (HPR) ID
 * 3. Health Facility Registry (HFR) Code
 * 4. WHO ICD-10 Diagnostic Code
 * 5. ABDM SNOMED-CT Concept ID
 */
export default function AbdmRegistryBadgeRow({
  abhaNumber,
  abhaAddress,
  hprId = 'HPR-IN-2024-99824',
  doctorName = 'Dr. Priya Sharma, MD',
  hfrId = 'HFR-AP-KRN-0042',
  facilityName = 'Kurnool Model Rural PHC',
  icd10,
  icd10Desc,
  snomedCt,
  snomedDesc,
  compact = false,
  onToast = null,
  style = {}
}) {
  const [copiedKey, setCopiedKey] = useState(null);

  // Normalize ABHA value
  const cleanAbha = abhaNumber || '91-4521-8932-1049';
  const cleanAddress = abhaAddress || (cleanAbha ? `${cleanAbha.slice(-4)}@abdm` : 'citizen@abdm');

  const handleCopy = (e, key, label, value, detail) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(value);
      }
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1800);
      if (onToast) {
        onToast(`✓ Copied ${label}: ${value} ${detail ? `(${detail})` : ''}`);
      }
    } catch {
      // Fallback
      if (onToast) {
        onToast(`${label}: ${value}`);
      }
    }
  };

  const badgeBase = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: compact ? '3px' : '5px',
    fontSize: compact ? '10.5px' : '11px',
    fontFamily: 'monospace',
    fontWeight: 700,
    padding: compact ? '2px 6px' : '3px 8px',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    userSelect: 'none',
    lineHeight: '1.3'
  };

  return (
    <div
      className="abdm-registry-badge-row"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: compact ? '4px' : '6px',
        flexWrap: 'wrap',
        ...style
      }}
      title="Official NHA/ABDM National Registries & Clinical Classification"
    >
      {/* 1. Official ABHA Number Badge */}
      <div
        onClick={(e) => handleCopy(e, 'abha', 'ABHA ID', cleanAbha, cleanAddress)}
        title={`ABHA Health ID: ${cleanAbha} • Address: ${cleanAddress} • Click to copy`}
        style={{
          ...badgeBase,
          background: copiedKey === 'abha' ? '#DCFCE7' : 'rgba(16, 185, 129, 0.08)',
          color: '#065F46',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 1px 2px rgba(16, 185, 129, 0.05)'
        }}
      >
        <ShieldCheck size={compact ? 11 : 12} color="#10B981" />
        <span>ABHA:</span>
        <strong style={{ color: '#047857' }}>{cleanAbha}</strong>
        {!compact && cleanAddress && (
          <span style={{ color: '#059669', opacity: 0.85, fontSize: '10px' }}>
            ({cleanAddress})
          </span>
        )}
        {copiedKey === 'abha' ? <Check size={11} color="#059669" /> : <Copy size={9} opacity={0.5} />}
      </div>

      {/* 2. Doctor HPR ID (Healthcare Professional Registry) */}
      <div
        onClick={(e) => handleCopy(e, 'hpr', 'Doctor HPR ID', hprId, doctorName)}
        title={`NHA HPR Registry: ${hprId} • Attending: ${doctorName} (APMC-2018-88421) • Click to copy`}
        style={{
          ...badgeBase,
          background: copiedKey === 'hpr' ? '#CCFBF1' : 'rgba(15, 76, 92, 0.06)',
          color: '#0F4C5C',
          border: '1px solid rgba(15, 76, 92, 0.22)',
          boxShadow: '0 1px 2px rgba(15, 76, 92, 0.05)'
        }}
      >
        <Stethoscope size={compact ? 11 : 12} color="#0F4C5C" />
        <span>HPR:</span>
        <strong style={{ color: '#0B3B48' }}>{hprId}</strong>
        {copiedKey === 'hpr' ? <Check size={11} color="#0F4C5C" /> : <Copy size={9} opacity={0.5} />}
      </div>

      {/* 3. Facility HFR Code (Health Facility Registry) */}
      <div
        onClick={(e) => handleCopy(e, 'hfr', 'Facility HFR Code', hfrId, facilityName)}
        title={`NHA HFR Registry: ${hfrId} • Facility: ${facilityName} • Click to copy`}
        style={{
          ...badgeBase,
          background: copiedKey === 'hfr' ? '#FEF3C7' : 'rgba(217, 119, 6, 0.08)',
          color: '#92400E',
          border: '1px solid rgba(217, 119, 6, 0.25)',
          boxShadow: '0 1px 2px rgba(217, 119, 6, 0.05)'
        }}
      >
        <Building2 size={compact ? 11 : 12} color="#D97706" />
        <span>HFR:</span>
        <strong style={{ color: '#78350F' }}>{hfrId}</strong>
        {copiedKey === 'hfr' ? <Check size={11} color="#92400E" /> : <Copy size={9} opacity={0.5} />}
      </div>

      {/* 4. WHO ICD-10 Diagnostic Code */}
      {icd10 && (
        <div
          onClick={(e) => handleCopy(e, 'icd10', 'WHO ICD-10 Code', icd10, icd10Desc)}
          title={`WHO ICD-10 Classification: ${icd10} — ${icd10Desc || 'Diagnosis Code'} • Click to copy`}
          style={{
            ...badgeBase,
            background: copiedKey === 'icd10' ? '#DBEAFE' : '#EFF6FF',
            color: '#1E40AF',
            border: '1px solid #BFDBFE',
            boxShadow: '0 1px 2px rgba(30, 64, 175, 0.05)'
          }}
        >
          <Tag size={compact ? 11 : 12} color="#2563EB" />
          <span>ICD-10:</span>
          <strong style={{ color: '#1D4ED8' }}>{icd10}</strong>
          {copiedKey === 'icd10' ? <Check size={11} color="#1D4ED8" /> : <Copy size={9} opacity={0.5} />}
        </div>
      )}

      {/* 5. ABDM SNOMED-CT Concept ID */}
      {snomedCt && (
        <div
          onClick={(e) => handleCopy(e, 'snomed', 'SNOMED-CT Concept', snomedCt, snomedDesc)}
          title={`ABDM SNOMED-CT Concept ID: ${snomedCt} — ${snomedDesc || 'Clinical Term'} • Click to copy`}
          style={{
            ...badgeBase,
            background: copiedKey === 'snomed' ? '#F3E8FF' : '#FAF5FF',
            color: '#6B21A8',
            border: '1px solid #E9D5FF',
            boxShadow: '0 1px 2px rgba(107, 33, 168, 0.05)'
          }}
        >
          <span>SNOMED:</span>
          <strong style={{ color: '#581C87' }}>{snomedCt}</strong>
          {copiedKey === 'snomed' ? <Check size={11} color="#6B21A8" /> : <Copy size={9} opacity={0.5} />}
        </div>
      )}
    </div>
  );
}

