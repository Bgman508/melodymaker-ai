import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MapPin, Plus, Trash2, Play } from "lucide-react";
import { toast } from "sonner";

export default function Markers({ totalBeats, currentBeat, onSeekTo }) {
  const [markers, setMarkers] = useState([
    { id: 1, beat: 0, name: 'Intro' },
    { id: 2, beat: 8, name: 'Verse' },
    { id: 3, beat: 16, name: 'Chorus' }
  ]);
  const [newMarkerName, setNewMarkerName] = useState('');

  const addMarker = () => {
    if (!newMarkerName.trim()) {
      toast.error('Enter a marker name');
      return;
    }

    const newMarker = {
      id: Date.now(),
      beat: Math.floor(currentBeat),
      name: newMarkerName
    };

    setMarkers([...markers, newMarker].sort((a, b) => a.beat - b.beat));
    setNewMarkerName('');
    toast.success(`Marker added at beat ${newMarker.beat}`);
  };

  const deleteMarker = (id) => {
    setMarkers(markers.filter(m => m.id !== id));
    toast.success('Marker deleted');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <MapPin className="w-4 h-4" />
          Markers ({markers.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
        <DialogHeader>
          <DialogTitle>Timeline Markers</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Add New Marker */}
          <div className="flex gap-2">
            <Input
              value={newMarkerName}
              onChange={(e) => setNewMarkerName(e.target.value)}
              placeholder="Marker name..."
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') addMarker();
              }}
            />
            <Button onClick={addMarker} className="gap-2">
              <Plus className="w-4 h-4" />
              Add
            </Button>
          </div>

          <p className="text-xs text-[var(--muted)]">
            New marker will be placed at beat {Math.floor(currentBeat)}
          </p>

          {/* Marker List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {markers.map(marker => (
              <div
                key={marker.id}
                className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold">{marker.name}</p>
                  <p className="text-xs text-[var(--muted)]">Beat {marker.beat}</p>
                </div>
                
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onSeekTo?.(marker.beat);
                      toast.success(`Jumped to ${marker.name}`);
                    }}
                    className="h-8 gap-2"
                  >
                    <Play className="w-3 h-3" />
                    Go
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteMarker(marker.id)}
                    className="h-8 w-8 p-0 text-[var(--coral)]"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}