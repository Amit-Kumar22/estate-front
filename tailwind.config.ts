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
        // Brand green — retuned from Tailwind's default `green` to the exact
        // hue sampled from the logo (#008c3d). Overriding the built-in scale
        // (rather than just `primary`, which the codebase doesn't reference)
        // means every existing `bg-green-600`, `text-green-500`, etc. across
        // the site automatically picks up the logo-accurate tone.
        green: {
          50:  '#eefcf4',
          100: '#d9f7e6',
          200: '#b3efcd',
          300: '#7ee7ac',
          400: '#30e880',
          500: '#00cc58',
          600: '#008c3d',
          700: '#007031',
          800: '#025a28',
          900: '#04441f',
          950: '#032612',
        },
        primary: {
          50: '#eefcf4',
          100: '#d9f7e6',
          200: '#b3efcd',
          300: '#7ee7ac',
          400: '#30e880',
          500: '#00cc58',
          600: '#008c3d',
          700: '#007031',
          800: '#025a28',
          900: '#04441f',
          950: '#032612',
        },
        // Gold/amber accent — sampled from the logo's house colour, used as a
        // secondary highlight alongside the primary green (from the roof/emblem).
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#f7c325',
          500: '#f0b400',
          600: '#d69900',
          700: '#ad7a00',
          800: '#8a6200',
          900: '#6b4b00',
          950: '#3d2a00',
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
        'gradient-green': 'linear-gradient(135deg, #00cc58 0%, #008c3d 50%, #04441f 100%)',
        'gradient-gold': 'linear-gradient(135deg, #f7c325 0%, #f0b400 50%, #ad7a00 100%)',
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
        'green-sm':    '0 2px 8px rgba(0, 140, 61, 0.12)',
        'green':       '0 4px 16px rgba(0, 140, 61, 0.18)',
        'green-md':    '0 6px 24px rgba(0, 140, 61, 0.22)',
        'green-lg':    '0 8px 32px rgba(0, 140, 61, 0.28)',
        'green-xl':    '0 12px 48px rgba(0, 140, 61, 0.35)',
        'navbar':      '0 2px 20px rgba(0, 140, 61, 0.15)',
        'btn-green':   '0 4px 14px rgba(0, 140, 61, 0.40)',
        'btn-green-lg':'0 6px 20px rgba(0, 140, 61, 0.50)',
        'premium':     '0 4px 40px rgba(0, 140, 61, 0.20)',
        'card':        '0 2px 12px rgba(0, 140, 61, 0.08)',
        'card-hover':  '0 8px 32px rgba(0, 140, 61, 0.20)',
        'card-dark':   '0 2px 20px rgba(0, 0, 0, 0.4)',
        'glow':        '0 0 40px rgba(0, 140, 61, 0.30)',
        'glow-lg':     '0 0 60px rgba(0, 140, 61, 0.40)',
        'gold-sm':     '0 2px 8px rgba(240, 180, 0, 0.16)',
        'gold':        '0 4px 16px rgba(240, 180, 0, 0.22)',
        'btn-gold':    '0 4px 14px rgba(240, 180, 0, 0.45)',
        'btn-gold-lg': '0 6px 20px rgba(240, 180, 0, 0.55)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};

export default config;
