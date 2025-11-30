import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Zap, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function MacroControls({ tracks, onUpdateTrack, midiEngine }) {
  const [macros, setMacros] = useState([
    {
      id: 'energy',
      name: 'Energy',
      value: 50,
      affects: ['velocity', 'density', 'cutoff'],
      description: 'Overall energy/intensity'
    },
    {
      id: 'brightness',
      name: 'Brightness',
      value: 50,
      affects: ['cutoff', 'resonance'],
      description: 'High frequency content'
    },
    {
      id: 'width',
      name: 'Width',
      value: 50,
      affects: ['pan', 'stereo'],
      description: 'Stereo width'
    }
  ]);

  const updateMacro = (macroId, value) => {
    setMacros(prev => prev.map(m => 
      m.id === macroId ? { ...m, value } : m
    ));

    const macro = macros.find(m => m.id === macroId);
    if (!macro) return;

    // Apply macro changes to affected parameters
    const normalizedValue = value / 100;

    tracks.forEach(track => {
      const updates = {};

      if (macroId === 'energy') {
        // Affect velocity and other energy parameters
        const velocityMultiplier = 0.5 + (normalizedValue * 0.5); // 0.5 to 1.0
        updates.velocity = Math.round(track.velocity * velocityMultiplier);
      }

      if (macroId === 'brightness') {
        // Affect filter cutoff
        updates.cutoff = 200 + (normalizedValue * 10000); // 200Hz to 10kHz
      }

      if (macroId === 'width') {
        // Affect panning width
        const panAmount = (normalizedValue - 0.5) * 2; // -1 to 1
        updates.pan = panAmount * 0.5; // Scale down for subtlety
      }

      if (Object.keys(updates).length > 0) {
        onUpdateTrack?.(track.id, updates);
      }
    });

    toast.success(`${macro.name}: ${value}%`);
  };

  const addCustomMacro = () => {
    const newMacro = {
      id: `custom-${Date.now()}`,
      name: 'Custom Macro',
      value: 50,
      affects: [],
      description: 'Custom control'
    };
    setMacros(prev => [...prev, newMacro]);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="w-4 h-4" />
          Macros
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Macro Controls</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Control multiple parameters with single knobs
          </p>

          {/* Macro List */}
          <div className="space-y-4">
            {macros.map(macro => (
              <div
                key={macro.id}
                className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex-1">
                    <Input
                      value={macro.name}
                      onChange={(e) => {
                        setMacros(prev => prev.map(m =>
                          m.id === macro.id ? { ...m, name: e.target.value } : m
                        ));
                      }}
                      className="font-semibold bg-transparent border-none p-0 h-6"
                    />
                    <p className="text-xs text-[var(--muted)] mt-1">
                      {macro.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-[var(--mint)] w-12 text-right">
                      {macro.value}
                    </span>
                    {macro.id.startsWith('custom-') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setMacros(prev => prev.filter(m => m.id !== macro.id))}
                        className="h-8 w-8 p-0 text-[var(--coral)]"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Slider
                    value={[macro.value]}
                    onValueChange={(val) => updateMacro(macro.id, val[0])}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  
                  <div className="flex flex-wrap gap-1">
                    {macro.affects.map(param => (
                      <span
                        key={param}
                        className="text-xs px-2 py-1 rounded bg-[var(--mint)]/10 text-[var(--mint)] border border-[var(--mint)]/30"
                      >
                        {param}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Custom Macro */}
          <Button
            onClick={addCustomMacro}
            variant="outline"
            className="w-full gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom Macro
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}