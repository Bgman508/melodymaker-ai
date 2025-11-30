import React, { useRef, useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Activity } from "lucide-react";

export default function SpectralAnalyzer({ audioEngine, isPlaying }) {
  const canvasRef = useRef(null);
  const analyzerRef = useRef(null);
  const animationRef = useRef(null);
  const [showLabels, setShowLabels] = useState(true);

  useEffect(() => {
    if (!audioEngine?.audioContext) return;

    // Create analyzer
    const analyzer = audioEngine.audioContext.createAnalyser();
    analyzer.fftSize = 2048;
    analyzer.smoothingTimeConstant = 0.8;
    
    // Connect to audio context destination
    try {
      audioEngine.audioContext.destination.connect(analyzer);
    } catch (e) {
      // May already be connected
    }
    
    analyzerRef.current = analyzer;

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioEngine]);

  useEffect(() => {
    if (!isPlaying || !analyzerRef.current) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      return;
    }

    const drawSpectrum = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const analyzer = analyzerRef.current;
      
      const bufferLength = analyzer.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const draw = () => {
        animationRef.current = requestAnimationFrame(draw);
        
        analyzer.getByteFrequencyData(dataArray);
        
        const width = canvas.width;
        const height = canvas.height;
        
        // Clear
        ctx.fillStyle = '#0A0B0E';
        ctx.fillRect(0, 0, width, height);
        
        // Draw frequency bars
        const barWidth = width / bufferLength;
        let x = 0;
        
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height;
          
          // Color gradient based on frequency
          const hue = (i / bufferLength) * 120; // 0 (red) to 120 (green)
          ctx.fillStyle = `hsl(${hue + 180}, 100%, 50%)`;
          
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
          x += barWidth;
        }
        
        // Draw frequency labels
        if (showLabels) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.font = '10px monospace';
          
          const frequencies = [20, 100, 500, 1000, 5000, 10000, 20000];
          frequencies.forEach(freq => {
            const x = (Math.log10(freq) - Math.log10(20)) / (Math.log10(20000) - Math.log10(20)) * width;
            ctx.fillText(`${freq >= 1000 ? freq/1000 + 'k' : freq}Hz`, x, height - 5);
          });
        }
      };
      
      draw();
    };

    drawSpectrum();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, showLabels]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Activity className="w-4 h-4" />
          Spectrum
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-4xl">
        <DialogHeader>
          <DialogTitle>Spectral Analyzer</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">
              Real-time frequency analysis
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLabels(!showLabels)}
            >
              {showLabels ? 'Hide' : 'Show'} Labels
            </Button>
          </div>

          <canvas
            ref={canvasRef}
            width={800}
            height={300}
            className="w-full rounded-lg border border-[var(--hair)]"
            style={{ background: '#0A0B0E' }}
          />

          {!isPlaying && (
            <div className="text-center text-sm text-[var(--muted)]">
              Play your track to see the frequency spectrum
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-[var(--surface-2)]">
              <div className="font-semibold mb-1">Low (20-250Hz)</div>
              <div className="text-[var(--muted)]">Bass, Kick, Sub</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface-2)]">
              <div className="font-semibold mb-1">Mid (250-4kHz)</div>
              <div className="text-[var(--muted)]">Vocals, Guitar, Snare</div>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface-2)]">
              <div className="font-semibold mb-1">High (4k-20kHz)</div>
              <div className="text-[var(--muted)]">Cymbals, Air, Brightness</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}