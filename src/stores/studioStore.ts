import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type StudioProfile = {
  studioName: string
  ownerName: string
  ownerRole: string
  email: string
  phone: string
  city: string
  instagram: string
  website: string
  tagline: string
}

type StudioStore = StudioProfile & {
  avatarInitials: string
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  /** Polish 8 — global command palette (replaces standalone search overlay) */
  commandPaletteOpen: boolean
  openCommandPalette: () => void
  closeCommandPalette: () => void
  /** Keyboard shortcuts reference modal */
  shortcutsHelpOpen: boolean
  openShortcutsHelp: () => void
  closeShortcutsHelp: () => void
  /** Legacy alias — routed to command palette */
  openSearch: () => void
  closeSearch: () => void

  newEventOpen: boolean
  openNewEvent: () => void
  closeNewEvent: () => void
  updateProfile: (patch: Partial<StudioProfile>) => void
}

const defaultProfile: StudioProfile = {
  studioName: 'Mirror Studio',
  ownerName: 'Cep',
  ownerRole: 'Founder',
  email: 'hello@mirrorstudio.in',
  phone: '+91 98765 43210',
  city: 'Mumbai',
  instagram: '@mirrorstudio',
  website: 'www.mirrorstudio.in',
  tagline: 'A wedding film, in stills',
}

const initialsFor = (name: string): string => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'M'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export const useStudioStore = create<StudioStore>()(
  persist(
    (set) => ({
      ...defaultProfile,
      avatarInitials: initialsFor(defaultProfile.ownerName),
      sidebarOpen: true,

      setSidebarOpen: (open) => set({ sidebarOpen: open }),

      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      commandPaletteOpen: false,
      openCommandPalette: () =>
        set({ commandPaletteOpen: true, shortcutsHelpOpen: false }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),

      shortcutsHelpOpen: false,
      openShortcutsHelp: () =>
        set({ shortcutsHelpOpen: true, commandPaletteOpen: false }),
      closeShortcutsHelp: () => set({ shortcutsHelpOpen: false }),

      openSearch: () => set({ commandPaletteOpen: true, shortcutsHelpOpen: false }),
      closeSearch: () => set({ commandPaletteOpen: false }),

      newEventOpen: false,
      openNewEvent: () =>
        set({ newEventOpen: true, commandPaletteOpen: false, shortcutsHelpOpen: false }),
      closeNewEvent: () => set({ newEventOpen: false }),

      updateProfile: (patch) =>
        set((state) => {
          const next = { ...state, ...patch }
          if (patch.ownerName !== undefined) {
            next.avatarInitials = initialsFor(patch.ownerName)
          }
          return next
        }),
    }),
    {
      name: 'mirror-studio-store',
      version: 3,
      partialize: (state) => ({
        studioName: state.studioName,
        ownerName: state.ownerName,
        ownerRole: state.ownerRole,
        email: state.email,
        phone: state.phone,
        city: state.city,
        instagram: state.instagram,
        website: state.website,
        tagline: state.tagline,
        sidebarOpen: state.sidebarOpen,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.avatarInitials = initialsFor(state.ownerName)
        }
      },
    }
  )
)
