'use client';
import ThemeContext from '@/context/theme-context';
import React, { useContext } from 'react';

const ToggleTheme: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button id="toggle" onClick={toggleTheme} className={className}>
      {theme === 'dark' ? '😎' : '😊'}
    </button>
  );
};
export default ToggleTheme;
