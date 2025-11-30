import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Play, Copy } from "lucide-react";
import { HookFinder } from "../engine/hookFinder";
import { toast } from "sonner";

export default function HookFinderPanel({ tracks, onHighlightSection }) {
  const [hookAnalysis, setHookAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  const findHook = async () => {
    setAnalyzing(true);
    
    try {
      const finder = new HookFinder();
      const result = finder.analyzeComposition(tracks);
      
      if (result) {
        setHookAnalysis(result);
        onHighlightSection(result.startBeat, result.endBeat);
        toast.success(`Found potential hook! Score: ${(result.score * 100).toFixed(0)}%`);
      } else {
        toast.info('No clear hook pattern detected');
      }
    } catch (error) {
      toast.error('Hook analysis failed');
    }
    
    setAnalyzing(false);
  };

  return (
    <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[var(--mint)]" />
          Hook Finder
        </h3>
        <Button
          onClick={findHook}
          disabled={analyzing}
          size="sm"
          variant="outline"
        >
          {analyzing ? 'Analyzing...' : 'Find Hook'}
        </Button>
      </div>

      {hookAnalysis && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--muted)]">Hook Quality</span>
            <Badge className="bg-[var(--mint)]/20 text-[var(--mint)]">
              {(hookAnalysis.score * 100).toFixed(0)}%
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-[var(--surface)] border border-[var(--hair)]">
              <div className="text-[var(--muted)]">Start</div>
              <div className="font-mono">Bar {Math.floor(hookAnalysis.startBeat / 4) + 1}</div>
            </div>
            <div className="p-2 rounded bg-[var(--surface)] border border-[var(--hair)]">
              <div className="text-[var(--muted)]">Length</div>
              <div className="font-mono">{hookAnalysis.phrase.length} notes</div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => onHighlightSection(hookAnalysis.startBeat, hookAnalysis.endBeat)}
            >
              <Play className="w-3 h-3 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
            >
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </Button>
          </div>

          <div className="text-xs text-[var(--muted)] space-y-1">
            <div>• {hookAnalysis.analysis.uniquePitches} unique notes</div>
            <div>• {hookAnalysis.analysis.pitchRange} semitone range</div>
            <div>• Avg duration: {(hookAnalysis.analysis.avgDuration * 100).toFixed(0)}ms</div>
          </div>
        </div>
      )}
    </div>
  );
}