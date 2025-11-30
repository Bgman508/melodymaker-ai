
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Command } from "lucide-react";

const SHORTCUTS = [
  { key: '⌘N', action: 'New Project' },
  { key: '⌘S', action: 'Save Project' },
  { key: '⌘Enter', action: 'Generate Composition' },
  { key: 'Space', action: 'Play/Pause' },
  { key: '⌘Z', action: 'Undo' },
  { key: '⌘⇧Z', action: 'Redo' },
  { key: '⌘K', action: 'Command Palette' },
  { key: '⌘E', action: 'Export MIDI' },
  { key: 'R', action: 'Regenerate Melody' },
  { key: 'V', action: 'Generate Variations' },
  { key: '?', action: 'Show Shortcuts' }
  // The '1 / 2 / 3' and 'Esc' shortcuts are removed as per the new list in the outline.
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // New Project (⌘N / Ctrl+N)
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault();
        const event = new CustomEvent('keyboard-new-project');
        window.dispatchEvent(event);
      }

      // Save Project (⌘S / Ctrl+S)
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        const event = new CustomEvent('keyboard-save-project');
        window.dispatchEvent(event);
      }
      
      // Existing '?' shortcut
      if (e.key === '?' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        setOpen(true);
      }
      // Existing 'Escape' shortcut
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 w-10 h-10 rounded-full bg-[var(--surface-2)] border border-[var(--hair)] flex items-center justify-center hover:border-[var(--mint)] transition-colors z-40"
        title="Keyboard Shortcuts (?)"
      >
        <Command className="w-5 h-5 text-[var(--mint)]" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 py-4">
            {SHORTCUTS.map((shortcut, idx) => (
              <React.Fragment key={idx}>
                <kbd className="px-2 py-1 rounded bg-[var(--surface-2)] border border-[var(--hair)] text-xs font-mono text-[var(--mint)]">
                  {shortcut.key}
                </kbd>
                <span className="text-sm text-[var(--muted)]">{shortcut.action}</span>
              </React.Fragment>
            ))}
          </div>

          <div className="text-xs text-[var(--muted)] text-center border-t border-[var(--hair)] pt-3">
            Press <kbd className="px-1 py-0.5 rounded bg-[var(--surface-2)]">?</kbd> anytime to see shortcuts
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
