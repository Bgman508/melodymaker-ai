import React, { useEffect } from 'react';

export default function Layout({ children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        const playButton = document.querySelector('[data-action="play"]');
        if (playButton) playButton.click();
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const paletteButton = document.querySelector('[data-action="command-palette"]');
        if (paletteButton) paletteButton.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen daw-ultimate">
      <style>{`
        /* Suno-Grade Design System */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        :root {
          /* Minimal Dark Palette */
          --void: #0A0A0A;
          --deep: #121212;
          --surface: #1A1A1A;
          --elevated: #222222;
          --raised: #2A2A2A;
          --hover: #333333;
          
          /* Refined Accent Palette */
          --primary: #8B5CF6;
          --primary-light: #A78BFA;
          --secondary: #10B981;
          --accent: #06B6D4;
          --warning: #F59E0B;
          --danger: #EF4444;
          
          /* Text Hierarchy */
          --text-primary: #FFFFFF;
          --text-secondary: #A1A1AA;
          --text-tertiary: #71717A;
          --text-disabled: #52525B;
          
          /* Borders & Dividers */
          --border: rgba(255, 255, 255, 0.08);
          --border-strong: rgba(255, 255, 255, 0.12);
          --divider: rgba(255, 255, 255, 0.06);
          
          /* Shadows */
          --shadow-sm: 0 1px 2px rgba(0,0,0,0.5);
          --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
          --shadow-lg: 0 8px 24px rgba(0,0,0,0.5);
          --shadow-xl: 0 12px 40px rgba(0,0,0,0.6);
          
          /* Typography */
          --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono: 'JetBrains Mono', 'Courier New', monospace;
          
          /* Radius */
          --radius-sm: 6px;
          --radius-md: 8px;
          --radius-lg: 12px;
          --radius-xl: 16px;
        }

        /* Base */
        .daw-ultimate {
          background: var(--void);
          color: var(--text-primary);
          font-family: var(--font-sans);
          font-size: 14px;
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          letter-spacing: -0.01em;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: var(--abyss);
        }
        ::-webkit-scrollbar-thumb {
          background: var(--raised);
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: var(--hover);
        }
        ::-webkit-scrollbar-corner {
          background: var(--abyss);
        }

        /* Glass Effect */
        .glass {
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%);
          backdrop-filter: blur(20px);
          border: 1px solid var(--border-dim);
        }

        /* Neon Glow Buttons */
        .btn-neon {
          position: relative;
          background: var(--raised);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .btn-neon:hover {
          background: var(--hover);
          border-color: var(--border-bright);
          transform: translateY(-1px);
        }
        .btn-neon:active {
          transform: translateY(0) scale(0.98);
        }
        .btn-neon.active {
          background: var(--neon-cyan);
          border-color: var(--neon-cyan);
          color: var(--void);
          box-shadow: var(--glow-cyan);
        }

        /* Minimal Transport Controls */
        .transport-btn {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--elevated);
          border: none;
          color: var(--text-secondary);
          transition: all 0.12s ease;
        }
        .transport-btn:hover {
          background: var(--raised);
          color: var(--text-primary);
        }
        .transport-btn:active {
          transform: scale(0.96);
        }
        .transport-btn.play {
          width: 56px;
          height: 56px;
          background: var(--primary);
          color: white;
          box-shadow: var(--shadow-md);
        }
        .transport-btn.play:hover {
          background: var(--primary-light);
          box-shadow: var(--shadow-lg);
        }

        /* Meter Styling */
        .meter-gradient {
          background: linear-gradient(0deg, 
            var(--neon-green) 0%, 
            var(--neon-green) 60%,
            var(--neon-yellow) 75%,
            var(--neon-orange) 85%,
            var(--neon-red) 100%
          );
        }

        /* Track Lane */
        .track-lane {
          background: var(--deep);
          border-bottom: 1px solid var(--border-subtle);
          transition: all 0.15s ease;
        }
        .track-lane:hover {
          background: var(--surface);
        }
        .track-lane.selected {
          background: rgba(0, 240, 255, 0.03);
          border-left: 3px solid var(--neon-cyan);
        }

        /* Note Styling */
        .midi-note {
          border-radius: 4px;
          transition: all 0.15s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .midi-note:hover {
          transform: scaleY(1.1);
          filter: brightness(1.2);
          z-index: 10;
        }
        .midi-note.selected {
          box-shadow: 0 0 0 2px var(--neon-yellow), var(--shadow-md);
        }

        /* Playhead */
        .playhead {
          background: var(--neon-cyan);
          box-shadow: var(--glow-cyan), 0 0 60px rgba(0, 240, 255, 0.2);
        }

        /* Fader */
        .fader-track {
          background: var(--abyss);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
        }
        .fader-fill {
          background: var(--grad-neon);
          border-radius: 4px;
          box-shadow: var(--glow-cyan);
        }
        .fader-thumb {
          background: linear-gradient(180deg, #4A4A5A 0%, #2A2A38 100%);
          border: 1px solid var(--border-bright);
          border-radius: 4px;
          box-shadow: var(--shadow-md);
        }

        /* Knob */
        .knob {
          background: conic-gradient(from 135deg, var(--raised) 0%, var(--elevated) 50%, var(--raised) 100%);
          border: 2px solid var(--border-default);
          border-radius: 50%;
          box-shadow: var(--shadow-md), inset 0 1px 0 rgba(255,255,255,0.1);
        }

        /* Panel */
        .panel {
          background: var(--grad-surface);
          border: 1px solid var(--border-dim);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }
        .panel-header {
          background: var(--grad-glass);
          border-bottom: 1px solid var(--border-subtle);
          padding: 12px 16px;
        }

        /* LED */
        .led {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--text-disabled);
          transition: all 0.15s ease;
        }
        .led.on {
          background: var(--neon-green);
          box-shadow: 0 0 8px var(--neon-green);
        }
        .led.recording {
          background: var(--neon-red);
          box-shadow: 0 0 12px var(--neon-red);
          animation: pulse-led 0.8s ease-in-out infinite;
        }

        @keyframes pulse-led {
          0%, 100% { opacity: 1; box-shadow: 0 0 12px var(--neon-red); }
          50% { opacity: 0.6; box-shadow: 0 0 4px var(--neon-red); }
        }

        /* VU Meter Animation */
        @keyframes vu-bounce {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.95); }
        }

        /* Waveform glow */
        .waveform {
          filter: drop-shadow(0 0 6px currentColor);
        }

        /* Selection */
        ::selection {
          background: rgba(0, 240, 255, 0.3);
          color: white;
        }

        /* Focus */
        *:focus-visible {
          outline: 2px solid var(--neon-cyan);
          outline-offset: 2px;
        }

        /* Input */
        .input-daw {
          background: var(--abyss);
          border: 1px solid var(--border-dim);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-family: var(--font-mono);
          transition: all 0.15s ease;
        }
        .input-daw:focus {
          border-color: var(--neon-cyan);
          box-shadow: 0 0 0 3px rgba(0, 240, 255, 0.1);
          outline: none;
        }

        /* Animations */
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px currentColor); }
          50% { filter: drop-shadow(0 0 16px currentColor); }
        }

        .animate-fade { animation: fade-in 0.2s ease; }
        .animate-slide { animation: slide-up 0.3s ease; }
        .animate-glow { animation: glow-pulse 2s ease-in-out infinite; }

        /* Toasts */
        [data-sonner-toast] {
          background: var(--elevated) !important;
          border: 1px solid var(--border-default) !important;
          color: var(--text-primary) !important;
          box-shadow: var(--shadow-lg) !important;
          font-family: var(--font-ui) !important;
        }
        [data-sonner-toast][data-type="success"] {
          border-color: var(--neon-green) !important;
        }
        [data-sonner-toast][data-type="error"] {
          border-color: var(--neon-red) !important;
        }

        /* Tabs */
        [data-state="active"] {
          background: var(--elevated) !important;
        }

        /* Slider overrides */
        [role="slider"] {
          background: var(--neon-cyan) !important;
        }
      `}</style>

      {children}
    </div>
  );
}