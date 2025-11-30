import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Grid3x3, Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const DRUM_SOUNDS = [
  { name: 'Kick', pitch: 36, color: '#FF6B6B' },
  { name: 'Snare', pitch: 38, color: '#FFD93D' },
  { name: 'Clap', pitch: 39, color: '#FF8A8A' },
  { name: 'Hi-Hat C', pitch: 42, color: '#7DF1FF' },
  { name: 'Hi-Hat O', pitch: 46, color: '#7C61FF' },
  { name: 'Crash', pitch: 49, color: '#B18CFF' },
  { name: 'Rim', pitch: 37, color: '#16DB93' },
  { name: 'Tom', pitch: 41, color: '#FFA500' }
];

export default function StepSequencer({ onApplyPattern, bpm }) {
  const [steps] = useState(16);
  const [pattern, setPattern] = useState(
    DRUM_SOUNDS.map(() => Array(16).fill(false))
  );
  const [velocities, setVelocities] = useState(
    DRUM_SOUNDS.map(() => Array(16).fill(100))
  );

  const toggleStep = (soundIdx, stepIdx) => {
    const newPattern = [...pattern];
    newPattern[soundIdx][stepIdx] = !newPattern[soundIdx][stepIdx];
    setPattern(newPattern);
  };

  const setVelocity = (soundIdx, stepIdx, velocity) => {
    const newVelocities = [...velocities];
    newVelocities[soundIdx][stepIdx] = velocity;
    setVelocities(newVelocities);
  };

  const clearPattern = () => {
    setPattern(DRUM_SOUNDS.map(() => Array(16).fill(false)));
    toast.info('Pattern cleared');
  };

  const generatePattern = () => {
    const notes = [];
    const beatDuration = 4 / steps; // 4 beats divided by number of steps

    pattern.forEach((soundPattern, soundIdx) => {
      soundPattern.forEach((active, stepIdx) => {
        if (active) {
          notes.push({
            pitch: DRUM_SOUNDS[soundIdx].pitch,
            start: stepIdx * beatDuration,
            duration: beatDuration * 0.8,
            velocity: velocities[soundIdx][stepIdx]
          });
        }
      });
    });

    onApplyPattern?.(notes);
    toast.success(`Applied ${notes.length} step sequencer notes!`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Grid3x3 className="w-4 h-4" />
          Step Sequencer
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Step Sequencer - Drum Pattern</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Grid */}
          <div className="space-y-2">
            {DRUM_SOUNDS.map((sound, soundIdx) => (
              <div key={sound.name} className="flex items-center gap-2">
                <div
                  className="w-20 text-xs font-semibold px-2 py-1 rounded"
                  style={{ backgroundColor: `${sound.color}20`, color: sound.color }}
                >
                  {sound.name}
                </div>
                
                <div className="flex gap-1 flex-1">
                  {Array.from({ length: steps }).map((_, stepIdx) => {
                    const isActive = pattern[soundIdx][stepIdx];
                    const is4thBeat = stepIdx % 4 === 0;
                    
                    return (
                      <button
                        key={stepIdx}
                        onClick={() => toggleStep(soundIdx, stepIdx)}
                        onContextMenu={(e) => {
                          e.preventDefault();
                          if (isActive) {
                            const newVel = velocities[soundIdx][stepIdx] === 127 ? 80 : 127;
                            setVelocity(soundIdx, stepIdx, newVel);
                          }
                        }}
                        className={cn(
                          "flex-1 h-8 rounded transition-all",
                          isActive 
                            ? "shadow-lg" 
                            : "bg-[var(--surface-2)] hover:bg-[var(--hover)]",
                          is4thBeat && "border-l-2 border-[var(--hair)]"
                        )}
                        style={{
                          backgroundColor: isActive ? sound.color : undefined,
                          opacity: isActive ? velocities[soundIdx][stepIdx] / 127 : 1
                        }}
                        title={`Step ${stepIdx + 1} - ${isActive ? `Velocity: ${velocities[soundIdx][stepIdx]}` : 'Off'}`}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="text-xs text-[var(--muted)] text-center">
            Click to toggle • Right-click active steps to change velocity
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={clearPattern}
              variant="outline"
              className="flex-1 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear
            </Button>
            <Button
              onClick={generatePattern}
              className="flex-1 gap-2 bg-[var(--mint)] text-black"
            >
              <Play className="w-4 h-4" />
              Apply Pattern
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}