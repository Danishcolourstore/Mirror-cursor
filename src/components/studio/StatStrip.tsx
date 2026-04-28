type Stat = {
  label: string
  value: string
  emphasis?: string   // the part rendered italic-bronze inside the value
  suffix?: string
}

type StatStripProps = {
  stats: Stat[]
}

export default function StatStrip({ stats }: StatStripProps) {
  return (
    <div className="grid border-t border-b border-muted divide-x divide-muted"
      style={{ gridTemplateColumns: `repeat(${stats.length}, 1fr)` }}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="px-6 py-6">
          <p className="font-sans text-[11px] uppercase text-whisper mb-3"
            style={{ letterSpacing: '0.18em' }}>
            {stat.label}
          </p>
          <p className="serif font-light text-ink leading-none"
            style={{ fontSize: '36px', letterSpacing: '-0.02em' }}>
            {stat.emphasis ? (
              <>
                {stat.value.split(stat.emphasis)[0]}
                <em className="text-bronze" style={{ fontStyle: 'italic' }}>
                  {stat.emphasis}
                </em>
                {stat.value.split(stat.emphasis)[1] ?? ''}
              </>
            ) : (
              stat.value
            )}
            {stat.suffix && (
              <span className="text-whisper font-sans text-sm ml-1">{stat.suffix}</span>
            )}
          </p>
        </div>
      ))}
    </div>
  )
}
