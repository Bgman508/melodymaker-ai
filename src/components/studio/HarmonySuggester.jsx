import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Music, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function HarmonySuggester({ melodyTrack, onApplyChords, midiEngine }) {
  const [suggestions, setSuggestions] = useState([]);
  const [generating, setGenerating] = useState(false);

  const analyzeAndSuggest = () => {
    setGenerating(true);
    
    // Analyze melody to determine key/scale
    const pitches = melodyTrack.notes.map(n => n.pitch % 12);
    const pitchCounts = {};
    pitches.forEach(p => pitchCounts[p] = (pitchCounts[p] || 0) + 1);
    
    // Generate 3 different progressions
    const progressions = [
      { name: 'Pop (I-V-vi-IV)', chords: ['I', 'V', 'vi', 'IV'] },
      { name: 'Jazz (ii-V-I)', chords: ['ii', 'V', 'I', 'vi'] },
      { name: 'Soul (i-VI-III-VII)', chords: ['i', 'VI', 'III', 'VII'] }
    ];

    setSuggestions(progressions);
    setGenerating(false);
    toast.success('Generated 3 harmony suggestions');
  };

  const applyProgression = (progression) => {
    // Generate chord track with this progression
    const result = midiEngine.generateComposition(
      `chords only, progression: [${progression.chords.join(', ')}]`,
      null
    );
    
    const chordTrack = result.tracks.find(t => t.type === 'chords');
    if (chordTrack) {
      onApplyChords(chordTrack);
      toast.success(`Applied ${progression.name}`);
    }
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={analyzeAndSuggest}
        disabled={generating || !melodyTrack}
        className="w-full bg-[var(--violet)] hover:bg-[var(--violet-hover)] text-white"
      >
        <Music className="w-4 h-4 mr-2" />
        Suggest Harmonies
      </Button>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((prog, idx) => (
            <button
              key={idx}
              onClick={() => applyProgression(prog)}
              className="w-full p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)] hover:border-[var(--violet)] transition-all text-left"
            >
              <div className="font-medium text-sm">{prog.name}</div>
              <div className="text-xs text-[var(--muted)] mt-1">
                {prog.chords.join(' → ')}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}