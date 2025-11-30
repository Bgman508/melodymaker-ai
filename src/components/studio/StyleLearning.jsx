import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Brain, Check } from "lucide-react";
import { toast } from "sonner";

export default function StyleLearning({ onStyleLearned }) {
  const [uploading, setUploading] = useState(false);
  const [styleName, setStyleName] = useState('');
  const [learnedStyles, setLearnedStyles] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    
    try {
      // Read file
      const arrayBuffer = await file.arrayBuffer();
      
      // In production: parse MIDI and analyze
      // const styleLearner = new StyleLearner();
      // const analysis = await styleLearner.analyzeMIDI(arrayBuffer);
      
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newStyle = {
        name: styleName || file.name.replace('.mid', ''),
        noteDensity: Math.random() * 10 + 5,
        swing: Math.random() * 0.2 + 0.5,
        avgVelocity: Math.random() * 30 + 80
      };
      
      setLearnedStyles([...learnedStyles, newStyle]);
      toast.success(`Learned style: ${newStyle.name}`);
      
      if (onStyleLearned) {
        onStyleLearned(newStyle);
      }
    } catch (error) {
      toast.error('Failed to analyze MIDI file');
    }
    
    setUploading(false);
    setStyleName('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Brain className="w-4 h-4" />
          Learn Style
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)]">
        <DialogHeader>
          <DialogTitle>Learn from MIDI</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Style Name</Label>
            <Input
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
              placeholder="e.g., 'My Trap Style'"
            />
          </div>

          <div>
            <Label>Upload MIDI File</Label>
            <div className="mt-2">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[var(--hair)] rounded-xl cursor-pointer hover:border-[var(--mint)] transition-colors">
                <Upload className="w-8 h-8 text-[var(--muted)] mb-2" />
                <span className="text-sm text-[var(--muted)]">
                  {uploading ? 'Analyzing...' : 'Click to upload MIDI'}
                </span>
                <input
                  type="file"
                  accept=".mid,.midi"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          {learnedStyles.length > 0 && (
            <div>
              <Label>Learned Styles</Label>
              <div className="mt-2 space-y-2">
                {learnedStyles.map((style, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--mint)]"
                  >
                    <Check className="w-4 h-4 text-[var(--mint)]" />
                    <div className="flex-1">
                      <div className="font-medium">{style.name}</div>
                      <div className="text-xs text-[var(--muted)]">
                        Density: {style.noteDensity.toFixed(1)} | Swing: {(style.swing * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}