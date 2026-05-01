import { useEffect, useMemo, useRef, useState } from 'react'

type DirectorsNoteProps = {
  note: string
}

function splitLines(note: string): string[] {
  const source = note.trim()
  if (!source.includes('\n')) {
    return source.split(/(?<=[.!?])\s+/).filter(Boolean)
  }
  return source.split('\n').map((line) => line.trim()).filter(Boolean)
}

export default function DirectorsNote({ note }: DirectorsNoteProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [revealed, setRevealed] = useState(false)

  const lines = useMemo(() => splitLines(note), [note])

  useEffect(() => {
    const element = rootRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setRevealed(true)
          observer.disconnect()
        }
      },
      { threshold: 0.32 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="bg-[var(--bg-secondary)] px-6 py-20 md:px-16 lg:py-24">
      <div ref={rootRef} className="note-lines relative mx-auto max-w-4xl">
        <span className="pointer-events-none absolute -left-2 -top-10 font-['Cormorant_Garamond'] text-[120px] leading-none text-[#C9A96E]/20">
          &ldquo;
        </span>
        <div className="space-y-3 pl-6 md:pl-12">
          {lines.map((line) => (
            <p
              key={line}
              className={[
                'note-line type-note transition-all duration-[600ms]',
                revealed ? 'translate-y-0 opacity-100' : 'translate-y-[6px] opacity-0',
              ].join(' ')}
            >
              {line}
            </p>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center">
          <span className="h-px w-20 bg-[#C9A96E]/55" />
          <span className="mt-3 font-['Cormorant_Garamond'] text-xl text-[#C9A96E]/80">↓</span>
        </div>
      </div>
      <style>{`
        .note-lines .note-line:nth-child(1) { transition-delay: 0ms; }
        .note-lines .note-line:nth-child(2) { transition-delay: 120ms; }
        .note-lines .note-line:nth-child(3) { transition-delay: 240ms; }
        .note-lines .note-line:nth-child(4) { transition-delay: 360ms; }
        .note-lines .note-line:nth-child(5) { transition-delay: 480ms; }
        .note-lines .note-line:nth-child(6) { transition-delay: 600ms; }
        .note-lines .note-line:nth-child(7) { transition-delay: 720ms; }
        .note-lines .note-line:nth-child(8) { transition-delay: 840ms; }
      `}</style>
    </section>
  )
}
