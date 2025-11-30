import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";

const TRACK_COLORS = [
  { name: 'Mint', value: '#3EF3AF' },
  { name: 'Purple', value: '#7C61FF' },
  { name: 'Cyan', value: '#7DF1FF' },
  { name: 'Red', value: '#FF6B6B' },
  { name: 'Yellow', value: '#FFD93D' },
  { name: 'Pink', value: '#FF8A8A' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Green', value: '#16DB93' },
  { name: 'Blue', value: '#4A90E2' },
  { name: 'Lavender', value: '#B18CFF' }
];

export default function TrackColors({ currentColor, onColorChange }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Palette 
            className="w-3 h-3" 
            style={{ color: currentColor }}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2 bg-[var(--surface)] border-[var(--line)]">
        <div className="grid grid-cols-5 gap-2">
          {TRACK_COLORS.map(color => (
            <button
              key={color.value}
              onClick={() => onColorChange(color.value)}
              className="w-6 h-6 rounded-full border-2 border-[var(--hair)] hover:scale-110 transition-transform"
              style={{ 
                backgroundColor: color.value,
                boxShadow: currentColor === color.value ? `0 0 0 2px var(--mint)` : 'none'
              }}
              title={color.name}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}