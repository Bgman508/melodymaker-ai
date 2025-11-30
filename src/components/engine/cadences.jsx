// Cadence & Tension Designer
export class CadenceDesigner {
  constructor() {
    this.cadenceTypes = {
      authentic: { 
        progression: ['V', 'I'],
        tension: 0.8,
        release: 1.0,
        description: 'Strong resolution'
      },
      plagal: {
        progression: ['IV', 'I'],
        tension: 0.4,
        release: 0.8,
        description: 'Amen cadence'
      },
      deceptive: {
        progression: ['V', 'vi'],
        tension: 0.9,
        release: 0.3,
        description: 'Surprise resolution'
      },
      half: {
        progression: ['I', 'V'],
        tension: 0.3,
        release: 0,
        description: 'Question ending'
      },
      phrygian: {
        progression: ['iv', 'V'],
        tension: 0.7,
        release: 0.6,
        description: 'Minor flavor'
      }
    };
  }

  applyCadence(section, cadenceType, tensionCurve = 'linear') {
    const cadence = this.cadenceTypes[cadenceType];
    if (!cadence) return section;
    
    const sectionLength = section.bars;
    const cadenceStart = sectionLength - 2; // Last 2 bars
    
    // Apply tension curve to dynamics
    section.notes = section.notes.map(note => {
      const barPos = note.start / 4;
      const tension = this.calculateTension(barPos, sectionLength, tensionCurve);
      
      return {
        ...note,
        velocity: Math.round(note.velocity * (0.7 + tension * 0.3))
      };
    });
    
    // Add cadence chords at the end
    const cadenceChords = this.generateCadenceChords(
      cadence.progression,
      cadenceStart * 4,
      section.key,
      section.scale
    );
    
    return {
      ...section,
      notes: [...section.notes, ...cadenceChords],
      cadence: cadenceType
    };
  }

  calculateTension(position, length, curve) {
    const normalized = position / length;
    
    switch (curve) {
      case 'linear':
        return normalized;
      case 'exponential':
        return Math.pow(normalized, 2);
      case 'arch':
        return Math.sin(normalized * Math.PI);
      case 'sudden':
        return normalized < 0.8 ? 0.3 : 1.0;
      default:
        return normalized;
    }
  }

  generateCadenceChords(progression, startBeat, key, scale) {
    const chords = [];
    const scaleNotes = this.getScale(scale);
    const rootMidi = this.noteToMidi(key);
    
    progression.forEach((roman, idx) => {
      const root = this.romanToScale(roman, scaleNotes);
      const chordTones = [root, scaleNotes[2], scaleNotes[4]];
      
      chordTones.forEach((offset, i) => {
        chords.push({
          pitch: rootMidi + 48 + offset,
          start: startBeat + (idx * 2),
          duration: 2,
          velocity: 90 - (i * 10)
        });
      });
    });
    
    return chords;
  }

  getScale(scaleName) {
    const scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10]
    };
    return scales[scaleName] || scales.major;
  }

  noteToMidi(note) {
    const noteMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    return noteMap[note[0].toUpperCase()] || 0;
  }

  romanToScale(roman, scale) {
    const map = { 'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6 };
    const num = roman.replace(/[iv]/g, match => match.toUpperCase());
    return scale[map[num]] || 0;
  }
}