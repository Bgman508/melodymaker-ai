// Euclidean Rhythm Generator - Mathematical rhythm distribution
export class EuclideanRhythm {
  constructor() {
    this.commonPatterns = {
      'tresillo': [3, 8],
      'cinquillo': [5, 8],
      'bossa-nova': [5, 16],
      'son-clave': [5, 8],
      'soukous': [7, 12],
      'west-african': [7, 16]
    };
  }

  generate(pulses, steps) {
    // Bjorklund's algorithm for even distribution
    const pattern = [];
    const counts = [];
    const remainders = [];
    
    let divisor = steps - pulses;
    remainders.push(pulses);
    
    while (remainders[remainders.length - 1] > 1) {
      counts.push(Math.floor(divisor / remainders[remainders.length - 1]));
      const temp = divisor % remainders[remainders.length - 1];
      divisor = remainders[remainders.length - 1];
      remainders.push(temp);
    }
    
    counts.push(divisor);
    
    const build = (level) => {
      if (level === -1) {
        return [0];
      } else if (level === -2) {
        return [1];
      }
      
      const output = [];
      for (let i = 0; i < counts[level]; i++) {
        output.push(...build(level - 1));
      }
      if (remainders[level] !== 0) {
        output.push(...build(level - 2));
      }
      return output;
    };
    
    return build(remainders.length - 2);
  }

  applyToTrack(pattern, startBeat, bpm, instrument) {
    const notes = [];
    const stepDuration = 4 / pattern.length; // Assuming 4 beats per bar
    
    pattern.forEach((hit, idx) => {
      if (hit === 1) {
        notes.push({
          pitch: instrument,
          start: startBeat + (idx * stepDuration),
          duration: stepDuration * 0.8,
          velocity: 100
        });
      }
    });
    
    return notes;
  }

  getNamedPattern(name) {
    const [pulses, steps] = this.commonPatterns[name] || [3, 8];
    return this.generate(pulses, steps);
  }

  visualize(pattern) {
    return pattern.map(hit => hit === 1 ? '●' : '○').join(' ');
  }

  rotate(pattern, amount) {
    const rotated = [...pattern];
    for (let i = 0; i < amount; i++) {
      rotated.push(rotated.shift());
    }
    return rotated;
  }

  invert(pattern) {
    return pattern.map(hit => 1 - hit);
  }
}