import { create } from 'zustand'

export type ToastTone = 'default' | 'success' | 'error' | 'bronze'

export type Toast = {
  id: string
  message: string
  detail?: string
  tone: ToastTone
}

type ToastStore = {
  toasts: Toast[]
  push: (msg: string, opts?: { detail?: string; tone?: ToastTone; duration?: number }) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  push: (message, opts = {}) => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
    const tone: ToastTone = opts.tone ?? 'default'
    const toast: Toast = { id, message, detail: opts.detail, tone }
    set((state) => ({ toasts: [...state.toasts, toast] }))
    const duration = opts.duration ?? 2800
    setTimeout(() => get().dismiss(id), duration)
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))
