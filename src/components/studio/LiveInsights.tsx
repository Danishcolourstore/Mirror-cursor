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
    <div className="border border-muted bg-canvas rounded-lg shadow-card h-full flex flex-col overflow-hidden">
      <div className="px-5 py-4 border-b border-muted flex items-center justify-between bg-canvas">
        <h3 className="serif font-light text-base text-ink" style={{ letterSpacing: '-0.01em' }}>
          Live insights
        </h3>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full bg-bronze transition-opacity duration-300',
              pulse ? 'opacity-100' : 'opacity-100'
            )}
            style={{ animation: 'pulseDot 2s ease-in-out infinite' }}
          />
          <span className="font-sans text-[10px] text-whisper uppercase" style={{ letterSpacing: '0.18em' }}>
            Live
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-muted border-b border-muted">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-4 bg-canvas-deep/50">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={11} strokeWidth={1.5} className="text-whisper" />
              <p
                className="font-sans text-[10px] text-whisper uppercase"
                style={{ letterSpacing: '0.16em' }}
              >
                {stat.label}
              </p>
            </div>
            <p
              className={cn(
                'serif font-light text-ink transition-all duration-300',
                pulse && (stat.label === 'Gallery views today' || stat.label === 'Photos favorited')
                  ? 'scale-[1.02]'
                  : ''
              )}
              style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              {stat.value}
              {stat.suffix && (
                <span className="font-sans text-xs text-whisper ml-1">{stat.suffix}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="flex-1 px-5 py-4 bg-canvas">
        <p className="font-sans text-[10px] text-whisper uppercase mb-3" style={{ letterSpacing: '0.22em' }}>
          Most viewed
        </p>
        <ul className="space-y-3">
          {topGalleries.map((g, i) => (
            <li key={g.slug} className="flex items-center gap-3">
              <span className="serif italic text-whisper text-[11px] w-4 shrink-0">{['I', 'II', 'III'][i]}</span>
              <div className="flex-1 min-w-0">
                <p className="serif font-light text-[13px] text-ink leading-none truncate">{g.name}</p>
              </div>
              <div className="text-right shrink-0">
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
