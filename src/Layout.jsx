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

        body {
          background: var(--bg);
          color: var(--text);
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 14px;
          -webkit-font-smoothing: antialiased;
        }

        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }

        button {
          font-family: 'Inter', sans-serif;
        }

        .btn-icon {
          width: 36px;
          height: 36px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          color: var(--text-muted);
          transition: all 0.1s;
          cursor: pointer;
        }
        .btn-icon:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text);
        }
        .btn-icon.active {
          background: var(--accent);
          color: white;
        }

        .play-btn {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--accent);
          border: none;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          cursor: pointer;
        }
        .play-btn:hover {
          background: var(--accent-hover);
          transform: scale(1.05);
        }
        .play-btn:active {
          transform: scale(0.98);
        }

        input, textarea {
          font-family: 'Inter', sans-serif;
        }

        ::selection {
          background: rgba(124, 58, 237, 0.3);
        }
      `}</style>

      {children}
    </div>
  );
}