import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Save } from "lucide-react";
import { toast } from "sonner";

export default function ProjectNotes({ projectId, onSave }) {
  const [notes, setNotes] = useState('');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load notes from localStorage
    const saved = localStorage.getItem(`project-notes-${projectId}`);
    if (saved) {
      setNotes(saved);
    }
  }, [projectId]);

  const handleSave = () => {
    localStorage.setItem(`project-notes-${projectId}`, notes);
    onSave?.(notes);
    toast.success('Notes saved!');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="w-4 h-4" />
          Notes
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Project Notes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Keep track of ideas, chord progressions, mix notes, etc.
          </p>

          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter your project notes here...

Examples:
- Verse chord progression: Am - F - C - G
- Mix notes: Boost bass at 60Hz
- Ideas: Try adding a countermelody in bridge"
            className="min-h-[300px] font-mono text-sm"
          />

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2 bg-[var(--mint)] text-black">
              <Save className="w-4 h-4" />
              Save Notes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}