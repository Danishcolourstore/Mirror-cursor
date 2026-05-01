import { useQuery } from '@tanstack/react-query'

import { listPublicGalleries } from './galleryDataSource'
import { galleryKeys } from './types'

export function useGalleries() {
  return useQuery({
    queryKey: galleryKeys.list(),
    queryFn: listPublicGalleries,
    staleTime: 60_000,
  })
}
