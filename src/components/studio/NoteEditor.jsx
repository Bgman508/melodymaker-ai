import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music, TrendingUp, Move } from "lucide-react";
import { toast } from "sonner";

export default function NoteEditor({ track, onUpdateTrack }) {
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [velocity, setVelocity] = useState(100);
  const [transpose, setTranspose] = useState(0);

  const applyVelocity = () => {
    const updated = track.notes.map((note, idx) => 
      selectedNotes.includes(idx) ? { ...note, velocity } : note
    );
    onUpdateTrack(track.id, { notes: updated });
    toast.success(`Velocity set to ${velocity}`);
  };

  const applyTranspose = () => {
    const updated = track.notes.map((note, idx) => 
      selectedNotes.includes(idx) ? { ...note, pitch: note.pitch + transpose } : note
    );
    onUpdateTrack(track.id, { notes: updated });
    toast.success(`Transposed ${transpose > 0 ? '+' : ''}${transpose} semitones`);
  };

  const humanize = (amount) => {
    const updated = track.notes.map((note, idx) => {
      if (selectedNotes.includes(idx)) {
        const velocityOffset = (Math.random() - 0.5) * amount;
        const timingOffset = (Math.random() - 0.5) * 0.05 * (amount / 20);
        return {
          ...note,
          velocity: Math.max(1, Math.min(127, note.velocity + velocityOffset)),
          start: note.start + timingOffset
        };
      }
      return note;
    });
    onUpdateTrack(track.id, { notes: updated });
    toast.success('Humanized selected notes');
  };

  const quantizeNotes = (gridSize) => {
    const updated = track.notes.map((note, idx) => {
      if (selectedNotes.includes(idx)) {
        const quantized = Math.round(note.start / gridSize) * gridSize;
        return { ...note, start: quantized };
      }
      return note;
    });
    onUpdateTrack(track.id, { notes: updated });
    toast.success(`Quantized to ${gridSize} beats`);
  };

  return (
    <div className="space-y-4 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
      <div>
        <h4 className="text-sm font-semibold mb-3">Note Operations</h4>
        <p className="text-xs text-[var(--muted)] mb-3">
          {selectedNotes.length > 0 
            ? `${selectedNotes.length} notes selected` 
            : 'Select notes in piano roll'}
        </p>
      </div>

      {/* Velocity Control */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold flex items-center gap-2">
            <TrendingUp className="w-3 h-3" />
            Velocity: {velocity}
          </label>
          <Button 
            size="sm" 
            onClick={applyVelocity}
            disabled={selectedNotes.length === 0}
          >
            Apply
          </Button>
        </div>
        <Slider
          value={[velocity]}
          onValueChange={(val) => setVelocity(val[0])}
          max={127}
          min={1}
        />
      </div>

      {/* Transpose */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold flex items-center gap-2">
            <Move className="w-3 h-3" />
            Transpose: {transpose > 0 ? '+' : ''}{transpose}
          </label>
          <Button 
            size="sm" 
            onClick={applyTranspose}
            disabled={selectedNotes.length === 0}
          >
            Apply
          </Button>
        </div>
        <Slider
          value={[transpose]}
          onValueChange={(val) => setTranspose(val[0])}
          max={24}
          min={-24}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => humanize(10)}
          disabled={selectedNotes.length === 0}
        >
          Humanize
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => quantizeNotes(0.25)}
          disabled={selectedNotes.length === 0}
        >
          Quantize 1/16
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setVelocity(127)}
          disabled={selectedNotes.length === 0}
        >
          Max Velocity
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const avg = track.notes.reduce((sum, n) => sum + n.velocity, 0) / track.notes.length;
            setVelocity(Math.round(avg));
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}