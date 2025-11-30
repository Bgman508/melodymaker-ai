import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Plus } from "lucide-react";
import { ModalInterchange } from "../engine/modalInterchange";
import { toast } from "sonner";

export default function ModalInterchangePanel({ currentKey, currentScale, progression, onApplyChord }) {
  const [suggestions, setSuggestions] = useState([]);
  const modalInterchange = new ModalInterchange();

  const getSuggestions = () => {
    const borrowed = modalInterchange.suggestBorrowedChords(currentKey, currentScale, progression);
    setSuggestions(borrowed.slice(0, 5));
  };

  const applyBorrowedChord = (suggestion) => {
    onApplyChord(suggestion);
    toast.success(`Applied ${suggestion.chord} from ${suggestion.borrowedFrom} mode`);
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--violet)]" />
          Modal Interchange
        </h3>
        <Button
          onClick={getSuggestions}
          size="sm"
          variant="outline"
        >
          Get Ideas
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-2">
          {suggestions.map((sug, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--hair)] hover:border-[var(--violet)] transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-[var(--violet)]/20 text-[var(--violet)]">
                    {sug.chord}
                  </Badge>
                  <span className="text-xs text-[var(--muted)]">
                    from {sug.borrowedFrom}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => applyBorrowedChord(sug)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-[var(--muted)]">{sug.effect}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}