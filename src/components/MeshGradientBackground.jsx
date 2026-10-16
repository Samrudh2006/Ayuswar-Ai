import React, { useEffect, useRef, useState } from 'react';

/**
 * MeshGradientBackground Component
 * 
 * High-performance shared ambient mesh gradient background:
 * 1. Single shared canvas / GPU instance.
 * 2. Pauses requestAnimationFrame loop automatically via IntersectionObserver when offscreen.
 * 3. Honors window.matchMedia('(prefers-reduced-motion: reduce)') to freeze animation.
 * 4. Beautiful, organic clinical teal-cyan-indigo color harmony.
 */
export default function MeshGradientBackground({ 
  className = '', 
  style = {},
  opacity = 0.55
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(null);
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // IntersectionObserver to pause loop offscreen
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    if (containerRef.current) observer.observe(containerRef.current);

    // 4 Fluid Color Blobs (Teal, Cyan, Slate-Blue, Amber-Gold)
    const blobs = [
      { x: width * 0.2, y: height * 0.25, r: Math.min(width, height) * 0.45, vx: 0.35, vy: 0.22, color: 'rgba(0, 139, 139, 0.28)' },
      { x: width * 0.75, y: height * 0.3, r: Math.min(width, height) * 0.48, vx: -0.28, vy: 0.3, color: 'rgba(0, 180, 216, 0.22)' },
      { x: width * 0.45, y: height * 0.8, r: Math.min(width, height) * 0.52, vx: 0.25, vy: -0.25, color: 'rgba(14, 116, 144, 0.20)' },
      { x: width * 0.85, y: height * 0.75, r: Math.min(width, height) * 0.38, vx: -0.2, vy: -0.18, color: 'rgba(245, 158, 11, 0.12)' }
    ];

    let t = 0;

    const render = () => {
      if (isVisibleRef.current && !prefersReducedMotion) {
        ctx.clearRect(0, 0, width, height);

        // Fill subtle clean background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        blobs.forEach((b, i) => {
          b.x += b.vx + Math.sin(t * 0.001 + i) * 0.2;
          b.y += b.vy + Math.cos(t * 0.0012 + i) * 0.2;

          // Soft boundary bounce
          if (b.x < -b.r * 0.2 || b.x > width + b.r * 0.2) b.vx *= -1;
          if (b.y < -b.r * 0.2 || b.y > height + b.r * 0.2) b.vy *= -1;

          // Draw soft radial blur gradient
          const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
          grad.addColorStop(0, b.color);
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();
        });

        t += 16;
      }

      if (!prefersReducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    // If reduced motion, draw once statically
    if (prefersReducedMotion) {
      ctx.clearRect(0, 0, width, height);
      blobs.forEach((b) => {
        const grad = ctx.createRadialGradient(b.x, b.y, b.r * 0.1, b.x, b.y, b.r);
        grad.addColorStop(0, b.color);
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
    } else {
      render();
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`mesh-gradient-container ${className}`}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
        ...style
      }}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: '100%', 
          height: '100%', 
          display: 'block',
          filter: 'blur(36px)',
          transform: 'translate3d(0, 0, 0)'
        }} 
      />
    </div>
  );
}
