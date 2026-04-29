import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Share2, ChevronUp, Volume2, VolumeX } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useGalleryStore } from '../../stores/galleryStore'
import { useToastStore } from '../../stores/toastStore'
import FavoritesDrawer from './FavoritesDrawer'
import Lightbox from './Lightbox'
import type { Event } from '../../types/event'
import type { Photo } from '../../types/photo'

type TopActionsProps = {
  event: Event
}

export default function TopActions({ event }: TopActionsProps) {
  const { favoritedIds, isMusicPlaying, toggleMusic } = useGalleryStore()
  const pushToast = useToastStore((s) => s.push)
  const [visible, setVisible] = useState(false)
  const [favDrawerOpen, setFavDrawerOpen] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<Photo | null>(null)

  const allPhotos = event.chapters.flatMap((c) => c.photos)
  const favCount = favoritedIds.length

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 100)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${event.couple.brideName} & ${event.couple.groomName}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        pushToast('Gallery link copied', { detail: window.location.href, tone: 'success' })
      }
    } catch {
      // user cancelled — no toast
    }
  }

  const handleMusic = () => {
    toggleMusic()
    pushToast(isMusicPlaying ? 'Music muted' : 'Music on', {
      detail: isMusicPlaying ? undefined : 'A soft score plays in the background.',
      tone: 'bronze',
    })
  }

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            className="fixed z-40 flex flex-col items-end gap-2"
            style={{
              bottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
              right: 'max(1.5rem, env(safe-area-inset-right, 1.5rem))',
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
          >
            {/* Favorites counter — clickable, opens drawer */}
            <AnimatePresence>
              {favCount > 0 && (
                <motion.button
                  initial={{ opacity: 0, y: 6, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.92 }}
                  transition={{ duration: 0.3, ease: [0.2, 0.6, 0.2, 1] }}
                  onClick={() => setFavDrawerOpen(true)}
                  className="flex items-center gap-2 bg-night/90 px-3 py-2 hover:bg-night transition-colors duration-400 active:scale-95"
                  style={{ backdropFilter: 'blur(10px)', touchAction: 'manipulation' }}
                >
                  <Heart size={11} strokeWidth={1.5} className="text-bronze-soft fill-bronze-soft" />
                  <span className="font-sans text-inverse-fg/70 text-[11px]" style={{ letterSpacing: '0.14em' }}>
                    {favCount} saved
                  </span>
                </motion.button>
              )}
            </AnimatePresence>

            <div className="flex items-center gap-2">
              {/* Music toggle */}
              <button
                onClick={handleMusic}
                className="w-11 h-11 bg-night/90 flex items-center justify-center text-inverse-fg/60 hover:text-inverse-fg transition-colors duration-400 active:scale-95"
                style={{ backdropFilter: 'blur(10px)', touchAction: 'manipulation' }}
                title={isMusicPlaying ? 'Mute music' : 'Play music'}
                aria-label={isMusicPlaying ? 'Mute music' : 'Play music'}
              >
                {isMusicPlaying
                  ? <Volume2 size={14} strokeWidth={1.5} className="text-bronze-soft" />
                  : <VolumeX size={14} strokeWidth={1.5} />
                }
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="w-11 h-11 bg-night/90 flex items-center justify-center text-inverse-fg/60 hover:text-inverse-fg transition-colors duration-400 active:scale-95"
                style={{ backdropFilter: 'blur(10px)', touchAction: 'manipulation' }}
                title="Share gallery"
                aria-label="Share gallery"
              >
                <Share2 size={14} strokeWidth={1.5} />
              </button>

              {/* Back to top */}
              <button
                onClick={scrollToTop}
                className="w-11 h-11 bg-night/90 flex items-center justify-center text-inverse-fg/60 hover:text-inverse-fg transition-colors duration-400 active:scale-95"
                style={{ backdropFilter: 'blur(10px)', touchAction: 'manipulation' }}
                title="Back to top"
                aria-label="Back to top"
              >
                <ChevronUp size={16} strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Favorites drawer */}
      <FavoritesDrawer
        open={favDrawerOpen}
        onClose={() => setFavDrawerOpen(false)}
        event={event}
        onPhotoClick={(p) => { setFavDrawerOpen(false); setLightboxPhoto(p) }}
      />

      {/* Lightbox (opened from favorites) */}
      <Lightbox
        photo={lightboxPhoto}
        photos={allPhotos}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={(p) => setLightboxPhoto(p)}
      />
    </>
  )
}
