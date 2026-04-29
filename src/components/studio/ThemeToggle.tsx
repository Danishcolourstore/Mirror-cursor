import { useRef, useLayoutEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useThemeStore, type ThemeId } from '../../stores/themeStore'
import { cn } from '../../lib/cn'

const SEGMENTS: { id: ThemeId; label: string; swatchClass: string }[] = [
  { id: 'warm', label: 'Warm', swatchClass: 'bg-[#C9A66B] ring-1 ring-black/10' },
  { id: 'white', label: 'White', swatchClass: 'bg-white ring-1 ring-[var(--border)]' },
  { id: 'black', label: 'Cinematic', swatchClass: 'bg-[#121212] ring-1 ring-white/12' },
]

type ThemeToggleProps = {
  variant?: 'default' | 'compact'
}

export default function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const containerRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })

  const activeIndex = SEGMENTS.findIndex((s) => s.id === theme)
  const idx = activeIndex >= 0 ? activeIndex : 0

  const measure = useCallback(() => {
    const el = btnRefs.current[idx]
    const wrap = containerRef.current
    if (!el || !wrap) return
    const pw = wrap.getBoundingClientRect()
    const b = el.getBoundingClientRect()
    setIndicator({ left: b.left - pw.left, width: b.width })
  }, [idx])

  useLayoutEffect(() => {
    measure()
  }, [measure, theme])

  useLayoutEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(() => measure())
    ro.observe(containerRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [measure])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative isolate flex items-stretch overflow-hidden rounded-full border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-[3px]',
        variant === 'compact' ? 'h-9 w-[min(100%,280px)] shrink-0' : 'h-10 max-w-[280px] w-full shrink-0 shadow-[var(--shadow)]'
      )}
      role="tablist"
      aria-label="Studio theme"
    >
      <motion.div
        className="pointer-events-none absolute left-0 top-[3px] z-0 h-[calc(100%-6px)] rounded-full bg-[var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
        initial={false}
        animate={{ left: indicator.left, width: indicator.width }}
        transition={{ type: 'spring', stiffness: 460, damping: 34 }}
      />

      {SEGMENTS.map((seg, i) => {
        const isActive = theme === seg.id
        return (
          <button
            key={seg.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            ref={(el) => {
              btnRefs.current[i] = el
            }}
            className={cn(
              'relative z-10 flex min-w-0 flex-1 items-center justify-center gap-1.5 px-1.5 transition-colors duration-300',
              variant === 'compact' && 'px-1',
              isActive
                ? 'text-[var(--on-accent-indicator-fg)]'
                : 'text-[var(--whisper)] hover:text-[var(--ink-soft)]'
            )}
            onClick={() => setTheme(seg.id)}
          >
            <span
              className={cn(
                'shrink-0 rounded-full',
                variant === 'compact' ? 'h-2 w-2' : 'h-2.5 w-2.5',
                seg.swatchClass
              )}
              aria-hidden
            />
            <span
              className={cn(
                'font-sans uppercase leading-none tracking-[0.12em]',
                variant === 'compact' ? 'text-[9px]' : 'text-[10px]'
              )}
            >
              {seg.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
