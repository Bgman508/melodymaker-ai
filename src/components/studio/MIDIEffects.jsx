import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Wand2, Play } from "lucide-react";
import { toast } from "sonner";

export default function MIDIEffects({ track, onUpdateTrack }) {
  const [chordEnabled, setChordEnabled] = useState(false);
  const [chordType, setChordType] = useState('major');
  const [randomEnabled, setRandomEnabled] = useState(false);
  const [randomAmount, setRandomAmount] = useState(10);
  const [scaleEnabled, setScaleEnabled] = useState(false);
  const [scale, setScale] = useState('major');
  const [rootNote, setRootNote] = useState('C');

  const CHORD_TYPES = [
    { value: 'major', label: 'Major', intervals: [0, 4, 7] },
    { value: 'minor', label: 'Minor', intervals: [0, 3, 7] },
    { value: 'sus2', label: 'Sus2', intervals: [0, 2, 7] },
    { value: 'sus4', label: 'Sus4', intervals: [0, 5, 7] },
    { value: 'major7', label: 'Major 7', intervals: [0, 4, 7, 11] },
    { value: 'minor7', label: 'Minor 7', intervals: [0, 3, 7, 10] },
    { value: 'dom7', label: 'Dominant 7', intervals: [0, 4, 7, 10] }
  ];

  const SCALES = {
    major: [0, 2, 4, 5, 7, 9, 11],
    minor: [0, 2, 3, 5, 7, 8, 10],
    pentatonic: [0, 2, 4, 7, 9],
    blues: [0, 3, 5, 6, 7, 10]
  };

  const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const applyEffects = () => {
    if (!track || !track.notes) {
      toast.error('No notes to process');
      return;
    }

    let processedNotes = [...track.notes];

    // Apply chord effect
    if (chordEnabled) {
      const chordIntervals = CHORD_TYPES.find(c => c.value === chordType)?.intervals || [0, 4, 7];
      const chordNotes = [];
      
      processedNotes.forEach(note => {
        chordIntervals.forEach(interval => {
          chordNotes.push({
            ...note,
            pitch: note.pitch + interval
          });
        });
      });
      
      processedNotes = chordNotes;
    }

    // Apply scale quantization
    if (scaleEnabled) {
      const rootPitch = NOTES.indexOf(rootNote);
      const scaleIntervals = SCALES[scale];
      
      processedNotes = processedNotes.map(note => {
        const relativePitch = (note.pitch - rootPitch) % 12;
        let closestInterval = scaleIntervals[0];
        let minDist = Math.abs(relativePitch - closestInterval);
        
        scaleIntervals.forEach(interval => {
          const dist = Math.abs(relativePitch - interval);
          if (dist < minDist) {
            minDist = dist;
            closestInterval = interval;
          }
        });
        
        const octave = Math.floor((note.pitch - rootPitch) / 12);
        return {
          ...note,
          pitch: rootPitch + (octave * 12) + closestInterval
        };
      });
    }

    // Apply randomization
    if (randomEnabled) {
      processedNotes = processedNotes.map(note => ({
        ...note,
        velocity: Math.max(1, Math.min(127, 
          note.velocity + ((Math.random() - 0.5) * randomAmount)
        )),
        start: note.start + ((Math.random() - 0.5) * 0.05 * (randomAmount / 20))
      }));
    }

    onUpdateTrack?.(track.id, { notes: processedNotes });
    toast.success('MIDI effects applied!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Wand2 className="w-4 h-4" />
          MIDI FX
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>MIDI Effects</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Chord Generator */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Chord Generator</Label>
              <Switch checked={chordEnabled} onCheckedChange={setChordEnabled} />
            </div>
            
            {chordEnabled && (
              <Select value={chordType} onValueChange={setChordType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CHORD_TYPES.map(c => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Scale Quantizer */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Scale Quantizer</Label>
              <Switch checked={scaleEnabled} onCheckedChange={setScaleEnabled} />
            </div>
            
            {scaleEnabled && (
              <div className="flex gap-2">
                <Select value={rootNote} onValueChange={setRootNote}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {NOTES.map(note => (
                      <SelectItem key={note} value={note}>{note}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={scale} onValueChange={setScale}>
                  <SelectTrigger className="flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="major">Major</SelectItem>
                    <SelectItem value="minor">Minor</SelectItem>
                    <SelectItem value="pentatonic">Pentatonic</SelectItem>
                    <SelectItem value="blues">Blues</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Randomizer */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <Label className="font-semibold">Humanize/Randomize</Label>
              <Switch checked={randomEnabled} onCheckedChange={setRandomEnabled} />
            </div>
            
            {randomEnabled && (
              <div>
                <Label className="text-sm mb-2 block">Amount: {randomAmount}%</Label>
                <Slider
                  value={[randomAmount]}
                  onValueChange={(val) => setRandomAmount(val[0])}
                  max={50}
                  min={0}
                />
              </div>
            )}
          </div>

          {/* Apply Button */}
          <Button
            onClick={applyEffects}
            disabled={!track || (!chordEnabled && !scaleEnabled && !randomEnabled)}
            className="w-full gap-2 bg-[var(--mint)] text-black"
          >
            <Play className="w-4 h-4" />
            Apply MIDI Effects
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}