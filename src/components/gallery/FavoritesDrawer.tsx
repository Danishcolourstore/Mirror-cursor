import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Download } from 'lucide-react'
import { useGalleryStore } from '../../stores/galleryStore'
import type { Event } from '../../types/event'
import type { Photo } from '../../types/photo'

type FavoritesDrawerProps = {
  open: boolean
  onClose: () => void
  event: Event
  onPhotoClick: (photo: Photo) => void
}

export default function FavoritesDrawer({ open, onClose, event, onPhotoClick }: FavoritesDrawerProps) {
  const { favoritedIds, toggleFavorite } = useGalleryStore()

  const allPhotos = event.chapters.flatMap((c) => c.photos)
  const favorites = allPhotos.filter((p) => favoritedIds.includes(p.id))

  const downloadAll = () => {
    favorites.forEach((photo, i) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = photo.url
        a.download = `${event.slug}-favourite-${i + 1}.jpg`
        a.target = '_blank'
        a.rel = 'noreferrer'
        a.click()
      }, i * 300)
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-night/50"
            style={{ backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />

          {/* Drawer — slides from right */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] flex flex-col"
            style={{
              background: '#FFFFFF',
              borderLeft: '1px solid #E8E8E8',
              paddingBottom: 'env(safe-area-inset-bottom, 0px)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-muted shrink-0">
              <div className="flex items-center gap-2.5">
                <Heart size={14} strokeWidth={1.5} className="text-bronze fill-bronze/20" />
                <h2 className="serif font-light text-ink" style={{ fontSize: '18px', letterSpacing: '-0.02em' }}>
                  Your <em className="text-bronze italic">favourites</em>
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {favorites.length > 0 && (
                  <button
                    onClick={downloadAll}
                    className="flex items-center gap-1.5 font-sans text-[10px] uppercase text-whisper hover:text-ink transition-colors duration-400 border border-muted px-2.5 py-1.5"
                    style={{ letterSpacing: '0.16em' }}
                    title="Download all favourites"
                  >
                    <Download size={10} strokeWidth={1.5} />
                    Download all
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 text-whisper hover:text-ink transition-colors duration-400"
                >
                  <X size={16} strokeWidth={1.5} />
                </button>
              </div>
            </div>

            {/* Count bar */}
            {favorites.length > 0 && (
              <div className="px-6 py-3 border-b border-muted flex items-center justify-between shrink-0">
                <p className="font-sans text-[11px] text-whisper uppercase" style={{ letterSpacing: '0.18em' }}>
                  {favorites.length} {favorites.length === 1 ? 'photo' : 'photos'} saved
                </p>
                <p className="serif italic text-whisper/50 text-[12px]">
                  {event.couple.brideName} & {event.couple.groomName}
                </p>
              </div>
            )}

            {/* Photo grid */}
            <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide">
              {favorites.length === 0 ? (
                <motion.div
                  className="h-full flex flex-col items-center justify-center gap-4 py-20"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="w-12 h-12 border border-muted flex items-center justify-center">
                    <Heart size={18} strokeWidth={1} className="text-whisper/40" />
                  </div>
                  <p className="serif italic text-whisper text-sm text-center max-w-[200px] leading-relaxed">
                    Tap the heart on any photograph to save it here.
                  </p>
                </motion.div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {favorites.map((photo, i) => (
                    <motion.div
                      key={photo.id}
                      className="relative overflow-hidden group cursor-zoom-in"
                      style={{ aspectRatio: '1/1' }}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.04, ease: [0.2, 0.6, 0.2, 1] }}
                      onClick={() => onPhotoClick(photo)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption ?? ''}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
                      />

                      {/* Hover veil */}
                      <div className="absolute inset-0 bg-night/0 group-hover:bg-night/20 transition-colors duration-[1400ms]" />

                      {/* Unfavourite button */}
                      <button
                        className="absolute top-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(photo.id)
                        }}
                        title="Remove from favourites"
                        style={{ touchAction: 'manipulation' }}
                      >
                        <Heart size={13} strokeWidth={1.5} className="text-bronze-soft fill-bronze-soft" />
                      </button>

                      {/* Caption */}
                      {photo.caption && (
                        <div className="absolute bottom-0 inset-x-0 px-2.5 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                          style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.65))' }}>
                          <p className="serif italic text-canvas/70 text-[11px] leading-tight line-clamp-2">
                            {photo.caption}
                          </p>
                        </div>
                      )}

                      {/* Download single */}
                      <a
                        href={photo.url}
                        download
                        target="_blank"
                        rel="noreferrer"
                        className="absolute bottom-2 right-2 p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-400 text-canvas/70 hover:text-canvas"
                        onClick={(e) => e.stopPropagation()}
                        title="Download"
                      >
                        <Download size={12} strokeWidth={1.5} />
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer CTA */}
            {favorites.length > 0 && (
              <div className="px-6 py-4 border-t border-muted shrink-0">
                <p className="font-sans text-[11px] text-whisper leading-relaxed">
                  Share these with your team — send a{' '}
                  <span className="text-bronze underline underline-offset-2 cursor-pointer">WhatsApp message</span>
                  {' '}with your selection.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
