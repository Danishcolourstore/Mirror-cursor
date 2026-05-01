import { useEffect } from 'react'

type CoupleRevealProps = {
  onComplete: () => void
}

export default function CoupleReveal({ onComplete }: CoupleRevealProps) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 4200)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  return (
    <section className="relative flex min-h-screen items-center justify-center bg-[var(--bg-primary)] px-6 py-16 text-center">
      <div className="flex max-w-4xl flex-col items-center">
        <h2 className="type-display flex flex-wrap items-end justify-center gap-3 text-white sm:gap-4">
          <span className="name-aarav">Aarav</span>
          <span className="ampersand text-[#C9A96E]">&</span>
          <span className="name-priya">Priya</span>
        </h2>
        <p className="type-label mt-6 text-white/60">A WEDDING STORY BY VOGA WEDDINGS</p>
        <p className="type-label mt-8 reveal-date text-white/70">14 FEBRUARY 2026</p>
        <p className="type-label mt-3 reveal-location text-white/60">KERALA, INDIA</p>
      </div>
      <style>{`
        .name-aarav {
          opacity: 0;
          transform: translateY(20px);
          animation: aaravUp 900ms ease-out forwards;
        }

        .ampersand {
          opacity: 0;
          font-style: italic;
          font-size: 1.2em;
          animation: ampersandFade 700ms ease forwards;
          animation-delay: 300ms;
        }

        .name-priya {
          opacity: 0;
          transform: translateX(20px);
          animation: priyaIn 900ms ease-out forwards;
          animation-delay: 560ms;
        }

        .reveal-date {
          opacity: 0;
          animation: metaIn 700ms ease forwards;
          animation-delay: 980ms;
        }

        .reveal-location {
          opacity: 0;
          animation: metaIn 700ms ease forwards;
          animation-delay: 1180ms;
        }

        @keyframes aaravUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes ampersandFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes priyaIn {
          0% { opacity: 0; transform: translateX(20px); }
          100% { opacity: 1; transform: translateX(0); }
        }

        @keyframes metaIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
