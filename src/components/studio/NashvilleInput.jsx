import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Hash, Play } from "lucide-react";

export default function NashvilleInput({ onGenerate }) {
  const [notation, setNotation] = useState('1 5 6 4');
  const [key, setKey] = useState('C');

  const examples = [
    { name: 'Pop', notation: '1 5 6 4', desc: 'I-V-vi-IV' },
    { name: 'Jazz', notation: '2 5 1', desc: 'ii-V-I' },
    { name: 'Blues', notation: '1 1 1 1 4 4 1 1 5 4 1 5', desc: '12-bar' },
    { name: 'Canon', notation: '1 5 6 3 4 1 4 5', desc: 'Pachelbel' }
  ];

  const handleGenerate = () => {
    onGenerate({ notation, key });
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Hash className="w-5 h-5" />
          Nashville Numbers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-slate-300">Chord Progression</Label>
          <Input
            value={notation}
            onChange={(e) => setNotation(e.target.value)}
            placeholder="e.g., 1 5 6 4"
            className="bg-slate-800 border-slate-700 font-mono"
          />
          <p className="text-xs text-slate-400">
            Use numbers 1-7 for chords. Add modifiers: . (dotted), + (half beat), m (minor), 7 (seventh)
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Key</Label>
          <Input
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="C"
            className="bg-slate-800 border-slate-700 w-20"
          />
        </div>

        <Button
          onClick={handleGenerate}
          className="w-full bg-indigo-600 hover:bg-indigo-700"
        >
          <Play className="w-4 h-4 mr-2" />
          Generate from Numbers
        </Button>

        <div className="space-y-2">
          <Label className="text-slate-400 text-xs">Examples</Label>
          <div className="grid grid-cols-2 gap-2">
            {examples.map(ex => (
              <Button
                key={ex.name}
                variant="outline"
                size="sm"
                onClick={() => setNotation(ex.notation)}
                className="justify-start border-slate-700"
              >
                <div className="text-left">
                  <div className="font-semibold text-xs">{ex.name}</div>
                  <div className="text-xs text-slate-500">{ex.desc}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}