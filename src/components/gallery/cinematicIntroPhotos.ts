import type { Event } from '../../types/event'

/** Last-resort filler URLs when a gallery has fewer than 8 images (from mockPhotos). */
const FALLBACK_URLS = [
  'https://i.ibb.co/nsBX4P1J/594acc97c78458ea88694ab3c6279a83.jpg',
  'https://i.ibb.co/FbS0pZ5h/6c5cd7dadd2516783da834799d32990f.jpg',
  'https://i.ibb.co/gFwvM4Xq/308a304a8ec8b6b795599169974ceea2.jpg',
  'https://i.ibb.co/F4MZb65Y/1da53936542abd18fd715a5f64a2b398.jpg',
  'https://i.ibb.co/mVggmtGq/bcae9ad60ffd56dc1fe8a402ac38cd57.jpg',
  'https://i.ibb.co/NdvPWhsH/72b4316885dabdc5dd44d3d2c44d1e53.jpg',
  'https://i.ibb.co/gLBtB9PG/7c6fe6524716258fdde54fd472210118.jpg',
  'https://i.ibb.co/XxsN6WJT/4187138aea363913712dddde8d862f35.jpg',
]

/**
 * Up to 8 URLs: first photo of each chapter (chapter order), then cover hero,
 * then remaining chapter photos, then fallbacks (deduped).
 */
export function collectCinematicIntroPhotoUrls(event: Event): string[] {
  const seen = new Set<string>()
  const out: string[] = []

  const add = (u?: string | null) => {
    if (!u || seen.has(u)) return
    seen.add(u)
    out.push(u)
  }

  const chapters = [...event.chapters].sort((a, b) => a.number - b.number)

  for (const ch of chapters) {
    add(ch.photos[0]?.url)
    if (out.length >= 8) return out.slice(0, 8)
  }

  add(event.coverImage)
  if (out.length >= 8) return out.slice(0, 8)

  for (const ch of chapters) {
    for (let i = 1; i < ch.photos.length; i++) {
      add(ch.photos[i]?.url)
      if (out.length >= 8) return out.slice(0, 8)
    }
  }

  for (const ch of chapters) {
    add(ch.coverImage)
    if (out.length >= 8) return out.slice(0, 8)
  }

  for (const url of FALLBACK_URLS) {
    add(url)
    if (out.length >= 8) return out.slice(0, 8)
  }

  return out.slice(0, 8)
}
