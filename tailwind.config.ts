import type { Config } from "tailwindcss";
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1E293B',
          light: '#334155',
          dark: '#0F172A',
        },
        gold: {
          DEFAULT: '#0D9B84',
          light: '#2FBFA9',
          dark: '#087B68',
        },
        offWhite: '#F8FAFC',
        'mid-gray': '#94A3B8',
        'light-gray': '#F1F5F9',
        'dark-gray': '#334155',
      },
      fontFamily: {
        display: ['var(--font-inter)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 12px rgba(27, 45, 79, 0.08)',
        hover: '0 8px 32px rgba(27, 45, 79, 0.15)',
      },
    },
  },
  plugins: [forms, typography],
};
export default config;
