import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useStudioStore } from '../../stores/studioStore'

const rows = [
  { shortcut: 'Command palette', keys: '⌘ / Ctrl · K' },
  { shortcut: 'Navigate palette results', keys: '↑ · ↓ · J · K' },
  { shortcut: 'Open selected result', keys: 'Return' },
  { shortcut: 'Close palette / overlays', keys: 'Esc' },
  { shortcut: 'Shortcuts reference', keys: 'Shift · /' },
  { shortcut: 'New event', keys: 'N' },
  { shortcut: 'Go to Overview', keys: 'G · O' },
  { shortcut: 'Go to Events', keys: 'G · E' },
  { shortcut: 'Go to Galleries', keys: 'G · G' },
  { shortcut: 'Go to Clients', keys: 'G · C' },
  { shortcut: 'Go to Insights', keys: 'G · I' },
  { shortcut: 'Lightbox — prev / next', keys: '← · →' },
  { shortcut: 'Favourite photo (gallery)', keys: 'F' },
]

export default function ShortcutsOverlay() {
  const open = useStudioStore((s) => s.shortcutsHelpOpen)
  const close = useStudioStore((s) => s.closeShortcutsHelp)

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[62] bg-night/38"
            style={{ backdropFilter: 'blur(3px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => close()}
          />

          <motion.div
            className="fixed inset-x-4 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 top-[8vh] z-[63] max-w-[640px]"
            initial={{ opacity: 0, y: -10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.34, ease: [0.2, 0.6, 0.2, 1] }}
          >
            <div className="border border-muted bg-canvas overflow-hidden max-h-[calc(92vh-env(safe-area-inset-bottom,0px))] flex flex-col">
              <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-muted shrink-0">
                <h2
                  className="serif font-light text-ink tracking-tight"
                  style={{ fontSize: '19px', letterSpacing: '-0.02em' }}
                >
                  Keyboard <em className="text-bronze italic font-light">shortcuts</em>
                </h2>
                <button
                  type="button"
                  onClick={() => close()}
                  className="shrink-0 p-1.5 text-whisper hover:text-ink transition-colors duration-400"
                  aria-label="Close"
                >
                  <X size={14} strokeWidth={1.5} />
                </button>
              </div>

              <div className="overflow-y-auto scrollbar-hide px-6 py-5">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="border-b border-muted">
                      <th
                        className="serif font-normal text-ink py-2 pb-4 pr-6 align-bottom"
                        style={{ fontSize: '12px', letterSpacing: '0.12em' }}
                      >
                        <span className="uppercase tracking-[0.2em]">Shortcut</span>
                      </th>
                      <th
                        className="serif font-normal text-ink py-2 pb-4 align-bottom whitespace-nowrap"
                        style={{ fontSize: '12px', letterSpacing: '0.12em' }}
                      >
                        <span className="uppercase tracking-[0.2em]">Keys</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.shortcut} className={i < rows.length - 1 ? 'border-b border-muted/80' : ''}>
                        <td className="align-top py-3 pr-6">
                          <p className="serif italic text-[14px] text-ink-soft leading-snug">{r.shortcut}</p>
                        </td>
                        <td className="align-top py-3">
                          <p className="font-sans text-[12px] text-whisper" style={{ letterSpacing: '0.06em' }}>
                            {r.keys}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-3 px-6 py-3 border-t border-muted shrink-0">
                <kbd className="font-sans text-[10px] text-whisper border border-muted px-1.5 py-0.5">Shift · /</kbd>
                <span className="font-sans text-[11px] text-whisper">
                  Opens this sheet from anywhere on the dashboard
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
