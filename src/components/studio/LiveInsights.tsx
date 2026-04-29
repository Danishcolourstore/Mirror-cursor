import { useEffect, useState } from 'react'
import { TrendingUp, Eye, Heart, Share2 } from 'lucide-react'
import { cn } from '../../lib/cn'

type InsightStat = {
  label: string
  value: number
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  suffix?: string
}

const initialStats: InsightStat[] = [
  { label: 'Gallery views today', value: 47, icon: Eye },
  { label: 'Photos favorited', value: 23, icon: Heart },
  { label: 'Links shared', value: 6, icon: Share2 },
  { label: 'Avg. time in gallery', value: 8, icon: TrendingUp, suffix: 'min' },
]

const topGalleries = [
  { name: 'Ananya & Rohan', views: 312, change: '+18 today', slug: 'ananya-rohan' },
  { name: 'Priya & Arjun', views: 89, change: '+6 today', slug: 'priya-arjun' },
  { name: 'Meera & Vikram', views: 14, change: '+2 today', slug: 'meera-vikram' },
]

export default function LiveInsights() {
  const [stats, setStats] = useState(initialStats)
  const [pulse, setPulse] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(true)
      setTimeout(() => setPulse(false), 800)
      setStats((prev) =>
        prev.map((s) => ({
          ...s,
          value:
            s.label === 'Gallery views today'
              ? s.value + Math.floor(Math.random() * 3 + 1)
              : s.label === 'Photos favorited'
              ? s.value + (Math.random() > 0.6 ? 1 : 0)
              : s.value,
        }))
      )
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border border-muted bg-canvas shadow-card">
      <div className="flex shrink-0 items-center justify-between border-b border-muted bg-canvas px-5 py-4">
        <h3 className="serif text-base font-light text-ink" style={{ letterSpacing: '-0.01em' }}>
          Live insights
        </h3>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full bg-bronze transition-opacity duration-300',
              pulse ? 'opacity-100' : 'opacity-100'
            )}
            style={{ animation: 'pulseDot 2s ease-in-out infinite' }}
          />
          <span className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.18em' }}>
            Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-muted border-b border-muted">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-canvas-deep/60 px-4 py-4">
            <div className="mb-2 flex items-center gap-2">
              <stat.icon size={11} strokeWidth={1.5} className="text-whisper" />
              <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.16em' }}>
                {stat.label}
              </p>
            </div>
            <p
              className={cn(
                'serif font-light text-ink transition-all duration-300',
                pulse && (stat.label === 'Gallery views today' || stat.label === 'Photos favorited') ? 'scale-[1.02]' : ''
              )}
              style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              {stat.value}
              {stat.suffix && <span className="ml-1 font-sans text-xs text-whisper">{stat.suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 bg-canvas px-5 py-4">
        <p className="mb-3 font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.22em' }}>
          Most viewed
        </p>
        <ul className="space-y-3">
          {topGalleries.map((g, i) => (
            <li key={g.slug} className="flex items-center gap-3">
              <span className="serif w-4 shrink-0 text-[11px] italic text-whisper">{['I', 'II', 'III'][i]}</span>
              <div className="min-w-0 flex-1">
                <p className="serif truncate text-[13px] font-light leading-none text-ink">{g.name}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-sans text-[12px] text-ink">{g.views}</p>
                <p className="font-sans text-[10px] text-whisper">{g.change}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
