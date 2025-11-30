// MIDI File Parser - Reads and analyzes MIDI files
export class MIDIParser {
  constructor() {
    this.ppq = 480;
  }

  async parseMIDIFile(file) {
    const arrayBuffer = await file.arrayBuffer();
    const dataView = new DataView(arrayBuffer);
    
    let offset = 0;
    
    // Read header chunk
    const headerType = this.readString(dataView, offset, 4);
    if (headerType !== 'MThd') {
      throw new Error('Invalid MIDI file');
    }
    offset += 4;
    
    const headerLength = dataView.getUint32(offset);
    offset += 4;
    
    const format = dataView.getUint16(offset);
    offset += 2;
    
    const trackCount = dataView.getUint16(offset);
    offset += 2;
    
    this.ppq = dataView.getUint16(offset);
    offset += 2;
    
    // Read all tracks
    const tracks = [];
    let globalTempo = 120;
    
    for (let i = 0; i < trackCount; i++) {
      const trackData = this.readTrack(dataView, offset);
      offset = trackData.nextOffset;
      
      if (trackData.tempo) {
        globalTempo = trackData.tempo;
      }
      
      if (trackData.notes.length > 0 || trackData.name) {
        tracks.push(trackData);
      }
    }
    
    // Analyze the composition
    const analysis = this.analyzeComposition(tracks, globalTempo);
    
    return {
      tracks: tracks.filter(t => t.notes.length > 0),
      bpm: globalTempo,
      ppq: this.ppq,
      format,
      analysis
    };
  }

  readString(dataView, offset, length) {
    let str = '';
    for (let i = 0; i < length; i++) {
      str += String.fromCharCode(dataView.getUint8(offset + i));
    }
    return str;
  }

  readVarLength(dataView, offset) {
    let value = 0;
    let byte;
    let bytesRead = 0;
    
    do {
      byte = dataView.getUint8(offset + bytesRead);
      value = (value << 7) | (byte & 0x7F);
      bytesRead++;
    } while (byte & 0x80);
    
    return { value, bytesRead };
  }

  readTrack(dataView, offset) {
    const trackHeader = this.readString(dataView, offset, 4);
    if (trackHeader !== 'MTrk') {
      throw new Error('Invalid track header');
    }
    offset += 4;
    
    const trackLength = dataView.getUint32(offset);
    offset += 4;
    
    const trackEnd = offset + trackLength;
    
    const notes = [];
    const ccEvents = [];
    let trackName = null;
    let tempo = null;
    let program = 0;
    let channel = 0;
    
    let currentTime = 0;
    let runningStatus = 0;
    const activeNotes = new Map();
    
    while (offset < trackEnd) {
      // Read delta time
      const deltaTime = this.readVarLength(dataView, offset);
      offset += deltaTime.bytesRead;
      currentTime += deltaTime.value;
      
      // Read event
      let statusByte = dataView.getUint8(offset);
      
      // Handle running status
      if ((statusByte & 0x80) === 0) {
        statusByte = runningStatus;
      } else {
        offset++;
        runningStatus = statusByte;
      }
      
      const eventType = statusByte & 0xF0;
      channel = statusByte & 0x0F;
      
      if (eventType === 0x90) { // Note On
        const pitch = dataView.getUint8(offset++);
        const velocity = dataView.getUint8(offset++);
        
        if (velocity > 0) {
          activeNotes.set(pitch, {
            pitch,
            start: currentTime / this.ppq,
            velocity,
            channel
          });
        } else {
          // Velocity 0 = Note Off
          const noteOn = activeNotes.get(pitch);
          if (noteOn) {
            notes.push({
              ...noteOn,
              duration: (currentTime / this.ppq) - noteOn.start
            });
            activeNotes.delete(pitch);
          }
        }
      } else if (eventType === 0x80) { // Note Off
        const pitch = dataView.getUint8(offset++);
        const velocity = dataView.getUint8(offset++);
        
        const noteOn = activeNotes.get(pitch);
        if (noteOn) {
          notes.push({
            ...noteOn,
            duration: (currentTime / this.ppq) - noteOn.start
          });
          activeNotes.delete(pitch);
        }
      } else if (eventType === 0xB0) { // Control Change
        const cc = dataView.getUint8(offset++);
        const value = dataView.getUint8(offset++);
        ccEvents.push({
          time: currentTime / this.ppq,
          cc,
          value,
          channel
        });
      } else if (eventType === 0xC0) { // Program Change
        program = dataView.getUint8(offset++);
      } else if (eventType === 0xE0) { // Pitch Bend
        const lsb = dataView.getUint8(offset++);
        const msb = dataView.getUint8(offset++);
        // Store pitch bend events if needed
      } else if (statusByte === 0xFF) { // Meta Event
        const metaType = dataView.getUint8(offset++);
        const length = this.readVarLength(dataView, offset);
        offset += length.bytesRead;
        
        if (metaType === 0x03) { // Track Name
          trackName = this.readString(dataView, offset, length.value);
        } else if (metaType === 0x51) { // Tempo
          const microsecondsPerBeat = (dataView.getUint8(offset) << 16) |
                                       (dataView.getUint8(offset + 1) << 8) |
                                       dataView.getUint8(offset + 2);
          tempo = Math.round(60000000 / microsecondsPerBeat);
        }
        
        offset += length.value;
      } else {
        // Skip unknown events
        if (eventType === 0xF0 || eventType === 0xF7) {
          const length = this.readVarLength(dataView, offset);
          offset += length.bytesRead + length.value;
        } else {
          offset++;
        }
      }
    }
    
    // Determine track type from analysis
    const trackType = this.classifyTrack(notes, channel, program);
    
    return {
      notes: notes.sort((a, b) => a.start - b.start),
      name: trackName || `Track ${channel + 1}`,
      type: trackType,
      channel,
      program,
      tempo,
      ccEvents,
      nextOffset: offset
    };
  }

  classifyTrack(notes, channel, program) {
    if (channel === 9) return 'drums';
    if (notes.length === 0) return 'unknown';
    
    // Analyze note density and patterns
    const avgPitch = notes.reduce((sum, n) => sum + n.pitch, 0) / notes.length;
    const pitchRange = Math.max(...notes.map(n => n.pitch)) - Math.min(...notes.map(n => n.pitch));
    const hasChords = this.hasChordVoicing(notes);
    
    // Bass: low notes, narrow range
    if (avgPitch < 48 && pitchRange < 24) return 'bass';
    
    // Chords: multiple simultaneous notes
    if (hasChords) return 'chords';
    
    // Melody: single note lines, wider range
    if (pitchRange > 12) return 'melody';
    
    // Default
    return 'harmony';
  }

  hasChordVoicing(notes) {
    // Check for simultaneous notes (chords)
    let simultaneousCount = 0;
    
    for (let i = 0; i < notes.length - 1; i++) {
      const currentEnd = notes[i].start + notes[i].duration;
      const nextStart = notes[i + 1].start;
      
      if (Math.abs(nextStart - notes[i].start) < 0.1) {
        simultaneousCount++;
      }
    }
    
    return simultaneousCount > notes.length * 0.3;
  }

  analyzeComposition(tracks, bpm) {
    const allNotes = tracks.flatMap(t => t.notes);
    
    // Detect key and scale
    const { key, scale } = this.detectKeyAndScale(allNotes);
    
    // Analyze structure (find sections based on patterns)
    const maxBeat = Math.max(...allNotes.map(n => n.start + n.duration));
    const estimatedBars = Math.ceil(maxBeat / 4);
    
    // Detect style characteristics
    const styleFeatures = {
      noteDensity: allNotes.length / maxBeat,
      avgVelocity: allNotes.reduce((sum, n) => sum + n.velocity, 0) / allNotes.length,
      rhythmicComplexity: this.analyzeRhythmicComplexity(allNotes),
      harmonicDensity: tracks.filter(t => t.type === 'chords').length
    };
    
    return {
      key,
      scale,
      estimatedBars,
      totalNotes: allNotes.length,
      styleFeatures,
      trackTypes: tracks.map(t => t.type)
    };
  }

  detectKeyAndScale(notes) {
    const pitchClasses = notes.map(n => n.pitch % 12);
    const pitchCounts = {};
    
    pitchClasses.forEach(pc => {
      pitchCounts[pc] = (pitchCounts[pc] || 0) + 1;
    });
    
    // Find most common pitch (likely tonic)
    const sortedPitches = Object.entries(pitchCounts)
      .sort((a, b) => b[1] - a[1]);
    
    const tonic = parseInt(sortedPitches[0][0]);
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const key = noteNames[tonic];
    
    // Simple major/minor detection
    const thirdInterval = pitchClasses.filter(pc => pc === (tonic + 4) % 12).length;
    const minorThirdInterval = pitchClasses.filter(pc => pc === (tonic + 3) % 12).length;
    
    const scale = minorThirdInterval > thirdInterval ? 'minor' : 'major';
    
    return { key, scale };
  }

  analyzeRhythmicComplexity(notes) {
    const durations = notes.map(n => n.duration);
    const uniqueDurations = new Set(durations);
    return uniqueDurations.size / durations.length;
  }

  convertToStudioFormat(parsedData) {
    return {
      tracks: parsedData.tracks.map((track, idx) => ({
        id: `imported-${idx}`,
        name: track.name,
        type: track.type,
        channel: track.channel,
        program: track.program,
        volume: 0.8,
        pan: 0,
        muted: false,
        solo: false,
        notes: track.notes
      })),
      bpm: parsedData.bpm,
      key: parsedData.analysis.key,
      scale: parsedData.analysis.scale,
      styleFeatures: parsedData.analysis.styleFeatures
    };
  }
}