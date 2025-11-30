import React, { useState } from 'react';
import { HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const MUSIC_THEORY = {
  'C': 'Tonic (I) - Home base, feels stable and resolved',
  'Dm': 'Supertonic (ii) - Leads smoothly to V, creates forward motion',
  'Em': 'Mediant (iii) - Transitional, often leads to vi or IV',
  'F': 'Subdominant (IV) - Creates gentle tension, popular in pop music',
  'G': 'Dominant (V) - Strong pull back to I, creates expectation',
  'Am': 'Submediant (vi) - Sad/reflective, often used in emotional moments',
  'Bdim': 'Leading tone (vii°) - Unstable, strongly wants to resolve to I',
  
  'i': 'Tonic minor - Dark, melancholic home base',
  'VI': 'Submediant major - Bright contrast in minor keys, very popular',
  'III': 'Mediant major - Epic, cinematic quality',
  'VII': 'Subtonic - Modern, avoids traditional resolution',
  
  'trap': 'Genre defined by 808 bass, hi-hat rolls, and syncopated rhythms',
  'lofi': 'Relaxed genre with swing timing, warm tones, and imperfections',
  'swing': 'Rhythmic feel where off-beats are delayed slightly (typically 58-62%)',
  '808': 'Iconic bass drum with long decay and pitch bend capabilities',
  'ghost note': 'Very quiet note (low velocity) that adds groove without being obvious',
  'add9': 'Adds 9th scale degree to chord for bright, jazzy color',
  'sus4': 'Replaces 3rd with 4th, creates tension wanting resolution',
  'voice leading': 'Moving smoothly between chords with minimal note jumps'
};

export default function ExplainMode({ term, children }) {
  const explanation = MUSIC_THEORY[term] || MUSIC_THEORY[term?.toLowerCase()];

  if (!explanation) return children;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <span className="border-b border-dotted border-[var(--mint)] cursor-help">
            {children}
          </span>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="max-w-xs bg-[var(--surface)] border border-[var(--mint)] text-[var(--text)] p-3"
        >
          <div className="flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[var(--mint)] mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold mb-1">{term}</div>
              <div className="text-sm">{explanation}</div>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}