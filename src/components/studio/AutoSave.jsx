import React, { useEffect, useState } from 'react';
import { Cloud, CloudOff, Clock } from "lucide-react";
import { toast } from "sonner";

export default function AutoSave({ projectData, interval = 30000, onSave }) {
  const [lastSaved, setLastSaved] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const autoSaveInterval = setInterval(async () => {
      if (projectData && projectData.tracks?.length > 0) {
        setSaving(true);
        
        try {
          // Save to localStorage as backup
          localStorage.setItem('autosave-backup', JSON.stringify({
            ...projectData,
            timestamp: Date.now()
          }));

          // Call parent save function with properly formatted data
          await onSave?.(projectData);
          
          setLastSaved(new Date());
        } catch (error) {
          console.error('Auto-save failed:', error);
          // Don't show toast for auto-save failures to avoid spam
        }
        
        setSaving(false);
      }
    }, interval);

    return () => clearInterval(autoSaveInterval);
  }, [projectData, interval, onSave]);

  const getTimeSince = () => {
    if (!lastSaved) return 'Never';
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  };

  return (
    <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
      {saving ? (
        <>
          <Cloud className="w-3 h-3 animate-pulse text-[var(--mint)]" />
          <span>Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <Cloud className="w-3 h-3 text-[var(--mint)]" />
          <span>Saved {getTimeSince()}</span>
        </>
      ) : (
        <>
          <CloudOff className="w-3 h-3" />
          <span>Not saved</span>
        </>
      )}
    </div>
  );
}