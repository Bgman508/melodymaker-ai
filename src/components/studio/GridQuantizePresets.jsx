import React from 'react';
import { Button } from "@/components/ui/button";

const GRID_PRESETS = [
  { label: '1/4', value: '1', icon: '━' },
  { label: '1/8', value: '0.5', icon: '╺╸' },
  { label: '1/16', value: '0.25', icon: '┅' },
  { label: '1/32', value: '0.125', icon: '┈' },
  { label: '1/8T', value: '0.333', icon: '⚏' },
  { label: '1/16T', value: '0.166', icon: '⚎' }
];

export default function GridQuantizePresets({ value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-[var(--muted)]">Grid Snap</label>
      <div className="grid grid-cols-3 gap-2">
        {GRID_PRESETS.map(preset => (
          <Button
            key={preset.value}
            variant={value === preset.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(preset.value)}
            className="h-8 text-xs font-mono"
          >
            <span className="mr-1">{preset.icon}</span>
            {preset.label}
          </Button>
        ))}
      </div>
    </div>
  );
}