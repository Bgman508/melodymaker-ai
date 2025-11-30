import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Settings } from "lucide-react";

export default function MasterBusProcessor({ onUpdate }) {
  const [settings, setSettings] = useState({
    limiter: {
      enabled: true,
      threshold: -3,
      ceiling: -0.3
    },
    compressor: {
      enabled: false,
      threshold: -12,
      ratio: 2,
      attack: 10,
      release: 100
    },
    eq: {
      enabled: false,
      low: 0,
      mid: 0,
      high: 0
    }
  });

  const updateSetting = (category, param, value) => {
    const updated = {
      ...settings,
      [category]: {
        ...settings[category],
        [param]: value
      }
    };
    setSettings(updated);
    onUpdate?.(updated);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="w-4 h-4" />
          Master Bus
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
        <DialogHeader>
          <DialogTitle>Master Bus Processing</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Limiter */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">🛡️ Limiter</h3>
              <input
                type="checkbox"
                checked={settings.limiter.enabled}
                onChange={(e) => updateSetting('limiter', 'enabled', e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </div>
            {settings.limiter.enabled && (
              <>
                <div>
                  <label className="text-xs text-[var(--muted)]">Threshold: {settings.limiter.threshold}dB</label>
                  <Slider
                    value={[settings.limiter.threshold + 20]}
                    onValueChange={(val) => updateSetting('limiter', 'threshold', val[0] - 20)}
                    max={20}
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">Ceiling: {settings.limiter.ceiling}dB</label>
                  <Slider
                    value={[settings.limiter.ceiling + 10]}
                    onValueChange={(val) => updateSetting('limiter', 'ceiling', val[0] - 10)}
                    max={10}
                    step={0.1}
                  />
                </div>
              </>
            )}
          </div>

          {/* Compressor */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">🔘 Compressor</h3>
              <input
                type="checkbox"
                checked={settings.compressor.enabled}
                onChange={(e) => updateSetting('compressor', 'enabled', e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </div>
            {settings.compressor.enabled && (
              <>
                <div>
                  <label className="text-xs text-[var(--muted)]">Threshold: {settings.compressor.threshold}dB</label>
                  <Slider
                    value={[settings.compressor.threshold + 60]}
                    onValueChange={(val) => updateSetting('compressor', 'threshold', val[0] - 60)}
                    max={60}
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">Ratio: {settings.compressor.ratio}:1</label>
                  <Slider
                    value={[settings.compressor.ratio]}
                    onValueChange={(val) => updateSetting('compressor', 'ratio', val[0])}
                    min={1}
                    max={10}
                    step={0.5}
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">Attack: {settings.compressor.attack}ms</label>
                  <Slider
                    value={[settings.compressor.attack]}
                    onValueChange={(val) => updateSetting('compressor', 'attack', val[0])}
                    max={100}
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">Release: {settings.compressor.release}ms</label>
                  <Slider
                    value={[settings.compressor.release]}
                    onValueChange={(val) => updateSetting('compressor', 'release', val[0])}
                    max={500}
                  />
                </div>
              </>
            )}
          </div>

          {/* Master EQ */}
          <div className="space-y-3 p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">📊 Master EQ</h3>
              <input
                type="checkbox"
                checked={settings.eq.enabled}
                onChange={(e) => updateSetting('eq', 'enabled', e.target.checked)}
                className="w-4 h-4 rounded"
              />
            </div>
            {settings.eq.enabled && (
              <>
                <div>
                  <label className="text-xs text-[var(--muted)]">Low: {settings.eq.low > 0 ? '+' : ''}{settings.eq.low}dB</label>
                  <Slider
                    value={[settings.eq.low + 12]}
                    onValueChange={(val) => updateSetting('eq', 'low', val[0] - 12)}
                    max={24}
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">Mid: {settings.eq.mid > 0 ? '+' : ''}{settings.eq.mid}dB</label>
                  <Slider
                    value={[settings.eq.mid + 12]}
                    onValueChange={(val) => updateSetting('eq', 'mid', val[0] - 12)}
                    max={24}
                  />
                </div>
                <div>
                  <label className="text-xs text-[var(--muted)]">High: {settings.eq.high > 0 ? '+' : ''}{settings.eq.high}dB</label>
                  <Slider
                    value={[settings.eq.high + 12]}
                    onValueChange={(val) => updateSetting('eq', 'high', val[0] - 12)}
                    max={24}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}