import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Layers, Music, Drum, Waves, Sparkles } from "lucide-react";
import { toast } from "sonner";

const TRACK_TEMPLATES = [
  {
    id: 'lead-synth',
    name: 'Lead Synth',
    icon: Sparkles,
    color: '#3EF3AF',
    type: 'lead',
    program: 81, // Sawtooth Lead
    description: 'Bright synth lead'
  },
  {
    id: 'pad',
    name: 'Pad',
    icon: Waves,
    color: '#7C61FF',
    type: 'pad',
    program: 88, // New Age Pad
    description: 'Atmospheric pad'
  },
  {
    id: 'bass',
    name: 'Sub Bass',
    icon: Waves,
    color: '#7DF1FF',
    type: 'bass',
    program: 38, // Synth Bass 1
    description: 'Deep sub bass'
  },
  {
    id: 'pluck',
    name: 'Pluck',
    icon: Music,
    color: '#FFD93D',
    type: 'arp',
    program: 80, // Square Lead
    description: 'Short plucky sound'
  },
  {
    id: 'strings',
    name: 'Strings',
    icon: Music,
    color: '#FF8A8A',
    type: 'chords',
    program: 48, // String Ensemble
    description: 'Orchestral strings'
  },
  {
    id: 'piano',
    name: 'Piano',
    icon: Music,
    color: '#B18CFF',
    type: 'chords',
    program: 0, // Acoustic Grand Piano
    description: 'Acoustic piano'
  },
  {
    id: 'epiano',
    name: 'Electric Piano',
    icon: Music,
    color: '#4A90E2',
    type: 'melody',
    program: 4, // EP1 Rhodes
    description: 'Vintage electric piano'
  },
  {
    id: 'brass',
    name: 'Brass Section',
    icon: Music,
    color: '#FFA500',
    type: 'chords',
    program: 61, // Brass Section
    description: 'Bold brass'
  },
  {
    id: 'drums',
    name: 'Drum Kit',
    icon: Drum,
    color: '#FF6B6B',
    type: 'drums',
    program: 0,
    description: 'Standard drum kit'
  }
];

export default function TrackTemplates({ onApplyTemplate }) {
  const applyTemplate = (template) => {
    const newTrack = {
      type: template.type,
      name: template.name,
      program: template.program,
      volume: 0.75,
      pan: 0,
      muted: false,
      solo: false,
      color: template.color,
      count: 1
    };

    onApplyTemplate?.(newTrack);
    toast.success(`Added ${template.name} track!`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Layers className="w-4 h-4" />
          Templates
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Track Templates</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Quick-start with pre-configured track templates
          </p>

          <div className="grid grid-cols-2 gap-3">
            {TRACK_TEMPLATES.map(template => {
              const Icon = template.icon;
              return (
                <button
                  key={template.id}
                  onClick={() => applyTemplate(template)}
                  className="p-4 rounded-lg border border-[var(--hair)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-all text-left group"
                  style={{ borderLeftColor: template.color, borderLeftWidth: '4px' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: `${template.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: template.color }} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{template.name}</h3>
                      <p className="text-xs text-[var(--muted)]">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}