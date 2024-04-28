'use client';
import ThemeContext from '@/context/theme-context';
import React, { useContext } from 'react';

const ToggleTheme: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button
      id="toggle"
      onClick={toggleTheme}
      className="right-5 top-5 px-2 py-1 text-4xl font-semibold text-white"
    >
      {theme === 'dark' ? '😎' : '😊'}
    </button>
  );
};
export default ToggleTheme;
