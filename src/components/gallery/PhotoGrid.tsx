import { useEffect, useMemo, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { Photo as LegacyPhoto } from '../../types/photo'
import PhotoCard from './PhotoCard'

type PhotoGridItem = {
  id: string
  src: string
  alt: string
  chapter: string
}

type PhotoGridProps = {
  photos: Array<LegacyPhoto | PhotoGridItem>
  favoritedIds?: string[] | Set<string>
  onToggleFavorite?: (id: string) => void
  onPhotoOpen?: (index: number) => void
  endSentinelRef?: RefObject<HTMLDivElement | null>
}

function normalizePhotos(
  photos: Array<LegacyPhoto | PhotoGridItem>
): PhotoGridItem[] {
  return photos.map((photo) => {
    const source = 'src' in photo ? photo.src : photo.url
    const caption = 'alt' in photo ? photo.alt : photo.caption
    return {
      id: photo.id,
      src: source,
      alt: caption ?? 'Wedding moment',
      chapter: 'chapter' in photo ? photo.chapter : 'Wedding Day',
    }
  })
}

export default function PhotoGrid({
  photos,
  favoritedIds,
  onToggleFavorite,
  onPhotoOpen,
  endSentinelRef,
}: PhotoGridProps) {
  const normalized = useMemo(() => normalizePhotos(photos), [photos])
  const [visibleIds, setVisibleIds] = useState<Set<string>>(() => new Set())
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const favoriteSet = useMemo(() => {
    if (favoritedIds instanceof Set) return favoritedIds
    if (Array.isArray(favoritedIds)) return new Set(favoritedIds)
    return new Set<string>()
  }, [favoritedIds])

  // Intersection Observer for staggered reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleIds((current) => {
          const next = new Set(current)
          entries.forEach((entry) => {
            const target = entry.target as HTMLElement
            const id = target.dataset.photoId
            if (!id) return
            if (entry.isIntersecting) {
              next.add(id)
            }
          })
          return next
        })
      },
      { threshold: 0.22, rootMargin: '20% 0px -10% 0px' }
    )

    const targets = Array.from(itemRefs.current.values())
    targets.forEach((target) => observer.observe(target))

    return () => observer.disconnect()
  }, [normalized.length])

  return (
    <section
      id="photo-grid"
      className="bg-[var(--bg-primary)] px-1 py-8 sm:px-2 md:px-4"
    >
      <div className="masonry columns-2 gap-1 [column-gap:4px] md:columns-3 xl:columns-4">
        {normalized.map((photo, index) => (
          <div
            key={photo.id}
            ref={(element) => {
              if (element) itemRefs.current.set(photo.id, element)
              else itemRefs.current.delete(photo.id)
            }}
            data-photo-id={photo.id}
            className={[
              'masonry-item reveal-item mb-1 break-inside-avoid',
              index % 7 === 6
                ? 'is-featured border-l-2 border-[#C9A96E]'
                : '',
              visibleIds.has(photo.id)
                ? 'translate-y-0 opacity-100'
                : 'translate-y-[10px] opacity-0',
              `reveal-slot-${index % 12}`,
            ].join(' ')}
          >
            <PhotoCard
              id={photo.id}
              src={photo.src}
              alt={photo.alt}
              isFavorited={favoriteSet.has(photo.id)}
              onToggleFavorite={(id) => onToggleFavorite?.(id)}
              onOpen={() => onPhotoOpen?.(index)}
            />
          </div>
        ))}
      </div>

      <div ref={endSentinelRef} className="h-px w-full" aria-hidden />

      <style>{`
        .reveal-item {
          transition-property: opacity, transform;
          transition-duration: 700ms;
          transition-timing-function: cubic-bezier(0.22, 0.84, 0.24, 1);
        }
        .reveal-slot-0  { transition-delay: 0ms; }
        .reveal-slot-1  { transition-delay: 70ms; }
        .reveal-slot-2  { transition-delay: 140ms; }
        .reveal-slot-3  { transition-delay: 210ms; }
        .reveal-slot-4  { transition-delay: 280ms; }
        .reveal-slot-5  { transition-delay: 350ms; }
        .reveal-slot-6  { transition-delay: 420ms; }
        .reveal-slot-7  { transition-delay: 490ms; }
        .reveal-slot-8  { transition-delay: 560ms; }
        .reveal-slot-9  { transition-delay: 630ms; }
        .reveal-slot-10 { transition-delay: 700ms; }
        .reveal-slot-11 { transition-delay: 770ms; }
        .masonry-item.is-featured {
          border-left-width: 2px;
          border-left-color: rgba(201, 169, 110, 0.95);
        }
      `}</style>
    </section>
  )
}
