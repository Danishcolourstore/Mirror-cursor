import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ArrowRight, ExternalLink, Share2, Copy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../lib/cn'
import { formatDateShort } from '../../lib/format'
import { useToastStore } from '../../stores/toastStore'
import ShareGalleryModal from './ShareGalleryModal'
import type { Event } from '../../types/event'

type EventCardProps = {
  event: Event
}

const statusLabels: Record<Event['status'], string> = {
  booked: 'Booked',
  shooting: 'Shooting',
  editing: 'Editing',
  delivered: 'Delivered',
}

const statusPill: Record<Event['status'], string> = {
  booked: 'pill-booked',
  shooting: 'pill-shooting',
  editing: 'pill-editing',
  delivered: 'pill-delivered',
}

export default function EventCard({ event }: EventCardProps) {
  const navigate = useNavigate()
  const pushToast = useToastStore((s) => s.push)
  const [shareOpen, setShareOpen] = useState(false)
  const [actionsVisible, setActionsVisible] = useState(false)

  const galleryUrl = `${window.location.origin}/g/${event.slug}`

  const copyLink = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(galleryUrl)
      pushToast('Gallery link copied', { detail: galleryUrl, tone: 'success' })
    } catch {
      pushToast('Could not copy link', { tone: 'error' })
    }
  }

  const liveChapters = event.chapters.filter((c) => c.status === 'live').length

  return (
    <>
      <div
        className="border border-muted bg-canvas-deep group cursor-pointer transition-shadow duration-400 hover:shadow-[0_2px_16px_rgba(28,24,20,0.08)] relative"
        onClick={() => navigate(`/studio/events/${event.id}`)}
        onMouseEnter={() => setActionsVisible(true)}
        onMouseLeave={() => setActionsVisible(false)}
      >
        {/* Cover image */}
        <div className="relative overflow-hidden" style={{ aspectRatio: '3/2' }}>
          <img
            src={event.coverImage}
            alt={`${event.couple.brideName} & ${event.couple.groomName}`}
            className="w-full h-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.04]"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-night/50 via-transparent to-transparent" />

          {/* Status pill — top left */}
          <span className={cn('absolute top-3 left-3', statusPill[event.status])}>
            {statusLabels[event.status]}
          </span>

          {/* Gallery / live count badge — top right */}
          {event.status === 'delivered' ? (
            <Link
              to={`/g/${event.slug}`}
              onClick={(e) => e.stopPropagation()}
              className="absolute top-3 right-3 flex items-center gap-1.5 bg-canvas/90 hover:bg-canvas text-ink px-2.5 py-1 transition-colors duration-400"
              style={{ fontSize: '10px', letterSpacing: '0.18em' }}
            >
              <ExternalLink size={9} strokeWidth={1.8} />
              <span className="uppercase font-sans">Gallery</span>
            </Link>
          ) : liveChapters > 0 ? (
            <span className="absolute top-3 right-3 pill bg-canvas/90 text-ink">
              {liveChapters} live
            </span>
          ) : null}

          {/* Hover quick-action bar — slides up from bottom of cover */}
          <AnimatePresence>
            {actionsVisible && (
              <motion.div
                className="absolute bottom-0 inset-x-0 flex items-center gap-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25, ease: [0.2, 0.6, 0.2, 1] }}
              >
                {/* Share */}
                <button
                  onClick={(e) => { e.stopPropagation(); setShareOpen(true) }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-night/80 text-inverse-fg/75 hover:text-inverse-fg hover:bg-night transition-all duration-300 font-sans text-[10px] uppercase"
                  style={{ backdropFilter: 'blur(8px)', letterSpacing: '0.16em' }}
                >
                  <Share2 size={11} strokeWidth={1.5} />
                  Share
                </button>

                {/* Divider */}
                <span className="w-px h-6 bg-canvas/20 shrink-0" />

                {/* Copy link */}
                <button
                  onClick={copyLink}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-night/80 text-inverse-fg/75 hover:text-inverse-fg hover:bg-night transition-all duration-300 font-sans text-[10px] uppercase"
                  style={{ backdropFilter: 'blur(8px)', letterSpacing: '0.16em' }}
                >
                  <Copy size={11} strokeWidth={1.5} />
                  Copy link
                </button>

                {/* Divider */}
                <span className="w-px h-6 bg-canvas/20 shrink-0" />

                {/* Open workspace */}
                <button
                  onClick={(e) => { e.stopPropagation(); navigate(`/studio/events/${event.id}`) }}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-night/80 text-inverse-fg/75 hover:text-inverse-fg hover:bg-night transition-all duration-300 font-sans text-[10px] uppercase"
                  style={{ backdropFilter: 'blur(8px)', letterSpacing: '0.16em' }}
                >
                  Open
                  <ArrowRight size={10} strokeWidth={1.8} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card body */}
        <div className="px-4 pt-4 pb-3">
          <h3 className="serif font-normal text-[15px] text-ink leading-tight">
            {event.couple.brideName}
            <em className="not-italic text-bronze italic font-light"> & </em>
            {event.couple.groomName}
          </h3>
          <p className="font-sans text-[12px] text-whisper mt-1">
            {event.venue.location}, {event.venue.city}
          </p>
          <p className="font-sans text-[11px] text-whisper/60 mt-0.5">
            {formatDateShort(event.date.start)}
            {event.date.start !== event.date.end &&
              ` – ${formatDateShort(event.date.end)}`}
          </p>

          {/* Progress bar */}
          <div className="mt-3 h-[1px] bg-muted relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-bronze transition-all duration-700"
              style={{ width: `${event.progress}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <p className="font-sans text-[10px] text-whisper uppercase" style={{ letterSpacing: '0.18em' }}>
              {event.progress}% complete
            </p>
            <ArrowRight
              size={12}
              strokeWidth={1.5}
              className="text-whisper opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-400"
            />
          </div>
        </div>
      </div>

      <ShareGalleryModal event={shareOpen ? event : null} onClose={() => setShareOpen(false)} />
    </>
  )
}
