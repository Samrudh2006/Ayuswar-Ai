import React, { useState } from 'react';
import { 
  Sun, 
  Wind, 
  Droplets, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Thermometer, 
  Activity 
} from 'lucide-react';

export default function KurnoolClimateSentinel({ onAddOrsToRx }) {
  const [orsAddedToast, setOrsAddedToast] = useState(false);

  const handleAddOrs = () => {
    if (onAddOrsToRx) {
      onAddOrsToRx();
    }
    setOrsAddedToast(true);
    setTimeout(() => setOrsAddedToast(false), 3500);
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #091E26 0%, #0F4C5C 100%)',
      borderRadius: '16px',
      padding: '16px 20px',
      color: '#ffffff',
      boxShadow: '0 4px 18px rgba(15, 76, 92, 0.12)',
      marginBottom: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Subtle Wave Accents */}
      <div style={{
        position: 'absolute',
        right: '-20px',
        bottom: '-20px',
        width: '120px',
        height: '120px',
        borderRadius: '50%',
        background: 'rgba(212, 175, 55, 0.08)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', color: '#38BDF8', padding: '3px 8px', borderRadius: '8px', fontWeight: 800, letterSpacing: '0.5px' }}>
            COPERNICUS • PHC WEATHER-HEALTH SENTINEL
          </span>
          <span style={{ fontSize: '11.5px', color: '#CBD5E1', fontWeight: 650 }}>
            Kurnool District Hospital OPD (Rayalaseema)
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#FDE047', fontWeight: 700 }}>
            <Thermometer size={14} />
            <span>37°C (Heat Index High)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#34D399', fontWeight: 700 }}>
            <Wind size={14} />
            <span>AQI 38 (Good)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#93C5FD', fontWeight: 700 }}>
            <Droplets size={14} />
            <span>Humidity 41%</span>
          </div>
        </div>
      </div>

      <div style={{
        background: 'rgba(255, 255, 255, 0.07)',
        borderRadius: '12px',
        padding: '12px 14px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', maxWidth: '620px' }}>
          <AlertTriangle size={18} color="#FBBF24" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontSize: '12.5px', fontWeight: 750, color: '#FEF3C7' }}>
              Rayalaseema Arid Thermal Advisory: Elevated Geriatric Dehydration Risk
            </div>
            <div style={{ fontSize: '11.5px', color: '#E2E8F0', marginTop: '2px', lineHeight: 1.4 }}>
              Ambient temperature is 37°C with low humidity. Recommend evaluating elderly and chronic renal patients for sub-clinical dehydration. Consider prophylactic Oral Rehydration Salts (ORS).
            </div>
          </div>
        </div>

        <button
          onClick={handleAddOrs}
          style={{
            background: '#D4AF37',
            color: '#081C24',
            border: 'none',
            borderRadius: '10px',
            padding: '7px 14px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
            transition: 'all 0.15s ease'
          }}
        >
          <Plus size={14} />
          <span>+ Add WHO ORS to Rx</span>
        </button>
      </div>

      {orsAddedToast && (
        <div style={{
          marginTop: '10px',
          background: '#ECFDF5',
          color: '#065F46',
          padding: '6px 12px',
          borderRadius: '8px',
          fontSize: '11.5px',
          fontWeight: 750,
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <CheckCircle2 size={14} color="#10B981" />
          <span>✓ Added WHO Oral Rehydration Salts (ORS) sachet (PMBJP Generic: ₹4.50) to active OPD prescription.</span>
        </div>
      )}
    </div>
  );
}
