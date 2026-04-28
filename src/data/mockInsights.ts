/** Polish 6 — Insights page mock analytics (no backend) */

export type DayPoint = { day: string; opens: number }

export const MOCK_ENGAGEMENT_30D: DayPoint[] = Array.from({ length: 30 }, (_, i) => {
  const d = i + 1
  const wave = Math.sin(d / 5) * 120 + 640 + (i % 7) * 18
  return { day: String(d).padStart(2, '0'), opens: Math.round(wave) }
})

export type TopWedding = {
  couple: string
  score: number
}

export const MOCK_TOP_WEDDINGS: TopWedding[] = [
  { couple: 'Ananya & Rohan', score: 9840 },
  { couple: 'Priya & Arjun', score: 8720 },
  { couple: 'Meera & Vikram', score: 6510 },
  { couple: 'Kavya & Siddharth', score: 4420 },
  { couple: 'Ishita & Dev', score: 3890 },
]

/** Family engagement — quiet bar labels */
export type FamilyBar = { segment: string; value: number }

export const MOCK_FAMILY_ENGAGEMENT: FamilyBar[] = [
  { segment: 'Immediate family', value: 72 },
  { segment: 'Extended family', value: 54 },
  { segment: 'Wedding party', value: 81 },
  { segment: 'Guests', value: 38 },
]

export const INSIGHTS_STATS = {
  totalGalleries: 12,
  opensThisMonth: 18420,
  mostLovedPhotoType: 'Portraits',
  avgEngagementPerGallery: 682,
} as const

/** 10 unique image URLs from existing mock library */
export const MOCK_LOVED_PHOTO_URLS: string[] = [
  'https://i.ibb.co/nsBX4P1J/594acc97c78458ea88694ab3c6279a83.jpg',
  'https://i.ibb.co/FbS0pZ5h/6c5cd7dadd2516783da834799d32990f.jpg',
  'https://i.ibb.co/gFwvM4Xq/308a304a8ec8b6b795599169974ceea2.jpg',
  'https://i.ibb.co/F4MZb65Y/1da53936542abd18fd715a5f64a2b398.jpg',
  'https://i.ibb.co/mVggmtGq/bcae9ad60ffd56dc1fe8a402ac38cd57.jpg',
  'https://i.ibb.co/rGwn5grR/eea4dda1c6155fd114b1904896bef578.jpg',
  'https://i.ibb.co/NdvPWhsH/72b4316885dabdc5dd44d3d2c44d1e53.jpg',
  'https://i.ibb.co/XxsN6WJT/4187138aea363913712dddde8d862f35.jpg',
  'https://i.ibb.co/5WW16LCs/imgi-4-bb9b1608c16311f09e450a58a9feac02-Copy.webp',
  'https://i.ibb.co/JwBVLRdL/imgi-24-dd6ae2d4c16511f0a4050a58a9feac02.webp',
]
