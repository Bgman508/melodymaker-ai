import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GripVertical, Plus, Trash2, Settings } from "lucide-react";

export default function SectionEditor({ structure, onChange }) {
  const [editingIdx, setEditingIdx] = useState(null);

  const handleBarsChange = (idx, newBars) => {
    const updated = [...structure];
    updated[idx] = { ...updated[idx], bars: parseInt(newBars) || 4 };
    onChange(updated);
  };

  const handleTimeSignatureChange = (idx, timeSig) => {
    const updated = [...structure];
    updated[idx] = { ...updated[idx], timeSignature: timeSig };
    onChange(updated);
  };

  const handleAddSection = () => {
    onChange([...structure, { name: 'section', bars: 8, timeSignature: '4/4' }]);
  };

  const handleRemove = (idx) => {
    onChange(structure.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      {structure.map((section, idx) => (
        <div
          key={idx}
          className="flex items-center gap-2 p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]"
        >
          <button className="cursor-move p-1">
            <GripVertical className="w-4 h-4 text-[var(--muted)]" />
          </button>
          
          <div className="flex-1">
            <Input
              value={section.name}
              onChange={(e) => {
                const updated = [...structure];
                updated[idx] = { ...updated[idx], name: e.target.value };
                onChange(updated);
              }}
              className="h-8 bg-transparent border-0"
            />
          </div>

          <Input
            type="number"
            value={section.bars}
            onChange={(e) => handleBarsChange(idx, e.target.value)}
            className="w-16 h-8"
            min="1"
            max="32"
          />
          <span className="text-xs text-[var(--muted)]">bars</span>

          <Select
            value={section.timeSignature || '4/4'}
            onValueChange={(val) => handleTimeSignatureChange(idx, val)}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="4/4">4/4</SelectItem>
              <SelectItem value="3/4">3/4</SelectItem>
              <SelectItem value="6/8">6/8</SelectItem>
              <SelectItem value="5/4">5/4</SelectItem>
              <SelectItem value="7/8">7/8</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemove(idx)}
            className="h-8 w-8 p-0 text-[var(--coral)]"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={handleAddSection}
        className="w-full"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Section
      </Button>
    </div>
  );
}