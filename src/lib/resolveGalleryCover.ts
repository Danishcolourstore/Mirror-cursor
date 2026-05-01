import type { Event, GalleryCoverSize } from '../types/event'

export function resolvePublicCoverImageUrl(event: Event): string {
  const id = event.galleryCoverPhotoId
  if (!id) return event.coverImage
  for (const ch of event.chapters) {
    const p = ch.photos.find((ph) => ph.id === id)
    if (p) return p.url
  }
  return event.coverImage
}

export function clampGalleryTintPct(raw: number | undefined | null): number {
  if (raw === undefined || raw === null || Number.isNaN(raw)) return 24
  return Math.min(50, Math.max(0, raw))
}

export function coverSectionMinHeight(size: GalleryCoverSize | undefined): string {
  switch (size) {
    case 'small':
      return 'min(55svh, 720px)'
    case 'medium':
      return 'min(72svh, 900px)'
    case 'fullscreen':
    default:
      return '100svh'
  }
}
