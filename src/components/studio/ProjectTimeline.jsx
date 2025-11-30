import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Copy, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const sectionColors = {
  intro: 'from-purple-600 to-purple-700',
  verse: 'from-blue-600 to-blue-700',
  pre: 'from-yellow-600 to-yellow-700',
  hook: 'from-pink-600 to-pink-700',
  chorus: 'from-pink-600 to-pink-700',
  bridge: 'from-green-600 to-green-700',
  post: 'from-orange-600 to-orange-700',
  outro: 'from-slate-600 to-slate-700'
};

export default function ProjectTimeline({ sections, onUpdate }) {
  const addSection = () => {
    onUpdate([...sections, { name: 'verse', bars: 8 }]);
  };

  const updateSection = (index, updates) => {
    const newSections = [...sections];
    newSections[index] = { ...newSections[index], ...updates };
    onUpdate(newSections);
  };

  const duplicateSection = (index) => {
    const newSections = [...sections];
    newSections.splice(index + 1, 0, { ...sections[index] });
    onUpdate(newSections);
  };

  const deleteSection = (index) => {
    onUpdate(sections.filter((_, i) => i !== index));
  };

  return (
    <Card className="bg-slate-900/50 border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Project Timeline</h3>
        <Button
          onClick={addSection}
          size="sm"
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add Section
        </Button>
      </div>

      <div className="space-y-2">
        {sections.map((section, idx) => (
          <div
            key={idx}
            className={cn(
              "group relative rounded-lg p-3 bg-gradient-to-r",
              sectionColors[section.name] || sectionColors.verse
            )}
          >
            <div className="flex items-center gap-3">
              <GripVertical className="w-4 h-4 text-white/50 cursor-grab" />
              
              <div className="flex-1 flex items-center gap-2">
                <Input
                  value={section.name}
                  onChange={(e) => updateSection(idx, { name: e.target.value })}
                  className="w-24 h-8 bg-white/10 border-white/20 text-white text-sm"
                />
                
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={1}
                    max={32}
                    value={section.bars}
                    onChange={(e) => updateSection(idx, { bars: parseInt(e.target.value) })}
                    className="w-16 h-8 bg-white/10 border-white/20 text-white text-sm"
                  />
                  <span className="text-xs text-white/70">bars</span>
                </div>
              </div>

              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => duplicateSection(idx)}
                  className="h-8 w-8 text-white hover:bg-white/10"
                >
                  <Copy className="w-3 h-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => deleteSection(idx)}
                  className="h-8 w-8 text-white hover:bg-red-500/20"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No sections yet. Click "Add Section" to start.</p>
        </div>
      )}
    </Card>
  );
}