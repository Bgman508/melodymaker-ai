import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Camera, Trash2, Play } from "lucide-react";
import { toast } from "sonner";

export default function MixerSnapshots({ tracks, onApplySnapshot }) {
  const [snapshots, setSnapshots] = useState([]);
  const [snapshotName, setSnapshotName] = useState('');

  const captureSnapshot = () => {
    if (!snapshotName.trim()) {
      toast.error('Enter a name for the snapshot');
      return;
    }

    const snapshot = {
      id: Date.now(),
      name: snapshotName,
      timestamp: new Date().toISOString(),
      state: tracks.map(t => ({
        id: t.id,
        name: t.name,
        volume: t.volume,
        pan: t.pan,
        muted: t.muted,
        solo: t.solo
      }))
    };

    setSnapshots(prev => [...prev, snapshot]);
    setSnapshotName('');
    toast.success(`Snapshot "${snapshot.name}" saved!`);
  };

  const applySnapshot = (snapshot) => {
    onApplySnapshot?.(snapshot.state);
    toast.success(`Applied "${snapshot.name}"`);
  };

  const deleteSnapshot = (id) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
    toast.success('Snapshot deleted');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Camera className="w-4 h-4" />
          Snapshots
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-md">
        <DialogHeader>
          <DialogTitle>Mixer Snapshots</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <p className="text-sm text-[var(--muted)]">
            Save and recall mixer settings (volume, pan, mute, solo)
          </p>

          {/* Capture New Snapshot */}
          <div className="flex gap-2">
            <Input
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="Snapshot name..."
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && captureSnapshot()}
            />
            <Button onClick={captureSnapshot} className="gap-2">
              <Camera className="w-4 h-4" />
              Capture
            </Button>
          </div>

          {/* Snapshot List */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {snapshots.length === 0 ? (
              <div className="p-8 text-center text-[var(--muted)] text-sm">
                No snapshots yet. Capture your first mixer state!
              </div>
            ) : (
              snapshots.map(snapshot => (
                <div
                  key={snapshot.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)]"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{snapshot.name}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {new Date(snapshot.timestamp).toLocaleString()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => applySnapshot(snapshot)}
                      className="h-8 gap-2"
                    >
                      <Play className="w-3 h-3" />
                      Apply
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteSnapshot(snapshot.id)}
                      className="h-8 w-8 p-0 text-[var(--coral)]"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}