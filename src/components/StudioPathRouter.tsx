import { lazy, Suspense } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './studio/Sidebar'
import PageTransition from './ui/PageTransition'
import { AnimatePresence } from 'framer-motion'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PageLoadingSkeleton } from './ui/LoadingStates'

const Overview = lazy(() => import('../routes/studio/Overview'))
const Events = lazy(() => import('../routes/studio/Events'))
const EventDetail = lazy(() => import('../routes/studio/EventDetail'))
const Galleries = lazy(() => import('../routes/studio/Galleries'))
const Clients = lazy(() => import('../routes/studio/Clients'))
const Albums = lazy(() => import('../routes/studio/Albums'))
const Insights = lazy(() => import('../routes/studio/Insights'))
const Settings = lazy(() => import('../routes/studio/Settings'))

import StudioPublicProfile from '../routes/public/StudioPublicProfile'
import CommandPalette from './studio/CommandPalette'
import NewEventDrawer from './studio/NewEventDrawer'
import NotificationBell from './studio/NotificationBell'
import DashboardKeyboardShortcuts from './studio/DashboardKeyboardShortcuts'
import { useStudioStore } from '../stores/studioStore'

const DASHBOARD_SEGMENTS = new Set([
  'overview',
  'events',
  'galleries',
  'clients',
  'albums',
  'insights',
  'settings',
])

/** Single-segment URLs under `/studio/` that are not the app shell → public studio profiles (Polish 4). */
function isPublicStudioPath(pathname: string): boolean {
  const segs = pathname.replace(/^\/studio\/?/, '').split('/').filter(Boolean)
  return segs.length === 1 && !DASHBOARD_SEGMENTS.has(segs[0])
}

function StudioDashboardLayout() {
  const location = useLocation()
  const commandPaletteOpen = useStudioStore((s) => s.commandPaletteOpen)
  const closeCommandPalette = useStudioStore((s) => s.closeCommandPalette)
  const newEventOpen = useStudioStore((s) => s.newEventOpen)
  const closeNewEvent = useStudioStore((s) => s.closeNewEvent)

  return (
    <div className="flex min-h-screen bg-canvas">
      <DashboardKeyboardShortcuts />
      <Sidebar />
      <NotificationBell />
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Suspense fallback={<PageLoadingSkeleton />}>
          <AnimatePresence mode="wait" initial={false}>
            <Routes location={location} key={location.pathname}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<PageTransition><Overview /></PageTransition>} />
              <Route path="events" element={<PageTransition><Events /></PageTransition>} />
              <Route path="events/:id" element={<PageTransition><EventDetail /></PageTransition>} />
              <Route path="galleries" element={<PageTransition><Galleries /></PageTransition>} />
              <Route path="clients" element={<PageTransition><Clients /></PageTransition>} />
              <Route path="albums" element={<PageTransition><Albums /></PageTransition>} />
              <Route path="insights" element={<PageTransition><Insights /></PageTransition>} />
              <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </main>

      <CommandPalette open={commandPaletteOpen} onClose={closeCommandPalette} />
      <NewEventDrawer open={newEventOpen} onClose={closeNewEvent} />
    </div>
  )
}

/**
 * Routes `/studio/overview` … through the authenticated shell; `/studio/:publicSlug`
 * shows the editorial public studio profile without sidebar overlays.
 */
export default function StudioPathRouter() {
  const { pathname } = useLocation()

  if (isPublicStudioPath(pathname)) {
    return <StudioPublicProfile />
  }

  return <StudioDashboardLayout />
}
