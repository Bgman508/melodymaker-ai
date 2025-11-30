import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Folder, FolderOpen, Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function TrackGrouping({ tracks, onUpdateGroups }) {
  const [groups, setGroups] = useState([
    { id: 'drums-group', name: 'Drums', color: '#FF6B6B', collapsed: false, trackIds: [] },
    { id: 'music-group', name: 'Music', color: '#7C61FF', collapsed: false, trackIds: [] }
  ]);

  const addGroup = () => {
    const newGroup = {
      id: `group-${Date.now()}`,
      name: `Group ${groups.length + 1}`,
      color: '#64748b',
      collapsed: false,
      trackIds: []
    };
    setGroups([...groups, newGroup]);
    toast.success('Group created');
  };

  const toggleTrack = (groupId, trackId) => {
    const updated = groups.map(group => {
      if (group.id === groupId) {
        const hasTrack = group.trackIds.includes(trackId);
        return {
          ...group,
          trackIds: hasTrack 
            ? group.trackIds.filter(id => id !== trackId)
            : [...group.trackIds, trackId]
        };
      }
      return group;
    });
    setGroups(updated);
    onUpdateGroups?.(updated);
  };

  const toggleCollapse = (groupId) => {
    const updated = groups.map(g => 
      g.id === groupId ? { ...g, collapsed: !g.collapsed } : g
    );
    setGroups(updated);
    onUpdateGroups?.(updated);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Folder className="w-4 h-4" />
          Groups
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Track Groups/Folders</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {groups.map(group => (
            <div
              key={group.id}
              className="border border-[var(--hair)] rounded-lg p-3 bg-[var(--surface-2)]"
              style={{ borderLeftColor: group.color, borderLeftWidth: '4px' }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleCollapse(group.id)}
                  className="h-6 w-6 p-0"
                >
                  {group.collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </Button>
                
                {group.collapsed ? <Folder className="w-4 h-4" /> : <FolderOpen className="w-4 h-4" />}
                
                <Input
                  value={group.name}
                  onChange={(e) => {
                    const updated = groups.map(g => 
                      g.id === group.id ? { ...g, name: e.target.value } : g
                    );
                    setGroups(updated);
                    onUpdateGroups?.(updated);
                  }}
                  className="flex-1 h-7 bg-[var(--bg)]"
                />
                
                <span className="text-xs text-[var(--muted)]">
                  {group.trackIds.length} tracks
                </span>
              </div>

              {!group.collapsed && (
                <div className="ml-9 space-y-2">
                  {tracks.map(track => (
                    <label
                      key={track.id}
                      className="flex items-center gap-2 p-2 rounded hover:bg-[var(--hover)] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={group.trackIds.includes(track.id)}
                        onChange={() => toggleTrack(group.id, track.id)}
                        className="w-4 h-4 rounded"
                      />
                      <span className="text-sm">{track.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Button onClick={addGroup} variant="outline" className="w-full gap-2">
            <Plus className="w-4 h-4" />
            Add Group
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}