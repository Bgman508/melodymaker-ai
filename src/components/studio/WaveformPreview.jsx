import React, { useRef, useEffect, useState } from 'react';
import { Waves } from 'lucide-react';

export default function WaveformPreview({ tracks, currentBeat, totalBeats, isPlaying }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const [waveData, setWaveData] = useState([]);

  useEffect(() => {
    // Generate pseudo-waveform from MIDI tracks
    const data = Array.from({ length: 200 }, (_, i) => {
      let amplitude = 0;
      const beat = (i / 200) * totalBeats;
      
      tracks.forEach(track => {
        if (track.muted || !track.notes) return;
        track.notes.forEach(note => {
          if (beat >= note.start && beat <= note.start + note.duration) {
            amplitude += (note.velocity / 127) * (track.volume || 0.8);
          }
        });
      });
      
      return Math.min(amplitude, 1);
    });
    
    setWaveData(data);
  }, [tracks, totalBeats]);

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
      const middle = height / 2;

      // Background
      ctx.fillStyle = '#0A0A0F';
      ctx.fillRect(0, 0, width, height);

      // Waveform
      const barWidth = width / waveData.length;
      const playPosition = currentBeat / totalBeats;

      waveData.forEach((value, i) => {
        const x = i * barWidth;
        const barHeight = value * middle * 0.7;
        const progress = i / waveData.length;
        
        // Color based on position
        let color;
        if (progress < playPosition) {
          // Played - gradient
          const grad = ctx.createLinearGradient(x, middle - barHeight, x, middle + barHeight);
          grad.addColorStop(0, '#00FFFF');
          grad.addColorStop(0.5, '#5E7CFF');
          grad.addColorStop(1, '#00FFFF');
          color = grad;
        } else {
          // Unplayed - dimmed
          color = 'rgba(255,255,255,0.15)';
        }

        ctx.fillStyle = color;
        ctx.fillRect(x, middle - barHeight, barWidth - 1, barHeight * 2);
      });

      // Playhead
      const playheadX = playPosition * width;
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00FFFF';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Center line
      ctx.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, middle);
      ctx.lineTo(width, middle);
      ctx.stroke();

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(draw);
      }
    };

    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [waveData, currentBeat, totalBeats, isPlaying]);

  return (
    <div className="relative h-16 rounded-lg overflow-hidden border border-white/5" style={{ background: '#0A0A0F' }}>
      {tracks.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs text-white/20">
            <Waves className="w-3.5 h-3.5" />
            <span>No audio preview</span>
          </div>
        </div>
      ) : (
        <canvas ref={canvasRef} className="w-full h-full" />
      )}
    </div>
  );
}