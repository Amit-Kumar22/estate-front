'use client';

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg
        text-gray-600 dark:text-gray-400
        hover:text-green-600 hover:bg-green-100
        dark:hover:text-white dark:hover:bg-white/10
        border border-transparent hover:border-green-200 dark:hover:border-transparent
        transition-all duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
