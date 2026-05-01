import { useQuery } from '@tanstack/react-query'

import { fetchLiveGalleryBySlug } from './galleryDataSource'
import { galleryKeys } from './types'

export function useLivePhotos(slug: string | undefined) {
  const key = slug?.trim() ?? ''

  return useQuery({
    queryKey: galleryKeys.liveBySlug(key),
    queryFn: () => fetchLiveGalleryBySlug(key),
    enabled: key.length > 0,
    staleTime: 60_000,
  })
}
