import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#e6edff',
          200: '#c0d4ff',
          300: '#9ab9ff',
          400: '#4f82ff',
          500: '#0369a1', // Deep blue
          600: '#0369a1',
          700: '#0369a1',
          800: '#075e8c',
          900: '#0a4d70',
        },
        secondary: {
          500: '#6b21a8', // Purple
          600: '#581c87',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [react(), tailwindcss()],
})
