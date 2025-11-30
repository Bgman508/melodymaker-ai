// MIDI File Validator
export class MIDIValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  validate(midiData) {
    this.errors = [];
    this.warnings = [];
    
    // Check header
    this.validateHeader(midiData);
    
    // Check tracks
    this.validateTracks(midiData);
    
    // Check note ranges
    this.validateNoteRanges(midiData);
    
    // Check timing
    this.validateTiming(midiData);
    
    return {
      valid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings
    };
  }

  validateHeader(data) {
    if (data.length < 14) {
      this.errors.push('File too short to contain valid MIDI header');
      return;
    }
    
    const header = String.fromCharCode(...data.slice(0, 4));
    if (header !== 'MThd') {
      this.errors.push('Invalid MIDI header signature');
    }
    
    const headerLength = (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
    if (headerLength !== 6) {
      this.warnings.push(`Unusual header length: ${headerLength}`);
    }
  }

  validateTracks(data) {
    let offset = 14; // After header
    let trackCount = 0;
    
    while (offset < data.length - 8) {
      const chunk = String.fromCharCode(...data.slice(offset, offset + 4));
      if (chunk === 'MTrk') {
        trackCount++;
        const length = (data[offset + 4] << 24) | (data[offset + 5] << 16) | 
                       (data[offset + 6] << 8) | data[offset + 7];
        
        // Check for end-of-track marker
        const trackData = data.slice(offset + 8, offset + 8 + length);
        if (!this.hasEndOfTrack(trackData)) {
          this.errors.push(`Track ${trackCount} missing end-of-track marker`);
        }
        
        offset += 8 + length;
      } else {
        break;
      }
    }
    
    if (trackCount === 0) {
      this.errors.push('No tracks found in MIDI file');
    }
  }

  hasEndOfTrack(trackData) {
    // Look for 0xFF 0x2F 0x00
    for (let i = 0; i < trackData.length - 2; i++) {
      if (trackData[i] === 0xFF && trackData[i + 1] === 0x2F && trackData[i + 2] === 0x00) {
        return true;
      }
    }
    return false;
  }

  validateNoteRanges(notes) {
    if (!notes || !Array.isArray(notes)) return;
    
    notes.forEach((note, idx) => {
      if (note.pitch < 0 || note.pitch > 127) {
        this.errors.push(`Note ${idx}: pitch ${note.pitch} out of range [0-127]`);
      }
      if (note.velocity < 0 || note.velocity > 127) {
        this.errors.push(`Note ${idx}: velocity ${note.velocity} out of range [0-127]`);
      }
      if (note.duration <= 0) {
        this.warnings.push(`Note ${idx}: zero or negative duration`);
      }
    });
  }

  validateTiming(notes) {
    if (!notes || !Array.isArray(notes)) return;
    
    notes.forEach((note, idx) => {
      if (note.start < 0) {
        this.errors.push(`Note ${idx}: negative start time ${note.start}`);
      }
    });
    
    // Check for overlapping notes on same pitch
    const sorted = [...notes].sort((a, b) => a.start - b.start);
    const activeNotes = new Map();
    
    sorted.forEach((note, idx) => {
      const key = note.pitch;
      if (activeNotes.has(key)) {
        const prev = activeNotes.get(key);
        if (note.start < prev.start + prev.duration) {
          this.warnings.push(`Notes overlap at pitch ${note.pitch}`);
        }
      }
      activeNotes.set(key, note);
    });
  }

  validateVLQ(value) {
    if (value < 0) {
      this.errors.push(`Negative VLQ value: ${value}`);
      return false;
    }
    if (value > 0x0FFFFFFF) {
      this.errors.push(`VLQ value too large: ${value}`);
      return false;
    }
    return true;
  }

  validatePitchBend(value) {
    if (value < 0 || value > 16383) {
      this.errors.push(`Pitch bend value ${value} out of range [0-16383]`);
      return false;
    }
    return true;
  }

  getReport() {
    return {
      valid: this.errors.length === 0,
      errorCount: this.errors.length,
      warningCount: this.warnings.length,
      errors: this.errors,
      warnings: this.warnings
    };
  }
}