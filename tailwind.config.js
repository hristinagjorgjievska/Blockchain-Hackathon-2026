/** @type {import('tailwindcss').Config} */
export default {
  content: ['./frontend/index.html', './frontend/src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0a1f3c',
          950: '#050d1c',
          900: '#081628',
          800: '#0a1f3c',
          700: '#102c4f',
          600: '#173a66',
          500: '#21507f',
        },
        solana: { purple: '#9945ff', green: '#14f195' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px 0 rgb(10 31 60 / 0.04), 0 6px 20px -6px rgb(10 31 60 / 0.10)',
        lift: '0 2px 6px -1px rgb(10 31 60 / 0.08), 0 18px 44px -12px rgb(10 31 60 / 0.20)',
        float: '0 10px 30px -8px rgb(5 13 28 / 0.32), 0 30px 72px -20px rgb(5 13 28 / 0.46)',
        glow: '0 0 0 1px rgb(37 99 235 / 0.22), 0 12px 34px -10px rgb(37 99 235 / 0.42)',
        'glow-emerald': '0 0 0 1px rgb(16 185 129 / 0.22), 0 12px 34px -10px rgb(16 185 129 / 0.38)',
      },
      keyframes: {
        pulseRing: {
          '0%': { transform: 'scale(0.7)', opacity: '0.55' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scanY: {
          '0%': { top: '-4%', opacity: '0' },
          '16%, 84%': { opacity: '0.55' },
          '100%': { top: '104%', opacity: '0' },
        },
        sheen: {
          '0%': { transform: 'translateX(-130%) skewX(-14deg)' },
          '55%, 100%': { transform: 'translateX(240%) skewX(-14deg)' },
        },
        drawCheck: {
          '0%': { strokeDashoffset: '40' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      animation: {
        pulseRing: 'pulseRing 2.6s ease-out infinite',
        fadeUp: 'fadeUp 0.5s ease-out both',
        fadeIn: 'fadeIn 0.4s ease-out both',
        scaleIn: 'scaleIn 0.24s ease-out both',
        floatY: 'floatY 8s ease-in-out infinite',
        shimmer: 'shimmer 2.2s linear infinite',
        scanY: 'scanY 5.5s linear infinite',
        sheen: 'sheen 7s ease-in-out infinite',
        drawCheck: 'drawCheck 0.5s ease-out 0.15s both',
      },
    },
  },
  plugins: [],
};
