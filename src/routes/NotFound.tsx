import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="bg-canvas min-h-screen flex items-center justify-center px-6">
      <motion.div
        className="text-center max-w-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: [0.2, 0.6, 0.2, 1] }}
      >
        <p
          className="serif italic text-bronze/50 mb-6"
          style={{ fontSize: '80px', lineHeight: 1, letterSpacing: '-0.04em' }}
        >
          404
        </p>

        <h1
          className="serif font-light text-ink mb-3"
          style={{ fontSize: '24px', letterSpacing: '-0.02em' }}
        >
          This frame doesn't exist.
        </h1>

        <p className="font-sans text-sm text-whisper mb-10 leading-relaxed">
          The page you're looking for may have moved, or the link might be wrong.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link to="/studio/overview" className="btn-ink">
            Back to Studio
          </Link>
          <Link to="/g/ananya-rohan" className="btn-ghost">
            View Sample Gallery
          </Link>
        </div>

        <p className="serif italic text-whisper/40 text-xs mt-10">
          — Mirror Studio
        </p>
      </motion.div>
    </div>
  )
}
