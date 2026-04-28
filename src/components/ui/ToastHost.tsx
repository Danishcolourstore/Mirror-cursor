import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, AlertCircle, Sparkles } from 'lucide-react'
import { useToastStore, type ToastTone } from '../../stores/toastStore'
import { cn } from '../../lib/cn'

const toneIcon: Record<ToastTone, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  default: Check,
  success: Check,
  error: AlertCircle,
  bronze: Sparkles,
}

const toneColor: Record<ToastTone, string> = {
  default: 'text-whisper',
  success: 'text-sage',
  error: 'text-rose',
  bronze: 'text-bronze',
}

export default function ToastHost() {
  const { toasts, dismiss } = useToastStore()

  return (
    <div
      className="fixed z-[60] flex flex-col items-end gap-2 pointer-events-none"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
        right: 'max(1rem, env(safe-area-inset-right, 1rem))',
        maxWidth: 'calc(100vw - 2rem)',
      }}
    >
      <AnimatePresence initial={false}>
        {toasts.map((toast) => {
          const Icon = toneIcon[toast.tone]
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.2, 0.6, 0.2, 1] }}
              className="pointer-events-auto flex items-start gap-3 min-w-[260px] max-w-[360px] px-4 py-3 bg-canvas border border-muted shadow-card"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              <Icon
                size={13}
                strokeWidth={1.7}
                className={cn('shrink-0 mt-0.5', toneColor[toast.tone])}
              />
              <div className="flex-1 min-w-0">
                <p className="font-sans text-[12.5px] text-ink leading-snug">
                  {toast.message}
                </p>
                {toast.detail && (
                  <p className="serif italic text-[11.5px] text-whisper mt-0.5">
                    {toast.detail}
                  </p>
                )}
              </div>
              <button
                onClick={() => dismiss(toast.id)}
                className="shrink-0 p-0.5 text-whisper hover:text-ink transition-colors duration-300"
                aria-label="Dismiss"
              >
                <X size={11} strokeWidth={1.5} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
