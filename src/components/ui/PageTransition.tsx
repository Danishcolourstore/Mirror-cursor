import { motion } from 'framer-motion'

type PageTransitionProps = {
  children: React.ReactNode
  mode?: 'studio' | 'gallery'
}

export default function PageTransition({ children, mode = 'studio' }: PageTransitionProps) {
  const isGallery = mode === 'gallery'
  return (
    <motion.div
      initial={isGallery ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={isGallery ? { opacity: 1 } : { opacity: 1, y: 0 }}
      exit={isGallery ? { opacity: 0 } : { opacity: 0, y: 8 }}
      transition={{
        duration: isGallery ? 0.6 : 0.4,
        ease: [0.2, 0.6, 0.2, 1],
      }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  )
}
