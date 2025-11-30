import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid3x3 } from "lucide-react";

export default function GridSnap({ value, onChange }) {
  const snapOptions = [
    { value: 'off', label: 'Off' },
    { value: '1', label: '1 Bar' },
    { value: '0.5', label: '1/2' },
    { value: '0.25', label: '1/4' },
    { value: '0.125', label: '1/8' },
    { value: '0.0625', label: '1/16' },
    { value: '0.03125', label: '1/32' },
  ];

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
      <Grid3x3 className="w-4 h-4 text-[var(--muted)]" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-24 h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {snapOptions.map(opt => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}