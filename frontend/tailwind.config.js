/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f8f9fa',
        primary: {
          DEFAULT: '#4338ca',
          hover: '#3730a3',
          subtle: '#e0e7ff',
        },
        verified: {
          DEFAULT: '#0f766e',
          bg: '#f0fdf4',
          border: '#bbf7d0',
        },
        warning: {
          DEFAULT: '#b45309',
          bg: '#fffbeb',
          border: '#fde68a',
        },
        danger: {
          DEFAULT: '#b91c1c',
          bg: '#fef2f2',
          border: '#fecaca',
        },
        slate: {
          ink: '#0f172a',
          secondary: '#475569',
          muted: '#64748b',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
