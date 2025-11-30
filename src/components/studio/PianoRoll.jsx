import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

const trackColors = {
  melody: { fill: '#3EF3AF', stroke: '#16DB93' },
  chords: { fill: '#7C61FF', stroke: '#6B4FED' },
  bass: { fill: '#7DF1FF', stroke: '#5BC8FF' },
  drums: { fill: '#FF6B6B', stroke: '#E85D5D' }
};

export default function PianoRoll({ tracks, currentBeat, totalBeats = 32 }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
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
    
    // Clear
    ctx.fillStyle = '#0A0B0E';
    ctx.fillRect(0, 0, width, height);
    
    // Grid
    const beatsPerBar = 4;
    const pixelsPerBeat = width / totalBeats;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    
    for (let beat = 0; beat <= totalBeats; beat++) {
      const x = beat * pixelsPerBeat;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      if (beat % beatsPerBar === 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.stroke();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      }
    }
    
    const noteRows = 12;
    const rowHeight = height / noteRows;
    for (let row = 0; row <= noteRows; row++) {
      ctx.beginPath();
      ctx.moveTo(0, row * rowHeight);
      ctx.lineTo(width, row * rowHeight);
      ctx.stroke();
    }
    
    // MIDI range
    const minNote = 24;
    const maxNote = 108;
    const noteRange = maxNote - minNote;
    const pixelsPerNote = height / noteRange;
    
    // Draw notes with breathing effect
    tracks.forEach(track => {
      if (track.muted) return;
      
      const colors = trackColors[track.type] || { fill: '#64748b', stroke: '#475569' };
      
      track.notes.forEach(note => {
        const x = note.start * pixelsPerBeat;
        const w = note.duration * pixelsPerBeat;
        const y = height - ((note.pitch - minNote) * pixelsPerNote);
        const h = pixelsPerNote * 0.8;
        const radius = Math.min(h / 2, 6);
        
        // Note rect with class for hover
        ctx.fillStyle = colors.fill + '99';
        ctx.strokeStyle = colors.stroke;
        ctx.lineWidth = 1.5;
        
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + w - radius, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
        ctx.lineTo(x + w, y + h - radius);
        ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        ctx.lineTo(x + radius, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        
        ctx.fill();
        ctx.stroke();
      });
    });
    
    // Playhead with audio-reactive glow
    if (currentBeat > 0 && currentBeat <= totalBeats) {
      const x = currentBeat * pixelsPerBeat;
      
      // Enhanced glow with pulsing
      const glowIntensity = 0.5 + Math.sin(Date.now() / 300) * 0.3;
      ctx.shadowColor = '#3EF3AF';
      ctx.shadowBlur = 20 * glowIntensity;
      
      ctx.strokeStyle = '#3EF3AF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      ctx.shadowBlur = 0;
    }
    
  }, [tracks, currentBeat, totalBeats]);
  
  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg"
        style={{ height: '320px', background: 'var(--bg)' }}
      />
      
      {/* Legend */}
      <div className="absolute top-4 right-4 flex gap-3 text-xs">
        {Object.entries(trackColors).map(([type, colors]) => (
          <div key={type} className="flex items-center gap-2 px-2 py-1 rounded" 
            style={{ background: 'rgba(0, 0, 0, 0.6)' }}>
            <div 
              className="w-3 h-3 rounded" 
              style={{ backgroundColor: colors.fill }}
            />
            <span className="text-slate-300 capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}