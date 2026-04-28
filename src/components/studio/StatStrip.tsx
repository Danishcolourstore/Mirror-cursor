type Stat = {
  label: string
  value: string
  emphasis?: string   // the part rendered italic (accent gold) inside the value
  suffix?: string
}

type StatStripProps = {
  stats: Stat[]
}

export default function StatStrip({ stats }: StatStripProps) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
    >
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg bg-canvas border border-muted shadow-card px-5 sm:px-6 py-5"
        >
          <p
            className="font-sans text-[11px] uppercase text-whisper mb-3"
            style={{ letterSpacing: '0.18em' }}
          >
            {stat.label}
          </p>
          <p
            className="serif font-light text-ink leading-none"
            style={{ fontSize: '36px', letterSpacing: '-0.02em' }}
          >
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
