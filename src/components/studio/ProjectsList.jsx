import React from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FolderOpen, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

export default function ProjectsList({ onLoadProject }) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-updated_date', 50),
    initialData: []
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FolderOpen className="w-4 h-4" />
          Open
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>Recent Projects</DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] py-4">
          {isLoading ? (
            <div className="text-center py-8 text-[var(--muted)]">
              Loading projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-[var(--muted)]">
              No saved projects yet
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onLoadProject(project)}
                  className="w-full p-4 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--hover)] border border-[var(--hair)] transition-colors text-left"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[var(--text)] mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-[var(--muted)] line-clamp-2 mb-2">
                        {project.prompt || 'No prompt'}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[var(--muted-2)]">
                        <span>{project.bpm} BPM</span>
                        <span>•</span>
                        <span>{JSON.parse(project.tracks || '[]').length} tracks</span>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(project.updated_date), 'MMM d, h:mm a')}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}