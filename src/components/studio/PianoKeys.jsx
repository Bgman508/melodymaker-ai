import React from 'react';

export default function PianoKeys({ startNote = 24, endNote = 108, onNotePlay, onNoteStop }) {
  const noteRange = endNote - startNote;
  const whiteKeys = [0, 2, 4, 5, 7, 9, 11];
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  const handleMouseDown = (midiNote) => {
    onNotePlay?.(midiNote);
  };

  const handleMouseUp = () => {
    onNoteStop?.();
  };

  return (
    <div className="h-full flex flex-col-reverse overflow-hidden" style={{ background: '#1A1A1A' }}>
      {Array.from({ length: noteRange }, (_, i) => {
        const midiNote = startNote + i;
        const noteInOctave = midiNote % 12;
        const octave = Math.floor(midiNote / 12) - 1;
        const isWhite = whiteKeys.includes(noteInOctave);
        const isC = noteInOctave === 0;
        const noteName = noteNames[noteInOctave];

        return (
          <div
            key={midiNote}
            className={`
              flex items-center justify-end pr-2 text-[9px] cursor-pointer transition-all
              ${isWhite 
                ? 'bg-[#E5E5E5] hover:bg-[#D5D5D5] text-black/60 border-b border-black/10' 
                : 'bg-[#222] hover:bg-[#2A2A2A] text-white/30 border-b border-white/5'
              }
              ${isC ? 'border-b border-[#7C3AED]' : ''}
            `}
            style={{ flex: 1, minHeight: '1px' }}
            onMouseDown={() => handleMouseDown(midiNote)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {isC && <span className="font-semibold" style={{ color: isWhite ? '#52525B' : '#A1A1AA' }}>C{octave}</span>}
          </div>
        );
      })}
    </div>
  );
}