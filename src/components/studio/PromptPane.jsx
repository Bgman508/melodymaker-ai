import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Lock, Unlock, Upload, Shuffle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PromptPane({ 
  onGenerate, 
  onSelectiveRegen,
  onHarmonize,
  onStyleUpload,
  loading,
  seedSettings,
  onSeedUpdate 
}) {
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef(null);

  const quickPrompts = [
    "melody only, lofi, 8 bars, key A minor, sparse, low energy, motif: C5 D5 E5, export stems",
    "trap soul, 140 bpm, key F# minor, structure: intro(4), hook(8), verse(8), hook(8), 808 slides, glide depth 7000, glide steps 12, high energy, hook up a whole step, export stems",
    "r&b, 96 bpm, key D minor, chords only, 16 bars, add9, medium energy, export stems"
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) onStyleUpload(file);
  };

  const regenerationActions = [
    { id: 'melody', label: 'Regenerate Melody', icon: '🎵' },
    { id: 'drums', label: 'Replace Drums', icon: '🥁' },
    { id: 'chords', label: 'Reharmonize', icon: '🎹' },
    { id: 'bass', label: 'Re-808 Only', icon: '🔊' }
  ];

  const harmonizerActions = [
    { id: 'melody-to-chords', label: 'Harmonize my Melody' },
    { id: 'chords-to-melody', label: 'Melody over Chords' }
  ];

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Prompt & Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prompt Input */}
        <div className="space-y-3">
          <Label className="text-slate-300">Composition Prompt</Label>
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your composition... (e.g., 'trap soul, 140 bpm, key F# minor, structure: intro(4), verse(8), hook(8), 808 slides, high energy')"
            className="min-h-[120px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 font-mono text-sm"
          />
          
          <Button
            onClick={() => onGenerate(prompt)}
            disabled={!prompt.trim() || loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12"
            size="lg"
          >
            {loading ? (
              <>Generating...</>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Composition
              </>
            )}
          </Button>
        </div>

        {/* Quick Prompts */}
        <div className="space-y-2">
          <Label className="text-slate-300 text-xs">Quick Prompts</Label>
          <div className="space-y-2">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => setPrompt(qp)}
                className="w-full text-left px-3 py-2 text-xs rounded-lg bg-slate-800/30 hover:bg-slate-700/50 border border-slate-700/50 text-slate-300 transition-colors font-mono"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>

        {/* Seed Controls */}
        <div className="space-y-3 p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Global Seed</Label>
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onSeedUpdate({ seed: Math.floor(Math.random() * 100000) })}
                className="h-8 w-8"
              >
                <Shuffle className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onSeedUpdate({ seedLocked: !seedSettings.seedLocked })}
                className="h-8 w-8"
              >
                {seedSettings.seedLocked ? 
                  <Lock className="w-4 h-4 text-yellow-500" /> : 
                  <Unlock className="w-4 h-4 text-slate-500" />
                }
              </Button>
            </div>
          </div>
          <Input
            type="number"
            value={seedSettings.seed}
            onChange={(e) => onSeedUpdate({ seed: parseInt(e.target.value) })}
            className="bg-slate-800 border-slate-700 text-white font-mono"
          />

          {/* Per-Track Locks */}
          <div className="space-y-2 pt-2 border-t border-slate-700/50">
            <Label className="text-slate-400 text-xs">Lock Individual Tracks</Label>
            <div className="grid grid-cols-2 gap-2">
              {['melody', 'chords', 'bass', 'drums'].map(track => (
                <div key={track} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
                  <span className="text-xs text-slate-400 capitalize">{track}</span>
                  <Switch
                    checked={seedSettings.trackLocks?.[track] || false}
                    onCheckedChange={(val) => onSeedUpdate({ 
                      trackLocks: { ...seedSettings.trackLocks, [track]: val }
                    })}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Regenerate / Harmonize / Style */}
        <Tabs defaultValue="regen" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800">
            <TabsTrigger value="regen">Regenerate</TabsTrigger>
            <TabsTrigger value="harmonize">Harmonize</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
          </TabsList>

          <TabsContent value="regen" className="space-y-2 mt-4">
            {regenerationActions.map(action => (
              <Button
                key={action.id}
                onClick={() => onSelectiveRegen(action.id)}
                disabled={loading}
                variant="outline"
                className="w-full justify-start border-slate-700 hover:bg-slate-800"
              >
                <span className="mr-2">{action.icon}</span>
                {action.label}
              </Button>
            ))}
          </TabsContent>

          <TabsContent value="harmonize" className="space-y-2 mt-4">
            {harmonizerActions.map(action => (
              <Button
                key={action.id}
                onClick={() => onHarmonize(action.id)}
                disabled={loading}
                variant="outline"
                className="w-full justify-start border-slate-700 hover:bg-slate-800"
              >
                {action.label}
              </Button>
            ))}
          </TabsContent>

          <TabsContent value="style" className="space-y-3 mt-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".mid,.midi"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full border-slate-700"
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Reference MIDI
            </Button>
            <p className="text-xs text-slate-500">
              Drag & drop a MIDI file to learn its style patterns (swing, density, articulation)
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}