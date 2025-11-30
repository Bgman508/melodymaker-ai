import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Zap, Activity } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function SmartTempo({ tracks, currentBpm, onTempoDetected, onApplyTempo }) {
  const [analyzing, setAnalyzing] = useState(false);
  const [detectedTempo, setDetectedTempo] = useState(null);
  const [tempoMode, setTempoMode] = useState('adapt'); // adapt, keep, auto

  const analyzeTempo = () => {
    if (!tracks || tracks.length === 0) {
      toast.error('No tracks to analyze');
      return;
    }

    setAnalyzing(true);

    // Simulate tempo detection from notes
    setTimeout(() => {
      // Calculate average note density to estimate tempo
      let totalNotes = 0;
      let totalDuration = 0;

      tracks.forEach(track => {
        if (track.notes && track.notes.length > 0) {
          totalNotes += track.notes.length;
          const maxBeat = Math.max(...track.notes.map(n => n.start + n.duration));
          totalDuration = Math.max(totalDuration, maxBeat);
        }
      });

      if (totalDuration === 0) {
        toast.error('No notes to analyze');
        setAnalyzing(false);
        return;
      }

      // Estimate tempo (rough calculation)
      const beatsPerNote = totalDuration / totalNotes;
      const estimatedBpm = Math.round(60 / (beatsPerNote * 0.5)); // Rough estimation
      
      // Clamp to reasonable range
      const clampedBpm = Math.max(60, Math.min(200, estimatedBpm));
      
      setDetectedTempo(clampedBpm);
      onTempoDetected?.(clampedBpm);
      setAnalyzing(false);
      
      toast.success(`Detected tempo: ${clampedBpm} BPM`);
    }, 1500);
  };

  const applyTempo = () => {
    if (!detectedTempo) {
      toast.error('No tempo detected yet');
      return;
    }

    onApplyTempo?.(detectedTempo, tempoMode);
    toast.success(`Applied tempo: ${detectedTempo} BPM`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Activity className="w-4 h-4" />
          Smart Tempo
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
        <DialogHeader>
          <DialogTitle>Smart Tempo Analysis</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Automatically detect and adapt tempo from your MIDI performance.
          </p>

          {/* Current BPM */}
          <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="text-xs text-[var(--muted)] mb-1">Current Project Tempo</div>
            <div className="text-2xl font-bold">{currentBpm} BPM</div>
          </div>

          {/* Analyze Button */}
          <Button
            onClick={analyzeTempo}
            disabled={analyzing}
            className="w-full gap-2"
          >
            <Zap className="w-4 h-4" />
            {analyzing ? 'Analyzing...' : 'Analyze Tempo'}
          </Button>

          {/* Detected Tempo */}
          {detectedTempo && (
            <div className="p-4 rounded-lg bg-[var(--mint)]/10 border border-[var(--mint)]">
              <div className="text-xs text-[var(--muted)] mb-1">Detected Tempo</div>
              <div className="text-2xl font-bold text-[var(--mint)]">{detectedTempo} BPM</div>
              <div className="text-xs text-[var(--muted)] mt-1">
                {Math.abs(detectedTempo - currentBpm)} BPM {detectedTempo > currentBpm ? 'faster' : 'slower'}
              </div>
            </div>
          )}

          {/* Tempo Mode */}
          {detectedTempo && (
            <>
              <div>
                <label className="text-sm font-semibold mb-2 block">Apply Mode</label>
                <Select value={tempoMode} onValueChange={setTempoMode}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="adapt">Adapt Project to Performance</SelectItem>
                    <SelectItem value="keep">Keep Current Tempo</SelectItem>
                    <SelectItem value="auto">Auto-Match</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[var(--muted)] mt-1">
                  {tempoMode === 'adapt' && 'Change project tempo to match performance'}
                  {tempoMode === 'keep' && 'Quantize performance to current tempo'}
                  {tempoMode === 'auto' && 'Automatically choose best option'}
                </p>
              </div>

              <Button
                onClick={applyTempo}
                className="w-full bg-[var(--mint)] text-black"
              >
                Apply Tempo
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}