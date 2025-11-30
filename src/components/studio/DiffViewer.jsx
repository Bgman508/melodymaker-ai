
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DiffViewer({ previousTracks, currentTracks, onAccept, onReject, onClose }) {
  if (!previousTracks || !currentTracks) return null;

  const getDiff = () => {
    const diff = [];
    
    currentTracks.forEach((currentTrack, idx) => {
      const prevTrack = previousTracks.find(t => t.type === currentTrack.type);
      
      if (!prevTrack) {
        diff.push({
          type: 'added',
          track: currentTrack,
          trackType: currentTrack.type
        });
        return;
      }

      const addedNotes = currentTrack.notes.filter(note => 
        !prevTrack.notes.some(pn => 
          pn.pitch === note.pitch && 
          Math.abs(pn.start - note.start) < 0.1
        )
      );

      const removedNotes = prevTrack.notes.filter(note => 
        !currentTrack.notes.some(cn => 
          cn.pitch === note.pitch && 
          Math.abs(cn.start - note.start) < 0.1
        )
      );

      if (addedNotes.length > 0 || removedNotes.length > 0) {
        diff.push({
          type: 'modified',
          track: currentTrack,
          trackType: currentTrack.type,
          addedNotes,
          removedNotes
        });
      }
    });

    return diff;
  };

  const diff = getDiff();

  const handleAcceptAll = () => {
    onAccept(currentTracks);
    onClose();
  };

  const handleRejectAll = () => {
    onReject(previousTracks);
    onClose();
  };

  const handleAcceptTrack = (trackType) => {
    const newTracks = previousTracks.map(track => {
      if (track.type === trackType) {
        return currentTracks.find(t => t.type === trackType);
      }
      return track;
    });
    onAccept(newTracks);
  };

  const handleRejectTrack = (trackType) => {
    const newTracks = currentTracks.map(track => {
      if (track.type === trackType) {
        return previousTracks.find(t => t.type === trackType);
      }
      return track;
    });
    onAccept(newTracks);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[var(--surface)] rounded-2xl border border-[var(--line)] max-w-3xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--hair)]">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text)]">Review Changes</h2>
            <p className="text-sm text-[var(--muted)] mt-1">
              Accept or reject modifications to your composition
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface-2)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--muted)]" />
          </button>
        </div>

        {/* Diff Content */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {diff.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--muted)]">No changes detected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {diff.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-[var(--hair)] bg-[var(--surface-2)]"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold capitalize text-[var(--text)]">
                        {item.trackType}
                      </span>
                      {item.type === 'added' && (
                        <Badge className="bg-[var(--mint)]/20 text-[var(--mint)] border-[var(--mint)]/30">
                          <Plus className="w-3 h-3 mr-1" />
                          New Track
                        </Badge>
                      )}
                      {item.type === 'modified' && (
                        <div className="flex gap-2">
                          {item.addedNotes.length > 0 && (
                            <Badge className="bg-[var(--mint)]/20 text-[var(--mint)] border-[var(--mint)]/30">
                              <Plus className="w-3 h-3 mr-1" />
                              {item.addedNotes.length} added
                            </Badge>
                          )}
                          {item.removedNotes.length > 0 && (
                            <Badge className="bg-[var(--coral)]/20 text-[var(--coral)] border-[var(--coral)]/30">
                              <Minus className="w-3 h-3 mr-1" />
                              {item.removedNotes.length} removed
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRejectTrack(item.trackType)}
                        variant="outline"
                        className="border-[var(--coral)] text-[var(--coral)] hover:bg-[var(--coral)]/10"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptTrack(item.trackType)}
                        className="bg-[var(--mint)] text-black hover:bg-[var(--mint-hover)]"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Accept
                      </Button>
                    </div>
                  </div>

                  {/* Visual diff preview */}
                  {item.type === 'modified' && (
                    <div className="flex gap-2 flex-wrap">
                      {item.addedNotes.slice(0, 8).map((note, i) => (
                        <div
                          key={`add-${i}`}
                          className="h-2 w-6 rounded bg-[var(--mint)]/40 border border-[var(--mint)]"
                          title={`Note ${note.pitch} at beat ${note.start.toFixed(2)}`}
                        />
                      ))}
                      {item.removedNotes.slice(0, 8).map((note, i) => (
                        <div
                          key={`rem-${i}`}
                          className="h-2 w-6 rounded bg-[var(--coral)]/40 border border-[var(--coral)] opacity-50"
                          style={{ textDecoration: 'line-through' }}
                          title={`Note ${note.pitch} at beat ${note.start.toFixed(2)}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between p-6 border-t border-[var(--hair)]">
          <Button
            onClick={handleRejectAll}
            variant="outline"
            className="border-[var(--coral)] text-[var(--coral)] hover:bg-[var(--coral)]/10"
          >
            <X className="w-4 h-4 mr-2" />
            Reject All Changes
          </Button>
          
          <Button
            onClick={handleAcceptAll}
            className="bg-[var(--mint)] text-black hover:bg-[var(--mint-hover)] font-semibold"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept All Changes
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
