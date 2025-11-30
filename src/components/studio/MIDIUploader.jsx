import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, FileAudio, Check, Sparkles, Music } from "lucide-react";
import { toast } from "sonner";
import { MIDIParser } from "../engine/midiParser";
import { motion } from "framer-motion";

export default function MIDIUploader({ onMIDILoaded, midiEngine }) {
  const [uploading, setUploading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.mid') && !file.name.toLowerCase().endsWith('.midi')) {
      toast.error('Please upload a MIDI file (.mid or .midi)');
      return;
    }

    setUploading(true);
    
    try {
      const parser = new MIDIParser();
      const parsed = await parser.parseMIDIFile(file);
      
      setParsedData(parsed);
      setAnalysis(parsed.analysis);
      
      toast.success(`Loaded: ${file.name} - ${parsed.tracks.length} tracks, ${parsed.analysis.totalNotes} notes`);
    } catch (error) {
      toast.error('Failed to parse MIDI file: ' + error.message);
      console.error(error);
    }
    
    setUploading(false);
  };

  const handleImportAsIs = () => {
    if (!parsedData) return;
    
    const parser = new MIDIParser();
    const studioTracks = parser.convertToStudioFormat(parsedData);
    
    onMIDILoaded({
      tracks: studioTracks,
      bpm: parsedData.bpm,
      key: analysis.detectedKey,
      scale: analysis.detectedScale,
      mode: 'import'
    });
    
    setDialogOpen(false);
    setParsedData(null);
    setAnalysis(null);
    toast.success('MIDI imported successfully!');
  };

  const handleBuildFrom = () => {
    if (!parsedData || !analysis) return;
    
    // Use the uploaded MIDI as inspiration/template
    const prompt = `${analysis.style} style, ${analysis.detectedKey} ${analysis.detectedScale}, ${parsedData.bpm} bpm, ${analysis.complexity} complexity`;
    
    const parser = new MIDIParser();
    const referenceTracks = parser.convertToStudioFormat(parsedData);
    
    onMIDILoaded({
      tracks: [],
      bpm: parsedData.bpm,
      key: analysis.detectedKey,
      scale: analysis.detectedScale,
      prompt,
      referenceTracks, // Store for AI to learn from
      mode: 'build'
    });
    
    setDialogOpen(false);
    setParsedData(null);
    setAnalysis(null);
    toast.success('Ready to build from template!');
  };

  const handleLearnStyle = () => {
    if (!parsedData || !analysis) return;
    
    // Extract musical patterns for AI to learn
    const parser = new MIDIParser();
    const studioTracks = parser.convertToStudioFormat(parsedData);
    
    // Analyze patterns
    const melodyTrack = studioTracks.find(t => t.type === 'melody' || t.type === 'lead');
    const rhythmProfile = this.analyzeRhythmProfile(studioTracks);
    const harmonicProfile = this.analyzeHarmonyProfile(studioTracks);
    
    onMIDILoaded({
      tracks: [],
      bpm: parsedData.bpm,
      key: analysis.detectedKey,
      scale: analysis.detectedScale,
      learnedStyle: {
        rhythmProfile,
        harmonicProfile,
        melodyContour: melodyTrack ? this.extractMelodyContour(melodyTrack) : null,
        complexity: analysis.complexity
      },
      mode: 'learn'
    });
    
    setDialogOpen(false);
    setParsedData(null);
    setAnalysis(null);
    toast.success('Style learned! Generate to apply.');
  };

  const analyzeRhythmProfile = (tracks) => {
    const allNotes = tracks.flatMap(t => t.notes);
    const durations = allNotes.map(n => n.duration);
    const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
    const durationVariety = new Set(durations.map(d => Math.round(d * 4))).size;
    
    return {
      avgDuration,
      variety: durationVariety,
      syncopation: this.detectSyncopation(allNotes)
    };
  };

  const detectSyncopation = (notes) => {
    let syncopated = 0;
    notes.forEach(note => {
      const beatPosition = note.start % 1;
      if (beatPosition !== 0 && beatPosition !== 0.5) {
        syncopated++;
      }
    });
    return syncopated / notes.length;
  };

  const analyzeHarmonyProfile = (tracks) => {
    const chordTrack = tracks.find(t => t.type === 'chords');
    if (!chordTrack) return null;
    
    // Extract chord intervals
    const chordVoicings = [];
    // ... implementation details
    
    return {
      voicings: chordVoicings,
      extensions: 'basic' // Detect 7ths, 9ths, etc.
    };
  };

  const extractMelodyContour = (melodyTrack) => {
    const pitches = melodyTrack.notes.map(n => n.pitch);
    const normalized = pitches.map((p, i) => 
      i === 0 ? 0 : (p - pitches[0]) / 12
    );
    return normalized;
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Upload className="w-4 h-4" />
          Upload MIDI
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload MIDI File</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {!parsedData ? (
            <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-[var(--hair)] rounded-xl cursor-pointer hover:border-[var(--mint)] transition-colors bg-[var(--surface-2)]">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {uploading ? (
                  <>
                    <Music className="w-12 h-12 text-[var(--mint)] mb-4 animate-pulse" />
                    <p className="text-sm text-[var(--muted)]">Parsing MIDI file...</p>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-[var(--muted)] mb-4" />
                    <p className="mb-2 text-sm text-[var(--text)]">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-[var(--muted)]">MIDI files (.mid, .midi)</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept=".mid,.midi"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Analysis Display */}
              <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--mint)]">
                <div className="flex items-center gap-2 mb-4">
                  <Check className="w-5 h-5 text-[var(--mint)]" />
                  <h3 className="font-semibold">MIDI Analyzed</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-[var(--muted)] mb-1">Tracks</div>
                    <div className="font-medium">{parsedData.tracks.length}</div>
                  </div>
                  <div>
                    <div className="text-[var(--muted)] mb-1">Total Notes</div>
                    <div className="font-medium">{analysis.totalNotes}</div>
                  </div>
                  <div>
                    <div className="text-[var(--muted)] mb-1">Detected Key</div>
                    <div className="font-medium">{analysis.detectedKey} {analysis.detectedScale}</div>
                  </div>
                  <div>
                    <div className="text-[var(--muted)] mb-1">Tempo</div>
                    <div className="font-medium">{parsedData.bpm} BPM</div>
                  </div>
                  <div>
                    <div className="text-[var(--muted)] mb-1">Style</div>
                    <div className="font-medium capitalize">{analysis.style}</div>
                  </div>
                  <div>
                    <div className="text-[var(--muted)] mb-1">Complexity</div>
                    <div className="font-medium capitalize">{analysis.complexity}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-[var(--muted)] text-sm mb-2">Track Types:</div>
                  <div className="flex flex-wrap gap-2">
                    {analysis.trackTypes.map((type, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-full text-xs bg-[var(--bg)] capitalize"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleImportAsIs}
                  className="w-full bg-gradient-to-r from-[var(--mint)] to-[var(--ice)] text-black"
                >
                  <FileAudio className="w-4 h-4 mr-2" />
                  Import As-Is
                  <span className="ml-2 text-xs opacity-75">
                    Use these exact tracks
                  </span>
                </Button>

                <Button
                  onClick={handleBuildFrom}
                  variant="outline"
                  className="w-full"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Build From Template
                  <span className="ml-2 text-xs opacity-75">
                    Generate similar composition
                  </span>
                </Button>

                <Button
                  onClick={handleLearnStyle}
                  variant="outline"
                  className="w-full"
                >
                  <Music className="w-4 h-4 mr-2" />
                  Learn Style & Regenerate
                  <span className="ml-2 text-xs opacity-75">
                    Extract patterns for AI
                  </span>
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => {
                  setParsedData(null);
                  setAnalysis(null);
                }}
                className="w-full"
              >
                Upload Different File
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}