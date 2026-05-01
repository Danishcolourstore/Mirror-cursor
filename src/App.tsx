import { lazy, Suspense, useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

const StudioPathRouter = lazy(() => import('./components/StudioPathRouter'))
const NotFound = lazy(() => import('./routes/NotFound'))
import ShortcutsOverlay from './components/studio/ShortcutsOverlay'
import ToastHost from './components/ui/ToastHost'
import { PageLoadingSkeleton } from './components/ui/LoadingStates'
// Gallery routes
import ChapterView from './routes/gallery/ChapterView'
import GuestGalleryPage from './pages/GuestGalleryPage'

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
      <Suspense fallback={<PageLoadingSkeleton />}>
        <AnimatePresence mode="wait" initial={false}>
          <Routes location={location} key={location.key}>
            <Route path="/" element={<Navigate to="/studio/overview" replace />} />
            <Route path="/studio/*" element={<StudioPathRouter />} />
            <Route path="/g/:slug/:chapterId" element={<PageTransition mode="gallery"><ChapterView /></PageTransition>} />
            <Route path="/g/:guestToken" element={<PageTransition mode="gallery"><GuestGalleryPage /></PageTransition>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}
