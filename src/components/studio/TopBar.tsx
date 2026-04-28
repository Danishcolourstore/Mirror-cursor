import { Search, Plus } from 'lucide-react'
import { useStudioStore } from '../../stores/studioStore'

type TopBarProps = {
  title?: string
}

/** Studio page chrome — overlays are mounted globally in {@link ../StudioPathRouter} */
export default function TopBar({ title }: TopBarProps) {
  const openCommandPalette = useStudioStore((s) => s.openCommandPalette)
  const openNewEvent = useStudioStore((s) => s.openNewEvent)

  return (
    <div className="flex items-center justify-between px-8 py-4 border-b border-muted bg-canvas sticky top-0 z-10 shadow-none">
      {title && (
        <h2 className="serif text-base font-normal text-ink">{title}</h2>
      )}
      <div className="flex items-center gap-3 ml-auto">
        <button
          onClick={() => openCommandPalette()}
          className="btn-ghost flex items-center gap-2"
          type="button"
        >
          <Search size={12} strokeWidth={1.5} />
          <span>Search</span>
          <kbd
            className="hidden lg:inline-block font-sans text-[9px] text-whisper border border-muted px-1 py-0.5 ml-1"
            style={{ letterSpacing: '0.06em' }}
          >
            ⌘K
          </kbd>
        </button>
        <button
          type="button"
          onClick={() => openNewEvent()}
          className="btn-ink flex items-center gap-2"
        >
          <Plus size={12} strokeWidth={2} />
          <span>New Event</span>
        </button>
      </div>
    </div>
  )
}
