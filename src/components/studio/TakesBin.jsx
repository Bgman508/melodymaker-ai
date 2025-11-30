import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Folder, Play, Download, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function TakesBin({ takes, onRestoreTake, onDeleteTake }) {
  const [selectedTake, setSelectedTake] = useState(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Folder className="w-4 h-4" />
          Takes ({takes.length})
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-3xl">
        <DialogHeader>
          <DialogTitle>Project Takes</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 py-4 max-h-96 overflow-y-auto">
          {takes.length === 0 ? (
            <div className="py-12 text-center text-[var(--muted)]">
              No saved takes yet
            </div>
          ) : (
            takes.map((take, idx) => (
              <motion.div
                key={take.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`p-4 rounded-xl border-2 transition-colors cursor-pointer ${
                  selectedTake === take.id
                    ? 'border-[var(--mint)] bg-[var(--mint)]/10'
                    : 'border-[var(--hair)] hover:border-[var(--line)]'
                }`}
                onClick={() => setSelectedTake(take.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold mb-1">Take {idx + 1}</div>
                    <div className="text-sm text-[var(--muted)]">
                      {take.description || 'No description'}
                    </div>
                    <div className="text-xs text-[var(--muted-2)] mt-1">
                      {format(new Date(take.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRestoreTake(take);
                      }}
                      title="Restore"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Export take
                      }}
                      title="Export"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTake(take.id);
                      }}
                      className="text-[var(--coral)]"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}