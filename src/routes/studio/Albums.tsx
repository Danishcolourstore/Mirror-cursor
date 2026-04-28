import { cn } from '../../lib/cn'

/** Polish 7 — two mock albums */
const MOCK_ALBUMS = [
  {
    id: 'alb-p7-01',
    coupleLines: ['Ananya', 'Rohan'],
    spreads: 30,
    pages: 60,
    status: 'approved' as const,
    coverImage: 'https://i.ibb.co/rGwn5grR/eea4dda1c6155fd114b1904896bef578.jpg',
  },
  {
    id: 'alb-p7-02',
    coupleLines: ['Priya', 'Arjun'],
    spreads: 24,
    pages: 48,
    status: 'designing' as const,
    coverImage: 'https://i.ibb.co/JwBVLRdL/imgi-24-dd6ae2d4c16511f0a4050a58a9feac02.webp',
  },
] as const

const STATUS_META: Record<
  (typeof MOCK_ALBUMS)[number]['status'],
  { label: string; pill: string }
> = {
  approved: { label: 'Approved', pill: 'pill-live' },
  designing: { label: 'Designing', pill: 'pill-shooting' },
}

export default function Albums() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-canvas pb-24 lg:pb-0">
      <div className="flex items-center justify-end px-8 py-4 border-b border-muted bg-canvas sticky top-0 z-10">
        <span className="font-sans text-[11px] text-whisper uppercase" style={{ letterSpacing: '0.18em' }}>
          Print catalogue
        </span>
      </div>

      <div className="px-8 pt-10 pb-8">
        <h1 className="serif font-light text-ink" style={{ fontSize: '36px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          <em className="text-bronze" style={{ fontStyle: 'italic' }}>Albums</em>
        </h1>
        <p className="font-sans text-sm text-whisper mt-2 max-w-xl">
          Heirloom spreads — each book a quieter story than the last.
        </p>
      </div>

      <div className="px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {MOCK_ALBUMS.map((album) => {
            const { label, pill } = STATUS_META[album.status]
            return (
              <article
                key={album.id}
                className="border border-muted bg-canvas-deep group hover:shadow-[0_2px_14px_rgba(28,24,20,0.06)] transition-shadow duration-400"
              >
                <div className="relative overflow-hidden bg-canvas aspect-[4/5] border-b border-muted">
                  <img
                    src={album.coverImage}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <span className={cn('absolute top-3 left-3 uppercase text-[9px]', pill)} style={{ letterSpacing: '0.14em' }}>
                    {label}
                  </span>
                </div>
                <div className="px-5 py-5">
                  <h2 className="serif font-normal text-[17px] text-ink leading-tight">
                    {album.coupleLines[0]}
                    <em className="text-bronze" style={{ fontStyle: 'italic', fontWeight: 300 }}>
                      {' '} &{' '}
                    </em>
                    {album.coupleLines[1]}
                  </h2>
                  <p className="font-sans text-[12px] text-whisper mt-3" style={{ letterSpacing: '0.06em' }}>
                    {album.spreads} spreads · {album.pages} pages
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
