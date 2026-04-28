import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudioStore } from '../../stores/studioStore'

const inTypingField = (): boolean => {
  const el = document.activeElement
  return (
    el instanceof HTMLInputElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLSelectElement ||
    (el instanceof HTMLElement && el.isContentEditable)
  )
}

/** Polish 8 — global keyboard behavior while in the studio dashboard shell */
export default function DashboardKeyboardShortcuts() {
  const navigate = useNavigate()
  const gPressed = useRef(false)
  const gTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const typing = inTypingField()

      // Escape closes any open overlays / drawers triggered from the shell
      if (e.key === 'Escape') {
        const s = useStudioStore.getState()
        s.closeCommandPalette()
        s.closeShortcutsHelp()
        s.closeNewEvent()
        return
      }

      // Shift+/ → "?" on US keyboards — shortcuts help overlay
      if (e.shiftKey && e.code === 'Slash') {
        e.preventDefault()
        useStudioStore.getState().openShortcutsHelp()
        return
      }

      // Cmd/Ctrl+K opens command palette everywhere (palette input needs this)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        useStudioStore.getState().openCommandPalette()
        return
      }

      if (typing) return

      // N → new event
      if ((e.key === 'n' || e.key === 'N') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        useStudioStore.getState().openNewEvent()
        return
      }

      // G + letter navigation chords
      if (e.key === 'g' || e.key === 'G') {
        gPressed.current = true
        if (gTimer.current) clearTimeout(gTimer.current)
        gTimer.current = setTimeout(() => {
          gPressed.current = false
        }, 1000)
        return
      }

      if (gPressed.current && gTimer.current) {
        gPressed.current = false
        clearTimeout(gTimer.current)
        gTimer.current = null
        const map: Record<string, string> = {
          o: '/studio/overview',
          e: '/studio/events',
          g: '/studio/galleries',
          c: '/studio/clients',
          i: '/studio/insights',
        }
        const dest = map[e.key.toLowerCase()]
        if (dest) {
          e.preventDefault()
          navigate(dest)
          useStudioStore.getState().closeShortcutsHelp()
        }
      }
    }

    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('keydown', handler)
      if (gTimer.current) clearTimeout(gTimer.current)
    }
  }, [navigate])

  return null
}
