import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Disc, Zap, Music } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PerformanceMonitor({ tracks, isPlaying }) {
  const [metrics, setMetrics] = useState({
    cpu: 0,
    memory: 0,
    tracks: 0,
    notes: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const noteCount = tracks.reduce((sum, t) => sum + (t.notes?.length || 0), 0);
      const cpuLoad = isPlaying ? Math.min(20 + (tracks.length * 5) + Math.random() * 10, 100) : Math.random() * 5;
      
      setMetrics({
        cpu: cpuLoad,
        memory: (tracks.length * 2.5) + Math.random() * 5,
        tracks: tracks.length,
        notes: noteCount
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [tracks, isPlaying]);

  return (
    <div className="p-3 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="w-4 h-4 text-[#16DB93]" />
        <span className="text-xs font-bold uppercase tracking-wider text-white/60">Performance</span>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-2 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="w-3 h-3 text-[#16DB93]" />
            <span className="text-[10px] text-white/50">CPU</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className={cn(
              "text-lg font-black",
              metrics.cpu > 80 ? "text-[#FF6B6B]" : metrics.cpu > 50 ? "text-[#FFD93D]" : "text-[#16DB93]"
            )}>
              {Math.round(metrics.cpu)}
            </span>
            <span className="text-[10px] text-white/40">%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-1">
            <div 
              className={cn(
                "h-full transition-all duration-300",
                metrics.cpu > 80 ? "bg-[#FF6B6B]" : metrics.cpu > 50 ? "bg-[#FFD93D]" : "bg-[#16DB93]"
              )}
              style={{ width: `${metrics.cpu}%` }}
            />
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Disc className="w-3 h-3 text-[#7DF1FF]" />
            <span className="text-[10px] text-white/50">Memory</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-black text-[#7DF1FF]">
              {metrics.memory.toFixed(1)}
            </span>
            <span className="text-[10px] text-white/40">MB</span>
          </div>
        </div>

        <div className="p-2 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3 h-3 text-[#FFD93D]" />
            <span className="text-[10px] text-white/50">Tracks</span>
          </div>
          <span className="text-lg font-black text-[#FFD93D]">
            {metrics.tracks}
          </span>
        </div>

        <div className="p-2 rounded-lg bg-white/5">
          <div className="flex items-center gap-2 mb-1">
            <Music className="w-3 h-3 text-[#B18CFF]" />
            <span className="text-[10px] text-white/50">Notes</span>
          </div>
          <span className="text-lg font-black text-[#B18CFF]">
            {metrics.notes}
          </span>
        </div>
      </div>
    </div>
  );
}