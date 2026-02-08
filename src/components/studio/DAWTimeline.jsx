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

    // Background
    ctx.fillStyle = '#0D0D0D';
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
      ctx.fillStyle = 'rgba(124, 58, 237, 0.08)';
      ctx.fillRect(x1, rulerHeight, x2 - x1, tracks.length * trackHeight);
      
      // Loop markers
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x1, rulerHeight);
      ctx.lineTo(x1, rulerHeight + tracks.length * trackHeight);
      ctx.moveTo(x2, rulerHeight);
      ctx.lineTo(x2, rulerHeight + tracks.length * trackHeight);
      ctx.stroke();
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

    // Draw playhead
    const playheadX = (currentBeat * pixelsPerBeat) - scrollX + headerWidth;
    if (playheadX >= headerWidth && playheadX <= width) {
      ctx.strokeStyle = '#7C3AED';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(playheadX, 0);
      ctx.lineTo(playheadX, height);
      ctx.stroke();
      
      // Playhead handle
      ctx.fillStyle = '#7C3AED';
      ctx.beginPath();
      ctx.arc(playheadX, rulerHeight / 2, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }, [tracks, currentBeat, internalZoom, zoom, scrollX, selection, loopRegion, waveformsLoaded, bpm, selectedTrackId, pixelsPerBeat]);

  const drawRuler = (ctx, width) => {
    // Ruler background
    ctx.fillStyle = '#0D0D0D';
    ctx.fillRect(headerWidth, 0, width - headerWidth, rulerHeight);

    // Bottom border
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(headerWidth, rulerHeight);
    ctx.lineTo(width, rulerHeight);
    ctx.stroke();

    // Time markers
    ctx.font = '500 11px "Inter", sans-serif';
    
    for (let beat = 0; beat <= totalBeats; beat++) {
      const x = (beat * pixelsPerBeat) - scrollX + headerWidth;
      if (x < headerWidth || x > width) continue;

      const isBar = beat % 4 === 0;
      const isBeat = beat % 1 === 0;
      
      if (isBar) {
        // Bar line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, rulerHeight - 10);
        ctx.lineTo(x, rulerHeight);
        ctx.stroke();
        
        // Bar number
        const bar = Math.floor(beat / 4) + 1;
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText(bar.toString(), x + 6, 14);
      } else if (isBeat && pixelsPerBeat > 20) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.beginPath();
        ctx.moveTo(x, rulerHeight - 6);
        ctx.lineTo(x, rulerHeight);
        ctx.stroke();
      }
    }

    // Header area
    ctx.fillStyle = '#0D0D0D';
    ctx.fillRect(0, 0, headerWidth, rulerHeight);
  };

  const drawTrackLane = (ctx, track, y, width, idx) => {
    const isSelected = track.id === selectedTrackId;
    const config = getTrackConfig(track);
    
    // Track background
    ctx.fillStyle = isSelected ? 'rgba(124, 58, 237, 0.05)' : 'transparent';
    ctx.fillRect(headerWidth, y, width - headerWidth, trackHeight);

    // Track separator
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
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
        if (isBar) {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + trackHeight);
          ctx.stroke();
        }
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

    // Waveform fill
    ctx.fillStyle = 'rgba(124, 58, 237, 0.6)';
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
  };

  const drawMIDIClips = (ctx, track, y, width, config) => {
    // Find note range
    const pitches = track.notes.map(n => n.pitch);
    const minPitch = Math.min(...pitches);
    const maxPitch = Math.max(...pitches);
    const pitchRange = Math.max(maxPitch - minPitch, 12);
    const noteHeight = Math.min((trackHeight - 12) / pitchRange, 5);

    track.notes.forEach(note => {
      const x = (note.start * pixelsPerBeat) - scrollX + headerWidth;
      const w = Math.max(note.duration * pixelsPerBeat - 1, 3);
      const relPitch = (note.pitch - minPitch) / pitchRange;
      const noteY = y + trackHeight - 8 - (relPitch * (trackHeight - 16));

      if (x + w < headerWidth || x > width) return;

      // Simple note
      ctx.fillStyle = '#7C3AED';
      ctx.beginPath();
      ctx.roundRect(x, noteY, w, noteHeight, 2);
      ctx.fill();
      
      // Velocity brightness overlay
      const brightness = note.velocity / 127;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.15})`;
      ctx.fillRect(x, noteY, w, noteHeight);
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
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b" 
        style={{ borderColor: 'var(--border)' }}>
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
          style={{ background: 'linear-gradient(90deg, #0D0D0D 90%, transparent 100%)' }}
        >
          <div 
            className="flex items-center px-4 border-b"
            style={{ height: `${rulerHeight}px`, borderColor: 'rgba(255,255,255,0.1)' }}
          >
            <span className="text-xs font-medium text-white/40">Tracks</span>
          </div>
          
          {tracks.map((track, idx) => {
            const isSelected = track.id === selectedTrackId;
            const config = getTrackConfig(track);
            
            return (
              <div
                key={track.id}
                className={cn(
                  "flex items-center gap-3 px-4 border-b pointer-events-auto cursor-pointer transition-colors",
                  isSelected && "bg-white/5"
                )}
                style={{ height: `${trackHeight}px`, borderColor: 'var(--border)' }}
                onClick={() => onSelectTrack?.(track)}
              >
                {/* Track info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white truncate">{track.name}</div>
                  <div className="text-xs text-white/40">
                    {track.isAudio ? 'Audio' : `${track.notes?.length || 0} notes`}
                  </div>
                </div>
                
                {/* Controls */}
                <div className="flex gap-1">
                  <button 
                    className={cn(
                      "w-6 h-6 rounded text-[10px] font-semibold flex items-center justify-center transition-all",
                      track.muted 
                        ? "bg-red-500/20 text-red-400" 
                        : "text-white/30 hover:text-white/60"
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
                      "w-6 h-6 rounded text-[10px] font-semibold flex items-center justify-center transition-all",
                      track.solo 
                        ? "bg-yellow-500/20 text-yellow-400" 
                        : "text-white/30 hover:text-white/60"
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