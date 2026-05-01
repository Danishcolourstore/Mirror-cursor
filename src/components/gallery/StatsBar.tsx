import { useEffect, useMemo, useRef, useState } from 'react'

type StatsBarProps = {
  photos?: number
  chapters?: number
  guests?: number
}

type StatItem = {
  value: number
  label: string
}

const DEFAULT_STATS: StatItem[] = [
  { value: 1247, label: 'PHOTOS' },
  { value: 4, label: 'CHAPTERS' },
  { value: 142, label: 'GUESTS' },
]

function formatValue(value: number): string {
  return value.toLocaleString('en-US')
}

export default function StatsBar({ photos = 1247, chapters = 4, guests = 142 }: StatsBarProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const [displayValues, setDisplayValues] = useState<number[]>(() => [Math.round(photos * 0.82), Math.round(chapters * 0.82), Math.round(guests * 0.82)])
  const [started, setStarted] = useState(false)

  const stats = useMemo<StatItem[]>(
    () => [
      { value: photos, label: 'PHOTOS' },
      { value: chapters, label: 'CHAPTERS' },
      { value: guests, label: 'GUESTS' },
    ],
    [photos, chapters, guests],
  )

  useEffect(() => {
    setDisplayValues([Math.round(photos * 0.82), Math.round(chapters * 0.82), Math.round(guests * 0.82)])
  }, [photos, chapters, guests])

  useEffect(() => {
    const element = rootRef.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return

    const start = performance.now()
    const duration = 1400

    const initialValues = stats.map((item) => Math.round(item.value * 0.82))
    let rafId = 0

    const animate = (time: number) => {
      const elapsed = Math.min(time - start, duration)
      const t = elapsed / duration
      const eased = 1 - Math.pow(1 - t, 3)

      setDisplayValues(
        stats.map((item, index) => {
          const from = initialValues[index]
          return Math.round(from + (item.value - from) * eased)
        }),
      )

      if (elapsed < duration) {
        rafId = window.requestAnimationFrame(animate)
      }
    }

    rafId = window.requestAnimationFrame(animate)
    return () => window.cancelAnimationFrame(rafId)
  }, [started, stats])

  return (
    <section className="border-b border-[#C9A96E]/15 bg-[var(--bg-secondary)] px-4 py-6 md:px-10">
      <div ref={rootRef} className="mx-auto flex max-w-6xl items-center justify-center">
        {stats.map((stat, index) => (
          <div key={stat.label} className="flex items-center">
            <div className="px-5 text-center sm:px-8">
              <p className="type-stat text-white">{formatValue(displayValues[index] ?? DEFAULT_STATS[index].value)}</p>
              <p className="type-label mt-2">{stat.label}</p>
            </div>
            {index < stats.length - 1 && <span className="h-10 w-px bg-[#C9A96E]/30" aria-hidden />}
          </div>
        ))}
      </div>
    </section>
  )
}
