import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TIME_SIGNATURES = [
  '2/4', '3/4', '4/4', '5/4', '6/8', '7/8', '9/8', '12/8'
];

export default function TimeSignature({ value = '4/4', onChange }) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-[var(--muted)] font-semibold">Time:</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-20 h-8 text-sm">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {TIME_SIGNATURES.map(sig => (
            <SelectItem key={sig} value={sig}>
              {sig}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}