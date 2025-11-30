import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grid3x3, Play, Square, Plus, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function LiveLoops({ tracks, bpm, onCaptureToTimeline, onUpdateClip }) {
  const [clips, setClips] = useState([]);
  const [playingClips, setPlayingClips] = useState(new Set());
  const [selectedClip, setSelectedClip] = useState(null);
  
  const rows = 8;
  const cols = 8;

  const initializeGrid = () => {
    const grid = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        grid.push({
          id: `clip-${row}-${col}`,
          row,
          col,
          track: null,
          notes: [],
          duration: 4, // bars
          name: '',
          color: '#64748b'
        });
      }
    }
    return grid;
  };

  const getClip = (row, col) => {
    return clips.find(c => c.row === row && c.col === col);
  };

  const toggleClip = (row, col) => {
    const clipId = `clip-${row}-${col}`;
    
    setPlayingClips(prev => {
      const next = new Set(prev);
      if (next.has(clipId)) {
        next.delete(clipId);
      } else {
        next.add(clipId);
      }
      return next;
    });
  };

  const recordClip = (row, col, trackId) => {
    const track = tracks.find(t => t.id === trackId);
    if (!track) return;

    const newClip = {
      id: `clip-${row}-${col}`,
      row,
      col,
      track: trackId,
      trackName: track.name,
      notes: [...track.notes],
      duration: 4,
      name: `${track.name} ${col + 1}`,
      color: track.color || '#64748b'
    };

    setClips(prev => {
      const filtered = prev.filter(c => !(c.row === row && c.col === col));
      return [...filtered, newClip];
    });

    toast.success(`Recorded clip: ${newClip.name}`);
  };

  const captureToTimeline = () => {
    const playingClipData = Array.from(playingClips)
      .map(clipId => clips.find(c => c.id === clipId))
      .filter(Boolean);

    if (playingClipData.length === 0) {
      toast.error('No clips playing');
      return;
    }

    onCaptureToTimeline?.(playingClipData);
    toast.success(`Captured ${playingClipData.length} clips to timeline`);
  };

  const duplicateClip = (clip) => {
    // Find next empty slot in same row
    let targetCol = clip.col + 1;
    while (targetCol < cols && getClip(clip.row, targetCol)) {
      targetCol++;
    }

    if (targetCol >= cols) {
      toast.error('No empty slots in row');
      return;
    }

    const newClip = {
      ...clip,
      id: `clip-${clip.row}-${targetCol}`,
      col: targetCol,
      name: `${clip.name} (copy)`
    };

    setClips(prev => [...prev, newClip]);
    toast.success('Clip duplicated');
  };

  const deleteClip = (row, col) => {
    setClips(prev => prev.filter(c => !(c.row === row && c.col === col)));
    setPlayingClips(prev => {
      const next = new Set(prev);
      next.delete(`clip-${row}-${col}`);
      return next;
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Grid3x3 className="w-4 h-4" />
          Live Loops
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Live Loops - Non-Linear Sketch Grid</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Controls */}
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setPlayingClips(new Set())} variant="outline">
              <Square className="w-4 h-4 mr-2" />
              Stop All
            </Button>
            
            <Button size="sm" onClick={captureToTimeline} className="bg-[var(--mint)] text-black">
              <Plus className="w-4 h-4 mr-2" />
              Capture to Timeline
            </Button>

            <span className="text-xs text-[var(--muted)] ml-auto">
              {playingClips.size} clips playing
            </span>
          </div>

          {/* Grid */}
          <div className="overflow-auto max-h-[60vh] border border-[var(--hair)] rounded-lg">
            <div className="inline-grid gap-1 p-2 bg-[var(--bg)]" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {Array.from({ length: rows }).map((_, row) => (
                Array.from({ length: cols }).map((_, col) => {
                  const clip = getClip(row, col);
                  const clipId = `clip-${row}-${col}`;
                  const isPlaying = playingClips.has(clipId);
                  const isSelected = selectedClip === clipId;

                  return (
                    <div
                      key={clipId}
                      className={cn(
                        "w-24 h-24 rounded-lg border-2 transition-all cursor-pointer relative group",
                        clip ? "border-[var(--line)]" : "border-dashed border-[var(--hair)]",
                        isPlaying && "ring-2 ring-[var(--mint)] animate-pulse",
                        isSelected && "ring-2 ring-[var(--violet)]",
                        !clip && "hover:border-[var(--line)] hover:bg-[var(--hover)]"
                      )}
                      style={{
                        backgroundColor: clip ? `${clip.color}20` : 'transparent'
                      }}
                      onClick={() => {
                        if (clip) {
                          toggleClip(row, col);
                        } else {
                          setSelectedClip(clipId);
                        }
                      }}
                    >
                      {clip ? (
                        <>
                          <div className="p-2 flex flex-col h-full">
                            <div className="text-xs font-semibold truncate mb-1">
                              {clip.name}
                            </div>
                            <div className="text-[10px] text-[var(--muted)]">
                              {clip.notes.length} notes
                            </div>
                            <div className="text-[10px] text-[var(--muted)]">
                              {clip.duration} bars
                            </div>
                            
                            {isPlaying && (
                              <div className="absolute top-1 right-1">
                                <Play className="w-3 h-3 text-[var(--mint)]" fill="currentColor" />
                              </div>
                            )}
                          </div>

                          {/* Clip Actions */}
                          <div className="absolute inset-x-0 bottom-0 flex gap-1 p-1 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateClip(clip);
                              }}
                              className="flex-1 p-1 rounded hover:bg-[var(--hover)]"
                              title="Duplicate"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteClip(row, col);
                              }}
                              className="flex-1 p-1 rounded hover:bg-[var(--coral)]/20 text-[var(--coral)]"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full text-[var(--muted)]">
                          <Plus className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  );
                })
              ))}
            </div>
          </div>

          {/* Track Assignment for Selected Slot */}
          {selectedClip && !getClip(
            parseInt(selectedClip.split('-')[1]),
            parseInt(selectedClip.split('-')[2])
          ) && (
            <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
              <h4 className="text-sm font-semibold mb-3">Record Clip from Track</h4>
              <div className="grid grid-cols-4 gap-2">
                {tracks.map(track => (
                  <Button
                    key={track.id}
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const [, row, col] = selectedClip.split('-').map(Number);
                      recordClip(row, col, track.id);
                      setSelectedClip(null);
                    }}
                    className="justify-start"
                  >
                    {track.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}