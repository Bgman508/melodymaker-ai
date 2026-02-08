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
    <div className="h-full flex flex-col-reverse overflow-hidden" style={{ background: '#0B0B0F' }}>
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
                ? 'bg-[#E8E8ED] hover:bg-[#D8D8E3] text-[#111116] border-b border-white/10' 
                : 'bg-[#18181F] hover:bg-[#1F1F28] text-[#5C5C6E] border-b border-white/5'
              }
              ${isC ? 'border-b-2 border-[#00F0FF]' : ''}
            `}
            style={{ flex: 1, minHeight: '1px' }}
            onMouseDown={() => handleMouseDown(midiNote)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {isC && <span className="text-[#00F0FF] font-bold">C{octave}</span>}
          </div>
        );
      })}
    </div>
  );
}