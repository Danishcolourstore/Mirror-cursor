/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F6F1E8',
        'canvas-deep': '#EDE6D8',
        'canvas-deeper': '#E4DCC9',
        ink: '#1C1814',
        'ink-soft': '#3A332C',
        whisper: '#8E8579',
        muted: '#D9D0BE',
        bronze: '#8B6F47',
        'bronze-deep': '#6B5436',
        'bronze-soft': '#B89876',
        sage: '#7A8470',
        rose: '#B85C4A',
        night: '#14110D',
        fill: 'var(--fill)',
        'on-fill': 'var(--on-fill)',
        'fill-hover': 'var(--fill-hover)',
        'inverse-fg': 'var(--inverse-fg)',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4' }],
      },
      letterSpacing: {
        'widest-2': '0.32em',
        'button': '0.18em',
      },
      boxShadow: {
        card: 'var(--shadow)',
      },
      transitionTimingFunction: {
        'cinematic': 'cubic-bezier(0.2, 0.6, 0.2, 1)',
      },
      transitionDuration: {
        '400': '400ms',
        '1200': '1200ms',
        '1400': '1400ms',
      },
      animation: {
        'ken-burns': 'kenBurns 24s ease-out forwards',
        'breathe': 'breathe 3s ease-in-out infinite',
        'pulse-dot': 'pulseDot 2s ease-in-out infinite',
      },
      keyframes: {
        kenBurns: {
          '0%': { transform: 'scale(1.0)' },
          '100%': { transform: 'scale(1.12)' },
        },
        breathe: {
          '0%, 100%': { opacity: '0.4', transform: 'translateY(0)' },
          '50%': { opacity: '0.85', transform: 'translateY(4px)' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.4)' },
        },
      },
    },
  },
  plugins: [],
}
