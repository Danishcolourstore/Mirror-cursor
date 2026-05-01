import { cn } from '../../lib/cn'
import ProgressiveImage from '../ui/ProgressiveImage'
import PhotoActions from './PhotoActions'
import type { Photo as PhotoType } from '../../types/photo'
import { galleryImageSrc, type GalleryImgPreset } from '../../lib/galleryImageUrl'

type PhotoProps = {
  photo: PhotoType
  onClick: () => void
  className?: string
  style?: React.CSSProperties
  imagePreset?: GalleryImgPreset
}

export default function Photo({
  photo,
  onClick,
  className,
  style,
  imagePreset = 'grid-desktop',
}: PhotoProps) {
  return (
    <div
      className={cn('relative cursor-zoom-in overflow-hidden group', className)}
      style={{
        ...style,
        contentVisibility: 'auto',
        containIntrinsicSize: '0 400px',
      }}
      onClick={onClick}
    >
      <ProgressiveImage src={galleryImageSrc(photo.url, imagePreset)} alt={photo.caption ?? ''} />

      <div className="absolute inset-0 bg-night/0 transition-opacity duration-300 group-hover:bg-night/15" />

      <PhotoActions photo={photo} />
    </div>
  )
}
