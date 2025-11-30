import React, { useState, useEffect } from 'react';
import { Flame } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgressStreak() {
  const [streak, setStreak] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const lastVisit = localStorage.getItem('lastVisit');
    const streakCount = parseInt(localStorage.getItem('streakCount') || '0');
    const today = new Date().toDateString();

    if (lastVisit === today) {
      setStreak(streakCount);
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastVisit === yesterday.toDateString()) {
        // Continuing streak
        const newStreak = streakCount + 1;
        setStreak(newStreak);
        localStorage.setItem('streakCount', newStreak.toString());
        
        if (newStreak % 7 === 0) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 3000);
        }
      } else {
        // Reset streak
        setStreak(1);
        localStorage.setItem('streakCount', '1');
      }
      
      localStorage.setItem('lastVisit', today);
    }
  }, []);

  if (streak === 0) return null;

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--coral)] to-[var(--mint)] text-white text-sm font-semibold"
    >
      <Flame className="w-4 h-4" />
      <span>{streak} day streak</span>
      
      {showCelebration && (
        <motion.span
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className="ml-1"
        >
          🎉
        </motion.span>
      )}
    </motion.div>
  );
}