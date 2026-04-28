/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#FFFFFF',
        'canvas-deep': '#F8F8F8',
        'canvas-deeper': '#F0F0F0',
        ink: '#1A1A1A',
        'ink-soft': '#333333',
        whisper: '#6B6B6B',
        muted: '#E8E8E8',
        bronze: '#E8C97A',
        'bronze-deep': '#C4A85E',
        'bronze-soft': '#F0DCA8',
        sage: '#5A6D58',
        rose: '#C45C5C',
        night: '#000000',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['10px', { lineHeight: '1.4' }],
      },
      letterSpacing: {
        'widest-2': '0.32em',
        'button': '0.18em',
      },
      boxShadow: {
        card: '0 1px 4px rgba(0,0,0,0.08)',
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
