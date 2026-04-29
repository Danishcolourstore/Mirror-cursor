/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: 'var(--canvas)',
        'canvas-deep': 'var(--surface)',
        'canvas-deeper': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-soft': 'var(--ink-soft)',
        whisper: 'var(--whisper)',
        muted: 'var(--border)',
        bronze: 'var(--accent)',
        'bronze-deep': 'var(--accent-deep)',
        'bronze-soft': 'var(--accent-soft)',
        sage: 'var(--sage)',
        rose: 'var(--rose)',
        night: 'var(--night)',
        fill: 'var(--fill)',
        'on-fill': 'var(--on-fill)',
        'fill-hover': 'var(--fill-hover)',
        'inverse-fg': 'var(--inverse-fg)',
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
