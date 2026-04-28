import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'
import {
  INSIGHTS_STATS,
  MOCK_ENGAGEMENT_30D,
  MOCK_TOP_WEDDINGS,
  MOCK_FAMILY_ENGAGEMENT,
  MOCK_LOVED_PHOTO_URLS,
} from '../../data/mockInsights'

const INK = '#1A1A1A'
const BRONZE = '#E8C97A'
const MUTED = '#E8E8E8'
const WHISPER = '#6B6B6B'

const tooltipStyle = {
  background: '#FFFFFF',
  border: '1px solid #E8E8E8',
  borderRadius: 0,
  fontSize: '11px',
  fontFamily: 'DM Sans, system-ui, sans-serif',
  color: INK,
}

export default function Insights() {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-canvas pb-24 lg:pb-0">
      <div className="flex items-center justify-between px-8 py-4 border-b border-muted bg-canvas sticky top-0 z-10">
        <div className="flex-1" />
        <span className="font-sans text-[11px] text-whisper uppercase" style={{ letterSpacing: '0.18em' }}>
          Last 30 days
        </span>
      </div>

      <div className="px-8 pt-10 pb-8">
        <h1 className="serif font-light text-ink" style={{ fontSize: '36px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Studio <em className="text-bronze" style={{ fontStyle: 'italic' }}>Insights</em>
        </h1>
        <p className="font-sans text-sm text-whisper mt-2">
          Quiet signals from the way people move through your galleries.
        </p>
      </div>

      {/* 4-card stat strip */}
      <div className="mx-8 grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <div className="rounded-lg bg-canvas border border-muted shadow-card px-5 sm:px-6 py-5">
          <p className="font-sans text-[10px] uppercase text-whisper mb-2" style={{ letterSpacing: '0.18em' }}>
            Total galleries
          </p>
          <p className="serif font-light text-ink leading-none" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
            {INSIGHTS_STATS.totalGalleries}
          </p>
        </div>
        <div className="rounded-lg bg-canvas border border-muted shadow-card px-5 sm:px-6 py-5">
          <p className="font-sans text-[10px] uppercase text-whisper mb-2" style={{ letterSpacing: '0.18em' }}>
            Total opens this month
          </p>
          <p className="serif font-light text-ink leading-none" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
            {INSIGHTS_STATS.opensThisMonth.toLocaleString('en-IN')}
          </p>
        </div>
        <div className="rounded-lg bg-canvas border border-muted shadow-card px-5 sm:px-6 py-5">
          <p className="font-sans text-[10px] uppercase text-whisper mb-2" style={{ letterSpacing: '0.18em' }}>
            Most-loved photo type
          </p>
          <p className="serif font-light text-ink leading-none italic text-bronze" style={{ fontSize: '26px', letterSpacing: '-0.02em' }}>
            {INSIGHTS_STATS.mostLovedPhotoType}
          </p>
        </div>
        <div className="rounded-lg bg-canvas border border-muted shadow-card px-5 sm:px-6 py-5">
          <p className="font-sans text-[10px] uppercase text-whisper mb-2" style={{ letterSpacing: '0.18em' }}>
            Avg engagement / gallery
          </p>
          <p className="serif font-light text-ink leading-none" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>
            {INSIGHTS_STATS.avgEngagementPerGallery.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="px-8 space-y-10 pb-14">
        {/* Engagement over time — line */}
        <div className="rounded-lg border border-muted bg-canvas shadow-card p-6 sm:p-8">
          <h2 className="section-title text-base mb-6">
            Engagement <em>over time</em>
          </h2>
          <p className="font-sans text-[11px] text-whisper mb-4" style={{ letterSpacing: '0.14em' }}>
            Opens across all live galleries — trailing 30 days
          </p>
          <div className="w-full" style={{ height: 280 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_ENGAGEMENT_30D} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid stroke={MUTED} strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="day"
                  tick={{ fill: WHISPER, fontSize: 9, fontFamily: 'DM Sans, system-ui' }}
                  axisLine={{ stroke: MUTED }}
                  tickLine={{ stroke: MUTED }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: WHISPER, fontSize: 9, fontFamily: 'DM Sans, system-ui' }}
                  axisLine={{ stroke: MUTED }}
                  tickLine={{ stroke: MUTED }}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="opens"
                  stroke={INK}
                  strokeWidth={1.25}
                  dot={false}
                  activeDot={{ r: 3, fill: BRONZE, stroke: INK }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* Top 5 weddings */}
          <div className="rounded-lg border border-muted bg-canvas shadow-card p-6 sm:p-8">
            <h2 className="section-title text-base mb-6">
              Top <em>weddings</em> <span className="font-sans text-[10px] text-whisper uppercase not-italic" style={{ letterSpacing: '0.2em' }}>by engagement</span>
            </h2>
            <ol className="space-y-0 divide-y divide-muted border border-muted">
              {MOCK_TOP_WEDDINGS.map((w, i) => (
                <li key={w.couple} className="flex items-baseline justify-between gap-4 px-4 py-3.5 hover:bg-canvas transition-colors duration-300">
                  <span className="font-sans text-[10px] text-whisper w-5 shrink-0" style={{ letterSpacing: '0.12em' }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="serif font-normal text-[15px] text-ink flex-1 text-balance">
                    {w.couple}
                  </span>
                  <span className="font-sans tabular-nums text-[12px] text-whisper shrink-0">
                    {w.score.toLocaleString('en-IN')}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Family breakdown — bar */}
          <div className="rounded-lg border border-muted bg-canvas shadow-card p-6 sm:p-8">
            <h2 className="section-title text-base mb-6">
              Family <em>engagement</em>
            </h2>
            <p className="font-sans text-[11px] text-whisper mb-4" style={{ letterSpacing: '0.12em' }}>
              Relative time spent by audience (index)
            </p>
            <div className="w-full" style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_FAMILY_ENGAGEMENT} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 4 }}>
                  <CartesianGrid stroke={MUTED} strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fill: WHISPER, fontSize: 9 }} axisLine={{ stroke: MUTED }} />
                  <YAxis
                    type="category"
                    dataKey="segment"
                    width={120}
                    tick={{ fill: WHISPER, fontSize: 10, fontFamily: 'DM Sans, system-ui' }}
                    axisLine={{ stroke: MUTED }}
                  />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="value" fill={INK} radius={2} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top 10 loved photos */}
        <div>
          <h2 className="section-title text-base mb-6">
            Most-loved <em>photographs</em> <span className="font-sans text-[10px] text-whisper uppercase not-italic" style={{ letterSpacing: '0.18em' }}>this month</span>
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-muted border border-muted">
            {MOCK_LOVED_PHOTO_URLS.map((url, i) => (
              <div key={i} className="bg-canvas aspect-square overflow-hidden relative group">
                <img
                  src={url}
                  alt=""
                  className="w-full h-full object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.04]"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <p
          className="serif italic text-ink-soft max-w-2xl border-t border-muted pt-10 mt-2 pb-8"
          style={{ fontSize: '17px', lineHeight: 1.75 }}
        >
          Insights are a gift the gallery gives you back. Use them to learn what your clients love.
        </p>
      </div>
    </div>
  )
}
