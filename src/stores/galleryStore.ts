import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type GalleryStore = {
  activeChapterId: string | null
  lightboxPhotoId: string | null
  isMusicPlaying: boolean
  favoritedIds: string[]
  setActiveChapter: (id: string | null) => void
  openLightbox: (photoId: string) => void
  closeLightbox: () => void
  toggleMusic: () => void
  toggleFavorite: (photoId: string) => void
  isFavorited: (photoId: string) => boolean
}

export const useGalleryStore = create<GalleryStore>()(
  persist(
    (set, get) => ({
      activeChapterId: null,
      lightboxPhotoId: null,
      isMusicPlaying: false,
      favoritedIds: [],

      setActiveChapter: (id) => set({ activeChapterId: id }),

      openLightbox: (photoId) => set({ lightboxPhotoId: photoId }),

      closeLightbox: () => set({ lightboxPhotoId: null }),

      toggleMusic: () =>
        set((state) => ({ isMusicPlaying: !state.isMusicPlaying })),

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
    }),
    {
      name: 'mirror-gallery-store',
      partialize: (state) => ({ favoritedIds: state.favoritedIds }),
    }
  )
)
