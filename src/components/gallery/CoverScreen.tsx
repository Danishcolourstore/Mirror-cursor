import { useEffect, useMemo, useState } from 'react'

type CoverScreenProps = {
  images: string[]
  onComplete: () => void
  onSkipToGrid: () => void
}

export default function CoverScreen({ images, onComplete, onSkipToGrid }: CoverScreenProps) {
  const heroImages = useMemo(() => images.slice(0, 3), [images])
  const [canSkip, setCanSkip] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => {
    const skipTimer = window.setTimeout(() => setCanSkip(true), 1500)
    const autoTimer = window.setTimeout(() => {
      setIsExiting(true)
      window.setTimeout(onComplete, 600)
    }, 5800)

    return () => {
      window.clearTimeout(skipTimer)
      window.clearTimeout(autoTimer)
    }
  }, [onComplete])

  const handleSkip = () => {
    if (isExiting) return
    setIsExiting(true)
    window.setTimeout(() => {
      onComplete()
      onSkipToGrid()
    }, 600)
  }

  return (
    <div
      className={[
        'fixed inset-0 z-50 overflow-hidden bg-[#090807]',
        isExiting ? 'animate-[coverFadeOut_600ms_ease_forwards]' : '',
      ].join(' ')}
      role="presentation"
    >
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={image}
            className={`cover-slide cover-slide-${index + 1} absolute inset-0`}
          >
            <img
              src={image}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(9,8,7,0.05)_10%,rgba(9,8,7,0.45)_62%,rgba(9,8,7,0.88)_100%)]" />

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="type-label text-[#C9A96E] opacity-80">PRESENTS</p>
        <h1 className="mt-4 max-w-3xl text-[36px] font-light italic leading-[0.95] tracking-[-0.02em] text-white sm:text-[54px] lg:text-[72px]">
          Voga Weddings
        </h1>
      </div>

      {canSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="type-label-active absolute bottom-8 right-6 z-20 rounded-[4px] border border-[#C9A96E]/55 px-4 py-2 text-[10px] tracking-[0.4em] opacity-55 transition-opacity duration-300 hover:opacity-90"
        >
          SKIP INTRO
        </button>
      )}

      <style>{`
        @keyframes coverFadeOut {
          0% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }

        @keyframes coverTextIn {
          0% { opacity: 0; transform: translateY(8px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes presentsTracking {
          0% { letter-spacing: 0.3em; opacity: 0; }
          100% { letter-spacing: 0.5em; opacity: 0.8; }
        }

        @keyframes heroOpacity {
          0% { opacity: 0; }
          10% { opacity: 1; }
          75% { opacity: 1; }
          100% { opacity: 0; }
        }

        @keyframes kenBurnsHero {
          0% { transform: scale(1); }
          100% { transform: scale(1.04); }
        }

        .cover-slide {
          opacity: 0;
          animation: heroOpacity 5.2s ease-in-out infinite;
        }

        .cover-slide img {
          animation: kenBurnsHero 4s ease-out infinite alternate;
        }

        .cover-slide-1 {
          animation-delay: 0s;
        }
        .cover-slide-2 {
          animation-delay: 1.2s;
        }
        .cover-slide-3 {
          animation-delay: 2.4s;
        }

        h1 {
          opacity: 0;
          animation: coverTextIn 1200ms ease forwards;
          animation-delay: 400ms;
        }

        .type-label {
          animation: presentsTracking 1200ms ease forwards;
          animation-delay: 400ms;
        }
      `}</style>
    </div>
  )
}
