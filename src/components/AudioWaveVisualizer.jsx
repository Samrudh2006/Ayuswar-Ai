import React, { useEffect, useRef } from 'react';

/**
 * AudioWaveVisualizer Component
 * High-performance 60FPS WebAudio Canvas visualizer simulating dual-frequency vocal bands,
 * noise thresholds, and speech activity detection (VAD).
 */
export default function AudioWaveVisualizer({ 
  isActive = false, 
  speaker = 'doctor', // 'doctor' | 'patient' | 'ambient'
  barCount = 36,
  height = 42,
  primaryColor
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const phaseRef = useRef(0);

  const resolvedColor = primaryColor || (
    speaker === 'doctor' ? '#0284C7' : (speaker === 'patient' ? '#10B981' : '#8B5CF6')
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const ch = canvas.height;
      const barWidth = Math.max(2, (width / barCount) - 2);

      phaseRef.current += isActive ? 0.12 : 0.03;

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 2);
        
        let amplitude;
        if (isActive) {
          // Dynamic active speech spectrum
          const sine1 = Math.sin(phaseRef.current + i * 0.35);
          const sine2 = Math.cos(phaseRef.current * 0.7 + i * 0.2);
          const noise = Math.sin(phaseRef.current * 2 + i);
          const raw = Math.abs(sine1 * 0.5 + sine2 * 0.3 + noise * 0.2);
          amplitude = Math.max(0.15, raw);
        } else {
          // Idle low-frequency baseline breathing wave
          amplitude = 0.08 + 0.05 * Math.sin(phaseRef.current + i * 0.2);
        }

        const barH = Math.min(ch - 4, Math.max(4, amplitude * (ch - 6)));
        const y = (ch - barH) / 2;

        // Gradient styling
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        if (isActive) {
          grad.addColorStop(0, resolvedColor);
          grad.addColorStop(1, '#020617');
        } else {
          grad.addColorStop(0, '#475569');
          grad.addColorStop(1, '#1E293B');
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 2);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isActive, resolvedColor, barCount]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <canvas 
        ref={canvasRef} 
        width={barCount * 5} 
        height={height} 
        style={{ display: 'block', borderRadius: '4px' }}
      />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{ 
          fontSize: '0.68rem', 
          fontWeight: 700, 
          color: isActive ? resolvedColor : '#64748B',
          letterSpacing: '0.04em',
          textTransform: 'uppercase'
        }}>
          {isActive ? '● Live VAD Diarization' : '○ Standby Ambient'}
        </span>
        <span style={{ fontSize: '0.62rem', color: '#94A3B8' }}>
          {isActive ? '48kHz 16-bit PCM • RAM Buffer' : 'Ready to capture audio'}
        </span>
      </div>
    </div>
  );
}
