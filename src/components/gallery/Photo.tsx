import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useGalleryStore } from '../../stores/galleryStore'
import ProgressiveImage from '../ui/ProgressiveImage'
import type { Photo as PhotoType } from '../../types/photo'

type PhotoProps = {
  photo: PhotoType
  onClick: () => void
  className?: string
  style?: React.CSSProperties
}

export default function Photo({ photo, onClick, className, style }: PhotoProps) {
  const { toggleFavorite, isFavorited } = useGalleryStore()
  const favorited = isFavorited(photo.id)

  return (
    <motion.div
      className={cn('relative overflow-hidden cursor-zoom-in group', className)}
      style={style}
      whileHover={{ scale: 1.04 }}
      transition={{ duration: 1.4, ease: [0.2, 0.6, 0.2, 1] }}
      onClick={onClick}
    >
      <ProgressiveImage src={photo.url} alt={photo.caption ?? ''} />

      {/* Hover overlay — subtle veil */}
      <div className="absolute inset-0 bg-night/0 group-hover:bg-night/10 transition-colors duration-[1400ms]" />

      {/* Favorite button — fades in on hover, always visible when active */}
      <button
        className={cn(
          'absolute top-2.5 right-2.5 p-2 transition-all duration-400',
          'opacity-0 group-hover:opacity-100',
          'sm:p-1.5',
          favorited && 'opacity-100'
        )}
        onClick={(e) => {
          e.stopPropagation()
          toggleFavorite(photo.id)
        }}
        style={{ touchAction: 'manipulation' }}
        aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
      >
        <Heart
          size={15}
          strokeWidth={1.5}
          className={cn(
            'transition-colors duration-400',
            favorited
              ? 'fill-bronze-soft text-bronze-soft'
              : 'text-inverse-fg/70 hover:text-bronze-soft'
          )}
        />
      </button>
    </motion.div>
  )
}
