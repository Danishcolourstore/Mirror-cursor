import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Image as ImageIcon, BookOpen, FileText, Clock, BarChart3, Check, Share2, Star, Copy } from 'lucide-react'
import { useEventsStore } from '../../stores/eventsStore'
import { useToastStore } from '../../stores/toastStore'
import { cn } from '../../lib/cn'
import { formatDateShort, formatCurrency, toRoman } from '../../lib/format'
import ShareGalleryModal from '../../components/studio/ShareGalleryModal'
import { BreathingDots } from '../../components/ui/LoadingStates'
import LightboxViewer from '../../components/gallery/LightboxViewer'
import type { Event, Chapter } from '../../types/event'
import type { Photo as PhotoType } from '../../types/photo'

type Tab = 'overview' | 'photos' | 'chapters' | 'note' | 'schedule' | 'analytics'

const tabs: { id: Tab; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }[] = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'chapters', label: 'Chapters', icon: BookOpen },
  { id: 'note', label: "Director's Note", icon: FileText },
  { id: 'schedule', label: 'Delivery Schedule', icon: Clock },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
]

const chapterStatusPill: Record<Chapter['status'], string> = {
  draft: 'pill-draft',
  scheduled: 'pill-booked',
  live: 'pill-live',
  locked: 'pill-locked',
}

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getEventById, updateEvent, updatePhotoInChapter } = useEventsStore()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [shareOpen, setShareOpen] = useState(false)

  const event = getEventById(id ?? '')

  if (!event) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-canvas">
        <div className="text-center">
          <p className="serif italic text-whisper text-lg">Event not found.</p>
          <button onClick={() => navigate('/studio/events')} className="btn-ghost mt-6">
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const paid = event.package.paid >= event.package.price
  const liveChapters = event.chapters.filter((c) => c.status === 'live').length
  const totalPhotos = event.chapters.reduce((acc, c) => acc + c.photos.length, 0)

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-canvas pb-24 lg:pb-0">

      {/* Hero cover strip */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.coverImage}
          alt={event.couple.brideName + " & " + event.couple.groomName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-night/80 via-night/30 to-night/20" />

        {/* Back button */}
        <button
          onClick={() => navigate('/studio/events')}
          className="absolute top-4 left-6 flex items-center gap-2 font-sans text-[11px] uppercase text-inverse-fg/75 hover:text-inverse-fg transition-colors duration-400"
          style={{ letterSpacing: '0.18em' }}
        >
          <ArrowLeft size={13} strokeWidth={1.5} />
          <span>All Events</span>
        </button>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="serif font-light text-inverse-fg leading-none"
                style={{ fontSize: 'clamp(24px, 4vw, 36px)', letterSpacing: '-0.02em' }}>
                {event.couple.brideName}
                <em className="text-bronze-soft italic font-light"> & </em>
                {event.couple.groomName}
              </h1>
              <p className="font-sans text-[11px] text-inverse-fg/65 mt-1.5 uppercase"
                style={{ letterSpacing: '0.22em' }}>
                {event.venue.location} · {event.venue.city} · {formatDateShort(event.date.start)}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className={cn(
                'pill',
                event.status === 'delivered' ? 'pill-delivered' :
                event.status === 'editing' ? 'pill-editing' :
                event.status === 'shooting' ? 'pill-shooting' : 'pill-booked'
              )}>
                {event.status}
              </span>
              <button
                onClick={() => setShareOpen(true)}
                className="flex items-center gap-1.5 font-sans text-[11px] uppercase text-inverse-fg/75 hover:text-inverse-fg transition-colors duration-400 border border-white/35 hover:border-white/55 px-3 py-1.5"
                style={{ letterSpacing: '0.18em' }}
              >
                <Share2 size={11} strokeWidth={1.5} />
                <span>Share</span>
              </button>
              <Link
                to={`/g/${event.slug}`}
                target="_blank"
                className="flex items-center gap-1.5 font-sans text-[11px] uppercase text-inverse-fg/75 hover:text-inverse-fg transition-colors duration-400 border border-white/35 hover:border-white/55 px-3 py-1.5"
                style={{ letterSpacing: '0.18em' }}
              >
                <ExternalLink size={11} strokeWidth={1.5} />
                <span>Gallery</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tab nav */}
      <div className="border-b border-muted bg-canvas sticky top-0 z-10">
        <div className="px-8 flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 font-sans text-[11px] uppercase px-4 py-3.5 border-b-2 shrink-0 transition-colors duration-400',
                activeTab === tab.id
                  ? 'border-ink text-ink'
                  : 'border-transparent text-whisper hover:text-ink-soft'
              )}
              style={{ letterSpacing: '0.18em' }}
            >
              <tab.icon size={12} strokeWidth={1.5} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <ShareGalleryModal event={shareOpen ? event : null} onClose={() => setShareOpen(false)} />

      {/* Tab content */}
      <div className="flex-1">
        {activeTab === 'overview' && (
          <OverviewTab event={event} liveChapters={liveChapters} totalPhotos={totalPhotos} paid={paid} updateEvent={updateEvent} />
        )}
        {activeTab === 'photos' && <PhotosTab event={event} updateEvent={updateEvent} updatePhotoInChapter={updatePhotoInChapter} />}
        {activeTab === 'chapters' && <ChaptersTab event={event} />}
        {activeTab === 'note' && <NoteTab event={event} />}
        {activeTab === 'schedule' && <ScheduleTab event={event} />}
        {activeTab === 'analytics' && <AnalyticsTab event={event} />}
      </div>
    </div>
  )
}

// ─── Tab: Overview ────────────────────────────────────────────────────────────
function OverviewTab({ event, liveChapters, totalPhotos, paid, updateEvent }: {
  event: Event
  liveChapters: number
  totalPhotos: number
  paid: boolean
  updateEvent: (id: string, patch: Partial<Event>) => void
}) {
  if (!event) return null
  return (
    <div className="px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: stats + progress */}
        <div className="lg:col-span-2 space-y-6">

          {/* Progress */}
          <div className="border border-muted bg-canvas-deep p-6">
            <h3 className="font-sans text-[11px] uppercase text-whisper mb-4"
              style={{ letterSpacing: '0.18em' }}>
              Workflow Progress
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex-1 h-1 bg-muted relative overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-bronze transition-all duration-700"
                  style={{ width: `${event.progress}%` }}
                />
              </div>
              <span className="serif font-light text-ink text-2xl" style={{ letterSpacing: '-0.02em' }}>
                {event.progress}%
              </span>
            </div>
          </div>

          <div className="border border-muted bg-canvas-deep p-6">
            <h3 className="font-sans text-[11px] uppercase text-whisper mb-4" style={{ letterSpacing: '0.18em' }}>
              Cover customization
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-sans text-[11px] uppercase text-whisper mb-2" style={{ letterSpacing: '0.08em' }}>
                  Cover photo
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {event.chapters.flatMap((ch) => ch.photos).slice(0, 8).map((photo) => (
                    <button
                      key={photo.id}
                      type="button"
                      onClick={() => updateEvent(event.id, { galleryCoverPhotoId: photo.id })}
                      className={cn(
                        'aspect-[4/3] overflow-hidden border',
                        event.galleryCoverPhotoId === photo.id ? 'border-ink' : 'border-muted'
                      )}
                    >
                      <img src={photo.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="font-sans text-[11px] uppercase text-whisper mb-2" style={{ letterSpacing: '0.08em' }}>
                  Overlay tint ({event.galleryCoverTintPct ?? 24}%)
                </p>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={event.galleryCoverTintPct ?? 24}
                  onChange={(e) => updateEvent(event.id, { galleryCoverTintPct: Number(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                {(['small', 'medium', 'fullscreen'] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateEvent(event.id, { galleryCoverSize: size })}
                    className={cn(
                      'border px-3 py-1.5 font-sans text-[11px] uppercase',
                      (event.galleryCoverSize ?? 'fullscreen') === size ? 'border-ink text-ink' : 'border-muted text-whisper'
                    )}
                    style={{ letterSpacing: '0.08em' }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Stat row */}
          <div className="grid grid-cols-3 border border-muted divide-x divide-muted bg-canvas-deep">
            {[
              { label: 'Chapters', value: String(event.chapters.length) },
              { label: 'Live', value: String(liveChapters) },
              { label: 'Photos', value: String(totalPhotos) },
            ].map((s) => (
              <div key={s.label} className="px-5 py-5">
                <p className="font-sans text-[10px] uppercase text-whisper mb-2"
                  style={{ letterSpacing: '0.18em' }}>
                  {s.label}
                </p>
                <p className="serif font-light text-ink text-3xl leading-none"
                  style={{ letterSpacing: '-0.02em' }}>
                  {s.value}
                </p>
              </div>
            ))}
          </div>

          {/* Chapters summary */}
          {event.chapters.length > 0 && (
            <div className="border border-muted">
              <div className="px-5 py-3 border-b border-muted bg-canvas-deeper">
                <p className="font-sans text-[10px] uppercase text-whisper"
                  style={{ letterSpacing: '0.18em' }}>
                  Chapters
                </p>
              </div>
              {event.chapters.map((ch, i) => (
                <div
                  key={ch.id}
                  className={cn(
                    'flex items-center gap-4 px-5 py-3.5',
                    i < event.chapters.length - 1 && 'border-b border-muted'
                  )}
                >
                  <span className="serif italic text-bronze text-sm w-6 shrink-0">
                    {toRoman(ch.number)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="serif font-normal text-[13px] text-ink leading-tight">
                      {ch.title}
                    </p>
                    <p className="serif italic text-[11px] text-whisper mt-0.5 truncate">
                      {ch.caption}
                    </p>
                  </div>
                  <span className={chapterStatusPill[ch.status]}>{ch.status}</span>
                  <p className="font-sans text-[11px] text-whisper/60 shrink-0">
                    {ch.photos.length} photos
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: client + package */}
        <div className="space-y-4">
          <div className="border border-muted bg-canvas-deep p-5">
            <h3 className="font-sans text-[10px] uppercase text-whisper mb-4"
              style={{ letterSpacing: '0.18em' }}>
              Client
            </h3>
            <p className="serif font-normal text-[15px] text-ink">{event.client.name}</p>
            <p className="font-sans text-[12px] text-whisper mt-1">{event.client.phone}</p>
            <p className="font-sans text-[12px] text-whisper mt-0.5">{event.client.email}</p>
          </div>

          <div className="border border-muted bg-canvas-deep p-5">
            <h3 className="font-sans text-[10px] uppercase text-whisper mb-4"
              style={{ letterSpacing: '0.18em' }}>
              Package
            </h3>
            <p className="serif font-normal text-[14px] text-ink">{event.package.name}</p>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-sans text-[11px] text-whisper">Total</p>
              <p className="serif font-light text-ink text-lg"
                style={{ letterSpacing: '-0.02em' }}>
                {formatCurrency(event.package.price)}
              </p>
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              <p className="font-sans text-[11px] text-whisper">Paid</p>
              <p className={cn(
                'font-sans text-[12px]',
                paid ? 'text-sage' : 'text-rose'
              )}>
                {formatCurrency(event.package.paid)}
              </p>
            </div>
            {!paid && (
              <div className="mt-3 pt-3 border-t border-muted">
                <p className="font-sans text-[11px] text-rose">
                  Balance: {formatCurrency(event.package.price - event.package.paid)}
                </p>
              </div>
            )}
          </div>

          <div className="border border-muted bg-canvas-deep p-5">
            <h3 className="font-sans text-[10px] uppercase text-whisper mb-4"
              style={{ letterSpacing: '0.18em' }}>
              Venue
            </h3>
            <p className="serif font-normal text-[14px] text-ink">{event.venue.location}</p>
            <p className="font-sans text-[12px] text-whisper mt-1">{event.venue.city}</p>
            <p className="serif italic text-[12px] text-whisper mt-2">
              {formatDateShort(event.date.start)}
              {event.date.start !== event.date.end && ` – ${formatDateShort(event.date.end)}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Tab: Photos ──────────────────────────────────────────────────────────────
function PhotosTab({
  event,
  updateEvent,
  updatePhotoInChapter,
}: {
  event: Event
  updateEvent: (id: string, patch: Partial<Event>) => void
  updatePhotoInChapter: (eventId: string, chapterId: string, photoId: string, patch: Partial<PhotoType>) => void
}) {
  const updateChapter = useEventsStore((s) => s.updateChapter)
  const pushToast = useToastStore((s) => s.push)
  const [activeChapter, setActiveChapter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [moveMenuOpen, setMoveMenuOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoType | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sizeScale = event.photoGridCellScale ?? 'medium'
  const spacingMode = event.photoGridSpacing ?? 'normal'

  const toFilename = (url: string) => {
    const segment = url.split('/').pop() ?? 'photo.jpg'
    const clean = segment.split('?')[0]
    return clean.includes('.') ? clean : `${clean}.jpg`
  }

  const chaptersWithPhotos = event.chapters.filter((c) => c.photos.length > 0)
  const displayed =
    activeChapter === 'all'
      ? event.chapters.flatMap((c) => c.photos.map((p) => ({ ...p, chapterId: c.id, chapterTitle: c.title })))
      : event.chapters
          .filter((c) => c.id === activeChapter)
          .flatMap((c) => c.photos.map((p) => ({ ...p, chapterId: c.id, chapterTitle: c.title })))

  const totalCount = event.chapters.reduce((a, c) => a + c.photos.length, 0)
  const favoritedFilenames = event.chapters
    .flatMap((chapter) => chapter.photos)
    .filter((photo) => photo.favorited)
    .map((photo) => toFilename(photo.url))

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
    setMoveMenuOpen(false)
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (event.chapters.length === 0) {
      pushToast('Add a chapter first', { detail: 'Photos need a chapter to live in.', tone: 'error' })
      return
    }
    setIsUploading(true)
    try {
      const { filesToPhotos } = await import('../../lib/imageUpload')
      const { photos, skipped } = await filesToPhotos(files)
      if (photos.length > 0) {
        const targetChapter =
          (activeChapter !== 'all' && event.chapters.find((c) => c.id === activeChapter)) ||
          event.chapters[0]
        updateChapter(event.id, targetChapter.id, {
          photos: [...targetChapter.photos, ...photos],
        })
        pushToast(`${photos.length} photo${photos.length === 1 ? '' : 's'} uploaded`, {
          detail: `Added to ${targetChapter.title}`,
          tone: 'success',
        })
      }
      if (skipped.length > 0) {
        pushToast(`${skipped.length} file${skipped.length === 1 ? '' : 's'} skipped`, {
          detail: skipped[0].reason,
          tone: 'error',
        })
      }
    } catch {
      pushToast('Upload failed', { tone: 'error' })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const moveSelectedTo = (chapterId: string) => {
    if (selectedIds.size === 0) return
    const targetChapter = event.chapters.find((c) => c.id === chapterId)
    if (!targetChapter) return

    const idsToMove = new Set(selectedIds)
    const photosToMove: typeof targetChapter.photos = []

    event.chapters.forEach((c) => {
      if (c.id === chapterId) return
      const remaining: typeof c.photos = []
      c.photos.forEach((p) => {
        if (idsToMove.has(p.id)) photosToMove.push(p)
        else remaining.push(p)
      })
      if (remaining.length !== c.photos.length) {
        updateChapter(event.id, c.id, { photos: remaining })
      }
    })

    if (photosToMove.length > 0) {
      updateChapter(event.id, chapterId, {
        photos: [...targetChapter.photos, ...photosToMove],
      })
      pushToast(
        `${photosToMove.length} photo${photosToMove.length === 1 ? '' : 's'} moved`,
        { detail: `Now in ${targetChapter.title}`, tone: 'success' }
      )
    }
    clearSelection()
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="px-8 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <h2 className="section-title">
          All <em>Photos</em>
        </h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={async () => {
              if (favoritedFilenames.length === 0) {
                pushToast('No favorited filenames yet', { tone: 'error' })
                return
              }
              await navigator.clipboard.writeText(favoritedFilenames.join(', '))
              pushToast('Filenames copied for Lightroom', { tone: 'success' })
            }}
            className="border border-muted px-2.5 py-1.5 font-sans text-[11px] uppercase text-ink-soft hover:text-ink hover:border-ink-soft transition-colors"
            style={{ letterSpacing: '0.08em' }}
          >
            <span className="inline-flex items-center gap-1.5">
              <Copy size={11} strokeWidth={1.5} />
              Copy Filenames
            </span>
          </button>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-2 relative">
              <span className="font-sans text-[11px] text-whisper">{selectedIds.size} selected</span>
              <button className="btn-ghost text-[10px] py-1.5 px-3" onClick={clearSelection}>Clear</button>
              <button
                className="btn-ink text-[10px] py-1.5 px-3"
                onClick={() => setMoveMenuOpen((v) => !v)}
              >
                Move to chapter
              </button>
              {moveMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setMoveMenuOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 z-20 min-w-[200px] bg-canvas border border-muted shadow-[0_12px_36px_rgba(28,24,20,0.18)]">
                    {event.chapters.length === 0 ? (
                      <p className="px-4 py-3 font-sans text-[12px] text-whisper italic">No chapters yet</p>
                    ) : (
                      event.chapters.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => moveSelectedTo(c.id)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-canvas-deep text-left transition-colors duration-300"
                        >
                          <span className="font-sans text-[12px] text-ink">
                            {toRoman(c.number)} · {c.title}
                          </span>
                          <span className="font-sans text-[10px] text-whisper">{c.photos.length}</span>
                        </button>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
          )}
          <p className="font-sans text-[11px] text-whisper uppercase" style={{ letterSpacing: '0.18em' }}>
            {totalCount} images
          </p>
        </div>
      </div>
      <div className="mb-6 border border-muted bg-canvas-deep px-4 py-3">
        <div className="flex flex-wrap gap-6">
          <div>
            <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.08em' }}>
              Grid photo size
            </p>
            <input
              type="range"
              min={0}
              max={2}
              value={sizeScale === 'small' ? 0 : sizeScale === 'medium' ? 1 : 2}
              onChange={(e) => {
                const next = ['small', 'medium', 'large'][Number(e.target.value)] as Event['photoGridCellScale']
                updateEvent(event.id, { photoGridCellScale: next })
              }}
              className="mt-2 w-44"
            />
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.08em' }}>
              Grid spacing
            </p>
            <input
              type="range"
              min={0}
              max={2}
              value={spacingMode === 'tight' ? 0 : spacingMode === 'normal' ? 1 : 2}
              onChange={(e) => {
                const next = ['tight', 'normal', 'loose'][Number(e.target.value)] as Event['photoGridSpacing']
                updateEvent(event.id, { photoGridSpacing: next })
              }}
              className="mt-2 w-44"
            />
          </div>
        </div>
      </div>

      {/* Upload drop zone */}
      <div
        onClick={() => !isUploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={cn(
          'border border-dashed flex flex-col items-center justify-center py-10 mb-8 cursor-pointer transition-all duration-400 group',
          isDragging
            ? 'border-bronze bg-bronze/5'
            : 'border-muted bg-canvas-deep hover:border-bronze/40 hover:bg-canvas-deeper',
          isUploading && 'opacity-60 cursor-wait'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/avif"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
        <div className={cn(
          'w-8 h-8 border flex items-center justify-center mb-3 transition-colors duration-400',
          isDragging ? 'border-bronze text-bronze' : 'border-muted text-whisper group-hover:text-bronze'
        )}>
          <ImageIcon size={14} strokeWidth={1.5} />
        </div>
        <p className="font-sans text-sm text-whisper">
          {isUploading
            ? <span className="inline-flex items-center gap-2">Processing photos <BreathingDots label="Processing photos" /></span>
            : isDragging
              ? 'Drop to upload'
              : <>Drop photos here or <span className="text-bronze underline underline-offset-2">browse files</span></>
          }
        </p>
        <p className="font-sans text-[11px] text-whisper/50 mt-1">JPG, PNG, WebP — auto-resized for the gallery</p>
      </div>

      {/* Chapter filter tabs */}
      {chaptersWithPhotos.length > 0 && (
        <div className="flex gap-0 border-b border-muted mb-6 overflow-x-auto scrollbar-hide">
          {(['all', ...chaptersWithPhotos.map((c) => c.id)] as string[]).map((id) => {
            const ch = chaptersWithPhotos.find((c) => c.id === id)
            const label = id === 'all' ? `All (${totalCount})` : `${toRoman(ch!.number)} · ${ch!.title} (${ch!.photos.length})`
            return (
              <button
                key={id}
                onClick={() => setActiveChapter(id)}
                className={cn(
                  'font-sans text-[11px] uppercase px-4 py-3 border-b-2 whitespace-nowrap shrink-0 transition-colors duration-400',
                  activeChapter === id ? 'border-ink text-ink' : 'border-transparent text-whisper hover:text-ink-soft'
                )}
                style={{ letterSpacing: '0.16em' }}
              >
                {label}
              </button>
            )
          })}
        </div>
      )}

      {/* Photo grid */}
      {displayed.length === 0 ? (
        <div className="py-16 text-center border border-muted bg-canvas-deep">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="h-px w-8 bg-muted" />
            <div className="w-1 h-1 rounded-full bg-bronze/50" />
            <div className="h-px w-8 bg-muted" />
          </div>
          <p className="serif font-light text-ink mb-1.5" style={{ fontSize: '18px' }}>
            {event.chapters.length === 0 ? 'No chapters yet' : 'No photos in this view'}
          </p>
          <p className="serif italic text-whisper text-sm">
            {event.chapters.length === 0
              ? 'Add a chapter from the Chapters tab to organize your photographs.'
              : 'Drop photos above to upload them, or pick a different chapter.'}
          </p>
        </div>
      ) : (
        <div
          className={cn(
            sizeScale === 'small' ? 'columns-2 md:columns-3 xl:columns-4' : sizeScale === 'large' ? 'columns-1 md:columns-2 xl:columns-3' : 'columns-2 md:columns-3 xl:columns-4',
            spacingMode === 'tight' ? 'gap-1 space-y-1' : spacingMode === 'loose' ? 'gap-3 space-y-3' : 'gap-2 space-y-2'
          )}
        >
          {displayed.map((photo) => {
            const isSelected = selectedIds.has(photo.id)
            return (
              <div
                key={photo.id}
                className={cn(
                  'break-inside-avoid overflow-hidden group cursor-pointer relative',
                  isSelected && 'ring-2 ring-bronze ring-offset-1'
                )}
                onClick={() => setLightboxPhoto(photo)}
              >
                <img
                  src={photo.url}
                  alt=""
                  loading="lazy"
                  className="w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.2,0.6,0.2,1)] group-hover:scale-[1.03]"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleSelect(photo.id)
                  }}
                  className={cn(
                    'absolute top-2 left-2 w-5 h-5 border flex items-center justify-center transition-all duration-300',
                    isSelected ? 'bg-bronze border-bronze' : 'bg-night/30 border-canvas/40 opacity-0 group-hover:opacity-100'
                  )}
                  aria-label={isSelected ? 'Deselect photo' : 'Select photo'}
                >
                  {isSelected && <Check size={10} strokeWidth={2.5} className="text-inverse-fg" />}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    const nextRole = photo.role === 'hero' ? 'candid' : 'hero'
                    updatePhotoInChapter(event.id, photo.chapterId, photo.id, { role: nextRole })
                  }}
                  className={cn(
                    'absolute top-2 right-2 h-7 w-7 border border-canvas/35 bg-night/40 text-white/90 backdrop-blur-sm',
                    photo.role === 'hero' && 'bg-night/70 text-[#8B6F47]'
                  )}
                  aria-label="Mark as hero"
                >
                  <Star size={12} strokeWidth={1.6} className={photo.role === 'hero' ? 'fill-[#8B6F47]' : ''} />
                </button>
                {photo.role === 'hero' && (
                  <span className="absolute bottom-2 right-2 font-sans text-[9px] uppercase text-inverse-fg/80 bg-night/50 px-1.5 py-0.5" style={{ letterSpacing: '0.1em' }}>
                    Hero
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}

      <LightboxViewer
        photo={lightboxPhoto}
        photos={displayed}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={(p) => setLightboxPhoto(p)}
      />
    </div>
  )
}

// ─── Tab: Chapters ────────────────────────────────────────────────────────────
const CHAPTER_STATUSES: Chapter['status'][] = ['draft', 'scheduled', 'live', 'locked']
const statusLabel: Record<Chapter['status'], string> = {
  draft: 'Draft', scheduled: 'Scheduled', live: 'Live', locked: 'Locked',
}

function ChaptersTab({ event }: { event: Event }) {
  const updateChapter = useEventsStore((s) => s.updateChapter)
  const pushToast = useToastStore((s) => s.push)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [localStatus, setLocalStatus] = useState<Chapter['status']>('draft')
  const [localUnlock, setLocalUnlock] = useState('')

  const openEditor = (ch: Chapter) => {
    setEditingId(ch.id)
    setLocalStatus(ch.status)
    setLocalUnlock(ch.unlockDate ?? '')
  }

  const saveEdit = (ch: Chapter) => {
    const patch: Partial<Chapter> = { status: localStatus }
    patch.unlockDate = localStatus === 'scheduled' ? (localUnlock || undefined) : undefined
    updateChapter(event.id, ch.id, patch)
    setEditingId(null)
    const verbs: Record<Chapter['status'], string> = {
      draft: 'returned to draft',
      scheduled: 'scheduled',
      live: 'is now live',
      locked: 'locked',
    }
    pushToast(`${ch.title} ${verbs[localStatus]}`, {
      detail: localStatus === 'scheduled' && localUnlock ? `Unlocks on ${localUnlock}` : undefined,
      tone: localStatus === 'live' ? 'success' : 'bronze',
    })
  }

  return (
    <div className="px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title"><em>Chapters</em></h2>
        <p className="font-sans text-[11px] text-whisper uppercase" style={{ letterSpacing: '0.18em' }}>
          {event.chapters.length} chapters
        </p>
      </div>

      {event.chapters.length === 0 ? (
        <div className="py-20 text-center border border-muted">
          <p className="serif italic text-whisper">No chapters created yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {event.chapters.map((ch) => {
            const isEditing = editingId === ch.id
            return (
              <div
                key={ch.id}
                className="border border-muted bg-canvas-deep overflow-hidden transition-colors duration-400"
              >
                <div className="flex gap-0">
                  <div className="w-28 sm:w-36 shrink-0 overflow-hidden" style={{ aspectRatio: '4/3' }}>
                    <img
                      src={ch.coverImage}
                      alt={ch.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1 px-4 py-4 flex flex-col gap-3 min-w-0 sm:flex-row sm:items-start sm:gap-4">
                    <div className="flex items-start gap-3 min-w-0 sm:flex-1">
                      <span className="serif italic text-bronze text-sm w-8 shrink-0 pt-0.5">{toRoman(ch.number)}</span>
                      <div className="min-w-0 flex-1">
                        <p className="serif font-normal text-sm sm:text-[15px] text-ink leading-snug break-words">{ch.title}</p>
                        <p className="serif italic text-[11px] sm:text-[12px] text-whisper mt-1 leading-relaxed break-words line-clamp-2">{ch.caption}</p>
                        <p className="font-sans text-[11px] text-whisper/60 mt-1.5">{ch.photos.length} photos</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 sm:flex-col sm:items-end sm:justify-start">
                      <span className={chapterStatusPill[ch.status]}>{ch.status}</span>
                      <button
                        onClick={() => isEditing ? setEditingId(null) : openEditor(ch)}
                        className={cn(
                          'font-sans text-[10px] uppercase px-2.5 py-1.5 border transition-colors duration-400',
                          isEditing
                            ? 'border-bronze text-bronze'
                            : 'border-muted text-whisper hover:border-ink-soft hover:text-ink-soft'
                        )}
                        style={{ letterSpacing: '0.14em' }}
                      >
                        {isEditing ? 'Cancel' : 'Edit'}
                      </button>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <motion.div
                    className="border-t border-muted px-4 py-4 bg-canvas"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.2, 0.6, 0.2, 1] }}
                  >
                    <div className="flex flex-wrap gap-4 items-end">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.16em' }}>
                          Status
                        </label>
                        <div className="flex gap-1">
                          {CHAPTER_STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => setLocalStatus(s)}
                              className={cn(
                                'font-sans text-[10px] uppercase px-3 py-1.5 border transition-all duration-300',
                                localStatus === s
                                  ? 'bg-fill text-on-fill border-fill'
                                  : 'border-muted text-whisper hover:border-ink-soft hover:text-ink-soft'
                              )}
                              style={{ letterSpacing: '0.14em' }}
                            >
                              {statusLabel[s]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {localStatus === 'scheduled' && (
                        <div className="flex flex-col gap-1.5">
                          <label className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.16em' }}>
                            Unlock date
                          </label>
                          <input
                            type="date"
                            value={localUnlock}
                            onChange={(e) => setLocalUnlock(e.target.value)}
                            className="bg-canvas border border-muted px-3 py-1.5 font-sans text-sm text-ink outline-none focus:border-bronze-soft transition-colors duration-400"
                          />
                        </div>
                      )}

                      <button
                        onClick={() => saveEdit(ch)}
                        className="btn-ink"
                      >
                        Save changes
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Tab: Director's Note ─────────────────────────────────────────────────────
function NoteTab({ event }: { event: Event }) {
  const updateEvent = useEventsStore((s) => s.updateEvent)
  const pushToast = useToastStore((s) => s.push)

  const [noteText, setNoteText] = useState(event.directorsNote ?? '')
  const [quoteText, setQuoteText] = useState(event.closingQuote ?? '')
  const [noteEditing, setNoteEditing] = useState(false)
  const [quotEditing, setQuotEditing] = useState(false)

  useEffect(() => { setNoteText(event.directorsNote ?? '') }, [event.directorsNote])
  useEffect(() => { setQuoteText(event.closingQuote ?? '') }, [event.closingQuote])

  const saveNote = () => {
    updateEvent(event.id, { directorsNote: noteText.trim() || undefined })
    setNoteEditing(false)
    pushToast('Director\u2019s note saved', { detail: 'It will appear in the gallery prologue.', tone: 'success' })
  }

  const saveQuote = () => {
    updateEvent(event.id, { closingQuote: quoteText.trim() || undefined })
    setQuotEditing(false)
    pushToast('Closing quote saved', { detail: 'It will close the gallery.', tone: 'success' })
  }

  return (
    <div className="px-8 py-12 max-w-2xl">
      <h2 className="section-title mb-8">Director's <em>Note</em></h2>

      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.22em' }}>
            Opening note
          </p>
          <div className="flex gap-2">
            {noteEditing && (
              <button
                onClick={() => { setNoteText(event.directorsNote ?? ''); setNoteEditing(false) }}
                className="font-sans text-[10px] uppercase px-3 py-1.5 border border-muted text-whisper hover:border-ink-soft hover:text-ink-soft transition-all duration-400"
                style={{ letterSpacing: '0.16em' }}
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => noteEditing ? saveNote() : setNoteEditing(true)}
              className={cn(
                'font-sans text-[10px] uppercase px-3 py-1.5 border transition-all duration-400',
                noteEditing
                  ? 'bg-fill text-on-fill border-fill'
                  : 'border-muted text-whisper hover:border-ink-soft hover:text-ink-soft'
              )}
              style={{ letterSpacing: '0.16em' }}
            >
              {noteEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        <div className="border-l-2 border-bronze/30 pl-6">
          {noteEditing ? (
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              rows={6}
              autoFocus
              className="w-full bg-canvas-deep border border-muted px-4 py-3 serif font-light text-ink-soft outline-none focus:border-bronze-soft transition-colors duration-400 resize-none"
              style={{ fontSize: '16px', lineHeight: 1.75 }}
              placeholder="Write a personal note to your clients about their wedding story…"
            />
          ) : (
            <>
              {noteText ? (
                <p className="serif font-light text-ink-soft leading-relaxed"
                  style={{ fontSize: '17px', lineHeight: 1.75 }}>
                  {noteText}
                </p>
              ) : (
                <button
                  onClick={() => setNoteEditing(true)}
                  className="serif italic text-whisper/60 text-base hover:text-whisper transition-colors duration-400 text-left"
                >
                  Click to write a director's note for this gallery…
                </button>
              )}
              <p className="serif italic text-bronze mt-6 text-sm">— Mirror Studio</p>
            </>
          )}
        </div>
      </div>

      <div className="pt-8 border-t border-muted">
        <div className="flex items-center justify-between mb-4">
          <p className="font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.22em' }}>
            Closing quote
          </p>
          <div className="flex gap-2">
            {quotEditing && (
              <button
                onClick={() => { setQuoteText(event.closingQuote ?? ''); setQuotEditing(false) }}
                className="font-sans text-[10px] uppercase px-3 py-1.5 border border-muted text-whisper hover:border-ink-soft hover:text-ink-soft transition-all duration-400"
                style={{ letterSpacing: '0.16em' }}
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => quotEditing ? saveQuote() : setQuotEditing(true)}
              className={cn(
                'font-sans text-[10px] uppercase px-3 py-1.5 border transition-all duration-400',
                quotEditing
                  ? 'bg-fill text-on-fill border-fill'
                  : 'border-muted text-whisper hover:border-ink-soft hover:text-ink-soft'
              )}
              style={{ letterSpacing: '0.16em' }}
            >
              {quotEditing ? 'Save' : 'Edit'}
            </button>
          </div>
        </div>

        {quotEditing ? (
          <textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            rows={3}
            autoFocus
            className="w-full bg-canvas-deep border border-muted px-4 py-3 serif italic font-light text-ink-soft outline-none focus:border-bronze-soft transition-colors duration-400 resize-none"
            style={{ fontSize: '16px', lineHeight: 1.7 }}
            placeholder="A closing line shown at the end of the gallery…"
          />
        ) : (
          quoteText ? (
            <p className="serif italic font-light text-ink-soft text-base leading-relaxed" style={{ lineHeight: 1.7 }}>
              "{quoteText}"
            </p>
          ) : (
            <button
              onClick={() => setQuotEditing(true)}
              className="serif italic text-whisper/60 text-sm hover:text-whisper transition-colors duration-400 text-left"
            >
              Click to add a closing quote…
            </button>
          )
        )}
      </div>
    </div>
  )
}

// ─── Tab: Schedule ────────────────────────────────────────────────────────────
function ScheduleTab({ event }: { event: Event }) {
  const updateChapter = useEventsStore((s) => s.updateChapter)
  const updateMilestones = useEventsStore((s) => s.updateMilestones)
  const timelineRef = useRef<HTMLDivElement>(null)

  const [showSneakPeekModal, setShowSneakPeekModal] = useState(false)
  const [showPreviewChapterId, setShowPreviewChapterId] = useState<string | null>(null)
  const [selectedSneakPeekPhotos, setSelectedSneakPeekPhotos] = useState<string[]>([])
  const [sneakPeekMessage, setSneakPeekMessage] = useState('Your sneak peek is ready.')
  const [sneakPeekAt, setSneakPeekAt] = useState('')
  const [draggingChapterId, setDraggingChapterId] = useState<string | null>(null)

  const weddingEnd = new Date(event.date.end)
  const defaultSneakPeekDateTime = new Date(weddingEnd.getTime() + 24 * 60 * 60 * 1000)

  const toDatetimeLocalValue = (value: Date) => {
    const year = value.getFullYear()
    const month = String(value.getMonth() + 1).padStart(2, '0')
    const day = String(value.getDate()).padStart(2, '0')
    const hour = String(value.getHours()).padStart(2, '0')
    const minute = String(value.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hour}:${minute}`
  }

  const timelineStart = new Date(weddingEnd)
  timelineStart.setDate(timelineStart.getDate() - 14)
  const timelineEnd = new Date(weddingEnd)
  timelineEnd.setDate(timelineEnd.getDate() + 90)
  const timelineMs = timelineEnd.getTime() - timelineStart.getTime()

  const allPhotos = event.chapters.flatMap((chapter) =>
    chapter.photos.map((photo) => ({ ...photo, chapterId: chapter.id }))
  )

  const sneakPeekMilestone = (event.milestones ?? []).find((m) => m.id === 'sneak-peek')
  const sneakPeekScheduledAt = sneakPeekMilestone?.dueDate ?? null
  const chapterMilestones = event.chapters.map((ch) => ({
    id: ch.id,
    done: Boolean(ch.unlockDate && new Date(ch.unlockDate) <= new Date()),
  }))
  const completedCount = chapterMilestones.filter((m) => m.done).length + (sneakPeekScheduledAt ? 1 : 0)
  const totalCount = event.chapters.length + 1
  const remainingCount = Math.max(totalCount - completedCount, 0)
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  const todayOffsetDays = (() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const offsetMs = today.getTime() - timelineStart.getTime()
    return Math.max(0, Math.min(100, (offsetMs / timelineMs) * 100))
  })()

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })

  const formatDateOnly = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })

  const chapterDatePct = (unlockDate?: string) => {
    if (!unlockDate) return 0
    const at = new Date(unlockDate).getTime()
    if (Number.isNaN(at)) return 0
    const pct = ((at - timelineStart.getTime()) / timelineMs) * 100
    return Math.max(0, Math.min(100, pct))
  }

  const convertPointerToDate = (clientX: number) => {
    const el = timelineRef.current
    if (!el) return null
    const rect = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(rect.width, clientX - rect.left))
    const pct = rect.width === 0 ? 0 : x / rect.width
    const dateMs = timelineStart.getTime() + timelineMs * pct
    const nextDate = new Date(dateMs)
    nextDate.setHours(10, 0, 0, 0)
    return nextDate.toISOString()
  }

  const saveSneakPeek = () => {
    const existing = event.milestones ?? []
    const withoutSneakPeek = existing.filter((m) => m.id !== 'sneak-peek')
    updateMilestones(event.id, [
      ...withoutSneakPeek,
      {
        id: 'sneak-peek',
        label: 'Sneak Peek',
        done: false,
        dueDate: sneakPeekAt,
        note: sneakPeekMessage,
      },
    ])
    setShowSneakPeekModal(false)
  }

  const toggleSneakPeekPhoto = (photoId: string) => {
    setSelectedSneakPeekPhotos((prev) => {
      if (prev.includes(photoId)) return prev.filter((id) => id !== photoId)
      if (prev.length >= 10) return prev
      return [...prev, photoId]
    })
  }

  const onDotPointerDown = (chapterId: string, eventPointer: React.PointerEvent<HTMLButtonElement>) => {
    eventPointer.preventDefault()
    if (eventPointer.pointerType === 'touch') return
    setDraggingChapterId(chapterId)
    eventPointer.currentTarget.setPointerCapture(eventPointer.pointerId)
    const next = convertPointerToDate(eventPointer.clientX)
    if (next) updateChapter(event.id, chapterId, { unlockDate: next })
  }

  const onDotPointerMove = (chapterId: string, eventPointer: React.PointerEvent<HTMLButtonElement>) => {
    if (draggingChapterId !== chapterId) return
    const next = convertPointerToDate(eventPointer.clientX)
    if (next) updateChapter(event.id, chapterId, { unlockDate: next })
  }

  const onDotPointerUp = (eventPointer: React.PointerEvent<HTMLButtonElement>) => {
    if (draggingChapterId) {
      eventPointer.currentTarget.releasePointerCapture(eventPointer.pointerId)
      setDraggingChapterId(null)
    }
  }

  const previewChapter = event.chapters.find((ch) => ch.id === showPreviewChapterId) ?? null
  const previewStrip = previewChapter?.photos.slice(0, 3) ?? []
  const previewTitle = previewChapter?.title.replace(/^The\s+/i, '') ?? ''
  const openSneakPeekModal = () => {
    setSneakPeekAt(sneakPeekScheduledAt ?? toDatetimeLocalValue(defaultSneakPeekDateTime))
    setSneakPeekMessage(sneakPeekMilestone?.note || 'Your sneak peek is ready.')
    if (selectedSneakPeekPhotos.length === 0) {
      setSelectedSneakPeekPhotos(allPhotos.slice(0, 3).map((p) => p.id))
    }
    setShowSneakPeekModal(true)
  }

  return (
    <div className="px-4 py-8 md:px-8 md:py-10 space-y-10">
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="serif font-light text-[32px] text-ink leading-none">
            Delivery <em className="italic text-bronze">Schedule</em>
          </h2>
          <p className="font-sans text-[11px] uppercase text-whisper shrink-0" style={{ letterSpacing: '0.32em' }}>
            {completedCount}/{totalCount} milestones
          </p>
        </div>
        <div className="h-px bg-muted" />
        <div className="h-px bg-canvas-deep overflow-hidden">
          <div className="h-px bg-bronze transition-all duration-400" style={{ width: `${progressPct}%` }} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-sans text-[11px] uppercase text-ink-soft" style={{ letterSpacing: '0.32em' }}>
              Sneak Peek
            </p>
            {sneakPeekScheduledAt ? (
              <p className="serif font-light text-[22px] text-ink leading-tight">
                Scheduled for {formatDateTime(sneakPeekScheduledAt)}
              </p>
            ) : (
              <p className="serif italic font-light text-[22px] text-ink-soft leading-tight">
                The first taste — sent before the bride wakes.
              </p>
            )}
          </div>
          <button
            onClick={openSneakPeekModal}
            className="border border-muted px-[18px] py-[10px] font-sans text-[12px] uppercase text-whisper hover:border-ink-soft hover:text-ink-soft transition-colors duration-400"
            style={{ letterSpacing: '0.18em' }}
          >
            Edit Sneak Peek
          </button>
        </div>
      </section>

      <section className="space-y-5">
        <p className="font-sans text-[11px] uppercase text-ink-soft" style={{ letterSpacing: '0.32em' }}>
          Chapter Unlocks
        </p>

        <div className="relative overflow-x-auto touch-pan-x pb-3">
          <div className="relative min-w-[880px] px-4 pt-8 pb-6" ref={timelineRef}>
            <div className="absolute left-4 right-4 top-[74px] h-px bg-muted" />
            <div
              className="absolute top-[44px] w-px bg-bronze h-[70px]"
              style={{ left: `calc(16px + (${todayOffsetDays}% * (100% - 32px) / 100))` }}
            />
            <p
              className="absolute top-[28px] font-sans text-[10px] uppercase text-bronze"
              style={{ left: `calc(16px + (${todayOffsetDays}% * (100% - 32px) / 100) + 6px)`, letterSpacing: '0.32em' }}
            >
              Today
            </p>

            <div className="absolute left-4 top-[34px] w-3 h-3 border border-bronze bg-bronze" />
            <p className="absolute left-2 top-[90px] serif italic text-[12px] text-bronze">
              Wedding · {formatDateOnly(event.date.start)}
            </p>

            <div className="relative flex justify-between gap-5 pl-28 pr-4">
              {event.chapters.map((chapter) => {
                const chapterDate = chapter.unlockDate ? new Date(chapter.unlockDate) : null
                const isUnlocked = Boolean(chapterDate && chapterDate <= new Date())
                const dateLabel = chapter.unlockDate ? formatDateOnly(chapter.unlockDate) : 'Not scheduled'
                const leftPct = chapterDatePct(chapter.unlockDate)
                return (
                  <div key={chapter.id} className="w-[170px] shrink-0 flex flex-col items-center text-center relative">
                    <p className="serif italic text-[18px] text-bronze mb-3">
                      {toRoman(chapter.number)}
                    </p>
                    <button
                      onPointerDown={(e) => onDotPointerDown(chapter.id, e)}
                      onPointerMove={(e) => onDotPointerMove(chapter.id, e)}
                      onPointerUp={onDotPointerUp}
                      className={cn(
                        'w-3 h-3 border border-bronze transition-colors duration-400',
                        isUnlocked ? 'bg-bronze' : 'bg-transparent'
                      )}
                      style={{ touchAction: 'none' }}
                      aria-label={`Drag ${chapter.title} unlock marker`}
                    />
                    <div
                      className="absolute top-[73px] w-px h-5 bg-bronze/40"
                      style={{ left: `calc(${leftPct}% - 0.5px)` }}
                    />
                    <p className="serif text-[14px] text-ink mt-4 leading-tight">{chapter.title}</p>
                    <p className="serif italic text-[12px] text-whisper mt-1">{dateLabel}</p>
                    <button
                      onClick={() => setShowPreviewChapterId(chapter.id)}
                      className="mt-2 border border-muted px-3 py-1 font-sans text-[11px] uppercase text-whisper hover:border-ink-soft hover:text-ink-soft transition-colors duration-400"
                      style={{ letterSpacing: '0.18em' }}
                    >
                      Preview
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section>
        {remainingCount === 0 ? (
          <p className="serif italic text-[14px] text-ink-soft flex items-center gap-2">
            All milestones complete.
            <span className="w-1.5 h-1.5 rounded-full bg-bronze animate-pulse" />
          </p>
        ) : (
          <p className="serif italic text-[14px] text-ink-soft">
            {completedCount} of {totalCount} milestones complete · {remainingCount} remaining
          </p>
        )}
      </section>

      {showSneakPeekModal && (
        <div
          className="fixed inset-0 z-50 bg-night/50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowSneakPeekModal(false)
          }}
        >
          <div className="w-full max-w-3xl bg-canvas border border-muted p-5 md:p-7 max-h-[90vh] overflow-y-auto">
            <h3 className="serif font-light text-[28px] text-ink leading-tight">
              Schedule the Sneak Peek
            </h3>
            <p className="serif italic text-[18px] text-whisper mt-2 mb-6">
              The first taste — sent before the bride wakes.
            </p>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-6">
              {allPhotos.map((photo) => {
                const selected = selectedSneakPeekPhotos.includes(photo.id)
                return (
                  <button
                    key={photo.id}
                    onClick={() => toggleSneakPeekPhoto(photo.id)}
                    className={cn(
                      'aspect-square overflow-hidden border bg-canvas-deep',
                      selected ? 'border-[2px] border-bronze' : 'border-muted'
                    )}
                    aria-label="Toggle sneak peek photo"
                  >
                    <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </button>
                )
              })}
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-sans text-[11px] uppercase text-whisper" style={{ letterSpacing: '0.22em' }}>
                  Date and Time
                </label>
                <input
                  type="datetime-local"
                  value={sneakPeekAt}
                  onChange={(e) => setSneakPeekAt(e.target.value)}
                  className="mt-1 w-full border border-muted bg-canvas px-3 py-2 font-sans text-sm text-ink outline-none focus:border-bronze-soft transition-colors duration-400"
                />
              </div>

              <div>
                <label className="font-sans text-[11px] uppercase text-whisper" style={{ letterSpacing: '0.22em' }}>
                  Message
                </label>
                <textarea
                  value={sneakPeekMessage}
                  onChange={(e) => setSneakPeekMessage(e.target.value)}
                  className="mt-1 w-full border border-muted bg-canvas px-3 py-2 font-sans text-sm text-ink outline-none focus:border-bronze-soft transition-colors duration-400 min-h-[100px]"
                />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSneakPeekModal(false)}
                className="border border-muted px-4 py-2 font-sans text-[11px] uppercase text-whisper hover:border-ink-soft hover:text-ink-soft transition-colors duration-400"
                style={{ letterSpacing: '0.18em' }}
              >
                Cancel
              </button>
              <button
                onClick={saveSneakPeek}
                className="bg-fill border border-fill px-4 py-2 font-sans text-[11px] uppercase text-on-fill hover:bg-fill-hover transition-colors duration-400"
                style={{ letterSpacing: '0.18em' }}
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {showPreviewChapterId && previewChapter && (
        <div
          className="fixed inset-0 z-50 bg-night/50 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowPreviewChapterId(null)
          }}
        >
          <div className="w-full max-w-xl bg-canvas border border-muted p-6">
            <div className="grid grid-cols-3 gap-2 mb-5">
              {previewStrip.map((photo) => (
                <div key={photo.id} className="aspect-square border border-muted overflow-hidden">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <h4 className="serif font-light text-[22px] text-ink leading-tight">
              Your {previewTitle} chapter is now live
            </h4>
            <p className="serif italic text-[15px] text-whisper mt-2">
              {previewChapter.caption}
            </p>
            <button
              className="mt-5 bg-fill border border-fill px-4 py-2 font-sans text-[11px] uppercase text-on-fill hover:bg-fill-hover transition-colors duration-400"
              style={{ letterSpacing: '0.18em' }}
            >
              View now →
            </button>
            <p className="mt-5 font-sans text-[10px] uppercase text-whisper" style={{ letterSpacing: '0.22em' }}>
              Mirror Studio
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Tab: Analytics ───────────────────────────────────────────────────────────
function AnalyticsTab({ event }: { event: Event }) {
  const totalViews = event.chapters.reduce(
    (acc, c) => acc + c.photos.reduce((a, p) => a + p.views, 0),
    0
  )
  const favorited = event.chapters.reduce(
    (acc, c) => acc + c.photos.filter((p) => p.favorited).length,
    0
  )

  return (
    <div className="px-8 py-8">
      <h2 className="section-title mb-8">
        Gallery <em>Analytics</em>
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Photo Views', value: totalViews.toLocaleString('en-IN') },
          { label: 'Favorites', value: String(favorited) },
          { label: 'Chapters Live', value: String(event.chapters.filter((c) => c.status === 'live').length) },
          { label: 'Gallery Link Opens', value: '—' },
        ].map((s) => (
          <div key={s.label} className="border border-muted bg-canvas-deep p-5">
            <p className="font-sans text-[10px] uppercase text-whisper mb-2"
              style={{ letterSpacing: '0.18em' }}>
              {s.label}
            </p>
            <p className="serif font-light text-ink text-3xl leading-none"
              style={{ letterSpacing: '-0.02em' }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {event.chapters.filter((c) => c.photos.length > 0).length > 0 && (
        <div className="border border-muted">
          <div className="px-5 py-3 border-b border-muted bg-canvas-deeper">
            <p className="font-sans text-[10px] uppercase text-whisper"
              style={{ letterSpacing: '0.18em' }}>
              By Chapter
            </p>
          </div>
          {event.chapters.filter((c) => c.photos.length > 0).map((ch, i, arr) => {
            const views = ch.photos.reduce((a, p) => a + p.views, 0)
            const favs = ch.photos.filter((p) => p.favorited).length
            const topPhoto = [...ch.photos].sort((a, b) => b.views - a.views)[0]
            return (
              <div
                key={ch.id}
                className={cn(
                  'flex items-center gap-5 px-5 py-4',
                  i < arr.length - 1 && 'border-b border-muted'
                )}
              >
                <span className="serif italic text-bronze w-6 shrink-0 text-sm">
                  {toRoman(ch.number)}
                </span>
                <p className="serif font-normal text-[13px] text-ink w-40 shrink-0">
                  {ch.title}
                </p>
                <div className="flex-1 flex items-center gap-6">
                  <div>
                    <p className="font-sans text-[10px] text-whisper mb-0.5"
                      style={{ letterSpacing: '0.14em' }}>
                      Views
                    </p>
                    <p className="serif font-light text-ink text-xl">{views}</p>
                  </div>
                  <div>
                    <p className="font-sans text-[10px] text-whisper mb-0.5"
                      style={{ letterSpacing: '0.14em' }}>
                      Favorites
                    </p>
                    <p className="serif font-light text-ink text-xl">{favs}</p>
                  </div>
                  {topPhoto && (
                    <div className="ml-auto">
                      <img
                        src={topPhoto.url}
                        alt=""
                        className="w-12 h-8 object-cover opacity-80"
                      />
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}