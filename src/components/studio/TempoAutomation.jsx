import React, { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function TempoAutomation({ structure, baseBpm, onChange }) {
  const [tempoMap, setTempoMap] = useState(
    structure.map(() => baseBpm)
  );

  const handleTempoChange = (idx, newTempo) => {
    const updated = [...tempoMap];
    updated[idx] = newTempo;
    setTempoMap(updated);
    onChange(updated);
  };

  const applyRitardando = () => {
    const updated = tempoMap.map((_, idx) => 
      Math.round(baseBpm * (1 - (idx / structure.length) * 0.2))
    );
    setTempoMap(updated);
    onChange(updated);
  };

  const applyAccelerando = () => {
    const updated = tempoMap.map((_, idx) => 
      Math.round(baseBpm * (1 + (idx / structure.length) * 0.2))
    );
    setTempoMap(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={applyRitardando}
          className="flex-1"
        >
          <TrendingDown className="w-4 h-4 mr-2" />
          Slow Down
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={applyAccelerando}
          className="flex-1"
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Speed Up
        </Button>
      </div>

      <div className="space-y-3">
        {structure.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-[var(--muted)] capitalize">{section.name}</span>
              <span className="font-mono">{tempoMap[idx]} BPM</span>
            </div>
            <Slider
              value={[tempoMap[idx]]}
              onValueChange={(val) => handleTempoChange(idx, val[0])}
              min={60}
              max={200}
              step={1}
              className="w-full"
            />
          </div>
        ))}
      </div>
    </div>
  );
}