import type { Photo, PhotoAspect } from '../types/photo'

const MAX_WIDTH = 1400
const QUALITY = 0.78

const ratioToAspect = (w: number, h: number): PhotoAspect => {
  const r = w / h
  if (r > 1.6) return 'wide'
  if (r > 1.05) return 'landscape'
  if (r > 0.95) return 'square'
  if (r > 0.65) return 'portrait'
  return 'tall'
}

const loadImage = (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }
    img.onerror = (err) => {
      URL.revokeObjectURL(url)
      reject(err)
    }
    img.src = url
  })

const fileToResizedDataUrl = async (file: File): Promise<{ dataUrl: string; width: number; height: number }> => {
  const img = await loadImage(file)
  const scale = Math.min(1, MAX_WIDTH / img.width)
  const w = Math.round(img.width * scale)
  const h = Math.round(img.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Could not create canvas context')
  ctx.drawImage(img, 0, 0, w, h)

  return {
    dataUrl: canvas.toDataURL('image/jpeg', QUALITY),
    width: w,
    height: h,
  }
}

const SUPPORTED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
])

const isSupported = (file: File): boolean =>
  SUPPORTED_TYPES.has(file.type) || /\.(jpe?g|png|webp|avif)$/i.test(file.name)

export type UploadResult = {
  photos: Photo[]
  skipped: { name: string; reason: string }[]
}

export async function filesToPhotos(files: FileList | File[]): Promise<UploadResult> {
  const arr = Array.from(files)
  const photos: Photo[] = []
  const skipped: { name: string; reason: string }[] = []

  for (const file of arr) {
    if (!isSupported(file)) {
      skipped.push({ name: file.name, reason: 'Unsupported format' })
      continue
    }
    try {
      const { dataUrl, width, height } = await fileToResizedDataUrl(file)
      photos.push({
        id: `up-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: dataUrl,
        aspect: ratioToAspect(width, height),
        role: 'candid',
        favorited: false,
        views: 0,
      })
    } catch {
      skipped.push({ name: file.name, reason: 'Could not read file' })
    }
  }

  return { photos, skipped }
}
