import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, Download, Share2, X } from 'lucide-react'
import { cn } from '../../lib/cn'

export type StickyNavbarProps = {
  coupleNames: string
  totalPhotoCount: number
  favoritedCount: number
  showFavoritesOnly: boolean
  onToggleFavorites: () => void
  searchQuery: string
  onSearchChange: (q: string) => void
  searchOpen: boolean
  onSearchToggle: () => void
  /** Element placed just after `<Cover />`; when it leaves viewport, the navbar appears. */
  sentinelRef: RefObject<HTMLDivElement | null>
}

/**
 * Thin sticky gallery navbar: fades + slides in after the viewer scrolls past the hero cover.
 * Observes a sentinel node below `<Cover>` (IntersectionObserver — Cover itself is unchanged).
 */
export default function StickyNavbar({
  coupleNames,
  totalPhotoCount,
  favoritedCount,
  showFavoritesOnly,
  onToggleFavorites,
  searchQuery,
  onSearchChange,
  searchOpen,
  onSearchToggle,
  sentinelRef,
}: StickyNavbarProps) {
  const [visible, setVisible] = useState(false)
  const [downloadOpen, setDownloadOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [sentinelRef])

  useEffect(() => {
    if (!downloadOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDownloadOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [downloadOpen])

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).catch(() => {})
  }

  const handleDownload = () => {
    setDownloadOpen(false)
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-x-0 top-0 z-40"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
        >
          <div
            className="flex items-center justify-between border-b border-muted"
            style={{
              height: '56px',
              paddingInline: '16px',
              backgroundColor: '#EDE6D8',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            <p
              className="font-serif italic text-ink shrink-0 leading-none"
              style={{ fontSize: '14px' }}
            >
              Mirror Studio
            </p>

            <p
              className="font-serif text-ink min-w-0 flex-1 truncate px-3 text-center leading-none sm:px-6"
              style={{ fontSize: '14px' }}
            >
              {coupleNames}
            </p>

            <div className="flex shrink-0 items-center gap-0.5">
              <button
                type="button"
                onClick={onSearchToggle}
                className={cn(
                  'rounded-none p-2.5 transition-colors duration-300',
                  searchOpen ? 'text-ink' : 'text-ink-soft hover:text-ink'
                )}
                aria-label="Search photos"
              >
                <Search size={16} strokeWidth={1.5} />
              </button>

              <button
                type="button"
                onClick={onToggleFavorites}
                className="rounded-none p-2.5 text-ink-soft transition-colors duration-300 hover:text-ink"
                aria-label="Toggle favorites filter"
              >
                <Heart
                  size={16}
                  strokeWidth={1.5}
                  className={cn(
                    'transition-colors duration-300',
                    showFavoritesOnly ? 'fill-bronze text-bronze' : ''
                  )}
                />
              </button>

              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDownloadOpen((o) => !o)}
                  className="rounded-none p-2.5 text-ink-soft transition-colors duration-300 hover:text-ink"
                  aria-label="Download"
                >
                  <Download size={16} strokeWidth={1.5} />
                </button>

                <AnimatePresence>
                  {downloadOpen && (
                    <motion.div
                      className="absolute right-0 top-full z-50 mt-1 min-w-[188px] border border-muted bg-canvas py-1"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.18 }}
                    >
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full px-4 py-2.5 text-left font-sans text-[12.5px] text-ink transition-colors hover:bg-canvas-deep"
                      >
                        All Photos ({totalPhotoCount})
                      </button>
                      <div className="mx-3 h-px bg-muted" />
                      <button
                        type="button"
                        onClick={handleDownload}
                        className="w-full px-4 py-2.5 text-left font-sans text-[12.5px] text-ink transition-colors hover:bg-canvas-deep"
                      >
                        Favorites ({favoritedCount})
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                onClick={handleShare}
                className="rounded-none p-2.5 text-ink-soft transition-colors duration-300 hover:text-ink"
                aria-label="Copy gallery link"
              >
                <Share2 size={16} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {searchOpen && (
              <motion.div
                className="overflow-hidden border-b border-muted"
                style={{
                  backgroundColor: '#EDE6D8',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                }}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: [0.2, 0.6, 0.2, 1] }}
              >
                <div className="flex items-center gap-3 px-4 py-2.5" style={{ paddingInline: '16px' }}>
                  <Search size={13} strokeWidth={1.5} className="shrink-0 text-whisper" />
                  <input
                    type="search"
                    placeholder="Search photos…"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent font-sans text-[13px] text-ink outline-none placeholder:text-whisper"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="text-whisper transition-colors duration-200 hover:text-ink"
                      aria-label="Clear search"
                    >
                      <X size={13} strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
