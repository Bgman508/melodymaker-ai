import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Layers, Download } from "lucide-react";
import { toast } from "sonner";

export default function ExportStems({ tracks, bpm, projectName, midiWriter }) {
  const [selectedTracks, setSelectedTracks] = useState(tracks.map(t => t.id));
  const [format, setFormat] = useState('midi');
  const [exporting, setExporting] = useState(false);

  const toggleTrack = (trackId) => {
    setSelectedTracks(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const exportStems = () => {
    setExporting(true);
    
    const tracksToExport = tracks.filter(t => selectedTracks.includes(t.id));
    
    if (format === 'midi') {
      // Export each track as separate MIDI file
      tracksToExport.forEach(track => {
        midiWriter.downloadMIDI([track], bpm, `${projectName}_${track.name}_stem.mid`);
      });
      
      toast.success(`Exported ${tracksToExport.length} MIDI stems!`);
    } else {
      toast.info('Audio stem export coming soon!');
    }
    
    setExporting(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Layers className="w-4 h-4" />
          Stems
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
        <DialogHeader>
          <DialogTitle>Export Stems</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Export individual tracks as separate files
          </p>

          {/* Format Selection */}
          <div className="flex gap-2">
            <Button
              variant={format === 'midi' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFormat('midi')}
              className="flex-1"
            >
              MIDI
            </Button>
            <Button
              variant={format === 'audio' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFormat('audio')}
              className="flex-1"
              disabled
            >
              Audio (Soon)
            </Button>
          </div>

          {/* Track Selection */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold">Select Tracks</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (selectedTracks.length === tracks.length) {
                    setSelectedTracks([]);
                  } else {
                    setSelectedTracks(tracks.map(t => t.id));
                  }
                }}
              >
                {selectedTracks.length === tracks.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>

            {tracks.map(track => (
              <label
                key={track.id}
                className="flex items-center gap-3 p-2 rounded hover:bg-[var(--surface-2)] cursor-pointer"
              >
                <Checkbox
                  checked={selectedTracks.includes(track.id)}
                  onCheckedChange={() => toggleTrack(track.id)}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{track.name}</p>
                  <p className="text-xs text-[var(--muted)]">
                    {track.notes.length} notes
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Export Button */}
          <Button
            onClick={exportStems}
            disabled={exporting || selectedTracks.length === 0}
            className="w-full gap-2 bg-[var(--mint)] text-black"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : `Export ${selectedTracks.length} Stems`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}