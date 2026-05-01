import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

type PhotoCardProps = {
  id: string
  src: string
  alt: string
  isFavorited: boolean
  onToggleFavorite: (id: string) => void
  onOpen: () => void
  className?: string
}

const BLUR_PLACEHOLDER =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxAQDw8PDxAQEA8PEA8PDw8PDw8PDw8PFREWFhURFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMsNygtLisBCgoKDQ0NDg0NDisZFRkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAAoACgMBIgACEQEDEQH/xAAVAAEBAAAAAAAAAAAAAAAAAAAABf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhADEAAAAf8A/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPwD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/AFP/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AFP/2Q=='

export default function PhotoCard({
  id,
  src,
  alt,
  isFavorited,
  onToggleFavorite,
  onOpen,
  className = '',
}: PhotoCardProps) {
  const [loaded, setLoaded] = useState(false)
  const [mobileArmed, setMobileArmed] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const [heartBurstTick, setHeartBurstTick] = useState(0)

  useEffect(() => {
    const media = window.matchMedia('(hover: none), (pointer: coarse)')
    const update = () => setIsTouch(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  const handleCardClick = () => {
    if (!isTouch) {
      onOpen()
      return
    }
    if (!mobileArmed) {
      setMobileArmed(true)
      return
    }
    onOpen()
  }

  const handleFavorite = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onToggleFavorite(id)
    setHeartBurstTick((value) => value + 1)
    if (isTouch && navigator.vibrate) {
      navigator.vibrate(10)
    }
  }

  return (
    <article
      className={[
        'photo-card group relative cursor-crosshair overflow-hidden rounded-[2px] bg-[#0F0D0C]',
        className,
      ].join(' ')}
      onClick={handleCardClick}
      onMouseLeave={() => setMobileArmed(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          handleCardClick()
        }
      }}
    >
      <img
        src={BLUR_PLACEHOLDER}
        alt=""
        aria-hidden
        className={[
          'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
          loaded ? 'opacity-0' : 'opacity-100',
        ].join(' ')}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={[
          'h-full w-full object-cover transition-all duration-700',
          loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-[20px]',
        ].join(' ')}
      />

      <div
        className={[
          'pointer-events-none absolute inset-0 bg-black/0 transition-all duration-180',
          'group-hover:bg-black/40',
          mobileArmed ? 'bg-black/45' : '',
        ].join(' ')}
      />

      <div
        className={[
          'absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-180',
          'group-hover:opacity-100',
          mobileArmed ? 'opacity-100' : '',
        ].join(' ')}
      >
        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorited ? 'Remove favorite' : 'Favorite photo'}
          className={[
            'heart-hit relative rounded-full border border-[#C9A96E]/65 bg-[#090807]/50 p-3 backdrop-blur-sm transition-transform',
            heartBurstTick > 0 ? 'heart-bop' : '',
          ].join(' ')}
        >
          <Heart
            className={[
              'h-5 w-5 transition-colors',
              isFavorited
                ? 'fill-[#C9A96E] text-[#E8C98E]'
                : 'fill-transparent text-white/90',
            ].join(' ')}
            strokeWidth={1.7}
          />
          <span key={heartBurstTick} className="particle-wrap pointer-events-none absolute inset-0">
            <span className="particle particle-1" />
            <span className="particle particle-2" />
            <span className="particle particle-3" />
            <span className="particle particle-4" />
            <span className="particle particle-5" />
            <span className="particle particle-6" />
            <span className="particle particle-7" />
            <span className="particle particle-8" />
          </span>
        </button>
      </div>

      <style>{`
        .heart-bop {
          animation: heartBop 200ms ease-in-out;
        }

        @keyframes heartBop {
          0% { transform: scale(1); }
          60% { transform: scale(1.4); }
          100% { transform: scale(1); }
        }

        .particle-wrap .particle {
          position: absolute;
          left: calc(50% - 2px);
          top: calc(50% - 2px);
          width: 4px;
          height: 4px;
          border-radius: 9999px;
          background: #c9a96e;
          opacity: 0;
        }

        .heart-bop .particle {
          animation: particleBurst 420ms ease-out forwards;
        }

        .heart-bop .particle-1 { transform: translate(0, -12px); }
        .heart-bop .particle-2 { transform: translate(10px, -8px); }
        .heart-bop .particle-3 { transform: translate(12px, 0); }
        .heart-bop .particle-4 { transform: translate(8px, 10px); }
        .heart-bop .particle-5 { transform: translate(0, 12px); }
        .heart-bop .particle-6 { transform: translate(-10px, 8px); }
        .heart-bop .particle-7 { transform: translate(-12px, 0); }
        .heart-bop .particle-8 { transform: translate(-8px, -10px); }

        @keyframes particleBurst {
          0% {
            opacity: 0.95;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.2);
          }
        }
      `}</style>
    </article>
  )
}
