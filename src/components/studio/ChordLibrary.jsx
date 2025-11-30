import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music2, Search, Play, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CHORD_PROGRESSIONS = [
  {
    id: 'pop-classic',
    name: 'I-V-vi-IV (Pop Classic)',
    chords: ['C', 'G', 'Am', 'F'],
    genre: 'Pop',
    mood: 'Happy',
    notes: [[60, 64, 67], [67, 71, 74], [69, 72, 76], [65, 69, 72]],
    description: 'Let It Be, Don\'t Stop Believin\', etc.'
  },
  {
    id: 'sad-progression',
    name: 'i-VI-III-VII (Sad)',
    chords: ['Am', 'F', 'C', 'G'],
    genre: 'R&B',
    mood: 'Sad',
    notes: [[69, 72, 76], [65, 69, 72], [60, 64, 67], [67, 71, 74]],
    description: 'Emotional ballads'
  },
  {
    id: 'trap-dark',
    name: 'i-bVII-bVI-V (Dark Trap)',
    chords: ['Am', 'G', 'F', 'E'],
    genre: 'Trap',
    mood: 'Dark',
    notes: [[69, 72, 76], [67, 71, 74], [65, 69, 72], [64, 68, 71]],
    description: 'Dark, brooding vibes'
  },
  {
    id: 'lofi-chill',
    name: 'ii-V-I-vi (LoFi Jazz)',
    chords: ['Dm7', 'G7', 'Cmaj7', 'Am7'],
    genre: 'LoFi',
    mood: 'Chill',
    notes: [[62, 65, 69, 72], [67, 71, 74, 77], [60, 64, 67, 71], [69, 72, 76, 79]],
    description: 'Smooth jazz progressions'
  },
  {
    id: 'gospel',
    name: 'I-IV-V-I (Gospel)',
    chords: ['C', 'F', 'G', 'C'],
    genre: 'Gospel',
    mood: 'Uplifting',
    notes: [[60, 64, 67], [65, 69, 72], [67, 71, 74], [60, 64, 67]],
    description: 'Church, soul music'
  },
  {
    id: 'afrobeats',
    name: 'i-bVII-i-bVI (Afrobeats)',
    chords: ['Am', 'G', 'Am', 'F'],
    genre: 'Afrobeats',
    mood: 'Energetic',
    notes: [[69, 72, 76], [67, 71, 74], [69, 72, 76], [65, 69, 72]],
    description: 'Burna Boy, Wizkid style'
  },
  {
    id: 'edm-buildup',
    name: 'vi-IV-I-V (EDM Build)',
    chords: ['Am', 'F', 'C', 'G'],
    genre: 'EDM',
    mood: 'Energetic',
    notes: [[69, 72, 76], [65, 69, 72], [60, 64, 67], [67, 71, 74]],
    description: 'Pre-drop buildup'
  },
  {
    id: 'rnb-smooth',
    name: 'I-iii-vi-ii (Smooth R&B)',
    chords: ['C', 'Em', 'Am', 'Dm'],
    genre: 'R&B',
    mood: 'Smooth',
    notes: [[60, 64, 67], [64, 67, 71], [69, 72, 76], [62, 65, 69]],
    description: 'The Weeknd, Frank Ocean'
  }
];

export default function ChordLibrary({ onSelectProgression }) {
  const [search, setSearch] = useState('');
  const [genreFilter, setGenreFilter] = useState('all');
  const [moodFilter, setMoodFilter] = useState('all');
  const [playing, setPlaying] = useState(null);

  const genres = ['all', ...new Set(CHORD_PROGRESSIONS.map(p => p.genre))];
  const moods = ['all', ...new Set(CHORD_PROGRESSIONS.map(p => p.mood))];

  const filteredProgressions = CHORD_PROGRESSIONS.filter(prog => {
    const matchesSearch = prog.name.toLowerCase().includes(search.toLowerCase()) ||
                         prog.description.toLowerCase().includes(search.toLowerCase());
    const matchesGenre = genreFilter === 'all' || prog.genre === genreFilter;
    const matchesMood = moodFilter === 'all' || prog.mood === moodFilter;
    return matchesSearch && matchesGenre && matchesMood;
  });

  const previewProgression = async (prog) => {
    if (playing === prog.id) {
      setPlaying(null);
      return;
    }

    setPlaying(prog.id);
    
    // Simple audio preview using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;
    
    prog.notes.forEach((chord, i) => {
      const startTime = now + (i * 0.5);
      chord.forEach(note => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc.frequency.value = 440 * Math.pow(2, (note - 69) / 12);
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);
        
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.5);
      });
    });
    
    setTimeout(() => setPlaying(null), prog.notes.length * 500);
  };

  const handleSelect = (prog) => {
    // Convert to track format
    const chordTrack = {
      id: `chords-${Date.now()}`,
      name: prog.name,
      type: 'chords',
      channel: 0,
      program: 0,
      volume: 0.7,
      pan: 0,
      muted: false,
      solo: false,
      color: '#7C61FF',
      notes: []
    };

    // Convert chord notes to MIDI notes
    prog.notes.forEach((chord, barIndex) => {
      chord.forEach(pitch => {
        chordTrack.notes.push({
          pitch,
          start: barIndex * 4, // 4 beats per bar
          duration: 4,
          velocity: 80
        });
      });
    });

    onSelectProgression?.(chordTrack);
    toast.success(`Added: ${prog.name}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search progressions..."
            className="pl-10 bg-[var(--surface)] border-[var(--hair)]"
          />
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="text-xs text-[var(--muted)] mr-2">Genre:</div>
        {genres.map(genre => (
          <Button
            key={genre}
            variant={genreFilter === genre ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGenreFilter(genre)}
            className="text-xs h-7"
          >
            {genre}
          </Button>
        ))}
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="text-xs text-[var(--muted)] mr-2">Mood:</div>
        {moods.map(mood => (
          <Button
            key={mood}
            variant={moodFilter === mood ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMoodFilter(mood)}
            className="text-xs h-7"
          >
            {mood}
          </Button>
        ))}
      </div>

      <div className="grid gap-3 max-h-[400px] overflow-y-auto">
        {filteredProgressions.map(prog => (
          <div
            key={prog.id}
            className={cn(
              "p-4 rounded-lg border border-[var(--hair)] bg-[var(--surface)]",
              "hover:border-[var(--violet)] hover:bg-[var(--surface-2)] transition-all"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{prog.name}</h4>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--mint)]/20 text-[var(--mint)]">
                    {prog.genre}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-[var(--violet)]/20 text-[var(--violet)]">
                    {prog.mood}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)] mb-2">{prog.description}</p>
                <div className="flex gap-1 text-sm font-mono">
                  {prog.chords.map((chord, i) => (
                    <span key={i} className="px-2 py-1 rounded bg-[var(--bg)] text-[var(--text)]">
                      {chord}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => previewProgression(prog)}
                className="flex-1"
              >
                <Play className={cn("w-3 h-3 mr-2", playing === prog.id && "text-[var(--mint)]")} />
                {playing === prog.id ? 'Playing...' : 'Preview'}
              </Button>
              <Button
                size="sm"
                onClick={() => handleSelect(prog)}
                className="flex-1 bg-[var(--mint)] text-black hover:bg-[var(--mint)]/90"
              >
                <Plus className="w-3 h-3 mr-2" />
                Add to Project
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredProgressions.length === 0 && (
        <div className="text-center py-8 text-[var(--muted)]">
          <Music2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No progressions found</p>
        </div>
      )}
    </div>
  );
}