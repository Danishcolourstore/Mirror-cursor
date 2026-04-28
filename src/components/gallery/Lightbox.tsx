import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Heart, Download } from 'lucide-react'
import { useGalleryStore } from '../../stores/galleryStore'
import { cn } from '../../lib/cn'
import type { Photo } from '../../types/photo'

type LightboxProps = {
  photo: Photo | null
  photos: Photo[]
  onClose: () => void
  onNavigate: (photo: Photo) => void
}

export default function Lightbox({ photo, photos, onClose, onNavigate }: LightboxProps) {
  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < photos.length - 1
  const { toggleFavorite, isFavorited } = useGalleryStore()
  const favorited = photo ? isFavorited(photo.id) : false

  // Touch / swipe state
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  useEffect(() => {
    if (!photo) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(photos[currentIndex - 1])
      if (e.key === 'ArrowRight' && hasNext) onNavigate(photos[currentIndex + 1])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [photo, currentIndex, hasPrev, hasNext, onClose, onNavigate, photos])

  // Lock body scroll when open
  useEffect(() => {
    if (photo) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [photo])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    const dy = e.changedTouches[0].clientY - touchStartY.current

    // Only treat as horizontal swipe if movement is more horizontal than vertical
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 48) {
      if (dx < 0 && hasNext) onNavigate(photos[currentIndex + 1])
      if (dx > 0 && hasPrev) onNavigate(photos[currentIndex - 1])
    } else if (Math.abs(dy) > 80 && Math.abs(dy) > Math.abs(dx)) {
      // Swipe down to close
      onClose()
    }

    touchStartX.current = null
    touchStartY.current = null
  }

  return (
    <AnimatePresence>
      {photo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-night/95"
            style={{ backdropFilter: 'blur(8px)' }}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Top bar */}
          <div className="absolute top-0 inset-x-0 z-10 flex items-center justify-between px-5 py-4">
            {/* Counter */}
            <p
              className="font-sans text-canvas/30 uppercase"
              style={{ fontSize: '11px', letterSpacing: '0.22em' }}
            >
              {currentIndex + 1} / {photos.length}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {/* Favorite toggle */}
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(photo.id) }}
                className="p-3 transition-colors duration-400"
                aria-label="Favourite"
                style={{ touchAction: 'manipulation' }}
              >
                <Heart
                  size={16}
                  strokeWidth={1.5}
                  className={cn(
                    'transition-colors duration-400',
                    favorited ? 'fill-bronze-soft text-bronze-soft' : 'text-canvas/40 hover:text-bronze-soft'
                  )}
                />
              </button>

              {/* Download */}
              <a
                href={photo.url}
                download
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-3 text-canvas/40 hover:text-canvas transition-colors duration-400"
                aria-label="Download photo"
              >
                <Download size={16} strokeWidth={1.5} />
              </a>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-3 text-canvas/40 hover:text-canvas transition-colors duration-400"
                aria-label="Close"
                style={{ touchAction: 'manipulation' }}
              >
                <X size={18} strokeWidth={1.2} />
              </button>
            </div>
          </div>

          {/* Prev button */}
          {hasPrev && (
            <button
              onClick={() => onNavigate(photos[currentIndex - 1])}
              className="absolute left-2 sm:left-4 z-10 text-canvas/40 hover:text-canvas transition-colors duration-400 p-3"
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronLeft size={24} strokeWidth={1.2} />
            </button>
          )}

          {/* Image */}
          <motion.div
            key={photo.id}
            className="relative z-10 flex flex-col items-center px-12"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.2, 0.6, 0.2, 1] }}
          >
            <img
              src={photo.url}
              alt={photo.caption ?? ''}
              className="object-contain select-none"
              style={{
                maxWidth: 'min(92vw, 1100px)',
                maxHeight: photo.caption ? '74vh' : '82vh',
              }}
              draggable={false}
            />
            {photo.caption && (
              <p
                className="serif italic text-canvas/50 text-center mt-4 px-6"
                style={{ fontSize: '13px', maxWidth: '480px' }}
              >
                {photo.caption}
              </p>
            )}

            {/* Swipe hint — mobile only, shown once */}
            <p
              className="sm:hidden font-sans text-[10px] text-canvas/20 uppercase mt-6"
              style={{ letterSpacing: '0.18em' }}
            >
              swipe to navigate
            </p>
          </motion.div>

          {/* Next button */}
          {hasNext && (
            <button
              onClick={() => onNavigate(photos[currentIndex + 1])}
              className="absolute right-2 sm:right-4 z-10 text-canvas/40 hover:text-canvas transition-colors duration-400 p-3"
              style={{ touchAction: 'manipulation' }}
            >
              <ChevronRight size={24} strokeWidth={1.2} />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
