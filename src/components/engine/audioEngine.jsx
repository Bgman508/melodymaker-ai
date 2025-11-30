// FIXED - Support Both MIDI Notes AND Audio Files
import { SynthEngine } from './synthEngine';
import { DRUM_NOTE_MAP } from './instrumentLibrary';

export class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.synthEngine = null;
    this.scheduledNotes = [];
    this.audioSources = [];
    this.isPlaying = false;
    this.startTime = 0;
  }

  async initialize() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.synthEngine = new SynthEngine(this.audioContext);
      console.log('✓ AudioContext created');
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
      console.log('✓ AudioContext resumed');
    }
    
    return this.audioContext;
  }

  async scheduleTrack(track, bpm, startTime) {
    console.log(`\n📝 Scheduling: ${track.name}`);
    console.log(`   Type: ${track.isAudio ? 'AUDIO' : 'MIDI'}`);
    console.log(`   Muted: ${track.muted}`);
    console.log(`   AudioURL: ${track.audioUrl ? 'YES' : 'NO'}`);
    console.log(`   Notes: ${track.notes?.length || 0}`);
    
    if (track.muted) {
      console.log('   ⏭️ SKIPPED (muted)');
      return 0;
    }

    // Check if this is an AUDIO track (stem or recording)
    if (track.audioUrl && track.isAudio) {
      console.log('   🎵 Playing AUDIO FILE');
      try {
        await this.playAudioFile(track, startTime);
        return 1; // Count as 1 scheduled item
      } catch (error) {
        console.error(`   ❌ Audio playback failed:`, error);
        return 0;
      }
    }

    // MIDI playback
    if (!track.notes || track.notes.length === 0) {
      console.log('   ⚠️ SKIPPED (no notes)');
      return 0;
    }
    
    const beatDuration = 60 / bpm;
    const now = this.audioContext.currentTime;
    
    let scheduledCount = 0;
    
    track.notes.forEach((note, idx) => {
      const noteTime = startTime + (note.start * beatDuration);
      
      if (noteTime <= now) {
        return;
      }
      
      const duration = Math.max(0.05, note.duration * beatDuration);
      const velocity = (note.velocity || 0.8) * (track.volume || 0.8);
      
      try {
        let source;
        
        if (track.type === 'drums') {
          const drumType = DRUM_NOTE_MAP[note.pitch];
          if (drumType) {
            source = this.synthEngine.playDrum(drumType, noteTime, velocity);
            scheduledCount++;
          }
        } else {
          const freq = 440 * Math.pow(2, (note.pitch - 69) / 12);
          source = this.synthEngine.playNote(freq, noteTime, duration, velocity);
          scheduledCount++;
        }
        
        if (source) {
          this.scheduledNotes.push(source);
        }
      } catch (error) {
        console.error(`   ❌ Failed note ${idx}:`, error);
      }
    });
    
    console.log(`   ✅ Scheduled: ${scheduledCount} MIDI notes`);
    return scheduledCount;
  }

  async playAudioFile(track, startTime) {
    try {
      console.log(`   Loading audio from: ${track.audioUrl.substring(0, 50)}...`);
      
      const response = await fetch(track.audioUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      console.log(`   ✓ Audio decoded: ${audioBuffer.duration.toFixed(2)}s`);

      // Create audio source
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;

      // Create gain node for volume control
      const gainNode = this.audioContext.createGain();
      gainNode.gain.value = track.volume || 0.75;

      // Create pan node
      const panNode = this.audioContext.createStereoPanner();
      panNode.pan.value = track.pan || 0;

      // Connect: source -> gain -> pan -> destination
      source.connect(gainNode);
      gainNode.connect(panNode);
      panNode.connect(this.audioContext.destination);

      // Schedule playback
      source.start(startTime);
      
      console.log(`   ✓ Audio scheduled at ${startTime.toFixed(3)}s`);

      // Store for cleanup
      this.audioSources.push({ source, gainNode, panNode });

      return source;
    } catch (error) {
      console.error(`   ❌ Audio file error:`, error);
      throw error;
    }
  }

  async play(tracks, bpm, fromBeat = 0) {
    console.log('\n' + '='.repeat(60));
    console.log('🎵 STARTING PLAYBACK');
    console.log('='.repeat(60));
    
    await this.initialize();
    this.stop();
    
    const now = this.audioContext.currentTime;
    this.startTime = now + 0.15;
    this.isPlaying = true;
    
    console.log(`Total tracks: ${tracks.length}`);
    console.log(`Audio tracks: ${tracks.filter(t => t.isAudio).length}`);
    console.log(`MIDI tracks: ${tracks.filter(t => !t.isAudio).length}`);
    console.log(`BPM: ${bpm}`);
    console.log(`Start time: ${this.startTime.toFixed(3)}s`);
    
    const activeTracks = tracks.filter(t => !t.muted);
    console.log(`Active tracks: ${activeTracks.length}`);
    
    let totalScheduled = 0;
    
    for (const track of activeTracks) {
      try {
        const count = await this.scheduleTrack(track, bpm, this.startTime);
        totalScheduled += count;
      } catch (error) {
        console.error(`❌ Error scheduling ${track.name}:`, error);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    console.log(`✅ TOTAL SCHEDULED: ${totalScheduled} items`);
    console.log(`   MIDI notes: ${this.scheduledNotes.length}`);
    console.log(`   Audio files: ${this.audioSources.length}`);
    console.log('='.repeat(60) + '\n');
    
    if (totalScheduled === 0) {
      console.error('❌ NO AUDIO SCHEDULED!');
      this.stop();
      throw new Error('No playable content - tracks need either notes or audio files');
    }
  }

  stop() {
    this.isPlaying = false;
    
    // Stop MIDI notes
    this.scheduledNotes.forEach(note => {
      try {
        if (note && note.stop) note.stop();
      } catch (e) {}
    });
    this.scheduledNotes = [];

    // Stop audio files
    this.audioSources.forEach(({ source }) => {
      try {
        if (source && source.stop) source.stop();
      } catch (e) {}
    });
    this.audioSources = [];
  }

  getCurrentBeat(bpm) {
    if (!this.isPlaying || !this.audioContext) return 0;
    const elapsed = this.audioContext.currentTime - this.startTime;
    return Math.max(0, elapsed * bpm / 60);
  }
}