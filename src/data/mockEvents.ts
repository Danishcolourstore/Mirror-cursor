import type { Event } from '../types/event'
import { mehendiphotos, haldiPhotos, weddingPhotos, priyaHaldiPhotos, priyaWeddingPhotos } from './mockPhotos'

export const mockEvents: Event[] = [
  {
    id: 'evt-001',
    slug: 'ananya-rohan',
    couple: {
      brideName: 'Ananya',
      groomName: 'Rohan',
    },
    date: {
      start: '2025-02-14',
      end: '2025-02-16',
    },
    venue: {
      city: 'Jaipur',
      location: 'Samode Palace',
    },
    status: 'delivered',
    progress: 100,
    coverImage: 'https://i.ibb.co/rGwn5grR/eea4dda1c6155fd114b1904896bef578.jpg',
    directorsNote:
      'Three days. Two families. One promise. This is Ananya and Rohan\'s wedding, captured in the soft February light of Jaipur — between marigolds, mirrors, and the quiet moments their families shared when no one was looking.',
    closingQuote:
      'And in that quiet between two ceremonies, we found the photograph we were waiting for.',
    chapters: [
      {
        id: 'ch-001-1',
        number: 1,
        title: 'The Mehendi',
        caption: '— laughter under marigolds, the morning the women gathered.',
        coverImage: 'https://i.ibb.co/nsBX4P1J/594acc97c78458ea88694ab3c6279a83.jpg',
        status: 'live',
        photos: mehendiphotos,
      },
      {
        id: 'ch-001-2',
        number: 2,
        title: 'The Haldi',
        caption: '— turmeric and morning light, the colour of arrival.',
        coverImage: 'https://i.ibb.co/NdvPWhsH/72b4316885dabdc5dd44d3d2c44d1e53.jpg',
        status: 'live',
        photos: haldiPhotos,
      },
      {
        id: 'ch-001-3',
        number: 3,
        title: 'The Wedding',
        caption: '— seven steps, one vow, and a fire that bore witness.',
        coverImage: 'https://i.ibb.co/XxsN6WJT/4187138aea363913712dddde8d862f35.jpg',
        status: 'live',
        photos: weddingPhotos,
      },
      {
        id: 'ch-001-4',
        number: 4,
        title: 'The Reception',
        caption: '— the after-glow, when the dancing began.',
        coverImage: 'https://i.ibb.co/rGwn5grR/eea4dda1c6155fd114b1904896bef578.jpg',
        status: 'scheduled',
        unlockDate: '2025-03-01',
        photos: [],
      },
    ],
    client: {
      name: 'Ananya Mehta',
      phone: '+91 98765 43210',
      email: 'ananya.mehta@gmail.com',
    },
    package: {
      name: 'Signature — Three Day Coverage',
      price: 1800000,
      paid: 1800000,
    },
  },
  {
    id: 'evt-002',
    slug: 'priya-arjun',
    couple: {
      brideName: 'Priya',
      groomName: 'Arjun',
    },
    date: {
      start: '2025-02-14',
      end: '2025-02-16',
    },
    venue: {
      city: 'Udaipur',
      location: 'Udaipur Palace',
    },
    status: 'delivered',
    progress: 100,
    coverImage: 'https://i.ibb.co/JwBVLRdL/imgi-24-dd6ae2d4c16511f0a4050a58a9feac02.webp',
    directorsNote:
      'Two days. Two families. One promise. This is Priya and Arjun\'s wedding, captured in the soft February light of Udaipur — between turmeric, marigolds, and the quiet moments their families shared when no one was looking.',
    closingQuote:
      'And in that quiet between two ceremonies, we found the photograph we were waiting for.',
    chapters: [
      {
        id: 'ch-002-1',
        number: 1,
        title: 'The Haldi',
        caption: '— turmeric and afternoon light, the colour of arrival.',
        coverImage: 'https://i.ibb.co/5WW16LCs/imgi-4-bb9b1608c16311f09e450a58a9feac02-Copy.webp',
        status: 'live',
        photos: priyaHaldiPhotos,
      },
      {
        id: 'ch-002-2',
        number: 2,
        title: 'The Wedding',
        caption: '— seven steps, one vow, and a fire that bore witness.',
        coverImage: 'https://i.ibb.co/JwBVLRdL/imgi-24-dd6ae2d4c16511f0a4050a58a9feac02.webp',
        status: 'live',
        photos: priyaWeddingPhotos,
      },
    ],
    client: {
      name: 'Priya Sharma',
      phone: '+91 91234 56789',
      email: 'priya.sharma@outlook.com',
    },
    package: {
      name: 'Heritage — Two Day Coverage',
      price: 1400000,
      paid: 1400000,
    },
  },
  {
    id: 'evt-003',
    slug: 'meera-vikram',
    couple: {
      brideName: 'Meera',
      groomName: 'Vikram',
    },
    date: {
      start: '2025-04-05',
      end: '2025-04-07',
    },
    venue: {
      city: 'Mumbai',
      location: 'The Taj Mahal Palace',
    },
    status: 'shooting',
    progress: 40,
    coverImage: 'https://i.ibb.co/mVggmtGq/bcae9ad60ffd56dc1fe8a402ac38cd57.jpg',
    chapters: [
      {
        id: 'ch-003-1',
        number: 1,
        title: 'The Mehendi',
        caption: '— salt air and saffron, a city on pause.',
        coverImage: 'https://i.ibb.co/nsBX4P1J/594acc97c78458ea88694ab3c6279a83.jpg',
        status: 'draft',
        photos: mehendiphotos.slice(0, 4),
      },
    ],
    client: {
      name: 'Meera Kapoor',
      phone: '+91 99887 76655',
      email: 'meera.kapoor@gmail.com',
    },
    package: {
      name: 'Prestige — Two Day Coverage',
      price: 1200000,
      paid: 600000,
    },
  },
  {
    id: 'evt-004',
    slug: 'kavya-siddharth',
    couple: {
      brideName: 'Kavya',
      groomName: 'Siddharth',
    },
    date: {
      start: '2025-05-18',
      end: '2025-05-19',
    },
    venue: {
      city: 'Goa',
      location: 'Fort Aguada',
    },
    status: 'booked',
    progress: 10,
    coverImage: 'https://i.ibb.co/Q3khkGst/420fc1440c57f9644beaf665b0ac6138.jpg',
    chapters: [],
    client: {
      name: 'Kavya Nair',
      phone: '+91 97654 32109',
      email: 'kavya.nair@icloud.com',
    },
    package: {
      name: 'Signature — Two Day Coverage',
      price: 1500000,
      paid: 750000,
    },
  },
  {
    id: 'evt-005',
    slug: 'isha-nikhil',
    couple: {
      brideName: 'Isha',
      groomName: 'Nikhil',
    },
    date: {
      start: '2025-06-08',
      end: '2025-06-09',
    },
    venue: {
      city: 'Delhi',
      location: 'The Leela Palace',
    },
    status: 'booked',
    progress: 5,
    coverImage: 'https://i.ibb.co/35FZZfLz/de65686e8c83bfcf39e4478fb32ab3a2.jpg',
    chapters: [],
    client: {
      name: 'Isha Verma',
      phone: '+91 98011 22334',
      email: 'isha.verma@gmail.com',
    },
    package: {
      name: 'Heritage — Single Day',
      price: 900000,
      paid: 450000,
    },
  },
]
