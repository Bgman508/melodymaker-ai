import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function Metronome({ bpm, isPlaying, currentBeat }) {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolume] = useState(50);
  const [audioContext, setAudioContext] = useState(null);
  const [lastBeat, setLastBeat] = useState(-1);

  useEffect(() => {
    if (!audioContext && enabled) {
      setAudioContext(new (window.AudioContext || window.webkitAudioContext)());
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled || !isPlaying || !audioContext) return;

    const currentWholeBeat = Math.floor(currentBeat);
    const beatInBar = currentWholeBeat % 4;

    if (currentWholeBeat !== lastBeat) {
      setLastBeat(currentWholeBeat);
      playClick(beatInBar === 0); // Accent on downbeat
    }
  }, [currentBeat, enabled, isPlaying, audioContext, lastBeat]);

  const playClick = (isAccent) => {
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.value = isAccent ? 1200 : 800;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime((volume / 100) * 0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(now);
    oscillator.stop(now + 0.05);
  };

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
      <Button
        variant={enabled ? "default" : "outline"}
        size="sm"
        onClick={() => setEnabled(!enabled)}
        className="gap-2"
      >
        {enabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        Click
      </Button>
      
      {enabled && (
        <div className="flex items-center gap-2 flex-1">
          <VolumeX className="w-3 h-3 text-[var(--muted)]" />
          <Slider
            value={[volume]}
            onValueChange={(val) => setVolume(val[0])}
            max={100}
            step={1}
            className="w-24"
          />
          <Volume2 className="w-3 h-3 text-[var(--muted)]" />
        </div>
      )}
    </div>
  );
}