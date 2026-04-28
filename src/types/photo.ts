export type PhotoAspect = 'portrait' | 'landscape' | 'square' | 'wide' | 'tall'
export type PhotoRole = 'establish' | 'build' | 'hero' | 'candid' | 'detail' | 'breath'

export type Photo = {
  id: string
  url: string
  thumbUrl?: string
  aspect: PhotoAspect
  role: PhotoRole
  caption?: string
  favorited: boolean
  views: number
}
