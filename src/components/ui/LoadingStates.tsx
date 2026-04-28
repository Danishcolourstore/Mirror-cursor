import { cn } from '../../lib/cn'

export function BreathingDots({
  className,
  label = 'Loading',
}: {
  className?: string
  label?: string
}) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-bronze', className)} aria-live="polite">
      <span className="sr-only">{label}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-bronze loading-dot" />
      <span className="w-1.5 h-1.5 rounded-full bg-bronze loading-dot [animation-delay:0.2s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-bronze loading-dot [animation-delay:0.4s]" />
    </span>
  )
}

export function PageLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-canvas px-6 md:px-8 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="space-y-3">
          <div className="h-px bg-muted" />
          <div className="h-8 w-56 bg-canvas-deep" />
          <div className="h-3 w-80 max-w-full bg-canvas-deep" />
        </div>
        <div className="space-y-3">
          <div className="h-3 w-full bg-canvas-deep" />
          <div className="h-3 w-11/12 bg-canvas-deep" />
          <div className="h-3 w-4/5 bg-canvas-deep" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-40 border border-muted bg-canvas-deep/70" />
          <div className="h-40 border border-muted bg-canvas-deep/70" />
        </div>
      </div>
    </div>
  )
}

