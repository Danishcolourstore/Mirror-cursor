export interface Photo {
  id: string
  url: string
  thumbUrl: string
  caption?: string
  role?: string
  aspect?: string
  favorited: boolean
  views: number
}
