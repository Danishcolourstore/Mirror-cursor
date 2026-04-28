import { motion } from 'framer-motion'
import type { Photo } from '../../types/photo'

type HeroPauseProps = {
  photo: Photo
  onLightboxOpen: () => void
}

export default function HeroPause({ photo, onLightboxOpen }: HeroPauseProps) {
  return (
    <motion.div
      className="relative my-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 1.2, ease: [0.2, 0.6, 0.2, 1] }}
    >
      {/* Full-bleed — extends beyond the parent padding */}
      <div
        className="relative overflow-hidden cursor-zoom-in group"
        style={{ aspectRatio: '3/2', marginLeft: 'clamp(-0.75rem, -3vw, -1.5rem)', marginRight: 'clamp(-0.75rem, -3vw, -1.5rem)' }}
        onClick={onLightboxOpen}
      >
        <motion.img
          src={photo.url}
          alt={photo.caption ?? ''}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.025 }}
          transition={{ duration: 1.6, ease: [0.2, 0.6, 0.2, 1] }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-night/0 group-hover:bg-night/8 transition-colors duration-[1400ms]" />
      </div>

      {/* Caption — centred below */}
      {photo.caption && (
        <motion.p
          className="serif italic text-whisper text-center mt-5 px-6"
          style={{ fontSize: '14px', lineHeight: 1.65 }}
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, delay: 0.25, ease: [0.2, 0.6, 0.2, 1] }}
        >
          {photo.caption}
        </motion.p>
      )}
    </motion.div>
  )
}
