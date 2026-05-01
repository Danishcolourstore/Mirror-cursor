import { useEffect, useMemo, useState } from 'react'
import type { Event } from '../../types/event'
import { formatVenueMonthYear } from '../../lib/format'

type CoverProps = {
  event: Event
}

export default function Cover({ event }: CoverProps) {
  const { brideName, groomName } = event.couple
  const selectedCoverUrl = (() => {
    if (!event.galleryCoverPhotoId) return event.coverImage
    const all = event.chapters.flatMap((ch) => ch.photos)
    return all.find((p) => p.id === event.galleryCoverPhotoId)?.url ?? event.coverImage
  })()
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768)
  const [imgLoaded, setImgLoaded] = useState(false)
  const coverLine = useMemo(
    () => formatVenueMonthYear(event.venue.location, event.date.start),
    [event.venue.location, event.date.start]
  )
  const overlayAlpha = Math.min(Math.max(event.galleryCoverTintPct ?? 24, 0), 50) / 100
  const coverHeight =
    event.galleryCoverSize === 'small'
      ? '78svh'
      : event.galleryCoverSize === 'medium'
        ? '92svh'
        : '100svh'

  useEffect(() => {
    const media = window.matchMedia('(min-width: 768px)')
    const onChange = () => setIsDesktop(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const preload = document.createElement('link')
    preload.rel = 'preload'
    preload.as = 'image'
    preload.href = selectedCoverUrl
    document.head.appendChild(preload)
    return () => {
      if (preload.parentNode) preload.parentNode.removeChild(preload)
    }
  }, [selectedCoverUrl])

  const handleBegin = () => {
    const firstPhoto = document.querySelector<HTMLElement>('.first-gallery-photo')
    firstPhoto?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{ height: coverHeight, minHeight: '560px' }}
    >
      {!imgLoaded && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(90deg, #1C1814 0%, #2A2318 50%, #1C1814 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2.4s ease-in-out infinite',
          }}
        />
      )}

      <div
        className="absolute inset-0 z-0"
        style={{
          transform: 'scale(1)',
          animation: isDesktop
            ? 'kenBurnsCover 18s cubic-bezier(0.16, 1, 0.3, 1) infinite alternate'
            : 'none',
        }}
      >
        <img
          src={selectedCoverUrl}
          alt={`${brideName} & ${groomName}`}
          className="w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          onLoad={() => setImgLoaded(true)}
          style={{
            opacity: imgLoaded ? 1 : 0,
            transition: 'opacity 320ms cubic-bezier(0.2, 0.6, 0.2, 1)',
          }}
        />
      </div>

      <div
        className="absolute inset-0 z-10"
        style={{
          background: `linear-gradient(180deg, rgba(20,17,13,${overlayAlpha + 0.1}) 0%, rgba(20,17,13,${Math.max(
            overlayAlpha - 0.12,
            0.08
          )}) 40%, rgba(20,17,13,${overlayAlpha + 0.2}) 100%)`,
        }}
      />

      <div className="relative z-20 flex flex-col items-center text-center px-6 select-none">
        <h1
          className="serif italic font-light leading-none"
          style={{
            fontSize: 'clamp(56px, 11vw, 96px)',
            letterSpacing: '-0.01em',
            color: 'rgba(246,241,232,0.95)',
            transition: 'opacity 320ms ease',
          }}
        >
          {brideName} &amp; {groomName}
        </h1>

        <p
          className="serif italic mt-5"
          style={{ fontSize: '14px', opacity: 0.6, color: '#F6F1E8', letterSpacing: '-0.01em' }}
        >
          {coverLine}
        </p>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={handleBegin}
            className="font-sans italic uppercase transition-opacity duration-300 hover:opacity-90"
            style={{ fontSize: '13px', letterSpacing: '0.08em', color: '#8B6F47' }}
          >
            BEGIN
          </button>
          <svg
            width="12"
            height="8"
            viewBox="0 0 12 8"
            fill="none"
            className="text-[#8B6F47]"
            style={{ animation: 'chevronPulse 1.9s ease-in-out infinite', opacity: 0.72 }}
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </section>
  )
}
