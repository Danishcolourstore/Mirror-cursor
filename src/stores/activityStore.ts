import { create } from 'zustand'
import { mockActivity, type ActivityEntry } from '../data/mockActivity'

type ActivityStore = {
  feed: ActivityEntry[]
  addEntry: (entry: ActivityEntry) => void
  simulateTick: () => void
}

const simulatedEntries: Omit<ActivityEntry, 'id' | 'time'>[] = [
  {
    type: 'view',
    message: 'Someone opened the gallery',
    detail: 'Chapter I — The Mehendi',
    eventSlug: 'ananya-rohan',
    coupleName: 'Ananya & Rohan',
  },
  {
    type: 'favorite',
    message: 'Ananya favorited a photo',
    detail: 'The Wedding chapter',
    eventSlug: 'ananya-rohan',
    coupleName: 'Ananya & Rohan',
  },
  {
    type: 'view',
    message: 'Priya opened the gallery',
    detail: 'Chapter II — The Pheras',
    eventSlug: 'priya-arjun',
    coupleName: 'Priya & Arjun',
  },
  {
    type: 'share',
    message: 'Gallery link shared again',
    detail: 'via WhatsApp',
    eventSlug: 'ananya-rohan',
    coupleName: 'Ananya & Rohan',
  },
  {
    type: 'view',
    message: "Rohan's father opened the gallery",
    detail: 'Cover — Ananya & Rohan',
    eventSlug: 'ananya-rohan',
    coupleName: 'Ananya & Rohan',
  },
]

let simCounter = 0

export const useActivityStore = create<ActivityStore>((set) => ({
  feed: mockActivity,

  addEntry: (entry) =>
    set((state) => ({
      feed: [entry, ...state.feed].slice(0, 20),
    })),

  simulateTick: () => {
    const template = simulatedEntries[simCounter % simulatedEntries.length]
    simCounter++

    const newEntry: ActivityEntry = {
      ...template,
      id: `sim-${Date.now()}`,
      time: 'just now',
    }

    set((state) => ({
      feed: [newEntry, ...state.feed.map((e) =>
        e.time === 'just now' ? { ...e, time: '1 min ago' } : e
      )].slice(0, 20),
    }))
  },
}))
