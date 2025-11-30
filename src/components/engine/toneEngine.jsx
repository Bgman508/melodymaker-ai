export class ToneEngine {
  constructor() {
    this.audioContext = null;
    this.initialized = false;
    this.instruments = new Map();
    this.scheduledSources = [];
    this.audioSources = [];
    this.masterGain = null;
    this.startTime = 0;
    this.startOffset = 0;
  }

  async initialize() {
    if (this.initialized) {
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      return;
    }
    
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 0.8; // INCREASED VOLUME
    this.masterGain.connect(this.audioContext.destination);
    
    console.log('✓ Audio Engine initialized - Master Volume: 80%');
    this.initialized = true;
  }

  midiToFrequency(midiNote) {
    return 440 * Math.pow(2, (midiNote - 69) / 12);
  }

  createInstrument(type = 'synth') {
    return {
      type,
      oscillatorType: type === 'bass' ? 'sawtooth' : 
                      type === 'lead' ? 'square' : 
                      type === 'pad' ? 'sine' : 'triangle'
    };
  }

  getInstrument(trackId, type = 'synth') {
    if (this.instruments.has(trackId)) {
      return this.instruments.get(trackId);
    }
    
    const instrument = this.createInstrument(type);
    this.instruments.set(trackId, instrument);
    return instrument;
  }

  playNote(instrument, frequency, startTime, duration, velocity, pan = 0) {
    const osc = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const panNode = this.audioContext.createStereoPanner();
    
    osc.type = instrument.oscillatorType || 'sine';
    osc.frequency.value = frequency;
    
    // BOOSTED VOLUME
    const peakVol = velocity * 0.6;
    const sustainVol = peakVol * 0.7;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(peakVol, startTime + 0.01);
    gainNode.gain.linearRampToValueAtTime(sustainVol, startTime + 0.1);
    gainNode.gain.setValueAtTime(sustainVol, startTime + duration - 0.3);
    gainNode.gain.linearRampToValueAtTime(0.001, startTime + duration);
    
    panNode.pan.value = pan;
    
    osc.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(this.masterGain);
    
    osc.start(startTime);
    osc.stop(startTime + duration);
    
    this.scheduledSources.push(osc);
    return osc;
  }

  playDrum(drumType, startTime, velocity) {
    const drumMap = {
      'kick': () => this.playKick(startTime, velocity),
      'snare': () => this.playSnare(startTime, velocity),
      'hihat': () => this.playHihat(startTime, velocity),
      'closedhat': () => this.playHihat(startTime, velocity),
      'openhat': () => this.playOpenHat(startTime, velocity),
      'clap': () => this.playClap(startTime, velocity)
    };
    
    const play = drumMap[drumType];
    if (play) return play();
  }

  playKick(startTime, velocity = 0.8) {
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    
    osc.frequency.setValueAtTime(150, startTime);
    osc.frequency.exponentialRampToValueAtTime(50, startTime + 0.05);
    
    const vol = velocity * 0.7; // BOOSTED
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
    
    osc.connect(gain);
    gain.connect(this.masterGain);
    
    osc.start(startTime);
    osc.stop(startTime + 0.3);
    
    this.scheduledSources.push(osc);
    return osc;
  }

  playSnare(startTime, velocity = 0.8) {
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.2, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const noiseFilter = this.audioContext.createBiquadFilter();
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.value = 1000;
    
    const noiseGain = this.audioContext.createGain();
    const vol = velocity * 0.5; // BOOSTED
    noiseGain.gain.setValueAtTime(vol, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.masterGain);
    
    noise.start(startTime);
    noise.stop(startTime + 0.2);
    
    this.scheduledSources.push(noise);
    return noise;
  }

  playHihat(startTime, velocity = 0.8) {
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.05, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    
    const gain = this.audioContext.createGain();
    const vol = velocity * 0.3; // BOOSTED
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start(startTime);
    noise.stop(startTime + 0.05);
    
    this.scheduledSources.push(noise);
    return noise;
  }

  playOpenHat(startTime, velocity = 0.8) {
    const noise = this.audioContext.createBufferSource();
    const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    for (let i = 0; i < output.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    
    noise.buffer = noiseBuffer;
    
    const filter = this.audioContext.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7000;
    
    const gain = this.audioContext.createGain();
    const vol = velocity * 0.4; // BOOSTED
    gain.gain.setValueAtTime(vol, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    
    noise.start(startTime);
    noise.stop(startTime + 0.3);
    
    this.scheduledSources.push(noise);
    return noise;
  }

  playClap(startTime, velocity = 0.8) {
    for (let i = 0; i < 3; i++) {
      const delay = i * 0.01;
      const noise = this.audioContext.createBufferSource();
      const noiseBuffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.03, this.audioContext.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      
      for (let j = 0; j < output.length; j++) {
        output[j] = Math.random() * 2 - 1;
      }
      
      noise.buffer = noiseBuffer;
      
      const filter = this.audioContext.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 2000;
      
      const gain = this.audioContext.createGain();
      const vol = velocity * 0.4; // BOOSTED
      gain.gain.setValueAtTime(vol, startTime + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + delay + 0.03);
      
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      
      noise.start(startTime + delay);
      noise.stop(startTime + delay + 0.03);
      
      this.scheduledSources.push(noise);
    }
  }

  scheduleNote(trackId, trackType, note, startTime, duration, velocity) {
    const drumMap = {
      36: 'kick',
      38: 'snare',
      42: 'closedhat',
      46: 'openhat',
      39: 'clap',
    };
    
    if (trackType === 'drums') {
      const drumType = drumMap[note.pitch];
      if (drumType) {
        this.playDrum(drumType, startTime, velocity);
      }
    } else {
      const instrument = this.getInstrument(trackId, trackType);
      const freq = this.midiToFrequency(note.pitch);
      this.playNote(instrument, freq, startTime, duration, velocity, note.pan || 0);
    }
  }

  async playAudioTracks(tracks, bpm, fromBeat = 0) {
    console.log('\n🎵 AUDIO TRACKS PLAYBACK');
    console.log('='.repeat(50));
    
    await this.initialize();
    
    const beatDuration = 60 / bpm;
    const now = this.audioContext.currentTime;
    const startTime = now + 0.1;
    
    this.startTime = startTime;
    this.startOffset = fromBeat;
    
    let scheduledCount = 0;
    
    for (const track of tracks) {
      if (track.muted || !track.audioUrl) {
        console.log(`⏭️  SKIP: ${track.name}`);
        continue;
      }
      
      try {
        console.log(`🎧 Loading: ${track.name}`);
        
        const response = await fetch(track.audioUrl);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        
        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = (track.volume || 0.75) * 1.2; // BOOSTED
        
        const panNode = this.audioContext.createStereoPanner();
        panNode.pan.value = track.pan || 0;
        
        source.connect(gainNode);
        gainNode.connect(panNode);
        panNode.connect(this.masterGain);
        
        source.start(startTime);
        
        console.log(`✅ Scheduled: ${track.name} (${audioBuffer.duration.toFixed(2)}s)`);
        
        this.audioSources.push({ source, gainNode, panNode });
        scheduledCount++;
        
      } catch (error) {
        console.error(`❌ Failed: ${track.name} - ${error.message}`);
      }
    }
    
    console.log('='.repeat(50));
    console.log(`✅ TOTAL AUDIO TRACKS: ${scheduledCount}`);
    return scheduledCount;
  }

  async playTracks(tracks, bpm, fromBeat = 0) {
    console.log('\n🎹 MIDI PLAYBACK');
    console.log('='.repeat(50));
    
    await this.initialize();
    this.stop();
    
    const beatDuration = 60 / bpm;
    const now = this.audioContext.currentTime;
    const startTime = now + 0.1;
    
    this.startTime = startTime;
    this.startOffset = fromBeat;
    
    let scheduledCount = 0;
    
    tracks.forEach(track => {
      if (track.muted || !track.notes || track.notes.length === 0) {
        console.log(`⏭️  SKIP: ${track.name}`);
        return;
      }
      
      console.log(`🎹 ${track.name} (${track.type}) - ${track.notes.length} notes`);
      
      let trackScheduled = 0;
      
      track.notes.forEach(note => {
        if (note.start < fromBeat) return;
        
        const noteStartTime = startTime + ((note.start - fromBeat) * beatDuration);
        const noteDuration = note.duration * beatDuration;
        const velocity = (note.velocity || 0.8) * (track.volume || 0.8);
        
        this.scheduleNote(track.id, track.type, note, noteStartTime, noteDuration, velocity);
        trackScheduled++;
        scheduledCount++;
      });
      
      console.log(`  ✅ Scheduled: ${trackScheduled} notes`);
    });
    
    console.log('='.repeat(50));
    console.log(`✅ TOTAL MIDI NOTES: ${scheduledCount}`);
    return scheduledCount;
  }

  stop() {
    this.scheduledSources.forEach(source => {
      try {
        if (source && typeof source.stop === 'function') {
          source.stop();
        }
      } catch (e) {}
    });
    this.scheduledSources = [];
    
    this.audioSources.forEach(({ source }) => {
      try {
        if (source && typeof source.stop === 'function') {
          source.stop();
        }
      } catch (e) {}
    });
    this.audioSources = [];
    
    this.startTime = 0;
    this.startOffset = 0;
  }

  pause() {
    if (this.audioContext) {
      this.audioContext.suspend();
    }
  }

  resume() {
    if (this.audioContext) {
      this.audioContext.resume();
    }
  }

  dispose() {
    this.stop();
    this.instruments.clear();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}