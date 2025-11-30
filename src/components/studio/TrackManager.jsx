import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Trash2, Copy, Layers } from "lucide-react";
import { toast } from "sonner";

const TRACK_TYPES = [
  { value: 'melody', label: 'Melody', icon: '🎵' },
  { value: 'chords', label: 'Chords/Harmony', icon: '🎹' },
  { value: 'bass', label: 'Bass', icon: '🎸' },
  { value: 'drums', label: 'Drums', icon: '🥁' },
  { value: 'arp', label: 'Arpeggio', icon: '✨' },
  { value: 'pad', label: 'Pad', icon: '🌊' },
  { value: 'lead', label: 'Lead Synth', icon: '⚡' },
  { value: 'countermelody', label: 'Countermelody', icon: '🎺' },
  { value: 'percussion', label: 'Percussion', icon: '🪘' },
  { value: 'fx', label: 'FX/Riser', icon: '🌟' }
];

export default function TrackManager({ tracks, onAddTrack, onRemoveTrack, onDuplicateTrack, maxTracks = 30 }) {
  const [newTrackType, setNewTrackType] = useState('melody');
  const [newTrackName, setNewTrackName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddTrack = () => {
    if (tracks.length >= maxTracks) {
      toast.error(`Maximum ${maxTracks} tracks reached`);
      return;
    }

    const trackType = TRACK_TYPES.find(t => t.value === newTrackType);
    const name = newTrackName || `${trackType.label} ${tracks.filter(t => t.type === newTrackType).length + 1}`;
    
    onAddTrack({
      type: newTrackType,
      name,
      channel: null, // Will be assigned by engine
      program: 0,
      volume: 0.75,
      pan: 0,
      muted: false,
      solo: false,
      notes: []
    });

    setNewTrackName('');
    setDialogOpen(false);
    toast.success(`Added ${name}`);
  };

  const handleDuplicate = (track) => {
    if (tracks.length >= maxTracks) {
      toast.error(`Maximum ${maxTracks} tracks reached`);
      return;
    }

    onDuplicateTrack(track);
    toast.success(`Duplicated ${track.name}`);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[var(--muted)]" />
          <span className="text-sm font-semibold text-[var(--text)]">
            Tracks ({tracks.length}/{maxTracks})
          </span>
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              disabled={tracks.length >= maxTracks}
            >
              <Plus className="w-4 h-4" />
              Add Track
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-[var(--surface)] border-[var(--line)]">
            <DialogHeader>
              <DialogTitle>Add New Track</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Track Type</label>
                <Select value={newTrackType} onValueChange={setNewTrackType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRACK_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.icon} {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Track Name (optional)</label>
                <Input
                  value={newTrackName}
                  onChange={(e) => setNewTrackName(e.target.value)}
                  placeholder="Auto-generated if empty"
                />
              </div>

              <Button
                onClick={handleAddTrack}
                className="w-full bg-gradient-to-r from-[var(--mint)] to-[var(--ice)] text-black"
              >
                Create Track
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {tracks.map((track, idx) => (
          <div
            key={track.id}
            className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)] hover:border-[var(--line)] transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{track.name}</div>
              <div className="text-xs text-[var(--muted)]">
                Ch {track.channel + 1} • {track.notes?.length || 0} notes
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDuplicate(track)}
                className="h-7 w-7 p-0"
                title="Duplicate"
              >
                <Copy className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onRemoveTrack(track.id);
                  toast.success(`Removed ${track.name}`);
                }}
                className="h-7 w-7 p-0 text-[var(--coral)]"
                title="Remove"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}