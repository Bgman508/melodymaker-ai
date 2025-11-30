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
    <div className="h-full bg-[#0D1117] flex flex-col-reverse overflow-hidden">
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
              flex items-center justify-end pr-1 text-[8px] font-mono cursor-pointer transition-all
              ${isWhite 
                ? 'bg-[#F0F6FC] hover:bg-[#E1E8F0] text-[#1C232D] border-b border-[#D0D7DE]' 
                : 'bg-[#1C232D] hover:bg-[#252D3A] text-[#8B949E] border-b border-[#0D1117]'
              }
              ${isC ? 'border-b-2 border-[#00D9FF]' : ''}
            `}
            style={{ flex: 1, minHeight: '1px' }}
            onMouseDown={() => handleMouseDown(midiNote)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {isC && <span className="text-[#00D9FF] font-bold">C{octave}</span>}
          </div>
        );
      })}
    </div>
  );
}