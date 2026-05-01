import { useMemo, useRef, useState } from 'react'
import CoverScreen from '../components/gallery/CoverScreen'
import CoupleReveal from '../components/gallery/CoupleReveal'
import StatsBar from '../components/gallery/StatsBar'
import DirectorsNote from '../components/gallery/DirectorsNote'
import PhotoGrid from '../components/gallery/PhotoGrid'
import Lightbox from '../components/gallery/Lightbox'
import ClosingScreen from '../components/gallery/ClosingScreen'
import type { Photo } from '../types/photo'
import '../styles/atmosphere.css'
import '../styles/typography.css'

type GalleryPhoto = {
  id: string
  src: string
  alt: string
  chapter: string
}

const FAVORITES_KEY = 'mirror-studio-favorites'

const PHOTOS: GalleryPhoto[] = [
  { id: 'p1', src: 'https://i.ibb.co/XfSz9DRc/wamiqagabbi-20260426-0015.jpg', alt: 'Wedding moment under soft light', chapter: 'Prelude' },
  { id: 'p2', src: 'https://i.ibb.co/2zfmqqz/wamiqagabbi-20260426-0016.jpg', alt: 'Ceremony detail with warm tones', chapter: 'Prelude' },
  { id: 'p3', src: 'https://i.ibb.co/cKM4nQwv/wamiqagabbi-20260426-0017.jpg', alt: 'Wedding portrait in natural glow', chapter: 'Prelude' },
  { id: 'p4', src: 'https://i.ibb.co/qMRWD55D/wamiqagabbi-20260426-0018.jpg', alt: 'Bridal style detail during preparations', chapter: 'Prelude' },
  { id: 'p5', src: 'https://i.ibb.co/wZnb1hjL/wamiqagabbi-20260426-0014.jpg', alt: 'Family interaction before the ceremony', chapter: 'Prelude' },
  { id: 'p6', src: 'https://i.ibb.co/CsmnWrTY/wamiqagabbi-20260426-0013.jpg', alt: 'Editorial wedding close-up', chapter: 'Prelude' },
  { id: 'p7', src: 'https://i.ibb.co/GffxYzJs/wamiqagabbi-20260426-0010.jpg', alt: 'Traditional ceremony frame', chapter: 'Prelude' },
  { id: 'p8', src: 'https://i.ibb.co/1GnGZKnS/wamiqagabbi-20260426-0011.jpg', alt: 'Candid smile during rituals', chapter: 'Prelude' },
  { id: 'p9', src: 'https://i.ibb.co/Zpc7ZGvK/wamiqagabbi-20260426-0012.jpg', alt: 'Wedding fashion portrait', chapter: 'Prelude' },
  { id: 'p10', src: 'https://i.ibb.co/LK89dzZ/wamiqagabbi-20260426-0006.jpg', alt: 'Bride and groom silhouette moment', chapter: 'Prelude' },
  { id: 'p11', src: 'https://i.ibb.co/svrBWbf1/wamiqagabbi-20260426-0007.jpg', alt: 'Ceremony entrance atmosphere', chapter: 'Prelude' },
  { id: 'p12', src: 'https://i.ibb.co/N20fySDV/wamiqagabbi-20260426-0008.jpg', alt: 'Wedding venue detail shot', chapter: 'Prelude' },
  { id: 'p13', src: 'https://i.ibb.co/G4SVQfXc/wamiqagabbi-20260426-0009.jpg', alt: 'Elegant candid wedding frame', chapter: 'Prelude' },
  { id: 'p14', src: 'https://i.ibb.co/1tnXDH8N/wamiqagabbi-20260426-0003.jpg', alt: 'Hands and jewelry ceremony detail', chapter: 'Vows' },
  { id: 'p15', src: 'https://i.ibb.co/MywxsMzD/wamiqagabbi-20260426-0004.jpg', alt: 'Blessing ritual wedding moment', chapter: 'Vows' },
  { id: 'p16', src: 'https://i.ibb.co/ZRFL520Y/wamiqagabbi-20260426-0021.jpg', alt: 'Sacred vows exchange portrait', chapter: 'Vows' },
  { id: 'p17', src: 'https://i.ibb.co/xSWznfbV/wamiqagabbi-20260426-0022.jpg', alt: 'Guests watching ceremony with joy', chapter: 'Vows' },
  { id: 'p18', src: 'https://i.ibb.co/PL1PZSx/wamiqagabbi-20260426-0023.jpg', alt: 'Ceremonial close-up in golden color', chapter: 'Vows' },
  { id: 'p19', src: 'https://i.ibb.co/qM57XsFm/wamiqagabbi-20260426-0020.jpg', alt: 'Exchange of vows candid frame', chapter: 'Vows' },
  { id: 'p20', src: 'https://i.ibb.co/23TXvWtw/wamiqagabbi-20260426-0019.jpg', alt: 'Wedding aisle composition', chapter: 'Vows' },
  { id: 'p21', src: 'https://i.ibb.co/fdJ0Zy38/vogaweddings-20260418-0032.jpg', alt: 'Portrait after ceremony vows', chapter: 'Vows' },
  { id: 'p22', src: 'https://i.ibb.co/wZdby8bZ/vogaweddings-20260418-0031.jpg', alt: 'Bride portrait by temple light', chapter: 'Vows' },
  { id: 'p23', src: 'https://i.ibb.co/j94J5KB1/vogaweddings-20260418-0028.jpg', alt: 'Wedding laugh between family members', chapter: 'Vows' },
  { id: 'p24', src: 'https://i.ibb.co/Mykt41ps/vogaweddings-20260418-0029.jpg', alt: 'Ritual detail with floral colors', chapter: 'Vows' },
  { id: 'p25', src: 'https://i.ibb.co/SDYCFhfM/vogaweddings-20260418-0027.jpg', alt: 'Candid ring and hand detail', chapter: 'Vows' },
  { id: 'p26', src: 'https://i.ibb.co/bj0xZ9hZ/vogaweddings-20260418-0025.jpg', alt: 'Wedding blessing portrait', chapter: 'Vows' },
  { id: 'p27', src: 'https://i.ibb.co/NnSFzNYq/vogaweddings-20260418-0026.jpg', alt: 'Sunlit outdoor wedding portrait', chapter: 'Golden Hour' },
  { id: 'p28', src: 'https://i.ibb.co/Xf9x8Vzz/vogaweddings-20260418-0022.jpg', alt: 'Golden hour ceremony silhouette', chapter: 'Golden Hour' },
  { id: 'p29', src: 'https://i.ibb.co/pvZHk2PV/vogaweddings-20260418-0023.jpg', alt: 'Bride and groom walk candid', chapter: 'Golden Hour' },
  { id: 'p30', src: 'https://i.ibb.co/DD9kxs1y/vogaweddings-20260418-0024.jpg', alt: 'Warm sunset portrait composition', chapter: 'Golden Hour' },
  { id: 'p31', src: 'https://i.ibb.co/jvbLGynQ/vogaweddings-20260418-0019.jpg', alt: 'Wedding couple profile detail', chapter: 'Golden Hour' },
  { id: 'p32', src: 'https://i.ibb.co/8Gd1Pff/vogaweddings-20260418-0020.jpg', alt: 'Ceremony garland close-up', chapter: 'Golden Hour' },
  { id: 'p33', src: 'https://i.ibb.co/0yhCZkKX/vogaweddings-20260418-0021.jpg', alt: 'Soft light editorial wedding frame', chapter: 'Golden Hour' },
  { id: 'p34', src: 'https://i.ibb.co/1YwcK8dB/vogaweddings-20260418-0018.jpg', alt: 'Couple movement during golden hour', chapter: 'Golden Hour' },
  { id: 'p35', src: 'https://i.ibb.co/yFsPp3Lq/vogaweddings-20260418-0015.jpg', alt: 'Bridal portrait in evening light', chapter: 'Golden Hour' },
  { id: 'p36', src: 'https://i.ibb.co/6R5HqL13/vogaweddings-20260418-0016.jpg', alt: 'Ceremony smile and laughter', chapter: 'Golden Hour' },
  { id: 'p37', src: 'https://i.ibb.co/SwkwphQ1/vogaweddings-20260418-0017.jpg', alt: 'Traditional attire detail shot', chapter: 'Golden Hour' },
  { id: 'p38', src: 'https://i.ibb.co/jPjK3HLB/vogaweddings-20260418-0012.jpg', alt: 'Wedding portrait with dramatic framing', chapter: 'Golden Hour' },
  { id: 'p39', src: 'https://i.ibb.co/pvwHkxS7/vogaweddings-20260418-0013.jpg', alt: 'Ceremony prayer candid', chapter: 'Golden Hour' },
  { id: 'p40', src: 'https://i.ibb.co/npmXDHS/vogaweddings-20260418-0014.jpg', alt: 'Bride expression close-up', chapter: 'Reception' },
  { id: 'p41', src: 'https://i.ibb.co/fd2k2HF9/vogaweddings-20260418-0011.jpg', alt: 'Couple portrait before reception', chapter: 'Reception' },
  { id: 'p42', src: 'https://i.ibb.co/bgHpm9N2/vogaweddings-20260418-0010.jpg', alt: 'Reception hall detail shot', chapter: 'Reception' },
  { id: 'p43', src: 'https://i.ibb.co/G4bYYY7N/vogaweddings-20260418-0008.jpg', alt: 'Dance floor wedding moment', chapter: 'Reception' },
  { id: 'p44', src: 'https://i.ibb.co/Y7fVWVxy/vogaweddings-20260418-0009.jpg', alt: 'Guests celebrating at reception', chapter: 'Reception' },
  { id: 'p45', src: 'https://i.ibb.co/Kcn7cwNN/vogaweddings-20260418-0005.jpg', alt: 'Cake and decor detail frame', chapter: 'Reception' },
  { id: 'p46', src: 'https://i.ibb.co/DDfQmSr7/vogaweddings-20260418-0006.jpg', alt: 'Evening portrait with festive lights', chapter: 'Reception' },
  { id: 'p47', src: 'https://i.ibb.co/MynDXLsn/vogaweddings-20260418-0007.jpg', alt: 'Reception candid with friends', chapter: 'Reception' },
  { id: 'p48', src: 'https://i.ibb.co/KjKwx3Zc/vogaweddings-20260418-0004.jpg', alt: 'Wedding toast and applause moment', chapter: 'Reception' },
  { id: 'p49', src: 'https://i.ibb.co/PvbFMhVD/vogaweddings-20260418-0001.jpg', alt: 'Night portrait wedding finale', chapter: 'Reception' },
  { id: 'p50', src: 'https://i.ibb.co/JWLnb58h/vogaweddings-20260418-0002.jpg', alt: 'Final celebration frame', chapter: 'Reception' },
  { id: 'p51', src: 'https://i.ibb.co/bMXgtvfc/thehouseontheclouds-20260417-0058.jpg', alt: 'Closing wedding moment', chapter: 'Reception' },
]

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY)
    if (!raw) return new Set<string>()
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set<string>()
    return new Set(parsed.filter((item): item is string => typeof item === 'string'))
  } catch {
    return new Set<string>()
  }
}

function toLightboxPhoto(photo: GalleryPhoto): Photo {
  return {
    id: photo.id,
    url: photo.src,
    thumbUrl: photo.src,
    caption: photo.alt,
    role: 'candid',
    aspect: 'portrait',
    favorited: false,
    views: 0,
  }
}

export default function GuestGalleryPage() {
  const [showCover, setShowCover] = useState(true)
  const [showCoupleReveal, setShowCoupleReveal] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(() => readFavorites())
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const endSentinelRef = useRef<HTMLDivElement | null>(null)

  const lightboxPhotos = useMemo(() => PHOTOS.map((photo) => toLightboxPhoto(photo)), [])
  const currentLightboxPhoto = lightboxIndex !== null ? lightboxPhotos[lightboxIndex] : null

  const persistFavorites = (next: Set<string>) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(next)))
    setFavorites(next)
  }

  const toggleFavorite = (photoId: string) => {
    const next = new Set(favorites)
    if (next.has(photoId)) next.delete(photoId)
    else next.add(photoId)
    persistFavorites(next)
  }

  const handleCoverComplete = () => {
    setShowCover(false)
    setShowCoupleReveal(true)
  }

  const handleSkipToGrid = () => {
    const target = document.getElementById('photo-grid')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-white">
      {showCover && (
        <CoverScreen
          images={PHOTOS.slice(0, 3).map((photo) => photo.src)}
          onComplete={handleCoverComplete}
          onSkipToGrid={handleSkipToGrid}
        />
      )}

      {showCoupleReveal && (
        <CoupleReveal onComplete={() => setShowCoupleReveal(false)} />
      )}

      <main className="relative z-10">
        <section className="px-6 pb-16 pt-28 md:px-14 md:pt-36">
          <p className="type-label-active">Mirror Studio Guest Gallery</p>
          <h1 className="type-display mt-6 max-w-4xl text-white">
            Aarav <span className="text-[#C9A96E]">&</span> Priya
          </h1>
          <p className="type-label mt-8">14 FEBRUARY 2026 · KERALA, INDIA</p>
        </section>

        <StatsBar photos={1247} chapters={4} guests={142} />

        <DirectorsNote note="To witness love is to witness light finding its shape. Every frame in this collection is held in warmth, laughter, and the quiet pauses between vows. Thank you for bringing your hearts into this day." />

        <PhotoGrid
          photos={PHOTOS}
          favoritedIds={favorites}
          onToggleFavorite={toggleFavorite}
          onPhotoOpen={setLightboxIndex}
          endSentinelRef={endSentinelRef}
        />

        <ClosingScreen
          triggerRef={endSentinelRef}
          coupleNames="Aarav & Priya"
          dateLabel="14 FEBRUARY 2026"
        />
      </main>

      <Lightbox
        photo={currentLightboxPhoto}
        photos={lightboxPhotos}
        onClose={() => setLightboxIndex(null)}
        onNavigate={(nextPhoto) => {
          const nextIndex = lightboxPhotos.findIndex((photo) => photo.id === nextPhoto.id)
          if (nextIndex >= 0) setLightboxIndex(nextIndex)
        }}
        onToggleFavorite={toggleFavorite}
        isFavorited={(photoId) => favorites.has(photoId)}
      />
    </div>
  )
}
