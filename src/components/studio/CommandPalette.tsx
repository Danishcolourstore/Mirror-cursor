import { useMemo, useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, X, Calendar, Image, Users, ArrowRight } from 'lucide-react'
import { useEventsStore } from '../../stores/eventsStore'
import { cn } from '../../lib/cn'
import { formatDateShort } from '../../lib/format'

type ResultKind = 'event' | 'gallery' | 'client' | 'photo'

type PaletteResult = {
  id: string
  kind: ResultKind
  title: string
  meta: string
  href: string
  status?: string
}

/** Static mock photography hits shown when palette opens or matches “photo” searches */
const MOCK_PALETTE_PHOTOS: PaletteResult[] = [
  {
    id: 'ph-mock-1',
    kind: 'photo',
    title: 'Courtyard silhouette — doorway',
    meta: 'Chapter I · Portrait · Samode Palace',
    href: '/g/ananya-rohan',
  },
  {
    id: 'ph-mock-2',
    kind: 'photo',
    title: 'Tea light tables before entry',
    meta: 'Reception sketch · Taj Lake Palace',
    href: '/g/priya-arjun',
  },
  {
    id: 'ph-mock-3',
    kind: 'photo',
    title: 'Morning light across the railing',
    meta: 'Haldi candids · archival frame',
    href: '/g/ananya-rohan',
  },
]

const statusClass: Record<string, string> = {
  booked: 'pill-booked',
  shooting: 'pill-shooting',
  editing: 'pill-editing',
  delivered: 'pill-delivered',
}

type CommandPaletteProps = {
  open: boolean
  onClose: () => void
}

export default function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const { events } = useEventsStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (open) {
      setQuery('')
      setActiveIdx(0)
      setTimeout(() => inputRef.current?.focus(), 45)
    }
  }, [open])

  const results: PaletteResult[] = useMemo(() => {
    const q = query.toLowerCase().trim()
    const out: PaletteResult[] = []

    for (const ev of events) {
      const couple = `${ev.couple.brideName} & ${ev.couple.groomName}`
      const coupleFull = `${ev.couple.brideName} ${ev.couple.groomName}`.toLowerCase()

      if (!q || coupleFull.includes(q) || ev.venue.city.toLowerCase().includes(q)) {
        out.push({
          id: `ev-${ev.id}`,
          kind: 'event',
          title: couple,
          meta: `${ev.venue.city} · ${formatDateShort(ev.date.start)}`,
          href: `/studio/events/${ev.id}`,
          status: ev.status,
        })
      }

      if (
        ev.status === 'delivered' &&
        (!q || coupleFull.includes(q))
      ) {
        out.push({
          id: `gal-${ev.id}`,
          kind: 'gallery',
          title: couple,
          meta: `/g/${ev.slug}`,
          href: `/g/${ev.slug}`,
        })
      }

      const clientHits =
        ev.client.name.toLowerCase().includes(q) ||
        ev.client.email.toLowerCase().includes(q)
      if (!q || clientHits) {
        out.push({
          id: `cl-${ev.id}`,
          kind: 'client',
          title: ev.client.name,
          meta: `${couple}`,
          href: `/studio/events/${ev.id}`,
        })
      }
    }

    for (const p of MOCK_PALETTE_PHOTOS) {
      if (
        !q ||
        q.includes('photo') ||
        q.includes('pho') ||
        p.title.toLowerCase().includes(q) ||
        p.meta.toLowerCase().includes(q)
      ) {
        out.push(p)
      }
    }

    const seen = new Set<string>()
    return out.filter((r) =>
      seen.has(r.id + r.href) ? false : (seen.add(r.id + r.href), true)
    ).slice(0, 14)
  }, [events, query])

  useEffect(() => {
    setActiveIdx((idx) =>
      results.length === 0 ? 0 : Math.min(idx, Math.max(results.length - 1, 0))
    )
  }, [results.length])

  const go = useCallback(
    (href: string) => {
      navigate(href)
      onClose()
    },
    [navigate, onClose]
  )

  const onKeyNavigate = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
      }
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault()
        setActiveIdx((i) =>
          Math.min(i + 1, Math.max(0, results.length - 1))
        )
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault()
        setActiveIdx((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && results[activeIdx]) {
        go(results[activeIdx].href)
      }
    },
    [activeIdx, go, results]
  )

  const glyph = (k: PaletteResult['kind']) => {
    if (k === 'event') return <Calendar size={12} strokeWidth={1.5} className="text-whisper" />
    if (k === 'gallery') return <Image size={12} strokeWidth={1.5} className="text-whisper" />
    if (k === 'photo') return <Image size={12} strokeWidth={1.5} className="text-bronze/70" />
    return <Users size={12} strokeWidth={1.5} className="text-whisper" />
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[55] bg-night/35"
            style={{ backdropFilter: 'blur(3px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          <motion.div
            data-command-palette
            className="fixed z-[56] left-1/2 -translate-x-1/2 top-16 sm:top-20 w-[min(560px,calc(100vw-32px))]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: [0.2, 0.6, 0.2, 1] }}
          >
            <div
              className="border border-muted overflow-hidden flex flex-col bg-canvas"
              style={{
                boxShadow: '0 20px 48px rgba(0,0,0,0.1)',
              }}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b border-muted shrink-0">
                <Search size={14} strokeWidth={1.5} className="text-whisper shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setActiveIdx(0)
                  }}
                  onKeyDown={onKeyNavigate}
                  placeholder="Search events, clients, photographs…"
                  className="flex-1 min-w-0 bg-transparent outline-none placeholder:text-whisper font-sans text-sm text-ink font-normal"
                  style={{ letterSpacing: '0.01em' }}
                />
                {query !== '' && (
                  <button
                    type="button"
                    aria-label="Clear"
                    className="text-whisper hover:text-ink-soft"
                    onClick={() => setQuery('')}
                  >
                    <X size={13} strokeWidth={1.5} />
                  </button>
                )}
                <kbd className="hidden sm:inline font-sans text-[10px] text-whisper border border-muted px-1.5 py-0.5">
                  ESC
                </kbd>
              </div>

              {results.length > 0 ? (
                <ul className="max-h-[52vh] overflow-y-auto scrollbar-hide divide-y divide-muted">
                  {results.map((r, idx) => (
                    <li key={r.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIdx(idx)}
                        onClick={() => go(r.href)}
                        className={cn(
                          'w-full text-left px-4 py-3 flex items-start gap-3 transition-colors duration-150',
                          idx === activeIdx ? 'bg-canvas-deep' : 'hover:bg-canvas-deep/70'
                        )}
                      >
                        <span className="mt-1 shrink-0">{glyph(r.kind)}</span>
                        <span className="flex-1 min-w-0">
                          <span
                            className="block serif font-normal text-[15px] text-ink leading-snug truncate"
                            style={{ letterSpacing: '-0.015em' }}
                          >
                            {r.title}
                          </span>
                          <span className="block font-sans text-[11px] text-whisper mt-1 truncate font-normal">
                            {r.meta}
                          </span>
                        </span>
                        {r.status ? (
                          <span className={cn('pill shrink-0 text-[10px]', statusClass[r.status] ?? '')}>
                            {r.status}
                          </span>
                        ) : (
                          <ArrowRight
                            size={12}
                            strokeWidth={1.5}
                            className="text-whisper/50 shrink-0 mt-1"
                          />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-12 px-4 text-center">
                  <p className="serif italic text-whisper text-sm">Nothing matches quite yet.</p>
                </div>
              )}

              <div className="shrink-0 flex flex-wrap gap-x-4 gap-y-1 px-4 py-2 border-t border-muted font-sans text-[10px] text-whisper">
                <span>
                  <kbd className="border border-muted px-1 py-px mr-1">↑</kbd>
                  <kbd className="border border-muted px-1 py-px mr-1">↓</kbd>
                  <kbd className="border border-muted px-1 py-px mr-1">j</kbd>
                  <kbd className="border border-muted px-1 py-px mr-1">k</kbd>
                  Navigate
                </span>
                <span>
                  <kbd className="border border-muted px-1 py-px mr-1">↵</kbd>
                  Open
                </span>
                <span>
                  <kbd className="border border-muted px-1 py-px mr-1">Esc</kbd>
                  Close
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
