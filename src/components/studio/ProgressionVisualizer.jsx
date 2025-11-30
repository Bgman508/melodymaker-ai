import React from 'react';
import { motion } from 'framer-motion';
import ExplainMode from './ExplainMode';

const ROMAN_COLORS = {
  'I': 'bg-[var(--mint)]',
  'ii': 'bg-[var(--violet)]',
  'iii': 'bg-[var(--ice)]',
  'IV': 'bg-[var(--mint)]',
  'V': 'bg-[var(--coral)]',
  'vi': 'bg-[var(--violet)]',
  'VII': 'bg-[var(--ice)]',
  'i': 'bg-[var(--violet)]',
  'VI': 'bg-[var(--mint)]',
  'III': 'bg-[var(--ice)]'
};

export default function ProgressionVisualizer({ progression, currentChord = 0 }) {
  return (
    <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--hair)]">
      <h3 className="text-sm font-semibold text-[var(--muted)] mb-3">Chord Progression</h3>
      
      <div className="flex gap-2 flex-wrap">
        {progression.map((roman, idx) => (
          <motion.div
            key={idx}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: idx * 0.1 }}
          >
            <ExplainMode term={roman}>
              <div
                className={`
                  px-4 py-2 rounded-lg font-bold text-white
                  ${ROMAN_COLORS[roman] || 'bg-[var(--muted)]'}
                  ${currentChord === idx ? 'ring-2 ring-white scale-110' : ''}
                  transition-all
                `}
              >
                {roman}
              </div>
            </ExplainMode>
          </motion.div>
        ))}
      </div>

      <div className="mt-3 text-xs text-[var(--muted)]">
        Hover over chords to learn music theory
      </div>
    </div>
  );
}