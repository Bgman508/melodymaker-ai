import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Gamepad2, Trash2, Radio } from "lucide-react";
import { toast } from "sonner";

export default function MIDILearn({ onMappingChange }) {
  const [learning, setLearning] = useState(false);
  const [learningTarget, setLearningTarget] = useState(null);
  const [mappings, setMappings] = useState([]);
  const [midiAccess, setMidiAccess] = useState(null);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          setMidiAccess(access);
          setupMIDIInputs(access);
        })
        .catch(() => toast.error('MIDI access denied'));
    }
  }, []);

  const setupMIDIInputs = (access) => {
    for (const input of access.inputs.values()) {
      input.onmidimessage = handleMIDIMessage;
    }
  };

  const handleMIDIMessage = (message) => {
    if (!learning) return;

    const [status, cc, value] = message.data;
    const command = status >> 4;

    if (command === 11) { // CC message
      const newMapping = {
        id: Date.now(),
        cc,
        parameter: learningTarget,
        label: `CC ${cc} → ${learningTarget}`
      };

      setMappings(prev => [...prev, newMapping]);
      onMappingChange?.(newMapping);
      
      setLearning(false);
      setLearningTarget(null);
      
      toast.success(`Mapped CC ${cc} to ${learningTarget}`);
    }
  };

  const startLearning = (parameter) => {
    setLearning(true);
    setLearningTarget(parameter);
    toast.info(`Move a knob/fader on your MIDI controller...`);
  };

  const deleteMapping = (id) => {
    setMappings(prev => prev.filter(m => m.id !== id));
    toast.success('Mapping deleted');
  };

  const parameters = [
    'Master Volume',
    'Track 1 Volume',
    'Track 2 Volume',
    'Track 3 Volume',
    'Master Reverb',
    'Master Delay',
    'Tempo'
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Gamepad2 className="w-4 h-4" />
          MIDI Learn
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-[var(--surface)] border-[var(--line)] max-w-2xl">
        <DialogHeader>
          <DialogTitle>MIDI Controller Mapping</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!midiAccess || midiAccess.inputs.size === 0 ? (
            <div className="p-4 rounded-lg bg-[var(--surface-2)] border border-[var(--hair)] text-center">
              <p className="text-sm text-[var(--muted)]">
                No MIDI controllers detected
              </p>
            </div>
          ) : (
            <>
              <p className="text-sm text-[var(--muted)]">
                Click "Learn" next to a parameter, then move a knob/fader on your controller
              </p>

              {/* Available Parameters */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold">Available Parameters</h3>
                <div className="grid grid-cols-2 gap-2">
                  {parameters.map(param => (
                    <div
                      key={param}
                      className="flex items-center justify-between p-2 rounded bg-[var(--surface-2)] border border-[var(--hair)]"
                    >
                      <span className="text-sm">{param}</span>
                      <Button
                        size="sm"
                        variant={learning && learningTarget === param ? "default" : "outline"}
                        onClick={() => startLearning(param)}
                        className="h-7 gap-1"
                      >
                        {learning && learningTarget === param ? (
                          <>
                            <Radio className="w-3 h-3 animate-pulse" />
                            Listening...
                          </>
                        ) : (
                          'Learn'
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Current Mappings */}
              {mappings.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold">Active Mappings</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {mappings.map(mapping => (
                      <div
                        key={mapping.id}
                        className="flex items-center justify-between p-2 rounded bg-[var(--mint)]/10 border border-[var(--mint)]/30"
                      >
                        <span className="text-sm font-mono">{mapping.label}</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMapping(mapping.id)}
                          className="h-6 w-6 p-0 text-[var(--coral)]"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}