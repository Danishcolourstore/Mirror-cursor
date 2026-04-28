import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'ink' | 'ghost'
  }
  secondary?: {
    label: string
    onClick: () => void
  }
  compact?: boolean
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  secondary,
  compact = false,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.2, 0.6, 0.2, 1] as [number, number, number, number] }}
      className={
        'flex flex-col items-center text-center rounded-lg border border-muted bg-canvas shadow-card ' +
        (compact ? 'py-12 px-6' : 'py-20 px-6')
      }
    >
      {/* Decorative bronze dot rule */}
      <div className="flex items-center justify-center gap-3 mb-7">
        <div className="h-px w-8 bg-muted" />
        <div className="w-1 h-1 rounded-full bg-bronze/50" />
        <div className="h-px w-8 bg-muted" />
      </div>

      {icon && (
        <div className="w-12 h-12 border border-muted bg-canvas flex items-center justify-center text-whisper mb-5">
          {icon}
        </div>
      )}

      <h3
        className="serif font-light text-ink mb-2"
        style={{ fontSize: compact ? '20px' : '24px', letterSpacing: '-0.02em' }}
      >
        {title}
      </h3>

      {description && (
        <p
          className="serif italic text-whisper max-w-sm"
          style={{ fontSize: compact ? '13px' : '14px', lineHeight: 1.65 }}
        >
          {description}
        </p>
      )}

      {(action || secondary) && (
        <div className="mt-7 flex items-center gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className={action.variant === 'ghost' ? 'btn-ghost' : 'btn-ink'}
            >
              {action.label}
            </button>
          )}
          {secondary && (
            <button onClick={secondary.onClick} className="btn-ghost">
              {secondary.label}
            </button>
          )}
        </div>
      )}
    </motion.div>
  )
}
