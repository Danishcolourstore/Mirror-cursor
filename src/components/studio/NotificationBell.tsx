import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Bell, CircleDot, Eye, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type ActivityItem = {
  id: string
  icon: typeof Heart
  line: string
  time: string
}

const MOCK_ACTIVITIES: ActivityItem[] = [
  {
    id: 'a1',
    icon: Heart,
    line: "Ananya's mother favorited a photo from The Wedding",
    time: 'This morning · 9:41',
  },
  {
    id: 'a2',
    icon: Eye,
    line: 'Priya & Arjun gallery link opened · 3 times',
    time: 'Yesterday · 4:07',
  },
  {
    id: 'a3',
    icon: CircleDot,
    line: 'Chapter II went live — Priya & Arjun',
    time: 'Mar 26 · evening',
  },
  {
    id: 'a4',
    icon: Heart,
    line:
      'Rohan favorited 7 photos from The Wedding chapter',
    time: 'Mar 21 · afternoon',
  },
]

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const initialUnread = MOCK_ACTIVITIES.length
  const [unreadTotal, setUnreadTotal] = useState(initialUnread)

  const unreadCount = useMemo(
    () => Math.min(unreadTotal, MOCK_ACTIVITIES.length),
    [unreadTotal]
  )

  useEffect(() => {
    if (!open) return
    const handleDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (btnRef.current?.contains(t)) return
      if (panelRef.current?.contains(t)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleDown)
    return () => document.removeEventListener('mousedown', handleDown)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const toggle = useCallback(() => {
    setOpen((prev) => {
      const next = !prev
      if (!prev && next) {
        setUnreadTotal(0)
      }
      return next
    })
  }, [])

  return (
    <div className="fixed top-4 right-4 md:top-5 md:right-8 z-[50]">
      <div className="relative inline-flex flex-col items-end">
        <button
          ref={btnRef}
          type="button"
          onClick={toggle}
          className="relative flex items-center justify-center w-10 h-10 border border-muted bg-canvas hover:border-bronze/40 transition-colors duration-400"
          aria-expanded={open}
          aria-haspopup="true"
          aria-controls={open ? 'notifications-panel' : undefined}
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={1.4} className="text-ink-soft" />
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.22 }}
                className="absolute min-w-[1.125rem] h-[18px] px-[5px] -top-0.5 -right-0.5 flex items-center justify-center bg-bronze text-[color:var(--on-accent)] font-sans text-[10px] font-medium rounded-[4px] leading-none"
              >
                {unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </button>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              ref={panelRef}
              id="notifications-panel"
              role="dialog"
              aria-label="Recent activity"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{
                duration: 0.28,
                ease: [0.2, 0.6, 0.2, 1] as [number, number, number, number],
              }}
              className="absolute top-full mt-2 right-0 w-[320px] max-h-[400px] border border-muted bg-canvas flex flex-col overflow-hidden"
              style={{
                boxShadow: '0 14px 40px rgba(28,24,20,0.06)',
              }}
            >
              <div className="shrink-0 px-4 py-3.5 border-b border-muted bg-canvas">
                <p
                  className="serif uppercase text-whisper tracking-[0.32em]"
                  style={{ fontSize: '11px', letterSpacing: '0.32em' }}
                >
                  Activity
                </p>
              </div>

              <ul className="flex-1 min-h-0 overflow-y-auto scrollbar-hide divide-y divide-muted">
                {MOCK_ACTIVITIES.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id} className="px-4 py-3 hover:bg-canvas-deep transition-colors duration-300">
                      <div className="flex gap-3">
                        <Icon
                          size={12}
                          strokeWidth={1.65}
                          className="text-bronze/80 shrink-0 mt-0.5"
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p
                            className="serif italic text-ink-soft text-[13px]"
                            style={{ lineHeight: 1.5 }}
                          >
                            {item.line}
                          </p>
                          <p className="font-sans text-[10px] text-whisper mt-1.5" style={{ letterSpacing: '0.06em' }}>
                            {item.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <div className="shrink-0 border-t border-muted px-4 py-3 bg-canvas">
                <Link
                  to="/studio/overview"
                  onClick={() => setOpen(false)}
                  className="serif text-[13px] text-bronze italic hover:text-bronze-deep underline underline-offset-4 decoration-bronze/30 transition-colors duration-300"
                >
                  View all
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
