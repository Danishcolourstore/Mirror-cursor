import type { Chapter, Event } from '../../types/event'
import { mockEvents } from '../mockEvents'
import type { GalleryListItem, LiveGalleryPayload } from './types'

/**
 * Public gallery reads go through this module only.
 * Replace the implementations here with Supabase (or Edge) fetchers later — hooks and UI stay unchanged.
 */

function startOfToday(reference: Date): Date {
  const d = new Date(reference)
  d.setHours(0, 0, 0, 0)
  return d
}

/** Aligns scheduled chapters whose unlock date has passed to `live` (same rules as gallery viewer). */
export function resolveChaptersForGallery(
  chapters: Chapter[],
  referenceDate: Date = new Date()
): Chapter[] {
  const today = startOfToday(referenceDate)

  return chapters.map((c) => {
    if (c.status === 'scheduled' && c.unlockDate) {
      const unlock = new Date(c.unlockDate)
      unlock.setHours(0, 0, 0, 0)
      if (unlock <= today) return { ...c, status: 'live' as const }
    }
    return c
  })
}

export async function listPublicGalleries(): Promise<GalleryListItem[]> {
  await Promise.resolve()
  return mockEvents.map((e) => ({
    id: e.id,
    slug: e.slug,
    coupleLabel: `${e.couple.brideName} & ${e.couple.groomName}`,
    coverImage: e.coverImage,
    city: e.venue.city,
  }))
}

export async function fetchLiveGalleryBySlug(slug: string): Promise<LiveGalleryPayload | null> {
  await Promise.resolve()
  const trimmed = slug.trim()
  if (!trimmed) return null

  const event = mockEvents.find((e) => e.slug === trimmed) ?? null
  if (!event) return null

  const resolvedChapters = resolveChaptersForGallery(event.chapters)
  const liveChapters = resolvedChapters.filter((c) => c.status === 'live')

  const normalizedEvent: Event = { ...event, chapters: resolvedChapters }

  return {
    event: normalizedEvent,
    resolvedChapters,
    liveChapters,
  }
}
