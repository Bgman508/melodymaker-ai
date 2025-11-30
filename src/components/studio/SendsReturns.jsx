import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Radio } from "lucide-react";
import { toast } from "sonner";

const FX_TYPES = [
  { value: 'reverb', label: 'Reverb' },
  { value: 'delay', label: 'Delay' },
  { value: 'chorus', label: 'Chorus' },
  { value: 'distortion', label: 'Distortion' }
];

export default function SendsReturns({ tracks, onUpdateSends }) {
  const [sends, setSends] = useState([
    { id: 'send-1', name: 'Reverb Bus', type: 'reverb', level: 0, return: 80 },
    { id: 'send-2', name: 'Delay Bus', type: 'delay', level: 0, return: 70 }
  ]);

  const [trackSends, setTrackSends] = useState(
    tracks.reduce((acc, track) => {
      acc[track.id] = {};
      sends.forEach(send => {
        acc[track.id][send.id] = 0; // Send level per track
      });
      return acc;
    }, {})
  );

  const addSend = () => {
    const newSend = {
      id: `send-${Date.now()}`,
      name: `Send ${sends.length + 1}`,
      type: 'reverb',
      level: 0,
      return: 100
    };
    
    setSends(prev => [...prev, newSend]);
    
    // Add send slot for all tracks
    setTrackSends(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(trackId => {
        updated[trackId][newSend.id] = 0;
      });
      return updated;
    });
    
    toast.success('Send created');
  };

  const updateTrackSend = (trackId, sendId, value) => {
    setTrackSends(prev => ({
      ...prev,
      [trackId]: {
        ...prev[trackId],
        [sendId]: value
      }
    }));
    
    onUpdateSends?.({ trackId, sendId, value });
  };

  const updateSendReturn = (sendId, value) => {
    setSends(prev => prev.map(s => 
      s.id === sendId ? { ...s, return: value } : s
    ));
  };

  const removeSend = (sendId) => {
    setSends(prev => prev.filter(s => s.id !== sendId));
    
    setTrackSends(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(trackId => {
        delete updated[trackId][sendId];
      });
      return updated;
    });
    
    toast.success('Send removed');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Radio className="w-4 h-4" />
          Sends
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sends & Returns (FX Buses)</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Send Buses */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Send Buses</h3>
              <Button onClick={addSend} size="sm" variant="outline" className="gap-2">
                <Plus className="w-3 h-3" />
                Add Send
              </Button>
            </div>

            {sends.map(send => (
              <div
                key={send.id}
                className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Input
                    value={send.name}
                    onChange={(e) => {
                      setSends(prev => prev.map(s =>
                        s.id === send.id ? { ...s, name: e.target.value } : s
                      ));
                    }}
                    className="flex-1 h-8 bg-[var(--bg)]"
                  />
                  
                  <Select
                    value={send.type}
                    onValueChange={(type) => {
                      setSends(prev => prev.map(s =>
                        s.id === send.id ? { ...s, type } : s
                      ));
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FX_TYPES.map(fx => (
                        <SelectItem key={fx.value} value={fx.value}>
                          {fx.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeSend(send.id)}
                    className="h-8 w-8 p-0 text-[var(--coral)]"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-[var(--muted)]">Return Level</span>
                      <span className="text-xs font-mono">{send.return}%</span>
                    </div>
                    <Slider
                      value={[send.return]}
                      onValueChange={([value]) => updateSendReturn(send.id, value)}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Track Send Levels */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Send Levels Per Track</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--hair)]">
                    <th className="text-left p-2 font-semibold">Track</th>
                    {sends.map(send => (
                      <th key={send.id} className="text-center p-2 font-semibold min-w-[120px]">
                        {send.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tracks.map(track => (
                    <tr key={track.id} className="border-b border-[var(--hair)]">
                      <td className="p-2 font-medium">{track.name}</td>
                      {sends.map(send => (
                        <td key={send.id} className="p-2">
                          <div className="flex flex-col items-center gap-1">
                            <Slider
                              value={[trackSends[track.id]?.[send.id] || 0]}
                              onValueChange={([value]) => updateTrackSend(track.id, send.id, value)}
                              max={100}
                              step={1}
                              className="w-20"
                            />
                            <span className="text-xs text-[var(--muted)] font-mono">
                              {trackSends[track.id]?.[send.id] || 0}%
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--hair)]">
            <p className="text-xs text-[var(--muted)]">
              <strong>How it works:</strong> Sends route a copy of the track signal to an FX bus. 
              Adjust each track's send level to control how much signal goes to the effect. 
              The return level controls the overall output of the FX bus.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}