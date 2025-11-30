// Tension Analyzer - Measures harmonic tension throughout composition
export class TensionAnalyzer {
  constructor() {
    this.tensionValues = {
      'I': 0,
      'ii': 0.3,
      'iii': 0.4,
      'IV': 0.2,
      'V': 0.8,
      'vi': 0.3,
      'vii': 0.9,
      'i': 0.1,
      'III': 0.5,
      'VI': 0.4,
      'VII': 0.6
    };
  }

  analyzeProgression(progression, structure) {
    const tensionCurve = [];
    let currentBeat = 0;
    
    structure.forEach(section => {
      const chordLength = (section.bars * 4) / progression.length;
      
      progression.forEach((roman, idx) => {
        const baseTension = this.tensionValues[roman] || 0.5;
        
        // Add contextual tension
        const nextChord = progression[(idx + 1) % progression.length];
        const resolution = this.getResolutionTension(roman, nextChord);
        
        tensionCurve.push({
          beat: currentBeat,
          chord: roman,
          tension: baseTension,
          resolution: resolution,
          section: section.name
        });
        
        currentBeat += chordLength;
      });
    });
    
    return tensionCurve;
  }

  getResolutionTension(current, next) {
    // V → I is strong resolution (tension decreases)
    if (current === 'V' && next === 'I') return -0.8;
    if (current === 'V' && next === 'vi') return -0.4; // Deceptive
    if (current === 'IV' && next === 'I') return -0.3;
    if (current === 'vii' && next === 'I') return -0.7;
    
    return 0;
  }

  analyzeMelodyTension(melodyTrack, chordTrack) {
    const tensions = [];
    
    melodyTrack.notes.forEach(note => {
      // Find current chord
      const currentChord = this.findChordAtTime(note.start, chordTrack);
      if (!currentChord) return;
      
      const tension = this.calculateNoteTension(note, currentChord);
      tensions.push({
        time: note.start,
        pitch: note.pitch,
        tension
      });
    });
    
    return tensions;
  }

  findChordAtTime(time, chordTrack) {
    return chordTrack.notes.filter(n => 
      n.start <= time && (n.start + n.duration) > time
    );
  }

  calculateNoteTension(note, chordNotes) {
    const chordPitches = chordNotes.map(n => n.pitch % 12);
    const notePitch = note.pitch % 12;
    
    // Check if note is in chord (consonant)
    if (chordPitches.includes(notePitch)) return 0.2;
    
    // Check for tensions (7ths, 9ths, etc.)
    const intervals = chordPitches.map(p => Math.abs(notePitch - p) % 12);
    
    if (intervals.includes(1) || intervals.includes(11)) return 0.9; // Minor 2nd
    if (intervals.includes(2) || intervals.includes(10)) return 0.6; // Major 2nd
    if (intervals.includes(6)) return 0.5; // Tritone
    
    return 0.4; // Other passing tones
  }

  getEmotionalProfile(tensionCurve) {
    const avgTension = tensionCurve.reduce((sum, t) => sum + t.tension, 0) / tensionCurve.length;
    const variance = this.calculateVariance(tensionCurve.map(t => t.tension));
    
    let profile = '';
    
    if (avgTension < 0.3) profile = 'Calm & Stable';
    else if (avgTension < 0.5) profile = 'Balanced';
    else if (avgTension < 0.7) profile = 'Dynamic & Exciting';
    else profile = 'Intense & Dramatic';
    
    if (variance > 0.15) profile += ' with High Drama';
    
    return profile;
  }

  calculateVariance(values) {
    const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
    return values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length;
  }
}