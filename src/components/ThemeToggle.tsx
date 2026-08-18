'use client';

import { useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  });

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('tm-theme', next);
  };

  return (
    <button
      onClick={toggle}
      suppressHydrationWarning
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="w-8 h-8 flex items-center justify-center rounded-md border border-tm-border hover:border-tm-border-hover text-tm-muted hover:text-tm-heading transition-colors text-sm"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}
