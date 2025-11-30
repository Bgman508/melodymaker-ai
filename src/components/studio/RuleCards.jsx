import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Heart, Film, Zap, Coffee, Moon } from "lucide-react";

export default function RuleCards({ onApplyRule }) {
  const rules = [
    {
      id: 'pop-hook',
      name: 'Pop Hook Writer',
      icon: Heart,
      prompt: 'energetic, key C major, 8 bars, structure: hook(8), high energy, add9, tight, export stems',
      color: 'from-pink-500 to-rose-500',
      description: 'Catchy, radio-ready hooks'
    },
    {
      id: 'neo-soul',
      name: 'Neo-Soul Reharm',
      icon: Coffee,
      prompt: 'r&b, 85 bpm, key D minor, 16 bars, add9, sus2, 7, medium energy, lofi humanize, swing 58, export stems',
      color: 'from-amber-500 to-orange-500',
      description: 'Sophisticated jazz-influenced R&B'
    },
    {
      id: 'cinematic',
      name: 'Cinematic Pedal Tones',
      icon: Film,
      prompt: 'epic, key A minor, 12 bars, structure: intro(4), build(8), low energy rising to high, no drums, add9, 11, export stems',
      color: 'from-purple-500 to-indigo-500',
      description: 'Tension-building film scores'
    },
    {
      id: 'trap-808',
      name: 'Trap 808 Slides',
      icon: Zap,
      prompt: 'trap, 140 bpm, key F# minor, 8 bars, 808 slides, glide depth 7000, glide steps 12, high energy, export stems',
      color: 'from-red-500 to-pink-500',
      description: 'Modern trap with gliding bass'
    },
    {
      id: 'afro',
      name: 'Afrobeats 3-3-2',
      icon: Sparkles,
      prompt: 'afrobeats, 120 bpm, key G major, 16 bars, high energy, busy, swing 50, export stems',
      color: 'from-green-500 to-teal-500',
      description: 'Authentic African rhythms'
    },
    {
      id: 'lofi-chill',
      name: 'Lo-Fi Chill',
      icon: Moon,
      prompt: 'lofi, 85 bpm, key A minor, 12 bars, sparse, low energy, swing 58, drunk_lofi, export stems',
      color: 'from-blue-500 to-cyan-500',
      description: 'Laid-back study beats'
    }
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-slate-400 mb-3">Quick Rule Cards</h3>
          <div className="grid grid-cols-2 gap-2">
            {rules.map(rule => {
              const Icon = rule.icon;
              return (
                <Button
                  key={rule.id}
                  onClick={() => onApplyRule(rule.prompt)}
                  variant="outline"
                  className="h-auto p-3 border-slate-700 hover:border-slate-600 flex-col items-start gap-2 bg-slate-800/30"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${rule.color} flex items-center justify-center`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-white">{rule.name}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 text-left leading-tight">
                    {rule.description}
                  </p>
                </Button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}