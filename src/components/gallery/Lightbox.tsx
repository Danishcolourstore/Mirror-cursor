import { useEffect, useMemo, useRef, useState } from 'react'
import { X, ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import type { Photo } from '../../types/photo'

type LightboxProps = {
  photo: Photo | null
  photos: Photo[]
  onClose: () => void
  onNavigate: (photo: Photo) => void
  onToggleFavorite?: (photoId: string) => void
  isFavorited?: (photoId: string) => boolean
}

const FAVORITES_KEY = 'mirror-studio-favorites'

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return new Set<string>()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set<string>()
    return new Set(parsed.filter((item): item is string => typeof item === 'string'))
  } catch {
    return new Set<string>()
  }
}

function writeFavorites(next: Set<string>): void {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)))
}

function getPhotoSource(photo: Photo): string {
  return photo.url
}

function getPhotoCaption(photo: Photo): string {
  return photo.caption ?? 'Wedding photo'
}

type TouchPoint = {
  x: number
  y: number
}

export default function Lightbox({
  photo,
  photos,
  onClose,
  onNavigate,
  onToggleFavorite,
  isFavorited,
}: LightboxProps) {
  const currentPhoto = photo
  const currentIndex = currentPhoto ? photos.findIndex((p) => p.id === currentPhoto.id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1
  const [mounted, setMounted] = useState(false)
  const [closing, setClosing] = useState(false)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [bottomBarVisible, setBottomBarVisible] = useState(true)
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 3>(1)
  const [tapCount, setTapCount] = useState(0)
  const [localFavorites, setLocalFavorites] = useState<Set<string>>(() => readFavorites())

  const idleTimer = useRef<number | null>(null)
  const touchStart = useRef<TouchPoint | null>(null)
  const initialPinchDistance = useRef<number | null>(null)
  const tapTimer = useRef<number | null>(null)

  const favorited = useMemo(() => {
    if (!currentPhoto) return false
    if (isFavorited) return isFavorited(currentPhoto.id)
    return localFavorites.has(currentPhoto.id)
  }, [currentPhoto, isFavorited, localFavorites])

  const handleDismiss = () => {
    setClosing(true)
    window.setTimeout(() => {
      setClosing(false)
      onClose()
    }, 220)
  }

  useEffect(() => {
    if (!currentPhoto) return undefined
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleDismiss()
      if (event.key === 'ArrowLeft' && hasPrev) onNavigate(photos[currentIndex - 1])
      if (event.key === 'ArrowRight' && hasNext) onNavigate(photos[currentIndex + 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [currentPhoto, currentIndex, hasPrev, hasNext, onNavigate, photos])

  useEffect(() => {
    if (!currentPhoto) return undefined
    setMounted(true)
    setClosing(false)
    document.body.classList.add('overflow-hidden')
    window.dispatchEvent(new CustomEvent('mirror-lightbox-open-change', { detail: { open: true } }))
    return () => {
      setMounted(false)
      setZoomLevel(1)
      document.body.classList.remove('overflow-hidden')
      window.dispatchEvent(new CustomEvent('mirror-lightbox-open-change', { detail: { open: false } }))
    }
  }, [currentPhoto])

  useEffect(() => {
    if (!currentPhoto) return undefined
    setControlsVisible(true)
    if (idleTimer.current) window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => setControlsVisible(false), 2000)
    return () => {
      if (idleTimer.current) window.clearTimeout(idleTimer.current)
    }
  }, [currentPhoto])

  useEffect(() => {
    if (!currentPhoto) return undefined
    if (tapTimer.current) window.clearTimeout(tapTimer.current)
    return () => {
      if (tapTimer.current) window.clearTimeout(tapTimer.current)
    }
  }, [currentPhoto])

  const resetIdleTimer = () => {
    setControlsVisible(true)
    if (idleTimer.current) window.clearTimeout(idleTimer.current)
    idleTimer.current = window.setTimeout(() => setControlsVisible(false), 2000)
  }

  const handleFavorite = () => {
    if (!currentPhoto) return
    if (onToggleFavorite) {
      onToggleFavorite(currentPhoto.id)
      return
    }
    setLocalFavorites((current) => {
      const next = new Set(current)
      if (next.has(currentPhoto.id)) next.delete(currentPhoto.id)
      else next.add(currentPhoto.id)
      writeFavorites(next)
      return next
    })
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const points = event.touches
    if (points.length === 2) {
      const dx = points[1].clientX - points[0].clientX
      const dy = points[1].clientY - points[0].clientY
      initialPinchDistance.current = Math.hypot(dx, dy)
      return
    }
    touchStart.current = {
      x: points[0].clientX,
      y: points[0].clientY,
    }
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const points = event.touches
    if (points.length === 2 && initialPinchDistance.current) {
      const dx = points[1].clientX - points[0].clientX
      const dy = points[1].clientY - points[0].clientY
      const distance = Math.hypot(dx, dy)
      const ratio = distance / initialPinchDistance.current
      if (ratio > 1.35) setZoomLevel(3)
      else if (ratio > 1.1) setZoomLevel(2)
      else setZoomLevel(1)
      return
    }
    resetIdleTimer()
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    initialPinchDistance.current = null
    if (!touchStart.current) return

    const dx = event.changedTouches[0].clientX - touchStart.current.x
    const dy = event.changedTouches[0].clientY - touchStart.current.y

    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48 && zoomLevel === 1) {
      if (dx < 0 && hasNext) onNavigate(photos[currentIndex + 1])
      if (dx > 0 && hasPrev) onNavigate(photos[currentIndex - 1])
    } else if (dy > 80 && Math.abs(dy) > Math.abs(dx) && zoomLevel === 1) {
      handleDismiss()
    } else {
      setTapCount((count) => count + 1)
      if (tapTimer.current) window.clearTimeout(tapTimer.current)
      tapTimer.current = window.setTimeout(() => {
        setTapCount(0)
      }, 260)
    }
    touchStart.current = null
  }

  useEffect(() => {
    if (tapCount !== 2) return
    setTapCount(0)
    setZoomLevel((level) => (level === 1 ? 2 : 1))
  }, [tapCount])

  if (!currentPhoto) return null

  return (
    <div
      className={[
        'fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/0',
        mounted && !closing ? 'lightbox-open' : '',
        closing ? 'lightbox-closing' : '',
      ].join(' ')}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseMove={resetIdleTimer}
      role="dialog"
      aria-modal
      aria-label="Photo lightbox"
    >
      <div className="lightbox-backdrop absolute inset-0 bg-black/95" onClick={handleDismiss} />

      <button
        onClick={handleDismiss}
        className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white/90 transition-colors hover:text-white"
        aria-label="Close"
      >
        <X size={20} strokeWidth={1.8} />
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={() => onNavigate(photos[currentIndex - 1])}
          className={[
            'absolute left-2 z-20 rounded-full bg-black/35 p-3 text-white/80 transition-all duration-200 sm:left-4',
            controlsVisible ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          aria-label="Previous photo"
        >
          <ChevronLeft size={24} strokeWidth={1.4} />
        </button>
      )}

      <div
        className="lightbox-image-wrap relative z-10 flex h-full w-full items-center justify-center px-4 pb-[calc(env(safe-area-inset-bottom)+88px)] pt-[calc(env(safe-area-inset-top)+24px)] md:px-16"
        onClick={() => setBottomBarVisible((value) => !value)}
      >
        <img
          key={currentPhoto.id}
          src={getPhotoSource(currentPhoto)}
          alt={getPhotoCaption(currentPhoto)}
          className={[
            'lightbox-image select-none object-contain transition-transform duration-300 ease-out',
            zoomLevel === 1 ? 'scale-100' : '',
            zoomLevel === 2 ? 'scale-[2]' : '',
            zoomLevel === 3 ? 'scale-[3]' : '',
          ].join(' ')}
          draggable={false}
        />
      </div>

      {hasNext && (
        <button
          type="button"
          onClick={() => onNavigate(photos[currentIndex + 1])}
          className={[
            'absolute right-2 z-20 rounded-full bg-black/35 p-3 text-white/80 transition-all duration-200 sm:right-4',
            controlsVisible ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          aria-label="Next photo"
        >
          <ChevronRight size={24} strokeWidth={1.4} />
        </button>
      )}

      <p className="type-label absolute right-6 top-6 z-20 text-white/70">
        {currentIndex + 1} / {photos.length}
      </p>

      <div
        className={[
          'absolute bottom-0 left-0 right-0 z-20 border-t border-[#C9A96E]/20 bg-black/45 px-5 py-4 pb-[calc(env(safe-area-inset-bottom)+16px)] backdrop-blur-sm transition-transform duration-300',
          bottomBarVisible ? 'translate-y-0' : 'translate-y-full',
        ].join(' ')}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4">
          <div>
            <p className="type-label-active">{(currentPhoto as Photo & { chapter?: string }).chapter ?? 'Chapter'}</p>
            <p className="type-ui mt-2 text-white/90">
              Photo {currentIndex + 1} of {photos.length}
            </p>
          </div>
          <button
            type="button"
            onClick={handleFavorite}
            className="rounded-full border border-[#C9A96E]/60 bg-black/40 p-3"
            aria-label={favorited ? 'Remove favorite' : 'Favorite photo'}
          >
            <Heart
              size={18}
              strokeWidth={1.7}
              className={favorited ? 'fill-[#C9A96E] text-[#E8C98E]' : 'fill-transparent text-white'}
            />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes lightboxBackdropIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }

        @keyframes lightboxImageIn {
          0% { opacity: 0; transform: scale(0.96); }
          100% { opacity: 1; transform: scale(1); }
        }

        .lightbox-open .lightbox-backdrop {
          animation: lightboxBackdropIn 220ms ease forwards;
        }

        .lightbox-open .lightbox-image {
          animation: lightboxImageIn 350ms ease-out forwards;
        }

        .lightbox-closing .lightbox-backdrop {
          opacity: 0;
          transition: opacity 220ms ease;
        }

        .lightbox-closing .lightbox-image-wrap {
          opacity: 0;
          transform: scale(0.96);
          transition: opacity 220ms ease, transform 220ms ease;
        }
      `}</style>
    </div>
  )
}
