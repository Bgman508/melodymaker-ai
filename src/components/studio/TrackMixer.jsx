import React, { useState, useEffect, useRef } from 'react';
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Headphones, MoreVertical, Mic, Music2, Radio, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const trackTypeConfig = {
  melody: { color: '#3B82F6', icon: Music2 },
  chords: { color: '#8B5CF6', icon: Music2 },
  bass: { color: '#06B6D4', icon: Music2 },
  drums: { color: '#EF4444', icon: Radio },
  pad: { color: '#EC4899', icon: Music2 },
  lead: { color: '#F59E0B', icon: Music2 },
  audio: { color: '#10B981', icon: Mic },
  arp: { color: '#22C55E', icon: Music2 },
  countermelody: { color: '#14B8A6', icon: Music2 },
};

export default function TrackMixer({ tracks, onUpdateTrack, onSelectTrack, selectedTrackId }) {
  const [meterLevels, setMeterLevels] = useState({});
  const [peakLevels, setPeakLevels] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const tracksPerPage = 8;
  const totalPages = Math.ceil(tracks.length / tracksPerPage);
  const animationRef = useRef();
  
  const startIdx = currentPage * tracksPerPage;
  const endIdx = startIdx + tracksPerPage;
  const visibleTracks = tracks.slice(startIdx, endIdx);

  // Simulate meters with smooth animation
  useEffect(() => {
    const animate = () => {
      setMeterLevels(prev => {
        const newLevels = {};
        tracks.forEach(track => {
          if (!track.muted) {
            const target = Math.random() * track.volume * 85 + 5;
            const current = prev[track.id] || 0;
            newLevels[track.id] = current + (target - current) * 0.3;
          } else {
            newLevels[track.id] = 0;
          }
        });
        return newLevels;
      });
      
      setPeakLevels(prev => {
        const newPeaks = {};
        tracks.forEach(track => {
          const current = meterLevels[track.id] || 0;
          const prevPeak = prev[track.id] || 0;
          newPeaks[track.id] = current > prevPeak ? current : prevPeak * 0.995;
        });
        return newPeaks;
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [tracks, meterLevels]);

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
    <div className="bg-gradient-to-b from-[#0D1117] to-[#06070A] rounded-xl border border-white/5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/20">
        <h3 className="text-xs font-semibold text-[#8B949E] uppercase tracking-wider">Mixer</h3>
        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="p-1 rounded hover:bg-white/5 disabled:opacity-30 text-[#8B949E]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[10px] text-[#6E7681] font-mono">
              {startIdx + 1}-{Math.min(endIdx, tracks.length)} / {tracks.length}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-1 rounded hover:bg-white/5 disabled:opacity-30 text-[#8B949E]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Channel Strips */}
      <div className="flex gap-1 p-3 overflow-x-auto">
        {visibleTracks.map(track => {
          const config = trackTypeConfig[track.type] || trackTypeConfig.melody;
          const trackColor = track.color || config.color;
          const Icon = config.icon;
          const meterLevel = meterLevels[track.id] || 0;
          const peakLevel = peakLevels[track.id] || 0;
          const isSelected = selectedTrackId === track.id;
          
          return (
            <div
              key={track.id}
              onClick={() => onSelectTrack?.(track)}
              className={cn(
                "flex flex-col w-[72px] rounded-lg p-2 cursor-pointer transition-all",
                isSelected 
                  ? "bg-[#00D9FF]/10 ring-1 ring-[#00D9FF]/30" 
                  : "bg-[#151B23] hover:bg-[#1C232D]"
              )}
            >
              {/* Track Header */}
              <div className="flex items-center justify-between mb-2">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: trackColor, boxShadow: `0 0 8px ${trackColor}50` }}
                />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-0.5 rounded hover:bg-white/10 text-[#6E7681]">
                      <MoreVertical className="w-3 h-3" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#1C232D] border-white/10">
                    <DropdownMenuItem className="text-xs">Rename</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs">Duplicate</DropdownMenuItem>
                    <DropdownMenuItem className="text-xs text-[#EF4444]">Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Track Name */}
              <div className="text-center mb-2">
                <div 
                  className="w-8 h-8 mx-auto rounded-lg flex items-center justify-center mb-1"
                  style={{ backgroundColor: trackColor + '20' }}
                >
                  <Icon className="w-4 h-4" style={{ color: trackColor }} />
                </div>
                <span className="text-[10px] font-medium text-white truncate block">{track.name}</span>
                <span className="text-[9px] text-[#6E7681]">Ch {track.channel + 1}</span>
              </div>

              {/* Meter */}
              <div className="relative h-[140px] mb-2 mx-auto w-6">
                {/* Meter background with dB marks */}
                <div className="absolute inset-0 bg-[#06070A] rounded border border-white/5 overflow-hidden">
                  {/* dB scale lines */}
                  {[0, 25, 50, 75, 100].map((pct) => (
                    <div 
                      key={pct}
                      className="absolute left-0 right-0 h-px bg-white/10"
                      style={{ bottom: `${pct}%` }}
                    />
                  ))}
                  
                  {/* Meter fill */}
                  <div
                    className="absolute bottom-0 left-0 right-0 transition-all duration-75"
                    style={{
                      height: `${meterLevel}%`,
                      background: meterLevel > 90 
                        ? 'linear-gradient(0deg, #10B981 0%, #F59E0B 70%, #EF4444 100%)' 
                        : meterLevel > 70 
                        ? 'linear-gradient(0deg, #10B981 0%, #F59E0B 100%)' 
                        : 'linear-gradient(0deg, #10B981 0%, #22C55E 100%)',
                    }}
                  />
                  
                  {/* Peak indicator */}
                  <div
                    className="absolute left-0 right-0 h-[2px] transition-all duration-100"
                    style={{
                      bottom: `${peakLevel}%`,
                      backgroundColor: peakLevel > 90 ? '#EF4444' : '#F59E0B',
                      boxShadow: `0 0 4px ${peakLevel > 90 ? '#EF4444' : '#F59E0B'}`
                    }}
                  />
                </div>
                
                {/* Clip indicator */}
                <div 
                  className={cn(
                    "absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-1 rounded-full transition-all",
                    peakLevel > 95 ? "bg-[#EF4444] shadow-[0_0_8px_#EF4444]" : "bg-[#1C232D]"
                  )}
                />
              </div>

              {/* dB readout */}
              <div className="text-center mb-2">
                <span className={cn(
                  "text-[10px] font-mono px-1.5 py-0.5 rounded",
                  peakLevel > 90 ? "bg-[#EF4444]/20 text-[#EF4444]" : "bg-black/30 text-[#8B949E]"
                )}>
                  {formatDb(meterLevel)}
                </span>
              </div>

              {/* Volume Fader */}
              <div className="relative h-[80px] mb-2 mx-auto">
                <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-[#06070A] rounded-full border border-white/5" />
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
                <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded text-white">
                  {Math.round(track.volume * 100)}
                </span>
              </div>

              {/* Pan */}
              <div className="mb-2">
                <div className="text-[8px] text-[#6E7681] text-center mb-1">PAN</div>
                <Slider
                  value={[track.pan * 100]}
                  onValueChange={(val) => onUpdateTrack(track.id, { pan: val[0] / 100 })}
                  min={-100}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-[9px] text-center text-[#8B949E] mt-0.5 font-mono">
                  {getPanLabel(track.pan)}
                </div>
              </div>

              {/* Mute/Solo */}
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateTrack(track.id, { muted: !track.muted });
                  }}
                  className={cn(
                    "flex-1 h-6 rounded text-[9px] font-bold transition-all",
                    track.muted 
                      ? "bg-[#EF4444] text-white shadow-[0_0_8px_rgba(239,68,68,0.4)]" 
                      : "bg-[#1C232D] text-[#6E7681] hover:bg-[#252D3A]"
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
                    "flex-1 h-6 rounded text-[9px] font-bold transition-all",
                    track.solo 
                      ? "bg-[#F59E0B] text-black shadow-[0_0_8px_rgba(245,158,11,0.4)]" 
                      : "bg-[#1C232D] text-[#6E7681] hover:bg-[#252D3A]"
                  )}
                >
                  S
                </button>
              </div>

              {/* Record arm */}
              <button
                className="mt-1 h-5 rounded flex items-center justify-center bg-[#1C232D] hover:bg-[#EF4444]/20 hover:border-[#EF4444]/50 border border-transparent transition-all"
              >
                <div className="w-2 h-2 rounded-full border-2 border-[#6E7681]" />
              </button>
            </div>
          );
        })}

        {/* Master Channel */}
        <div className="flex flex-col w-[72px] rounded-lg p-2 bg-gradient-to-b from-[#00D9FF]/10 to-[#7C3AED]/10 border border-[#00D9FF]/20">
          <div className="text-center mb-2">
            <div className="text-[10px] font-bold text-[#00D9FF] uppercase tracking-wider">Master</div>
          </div>

          {/* Master Meter */}
          <div className="relative h-[140px] mb-2 mx-auto w-6">
            <div className="absolute inset-0 bg-[#06070A] rounded border border-[#00D9FF]/20 overflow-hidden">
              {[0, 25, 50, 75, 100].map((pct) => (
                <div 
                  key={pct}
                  className="absolute left-0 right-0 h-px bg-[#00D9FF]/20"
                  style={{ bottom: `${pct}%` }}
                />
              ))}
              
              <div
                className="absolute bottom-0 left-0 right-0 transition-all duration-100"
                style={{
                  height: `${Math.max(...Object.values(meterLevels)) * 0.85}%`,
                  background: 'linear-gradient(0deg, #00D9FF 0%, #7C3AED 100%)',
                  boxShadow: '0 0 12px rgba(0, 217, 255, 0.3)'
                }}
              />
            </div>
          </div>

          <div className="text-center">
            <span className="text-[10px] font-mono bg-black/30 px-1.5 py-0.5 rounded text-[#00D9FF]">
              {formatDb(Math.max(...Object.values(meterLevels)) * 0.85)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}