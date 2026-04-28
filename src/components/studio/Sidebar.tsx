import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutGrid,
  Calendar,
  Image,
  Users,
  BookOpen,
  BarChart3,
  Settings,
} from 'lucide-react'
import { cn } from '../../lib/cn'
import { useStudioStore } from '../../stores/studioStore'

type NavItem = {
  to: string
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
  label: string
  shortLabel?: string
}

type NavSection = {
  label: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    label: 'Today',
    items: [
      { to: '/studio/overview', icon: LayoutGrid, label: 'Overview', shortLabel: 'Home' },
      { to: '/studio/events',   icon: Calendar,   label: 'Events'   },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { to: '/studio/galleries', icon: Image,    label: 'Galleries', shortLabel: 'Gallery' },
      { to: '/studio/clients',   icon: Users,    label: 'Clients'   },
      { to: '/studio/albums',    icon: BookOpen, label: 'Albums'    },
    ],
  },
  {
    label: 'Studio',
    items: [
      { to: '/studio/insights',  icon: BarChart3, label: 'Insights'  },
      { to: '/studio/settings',  icon: Settings,  label: 'Settings'  },
    ],
  },
]

// Five most-used items shown in the mobile tab bar
const mobileItems: NavItem[] = [
  { to: '/studio/overview',  icon: LayoutGrid, label: 'Overview', shortLabel: 'Home' },
  { to: '/studio/events',    icon: Calendar,   label: 'Events'   },
  { to: '/studio/galleries', icon: Image,      label: 'Galleries', shortLabel: 'Gallery' },
  { to: '/studio/clients',   icon: Users,      label: 'Clients'  },
  { to: '/studio/settings',  icon: Settings,   label: 'Settings' },
]

export default function Sidebar() {
  const { ownerName, ownerRole, avatarInitials, studioName } = useStudioStore()
  const location = useLocation()
  const [first, ...rest] = studioName.split(' ')
  const second = rest.join(' ') || 'Studio'

  return (
    <>
      {/* ── Desktop sidebar ───────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-canvas border-r border-muted min-h-screen sticky top-0 h-screen">

        {/* Brand mark */}
        <div className="px-6 py-6 border-b border-muted">
          <span className="serif font-normal text-[17px] tracking-tight text-ink">
            {first}
            <em className="not-italic text-bronze font-normal italic">·</em>
            {second}
          </span>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 px-3 py-5 overflow-y-auto scrollbar-hide">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              <p className="nav-label px-3 mb-2">{section.label}</p>
              <ul className="space-y-0.5">
                {section.items.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      className={({ isActive }) =>
                        cn(
                          'relative flex items-center gap-3 pl-4 pr-3 py-2 rounded-md font-sans transition-colors duration-400',
                          'before:absolute before:left-0 before:top-[6px] before:bottom-[6px] before:w-[3px] before:rounded-r before:bg-bronze',
                          isActive
                            ? 'before:opacity-100 bg-canvas-deep text-ink'
                            : 'before:opacity-0 text-ink hover:bg-canvas-deep/80 hover:text-ink'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            size={15}
                            strokeWidth={isActive ? 1.8 : 1.5}
                            className={cn('shrink-0', isActive ? 'text-bronze' : 'text-whisper')}
                          />
                          <span className="font-sans text-[13px] font-normal leading-none">
                            {item.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* User footer + shortcuts hint */}
        <div className="border-t border-muted">
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-night flex items-center justify-center shrink-0">
              <span className="serif text-white text-[11px] font-normal">{avatarInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="serif text-[13px] font-normal text-ink leading-tight truncate">{ownerName}</p>
              <p className="font-sans text-[11px] text-whisper leading-tight mt-0.5">{ownerRole}</p>
            </div>
            <kbd
              className="font-sans text-[9px] text-whisper border border-muted px-1.5 py-0.5 cursor-default"
              title="Press ? for keyboard shortcuts"
            >
              ?
            </kbd>
          </div>
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ─────────────────────────────────────────── */}
      <div
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-canvas border-t border-muted"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <nav className="flex items-stretch">
          {mobileItems.map((item) => {
            const isActive =
              location.pathname === item.to ||
              (item.to !== '/studio/overview' && location.pathname.startsWith(item.to + '/'))
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="relative flex-1 flex flex-col items-center justify-center gap-1 py-2.5 min-w-0"
                style={{ touchAction: 'manipulation' }}
              >
                <item.icon
                  size={20}
                  strokeWidth={isActive ? 1.8 : 1.4}
                  className={cn(
                    'transition-colors duration-400',
                    isActive ? 'text-bronze' : 'text-whisper'
                  )}
                />
                <span
                  className={cn(
                    'font-sans text-[9px] uppercase leading-none transition-colors duration-400',
                    isActive ? 'text-ink' : 'text-whisper'
                  )}
                  style={{ letterSpacing: '0.12em' }}
                >
                  {item.shortLabel ?? item.label}
                </span>

                {isActive && (
                  <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-bronze" />
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </>
  )
}
