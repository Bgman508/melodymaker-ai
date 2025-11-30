import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link2, TrendingDown } from "lucide-react";
import { toast } from "sonner";

export default function SidechainPanel({ tracks, selectedTrack, onUpdateTrack }) {
  const [enabled, setEnabled] = useState(false);
  const [sourceTrigger, setSourceTrigger] = useState('');
  const [threshold, setThreshold] = useState(-20);
  const [ratio, setRatio] = useState(4);
  const [attack, setAttack] = useState(5);
  const [release, setRelease] = useState(100);
  const [amount, setAmount] = useState(50);

  const applySidechain = () => {
    if (!selectedTrack) {
      toast.error('Select a target track first');
      return;
    }

    if (!sourceTrigger) {
      toast.error('Select a source trigger track');
      return;
    }

    const sidechainConfig = {
      enabled,
      sourceTrigger,
      threshold,
      ratio,
      attack,
      release,
      amount
    };

    onUpdateTrack?.(selectedTrack.id, {
      sidechain: sidechainConfig
    });

    toast.success(`Sidechain applied: ${tracks.find(t => t.id === sourceTrigger)?.name} → ${selectedTrack.name}`);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Link2 className="w-4 h-4" />
          Sidechain
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
        <DialogHeader>
          <DialogTitle>Sidechain Compression</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-3 rounded-lg bg-[var(--bg)] border border-[var(--hair)]">
            <p className="text-xs text-[var(--muted)]">
              <strong>Target:</strong> {selectedTrack?.name || 'None selected'}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Label>Enable Sidechain</Label>
            <Switch checked={enabled} onCheckedChange={setEnabled} />
          </div>

          {enabled && (
            <>
              <div>
                <Label className="text-sm mb-2 block">Trigger Source</Label>
                <Select value={sourceTrigger} onValueChange={setSourceTrigger}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select trigger track..." />
                  </SelectTrigger>
                  <SelectContent>
                    {tracks.filter(t => t.id !== selectedTrack?.id).map(track => (
                      <SelectItem key={track.id} value={track.id}>
                        {track.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-[var(--muted)] mt-1">
                  When this track plays, it will duck the target track
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm">Threshold</Label>
                  <span className="text-xs font-mono">{threshold} dB</span>
                </div>
                <Slider
                  value={[threshold]}
                  onValueChange={([val]) => setThreshold(val)}
                  min={-60}
                  max={0}
                  step={1}
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm">Ratio</Label>
                  <span className="text-xs font-mono">{ratio}:1</span>
                </div>
                <Slider
                  value={[ratio]}
                  onValueChange={([val]) => setRatio(val)}
                  min={1}
                  max={20}
                  step={1}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-sm">Attack</Label>
                    <span className="text-xs font-mono">{attack} ms</span>
                  </div>
                  <Slider
                    value={[attack]}
                    onValueChange={([val]) => setAttack(val)}
                    min={1}
                    max={100}
                    step={1}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <Label className="text-sm">Release</Label>
                    <span className="text-xs font-mono">{release} ms</span>
                  </div>
                  <Slider
                    value={[release]}
                    onValueChange={([val]) => setRelease(val)}
                    min={10}
                    max={500}
                    step={10}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label className="text-sm">Amount (Dry/Wet)</Label>
                  <span className="text-xs font-mono">{amount}%</span>
                </div>
                <Slider
                  value={[amount]}
                  onValueChange={([val]) => setAmount(val)}
                  min={0}
                  max={100}
                  step={1}
                />
              </div>

              <Button
                onClick={applySidechain}
                className="w-full gap-2"
                disabled={!selectedTrack || !sourceTrigger}
              >
                <TrendingDown className="w-4 h-4" />
                Apply Sidechain
              </Button>

              <div className="p-3 rounded-lg bg-[var(--mint)]/10 border border-[var(--mint)]/30">
                <p className="text-xs text-[var(--mint)]">
                  <strong>Tip:</strong> Classic use case: Sidechain bass to kick drum for that pumping EDM/trap sound! 
                  Set kick as trigger source, bass as target.
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}