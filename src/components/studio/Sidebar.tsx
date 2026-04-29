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
import ThemeToggle from './ThemeToggle'

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
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-canvas-deep border-r border-muted min-h-screen sticky top-0 h-screen">

        <div className="px-6 py-6 border-b border-muted">
          <span className="serif font-normal text-[17px] tracking-tight text-ink">
            {first}
            <em className="not-italic text-bronze font-normal italic">·</em>
            {second}
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 overflow-y-auto scrollbar-hide">
          {navSections.map((section) => (
            <div key={section.label} className="mb-6">
              <p className="nav-label px-3 mb-2">{section.label}</p>
              <ul className="space-y-0.5">
                {section.items.map(({ to, icon: Icon, label }) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 pl-2.5 pr-3 py-2 rounded-md font-sans transition-colors duration-400 border-l-[3px]',
                          isActive
                            ? 'bg-[color:var(--nav-active-bg)] text-[color:var(--nav-active-fg)] border-bronze'
                            : 'border-transparent text-ink-soft hover:bg-canvas-deep hover:text-ink'
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={15}
                            strokeWidth={isActive ? 1.8 : 1.5}
                            className={cn('shrink-0', isActive ? 'text-bronze' : 'text-whisper')}
                            aria-hidden
                          />
                          <span className="font-sans text-[13px] font-normal leading-none">
                            {label}
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

        <div className="mt-auto shrink-0 border-t border-muted px-3 pt-4 pb-2 flex justify-center">
          <ThemeToggle variant="compact" />
        </div>

        <div className="border-t border-muted shrink-0">
          <div className="px-4 py-4 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-fill flex items-center justify-center shrink-0">
              <span className="serif text-on-fill text-[11px] font-normal">{avatarInitials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="serif text-[13px] font-normal text-ink leading-tight truncate">{ownerName}</p>
              <p className="font-sans text-[11px] text-whisper leading-tight mt-0.5">{ownerRole}</p>
            </div>
            <kbd
              className="font-sans text-[9px] text-whisper/40 border border-muted px-1.5 py-0.5 cursor-default"
              title="Press ? for keyboard shortcuts"
            >
              ?
            </kbd>
          </div>
        </div>
      </aside>

      <div
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-canvas-deep border-t border-muted"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <nav className="flex items-stretch">
          {mobileItems.map(({ to, icon: Icon, label, shortLabel }) => {
            const isActive =
              location.pathname === to ||
              (to !== '/studio/overview' && location.pathname.startsWith(to + '/'))
            return (
              <NavLink
                key={to}
                to={to}
                className="relative flex min-w-0 flex-1 flex-col items-center justify-center gap-1 py-2.5"
                style={{ touchAction: 'manipulation' }}
              >
                <Icon
                  aria-hidden
                  size={20}
                  strokeWidth={isActive ? 1.8 : 1.4}
                  className={cn(
                    'block shrink-0 transition-colors duration-400',
                    isActive ? 'text-bronze' : 'text-whisper'
                  )}
                />
                <span
                  className={cn(
                    'font-sans text-[9px] uppercase leading-none transition-colors duration-400',
                    isActive ? 'text-ink' : 'text-whisper/70'
                  )}
                  style={{ letterSpacing: '0.12em' }}
                >
                  {shortLabel ?? label}
                </span>

                {isActive && (
                  <span className="absolute bottom-1.5 h-1 w-1 rounded-full bg-bronze" />
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </>
  )
}
