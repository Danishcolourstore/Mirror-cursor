import { useParams } from 'react-router-dom'
import { useEventsStore } from '../../stores/eventsStore'
import { usePageMeta } from '../../lib/usePageMeta'
import Cover from '../../components/gallery/Cover'
import Prologue from '../../components/gallery/Prologue'
import ChapterIndex from '../../components/gallery/ChapterIndex'
import ChapterCover from '../../components/gallery/ChapterCover'
import PhotoGrid from '../../components/gallery/PhotoGrid'
import ClosingCredits from '../../components/gallery/ClosingCredits'
import TopActions from '../../components/gallery/TopActions'
import GalleryNav from '../../components/gallery/GalleryNav'
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
  const { getEventBySlug } = useEventsStore()

  const event = getEventBySlug(slug ?? '')

  if (!event) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#14110D' }}
      >
        <div className="text-center px-6">
          <p className="serif italic text-whisper text-base mb-6">
            This gallery doesn't exist yet.
          </p>
          <a
            href="/studio/overview"
            className="font-sans text-[11px] uppercase text-canvas/40 hover:text-canvas/70 transition-colors duration-400"
            style={{ letterSpacing: '0.22em' }}
          >
            Return to Studio
          </a>
        </div>
      </div>
    )
  }

  // Resolve chapter visibility: auto-unlock scheduled chapters whose date has passed
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const resolvedChapters = event.chapters.map((c) => {
    if (c.status === 'scheduled' && c.unlockDate) {
      const unlock = new Date(c.unlockDate)
      unlock.setHours(0, 0, 0, 0)
      if (unlock <= today) return { ...c, status: 'live' as const }
    }
    return c
  })

  const liveChapters = resolvedChapters.filter((c) => c.status === 'live')

  const handleChapterSelect = (chapter: Chapter) => {
    const el = document.getElementById(`chapter-${chapter.id}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const coupleNames = `${event.couple.brideName} & ${event.couple.groomName}`

  return (
    <div
      className="min-h-screen"
      style={{ background: '#F6F1E8' }}
    >
      <GalleryMeta event={event} />

      {/* Sticky chapter navigation — appears after cover */}
      <GalleryNav chapters={resolvedChapters} coupleNames={coupleNames} />

      {/* 1. Cover */}
      <Cover event={event} />

      {/* 2. Prologue — only if director's note exists */}
      {event.directorsNote && (
        <Prologue note={event.directorsNote} />
      )}

      {/* 3. Chapter index — uses resolved statuses */}
      <ChapterIndex
        chapters={resolvedChapters}
        onSelect={handleChapterSelect}
      />

      {/* 4. Each live chapter */}
      {liveChapters.map((chapter) => (
        <div key={chapter.id} id={`chapter-${chapter.id}`}>
          {/* Chapter cover card */}
          <ChapterCover chapter={chapter} />

          {/* Photo grid — only if photos exist */}
          {chapter.photos.length > 0 && (
            <PhotoGrid photos={chapter.photos} />
          )}
        </div>
      ))}

      {/* 5. Closing credits */}
      <ClosingCredits event={event} />

      {/* 6. Floating actions */}
      <TopActions event={event} />
    </div>
  )
}
