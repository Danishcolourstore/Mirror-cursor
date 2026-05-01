import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Event, Chapter, Milestone } from '../types/event'
import type { Photo } from '../types/photo'
import { mockEvents } from '../data/mockEvents'

type EventsStore = {
  events: Event[]
  getEventById: (id: string) => Event | undefined
  getEventBySlug: (slug: string) => Event | undefined
  updateEventProgress: (id: string, progress: number) => void
  updateEvent: (id: string, patch: Partial<Event>) => void
  updateChapter: (eventId: string, chapterId: string, patch: Partial<Chapter>) => void
  updatePhotoInChapter: (
    eventId: string,
    chapterId: string,
    photoId: string,
    patch: Partial<Photo>
  ) => void
  updateMilestones: (eventId: string, milestones: Milestone[]) => void
  addEvent: (event: Event) => void
  resetToMocks: () => void
}

export const useEventsStore = create<EventsStore>()(
  persist(
    (set, get) => ({
      events: mockEvents,

      getEventById: (id) => get().events.find((e) => e.id === id),

      getEventBySlug: (slug) => get().events.find((e) => e.slug === slug),

      updateEventProgress: (id, progress) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, progress } : e
          ),
        })),

      updateEvent: (id, patch) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === id ? { ...e, ...patch } : e
          ),
        })),

      updateChapter: (eventId, chapterId, patch) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId
              ? {
                  ...e,
                  chapters: e.chapters.map((c) =>
                    c.id === chapterId ? { ...c, ...patch } : c
                  ),
                }
              : e
          ),
        })),

      updatePhotoInChapter: (eventId, chapterId, photoId, photoPatch) =>
        set((state) => ({
          events: state.events.map((e) => {
            if (e.id !== eventId) return e
            return {
              ...e,
              chapters: e.chapters.map((c) => {
                if (c.id !== chapterId) return c
                return {
                  ...c,
                  photos: c.photos.map((p) =>
                    p.id === photoId ? { ...p, ...photoPatch } : p
                  ),
                }
              }),
            }
          }),
        })),

      updateMilestones: (eventId, milestones) =>
        set((state) => ({
          events: state.events.map((e) =>
            e.id === eventId ? { ...e, milestones } : e
          ),
        })),

      addEvent: (event) =>
        set((state) => ({ events: [event, ...state.events] })),

      resetToMocks: () => set({ events: mockEvents }),
    }),
    {
      name: 'mirror-events-store',
      version: 1,
      partialize: (state) => ({ events: state.events }),
    }
  )
)
