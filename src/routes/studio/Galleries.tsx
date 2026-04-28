import { Link } from 'react-router-dom'
import { ExternalLink, Eye, Heart, BookOpen, Image as ImageIcon } from 'lucide-react'
import { useEventsStore } from '../../stores/eventsStore'
import { useStudioStore } from '../../stores/studioStore'
import EmptyState from '../../components/ui/EmptyState'
import { cn } from '../../lib/cn'
import { formatDateShort } from '../../lib/format'

export default function Galleries() {
  const { events } = useEventsStore()
  const openNewEvent = useStudioStore((s) => s.openNewEvent)

  // Only events with at least one live chapter
  const galleriesAll = events.map((event) => {
    const liveChapters = event.chapters.filter((c) => c.status === 'live')
    const totalViews = event.chapters.reduce(
      (acc, c) => acc + c.photos.reduce((a, p) => a + p.views, 0),
      0
    )
    const totalFaves = event.chapters.reduce(
      (acc, c) => acc + c.photos.filter((p) => p.favorited).length,
      0
    )
    return { event, liveChapters, totalViews, totalFaves }
  })

  const live = galleriesAll.filter((g) => g.liveChapters.length > 0)
  const draft = galleriesAll.filter((g) => g.liveChapters.length === 0)

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-canvas pb-24 lg:pb-0">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-muted bg-canvas sticky top-0 z-10">
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <span className="font-sans text-[11px] text-whisper uppercase" style={{ letterSpacing: '0.18em' }}>
            {live.length} live · {draft.length} in progress
          </span>
        </div>
      </div>

      {/* Header */}
      <div className="px-8 pt-10 pb-8">
        <h1 className="serif font-light text-ink" style={{ fontSize: '36px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          All <em className="text-bronze" style={{ fontStyle: 'italic' }}>Galleries</em>
        </h1>
        <p className="font-sans text-sm text-whisper mt-2">
          Every gallery you've published — seen through your clients' eyes.
        </p>
      </div>

      {/* Empty state when nothing exists */}
      {live.length === 0 && draft.length === 0 && (
        <div className="px-8 pb-10">
          <EmptyState
            icon={<ImageIcon size={18} strokeWidth={1.4} />}
            title="No galleries yet"
            description="No galleries yet. Each gallery becomes a chapter of your story."
            action={{ label: 'New Event', onClick: openNewEvent }}
          />
        </div>
      )}

      {/* Live galleries */}
      {live.length > 0 && (
        <div className="px-8 pb-10">
          <p className="font-sans text-[10px] uppercase text-whisper mb-5" style={{ letterSpacing: '0.22em' }}>
            Live
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {live.map(({ event, totalViews, totalFaves }) => (
              <div
                key={event.id}
                className="rounded-lg overflow-hidden border border-muted bg-canvas shadow-card group"
              >
                {/* Cover */}
                <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                  <img
                    src={event.coverImage}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />

                  {/* Open gallery link — overlay */}
                  <Link
                    to={`/g/${event.slug}`}
                    target="_blank"
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  >
                    <span className="flex items-center gap-2 bg-white/95 border border-muted text-ink px-4 py-2 font-sans text-[11px] uppercase shadow-card" style={{ letterSpacing: '0.18em' }}>
                      <ExternalLink size={11} strokeWidth={1.5} />
                      Open Gallery
                    </span>
                  </Link>

                  {/* Stat badges — bottom of cover */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="flex items-center gap-1 bg-black/50 text-white/90 px-2 py-0.5 font-sans text-[10px]" style={{ backdropFilter: 'blur(4px)' }}>
                      <Eye size={9} strokeWidth={1.5} />
                      {totalViews.toLocaleString('en-IN')}
                    </span>
                    <span className="flex items-center gap-1 bg-black/50 text-white/90 px-2 py-0.5 font-sans text-[10px]" style={{ backdropFilter: 'blur(4px)' }}>
                      <Heart size={9} strokeWidth={1.5} />
                      {totalFaves}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-4 py-4">
                  <h3 className="serif font-normal text-[15px] text-ink leading-tight">
                    {event.couple.brideName}
                    <em className="text-bronze" style={{ fontStyle: 'italic', fontWeight: 300 }}> & </em>
                    {event.couple.groomName}
                  </h3>
                  <p className="font-sans text-[12px] text-whisper mt-1">
                    {event.venue.location}, {event.venue.city}
                  </p>

                  {/* Chapter list */}
                  <div className="mt-3 pt-3 border-t border-muted space-y-1.5">
                    {event.chapters.map((ch) => (
                      <div key={ch.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen size={10} strokeWidth={1.5} className="text-whisper shrink-0" />
                          <p className="serif font-normal text-[12px] text-ink-soft">{ch.title}</p>
                        </div>
                        <span className={cn(
                          'pill text-[9px]',
                          ch.status === 'live' ? 'pill-live' :
                          ch.status === 'scheduled' ? 'pill-booked' :
                          'pill-draft'
                        )}>
                          {ch.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer — copy link */}
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-2 border border-muted bg-canvas px-3 py-2">
                    <span className="font-sans text-[11px] text-whisper/60 flex-1 truncate">
                      mirrrstudio.com/g/{event.slug}
                    </span>
                    <Link
                      to={`/g/${event.slug}`}
                      target="_blank"
                      className="font-sans text-[10px] uppercase text-bronze hover:text-bronze-deep transition-colors duration-400 shrink-0"
                      style={{ letterSpacing: '0.14em' }}
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* In-progress galleries */}
      {draft.length > 0 && (
        <div className="px-8 pb-10">
          <p className="font-sans text-[10px] uppercase text-whisper mb-5" style={{ letterSpacing: '0.22em' }}>
            In Progress
          </p>
          <div className="border border-muted divide-y divide-muted">
            {draft.map(({ event }) => (
              <div key={event.id} className="flex items-center gap-5 px-5 py-4 hover:bg-canvas-deep transition-colors duration-400">
                <div className="w-14 h-10 overflow-hidden shrink-0">
                  <img src={event.coverImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="serif font-normal text-[14px] text-ink leading-tight">
                    {event.couple.brideName}
                    <em className="text-bronze" style={{ fontStyle: 'italic', fontWeight: 300 }}> & </em>
                    {event.couple.groomName}
                  </p>
                  <p className="font-sans text-[11px] text-whisper mt-0.5">
                    {event.venue.city} · {formatDateShort(event.date.start)}
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="w-24 h-[1px] bg-muted relative overflow-hidden">
                    <div className="absolute inset-y-0 left-0 bg-bronze" style={{ width: `${event.progress}%` }} />
                  </div>
                  <p className="font-sans text-[10px] text-whisper mt-1 text-right" style={{ letterSpacing: '0.14em' }}>
                    {event.progress}%
                  </p>
                </div>
                <span className={cn(
                  'pill shrink-0',
                  event.status === 'editing' ? 'pill-editing' :
                  event.status === 'shooting' ? 'pill-shooting' : 'pill-booked'
                )}>
                  {event.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
