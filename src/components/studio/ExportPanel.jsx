import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileMusic, Layers, Package } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function ExportPanel({ tracks, bpm, projectName, onExport, onExportStems, onExportZip }) {
  const [dawTemplate, setDawTemplate] = useState('logic');

  const dawTemplates = [
    { id: 'logic', name: 'Logic Pro X', description: 'Optimized track naming for Logic' },
    { id: 'fl', name: 'FL Studio', description: 'FL Studio compatible format' },
    { id: 'ableton', name: 'Ableton Live', description: 'Ableton friendly structure' },
    { id: 'generic', name: 'Generic/Standard', description: 'Universal MIDI format' }
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline"
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <Download className="w-4 h-4 mr-2" />
          Export Options
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Export MIDI Files</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* DAW Template Selection */}
          <div className="space-y-3">
            <Label className="text-slate-300">DAW Template</Label>
            <Select value={dawTemplate} onValueChange={setDawTemplate}>
              <SelectTrigger className="bg-slate-800 border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dawTemplates.map(template => (
                  <SelectItem key={template.id} value={template.id}>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-slate-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <Label className="text-slate-300">Export Format</Label>
            
            <div className="grid gap-3">
              <Button
                onClick={() => onExport(dawTemplate)}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 justify-start h-auto py-4"
              >
                <div className="flex items-center gap-3">
                  <FileMusic className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Download Complete MIDI (Type-1)</div>
                    <div className="text-xs opacity-80">All tracks in one file • PPQ 480 • Professional format</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => onExportStems(dawTemplate)}
                variant="outline"
                className="w-full border-slate-700 hover:bg-slate-800 justify-start h-auto py-4"
              >
                <div className="flex items-center gap-3">
                  <Layers className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Export All Stems (Type-0)</div>
                    <div className="text-xs opacity-80">4 separate files • Maximum DAW compatibility</div>
                  </div>
                </div>
              </Button>

              <Button
                onClick={() => onExportZip(dawTemplate)}
                variant="outline"
                className="w-full border-slate-700 hover:bg-slate-800 justify-start h-auto py-4"
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium">Export as ZIP Bundle</div>
                    <div className="text-xs opacity-80">Complete + stems + project info</div>
                  </div>
                </div>
              </Button>
            </div>
          </div>

          {/* Track Preview */}
          <div className="space-y-2">
            <Label className="text-slate-300 text-sm">Included Tracks</Label>
            <div className="grid grid-cols-2 gap-2">
              {tracks.map(track => (
                <div
                  key={track.id}
                  className="p-2 rounded bg-slate-800/50 border border-slate-700/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-white">{track.name}</span>
                    <span className="text-xs text-slate-500">{track.notes.length} notes</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    Ch.{track.channel} • GM Program {track.program}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-500">
              All MIDI files are SMF Type-1 compliant with proper tempo, time signature, and copyright meta events. 
              Stems are exported as Type-0 for maximum compatibility with all DAWs.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}