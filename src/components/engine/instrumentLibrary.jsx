// Keep existing code (imports, DRUM_KIT, etc.)

export const DRUM_NOTE_MAP = {
  // Bass drums
  35: 'kick', 36: 'kick',
  // Snares
  38: 'snare', 40: 'snare',
  // Hi-hats
  42: 'hihat', 44: 'hihat', 46: 'hihat',
  // Claps
  39: 'clap',
  // Toms (map to kick for now)
  41: 'kick', 43: 'kick', 45: 'kick', 47: 'kick', 48: 'kick', 50: 'kick',
  // Cymbals (map to hihat)
  49: 'hihat', 51: 'hihat', 52: 'hihat', 53: 'hihat', 55: 'hihat', 57: 'hihat', 59: 'hihat'
};

export const INSTRUMENT_LIBRARY = {
  // Keyboards
  piano: {
    name: 'Acoustic Piano',
    category: 'keyboard',
    waveform: 'sine',
    attack: 0.01,
    decay: 0.2,
    sustain: 0.3,
    release: 0.5
  },
  epiano: {
    name: 'Electric Piano',
    category: 'keyboard',
    waveform: 'triangle',
    attack: 0.01,
    decay: 0.3,
    sustain: 0.4,
    release: 0.4
  },
  
  // Synths
  lead: {
    name: 'Lead Synth',
    category: 'synth',
    waveform: 'sawtooth',
    attack: 0.01,
    decay: 0.1,
    sustain: 0.7,
    release: 0.2
  },
  pad: {
    name: 'Synth Pad',
    category: 'synth',
    waveform: 'triangle',
    attack: 0.5,
    decay: 0.3,
    sustain: 0.8,
    release: 1.0
  },
  bass: {
    name: 'Synth Bass',
    category: 'bass',
    waveform: 'sawtooth',
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.1
  },
  
  // Default
  default: {
    name: 'Default',
    category: 'synth',
    waveform: 'sine',
    attack: 0.01,
    decay: 0.1,
    sustain: 0.7,
    release: 0.3
  }
};

export function getInstrumentForTrack(trackType) {
  const mapping = {
    melody: 'lead',
    lead: 'lead',
    chords: 'pad',
    pad: 'pad',
    bass: 'bass',
    piano: 'piano',
    keys: 'epiano',
    synth: 'lead'
  };
  
  return INSTRUMENT_LIBRARY[mapping[trackType]] || INSTRUMENT_LIBRARY.default;
}

export const DRUM_KIT = {
  kick: { name: 'Kick', pitch: 36 },
  snare: { name: 'Snare', pitch: 38 },
  hihat: { name: 'Hi-Hat', pitch: 42 },
  clap: { name: 'Clap', pitch: 39 }
};