import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, Plus, X } from "lucide-react";

export default function ConstraintEditor({ constraints, onChange }) {
  const [rules, setRules] = useState(constraints || []);

  const addRule = () => {
    setRules([...rules, { type: 'range', param: 'pitch', min: 60, max: 72 }]);
  };

  const removeRule = (idx) => {
    setRules(rules.filter((_, i) => i !== idx));
  };

  const updateRule = (idx, updates) => {
    const updated = [...rules];
    updated[idx] = { ...updated[idx], ...updates };
    setRules(updated);
  };

  const applyConstraints = () => {
    onChange(rules);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          Constraints
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Composition Constraints</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-96 overflow-y-auto">
          {rules.map((rule, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)]">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label>Rule Type</Label>
                    <Select
                      value={rule.type}
                      onValueChange={(val) => updateRule(idx, { type: val })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="range">Range Limit</SelectItem>
                        <SelectItem value="scale">Scale Lock</SelectItem>
                        <SelectItem value="rhythm">Rhythm Pattern</SelectItem>
                        <SelectItem value="avoid">Avoid Notes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {rule.type === 'range' && (
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <Label>Parameter</Label>
                        <Select
                          value={rule.param}
                          onValueChange={(val) => updateRule(idx, { param: val })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pitch">Pitch</SelectItem>
                            <SelectItem value="velocity">Velocity</SelectItem>
                            <SelectItem value="duration">Duration</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Min</Label>
                        <Input
                          type="number"
                          value={rule.min}
                          onChange={(e) => updateRule(idx, { min: parseInt(e.target.value) })}
                        />
                      </div>
                      <div>
                        <Label>Max</Label>
                        <Input
                          type="number"
                          value={rule.max}
                          onChange={(e) => updateRule(idx, { max: parseInt(e.target.value) })}
                        />
                      </div>
                    </div>
                  )}

                  {rule.type === 'scale' && (
                    <div>
                      <Label>Allowed Scales</Label>
                      <Select
                        value={rule.scales}
                        onValueChange={(val) => updateRule(idx, { scales: val })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pentatonic">Pentatonic Only</SelectItem>
                          <SelectItem value="major">Major Only</SelectItem>
                          <SelectItem value="minor">Minor Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRule(idx)}
                  className="text-[var(--coral)]"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addRule}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Constraint
          </Button>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-[var(--hair)]">
          <Button variant="outline">Cancel</Button>
          <Button
            onClick={applyConstraints}
            className="bg-[var(--mint)] text-black hover:bg-[var(--mint-hover)]"
          >
            Apply Constraints
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}