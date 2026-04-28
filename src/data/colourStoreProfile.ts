/** Public studio profile — Polish 4 mock (Colour Store) */

export type PublicStudioRecentWedding = {
  slug: string
  coupleNames: string
  venueLocation: string
  city: string
  coverImage: string
}

export type PublicStudioProfile = {
  slug: string
  nameParts: [string, string]
  /** Wordmark line (displayed sans middot elsewhere if needed) */
  tagline: string
  bio: string
  email: string
  phone: string
  instagramHandle: string
  /** Full URL shown as link label */
  instagramUrl: string
  recentWeddings: PublicStudioRecentWedding[]
}

export const COLOUR_STORE_SLUG = 'colour-store'

export const colourStoreProfile: PublicStudioProfile = {
  slug: COLOUR_STORE_SLUG,
  nameParts: ['Colour', 'Store'],
  tagline: 'We photograph the quiet moments between the moments.',
  bio:
    'Colour Store is a fine-art wedding photography studio based in India. We work with families who believe the best photographs are the ones that feel like memory — not performance.',
  email: 'hello@colourstore.in',
  phone: '+91 98765 43120',
  instagramHandle: '@colourstore',
  instagramUrl: 'https://instagram.com/colourstore',
  recentWeddings: [
    {
      slug: 'ananya-rohan',
      coupleNames: 'Ananya & Rohan',
      venueLocation: 'Samode Palace',
      city: 'Jaipur',
      coverImage: 'https://i.ibb.co/rGwn5grR/eea4dda1c6155fd114b1904896bef578.jpg',
    },
    {
      slug: 'priya-arjun',
      coupleNames: 'Priya & Arjun',
      venueLocation: 'Taj Lake Palace',
      city: 'Udaipur',
      coverImage: 'https://i.ibb.co/JwBVLRdL/imgi-24-dd6ae2d4c16511f0a4050a58a9feac02.webp',
    },
    {
      slug: 'meera-vikram',
      coupleNames: 'Meera & Vikram',
      venueLocation: 'The Taj Mahal Palace',
      city: 'Mumbai',
      coverImage: 'https://i.ibb.co/mVggmtGq/bcae9ad60ffd56dc1fe8a402ac38cd57.jpg',
    },
  ],
}

export const publicStudioProfiles: Record<string, PublicStudioProfile> = {
  [COLOUR_STORE_SLUG]: colourStoreProfile,
}
