import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, ArrowRightLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function HarmonizerPanel({ currentTracks, onHarmonize }) {
  const [mode, setMode] = useState('melody-to-chords');

  const handleHarmonize = () => {
    const melody = currentTracks.find(t => t.type === 'melody');
    const chords = currentTracks.find(t => t.type === 'chords');

    if (mode === 'melody-to-chords') {
      if (!melody || melody.notes.length === 0) {
        toast.error('No melody to harmonize');
        return;
      }
      onHarmonize('melody-to-chords', melody);
    } else {
      if (!chords || chords.notes.length === 0) {
        toast.error('No chords to create melody from');
        return;
      }
      onHarmonize('chords-to-melody', chords);
    }
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Wand2 className="w-5 h-5 text-cyan-400" />
          AI Harmonizer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs value={mode} onValueChange={setMode}>
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="melody-to-chords">Melody → Chords</TabsTrigger>
            <TabsTrigger value="chords-to-melody">Chords → Melody</TabsTrigger>
          </TabsList>
          
          <TabsContent value="melody-to-chords" className="mt-4">
            <p className="text-sm text-slate-400 mb-3">
              Analyze your melody and generate fitting chord progressions
            </p>
          </TabsContent>
          
          <TabsContent value="chords-to-melody" className="mt-4">
            <p className="text-sm text-slate-400 mb-3">
              Create a melody that fits perfectly over your chord progression
            </p>
          </TabsContent>
        </Tabs>

        <Button
          onClick={handleHarmonize}
          className="w-full bg-cyan-600 hover:bg-cyan-700"
        >
          <ArrowRightLeft className="w-4 h-4 mr-2" />
          Generate {mode === 'melody-to-chords' ? 'Chords' : 'Melody'}
        </Button>
      </CardContent>
    </Card>
  );
}