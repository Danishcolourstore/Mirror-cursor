import { motion, AnimatePresence } from 'framer-motion'
import { X, Link, Mail } from 'lucide-react'
import { useToastStore } from '../../stores/toastStore'

type Props = {
  open: boolean
  onClose: () => void
  photoUrl?: string
}

export default function ShareSheet({ open, onClose, photoUrl }: Props) {
  const { push } = useToastStore()

  const pageUrl = window.location.href

  const handleCopy = () => {
    navigator.clipboard.writeText(pageUrl).catch(() => {})
    push('Link copied')
    onClose()
  }

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(pageUrl)}`, '_blank', 'noopener')
    onClose()
  }

  const handleEmail = () => {
    window.open(
      `mailto:?subject=Our%20Wedding%20Gallery&body=${encodeURIComponent(pageUrl)}`,
      '_blank',
      'noopener'
    )
    onClose()
  }

  // Suppress unused warning — photoUrl reserved for future photo-specific sharing
  void photoUrl

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[55] bg-night/40"
            style={{ backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed bottom-0 inset-x-0 z-[56] bg-canvas border-t border-muted"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.2, 0.6, 0.2, 1] }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-8 h-[3px] bg-muted rounded-full" />
            </div>

            <div className="px-6 pt-2 pb-8">
              <div className="flex items-center justify-between mb-5">
                <p className="serif italic text-ink-soft text-sm">Share gallery</p>
                <button
                  onClick={onClose}
                  className="p-1.5 text-whisper hover:text-ink transition-colors"
                  aria-label="Close"
                >
                  <X size={16} strokeWidth={1.4} />
                </button>
              </div>

              <div className="flex flex-col gap-1">
                <ShareRow
                  label="WhatsApp"
                  icon={<WhatsAppIcon />}
                  onClick={handleWhatsApp}
                />
                <ShareRow
                  label="Copy Link"
                  icon={<Link size={18} strokeWidth={1.4} />}
                  onClick={handleCopy}
                />
                <ShareRow
                  label="Email"
                  icon={<Mail size={18} strokeWidth={1.4} />}
                  onClick={handleEmail}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ShareRow({
  label,
  icon,
  onClick,
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 w-full px-2 py-3 text-ink hover:bg-canvas-deep transition-colors duration-200"
    >
      <span className="text-ink-soft w-5 flex items-center justify-center">{icon}</span>
      <span className="font-sans text-[14px]">{label}</span>
    </button>
  )
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}
