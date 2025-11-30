import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Search, Play, Plus, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SAMPLE_PACKS = {
  drums: [
    { id: '808-kick', name: '808 Kick', url: 'https://tonejs.github.io/audio/drum-samples/CR78/kick.mp3', category: '808s', bpm: null },
    { id: '808-snare', name: '808 Snare', url: 'https://tonejs.github.io/audio/drum-samples/CR78/snare.mp3', category: '808s', bpm: null },
    { id: '808-hihat', name: '808 Hi-Hat', url: 'https://tonejs.github.io/audio/drum-samples/CR78/hihat.mp3', category: '808s', bpm: null },
    { id: '808-clap', name: '808 Clap', url: 'https://tonejs.github.io/audio/drum-samples/CR78/clap.mp3', category: '808s', bpm: null },
  ],
  loops: [
    { id: 'trap-loop-1', name: 'Trap Beat 140', url: 'https://tonejs.github.io/audio/drum-samples/breakbeat.mp3', category: 'Trap', bpm: 140 },
    { id: 'lofi-loop-1', name: 'LoFi Drums 85', url: 'https://tonejs.github.io/audio/drum-samples/breakbeat.mp3', category: 'LoFi', bpm: 85 },
  ],
  vocals: [
    { id: 'vocal-chop-1', name: 'Vocal Chop 1', url: 'https://tonejs.github.io/audio/berklee/gong_1.mp3', category: 'Chops', bpm: null },
  ]
};

export default function SampleLibrary({ onSampleSelect, onAddToTrack }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [playing, setPlaying] = useState(null);

  const allSamples = [
    ...SAMPLE_PACKS.drums,
    ...SAMPLE_PACKS.loops,
    ...SAMPLE_PACKS.vocals
  ];

  const filteredSamples = allSamples.filter(sample => {
    const matchesSearch = sample.name.toLowerCase().includes(search.toLowerCase()) ||
                         sample.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'all' || sample.category === category;
    return matchesSearch && matchesCategory;
  });

  const previewSample = async (sample) => {
    if (playing === sample.id) {
      // Stop preview
      setPlaying(null);
      return;
    }

    try {
      const audio = new Audio(sample.url);
      audio.volume = 0.5;
      audio.play();
      setPlaying(sample.id);
      
      audio.onended = () => setPlaying(null);
    } catch (error) {
      toast.error('Failed to preview sample');
    }
  };

  const handleDragStart = (e, sample) => {
    e.dataTransfer.setData('sample', JSON.stringify(sample));
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search samples..."
            className="pl-10 bg-[var(--surface)] border-[var(--hair)]"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['all', '808s', 'Trap', 'LoFi', 'Chops'].map(cat => (
          <Button
            key={cat}
            variant={category === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategory(cat)}
            className="text-xs"
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
        {filteredSamples.map(sample => (
          <div
            key={sample.id}
            draggable
            onDragStart={(e) => handleDragStart(e, sample)}
            className={cn(
              "p-3 rounded-lg border border-[var(--hair)] bg-[var(--surface)] cursor-grab active:cursor-grabbing",
              "hover:border-[var(--mint)] hover:bg-[var(--surface-2)] transition-all group"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold truncate">{sample.name}</h4>
                <p className="text-xs text-[var(--muted)]">{sample.category}</p>
                {sample.bpm && (
                  <span className="text-xs text-[var(--mint)]">{sample.bpm} BPM</span>
                )}
              </div>
              <Music className="w-4 h-4 text-[var(--muted)] group-hover:text-[var(--mint)]" />
            </div>
            
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => previewSample(sample)}
                className="flex-1 h-7 text-xs"
              >
                <Play className={cn("w-3 h-3 mr-1", playing === sample.id && "text-[var(--mint)]")} />
                {playing === sample.id ? 'Stop' : 'Preview'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onAddToTrack?.(sample)}
                className="h-7 px-2"
                title="Add to timeline"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredSamples.length === 0 && (
        <div className="text-center py-8 text-[var(--muted)]">
          <Music className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No samples found</p>
        </div>
      )}
    </div>
  );
}