'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isLight = theme === 'light';

  return (
    <button
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-xs font-bold text-white transition hover:bg-white/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
      title="Toggle dark mode"
      aria-label="Toggle dark mode"
    >
      {isLight ? 'MO' : 'SU'}
    </button>
  );
}
