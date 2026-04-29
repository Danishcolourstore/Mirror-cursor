import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Event } from '../../types/event'
import { formatDate } from '../../lib/format'
import { collectCinematicIntroPhotoUrls } from './cinematicIntroPhotos'

const DARK_DURATION_S = 0.6
const TITLE_HOLD_BEFORE_FADE_MS = 1900
const TITLE_TRANSITION_IN_S = 0.8
const TITLE_TRANSITION_OUT_S = 0.6
/** 1900 ms (fade-in + hold) + 600 ms fade-out = 2500 ms title card. */
const TITLE_TOTAL_MS =
  TITLE_HOLD_BEFORE_FADE_MS + TITLE_TRANSITION_OUT_S * 1000
const SLIDE_MS = 4000
const CROSSFADE_S = 1.2
const WHITE_DURATION_S = 0.8
const SWIPE_DOWN_PX = 70

function markGalleryOpened(slug: string): void {
  try {
    localStorage.setItem(`gallery-opened-${slug}`, 'true')
  } catch {
    /* ignore */
  }
}

type Phase = 'dark' | 'title' | 'slides' | 'white'

type Props = {
  slug: string
  event: Event
  onCompleted: () => void
}

export default function CinematicIntro({ slug, event, onCompleted }: Props) {
  const photos = useMemo(() => collectCinematicIntroPhotoUrls(event), [event])

  const [phase, setPhase] = useState<Phase>('dark')
  const [titleStage, setTitleStage] = useState<'in' | 'out'>('in')
  const [slideIndex, setSlideIndex] = useState(0)
  const finishingRef = useRef(false)
  const touchStartYRef = useRef<number | null>(null)
  const timersRef = useRef<Array<ReturnType<typeof setTimeout>>>([])

  const coupleLine = `${event.couple.brideName} & ${event.couple.groomName}`
  const weddingDateLine = formatDate(event.date.start)

  const finalize = useCallback(() => {
    if (finishingRef.current) return
    finishingRef.current = true
    timersRef.current.forEach((t) => clearTimeout(t))
    timersRef.current = []
    setPhase('white')
  }, [])

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => clearTimeout(t))
    }
  }, [])

  useEffect(() => {
    const nextUrl = photos[slideIndex + 1]
    if (!nextUrl) return
    const img = new Image()
    img.src = nextUrl
  }, [photos, slideIndex])

  useEffect(() => {
    if (phase !== 'title') return undefined
    setTitleStage('in')
    const fadeOutTimer = window.setTimeout(() => {
      setTitleStage('out')
    }, TITLE_HOLD_BEFORE_FADE_MS)
    const slidesTimer = window.setTimeout(() => {
      setPhase('slides')
    }, TITLE_TOTAL_MS)
    timersRef.current.push(fadeOutTimer, slidesTimer)
    return () => {
      clearTimeout(fadeOutTimer)
      clearTimeout(slidesTimer)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'slides') return undefined
    if (photos.length === 0) {
      finalize()
      return undefined
    }
    const id = window.setInterval(() => {
      setSlideIndex((prev) => {
        const next = prev + 1
        if (next >= photos.length) {
          window.clearInterval(id)
          finalize()
          return prev
        }
        return next
      })
    }, SLIDE_MS)
    return () => window.clearInterval(id)
  }, [phase, photos.length, finalize])

  const skipLinkVisible = phase === 'slides' && slideIndex >= 2

  const handleEnterGalleryClick = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    finalize()
  }

  const onTouchStart = (e: React.TouchEvent) => {
    if (touchStartYRef.current !== null) return
    touchStartYRef.current = e.touches[0]?.clientY ?? null
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartYRef.current
    touchStartYRef.current = null
    if (start === null) return
    const dy = e.changedTouches[0].clientY - start
    if (dy > SWIPE_DOWN_PX) finalize()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[120] bg-black"
      aria-hidden={phase === 'white'}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {phase === 'dark' && (
        <motion.div
          className="absolute inset-0 z-50 bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: DARK_DURATION_S,
            ease: [0.42, 0, 0.58, 1],
          }}
          onAnimationComplete={() => setPhase('title')}
        />
      )}

      <AnimatePresence>
        {phase === 'title' && (
          <motion.div
            key="title-card"
            className="pointer-events-none absolute inset-0 z-[60] flex flex-col items-center justify-center px-8 text-center"
            initial={{ opacity: 0 }}
            animate={{
              opacity: titleStage === 'in' ? 1 : 0,
            }}
            transition={{
              duration:
                titleStage === 'in' ? TITLE_TRANSITION_IN_S : TITLE_TRANSITION_OUT_S,
              ease: [0.42, 0, 0.58, 1],
            }}
          >
            <h1
              className="max-w-[90vw] text-balance text-4xl font-medium italic text-white sm:text-5xl md:text-6xl"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {coupleLine}
            </h1>
            <p className="mt-6 font-sans text-sm font-light text-white/95 sm:text-base">
              {weddingDateLine}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {(phase === 'slides' || phase === 'white') && photos.length > 0 && (
        <div className="absolute inset-0 z-40 overflow-hidden">
          <AnimatePresence mode="sync" initial={false}>
            {(phase === 'slides' || phase === 'white') && photos[slideIndex] && (
              <motion.div
                key={`slide-${slideIndex}-${photos[slideIndex]}`}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: phase === 'white' ? 0 : 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: phase === 'white' ? 0.4 : CROSSFADE_S,
                  ease: [0.42, 0, 0.58, 1],
                }}
              >
                <motion.div
                  className="absolute inset-0 origin-center will-change-transform"
                  initial={false}
                  animate={{ scale: [1, 1.04] }}
                  transition={{
                    duration: 4,
                    ease: 'easeInOut',
                    times: [0, 1],
                  }}
                >
                  <img
                    src={photos[slideIndex]}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <AnimatePresence>
        {skipLinkVisible && (
          <motion.div
            key="enter-gallery"
            className="pointer-events-auto absolute bottom-10 left-0 right-0 z-[70] flex justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.42, 0, 0.58, 1] }}
          >
            <button
              type="button"
              onClick={handleEnterGalleryClick}
              className="font-sans text-sm text-white/70 transition-opacity hover:text-white/90"
            >
              Enter Gallery
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'white' && (
          <motion.div
            key="white-curtain"
            className="pointer-events-none absolute inset-0 z-[100] bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: WHITE_DURATION_S,
              ease: [0.42, 0, 0.58, 1],
            }}
            onAnimationComplete={() => {
              markGalleryOpened(slug)
              onCompleted()
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}
