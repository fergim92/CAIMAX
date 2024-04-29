import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        green: {
          '50': '#e5ffe4',
          '100': '#c5ffc4',
          '200': '#91ff90',
          '300': '#50ff55',
          '400': '#00ff11',
          '500': '#00e615',
          '600': '#00b816',
          '700': '#008b11',
          '800': '#076d14',
          '900': '#0b5c17',
          '950': '#00340a',
        },
      },
      darkBackground: '#1A1A2E', // Fondo oscuro
      lightBackground: '#FFFFFF', // Fondo claro
      darkText: '#E6E6E6', // Texto oscuro
      lightText: '#333333', // Texto claro
    },
    keyframes: {
      shimmer: {
        '100%': {
          transform: 'translateX(100%)',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
  darkMode: 'class',
};
export default config;
