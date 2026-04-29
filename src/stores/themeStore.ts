import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ThemeId = 'warm' | 'white' | 'black'

type ThemeState = {
  theme: ThemeId
  setTheme: (theme: ThemeId) => void
}

export const useThemeStore = create(
  persist<ThemeState>(
    (set) => ({
      theme: 'warm',
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'mirror-theme' }
  )
)
