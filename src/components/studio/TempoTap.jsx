import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";

export default function TempoTap({ onBpmDetected }) {
  const [taps, setTaps] = useState([]);
  const [detectedBpm, setDetectedBpm] = useState(null);
  const timeoutRef = useRef(null);

  const handleTap = () => {
    const now = Date.now();
    const newTaps = [...taps, now];

    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Reset if no tap in 2 seconds
    timeoutRef.current = setTimeout(() => {
      setTaps([]);
      setDetectedBpm(null);
    }, 2000);

    setTaps(newTaps);

    // Calculate BPM from last 4 taps
    if (newTaps.length >= 2) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgInterval);
      
      setDetectedBpm(bpm);
      
      if (newTaps.length >= 4) {
        onBpmDetected?.(bpm);
        setTaps([]);
      }
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleTap}
        className="gap-2"
      >
        <Music className="w-4 h-4" />
        Tap Tempo
      </Button>
      {detectedBpm && (
        <span className="text-sm text-[var(--muted)] font-mono">
          {detectedBpm} BPM ({taps.length}/4)
        </span>
      )}
    </div>
  );
}