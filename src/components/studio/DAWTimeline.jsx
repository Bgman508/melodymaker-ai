import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Scissors, Copy, Trash2, Move, ZoomIn, ZoomOut, Repeat, 
  Magnet, Volume2, VolumeX, Headphones, Lock, MoreVertical,
  ChevronRight, Music2, Mic, Radio, Disc, Waves
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function DAWTimeline({
  tracks,
  currentBeat,
  totalBeats,
  bpm,
  onUpdateTrack,
  onSeekTo,
  onSetLoop,
  currentLoop,
  selectedTrackId,
  onSelectTrack,
  zoom = 1
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [internalZoom, setInternalZoom] = useState(100);
  const [scrollX, setScrollX] = useState(0);
  const [tool, setTool] = useState('select');
  const [selection, setSelection] = useState(null);
  const [loopRegion, setLoopRegion] = useState(currentLoop);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const waveformCache = useRef({});
  const [waveformsLoaded, setWaveformsLoaded] = useState(0);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const animationFrame = useRef(null);
  const gridSize = 0.25;

  const trackHeight = 72;
  const headerWidth = 200;
  const rulerHeight = 32;
  const pixelsPerBeat = (internalZoom * zoom) / 2;
  const timelineWidth = totalBeats * pixelsPerBeat;

  // Track type configurations
  const trackConfig = {
    melody: { color: '#4D7CFF', gradient: ['#4D7CFF', '#7BA3FF'], icon: '♪' },
    chords: { color: '#9D5CFF', gradient: ['#9D5CFF', '#C49DFF'], icon: '♫' },
    bass: { color: '#00F0FF', gradient: ['#00F0FF', '#5CF9FF'], icon: '◉' },
    drums: { color: '#FF4757', gradient: ['#FF4757', '#FF7A85'], icon: '●' },
    pad: { color: '#FF5CAA', gradient: ['#FF5CAA', '#FF8FC7'], icon: '≋' },
    lead: { color: '#FF9500', gradient: ['#FF9500', '#FFB347'], icon: '★' },
    audio: { color: '#00FF94', gradient: ['#00FF94', '#5CFFB8'], icon: '◎' },
    arp: { color: '#FFDD00', gradient: ['#FFDD00', '#FFE95C'], icon: '↗' },
  };

  const getTrackConfig = (track) => {
    return trackConfig[track.type] || { 
      color: track.color || '#5C5C6E', 
      gradient: [track.color || '#5C5C6E', '#8A8A9A'],
      icon: '♪'
    };
  };

  // Load waveforms
  useEffect(() => {
    tracks.forEach(track => {
      if (track.audioUrl && track.isAudio && !waveformCache.current[track.id]) {
        loadWaveform(track).catch(() => {});
      }
    });
  }, [tracks, bpm]);

  const loadWaveform = async (track) => {
    if (!track.audioUrl || waveformCache.current[track.id]) return;
    try {
      const response = await fetch(track.audioUrl);
      if (!response.ok) return;
      const arrayBuffer = await response.arrayBuffer();
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const rawData = audioBuffer.getChannelData(0);
      const samples = 1000;
      const blockSize = Math.floor(rawData.length / samples);
      const filteredData = [];
      for (let i = 0; i < samples; i++) {
        let sum = 0;
        for (let j = 0; j < blockSize; j++) {
          sum += Math.abs(rawData[blockSize * i + j]);
        }
        filteredData.push(sum / blockSize);
      }
      waveformCache.current[track.id] = { data: filteredData, duration: audioBuffer.duration };
      setWaveformsLoaded(prev => prev + 1);
    } catch (e) {}
  };

  useEffect(() => {
    const draw = () => {
      drawTimeline();
      animationFrame.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationFrame.current);
  }, [tracks, currentBeat, internalZoom, zoom, scrollX, selection, loopRegion, waveformsLoaded, bpm, selectedTrackId]);

  const drawTimeline = useCallback(() => {
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

    // Ultra-dark gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0B0B0F');
    bgGrad.addColorStop(1, '#060608');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw ruler
    drawRuler(ctx, width);

    // Draw tracks
    tracks.forEach((track, idx) => {
      const y = rulerHeight + (idx * trackHeight);
      drawTrackLane(ctx, track, y, width, idx);
    });

    // Draw loop region
    if (loopRegion) {
      const x1 = (loopRegion.start * pixelsPerBeat) - scrollX + headerWidth;
      const x2 = (loopRegion.end * pixelsPerBeat) - scrollX + headerWidth;
      
      // Loop background
      const loopGrad = ctx.createLinearGradient(x1, 0, x2, 0);
      loopGrad.addColorStop(0, 'rgba(0, 240, 255, 0.06)');
      loopGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.08)');
      loopGrad.addColorStop(1, 'rgba(0, 240, 255, 0.06)');
      ctx.fillStyle = loopGrad;
      ctx.fillRect(x1, rulerHeight, x2 - x1, tracks.length * trackHeight);
      
      // Loop markers with glow
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 8;
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.setLineDash([6, 3]);
      ctx.beginPath();
      ctx.moveTo(x1, rulerHeight);
      ctx.lineTo(x1, rulerHeight + tracks.length * trackHeight);
      ctx.moveTo(x2, rulerHeight);
      ctx.lineTo(x2, rulerHeight + tracks.length * trackHeight);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.shadowBlur = 0;
      
      // Loop header bar
      ctx.fillStyle = '#00F0FF';
      ctx.fillRect(x1, 0, x2 - x1, 3);
    }

    // Draw selection
    if (selection) {
      const x1 = (selection.start * pixelsPerBeat) - scrollX + headerWidth;
      const x2 = (selection.end * pixelsPerBeat) - scrollX + headerWidth;
      const y1 = rulerHeight + (selection.trackIdx * trackHeight);

      ctx.fillStyle = 'rgba(255, 221, 0, 0.1)';
      ctx.fillRect(x1, y1, x2 - x1, trackHeight);
      
      ctx.strokeStyle = '#FFDD00';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#FFDD00';
      ctx.shadowBlur = 6;
      ctx.strokeRect(x1, y1, x2 - x1, trackHeight);
      ctx.shadowBlur = 0;
    }

    // Draw playhead with premium glow
    const playheadX = (currentBeat * pixelsPerBeat) - scrollX + headerWidth;
    if (playheadX >= headerWidth && playheadX <= width) {
      // Ambient glow
      const glowGrad = ctx.createLinearGradient(playheadX - 30, 0, playheadX + 30, 0);
      glowGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      glowGrad.addColorStop(0.5, 'rgba(0, 240, 255, 0.12)');
      glowGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(playheadX - 30, 0, 60, height);
      
      // Main line
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Playhead triangle
      ctx.fillStyle = '#00F0FF';
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(playheadX - 7, 0);
      ctx.lineTo(playheadX + 7, 0);
      ctx.lineTo(playheadX, 12);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }, [tracks, currentBeat, internalZoom, zoom, scrollX, selection, loopRegion, waveformsLoaded, bpm, selectedTrackId, pixelsPerBeat]);

  const drawRuler = (ctx, width) => {
    // Ruler background
    const rulerGrad = ctx.createLinearGradient(0, 0, 0, rulerHeight);
    rulerGrad.addColorStop(0, '#18181F');
    rulerGrad.addColorStop(1, '#111116');
    ctx.fillStyle = rulerGrad;
    ctx.fillRect(headerWidth, 0, width - headerWidth, rulerHeight);

    // Bottom border with gradient
    const borderGrad = ctx.createLinearGradient(headerWidth, 0, width, 0);
    borderGrad.addColorStop(0, 'rgba(255,255,255,0.05)');
    borderGrad.addColorStop(0.5, 'rgba(255,255,255,0.1)');
    borderGrad.addColorStop(1, 'rgba(255,255,255,0.05)');
    ctx.strokeStyle = borderGrad;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(headerWidth, rulerHeight);
    ctx.lineTo(width, rulerHeight);
    ctx.stroke();

    // Time markers
    ctx.font = '500 10px "JetBrains Mono", monospace';
    
    for (let beat = 0; beat <= totalBeats; beat++) {
      const x = (beat * pixelsPerBeat) - scrollX + headerWidth;
      if (x < headerWidth || x > width) continue;

      const isBar = beat % 4 === 0;
      const isBeat = beat % 1 === 0;
      
      if (isBar) {
        // Bar line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, rulerHeight - 14);
        ctx.lineTo(x, rulerHeight);
        ctx.stroke();
        
        // Bar number
        const bar = Math.floor(beat / 4) + 1;
        ctx.fillStyle = '#9898A6';
        ctx.fillText(bar.toString(), x + 4, 12);
      } else if (isBeat && pixelsPerBeat > 20) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(x, rulerHeight - 6);
        ctx.lineTo(x, rulerHeight);
        ctx.stroke();
      }
    }

    // Header area
    const headerGrad = ctx.createLinearGradient(0, 0, headerWidth, 0);
    headerGrad.addColorStop(0, '#111116');
    headerGrad.addColorStop(1, '#18181F');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, headerWidth, rulerHeight);
    
    // Time display
    const minutes = Math.floor(currentBeat / bpm);
    const seconds = Math.floor((currentBeat / bpm * 60) % 60);
    const ms = Math.floor(((currentBeat / bpm * 60) % 1) * 100);
    
    ctx.font = 'bold 13px "JetBrains Mono", monospace';
    ctx.fillStyle = '#00F0FF';
    ctx.fillText(`${minutes}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(2, '0')}`, 12, 20);
  };

  const drawTrackLane = (ctx, track, y, width, idx) => {
    const isSelected = track.id === selectedTrackId;
    const config = getTrackConfig(track);
    
    // Track background
    if (isSelected) {
      const selectGrad = ctx.createLinearGradient(headerWidth, y, width, y);
      selectGrad.addColorStop(0, `${config.color}08`);
      selectGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = selectGrad;
    } else {
      ctx.fillStyle = idx % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'transparent';
    }
    ctx.fillRect(headerWidth, y, width - headerWidth, trackHeight);

    // Track separator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + trackHeight);
    ctx.lineTo(width, y + trackHeight);
    ctx.stroke();

    // Grid lines
    if (pixelsPerBeat > 15) {
      for (let beat = 0; beat <= totalBeats; beat++) {
        const x = (beat * pixelsPerBeat) - scrollX + headerWidth;
        if (x < headerWidth || x > width) continue;
        
        const isBar = beat % 4 === 0;
        ctx.strokeStyle = isBar ? 'rgba(255, 255, 255, 0.06)' : 'rgba(255, 255, 255, 0.02)';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + trackHeight);
        ctx.stroke();
      }
    }

    // Draw content
    if (track.audioUrl && track.isAudio && waveformCache.current[track.id]) {
      drawWaveform(ctx, track, y, width, config);
    } else if (track.notes && track.notes.length > 0) {
      drawMIDIClips(ctx, track, y, width, config);
    }

    // Selection indicator
    if (isSelected) {
      const indicatorGrad = ctx.createLinearGradient(headerWidth - 3, y, headerWidth, y + trackHeight);
      indicatorGrad.addColorStop(0, config.color);
      indicatorGrad.addColorStop(1, config.gradient[1]);
      ctx.fillStyle = indicatorGrad;
      ctx.fillRect(headerWidth - 3, y, 3, trackHeight);
    }
  };

  const drawWaveform = (ctx, track, y, width, config) => {
    const waveform = waveformCache.current[track.id];
    if (!waveform?.data) return;

    const middle = y + trackHeight / 2;
    const waveHeight = trackHeight * 0.35;
    const durationBeats = (waveform.duration / 60) * bpm;
    const waveWidth = durationBeats * pixelsPerBeat;
    const samplesPerPixel = waveform.data.length / waveWidth;

    // Waveform gradient
    const waveGrad = ctx.createLinearGradient(0, y, 0, y + trackHeight);
    waveGrad.addColorStop(0, config.color + '60');
    waveGrad.addColorStop(0.5, config.color + '40');
    waveGrad.addColorStop(1, config.color + '60');

    ctx.fillStyle = waveGrad;
    ctx.beginPath();
    ctx.moveTo(headerWidth, middle);
    
    for (let i = 0; i < waveWidth; i++) {
      const x = i - scrollX + headerWidth;
      if (x < headerWidth - 10 || x > width + 10) continue;
      const sampleIdx = Math.floor(i * samplesPerPixel);
      const value = waveform.data[sampleIdx] || 0;
      ctx.lineTo(x, middle - value * waveHeight);
    }
    
    for (let i = waveWidth - 1; i >= 0; i--) {
      const x = i - scrollX + headerWidth;
      if (x < headerWidth - 10 || x > width + 10) continue;
      const sampleIdx = Math.floor(i * samplesPerPixel);
      const value = waveform.data[sampleIdx] || 0;
      ctx.lineTo(x, middle + value * waveHeight);
    }
    
    ctx.closePath();
    ctx.fill();

    // Waveform outline
    ctx.strokeStyle = config.color;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const drawMIDIClips = (ctx, track, y, width, config) => {
    // Find note range
    const pitches = track.notes.map(n => n.pitch);
    const minPitch = Math.min(...pitches);
    const maxPitch = Math.max(...pitches);
    const pitchRange = Math.max(maxPitch - minPitch, 12);
    const noteHeight = Math.min((trackHeight - 12) / pitchRange, 6);

    track.notes.forEach(note => {
      const x = (note.start * pixelsPerBeat) - scrollX + headerWidth;
      const w = Math.max(note.duration * pixelsPerBeat - 1, 3);
      const relPitch = (note.pitch - minPitch) / pitchRange;
      const noteY = y + trackHeight - 6 - (relPitch * (trackHeight - 12));

      if (x + w < headerWidth || x > width) return;

      // Note gradient
      const noteGrad = ctx.createLinearGradient(x, noteY, x + w, noteY);
      noteGrad.addColorStop(0, config.color);
      noteGrad.addColorStop(1, config.gradient[1]);
      
      ctx.fillStyle = noteGrad;
      ctx.shadowColor = config.color;
      ctx.shadowBlur = 4;
      
      // Rounded note
      const radius = 2;
      ctx.beginPath();
      ctx.roundRect(x, noteY, w, noteHeight, radius);
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // Velocity brightness
      const brightness = note.velocity / 127;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.4})`;
      ctx.fillRect(x, noteY, w, 2);
    });
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y < rulerHeight) {
      const beat = ((x - headerWidth + scrollX) / pixelsPerBeat);
      if (beat >= 0) onSeekTo?.(Math.max(0, beat));
      return;
    }

    const beat = ((x - headerWidth + scrollX) / pixelsPerBeat);
    const snappedBeat = snapToGrid ? Math.round(beat / gridSize) * gridSize : beat;
    const trackIdx = Math.floor((y - rulerHeight) / trackHeight);

    if (trackIdx < 0 || trackIdx >= tracks.length) return;

    setIsDragging(true);
    setDragStart({ beat: snappedBeat, trackIdx, x, y });

    if (tool === 'select') {
      onSelectTrack?.(tracks[trackIdx]);
      setSelection({ start: snappedBeat, end: snappedBeat, trackIdx });
    } else if (tool === 'loop') {
      setLoopRegion({ start: snappedBeat, end: snappedBeat });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragStart) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const beat = ((x - headerWidth + scrollX) / pixelsPerBeat);
    const snappedBeat = snapToGrid ? Math.round(beat / gridSize) * gridSize : beat;

    if (tool === 'select' && selection) {
      setSelection({ ...selection, end: snappedBeat });
    } else if (tool === 'loop' && loopRegion) {
      setLoopRegion({ ...loopRegion, end: snappedBeat });
    }
  };

  const handleMouseUp = () => {
    if (tool === 'loop' && loopRegion) {
      const sorted = {
        start: Math.min(loopRegion.start, loopRegion.end),
        end: Math.max(loopRegion.start, loopRegion.end)
      };
      if (sorted.end - sorted.start > 0.5) {
        setLoopRegion(sorted);
        onSetLoop?.(sorted);
        toast.success(`Loop: Bar ${Math.floor(sorted.start/4)+1} → ${Math.floor(sorted.end/4)+1}`);
      }
    }
    setIsDragging(false);
    setDragStart(null);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setInternalZoom(prev => Math.max(30, Math.min(300, prev - e.deltaY * 0.5)));
    } else {
      setScrollX(prev => Math.max(0, Math.min(timelineWidth - 800, prev + e.deltaX)));
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#0F0F0F' }}>
      {/* Minimal Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" 
        style={{ background: '#121212', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-1">
          {[
            { id: 'select', icon: Move },
            { id: 'loop', icon: Repeat },
          ].map(({ id, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
                tool === id 
                  ? "bg-[#8B5CF6] text-white" 
                  : "text-white/40 hover:text-white/80 hover:bg-white/5"
              )}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}

          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
              snapToGrid 
                ? "bg-white/10 text-white" 
                : "text-white/40 hover:text-white/80"
            )}
          >
            <Magnet className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setInternalZoom(Math.max(30, internalZoom - 20))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono text-white/60 w-12 text-center">{internalZoom}%</span>
          <button
            onClick={() => setInternalZoom(Math.min(300, internalZoom + 20))}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ cursor: tool === 'loop' ? 'col-resize' : 'default' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />

        {/* Track Headers */}
        <div 
          className="absolute left-0 top-0 w-[200px] h-full pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #111116 92%, transparent 100%)' }}
        >
          <div 
            className="flex items-center px-3 border-b border-white/5"
            style={{ height: `${rulerHeight}px`, background: 'linear-gradient(180deg, #18181F 0%, #111116 100%)' }}
          >
            <span className="text-[9px] font-bold text-[#5C5C6E] uppercase tracking-widest">Tracks</span>
          </div>
          
          {tracks.map((track, idx) => {
            const isSelected = track.id === selectedTrackId;
            const config = getTrackConfig(track);
            
            return (
              <div
                key={track.id}
                className={cn(
                  "flex items-center gap-2.5 px-3 border-b border-white/[0.03] pointer-events-auto cursor-pointer transition-all",
                  isSelected && "bg-gradient-to-r from-[#00F0FF]/5 to-transparent"
                )}
                style={{ height: `${trackHeight}px` }}
                onClick={() => onSelectTrack?.(track)}
              >
                {/* Color bar */}
                <div 
                  className="w-1 h-10 rounded-full"
                  style={{ background: `linear-gradient(180deg, ${config.gradient[0]}, ${config.gradient[1]})` }}
                />
                
                {/* Track icon */}
                <div 
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ 
                    background: `${config.color}15`,
                    color: config.color,
                    boxShadow: isSelected ? `0 0 12px ${config.color}30` : 'none'
                  }}
                >
                  {track.isAudio ? <Waves className="w-3.5 h-3.5" /> : <Music2 className="w-3.5 h-3.5" />}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-white truncate">{track.name}</span>
                    {track.muted && <VolumeX className="w-3 h-3 text-[#FF4757]" />}
                    {track.solo && <Headphones className="w-3 h-3 text-[#FF9500]" />}
                  </div>
                  <div className="text-[9px] text-[#5C5C6E]">
                    {track.isAudio ? 'Audio' : `${track.notes?.length || 0} notes`}
                  </div>
                </div>
                
                {/* M/S buttons */}
                <div className="flex gap-1">
                  <button 
                    className={cn(
                      "w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center transition-all",
                      track.muted 
                        ? "bg-[#FF4757] text-white shadow-[0_0_8px_rgba(255,71,87,0.4)]" 
                        : "bg-white/5 text-[#5C5C6E] hover:bg-white/10"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTrack?.(track.id, { muted: !track.muted });
                    }}
                  >
                    M
                  </button>
                  <button 
                    className={cn(
                      "w-5 h-5 rounded text-[9px] font-bold flex items-center justify-center transition-all",
                      track.solo 
                        ? "bg-[#FF9500] text-black shadow-[0_0_8px_rgba(255,149,0,0.4)]" 
                        : "bg-white/5 text-[#5C5C6E] hover:bg-white/10"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      onUpdateTrack?.(track.id, { solo: !track.solo });
                    }}
                  >
                    S
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Scroll */}
      <div className="h-2.5 px-[200px] bg-[#060608] border-t border-white/5">
        <Slider
          value={[scrollX]}
          onValueChange={(val) => setScrollX(val[0])}
          max={Math.max(0, timelineWidth - 800)}
          step={10}
          className="h-full"
        />
      </div>
    </div>
  );
}