import React from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Square, SkipBack, Download } from "lucide-react";

export default function TransportBar({ 
  isPlaying, 
  bpm, 
  onPlay, 
  onPause, 
  onStop, 
  onBpmChange,
  onExport,
  currentBeat = 0,
  totalBeats = 32
}) {
  return (
    <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-800 rounded-xl p-4">
      <div className="flex items-center justify-between gap-6">
        {/* Transport Controls */}
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            onClick={onStop}
            className="text-slate-400 hover:text-white"
          >
            <SkipBack className="w-4 h-4" />
          </Button>
          
          {isPlaying ? (
            <Button
              size="icon"
              onClick={onPause}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Pause className="w-5 h-5" />
            </Button>
          ) : (
            <Button
              size="icon"
              onClick={onPlay}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="w-5 h-5 ml-0.5" />
            </Button>
          )}
          
          <Button
            size="icon"
            variant="ghost"
            onClick={onStop}
            className="text-slate-400 hover:text-white"
          >
            <Square className="w-4 h-4" />
          </Button>
        </div>

        {/* Timeline */}
        <div className="flex-1">
          <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-100"
              style={{ width: `${(currentBeat / totalBeats) * 100}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>Beat {Math.floor(currentBeat)}</span>
            <span>{Math.floor(currentBeat / 4)} / {Math.floor(totalBeats / 4)} bars</span>
          </div>
        </div>

        {/* BPM Control */}
        <div className="flex items-center gap-3 min-w-[180px]">
          <span className="text-sm text-slate-400">BPM</span>
          <div className="flex items-center gap-2 flex-1">
            <Slider
              value={[bpm]}
              onValueChange={(val) => onBpmChange(val[0])}
              min={60}
              max={200}
              step={1}
              className="flex-1"
            />
            <span className="text-sm font-mono text-white w-12 text-right">{bpm}</span>
          </div>
        </div>

        {/* Export */}
        <Button
          onClick={onExport}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}