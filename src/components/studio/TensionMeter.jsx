import React, { useEffect, useRef } from 'react';
import { TensionAnalyzer } from "../engine/tensionAnalyzer";

export default function TensionMeter({ progression, structure, currentBeat }) {
  const canvasRef = useRef(null);
  const analyzer = useRef(new TensionAnalyzer()).current;

  useEffect(() => {
    if (!canvasRef.current || !progression) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width;
    canvas.height = rect.height;

    const tensionCurve = analyzer.analyzeProgression(progression, structure);
    const totalBeats = tensionCurve[tensionCurve.length - 1]?.beat || 32;
    
    // Clear
    ctx.fillStyle = '#0A0B0E';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = (i / 4) * canvas.height;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw tension curve
    ctx.beginPath();
    ctx.strokeStyle = '#3EF3AF';
    ctx.lineWidth = 2;

    tensionCurve.forEach((point, idx) => {
      const x = (point.beat / totalBeats) * canvas.width;
      const y = canvas.height - (point.tension * canvas.height);
      
      if (idx === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Fill area under curve
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fillStyle = 'rgba(62, 243, 175, 0.1)';
    ctx.fill();

    // Draw current position
    if (currentBeat > 0) {
      const x = (currentBeat / totalBeats) * canvas.width;
      ctx.strokeStyle = '#FF6B6B';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

  }, [progression, structure, currentBeat]);

  return (
    <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)]">
      <h3 className="text-sm font-semibold text-[var(--muted)] mb-3">Tension Analysis</h3>
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg"
        style={{ height: '120px', background: '#0A0B0E' }}
      />
      <div className="mt-2 flex justify-between text-xs text-[var(--muted)]">
        <span>Low Tension</span>
        <span>High Tension</span>
      </div>
    </div>
  );
}