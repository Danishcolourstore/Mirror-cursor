import { useState } from 'react'
import { Heart, X } from 'lucide-react'
import { useGalleryStore } from '../../stores/galleryStore'
import { useToastStore } from '../../stores/toastStore'

type Props = {
  slug: string
  galleryPhotoIds: string[]
  showFavoritesOnly: boolean
  onToggleView: () => void
}

export default function FavoritesBar({ slug, galleryPhotoIds, showFavoritesOnly, onToggleView }: Props) {
  const { favoritedIds, clearFavoriteIds, submitFavoritesToStudio, favoritesSentForSlug } = useGalleryStore()
  const { push } = useToastStore()
  const [sendOpen, setSendOpen] = useState(false)
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [message, setMessage] = useState('')

  const galleryPhotoSet = new Set(galleryPhotoIds)
  const galleryFavoritedIds = favoritedIds.filter((id) => galleryPhotoSet.has(id))
  const count = galleryFavoritedIds.length
  const sent = favoritesSentForSlug(slug)

  const handleClear = () => {
    if (count === 0) return
    if (!window.confirm(`Clear all ${count} favorites?`)) return
    clearFavoriteIds(galleryFavoritedIds)
  }

  const handleSend = () => {
    if (!name.trim()) {
      push('Please add your name', { tone: 'error' })
      return
    }
    if (!/^\d{10}$/.test(whatsapp)) {
      push('Enter a valid WhatsApp number', { detail: 'Use 10 digits after +91.', tone: 'error' })
      return
    }
    submitFavoritesToStudio({
      slug,
      brideName: name.trim(),
      whatsappE164: `+91${whatsapp}`,
      note: message.trim() || undefined,
      photoIds: galleryFavoritedIds,
    })
    setSendOpen(false)
    setWhatsapp('')
    setMessage('')
  }

  if (count === 0) return null

  return (
    <>
      <div className="sticky bottom-4 z-40 mt-8 flex justify-center px-3">
        <div
          className="flex items-center gap-2 border border-ink bg-bronze px-3 py-2 text-canvas"
          style={{
            borderRadius: '12px',
            transform: 'translateY(0)',
            animation: count === 1 ? 'favoritesBarIn 600ms cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
          }}
        >
          <div className="flex items-center gap-1.5 pr-1">
            <Heart size={14} strokeWidth={0} className="fill-canvas text-canvas" />
            <span className="font-sans text-[12px]">{count}</span>
          </div>

          <button
            type="button"
            onClick={onToggleView}
            className="border border-canvas/40 px-2.5 py-1 font-sans text-[11px] uppercase transition-colors hover:border-canvas"
            style={{ letterSpacing: '0.08em' }}
          >
            {showFavoritesOnly ? 'All' : 'View'}
          </button>

          <button
            type="button"
            onClick={() => setSendOpen(true)}
            className="border border-canvas/40 px-2.5 py-1 font-sans text-[11px] uppercase transition-colors hover:border-canvas"
            style={{ letterSpacing: '0.08em' }}
          >
            Send to studio
          </button>

          {sent && <span className="font-sans text-[11px] uppercase" style={{ letterSpacing: '0.08em' }}>Sent.</span>}

          <button
            type="button"
            onClick={handleClear}
            className="p-1 text-canvas/80 transition-colors hover:text-canvas"
            aria-label="Clear favorites"
          >
            <X size={14} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {sendOpen && (
        <>
          <div className="fixed inset-0 z-50 bg-night/45" onClick={() => setSendOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[92vw] max-w-md -translate-x-1/2 -translate-y-1/2 border border-muted bg-canvas p-5">
            <p className="mb-4 text-sm italic text-ink-soft serif">Send favorites to studio</p>
            <div className="space-y-3">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bride's name"
                className="w-full border border-muted bg-canvas px-3 py-2 font-sans text-[13px] outline-none focus:border-ink"
              />
              <div className="flex items-center border border-muted bg-canvas">
                <span className="px-3 font-sans text-[13px] text-whisper">+91</span>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="WhatsApp number"
                  inputMode="numeric"
                  className="w-full px-3 py-2 font-sans text-[13px] outline-none"
                />
              </div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message (optional)"
                rows={3}
                className="w-full resize-none border border-muted bg-canvas px-3 py-2 font-sans text-[13px] outline-none focus:border-ink"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSendOpen(false)}
                  className="border border-muted px-3 py-2 font-sans text-[11px] uppercase text-whisper transition-colors hover:border-ink-soft hover:text-ink"
                  style={{ letterSpacing: '0.08em' }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSend}
                  className="border border-ink bg-canvas-deep px-3 py-2 font-sans text-[11px] uppercase text-ink"
                  style={{ letterSpacing: '0.08em' }}
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}
