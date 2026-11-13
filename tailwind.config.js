/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: {
          main: '#141414',
          card: '#18181a',
          'card-hover': '#1f1f23',
          pill: '#1c1c1f',
          'pill-active': '#26262a',
          border: 'rgba(255, 255, 255, 0.07)',
          'border-active': 'rgba(91, 156, 255, 0.4)'
        },
        accent: {
          DEFAULT: '#5B9CFF',
          hover: '#7ab0ff',
          dim: 'rgba(91, 156, 255, 0.15)',
          glow: 'rgba(91, 156, 255, 0.4)',
          subtle: 'rgba(91, 156, 255, 0.08)',
          dark: '#3077e6'
        }
      },
      fontFamily: {
        sans: ['"Google Sans"', 'Poppins', 'system-ui', '-apple-system', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'monospace']
      },
      boxShadow: {
        'glow-accent': '0 0 50px -10px rgba(91, 156, 255, 0.5)',
        'glow-accent-lg': '0 0 80px -15px rgba(91, 156, 255, 0.65)',
        'glow-inner': 'inset 0 0 20px 0 rgba(91, 156, 255, 0.25)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ripple': 'ripple 2.4s cubic-bezier(0, 0.2, 0.8, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(0.985)' },
        },
        ripple: {
          '0%': { transform: 'scale(0.92)', opacity: '0.8' },
          '100%': { transform: 'scale(1.35)', opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
