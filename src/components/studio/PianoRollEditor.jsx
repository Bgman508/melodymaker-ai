import React, { useRef, useEffect, useState, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { Pencil, Eraser, MousePointer, Zap } from "lucide-react";
import { toast } from "sonner";
import VelocityEditor from "./VelocityEditor";

const trackColors = {
  melody: { fill: '#4D7CFF', stroke: '#7BA3FF', glow: 'rgba(77, 124, 255, 0.4)' },
  chords: { fill: '#9D5CFF', stroke: '#C49DFF', glow: 'rgba(157, 92, 255, 0.4)' },
  bass: { fill: '#00F0FF', stroke: '#5CF9FF', glow: 'rgba(0, 240, 255, 0.4)' },
  drums: { fill: '#FF4757', stroke: '#FF7A85', glow: 'rgba(255, 71, 87, 0.4)' },
  pad: { fill: '#FF5CAA', stroke: '#FF8FC7', glow: 'rgba(255, 92, 170, 0.4)' },
  lead: { fill: '#FF9500', stroke: '#FFB347', glow: 'rgba(255, 149, 0, 0.4)' },
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
  const animationRef = useRef(null);
  const [tool, setTool] = useState('select');
  const [hoveredNote, setHoveredNote] = useState(null);
  const [draggingNote, setDraggingNote] = useState(null);
  const [drawingNote, setDrawingNote] = useState(null);
  const [selectionBox, setSelectionBox] = useState(null);
  const [ghostTracks, setGhostTracks] = useState(true);
  const [scrollX, setScrollX] = useState(0);
  const [zoom, setZoom] = useState(1);

  const minNote = 36;
  const maxNote = 96;
  const noteRange = maxNote - minNote;
  const keyWidth = 44;

  const selectedTrack = tracks.find(t => t.id === selectedTrackId);

  useEffect(() => {
    const draw = () => {
      drawPianoRoll();
      animationRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationRef.current);
  }, [tracks, currentBeat, totalBeats, hoveredNote, draggingNote, drawingNote, selectedNotes, selectionBox, ghostTracks, scrollX, zoom, selectedTrackId]);

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
    
    // Background
    ctx.fillStyle = '#0F0F0F';
    ctx.fillRect(0, 0, width, height);
    
    // Piano keys area
    ctx.fillStyle = '#121212';
    ctx.fillRect(0, 0, keyWidth, height);
    
    // Note rows
    const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
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
        ctx.fillStyle = 'rgba(139, 92, 246, 0.04)';
        ctx.fillRect(keyWidth, y, contentWidth, pixelsPerNote);
      }
      
      // C note lines
      if (isC) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(keyWidth, y + pixelsPerNote);
        ctx.lineTo(width, y + pixelsPerNote);
        ctx.stroke();
      }
      
      // Piano key
      const keyY = y;
      const keyH = pixelsPerNote;
      
      if (isWhiteKey) {
        ctx.fillStyle = '#E5E5E5';
        ctx.fillRect(0, keyY + 1, keyWidth - 2, keyH - 1);
        
        if (isC) {
          const octave = Math.floor(i / 12) - 1;
          ctx.fillStyle = '#71717A';
          ctx.font = '500 9px "Inter", sans-serif';
          ctx.fillText(`C${octave}`, 4, keyY + keyH - 4);
        }
      } else {
        ctx.fillStyle = '#1A1A1A';
        ctx.fillRect(0, keyY + 1, keyWidth - 8, keyH - 1);
      }
    }
    
    // Grid lines
    for (let beat = 0; beat <= totalBeats; beat += gridSnap) {
      const x = keyWidth + (beat * pixelsPerBeat) - scrollX;
      if (x < keyWidth || x > width) continue;
      
      const isBar = beat % 4 === 0;
      const isBeat = beat % 1 === 0;
      
      ctx.strokeStyle = isBar 
        ? 'rgba(255, 255, 255, 0.06)' 
        : isBeat 
        ? 'rgba(255, 255, 255, 0.03)' 
        : 'rgba(255, 255, 255, 0.015)';
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Ghost notes
    if (ghostTracks && selectedTrack) {
      tracks.forEach(track => {
        if (track.id === selectedTrackId || track.muted || !track.notes) return;
        
        track.notes.forEach(note => {
          const x = keyWidth + (note.start * pixelsPerBeat) - scrollX;
          const w = Math.max(note.duration * pixelsPerBeat, 2);
          const y = height - ((note.pitch - minNote + 1) * pixelsPerNote);
          const h = pixelsPerNote * 0.75;
          
          if (x + w < keyWidth || x > width) return;
          
          ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
          ctx.fillRect(x, y, w, h);
        });
      });
    }
    
    // Selected track notes
    if (selectedTrack?.notes) {
      selectedTrack.notes.forEach((note, idx) => {
        const x = keyWidth + (note.start * pixelsPerBeat) - scrollX;
        const w = Math.max(note.duration * pixelsPerBeat - 1, 4);
        const y = height - ((note.pitch - minNote + 1) * pixelsPerNote);
        const h = pixelsPerNote * 0.75;
        
        if (x + w < keyWidth || x > width) return;
        
        const isHovered = hoveredNote?.noteIdx === idx;
        const isSelected = selectedNotes.includes(idx);
        
        // Note fill - simple purple
        ctx.fillStyle = isSelected ? '#A78BFA' : '#8B5CF6';
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 2);
        ctx.fill();
        
        // Subtle border
        if (isHovered) {
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Velocity brightness
        const brightness = note.velocity / 127;
        ctx.fillStyle = `rgba(255, 255, 255, ${brightness * 0.2})`;
        ctx.fillRect(x, y, w, h);
      });
    }
    
    // Drawing note
    if (drawingNote) {
      const x = keyWidth + (drawingNote.start * pixelsPerBeat) - scrollX;
      const w = Math.max(drawingNote.duration * pixelsPerBeat, 4);
      const y = height - ((drawingNote.pitch - minNote + 1) * pixelsPerNote);
      const h = pixelsPerNote * 0.8;
      
      ctx.fillStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.strokeStyle = '#00F0FF';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00F0FF';
      ctx.shadowBlur = 16;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 3);
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    // Selection box
    if (selectionBox) {
      ctx.strokeStyle = '#FFDD00';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.fillStyle = 'rgba(255, 221, 0, 0.08)';
      
      const boxX = Math.min(selectionBox.startX, selectionBox.endX);
      const boxY = Math.min(selectionBox.startY, selectionBox.endY);
      const boxW = Math.abs(selectionBox.endX - selectionBox.startX);
      const boxH = Math.abs(selectionBox.endY - selectionBox.startY);
      
      ctx.fillRect(boxX, boxY, boxW, boxH);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);
    }
    
    // Playhead
    if (currentBeat >= 0 && currentBeat <= totalBeats) {
      const x = keyWidth + (currentBeat * pixelsPerBeat) - scrollX;
      if (x >= keyWidth && x <= width) {
        ctx.strokeStyle = '#8B5CF6';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
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
    
    const { pitch, snappedBeat, x, y, rect } = getPositionFromMouse(e);
    
    if (x < keyWidth) {
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
        const pxPerBeat = (contentWidth / totalBeats) * zoom;
        const pxPerNote = rect.height / noteRange;
        
        const boxLeft = Math.min(selectionBox.startX, x);
        const boxRight = Math.max(selectionBox.startX, x);
        const boxTop = Math.min(selectionBox.startY, y);
        const boxBottom = Math.max(selectionBox.startY, y);
        
        selectedTrack.notes.forEach((note, idx) => {
          const noteX = keyWidth + (note.start * pxPerBeat) - scrollX;
          const noteY = rect.height - ((note.pitch - minNote + 1) * pxPerNote);
          const noteW = note.duration * pxPerBeat;
          const noteH = pxPerNote * 0.8;
          
          if (noteX + noteW >= boxLeft && noteX <= boxRight &&
              noteY + noteH >= boxTop && noteY <= boxBottom) {
            selected.push(idx);
          }
        });
        
        onSelectNotes?.(selected);
      }
    }
    
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
      
      gain.gain.setValueAtTime(0.15, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
      
      osc.connect(gain);
      gain.connect(audioContext.destination);
      
      osc.start();
      osc.stop(audioContext.currentTime + 0.25);
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
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'draw', icon: Pencil, label: 'Draw' },
    { id: 'erase', icon: Eraser, label: 'Erase' },
  ];

  return (
    <div className="flex flex-col h-full" style={{ background: '#0F0F0F' }}>
      {/* Minimal Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ background: '#121212', borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-1">
          {tools.map(({ id, icon: Icon }) => (
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
            onClick={() => setGhostTracks(!ghostTracks)}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all",
              ghostTracks 
                ? "bg-white/10 text-white" 
                : "text-white/40 hover:text-white/80"
            )}
          >
            <Zap className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {selectedNotes.length > 0 && (
            <span className="text-sm font-medium text-white/60">
              {selectedNotes.length} selected
            </span>
          )}
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
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
        <VelocityEditor
          notes={selectedTrack.notes}
          selectedNotes={selectedNotes}
          onUpdateVelocity={handleUpdateVelocity}
          totalBeats={totalBeats}
        />
      )}
    </div>
  );
}