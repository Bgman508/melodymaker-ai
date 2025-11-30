// Sample Player - Loads and plays back instrument samples
export class SamplePlayer {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.loadedBuffers = new Map();
    this.loadingPromises = new Map();
    this.failedSamples = new Set();
  }

  async loadSample(url) {
    // Check if already loaded
    if (this.loadedBuffers.has(url)) {
      return this.loadedBuffers.get(url);
    }

    // Check if previously failed
    if (this.failedSamples.has(url)) {
      return null;
    }

    // Check if currently loading
    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    // Load the sample
    const promise = fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        return response.arrayBuffer();
      })
      .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        this.loadedBuffers.set(url, audioBuffer);
        this.loadingPromises.delete(url);
        return audioBuffer;
      })
      .catch(error => {
        console.warn(`Failed to load sample: ${url}`, error.message);
        this.failedSamples.add(url);
        this.loadingPromises.delete(url);
        return null;
      });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  async loadInstrument(instrument) {
    if (instrument.type !== 'sampled' || !instrument.samples) return;

    const promises = [];
    for (const [note, filename] of Object.entries(instrument.samples)) {
      // Properly concatenate baseUrl with filename (avoid double slashes)
      const url = instrument.baseUrl.endsWith('/') 
        ? instrument.baseUrl + filename 
        : instrument.baseUrl + '/' + filename;
      promises.push(this.loadSample(url));
    }

    const results = await Promise.all(promises);
    const successCount = results.filter(r => r !== null).length;
    
    if (successCount === 0) {
      console.warn(`Failed to load any samples for ${instrument.name}`);
    } else if (successCount < Object.keys(instrument.samples).length) {
      console.warn(`Loaded ${successCount}/${Object.keys(instrument.samples).length} samples for ${instrument.name}`);
    }
    
    return successCount > 0;
  }

  findNearestSample(instrument, midiNote) {
    if (!instrument.samples) return null;

    const noteNames = Object.keys(instrument.samples);
    const targetPitch = midiNote;
    
    let nearest = null;
    let minDistance = Infinity;

    for (const noteName of noteNames) {
      const samplePitch = this.noteNameToMIDI(noteName);
      const distance = Math.abs(samplePitch - targetPitch);
      
      if (distance < minDistance) {
        minDistance = distance;
        nearest = noteName;
      }
    }

    return nearest;
  }

  noteNameToMIDI(noteName) {
    const noteMap = { 'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11 };
    
    let note = noteName[0].toUpperCase();
    let offset = noteMap[note];
    let octave = parseInt(noteName.match(/\d+/)[0]);
    
    if (noteName.includes('#')) offset++;
    if (noteName.includes('b')) offset--;
    if (noteName.includes('s')) offset++; // 'Ds' format
    
    return 12 * (octave + 1) + offset;
  }

  calculatePlaybackRate(fromMIDI, toMIDI) {
    // Calculate how much to pitch-shift the sample
    const semitoneDiff = toMIDI - fromMIDI;
    return Math.pow(2, semitoneDiff / 12);
  }

  playSample(instrument, midiNote, startTime, duration, velocity, pan = 0) {
    const nearestNote = this.findNearestSample(instrument, midiNote);
    if (!nearestNote) return null;

    // Properly concatenate baseUrl with filename
    const filename = instrument.samples[nearestNote];
    const url = instrument.baseUrl.endsWith('/') 
      ? instrument.baseUrl + filename 
      : instrument.baseUrl + '/' + filename;
      
    const buffer = this.loadedBuffers.get(url);
    
    if (!buffer) {
      // Sample not loaded - skip silently (warning already logged)
      return null;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    const panNode = this.audioContext.createStereoPanner();

    source.buffer = buffer;
    
    // Calculate playback rate for pitch shifting
    const sampleMIDI = this.noteNameToMIDI(nearestNote);
    source.playbackRate.value = this.calculatePlaybackRate(sampleMIDI, midiNote);

    // Set volume based on velocity
    const volume = (velocity / 127) * 0.5;
    gainNode.gain.setValueAtTime(volume, startTime);
    
    // Release envelope
    const release = instrument.release || 0.5;
    const releaseTime = startTime + Math.max(0.05, duration);
    gainNode.gain.setValueAtTime(volume, releaseTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, releaseTime + release);

    // Pan
    panNode.pan.value = Math.max(-1, Math.min(1, pan));

    // Connect
    source.connect(gainNode);
    gainNode.connect(panNode);
    panNode.connect(this.audioContext.destination);

    // Play
    const validStartTime = Math.max(this.audioContext.currentTime + 0.01, startTime);
    source.start(validStartTime);
    source.stop(validStartTime + duration + release);

    return source;
  }
}