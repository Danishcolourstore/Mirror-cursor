import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import StudioPathRouter from './components/StudioPathRouter'
import NotFound from './routes/NotFound'
import ShortcutsOverlay from './components/studio/ShortcutsOverlay'
import ToastHost from './components/ui/ToastHost'
import { PageLoadingSkeleton } from './components/ui/LoadingStates'

// Gallery routes
import GalleryView from './routes/gallery/GalleryView'
import ChapterView from './routes/gallery/ChapterView'

import PageTransition from './components/ui/PageTransition'

import { useEventsStore } from './stores/eventsStore'

export default function App() {
  const location = useLocation()
  const [hydrated, setHydrated] = useState(() => useEventsStore.persist.hasHydrated())

  useEffect(() => {
    if (useEventsStore.persist.hasHydrated()) {
      setHydrated(true)
      return
    }
    const unsub = useEventsStore.persist.onFinishHydration(() => {
      setHydrated(true)
    })
    return () => {
      unsub()
    }
  }, [])

  if (!hydrated) {
    return <PageLoadingSkeleton />
  }

  return (
    <>
      <ShortcutsOverlay />
      <ToastHost />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.key}>
          <Route path="/" element={<Navigate to="/studio/overview" replace />} />
          <Route path="/studio/*" element={<StudioPathRouter />} />
          <Route path="/g/:slug" element={<PageTransition mode="gallery"><GalleryView /></PageTransition>} />
          <Route path="/g/:slug/:chapterId" element={<PageTransition mode="gallery"><ChapterView /></PageTransition>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </>
  )
}
