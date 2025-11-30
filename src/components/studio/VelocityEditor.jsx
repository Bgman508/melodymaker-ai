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
    ctx.fillStyle = '#0A0C10';
    ctx.fillRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let beat = 0; beat <= totalBeats; beat++) {
      const x = keyWidth + (beat * pixelsPerBeat);
      const isBar = beat % 4 === 0;
      ctx.strokeStyle = isBar ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)';
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Velocity bars
    notes.forEach((note, idx) => {
      const x = keyWidth + (note.start * pixelsPerBeat);
      const w = Math.max(note.duration * pixelsPerBeat - 2, 4);
      const barHeight = (note.velocity / 127) * (height - 8);
      const isSelected = selectedNotes.includes(idx);

      // Bar gradient
      const gradient = ctx.createLinearGradient(x, height, x, height - barHeight);
      if (isSelected) {
        gradient.addColorStop(0, '#F59E0B');
        gradient.addColorStop(1, '#FBBF24');
      } else {
        gradient.addColorStop(0, '#10B981');
        gradient.addColorStop(1, '#34D399');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(x, height - barHeight - 4, w, barHeight);

      // Top cap
      ctx.fillStyle = isSelected ? '#FBBF24' : '#34D399';
      ctx.fillRect(x, height - barHeight - 4, w, 3);
    });

    // Label
    ctx.fillStyle = '#6E7681';
    ctx.font = '9px "JetBrains Mono", monospace';
    ctx.fillText('VEL', 8, 16);
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
    <div className="h-16 bg-[#0A0C10]">
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