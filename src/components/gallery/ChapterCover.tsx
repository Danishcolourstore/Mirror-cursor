import { motion } from 'framer-motion'
import { toRoman } from '../../lib/format'
import type { Chapter } from '../../types/event'

type ChapterCoverProps = {
  chapter: Chapter
}

export default function ChapterCover({ chapter }: ChapterCoverProps) {
  return (
    <section
      className="relative overflow-hidden flex items-end"
      style={{ height: '90svh', minHeight: '520px' }}
    >
      {/* Background image */}
      <motion.div
        className="absolute inset-0 z-0"
        initial={{ scale: 1.04 }}
        whileInView={{ scale: 1.0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: [0.2, 0.6, 0.2, 1] }}
      >
        <img
          src={chapter.coverImage}
          alt={chapter.title}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Darkening veil — heavier at bottom */}
      <div
        className="absolute inset-0 z-10"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,17,13,0.15) 0%, rgba(20,17,13,0.25) 50%, rgba(20,17,13,0.82) 100%)',
        }}
      />

      {/* Chapter title — bottom left */}
      <div className="relative z-20 px-5 sm:px-8 pb-10 sm:pb-12 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.2, ease: [0.2, 0.6, 0.2, 1] }}
        >
          {/* Roman numeral */}
          <p
            className="serif italic text-bronze-soft mb-2"
            style={{ fontSize: '18px', letterSpacing: '0.04em' }}
          >
            {toRoman(chapter.number)}
          </p>

          {/* Chapter title */}
          <h2
            className="serif font-light text-canvas"
            style={{
              fontSize: 'clamp(32px, 6vw, 56px)',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
            }}
          >
            {chapter.title}
          </h2>

          {/* Chapter caption */}
          <p
            className="serif italic text-canvas/50 mt-3"
            style={{ fontSize: '15px', lineHeight: 1.5 }}
          >
            {chapter.caption}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
