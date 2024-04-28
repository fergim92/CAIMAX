'use client';
import { createContext } from 'react';

const ThemeContext = createContext({
  theme: '',
  toggleTheme: () => {},
});

export default ThemeContext;
