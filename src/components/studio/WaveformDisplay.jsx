import React, { useRef, useEffect, useState } from 'react';
import { Volume2 } from "lucide-react";

export default function WaveformDisplay({ audioUrl, track, onUpdateTrack }) {
  const canvasRef = useRef(null);
  const [waveformData, setWaveformData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Only load real audio URLs
    if (audioUrl && typeof audioUrl === 'string' && audioUrl.length > 20 && 
        (audioUrl.startsWith('https://') || audioUrl.startsWith('http://') || audioUrl.startsWith('blob:'))) {
      loadWaveform();
    }
  }, [audioUrl]);

  const loadWaveform = async () => {
    setLoading(true);
    try {
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Extract waveform data
      const rawData = audioBuffer.getChannelData(0);
      const samples = 1000;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];
      
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockStart + j]);
        }
        filteredData.push(sum / blockSize);
      }
      
      setWaveformData(filteredData);
    } catch (error) {
      console.error('Failed to load waveform:', error);
      // Silently fail - don't show error to user
    }
    setLoading(false);
  };

  useEffect(() => {
    if (waveformData && canvasRef.current) {
      drawWaveform();
    }
  }, [waveformData]);

  const drawWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas || !waveformData) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    const middle = height / 2;
    
    // Clear
    ctx.fillStyle = '#0A0B0E';
    ctx.fillRect(0, 0, width, height);
    
    // Draw waveform
    const barWidth = width / waveformData.length;
    const color = track?.color || '#3EF3AF';
    
    ctx.fillStyle = color + '80';
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    
    waveformData.forEach((value, index) => {
      const x = index * barWidth;
      const barHeight = value * middle * 0.9;
      
      // Draw mirrored bars
      ctx.fillRect(x, middle - barHeight, barWidth - 1, barHeight * 2);
    });
    
    // Center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, middle);
    ctx.lineTo(width, middle);
    ctx.stroke();
  };

  if (!audioUrl) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-[var(--muted)] flex items-center gap-2">
          <Volume2 className="w-3 h-3" />
          Audio Waveform
        </span>
        {loading && <span className="text-xs text-[var(--mint)]">Loading...</span>}
      </div>
      
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-[var(--hair)]"
        style={{ height: '80px', background: 'var(--bg)' }}
      />
    </div>
  );
}