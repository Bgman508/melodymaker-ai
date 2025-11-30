import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Repeat, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoopControls({ totalBeats, onLoopChange, currentLoop }) {
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [loopStart, setLoopStart] = useState(0);
  const [loopEnd, setLoopEnd] = useState(totalBeats);

  const toggleLoop = () => {
    const newEnabled = !loopEnabled;
    setLoopEnabled(newEnabled);
    onLoopChange?.(newEnabled ? { start: loopStart, end: loopEnd } : null);
  };

  const updateLoop = () => {
    if (loopEnabled && loopStart < loopEnd) {
      onLoopChange?.({ start: loopStart, end: loopEnd });
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
      <Button
        variant={loopEnabled ? "default" : "outline"}
        size="sm"
        onClick={toggleLoop}
        className={cn("gap-2", loopEnabled && "bg-[var(--mint)] text-black")}
      >
        <Repeat className="w-4 h-4" />
        Loop
      </Button>

      {loopEnabled && (
        <>
          <Input
            type="number"
            value={loopStart}
            onChange={(e) => setLoopStart(Math.max(0, parseInt(e.target.value) || 0))}
            onBlur={updateLoop}
            className="w-16 h-8 text-xs"
            min={0}
            max={loopEnd - 1}
          />
          <span className="text-xs text-[var(--muted)]">to</span>
          <Input
            type="number"
            value={loopEnd}
            onChange={(e) => setLoopEnd(Math.min(totalBeats, parseInt(e.target.value) || totalBeats))}
            onBlur={updateLoop}
            className="w-16 h-8 text-xs"
            min={loopStart + 1}
            max={totalBeats}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setLoopEnabled(false);
              onLoopChange?.(null);
            }}
          >
            <X className="w-3 h-3" />
          </Button>
        </>
      )}
    </div>
  );
}