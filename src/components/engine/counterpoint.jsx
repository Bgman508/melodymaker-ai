// Counterpoint Generator - Species counterpoint rules
export class CounterpointGenerator {
  constructor() {
    this.rules = {
      parallelFifths: false,
      parallelOctaves: false,
      directMotion: 'stepwise',
      leapResolution: true,
      consonantDownbeats: true
    };
  }

  generateCountermelody(cantusFirmus, species = 1) {
    const countermelody = [];
    
    switch (species) {
      case 1:
        return this.firstSpecies(cantusFirmus);
      case 2:
        return this.secondSpecies(cantusFirmus);
      case 3:
        return this.thirdSpecies(cantusFirmus);
      case 4:
        return this.fourthSpecies(cantusFirmus);
      default:
        return this.firstSpecies(cantusFirmus);
    }
  }

  firstSpecies(cf) {
    // Note against note
    const counter = [];
    
    cf.forEach((note, idx) => {
      const interval = this.selectConsonantInterval(note.pitch, idx, cf.length);
      
      counter.push({
        pitch: note.pitch + interval,
        start: note.start,
        duration: note.duration,
        velocity: note.velocity * 0.9
      });
    });
    
    return this.applyContrapuntalRules(counter, cf);
  }

  secondSpecies(cf) {
    // Two notes against one
    const counter = [];
    
    cf.forEach((note, idx) => {
      const halfDur = note.duration / 2;
      
      // First half - consonance
      const interval1 = this.selectConsonantInterval(note.pitch, idx, cf.length);
      counter.push({
        pitch: note.pitch + interval1,
        start: note.start,
        duration: halfDur,
        velocity: note.velocity * 0.85
      });
      
      // Second half - can be dissonant (passing tone)
      const interval2 = this.selectPassingTone(note.pitch, interval1);
      counter.push({
        pitch: note.pitch + interval2,
        start: note.start + halfDur,
        duration: halfDur,
        velocity: note.velocity * 0.75
      });
    });
    
    return counter;
  }

  thirdSpecies(cf) {
    // Four notes against one
    const counter = [];
    
    cf.forEach((note, idx) => {
      const quarterDur = note.duration / 4;
      
      for (let i = 0; i < 4; i++) {
        const isDownbeat = i === 0;
        const interval = isDownbeat 
          ? this.selectConsonantInterval(note.pitch, idx, cf.length)
          : this.selectPassingTone(note.pitch, 5);
        
        counter.push({
          pitch: note.pitch + interval,
          start: note.start + (i * quarterDur),
          duration: quarterDur,
          velocity: note.velocity * (isDownbeat ? 0.9 : 0.7)
        });
      }
    });
    
    return counter;
  }

  fourthSpecies(cf) {
    // Syncopation with suspensions
    const counter = [];
    
    cf.forEach((note, idx) => {
      if (idx === 0) {
        // Start with consonance
        const interval = this.selectConsonantInterval(note.pitch, idx, cf.length);
        counter.push({
          pitch: note.pitch + interval,
          start: note.start,
          duration: note.duration,
          velocity: note.velocity * 0.9
        });
      } else {
        // Create suspension
        const suspension = this.createSuspension(note, cf[idx - 1]);
        counter.push(...suspension);
      }
    });
    
    return counter;
  }

  selectConsonantInterval(cfPitch, position, totalLength) {
    const consonances = position === 0 || position === totalLength - 1
      ? [0, 12, -12] // Perfect unison or octave at start/end
      : [3, 4, 7, 8, 9, 12, -3, -4, -7, -8, -9, -12]; // 3rds, 6ths, octaves
    
    return consonances[Math.floor(Math.random() * consonances.length)];
  }

  selectPassingTone(cfPitch, previousInterval) {
    // Stepwise motion preferred
    const direction = Math.random() > 0.5 ? 1 : -1;
    return previousInterval + direction;
  }

  createSuspension(currentNote, previousNote) {
    const suspension = [];
    const halfDur = currentNote.duration / 2;
    
    // Tied note (suspension)
    suspension.push({
      pitch: previousNote.pitch + 7, // Hold previous pitch
      start: currentNote.start,
      duration: halfDur,
      velocity: currentNote.velocity * 0.8
    });
    
    // Resolution down
    suspension.push({
      pitch: currentNote.pitch + 5, // Resolve down by step
      start: currentNote.start + halfDur,
      duration: halfDur,
      velocity: currentNote.velocity * 0.9
    });
    
    return suspension;
  }

  applyContrapuntalRules(counter, cf) {
    // Check for parallel fifths/octaves and fix
    for (let i = 1; i < counter.length; i++) {
      const interval1 = counter[i - 1].pitch - cf[i - 1].pitch;
      const interval2 = counter[i].pitch - cf[i].pitch;
      
      // Parallel fifths or octaves
      if (Math.abs(interval1) === Math.abs(interval2) && 
          (Math.abs(interval1) === 7 || Math.abs(interval1) === 12)) {
        counter[i].pitch += 2; // Adjust to avoid parallel motion
      }
    }
    
    return counter;
  }
}