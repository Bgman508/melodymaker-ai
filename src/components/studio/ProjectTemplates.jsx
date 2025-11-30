import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FileText, Music, Zap, Heart, Coffee } from "lucide-react";
import { motion } from "framer-motion";

const TEMPLATES = [
  {
    id: 'trap-beat',
    name: 'Trap Beat',
    description: 'Hard-hitting 808s, trap hi-hats, dark melody',
    icon: Zap,
    prompt: 'trap beat, 140 bpm, F# minor, intro (4), verse (8), hook (8) with 808 slides',
    gradient: 'from-[var(--violet)] to-[var(--ice)]'
  },
  {
    id: 'lofi-study',
    name: 'Lo-fi Study',
    description: 'Chill chords, jazzy melody, relaxed drums',
    icon: Coffee,
    prompt: 'lofi hip hop, 85 bpm, C major, 58% swing, EP1, lo-fi kit, intro (4), verse (16)',
    gradient: 'from-[var(--mint)] to-[var(--ice)]'
  },
  {
    id: 'rnb-ballad',
    name: 'R&B Ballad',
    description: 'Smooth chords, emotional melody, soft groove',
    icon: Heart,
    prompt: 'r&b soul, 72 bpm, A minor, strings, add9 chords, intro (4), verse (8), hook (8)',
    gradient: 'from-[var(--coral)] to-[var(--violet)]'
  },
  {
    id: 'afrobeats',
    name: 'Afrobeats',
    description: '3-3-2 rhythm, bright synths, infectious groove',
    icon: Music,
    prompt: 'afrobeats, 110 bpm, E minor, 3-3-2 pattern, intro (4), verse (8), hook (8)',
    gradient: 'from-[var(--mint)] to-[var(--coral)]'
  }
];

export default function ProjectTemplates({ onSelectTemplate }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          Templates
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-3xl">
        <DialogHeader>
          <DialogTitle>Project Templates</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {TEMPLATES.map((template, idx) => {
            const Icon = template.icon;
            return (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => onSelectTemplate(template.prompt)}
                className="p-6 rounded-2xl border-2 border-[var(--hair)] hover:border-[var(--mint)] transition-all text-left group"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${template.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-2">{template.name}</h3>
                <p className="text-sm text-[var(--muted)]">{template.description}</p>
              </motion.button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}