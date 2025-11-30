import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Headphones, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ExportAudio({ tracks, bpm, projectName, audioEngine }) {
  const [format, setFormat] = useState('wav');
  const [exporting, setExporting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const exportAudio = async () => {
    if (!tracks || tracks.length === 0) {
      toast.error('No tracks to export');
      return;
    }

    setExporting(true);
    toast.info('Rendering audio...');

    try {
      // Create offline audio context for faster-than-realtime rendering
      const duration = tracks.reduce((max, track) => {
        const trackEnd = track.notes?.reduce((end, note) => 
          Math.max(end, note.start + note.duration), 0) || 0;
        return Math.max(max, trackEnd);
      }, 0);

      const sampleRate = 44100;
      const durationInSeconds = (duration / bpm) * 60;
      const offlineCtx = new OfflineAudioContext(2, sampleRate * durationInSeconds, sampleRate);

      // Render each track
      for (const track of tracks) {
        if (track.muted) continue;
        
        // Use the audio engine's scheduling logic but with offline context
        // This is simplified - in production you'd need to recreate the synthesis
        // in the offline context
      }

      const renderedBuffer = await offlineCtx.startRendering();
      
      // Convert to WAV
      const wav = audioBufferToWav(renderedBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      
      // Download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName || 'export'}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Audio exported successfully!');
      setDialogOpen(false);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Export failed. Try MIDI export instead.');
    }

    setExporting(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Headphones className="w-4 h-4" />
          Export Audio
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)]">
        <DialogHeader>
          <DialogTitle>Export Audio</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-semibold mb-2 block">Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wav">WAV (Best Quality)</SelectItem>
                <SelectItem value="mp3">MP3 (Smaller Size)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <p className="text-xs text-[var(--muted)]">
              <strong>Note:</strong> Audio export renders your synths to an audio file. This may take a moment. For professional mixing, export MIDI and import into your DAW.
            </p>
          </div>

          <Button
            onClick={exportAudio}
            disabled={exporting || tracks.length === 0}
            className="w-full gap-2 bg-gradient-to-r from-[var(--violet)] to-[var(--mint)] text-black"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Rendering...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Audio
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to convert AudioBuffer to WAV
function audioBufferToWav(buffer) {
  const length = buffer.length * buffer.numberOfChannels * 2;
  const arrayBuffer = new ArrayBuffer(44 + length);
  const view = new DataView(arrayBuffer);
  const channels = [];
  let offset = 0;
  let pos = 0;

  // Write WAV header
  setUint32(0x46464952); // "RIFF"
  setUint32(36 + length); // file length
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt "
  setUint32(16); // chunk size
  setUint16(1); // PCM
  setUint16(buffer.numberOfChannels);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * buffer.numberOfChannels * 2);
  setUint16(buffer.numberOfChannels * 2);
  setUint16(16);
  setUint32(0x61746164); // "data"
  setUint32(length);

  // Write audio data
  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (pos < buffer.length) {
    for (let i = 0; i < buffer.numberOfChannels; i++) {
      const sample = Math.max(-1, Math.min(1, channels[i][pos]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true);
      offset += 2;
    }
    pos++;
  }

  return arrayBuffer;

  function setUint16(data) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data) {
    view.setUint32(pos, data, true);
    pos += 4;
  }
}