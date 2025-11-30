import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export default function AdvancedSettings({ settings, onUpdate }) {
  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white">Advanced Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Time Signature */}
        <div className="space-y-2">
          <Label className="text-slate-300">Time Signature</Label>
          <Select 
            value={settings.timeSignature || '4/4'}
            onValueChange={(val) => onUpdate({ ...settings, timeSignature: val })}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4/4">4/4 (Common Time)</SelectItem>
              <SelectItem value="3/4">3/4 (Waltz)</SelectItem>
              <SelectItem value="6/8">6/8 (Compound)</SelectItem>
              <SelectItem value="7/8">7/8 (Odd Meter)</SelectItem>
              <SelectItem value="5/4">5/4 (Take Five)</SelectItem>
              <SelectItem value="12/8">12/8 (Slow Shuffle)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Voicing Type */}
        <div className="space-y-2">
          <Label className="text-slate-300">Chord Voicing</Label>
          <Select 
            value={settings.voicing || 'basic'}
            onValueChange={(val) => onUpdate({ ...settings, voicing: val })}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Root Position</SelectItem>
              <SelectItem value="drop2">Drop-2 (Jazz)</SelectItem>
              <SelectItem value="drop3">Drop-3 (Wide)</SelectItem>
              <SelectItem value="upperStructure">Upper Structure</SelectItem>
              <SelectItem value="quartal">Quartal (Modern)</SelectItem>
              <SelectItem value="cluster">Cluster (Ambient)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Articulation */}
        <div className="space-y-2">
          <Label className="text-slate-300">Default Articulation</Label>
          <Select 
            value={settings.articulation || 'legato'}
            onValueChange={(val) => onUpdate({ ...settings, articulation: val })}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="staccato">Staccato (Short)</SelectItem>
              <SelectItem value="legato">Legato (Smooth)</SelectItem>
              <SelectItem value="tenuto">Tenuto (Full Value)</SelectItem>
              <SelectItem value="marcato">Marcato (Emphasized)</SelectItem>
              <SelectItem value="accent">Accent (Strong)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Phrase Shape */}
        <div className="space-y-2">
          <Label className="text-slate-300">Phrase Shape</Label>
          <Select 
            value={settings.phraseShape || 'arch'}
            onValueChange={(val) => onUpdate({ ...settings, phraseShape: val })}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rising">Rising (Crescendo)</SelectItem>
              <SelectItem value="falling">Falling (Decrescendo)</SelectItem>
              <SelectItem value="arch">Arch (Peak in Middle)</SelectItem>
              <SelectItem value="valley">Valley (Dip in Middle)</SelectItem>
              <SelectItem value="terrace">Terrace (Stepped)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bass Pattern */}
        <div className="space-y-2">
          <Label className="text-slate-300">Bass Pattern</Label>
          <Select 
            value={settings.bassPattern || 'root'}
            onValueChange={(val) => onUpdate({ ...settings, bassPattern: val })}
          >
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="root">Root Notes</SelectItem>
              <SelectItem value="walking">Walking Bass (Jazz)</SelectItem>
              <SelectItem value="octaveJump">Octave Jumps</SelectItem>
              <SelectItem value="pedal">Pedal Tone</SelectItem>
              <SelectItem value="alberti">Alberti Bass</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Safety Rails */}
        <div className="space-y-3 pt-4 border-t border-slate-700">
          <Label className="text-slate-300">Safety Rails</Label>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Avoid Parallel 5ths/8ves</span>
            <Switch
              checked={settings.avoidParallels || false}
              onCheckedChange={(val) => onUpdate({ ...settings, avoidParallels: val })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Keep in Vocal Range</span>
            <Switch
              checked={settings.vocalRange || false}
              onCheckedChange={(val) => onUpdate({ ...settings, vocalRange: val })}
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Add Grace Notes</span>
            <Switch
              checked={settings.graceNotes || false}
              onCheckedChange={(val) => onUpdate({ ...settings, graceNotes: val })}
            />
          </div>
        </div>

        {/* Microtiming */}
        <div className="space-y-2 pt-4 border-t border-slate-700">
          <Label className="text-slate-300">Shuffle Depth</Label>
          <div className="flex items-center gap-3">
            <Slider
              value={[settings.shuffleDepth || 0]}
              onValueChange={(val) => onUpdate({ ...settings, shuffleDepth: val[0] })}
              min={0}
              max={100}
              step={5}
              className="flex-1"
            />
            <span className="text-sm text-slate-400 w-12 text-right">
              {settings.shuffleDepth || 0}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}