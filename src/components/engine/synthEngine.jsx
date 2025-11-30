// ULTRA-SIMPLE Synth Engine - Guaranteed to Work
export class SynthEngine {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.masterGain = audioContext.createGain();
    this.masterGain.gain.value = 0.3;
    this.masterGain.connect(audioContext.destination);
  }

  playNote(frequency, startTime, duration, velocity = 0.8) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.value = frequency;
    
    // Simple envelope
    const vol = velocity * 0.3;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(vol, startTime + 0.01);
    gain.gain.setValueAtTime(vol, startTime + duration - 0.1);
    gain.gain.linearRampToValueAtTime(0.001, startTime + duration);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
    
    console.log(`Playing note: ${frequency.toFixed(1)}Hz at ${startTime.toFixed(2)}s`);
    
    return osc;
  }

  playDrum(drumType, startTime, velocity = 0.8) {
    console.log(`Playing drum: ${drumType} at ${startTime.toFixed(2)}s`);
    
    if (drumType === 'kick') {
      return this.playKick(startTime, velocity);
    } else if (drumType === 'snare') {
      return this.playSnare(startTime, velocity);
    } else if (drumType === 'hihat' || drumType === 'closedhat') {
      return this.playHihat(startTime, velocity);
    } else {
      return this.playKick(startTime, velocity);
    }
  }

  playKick(startTime, velocity) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(40, startTime + 0.3);
    
    gain.gain.setValueAtTime(velocity * 0.5, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(startTime);
    osc.stop(startTime + 0.4);
    
    return osc;
  }

  playSnare(startTime, velocity) {
    // White noise
    const bufferSize = this.audioContext.sampleRate * 0.2;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(velocity * 0.3, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
    
    noise.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start(startTime);
    
    return noise;
  }

  playHihat(startTime, velocity) {
    // Short white noise
    const bufferSize = this.audioContext.sampleRate * 0.05;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = this.audioContext.createBufferSource();
    noise.buffer = buffer;
    
    const highpass = this.audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 7000;
    
    const gain = this.audioContext.createGain();
    gain.gain.setValueAtTime(velocity * 0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
    
    noise.connect(highpass);
    highpass.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start(startTime);
    
    return noise;
  }
}