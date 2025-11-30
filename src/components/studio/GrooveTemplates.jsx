import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Music2 } from "lucide-react";
import { toast } from "sonner";

const GROOVE_TEMPLATES = [
  {
    id: 'straight',
    name: 'Straight 16ths',
    swing: 0.5,
    description: 'No swing, perfect timing',
    icon: '━━━━'
  },
  {
    id: 'light-swing',
    name: 'Light Swing',
    swing: 0.54,
    description: 'Subtle groove',
    icon: '━╸━╸'
  },
  {
    id: 'medium-swing',
    name: 'Medium Swing',
    swing: 0.58,
    description: 'Classic jazz/lofi feel',
    icon: '━━╸╸'
  },
  {
    id: 'heavy-swing',
    name: 'Heavy Swing',
    swing: 0.66,
    description: 'Triplet feel',
    icon: '━━━╸'
  },
  {
    id: 'shuffle',
    name: 'Shuffle',
    swing: 0.66,
    description: 'Blues shuffle',
    icon: '⚏━⚏━'
  },
  {
    id: 'drunk',
    name: 'Drunk/Loose',
    swing: 0.52,
    description: 'Humanized, imperfect',
    icon: '╺━╸━'
  },
  {
    id: 'trap',
    name: 'Trap Rolls',
    swing: 0.5,
    description: 'Hi-hat rolls',
    icon: '━┅┅┅'
  },
  {
    id: 'latin',
    name: 'Latin',
    swing: 0.58,
    description: 'Syncopated',
    icon: '╸━╸━'
  }
];

export default function GrooveTemplates({ onApplyGroove }) {
  const applyGroove = (groove) => {
    onApplyGroove?.(groove.id);
    toast.success(`Applied ${groove.name} groove!`, {
      description: groove.description
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 w-full">
          <Music2 className="w-4 h-4" />
          Groove Templates
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Groove Templates</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Apply timing grooves to your project
          </p>

          <div className="grid grid-cols-2 gap-3">
            {GROOVE_TEMPLATES.map(groove => (
              <button
                key={groove.id}
                onClick={() => applyGroove(groove)}
                className="p-4 rounded-lg border border-[var(--hair)] bg-[var(--surface-2)] hover:bg-[var(--surface-3)] transition-all text-left group"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--mint)]/10 flex items-center justify-center text-xl font-mono group-hover:scale-110 transition-transform">
                    {groove.icon}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{groove.name}</h3>
                    <p className="text-xs text-[var(--muted)]">
                      {groove.description}
                    </p>
                    <p className="text-xs text-[var(--mint)] mt-1">
                      Swing: {Math.round(groove.swing * 100)}%
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}