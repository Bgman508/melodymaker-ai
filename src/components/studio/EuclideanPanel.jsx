import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EuclideanRhythm } from "../engine/euclidean";
import { Grid3x3 } from "lucide-react";
import { toast } from "sonner";

export default function EuclideanPanel({ onApplyRhythm }) {
  const [pulses, setPulses] = useState(5);
  const [steps, setSteps] = useState(8);
  const [rotation, setRotation] = useState(0);
  const [preset, setPreset] = useState('');

  const euclidean = new EuclideanRhythm();

  const generateRhythm = () => {
    let pattern = preset 
      ? euclidean.getNamedPattern(preset)
      : euclidean.generate(pulses, steps);

    if (rotation > 0) {
      pattern = euclidean.rotate(pattern, rotation);
    }

    const visualization = euclidean.visualize(pattern);
    
    const notes = euclidean.applyToTrack(pattern, 0, 120, 42); // Hi-hat
    
    onApplyRhythm(notes);
    toast.success(`Applied pattern: ${visualization}`);
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Grid3x3 className="w-4 h-4 text-[var(--mint)]" />
          Euclidean Rhythms
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs text-[var(--muted)]">Preset Patterns</Label>
          <Select value={preset} onValueChange={setPreset}>
            <SelectTrigger>
              <SelectValue placeholder="Custom" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={null}>Custom</SelectItem>
              <SelectItem value="tresillo">Tresillo (3,8)</SelectItem>
              <SelectItem value="cinquillo">Cinquillo (5,8)</SelectItem>
              <SelectItem value="bossa-nova">Bossa Nova (5,16)</SelectItem>
              <SelectItem value="west-african">West African (7,16)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {!preset && (
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs text-[var(--muted)]">Pulses</Label>
              <Input
                type="number"
                value={pulses}
                onChange={(e) => setPulses(parseInt(e.target.value))}
                min={1}
                max={16}
              />
            </div>
            <div>
              <Label className="text-xs text-[var(--muted)]">Steps</Label>
              <Input
                type="number"
                value={steps}
                onChange={(e) => setSteps(parseInt(e.target.value))}
                min={pulses}
                max={32}
              />
            </div>
          </div>
        )}

        <div>
          <Label className="text-xs text-[var(--muted)]">Rotation</Label>
          <Input
            type="number"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            min={0}
            max={steps - 1}
          />
        </div>

        <Button
          onClick={generateRhythm}
          className="w-full bg-gradient-to-r from-[var(--mint)] to-[var(--ice)] text-black"
        >
          Apply Rhythm
        </Button>

        <div className="text-xs text-[var(--muted)] space-y-1">
          <p>• Mathematically distributed rhythms</p>
          <p>• Used in African, Latin, & electronic music</p>
        </div>
      </div>
    </div>
  );
}