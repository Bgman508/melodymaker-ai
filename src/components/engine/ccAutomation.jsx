// CC Automation - Control Change message automation
export class CCAutomation {
  constructor() {
    this.ccTypes = {
      1: 'Modulation',
      7: 'Volume',
      10: 'Pan',
      11: 'Expression',
      64: 'Sustain Pedal',
      71: 'Resonance',
      74: 'Brightness',
      91: 'Reverb',
      93: 'Chorus'
    };
  }

  generateAutomation(ccNumber, startBeat, endBeat, startValue, endValue, curve = 'linear') {
    const points = [];
    const steps = Math.ceil((endBeat - startBeat) * 4); // 4 points per beat
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const time = startBeat + (t * (endBeat - startBeat));
      const value = this.interpolate(startValue, endValue, t, curve);
      
      points.push({
        time,
        cc: ccNumber,
        value: Math.round(value)
      });
    }
    
    return points;
  }

  interpolate(start, end, t, curve) {
    switch (curve) {
      case 'linear':
        return start + (end - start) * t;
      case 'exponential':
        return start + (end - start) * Math.pow(t, 2);
      case 'logarithmic':
        return start + (end - start) * Math.sqrt(t);
      case 'sine':
        return start + (end - start) * Math.sin(t * Math.PI / 2);
      default:
        return start + (end - start) * t;
    }
  }

  createFilterSweep(startBeat, endBeat) {
    return this.generateAutomation(74, startBeat, endBeat, 0, 127, 'exponential');
  }

  createVolumeSwell(startBeat, duration) {
    return this.generateAutomation(11, startBeat, startBeat + duration, 0, 127, 'logarithmic');
  }

  createAutoPan(startBeat, bars, speed = 1) {
    const points = [];
    const duration = bars * 4;
    const steps = Math.floor(duration * speed * 2);
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const time = startBeat + (t * duration);
      const value = Math.round(64 + 63 * Math.sin(t * Math.PI * 2 * speed));
      
      points.push({ time, cc: 10, value });
    }
    
    return points;
  }

  createBreathingEffect(startBeat, bars) {
    // Subtle expression automation for organic feel
    const points = [];
    const duration = bars * 4;
    const steps = Math.floor(duration * 4);
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const time = startBeat + (t * duration);
      const value = Math.round(90 + 20 * Math.sin(t * Math.PI * 4) + Math.random() * 10);
      
      points.push({ time, cc: 11, value: Math.min(127, Math.max(0, value)) });
    }
    
    return points;
  }

  applyCCToTrack(track, automationPoints) {
    return {
      ...track,
      ccAutomation: automationPoints
    };
  }
}