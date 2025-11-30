import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderTree, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function TrackStacks({ tracks, onUpdateStacks }) {
  const [stacks, setStacks] = useState([]);
  const [expanded, setExpanded] = useState(new Set());

  const createStack = (type = 'folder') => {
    const selectedTracks = tracks.filter(t => t.selected);
    
    if (selectedTracks.length === 0) {
      toast.error('Select tracks to create a stack');
      return;
    }

    const newStack = {
      id: `stack-${Date.now()}`,
      name: `Stack ${stacks.length + 1}`,
      type, // 'folder' or 'summing'
      tracks: selectedTracks.map(t => t.id),
      color: '#7C61FF',
      volume: 0.8,
      pan: 0,
      muted: false,
      solo: false
    };

    setStacks(prev => [...prev, newStack]);
    setExpanded(prev => new Set([...prev, newStack.id]));
    onUpdateStacks?.([...stacks, newStack]);
    toast.success(`${type === 'folder' ? 'Folder' : 'Summing'} stack created`);
  };

  const updateStack = (stackId, updates) => {
    setStacks(prev => prev.map(s => s.id === stackId ? { ...s, ...updates } : s));
  };

  const deleteStack = (stackId) => {
    setStacks(prev => prev.filter(s => s.id !== stackId));
    onUpdateStacks?.(stacks.filter(s => s.id !== stackId));
    toast.success('Stack deleted');
  };

  const toggleExpanded = (stackId) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(stackId)) {
        next.delete(stackId);
      } else {
        next.add(stackId);
      }
      return next;
    });
  };

  const getStackTracks = (stack) => {
    return tracks.filter(t => stack.tracks.includes(t.id));
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderTree className="w-4 h-4" />
          Stacks ({stacks.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Track Stacks - Organize & Group</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Group tracks into folders or summing stacks for better organization and mixing.
          </p>

          {/* Create Buttons */}
          <div className="flex gap-2">
            <Button onClick={() => createStack('folder')} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Folder Stack
            </Button>
            <Button onClick={() => createStack('summing')} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Summing Stack
            </Button>
            <span className="text-xs text-[var(--muted)] ml-auto self-center">
              Select tracks first
            </span>
          </div>

          {/* Stacks List */}
          <div className="space-y-2">
            {stacks.length === 0 ? (
              <div className="text-center py-8 text-[var(--muted)]">
                No stacks yet. Select tracks and create a stack.
              </div>
            ) : (
              stacks.map(stack => {
                const isExpanded = expanded.has(stack.id);
                const stackTracks = getStackTracks(stack);

                return (
                  <div
                    key={stack.id}
                    className="border border-[var(--hair)] rounded-lg overflow-hidden"
                  >
                    {/* Stack Header */}
                    <div
                      className="p-4 bg-[var(--surface-2)] flex items-center gap-3 cursor-pointer hover:bg-[var(--hover)]"
                      onClick={() => toggleExpanded(stack.id)}
                      style={{ borderLeftColor: stack.color, borderLeftWidth: '4px' }}
                    >
                      <button className="hover:bg-[var(--hover)] rounded p-1">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>

                      <FolderTree className="w-4 h-4" style={{ color: stack.color }} />

                      <Input
                        value={stack.name}
                        onChange={(e) => updateStack(stack.id, { name: e.target.value })}
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 h-8 bg-[var(--bg)]"
                      />

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--muted)]">
                          {stack.type === 'summing' ? '∑' : '📁'} {stackTracks.length} tracks
                        </span>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteStack(stack.id);
                          }}
                          className="text-[var(--coral)]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Stack Contents */}
                    {isExpanded && (
                      <div className="p-4 bg-[var(--bg)] space-y-1">
                        {stackTracks.map(track => (
                          <div
                            key={track.id}
                            className="p-2 rounded bg-[var(--surface-2)] text-sm flex items-center gap-2"
                          >
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: track.color || '#64748b' }}
                            />
                            <span>{track.name}</span>
                            <span className="text-xs text-[var(--muted)] ml-auto">
                              {track.notes?.length || 0} notes
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Stack Info */}
          <div className="p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <p className="text-xs text-[var(--muted)]">
              <strong>Folder Stack:</strong> Organize tracks visually<br/>
              <strong>Summing Stack:</strong> Route tracks to a mix bus for group processing
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}