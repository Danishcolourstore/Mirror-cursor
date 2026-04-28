import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '../../lib/cn'
import { toRoman, formatDateShort } from '../../lib/format'
import type { Chapter } from '../../types/event'

type ChapterIndexProps = {
  chapters: Chapter[]
  onSelect: (chapter: Chapter) => void
}

function isNew(chapter: Chapter): boolean {
  if (chapter.status !== 'live') return false
  // Treat chapters with no unlockDate as "new" for demo
  return !chapter.unlockDate
}

export default function ChapterIndex({ chapters, onSelect }: ChapterIndexProps) {
  return (
    <section className="py-16 px-6 bg-canvas">
      <div className="max-w-2xl mx-auto">
        {/* Section heading */}
        <motion.div
          className="mb-10 flex items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.0, ease: [0.2, 0.6, 0.2, 1] }}
        >
          <div className="h-px flex-1 bg-muted" />
          <p
            className="font-sans text-whisper uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.32em' }}
          >
            Chapters
          </p>
          <div className="h-px flex-1 bg-muted" />
        </motion.div>

        {/* Chapter list */}
        <ul className="space-y-0 divide-y divide-muted border-t border-muted">
          {chapters.map((chapter, i) => {
            const locked = chapter.status === 'locked' || chapter.status === 'draft'
            const scheduled = chapter.status === 'scheduled'
            const _new = isNew(chapter)

            return (
              <motion.li
                key={chapter.id}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{
                  duration: 0.9,
                  delay: i * 0.08,
                  ease: [0.2, 0.6, 0.2, 1],
                }}
              >
                <motion.button
                  className={cn(
                    'w-full text-left py-6 flex items-start gap-5 group transition-all duration-400',
                    locked || scheduled
                      ? 'opacity-50 cursor-default'
                      : 'cursor-pointer'
                  )}
                  whileHover={
                    !locked && !scheduled
                      ? { paddingLeft: '12px' }
                      : undefined
                  }
                  transition={{ duration: 0.3, ease: [0.2, 0.6, 0.2, 1] }}
                  onClick={() => !locked && !scheduled && onSelect(chapter)}
                  disabled={locked || scheduled}
                >
                  {/* Roman numeral */}
                  <span
                    className="serif italic text-bronze shrink-0 mt-0.5"
                    style={{ fontSize: '24px', lineHeight: 1, minWidth: '2rem' }}
                  >
                    {toRoman(chapter.number)}
                  </span>

                  {/* Title + caption */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3
                        className="serif font-normal text-ink"
                        style={{
                          fontSize: 'clamp(20px, 3vw, 26px)',
                          letterSpacing: '-0.01em',
                          lineHeight: 1.1,
                        }}
                      >
                        {chapter.title}
                      </h3>

                      {/* Badges */}
                      {_new && (
                        <span className="pill-new text-[10px]">New</span>
                      )}
                      {scheduled && chapter.unlockDate && (
                        <span
                          className="pill bg-canvas-deep text-whisper border border-muted text-[10px]"
                          style={{ letterSpacing: '0.14em' }}
                        >
                          Unlocks {formatDateShort(chapter.unlockDate)}
                        </span>
                      )}
                      {locked && (
                        <span className="pill bg-canvas-deep text-whisper border border-muted text-[10px]">
                          Coming soon
                        </span>
                      )}
                    </div>

                    <p
                      className="serif italic text-whisper mt-1.5"
                      style={{ fontSize: '14px', lineHeight: 1.5 }}
                    >
                      {chapter.caption}
                    </p>
                  </div>

                  {/* Arrow */}
                  {!locked && !scheduled && (
                    <motion.div
                      className="shrink-0 mt-1 text-whisper/0 group-hover:text-whisper"
                      animate={{ x: 0 }}
                      whileHover={{ x: 8 }}
                      transition={{ duration: 0.3, ease: [0.2, 0.6, 0.2, 1] }}
                    >
                      <ArrowRight size={16} strokeWidth={1.2} />
                    </motion.div>
                  )}
                </motion.button>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
