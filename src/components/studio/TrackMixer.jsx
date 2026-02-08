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
              <div className="relative h-[130px] mb-2 mx-auto w-5">
                <div className="absolute inset-0 bg-[#060608] rounded-md border border-white/5 overflow-hidden">
                  {/* dB scale */}
                  {[0, 25, 50, 75].map((pct) => (
                    <div 
                      key={pct}
                      className="absolute left-0 right-0 h-px bg-white/10"
                      style={{ bottom: `${pct}%` }}
                    />
                  ))}
                  
                  {/* Meter fill with gradient */}
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-[50ms]"
                    style={{
                      height: `${meterLevel}%`,
                      background: isClipping 
                        ? 'linear-gradient(0deg, #00FF94 0%, #FFDD00 70%, #FF4757 100%)' 
                        : meterLevel > 70 
                        ? 'linear-gradient(0deg, #00FF94 0%, #FFDD00 100%)' 
                        : 'linear-gradient(0deg, #00FF94 0%, #00F0FF 100%)',
                      boxShadow: `0 0 12px ${isClipping ? '#FF4757' : '#00FF94'}40`
                    }}
                  />
                  
                  {/* Peak hold */}
                  {peakLevel > 5 && (
                    <div
                      className="absolute left-0 right-0 h-[2px] transition-all"
                      style={{
                        bottom: `${peakLevel}%`,
                        backgroundColor: isClipping ? '#FF4757' : '#FFDD00',
                        boxShadow: `0 0 6px ${isClipping ? '#FF4757' : '#FFDD00'}`
                      }}
                    />
                  )}
                </div>
                
                {/* Clip indicator */}
                <div 
                  className={cn(
                    "absolute -top-0.5 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full transition-all",
                    isClipping ? "bg-[#FF4757] shadow-[0_0_8px_#FF4757]" : "bg-[#1F1F28]"
                  )}
                />
              </div>

              {/* dB readout */}
              <div className="text-center mb-2">
                <span className={cn(
                  "text-[9px] font-mono px-1.5 py-0.5 rounded",
                  isClipping ? "bg-[#FF4757]/20 text-[#FF4757]" : "bg-black/40 text-[#9898A6]"
                )}>
                  {formatDb(meterLevel)}
                </span>
              </div>

              {/* Volume Fader */}
              <div className="relative h-[70px] mb-2 mx-auto">
                <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-[#060608] rounded-full border border-white/5" />
                <Slider
                  value={[track.volume * 100]}
                  onValueChange={(val) => onUpdateTrack(track.id, { volume: val[0] / 100 })}
                  max={100}
                  step={1}
                  orientation="vertical"
                  className="h-full"
                />
              </div>
              
              {/* Volume value */}
              <div className="text-center mb-2">
                <span className="text-[9px] font-mono bg-black/40 px-1.5 py-0.5 rounded text-white">
                  {Math.round(track.volume * 100)}
                </span>
              </div>

              {/* Pan */}
              <div className="mb-2">
                <div className="text-[7px] text-[#5C5C6E] text-center mb-1 font-bold tracking-wider">PAN</div>
                <Slider
                  value={[track.pan * 100]}
                  onValueChange={(val) => onUpdateTrack(track.id, { pan: val[0] / 100 })}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-[8px] text-center text-[#9898A6] mt-0.5 font-mono">
                  {getPanLabel(track.pan)}
                </div>
              </div>

              {/* M/S */}
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateTrack(track.id, { muted: !track.muted });
                  }}
                  className={cn(
                    "flex-1 h-5 rounded text-[8px] font-bold transition-all",
                    track.muted 
                      ? "bg-[#FF4757] text-white shadow-[0_0_10px_rgba(255,71,87,0.5)]" 
                      : "bg-[#1F1F28] text-[#5C5C6E] hover:bg-[#2A2A36]"
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
                    "flex-1 h-5 rounded text-[8px] font-bold transition-all",
                    track.solo 
                      ? "bg-[#FF9500] text-black shadow-[0_0_10px_rgba(255,149,0,0.5)]" 
                      : "bg-[#1F1F28] text-[#5C5C6E] hover:bg-[#2A2A36]"
                  )}
                >
                  S
                </button>
              </div>

              {/* Record */}
              <button className="mt-1 h-4 rounded flex items-center justify-center bg-[#1F1F28] hover:bg-[#FF4757]/20 transition-all">
                <div className="w-2 h-2 rounded-full border-2 border-[#5C5C6E]" />
              </button>
            </div>
          );
        })}

        {/* Master */}
        <div 
          className="flex flex-col w-[68px] rounded-xl p-2 border border-[#00F0FF]/20"
          style={{ background: 'linear-gradient(180deg, #00F0FF08 0%, #9D5CFF05 100%)' }}
        >
          <div className="text-center mb-2">
            <div className="text-[9px] font-bold text-[#00F0FF] uppercase tracking-wider">Master</div>
          </div>

          {/* Master Meter */}
          <div className="relative h-[130px] mb-2 mx-auto w-5">
            <div className="absolute inset-0 bg-[#060608] rounded-md border border-[#00F0FF]/20 overflow-hidden">
              {[0, 25, 50, 75].map((pct) => (
                <div 
                  key={pct}
                  className="absolute left-0 right-0 h-px bg-[#00F0FF]/20"
                  style={{ bottom: `${pct}%` }}
                />
              ))}
              
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-100"
                style={{
                  height: `${Math.max(...Object.values(meterLevels)) * 0.85}%`,
                  background: 'linear-gradient(0deg, #00F0FF 0%, #9D5CFF 100%)',
                  boxShadow: '0 0 16px rgba(0, 240, 255, 0.4)'
                }}
              />
            </div>
          </div>

          <div className="text-center mt-auto">
            <span className="text-[9px] font-mono bg-black/40 px-1.5 py-0.5 rounded text-[#00F0FF]">
              {formatDb(Math.max(...Object.values(meterLevels)) * 0.85)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}