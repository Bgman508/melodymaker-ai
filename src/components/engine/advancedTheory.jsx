// Advanced Music Theory & Voicings
export class AdvancedTheory {
  constructor() {
    this.timeSignatures = {
      '4/4': { beatsPerBar: 4, beatValue: 4, feel: 'straight' },
      '3/4': { beatsPerBar: 3, beatValue: 4, feel: 'waltz' },
      '6/8': { beatsPerBar: 6, beatValue: 8, feel: 'compound' },
      '7/8': { beatsPerBar: 7, beatValue: 8, feel: 'odd' },
      '5/4': { beatsPerBar: 5, beatValue: 4, feel: 'odd' },
      '12/8': { beatsPerBar: 12, beatValue: 8, feel: 'compound' }
    };

    this.voicingTypes = {
      'basic': { name: 'Root Position', intervals: [0, 4, 7] },
      'drop2': { name: 'Drop-2', intervals: [0, 7, 16, 19] },
      'drop3': { name: 'Drop-3', intervals: [0, 4, 19, 24] },
      'upperStructure': { name: 'Upper Structure', intervals: [0, 7, 14, 19, 24] },
      'quartal': { name: 'Quartal', intervals: [0, 5, 10, 15] },
      'cluster': { name: 'Cluster', intervals: [0, 1, 2, 7] }
    };

    this.articulations = {
      'staccato': { durationMult: 0.5, name: 'Staccato' },
      'legato': { durationMult: 1.1, name: 'Legato' },
      'tenuto': { durationMult: 1.0, velocityBoost: 5, name: 'Tenuto' },
      'marcato': { durationMult: 0.9, velocityBoost: 15, name: 'Marcato' },
      'accent': { durationMult: 1.0, velocityBoost: 20, name: 'Accent' }
    };

    this.phraseShapes = {
      'rising': { contour: [0, 0.2, 0.5, 0.8, 1.0], dynamics: [80, 85, 90, 95, 100] },
      'falling': { contour: [1.0, 0.8, 0.5, 0.2, 0], dynamics: [100, 95, 90, 85, 80] },
      'arch': { contour: [0, 0.5, 1.0, 0.5, 0], dynamics: [80, 90, 100, 90, 80] },
      'valley': { contour: [1.0, 0.5, 0, 0.5, 1.0], dynamics: [100, 90, 80, 90, 100] },
      'terrace': { contour: [0, 0, 0.5, 0.5, 1.0], dynamics: [80, 80, 90, 90, 100] }
    };

    this.bassPatterns = {
      'walking': { 
        style: 'chromatic',
        pattern: [0, 2, 4, 5],
        approach: true
      },
      'octaveJump': {
        style: 'bounce',
        pattern: [0, -12, 0, -12],
        approach: false
      },
      'pedal': {
        style: 'sustained',
        pattern: [0, 0, 0, 0],
        approach: false
      },
      'alberti': {
        style: 'arpeggiated',
        pattern: [0, 7, 4, 7],
        approach: false
      }
    };
  }

  getTimeSignature(sig) {
    return this.timeSignatures[sig] || this.timeSignatures['4/4'];
  }

  calculateBeatsForSignature(bars, timeSignature) {
    const sig = this.getTimeSignature(timeSignature);
    return bars * sig.beatsPerBar;
  }

  applyArticulation(note, articulation) {
    const art = this.articulations[articulation];
    if (!art) return note;

    return {
      ...note,
      duration: note.duration * art.durationMult,
      velocity: Math.min(127, note.velocity + (art.velocityBoost || 0))
    };
  }

  applyPhraseShape(notes, shape) {
    const shapeData = this.phraseShapes[shape];
    if (!shapeData || notes.length === 0) return notes;

    const { contour, dynamics } = shapeData;
    
    return notes.map((note, idx) => {
      const position = idx / (notes.length - 1 || 1);
      const contourIdx = Math.floor(position * (contour.length - 1));
      const dynamicIdx = Math.floor(position * (dynamics.length - 1));
      
      const pitchShift = Math.round((contour[contourIdx] - 0.5) * 12);
      const velocity = dynamics[dynamicIdx];

      return {
        ...note,
        pitch: note.pitch + pitchShift,
        velocity: Math.min(127, Math.max(1, velocity))
      };
    });
  }

  voiceChord(rootPitch, chordType, voicingType) {
    const voicing = this.voicingTypes[voicingType];
    if (!voicing) return [rootPitch, rootPitch + 4, rootPitch + 7];

    return voicing.intervals.map(interval => rootPitch + interval);
  }

  minimizeVoiceLeading(chord1, chord2) {
    // Simple voice-leading optimization
    const optimized = [...chord2];
    
    chord1.forEach((note1, i) => {
      let closestIdx = 0;
      let minDistance = Infinity;
      
      chord2.forEach((note2, j) => {
        const distance = Math.abs(note1 - note2);
        if (distance < minDistance) {
          minDistance = distance;
          closestIdx = j;
        }
      });
      
      // Swap to minimize movement
      if (closestIdx !== i && i < optimized.length) {
        [optimized[i], optimized[closestIdx]] = [optimized[closestIdx], optimized[i]];
      }
    });

    return optimized;
  }

  generateWalkingBass(chordRoot, nextChordRoot, beats) {
    const notes = [];
    const pattern = this.bassPatterns.walking.pattern;
    
    for (let i = 0; i < beats; i++) {
      let pitch = chordRoot + 36;
      
      if (i < pattern.length) {
        pitch += pattern[i];
      }
      
      // Chromatic approach to next chord
      if (i === beats - 1 && this.bassPatterns.walking.approach) {
        const diff = nextChordRoot - chordRoot;
        if (Math.abs(diff) > 2) {
          pitch = chordRoot + 36 + (diff > 0 ? 1 : -1);
        }
      }
      
      notes.push({
        pitch,
        start: i,
        duration: 0.9,
        velocity: i % 2 === 0 ? 100 : 85
      });
    }
    
    return notes;
  }

  addGraceNotes(note, graceType = 'lower') {
    const graceNote = {
      ...note,
      pitch: note.pitch + (graceType === 'lower' ? -1 : 1),
      start: note.start - 0.1,
      duration: 0.05,
      velocity: note.velocity - 20
    };
    
    return [graceNote, note];
  }

  addOrnament(note, ornamentType) {
    if (ornamentType === 'mordent') {
      return [
        note,
        { ...note, pitch: note.pitch + 1, start: note.start + 0.1, duration: 0.05 },
        { ...note, start: note.start + 0.15, duration: note.duration - 0.15 }
      ];
    } else if (ornamentType === 'turn') {
      return [
        note,
        { ...note, pitch: note.pitch + 2, start: note.start + 0.1, duration: 0.05 },
        { ...note, pitch: note.pitch + 1, start: note.start + 0.15, duration: 0.05 },
        { ...note, start: note.start + 0.2, duration: note.duration - 0.2 }
      ];
    }
    
    return [note];
  }
}