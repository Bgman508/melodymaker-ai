import React, { useRef, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Scissors, Volume2, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";
import { toast } from "sonner";

export default function AudioWaveformEditor({ 
  track, 
  currentBeat, 
  totalBeats, 
  onUpdateTrack,
  bpm 
}) {
  const canvasRef = useRef(null);
  const [waveformData, setWaveformData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [audioBuffer, setAudioBuffer] = useState(null);

  useEffect(() => {
    if (track?.audioUrl) {
      loadWaveform();
    }
  }, [track?.audioUrl]);

  useEffect(() => {
    if (waveformData && canvasRef.current) {
      drawWaveform();
    }
  }, [waveformData, currentBeat, selectedRegion, zoom]);

  const loadWaveform = async () => {
    setLoading(true);
    try {
      const response = await fetch(track.audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const buffer = await audioContext.decodeAudioData(arrayBuffer);
      
      setAudioBuffer(buffer);
      
      // Extract waveform data
      const rawData = buffer.getChannelData(0);
      const samples = 2000 * zoom;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];
      
      for (let i = 0; i < samples; i++) {
        let blockStart = blockSize * i;
        let sum = 0;
        let max = 0;
        for (let j = 0; j < blockSize; j++) {
          const val = Math.abs(rawData[blockStart + j]);
          sum += val;
          max = Math.max(max, val);
        }
        filteredData.push({ avg: sum / blockSize, peak: max });
      }
      
      setWaveformData(filteredData);
    } catch (error) {
      console.error('Failed to load waveform:', error);
      toast.error('Failed to load audio waveform');
    }
    setLoading(false);
  };

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
    
    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    const beatsPerPixel = totalBeats / width;
    for (let x = 0; x < width; x += width / totalBeats) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Draw waveform
    const barWidth = width / waveformData.length;
    const color = track?.color || '#3EF3AF';
    
    waveformData.forEach((value, index) => {
      const x = index * barWidth;
      const avgHeight = value.avg * middle * 0.8;
      const peakHeight = value.peak * middle * 0.95;
      
      // Average (filled)
      ctx.fillStyle = color + '60';
      ctx.fillRect(x, middle - avgHeight, barWidth - 1, avgHeight * 2);
      
      // Peak (outline)
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, middle - peakHeight);
      ctx.lineTo(x, middle + peakHeight);
      ctx.stroke();
    });
    
    // Selected region
    if (selectedRegion) {
      const startX = (selectedRegion.start / totalBeats) * width;
      const endX = (selectedRegion.end / totalBeats) * width;
      
      ctx.fillStyle = 'rgba(62, 243, 175, 0.2)';
      ctx.fillRect(startX, 0, endX - startX, height);
      
      ctx.strokeStyle = '#3EF3AF';
      ctx.lineWidth = 2;
      ctx.strokeRect(startX, 0, endX - startX, height);
    }
    
    // Center line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, middle);
    ctx.lineTo(width, middle);
    ctx.stroke();
    
    // Playhead
    if (currentBeat > 0 && currentBeat <= totalBeats) {
      const x = (currentBeat / totalBeats) * width;
      ctx.shadowColor = '#3EF3AF';
      ctx.shadowBlur = 20;
      ctx.strokeStyle = '#3EF3AF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const beat = (x / rect.width) * totalBeats;
    
    setDragging({ start: beat });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const beat = (x / rect.width) * totalBeats;
    
    setSelectedRegion({
      start: Math.min(dragging.start, beat),
      end: Math.max(dragging.start, beat)
    });
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const handleTrim = () => {
    if (!selectedRegion || !audioBuffer) return;
    
    const sampleRate = audioBuffer.sampleRate;
    const beatDuration = 60 / bpm;
    
    const startSample = Math.floor(selectedRegion.start * beatDuration * sampleRate);
    const endSample = Math.floor(selectedRegion.end * beatDuration * sampleRate);
    
    toast.success('Audio trimmed (feature in progress - will export trimmed version)');
  };

  const handleNormalize = () => {
    toast.success('Normalizing audio (feature in progress)');
  };

  const handleFadeIn = () => {
    if (!selectedRegion) {
      toast.error('Select a region first');
      return;
    }
    toast.success('Fade in applied (feature in progress)');
  };

  const handleFadeOut = () => {
    if (!selectedRegion) {
      toast.error('Select a region first');
      return;
    }
    toast.success('Fade out applied (feature in progress)');
  };

  return (
    <div className="space-y-3">
      {/* Tools */}
      <div className="flex items-center justify-between p-2 bg-[var(--surface-2)] rounded-lg border border-[var(--hair)]">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
            disabled={zoom <= 0.5}
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <span className="text-xs text-[var(--muted)]">{Math.round(zoom * 100)}%</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(Math.min(4, zoom + 0.5))}
            disabled={zoom >= 4}
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setZoom(1)}
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {selectedRegion && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTrim}
                className="gap-2"
              >
                <Scissors className="w-4 h-4" />
                Trim
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFadeIn}
              >
                Fade In
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleFadeOut}
              >
                Fade Out
              </Button>
            </>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleNormalize}
            className="gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Normalize
          </Button>
        </div>
      </div>

      {/* Waveform Canvas */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--bg)]/80 z-10 rounded-lg">
            <div className="text-sm text-[var(--muted)]">Loading waveform...</div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="w-full rounded-lg cursor-crosshair"
          style={{ height: '320px', background: 'var(--bg)' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {selectedRegion && (
        <div className="text-xs text-[var(--muted)] flex items-center justify-between p-2 bg-[var(--surface-2)] rounded-lg">
          <span>Selected: {selectedRegion.start.toFixed(2)} - {selectedRegion.end.toFixed(2)} beats</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedRegion(null)}
          >
            Clear Selection
          </Button>
        </div>
      )}
    </div>
  );
}