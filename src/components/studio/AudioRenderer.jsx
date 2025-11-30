import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AudioRenderer({ tracks, bpm, projectName }) {
  const [rendering, setRendering] = useState(false);

  const renderToWAV = async () => {
    setRendering(true);

    try {
      toast.info('Rendering audio...');

      let maxBeat = 0;
      tracks.forEach(track => {
        if (track.notes) {
          track.notes.forEach(note => {
            const end = note.start + note.duration;
            if (end > maxBeat) maxBeat = end;
          });
        }
      });

      const durationSeconds = (maxBeat / bpm) * 60;
      const sampleRate = 44100;
      const numChannels = 2;
      const numSamples = Math.ceil(durationSeconds * sampleRate);
      
      const offlineContext = new OfflineAudioContext(numChannels, numSamples, sampleRate);
      
      tracks.forEach(track => {
        if (track.muted || !track.notes || track.notes.length === 0) return;
        
        track.notes.forEach(note => {
          const startTime = (note.start / bpm) * 60;
          const duration = (note.duration / bpm) * 60;
          const frequency = 440 * Math.pow(2, (note.pitch - 69) / 12);
          const velocity = (note.velocity || 0.8) * (track.volume || 0.8);
          
          renderNote(offlineContext, frequency, startTime, duration, velocity);
        });
      });
      
      const renderedBuffer = await offlineContext.startRendering();
      const wav = audioBufferToWav(renderedBuffer);
      const blob = new Blob([wav], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${projectName || 'composition'}.wav`;
      a.click();
      
      URL.revokeObjectURL(url);
      toast.success('Audio rendered!');
    } catch (error) {
      console.error('Render error:', error);
      toast.error('Failed to render');
    }

    setRendering(false);
  };

  return (
    <Button
      onClick={renderToWAV}
      disabled={rendering || tracks.length === 0}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {rendering ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Rendering...
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Export WAV
        </>
      )}
    </Button>
  );
}

function renderNote(context, frequency, startTime, duration, velocity) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  
  osc.type = 'sine';
  osc.frequency.value = frequency;
  
  const vol = velocity * 0.3;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
  gain.gain.setValueAtTime(vol * 0.7, startTime + duration - 0.1);
  gain.gain.linearRampToValueAtTime(0.001, startTime + duration);
  
  osc.connect(gain);
  gain.connect(context.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration);
}

function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferArray = new ArrayBuffer(length);
  const view = new DataView(bufferArray);
  const channels = [];
  let pos = 0;

  const setUint16 = (data) => {
    view.setUint16(pos, data, true);
    pos += 2;
  };
  const setUint32 = (data) => {
    view.setUint32(pos, data, true);
    pos += 4;
  };

  setUint32(0x46464952);
  setUint32(length - 8);
  setUint32(0x45564157);
  setUint32(0x20746d66);
  setUint32(16);
  setUint16(1);
  setUint16(numOfChan);
  setUint32(buffer.sampleRate);
  setUint32(buffer.sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2);
  setUint16(16);
  setUint32(0x61746164);
  setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  let offset = 0;
  while (pos < length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }

  return bufferArray;
}