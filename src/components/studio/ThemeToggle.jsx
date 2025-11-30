import React, { useState, useEffect } from 'react';
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme) => {
    const root = document.documentElement;
    
    if (newTheme === 'light') {
      root.style.setProperty('--bg', '#FFFFFF');
      root.style.setProperty('--surface', '#F8F9FA');
      root.style.setProperty('--surface-2', '#E9ECEF');
      root.style.setProperty('--text', '#0A0B0E');
      root.style.setProperty('--muted', '#6C757D');
    } else {
      root.style.setProperty('--bg', '#0A0B0E');
      root.style.setProperty('--surface', '#101217');
      root.style.setProperty('--surface-2', '#151924');
      root.style.setProperty('--text', '#EAF2F1');
      root.style.setProperty('--muted', '#9FA8B3');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className="h-8 w-8 p-0"
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-[var(--mint)]" />
      ) : (
        <Moon className="w-4 h-4 text-[var(--violet)]" />
      )}
    </Button>
  );
}