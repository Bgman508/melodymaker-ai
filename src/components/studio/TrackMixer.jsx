import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Headphones, MoreVertical, Music2, Radio, Waves, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const trackTypeConfig = {
  melody: { color: '#4D7CFF', icon: Music2 },
  chords: { color: '#9D5CFF', icon: Music2 },
  bass: { color: '#00F0FF', icon: Music2 },
  drums: { color: '#FF4757', icon: Radio },
  pad: { color: '#FF5CAA', icon: Music2 },
  lead: { color: '#FF9500', icon: Music2 },
  audio: { color: '#00FF94', icon: Waves },
  arp: { color: '#FFDD00', icon: Music2 },
  countermelody: { color: '#14B8A6', icon: Music2 },
};

export default function TrackMixer({ tracks, onUpdateTrack, onSelectTrack, selectedTrackId }) {
  const [meterLevels, setMeterLevels] = useState({});
  const [peakLevels, setPeakLevels] = useState({});
  const [peakHolds, setPeakHolds] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const tracksPerPage = 8;
  const totalPages = Math.ceil(tracks.length / tracksPerPage);
  const animationRef = useRef();
  
  const startIdx = currentPage * tracksPerPage;
  const endIdx = startIdx + tracksPerPage;
  const visibleTracks = tracks.slice(startIdx, endIdx);

  // Smooth meter animation
  useEffect(() => {
    let lastTime = performance.now();
    
    const animate = (currentTime) => {
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      setMeterLevels(prev => {
        const newLevels = {};
        tracks.forEach(track => {
          if (!track.muted) {
            const target = Math.random() * track.volume * 80 + 10;
            const current = prev[track.id] || 0;
            const speed = 12;
            newLevels[track.id] = current + (target - current) * Math.min(delta * speed, 1);
          } else {
            const current = prev[track.id] || 0;
            newLevels[track.id] = current * (1 - delta * 8);
          }
        });
        return newLevels;
      });
      
      setPeakLevels(prev => {
        const newPeaks = {};
        tracks.forEach(track => {
          const current = meterLevels[track.id] || 0;
          const prevPeak = prev[track.id] || 0;
          if (current > prevPeak) {
            newPeaks[track.id] = current;
            setPeakHolds(p => ({ ...p, [track.id]: Date.now() }));
          } else {
            const holdTime = peakHolds[track.id] || 0;
            const decay = Date.now() - holdTime > 1000 ? 0.97 : 1;
            newPeaks[track.id] = prevPeak * decay;
          }
        });
        return newPeaks;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [tracks, meterLevels, peakHolds]);

  const formatDb = (level) => {
    if (level <= 0) return '-∞';
    const db = 20 * Math.log10(level / 100);
    return db > -0.1 ? '0.0' : db.toFixed(1);
  };

  const getPanLabel = (pan) => {
    if (Math.abs(pan) < 0.05) return 'C';
    const pct = Math.abs(Math.round(pan * 100));
    return pan > 0 ? `${pct}R` : `${pct}L`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-white">Mixer</h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-1 rounded hover:bg-white/5 disabled:opacity-30 text-[#5C5C6E]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[9px] text-[#5C5C6E] font-mono">
              {startIdx + 1}-{Math.min(endIdx, tracks.length)} / {tracks.length}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-1 rounded hover:bg-white/5 disabled:opacity-30 text-[#5C5C6E]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Channels */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {visibleTracks.map(track => {
          const config = trackTypeConfig[track.type] || trackTypeConfig.melody;
          const trackColor = track.color || config.color;
          const Icon = config.icon;
          const meterLevel = meterLevels[track.id] || 0;
          const peakLevel = peakLevels[track.id] || 0;
          const isSelected = selectedTrackId === track.id;
          const isClipping = peakLevel > 95;
          
          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack?.(track)}
              className={cn(
                "flex flex-col w-[72px] rounded-lg p-3 cursor-pointer transition-all border",
                isSelected 
                  ? "border-[#7C3AED] bg-white/5" 
                  : "border-transparent hover:border-white/10"
              )}
              style={{ background: isSelected ? 'rgba(124,58,237,0.05)' : 'var(--surface)' }}
            >
              {/* Name */}
              <div className="text-center mb-3">
                <div className="text-xs font-medium text-white/90 truncate mb-0.5">{track.name}</div>
                <div className="text-[10px] text-white/30">Ch {track.channel + 1}</div>
              </div>

              {/* Meter */}
              <div className="relative h-[120px] mb-3 mx-auto w-6">
                <div className="absolute inset-0 rounded-md overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
                  {/* Meter fill */}
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-[50ms]"
                    style={{
                      height: `${meterLevel}%`,
                      background: isClipping ? '#EF4444' : meterLevel > 70 ? '#F59E0B' : '#7C3AED'
                    }}
                  />
                </div>
                

              </div>



              {/* Fader */}
              <div className="relative h-[80px] mb-3 mx-auto">
                <Slider
                  value={[track.volume * 100]}
                  onValueChange={(val) => onUpdateTrack(track.id, { volume: val[0] / 100 })}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className="h-full"
                />
              </div>

              {/* Pan */}
              <div className="mb-3">
                <Slider
                  value={[track.pan * 100]}
                  onValueChange={(val) => onUpdateTrack(track.id, { pan: val[0] / 100 })}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-[10px] text-center text-white/40 mt-1">
                  {getPanLabel(track.pan)}
                </div>
              </div>

              {/* M/S */}
              <div className="flex gap-1.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateTrack(track.id, { muted: !track.muted });
                  }}
                  className={cn(
                    "flex-1 h-7 rounded text-xs font-semibold transition-all",
                    track.muted 
                      ? "bg-red-500/20 text-red-400" 
                      : "bg-white/5 text-white/40 hover:text-white/70"
                  )}
                >
                  M
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateTrack(track.id, { solo: !track.solo });
                  }}
                  className={cn(
                    "flex-1 h-7 rounded text-xs font-semibold transition-all",
                    track.solo 
                      ? "bg-yellow-500/20 text-yellow-400" 
                      : "bg-white/5 text-white/40 hover:text-white/70"
                  )}
                >
                  S
                </button>
              </div>
            </div>
          );
        })}

        {/* Master */}
        <div 
          className="flex flex-col w-[72px] rounded-lg p-3 border"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
        >
          <div className="text-center mb-3">
            <div className="text-xs font-medium text-white/70">Master</div>
          </div>

          {/* Master Meter */}
          <div className="relative h-[120px] mb-3 mx-auto w-6">
            <div className="absolute inset-0 rounded-md overflow-hidden" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-100"
                style={{
                  height: `${Math.max(...Object.values(meterLevels)) * 0.85}%`,
                  background: '#7C3AED'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}