import React from 'react';

/**
 * AyuSwar AI — Apple Health-Style Activity Concentric Rings
 * Renders smooth animated SVG concentric rings with glowing gradient caps
 * for Clinical Precision, Chronotherapy Adherence, and ABDM Sync.
 */
export default function AppleHealthRing({
  adherence = 88,    // 0-100% (Red/Coral Ring)
  precision = 99.4,  // 0-100% (Cyan/Teal Ring)
  abdmSync = 100,    // 0-100% (Amber/Gold Ring)
  size = 140,
  showLabels = true
}) {
  const strokeWidth = 10;
  const center = size / 2;

  // Radii for outer, middle, inner rings
  const rOuter = center - strokeWidth;
  const rMiddle = rOuter - strokeWidth - 4;
  const rInner = rMiddle - strokeWidth - 4;

  const getCircumference = (r) => 2 * Math.PI * r;

  const cOuter = getCircumference(rOuter);
  const cMiddle = getCircumference(rMiddle);
  const cInner = getCircumference(rInner);

  const offsetOuter = cOuter - (adherence / 100) * cOuter;
  const offsetMiddle = cMiddle - (precision / 100) * cMiddle;
  const offsetInner = cInner - (abdmSync / 100) * cInner;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
      <div style={{ position: 'relative', width: `${size}px`, height: `${size}px` }}>
        <svg 
          width={size} 
          height={size} 
          style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
        >
          <defs>
            <linearGradient id="ringAdherence" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF453A" />
              <stop offset="100%" stopColor="#FF6961" />
            </linearGradient>
            <linearGradient id="ringPrecision" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00A896" />
              <stop offset="100%" stopColor="#30D158" />
            </linearGradient>
            <linearGradient id="ringAbdm" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9F0A" />
              <stop offset="100%" stopColor="#FFD60A" />
            </linearGradient>
          </defs>

          {/* Background Track Circles */}
          <circle cx={center} cy={center} r={rOuter} fill="none" stroke="rgba(255, 69, 58, 0.15)" strokeWidth={strokeWidth} />
          <circle cx={center} cy={center} r={rMiddle} fill="none" stroke="rgba(0, 168, 150, 0.15)" strokeWidth={strokeWidth} />
          <circle cx={center} cy={center} r={rInner} fill="none" stroke="rgba(255, 159, 10, 0.15)" strokeWidth={strokeWidth} />

          {/* Foreground Animated Circles */}
          <circle
            cx={center}
            cy={center}
            r={rOuter}
            fill="none"
            stroke="url(#ringAdherence)"
            strokeWidth={strokeWidth}
            strokeDasharray={cOuter}
            strokeDashoffset={offsetOuter}
            strokeLinecap="round"
            className="health-ring-circle"
          />
          <circle
            cx={center}
            cy={center}
            r={rMiddle}
            fill="none"
            stroke="url(#ringPrecision)"
            strokeWidth={strokeWidth}
            strokeDasharray={cMiddle}
            strokeDashoffset={offsetMiddle}
            strokeLinecap="round"
            className="health-ring-circle"
          />
          <circle
            cx={center}
            cy={center}
            r={rInner}
            fill="none"
            stroke="url(#ringAbdm)"
            strokeWidth={strokeWidth}
            strokeDasharray={cInner}
            strokeDashoffset={offsetInner}
            strokeLinecap="round"
            className="health-ring-circle"
          />
        </svg>

        {/* Center Sparkle Badge */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px'
          }}
        >
          🩺
        </div>
      </div>

      {/* Metric Labels */}
      {showLabels && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF453A', boxShadow: '0 0 6px #FF453A' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Rx Adherence</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>{adherence}% <span style={{ fontSize: '10px', color: '#16A34A', fontWeight: 600 }}>On Track</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#00A896', boxShadow: '0 0 6px #00A896' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>Voice AI Precision</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>{precision}% <span style={{ fontSize: '10px', color: '#00A896', fontWeight: 600 }}>Indic NER</span></div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#FF9F0A', boxShadow: '0 0 6px #FF9F0A' }} />
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>ABDM Token Sync</div>
              <div style={{ fontSize: '14px', fontWeight: 800, color: '#0A2540' }}>{abdmSync}% <span style={{ fontSize: '10px', color: '#D97706', fontWeight: 600 }}>Milestone M3</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
