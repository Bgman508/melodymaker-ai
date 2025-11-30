import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Command, Search, Zap, Music, Download, Share2, Undo, Redo } from "lucide-react";

const COMMANDS = [
  { id: 'compose', label: 'Compose from Prompt', icon: Music, shortcut: '⌘↩', action: 'compose' },
  { id: 'play', label: 'Play / Pause', icon: Command, shortcut: 'Space', action: 'play' },
  { id: 'export', label: 'Export MIDI', icon: Download, shortcut: '⌘E', action: 'export' },
  { id: 'share', label: 'Share Project', icon: Share2, shortcut: '⌘S', action: 'share' },
  { id: 'undo', label: 'Undo', icon: Undo, shortcut: '⌘Z', action: 'undo' },
  { id: 'redo', label: 'Redo', icon: Redo, shortcut: '⌘⇧Z', action: 'redo' },
  { id: 'variations', label: 'Generate Variations', icon: Zap, shortcut: 'V', action: 'variations' },
  { id: 'harmony', label: 'Suggest Harmonies', icon: Music, shortcut: 'H', action: 'harmony' },
  { id: 'regen-melody', label: 'Regenerate Melody', icon: Zap, shortcut: 'R', action: 'regen-melody' },
  { id: 'regen-bass', label: 'Regenerate Bass', icon: Zap, shortcut: 'B', action: 'regen-bass' },
  { id: 'theme', label: 'Toggle Theme', icon: Command, shortcut: 'T', action: 'theme' }
];

export default function CommandPalette({ open, onOpenChange, onCommand }) {
  const [search, setSearch] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);

  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(true);
      }

      if (open) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIdx((selectedIdx + 1) % filteredCommands.length);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIdx((selectedIdx - 1 + filteredCommands.length) % filteredCommands.length);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredCommands[selectedIdx]) {
            onCommand(filteredCommands[selectedIdx].action);
            onOpenChange(false);
            setSearch('');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, selectedIdx, filteredCommands, onOpenChange, onCommand]);

  useEffect(() => {
    if (!open) {
      setSearch('');
      setSelectedIdx(0);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--surface)] border-[var(--line)] p-0 max-w-2xl">
        <div className="flex items-center gap-3 p-4 border-b border-[var(--hair)]">
          <Search className="w-5 h-5 text-[var(--muted)]" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type a command or search..."
            className="flex-1 border-0 focus-visible:ring-0 bg-transparent"
            autoFocus
          />
          <kbd className="px-2 py-1 text-xs rounded bg-[var(--surface-2)] text-[var(--muted)]">
            ⌘K
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.map((cmd, idx) => {
            const Icon = cmd.icon;
            return (
              <button
                key={cmd.id}
                onClick={() => {
                  onCommand(cmd.action);
                  onOpenChange(false);
                  setSearch('');
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-[var(--surface-2)] transition-colors ${
                  idx === selectedIdx ? 'bg-[var(--surface-2)]' : ''
                }`}
              >
                <Icon className="w-5 h-5 text-[var(--mint)]" />
                <span className="flex-1 text-left">{cmd.label}</span>
                {cmd.shortcut && (
                  <kbd className="px-2 py-1 text-xs rounded bg-[var(--bg)] text-[var(--muted)]">
                    {cmd.shortcut}
                  </kbd>
                )}
              </button>
            );
          })}

          {filteredCommands.length === 0 && (
            <div className="py-12 text-center text-[var(--muted)]">
              No commands found
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}