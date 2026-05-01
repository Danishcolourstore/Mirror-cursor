import type { Photo } from './photo'

export type GalleryCoverSize = 'small' | 'medium' | 'fullscreen'
export type PhotoGridSpacing = 'tight' | 'normal' | 'loose'
export type PhotoGridCellScale = 'small' | 'medium' | 'large'

export type EventStatus = 'booked' | 'shooting' | 'editing' | 'delivered'
export type ChapterStatus = 'draft' | 'scheduled' | 'live' | 'locked'

export type Milestone = {
  id: string
  label: string
  done: boolean
  dueDate: string
  note: string
}

export type Chapter = {
  id: string
  number: number
  title: string
  caption: string
  coverImage: string
  status: ChapterStatus
  unlockDate?: string
  photos: Photo[]
}

export type Event = {
  id: string
  slug: string
  couple: {
    brideName: string
    groomName: string
  }
  date: {
    start: string
    end: string
  }
  venue: {
    city: string
    location: string
  }
  status: EventStatus
  progress: number
  coverImage: string
  directorsNote?: string
  closingQuote?: string
  chapters: Chapter[]
  client: {
    name: string
    phone: string
    email: string
  }
  package: {
    name: string
    price: number
    paid: number
  }
  milestones?: Milestone[]
  /** Public gallery: which photo URL to use as cover (defaults to coverImage / first hero). */
  galleryCoverPhotoId?: string | null
  /** Veil darkness 0–50 (%). */
  galleryCoverTintPct?: number
  galleryCoverSize?: GalleryCoverSize
  photoGridCellScale?: PhotoGridCellScale
  photoGridSpacing?: PhotoGridSpacing
  /** Initial music preference for this gallery (from studio defaults at event creation). */
  galleryMusicDefaultOn?: boolean
}
