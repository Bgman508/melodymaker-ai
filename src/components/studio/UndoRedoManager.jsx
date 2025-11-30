import React, { createContext, useContext, useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Undo, Redo, History } from "lucide-react";
import { toast } from "sonner";

const UndoRedoContext = createContext();

export function UndoRedoProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [maxHistory] = useState(50);

  const saveState = useCallback((state, description) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push({
      state,
      description,
      timestamp: Date.now()
    });
    
    if (newHistory.length > maxHistory) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  }, [history, currentIndex, maxHistory]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      toast.info(`Undo: ${history[currentIndex - 1].description}`);
      return history[currentIndex - 1].state;
    }
    return null;
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      toast.info(`Redo: ${history[currentIndex + 1].description}`);
      return history[currentIndex + 1].state;
    }
    return null;
  }, [currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return (
    <UndoRedoContext.Provider value={{ saveState, undo, redo, canUndo, canRedo, history, currentIndex }}>
      {children}
    </UndoRedoContext.Provider>
  );
}

export function useUndoRedo() {
  return useContext(UndoRedoContext);
}

export function UndoRedoControls() {
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={undo}
        disabled={!canUndo}
        className="h-8 w-8 p-0"
        title="Undo (⌘Z)"
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={redo}
        disabled={!canRedo}
        className="h-8 w-8 p-0"
        title="Redo (⌘⇧Z)"
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
}

export function HistoryTimeline() {
  const { history, currentIndex, saveState } = useUndoRedo();
  const [showTimeline, setShowTimeline] = useState(false);

  if (!showTimeline) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowTimeline(true)}
        className="h-8 w-8 p-0"
        title="History"
      >
        <History className="w-4 h-4" />
      </Button>
    );
  }

  return (
    <div className="absolute top-12 right-4 bg-[var(--surface)] border border-[var(--hair)] rounded-xl p-4 max-h-96 overflow-y-auto z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">History</h3>
        <Button variant="ghost" size="sm" onClick={() => setShowTimeline(false)}>×</Button>
      </div>
      <div className="space-y-2">
        {history.map((item, idx) => (
          <div
            key={idx}
            className={`p-2 rounded text-sm ${idx === currentIndex ? 'bg-[var(--mint)]/20 border border-[var(--mint)]' : 'bg-[var(--surface-2)]'}`}
          >
            <div className="font-medium">{item.description}</div>
            <div className="text-xs text-[var(--muted)]">
              {new Date(item.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}