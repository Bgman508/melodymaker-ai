import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layers, Check, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CompingSystem({ track, onUpdateTrack }) {
  const [takes, setTakes] = useState(track?.takes || []);
  const [activeComp, setActiveComp] = useState(0);
  const [selectedRegions, setSelectedRegions] = useState([]);

  const addTake = () => {
    if (!track || !track.notes || track.notes.length === 0) {
      toast.error('No notes to save as take');
      return;
    }

    const newTake = {
      id: Date.now(),
      name: `Take ${takes.length + 1}`,
      notes: [...track.notes],
      timestamp: Date.now(),
      visible: true
    };

    setTakes(prev => [...prev, newTake]);
    toast.success(`Take ${takes.length + 1} saved`);
  };

  const toggleTakeVisibility = (takeId) => {
    setTakes(prev => prev.map(t =>
      t.id === takeId ? { ...t, visible: !t.visible } : t
    ));
  };

  const deleteTake = (takeId) => {
    setTakes(prev => prev.filter(t => t.id !== takeId));
    toast.success('Take deleted');
  };

  const createComp = () => {
    // Combine selected regions from different takes
    const compNotes = [];
    
    selectedRegions.forEach(region => {
      const take = takes.find(t => t.id === region.takeId);
      if (take) {
        const regionNotes = take.notes.filter(note =>
          note.start >= region.start && note.start < region.end
        );
        compNotes.push(...regionNotes);
      }
    });

    if (compNotes.length === 0) {
      toast.error('No regions selected for comp');
      return;
    }

    // Update track with comped notes
    onUpdateTrack?.(track.id, { notes: compNotes, takes });
    toast.success(`Comp created with ${compNotes.length} notes`);
  };

  const selectRegion = (takeId, start, end) => {
    setSelectedRegions(prev => {
      // Remove overlapping regions
      const filtered = prev.filter(r => !(r.start < end && r.end > start));
      return [...filtered, { takeId, start, end }];
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Layers className="w-4 h-4" />
          Comping ({takes.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Take Comping - Quick Swipe Comp</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Record multiple takes, then select the best parts to create a perfect composite.
          </p>

          {/* Controls */}
          <div className="flex gap-2">
            <Button onClick={addTake} size="sm" variant="outline">
              Save Current as Take
            </Button>
            <Button
              onClick={createComp}
              size="sm"
              disabled={selectedRegions.length === 0}
              className="bg-[var(--mint)] text-black"
            >
              <Check className="w-4 h-4 mr-2" />
              Create Comp
            </Button>
            <span className="text-xs text-[var(--muted)] ml-auto self-center">
              {selectedRegions.length} regions selected
            </span>
          </div>

          {/* Takes List */}
          <div className="space-y-2">
            {takes.length === 0 ? (
              <div className="text-center py-8 text-[var(--muted)]">
                No takes yet. Record multiple takes to compare and comp.
              </div>
            ) : (
              takes.map((take, idx) => (
                <div
                  key={take.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    take.visible ? "bg-[var(--surface-2)] border-[var(--hair)]" : "bg-[var(--bg)] border-[var(--hair)] opacity-50"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold">{take.name}</h4>
                      <p className="text-xs text-[var(--muted)]">
                        {take.notes.length} notes • {new Date(take.timestamp).toLocaleTimeString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => toggleTakeVisibility(take.id)}
                        title={take.visible ? "Hide" : "Show"}
                      >
                        {take.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteTake(take.id)}
                        className="text-[var(--coral)]"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Waveform/Region Display (simplified) */}
                  {take.visible && (
                    <div className="h-12 bg-[var(--bg)] rounded flex items-center relative overflow-hidden">
                      {/* Show notes as bars */}
                      {take.notes.map((note, noteIdx) => {
                        const maxBeat = Math.max(...take.notes.map(n => n.start + n.duration));
                        const x = (note.start / maxBeat) * 100;
                        const w = (note.duration / maxBeat) * 100;
                        
                        return (
                          <div
                            key={noteIdx}
                            className="absolute h-8 bg-[var(--mint)] opacity-60 rounded"
                            style={{
                              left: `${x}%`,
                              width: `${w}%`,
                              bottom: '8px'
                            }}
                          />
                        );
                      })}

                      {/* Selectable regions overlay */}
                      <div
                        className="absolute inset-0 cursor-pointer hover:bg-[var(--mint)]/10"
                        onClick={() => {
                          const maxBeat = Math.max(...take.notes.map(n => n.start + n.duration));
                          selectRegion(take.id, 0, maxBeat);
                        }}
                      />
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}