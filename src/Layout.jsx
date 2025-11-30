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
    <div className="min-h-screen daw-pro">
      <style>{`
        /* Import Premium Fonts */
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        /* Professional DAW Color System */
        :root {
          /* Core Backgrounds - Deeper, more professional */
          --bg-darkest: #06070A;
          --bg-darker: #0A0C10;
          --bg-dark: #0D1117;
          --bg-surface: #151B23;
          --bg-elevated: #1C232D;
          --bg-hover: #252D3A;
          
          /* Accent Colors - Vibrant but refined */
          --accent-primary: #00D9FF;
          --accent-primary-dim: #00A3BF;
          --accent-secondary: #7C3AED;
          --accent-tertiary: #10B981;
          --accent-warning: #F59E0B;
          --accent-danger: #EF4444;
          --accent-pink: #EC4899;
          
          /* Text Colors */
          --text-primary: #F0F6FC;
          --text-secondary: #8B949E;
          --text-tertiary: #6E7681;
          --text-disabled: #484F58;
          
          /* Borders & Lines */
          --border-subtle: rgba(255, 255, 255, 0.06);
          --border-default: rgba(255, 255, 255, 0.1);
          --border-strong: rgba(255, 255, 255, 0.16);
          
          /* Gradients */
          --gradient-primary: linear-gradient(135deg, #00D9FF 0%, #7C3AED 100%);
          --gradient-warm: linear-gradient(135deg, #F59E0B 0%, #EF4444 100%);
          --gradient-cool: linear-gradient(135deg, #10B981 0%, #00D9FF 100%);
          --gradient-surface: linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-dark) 100%);
          
          /* Shadows & Glows */
          --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.5);
          --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.5);
          --shadow-lg: 0 8px 32px rgba(0, 0, 0, 0.6);
          --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.7);
          --glow-primary: 0 0 20px rgba(0, 217, 255, 0.3);
          --glow-secondary: 0 0 20px rgba(124, 58, 237, 0.3);
          --glow-success: 0 0 20px rgba(16, 185, 129, 0.3);
          
          /* Typography */
          --font-display: 'Space Grotesk', 'Inter', sans-serif;
          --font-ui: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          --font-mono: 'JetBrains Mono', 'SF Mono', monospace;
          
          /* Spacing */
          --radius-sm: 6px;
          --radius-md: 10px;
          --radius-lg: 14px;
          --radius-xl: 20px;
          
          /* Track Colors - Professional palette */
          --track-blue: #3B82F6;
          --track-purple: #8B5CF6;
          --track-pink: #EC4899;
          --track-red: #EF4444;
          --track-orange: #F97316;
          --track-yellow: #EAB308;
          --track-green: #22C55E;
          --track-teal: #14B8A6;
          --track-cyan: #06B6D4;
        }

        /* Base Styles */
        .daw-pro {
          background: var(--bg-darkest);
          color: var(--text-primary);
          font-family: var(--font-ui);
          font-size: 13px;
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Premium Scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }

        ::-webkit-scrollbar-track {
          background: var(--bg-darker);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, var(--bg-elevated) 0%, var(--bg-surface) 100%);
          border-radius: 5px;
          border: 2px solid var(--bg-darker);
        }

        ::-webkit-scrollbar-thumb:hover {
          background: var(--bg-hover);
        }

        ::-webkit-scrollbar-corner {
          background: var(--bg-darker);
        }

        /* Transport Bar Styling */
        .transport-bar {
          background: linear-gradient(180deg, var(--bg-surface) 0%, var(--bg-dark) 100%);
          border-bottom: 1px solid var(--border-default);
          box-shadow: var(--shadow-md);
        }

        /* Track Lane Styling */
        .track-lane {
          background: var(--bg-dark);
          border-bottom: 1px solid var(--border-subtle);
          transition: background 0.15s ease;
        }

        .track-lane:hover {
          background: var(--bg-surface);
        }

        .track-lane.selected {
          background: rgba(0, 217, 255, 0.05);
          border-left: 3px solid var(--accent-primary);
        }

        /* Meter Styling */
        .meter-bar {
          background: linear-gradient(180deg, 
            var(--accent-danger) 0%, 
            var(--accent-warning) 15%,
            var(--accent-tertiary) 40%,
            var(--accent-tertiary) 100%
          );
          border-radius: 2px;
        }

        /* Playhead */
        .playhead {
          background: var(--accent-primary);
          box-shadow: var(--glow-primary), 0 0 40px rgba(0, 217, 255, 0.2);
        }

        /* Note Styling */
        .midi-note {
          border-radius: 3px;
          transition: transform 0.1s ease, box-shadow 0.1s ease;
        }

        .midi-note:hover {
          transform: scale(1.02);
          box-shadow: 0 0 12px currentColor;
        }

        .midi-note.selected {
          box-shadow: 0 0 0 2px var(--accent-warning), 0 0 20px var(--accent-warning);
        }

        /* Button Styles */
        .btn-daw {
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-weight: 500;
          transition: all 0.15s ease;
        }

        .btn-daw:hover {
          background: var(--bg-hover);
          border-color: var(--border-strong);
        }

        .btn-daw:active {
          transform: scale(0.98);
        }

        .btn-daw.active {
          background: var(--accent-primary);
          border-color: var(--accent-primary);
          color: var(--bg-darkest);
          box-shadow: var(--glow-primary);
        }

        .btn-play {
          background: var(--gradient-cool);
          border: none;
          box-shadow: var(--glow-success);
        }

        .btn-play:hover {
          filter: brightness(1.1);
          box-shadow: 0 0 30px rgba(16, 185, 129, 0.4);
        }

        .btn-stop {
          background: var(--gradient-warm);
          border: none;
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }

        /* Panel Styling */
        .panel {
          background: var(--gradient-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
        }

        .panel-header {
          background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, transparent 100%);
          border-bottom: 1px solid var(--border-subtle);
          padding: 12px 16px;
          font-weight: 600;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          color: var(--text-secondary);
        }

        /* Fader/Slider Styling */
        .fader-track {
          background: var(--bg-darkest);
          border: 1px solid var(--border-subtle);
          border-radius: 4px;
        }

        .fader-thumb {
          background: linear-gradient(180deg, #3A3F4A 0%, #2A2F38 100%);
          border: 1px solid var(--border-strong);
          border-radius: 3px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.5);
        }

        .fader-thumb:hover {
          background: linear-gradient(180deg, #4A4F5A 0%, #3A3F48 100%);
        }

        /* Knob Styling */
        .knob {
          background: radial-gradient(circle at 30% 30%, #4A4F5A 0%, #1A1F28 100%);
          border: 2px solid var(--border-strong);
          border-radius: 50%;
          box-shadow: 
            inset 0 2px 4px rgba(255,255,255,0.1),
            0 4px 12px rgba(0,0,0,0.5);
        }

        /* LED/Indicator Styling */
        .led {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--bg-darkest);
          border: 1px solid var(--border-subtle);
        }

        .led.active {
          background: var(--accent-primary);
          box-shadow: var(--glow-primary);
        }

        .led.recording {
          background: var(--accent-danger);
          box-shadow: 0 0 12px var(--accent-danger);
          animation: led-pulse 1s ease-in-out infinite;
        }

        @keyframes led-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        /* Timeline Grid */
        .timeline-grid {
          background-image: 
            linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px),
            linear-gradient(var(--border-subtle) 1px, transparent 1px);
          background-size: 25px 20px;
        }

        /* Waveform Styling */
        .waveform {
          filter: drop-shadow(0 0 8px currentColor);
        }

        /* Modal/Dialog Styling */
        .modal-backdrop {
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
        }

        .modal-content {
          background: var(--gradient-surface);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-xl);
        }

        /* Input Styling */
        .input-daw {
          background: var(--bg-darkest);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          padding: 8px 12px;
          font-family: var(--font-mono);
          transition: all 0.15s ease;
        }

        .input-daw:focus {
          outline: none;
          border-color: var(--accent-primary);
          box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
        }

        /* Tab Styling */
        .tab-list {
          background: var(--bg-darker);
          border-radius: var(--radius-md);
          padding: 4px;
        }

        .tab-trigger {
          border-radius: var(--radius-sm);
          padding: 8px 16px;
          font-weight: 500;
          color: var(--text-secondary);
          transition: all 0.15s ease;
        }

        .tab-trigger:hover {
          color: var(--text-primary);
          background: var(--bg-surface);
        }

        .tab-trigger[data-state="active"] {
          background: var(--bg-elevated);
          color: var(--text-primary);
          box-shadow: var(--shadow-sm);
        }

        /* Tooltip */
        .tooltip {
          background: var(--bg-elevated);
          border: 1px solid var(--border-default);
          border-radius: var(--radius-sm);
          padding: 6px 10px;
          font-size: 11px;
          box-shadow: var(--shadow-md);
        }

        /* Selection */
        ::selection {
          background: rgba(0, 217, 255, 0.3);
          color: white;
        }

        /* Focus Visible */
        *:focus-visible {
          outline: 2px solid var(--accent-primary);
          outline-offset: 2px;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: var(--glow-primary); }
          50% { box-shadow: 0 0 40px rgba(0, 217, 255, 0.5); }
        }

        .animate-fade-in {
          animation: fadeIn 0.2s ease;
        }

        .animate-slide-up {
          animation: slideUp 0.3s ease;
        }

        /* Sonner Toast Overrides */
        [data-sonner-toast] {
          background: var(--bg-elevated) !important;
          border: 1px solid var(--border-default) !important;
          color: var(--text-primary) !important;
          box-shadow: var(--shadow-lg) !important;
        }

        [data-sonner-toast][data-type="success"] {
          border-color: var(--accent-tertiary) !important;
        }

        [data-sonner-toast][data-type="error"] {
          border-color: var(--accent-danger) !important;
        }
      `}</style>

      {children}
    </div>
  );
}