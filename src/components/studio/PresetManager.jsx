import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, FolderOpen, Trash2, Download, Upload } from "lucide-react";
import { toast } from "sonner";

export default function PresetManager({ track, onLoadPreset }) {
  const [presets, setPresets] = useState(() => {
    const saved = localStorage.getItem('track-presets');
    return saved ? JSON.parse(saved) : [
      {
        id: 'trap-lead',
        name: 'Trap Lead',
        type: 'lead',
        program: 81,
        volume: 0.8,
        pan: 0,
        fx: []
      },
      {
        id: 'lofi-keys',
        name: 'Lo-Fi Keys',
        type: 'melody',
        program: 4,
        volume: 0.7,
        pan: 0,
        fx: []
      }
    ];
  });

  const [presetName, setPresetName] = useState('');

  const savePreset = () => {
    if (!track) {
      toast.error('No track selected');
      return;
    }

    if (!presetName.trim()) {
      toast.error('Enter a preset name');
      return;
    }

    const newPreset = {
      id: Date.now().toString(),
      name: presetName,
      type: track.type,
      program: track.program,
      volume: track.volume,
      pan: track.pan,
      fx: track.fx || [],
      automation: track.automation || {}
    };

    const updated = [...presets, newPreset];
    setPresets(updated);
    localStorage.setItem('track-presets', JSON.stringify(updated));
    
    setPresetName('');
    toast.success(`Preset "${newPreset.name}" saved!`);
  };

  const loadPreset = (preset) => {
    onLoadPreset?.({
      program: preset.program,
      volume: preset.volume,
      pan: preset.pan,
      fx: preset.fx,
      automation: preset.automation
    });
    toast.success(`Loaded preset: ${preset.name}`);
  };

  const deletePreset = (id) => {
    const updated = presets.filter(p => p.id !== id);
    setPresets(updated);
    localStorage.setItem('track-presets', JSON.stringify(updated));
    toast.info('Preset deleted');
  };

  const exportPresets = () => {
    const dataStr = JSON.stringify(presets, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'track-presets.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Presets exported!');
  };

  const importPresets = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        const updated = [...presets, ...imported];
        setPresets(updated);
        localStorage.setItem('track-presets', JSON.stringify(updated));
        toast.success(`Imported ${imported.length} presets!`);
      } catch (error) {
        toast.error('Invalid preset file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderOpen className="w-4 h-4" />
          Presets
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Preset Manager</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Save Preset */}
          <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <h3 className="font-semibold mb-3">Save Current Track</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Preset name..."
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && savePreset()}
              />
              <Button onClick={savePreset} disabled={!track} className="gap-2">
                <Save className="w-4 h-4" />
                Save
              </Button>
            </div>
          </div>

          {/* Preset List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Saved Presets ({presets.length})</h3>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={exportPresets}>
                  <Download className="w-4 h-4" />
                </Button>
                <label>
                  <Button variant="ghost" size="sm" asChild>
                    <span><Upload className="w-4 h-4" /></span>
                  </Button>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importPresets}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {presets.map(preset => (
                <div
                  key={preset.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--hover)] border border-[var(--hair)]"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{preset.name}</h4>
                    <p className="text-xs text-[var(--muted)]">
                      {preset.type} • Program {preset.program}
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadPreset(preset)}
                    >
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deletePreset(preset.id)}
                      className="text-[var(--coral)]"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {presets.length === 0 && (
                <div className="text-center py-8 text-[var(--muted)]">
                  No presets saved yet
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}