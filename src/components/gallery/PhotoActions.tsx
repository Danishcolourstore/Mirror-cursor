import { useState } from 'react'
import { Heart, Download, Share2 } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useGalleryStore } from '../../stores/galleryStore'
import ShareSheet from './ShareSheet'
import type { Photo as PhotoType } from '../../types/photo'

/** Top-right overlays for grid photos: favourite, mock download, share sheet. Desktop: fades in on hover. */
export default function PhotoActions({ photo }: { photo: PhotoType }) {
  const { toggleFavorite, isFavorited } = useGalleryStore()
  const favorited = isFavorited(photo.id)
  const [shareOpen, setShareOpen] = useState(false)
  const [heartPop, setHeartPop] = useState(false)

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShareOpen(true)
  }

  return (
    <>
      <div
        className={cn(
          'absolute right-2 top-2 z-50 flex flex-row gap-1.5',
          'opacity-100 pointer-events-auto'
        )}
      >
        <RoundAction
          onClick={(e) => {
            e.stopPropagation()
            toggleFavorite(photo.id)
            setHeartPop(true)
            window.setTimeout(() => setHeartPop(false), 150)
          }}
          aria-label={favorited ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            size={15}
            strokeWidth={0}
            className={cn(
              heartPop && 'heart-pop',
              favorited
                ? 'fill-bronze text-bronze'
                : 'fill-white text-white'
            )}
          />
        </RoundAction>

        <RoundAction onClick={handleDownload} aria-label="Download photo">
          <Download size={15} strokeWidth={1.5} className="text-white" />
        </RoundAction>

        <RoundAction onClick={handleShare} aria-label="Share photo">
          <Share2 size={15} strokeWidth={1.5} className="text-white" />
        </RoundAction>
      </div>

      <ShareSheet open={shareOpen} onClose={() => setShareOpen(false)} photoUrl={photo.url} />
    </>
  )
}

function RoundAction({
  onClick,
  children,
  'aria-label': ariaLabel,
}: {
  onClick: (e: React.MouseEvent) => void
  children: React.ReactNode
  'aria-label': string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex shrink-0 items-center justify-center rounded-full touch-manipulation"
      style={{ width: 44, height: 44, minWidth: 44, minHeight: 44 }}
    >
      <span
        className={cn(
          'flex items-center justify-center rounded-full',
          'bg-black/[0.35] backdrop-blur-[4px] transition-colors duration-200 hover:bg-black/50'
        )}
        style={{ width: 32, height: 32 }}
      >
        {children}
      </span>
    </button>
  )
}
