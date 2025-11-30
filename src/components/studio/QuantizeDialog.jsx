import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Grid3x3, Zap } from "lucide-react";
import { toast } from "sonner";

export default function QuantizeDialog({ selectedTrack, onQuantize }) {
  const [gridValue, setGridValue] = useState(0.25); // 1/16
  const [strength, setStrength] = useState(100);
  const [swing, setSwing] = useState(0);

  const gridPresets = [
    { label: '1/4', value: 1 },
    { label: '1/8', value: 0.5 },
    { label: '1/16', value: 0.25 },
    { label: '1/32', value: 0.125 },
    { label: '1/8T', value: 0.333 },
    { label: '1/16T', value: 0.166 }
  ];

  const applyQuantize = () => {
    if (!selectedTrack) {
      toast.error('No track selected');
      return;
    }

    const quantizedTrack = {
      ...selectedTrack,
      notes: selectedTrack.notes.map(note => {
        const targetBeat = Math.round(note.start / gridValue) * gridValue;
        const offset = targetBeat - note.start;
        const adjustedOffset = offset * (strength / 100);
        
        let finalStart = note.start + adjustedOffset;
        
        // Apply swing
        if (swing > 0) {
          const beatPosition = Math.floor(finalStart / gridValue);
          if (beatPosition % 2 === 1) { // Every other note
            finalStart += (gridValue * swing) / 200;
          }
        }
        
        return {
          ...note,
          start: Math.max(0, finalStart)
        };
      })
    };

    onQuantize?.(quantizedTrack);
    toast.success('Track quantized!');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2" disabled={!selectedTrack}>
          <Grid3x3 className="w-4 h-4" />
          Quantize
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
        <DialogHeader>
          <DialogTitle>Quantize Notes</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Grid Presets */}
          <div>
            <label className="text-sm font-semibold mb-3 block">Grid Size</label>
            <div className="grid grid-cols-3 gap-2">
              {gridPresets.map(preset => (
                <Button
                  key={preset.value}
                  variant={gridValue === preset.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setGridValue(preset.value)}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Strength */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold">Strength</label>
              <span className="text-xs text-[var(--muted)]">{strength}%</span>
            </div>
            <Slider
              value={[strength]}
              onValueChange={(val) => setStrength(val[0])}
              max={100}
              step={1}
            />
            <p className="text-xs text-[var(--muted)] mt-1">
              100% = perfect quantize, 0% = no change
            </p>
          </div>

          {/* Swing */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-semibold">Swing</label>
              <span className="text-xs text-[var(--muted)]">{swing}%</span>
            </div>
            <Slider
              value={[swing]}
              onValueChange={(val) => setSwing(val[0])}
              max={100}
              step={1}
            />
            <p className="text-xs text-[var(--muted)] mt-1">
              Delays every other note for groove
            </p>
          </div>

          {/* Preview Info */}
          {selectedTrack && (
            <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
              <p className="text-xs text-[var(--muted)]">
                Will quantize <span className="text-[var(--text)] font-semibold">{selectedTrack.notes.length} notes</span> in {selectedTrack.name}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button onClick={applyQuantize} className="flex-1 gap-2 bg-[var(--mint)] text-black">
              <Zap className="w-4 h-4" />
              Apply Quantize
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}