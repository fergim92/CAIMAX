'use client';
import { useState, useMemo, useEffect } from 'react';
import ThemeContext from './theme-context';

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState('dark');
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    const storedTheme = localStorage.getItem('theme');

    const applyTheme = (theme: string) => {
      setTheme(theme);
      localStorage.setItem('theme', theme);
      document.documentElement.classList.toggle('dark', theme === 'dark');
      setThemeLoaded(true);
    };

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      setThemeLoaded(true);
    };

    // Set the initial theme based on storage or system preference
    if (storedTheme) {
      applyTheme(storedTheme);
      setThemeLoaded(true);
    } else {
      applyTheme(prefersDark.matches ? 'dark' : 'light');
      setThemeLoaded(true);
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

  const contextValue = useMemo(
    () => ({ theme, themeLoaded, toggleTheme }),
    [theme],
  );
  return (
    <ThemeContext.Provider value={contextValue}>
      {themeLoaded ? children : null}
    </ThemeContext.Provider>
  );
};
