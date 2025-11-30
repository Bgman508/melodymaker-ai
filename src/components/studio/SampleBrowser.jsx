import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Music, Play, Pause, Download, Plus } from "lucide-react";
import { toast } from "sonner";

const SAMPLE_PACKS = {
  drums: [
    { id: 'kick-808', name: '808 Kick', category: 'Drums', url: 'https://cdn.freesound.org/previews/131/131660_2398403-lq.mp3', tags: ['bass', 'sub', 'kick'] },
    { id: 'snare-tight', name: 'Tight Snare', category: 'Drums', url: 'https://cdn.freesound.org/previews/387/387186_7255534-lq.mp3', tags: ['snare', 'tight'] },
    { id: 'hihat-closed', name: 'Closed Hi-Hat', category: 'Drums', url: 'https://cdn.freesound.org/previews/131/131657_2398403-lq.mp3', tags: ['hihat', 'closed'] },
    { id: 'clap', name: 'Clap', category: 'Drums', url: 'https://cdn.freesound.org/previews/270/270156_5123851-lq.mp3', tags: ['clap', 'percussion'] },
    { id: 'crash', name: 'Crash Cymbal', category: 'Drums', url: 'https://cdn.freesound.org/previews/415/415078_6043152-lq.mp3', tags: ['crash', 'cymbal'] },
  ],
  bass: [
    { id: 'bass-sub', name: 'Sub Bass', category: 'Bass', url: 'https://cdn.freesound.org/previews/456/456234_9234123-lq.mp3', tags: ['sub', 'deep', 'bass'] },
    { id: 'bass-pluck', name: 'Bass Pluck', category: 'Bass', url: 'https://cdn.freesound.org/previews/234/234567_1234567-lq.mp3', tags: ['pluck', 'short'] },
  ],
  synths: [
    { id: 'synth-lead', name: 'Synth Lead', category: 'Synth', url: 'https://cdn.freesound.org/previews/345/345678_2345678-lq.mp3', tags: ['lead', 'bright'] },
    { id: 'synth-pad', name: 'Ambient Pad', category: 'Synth', url: 'https://cdn.freesound.org/previews/456/456789_3456789-lq.mp3', tags: ['pad', 'ambient', 'smooth'] },
  ],
  fx: [
    { id: 'riser', name: 'Riser', category: 'FX', url: 'https://cdn.freesound.org/previews/341/341985_6043152-lq.mp3', tags: ['riser', 'fx', 'transition'] },
    { id: 'impact', name: 'Impact', category: 'FX', url: 'https://cdn.freesound.org/previews/398/398034_7255534-lq.mp3', tags: ['impact', 'hit'] },
  ]
};

export default function SampleBrowser({ onSampleSelect }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playing, setPlaying] = useState(null);
  const [audio] = useState(new Audio());
  const [dialogOpen, setDialogOpen] = useState(false);

  const allSamples = Object.values(SAMPLE_PACKS).flat();
  
  const filteredSamples = allSamples.filter(sample => {
    const matchesSearch = sample.name.toLowerCase().includes(search.toLowerCase()) ||
                         sample.tags.some(tag => tag.includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || sample.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(allSamples.map(s => s.category))];

  const previewSample = (sample) => {
    if (playing === sample.id) {
      audio.pause();
      setPlaying(null);
    } else {
      audio.src = sample.url;
      audio.play().catch(err => {
        console.error('Playback failed:', err);
        toast.error('Could not play sample');
      });
      setPlaying(sample.id);
      audio.onended = () => setPlaying(null);
    }
  };

  const selectSample = async (sample) => {
    try {
      // In production, would upload sample to user's library
      onSampleSelect?.({
        name: sample.name,
        url: sample.url,
        type: sample.category.toLowerCase(),
        color: getCategoryColor(sample.category)
      });
      toast.success(`Added ${sample.name} to project!`);
    } catch (error) {
      toast.error('Failed to add sample');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Drums': '#FFD93D',
      'Bass': '#7DF1FF',
      'Synth': '#B18CFF',
      'FX': '#FF6B6B'
    };
    return colors[category] || '#64748b';
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Music className="w-4 h-4" />
          Sample Browser
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Sample Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <Input
              placeholder="Search samples..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="capitalize"
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Sample Grid */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredSamples.map(sample => (
              <div
                key={sample.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)] hover:border-[var(--line)] transition-colors"
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${getCategoryColor(sample.category)}20` }}
                >
                  {sample.category === 'Drums' ? '🥁' : sample.category === 'Bass' ? '🔊' : sample.category === 'Synth' ? '🎹' : '✨'}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{sample.name}</p>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {sample.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => previewSample(sample)}
                    className="h-8 w-8"
                  >
                    {playing === sample.id ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => selectSample(sample)}
                    className="h-8 w-8"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            {filteredSamples.length === 0 && (
              <div className="text-center py-12 text-[var(--muted)]">
                No samples found
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <p className="text-xs text-[var(--muted)]">
              💡 <strong>Tip:</strong> Click Play to preview, Plus to add to your project
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}