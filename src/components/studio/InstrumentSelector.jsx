import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Music, Search, Volume2, Piano } from "lucide-react";
import { INSTRUMENT_LIBRARY } from '../engine/instrumentLibrary';

export default function InstrumentSelector({ track, onSelectInstrument }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(
    Object.values(INSTRUMENT_LIBRARY).map(inst => inst.category)
  ))];

  const instruments = Object.entries(INSTRUMENT_LIBRARY).map(([key, inst]) => ({
    id: key,
    ...inst
  }));

  const filteredInstruments = instruments.filter(inst => {
    const matchesSearch = inst.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || inst.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const selectInstrument = (instrumentId) => {
    onSelectInstrument?.(track.id, instrumentId);
  };

  const currentInstrument = instruments.find(i => i.id === track.instrument);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 w-full justify-start">
          <Piano className="w-4 h-4" />
          <span className="truncate">{currentInstrument?.name || 'Select Instrument'}</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Choose Instrument: {track.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted)]" />
            <Input
              placeholder="Search instruments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
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

          {/* Instrument Grid */}
          <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {filteredInstruments.map(inst => (
              <button
                key={inst.id}
                onClick={() => selectInstrument(inst.id)}
                className={`p-4 rounded-lg border transition-all text-left group ${
                  track.instrument === inst.id
                    ? 'bg-[var(--mint)]/20 border-[var(--mint)]'
                    : 'bg-[var(--surface-2)] border-[var(--hair)] hover:border-[var(--mint)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    track.instrument === inst.id ? 'bg-[var(--mint)]' : 'bg-[var(--bg)]'
                  }`}>
                    <Music className={`w-5 h-5 ${
                      track.instrument === inst.id ? 'text-black' : 'text-[var(--muted)]'
                    }`} />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm mb-1">{inst.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--bg)] text-[var(--muted)]">
                        {inst.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-[var(--mint)]/20 text-[var(--mint)]">
                        {inst.type === 'sampled' ? '🎹 Sampled' : '🎛️ Synth'}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {filteredInstruments.length === 0 && (
            <div className="text-center py-8 text-[var(--muted)]">
              <Music className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No instruments found</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}