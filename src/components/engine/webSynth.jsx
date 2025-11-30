// Simple Web Audio Synthesizer for Audition
export class WebSynth {
  constructor() {
    this.audioContext = null;
    this.oscillators = [];
  }

  initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return this.audioContext;
  }

  midiToFrequency(midi) {
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  createOscillator(frequency, duration, waveType = 'sine', volume = 0.3) {
    const context = this.audioContext;
    const now = context.currentTime;
    
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    const filterNode = context.createBiquadFilter();
    
    oscillator.type = waveType;
    oscillator.frequency.value = frequency;
    
    filterNode.type = 'lowpass';
    filterNode.frequency.value = 2000;
    
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.start(now);
    oscillator.stop(now + duration);
    
    return oscillator;
  }

  auditionProgram(program, track) {
    this.initialize();
    this.stopAll();
    
    // Choose wave type based on program
    let waveType = 'sine';
    let volume = 0.3;
    
    if (program >= 0 && program <= 7) waveType = 'triangle'; // Piano-like
    else if (program >= 16 && program <= 23) waveType = 'sine'; // Organ
    else if (program >= 32 && program <= 39) waveType = 'sawtooth'; // Bass
    else if (program >= 80 && program <= 87) waveType = 'square'; // Synth Lead
    else if (program >= 88 && program <= 95) waveType = 'sine'; // Pads
    
    // Play a simple riff based on track type
    const notes = track?.type === 'bass' ? [48, 48, 55, 55] : 
                  track?.type === 'drums' ? [60, 60, 60, 60] : // Hat pattern
                  [60, 64, 67, 72]; // Chord arpeggio
    
    const timing = [0, 0.3, 0.6, 0.9];
    
    notes.forEach((note, i) => {
      const freq = this.midiToFrequency(note);
      setTimeout(() => {
        const osc = this.createOscillator(freq, 0.4, waveType, volume);
        this.oscillators.push(osc);
      }, timing[i] * 1000);
    });
    
    // Cleanup
    setTimeout(() => this.stopAll(), 1500);
  }

  stopAll() {
    this.oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    this.oscillators = [];
  }
}