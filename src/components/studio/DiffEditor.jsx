import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitCompare, Check, X } from "lucide-react";

export default function DiffEditor({ previousTracks, currentTracks, onAcceptNote, onRejectNote }) {
  if (!previousTracks || !currentTracks) return null;

  const calculateDiff = () => {
    const diffs = [];
    
    currentTracks.forEach(currentTrack => {
      const prevTrack = previousTracks.find(t => t.id === currentTrack.id);
      
      if (!prevTrack) {
        // Entire track is new
        currentTrack.notes.forEach(note => {
          diffs.push({
            trackId: currentTrack.id,
            trackName: currentTrack.name,
            type: 'added',
            note
          });
        });
        return;
      }

      // Find added notes
      currentTrack.notes.forEach(note => {
        const exists = prevTrack.notes.some(pn => 
          Math.abs(pn.start - note.start) < 0.01 && pn.pitch === note.pitch
        );
        if (!exists) {
          diffs.push({
            trackId: currentTrack.id,
            trackName: currentTrack.name,
            type: 'added',
            note
          });
        }
      });

      // Find removed notes
      prevTrack.notes.forEach(note => {
        const exists = currentTrack.notes.some(cn => 
          Math.abs(cn.start - note.start) < 0.01 && cn.pitch === note.pitch
        );
        if (!exists) {
          diffs.push({
            trackId: currentTrack.id,
            trackName: currentTrack.name,
            type: 'removed',
            note
          });
        }
      });
    });

    return diffs;
  };

  const diffs = calculateDiff();

  if (diffs.length === 0) {
    return (
      <Card className="bg-slate-900/50 border-slate-800">
        <CardContent className="p-6 text-center text-slate-500">
          No changes detected
        </CardContent>
      </Card>
    );
  }

  const noteName = (pitch) => {
    const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const octave = Math.floor(pitch / 12) - 1;
    return `${names[pitch % 12]}${octave}`;
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <GitCompare className="w-5 h-5" />
          Diff Editor ({diffs.length} changes)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        {diffs.map((diff, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border ${
              diff.type === 'added'
                ? 'border-green-700/50 bg-green-900/10'
                : 'border-red-700/50 bg-red-900/10'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge
                  className={
                    diff.type === 'added'
                      ? 'bg-green-900/30 text-green-400'
                      : 'bg-red-900/30 text-red-400'
                  }
                >
                  {diff.type === 'added' ? '+' : '−'}
                </Badge>
                <div>
                  <div className="text-sm font-medium text-white">
                    {diff.trackName}
                  </div>
                  <div className="text-xs text-slate-400">
                    {noteName(diff.note.pitch)} at beat {diff.note.start.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                {diff.type === 'added' ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onAcceptNote(diff)}
                      className="h-7 w-7 p-0 text-green-400 hover:bg-green-900/20"
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onRejectNote(diff)}
                      className="h-7 w-7 p-0 text-red-400 hover:bg-red-900/20"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onAcceptNote(diff)}
                    className="h-7 px-2 text-xs text-slate-400 hover:bg-slate-800"
                  >
                    Restore
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}