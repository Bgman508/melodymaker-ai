// AI Harmonizer - Melody to Chords & Chords to Melody
export class Harmonizer {
  constructor() {
    this.scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10]
    };
    
    this.chordPatterns = {
      major: [
        { degrees: [0, 2, 4], quality: 'major' },   // I
        { degrees: [1, 3, 5], quality: 'minor' },   // ii
        { degrees: [2, 4, 6], quality: 'minor' },   // iii
        { degrees: [3, 5, 0], quality: 'major' },   // IV
        { degrees: [4, 6, 1], quality: 'major' },   // V
        { degrees: [5, 0, 2], quality: 'minor' },   // vi
      ],
      minor: [
        { degrees: [0, 2, 4], quality: 'minor' },   // i
        { degrees: [3, 5, 0], quality: 'major' },   // III
        { degrees: [4, 6, 1], quality: 'major' },   // V
        { degrees: [5, 0, 2], quality: 'major' },   // VI
      ]
    };
  }

  melodToChords(melody, key = 'C', scale = 'major') {
    const scaleNotes = this.scales[scale];
    const rootMidi = this.noteToMidi(key);
    
    // Group melody into phrases (bars)
    const phrases = this.groupIntoPhases(melody, 2); // 2 beats per chord
    
    const chords = [];
    phrases.forEach(phrase => {
      const chordNotes = this.findBestChord(phrase, scaleNotes, rootMidi, scale);
      chords.push(chordNotes);
    });
    
    return chords;
  }

  findBestChord(melodyNotes, scaleNotes, rootMidi, scaleType) {
    const patterns = this.chordPatterns[scaleType];
    let bestScore = -1;
    let bestChord = null;
    
    patterns.forEach(pattern => {
      const chordPitches = pattern.degrees.map(deg => 
        rootMidi + 48 + scaleNotes[deg]
      );
      
      // Score based on how many melody notes are in the chord
      let score = 0;
      melodyNotes.forEach(note => {
        const normPitch = note.pitch % 12;
        chordPitches.forEach(chordPitch => {
          if (normPitch === chordPitch % 12) score += 2;
        });
      });
      
      if (score > bestScore) {
        bestScore = score;
        bestChord = {
          pitches: chordPitches,
          start: melodyNotes[0]?.start || 0,
          duration: 2,
          quality: pattern.quality
        };
      }
    });
    
    return bestChord;
  }

  chordsToMelody(chords, energy = 'medium', key = 'C', scale = 'major') {
    const scaleNotes = this.scales[scale];
    const rootMidi = this.noteToMidi(key);
    const melody = [];
    
    const notesPerChord = energy === 'high' ? 8 : energy === 'low' ? 2 : 4;
    
    chords.forEach(chord => {
      const chordTones = chord.pitches.map(p => p % 12);
      
      for (let i = 0; i < notesPerChord; i++) {
        const beat = chord.start + (i / notesPerChord) * chord.duration;
        const useChordTone = i % 2 === 0; // Chord tones on strong beats
        
        let pitch;
        if (useChordTone) {
          pitch = chord.pitches[i % chord.pitches.length] + 12; // Octave up
        } else {
          const scaleIdx = Math.floor(Math.random() * scaleNotes.length);
          pitch = rootMidi + 72 + scaleNotes[scaleIdx];
        }
        
        melody.push({
          pitch,
          start: beat,
          duration: 0.4,
          velocity: 90 + Math.random() * 10
        });
      }
    });
    
    return melody;
  }

  groupIntoPhases(notes, beatsPerPhrase) {
    const sorted = [...notes].sort((a, b) => a.start - b.start);
    const phrases = [];
    let currentPhrase = [];
    let currentBar = 0;
    
    sorted.forEach(note => {
      const noteBar = Math.floor(note.start / beatsPerPhrase);
      if (noteBar !== currentBar) {
        if (currentPhrase.length > 0) phrases.push(currentPhrase);
        currentPhrase = [];
        currentBar = noteBar;
      }
      currentPhrase.push(note);
    });
    
    if (currentPhrase.length > 0) phrases.push(currentPhrase);
    return phrases;
  }

  noteToMidi(note) {
    const noteMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    const letter = note[0].toUpperCase();
    let offset = noteMap[letter];
    if (note[1] === '#') offset++;
    if (note[1] === 'b') offset--;
    return offset;
  }
}