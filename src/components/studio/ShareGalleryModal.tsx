import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, ExternalLink, MessageCircle, Mail, Lock, Unlock } from 'lucide-react'
import { cn } from '../../lib/cn'
import { useToastStore } from '../../stores/toastStore'
import type { Event } from '../../types/event'

type ShareGalleryModalProps = {
  event: Event | null
  onClose: () => void
}

export default function ShareGalleryModal({ event, onClose }: ShareGalleryModalProps) {
  const pushToast = useToastStore((s) => s.push)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<'link' | 'email'>('link')
  const [emailDraft, setEmailDraft] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const linkRef = useRef<HTMLInputElement>(null)

  const open = event !== null
  const galleryUrl = event ? `${window.location.origin}/g/${event.slug}` : ''
  const coupleNames = event ? `${event.couple.brideName} & ${event.couple.groomName}` : ''
  const totalPhotos = event ? event.chapters.reduce((a, c) => a + c.photos.length, 0) : 0
  const liveChapters = event ? event.chapters.filter((c) => c.status === 'live').length : 0

  useEffect(() => {
    if (open) {
      setCopied(false)
      setEmailSent(false)
      setTab('link')
      setEmailDraft(
        event
          ? `Hi ${event.client.name.split(' ')[0]},\n\nYour wedding gallery is ready. Open it here:\n\n${galleryUrl}\n\nThis gallery contains ${totalPhotos} photographs across ${liveChapters} chapters. More memories are being edited and will unlock over the coming days.\n\nWith love,\nMirror Studio`
          : ''
      )
    }
  }, [open, event])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(galleryUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
      linkRef.current?.select()
      pushToast('Gallery link copied', { detail: galleryUrl, tone: 'success' })
    } catch {
      pushToast('Could not copy link', { tone: 'error' })
    }
  }

  const shareWhatsApp = () => {
    const msg = encodeURIComponent(
      `Your wedding gallery is ready ✨\n\n${coupleNames} — view your photographs here:\n${galleryUrl}`
    )
    window.open(`https://wa.me/?text=${msg}`, '_blank')
    pushToast('Opening WhatsApp', { tone: 'default' })
  }

  const sendEmail = () => {
    setEmailSent(true)
  }

  if (!event) return null

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-night/40"
            style={{ backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-x-4 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 top-[10vh] z-50 sm:w-[520px]"
            initial={{ opacity: 0, y: -14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.2, 0.6, 0.2, 1] }}
          >
            <div
              className="border border-muted overflow-hidden"
              style={{ background: '#F6F1E8', boxShadow: '0 24px 80px rgba(20,17,13,0.16)' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-muted">
                <div>
                  <h2
                    className="serif font-light text-ink"
                    style={{ fontSize: '18px', letterSpacing: '-0.02em' }}
                  >
                    Share <em className="text-bronze italic">gallery</em>
                  </h2>
                  <p className="font-sans text-[12px] text-whisper mt-0.5">{coupleNames}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 text-whisper hover:text-ink transition-colors duration-400"
                >
                  <X size={15} strokeWidth={1.5} />
                </button>
              </div>

              {/* Gallery preview card */}
              <div className="mx-6 mt-5 border border-muted overflow-hidden flex items-stretch">
                <div className="w-24 shrink-0 overflow-hidden">
                  <img
                    src={event.coverImage}
                    alt={coupleNames}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 px-4 py-3 flex flex-col justify-between min-w-0">
                  <div>
                    <p className="serif font-light text-ink text-sm leading-tight">{coupleNames}</p>
                    <p className="font-sans text-[11px] text-whisper mt-0.5">
                      {event.venue.location}, {event.venue.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="font-sans text-[10px] text-whisper uppercase" style={{ letterSpacing: '0.14em' }}>
                      {totalPhotos} photos
                    </p>
                    <span className="text-muted">·</span>
                    <p className="font-sans text-[10px] text-whisper uppercase" style={{ letterSpacing: '0.14em' }}>
                      {liveChapters} chapters live
                    </p>
                    <span className="ml-auto flex items-center gap-1 text-whisper">
                      <Unlock size={10} strokeWidth={1.5} />
                      <span className="font-sans text-[10px]">Public</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-0 px-6 mt-5 border-b border-muted">
                {(['link', 'email'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      'font-sans text-[11px] uppercase px-0 py-2.5 mr-6 border-b-2 transition-colors duration-400',
                      tab === t ? 'border-ink text-ink' : 'border-transparent text-whisper hover:text-ink-soft'
                    )}
                    style={{ letterSpacing: '0.18em' }}
                  >
                    {t === 'link' ? 'Share Link' : 'Email Client'}
                  </button>
                ))}
              </div>

              <div className="px-6 py-5">
                {/* Link tab */}
                {tab === 'link' && (
                  <div className="space-y-4">
                    {/* URL copy row */}
                    <div className="flex items-center gap-0 border border-muted overflow-hidden">
                      <input
                        ref={linkRef}
                        value={galleryUrl}
                        readOnly
                        className="flex-1 bg-canvas-deep px-3 py-2.5 font-sans text-[12px] text-ink-soft outline-none select-all min-w-0"
                        onFocus={(e) => e.target.select()}
                      />
                      <button
                        onClick={copyLink}
                        className={cn(
                          'px-4 py-2.5 font-sans text-[11px] uppercase flex items-center gap-2 transition-all duration-400 shrink-0',
                          copied
                            ? 'bg-sage/10 text-sage'
                            : 'bg-ink text-canvas hover:bg-ink-soft'
                        )}
                        style={{ letterSpacing: '0.16em' }}
                      >
                        {copied ? (
                          <><Check size={11} strokeWidth={2} /> Copied</>
                        ) : (
                          <><Copy size={11} strokeWidth={1.5} /> Copy</>
                        )}
                      </button>
                    </div>

                    {/* Quick share options */}
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={shareWhatsApp}
                        className="flex items-center justify-center gap-2.5 border border-muted py-3 font-sans text-[11px] uppercase text-ink-soft hover:bg-canvas-deep hover:border-bronze/30 transition-all duration-400"
                        style={{ letterSpacing: '0.16em' }}
                      >
                        <MessageCircle size={13} strokeWidth={1.5} className="text-sage" />
                        WhatsApp
                      </button>
                      <a
                        href={galleryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center gap-2.5 border border-muted py-3 font-sans text-[11px] uppercase text-ink-soft hover:bg-canvas-deep hover:border-bronze/30 transition-all duration-400 no-underline"
                        style={{ letterSpacing: '0.16em' }}
                      >
                        <ExternalLink size={13} strokeWidth={1.5} className="text-whisper" />
                        Preview
                      </a>
                    </div>

                    {/* Password toggle hint */}
                    <div className="flex items-center gap-2 pt-1">
                      <Lock size={11} strokeWidth={1.5} className="text-whisper" />
                      <p className="font-sans text-[11px] text-whisper">
                        Password protection available in{' '}
                        <span className="text-bronze underline underline-offset-2 cursor-pointer">
                          Gallery Settings
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Email tab */}
                {tab === 'email' && (
                  <div className="space-y-4">
                    {emailSent ? (
                      <motion.div
                        className="py-10 flex flex-col items-center gap-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <div className="w-10 h-10 bg-sage/10 flex items-center justify-center">
                          <Check size={18} strokeWidth={1.5} className="text-sage" />
                        </div>
                        <p className="serif font-light text-ink">Message prepared.</p>
                        <p className="font-sans text-[12px] text-whisper text-center max-w-xs">
                          Email client opened. Send it from your mail app.
                        </p>
                      </motion.div>
                    ) : (
                      <>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.16em' }}>
                            To
                          </label>
                          <input
                            defaultValue={event.client.email}
                            className="w-full bg-canvas border border-muted px-3 py-2.5 font-sans text-sm text-ink outline-none focus:border-bronze-soft transition-colors duration-400"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.16em' }}>
                            Message
                          </label>
                          <textarea
                            value={emailDraft}
                            onChange={(e) => setEmailDraft(e.target.value)}
                            rows={7}
                            className="w-full bg-canvas border border-muted px-3 py-2.5 font-sans text-sm text-ink-soft outline-none focus:border-bronze-soft transition-colors duration-400 resize-none leading-relaxed"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const to = event.client.email
                            const subject = encodeURIComponent(`Your gallery is ready — ${coupleNames}`)
                            const body = encodeURIComponent(emailDraft)
                            window.open(`mailto:${to}?subject=${subject}&body=${body}`, '_blank')
                            sendEmail()
                          }}
                          className="btn-ink w-full flex items-center justify-center gap-2"
                        >
                          <Mail size={12} strokeWidth={1.5} />
                          Open in Mail
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
