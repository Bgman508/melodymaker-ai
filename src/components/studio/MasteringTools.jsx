import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Volume2, Maximize2, Waves } from "lucide-react";
import { toast } from "sonner";

export default function MasteringTools({ tracks }) {
  const [settings, setSettings] = useState({
    limiter: { enabled: true, threshold: -0.3, ceiling: -0.1 },
    eq: { enabled: true, lowCut: 30, highBoost: 0 },
    stereo: { enabled: false, width: 100 },
    loudness: { enabled: true, target: -14 }
  });

  const [processing, setProcessing] = useState(false);

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const applyMastering = () => {
    setProcessing(true);
    
    // Simulate mastering process
    setTimeout(() => {
      setProcessing(false);
      toast.success('Mastering chain applied!', {
        description: 'Preview the changes in playback'
      });
    }, 1500);
  };

  const analyzeProject = () => {
    if (!tracks || tracks.length === 0) {
      toast.error('No tracks to analyze');
      return;
    }

    // Simple analysis
    const totalNotes = tracks.reduce((sum, t) => sum + (t.notes?.length || 0), 0);
    const avgVelocity = tracks.reduce((sum, t) => {
      const trackAvg = t.notes?.reduce((s, n) => s + n.velocity, 0) / (t.notes?.length || 1);
      return sum + trackAvg;
    }, 0) / tracks.length;

    toast.info('Project Analysis', {
      description: `${tracks.length} tracks, ${totalNotes} notes, avg velocity: ${Math.round(avgVelocity * 100)}`
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Sparkles className="w-4 h-4" />
          Mastering
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mastering Tools</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <p className="text-sm text-[var(--muted)]">
            Professional mastering chain for final polish
          </p>

          {/* Limiter */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[var(--coral)]" />
                <Label className="font-semibold">Limiter</Label>
              </div>
              <Switch
                checked={settings.limiter.enabled}
                onCheckedChange={(checked) => updateSetting('limiter', 'enabled', checked)}
              />
            </div>

            {settings.limiter.enabled && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-[var(--muted)]">
                    Threshold: {settings.limiter.threshold.toFixed(1)} dB
                  </Label>
                  <Slider
                    value={[settings.limiter.threshold]}
                    onValueChange={(val) => updateSetting('limiter', 'threshold', val[0])}
                    min={-12}
                    max={0}
                    step={0.1}
                  />
                </div>
                <div>
                  <Label className="text-xs text-[var(--muted)]">
                    Ceiling: {settings.limiter.ceiling.toFixed(1)} dB
                  </Label>
                  <Slider
                    value={[settings.limiter.ceiling]}
                    onValueChange={(val) => updateSetting('limiter', 'ceiling', val[0])}
                    min={-1}
                    max={0}
                    step={0.1}
                  />
                </div>
              </div>
            )}
          </div>

          {/* EQ */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Waves className="w-4 h-4 text-[var(--violet)]" />
                <Label className="font-semibold">Master EQ</Label>
              </div>
              <Switch
                checked={settings.eq.enabled}
                onCheckedChange={(checked) => updateSetting('eq', 'enabled', checked)}
              />
            </div>

            {settings.eq.enabled && (
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-[var(--muted)]">
                    Low Cut: {settings.eq.lowCut} Hz
                  </Label>
                  <Slider
                    value={[settings.eq.lowCut]}
                    onValueChange={(val) => updateSetting('eq', 'lowCut', val[0])}
                    min={20}
                    max={200}
                    step={5}
                  />
                </div>
                <div>
                  <Label className="text-xs text-[var(--muted)]">
                    High Boost: {settings.eq.highBoost > 0 ? '+' : ''}{settings.eq.highBoost.toFixed(1)} dB
                  </Label>
                  <Slider
                    value={[settings.eq.highBoost]}
                    onValueChange={(val) => updateSetting('eq', 'highBoost', val[0])}
                    min={-6}
                    max={6}
                    step={0.5}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Stereo Width */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-[var(--mint)]" />
                <Label className="font-semibold">Stereo Width</Label>
              </div>
              <Switch
                checked={settings.stereo.enabled}
                onCheckedChange={(checked) => updateSetting('stereo', 'enabled', checked)}
              />
            </div>

            {settings.stereo.enabled && (
              <div>
                <Label className="text-xs text-[var(--muted)]">
                  Width: {settings.stereo.width}%
                </Label>
                <Slider
                  value={[settings.stereo.width]}
                  onValueChange={(val) => updateSetting('stereo', 'width', val[0])}
                  min={0}
                  max={150}
                  step={5}
                />
              </div>
            )}
          </div>

          {/* Loudness */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[var(--ice)]" />
                <Label className="font-semibold">Loudness Normalization</Label>
              </div>
              <Switch
                checked={settings.loudness.enabled}
                onCheckedChange={(checked) => updateSetting('loudness', 'enabled', checked)}
              />
            </div>

            {settings.loudness.enabled && (
              <div>
                <Label className="text-xs text-[var(--muted)]">
                  Target: {settings.loudness.target} LUFS
                </Label>
                <Slider
                  value={[settings.loudness.target]}
                  onValueChange={(val) => updateSetting('loudness', 'target', val[0])}
                  min={-23}
                  max={-8}
                  step={1}
                />
                <p className="text-xs text-[var(--muted)] mt-2">
                  -14 LUFS recommended for streaming platforms
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              onClick={analyzeProject}
              variant="outline"
              className="flex-1"
            >
              Analyze Project
            </Button>
            <Button
              onClick={applyMastering}
              disabled={processing}
              className="flex-1 gap-2 bg-[var(--mint)] text-black"
            >
              <Sparkles className="w-4 h-4" />
              {processing ? 'Processing...' : 'Apply Mastering'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}