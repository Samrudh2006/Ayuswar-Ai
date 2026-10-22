import React, { useState } from 'react';
import { Users, TrendingUp, ArrowUpRight } from 'lucide-react';

/**
 * PatientAnalyticsCard — High-Fidelity Inflow & Follow-Up Analytics Card
 * Matches exact clinical dashboard aesthetic with interactive SVG spline curves,
 * soft area gradients, highlight tooltips, and weekly performance metrics.
 */
export default function PatientAnalyticsCard() {
  const [activeRange, setActiveRange] = useState('weekly');

  // Multi-range dataset for interactive toggling
  const datasets = {
    weekly: {
      dates: ['May 5', 'May 6', 'May 7', 'May 8', 'May 9', 'May 10', 'May 11'],
      newPatients: [21, 25, 19, 17, 25, 32, 30],
      followUps: [17, 20, 23, 27, 29, 34, 33],
      totalNew: 142,
      newGrowth: '18%',
      totalFollowUps: 156,
      followUpGrowth: '12%',
      headline: 'Patient inflow increased by 18% this week',
      subtext: 'Follow-ups remain steady with a positive trend.'
    },
    monthly: {
      dates: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      newPatients: [88, 110, 134, 142],
      followUps: [75, 98, 122, 156],
      totalNew: 474,
      newGrowth: '24%',
      totalFollowUps: 451,
      followUpGrowth: '19%',
      headline: 'Monthly consultation volume up by 22%',
      subtext: 'Consistent upward trajectory across all OPD specialties.'
    },
    yearly: {
      dates: ['Q1', 'Q2', 'Q3', 'Q4'],
      newPatients: [980, 1240, 1420, 1680],
      followUps: [820, 1050, 1320, 1590],
      totalNew: '5,320',
      newGrowth: '31%',
      totalFollowUps: '4,780',
      followUpGrowth: '28%',
      headline: 'Annual patient retention rate reached 89.4%',
      subtext: 'Jan Aushadhi generic savings improved chronic medication adherence.'
    }
  };

  const current = datasets[activeRange] || datasets.weekly;

  // Chart coordinates mapping (Width: 840, Height: 240, Margin: X: 50-800, Y: 20-200)
  // Y range: 10 to 40 (span = 30)
  const mapY = (val) => {
    const minVal = 10;
    const maxVal = 40;
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    // Y=200 for val=10, Y=25 for val=40
    return 200 - ((clamped - minVal) / (maxVal - minVal)) * 175;
  };

  const getX = (idx, total) => {
    const startX = 60;
    const endX = 800;
    return startX + (idx / (total - 1)) * (endX - startX);
  };

  // Build smooth bezier path string
  const buildSmoothPath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i < pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const ptsNew = current.newPatients.map((val, idx) => ({ x: getX(idx, current.dates.length), y: mapY(val) }));
  const ptsFollow = current.followUps.map((val, idx) => ({ x: getX(idx, current.dates.length), y: mapY(val) }));

  const pathNew = buildSmoothPath(ptsNew);
  const pathFollow = buildSmoothPath(ptsFollow);

  // Area paths (closed to y=210)
  const areaNew = `${pathNew} L ${ptsNew[ptsNew.length - 1].x},210 L ${ptsNew[0].x},210 Z`;
  const areaFollow = `${pathFollow} L ${ptsFollow[ptsFollow.length - 1].x},210 L ${ptsFollow[0].x},210 Z`;

  // Highlight point is at index 5 for weekly, or last for others
  const hlIdx = activeRange === 'weekly' ? 5 : current.dates.length - 1;
  const hlNew = ptsNew[hlIdx];
  const hlFollow = ptsFollow[hlIdx];

  return (
    <div
      className="patient-analytics-card"
      style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '24px 28px',
        border: '1px solid rgba(15, 76, 92, 0.08)',
        boxShadow: '0 4px 20px -2px rgba(15, 76, 92, 0.04)',
        marginBottom: '26px'
      }}
    >
      {/* Card Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#0F766E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h3
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: '#081C24',
                fontFamily: 'Outfit, sans-serif',
                margin: 0
              }}
            >
              Patient Analytics
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '3px 0 0 0' }}>
              Track patient inflow and follow-ups trends over time
            </p>
          </div>
        </div>

        {/* Time Range Filter Pills */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: '#F1F5F9',
            padding: '3px 4px',
            borderRadius: '9999px'
          }}
        >
          {['weekly', 'monthly', 'yearly'].map((tab) => {
            const isActive = activeRange === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveRange(tab)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  border: 'none',
                  background: isActive ? '#CCFBF1' : 'transparent',
                  color: isActive ? '#0F766E' : '#64748B',
                  fontSize: '12px',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 150ms ease'
                }}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '16px',
          fontSize: '12.5px',
          color: '#475569',
          fontWeight: 650
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0F766E' }}></span>
          <span>New Patients</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563EB' }}></span>
          <span>Follow-ups</span>
        </div>
      </div>

      {/* Interactive SVG Chart */}
      <div style={{ position: 'relative', width: '100%', height: '260px' }}>
        <svg
          viewBox="0 0 840 240"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
          preserveAspectRatio="none"
        >
          <defs>
            {/* New Patients Teal Area Gradient */}
            <linearGradient id="newPatientsAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0F766E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0F766E" stopOpacity="0.01" />
            </linearGradient>

            {/* Follow-ups Blue Area Gradient */}
            <linearGradient id="followUpsAreaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.16" />
              <stop offset="100%" stopColor="#2563EB" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Dashed Grid Lines & Y-Axis Labels */}
          {[
            { val: 40, y: mapY(40) },
            { val: 35, y: mapY(35) },
            { val: 30, y: mapY(30) },
            { val: 25, y: mapY(25) },
            { val: 20, y: mapY(20) },
            { val: 15, y: mapY(15) },
            { val: 10, y: mapY(10) }
          ].map((grid, idx) => (
            <g key={idx}>
              <text x="35" y={grid.y + 4} fontSize="11" fill="#94A3B8" fontWeight="600" textAnchor="end">
                {grid.val}
              </text>
              <line
                x1="48"
                y1={grid.y}
                x2="810"
                y2={grid.y}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </g>
          ))}

          {/* Area Fills */}
          <path d={areaNew} fill="url(#newPatientsAreaGrad)" />
          <path d={areaFollow} fill="url(#followUpsAreaGrad)" />

          {/* Smooth Curves */}
          <path d={pathNew} fill="none" stroke="#0F766E" strokeWidth="2.8" strokeLinecap="round" />
          <path d={pathFollow} fill="none" stroke="#2563EB" strokeWidth="2.8" strokeLinecap="round" />

          {/* Regular Data Points (New Patients) */}
          {ptsNew.map((pt, i) => (
            <circle
              key={`np-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={i === hlIdx ? 6 : 4}
              fill={i === hlIdx ? '#FFFFFF' : '#0F766E'}
              stroke="#0F766E"
              strokeWidth={i === hlIdx ? 3 : 1.5}
            />
          ))}

          {/* Regular Data Points (Follow-ups) */}
          {ptsFollow.map((pt, i) => (
            <circle
              key={`fu-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={i === hlIdx ? 6 : 4}
              fill={i === hlIdx ? '#FFFFFF' : '#2563EB'}
              stroke="#2563EB"
              strokeWidth={i === hlIdx ? 3 : 1.5}
            />
          ))}

          {/* Highlight Tooltip for Follow-ups (Blue Badge) */}
          {hlFollow && (
            <g>
              <rect
                x={hlFollow.x - 45}
                y={hlFollow.y - 34}
                width="90"
                height="24"
                rx="12"
                fill="#2563EB"
              />
              <text
                x={hlFollow.x}
                y={hlFollow.y - 18}
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="800"
                textAnchor="middle"
              >
                {`${current.followUps[hlIdx]} Follow-ups`}
              </text>
            </g>
          )}

          {/* Highlight Tooltip for New Patients (Teal Badge) */}
          {hlNew && (
            <g>
              <rect
                x={hlNew.x - 48}
                y={hlNew.y + 12}
                width="96"
                height="24"
                rx="12"
                fill="#0F766E"
              />
              <text
                x={hlNew.x}
                y={hlNew.y + 28}
                fill="#FFFFFF"
                fontSize="11"
                fontWeight="800"
                textAnchor="middle"
              >
                {`${current.newPatients[hlIdx]} New Patients`}
              </text>
            </g>
          )}

          {/* X-Axis Date Labels */}
          {current.dates.map((dt, i) => (
            <text
              key={i}
              x={getX(i, current.dates.length)}
              y="230"
              fontSize="11.5"
              fill="#64748B"
              fontWeight="650"
              textAnchor="middle"
            >
              {dt}
            </text>
          ))}
        </svg>
      </div>

      {/* Bottom Summary Performance Banner */}
      <div
        style={{
          marginTop: '22px',
          background: 'rgba(16, 185, 129, 0.05)',
          border: '1px solid rgba(16, 185, 129, 0.16)',
          borderRadius: '14px',
          padding: '14px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: '#DCFCE7',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <TrendingUp size={20} />
          </div>
          <div>
            <div style={{ fontSize: '13.5px', fontWeight: 800, color: '#064E3B' }}>
              {current.headline}
            </div>
            <div style={{ fontSize: '12px', color: '#047857', marginTop: '2px' }}>
              {current.subtext}
            </div>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B', fontWeight: 700 }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0F766E' }}></span>
              <span>New Patients</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#081C24' }}>
                {current.totalNew}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center' }}>
                <ArrowUpRight size={12} /> {current.newGrowth} <span style={{ color: '#94A3B8', fontWeight: 500, marginLeft: 2 }}>vs. last week</span>
              </span>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748B', fontWeight: 700 }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#2563EB' }}></span>
              <span>Follow-ups</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#081C24' }}>
                {current.totalFollowUps}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center' }}>
                <ArrowUpRight size={12} /> {current.followUpGrowth} <span style={{ color: '#94A3B8', fontWeight: 500, marginLeft: 2 }}>vs. last week</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
