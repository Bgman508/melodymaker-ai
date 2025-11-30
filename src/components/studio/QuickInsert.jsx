import React from 'react';
import { Button } from "@/components/ui/button";
import { Music2, Drum, Mic, Waves, Piano, Guitar } from "lucide-react";
import { toast } from "sonner";

export default function QuickInsert({ onInsert }) {
  const instruments = [
    { name: 'Piano', icon: Piano, type: 'melody', program: 0, color: '#3EF3AF' },
    { name: 'Synth Lead', icon: Waves, type: 'lead', program: 80, color: '#7C61FF' },
    { name: 'Bass', icon: Guitar, type: 'bass', program: 33, color: '#7DF1FF' },
    { name: 'Drums', icon: Drum, type: 'drums', program: 0, color: '#FF6B6B' },
    { name: 'Pad', icon: Music2, type: 'pad', program: 88, color: '#B18CFF' },
    { name: 'Vocal', icon: Mic, type: 'vocal', program: 52, color: '#FFD93D' },
  ];

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
      <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">Quick Insert</h3>
      
      <div className="grid grid-cols-2 gap-2">
        {instruments.map((inst) => {
          const Icon = inst.icon;
          return (
            <Button
              key={inst.name}
              onClick={() => {
                onInsert({
                  name: inst.name,
                  type: inst.type,
                  program: inst.program,
                  color: inst.color
                });
                toast.success(`Added ${inst.name} track`);
              }}
              variant="outline"
              className="h-auto py-3 flex-col gap-1 border-white/10 hover:border-white/30"
            >
              <Icon className="w-5 h-5" style={{ color: inst.color }} />
              <span className="text-[10px]">{inst.name}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}