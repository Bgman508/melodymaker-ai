// Nashville Number System Parser
export class NashvilleNumberParser {
  constructor() {
    this.romanNumerals = {
      '1': 'I', '2': 'ii', '3': 'iii', '4': 'IV', '5': 'V', '6': 'vi', '7': 'vii°'
    };
    
    this.durationsymbols = {
      '.': 1.5,  // Dotted (1.5 beats)
      '+': 0.5,  // Half beat
      '': 1      // Default 1 beat
    };
  }

  parse(input, key = 'C', beatsPerBar = 4) {
    // Parse Nashville notation like "1-5-6-4" or "1. 5+ 6 4"
    const tokens = input.split(/[\s-]+/);
    const chords = [];
    let currentBeat = 0;
    
    tokens.forEach(token => {
      const { numeral, duration, extension } = this.parseToken(token);
      
      if (numeral) {
        chords.push({
          roman: this.romanNumerals[numeral] || 'I',
          start: currentBeat,
          duration: duration,
          extension: extension,
          key: key
        });
        
        currentBeat += duration;
      }
    });
    
    return chords;
  }

  parseToken(token) {
    // Parse tokens like "1.", "5+", "6m7", "4sus"
    let numeral = null;
    let duration = 1;
    let extension = '';
    
    // Extract numeral (first digit)
    const numeralMatch = token.match(/^(\d)/);
    if (numeralMatch) {
      numeral = numeralMatch[1];
    }
    
    // Extract duration modifiers
    if (token.includes('.')) {
      duration = 1.5;
    } else if (token.includes('+')) {
      duration = 0.5;
    } else if (token.includes('h')) {
      duration = 2; // hold for 2 beats
    }
    
    // Extract extensions (m, 7, 9, sus, etc.)
    const extMatch = token.match(/\d([a-z0-9]+)/);
    if (extMatch) {
      extension = extMatch[1];
    }
    
    return { numeral, duration, extension };
  }

  toMIDIChords(nashvilleChords, key, scale, octave = 4) {
    const notes = [];
    const scaleNotes = this.getScale(scale);
    const rootMidi = this.noteToMidi(key) + (octave * 12);
    
    nashvilleChords.forEach(chord => {
      const root = this.romanToScale(chord.roman, scaleNotes);
      let chordTones = [root, scaleNotes[2], scaleNotes[4]]; // Basic triad
      
      // Apply extensions
      if (chord.extension.includes('7')) {
        chordTones.push(scaleNotes[6]);
      }
      if (chord.extension.includes('9')) {
        chordTones.push(scaleNotes[1] + 12);
      }
      if (chord.extension.includes('sus')) {
        chordTones[1] = scaleNotes[3]; // Replace 3rd with 4th
      }
      if (chord.extension.includes('m')) {
        chordTones[1] = scaleNotes[2] - 1; // Flatten 3rd
      }
      
      chordTones.forEach((offset, i) => {
        notes.push({
          pitch: rootMidi + offset,
          start: chord.start,
          duration: chord.duration,
          velocity: 80 - (i * 8)
        });
      });
    });
    
    return notes;
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
    const clean = roman.replace(/[ivº°]/g, '').replace('i', 'I');
    return scale[map[clean]] || 0;
  }

  getExample() {
    return "1 5 6 4"; // I-V-vi-IV progression
  }

  getExamples() {
    return [
      { name: 'Pop Progression', notation: '1 5 6 4', description: 'I-V-vi-IV' },
      { name: 'Jazz ii-V-I', notation: '2 5 1', description: 'ii-V-I' },
      { name: 'Blues', notation: '1 1 1 1 4 4 1 1 5 4 1 5', description: '12-bar blues' },
      { name: 'Pachelbel', notation: '1 5 6 3 4 1 4 5', description: 'Canon in D' }
    ];
  }
}