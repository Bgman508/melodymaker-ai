
// Professional MIDI Generation Engine with Advanced Music Theory
export class MIDIEngine {
  constructor() {
    this.scales = {
      major: [0, 2, 4, 5, 7, 9, 11],
      minor: [0, 2, 3, 5, 7, 8, 10],
      dorian: [0, 2, 3, 5, 7, 9, 10],
      phrygian: [0, 1, 3, 5, 7, 8, 10],
      lydian: [0, 2, 4, 6, 7, 9, 11],
      mixolydian: [0, 2, 4, 5, 7, 9, 10],
      aeolian: [0, 2, 3, 5, 7, 8, 10], // same as natural minor
      locrian: [0, 1, 3, 5, 6, 8, 10],
      harmonic_minor: [0, 2, 3, 5, 7, 8, 11],
      melodic_minor: [0, 2, 3, 5, 7, 9, 11],
      pentatonic_major: [0, 2, 4, 7, 9],
      pentatonic_minor: [0, 3, 5, 7, 10],
      blues: [0, 3, 5, 6, 7, 10],
      whole_tone: [0, 2, 4, 6, 8, 10],
      diminished: [0, 2, 3, 5, 6, 8, 9, 11], // whole-half
      chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
    };

    // Advanced chord progressions with functional harmony
    this.chordProgressions = {
      major: {
        pop: ['I', 'V', 'vi', 'IV'],
        jazz: ['Imaj7', 'ii7', 'V7', 'Imaj7'], // Common II-V-I for major
        gospel: ['I', 'IV', 'I', 'V', 'vi', 'IV', 'ii', 'V'],
        epic: ['I', 'V', 'vi', 'iii', 'IV', 'I', 'IV', 'V'],
        modern: ['I', 'bVII', 'IV', 'I'], // Borrowed flat VII
        default: ['I', 'V', 'vi', 'IV']
      },
      minor: {
        sad: ['i', 'VI', 'III', 'VII'], // common relative major progression
        dark: ['i', 'iv', 'VII', 'VI'],
        emotional: ['i', 'VI', 'iv', 'V'], // Harmonic minor V
        cinematic: ['i', 'bVI', 'bVII', 'i'],
        neo_soul: ['i7', 'iv7', 'bVII7', 'IVmaj7'], // Example: Cmin7, Fmin7, Bb7, Ebmaj7
        default: ['i', 'VI', 'III', 'VII']
      }
    };

    // Drum groove patterns
    this.groovePatterns = {
      trap: { swing: 0.5, ghost: true, triplets: true, hihats: 'sixteenths', pattern: 'standard' },
      lofi: { swing: 0.58, ghost: true, triplets: false, hihats: 'eighths', pattern: 'standard' },
      rnb: { swing: 0.54, ghost: true, triplets: false, hihats: 'eighths', pattern: 'standard' },
      afrobeats: { swing: 0.5, ghost: false, triplets: false, hihats: 'sixteenths', pattern: '3-3-2' },
      jazz: { swing: 0.66, ghost: true, triplets: true, hihats: 'eighths', pattern: 'standard' },
      default: { swing: 0.5, ghost: false, triplets: false, hihats: 'eighths', pattern: 'standard' }
    };

    // Secondary dominants and borrowed chords
    this.secondaryDominants = {
      'ii': 'V7/ii', // V7 of ii
      'iii': 'V7/iii',
      'IV': 'V7/IV',
      'V': 'V7/V',
      'vi': 'V7/vi'
    };

    this.borrowedChords = {
      major_from_minor: ['iv', 'bVI', 'bVII', 'bIII'], // Example in C major: Fmin, Ab, Bb, Eb
      minor_from_major: ['IV', 'Imaj7', 'ii7'] // (used in minor keys to borrow from parallel major)
    };

    // Voice leading rules
    this.voiceLeadingRules = {
      maxLeap: 7, // Maximum semitones for a single voice to jump
      preferStepwise: 0.7, // Probability of stepwise motion in melody
      avoidParallelFifths: true, // For harmony generation, not implemented yet
      avoidParallelOctaves: true, // For harmony generation, not implemented yet
      contraryMotion: 0.6 // Probability of contrary motion in outer voices (not implemented yet)
    };

    // Melodic contour shapes
    this.melodicContours = {
      arch: [0, 0.3, 0.7, 1.0, 0.7, 0.3, 0], // Peak in the middle
      ascending: [0, 0.2, 0.4, 0.6, 0.8, 1.0], // Gradually rising
      descending: [1.0, 0.8, 0.6, 0.4, 0.2, 0], // Gradually falling
      wave: [0, 0.5, 0, 0.5, 0, 0.5, 0], // Up and down repeatedly
      climax: [0, 0.2, 0.4, 0.9, 0.3, 0.1, 0] // Sharp rise to a peak, then fall
    };

    // Complete General MIDI instrument library (128 programs)
    this.gmInstruments = {
      // Piano (0-7)
      piano: [
        { value: 0, label: 'Acoustic Grand Piano', category: 'Piano' },
        { value: 1, label: 'Bright Acoustic Piano', category: 'Piano' },
        { value: 2, label: 'Electric Grand Piano', category: 'Piano' },
        { value: 3, label: 'Honky-tonk Piano', category: 'Piano' },
        { value: 4, label: 'Electric Piano 1 (Rhodes)', category: 'Piano' },
        { value: 5, label: 'Electric Piano 2 (Chorused)', category: 'Piano' },
        { value: 6, label: 'Harpsichord', category: 'Piano' },
        { value: 7, label: 'Clavinet', category: 'Piano' }
      ],

      // Chromatic Percussion (8-15)
      mallet: [
        { value: 8, label: 'Celesta', category: 'Mallet' },
        { value: 9, label: 'Glockenspiel', category: 'Mallet' },
        { value: 10, label: 'Music Box', category: 'Mallet' },
        { value: 11, label: 'Vibraphone', category: 'Mallet' },
        { value: 12, label: 'Marimba', category: 'Mallet' },
        { value: 13, label: 'Xylophone', category: 'Mallet' },
        { value: 14, label: 'Tubular Bells', category: 'Mallet' },
        { value: 15, label: 'Dulcimer', category: 'Mallet' }
      ],

      // Organ (16-23)
      organ: [
        { value: 16, label: 'Drawbar Organ (Hammond)', category: 'Organ' },
        { value: 17, label: 'Percussive Organ', category: 'Organ' },
        { value: 18, label: 'Rock Organ', category: 'Organ' },
        { value: 19, label: 'Church Organ', category: 'Organ' },
        { value: 20, label: 'Reed Organ', category: 'Organ' },
        { value: 21, label: 'Accordion', category: 'Organ' },
        { value: 22, label: 'Harmonica', category: 'Organ' },
        { value: 23, label: 'Tango Accordion', category: 'Organ' }
      ],

      // Guitar (24-31)
      guitar: [
        { value: 24, label: 'Nylon String Guitar', category: 'Guitar' },
        { value: 25, label: 'Steel String Guitar', category: 'Guitar' },
        { value: 26, label: 'Jazz Guitar', category: 'Guitar' },
        { value: 27, label: 'Clean Electric Guitar', category: 'Guitar' },
        { value: 28, label: 'Muted Electric Guitar', category: 'Guitar' },
        { value: 29, label: 'Overdriven Guitar', category: 'Guitar' },
        { value: 30, label: 'Distortion Guitar', category: 'Guitar' },
        { value: 31, label: 'Guitar Harmonics', category: 'Guitar' }
      ],

      // Bass (32-39)
      bass: [
        { value: 32, label: 'Acoustic Bass', category: 'Bass' },
        { value: 33, label: 'Finger Bass', category: 'Bass' },
        { value: 34, label: 'Pick Bass', category: 'Bass' },
        { value: 35, label: 'Fretless Bass', category: 'Bass' },
        { value: 36, label: 'Slap Bass 1', category: 'Bass' },
        { value: 37, label: 'Slap Bass 2', category: 'Bass' },
        { value: 38, label: 'Synth Bass 1', category: 'Bass' },
        { value: 39, label: 'Synth Bass 2', category: 'Bass' }
      ],

      // Strings (40-47)
      strings: [
        { value: 40, label: 'Violin', category: 'Strings' },
        { value: 41, label: 'Viola', category: 'Strings' },
        { value: 42, label: 'Cello', category: 'Strings' },
        { value: 43, label: 'Contrabass', category: 'Strings' },
        { value: 44, label: 'Tremolo Strings', category: 'Strings' },
        { value: 45, label: 'Pizzicato Strings', category: 'Strings' },
        { value: 46, label: 'Orchestral Harp', category: 'Strings' },
        { value: 47, label: 'Timpani', category: 'Strings' }
      ],

      // Ensemble (48-55)
      ensemble: [
        { value: 48, label: 'String Ensemble 1', category: 'Ensemble' },
        { value: 49, label: 'String Ensemble 2 (Slow)', category: 'Ensemble' },
        { value: 50, label: 'Synth Strings 1', category: 'Ensemble' },
        { value: 51, label: 'Synth Strings 2', category: 'Ensemble' },
        { value: 52, label: 'Choir Aahs', category: 'Ensemble' },
        { value: 53, label: 'Voice Oohs', category: 'Ensemble' },
        { value: 54, label: 'Synth Voice/Choir', category: 'Ensemble' },
        { value: 55, label: 'Orchestra Hit', category: 'Ensemble' }
      ],

      // Brass (56-63)
      brass: [
        { value: 56, label: 'Trumpet', category: 'Brass' },
        { value: 57, label: 'Trombone', category: 'Brass' },
        { value: 58, label: 'Tuba', category: 'Brass' },
        { value: 59, label: 'Muted Trumpet', category: 'Brass' },
        { value: 60, label: 'French Horn', category: 'Brass' },
        { value: 61, label: 'Brass Section', category: 'Brass' },
        { value: 62, label: 'Synth Brass 1', category: 'Brass' },
        { value: 63, label: 'Synth Brass 2', category: 'Brass' }
      ],

      // Reed (64-71)
      reed: [
        { value: 64, label: 'Soprano Sax', category: 'Reed' },
        { value: 65, label: 'Alto Sax', category: 'Reed' },
        { value: 66, label: 'Tenor Sax', category: 'Reed' },
        { value: 67, label: 'Baritone Sax', category: 'Reed' },
        { value: 68, label: 'Oboe', category: 'Reed' },
        { value: 69, label: 'English Horn', category: 'Reed' },
        { value: 70, label: 'Bassoon', category: 'Reed' },
        { value: 71, label: 'Clarinet', category: 'Reed' }
      ],

      // Pipe (72-79)
      pipe: [
        { value: 72, label: 'Piccolo', category: 'Pipe' },
        { value: 73, label: 'Flute', category: 'Pipe' },
        { value: 74, label: 'Recorder', category: 'Pipe' },
        { value: 75, label: 'Pan Flute', category: 'Pipe' },
        { value: 76, label: 'Bottle Blow', category: 'Pipe' },
        { value: 77, label: 'Shakuhachi', category: 'Pipe' },
        { value: 78, label: 'Whistle', category: 'Pipe' },
        { value: 79, label: 'Ocarina', category: 'Pipe' }
      ],

      // Synth Lead (80-87)
      lead: [
        { value: 80, label: 'Lead 1 (Square Wave)', category: 'Synth Lead' },
        { value: 81, label: 'Lead 2 (Sawtooth)', category: 'Synth Lead' },
        { value: 82, label: 'Lead 3 (Calliope)', category: 'Synth Lead' },
        { value: 83, label: 'Lead 4 (Chiffer)', category: 'Synth Lead' },
        { value: 84, label: 'Lead 5 (Charang)', category: 'Synth Lead' },
        { value: 85, label: 'Lead 6 (Voice Lead)', category: 'Synth Lead' },
        { value: 86, label: 'Lead 7 (Fifths)', category: 'Synth Lead' },
        { value: 87, label: 'Lead 8 (Bass + Lead)', category: 'Synth Lead' }
      ],

      // Synth Pad (88-95)
      pad: [
        { value: 88, label: 'Pad 1 (New Age)', category: 'Synth Pad' },
        { value: 89, label: 'Pad 2 (Warm)', category: 'Synth Pad' },
        { value: 90, label: 'Pad 3 (Polysynth)', category: 'Synth Pad' },
        { value: 91, label: 'Pad 4 (Choir)', category: 'Synth Pad' },
        { value: 92, label: 'Pad 5 (Bowed Glass)', category: 'Synth Pad' },
        { value: 93, label: 'Pad 6 (Metallic)', category: 'Synth Pad' },
        { value: 94, label: 'Pad 7 (Halo)', category: 'Synth Pad' },
        { value: 95, label: 'Pad 8 (Sweep)', category: 'Synth Pad' }
      ],

      // Synth FX (96-103)
      fx: [
        { value: 96, label: 'FX 1 (Rain)', category: 'Synth FX' },
        { value: 97, label: 'FX 2 (Soundtrack)', category: 'Synth FX' },
        { value: 98, label: 'FX 3 (Crystal)', category: 'Synth FX' },
        { value: 99, label: 'FX 4 (Atmosphere)', category: 'Synth FX' },
        { value: 100, label: 'FX 5 (Brightness)', category: 'Synth FX' },
        { value: 101, label: 'FX 6 (Goblins)', category: 'Synth FX' },
        { value: 102, label: 'FX 7 (Echoes)', category: 'Synth FX' },
        { value: 103, label: 'FX 8 (Sci-Fi)', category: 'Synth FX' }
      ],

      // Ethnic (104-111)
      ethnic: [
        { value: 104, label: 'Sitar', category: 'Ethnic' },
        { value: 105, label: 'Banjo', category: 'Ethnic' },
        { value: 106, label: 'Shamisen', category: 'Ethnic' },
        { value: 107, label: 'Koto', category: 'Ethnic' },
        { value: 108, label: 'Kalimba', category: 'Ethnic' },
        { value: 109, label: 'Bagpipe', category: 'Ethnic' },
        { value: 110, label: 'Fiddle', category: 'Ethnic' },
        { value: 111, label: 'Shanai', category: 'Ethnic' }
      ],

      // Percussive (112-119)
      percussive: [
        { value: 112, label: 'Tinkle Bell', category: 'Percussive' },
        { value: 113, label: 'Agogo', category: 'Percussive' },
        { value: 114, label: 'Steel Drums', category: 'Percussive' },
        { value: 115, label: 'Woodblock', category: 'Percussive' },
        { value: 116, label: 'Taiko Drum', category: 'Percussive' },
        { value: 117, label: 'Melodic Tom', category: 'Percussive' },
        { value: 118, label: 'Synth Drum', category: 'Percussive' },
        { value: 119, label: 'Reverse Cymbal', category: 'Percussive' }
      ],

      // Sound Effects (120-127)
      soundfx: [
        { value: 120, label: 'Guitar Fret Noise', category: 'Sound FX' },
        { value: 121, label: 'Breath Noise', category: 'Sound FX' },
        { value: 122, label: 'Seashore', category: 'Sound FX' },
        { value: 123, label: 'Bird Tweet', category: 'Sound FX' },
        { value: 124, label: 'Telephone Ring', category: 'Sound FX' },
        { value: 125, label: 'Helicopter', category: 'Sound FX' },
        { value: 126, label: 'Applause', category: 'Sound FX' },
        { value: 127, label: 'Gunshot', category: 'Sound FX' }
      ]
    };

    // Curated presets by mood/genre
    this.instrumentPresets = {
      classical: {
        melody: [73, 40, 72], // Flute, Violin, Piccolo
        harmony: [0, 48, 19], // Piano, Strings, Church Organ
        bass: [42, 43, 32], // Cello, Contrabass, Acoustic Bass
        drums: [0] // Standard Kit
      },
      jazz: {
        melody: [65, 56, 73], // Alto Sax, Trumpet, Flute
        harmony: [4, 26, 11], // EP1, Jazz Guitar, Vibraphone
        bass: [33, 35, 32], // Finger Bass, Fretless, Acoustic
        drums: [0] // Standard Kit (often played with brushes)
      },
      electronic: {
        melody: [80, 81, 85], // Square, Saw, Voice Lead
        harmony: [88, 90, 50], // New Age Pad, Polysynth, Synth Strings
        bass: [38, 39, 87], // Synth Bass 1/2, Bass+Lead
        drums: [25] // Trap Kit (808)
      },
      orchestral: {
        melody: [40, 73, 60], // Violin, Flute, French Horn
        harmony: [48, 61, 52], // String Ensemble, Brass Section, Choir
        bass: [42, 43, 58], // Cello, Contrabass, Tuba
        drums: [0] // Standard Kit (Timpani usually)
      },
      trap: {
        melody: [81, 85, 100], // Sawtooth, Voice Lead, Brightness FX
        harmony: [5, 88, 51], // Chorused EP, New Age Pad, Synth Strings 2
        bass: [38, 39], // Synth Bass 1/2
        drums: [25] // Trap Kit (808)
      },
      lofi: {
        melody: [4, 11, 9], // EP1, Vibraphone, Glockenspiel
        harmony: [5, 4, 88], // EP2, EP1, Warm Pad
        bass: [33, 32], // Finger Bass, Acoustic Bass
        drums: [40] // Lo-fi Kit
      },
      default: {
        melody: [80],
        harmony: [0],
        bass: [38],
        drums: [0]
      }
    };

    this.drumKit = {
      kick: 36, snare: 38, rim: 37, clap: 39,
      chh: 42, ohh: 46, tom: 45, ride: 51,
      crash: 49, perc: 54
    };

    this.humanization = {
      session_drummer: { timing: 0.02, velocity: 5 },
      tight_pop: { timing: 0.005, velocity: 2 },
      drunk_lofi: { timing: 0.08, velocity: 15 },
      default: { timing: 0.01, velocity: 3 }
    };

    this.chordExtensions = {
      basic: [],
      add9: [14],
      sus2: [-3, 2],
      sus4: [-3, 5],
      seventh: [10],
      ninth: [10, 14],
      eleventh: [10, 14, 17],
      thirteenth: [10, 14, 17, 21]
    };

    // Channel manager for 30 tracks
    this.maxTracks = 30;
    this.channelPool = Array.from({ length: 16 }, (_, i) => i).filter(ch => ch !== 9); // 0-8, 10-15
    this.trackCounter = 0;
  }

  // Add this method after the constructor
  async parseMIDI(arrayBuffer) {
    // Import and use MIDIParser
    const { MIDIParser } = await import('./midiParser');
    const parser = new MIDIParser();

    // Create a fake File object from ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: 'audio/midi' });
    const file = new File([blob], 'uploaded.mid', { type: 'audio/midi' });

    const parsedData = await parser.parseMIDIFile(file);
    const studioFormat = parser.convertToStudioFormat(parsedData);

    return {
      tracks: studioFormat.tracks,
      bpm: studioFormat.bpm,
      key: studioFormat.key,
      scale: studioFormat.scale,
      styleFeatures: studioFormat.styleFeatures
    };
  }

  assignChannel(trackType) {
    // Drums always get channel 9
    if (trackType === 'drums' || trackType === 'percussion') {
      return 9;
    }

    // Rotate through available channels
    const channel = this.channelPool[this.trackCounter % this.channelPool.length];
    this.trackCounter++;
    return channel;
  }

  parsePrompt(prompt) {
    const lower = prompt.toLowerCase();

    // Enhanced intent detection
    let intent = 'full';
    if (lower.includes('melody only') || (lower.includes('melody') && !lower.includes('chords') && !lower.includes('bass') && !lower.includes('drums'))) {
      intent = 'melody';
    } else if (lower.includes('chords only') || lower.includes('harmony only')) {
      intent = 'chords';
    } else if (lower.includes('drums only') || lower.includes('percussion only')) {
      intent = 'drums';
    } else if (lower.includes('no drums') || lower.includes('without drums')) {
      intent = 'no_drums';
    } else if (lower.includes('bass only')) {
      intent = 'bass';
    }

    // Structure parsing
    const structure = this.parseStructure(lower);

    // Key and scale
    const { key, scale } = this.parseKeyScale(lower);

    // Tempo
    const bpmMatch = lower.match(/(\d+)\s*bpm/);
    const bpm = bpmMatch ? parseInt(bpmMatch[1]) : 120;

    // Swing
    const swingMatch = lower.match(/swing\s+(\d+)/);
    let swing = swingMatch ? parseInt(swingMatch[1]) / 100 : null;
    if (lower.includes('no swing')) swing = 0.5;

    // Energy and density
    const energy = lower.includes('high energy') ? 'high' :
                   lower.includes('low energy') ? 'low' : 'medium';
    const density = lower.includes('sparse') ? 'sparse' :
                    lower.includes('busy') ? 'busy' : 'medium';

    // Genre detection
    const genre = this.detectGenre(lower);
    const groove = this.groovePatterns[genre] || this.groovePatterns.default;
    if (swing === null) swing = groove.swing;

    // 808 slides
    const slides808 = (lower.includes('trap') || lower.includes('808')) &&
                      (lower.includes('slide') || lower.includes('glide'));
    const glideDepthMatch = lower.match(/glide depth (\d+)/);
    const glideStepsMatch = lower.match(/glide steps (\d+)/);
    const glideDepth = glideDepthMatch ? parseInt(glideDepthMatch[1]) : 2;
    const glideSteps = glideStepsMatch ? parseInt(glideSteps[1]) : 8;

    // Chord extensions
    let chordExt = 'basic';
    if (lower.includes('add9')) chordExt = 'add9';
    else if (lower.includes('sus2')) chordExt = 'sus2';
    else if (lower.includes('sus4')) chordExt = 'sus4';
    else if (lower.includes('13')) chordExt = 'thirteenth';
    else if (lower.includes('11')) chordExt = 'eleventh';
    else if (lower.includes('9')) chordExt = 'ninth';
    else if (lower.includes('7')) chordExt = 'seventh';

    // Humanization
    let humanize = 'default';
    if (lower.includes('tight')) humanize = 'tight_pop';
    else if (lower.includes('drunk') || lower.includes('lofi humanize')) humanize = 'drunk_lofi';
    else if (lower.includes('session')) humanize = 'session_drummer';

    // Motif parsing
    const motif = this.parseMotif(lower);

    // Modulations
    const modulations = [];
    if (lower.includes('hook up a whole step')) {
      modulations.push({ section: 'hook', shift: 2 });
    }
    const bridgeModMatch = lower.match(/bridge modulates to ([a-g]#?)\s*(major|minor|dorian|phrygian|lydian|mixolydian|aeolian|locrian|harmonic minor|melodic minor|pentatonic|blues|whole tone|diminished|chromatic)?/i);
    if (bridgeModMatch) {
      const newKey = bridgeModMatch[1].toUpperCase();
      const newScale = bridgeModMatch[2]?.toLowerCase().replace(/\s/g, '_') || scale;
      modulations.push({ section: 'bridge', key: newKey, scale: newScale });
    }

    // Roman numerals and progression style
    let progression;
    const customProgression = this.parseRomanNumerals(lower);
    if (customProgression) {
      progression = customProgression;
    } else {
      let progressionStyle = 'default';
      if (lower.includes('jazz progression')) progressionStyle = 'jazz';
      else if (lower.includes('pop progression')) progressionStyle = 'pop';
      else if (lower.includes('gospel progression')) progressionStyle = 'gospel';
      else if (lower.includes('epic progression')) progressionStyle = 'epic';
      else if (lower.includes('modern progression')) progressionStyle = 'modern';
      else if (lower.includes('sad progression')) progressionStyle = 'sad';
      else if (lower.includes('dark progression')) progressionStyle = 'dark';
      else if (lower.includes('emotional progression')) progressionStyle = 'emotional';
      else if (lower.includes('cinematic progression')) progressionStyle = 'cinematic';
      else if (lower.includes('neo soul progression')) progressionStyle = 'neo_soul';

      const keyType = scale.includes('minor') || scale.includes('aeolian') || scale.includes('dorian') || scale.includes('phrygian') ? 'minor' : 'major';
      progression = this.chordProgressions[keyType][progressionStyle] || this.chordProgressions[keyType].default;
    }

    // Instrument programs (defaults are now genre-aware presets)
    const instrumentPrograms = JSON.parse(JSON.stringify(this.instrumentPresets[genre] || this.instrumentPresets.default)); // Deep copy to avoid modifying preset

    // Parse specific instrument overrides from prompt
    // This part is extensive and needs to map keywords to GM numbers.
    // For simplicity here, I'll keep the basic overrides but in a real app,
    // you'd parse "flute melody", "rhodes harmony", etc.
    if (lower.includes('ep1') || lower.includes('electric piano')) {
      instrumentPrograms.harmony = 4; // Rhodes
    }
    if (lower.includes('strings')) {
      instrumentPrograms.harmony = 48; // String Ensemble 1
    }
    if (lower.includes('pad')) {
      instrumentPrograms.harmony = 88; // New Age Pad
    }
    if (lower.includes('finger bass')) {
      instrumentPrograms.bass = 33;
    }
    if (lower.includes('acoustic bass')) {
      instrumentPrograms.bass = 32;
    }
    if (lower.includes('trap kit') || (lower.includes('trap') && lower.includes('drums'))) {
      instrumentPrograms.drumsKit = 25; // This is a general drum kit, not a specific GM instrument number. DrumKit program is special (GM 0 is standard kit).
    }
    if (lower.includes('lofi kit') || lower.includes('lo-fi kit')) {
      instrumentPrograms.drumsKit = 40; // Same as above.
    }
    // Example for specific instruments
    const gmMatch = lower.match(/(\w+)\s+instrument\s+(\d+)/i);
    if (gmMatch) {
      const trackRole = gmMatch[1].toLowerCase(); // e.g., melody, harmony, bass
      const programNum = parseInt(gmMatch[2]);
      if (['melody', 'harmony', 'bass', 'drumsKit', 'arp', 'pad', 'lead', 'countermelody'].includes(trackRole)) {
        instrumentPrograms[trackRole] = programNum;
      }
    }

    return {
      intent,
      structure,
      key,
      scale,
      bpm,
      swing,
      energy,
      density,
      genre,
      groove,
      slides808,
      glideDepth,
      glideSteps,
      chordExt,
      humanize,
      motif,
      modulations,
      progression,
      instrumentPrograms
    };
  }

  parseStructure(text) {
    const structure = [];
    const sections = ['intro', 'verse', 'pre', 'hook', 'chorus', 'bridge', 'post', 'outro'];

    sections.forEach(section => {
      const regex = new RegExp(`${section}\\s*\\(?\\s*(\\d+)\\s*\\)?`, 'i');
      const match = text.match(regex);
      if (match) {
        structure.push({ name: section, bars: parseInt(match[1]) });
      }
    });

    if (structure.length === 0) {
      return [
        { name: 'intro', bars: 4 },
        { name: 'verse', bars: 8 },
        { name: 'hook', bars: 8 },
        { name: 'verse', bars: 8 },
        { name: 'hook', bars: 8 }
      ];
    }

    return structure;
  }

  parseKeyScale(text) {
    const allScales = Object.keys(this.scales).map(s => s.replace(/_/g, ' ')).join('|');
    const keyMatch = text.match(new RegExp(`\\b([a-g]#?)\\s*(${allScales})?`, 'i'));
    let key = 'C';
    let scale = 'major';

    if (keyMatch) {
      key = keyMatch[1].toUpperCase();
      if (keyMatch[2]) {
        scale = keyMatch[2].toLowerCase().replace(/\s/g, '_');
      }
    }

    return { key, scale };
  }

  detectGenre(text) {
    if (text.includes('lofi') || text.includes('lo-fi')) return 'lofi';
    if (text.includes('trap')) return 'trap';
    if (text.includes('r&b') || text.includes('rnb') || text.includes('neo soul')) return 'rnb';
    if (text.includes('afrobeat')) return 'afrobeats';
    if (text.includes('jazz')) return 'jazz';
    if (text.includes('classical') || text.includes('orchestral')) return 'classical'; // Use classical preset for orchestral too
    if (text.includes('electronic')) return 'electronic';
    return 'default';
  }

  parseMotif(text) {
    const pitchMatch = text.match(/motif:\s*([a-g]\d+(?:\s+[a-g]\d+)*)/i);
    if (pitchMatch) {
      return pitchMatch[1].split(/\s+/).map(n => this.noteToPitch(n));
    }

    const midiMatch = text.match(/motif:\s*(\d+(?:\s+\d+)*)/i);
    if (midiMatch) {
      return midiMatch[1].split(/\s+/).map(n => parseInt(n));
    }

    return null;
  }

  parseRomanNumerals(text) {
    const romanMatch = text.match(/\[((?:[ivIVb#Δmaj7sus24add9]+(?:(?:,)?\s*))+)\]/); // Expanded regex
    if (romanMatch) {
      return romanMatch[1].split(',').map(r => r.trim());
    }
    return null;
  }

  noteToPitch(note) {
    const noteMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    const letter = note[0].toUpperCase();
    const octave = parseInt(note.match(/\d+/)[0]);
    let offset = noteMap[letter];
    if (note.includes('#')) offset++;
    if (note.includes('b')) offset--; // Handle flats
    return 12 * (octave + 1) + offset;
  }

  noteToMidi(note) {
    const noteMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    const letter = note[0].toUpperCase();
    let offset = noteMap[letter];
    if (note.includes('#')) offset++;
    if (note.includes('b')) offset--;
    return offset; // Returns MIDI note number for the C-octave based on the note letter
  }

  romanToScaleDegree(roman) {
    // Converts Roman numeral string (e.g., 'I', 'V', 'vi') to scale degree (0-6)
    const map = { 'i': 0, 'ii': 1, 'iii': 2, 'iv': 3, 'v': 4, 'vi': 5, 'vii': 6,
                  'I': 0, 'II': 1, 'III': 2, 'IV': 3, 'V': 4, 'VI': 5, 'VII': 6 };
    // Remove quality/extension indicators for basic degree mapping
    const cleanRoman = roman.replace(/[b#Δmaj7sus24add9]/gi, '').toLowerCase();
    return map[cleanRoman]; // Returns 0-6 index
  }

  applyHumanization(time, velocity, params) {
    const profile = this.humanization[params.humanize] || this.humanization.default;
    const timingJitter = (Math.random() - 0.5) * profile.timing;
    const velocityJitter = Math.floor((Math.random() - 0.5) * profile.velocity);
    return {
      time: time + timingJitter,
      velocity: Math.max(1, Math.min(127, velocity + velocityJitter))
    };
  }

  applySwing(beat, params) {
    const beatFraction = beat % 1;
    if (beatFraction >= 0.25 && beatFraction < 0.75) { // Apply swing to off-beats
      // Adjust the 8th note in a 16th note grid, or 16th note in a 32nd grid
      // For now, simplify to just affecting the 'and' of the beat
      const swingAmount = (params.swing - 0.5) * 0.5; // (0.5 to 1.0 -> 0 to 0.25)
      // If it's the second 8th note of a beat (e.g., 0.5, 1.5, 2.5, 3.5)
      if (Math.abs(beatFraction - 0.5) < 0.01) { // roughly 0.5
        return Math.floor(beat) + 0.5 + swingAmount;
      }
    }
    return beat;
  }

  generateChordTrack(params, section, sectionStart) {
    const { key, scale, progression, chordExt } = params;
    const scaleNotes = this.scales[scale] || this.scales.major;
    const rootMidiChromatic = this.noteToMidi(key); // Chromatic offset for the key
    const bars = section.bars;

    const notes = [];
    const beatsPerBar = 4;
    const beatsPerChord = 2; // Default to 2 beats per chord

    let previousChordVoicing = []; // To store the MIDI pitches of the last chord played

    for (let bar = 0; bar < bars; bar++) {
      for (let beat = 0; beat < beatsPerBar; beat += beatsPerChord) {
        const progressionIndex = Math.floor((bar * beatsPerBar + beat) / beatsPerChord) % progression.length;
        const roman = progression[progressionIndex];

        // Parse chord quality and intervals from the roman numeral string
        const chordInfo = this.parseRomanNumeral(roman, scaleNotes, rootMidiChromatic);
        let currentChordPitches = chordInfo.pitches;

        // Apply voice leading to minimize jumps between chords
        if (previousChordVoicing.length > 0) {
          currentChordPitches = this.voiceLeadChord(currentChordPitches, previousChordVoicing);
        }

        // Add chord extensions specified in params
        currentChordPitches = this.applyChordExtensions(currentChordPitches, chordExt, chordInfo.quality);

        // Distribute notes across octave for a fuller sound if needed (simple inversion logic)
        // For example, if chord is C3-E3-G3 and next is G3-B3-D4, voice lead might give G3-B3-D3
        // but maybe we want G4-B4-D5 for variety. This is complex to implement robustly.
        // For now, ensure a reasonable octave range by transposing if too low/high
        const minPitch = Math.min(...currentChordPitches);
        if (minPitch < 48) { // C3
            currentChordPitches = currentChordPitches.map(p => p + 12);
        }

        currentChordPitches.forEach((pitch, i) => {
          const humanized = this.applyHumanization(
            sectionStart + bar * beatsPerBar + beat,
            90 - i * 8, // Stagger velocities slightly for realism
            params
          );

          notes.push({
            pitch,
            start: humanized.time,
            duration: beatsPerChord,
            velocity: humanized.velocity
          });
        });

        previousChordVoicing = currentChordPitches; // Store for next chord's voice leading
      }
    }

    return notes;
  }

  // Helper to parse Roman numeral string into chord pitches and quality
  parseRomanNumeral(roman, scaleArr, rootMidiChromatic) {
    let cleanRoman = roman.replace(/[b#Δmaj7sus24add9]/gi, ''); // Remove modifiers for basic degree
    let degree = this.romanToScaleDegree(cleanRoman);

    // Determine chord quality (major/minor) based on Roman numeral casing and scale context
    let quality = 'major';
    if (roman.match(/^[ivx]+$/) && roman === roman.toLowerCase()) {
        quality = 'minor'; // e.g., i, ii, iii, vi
    } else if (roman.match(/^[IVX]+$/) && roman === roman.toUpperCase()) {
        quality = 'major'; // e.g., I, II, III, IV, V, VI, VII
    } else if (roman.includes('dim')) {
        quality = 'diminished';
    } else if (roman.includes('aug')) {
        quality = 'augmented';
    }

    // Determine intervals based on diatonic scale and quality.
    // For simplicity, we'll build basic triads/7ths relative to the root of the scale degree.
    // This is a simplified diatonic harmony approach.
    const baseRootMidi = rootMidiChromatic + (scaleArr[degree] || 0); // Root of the chord

    let pitches = [baseRootMidi];
    let thirdInterval, fifthInterval, seventhInterval;

    // A more robust way to get intervals: determine actual chord type and find intervals chromatically.
    // For diatonic context, we can derive it from the scale.
    // For C Major scale: C-D-E-F-G-A-B (0,2,4,5,7,9,11)
    // I (C) -> 0,2,4 -> C, E, G
    // ii (D) -> 0,2,4 -> D, F, A (D-F is minor third)
    // This implies we need to calculate intervals *within the scale* from the chord's root, then adjust.

    // Calculate the scale degree's root note index within the full chromatic scale (0-11)
    const chromaticRootOffset = (rootMidiChromatic + scaleArr[degree]) % 12;

    // Helper to determine interval from chromatic root assuming diatonic context
    const getDiatonicInterval = (startChromaticNote, scaleArray, intervalDegree) => {
        let currentChromaticNote = startChromaticNote;
        let scaleDegreeCounter = 0;
        let actualInterval = 0;

        // Create a chromatic scale with the selected scale notes marked
        const chromaticMap = Array(12).fill(false);
        scaleArray.forEach(note => {
            chromaticMap[note] = true;
        });

        // Iterate chromatically to find the nth scale degree
        for (let i = 0; i < 12; i++) { // Max 12 steps (an octave)
            if (chromaticMap[currentChromaticNote % 12]) {
                if (scaleDegreeCounter === intervalDegree) {
                    return actualInterval;
                }
                scaleDegreeCounter++;
            }
            currentChromaticNote++;
            actualInterval++;
        }
        return actualInterval; // Should not reach here for common intervals
    };

    thirdInterval = getDiatonicInterval(chromaticRootOffset, scaleArr, 2); // 3rd scale step from chord root
    fifthInterval = getDiatonicInterval(chromaticRootOffset, scaleArr, 4); // 5th scale step from chord root
    seventhInterval = getDiatonicInterval(chromaticRootOffset, scaleArr, 6); // 7th scale step from chord root

    pitches.push(baseRootMidi + thirdInterval);
    pitches.push(baseRootMidi + fifthInterval);

    // Specific quality adjustments from Roman numeral string (e.g., maj7, m7, dim7, aug)
    if (roman.includes('maj7') || roman.includes('Δ7')) { // Major 7th
        pitches.push(baseRootMidi + 11); // Major 7th is 11 semitones
        quality = 'major7';
    } else if (roman.includes('7')) { // Dominant 7th or Minor 7th
        pitches.push(baseRootMidi + 10); // Minor 7th (dominant 7th quality) is 10 semitones
        if (roman.includes('m7')) quality = 'minor7'; // e.g. ii7
        else quality = 'dominant7'; // e.g. V7
    } else if (roman.includes('dim7')) {
        pitches[1] = baseRootMidi + 3; // minor third
        pitches[2] = baseRootMidi + 6; // diminished fifth
        pitches.push(baseRootMidi + 9); // Diminished 7th is root + 9 semitones
        quality = 'diminished7';
    } else if (roman.includes('dim')) { // for diminished triad
        pitches[1] = baseRootMidi + 3; // minor third
        pitches[2] = baseRootMidi + 6; // diminished fifth
        quality = 'diminished';
    } else if (roman.includes('aug')) { // for augmented triad
        pitches[1] = baseRootMidi + 4; // major third
        pitches[2] = baseRootMidi + 8; // augmented fifth
        quality = 'augmented';
    } else if (quality === 'minor') { // Diatonic minor triad (might need adjustment if base intervals are already diatonic)
        // Check if the third interval is major (4 semitones) and convert to minor (3 semitones)
        if ((pitches[1] - pitches[0]) % 12 === 4) {
            pitches[1] = pitches[0] + 3;
        }
        // Check if the fifth interval is diminished (6 semitones) and convert to perfect (7 semitones) if needed
        if ((pitches[2] - pitches[0]) % 12 === 6 && !roman.includes('dim')) {
            pitches[2] = pitches[0] + 7;
        }
    } else { // Diatonic major triad (default)
        // Check if the third interval is minor (3 semitones) and convert to major (4 semitones)
        if ((pitches[1] - pitches[0]) % 12 === 3) {
            pitches[1] = pitches[0] + 4;
        }
    }


    // Ensure pitches are within a reasonable octave range
    // Normalize to C4-C5 range roughly for core chord.
    let normalizedPitches = pitches.map(p => {
        while (p < 48) p += 12; // C3
        while (p > 72) p -= 12; // C5
        return p;
    });
    // Sort and remove duplicates in case of errors
    normalizedPitches = [...new Set(normalizedPitches)].sort((a,b) => a-b);

    return { pitches: normalizedPitches, quality, degree };
  }

  voiceLeadChord(newChordPitches, previousChordPitches) {
    if (newChordPitches.length === 0 || previousChordPitches.length === 0) {
      return newChordPitches;
    }

    // A simple approach: for each note in the new chord, find the closest note in the previous chord
    // This isn't true voice leading but aims to reduce large jumps.
    // A more advanced approach would match voices and minimize total movement.

    // For now, let's keep the lowest note of the new chord as-is, and try to voice lead the upper notes.
    let voicedChord = [newChordPitches[0]]; // Start with the lowest note as is.

    // Find the current lowest pitch of the new chord and normalize it to be around previousChordPitches' range
    let currentNewChordRoot = newChordPitches[0];
    const prevLowest = previousChordPitches[0];
    while (currentNewChordRoot < prevLowest - 12) currentNewChordRoot += 12;
    while (currentNewChordRoot > prevLowest + 12) currentNewChordRoot -= 12;

    voicedChord[0] = currentNewChordRoot;

    for (let i = 1; i < newChordPitches.length; i++) {
        let targetPitch = newChordPitches[i];
        let bestVoicedPitch = targetPitch;
        let minMovement = Infinity;

        // Iterate through possible octaves relative to the current chord's root
        for (let octaveShift = -1; octaveShift <= 1; octaveShift++) {
            const candidatePitch = targetPitch + (octaveShift * 12);
            // Check distance from the previous note at this 'voice' position, if it exists
            const prevVoiceNote = previousChordPitches[i] || previousChordPitches[previousChordPitches.length - 1]; // Fallback to highest
            if (prevVoiceNote) {
              const movement = Math.abs(candidatePitch - prevVoiceNote);
              if (movement < minMovement) {
                  minMovement = movement;
                  bestVoicedPitch = candidatePitch;
              }
            } else { // If previous chord had fewer notes, just take the candidate
              bestVoicedPitch = candidatePitch;
              break;
            }
        }
        voicedChord.push(bestVoicedPitch);
    }

    // Sort to maintain ascending order
    voicedChord.sort((a, b) => a - b);

    // Ensure no overlapping notes and reasonable range
    for(let i = 1; i < voicedChord.length; i++) {
        while (voicedChord[i] <= voicedChord[i-1]) {
            voicedChord[i] += 12;
        }
    }

    // Simple octave adjustment for the whole chord if it gets too high or low
    const lowestNote = voicedChord[0];
    if (lowestNote > 60 && previousChordPitches[0] < 60) { // If lowest note is above C4, consider shifting down
        voicedChord = voicedChord.map(p => p - 12);
    } else if (lowestNote < 48 && previousChordPitches[0] > 48) { // If lowest note is below C3, consider shifting up
        voicedChord = voicedChord.map(p => p + 12);
    }

    return voicedChord;
}


  applyChordExtensions(voicing, extension, quality) {
    // Voicing must be sorted ascending.
    const extended = [...voicing];
    if (extended.length === 0) return extended;

    const root = extended[0]; // Lowest note is the root for extension calculation

    // Ensure extensions are added an octave up if they conflict with existing chord tones
    // or to keep spacing reasonable. This is a simplification.
    const addExtension = (interval) => {
        let newNote = root + interval;
        // If the new note's chromatic value is already present, shift it up
        while (extended.some(p => (p % 12) === (newNote % 12)) && (newNote < root + 24)) { // Up to 2 octaves above root
            newNote += 12;
        }
        extended.push(newNote);
    };

    switch (extension) {
      case 'add9':
        addExtension(14); // Major 9th
        break;
      case 'sus2':
        // Replace the 3rd (second note) with a 2nd
        if (extended.length >= 2) {
            extended[1] = root + 2;
        }
        break;
      case 'sus4':
        // Replace the 3rd (second note) with a 4th
        if (extended.length >= 2) {
            extended[1] = root + 5;
        }
        break;
      case 'seventh':
        if (!extended.some(p => (p % 12) === ((root + 10) % 12) || (p % 12) === ((root + 11) % 12))) { // Only add if 7th isn't already present
            if (quality === 'major' || quality === 'dominant7' || quality === 'major7') { // Major 7th
                addExtension(11);
            } else { // Minor 7th
                addExtension(10);
            }
        }
        break;
      case 'ninth':
        // Add 7th and 9th
        if (!extended.some(p => (p % 12) === ((root + 10) % 12) || (p % 12) === ((root + 11) % 12))) {
            if (quality === 'major' || quality === 'dominant7' || quality === 'major7') {
                addExtension(11); // Major 7th
            } else {
                addExtension(10); // Minor 7th
            }
        }
        addExtension(14); // Major 9th
        break;
      case 'eleventh':
        // Add 7th, 9th, 11th
        if (!extended.some(p => (p % 12) === ((root + 10) % 12) || (p % 12) === ((root + 11) % 12))) {
            if (quality === 'major' || quality === 'dominant7' || quality === 'major7') {
                addExtension(11); // Major 7th
            } else {
                addExtension(10); // Minor 7th
            }
        }
        addExtension(14); // Major 9th
        addExtension(17); // Perfect 11th (or #11 for lydian context, but simplified)
        break;
      case 'thirteenth':
        // Add 7th, 9th, 11th, 13th
        if (!extended.some(p => (p % 12) === ((root + 10) % 12) || (p % 12) === ((root + 11) % 12))) {
            if (quality === 'major' || quality === 'dominant7' || quality === 'major7') {
                addExtension(11); // Major 7th
            } else {
                addExtension(10); // Minor 7th
            }
        }
        addExtension(14); // Major 9th
        addExtension(17); // Perfect 11th
        addExtension(21); // Major 13th
        break;
    }

    // Sort and remove duplicates just in case
    return [...new Set(extended)].sort((a,b) => a-b);
  }

  generateMelodyTrack(params, section, sectionStart) {
    const { key, scale, motif, energy, bpm } = params;
    const scaleNotes = this.scales[scale] || this.scales.major;
    const rootMidi = this.noteToMidi(key);
    const bars = section.bars;
    const notes = [];
    const beatsPerBar = 4;

    // Choose melodic contour based on section or randomly
    let contourType = 'arch';
    if (section.name === 'intro') contourType = 'ascending';
    else if (section.name === 'outro') contourType = 'descending';
    else if (section.name === 'hook' || section.name === 'chorus') contourType = 'climax';
    else if (section.name === 'bridge') contourType = 'wave';
    // If not specifically defined, might pick one randomly from the map, or default
    const contour = this.melodicContours[contourType] || this.melodicContours.arch;

    const baseOctave = 72; // C5

    // Generate melodic phrases with intelligent phrasing
    const phraseLengthBars = 4; // Generate melody in 4-bar phrases
    const phraseCount = Math.ceil(bars / phraseLengthBars);

    let previousPitch = rootMidi + baseOctave + scaleNotes[0]; // Initialize with root note

    for (let phraseIdx = 0; phraseIdx < phraseCount; phraseIdx++) {
      const phraseStartBar = phraseIdx * phraseLengthBars;
      const actualPhraseBars = Math.min(phraseLengthBars, bars - phraseStartBar);

      // Use motif for first and recurring phrases, or if explicitly requested in prompt
      if (motif && (phraseIdx === 0 || (phraseIdx % 2 === 0 && Math.random() < 0.7))) {
        // Adapt motif to current key and octave
        const motifRoot = motif[0];
        const adaptedMotif = motif.map(p => {
          let newP = p - motifRoot + (rootMidi + baseOctave); // Shift to current key/octave
          // Ensure it's roughly in range
          while (newP < baseOctave) newP += 12;
          while (newP > baseOctave + 24) newP -= 12; // Within ~2 octaves
          return newP;
        });

        adaptedMotif.forEach((pitch, i) => {
          const beat = (i / adaptedMotif.length) * actualPhraseBars * beatsPerBar;
          if (beat < actualPhraseBars * beatsPerBar) {
            const humanized = this.applyHumanization(
              sectionStart + phraseStartBar * beatsPerBar + beat,
              95,
              params
            );
            notes.push({
              pitch,
              start: humanized.time,
              duration: 0.5,
              velocity: humanized.velocity
            });
            previousPitch = pitch;
          }
        });
      } else {
        // Generate new melodic material
        const noteDensity = energy === 'high' ? 8 : energy === 'low' ? 3 : 5; // Notes per bar
        const noteCount = noteDensity * actualPhraseBars;

        for (let i = 0; i < noteCount; i++) {
          const t = i / noteCount; // Normalized position in phrase (0 to 1)
          const beat = t * actualPhraseBars * beatsPerBar;
          const swungBeat = this.applySwing(beat, params);

          // Apply contour shape to influence general pitch direction
          const contourValue = this.interpolateContour(contour, t); // 0 to 1
          const contourOctaveRange = (scale.includes('pentatonic') || scale.includes('blues')) ? 1 : 2; // Pentatonic usually has smaller range
          const contourPitchOffset = Math.floor(contourValue * contourOctaveRange * 12); // Shift by 0 to 2 octaves

          let targetScaleDegree = Math.floor(Math.random() * scaleNotes.length);

          // Voice leading: prefer stepwise motion, especially if density is high
          if (Math.random() < this.voiceLeadingRules.preferStepwise && i > 0 && notes.length > 0) {
            const lastNoteChromatic = notes[notes.length -1].pitch % 12;
            const lastScaleIdx = scaleNotes.indexOf((lastNoteChromatic - (rootMidi % 12) + 12) % 12);
            if (lastScaleIdx !== -1) { // If last note was in scale
              const direction = Math.random() < 0.5 ? 1 : -1;
              targetScaleDegree = (lastScaleIdx + direction + scaleNotes.length) % scaleNotes.length;
            }
          }

          let pitch = rootMidi + baseOctave + scaleNotes[targetScaleDegree] + contourPitchOffset;

          // Constrain melodic leaps using voice leading rules
          if (Math.abs(pitch - previousPitch) > this.voiceLeadingRules.maxLeap) {
            // Attempt to bring the pitch closer to the previous pitch
            if (pitch > previousPitch) {
              pitch = previousPitch + this.voiceLeadingRules.maxLeap;
            } else {
              pitch = previousPitch - this.voiceLeadingRules.maxLeap;
            }
            // Ensure the constrained pitch is still diatonic
            const closestDiatonic = scaleNotes.map(sn => rootMidi + baseOctave + sn)
                                               .reduce((prev, curr) => (Math.abs(curr - pitch) < Math.abs(prev - pitch) ? curr : prev), pitch);
            pitch = closestDiatonic;
          }

          // Rhythm variation
          const duration = this.generateRhythmicValue(bpm, energy, i, noteCount);

          const humanized = this.applyHumanization(
            sectionStart + phraseStartBar * beatsPerBar + swungBeat,
            this.calculateDynamics(t, contourValue), // Dynamics based on phrase position and contour
            params
          );

          notes.push({
            pitch,
            start: humanized.time,
            duration,
            velocity: humanized.velocity
          });

          previousPitch = pitch;
        }
      }
    }

    return notes;
  }

  // Interpolate a value from a contour array based on a normalized position (0 to 1)
  interpolateContour(contour, t) {
    if (!contour || contour.length < 2) return 0;

    const index = t * (contour.length - 1);
    const lowerIdx = Math.floor(index);
    const upperIdx = Math.ceil(index);
    const fraction = index - lowerIdx;

    if (upperIdx >= contour.length) return contour[contour.length - 1]; // Handle edge case for t=1

    return contour[lowerIdx] * (1 - fraction) + contour[upperIdx] * fraction;
  }

  // Generate a rhythmic value (duration) based on bpm, energy, and position
  generateRhythmicValue(bpm, energy, noteIndex, totalNotes) {
    // Basic durations in beats
    const commonDurations = [0.25, 0.5, 0.75, 1.0, 1.5, 2.0]; // 16th, 8th, dotted 8th, quarter, dotted quarter, half
    let possibleDurations = [...commonDurations];

    if (energy === 'high') {
      possibleDurations = [0.25, 0.5]; // Shorter, more active
    } else if (energy === 'low') {
      possibleDurations = [1.0, 1.5, 2.0]; // Longer, more sustained
    }

    // Introduce some variation, but keep it within sensible limits
    const duration = possibleDurations[Math.floor(Math.random() * possibleDurations.length)];

    // Add small randomization to make it less robotic
    return duration * (1 + (Math.random() - 0.5) * 0.1); // +/- 5% duration jitter
  }

  // Calculate note velocity/dynamics based on phrase position and melodic contour
  calculateDynamics(phrasePosition, contourValue) {
    const baseDynamics = 65;
    const dynamicRange = 40; // Max velocity difference

    // Contour value (0-1) directly influences dynamics (higher contour = louder)
    // Phrase position (0-1) can add shape, e.g., crescendo towards the end of a phrase

    let velocity = baseDynamics + (contourValue * dynamicRange);

    // Apply a slight crescendo towards the end of the phrase for more expressiveness
    velocity += phrasePosition * 10;

    return Math.max(20, Math.min(127, Math.floor(velocity))); // Ensure within MIDI velocity range
  }

  generateBassTrack(params, section, sectionStart) {
    const { key, scale, progression, slides808, glideDepth, glideSteps } = params;
    const scaleNotes = this.scales[scale] || this.scales.major;
    const rootMidiChromatic = this.noteToMidi(key);
    const bars = section.bars;

    const notes = [];
    const pitchBends = [];
    const beatsPerBar = 4;
    const baseOctave = 36; // C2

    for (let bar = 0; bar < bars; bar++) {
      for (let beat = 0; beat < beatsPerBar; beat++) {
        const progressionIndex = Math.floor((bar * beatsPerBar + beat) / 2) % progression.length;
        const roman = progression[progressionIndex];

        // Parse the chord to get its root
        const chordInfo = this.parseRomanNumeral(roman, scaleNotes, rootMidiChromatic);
        const pitch = chordInfo.pitches[0]; // Take the lowest note as the bass note

        const humanized = this.applyHumanization(
          sectionStart + bar * beatsPerBar + beat,
          100,
          params
        );

        notes.push({
          pitch,
          start: humanized.time,
          duration: 0.9,
          velocity: humanized.velocity
        });

        // 808 slides
        if (slides808 && (beat % 2 === 1 || beat % 4 === 3) && Math.random() < 0.3) {
          const slideStart = humanized.time + 0.5;
          const slideDuration = 0.4;
          const targetPitch = pitch + glideDepth; // Glide up by glideDepth semitones

          // Generate pitch bend events for the slide
          for (let step = 0; step <= glideSteps; step++) {
            const timeOffset = (step / glideSteps) * slideDuration;
            // MIDI pitch bend range is -8192 to 8191, with 0 at center (no bend)
            // Or 0-16383, with 8192 at center. Let's use 0-16383.
            // A bend up needs values > 8192.
            // For a glideDepth of 2 semitones, we assume a pitch bend range of 2 semitones is set on the synth.
            // So, 8192 (center) + (8191 * (glideDepth / synthPitchBendRange))
            // Assuming synth pitch bend range is 2 semitones:
            const bendRange = 2; // This should ideally be a synth parameter
            const bendValue = 8192 + Math.floor((step / glideSteps) * 8191 * (glideDepth / bendRange)); // Scale to max bend range
            pitchBends.push({ time: slideStart + timeOffset, value: bendValue });
          }
          // Reset pitch bend to center after slide
          pitchBends.push({ time: slideStart + slideDuration + 0.05, value: 8192 });
        }
      }
    }

    return { notes, pitchBends };
  }

  generateDrumTrack(params, section, sectionStart) {
    const { groove } = params;
    const bars = section.bars;
    const notes = [];
    const beatsPerBar = 4;

    for (let bar = 0; bar < bars; bar++) {
      // Kick pattern
      const kickPattern = [0, 2];
      if (Math.random() < 0.7) kickPattern.push(3.5);
      if (groove.pattern === '3-3-2') { // Afrobeat pattern example
          kickPattern.length = 0;
          kickPattern.push(0, 1.5, 3);
      }

      kickPattern.forEach(beat => {
        if (beat < beatsPerBar) {
          const humanized = this.applyHumanization(
            sectionStart + bar * beatsPerBar + beat,
            110,
            params
          );
          notes.push({ pitch: this.drumKit.kick, start: humanized.time, duration: 0.1, velocity: humanized.velocity });
        }
      });

      // Snare
      [1, 3].forEach(beat => {
        const humanized = this.applyHumanization(
          sectionStart + bar * beatsPerBar + beat,
          105,
          params
        );
        notes.push({ pitch: this.drumKit.snare, start: humanized.time, duration: 0.1, velocity: humanized.velocity });
      });

      // Hi-hats
      const hihatsPerBar = groove.hihats === 'sixteenths' ? 16 : 8;
      for (let i = 0; i < hihatsPerBar; i++) {
        const beat = (i / hihatsPerBar) * beatsPerBar;
        const swungBeat = this.applySwing(beat, params);
        const isGhost = groove.ghost && (i % 2 === 1); // Every other hi-hat is a ghost note
        const velocity = isGhost ? 60 : 85;

        const humanized = this.applyHumanization(
          sectionStart + bar * beatsPerBar + swungBeat,
          velocity,
          params
        );

        notes.push({
          pitch: this.drumKit.chh,
          start: humanized.time,
          duration: 0.05,
          velocity: humanized.velocity
        });
      }

      // Triplet bursts for trap
      if (groove.triplets && Math.random() < 0.25) { // 25% chance per bar
        const tripletStartBeat = 3 + (Math.random() * 0.5); // Start a bit after beat 3
        [0, 0.33, 0.66].forEach(offset => {
          const beat = tripletStartBeat + offset * (4 - tripletStartBeat); // Fill remaining beat with triplet
          if (beat < beatsPerBar) {
            const humanized = this.applyHumanization(
              sectionStart + bar * beatsPerBar + beat,
              90,
              params
            );
            notes.push({ pitch: this.drumKit.chh, start: humanized.time, duration: 0.05, velocity: humanized.velocity });
          }
        });
      }
    }

    return notes;
  }

  generateComposition(prompt, seed = null, userInstruments = null, trackConfig = null, learnedStyle = null) {
    if (seed !== null) {
      // Basic seedrandom implementation. In a real app, you'd use a robust library.
      Math.seedrandom = function(s) {
        // Simple string hash to number
        var y = 0;
        for (var i = 0; i < s.length; i++) {
          y += s.charCodeAt(i);
        }
        var currentSeed = y;
        Math.random = function() {
          currentSeed = (currentSeed * 9301 + 49297) % 233280;
          return currentSeed / 233280;
        };
      };
      Math.seedrandom(seed);
    }

    const params = this.parsePrompt(prompt);

    // Override with user-selected instruments if provided
    if (userInstruments) {
      params.instrumentPrograms = { ...params.instrumentPrograms, ...userInstruments };
    }

    const { structure, instrumentPrograms, intent } = params;

    // Support custom track configuration, otherwise use intent-based defaults
    let tracksToGenerate = trackConfig;
    if (!tracksToGenerate) {
      tracksToGenerate = [];

      // Strict intent handling - only generate what's asked for
      if (intent === 'melody') {
        tracksToGenerate.push({ type: 'melody', count: 1 });
      } else if (intent === 'chords') {
        tracksToGenerate.push({ type: 'chords', count: 1 });
      } else if (intent === 'bass') {
        tracksToGenerate.push({ type: 'bass', count: 1 });
      } else if (intent === 'drums') {
        tracksToGenerate.push({ type: 'drums', count: 1 });
      } else if (intent === 'no_drums') {
        // Full composition without drums
        tracksToGenerate.push({ type: 'melody', count: 1 });
        tracksToGenerate.push({ type: 'chords', count: 1 });
        tracksToGenerate.push({ type: 'bass', count: 1 });
      } else {
        // Full composition (intent === 'full')
        tracksToGenerate.push({ type: 'melody', count: 1 });
        tracksToGenerate.push({ type: 'chords', count: 1 });
        tracksToGenerate.push({ type: 'bass', count: 1 });
        tracksToGenerate.push({ type: 'drums', count: 1 });
      }

      // Add additional tracks based on genre/density for full compositions only
      if (intent === 'full') {
        if (params.density === 'busy' || params.genre === 'electronic' || params.genre === 'orchestral') {
          if (!tracksToGenerate.some(t => t.type === 'pad')) {
            tracksToGenerate.push({ type: 'pad', count: 1 });
          }
        }
        if (params.energy === 'high' || params.genre === 'electronic') {
          if (!tracksToGenerate.some(t => t.type === 'lead')) {
            tracksToGenerate.push({ type: 'lead', count: 1 });
          }
        }
        if (params.density === 'busy') {
          if (!tracksToGenerate.some(t => t.type === 'arp')) {
            tracksToGenerate.push({ type: 'arp', count: 1 });
          }
        }
      }
    }

    let currentBeat = 0;
    const allTracksSectionalData = [];

    // Reset channel counter
    this.trackCounter = 0;

    structure.forEach((section, idx) => {
      // Apply modulations
      let sectionParams = { ...params };
      const notesChromatic = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      params.modulations?.forEach(mod => {
        if (mod.section === section.name) {
          if (mod.key) {
            sectionParams.key = mod.key;
            sectionParams.scale = mod.scale;
          } else if (mod.shift) {
            const currentRootChromatic = this.noteToMidi(sectionParams.key);
            const newRootChromatic = (currentRootChromatic + mod.shift + 12) % 12;
            sectionParams.key = notesChromatic[newRootChromatic];
          }
        }
      });

      // Generate tracks based on configuration
      tracksToGenerate.forEach(trackSpec => {
        for (let i = 0; i < trackSpec.count; i++) {
          let sectionNotes = [];
          let pitchBends = [];
          let trackType = trackSpec.type;

          switch (trackType) {
            case 'melody':
              sectionNotes = this.generateMelodyTrack(sectionParams, section, currentBeat);
              break;
            case 'chords':
              sectionNotes = this.generateChordTrack(sectionParams, section, currentBeat);
              break;
            case 'bass':
              const bassResult = this.generateBassTrack(sectionParams, section, currentBeat);
              sectionNotes = bassResult.notes;
              pitchBends = bassResult.pitchBends;
              break;
            case 'drums':
              sectionNotes = this.generateDrumTrack(sectionParams, section, currentBeat);
              break;
            case 'arp':
              sectionNotes = this.generateArpTrack(sectionParams, section, currentBeat);
              break;
            case 'pad':
              sectionNotes = this.generatePadTrack(sectionParams, section, currentBeat);
              break;
            case 'lead':
              sectionNotes = this.generateLeadTrack(sectionParams, section, currentBeat);
              break;
            case 'countermelody':
              sectionNotes = this.generateCountermelodyTrack(sectionParams, section, currentBeat);
              break;
            default:
              console.warn(`Unknown track type: ${trackType}`);
              break;
          }

          if (sectionNotes.length > 0 || pitchBends.length > 0) {
            const channel = this.assignChannel(trackType);
            allTracksSectionalData.push({
              id: `${trackType}-${i}-section-${idx}`,
              type: trackType,
              channel: channel,
              sectionNotes: sectionNotes,
              pitchBends: pitchBends,
              sectionIdx: idx
            });
          }
        }
      });

      currentBeat += section.bars * 4;
    });

    // Consolidate tracks by type and channel
    const consolidatedTracks = this.consolidateTracks(allTracksSectionalData, instrumentPrograms);

    return {
      params,
      structure,
      tracks: consolidatedTracks,
      totalBeats: currentBeat,
      instrumentPrograms
    };
  }

  consolidateTracks(allTracksSectionalData, instrumentPrograms) {
    const tracksGroupedByChannelAndType = {};

    allTracksSectionalData.forEach(track => {
      // Use channel and type for grouping, but include the "index" from trackSpec to differentiate multiple tracks of same type
      // For instance, if prompt requests two melodies. The track.id already ensures uniqueness by its {type}-{i}-section-{idx} format.
      // We need to group them by {type}-{instance_id} to ensure multiple melody tracks are distinct.
      // Extract instance_id from track.id: `melody-0-section-0` -> `melody-0`
      const typeAndInstanceId = track.id.split('-').slice(0, 2).join('-'); // e.g., 'melody-0', 'melody-1'

      const key = `${track.channel}-${typeAndInstanceId}`;
      if (!tracksGroupedByChannelAndType[key]) {
        tracksGroupedByChannelAndType[key] = {
          notes: [],
          pitchBends: [],
          type: track.type,
          channel: track.channel,
          instanceId: typeAndInstanceId // Store this to derive track name
        };
      }
      tracksGroupedByChannelAndType[key].notes.push(...track.sectionNotes);
      if (track.pitchBends) {
        tracksGroupedByChannelAndType[key].pitchBends.push(...track.pitchBends);
      }
    });

    const finalTracks = [];
    let trackGlobalIndex = 0; // For unique track IDs in the final output

    // Define a consistent order for track types
    const sortedKeys = Object.keys(tracksGroupedByChannelAndType).sort((a, b) => {
        const order = ['melody', 'lead', 'countermelody', 'arp', 'chords', 'pad', 'bass', 'drums'];
        const typeA = tracksGroupedByChannelAndType[a].type;
        const typeB = tracksGroupedByChannelAndType[b].type;

        // Primary sort by predefined order
        const orderDiff = order.indexOf(typeA) - order.indexOf(typeB);
        if (orderDiff !== 0) return orderDiff;

        // Secondary sort by channel number for consistency
        return tracksGroupedByChannelAndType[a].channel - tracksGroupedByChannelAndType[b].channel;
    });

    sortedKeys.forEach(key => {
      const trackData = tracksGroupedByChannelAndType[key];

      if (trackData.notes.length > 0) {
          const program = this.getProgramForType(trackData.type, instrumentPrograms);
          // Extract the numerical index from instanceId for naming
          const instanceNum = parseInt(trackData.instanceId.split('-')[1]) + 1; // e.g. melody-0 -> 1
          const name = this.getTrackName(trackData.type, instanceNum);

          finalTracks.push({
            id: `track-${trackGlobalIndex}`, // Unique ID for playback/display
            name,
            type: trackData.type,
            channel: trackData.channel,
            program,
            volume: 0.75,
            pan: 0,
            muted: false,
            solo: false,
            notes: trackData.notes,
            pitchBends: trackData.pitchBends.sort((a,b) => a.time - b.time)
          });
          trackGlobalIndex++;
      }
    });

    return finalTracks;
  }

  getProgramForType(type, instrumentPrograms) {
    // If instrumentPrograms[type] is an array (from presets), pick one randomly
    if (Array.isArray(instrumentPrograms[type])) {
        return instrumentPrograms[type][Math.floor(Math.random() * instrumentPrograms[type].length)];
    }
    // Otherwise, it's a single value (from direct prompt override or default)
    return instrumentPrograms[type] || 0; // Default to Acoustic Grand Piano if nothing else
  }

  getTrackName(type, index) {
    const names = {
      melody: 'Melody',
      chords: 'Harmony',
      bass: 'Bass',
      drums: 'Drums',
      arp: 'Arpeggio',
      pad: 'Pad',
      lead: 'Lead',
      countermelody: 'Countermelody'
    };
    return `${names[type] || type} ${index}`;
  }

  // New track generators
  generateArpTrack(params, section, sectionStart) {
    const { key, scale, progression, energy, bpm } = params;
    const scaleNotes = this.scales[scale] || this.scales.major;
    const rootMidiChromatic = this.noteToMidi(key);
    const bars = section.bars;
    const notes = [];
    const beatsPerBar = 4;
    const baseOctave = 60; // C4

    const arpeggioSpeed = energy === 'high' ? 0.25 : energy === 'low' ? 0.75 : 0.5; // Beats per note
    const arpeggioOctaveRange = (energy === 'high' || energy === 'busy') ? 2 : 1; // Number of octaves to span

    for (let bar = 0; bar < bars; bar++) {
      const progressionIndex = Math.floor((bar * beatsPerBar) / 2) % progression.length;
      const roman = progression[progressionIndex];

      const chordInfo = this.parseRomanNumeral(roman, scaleNotes, rootMidiChromatic);
      let chordPitches = this.applyChordExtensions(chordInfo.pitches, params.chordExt, chordInfo.quality);

      // Ensure arpeggiated pitches are within a reasonable octave range
      chordPitches = chordPitches.map(p => {
          while (p < baseOctave) p += 12;
          while (p > baseOctave + 24) p -= 12; // Cap at C6
          return p;
      }).sort((a,b) => a-b);

      // Generate a simple up-down arpeggio pattern
      let patternSequence = [];
      const originalChordLength = chordPitches.length;
      for (let oct = 0; oct < arpeggioOctaveRange; oct++) {
          patternSequence.push(...chordPitches.map(p => p + (oct * 12)));
      }
      // Add descending part
      if (arpeggioOctaveRange > 1) {
          patternSequence.push(...chordPitches.slice(0, originalChordLength-1).map(p => p + ((arpeggioOctaveRange-1) * 12)).reverse());
      } else {
          patternSequence.push(...chordPitches.slice(0, originalChordLength-1).reverse());
      }


      for (let step = 0; step < patternSequence.length; step++) {
        const beat = (step * arpeggioSpeed);
        if (beat >= beatsPerBar) break;

        const notePitch = patternSequence[step];
        const humanized = this.applyHumanization(
          sectionStart + bar * beatsPerBar + beat,
          Math.min(90, this.calculateDynamics(step / patternSequence.length, 0.5)), // Adjust dynamics
          params
        );

        notes.push({
          pitch: notePitch,
          start: humanized.time,
          duration: arpeggioSpeed * 0.9, // Make notes slightly shorter than step duration
          velocity: humanized.velocity
        });
      }
    }

    return notes;
  }

  generatePadTrack(params, section, sectionStart) {
    const { key, scale, progression, density } = params;
    const scaleNotes = this.scales[scale] || this.scales.major;
    const rootMidiChromatic = this.noteToMidi(key);
    const bars = section.bars;
    const notes = [];
    const beatsPerBar = 4;
    const baseOctave = 48; // C3

    const chordDurationBars = (density === 'sparse' || density === 'medium') ? 2 : 1; // How long each chord lasts

    for (let bar = 0; bar < bars; bar += chordDurationBars) {
      const progressionIndex = Math.floor((bar * beatsPerBar) / (chordDurationBars * beatsPerBar)) % progression.length;
      const roman = progression[progressionIndex];

      const chordInfo = this.parseRomanNumeral(roman, scaleNotes, rootMidiChromatic);
      let padChordPitches = this.applyChordExtensions(chordInfo.pitches, params.chordExt, chordInfo.quality);

      // Ensure notes are within a suitable pad range (e.g., C3 to C5)
      padChordPitches = padChordPitches.map(p => {
          while (p < baseOctave) p += 12;
          while (p > baseOctave + 24) p -= 12; // Cap at C5 roughly
          return p;
      }).sort((a,b) => a-b);

      // Apply voice leading for smoother pad changes (simple version)
      let previousPadVoicing = notes.filter(n => n.start === sectionStart + (bar - chordDurationBars) * beatsPerBar).map(n => n.pitch);
      if (previousPadVoicing.length > 0) {
          padChordPitches = this.voiceLeadChord(padChordPitches, previousPadVoicing);
      }

      padChordPitches.forEach((pitch, i) => {
        const humanized = this.applyHumanization(
          sectionStart + bar * beatsPerBar,
          60 - i * 5, // Lower velocity for higher notes in the chord
          params
        );

        notes.push({
          pitch: pitch,
          start: humanized.time,
          duration: chordDurationBars * beatsPerBar - 0.1, // Hold for duration, slight release
          velocity: humanized.velocity
        });
      });
    }

    return notes;
  }

  generateLeadTrack(params, section, sectionStart) {
    // Lead track is essentially a more prominent and often higher-energy melody track
    const leadParams = { ...params, density: 'high', energy: 'high' };
    const notes = this.generateMelodyTrack(leadParams, section, sectionStart);

    // Boost velocities for lead and ensure a higher octave
    return notes.map(note => ({
      ...note,
      pitch: note.pitch + 12, // Shift up an octave from regular melody
      velocity: Math.min(127, note.velocity + 15) // Make it louder
    }));
  }

  generateCountermelodyTrack(params, section, sectionStart) {
    const { key, scale, energy, bpm } = params;
    const scaleNotes = this.scales[scale] || this.scales.major;
    const rootMidiChromatic = this.noteToMidi(key);
    const bars = section.bars;
    const notes = [];
    const beatsPerBar = 4;
    const baseOctave = 66; // G4, typically one octave above bass, below melody

    const noteDensity = energy === 'high' ? 6 : energy === 'low' ? 2 : 4;
    const contour = this.melodicContours.wave; // Often wavy or complementary to main melody

    let previousPitch = rootMidiChromatic + baseOctave + scaleNotes[0];

    for (let bar = 0; bar < bars; bar++) {
      const currentBeatInBar = bar * beatsPerBar;
      for (let i = 0; i < noteDensity; i++) {
        const t = i / noteDensity;
        const beat = t * beatsPerBar;
        const swungBeat = this.applySwing(beat, params);

        const contourValue = this.interpolateContour(contour, t + (bar / bars)); // Offset contour per bar
        const contourPitchOffset = Math.floor(contourValue * 12); // Range of one octave influence

        let targetScaleDegree = Math.floor(Math.random() * scaleNotes.length);

        // Try to move in contrary motion to the main melody if possible (complex, not fully implemented here)
        // For now, focus on voice leading
        if (Math.random() < this.voiceLeadingRules.preferStepwise && notes.length > 0) {
            const lastNoteChromatic = notes[notes.length - 1].pitch % 12;
            const lastScaleIdx = scaleNotes.indexOf((lastNoteChromatic - (rootMidiChromatic % 12) + 12) % 12);
            if (lastScaleIdx !== -1) {
                const direction = Math.random() < 0.5 ? 1 : -1;
                targetScaleDegree = (lastScaleIdx + direction + scaleNotes.length) % scaleNotes.length;
            }
        }

        let pitch = rootMidiChromatic + baseOctave + scaleNotes[targetScaleDegree] + contourPitchOffset;

        if (Math.abs(pitch - previousPitch) > this.voiceLeadingRules.maxLeap) {
            if (pitch > previousPitch) {
                pitch = previousPitch + this.voiceLeadingRules.maxLeap;
            } else {
                pitch = previousPitch - this.voiceLeadingRules.maxLeap;
            }
            const closestDiatonic = scaleNotes.map(sn => rootMidiChromatic + baseOctave + sn)
                                               .reduce((prev, curr) => (Math.abs(curr - pitch) < Math.abs(prev - pitch) ? curr : prev), pitch);
            pitch = closestDiatonic;
        }

        const duration = this.generateRhythmicValue(bpm, energy, i, noteDensity);

        const humanized = this.applyHumanization(
          sectionStart + currentBeatInBar + swungBeat,
          Math.min(85, this.calculateDynamics(t, contourValue * 0.7)), // Slightly lower dynamics than main melody
          params
        );

        notes.push({
          pitch: pitch,
          start: humanized.time,
          duration: duration,
          velocity: humanized.velocity
        });
        previousPitch = pitch;
      }
    }

    return notes;
  }
}
