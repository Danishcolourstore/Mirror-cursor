import { motion } from 'framer-motion'
import { Share2 } from 'lucide-react'
import { useToastStore } from '../../stores/toastStore'
import { useStudioStore } from '../../stores/studioStore'
import type { Event } from '../../types/event'

type ClosingCreditsProps = {
  event: Event
  studioName?: string
}

export default function ClosingCredits({
  event,
  studioName,
}: ClosingCreditsProps) {
  const pushToast = useToastStore((s) => s.push)
  const storeStudioName = useStudioStore((s) => s.studioName)
  const resolvedStudioName = studioName ?? storeStudioName
  const quote = event.closingQuote ?? 'And in that quiet between two ceremonies, we found the photograph we were waiting for.'

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${event.couple.brideName} & ${event.couple.groomName} — ${resolvedStudioName}`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        pushToast('Gallery link copied', { detail: window.location.href, tone: 'success' })
      }
    } catch {
      // user cancelled
    }
  }

  return (
    <section className="bg-night py-24 px-6 flex flex-col items-center text-center">
      <motion.div
        className="max-w-[560px] w-full"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.3, ease: [0.2, 0.6, 0.2, 1] }}
      >
        {/* Decorative rule */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-10 bg-canvas/10" />
          <div className="w-1 h-1 rounded-full bg-bronze/40" />
          <div className="h-px w-10 bg-canvas/10" />
        </div>

        {/* Closing quote */}
        <p
          className="serif italic font-light text-inverse-fg/70"
          style={{ fontSize: 'clamp(18px, 3vw, 24px)', lineHeight: 1.75, letterSpacing: '-0.01em' }}
        >
          "{quote}"
        </p>

        {/* Studio credit */}
        <div className="mt-12">
          <p
            className="font-sans text-inverse-fg/25 uppercase mb-2"
            style={{ fontSize: '10px', letterSpacing: '0.32em' }}
          >
            Photographed by
          </p>
          <p
            className="serif font-light text-inverse-fg/80"
            style={{ fontSize: '22px', letterSpacing: '-0.01em' }}
          >
            {resolvedStudioName}
          </p>
        </div>

        {/* Share CTA */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.5, ease: [0.2, 0.6, 0.2, 1] }}
        >
          <button
            onClick={handleShare}
            className="btn-ghost inline-flex items-center gap-2.5"
          >
            <Share2 size={12} strokeWidth={1.5} />
            <span>Share their wedding</span>
          </button>
        </motion.div>

        {/* Couple names footer */}
        <p
          className="serif italic text-inverse-fg/20 mt-10"
          style={{ fontSize: '13px' }}
        >
          {event.couple.brideName} &amp; {event.couple.groomName} · {event.venue.city}
        </p>
      </motion.div>
    </section>
  )
}
