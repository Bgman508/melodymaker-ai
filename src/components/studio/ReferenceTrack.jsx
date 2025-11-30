
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Upload, Play, Pause, Volume2, X, Music } from "lucide-react";
import { toast } from "sonner";

export default function ReferenceTrack() {
  const [referenceFile, setReferenceFile] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const audioRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      toast.error('Please upload an audio file');
      return;
    }

    const url = URL.createObjectURL(file);
    setReferenceFile({ name: file.name, url });
    toast.success(`Reference track loaded: ${file.name}`);
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const removeReference = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (referenceFile) {
      URL.revokeObjectURL(referenceFile.url);
    }
    setReferenceFile(null);
    setIsPlaying(false);
    toast.info('Reference track removed');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Music className="w-4 h-4" />
          Reference
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
        <DialogHeader>
          <DialogTitle>Reference Track</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Load a reference track to compare your mix against professional productions
          </p>

          {!referenceFile ? (
            <div className="border-2 border-dashed border-[var(--hair)] rounded-lg p-8 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Upload Reference Track
              </Button>
              <p className="text-xs text-[var(--muted)] mt-2">
                MP3, WAV, or any audio format
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Track Info */}
              <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm truncate flex-1">
                    {referenceFile.name}
                  </h4>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={removeReference}
                    className="h-6 w-6 p-0 text-[var(--coral)]"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    onClick={togglePlayback}
                    className="gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-3 h-3" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3" />
                        Play
                      </>
                    )}
                  </Button>

                  <div className="flex items-center gap-2 flex-1">
                    <Volume2 className="w-4 h-4 text-[var(--muted)]" />
                    <Slider
                      value={[volume]}
                      onValueChange={(val) => {
                        setVolume(val[0]);
                        if (audioRef.current) {
                          audioRef.current.volume = val[0] / 100;
                        }
                      }}
                      max={100}
                      className="flex-1"
                    />
                    <span className="text-xs text-[var(--muted)] w-8">
                      {volume}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Hidden Audio Element */}
              <audio
                ref={audioRef}
                src={referenceFile.url}
                onEnded={() => setIsPlaying(false)}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
              />

              {/* Tips */}
              <div className="text-xs text-[var(--muted)] space-y-1">
                <p>💡 Use reference tracks to:</p>
                <ul className="ml-4 list-disc">
                  <li>Compare frequency balance</li>
                  <li>Check loudness and dynamics</li>
                  <li>Analyze arrangement structure</li>
                  <li>Match professional sound quality</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
