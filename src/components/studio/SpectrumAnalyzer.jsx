import React, { useRef, useEffect } from 'react';

export default function SpectrumAnalyzer({ isPlaying, trackCount }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const barsRef = useRef(Array(32).fill(0));

  useEffect(() => {
    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;
      const barCount = 32;
      const barWidth = (width - (barCount - 1)) / barCount;

      // Background
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, width, height);

      // Update bars
      if (isPlaying && trackCount > 0) {
        barsRef.current = barsRef.current.map((val, i) => {
          // Simulate frequency response
          const target = Math.random() * 0.8 + 0.2;
          const smoothing = 0.3;
          return val + (target - val) * smoothing;
        });
      } else {
        barsRef.current = barsRef.current.map(val => val * 0.9);
      }

      // Draw bars
      barsRef.current.forEach((value, i) => {
        const x = i * (barWidth + 1);
        const barHeight = value * height;
        
        // Gradient
        const grad = ctx.createLinearGradient(x, height, x, height - barHeight);
        if (i < 8) {
          grad.addColorStop(0, '#FF3F5F');
          grad.addColorStop(1, '#FF6B7A');
        } else if (i < 16) {
          grad.addColorStop(0, '#FF9D00');
          grad.addColorStop(1, '#FFB847');
        } else if (i < 24) {
          grad.addColorStop(0, '#00FFA3');
          grad.addColorStop(1, '#5CFFB8');
        } else {
          grad.addColorStop(0, '#00FFFF');
          grad.addColorStop(1, '#5E7CFF');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        // Glow
        ctx.shadowColor = i < 8 ? '#FF3F5F' : i < 16 ? '#FF9D00' : i < 24 ? '#00FFA3' : '#00FFFF';
        ctx.shadowBlur = 4;
        ctx.fillRect(x, height - barHeight, barWidth, 2);
        ctx.shadowBlur = 0;
      });

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [isPlaying, trackCount]);

  return (
    <div className="h-12 rounded-lg overflow-hidden border border-white/5">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}