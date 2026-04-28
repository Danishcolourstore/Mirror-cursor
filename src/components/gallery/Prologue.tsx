import type * as React from 'react'
import { motion } from 'framer-motion'

type PrologueProps = {
  note: string
  studioName?: string
}

// Splits text at key emotional phrases to add italic bronze emphasis
function renderNote(note: string) {
  // Emphasize phrases in em-dashes or after dashes, and short poetic phrases
  const emphasisWords = [
    'marigolds', 'mirrors', 'quiet moments', 'soft February light',
    'Three days', 'Two families', 'One promise',
    'no one was looking', 'golden hour', 'slowly', 'deliberately',
  ]

  let parts: (string | React.ReactElement)[] = [note]

  emphasisWords.forEach((word) => {
    parts = parts.flatMap((part) => {
      if (typeof part !== 'string') return [part]
      if (!part.includes(word)) return [part]
      const idx = part.indexOf(word)
      return [
        part.slice(0, idx),
        <em key={word} className="text-bronze" style={{ fontStyle: 'italic' }}>
          {word}
        </em>,
        part.slice(idx + word.length),
      ]
    })
  })

  return parts
}

export default function Prologue({ note, studioName = 'Mirror Studio' }: PrologueProps) {
  return (
    <section className="py-24 px-6 flex flex-col items-center bg-canvas">
      <motion.div
        className="w-full max-w-[620px] text-center"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1.2, ease: [0.2, 0.6, 0.2, 1] }}
      >
        {/* Eyebrow rule */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="h-px w-12 bg-muted" />
          <p
            className="font-sans text-whisper uppercase"
            style={{ fontSize: '10px', letterSpacing: '0.32em' }}
          >
            A note from the photographer
          </p>
          <div className="h-px w-12 bg-muted" />
        </div>

        {/* Director's note body */}
        <p
          className="serif font-light text-ink-soft"
          style={{ fontSize: '18px', lineHeight: 1.8, letterSpacing: '-0.01em' }}
        >
          {renderNote(note)}
        </p>

        {/* Signature */}
        <motion.p
          className="serif italic text-bronze mt-8"
          style={{ fontSize: '14px' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
        >
          — {studioName}
        </motion.p>

        {/* Bottom divider */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-muted" />
          <div className="w-1 h-1 rounded-full bg-muted" />
          <div className="h-px w-12 bg-muted" />
        </div>
      </motion.div>
    </section>
  )
}
