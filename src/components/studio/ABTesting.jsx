import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { GitBranch, Check, X } from "lucide-react";
import { toast } from "sonner";

export default function ABTesting({ tracks, onSelectVersion }) {
  const [versions, setVersions] = useState([
    { id: 'A', tracks, label: 'Original', selected: true }
  ]);

  const createVariation = () => {
    const newVersion = {
      id: String.fromCharCode(65 + versions.length),
      tracks: [...tracks], // Would be a variation
      label: `Version ${String.fromCharCode(65 + versions.length)}`,
      selected: false
    };
    setVersions([...versions, newVersion]);
    toast.success('Created variation to compare');
  };

  const selectVersion = (id) => {
    const updated = versions.map(v => ({ ...v, selected: v.id === id }));
    setVersions(updated);
    const selected = updated.find(v => v.id === id);
    onSelectVersion(selected.tracks);
    toast.success(`Switched to Version ${id}`);
  };

  if (versions.length <= 1) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={createVariation}
        className="gap-2"
      >
        <GitBranch className="w-4 h-4" />
        Create Variation
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-[var(--muted)]">Compare Versions</h3>
      <div className="flex gap-2">
        {versions.map(version => (
          <Button
            key={version.id}
            variant={version.selected ? "default" : "outline"}
            size="sm"
            onClick={() => selectVersion(version.id)}
            className="flex-1"
          >
            {version.id}
            {version.selected && <Check className="w-3 h-3 ml-1" />}
          </Button>
        ))}
        {versions.length < 5 && (
          <Button
            variant="outline"
            size="sm"
            onClick={createVariation}
          >
            +
          </Button>
        )}
      </div>
    </div>
  );
}