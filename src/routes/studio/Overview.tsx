import { Search, Plus } from 'lucide-react'
import { useEventsStore } from '../../stores/eventsStore'
import { useStudioStore } from '../../stores/studioStore'

import { getGreeting } from '../../lib/format'
import StatStrip from '../../components/studio/StatStrip'
import EventCard from '../../components/studio/EventCard'
import DeliveryRow from '../../components/studio/DeliveryRow'
import ActivityFeed from '../../components/studio/ActivityFeed'
import LiveInsights from '../../components/studio/LiveInsights'
import { mockDeliveries } from '../../data/mockActivity'

export default function Overview() {
  const { events } = useEventsStore()
  const { ownerName, openSearch, openNewEvent } = useStudioStore()
  const { greeting, sub } = getGreeting(ownerName)

  // Split greeting to italicise the name
  const nameIndex = greeting.indexOf(ownerName)
  const before = greeting.slice(0, nameIndex)
  const after = greeting.slice(nameIndex + ownerName.length)

  const activeEvents = events.filter((e) => e.status !== 'delivered').length
  const liveGalleries = events.reduce(
    (acc, e) => acc + e.chapters.filter((c) => c.status === 'live').length,
    0
  )
  const pendingDelivery = mockDeliveries.filter(
    (d) => d.status === 'pending' || d.status === 'in-progress'
  ).length
  const quarterRevenue = events.reduce((acc, e) => acc + e.package.price, 0)
  const quarterFormatted =
    quarterRevenue >= 100000
      ? `₹${(quarterRevenue / 100000).toFixed(1)}L`
      : `₹${quarterRevenue}`

  const featuredEvents = events.filter(
    (e) => e.status !== 'booked'
  ).slice(0, 3)

  if (events.length === 0) {
    return (
      <div className="flex-1 flex flex-col min-h-screen bg-canvas pb-24 lg:pb-0">
        <div className="flex items-center justify-end px-8 py-4 border-b border-muted bg-canvas sticky top-0 z-10">
          <button onClick={openNewEvent} className="btn-ink flex items-center gap-2">
            <Plus size={12} strokeWidth={2} />
            <span>New Event</span>
          </button>
        </div>

        <div className="flex-1 px-8 flex items-center justify-center">
          <div className="text-center border border-muted bg-canvas-deep px-8 py-16 w-full max-w-2xl">
            <p className="serif italic text-[40px] text-ink leading-none">
              Begin <span className="text-bronze">→</span>
            </p>
            <p className="serif italic text-whisper text-base mt-4">
              Your studio is ready. Create your first wedding.
            </p>
            <button onClick={openNewEvent} className="btn-ink mt-8">
              New Event
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-canvas pb-24 lg:pb-0">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-muted bg-canvas sticky top-0 z-10">
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <button onClick={openSearch} className="btn-ghost flex items-center gap-2">
            <Search size={12} strokeWidth={1.5} />
            <span>Search</span>
          </button>
          <button onClick={openNewEvent} className="btn-ink flex items-center gap-2">
            <Plus size={12} strokeWidth={2} />
            <span>New Event</span>
          </button>
        </div>
      </div>

      {/* Greeting */}
      <div className="px-8 pt-10 pb-8">
        <h1
          className="serif font-light text-ink"
          style={{ fontSize: '36px', letterSpacing: '-0.02em', lineHeight: 1.1 }}
        >
          {before}
          <em className="text-bronze" style={{ fontStyle: 'italic', fontWeight: 300 }}>
            {ownerName}
          </em>
          {after}
        </h1>
        <p className="font-sans text-sm text-whisper mt-2">{sub}</p>
      </div>

      {/* Stat strip */}
      <div className="mx-8">
        <StatStrip
          stats={[
            { label: 'Active Events', value: String(activeEvents) },
            { label: 'Galleries Live', value: String(liveGalleries) },
            { label: 'Pending Delivery', value: String(pendingDelivery) },
            {
              label: 'This Quarter',
              value: quarterFormatted,
              // Italicise the numeric part only e.g. "79.0" in "₹79.0L"
              emphasis: quarterFormatted.match(/[\d.]+/)?.[0],
            },
          ]}
        />
      </div>

      {/* Events in motion */}
      <div className="px-8 py-10">
        <h2 className="section-title mb-6">
          Events in <em>motion</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-8 divider" />

      {/* On the desk */}
      <div className="px-8 py-10">
        <h2 className="section-title mb-6">
          On the <em>desk</em>
        </h2>

        {/* Table header */}
        <div className="border border-muted">
          <div className="flex items-center gap-4 px-4 py-2 border-b border-muted bg-canvas-deeper">
            <div className="w-36 shrink-0">
              <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.18em' }}>
                Client
              </p>
            </div>
            <div className="flex-1">
              <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.18em' }}>
                Task
              </p>
            </div>
            <div className="w-32 shrink-0 text-right">
              <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.18em' }}>
                Due
              </p>
            </div>
            <div className="w-24 shrink-0 text-center">
              <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.18em' }}>
                Status
              </p>
            </div>
            <div className="w-4 shrink-0" />
          </div>

          {mockDeliveries.map((item, i) => (
            <DeliveryRow
              key={item.id}
              item={item}
              isLast={i === mockDeliveries.length - 1}
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="mx-8 divider" />

      {/* From the galleries */}
      <div className="px-8 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1.4fr_1fr] gap-6">
          <ActivityFeed />
          <LiveInsights />
        </div>
      </div>

    </div>
  )
}
