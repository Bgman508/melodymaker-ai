import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Route, Plus, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

export default function BusTracks({ tracks, onUpdateBuses }) {
  const [buses, setBuses] = useState([
    { id: 'drums-bus', name: 'Drums Bus', volume: 0.8, tracks: [], color: '#FF6B6B' },
    { id: 'music-bus', name: 'Music Bus', volume: 0.8, tracks: [], color: '#7C61FF' }
  ]);

  const addBus = () => {
    const newBus = {
      id: `bus-${Date.now()}`,
      name: `Bus ${buses.length + 1}`,
      volume: 0.8,
      tracks: [],
      color: '#64748b'
    };
    setBuses([...buses, newBus]);
    toast.success('Bus created');
  };

  const updateBus = (busId, updates) => {
    const updated = buses.map(b => b.id === busId ? { ...b, ...updates } : b);
    setBuses(updated);
    onUpdateBuses?.(updated);
  };

  const toggleTrackInBus = (trackId, busId) => {
    const updated = buses.map(bus => {
      if (bus.id === busId) {
        const hasTrack = bus.tracks.includes(trackId);
        return {
          ...bus,
          tracks: hasTrack 
            ? bus.tracks.filter(id => id !== trackId)
            : [...bus.tracks, trackId]
        };
      }
      return bus;
    });
    setBuses(updated);
    onUpdateBuses?.(updated);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Route className="w-4 h-4" />
          Buses ({buses.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bus Routing</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {buses.map(bus => (
            <div 
              key={bus.id} 
              className="border border-[var(--hair)] rounded-lg p-4 bg-[var(--surface-2)]"
              style={{ borderLeftColor: bus.color, borderLeftWidth: '4px' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Input
                  value={bus.name}
                  onChange={(e) => updateBus(bus.id, { name: e.target.value })}
                  className="flex-1 h-8 bg-[var(--bg)]"
                />
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-[var(--muted)]" />
                  <Slider
                    value={[bus.volume * 100]}
                    onValueChange={(val) => updateBus(bus.id, { volume: val[0] / 100 })}
                    max={100}
                    className="w-24"
                  />
                  <span className="text-xs text-[var(--muted)] w-8">{Math.round(bus.volume * 100)}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-[var(--muted)] font-semibold">Routed Tracks:</p>
                <div className="grid grid-cols-2 gap-2">
                  {tracks.map(track => (
                    <label 
                      key={track.id} 
                      className="flex items-center gap-2 text-sm p-2 rounded bg-[var(--bg)] hover:bg-[var(--hover)] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={bus.tracks.includes(track.id)}
                        onChange={() => toggleTrackInBus(track.id, bus.id)}
                        className="w-4 h-4 rounded"
                      />
                      <span>{track.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Button onClick={addBus} variant="outline" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Bus
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}