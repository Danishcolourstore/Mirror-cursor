import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Mail, Phone, ArrowRight, Users } from 'lucide-react'
import { useEventsStore } from '../../stores/eventsStore'
import { useStudioStore } from '../../stores/studioStore'
import EmptyState from '../../components/ui/EmptyState'
import { cn } from '../../lib/cn'
import { formatDateShort, formatCurrency } from '../../lib/format'

export default function Clients() {
  const { events } = useEventsStore()
  const openNewEvent = useStudioStore((s) => s.openNewEvent)
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  const filtered = events.filter((e) => {
    const q = query.toLowerCase()
    return (
      !q ||
      e.client.name.toLowerCase().includes(q) ||
      e.couple.brideName.toLowerCase().includes(q) ||
      e.couple.groomName.toLowerCase().includes(q) ||
      e.venue.city.toLowerCase().includes(q)
    )
  })

  const totalRevenue = events.reduce((acc, e) => acc + e.package.paid, 0)
  const totalPending = events.reduce((acc, e) => acc + (e.package.price - e.package.paid), 0)

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-canvas pb-24 lg:pb-0">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-muted bg-canvas sticky top-0 z-10">
        <div className="relative">
          <Search size={13} strokeWidth={1.5} className="absolute left-3 top-1/2 -translate-y-1/2 text-whisper" />
          <input
            type="text"
            placeholder="Search clients..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="font-sans text-sm text-ink bg-canvas-deep border border-muted pl-8 pr-4 py-2 outline-none focus:border-bronze/40 transition-colors duration-400 w-56"
          />
        </div>
        <span className="font-sans text-[11px] text-whisper uppercase" style={{ letterSpacing: '0.18em' }}>
          {events.length} clients
        </span>
      </div>

      {/* Header */}
      <div className="px-8 pt-10 pb-6">
        <h1 className="serif font-light text-ink" style={{ fontSize: '36px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          <em className="text-bronze" style={{ fontStyle: 'italic' }}>Clients</em>
        </h1>
        <p className="font-sans text-sm text-whisper mt-2">
          Every family that trusted you with their story.
        </p>
      </div>

      {/* Revenue strip */}
      <div className="mx-8 grid grid-cols-2 border-t border-b border-muted divide-x divide-muted mb-8">
        <div className="px-6 py-5">
          <p className="font-sans text-[11px] uppercase text-whisper mb-2" style={{ letterSpacing: '0.18em' }}>
            Total Collected
          </p>
          <p className="serif font-light text-ink leading-none" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
            <em className="text-bronze" style={{ fontStyle: 'italic' }}>
              {formatCurrency(totalRevenue)}
            </em>
          </p>
        </div>
        <div className="px-6 py-5">
          <p className="font-sans text-[11px] uppercase text-whisper mb-2" style={{ letterSpacing: '0.18em' }}>
            Balance Pending
          </p>
          <p className="serif font-light leading-none" style={{ fontSize: '32px', letterSpacing: '-0.02em' }}>
            <span className={totalPending > 0 ? 'text-rose' : 'text-sage'}>
              {formatCurrency(totalPending)}
            </span>
          </p>
        </div>
      </div>

      {/* Client table */}
      <div className="px-8 pb-10">
        {events.length === 0 ? (
          <EmptyState
            icon={<Users size={18} strokeWidth={1.4} />}
            title="No clients yet"
            description="No clients yet. They'll appear here as you book."
            action={{ label: 'New Event', onClick: openNewEvent }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            compact
            title="Nothing matches"
            description={`No clients found for "${query}".`}
            action={{ label: 'Clear search', onClick: () => setQuery(''), variant: 'ghost' }}
          />
        ) : (
        <div className="border border-muted">
          {/* Table header — gap-x keeps column labels visually distinct */}
          <div
            className="grid gap-x-6 gap-y-1 border-b border-muted bg-canvas-deep px-5 py-3"
            style={{
              gridTemplateColumns: 'minmax(120px, 1.15fr) minmax(140px, 1.35fr) minmax(88px, 1fr) minmax(80px, 0.85fr) minmax(88px, 0.85fr) 32px',
            }}
          >
            {(['Client', 'Wedding', 'Package', 'Paid', 'Status'] as const).map((label) => (
              <div key={label} className="min-w-0">
                <p
                  className="font-sans text-[10px] uppercase leading-snug text-whisper"
                  style={{ letterSpacing: '0.16em' }}
                >
                  {label}
                </p>
              </div>
            ))}
            <div className="min-w-0 shrink-0 w-8" aria-hidden />
          </div>

          {filtered.map((event, i) => {
            const paid = event.package.paid >= event.package.price
            return (
              <div
                key={event.id}
                className={cn(
                  'grid cursor-pointer items-center gap-x-6 gap-y-1 px-5 py-4 transition-colors duration-400 hover:bg-canvas-deep group',
                  i < filtered.length - 1 && 'border-b border-muted'
                )}
                style={{
                  gridTemplateColumns: 'minmax(120px, 1.15fr) minmax(140px, 1.35fr) minmax(88px, 1fr) minmax(80px, 0.85fr) minmax(88px, 0.85fr) 32px',
                }}
                onClick={() => navigate(`/studio/events/${event.id}`)}
              >
                {/* Client */}
                <div>
                  <p className="serif font-normal text-[14px] text-ink leading-tight">{event.client.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <a
                      href={`mailto:${event.client.email}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-whisper/60 hover:text-bronze transition-colors duration-400"
                    >
                      <Mail size={10} strokeWidth={1.5} />
                      <span className="font-sans text-[10px]">Email</span>
                    </a>
                    <a
                      href={`tel:${event.client.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-whisper/60 hover:text-bronze transition-colors duration-400"
                    >
                      <Phone size={10} strokeWidth={1.5} />
                      <span className="font-sans text-[10px]">Call</span>
                    </a>
                  </div>
                </div>

                {/* Wedding */}
                <div>
                  <p className="serif font-normal text-[13px] text-ink-soft">
                    {event.couple.brideName}
                    <em className="text-bronze" style={{ fontStyle: 'italic', fontWeight: 300 }}> & </em>
                    {event.couple.groomName}
                  </p>
                  <p className="font-sans text-[11px] text-whisper mt-0.5">
                    {event.venue.city} · {formatDateShort(event.date.start)}
                  </p>
                </div>

                {/* Package */}
                <p className="font-sans text-[12px] text-ink-soft leading-tight">{event.package.name}</p>

                {/* Paid */}
                <div>
                  <p className="serif font-light text-[15px] text-ink">{formatCurrency(event.package.paid)}</p>
                  {!paid && (
                    <p className="font-sans text-[10px] text-rose mt-0.5">
                      {formatCurrency(event.package.price - event.package.paid)} due
                    </p>
                  )}
                </div>

                {/* Status */}
                <span className={cn(
                  'pill',
                  event.status === 'delivered' ? 'pill-delivered' :
                  event.status === 'editing' ? 'pill-editing' :
                  event.status === 'shooting' ? 'pill-shooting' : 'pill-booked'
                )}>
                  {event.status}
                </span>

                {/* Arrow */}
                <ArrowRight
                  size={13}
                  strokeWidth={1.5}
                  className="text-whisper opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-400"
                />
              </div>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}
