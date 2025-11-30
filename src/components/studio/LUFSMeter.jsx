import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, AlertCircle, CheckCircle } from "lucide-react";

export default function LUFSMeter({ tracks, isPlaying }) {
  const [lufs, setLufs] = useState({
    integrated: -14.0,
    shortTerm: -12.5,
    momentary: -10.2,
    truePeak: -1.0,
    dynamicRange: 8.5
  });

  const [warnings, setWarnings] = useState([]);

  useEffect(() => {
    if (!isPlaying) return;

    // Simulate LUFS measurement (in production, use actual audio analysis)
    const interval = setInterval(() => {
      const newLufs = {
        integrated: -14.0 + (Math.random() - 0.5) * 2,
        shortTerm: -12.5 + (Math.random() - 0.5) * 3,
        momentary: -10.2 + (Math.random() - 0.5) * 4,
        truePeak: -1.0 + (Math.random() - 0.5) * 0.5,
        dynamicRange: 8.5 + (Math.random() - 0.5) * 1
      };

      setLufs(newLufs);

      // Check for warnings
      const newWarnings = [];
      if (newLufs.truePeak > -1.0) {
        newWarnings.push('True peak exceeds -1.0 dBTP');
      }
      if (newLufs.integrated > -14.0) {
        newWarnings.push('Too loud for streaming platforms');
      }
      if (newLufs.dynamicRange < 6) {
        newWarnings.push('Low dynamic range - over-compressed');
      }
      setWarnings(newWarnings);
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const getTargetInfo = (platform) => {
    const targets = {
      spotify: { lufs: -14, peak: -1.0 },
      youtube: { lufs: -14, peak: -1.0 },
      apple: { lufs: -16, peak: -1.0 },
      tidal: { lufs: -14, peak: -1.0 },
      soundcloud: { lufs: -14, peak: -1.0 }
    };
    return targets[platform] || targets.spotify;
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          Loudness
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Loudness Meter (LUFS)</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main Meters */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
              <div className="text-sm text-[var(--muted)] mb-2">Integrated Loudness</div>
              <div className="text-3xl font-bold">
                {lufs.integrated.toFixed(1)} <span className="text-lg text-[var(--muted)]">LUFS</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
              <div className="text-sm text-[var(--muted)] mb-2">True Peak</div>
              <div className="text-3xl font-bold">
                {lufs.truePeak.toFixed(1)} <span className="text-lg text-[var(--muted)]">dBTP</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
              <div className="text-sm text-[var(--muted)] mb-2">Short Term</div>
              <div className="text-2xl font-bold">
                {lufs.shortTerm.toFixed(1)} <span className="text-sm text-[var(--muted)]">LUFS</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
              <div className="text-sm text-[var(--muted)] mb-2">Dynamic Range</div>
              <div className="text-2xl font-bold">
                {lufs.dynamicRange.toFixed(1)} <span className="text-sm text-[var(--muted)]">LU</span>
              </div>
            </div>
          </div>

          {/* Warnings */}
          {warnings.length > 0 && (
            <div className="space-y-2">
              {warnings.map((warning, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/30"
                >
                  <AlertCircle className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm">{warning}</span>
                </div>
              ))}
            </div>
          )}

          {/* Platform Targets */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Streaming Platform Targets</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['spotify', 'youtube', 'apple', 'tidal'].map(platform => {
                const target = getTargetInfo(platform);
                const isGood = Math.abs(lufs.integrated - target.lufs) < 2 && lufs.truePeak < target.peak;
                
                return (
                  <div
                    key={platform}
                    className="flex items-center justify-between p-2 rounded bg-[var(--surface-2)]"
                  >
                    <span className="capitalize">{platform}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[var(--muted)]">{target.lufs} LUFS</span>
                      {isGood ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertCircle className="w-3 h-3 text-yellow-500" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {!isPlaying && (
            <div className="text-center text-sm text-[var(--muted)] py-4">
              Play your track to measure loudness
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}