import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings2, Lock, Unlock } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export default function AdvancedControls({ settings, onUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
          <Settings2 className="w-4 h-4 mr-2" />
          Advanced Settings
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-4 space-y-6">
        {/* Swing Control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Swing Amount</Label>
            <span className="text-xs text-slate-500">{Math.round(settings.swing * 100)}%</span>
          </div>
          <Slider
            value={[settings.swing * 100]}
            onValueChange={(val) => onUpdate({ swing: val[0] / 100 })}
            min={50}
            max={75}
            step={1}
            className="w-full"
          />
          <p className="text-xs text-slate-500">50% = straight, 58% = typical lo-fi</p>
        </div>

        {/* Humanization Profile */}
        <div className="space-y-2">
          <Label className="text-slate-300">Humanization</Label>
          <Select value={settings.humanize} onValueChange={(val) => onUpdate({ humanize: val })}>
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="tight_pop">Tight Pop</SelectItem>
              <SelectItem value="session_drummer">Session Drummer</SelectItem>
              <SelectItem value="drunk_lofi">Drunk Lo-fi</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Chord Extensions */}
        <div className="space-y-2">
          <Label className="text-slate-300">Chord Voicing</Label>
          <Select value={settings.chordExt} onValueChange={(val) => onUpdate({ chordExt: val })}>
            <SelectTrigger className="bg-slate-800 border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="basic">Basic Triads</SelectItem>
              <SelectItem value="seventh">7th Chords</SelectItem>
              <SelectItem value="ninth">9th Chords</SelectItem>
              <SelectItem value="add9">Add9</SelectItem>
              <SelectItem value="sus2">Sus2</SelectItem>
              <SelectItem value="sus4">Sus4</SelectItem>
              <SelectItem value="eleventh">11th</SelectItem>
              <SelectItem value="thirteenth">13th</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 808 Slides */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">808 Slides</Label>
            <Switch
              checked={settings.slides808}
              onCheckedChange={(val) => onUpdate({ slides808: val })}
            />
          </div>
          
          {settings.slides808 && (
            <div className="pl-4 space-y-3 border-l-2 border-slate-700">
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Glide Depth (semitones)</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={settings.glideDepth}
                  onChange={(e) => onUpdate({ glideDepth: parseInt(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-xs text-slate-400">Glide Steps</Label>
                <Input
                  type="number"
                  min={2}
                  max={16}
                  value={settings.glideSteps}
                  onChange={(e) => onUpdate({ glideSteps: parseInt(e.target.value) })}
                  className="bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Seed Locking */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-slate-300">Seed (for deterministic generation)</Label>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onUpdate({ seedLocked: !settings.seedLocked })}
              className="h-8 w-8"
            >
              {settings.seedLocked ? 
                <Lock className="w-4 h-4 text-yellow-500" /> : 
                <Unlock className="w-4 h-4 text-slate-500" />
              }
            </Button>
          </div>
          <Input
            type="number"
            value={settings.seed}
            onChange={(e) => onUpdate({ seed: parseInt(e.target.value) })}
            disabled={!settings.seedLocked}
            className="bg-slate-800 border-slate-700 text-white"
          />
        </div>

        {/* Track Locks */}
        <div className="space-y-2">
          <Label className="text-slate-300">Lock Individual Tracks</Label>
          <div className="grid grid-cols-2 gap-2">
            {['melody', 'chords', 'bass', 'drums'].map(track => (
              <div key={track} className="flex items-center justify-between p-2 rounded bg-slate-800/50">
                <span className="text-xs text-slate-400 capitalize">{track}</span>
                <Switch
                  checked={settings.trackLocks?.[track] || false}
                  onCheckedChange={(val) => onUpdate({ 
                    trackLocks: { ...settings.trackLocks, [track]: val }
                  })}
                />
              </div>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}