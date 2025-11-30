import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Zap, Play } from "lucide-react";
import { toast } from "sonner";

const ARP_PATTERNS = [
  { value: 'up', label: 'Up' },
  { value: 'down', label: 'Down' },
  { value: 'updown', label: 'Up/Down' },
  { value: 'downup', label: 'Down/Up' },
  { value: 'random', label: 'Random' },
  { value: 'as-played', label: 'As Played' }
];

export default function Arpeggiator({ track, onUpdateTrack, totalBeats }) {
  const [enabled, setEnabled] = useState(false);
  const [pattern, setPattern] = useState('up');
  const [rate, setRate] = useState(0.25); // 16th notes
  const [octaves, setOctaves] = useState(1);
  const [gate, setGate] = useState(80); // Note length %

  const generateArp = () => {
    if (!track || !track.notes || track.notes.length === 0) {
      toast.error('No notes to arpeggiate');
      return;
    }

    // Get unique pitches from track
    const uniquePitches = [...new Set(track.notes.map(n => n.pitch))].sort((a, b) => a - b);
    
    // Expand pitches across octaves
    const arpPitches = [];
    for (let oct = 0; oct < octaves; oct++) {
      uniquePitches.forEach(pitch => {
        arpPitches.push(pitch + (oct * 12));
      });
    }

    // Apply pattern
    let orderedPitches = [...arpPitches];
    switch (pattern) {
      case 'down':
        orderedPitches.reverse();
        break;
      case 'updown':
        orderedPitches = [...arpPitches, ...arpPitches.slice().reverse()];
        break;
      case 'downup':
        orderedPitches = [...arpPitches.slice().reverse(), ...arpPitches];
        break;
      case 'random':
        orderedPitches = arpPitches.sort(() => Math.random() - 0.5);
        break;
    }

    // Generate arp notes
    const arpNotes = [];
    const noteDuration = rate * (gate / 100);
    let currentBeat = 0;
    let pitchIndex = 0;

    while (currentBeat < totalBeats) {
      arpNotes.push({
        pitch: orderedPitches[pitchIndex % orderedPitches.length],
        start: currentBeat,
        duration: noteDuration,
        velocity: 100
      });
      
      currentBeat += rate;
      pitchIndex++;
    }

    onUpdateTrack?.(track.id, { notes: arpNotes });
    toast.success(`Generated ${arpNotes.length} arp notes!`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="w-4 h-4" />
          Arpeggiator
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
        <DialogHeader>
          <DialogTitle>Arpeggiator</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label>Enable Arpeggiator</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && (
            <>
              <div>
                <Label className="text-sm mb-2 block">Pattern</Label>
                <Select value={pattern} onValueChange={setPattern}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ARP_PATTERNS.map(p => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2 block">
                  Rate: {rate === 1 ? '1/4' : rate === 0.5 ? '1/8' : rate === 0.25 ? '1/16' : '1/32'}
                </Label>
                <Select value={rate.toString()} onValueChange={(v) => setRate(parseFloat(v))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Quarter Notes (1/4)</SelectItem>
                    <SelectItem value="0.5">Eighth Notes (1/8)</SelectItem>
                    <SelectItem value="0.25">Sixteenth Notes (1/16)</SelectItem>
                    <SelectItem value="0.125">Thirty-second Notes (1/32)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm mb-2 block">Octaves: {octaves}</Label>
                <Slider
                  value={[octaves]}
                  onValueChange={(val) => setOctaves(val[0])}
                  min={1}
                  max={4}
                  step={1}
                />
              </div>

              <div>
                <Label className="text-sm mb-2 block">Gate: {gate}%</Label>
                <Slider
                  value={[gate]}
                  onValueChange={(val) => setGate(val[0])}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>

              <Button
                onClick={generateArp}
                disabled={!track}
                className="w-full gap-2 bg-[var(--mint)] text-black"
              >
                <Play className="w-4 h-4" />
                Generate Arpeggio
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}