'use client';
import { useState, useMemo, useEffect } from 'react';
import ThemeContext from './theme-context';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(
    localStorage?.getItem('theme')
      ? localStorage.getItem('theme') == 'dark'
        ? 'dark'
        : 'light'
      : window.matchMedia('(prefers-color-scheme: dark)')
        ? 'dark'
        : 'light',
  );

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');

    const applyTheme = (theme: string) => {
      setTheme(theme);
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
    };

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
    };

    // Set the initial theme based on storage or system preference
    if (storedTheme) {
      applyTheme(storedTheme);
    } else {
      applyTheme(prefersDark.matches ? 'dark' : 'light');
    }

    // Event listener for changes in the system theme
    prefersDark.addEventListener('change', handleSystemThemeChange);

    // Clean up the event listener
    return () => {
      prefersDark.removeEventListener('change', handleSystemThemeChange);
    };
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
