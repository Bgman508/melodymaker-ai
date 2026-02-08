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
        /* Professional DAW Design System - Suno Grade */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800;900&display=swap');

        :root {
          /* Ultra-Dark Premium Palette */
          --void: #000000;
          --abyss: #0A0A0F;
          --deep: #0F0F14;
          --surface: #141419;
          --elevated: #1A1A21;
          --raised: #20202A;
          --hover: #282833;
          --active: #30303D;
          
          /* Premium Neon Palette */
          --neon-cyan: #00FFFF;
          --neon-blue: #5E7CFF;
          --neon-purple: #A855FF;
          --neon-pink: #FF3D9F;
          --neon-green: #00FFA3;
          --neon-orange: #FF9D00;
          --neon-red: #FF3F5F;
          --neon-yellow: #FFE500;
          
          /* Accent Gradients */
          --accent-1: linear-gradient(135deg, #00FFFF 0%, #5E7CFF 100%);
          --accent-2: linear-gradient(135deg, #A855FF 0%, #FF3D9F 100%);
          --accent-3: linear-gradient(135deg, #00FFA3 0%, #00FFFF 100%);
          --accent-4: linear-gradient(135deg, #FF9D00 0%, #FF3F5F 100%);
          
          /* Text */
          --text-bright: #FFFFFF;
          --text-primary: #E8E8ED;
          --text-secondary: #9898A6;
          --text-tertiary: #5C5C6E;
          --text-disabled: #3A3A48;
          
          /* Borders */
          --border-subtle: rgba(255, 255, 255, 0.04);
          --border-dim: rgba(255, 255, 255, 0.08);
          --border-default: rgba(255, 255, 255, 0.12);
          --border-bright: rgba(255, 255, 255, 0.2);
          
          /* Gradients */
          --grad-neon: linear-gradient(135deg, var(--neon-cyan) 0%, var(--neon-purple) 100%);
          --grad-fire: linear-gradient(135deg, var(--neon-orange) 0%, var(--neon-red) 100%);
          --grad-nature: linear-gradient(135deg, var(--neon-green) 0%, var(--neon-cyan) 100%);
          --grad-sunset: linear-gradient(135deg, var(--neon-pink) 0%, var(--neon-orange) 100%);
          --grad-surface: linear-gradient(180deg, var(--surface) 0%, var(--abyss) 100%);
          --grad-glass: linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%);
          
          /* Shadows & Glows */
          --shadow-sm: 0 2px 4px rgba(0,0,0,0.4);
          --shadow-md: 0 4px 16px rgba(0,0,0,0.5);
          --shadow-lg: 0 8px 32px rgba(0,0,0,0.6);
          --shadow-xl: 0 16px 64px rgba(0,0,0,0.7);
          --glow-cyan: 0 0 24px rgba(0, 240, 255, 0.35);
          --glow-purple: 0 0 24px rgba(157, 92, 255, 0.35);
          --glow-green: 0 0 24px rgba(0, 255, 148, 0.35);
          --glow-red: 0 0 24px rgba(255, 71, 87, 0.35);
          
          /* Typography */
          --font-display: 'Outfit', sans-serif;
          --font-ui: 'Inter', -apple-system, sans-serif;
          --font-mono: 'JetBrains Mono', monospace;
          
          /* Spacing & Radius */
          --radius-xs: 4px;
          --radius-sm: 6px;
          --radius-md: 10px;
          --radius-lg: 14px;
          --radius-xl: 20px;
          --radius-2xl: 28px;
        }

        /* Base */
        .daw-ultimate {
          background: var(--void);
          color: var(--text-primary);
          font-family: var(--font-ui);
          font-size: 13px;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow: hidden;
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

        /* Professional Transport Controls */
        .transport-btn {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--elevated);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-secondary);
          transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .transport-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%);
          opacity: 0;
          transition: opacity 0.15s;
        }
        .transport-btn:hover::before {
          opacity: 1;
        }
        .transport-btn:hover {
          background: var(--raised);
          color: var(--text-bright);
          border-color: rgba(255,255,255,0.15);
          transform: translateY(-1px);
        }
        .transport-btn:active {
          transform: translateY(0) scale(0.98);
        }
        .transport-btn.play {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: linear-gradient(135deg, #00FFA3 0%, #00FFFF 100%);
          border: none;
          color: #000;
          box-shadow: 0 8px 32px rgba(0,255,163,0.4), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .transport-btn.play:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 48px rgba(0,255,163,0.5), inset 0 1px 0 rgba(255,255,255,0.3);
        }
        .transport-btn.stop {
          background: linear-gradient(135deg, #FF3F5F 0%, #FF6B7A 100%);
          border: none;
          color: white;
          box-shadow: 0 4px 16px rgba(255,63,95,0.3);
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