import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Repeat, Play, Pause, Plus } from "lucide-react";
import { toast } from "sonner";

const LOOP_PACKS = [
  { id: 'trap-drums-1', name: 'Trap Drums Loop', bpm: 140, category: 'Drums', url: 'https://cdn.freesound.org/previews/442/442937_5674468-lq.mp3', tags: ['trap', 'drums', 'hip-hop'] },
  { id: 'lofi-beat-1', name: 'Lo-Fi Beat', bpm: 85, category: 'Drums', url: 'https://cdn.freesound.org/previews/456/456123_9876543-lq.mp3', tags: ['lofi', 'chill', 'drums'] },
  { id: 'bass-groove-1', name: 'Bass Groove', bpm: 120, category: 'Bass', url: 'https://cdn.freesound.org/previews/234/234890_1122334-lq.mp3', tags: ['bass', 'groove', 'funk'] },
  { id: 'piano-chord-1', name: 'Piano Chord Loop', bpm: 100, category: 'Chords', url: 'https://cdn.freesound.org/previews/345/345901_2233445-lq.mp3', tags: ['piano', 'chords', 'melodic'] },
  { id: 'guitar-riff-1', name: 'Guitar Riff', bpm: 130, category: 'Melody', url: 'https://cdn.freesound.org/previews/456/456012_3344556-lq.mp3', tags: ['guitar', 'riff', 'rock'] },
];

export default function LoopLibrary({ onLoopSelect, currentBpm }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [playing, setPlaying] = useState(null);
  const [audio] = useState(new Audio());
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredLoops = LOOP_PACKS.filter(loop => {
    const matchesSearch = loop.name.toLowerCase().includes(search.toLowerCase()) ||
                         loop.tags.some(tag => tag.includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || loop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(LOOP_PACKS.map(l => l.category))];

  const previewLoop = (loop) => {
    if (playing === loop.id) {
      audio.pause();
      setPlaying(null);
    } else {
      audio.src = loop.url;
      audio.loop = true;
      audio.play().catch(err => {
        console.error('Playback failed:', err);
        toast.error('Could not play loop');
      });
      setPlaying(loop.id);
    }
  };

  const selectLoop = (loop) => {
    if (playing === loop.id) {
      audio.pause();
      setPlaying(null);
    }
    
    onLoopSelect?.({
      name: loop.name,
      url: loop.url,
      bpm: loop.bpm,
      category: loop.category,
      needsTimeStretch: Math.abs(loop.bpm - currentBpm) > 5
    });
    
    if (Math.abs(loop.bpm - currentBpm) > 5) {
      toast.info(`Loop BPM (${loop.bpm}) differs from project (${currentBpm}). Time-stretching applied.`);
    } else {
      toast.success(`Added ${loop.name} to timeline!`);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Drums': '#FFD93D',
      'Bass': '#7DF1FF',
      'Melody': '#FF6B9D',
      'Chords': '#B18CFF'
    };
    return colors[category] || '#64748b';
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Repeat className="w-4 h-4" />
          Loop Library
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Loop Library</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <Input
              placeholder="Search loops..."
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

          {/* Loop Grid */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredLoops.map(loop => {
              const bpmMatch = Math.abs(loop.bpm - currentBpm) < 5;
              
              return (
                <div
                  key={loop.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)] hover:border-[var(--line)] transition-colors"
                >
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${getCategoryColor(loop.category)}20` }}
                  >
                    <Repeat className="w-6 h-6" style={{ color: getCategoryColor(loop.category) }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{loop.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${bpmMatch ? 'bg-[var(--mint)]/20 text-[var(--mint)]' : 'bg-[var(--coral)]/20 text-[var(--coral)]'}`}>
                        {loop.bpm} BPM
                      </span>
                    </div>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {loop.tags.map(tag => (
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
                      onClick={() => previewLoop(loop)}
                      className="h-8 w-8"
                    >
                      {playing === loop.id ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => selectLoop(loop)}
                      className="h-8 w-8"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {filteredLoops.length === 0 && (
              <div className="text-center py-12 text-[var(--muted)]">
                No loops found
              </div>
            )}
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <p className="text-xs text-[var(--muted)]">
              💡 <strong>Project BPM:</strong> {currentBpm} • Loops will auto-stretch to match
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}