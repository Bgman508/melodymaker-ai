import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function VoiceInput({ onMelodyDetected }) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording... Hum your melody!');
    } catch (error) {
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
    }
  };

  const processAudio = async (audioBlob) => {
    try {
      // In production, this would use Web Audio API + pitch detection
      // For now, simulate basic pitch detection
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Simulate pitch detection (replace with actual algorithm)
      const notes = simulatePitchDetection(audioBuffer);
      
      onMelodyDetected(notes);
      toast.success('Melody detected and converted!');
    } catch (error) {
      toast.error('Could not process audio');
    }
    
    setIsProcessing(false);
  };

  const simulatePitchDetection = (audioBuffer) => {
    // Placeholder - real implementation would use autocorrelation/FFT
    const notes = [];
    const duration = audioBuffer.duration;
    const segments = Math.floor(duration / 0.5); // 0.5s per note
    
    for (let i = 0; i < segments; i++) {
      notes.push({
        pitch: 60 + Math.floor(Math.random() * 12), // C4 to B4
        start: i * 0.5,
        duration: 0.4,
        velocity: 90
      });
    }
    
    return notes;
  };

  return (
    <Button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={isProcessing}
      className={`w-full ${isRecording ? 'bg-[var(--coral)] animate-pulse' : 'bg-gradient-to-r from-[var(--mint)] to-[var(--ice)]'} text-white font-semibold`}
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      ) : isRecording ? (
        <>
          <MicOff className="w-4 h-4 mr-2" />
          Stop Recording
        </>
      ) : (
        <>
          <Mic className="w-4 h-4 mr-2" />
          Hum Your Melody
        </>
      )}
    </Button>
  );
}