import React, { useEffect, useState } from 'react';

export default function Confetti({ active, duration = 3000 }) {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      const colors = ['var(--mint)', 'var(--violet)', 'var(--ice)', 'var(--coral)'];
      const newParticles = [];
      
      for (let i = 0; i < 30; i++) {
        newParticles.push({
          id: i,
          left: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 500,
          duration: 2000 + Math.random() * 1000
        });
      }
      
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [active, duration]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti"
          style={{
            left: `${particle.left}%`,
            top: '-20px',
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}ms`,
            animationDuration: `${particle.duration}ms`
          }}
        />
      ))}
    </div>
  );
}