import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CounterpointGenerator } from "../engine/counterpoint";
import { Music2 } from "lucide-react";
import { toast } from "sonner";

export default function CounterpointPanel({ melodyTrack, onApplyCountermelody }) {
  const [species, setSpecies] = useState('1');
  const [generating, setGenerating] = useState(false);

  const generateCountermelody = async () => {
    if (!melodyTrack) {
      toast.error('No melody track found');
      return;
    }

    setGenerating(true);

    try {
      const generator = new CounterpointGenerator();
      const countermelody = generator.generateCountermelody(
        melodyTrack.notes,
        parseInt(species)
      );

      const counterTrack = {
        id: 'countermelody',
        name: 'Countermelody',
        type: 'melody',
        channel: 3,
        program: 73, // Flute
        volume: 0.7,
        pan: -0.3,
        muted: false,
        solo: false,
        notes: countermelody
      };

      onApplyCountermelody(counterTrack);
      toast.success(`Generated ${species} species counterpoint`);
    } catch (error) {
      toast.error('Counterpoint generation failed');
    }

    setGenerating(false);
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Music2 className="w-4 h-4 text-[var(--violet)]" />
          Counterpoint
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-[var(--muted)] mb-1 block">Species</label>
          <Select value={species} onValueChange={setSpecies}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1st Species (Note against note)</SelectItem>
              <SelectItem value="2">2nd Species (Two against one)</SelectItem>
              <SelectItem value="3">3rd Species (Four against one)</SelectItem>
              <SelectItem value="4">4th Species (Syncopation)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={generateCountermelody}
          disabled={generating || !melodyTrack}
          className="w-full bg-gradient-to-r from-[var(--violet)] to-[var(--ice)] text-white"
        >
          {generating ? 'Generating...' : 'Generate Countermelody'}
        </Button>

        <div className="text-xs text-[var(--muted)] space-y-1">
          <p>• Creates a second melodic line</p>
          <p>• Follows classical counterpoint rules</p>
          <p>• Avoids parallel fifths/octaves</p>
        </div>
      </div>
    </div>
  );
}