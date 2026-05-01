import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '../../lib/cn'
import { toRoman } from '../../lib/format'
import type { Chapter } from '../../types/event'

export type FilterBarProps = {
  chapters: Chapter[]
  favoritedCount: number
  favoritesOnly: boolean
  onFavoritesOnlyChange: (value: boolean) => void
}

/**
 * Horizontally scrollable chapter pills between the chapter index and the first chapter.
 * All Photos (default) · one pill per chapter · Favorites with optional count badge.
 */
export default function FilterBar({
  chapters,
  favoritedCount,
  favoritesOnly,
  onFavoritesOnlyChange,
}: FilterBarProps) {
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null)

  useEffect(() => {
    const onScroll = () => {
      let current: string | null = null
      for (const ch of chapters) {
        const el = document.getElementById(`chapter-${ch.id}`)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= window.innerHeight * 0.45) current = ch.id
        }
      }
      setActiveChapterId(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [chapters])

  const scrollToChapter = (chapterId: string) => {
    const el = document.getElementById(`chapter-${chapterId}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const allPhotosActive = !favoritesOnly && activeChapterId === null

  return (
    <div className="border-b border-muted bg-canvas">
      <div
        className={cn(
          'flex items-center gap-2 overflow-x-auto px-4 py-3',
          '[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'
        )}
      >
        <Pill
          active={allPhotosActive}
          onClick={() => {
            onFavoritesOnlyChange(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          All Photos
        </Pill>

        {chapters.map((ch) => {
          const isActive = !favoritesOnly && activeChapterId === ch.id
          const label = `${toRoman(ch.number)} — ${ch.title}`
          return (
            <Pill
              key={ch.id}
              active={isActive}
              onClick={() => {
                onFavoritesOnlyChange(false)
                scrollToChapter(ch.id)
              }}
            >
              {label}
            </Pill>
          )
        })}

        <Pill
          active={favoritesOnly}
          onClick={() => onFavoritesOnlyChange(!favoritesOnly)}
          className="shrink-0"
        >
          <Heart
            size={11}
            strokeWidth={1.6}
            className={cn(
              'mr-1',
              favoritesOnly ? 'fill-white text-white' : 'text-ink-soft'
            )}
          />
          Favorites
          {favoritedCount > 0 && (
            <span
              className={cn(
                'ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full font-sans text-[10px]',
                favoritesOnly ? 'bg-white/25 text-white' : 'bg-canvas-deep text-ink'
              )}
            >
              {favoritedCount}
            </span>
          )}
        </Pill>
      </div>
    </div>
  )
}

function Pill({
  active,
  onClick,
  children,
  className,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center border px-3 py-1.5 font-sans text-[11.5px] transition-all duration-300',
        active
          ? 'border-ink bg-canvas-deep text-ink'
          : 'border-muted text-ink-soft hover:border-ink-soft hover:text-ink',
        className
      )}
      style={{ borderRadius: '4px' }}
    >
      {children}
    </button>
  )
}
