import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/cn'
import { toRoman } from '../../lib/format'
import type { Chapter } from '../../types/event'

type GalleryNavProps = {
  chapters: Chapter[]
  coupleNames: string
}

export default function GalleryNav({ chapters, coupleNames }: GalleryNavProps) {
  const [visible, setVisible] = useState(false)
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null)
  const [scrollPct, setScrollPct] = useState(0)

  const liveChapters = chapters.filter((c) => c.status === 'live')

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight

      setVisible(scrollY > window.innerHeight * 0.8)
      setScrollPct(docH > 0 ? (scrollY / docH) * 100 : 0)

      // Detect which chapter section is in view
      let current: Chapter | null = null
      for (const ch of liveChapters) {
        const el = document.getElementById(`chapter-${ch.id}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.4) {
            current = ch
          }
        }
      }
      setActiveChapter(current)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [liveChapters])

  const scrollToChapter = (ch: Chapter) => {
    const el = document.getElementById(`chapter-${ch.id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.header
          className="fixed top-0 inset-x-0 z-40"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
        >
          {/* Progress bar — very top */}
          <div className="h-[1px] bg-night/8 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-bronze/60 transition-all duration-200"
              style={{ width: `${scrollPct}%` }}
            />
          </div>

          {/* Nav bar */}
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{
              background: 'rgba(246,241,232,0.88)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid rgba(217,208,190,0.6)',
            }}
          >
            {/* Studio / couple name */}
            <p className="serif font-light text-ink-soft text-sm leading-none" style={{ letterSpacing: '-0.01em' }}>
              {coupleNames}
            </p>

            {/* Chapter pills — desktop */}
            <div className="hidden sm:flex items-center gap-1">
              {liveChapters.map((ch) => {
                const isActive = activeChapter?.id === ch.id
                return (
                  <button
                    key={ch.id}
                    onClick={() => scrollToChapter(ch)}
                    className={cn(
                      'font-sans text-[10px] uppercase px-3 py-1.5 transition-all duration-400',
                      isActive
                        ? 'bg-fill text-on-fill'
                        : 'text-whisper hover:text-ink-soft'
                    )}
                    style={{ letterSpacing: '0.16em' }}
                  >
                    <span className="serif italic text-bronze mr-1">{toRoman(ch.number)}</span>
                    {ch.title.replace('The ', '')}
                  </button>
                )
              })}
            </div>

            {/* Active chapter — mobile only */}
            <div className="sm:hidden">
              {activeChapter && (
                <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.16em' }}>
                  <span className="serif italic text-bronze mr-1">{toRoman(activeChapter.number)}</span>
                  {activeChapter.title.replace('The ', '')}
                </p>
              )}
            </div>

            {/* Scroll % */}
            <p className="font-sans text-[10px] text-whisper/50" style={{ letterSpacing: '0.14em' }}>
              {Math.round(scrollPct)}%
            </p>
          </div>
        </motion.header>
      )}
    </AnimatePresence>
  )
}
