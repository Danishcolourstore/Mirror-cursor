import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useLivePhotos } from '../../data/gallery/useLivePhotos'
import { usePageMeta } from '../../lib/usePageMeta'
import ChapterCover from '../../components/gallery/ChapterCover'
import PhotoGrid from '../../components/gallery/PhotoGrid'
import TopActions from '../../components/gallery/TopActions'
import { toRoman } from '../../lib/format'

export default function ChapterView() {
  const { slug, chapterId } = useParams()
  const slugKey = slug?.trim() ?? ''
  const { data: gallery, isPending } = useLivePhotos(slug)

  const event = gallery?.event
  const liveChapters = gallery?.liveChapters ?? []
  const chapter = liveChapters.find((c) => c.id === chapterId)
  const chapterIdx = liveChapters.findIndex((c) => c.id === chapterId)
  const prevChapter = chapterIdx > 0 ? liveChapters[chapterIdx - 1] : null
  const nextChapter = chapterIdx < liveChapters.length - 1 ? liveChapters[chapterIdx + 1] : null

  // Scroll to top whenever chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [chapterId])

  if (!slugKey || isPending || !event || !chapter) {
    return (
      <div className="bg-canvas flex min-h-screen flex-col items-center justify-center gap-6">
        <p className="serif italic text-whisper">
          {isPending ? 'Opening…' : 'Chapter not found.'}
        </p>
        {!isPending && event && (
          <Link
            to={`/g/${slug}`}
            className="font-sans text-[11px] uppercase text-inverse-fg/40 hover:text-inverse-fg/70 transition-colors"
            style={{ letterSpacing: '0.2em' }}
          >
            Back to gallery
          </Link>
        )}
      </div>
    )
  }

  const coupleNames = `${event.couple.brideName} & ${event.couple.groomName}`

  usePageMeta({
    title: `${chapter.title} — ${coupleNames} · Mirror Studio`,
    description: chapter.caption,
    image: chapter.coverImage,
    url: window.location.href,
  })

  return (
    <div className="min-h-screen bg-canvas">

      {/* Minimal sticky header */}
      <div
        className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-5 py-3"
        style={{
          background: 'rgba(246,241,232,0.88)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(217,208,190,0.5)',
        }}
      >
        <Link
          to={`/g/${slug}`}
          className="flex items-center gap-2 font-sans text-[11px] uppercase text-whisper hover:text-ink transition-colors duration-400 group"
          style={{ letterSpacing: '0.18em' }}
        >
          <ArrowLeft
            size={11}
            strokeWidth={1.5}
            className="transition-transform duration-400 group-hover:-translate-x-1"
          />
          {coupleNames}
        </Link>

        <p className="serif italic text-bronze text-sm">
          {toRoman(chapter.number)} · {chapter.title}
        </p>

        <div className="w-24 text-right">
          <span className="font-sans text-[10px] text-whisper/50 uppercase" style={{ letterSpacing: '0.14em' }}>
            {chapter.photos.length} frames
          </span>
        </div>
      </div>

      {/* Chapter cover — offset for sticky header */}
      <div className="pt-[49px]">
        <ChapterCover chapter={chapter} />
      </div>

      {/* Photo grid */}
      {chapter.photos.length > 0 && <PhotoGrid photos={chapter.photos} />}

      {/* Chapter navigation footer */}
      <motion.div
        className="border-t border-muted mx-6 sm:mx-12 mt-8 mb-20 grid grid-cols-2"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.2, 0.6, 0.2, 1] }}
      >
        {/* Prev chapter */}
        {prevChapter ? (
          <Link
            to={`/g/${slug}/${prevChapter.id}`}
            className="py-8 pr-6 flex items-start gap-3 group border-r border-muted"
          >
            <ArrowLeft
              size={13}
              strokeWidth={1.5}
              className="text-whisper mt-1 shrink-0 transition-transform duration-400 group-hover:-translate-x-1"
            />
            <div>
              <p className="font-sans text-[10px] uppercase text-whisper mb-1" style={{ letterSpacing: '0.18em' }}>
                Previous
              </p>
              <p className="serif italic text-bronze text-sm">{toRoman(prevChapter.number)}</p>
              <p className="serif font-light text-ink text-base">{prevChapter.title}</p>
              <p className="serif italic text-whisper text-[12px] mt-0.5">{prevChapter.caption}</p>
            </div>
          </Link>
        ) : (
          <div />
        )}

        {/* Next chapter */}
        {nextChapter ? (
          <Link
            to={`/g/${slug}/${nextChapter.id}`}
            className="py-8 pl-6 flex items-start gap-3 justify-end text-right group"
          >
            <div>
              <p className="font-sans text-[10px] uppercase text-whisper mb-1" style={{ letterSpacing: '0.18em' }}>
                Next
              </p>
              <p className="serif italic text-bronze text-sm">{toRoman(nextChapter.number)}</p>
              <p className="serif font-light text-ink text-base">{nextChapter.title}</p>
              <p className="serif italic text-whisper text-[12px] mt-0.5">{nextChapter.caption}</p>
            </div>
            <ArrowRight
              size={13}
              strokeWidth={1.5}
              className="text-whisper mt-1 shrink-0 transition-transform duration-400 group-hover:translate-x-1"
            />
          </Link>
        ) : (
          <div className="py-8 pl-6 flex items-center justify-end">
            <Link
              to={`/g/${slug}`}
              className="font-sans text-[11px] uppercase text-whisper hover:text-ink transition-colors group flex items-center gap-2"
              style={{ letterSpacing: '0.18em' }}
            >
              Back to gallery
              <ArrowRight
                size={11}
                strokeWidth={1.5}
                className="transition-transform duration-400 group-hover:translate-x-1"
              />
            </Link>
          </div>
        )}
      </motion.div>

      {/* Floating actions */}
      <TopActions event={event} />
    </div>
  )
}
