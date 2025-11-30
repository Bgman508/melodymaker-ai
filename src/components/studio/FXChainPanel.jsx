import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronUp, Sliders } from "lucide-react";
import { toast } from "sonner";

const FX_TYPES = [
  { id: 'reverb', name: 'Reverb', icon: '🌊' },
  { id: 'delay', name: 'Delay', icon: '⏱️' },
  { id: 'eq', name: 'EQ', icon: '📊' },
  { id: 'compressor', name: 'Compressor', icon: '🔘' },
  { id: 'distortion', name: 'Distortion', icon: '⚡' },
  { id: 'chorus', name: 'Chorus', icon: '🌀' },
  { id: 'filter', name: 'Filter', icon: '🎚️' }
];

function FXUnit({ fx, onUpdate, onRemove, onMoveUp, onMoveDown, isFirst, isLast }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-[var(--hair)] rounded-lg p-3 bg-[var(--surface-2)]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={fx.enabled}
            onChange={(e) => onUpdate({ ...fx, enabled: e.target.checked })}
            className="w-4 h-4 rounded"
          />
          <span className="text-sm font-semibold">{fx.icon} {fx.name}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="h-6 w-6 p-0"
          >
            {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={isFirst}
            className="h-6 w-6 p-0"
          >
            ↑
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={isLast}
            className="h-6 w-6 p-0"
          >
            ↓
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-6 w-6 p-0 text-[var(--coral)]"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="space-y-2 mt-3 pt-3 border-t border-[var(--hair)]">
          {fx.type === 'reverb' && (
            <>
              <div>
                <label className="text-xs text-[var(--muted)]">Room Size: {fx.params.size}%</label>
                <Slider
                  value={[fx.params.size]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, size: val[0] } })}
                  max={100}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Decay: {fx.params.decay}%</label>
                <Slider
                  value={[fx.params.decay]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, decay: val[0] } })}
                  max={100}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Mix: {fx.params.mix}%</label>
                <Slider
                  value={[fx.params.mix]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, mix: val[0] } })}
                  max={100}
                />
              </div>
            </>
          )}

          {fx.type === 'delay' && (
            <>
              <div>
                <label className="text-xs text-[var(--muted)]">Time: {fx.params.time}ms</label>
                <Slider
                  value={[fx.params.time]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, time: val[0] } })}
                  max={2000}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Feedback: {fx.params.feedback}%</label>
                <Slider
                  value={[fx.params.feedback]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, feedback: val[0] } })}
                  max={100}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Mix: {fx.params.mix}%</label>
                <Slider
                  value={[fx.params.mix]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, mix: val[0] } })}
                  max={100}
                />
              </div>
            </>
          )}

          {fx.type === 'eq' && (
            <>
              <div>
                <label className="text-xs text-[var(--muted)]">Low: {fx.params.low > 0 ? '+' : ''}{fx.params.low}dB</label>
                <Slider
                  value={[fx.params.low + 12]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, low: val[0] - 12 } })}
                  max={24}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Mid: {fx.params.mid > 0 ? '+' : ''}{fx.params.mid}dB</label>
                <Slider
                  value={[fx.params.mid + 12]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, mid: val[0] - 12 } })}
                  max={24}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">High: {fx.params.high > 0 ? '+' : ''}{fx.params.high}dB</label>
                <Slider
                  value={[fx.params.high + 12]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, high: val[0] - 12 } })}
                  max={24}
                />
              </div>
            </>
          )}

          {fx.type === 'compressor' && (
            <>
              <div>
                <label className="text-xs text-[var(--muted)]">Threshold: {fx.params.threshold}dB</label>
                <Slider
                  value={[fx.params.threshold + 60]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, threshold: val[0] - 60 } })}
                  max={60}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Ratio: {fx.params.ratio}:1</label>
                <Slider
                  value={[fx.params.ratio]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, ratio: val[0] } })}
                  min={1}
                  max={20}
                  step={0.5}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Attack: {fx.params.attack}ms</label>
                <Slider
                  value={[fx.params.attack]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, attack: val[0] } })}
                  max={100}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Release: {fx.params.release}ms</label>
                <Slider
                  value={[fx.params.release]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, release: val[0] } })}
                  max={500}
                />
              </div>
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={fx.params.sidechain}
                  onChange={(e) => onUpdate({ ...fx, params: { ...fx.params, sidechain: e.target.checked } })}
                  className="w-4 h-4 rounded"
                />
                <label className="text-xs">Sidechain</label>
              </div>
            </>
          )}

          {fx.type === 'distortion' && (
            <>
              <div>
                <label className="text-xs text-[var(--muted)]">Drive: {fx.params.drive}%</label>
                <Slider
                  value={[fx.params.drive]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, drive: val[0] } })}
                  max={100}
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted)]">Mix: {fx.params.mix}%</label>
                <Slider
                  value={[fx.params.mix]}
                  onValueChange={(val) => onUpdate({ ...fx, params: { ...fx.params, mix: val[0] } })}
                  max={100}
                />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function FXChainPanel({ track, onUpdateTrack }) {
  const [fxChain, setFxChain] = useState(track?.fxChain || []);

  const addFX = (fxType) => {
    const fxTemplate = FX_TYPES.find(f => f.id === fxType);
    const defaultParams = {
      reverb: { size: 50, decay: 50, mix: 30 },
      delay: { time: 500, feedback: 40, mix: 25 },
      eq: { low: 0, mid: 0, high: 0 },
      compressor: { threshold: -20, ratio: 4, attack: 10, release: 100, sidechain: false },
      distortion: { drive: 30, mix: 50 },
      chorus: { rate: 2, depth: 50, mix: 40 },
      filter: { cutoff: 5000, resonance: 0 }
    };

    const newFX = {
      id: Date.now(),
      type: fxType,
      name: fxTemplate.name,
      icon: fxTemplate.icon,
      enabled: true,
      params: defaultParams[fxType]
    };

    const updated = [...fxChain, newFX];
    setFxChain(updated);
    onUpdateTrack?.(track.id, { fxChain: updated });
    toast.success(`Added ${fxTemplate.name}`);
  };

  const updateFX = (index, updatedFX) => {
    const updated = [...fxChain];
    updated[index] = updatedFX;
    setFxChain(updated);
    onUpdateTrack?.(track.id, { fxChain: updated });
  };

  const removeFX = (index) => {
    const updated = fxChain.filter((_, i) => i !== index);
    setFxChain(updated);
    onUpdateTrack?.(track.id, { fxChain: updated });
    toast.success('FX removed');
  };

  const moveFX = (index, direction) => {
    if ((direction === -1 && index === 0) || (direction === 1 && index === fxChain.length - 1)) return;
    const updated = [...fxChain];
    [updated[index], updated[index + direction]] = [updated[index + direction], updated[index]];
    setFxChain(updated);
    onUpdateTrack?.(track.id, { fxChain: updated });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sliders className="w-4 h-4" />
          FX Chain ({fxChain.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>FX Chain: {track?.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {fxChain.map((fx, idx) => (
            <FXUnit
              key={fx.id}
              fx={fx}
              onUpdate={(updated) => updateFX(idx, updated)}
              onRemove={() => removeFX(idx)}
              onMoveUp={() => moveFX(idx, -1)}
              onMoveDown={() => moveFX(idx, 1)}
              isFirst={idx === 0}
              isLast={idx === fxChain.length - 1}
            />
          ))}

          {fxChain.length === 0 && (
            <div className="text-center py-8 text-[var(--muted)]">
              No FX added yet
            </div>
          )}

          <Select onValueChange={addFX}>
            <SelectTrigger>
              <SelectValue placeholder="+ Add FX" />
            </SelectTrigger>
            <SelectContent>
              {FX_TYPES.map(fx => (
                <SelectItem key={fx.id} value={fx.id}>
                  {fx.icon} {fx.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </DialogContent>
    </Dialog>
  );
}