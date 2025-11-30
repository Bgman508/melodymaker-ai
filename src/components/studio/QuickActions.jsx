import React from 'react';
import { Button } from "@/components/ui/button";
import { Wand2, Shuffle, Sparkles, Lightbulb, Music2 } from "lucide-react";
import { toast } from "sonner";

export default function QuickActions({ onGenerateVariation, onSuggestImprovement, onRandomize }) {
  const quickPrompts = [
    { label: "🎹 Add Piano", prompt: "add piano melody" },
    { label: "🥁 Drums", prompt: "add trap drums" },
    { label: "🎸 Guitar", prompt: "add acoustic guitar" },
    { label: "🎻 Strings", prompt: "add lush strings" },
    { label: "🎺 Brass", prompt: "add brass stabs" },
    { label: "🌊 Pad", prompt: "add ambient pad" }
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--muted)]">Quick Actions</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toast.info("AI analyzing your composition...")}
          className="gap-2"
        >
          <Lightbulb className="w-3 h-3" />
          Suggest
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {quickPrompts.map((item, idx) => (
          <Button
            key={idx}
            variant="outline"
            size="sm"
            onClick={() => onGenerateVariation(item.prompt)}
            className="justify-start text-xs"
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRandomize}
          className="flex-1 gap-2"
        >
          <Shuffle className="w-3 h-3" />
          Randomize
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onGenerateVariation("make it more interesting")}
          className="flex-1 gap-2"
        >
          <Sparkles className="w-3 h-3" />
          Enhance
        </Button>
      </div>
    </div>
  );
}