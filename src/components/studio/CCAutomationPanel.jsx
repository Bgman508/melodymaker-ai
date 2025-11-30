import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CCAutomation } from "../engine/ccAutomation";
import { Wand2 } from "lucide-react";

export default function CCAutomationPanel({ onApplyAutomation }) {
  const [ccType, setCCType] = useState('74');
  const [curve, setCurve] = useState('linear');
  const [startValue, setStartValue] = useState(0);
  const [endValue, setEndValue] = useState(127);
  
  const ccAutomation = new CCAutomation();

  const applyAutomation = () => {
    const automation = ccAutomation.generateAutomation(
      parseInt(ccType),
      0,
      32,
      startValue,
      endValue,
      curve
    );
    onApplyAutomation(automation);
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[var(--ice)]" />
          CC Automation
        </h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-[var(--muted)] mb-1 block">Controller</label>
          <Select value={ccType} onValueChange={setCCType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Modulation</SelectItem>
              <SelectItem value="7">Volume</SelectItem>
              <SelectItem value="10">Pan</SelectItem>
              <SelectItem value="11">Expression</SelectItem>
              <SelectItem value="74">Brightness</SelectItem>
              <SelectItem value="91">Reverb</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] mb-1 block">Curve Type</label>
          <Select value={curve} onValueChange={setCurve}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear</SelectItem>
              <SelectItem value="exponential">Exponential</SelectItem>
              <SelectItem value="logarithmic">Logarithmic</SelectItem>
              <SelectItem value="sine">Sine</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] mb-1 block">Start Value: {startValue}</label>
          <Slider
            value={[startValue]}
            onValueChange={(val) => setStartValue(val[0])}
            max={127}
            step={1}
          />
        </div>

        <div>
          <label className="text-xs text-[var(--muted)] mb-1 block">End Value: {endValue}</label>
          <Slider
            value={[endValue]}
            onValueChange={(val) => setEndValue(val[0])}
            max={127}
            step={1}
          />
        </div>

        <Button
          onClick={applyAutomation}
          className="w-full bg-gradient-to-r from-[var(--ice)] to-[var(--mint)] text-black"
        >
          Apply Automation
        </Button>
      </div>
    </div>
  );
}