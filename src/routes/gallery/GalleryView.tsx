import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLivePhotos } from '../../data/gallery/useLivePhotos'
import { useGalleryStore } from '../../stores/galleryStore'
import { usePageMeta } from '../../lib/usePageMeta'
import CinematicIntro from '../../components/gallery/CinematicIntro'
import Cover from '../../components/gallery/Cover'
import Prologue from '../../components/gallery/Prologue'
import ChapterIndex from '../../components/gallery/ChapterIndex'
import ChapterCover from '../../components/gallery/ChapterCover'
import PhotoGrid from '../../components/gallery/PhotoGrid'
import ClosingCredits from '../../components/gallery/ClosingCredits'
import TopActions from '../../components/gallery/TopActions'
import StickyNavbar from '../../components/gallery/StickyNavbar'
import FilterBar from '../../components/gallery/FilterBar'
import FavoritesBar from '../../components/gallery/FavoritesBar'
import type { Chapter } from '../../types/event'

function GalleryMeta({ event }: { event: { couple: { brideName: string; groomName: string }; venue: { city: string; location: string }; coverImage: string; directorsNote?: string } }) {
  const names = `${event.couple.brideName} & ${event.couple.groomName}`
  usePageMeta({
    title: `${names} — Mirror Studio`,
    description: event.directorsNote ?? `A wedding gallery by Mirror Studio · ${event.venue.location}, ${event.venue.city}`,
    image: event.coverImage,
    url: window.location.href,
  })
  return null
}

export default function GalleryView() {
  const { slug } = useParams()
  const slugKey = slug?.trim() ?? ''
  const { data: gallery, isPending, isError, refetch } = useLivePhotos(slug)
  const favoritedIds = useGalleryStore((s) => s.favoritedIds)

  // Hooks must be before any conditional return
  const [introDismissed, setIntroDismissed] = useState(false)
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [galleryProgress, setGalleryProgress] = useState(0)
  const [showStudioName, setShowStudioName] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const coverSentinelRef = useRef<HTMLDivElement>(null)
  const midpointSentinelRef = useRef<HTMLDivElement>(null)

  const event = gallery?.event
  const resolvedChapters = gallery?.resolvedChapters ?? []
  const liveChapters = gallery?.liveChapters ?? []

  useEffect(() => {
    if (introDismissed || !event) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [introDismissed, event])

  useEffect(() => {
    if (introDismissed || !event) return
    const t = window.setTimeout(() => setIntroDismissed(true), 5000)
    return () => window.clearTimeout(t)
  }, [introDismissed, event])

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = window.requestAnimationFrame(() => {
        const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
        setGalleryProgress(Math.min(window.scrollY / max, 1))
        raf = 0
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) window.cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const onLightbox = (evt: Event) => {
      const detail = (evt as CustomEvent<{ open: boolean }>).detail
      setLightboxOpen(Boolean(detail?.open))
    }
    window.addEventListener('mirror-lightbox-open-change', onLightbox as EventListener)
    return () => window.removeEventListener('mirror-lightbox-open-change', onLightbox as EventListener)
  }, [])

  const livePhotoIds = liveChapters.flatMap((ch) => ch.photos.map((p) => p.id))

  const totalPhotoCount = liveChapters.reduce((s, ch) => s + ch.photos.length, 0)
  const favoritedCount = liveChapters.reduce(
    (s, ch) => s + ch.photos.filter((p) => favoritedIds.includes(p.id)).length,
    0
  )

  const isFiltered = showFavoritesOnly || searchQuery.trim().length > 0

  const displayChapters = liveChapters
    .map((ch) => {
      let photos = ch.photos
      if (showFavoritesOnly) {
        photos = photos.filter((p) => favoritedIds.includes(p.id))
      }
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase()
        const chapterMatches = ch.title.toLowerCase().includes(q)
        photos = chapterMatches
          ? photos
          : photos.filter((p) => p.caption?.toLowerCase().includes(q))
      }
      return { ...ch, photos }
    })
    .filter((ch) => !isFiltered || ch.photos.length > 0)

  const handleChapterSelect = (chapter: Chapter) => {
    const el = document.getElementById(`chapter-${chapter.id}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const coupleNames = event ? `${event.couple.brideName} & ${event.couple.groomName}` : ''
  const midpointInsertIndex = Math.max(0, Math.floor(displayChapters.length / 2))

  useEffect(() => {
    const sentinel = midpointSentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShowStudioName(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [displayChapters.length])

  if (!slugKey) {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <p className="serif italic text-whisper text-base mb-6">
            This gallery doesn't exist yet.
          </p>
          <a
            href="/studio/overview"
            className="font-sans text-[11px] uppercase text-inverse-fg/40 hover:text-inverse-fg/70 transition-colors duration-400"
            style={{ letterSpacing: '0.22em' }}
          >
            Return to Studio
          </a>
        </div>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center">
        <p className="serif italic text-whisper text-base">Opening gallery…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center">
        <div className="text-center px-6 max-w-md">
          <p className="serif italic text-whisper text-base mb-6">
            We couldn't load this gallery right now.
          </p>
          <button
            type="button"
            onClick={() => void refetch()}
            className="font-sans text-[11px] uppercase text-bronze hover:text-bronze-deep transition-colors duration-400"
            style={{ letterSpacing: '0.22em' }}
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (!gallery || !event) {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center">
        <div className="text-center px-6">
          <p className="serif italic text-whisper text-base mb-6">
            This gallery doesn't exist yet.
          </p>
          <a
            href="/studio/overview"
            className="font-sans text-[11px] uppercase text-inverse-fg/40 hover:text-inverse-fg/70 transition-colors duration-400"
            style={{ letterSpacing: '0.22em' }}
          >
            Return to Studio
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      {!introDismissed && (
        <CinematicIntro
          key={event.slug}
          event={event}
          onCompleted={() => setIntroDismissed(true)}
        />
      )}

      <div className="min-h-screen bg-canvas">
        <GalleryMeta event={event} />
        {showStudioName && (
          <div
            className="fixed left-3 top-3 z-30 serif italic text-ink-soft"
            style={{ opacity: 0.6, fontSize: '12px', transition: 'opacity 320ms ease' }}
          >
            Mirror Studio
          </div>
        )}

        {/* Sticky action navbar — appears after cover scrolls away */}
        <StickyNavbar
          coupleNames={coupleNames}
          totalPhotoCount={totalPhotoCount}
          favoritedCount={favoritedCount}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly((v) => !v)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchOpen={searchOpen}
          onSearchToggle={() => setSearchOpen((v) => !v)}
          sentinelRef={coverSentinelRef}
        />

        {/* 1. Cover */}
        <Cover event={event} />

        {/* Sentinel observed by StickyNavbar — directly after cover scroll height */}
        <div
          ref={coverSentinelRef}
          className="pointer-events-none h-px w-full shrink-0 opacity-0"
          aria-hidden
        />

        {/* 2. Prologue */}
        {event.directorsNote && (
          <Prologue note={event.directorsNote} />
        )}

        {/* 3. Chapter index */}
        <ChapterIndex
          chapters={resolvedChapters}
          onSelect={handleChapterSelect}
        />

        {/* 3b. Filter bar — between chapter index and first chapter */}
        {liveChapters.length > 0 && (
          <FilterBar
            chapters={liveChapters}
            favoritedCount={favoritedCount}
            favoritesOnly={showFavoritesOnly}
            onFavoritesOnlyChange={setShowFavoritesOnly}
          />
        )}

        {/* 4. Live chapters (possibly filtered) */}
        {displayChapters.map((chapter, chapterIdx) => (
          <div key={chapter.id} id={`chapter-${chapter.id}`}>
            {chapterIdx === midpointInsertIndex && (
              <div ref={midpointSentinelRef} className="h-px w-full opacity-0" aria-hidden />
            )}
            <ChapterCover chapter={chapter} />
            {chapter.photos.length > 0 && (
              <PhotoGrid photos={chapter.photos} />
            )}
          </div>
        ))}

        {/* Empty-state when filter returns nothing */}
        {isFiltered && displayChapters.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
            <p className="serif italic text-whisper text-base mb-2">No photos match</p>
            <button
              onClick={() => { setShowFavoritesOnly(false); setSearchQuery('') }}
              className="font-sans text-[11px] uppercase text-bronze hover:text-bronze-deep transition-colors duration-300"
              style={{ letterSpacing: '0.18em' }}
            >
              Clear filter
            </button>
          </div>
        )}

        {/* 5. Closing credits */}
        <ClosingCredits event={event} />

        {/* 6. Floating actions */}
        <TopActions event={event} />
        <FavoritesBar
          slug={event.slug}
          galleryPhotoIds={livePhotoIds}
          showFavoritesOnly={showFavoritesOnly}
          onToggleView={() => setShowFavoritesOnly((v) => !v)}
        />
        {!lightboxOpen && favoritedCount === 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-20 h-px bg-canvas-deep">
            <div
              className="h-px origin-left bg-bronze"
              style={{ transform: `scaleX(${galleryProgress})`, transition: 'transform 80ms linear' }}
            />
          </div>
        )}
      </div>
    </>
  )
}
