import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        dark: {
          bg: '#0a0a0a',
          card: '#111111',
          border: '#1f1f1f',
          text: '#e5e7eb',
          muted: '#6b7280',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'gradient-green': 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #14532d 100%)',
        'gradient-dark': 'linear-gradient(135deg, #111111 0%, #0a0a0a 100%)',
        'hero-overlay': 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'scroll': 'scroll 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      boxShadow: {
        'green-sm':    '0 2px 8px rgba(22, 163, 74, 0.12)',
        'green':       '0 4px 16px rgba(22, 163, 74, 0.18)',
        'green-md':    '0 6px 24px rgba(22, 163, 74, 0.22)',
        'green-lg':    '0 8px 32px rgba(22, 163, 74, 0.28)',
        'green-xl':    '0 12px 48px rgba(22, 163, 74, 0.35)',
        'navbar':      '0 2px 20px rgba(22, 163, 74, 0.15)',
        'btn-green':   '0 4px 14px rgba(22, 163, 74, 0.40)',
        'btn-green-lg':'0 6px 20px rgba(22, 163, 74, 0.50)',
        'premium':     '0 4px 40px rgba(22, 163, 74, 0.20)',
        'card':        '0 2px 12px rgba(22, 163, 74, 0.08)',
        'card-hover':  '0 8px 32px rgba(22, 163, 74, 0.20)',
        'card-dark':   '0 2px 20px rgba(0, 0, 0, 0.4)',
        'glow':        '0 0 40px rgba(22, 163, 74, 0.30)',
        'glow-lg':     '0 0 60px rgba(22, 163, 74, 0.40)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
