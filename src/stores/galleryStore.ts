import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type SubmitFavoritesPayload = {
  slug: string
  brideName: string
  whatsappE164: string
  note?: string
  photoIds: string[]
}

type GalleryStore = {
  activeChapterId: string | null
  lightboxPhotoId: string | null
  isMusicPlaying: boolean
  favoritedIds: string[]
  /** Slugs for which "Send to studio" succeeded this session (persisted). */
  favoritesSentSlugs: string[]
  favoritesSubmissions: SubmitFavoritesPayload[]
  setActiveChapter: (id: string | null) => void
  openLightbox: (photoId: string) => void
  closeLightbox: () => void
  toggleMusic: () => void
  setMusicPlaying: (on: boolean) => void
  toggleFavorite: (photoId: string) => void
  isFavorited: (photoId: string) => boolean
  clearFavorites: () => void
  clearFavoriteIds: (photoIds: string[]) => void
  submitFavoritesToStudio: (payload: SubmitFavoritesPayload) => void
  favoritesSentForSlug: (slug: string) => boolean
}

export const useGalleryStore = create<GalleryStore>()(
  persist(
    (set, get) => ({
      activeChapterId: null,
      lightboxPhotoId: null,
      isMusicPlaying: false,
      favoritedIds: [],
      favoritesSentSlugs: [],
      favoritesSubmissions: [],

      setActiveChapter: (id) => set({ activeChapterId: id }),

      openLightbox: (photoId) => set({ lightboxPhotoId: photoId }),

      closeLightbox: () => set({ lightboxPhotoId: null }),

      toggleMusic: () =>
        set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),

      setMusicPlaying: (on) => set({ isMusicPlaying: on }),

      toggleFavorite: (photoId) =>
        set((state) => {
          const exists = state.favoritedIds.includes(photoId)
          return {
            favoritedIds: exists
              ? state.favoritedIds.filter((id) => id !== photoId)
              : [...state.favoritedIds, photoId],
          }
        }),

      isFavorited: (photoId) => get().favoritedIds.includes(photoId),

      clearFavorites: () => set({ favoritedIds: [] }),

      clearFavoriteIds: (photoIds) =>
        set((state) => {
          if (photoIds.length === 0) return state
          const remove = new Set(photoIds)
          return {
            favoritedIds: state.favoritedIds.filter((id) => !remove.has(id)),
          }
        }),

      submitFavoritesToStudio: (payload) =>
        set((state) => ({
          favoritesSubmissions: [...state.favoritesSubmissions, payload],
          favoritesSentSlugs: state.favoritesSentSlugs.includes(payload.slug)
            ? state.favoritesSentSlugs
            : [...state.favoritesSentSlugs, payload.slug],
        })),

      favoritesSentForSlug: (slug) => get().favoritesSentSlugs.includes(slug),
    }),
    {
      name: 'mirror-gallery-store',
      partialize: (state) => ({
        favoritedIds: state.favoritedIds,
        favoritesSentSlugs: state.favoritesSentSlugs,
        favoritesSubmissions: state.favoritesSubmissions,
      }),
    }
  )
)
