import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function VariationGenerator({ tracks, onApplyVariation, midiEngine }) {
  const [variations, setVariations] = useState([]);
  const [generating, setGenerating] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(null);

  const generateVariations = async (targetTrack = 'melody', count = 3) => {
    setGenerating(true);
    const newVariations = [];
    
    try {
      for (let i = 0; i < count; i++) {
        // Generate with different seeds
        const seed = Math.floor(Math.random() * 10000);
        const result = midiEngine.generateComposition(
          `regenerate ${targetTrack}`,
          seed
        );
        
        const varTrack = result.tracks.find(t => t.type === targetTrack);
        if (varTrack) {
          newVariations.push({
            id: `var-${i}`,
            label: String.fromCharCode(65 + i), // A, B, C
            track: varTrack,
            seed
          });
        }
      }
      
      setVariations(newVariations);
      toast.success(`Generated ${newVariations.length} variations`);
    } catch (error) {
      toast.error('Failed to generate variations');
    }
    
    setGenerating(false);
  };

  const handleSelect = (idx) => {
    setSelectedIdx(idx);
    onApplyVariation(variations[idx].track);
    toast.success(`Applied variation ${variations[idx].label}`);
  };

  return (
    <div className="space-y-3">
      <Button
        onClick={() => generateVariations('melody', 3)}
        disabled={generating}
        className="w-full bg-gradient-to-r from-[var(--violet)] to-[var(--ice)] text-white font-semibold"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        {generating ? 'Generating...' : 'Generate 3 Variations'}
      </Button>

      {variations.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {variations.map((variation, idx) => (
            <motion.button
              key={variation.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => handleSelect(idx)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedIdx === idx
                  ? 'border-[var(--mint)] bg-[var(--mint)]/10'
                  : 'border-[var(--hair)] bg-[var(--surface-2)] hover:border-[var(--line)]'
              }`}
            >
              <div className="text-2xl font-bold mb-1">{variation.label}</div>
              <div className="text-xs text-[var(--muted)]">
                {variation.track.notes.length} notes
              </div>
              {selectedIdx === idx && (
                <Check className="w-4 h-4 text-[var(--mint)] mx-auto mt-2" />
              )}
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}