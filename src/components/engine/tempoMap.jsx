// Tempo Map & Rubato Engine
export class TempoMap {
  constructor() {
    this.tempoChanges = [];
    this.curves = {
      linear: (t) => t,
      exponential: (t) => Math.pow(t, 2),
      logarithmic: (t) => Math.log(t + 1) / Math.log(2),
      sine: (t) => Math.sin(t * Math.PI / 2)
    };
  }

  addTempoChange(bar, bpm) {
    this.tempoChanges.push({ bar, bpm });
    this.tempoChanges.sort((a, b) => a.bar - b.bar);
  }

  addRitardando(startBar, endBar, startBPM, endBPM, curve = 'exponential') {
    const bars = endBar - startBar;
    for (let i = 0; i <= bars; i++) {
      const t = i / bars;
      const curveFn = this.curves[curve];
      const bpm = startBPM + (endBPM - startBPM) * curveFn(t);
      this.addTempoChange(startBar + i, Math.round(bpm));
    }
  }

  addAccelerando(startBar, endBar, startBPM, endBPM, curve = 'exponential') {
    this.addRitardando(startBar, endBar, startBPM, endBPM, curve);
  }

  getTempo(bar) {
    if (this.tempoChanges.length === 0) return 120;
    
    // Find the tempo at or before this bar
    let tempo = this.tempoChanges[0].bpm;
    for (const change of this.tempoChanges) {
      if (change.bar <= bar) {
        tempo = change.bpm;
      } else {
        break;
      }
    }
    return tempo;
  }

  applyToNotes(notes, beatsPerBar = 4) {
    // Adjust note timings based on tempo map
    if (this.tempoChanges.length === 0) return notes;
    
    return notes.map(note => {
      const bar = Math.floor(note.start / beatsPerBar);
      const tempo = this.getTempo(bar);
      const baseTempo = 120;
      const timeScale = baseTempo / tempo;
      
      return {
        ...note,
        start: note.start * timeScale,
        duration: note.duration * timeScale
      };
    });
  }

  exportAsMetaEvents(ppq = 480) {
    // Generate MIDI tempo meta events
    const events = [];
    
    this.tempoChanges.forEach(change => {
      const microsecondsPerBeat = Math.floor(60000000 / change.bpm);
      const tick = Math.floor(change.bar * 4 * ppq);
      
      events.push({
        time: tick,
        type: 'tempo',
        data: [
          0xFF, 0x51, 0x03,
          (microsecondsPerBeat >> 16) & 0xFF,
          (microsecondsPerBeat >> 8) & 0xFF,
          microsecondsPerBeat & 0xFF
        ]
      });
    });
    
    return events;
  }

  clear() {
    this.tempoChanges = [];
  }

  clone() {
    const newMap = new TempoMap();
    newMap.tempoChanges = [...this.tempoChanges];
    return newMap;
  }
}