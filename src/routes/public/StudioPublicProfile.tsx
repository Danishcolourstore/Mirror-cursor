import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Phone, AtSign } from 'lucide-react'
import { publicStudioProfiles } from '../../data/colourStoreProfile'
import NotFound from '../NotFound'

const EASE: [number, number, number, number] = [0.2, 0.6, 0.2, 1]

export default function StudioPublicProfile() {
  const location = useLocation()
  const slug =
    location.pathname.replace(/^\/studio\/?/, '').split('/').filter(Boolean)[0] ?? ''
  const profile = publicStudioProfiles[slug]

  if (!profile) {
    return <NotFound />
  }

  const [first, second] = profile.nameParts

  return (
    <main className="min-h-screen bg-canvas text-ink">
      {/* Hero — editorial, left-weighted; no centered CTA */}
      <header className="border-b border-muted">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 pt-14 sm:pt-20 pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <p className="font-sans text-[10px] uppercase text-whisper mb-8" style={{ letterSpacing: '0.32em' }}>
              Studio
            </p>

            {/* Wordmark as “logo” — typographic, no button */}
            <div className="mb-6">
              <h1
                className="serif font-light text-ink leading-none"
                style={{ fontSize: 'clamp(2.25rem, 6vw, 3.25rem)', letterSpacing: '-0.03em' }}
              >
                {first}
                <em className="not-italic text-bronze font-light" style={{ fontStyle: 'italic' }}>
                  ·
                </em>
                {second}
              </h1>
            </div>

            <p
              className="serif italic text-bronze font-light max-w-md"
              style={{ fontSize: '17px', lineHeight: 1.55 }}
            >
              {profile.tagline}
            </p>
          </div>
        </div>
      </header>

      {/* Recent weddings */}
      <section className="border-b border-muted">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
          <p
            className="font-sans text-[10px] uppercase text-whisper mb-8 sm:mb-10"
            style={{ letterSpacing: '0.28em' }}
          >
            Recent weddings
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-muted border border-muted">
            {profile.recentWeddings.map((w, i) => (
              <motion.div
                key={w.slug}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: i * 0.06, ease: EASE }}
              >
                <Link
                  to={`/g/${w.slug}`}
                  className="group block bg-canvas focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-bronze/60"
                >
                  <div
                    className="relative overflow-hidden aspect-[4/5] bg-canvas-deep border-b border-muted sm:border-b-0"
                  >
                    <img
                      src={w.coverImage}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    {/* Subtle lift on hover — no heavy shadow */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                      style={{
                        boxShadow: 'inset 0 0 0 1px rgba(139, 111, 71, 0.2)',
                      }}
                    />
                  </div>
                  <div className="px-4 py-4 sm:px-5 sm:py-5">
                    <p className="serif font-normal text-[15px] text-ink leading-tight tracking-tight">
                      {w.coupleNames}
                    </p>
                    <p className="font-sans text-[11px] text-whisper mt-1.5 leading-relaxed">
                      {w.venueLocation}
                      <span className="text-muted"> · </span>
                      {w.city}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="border-b border-muted">
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16">
          <p
            className="serif font-light text-ink-soft max-w-xl"
            style={{ fontSize: '18px', lineHeight: 1.72, letterSpacing: '-0.01em' }}
          >
            {profile.bio}
          </p>
        </div>
      </section>

      {/* Contact — minimal lines, Lucide only */}
      <section>
        <div className="mx-auto max-w-5xl px-5 sm:px-8 py-12 sm:py-16 pb-20">
          <p
            className="font-sans text-[10px] uppercase text-whisper mb-6 sm:mb-8"
            style={{ letterSpacing: '0.28em' }}
          >
            Contact
          </p>

          <ul className="space-y-5 sm:space-y-6 max-w-lg">
            <li className="flex items-start gap-3 border-b border-muted pb-5">
              <Mail size={14} strokeWidth={1.35} className="text-whisper shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-sans text-[10px] uppercase text-whisper mb-1" style={{ letterSpacing: '0.22em' }}>
                  Email
                </p>
                <a
                  href={`mailto:${profile.email}`}
                  className="serif font-light text-ink-soft text-[15px] border-b border-bronze/30 hover:border-bronze transition-colors duration-400 pb-px"
                >
                  {profile.email}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3 border-b border-muted pb-5">
              <Phone size={14} strokeWidth={1.35} className="text-whisper shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-sans text-[10px] uppercase text-whisper mb-1" style={{ letterSpacing: '0.22em' }}>
                  Phone
                </p>
                <a
                  href={`tel:${profile.phone.replace(/\s/g, '')}`}
                  className="serif font-light text-ink-soft text-[15px] border-b border-bronze/30 hover:border-bronze transition-colors duration-400 pb-px"
                >
                  {profile.phone}
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <AtSign size={14} strokeWidth={1.35} className="text-whisper shrink-0 mt-0.5" aria-hidden />
              <div>
                <p className="font-sans text-[10px] uppercase text-whisper mb-1" style={{ letterSpacing: '0.22em' }}>
                  Instagram
                </p>
                <a
                  href={profile.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="serif font-light text-ink-soft text-[15px] border-b border-bronze/30 hover:border-bronze transition-colors duration-400 pb-px"
                >
                  {profile.instagramHandle}
                </a>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  )
}
