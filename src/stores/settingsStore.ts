import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PhotoGridSpacing } from '../types/event'

export type GallerySettings = {
  watermark: boolean
  downloadEnabled: boolean
  passwordProtect: boolean
}

export type StudioDefaultThemeSettings = {
  coverOverlayTintPct: number
  photoGridSpacing: PhotoGridSpacing
  musicDefaultOn: boolean
}

export type NotificationSettings = {
  chapterNotifs: boolean
  viewAlerts: boolean
  favoriteAlerts: boolean
  weeklyDigest: boolean
}

type SettingsStore = {
  gallery: GallerySettings
  notifications: NotificationSettings
  studioDefaultTheme: StudioDefaultThemeSettings
  updateGallery: (patch: Partial<GallerySettings>) => void
  updateNotifications: (patch: Partial<NotificationSettings>) => void
  updateStudioDefaultTheme: (patch: Partial<StudioDefaultThemeSettings>) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      gallery: {
        watermark: false,
        downloadEnabled: false,
        passwordProtect: false,
      },
      notifications: {
        chapterNotifs: true,
        viewAlerts: true,
        favoriteAlerts: false,
        weeklyDigest: true,
      },
      studioDefaultTheme: {
        coverOverlayTintPct: 24,
        photoGridSpacing: 'normal',
        musicDefaultOn: false,
      },

      updateGallery: (patch) =>
        set((state) => ({ gallery: { ...state.gallery, ...patch } })),

      updateNotifications: (patch) =>
        set((state) => ({ notifications: { ...state.notifications, ...patch } })),

      updateStudioDefaultTheme: (patch) =>
        set((state) => ({
          studioDefaultTheme: { ...state.studioDefaultTheme, ...patch },
        })),
    }),
    {
      name: 'mirror-settings-store',
      version: 2,
    }
  )
)
