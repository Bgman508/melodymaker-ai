import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const SCALES = [
  'major', 'minor', 'dorian', 'phrygian', 'lydian', 'mixolydian', 
  'harmonic_minor', 'melodic_minor', 'pentatonic_major', 'pentatonic_minor', 
  'blues', 'whole_tone', 'chromatic'
];

const KEYS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export default function ScaleHighlight({ onScaleChange }) {
  const [enabled, setEnabled] = useState(false);
  const [key, setKey] = useState('C');
  const [scale, setScale] = useState('major');

  const handleChange = () => {
    if (enabled) {
      onScaleChange?.({ key, scale });
    } else {
      onScaleChange?.(null);
    }
  };

  return (
    <div className="space-y-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Scale Highlight</Label>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => {
            setEnabled(checked);
            if (checked) {
              onScaleChange?.({ key, scale });
            } else {
              onScaleChange?.(null);
            }
          }}
        />
      </div>

      {enabled && (
        <div className="flex gap-2">
          <Select value={key} onValueChange={(val) => { setKey(val); handleChange(); }}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {KEYS.map(k => (
                <SelectItem key={k} value={k}>{k}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={scale} onValueChange={(val) => { setScale(val); handleChange(); }}>
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SCALES.map(s => (
                <SelectItem key={s} value={s}>
                  {s.replace(/_/g, ' ')}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}