// Modal Interchange - Borrow chords from parallel modes
export class ModalInterchange {
  constructor() {
    this.parallelModes = {
      major: {
        dorian: ['ii', 'iv', 'bVII'],
        phrygian: ['bII', 'biii', 'bVI', 'bvii'],
        lydian: ['II', '#IV'],
        mixolydian: ['bVII', 'v'],
        aeolian: ['bVI', 'bVII', 'i', 'iv'],
        locrian: ['bII', 'bV', 'bVI', 'bvii']
      },
      minor: {
        major: ['I', 'II', 'IV', 'V', 'vi'],
        dorian: ['ii', 'IV'],
        phrygian: ['bII'],
        lydian: ['#IV'],
        mixolydian: ['bVII']
      }
    };
  }

  suggestBorrowedChords(key, scale, currentProgression) {
    const mode = scale.includes('minor') ? 'minor' : 'major';
    const suggestions = [];
    
    Object.entries(this.parallelModes[mode]).forEach(([borrowMode, chords]) => {
      chords.forEach(chord => {
        suggestions.push({
          chord,
          borrowedFrom: borrowMode,
          effect: this.getChordEffect(chord, mode),
          placement: this.suggestPlacement(chord, currentProgression)
        });
      });
    });
    
    return suggestions.sort((a, b) => b.placement.priority - a.placement.priority);
  }

  getChordEffect(chord, mode) {
    const effects = {
      'bVII': 'Adds brightness, bluesy feel',
      'bVI': 'Creates dark, emotional tension',
      'iv': 'Minor IV - melancholic, Beatles-esque',
      'bII': 'Neapolitan - dramatic, classical',
      '#IV': 'Lydian color - dreamy, ethereal',
      'I': 'Picardy third - hopeful resolution',
      'IV': 'Major IV in minor - lifts mood'
    };
    
    return effects[chord] || 'Adds modal color';
  }

  suggestPlacement(chord, progression) {
    // Suggest where in the progression this chord works best
    const placements = {
      'bVII': { position: 'pre-chorus', priority: 0.8 },
      'bVI': { position: 'verse end', priority: 0.7 },
      'iv': { position: 'chorus', priority: 0.9 },
      'bII': { position: 'before resolution', priority: 0.6 },
      '#IV': { position: 'any', priority: 0.5 }
    };
    
    return placements[chord] || { position: 'any', priority: 0.5 };
  }

  applyBorrowedChord(progression, borrowedChord, position) {
    const newProgression = [...progression];
    newProgression[position] = borrowedChord;
    return newProgression;
  }

  getChordVoicing(roman, key) {
    // Convert roman numeral to MIDI notes
    const root = this.romanToMidi(roman, key);
    const quality = this.getChordQuality(roman);
    
    return this.buildChordVoicing(root, quality);
  }

  romanToMidi(roman, key) {
    // Implementation for converting roman numeral to MIDI pitch
    const keyMap = { 'C': 60, 'D': 62, 'E': 64, 'F': 65, 'G': 67, 'A': 69, 'B': 71 };
    return keyMap[key] || 60;
  }

  getChordQuality(roman) {
    if (roman === roman.toUpperCase()) return 'major';
    if (roman.includes('o')) return 'diminished';
    return 'minor';
  }

  buildChordVoicing(root, quality) {
    const voicings = {
      major: [0, 4, 7],
      minor: [0, 3, 7],
      diminished: [0, 3, 6]
    };
    
    return voicings[quality].map(interval => root + interval);
  }
}