import Lightbox from './Lightbox'
import type { Photo } from '../../types/photo'

type LightboxViewerProps = {
  photo: Photo | null
  photos: Photo[]
  onClose: () => void
  onNavigate: (photo: Photo) => void
}

export default function LightboxViewer({ photo, photos, onClose, onNavigate }: LightboxViewerProps) {
  return (
    <Lightbox
      photo={photo}
      photos={photos}
      onClose={onClose}
      onNavigate={onNavigate}
    />
  )
}
