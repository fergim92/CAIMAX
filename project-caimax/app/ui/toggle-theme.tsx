'use client';
import ThemeContext from '@/context/theme-context';
import React, { useContext } from 'react';

const ToggleTheme: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      id="toggle"
      onClick={toggleTheme}
      className="px-5 text-4xl font-semibold"
    >
      {theme === 'dark' ? '😎' : '😊'}
    </button>
  );
};
export default ToggleTheme;
