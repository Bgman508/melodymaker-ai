import React, { useRef, useEffect, useState } from 'react';

export default function VelocityEditor({ notes, selectedNotes = [], onUpdateVelocity, totalBeats }) {
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(null);

  useEffect(() => {
    draw();
  }, [notes, selectedNotes]);

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
    const keyWidth = 48;
    const contentWidth = width - keyWidth;
    const pixelsPerBeat = contentWidth / totalBeats;

    // Background
    ctx.fillStyle = '#0F0F0F';
    ctx.fillRect(0, 0, width, height);

    // Grid
    for (let beat = 0; beat <= totalBeats; beat++) {
      const x = keyWidth + (beat * pixelsPerBeat);
      const isBar = beat % 4 === 0;
      if (isBar) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
    }

    // Velocity bars
    notes.forEach((note, idx) => {
      const x = keyWidth + (note.start * pixelsPerBeat);
      const w = Math.max(note.duration * pixelsPerBeat - 2, 4);
      const barHeight = (note.velocity / 127) * (height - 8);
      const isSelected = selectedNotes.includes(idx);

      // Simple bar
      ctx.fillStyle = isSelected ? '#A78BFA' : 'rgba(139,92,246,0.7)';
      ctx.fillRect(x, height - barHeight - 2, w, barHeight);
    });

    // Label
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '500 10px "Inter", sans-serif';
    ctx.fillText('Velocity', 8, 14);
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const keyWidth = 48;
    const contentWidth = rect.width - keyWidth;
    const pixelsPerBeat = contentWidth / totalBeats;

    // Find clicked note
    for (let i = 0; i < notes.length; i++) {
      const note = notes[i];
      const noteX = keyWidth + (note.start * pixelsPerBeat);
      const noteW = Math.max(note.duration * pixelsPerBeat - 2, 4);

      if (x >= noteX && x <= noteX + noteW) {
        setDragging({ noteIdx: i, startY: y });
        break;
      }
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;

    const velocity = Math.round(Math.max(1, Math.min(127, ((height - y) / height) * 127)));
    onUpdateVelocity?.(dragging.noteIdx, velocity);
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  return (
    <div className="h-16 border-t" style={{ background: '#0F0F0F', borderColor: 'rgba(255,255,255,0.06)' }}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-ns-resize"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}