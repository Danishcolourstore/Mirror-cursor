export type GalleryImgPreset = 'grid-mobile' | 'grid-desktop' | 'lightbox'

/**
 * Best-effort responsive URLs. Hosts without transform APIs return the original src.
 */
export function galleryImageSrc(url: string, preset: GalleryImgPreset): string {
  const lower = url.toLowerCase()
  if (lower.includes('images.unsplash.com') || lower.includes('unsplash.com')) {
    const sep = url.includes('?') ? '&' : '?'
    if (preset === 'grid-mobile') return `${url}${sep}w=800&q=80&fm=jpg`
    if (preset === 'grid-desktop') return `${url}${sep}w=1600&q=82&fm=jpg`
    return `${url}${sep}w=2400&q=85&fm=jpg`
  }
  return url
}
