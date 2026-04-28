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

  // Simulate live increments every 30s
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
    <div
      className="border border-muted h-full flex flex-col relative overflow-hidden"
      style={{ background: '#14110D' }}
    >
      {/* Grain noise overlay for the dark panel */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.25,
          mixBlendMode: 'screen',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundSize: '180px 180px',
        }}
      />

      {/* Header */}
      <div className="relative z-10 px-5 py-4 border-b border-white/8 flex items-center justify-between">
        <h3 className="serif font-light text-base text-canvas/90" style={{ letterSpacing: '-0.01em' }}>
          Live insights
        </h3>
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'w-1.5 h-1.5 rounded-full bg-rose transition-opacity duration-300',
              pulse ? 'opacity-100' : 'opacity-100'
            )}
            style={{ animation: 'pulseDot 2s ease-in-out infinite' }}
          />
          <span className="font-sans text-[10px] text-rose/80 uppercase" style={{ letterSpacing: '0.18em' }}>
            Live
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="relative z-10 grid grid-cols-2 divide-x divide-y divide-white/8 border-b border-white/8">
        {stats.map((stat) => (
          <div key={stat.label} className="px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon size={11} strokeWidth={1.5} className="text-bronze-soft/60" />
              <p className="font-sans text-[10px] text-canvas/40 uppercase"
                style={{ letterSpacing: '0.16em' }}>
                {stat.label}
              </p>
            </div>
            <p className={cn(
              'serif font-light text-bronze-soft transition-all duration-300',
              pulse && (stat.label === 'Gallery views today' || stat.label === 'Photos favorited')
                ? 'text-bronze-soft scale-105'
                : ''
            )}
              style={{ fontSize: '28px', letterSpacing: '-0.02em', lineHeight: 1 }}
            >
              {stat.value}
              {stat.suffix && (
                <span className="font-sans text-xs text-canvas/30 ml-1">{stat.suffix}</span>
              )}
            </p>
          </div>
        ))}
      </div>

      {/* Top galleries */}
      <div className="relative z-10 flex-1 px-5 py-4">
        <p className="font-sans text-[10px] text-canvas/30 uppercase mb-3"
          style={{ letterSpacing: '0.22em' }}>
          Most viewed
        </p>
        <ul className="space-y-3">
          {topGalleries.map((g, i) => (
            <li key={g.slug} className="flex items-center gap-3">
              <span className="serif italic text-bronze-soft/40 text-[11px] w-4 shrink-0">
                {['I', 'II', 'III'][i]}
              </span>
              <div className="flex-1 min-w-0">
                <p className="serif font-light text-[13px] text-canvas/80 leading-none truncate">
                  {g.name}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-sans text-[12px] text-bronze-soft">{g.views}</p>
                <p className="font-sans text-[10px] text-canvas/30">{g.change}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
