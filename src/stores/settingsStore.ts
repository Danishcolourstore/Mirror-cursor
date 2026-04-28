import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type GallerySettings = {
  watermark: boolean
  downloadEnabled: boolean
  passwordProtect: boolean
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
  updateGallery: (patch: Partial<GallerySettings>) => void
  updateNotifications: (patch: Partial<NotificationSettings>) => void
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

      updateGallery: (patch) =>
        set((state) => ({ gallery: { ...state.gallery, ...patch } })),

      updateNotifications: (patch) =>
        set((state) => ({ notifications: { ...state.notifications, ...patch } })),
    }),
    {
      name: 'mirror-settings-store',
      version: 1,
    }
  )
)
