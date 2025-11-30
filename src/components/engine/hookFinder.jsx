// Hook Finder - Identifies most memorable melodic sections
export class HookFinder {
  constructor() {
    this.hookCriteria = {
      repetition: 0.3,
      rhythmicInterest: 0.25,
      melodicContour: 0.25,
      simplicity: 0.2
    };
  }

  analyzeComposition(tracks) {
    const melodyTrack = tracks.find(t => t.type === 'melody');
    if (!melodyTrack) return null;

    const phrases = this.segmentIntoPhrases(melodyTrack.notes);
    const scores = phrases.map(phrase => this.scorePhraseAsHook(phrase, phrases));
    
    const bestIdx = scores.indexOf(Math.max(...scores));
    return {
      phrase: phrases[bestIdx],
      score: scores[bestIdx],
      startBeat: phrases[bestIdx][0].start,
      endBeat: phrases[bestIdx][phrases[bestIdx].length - 1].start + 
               phrases[bestIdx][phrases[bestIdx].length - 1].duration,
      analysis: this.getHookAnalysis(phrases[bestIdx])
    };
  }

  segmentIntoPhrases(notes, phraseLength = 8) {
    const phrases = [];
    const sortedNotes = [...notes].sort((a, b) => a.start - b.start);
    
    for (let i = 0; i < sortedNotes.length; i += phraseLength) {
      const phrase = sortedNotes.slice(i, i + phraseLength);
      if (phrase.length >= phraseLength / 2) {
        phrases.push(phrase);
      }
    }
    
    return phrases;
  }

  scorePhraseAsHook(phrase, allPhrases) {
    let score = 0;
    
    // Repetition score
    const repetitions = this.countRepetitions(phrase, allPhrases);
    score += (repetitions / allPhrases.length) * this.hookCriteria.repetition;
    
    // Rhythmic interest
    const rhythmScore = this.analyzeRhythmicInterest(phrase);
    score += rhythmScore * this.hookCriteria.rhythmicInterest;
    
    // Melodic contour (stepwise motion, memorable shape)
    const contourScore = this.analyzeMelodicContour(phrase);
    score += contourScore * this.hookCriteria.melodicContour;
    
    // Simplicity (hooks are usually simple)
    const simplicityScore = this.analyzeSimplicity(phrase);
    score += simplicityScore * this.hookCriteria.simplicity;
    
    return score;
  }

  countRepetitions(phrase, allPhrases) {
    const pitchSequence = phrase.map(n => n.pitch).join(',');
    return allPhrases.filter(p => 
      p.map(n => n.pitch).join(',') === pitchSequence
    ).length;
  }

  analyzeRhythmicInterest(phrase) {
    const durations = phrase.map(n => n.duration);
    const uniqueDurations = new Set(durations).size;
    const syncopation = this.detectSyncopation(phrase);
    return (uniqueDurations / phrase.length + syncopation) / 2;
  }

  detectSyncopation(phrase) {
    let syncopated = 0;
    phrase.forEach(note => {
      const beatPosition = note.start % 1;
      if (beatPosition !== 0 && beatPosition !== 0.5) {
        syncopated++;
      }
    });
    return syncopated / phrase.length;
  }

  analyzeMelodicContour(phrase) {
    const intervals = [];
    for (let i = 1; i < phrase.length; i++) {
      intervals.push(Math.abs(phrase[i].pitch - phrase[i - 1].pitch));
    }
    
    const stepwiseMotion = intervals.filter(i => i <= 2).length / intervals.length;
    const hasClimax = this.hasClimax(phrase);
    
    return (stepwiseMotion * 0.6 + (hasClimax ? 0.4 : 0));
  }

  hasClimax(phrase) {
    const pitches = phrase.map(n => n.pitch);
    const maxPitch = Math.max(...pitches);
    const maxIdx = pitches.indexOf(maxPitch);
    // Climax should be in middle third
    return maxIdx > phrase.length / 3 && maxIdx < (phrase.length * 2) / 3;
  }

  analyzeSimplicity(phrase) {
    const uniquePitches = new Set(phrase.map(n => n.pitch)).size;
    const avgDuration = phrase.reduce((sum, n) => sum + n.duration, 0) / phrase.length;
    
    return (1 - (uniquePitches / phrase.length)) * 0.5 + 
           (avgDuration > 0.25 ? 0.5 : 0.3);
  }

  getHookAnalysis(phrase) {
    return {
      noteCount: phrase.length,
      uniquePitches: new Set(phrase.map(n => n.pitch)).size,
      avgDuration: phrase.reduce((sum, n) => sum + n.duration, 0) / phrase.length,
      pitchRange: Math.max(...phrase.map(n => n.pitch)) - Math.min(...phrase.map(n => n.pitch))
    };
  }
}