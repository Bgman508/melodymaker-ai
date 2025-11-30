import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Play, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";

export default function AudioRecorder({ onRecordingComplete, track }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        setAudioBlob(blob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      toast.error('Could not access microphone');
      console.error(error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const saveRecording = async () => {
    if (!audioBlob) return;

    try {
      toast.info('Uploading recording...');
      
      // Upload to base44
      const uploadResponse = await base44.integrations.Core.UploadFile({ file: audioBlob });
      const fileUrl = uploadResponse.file_url;
      
      onRecordingComplete?.({
        audioUrl: fileUrl,
        duration: 0, // Would need to calculate
        timestamp: Date.now()
      });
      
      toast.success('Recording saved!');
      
      // Clear
      setAudioBlob(null);
      setAudioUrl(null);
    } catch (error) {
      toast.error('Failed to save recording');
      console.error(error);
    }
  };

  const discardRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    toast.info('Recording discarded');
  };

  return (
    <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
      <div className="flex items-center gap-2">
        {!isRecording && !audioBlob && (
          <Button
            onClick={startRecording}
            className="flex-1 bg-gradient-to-r from-[var(--coral)] to-[var(--violet)] text-white"
          >
            <Mic className="w-4 h-4 mr-2" />
            Start Recording
          </Button>
        )}
        
        {isRecording && (
          <Button
            onClick={stopRecording}
            className="flex-1 bg-[var(--coral)] text-white animate-pulse"
          >
            <Square className="w-4 h-4 mr-2" />
            Stop Recording
          </Button>
        )}
        
        {audioBlob && !isRecording && (
          <>
            <Button onClick={playRecording} variant="outline" className="flex-1">
              <Play className="w-4 h-4 mr-2" />
              Play
            </Button>
            <Button onClick={saveRecording} className="flex-1 bg-[var(--mint)] text-black">
              <Download className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={discardRecording} variant="outline" size="icon">
              <Trash2 className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
      
      {isRecording && (
        <div className="flex items-center gap-2 text-xs text-[var(--coral)]">
          <div className="w-2 h-2 rounded-full bg-[var(--coral)] animate-pulse" />
          <span>Recording in progress...</span>
        </div>
      )}
    </div>
  );
}