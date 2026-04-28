import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../lib/cn'

type ProgressiveImageProps = {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  /** Show a warm ivory pulse until the image loads */
  shimmer?: boolean
}

export default function ProgressiveImage({
  src,
  alt,
  className,
  style,
  shimmer = true,
}: ProgressiveImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  return (
    <span className="relative block overflow-hidden w-full h-full" style={style}>
      {/* Warm ivory pulse placeholder while loading */}
      {shimmer && !loaded && !errored && (
        <span
          className="absolute inset-0 z-10"
          style={{
            background: 'linear-gradient(180deg, #F6F1E8 0%, #EDE6D8 100%)',
            animation: 'ivoryPulse 1.6s ease-in-out infinite',
          }}
        />
      )}

      <motion.img
        src={src}
        alt={alt}
        className={cn('w-full h-full object-cover', className)}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 0.7, ease: [0.2, 0.6, 0.2, 1] }}
      />

      {/* Error state */}
      {errored && (
        <span className="absolute inset-0 flex items-center justify-center bg-canvas-deep">
          <span className="serif italic text-whisper/40 text-xs">Image unavailable</span>
        </span>
      )}
    </span>
  )
}
