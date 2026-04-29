import { useLayoutEffect, useEffect } from 'react'
import { useThemeStore, type ThemeId } from '../../stores/themeStore'

const THEME_COLOR: Record<ThemeId, string> = {
  warm: '#F6F1E8',
  white: '#FFFFFF',
  black: '#080808',
}

function applyMetaTheme(theme: ThemeId) {
  document.documentElement.dataset.theme = theme
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', THEME_COLOR[theme])
}

/** Applies store theme to <html data-theme> and syncs after Zustand persist hydration. */
export default function HtmlThemeSync() {
  const theme = useThemeStore((s) => s.theme)

  useLayoutEffect(() => {
    applyMetaTheme(theme)
  }, [theme])

  useEffect(() => {
    const unsub = useThemeStore.persist.onFinishHydration(() => {
      applyMetaTheme(useThemeStore.getState().theme)
    })
    return unsub
  }, [])

  return null
}
