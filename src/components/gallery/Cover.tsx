import { useState } from 'react'
import { motion, type Transition } from 'framer-motion'
import type { Event } from '../../types/event'
import { formatMonthYear } from '../../lib/format'
import { useStudioStore } from '../../stores/studioStore'

type CoverProps = {
  event: Event
}

const EASE: [number, number, number, number] = [0.2, 0.6, 0.2, 1]

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.0, delay, ease: EASE } as Transition,
})

export default function Cover({ event }: CoverProps) {
  const { brideName, groomName } = event.couple
  const tagline = useStudioStore((s) => s.tagline)
  const [imgLoaded, setImgLoaded] = useState(false)

  return (
    <section
      className="relative overflow-hidden flex flex-col items-center justify-center"
      style={{ height: '100svh', minHeight: '600px' }}
    >
      {/* Shimmer placeholder — visible until image loads */}
      {!imgLoaded && (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(90deg, #1a1a1a 0%, #333333 50%, #1a1a1a 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2.4s ease-in-out infinite',
          }}
        />
      )}

      {/* Ken Burns hero image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.0 }}
        animate={{ scale: 1.12 }}
        transition={{ duration: 24, ease: 'easeOut' }}
      >
        <motion.img
          src={event.coverImage}
          alt={`${brideName} & ${groomName}`}
          className="w-full h-full object-cover"
          onLoad={() => setImgLoaded(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: imgLoaded ? 1 : 0 }}
          transition={{ duration: 1.2, ease: [0.2, 0.6, 0.2, 1] }}
        />
      </motion.div>

      {/* Dark veil */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.12) 40%, rgba(0,0,0,0.65) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 select-none">
        {/* Eyebrow */}
        <motion.p
          className="serif italic text-canvas/70 mb-6"
          style={{ fontSize: '14px', letterSpacing: '0.04em' }}
          {...fadeUp(0.4)}
        >
          {tagline}
        </motion.p>

        {/* Couple names */}
        <motion.h1
          className="serif font-light text-canvas leading-none"
          style={{
            fontSize: 'clamp(48px, 11vw, 96px)',
            letterSpacing: '-0.02em',
          }}
          {...fadeUp(1.0)}
        >
          {brideName}
          <em
            className="font-light"
            style={{
              fontStyle: 'italic',
              color: 'rgba(246,241,232,0.45)',
              margin: '0 0.18em',
            }}
          >
            &amp;
          </em>
          {groomName}
        </motion.h1>

        {/* Location · Date */}
        <motion.p
          className="font-sans text-canvas/55 mt-5 uppercase"
          style={{ fontSize: '11px', letterSpacing: '0.32em' }}
          {...fadeUp(1.8)}
        >
          {event.venue.location} · {event.venue.city} · {formatMonthYear(event.date.start)}
        </motion.p>

        {/* 1px vertical divider */}
        <motion.div
          className="mt-8 bg-canvas/30"
          style={{ width: '1px', height: '40px' }}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 0.6, delay: 2.4, ease: [0.2, 0.6, 0.2, 1] }}
        />

        {/* Begin scroll hint */}
        <motion.div
          className="mt-4 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3.0 }}
        >
          <motion.div
            animate={{ opacity: [0.4, 0.85, 0.4], y: [0, 4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-1"
          >
            <p
              className="font-sans text-canvas/50 uppercase"
              style={{ fontSize: '10px', letterSpacing: '0.32em' }}
            >
              Begin
            </p>
            <svg
              width="12"
              height="8"
              viewBox="0 0 12 8"
              fill="none"
              className="text-canvas/40"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
