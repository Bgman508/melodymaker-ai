import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Unlock, Play, Save, Music, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function InstrumentPanel({ tracks, onUpdateTrack, midiEngine }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [presetMode, setPresetMode] = useState(false);

  const getAllInstruments = () => {
    if (!midiEngine?.gmInstruments) return [];
    
    const all = [];
    Object.values(midiEngine.gmInstruments).forEach(category => {
      all.push(...category);
    });
    return all;
  };

  const getFilteredInstruments = (trackType) => {
    const allInstruments = getAllInstruments();
    
    let filtered = selectedCategory === 'all' 
      ? allInstruments 
      : allInstruments.filter(inst => inst.category === selectedCategory);
    
    if (searchTerm) {
      filtered = filtered.filter(inst =>
        inst.label.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Smart filtering by track type
    if (trackType === 'bass') {
      filtered = filtered.filter(inst => 
        inst.category === 'Bass' || inst.value >= 32 && inst.value <= 39
      );
    } else if (trackType === 'melody' || trackType === 'lead') {
      filtered = filtered.filter(inst =>
        ['Synth Lead', 'Reed', 'Pipe', 'Brass'].includes(inst.category)
      );
    } else if (trackType === 'chords' || trackType === 'pad') {
      filtered = filtered.filter(inst =>
        ['Piano', 'Organ', 'Ensemble', 'Synth Pad', 'Strings'].includes(inst.category)
      );
    }
    
    return filtered;
  };

  const handleProgramChange = (trackId, program) => {
    onUpdateTrack(trackId, { program: parseInt(program) });
  };

  const applyPreset = (presetName) => {
    if (!midiEngine?.instrumentPresets || !midiEngine.instrumentPresets[presetName]) return;
    
    const preset = midiEngine.instrumentPresets[presetName];
    
    tracks.forEach(track => {
      let newProgram = null;
      
      if (track.type === 'melody' && preset.melody) {
        newProgram = preset.melody[0];
      } else if (track.type === 'chords' && preset.harmony) {
        newProgram = preset.harmony[0];
      } else if (track.type === 'bass' && preset.bass) {
        newProgram = preset.bass[0];
      }
      
      if (newProgram !== null) {
        onUpdateTrack(track.id, { program: newProgram });
      }
    });
  };

  const categories = [
    'all', 'Piano', 'Organ', 'Guitar', 'Bass', 'Strings', 'Ensemble',
    'Brass', 'Reed', 'Pipe', 'Synth Lead', 'Synth Pad', 'Synth FX',
    'Ethnic', 'Percussive', 'Sound FX'
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-[var(--muted)]" />
          <h3 className="text-sm uppercase tracking-wide text-[var(--muted)] font-semibold">
            Instruments
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPresetMode(!presetMode)}
            className={presetMode ? 'text-[var(--mint)]' : ''}
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Presets
          </Button>
        </div>
      </div>

      {presetMode ? (
        <div className="space-y-2">
          <p className="text-xs text-[var(--muted)] mb-3">
            Apply curated instrument combinations by genre/mood
          </p>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(midiEngine?.instrumentPresets || {}).map(presetName => (
              <Button
                key={presetName}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(presetName)}
                className="capitalize"
              >
                {presetName.replace('_', ' ')}
              </Button>
            ))}
          </div>
        </div>
      ) : (
        <>
          {/* Search and Filter */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search instruments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-[var(--surface-2)] border border-[var(--hair)] focus:outline-none focus:border-[var(--mint)]"
            />
            
            <ScrollArea className="h-24">
              <div className="flex flex-wrap gap-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[var(--mint)] text-black'
                        : 'bg-[var(--surface-2)] text-[var(--muted)] hover:bg-[var(--hover)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Track Instruments */}
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {tracks.map(track => {
                const filteredInstruments = getFilteredInstruments(track.type);
                
                return (
                  <div
                    key={track.id}
                    className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: track.type === 'melody' ? 'var(--mint)' :
                                       track.type === 'chords' ? 'var(--violet)' :
                                       track.type === 'bass' ? 'var(--ice)' :
                                       'var(--coral)'
                          }}
                        />
                        <span className="text-sm font-medium text-[var(--text)] capitalize">
                          {track.name}
                        </span>
                      </div>
                    </div>

                    <Select
                      value={String(track.program || 0)}
                      onValueChange={(val) => handleProgramChange(track.id, val)}
                    >
                      <SelectTrigger className="w-full bg-[var(--surface)] border-[var(--hair)] text-xs h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredInstruments.map(inst => (
                          <SelectItem key={inst.value} value={String(inst.value)} className="text-xs">
                            <span className="font-mono text-[var(--muted)] mr-2">
                              {String(inst.value).padStart(3, '0')}
                            </span>
                            {inst.label}
                            <span className="text-[var(--muted)] ml-2 text-[10px]">
                              ({inst.category})
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </>
      )}

      {tracks.length === 0 && (
        <div className="text-center py-8 text-[var(--muted)] text-sm">
          Compose something to configure instruments
        </div>
      )}
    </div>
  );
}