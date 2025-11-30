import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Wand2 } from "lucide-react";

export default function PromptInput({ onGenerate, loading }) {
  const [prompt, setPrompt] = useState('');
  
  const quickPrompts = [
    "Happy piano melody in C major, 120 bpm, 8 bars",
    "Sad ambient piece in A minor, 90 bpm, 16 bars",
    "Epic orchestral theme in D minor, 110 bpm, 12 bars",
    "Energetic electronic dance in G major, 140 bpm, 8 bars",
    "Chill lo-fi hip hop in F major, 85 bpm, 16 bars"
  ];
  
  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe your composition... (e.g., 'upbeat jazz piano in D major, 120 bpm, 8 bars')"
          className="min-h-[100px] bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 pr-12"
        />
        <Wand2 className="absolute top-3 right-3 w-5 h-5 text-purple-400" />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((qp, i) => (
          <button
            key={i}
            onClick={() => setPrompt(qp)}
            className="px-3 py-1 text-xs rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-slate-300 transition-colors"
          >
            {qp.split(',')[0]}
          </button>
        ))}
      </div>
      
      <Button
        onClick={() => onGenerate(prompt)}
        disabled={!prompt.trim() || loading}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
      >
        {loading ? (
          <>Generating...</>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            Generate Music
          </>
        )}
      </Button>
    </div>
  );
}