import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEventsStore } from '../../stores/eventsStore'
import { useToastStore } from '../../stores/toastStore'
import { cn } from '../../lib/cn'
import type { Event, EventStatus } from '../../types/event'

type NewEventDrawerProps = {
  open: boolean
  onClose: () => void
}

type FormState = {
  brideName: string
  groomName: string
  dateStart: string
  dateEnd: string
  city: string
  location: string
  status: EventStatus
  clientName: string
  clientPhone: string
  clientEmail: string
  packageName: string
  packagePrice: string
  packagePaid: string
}

const initialForm: FormState = {
  brideName: '',
  groomName: '',
  dateStart: '',
  dateEnd: '',
  city: '',
  location: '',
  status: 'booked',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  packageName: 'Classic',
  packagePrice: '',
  packagePaid: '',
}

const PACKAGES = ['Classic', 'Premium', 'Signature', 'Cinematic', 'Custom']
const STATUSES: { value: EventStatus; label: string }[] = [
  { value: 'booked', label: 'Booked' },
  { value: 'shooting', label: 'Shooting' },
  { value: 'editing', label: 'Editing' },
  { value: 'delivered', label: 'Delivered' },
]

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="font-sans text-[11px] uppercase text-whisper" style={{ letterSpacing: '0.16em' }}>
        {label}{required && <span className="text-bronze ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full bg-canvas border border-muted px-3 py-2.5 font-sans text-sm text-ink placeholder:text-whisper/50 outline-none focus:border-bronze-soft transition-colors duration-400'

export default function NewEventDrawer({ open, onClose }: NewEventDrawerProps) {
  const [form, setForm] = useState<FormState>(initialForm)
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitted, setSubmitted] = useState(false)
  const { addEvent } = useEventsStore()
  const pushToast = useToastStore((s) => s.push)
  const navigate = useNavigate()

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleClose = () => {
    onClose()
    setTimeout(() => {
      setForm(initialForm)
      setStep(1)
      setSubmitted(false)
    }, 400)
  }

  const toSlug = (bride: string, groom: string) =>
    `${bride}-${groom}`.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleSubmit = () => {
    const slug = toSlug(form.brideName, form.groomName)
    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      slug,
      couple: { brideName: form.brideName, groomName: form.groomName },
      date: { start: form.dateStart, end: form.dateEnd || form.dateStart },
      venue: { city: form.city, location: form.location },
      status: form.status,
      progress: form.status === 'delivered' ? 100 : form.status === 'editing' ? 60 : form.status === 'shooting' ? 30 : 10,
      coverImage: 'https://i.ibb.co/rGwn5grR/eea4dda1c6155fd114b1904896bef578.jpg',
      chapters: [],
      client: {
        name: form.clientName,
        phone: form.clientPhone,
        email: form.clientEmail,
      },
      package: {
        name: form.packageName,
        price: Number(form.packagePrice) || 0,
        paid: Number(form.packagePaid) || 0,
      },
    }
    addEvent(newEvent)
    setSubmitted(true)
    pushToast(`${newEvent.couple.brideName} \u0026 ${newEvent.couple.groomName} added`, {
      detail: 'Event workspace ready.',
      tone: 'bronze',
    })
    setTimeout(() => {
      handleClose()
      navigate(`/studio/events/${newEvent.id}`)
    }, 1600)
  }

  const canNext1 = form.brideName && form.groomName && form.dateStart && form.city
  const canNext2 = form.clientName && form.clientEmail
  const canSubmit = canNext1 && canNext2

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-night/30"
            style={{ backdropFilter: 'blur(3px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] flex flex-col"
            style={{ background: '#FFFFFF', borderLeft: '1px solid #E8E8E8' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: [0.2, 0.6, 0.2, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-muted shrink-0">
              <div>
                <h2 className="serif font-light text-ink" style={{ fontSize: '20px', letterSpacing: '-0.02em' }}>
                  New <em className="text-bronze" style={{ fontStyle: 'italic' }}>wedding</em>
                </h2>
                <p className="font-sans text-[11px] text-whisper mt-0.5">
                  Step {step} of 3 — {step === 1 ? 'Event details' : step === 2 ? 'Client info' : 'Package'}
                </p>
              </div>
              <button
                onClick={handleClose}
                className="p-2 text-whisper hover:text-ink transition-colors duration-400"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex border-b border-muted shrink-0">
              {[1, 2, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => s < step && setStep(s as 1 | 2 | 3)}
                  className={cn(
                    'flex-1 h-1 transition-colors duration-400',
                    s <= step ? 'bg-bronze' : 'bg-muted'
                  )}
                />
              ))}
            </div>

            {/* Success state */}
            {submitted ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <motion.div
                  className="w-12 h-12 bg-sage/10 flex items-center justify-center"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, ease: [0.2, 0.6, 0.2, 1] }}
                >
                  <Check size={22} strokeWidth={1.5} className="text-sage" />
                </motion.div>
                <p className="serif font-light text-ink text-lg">Event created.</p>
                <p className="font-sans text-sm text-whisper">Opening workspace…</p>
              </div>
            ) : (
              <>
                {/* Form body */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">

                  {/* Step 1: Event */}
                  {step === 1 && (
                    <motion.div
                      className="space-y-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Bride's name" required>
                          <input className={inputClass} placeholder="Ananya" value={form.brideName} onChange={set('brideName')} />
                        </Field>
                        <Field label="Groom's name" required>
                          <input className={inputClass} placeholder="Rohan" value={form.groomName} onChange={set('groomName')} />
                        </Field>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Start date" required>
                          <input type="date" className={inputClass} value={form.dateStart} onChange={set('dateStart')} />
                        </Field>
                        <Field label="End date">
                          <input type="date" className={inputClass} value={form.dateEnd} onChange={set('dateEnd')} />
                        </Field>
                      </div>

                      <Field label="City" required>
                        <input className={inputClass} placeholder="Jaipur" value={form.city} onChange={set('city')} />
                      </Field>

                      <Field label="Venue / location">
                        <input className={inputClass} placeholder="Samode Palace" value={form.location} onChange={set('location')} />
                      </Field>

                      <Field label="Status">
                        <select className={inputClass} value={form.status} onChange={set('status')}>
                          {STATUSES.map((s) => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </Field>

                      {form.brideName && form.groomName && (
                        <p className="font-sans text-[11px] text-whisper">
                          Gallery URL: <span className="text-bronze">/g/{toSlug(form.brideName, form.groomName)}</span>
                        </p>
                      )}
                    </motion.div>
                  )}

                  {/* Step 2: Client */}
                  {step === 2 && (
                    <motion.div
                      className="space-y-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <Field label="Primary contact name" required>
                        <input className={inputClass} placeholder="Priya Sharma" value={form.clientName} onChange={set('clientName')} />
                      </Field>
                      <Field label="Email" required>
                        <input type="email" className={inputClass} placeholder="priya@example.com" value={form.clientEmail} onChange={set('clientEmail')} />
                      </Field>
                      <Field label="Phone">
                        <input type="tel" className={inputClass} placeholder="+91 98765 43210" value={form.clientPhone} onChange={set('clientPhone')} />
                      </Field>
                    </motion.div>
                  )}

                  {/* Step 3: Package */}
                  {step === 3 && (
                    <motion.div
                      className="space-y-5"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35 }}
                    >
                      <Field label="Package">
                        <select className={inputClass} value={form.packageName} onChange={set('packageName')}>
                          {PACKAGES.map((p) => <option key={p}>{p}</option>)}
                        </select>
                      </Field>
                      <Field label="Package price (₹)">
                        <input type="number" className={inputClass} placeholder="200000" value={form.packagePrice} onChange={set('packagePrice')} />
                      </Field>
                      <Field label="Amount received (₹)">
                        <input type="number" className={inputClass} placeholder="100000" value={form.packagePaid} onChange={set('packagePaid')} />
                      </Field>

                      {form.packagePrice && form.packagePaid && (
                        <div className="border border-muted p-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="font-sans text-sm text-whisper">Total</span>
                            <span className="serif font-light text-ink">₹{Number(form.packagePrice).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-sans text-sm text-whisper">Received</span>
                            <span className="serif font-light text-sage">₹{Number(form.packagePaid).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between border-t border-muted pt-2">
                            <span className="font-sans text-sm text-whisper">Pending</span>
                            <span className="serif font-light text-rose">
                              ₹{(Number(form.packagePrice) - Number(form.packagePaid)).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Footer actions */}
                <div className="px-6 py-5 border-t border-muted flex items-center justify-between shrink-0 gap-3">
                  {step > 1 ? (
                    <button
                      onClick={() => setStep((s) => (s - 1) as 1 | 2 | 3)}
                      className="btn-ghost"
                    >
                      Back
                    </button>
                  ) : (
                    <button onClick={handleClose} className="btn-ghost">Cancel</button>
                  )}

                  {step < 3 ? (
                    <button
                      onClick={() => setStep((s) => (s + 1) as 1 | 2 | 3)}
                      disabled={step === 1 ? !canNext1 : !canNext2}
                      className={cn('btn-ink', (!canNext1 && step === 1) || (!canNext2 && step === 2) ? 'opacity-40 cursor-not-allowed' : '')}
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={!canSubmit}
                      className={cn('btn-ink', !canSubmit ? 'opacity-40 cursor-not-allowed' : '')}
                    >
                      Create Event
                    </button>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
