import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Eye, Share2, Unlock, Package, MessageCircle } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useActivityStore } from '../../stores/activityStore'
import type { ActivityEntry } from '../../data/mockActivity'

const typeIcon = {
  view: Eye,
  favorite: Heart,
  share: Share2,
  chapter_unlock: Unlock,
  delivery: Package,
  comment: MessageCircle,
}

const typeColor: Record<ActivityEntry['type'], string> = {
  view: 'text-whisper',
  favorite: 'text-bronze',
  share: 'text-whisper',
  chapter_unlock: 'text-sage',
  delivery: 'text-ink-soft',
  comment: 'text-whisper',
}

export default function ActivityFeed() {
  const { feed, simulateTick } = useActivityStore()

  // Simulate a new activity entry every 30s
  useEffect(() => {
    const interval = setInterval(simulateTick, 30000)
    return () => clearInterval(interval)
  }, [simulateTick])

  const displayed = feed.slice(0, 8)

  return (
    <div className="border border-muted bg-canvas-deep h-full flex flex-col">
      <div className="px-5 py-4 border-b border-muted flex items-center justify-between">
        <h3 className="section-title text-base">
          From the <em>galleries</em>
        </h3>
        <span
          className="font-sans text-whisper/50 uppercase"
          style={{ fontSize: '10px', letterSpacing: '0.18em' }}
        >
          Live
        </span>
      </div>

      <ul className="flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {displayed.map((item, i) => {
            const Icon = typeIcon[item.type]
            return (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.6, 0.2, 1] }}
                className={cn(
                  'flex items-start gap-3 px-5 py-3.5 transition-colors duration-400 hover:bg-canvas-deeper cursor-default',
                  i < displayed.length - 1 && 'border-b border-muted'
                )}
              >
                <div className="mt-0.5 shrink-0">
                  <Icon size={13} strokeWidth={1.5} className={cn(typeColor[item.type])} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-[13px] text-ink-soft leading-snug">
                    {item.message}
                  </p>
                  {item.detail && (
                    <p className="serif italic text-[11px] text-whisper mt-0.5">
                      {item.detail}
                    </p>
                  )}
                </div>
                <p className="font-sans text-[11px] text-whisper/60 shrink-0 mt-0.5 whitespace-nowrap">
                  {item.time}
                </p>
              </motion.li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}
