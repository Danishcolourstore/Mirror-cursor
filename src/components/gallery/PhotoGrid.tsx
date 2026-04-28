import { useState } from 'react'
import { motion } from 'framer-motion'
import Photo from './Photo'
import HeroPause from './HeroPause'
import Lightbox from './Lightbox'
import type { Photo as PhotoType } from '../../types/photo'

type PhotoGridProps = {
  photos: PhotoType[]
}

type RowTemplate = 'row-1' | 'row-2' | 'row-3' | 'row-2-wide' | 'row-2-tall'

function buildRows(photos: PhotoType[]): Array<{ template: RowTemplate; photos: PhotoType[] }> {
  const rows: Array<{ template: RowTemplate; photos: PhotoType[] }> = []
  let i = 0

  while (i < photos.length) {
    const photo = photos[i]

    // Hero / establish / breath always solo — hero gets HeroPause treatment
    if (photo.role === 'hero' || photo.role === 'establish' || photo.role === 'breath') {
      rows.push({ template: 'row-1', photos: [photo] })
      i++
      continue
    }

    const remaining = photos.length - i

    // Three candid/detail photos in a row
    if (
      remaining >= 3 &&
      photos[i + 1]?.role !== 'hero' &&
      photos[i + 2]?.role !== 'hero'
    ) {
      rows.push({ template: 'row-3', photos: [photos[i], photos[i + 1], photos[i + 2]] })
      i += 3
      continue
    }

    if (remaining >= 2 && photos[i + 1]?.role !== 'hero') {
      const next = photos[i + 1]
      if (photo.aspect === 'landscape' && next.aspect === 'portrait') {
        rows.push({ template: 'row-2-wide', photos: [photo, next] })
      } else if (photo.aspect === 'portrait' && next.aspect === 'landscape') {
        rows.push({ template: 'row-2-tall', photos: [photo, next] })
      } else {
        rows.push({ template: 'row-2', photos: [photo, next] })
      }
      i += 2
      continue
    }

    rows.push({ template: 'row-1', photos: [photo] })
    i++
  }

  return rows
}

// Aspect ratio strings for each cell position
const cellAspect: Record<RowTemplate, string[]> = {
  'row-1':       ['3/2'],
  'row-2':       ['1/1', '1/1'],
  'row-3':       ['4/5', '4/5', '4/5'],
  'row-2-wide':  ['3/2', '4/5'],
  'row-2-tall':  ['4/5', '3/2'],
}

const rowCols: Record<RowTemplate, string> = {
  'row-1':       '1fr',
  'row-2':       '1fr 1fr',
  'row-3':       '1fr 1fr 1fr',
  'row-2-wide':  '2fr 1fr',
  'row-2-tall':  '1fr 2fr',
}

// On small screens, collapse 3-col rows to 2+1 pattern
function MobileAwareRow({
  row,
  rowIdx,
  onOpen,
}: {
  row: { template: RowTemplate; photos: PhotoType[] }
  rowIdx: number
  onOpen: (p: PhotoType) => void
}) {
  if (row.photos[0].role === 'hero') {
    return (
      <HeroPause
        key={`row-${rowIdx}`}
        photo={row.photos[0]}
        onLightboxOpen={() => onOpen(row.photos[0])}
      />
    )
  }

  // row-3 becomes a 2+1 pair on small screens
  if (row.template === 'row-3') {
    return (
      <motion.div
        key={`row-${rowIdx}`}
        className="flex flex-col gap-1.5 md:gap-2 sm:contents"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.9, ease: [0.2, 0.6, 0.2, 1] }}
      >
        {/* Mobile: top pair + bottom single */}
        <div className="grid sm:hidden" style={{ gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <Photo photo={row.photos[0]} onClick={() => onOpen(row.photos[0])} style={{ aspectRatio: '1/1' }} />
          <Photo photo={row.photos[1]} onClick={() => onOpen(row.photos[1])} style={{ aspectRatio: '1/1' }} />
        </div>
        {row.photos[2] && (
          <div className="sm:hidden">
            <Photo photo={row.photos[2]} onClick={() => onOpen(row.photos[2])} style={{ aspectRatio: '3/2' }} />
          </div>
        )}
        {/* Desktop: all 3 in a row */}
        <div
          className="hidden sm:grid"
          style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}
        >
          {row.photos.map((photo, pi) => (
            <Photo key={photo.id} photo={photo} onClick={() => onOpen(photo)} style={{ aspectRatio: cellAspect['row-3'][pi] }} />
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      key={`row-${rowIdx}`}
      className="grid"
      style={{ gridTemplateColumns: rowCols[row.template], gap: '6px' }}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.9, ease: [0.2, 0.6, 0.2, 1] }}
    >
      {row.photos.map((photo, photoIdx) => (
        <Photo
          key={photo.id}
          photo={photo}
          onClick={() => onOpen(photo)}
          style={{ aspectRatio: cellAspect[row.template][photoIdx] }}
        />
      ))}
    </motion.div>
  )
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoType | null>(null)
  const rows = buildRows(photos)

  return (
    <section className="px-3 sm:px-6 py-4 sm:py-8">
      <div className="flex flex-col gap-1.5 md:gap-2">
        {rows.map((row, rowIdx) => (
          <MobileAwareRow
            key={rowIdx}
            row={row}
            rowIdx={rowIdx}
            onOpen={(p) => setLightboxPhoto(p)}
          />
        ))}
      </div>

      <Lightbox
        photo={lightboxPhoto}
        photos={photos}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={(p) => setLightboxPhoto(p)}
      />
    </section>
  )
}
