import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Circle, Square, Play } from "lucide-react";
import { toast } from "sonner";

export default function MIDIRecorder({ track, bpm, onRecordingComplete }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedNotes, setRecordedNotes] = useState([]);
  const [midiAccess, setMidiAccess] = useState(null);
  const recordingStartTime = useRef(null);
  const activeNotes = useRef(new Map());

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          setMidiAccess(access);
          setupMIDIInputs(access);
        })
        .catch(() => toast.error('MIDI access denied'));
    }
  }, []);

  const setupMIDIInputs = (access) => {
    for (const input of access.inputs.values()) {
      input.onmidimessage = handleMIDIMessage;
    }
  };

  const handleMIDIMessage = (message) => {
    if (!isRecording) return;

    const [status, pitch, velocity] = message.data;
    const command = status >> 4;
    const currentTime = performance.now();

    if (command === 9 && velocity > 0) { // Note On
      const noteStartTime = (currentTime - recordingStartTime.current) / 1000;
      const beat = (noteStartTime * bpm) / 60;
      
      activeNotes.current.set(pitch, {
        pitch,
        velocity,
        start: beat
      });
    } else if (command === 8 || (command === 9 && velocity === 0)) { // Note Off
      const activeNote = activeNotes.current.get(pitch);
      if (activeNote) {
        const noteEndTime = (currentTime - recordingStartTime.current) / 1000;
        const endBeat = (noteEndTime * bpm) / 60;
        
        const completedNote = {
          ...activeNote,
          duration: endBeat - activeNote.start
        };
        
        setRecordedNotes(prev => [...prev, completedNote]);
        activeNotes.current.delete(pitch);
      }
    }
  };

  const startRecording = () => {
    if (!midiAccess) {
      toast.error('No MIDI device connected');
      return;
    }

    if (!track) {
      toast.error('Select a track first');
      return;
    }

    setRecordedNotes([]);
    activeNotes.current.clear();
    recordingStartTime.current = performance.now();
    setIsRecording(true);
    toast.success('Recording MIDI...', { icon: '🔴' });
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Finalize any active notes
    const finalNotes = [...recordedNotes];
    for (const [pitch, note] of activeNotes.current) {
      const noteEndTime = (performance.now() - recordingStartTime.current) / 1000;
      const endBeat = (noteEndTime * bpm) / 60;
      finalNotes.push({
        ...note,
        duration: endBeat - note.start
      });
    }
    
    activeNotes.current.clear();
    
    if (finalNotes.length > 0) {
      onRecordingComplete?.(finalNotes);
      toast.success(`Recorded ${finalNotes.length} notes!`);
    } else {
      toast.info('No notes recorded');
    }
  };

  const hasDevices = midiAccess && midiAccess.inputs.size > 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={!hasDevices || !track}
            variant="default"
            size="sm"
            className="gap-2 bg-red-500 hover:bg-red-600"
          >
            <Circle className="w-4 h-4" />
            Record MIDI
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="default"
            size="sm"
            className="gap-2 bg-[var(--mint)] text-black animate-pulse"
          >
            <Square className="w-4 h-4" />
            Stop Recording
          </Button>
        )}
        
        {isRecording && (
          <span className="text-xs text-[var(--muted)] animate-pulse">
            Recording... {recordedNotes.length} notes
          </span>
        )}
      </div>

      {!hasDevices && (
        <p className="text-xs text-[var(--muted)]">
          No MIDI devices detected
        </p>
      )}
      
      {!track && hasDevices && (
        <p className="text-xs text-[var(--muted)]">
          Select a track in the mixer to record
        </p>
      )}
    </div>
  );
}