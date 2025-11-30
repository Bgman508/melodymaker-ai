import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Scissors, Copy, Trash2, Move, ZoomIn, ZoomOut, Repeat, 
  Magnet, Volume2, VolumeX, Headphones, Lock, MoreVertical,
  ChevronRight, Music2, Mic, Radio
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
  const [scrollY, setScrollY] = useState(0);
  const [tool, setTool] = useState('select');
  const [selection, setSelection] = useState(null);
  const [loopRegion, setLoopRegion] = useState(currentLoop);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const waveformCache = useRef({});
  const [waveformsLoaded, setWaveformsLoaded] = useState(0);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const gridSize = 0.25;

  const trackHeight = 80;
  const headerWidth = 220;
  const rulerHeight = 36;
  const pixelsPerBeat = (internalZoom * zoom) / 2;
  const timelineWidth = totalBeats * pixelsPerBeat;

  // Track colors with gradients
  const getTrackColor = (track) => {
    const colors = {
      melody: { bg: '#3B82F6', gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)' },
      chords: { bg: '#8B5CF6', gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A78BFA 100%)' },
      bass: { bg: '#06B6D4', gradient: 'linear-gradient(135deg, #06B6D4 0%, #22D3EE 100%)' },
      drums: { bg: '#EF4444', gradient: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)' },
      pad: { bg: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)' },
      lead: { bg: '#F59E0B', gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)' },
      audio: { bg: '#10B981', gradient: 'linear-gradient(135deg, #10B981 0%, #34D399 100%)' },
    };
    return colors[track.type] || { bg: track.color || '#64748B', gradient: `linear-gradient(135deg, ${track.color || '#64748B'} 0%, ${track.color || '#94A3B8'} 100%)` };
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
      const samples = 800;
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
    drawTimeline();
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

    // Dark gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0A0C10');
    bgGrad.addColorStop(1, '#06070A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Draw ruler
    drawRuler(ctx, width);

    // Draw track lanes
    tracks.forEach((track, idx) => {
      const y = rulerHeight + (idx * trackHeight);
      drawTrackLane(ctx, track, y, width, idx);
    });

    // Draw loop region
    if (loopRegion) {
      const x1 = (loopRegion.start * pixelsPerBeat) - scrollX + headerWidth;
      const x2 = (loopRegion.end * pixelsPerBeat) - scrollX + headerWidth;
      
      // Loop region background
      ctx.fillStyle = 'rgba(0, 217, 255, 0.08)';
      ctx.fillRect(x1, rulerHeight, x2 - x1, tracks.length * trackHeight);
      
      // Loop markers
      ctx.strokeStyle = '#00D9FF';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(x1, rulerHeight);
      ctx.lineTo(x1, rulerHeight + tracks.length * trackHeight);
      ctx.moveTo(x2, rulerHeight);
      ctx.lineTo(x2, rulerHeight + tracks.length * trackHeight);
      ctx.stroke();
      ctx.setLineDash([]);
      
      // Loop region header
      ctx.fillStyle = '#00D9FF';
      ctx.fillRect(x1, 0, x2 - x1, 4);
    }

    // Draw selection
    if (selection) {
      const x1 = (selection.start * pixelsPerBeat) - scrollX + headerWidth;
      const x2 = (selection.end * pixelsPerBeat) - scrollX + headerWidth;
      const y1 = rulerHeight + (selection.trackIdx * trackHeight);

      ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
      ctx.fillRect(x1, y1, x2 - x1, trackHeight);
      
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 2;
      ctx.strokeRect(x1, y1, x2 - x1, trackHeight);
    }

    // Draw playhead
    const playheadX = (currentBeat * pixelsPerBeat) - scrollX + headerWidth;
    if (playheadX >= headerWidth && playheadX <= width) {
      // Playhead glow
      const glowGrad = ctx.createLinearGradient(playheadX - 20, 0, playheadX + 20, 0);
      glowGrad.addColorStop(0, 'rgba(0, 217, 255, 0)');
      glowGrad.addColorStop(0.5, 'rgba(0, 217, 255, 0.15)');
      glowGrad.addColorStop(1, 'rgba(0, 217, 255, 0)');
      ctx.fillStyle = glowGrad;
      ctx.fillRect(playheadX - 20, 0, 40, height);
      
      // Playhead line
      ctx.strokeStyle = '#00D9FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00D9FF';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
      ctx.shadowBlur = 0;
      
      // Playhead head
      ctx.fillStyle = '#00D9FF';
      ctx.beginPath();
      ctx.moveTo(playheadX - 6, 0);
      ctx.lineTo(playheadX + 6, 0);
      ctx.lineTo(playheadX, 10);
      ctx.closePath();
      ctx.fill();
    }
  }, [tracks, currentBeat, internalZoom, zoom, scrollX, selection, loopRegion, waveformsLoaded, bpm, selectedTrackId, pixelsPerBeat]);

  const drawRuler = (ctx, width) => {
    // Ruler background
    const rulerGrad = ctx.createLinearGradient(0, 0, 0, rulerHeight);
    rulerGrad.addColorStop(0, '#151B23');
    rulerGrad.addColorStop(1, '#0D1117');
    ctx.fillStyle = rulerGrad;
    ctx.fillRect(headerWidth, 0, width - headerWidth, rulerHeight);

    // Border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(headerWidth, rulerHeight);
    ctx.lineTo(width, rulerHeight);
    ctx.stroke();

    // Time markers
    ctx.font = '10px "JetBrains Mono", monospace';
    
    for (let beat = 0; beat <= totalBeats; beat++) {
      const x = (beat * pixelsPerBeat) - scrollX + headerWidth;
      if (x < headerWidth || x > width) continue;

      const isBar = beat % 4 === 0;
      const isHalfBar = beat % 2 === 0;
      
      if (isBar) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, rulerHeight - 16);
        ctx.lineTo(x, rulerHeight);
        ctx.stroke();
        
        const bar = Math.floor(beat / 4) + 1;
        ctx.fillText(bar.toString(), x + 4, rulerHeight - 20);
      } else if (isHalfBar && pixelsPerBeat > 15) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.beginPath();
        ctx.moveTo(x, rulerHeight - 8);
        ctx.lineTo(x, rulerHeight);
        ctx.stroke();
      }
    }

    // Header background
    const headerGrad = ctx.createLinearGradient(0, 0, headerWidth, 0);
    headerGrad.addColorStop(0, '#0D1117');
    headerGrad.addColorStop(1, '#151B23');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(0, 0, headerWidth, rulerHeight);
    
    // Time display
    const minutes = Math.floor(currentBeat / bpm);
    const seconds = Math.floor((currentBeat / bpm * 60) % 60);
    const ms = Math.floor(((currentBeat / bpm * 60) % 1) * 100);
    ctx.fillStyle = '#00D9FF';
    ctx.font = 'bold 14px "JetBrains Mono", monospace';
    ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`, 16, 24);
  };

  const drawTrackLane = (ctx, track, y, width, idx) => {
    const isSelected = track.id === selectedTrackId;
    const colors = getTrackColor(track);
    
    // Track background
    if (isSelected) {
      ctx.fillStyle = 'rgba(0, 217, 255, 0.05)';
    } else if (idx % 2 === 0) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
    } else {
      ctx.fillStyle = 'transparent';
    }
    ctx.fillRect(headerWidth, y, width - headerWidth, trackHeight);

    // Track separator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y + trackHeight);
    ctx.lineTo(width, y + trackHeight);
    ctx.stroke();

    // Grid lines
    if (pixelsPerBeat > 20) {
      for (let beat = 0; beat <= totalBeats; beat++) {
        const x = (beat * pixelsPerBeat) - scrollX + headerWidth;
        if (x < headerWidth || x > width) continue;
        
        const isBar = beat % 4 === 0;
        ctx.strokeStyle = isBar ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.03)';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + trackHeight);
        ctx.stroke();
      }
    }

    // Draw content
    if (track.audioUrl && track.isAudio && waveformCache.current[track.id]) {
      drawWaveform(ctx, track, y, width, colors);
    } else if (track.notes && track.notes.length > 0) {
      drawMIDIClips(ctx, track, y, width, colors);
    }

    // Selection indicator
    if (isSelected) {
      ctx.fillStyle = '#00D9FF';
      ctx.fillRect(headerWidth - 3, y, 3, trackHeight);
    }
  };

  const drawWaveform = (ctx, track, y, width, colors) => {
    const waveform = waveformCache.current[track.id];
    if (!waveform?.data) return;

    const color = colors.bg;
    const middle = y + trackHeight / 2;
    const waveHeight = trackHeight * 0.35;
    const durationBeats = (waveform.duration / 60) * bpm;
    const waveWidth = durationBeats * pixelsPerBeat;
    const samplesPerPixel = waveform.data.length / waveWidth;

    // Waveform fill
    ctx.fillStyle = color + '40';
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

    // Waveform stroke
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  };

  const drawMIDIClips = (ctx, track, y, width, colors) => {
    const color = colors.bg;
    
    // Find note range
    const minPitch = Math.min(...track.notes.map(n => n.pitch));
    const maxPitch = Math.max(...track.notes.map(n => n.pitch));
    const pitchRange = Math.max(maxPitch - minPitch, 12);
    const noteHeight = Math.min((trackHeight - 16) / pitchRange, 8);

    track.notes.forEach(note => {
      const x = (note.start * pixelsPerBeat) - scrollX + headerWidth;
      const w = Math.max(note.duration * pixelsPerBeat, 2);
      const relPitch = (note.pitch - minPitch) / pitchRange;
      const noteY = y + trackHeight - 8 - (relPitch * (trackHeight - 16));

      if (x + w < headerWidth || x > width) return;

      // Note rectangle with gradient
      const noteGrad = ctx.createLinearGradient(x, noteY, x, noteY + noteHeight);
      noteGrad.addColorStop(0, color);
      noteGrad.addColorStop(1, color + 'CC');
      ctx.fillStyle = noteGrad;
      ctx.fillRect(x, noteY, w, noteHeight);
      
      // Velocity brightness
      const velocityAlpha = Math.round((note.velocity / 127) * 60 + 40).toString(16).padStart(2, '0');
      ctx.fillStyle = '#FFFFFF' + velocityAlpha;
      ctx.fillRect(x, noteY, w, 2);
    });
  };

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (y < rulerHeight) {
      // Click on ruler = seek
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
        toast.success(`Loop: Bar ${Math.floor(sorted.start/4)+1} - Bar ${Math.floor(sorted.end/4)+1}`);
      }
    }
    setIsDragging(false);
    setDragStart(null);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setInternalZoom(prev => Math.max(20, Math.min(300, prev - e.deltaY * 0.5)));
    } else {
      setScrollX(prev => Math.max(0, Math.min(timelineWidth - 800, prev + e.deltaX)));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#06070A]">
      {/* Professional Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gradient-to-b from-[#151B23] to-[#0D1117] border-b border-white/10">
        <div className="flex items-center gap-1">
          {[
            { id: 'select', icon: Move, label: 'Select (V)' },
            { id: 'loop', icon: Repeat, label: 'Loop (L)' },
          ].map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                tool === id 
                  ? "bg-[#00D9FF] text-[#06070A] shadow-[0_0_12px_rgba(0,217,255,0.3)]" 
                  : "text-[#8B949E] hover:text-white hover:bg-white/5"
              )}
              title={label}
            >
              <Icon className="w-3.5 h-3.5" />
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </button>
          ))}

          <div className="w-px h-5 bg-white/10 mx-2" />

          {[
            { icon: Scissors, action: 'cut', label: 'Cut' },
            { icon: Copy, action: 'copy', label: 'Copy' },
            { icon: Trash2, action: 'delete', label: 'Delete', danger: true },
          ].map(({ icon: Icon, action, label, danger }) => (
            <button
              key={action}
              disabled={!selection}
              className={cn(
                "p-1.5 rounded-md transition-all disabled:opacity-30",
                danger ? "text-[#EF4444] hover:bg-[#EF4444]/10" : "text-[#8B949E] hover:text-white hover:bg-white/5"
              )}
              title={label}
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}

          <div className="w-px h-5 bg-white/10 mx-2" />

          <button
            onClick={() => setSnapToGrid(!snapToGrid)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
              snapToGrid 
                ? "bg-[#7C3AED]/20 text-[#A78BFA] border border-[#7C3AED]/30" 
                : "text-[#8B949E] hover:text-white hover:bg-white/5"
            )}
          >
            <Magnet className="w-3.5 h-3.5" />
            Snap
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-black/30 border border-white/5">
            <button
              onClick={() => setInternalZoom(Math.max(20, internalZoom - 20))}
              className="p-1 rounded hover:bg-white/10 text-[#8B949E] hover:text-white transition-colors"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] font-mono text-[#8B949E] w-10 text-center">
              {internalZoom}%
            </span>
            <button
              onClick={() => setInternalZoom(Math.min(300, internalZoom + 20))}
              className="p-1 rounded hover:bg-white/10 text-[#8B949E] hover:text-white transition-colors"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Canvas */}
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

        {/* Track Headers Overlay */}
        <div 
          className="absolute left-0 top-0 w-[220px] h-full pointer-events-none"
          style={{ background: 'linear-gradient(90deg, #0D1117 85%, transparent 100%)' }}
        >
          {/* Header spacer */}
          <div 
            className="flex items-center px-4 border-b border-white/10"
            style={{ height: `${rulerHeight}px`, background: 'linear-gradient(180deg, #151B23 0%, #0D1117 100%)' }}
          >
            <span className="text-[10px] font-semibold text-[#6E7681] uppercase tracking-wider">Tracks</span>
          </div>
          
          {/* Track headers */}
          {tracks.map((track, idx) => {
            const isSelected = track.id === selectedTrackId;
            const colors = getTrackColor(track);
            
            return (
              <div
                key={track.id}
                className={cn(
                  "flex items-center gap-3 px-3 border-b border-white/5 pointer-events-auto cursor-pointer transition-all",
                  isSelected && "bg-[#00D9FF]/5"
                )}
                style={{ height: `${trackHeight}px` }}
                onClick={() => onSelectTrack?.(track)}
              >
                {/* Track color indicator */}
                <div 
                  className="w-1 h-10 rounded-full"
                  style={{ background: colors.gradient }}
                />
                
                {/* Track icon */}
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: colors.bg + '20' }}
                >
                  {track.isAudio ? (
                    <Mic className="w-4 h-4" style={{ color: colors.bg }} />
                  ) : track.type === 'drums' ? (
                    <Radio className="w-4 h-4" style={{ color: colors.bg }} />
                  ) : (
                    <Music2 className="w-4 h-4" style={{ color: colors.bg }} />
                  )}
                </div>
                
                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white truncate">{track.name}</span>
                    {track.muted && <VolumeX className="w-3 h-3 text-[#EF4444]" />}
                    {track.solo && <Headphones className="w-3 h-3 text-[#F59E0B]" />}
                  </div>
                  <div className="text-[10px] text-[#6E7681]">
                    {track.isAudio ? 'Audio' : `${track.notes?.length || 0} notes`}
                  </div>
                </div>
                
                {/* Track controls */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    className={cn(
                      "w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center transition-all",
                      track.muted 
                        ? "bg-[#EF4444] text-white" 
                        : "bg-white/5 text-[#6E7681] hover:bg-white/10"
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
                      "w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center transition-all",
                      track.solo 
                        ? "bg-[#F59E0B] text-black" 
                        : "bg-white/5 text-[#6E7681] hover:bg-white/10"
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

      {/* Horizontal Scroll */}
      <div className="h-3 px-[220px] bg-[#0A0C10] border-t border-white/5">
        <div className="h-full relative">
          <Slider
            value={[scrollX]}
            onValueChange={(val) => setScrollX(val[0])}
            max={Math.max(0, timelineWidth - 800)}
            step={10}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}