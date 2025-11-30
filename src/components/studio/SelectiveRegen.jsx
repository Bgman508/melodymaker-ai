import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RefreshCw, Zap } from "lucide-react";
import { toast } from "sonner";

export default function SelectiveRegen({ structure, tracks, onRegenerate, midiEngine }) {
  const [selectedSections, setSelectedSections] = useState([]);
  const [selectedTracks, setSelectedTracks] = useState([]);
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (selectedSections.length === 0 || selectedTracks.length === 0) {
      toast.error('Select at least one section and track');
      return;
    }

    setRegenerating(true);

    try {
      // Regenerate only selected sections and tracks
      const newTracks = [...tracks];
      
      selectedSections.forEach(sectionIdx => {
        selectedTracks.forEach(trackType => {
          // Generate new content for this section/track combo
          const result = midiEngine.generateComposition(
            `regenerate ${trackType} for section ${structure[sectionIdx].name}`,
            Math.floor(Math.random() * 10000)
          );
          
          const newTrack = result.tracks.find(t => t.type === trackType);
          if (newTrack) {
            // Replace notes only for this section
            const sectionStartBeat = structure.slice(0, sectionIdx).reduce((sum, s) => sum + s.bars * 4, 0);
            const sectionEndBeat = sectionStartBeat + structure[sectionIdx].bars * 4;
            
            const trackIdx = newTracks.findIndex(t => t.type === trackType);
            if (trackIdx !== -1) {
              // Remove old notes in this section
              newTracks[trackIdx].notes = newTracks[trackIdx].notes.filter(
                n => n.start < sectionStartBeat || n.start >= sectionEndBeat
              );
              
              // Add new notes
              const sectionNotes = newTrack.notes.filter(
                n => n.start >= sectionStartBeat && n.start < sectionEndBeat
              );
              newTracks[trackIdx].notes.push(...sectionNotes);
            }
          }
        });
      });

      onRegenerate(newTracks);
      toast.success('Regenerated selected sections');
    } catch (error) {
      toast.error('Regeneration failed');
    }

    setRegenerating(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Selective Regen
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)]">
        <DialogHeader>
          <DialogTitle>Regenerate Sections</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Select Sections</Label>
            <div className="mt-2 space-y-2">
              {structure.map((section, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Checkbox
                    id={`section-${idx}`}
                    checked={selectedSections.includes(idx)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSections([...selectedSections, idx]);
                      } else {
                        setSelectedSections(selectedSections.filter(i => i !== idx));
                      }
                    }}
                  />
                  <Label htmlFor={`section-${idx}`} className="cursor-pointer capitalize">
                    {section.name} ({section.bars} bars)
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label>Select Tracks</Label>
            <div className="mt-2 space-y-2">
              {tracks.map((track) => (
                <div key={track.id} className="flex items-center gap-2">
                  <Checkbox
                    id={`track-${track.id}`}
                    checked={selectedTracks.includes(track.type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedTracks([...selectedTracks, track.type]);
                      } else {
                        setSelectedTracks(selectedTracks.filter(t => t !== track.type));
                      }
                    }}
                  />
                  <Label htmlFor={`track-${track.id}`} className="cursor-pointer">
                    {track.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleRegenerate}
            disabled={regenerating || selectedSections.length === 0 || selectedTracks.length === 0}
            className="w-full bg-gradient-to-r from-[var(--violet)] to-[var(--mint)] text-white"
          >
            <Zap className="w-4 h-4 mr-2" />
            {regenerating ? 'Regenerating...' : 'Regenerate Selected'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}