import React, { useState, useEffect } from 'react';
import { Lightbulb, TrendingUp, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SmartSuggestions({ tracks, prompt, onApplySuggestion }) {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (tracks.length > 0) {
      analyzeTracks();
    }
  }, [tracks]);

  const analyzeTracks = () => {
    const newSuggestions = [];

    // Analyze composition and suggest improvements
    if (!tracks.find(t => t.type === 'bass')) {
      newSuggestions.push({
        type: 'missing',
        icon: TrendingUp,
        text: 'Add bass line for fuller sound',
        action: 'add sub bass, 808'
      });
    }

    if (!tracks.find(t => t.type === 'drums')) {
      newSuggestions.push({
        type: 'missing',
        icon: Zap,
        text: 'Add rhythm section',
        action: 'add trap drums'
      });
    }

    const melodyTrack = tracks.find(t => t.type === 'melody');
    if (melodyTrack && melodyTrack.notes.length < 20) {
      newSuggestions.push({
        type: 'enhance',
        icon: Lightbulb,
        text: 'Melody is sparse - add more notes',
        action: 'make melody more busy'
      });
    }

    if (tracks.length >= 4 && !tracks.find(t => t.type === 'pad')) {
      newSuggestions.push({
        type: 'enhance',
        icon: Lightbulb,
        text: 'Add ambient pad for depth',
        action: 'add warm pad'
      });
    }

    setSuggestions(newSuggestions.slice(0, 3)); // Show top 3
  };

  if (suggestions.length === 0) return null;

  return (
    <div className="space-y-2 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--mint)]/20">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-[var(--mint)]" />
        AI Suggestions
      </h3>
      <div className="space-y-2">
        {suggestions.map((suggestion, idx) => {
          const Icon = suggestion.icon;
          return (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => onApplySuggestion(suggestion.action)}
              className="w-full justify-start text-xs"
            >
              <Icon className="w-3 h-3 mr-2" />
              {suggestion.text}
            </Button>
          );
        })}
      </div>
    </div>
  );
}