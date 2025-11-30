import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AutomationEditor({ track, totalBeats, onUpdateTrack }) {
  const [automationType, setAutomationType] = useState('volume');
  const [automationPoints, setAutomationPoints] = useState([]);

  const automationTypes = [
    { value: 'volume', label: 'Volume' },
    { value: 'pan', label: 'Pan' },
    { value: 'cutoff', label: 'Filter Cutoff' },
    { value: 'resonance', label: 'Filter Resonance' },
    { value: 'reverb', label: 'Reverb Send' },
    { value: 'delay', label: 'Delay Send' }
  ];

  const addAutomationPoint = (beat, value) => {
    const newPoint = {
      id: Date.now(),
      beat,
      value,
      type: automationType
    };
    
    const updated = [...automationPoints, newPoint].sort((a, b) => a.beat - b.beat);
    setAutomationPoints(updated);
    
    // Store automation in track
    onUpdateTrack(track.id, {
      automation: {
        ...track.automation,
        [automationType]: updated
      }
    });
    
    toast.success(`Automation point added at beat ${beat}`);
  };

  const removeAutomationPoint = (id) => {
    const updated = automationPoints.filter(p => p.id !== id);
    setAutomationPoints(updated);
    
    onUpdateTrack(track.id, {
      automation: {
        ...track.automation,
        [automationType]: updated
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <TrendingUp className="w-4 h-4" />
          Automation
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-3xl">
        <DialogHeader>
          <DialogTitle>Automation: {track?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Automation Type Selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold">Parameter:</label>
            <Select value={automationType} onValueChange={setAutomationType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {automationTypes.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Automation Lane */}
          <div className="relative h-48 bg-[var(--bg)] rounded-lg border border-[var(--hair)] overflow-hidden">
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full">
              {/* Beat lines */}
              {Array.from({ length: totalBeats + 1 }).map((_, i) => (
                <line
                  key={i}
                  x1={`${(i / totalBeats) * 100}%`}
                  y1="0"
                  x2={`${(i / totalBeats) * 100}%`}
                  y2="100%"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}
              
              {/* Value lines */}
              {[0, 25, 50, 75, 100].map((val) => (
                <line
                  key={val}
                  x1="0"
                  y1={`${100 - val}%`}
                  x2="100%"
                  y2={`${100 - val}%`}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}

              {/* Automation curve */}
              {automationPoints.length > 1 && (
                <polyline
                  points={automationPoints
                    .map(p => `${(p.beat / totalBeats) * 100},${100 - p.value}`)
                    .join(' ')}
                  fill="none"
                  stroke="#3EF3AF"
                  strokeWidth="2"
                />
              )}

              {/* Automation points */}
              {automationPoints.map((point, idx) => (
                <circle
                  key={point.id}
                  cx={`${(point.beat / totalBeats) * 100}%`}
                  cy={`${100 - point.value}%`}
                  r="4"
                  fill="#3EF3AF"
                  stroke="#16DB93"
                  strokeWidth="2"
                  className="cursor-pointer hover:r-6"
                  onClick={() => removeAutomationPoint(point.id)}
                />
              ))}
            </svg>

            {/* Click to add points */}
            <div
              className="absolute inset-0 cursor-crosshair"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const beat = Math.round((x / rect.width) * totalBeats * 4) / 4; // Snap to 1/4 beat
                const value = Math.round((1 - y / rect.height) * 100);
                
                addAutomationPoint(beat, value);
              }}
            />
          </div>

          {/* Automation Points List */}
          <div className="max-h-32 overflow-y-auto space-y-1">
            {automationPoints.map((point, idx) => (
              <div
                key={point.id}
                className="flex items-center justify-between p-2 rounded bg-[var(--surface-2)] text-xs"
              >
                <span>Beat {point.beat.toFixed(2)}</span>
                <span>{point.value}%</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAutomationPoint(point.id)}
                  className="h-6 w-6 p-0 text-[var(--coral)]"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>

          <p className="text-xs text-[var(--muted)] text-center">
            Click on the lane to add automation points • Click points to remove them
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}