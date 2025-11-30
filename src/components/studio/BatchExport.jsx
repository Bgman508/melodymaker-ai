import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Package, Download } from "lucide-react";
import { toast } from "sonner";

export default function BatchExport({ variations, project, midiWriter, bpm }) {
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [exportFormat, setExportFormat] = useState('separate');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    
    try {
      if (exportFormat === 'zip') {
        // In production, use JSZip
        toast.info('Creating ZIP bundle...');
        
        selectedVariations.forEach((varId, idx) => {
          const variation = variations.find(v => v.id === varId);
          setTimeout(() => {
            midiWriter.downloadMIDI(
              variation.tracks,
              bpm,
              `${project.name}_v${idx + 1}.mid`
            );
          }, idx * 200);
        });
        
        toast.success(`Exported ${selectedVariations.length} variations!`);
      } else {
        selectedVariations.forEach((varId, idx) => {
          const variation = variations.find(v => v.id === varId);
          setTimeout(() => {
            midiWriter.downloadMIDI(
              variation.tracks,
              bpm,
              `${project.name}_v${idx + 1}.mid`
            );
          }, idx * 200);
        });
        
        toast.success(`Downloading ${selectedVariations.length} files...`);
      }
    } catch (error) {
      toast.error('Export failed');
    }
    
    setExporting(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Package className="w-4 h-4" />
          Batch Export
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-[var(--surface)] border-[var(--line)]">
        <DialogHeader>
          <DialogTitle>Batch Export Variations</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            {variations.map((variation) => (
              <div key={variation.id} className="flex items-center gap-2">
                <Checkbox
                  id={variation.id}
                  checked={selectedVariations.includes(variation.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedVariations([...selectedVariations, variation.id]);
                    } else {
                      setSelectedVariations(selectedVariations.filter(id => id !== variation.id));
                    }
                  }}
                />
                <Label htmlFor={variation.id} className="cursor-pointer">
                  Variation {variation.label} ({variation.track.notes.length} notes)
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label>Export Format</Label>
            <div className="flex gap-2">
              <Button
                variant={exportFormat === 'separate' ? 'default' : 'outline'}
                onClick={() => setExportFormat('separate')}
                className="flex-1"
              >
                Separate Files
              </Button>
              <Button
                variant={exportFormat === 'zip' ? 'default' : 'outline'}
                onClick={() => setExportFormat('zip')}
                className="flex-1"
              >
                ZIP Bundle
              </Button>
            </div>
          </div>

          <Button
            onClick={handleExport}
            disabled={selectedVariations.length === 0 || exporting}
            className="w-full bg-[var(--mint)] text-black hover:bg-[var(--mint-hover)]"
          >
            <Download className="w-4 h-4 mr-2" />
            {exporting ? 'Exporting...' : `Export ${selectedVariations.length} Variations`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}