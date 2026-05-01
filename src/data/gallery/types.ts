import type { Chapter, Event } from '../../types/event'

/** Row for listings (studio picker, dashboards, `/g` index patterns). Not a DB shape. */
export type GalleryListItem = {
  id: string
  slug: string
  coupleLabel: string
  coverImage: string
  city: string
}

/** Pre-normalized viewer payload — components consume this instead of calling Supabase. */
export type LiveGalleryPayload = {
  event: Event
  resolvedChapters: Chapter[]
  liveChapters: Chapter[]
}

export const galleryKeys = {
  all: ['galleries'] as const,
  list: () => [...galleryKeys.all, 'list'] as const,
  live: () => [...galleryKeys.all, 'live'] as const,
  liveBySlug: (slug: string) => [...galleryKeys.live(), slug] as const,
}
