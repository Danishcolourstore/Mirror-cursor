import { useState } from 'react'
import { Plus, Search, Calendar } from 'lucide-react'
import { useEventsStore } from '../../stores/eventsStore'
import { useStudioStore } from '../../stores/studioStore'
import EventCard from '../../components/studio/EventCard'
import EmptyState from '../../components/ui/EmptyState'
import { cn } from '../../lib/cn'
import type { EventStatus } from '../../types/event'

const filters: { label: string; value: EventStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Booked', value: 'booked' },
  { label: 'Shooting', value: 'shooting' },
  { label: 'Editing', value: 'editing' },
  { label: 'Delivered', value: 'delivered' },
]

export default function Events() {
  const { events } = useEventsStore()
  const { openNewEvent } = useStudioStore()
  const [activeFilter, setActiveFilter] = useState<EventStatus | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = events.filter((e) => {
    const matchStatus = activeFilter === 'all' || e.status === activeFilter
    const q = query.toLowerCase()
    const matchQuery =
      !q ||
      e.couple.brideName.toLowerCase().includes(q) ||
      e.couple.groomName.toLowerCase().includes(q) ||
      e.venue.city.toLowerCase().includes(q) ||
      e.venue.location.toLowerCase().includes(q)
    return matchStatus && matchQuery
  })

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-canvas pb-24 lg:pb-0">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-muted bg-canvas sticky top-0 z-10">
        <div className="relative">
          <Search
            size={13}
            strokeWidth={1.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-whisper"
          />
          <input
            type="text"
            placeholder="Search events..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-sans text-sm text-ink bg-canvas-deep border border-muted pl-8 pr-4 py-2 outline-none focus:border-bronze/40 transition-colors duration-400 w-56"
            style={{ letterSpacing: '0.01em' }}
          />
        </div>
        <button onClick={openNewEvent} className="btn-ink flex items-center gap-2">
          <Plus size={12} strokeWidth={2} />
          <span>New Event</span>
        </button>
      </div>

      {/* Page header */}
      <div className="px-8 pt-10 pb-6">
        <h1
          className="serif font-light text-ink"
          style={{ fontSize: '36px', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          All <em className="text-bronze" style={{ fontStyle: 'italic' }}>Events</em>
        </h1>
        <p className="font-sans text-sm text-whisper mt-2">
          {events.length} weddings in your studio
        </p>
      </div>

      {/* Filter strip */}
      <div className="px-8 flex items-center gap-0 border-b border-muted mb-8">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={cn(
              'font-sans text-[11px] uppercase px-4 py-3 border-b-2 transition-colors duration-400',
              activeFilter === f.value
                ? 'border-ink text-ink'
                : 'border-transparent text-whisper hover:text-ink-soft'
            )}
            style={{ letterSpacing: '0.18em' }}
          >
            {f.label}
          </button>
        ))}
        <span className="ml-auto font-sans text-[11px] text-whisper pb-3">
          {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        </span>
      </div>

      {/* Events grid */}
      <div className="px-8 pb-10">
        {filtered.length === 0 ? (
          events.length === 0 ? (
            <EmptyState
              icon={<Calendar size={18} strokeWidth={1.4} />}
              title="No weddings yet"
              description="No weddings yet. The first one waits."
              action={{ label: 'New Event', onClick: openNewEvent }}
            />
          ) : (
            <EmptyState
              compact
              title="Nothing matches"
              description={
                query
                  ? `No events found for "${query}"${activeFilter !== 'all' ? ` in ${activeFilter}` : ''}.`
                  : `No events with status "${activeFilter}" yet.`
              }
              action={{ label: 'Clear filters', onClick: () => { setQuery(''); setActiveFilter('all') }, variant: 'ghost' }}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
