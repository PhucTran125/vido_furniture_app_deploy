import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1A1A1A',
        secondary: '#4A4A4A',
        accent: '#F39200',
        background: '#F5F5F5',
        surface: '#FFFFFF',
        'soft-pink': '#E8DCCA',
        'soft-teal': '#3B5F60',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        heading: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
