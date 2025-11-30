import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FolderOpen, Search, Clock, Music, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function ProjectBrowser({ open, onOpenChange, onLoadProject }) {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-updated_date'),
  });

  const filteredProjects = projects?.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0D0E12] border-white/10 max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-[#16DB93]" />
            Your Projects
          </DialogTitle>
        </DialogHeader>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="pl-10 bg-white/5 border-white/10"
            />
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-[#16DB93] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-12">
              <Music className="w-12 h-12 mx-auto text-white/10 mb-3" />
              <p className="text-white/40">No projects found</p>
            </div>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  onLoadProject(project);
                  onOpenChange(false);
                }}
                className="group p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/5 hover:border-[#16DB93]/30 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg group-hover:text-[#16DB93] transition-colors mb-2">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Music className="w-3 h-3" />
                        {project.tracks?.length || 0} tracks
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(project.updated_date), 'MMM d, yyyy')}
                      </span>
                      <span>{project.bpm} BPM</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#FF6B6B] hover:bg-[#FF6B6B]/10"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Delete project logic here
                      toast.info('Delete project feature coming soon');
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}