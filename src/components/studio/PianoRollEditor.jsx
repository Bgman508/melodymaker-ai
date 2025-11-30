import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil, Eraser, Hand, MousePointer, Scissors, Copy, Volume2, Grid, Zap } from "lucide-react";
import { toast } from "sonner";
import VelocityEditor from "./VelocityEditor";
import PianoKeys from "./PianoKeys";

const trackColors = {
  melody: { fill: '#3B82F6', stroke: '#60A5FA', glow: 'rgba(59, 130, 246, 0.4)' },
  chords: { fill: '#8B5CF6', stroke: '#A78BFA', glow: 'rgba(139, 92, 246, 0.4)' },
  bass: { fill: '#06B6D4', stroke: '#22D3EE', glow: 'rgba(6, 182, 212, 0.4)' },
  drums: { fill: '#EF4444', stroke: '#F87171', glow: 'rgba(239, 68, 68, 0.4)' },
  pad: { fill: '#EC4899', stroke: '#F472B6', glow: 'rgba(236, 72, 153, 0.4)' },
  lead: { fill: '#F59E0B', stroke: '#FBBF24', glow: 'rgba(245, 158, 11, 0.4)' },
};

export default function PianoRollEditor({ 
  tracks, 
  currentBeat, 
  totalBeats, 
  selectedTrackId,
  onUpdateTrack,
  onAddNote,
  onDeleteNote,
  gridSnap = 0.25,
  scaleHighlight,
  selectedNotes = [],
  onSelectNotes
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [tool, setTool] = useState('select');
  const [hoveredNote, setHoveredNote] = useState(null);
  const [draggingNote, setDraggingNote] = useState(null);
  const [drawingNote, setDrawingNote] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const [ghostTracks, setGhostTracks] = useState(true);
  const [scrollX, setScrollX] = useState(0);
  const [zoom, setZoom] = useState(1);

  const minNote = 24;
  const maxNote = 108;
  const noteRange = maxNote - minNote;
  const keyWidth = 48;

  const selectedTrack = tracks.find(t => t.id === selectedTrackId);

  useEffect(() => {
    drawPianoRoll();
  }, [tracks, currentBeat, totalBeats, hoveredNote, draggingNote, drawingNote, selectedNotes, selectionBox, ghostTracks, scrollX, zoom]);

  const drawPianoRoll = useCallback(() => {
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
    const contentWidth = width - keyWidth;
    const pixelsPerBeat = (contentWidth / totalBeats) * zoom;
    const pixelsPerNote = height / noteRange;
    
    // Background gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#0A0C10');
    bgGrad.addColorStop(1, '#06070A');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
    
    // Draw piano keys area background
    ctx.fillStyle = '#0D1117';
    ctx.fillRect(0, 0, keyWidth, height);
    
    // Note rows
    const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
    const cNotes = [0]; // C notes
    
    for (let i = minNote; i <= maxNote; i++) {
      const y = height - ((i - minNote + 1) * pixelsPerNote);
      const noteInOctave = i % 12;
      const isWhiteKey = whiteKeys.includes(noteInOctave);
      const isC = noteInOctave === 0;
      
      // Row background
      if (isWhiteKey) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        ctx.fillRect(keyWidth, y, contentWidth, pixelsPerNote);
      }
      
      // Scale highlighting
      if (scaleHighlight?.notes?.includes(noteInOctave)) {
        ctx.fillStyle = 'rgba(0, 217, 255, 0.03)';
        ctx.fillRect(keyWidth, y, contentWidth, pixelsPerNote);
      }
      
      // C note emphasis
      if (isC) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(keyWidth, y + pixelsPerNote);
        ctx.lineTo(width, y + pixelsPerNote);
        ctx.stroke();
        
        // C label
        const octave = Math.floor(i / 12) - 1;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(`C${octave}`, 4, y + pixelsPerNote - 2);
      }
      
      // Piano key visualization
      const keyY = y;
      const keyH = pixelsPerNote;
      
      if (isWhiteKey) {
        ctx.fillStyle = '#F0F6FC';
        ctx.fillRect(0, keyY, keyWidth - 4, keyH - 1);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.strokeRect(0, keyY, keyWidth - 4, keyH - 1);
      } else {
        ctx.fillStyle = '#1C232D';
        ctx.fillRect(0, keyY, keyWidth - 12, keyH);
      }
    }
    
    // Grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    
    for (let beat = 0; beat <= totalBeats; beat += gridSnap) {
      const x = keyWidth + (beat * pixelsPerBeat) - scrollX;
      if (x < keyWidth || x > width) continue;
      
      const isBar = beat % 4 === 0;
      const isBeat = beat % 1 === 0;
      
      ctx.strokeStyle = isBar 
        ? 'rgba(255, 255, 255, 0.12)' 
        : isBeat 
        ? 'rgba(255, 255, 255, 0.06)' 
        : 'rgba(255, 255, 255, 0.03)';
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
      
      // Bar numbers
      if (isBar) {
        const bar = Math.floor(beat / 4) + 1;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(bar.toString(), x + 4, 12);
      }
    }
    
    // Ghost notes
    if (ghostTracks && selectedTrack) {
      tracks.forEach(track => {
        if (track.id === selectedTrackId || track.muted || !track.notes) return;
        
        const ghostColor = trackColors[track.type]?.fill || '#64748B';
        
        track.notes.forEach(note => {
          const x = keyWidth + (note.start * pixelsPerBeat) - scrollX;
          const w = Math.max(note.duration * pixelsPerBeat, 2);
          const y = height - ((note.pitch - minNote + 1) * pixelsPerNote);
          const h = pixelsPerNote * 0.85;
          
          if (x + w < keyWidth || x > width) return;
          
          ctx.fillStyle = ghostColor + '15';
          ctx.fillRect(x, y, w, h);
        });
      });
    }
    
    // Selected track notes
    if (selectedTrack?.notes) {
      const colors = trackColors[selectedTrack.type] || { fill: '#64748B', stroke: '#94A3B8', glow: 'rgba(100, 116, 139, 0.4)' };
      
      selectedTrack.notes.forEach((note, idx) => {
        const x = keyWidth + (note.start * pixelsPerBeat) - scrollX;
        const w = Math.max(note.duration * pixelsPerBeat, 4);
        const y = height - ((note.pitch - minNote + 1) * pixelsPerNote);
        const h = pixelsPerNote * 0.85;
        
        if (x + w < keyWidth || x > width) return;
        
        const isHovered = hoveredNote?.trackId === selectedTrackId && hoveredNote?.noteIdx === idx;
        const isSelected = selectedNotes.includes(idx);
        const isDragging = draggingNote?.trackId === selectedTrackId && draggingNote?.noteIdx === idx;
        
        // Note shadow/glow
        if (isSelected || isHovered) {
          ctx.shadowColor = isSelected ? '#F59E0B' : colors.glow;
          ctx.shadowBlur = 12;
        }
        
        // Note fill with gradient
        const noteGrad = ctx.createLinearGradient(x, y, x, y + h);
        noteGrad.addColorStop(0, colors.fill);
        noteGrad.addColorStop(1, colors.stroke);
        ctx.fillStyle = noteGrad;
        
        // Rounded rectangle
        const radius = 3;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, radius);
        ctx.fill();
        
        // Note border
        ctx.strokeStyle = isSelected ? '#F59E0B' : colors.stroke;
        ctx.lineWidth = isSelected ? 2 : 1;
        ctx.stroke();
        
        ctx.shadowBlur = 0;
        
        // Velocity bar
        const velocityHeight = (note.velocity / 127) * h;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(x + 2, y + h - velocityHeight, 3, velocityHeight);
        
        // Note highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(x, y, w, 2);
      });
    }
    
    // Drawing note preview
    if (drawingNote) {
      const x = keyWidth + (drawingNote.start * pixelsPerBeat) - scrollX;
      const w = Math.max(drawingNote.duration * pixelsPerBeat, 4);
      const y = height - ((drawingNote.pitch - minNote + 1) * pixelsPerNote);
      const h = pixelsPerNote * 0.85;
      
      ctx.fillStyle = 'rgba(0, 217, 255, 0.5)';
      ctx.strokeStyle = '#00D9FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00D9FF';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 3);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // Selection box
    if (selectionBox) {
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.fillStyle = 'rgba(245, 158, 11, 0.1)';
      ctx.fillRect(
        Math.min(selectionBox.startX, selectionBox.endX),
        Math.min(selectionBox.startY, selectionBox.endY),
        Math.abs(selectionBox.endX - selectionBox.startX),
        Math.abs(selectionBox.endY - selectionBox.startY)
      );
      ctx.strokeRect(
        Math.min(selectionBox.startX, selectionBox.endX),
        Math.min(selectionBox.startY, selectionBox.endY),
        Math.abs(selectionBox.endX - selectionBox.startX),
        Math.abs(selectionBox.endY - selectionBox.startY)
      );
      ctx.setLineDash([]);
    }
    
    // Playhead
    if (currentBeat >= 0 && currentBeat <= totalBeats) {
      const x = keyWidth + (currentBeat * pixelsPerBeat) - scrollX;
      if (x >= keyWidth && x <= width) {
        // Playhead glow
        const glowGrad = ctx.createLinearGradient(x - 15, 0, x + 15, 0);
        glowGrad.addColorStop(0, 'rgba(0, 217, 255, 0)');
        glowGrad.addColorStop(0.5, 'rgba(0, 217, 255, 0.1)');
        glowGrad.addColorStop(1, 'rgba(0, 217, 255, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(x - 15, 0, 30, height);
        
        ctx.strokeStyle = '#00D9FF';
        ctx.lineWidth = 2;
        ctx.shadowColor = '#00D9FF';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
  }, [tracks, currentBeat, totalBeats, hoveredNote, draggingNote, drawingNote, selectedNotes, selectionBox, ghostTracks, scrollX, zoom, selectedTrackId, selectedTrack, gridSnap, scaleHighlight]);

  const getPositionFromMouse = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const contentWidth = rect.width - keyWidth;
    const pixelsPerBeat = (contentWidth / totalBeats) * zoom;
    const pixelsPerNote = rect.height / noteRange;
    
    const beat = ((x - keyWidth + scrollX) / pixelsPerBeat);
    const pitch = maxNote - Math.floor(y / pixelsPerNote);
    const snappedBeat = Math.round(beat / gridSnap) * gridSnap;
    
    return { beat, pitch, snappedBeat, x, y, pixelsPerBeat, pixelsPerNote, rect };
  };

  const handleMouseDown = (e) => {
    if (!selectedTrackId || !selectedTrack) return;
    
    const { pitch, snappedBeat, x, y, pixelsPerBeat, rect } = getPositionFromMouse(e);
    
    if (x < keyWidth) {
      // Clicked on piano key - preview sound
      handleNotePreview(pitch);
      return;
    }
    
    if (tool === 'draw') {
      setDrawingNote({
        trackId: selectedTrackId,
        start: snappedBeat,
        duration: gridSnap,
        pitch,
        velocity: 100
      });
    } else if (tool === 'erase') {
      const noteIdx = findNoteAtPosition(pitch, snappedBeat);
      if (noteIdx !== -1) {
        onDeleteNote?.(selectedTrackId, noteIdx);
      }
    } else if (tool === 'select') {
      const noteIdx = findNoteAtPosition(pitch, snappedBeat);
      
      if (noteIdx !== -1) {
        if (!selectedNotes.includes(noteIdx) && !e.shiftKey) {
          onSelectNotes?.([noteIdx]);
        } else if (e.shiftKey) {
          onSelectNotes?.([...selectedNotes, noteIdx]);
        }
        
        setDraggingNote({
          trackId: selectedTrackId,
          noteIdx,
          startX: x,
          startBeat: selectedTrack.notes[noteIdx].start,
          startPitch: selectedTrack.notes[noteIdx].pitch
        });
      } else {
        if (!e.shiftKey) onSelectNotes?.([]);
        setSelectionBox({ startX: x, startY: y, endX: x, endY: y });
      }
    }
  };

  const findNoteAtPosition = (pitch, beat) => {
    if (!selectedTrack?.notes) return -1;
    return selectedTrack.notes.findIndex(note => {
      const noteEnd = note.start + note.duration;
      return beat >= note.start && beat <= noteEnd && pitch === note.pitch;
    });
  };

  const handleMouseMove = (e) => {
    const { pitch, snappedBeat, beat, x, y, pixelsPerBeat, pixelsPerNote, rect } = getPositionFromMouse(e);
    
    if (drawingNote) {
      const duration = Math.max(gridSnap, beat - drawingNote.start);
      const snappedDuration = Math.round(duration / gridSnap) * gridSnap;
      setDrawingNote({ ...drawingNote, duration: snappedDuration });
    }
    
    if (draggingNote && selectedTrack) {
      const deltaBeat = snappedBeat - draggingNote.startBeat;
      const deltaPitch = pitch - draggingNote.startPitch;
      
      const updatedNotes = [...selectedTrack.notes];
      
      if (selectedNotes.includes(draggingNote.noteIdx)) {
        selectedNotes.forEach(idx => {
          const note = updatedNotes[idx];
          updatedNotes[idx] = {
            ...note,
            start: Math.max(0, note.start + deltaBeat),
            pitch: Math.max(minNote, Math.min(maxNote, note.pitch + deltaPitch))
          };
        });
      } else {
        updatedNotes[draggingNote.noteIdx] = {
          ...updatedNotes[draggingNote.noteIdx],
          start: Math.max(0, snappedBeat),
          pitch: Math.max(minNote, Math.min(maxNote, pitch))
        };
      }
      
      onUpdateTrack?.(selectedTrackId, { notes: updatedNotes });
    }
    
    if (selectionBox) {
      setSelectionBox({ ...selectionBox, endX: x, endY: y });
      
      if (selectedTrack?.notes) {
        const selected = [];
        const contentWidth = rect.width - keyWidth;
        const pixelsPerBeat = (contentWidth / totalBeats) * zoom;
        const pixelsPerNote = rect.height / noteRange;
        
        const boxLeft = Math.min(selectionBox.startX, x);
        const boxRight = Math.max(selectionBox.startX, x);
        const boxTop = Math.min(selectionBox.startY, y);
        const boxBottom = Math.max(selectionBox.startY, y);
        
        selectedTrack.notes.forEach((note, idx) => {
          const noteX = keyWidth + (note.start * pixelsPerBeat) - scrollX;
          const noteY = rect.height - ((note.pitch - minNote + 1) * pixelsPerNote);
          const noteW = note.duration * pixelsPerBeat;
          const noteH = pixelsPerNote * 0.85;
          
          if (noteX + noteW >= boxLeft && noteX <= boxRight &&
              noteY + noteH >= boxTop && noteY <= boxBottom) {
            selected.push(idx);
          }
        });
        
        onSelectNotes?.(selected);
      }
    }
    
    // Hover detection
    if (!draggingNote && !drawingNote && !selectionBox && selectedTrack) {
      const noteIdx = findNoteAtPosition(pitch, beat);
      setHoveredNote(noteIdx !== -1 ? { trackId: selectedTrackId, noteIdx } : null);
    }
  };

  const handleMouseUp = () => {
    if (drawingNote) {
      onAddNote?.(selectedTrackId, {
        start: drawingNote.start,
        duration: drawingNote.duration,
        pitch: drawingNote.pitch,
        velocity: 100
      });
      setDrawingNote(null);
    }
    
    setDraggingNote(null);
    setSelectionBox(null);
  };

  const handleNotePreview = async (midiNote) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      osc.frequency.value = 440 * Math.pow(2, (midiNote - 69) / 12);
      osc.type = 'triangle';
      
      gain.gain.setValueAtTime(0.2, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.start();
      osc.stop(audioContext.currentTime + 0.3);
    } catch (e) {}
  };

  const handleUpdateVelocity = (noteIdx, velocity) => {
    if (!selectedTrack) return;
    const updatedNotes = [...selectedTrack.notes];
    updatedNotes[noteIdx] = { ...updatedNotes[noteIdx], velocity };
    onUpdateTrack?.(selectedTrackId, { notes: updatedNotes });
  };

  const handleWheel = (e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(prev => Math.max(0.5, Math.min(4, prev - e.deltaY * 0.001)));
    } else {
      setScrollX(prev => Math.max(0, prev + e.deltaX));
    }
  };

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select (V)' },
    { id: 'draw', icon: Pencil, label: 'Draw (D)' },
    { id: 'erase', icon: Eraser, label: 'Erase (E)' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 bg-gradient-to-b from-[#151B23] to-[#0D1117] border-b border-white/5">
        <div className="flex items-center gap-1">
          {tools.map(({ id, icon: Icon, label }) => (
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

          <button
            onClick={() => setGhostTracks(!ghostTracks)}
            className={cn(
              "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
              ghostTracks 
                ? "bg-[#8B5CF6]/20 text-[#A78BFA] border border-[#8B5CF6]/30" 
                : "text-[#8B949E] hover:text-white hover:bg-white/5"
            )}
          >
            <Zap className="w-3.5 h-3.5" />
            Ghost
          </button>
        </div>

        <div className="flex items-center gap-3">
          {selectedNotes.length > 0 && (
            <span className="text-xs text-[#00D9FF] font-medium">
              {selectedNotes.length} note{selectedNotes.length > 1 ? 's' : ''} selected
            </span>
          )}
          
          {!selectedTrackId && (
            <span className="text-xs text-[#6E7681]">
              Select a track to edit
            </span>
          )}
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 relative" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className={cn(
            "w-full h-full",
            tool === 'draw' && "cursor-crosshair",
            tool === 'erase' && "cursor-pointer",
            tool === 'select' && "cursor-default"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        />
      </div>
      
      {/* Velocity Editor */}
      {selectedTrack?.notes?.length > 0 && (
        <div className="border-t border-white/5">
          <VelocityEditor
            notes={selectedTrack.notes}
            selectedNotes={selectedNotes}
            onUpdateVelocity={handleUpdateVelocity}
            totalBeats={totalBeats}
          />
        </div>
      )}
    </div>
  );
}