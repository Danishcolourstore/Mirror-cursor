import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

type ClosingScreenProps = {
  triggerRef: RefObject<HTMLDivElement | null>
  coupleNames: string
  dateLabel: string
}

export default function ClosingScreen({ triggerRef, coupleNames, dateLabel }: ClosingScreenProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const target = triggerRef.current
    if (!target) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.6 },
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [triggerRef])

  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg-secondary)] px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,110,0.1)_0%,rgba(9,8,7,0)_58%)]" />
      <div className="closing-stack relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <span className={['closing-item mt-2 h-px w-[60px] bg-[#C9A96E]', visible ? 'in' : ''].join(' ')} />
        <p className={['closing-item type-label mt-8', visible ? 'in' : ''].join(' ')}>Thank you for celebrating with us</p>
        <h2 className={['closing-item type-display mt-6 text-[48px] text-white', visible ? 'in' : ''].join(' ')}>
          {coupleNames}
        </h2>
        <p className={['closing-item type-label mt-5', visible ? 'in' : ''].join(' ')}>{dateLabel}</p>
        <p className={['closing-item type-label mt-10 text-white/35', visible ? 'in' : ''].join(' ')}>Photographed by</p>
        <h3 className={['closing-item type-section mt-3 text-white', visible ? 'in' : ''].join(' ')}>Voga Weddings</h3>

        <div className={['closing-item mt-12 flex flex-wrap items-center justify-center gap-3', visible ? 'in' : ''].join(' ')}>
          <button type="button" className="type-label rounded-[4px] border border-[#C9A96E]/45 px-6 py-3 text-[#C9A96E]">
            DOWNLOAD FAVORITES
          </button>
          <button type="button" className="type-label rounded-[4px] border border-[#C9A96E]/45 px-6 py-3 text-[#C9A96E]">
            SHARE GALLERY
          </button>
        </div>

        <p className={['closing-item type-label mt-14 text-white/25', visible ? 'in' : ''].join(' ')}>
          Created with Mirror Studio
        </p>
      </div>
      <style>{`
        .closing-item {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 900ms ease, transform 900ms ease;
        }

        .closing-item.in {
          opacity: 1;
          transform: translateY(0);
        }

        .closing-stack .closing-item:nth-child(1) { transition-delay: 0ms; }
        .closing-stack .closing-item:nth-child(2) { transition-delay: 1200ms; }
        .closing-stack .closing-item:nth-child(3) { transition-delay: 1400ms; }
        .closing-stack .closing-item:nth-child(4) { transition-delay: 1600ms; }
        .closing-stack .closing-item:nth-child(5) { transition-delay: 1800ms; }
        .closing-stack .closing-item:nth-child(6) { transition-delay: 2000ms; }
        .closing-stack .closing-item:nth-child(7) { transition-delay: 2200ms; }
        .closing-stack .closing-item:nth-child(8) { transition-delay: 2400ms; }
      `}</style>
    </section>
  )
}
