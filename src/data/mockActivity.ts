export type ActivityEntry = {
  id: string
  type: 'view' | 'favorite' | 'share' | 'chapter_unlock' | 'delivery' | 'comment'
  message: string
  detail?: string
  time: string
  eventSlug: string
  coupleName: string
}

export const mockActivity: ActivityEntry[] = [
  {
    id: 'act-001',
    type: 'view',
    message: 'Ananya opened the gallery',
    detail: 'Chapter III — The Wedding',
    time: '4 min ago',
    eventSlug: 'ananya-rohan',
    coupleName: 'Ananya & Rohan',
  },
  {
    id: 'act-002',
    type: 'favorite',
    message: 'Ananya favorited 3 photos',
    detail: 'The Mehendi chapter',
    time: '12 min ago',
    eventSlug: 'ananya-rohan',
    coupleName: 'Ananya & Rohan',
  },
  {
    id: 'act-003',
    type: 'share',
    message: 'Gallery link shared',
    detail: 'via WhatsApp — 2 views since',
    time: '38 min ago',
    eventSlug: 'ananya-rohan',
    coupleName: 'Ananya & Rohan',
  },
  {
    id: 'act-004',
    type: 'view',
    message: "Priya's mother opened the gallery",
    detail: 'Chapter I — The Sangeet',
    time: '1 hr ago',
    eventSlug: 'priya-arjun',
    coupleName: 'Priya & Arjun',
  },
  {
    id: 'act-005',
    type: 'chapter_unlock',
    message: 'Chapter II went live',
    detail: 'Priya & Arjun — The Pheras',
    time: '2 hr ago',
    eventSlug: 'priya-arjun',
    coupleName: 'Priya & Arjun',
  },
  {
    id: 'act-006',
    type: 'delivery',
    message: 'Album delivery confirmed',
    detail: 'Ananya & Rohan — 2 copies',
    time: 'Yesterday',
    eventSlug: 'ananya-rohan',
    coupleName: 'Ananya & Rohan',
  },
  {
    id: 'act-007',
    type: 'favorite',
    message: 'Rohan favorited 7 photos',
    detail: 'The Wedding chapter',
    time: 'Yesterday',
    eventSlug: 'ananya-rohan',
    coupleName: 'Ananya & Rohan',
  },
  {
    id: 'act-008',
    type: 'view',
    message: 'Meera opened the preview',
    detail: 'Mehendi teaser — 4 photos',
    time: '2 days ago',
    eventSlug: 'meera-vikram',
    coupleName: 'Meera & Vikram',
  },
]

export type DeliveryItem = {
  id: string
  eventId: string
  coupleName: string
  task: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'done' | 'overdue'
  isUrgent?: boolean
}

export const mockDeliveries: DeliveryItem[] = [
  {
    id: 'del-001',
    eventId: 'evt-002',
    coupleName: 'Priya & Arjun',
    task: 'Final edit — Chapter II delivery',
    dueDate: '2025-04-15',
    status: 'in-progress',
    isUrgent: true,
  },
  {
    id: 'del-002',
    eventId: 'evt-003',
    coupleName: 'Meera & Vikram',
    task: 'Mehendi chapter — first cull',
    dueDate: '2025-04-20',
    status: 'pending',
  },
  {
    id: 'del-003',
    eventId: 'evt-001',
    coupleName: 'Ananya & Rohan',
    task: 'Album layout — final approval',
    dueDate: '2025-04-18',
    status: 'pending',
    isUrgent: true,
  },
  {
    id: 'del-004',
    eventId: 'evt-004',
    coupleName: 'Kavya & Siddharth',
    task: 'Pre-wedding questionnaire',
    dueDate: '2025-04-25',
    status: 'pending',
  },
  {
    id: 'del-005',
    eventId: 'evt-002',
    coupleName: 'Priya & Arjun',
    task: 'Gallery password set & link sent',
    dueDate: '2025-04-12',
    status: 'done',
  },
]
