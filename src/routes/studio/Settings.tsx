import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { useStudioStore, type StudioProfile } from '../../stores/studioStore'
import { useSettingsStore } from '../../stores/settingsStore'
import { useToastStore } from '../../stores/toastStore'
import { cn } from '../../lib/cn'

type SettingsTab = 'profile' | 'gallery' | 'notifications' | 'billing'

const tabs: { id: SettingsTab; label: string }[] = [
  { id: 'profile', label: 'Studio Profile' },
  { id: 'gallery', label: 'Gallery Defaults' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing' },
]

function Field({
  label,
  value,
  onChange,
  type = 'text',
  hint,
}: {
  label: string
  value: string
  onChange?: (v: string) => void
  type?: string
  hint?: string
}) {
  return (
    <div>
      <label className="block font-sans text-[11px] uppercase text-whisper mb-2" style={{ letterSpacing: '0.18em' }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        readOnly={!onChange}
        className={cn(
          'w-full font-sans text-[14px] text-ink bg-canvas border border-muted px-4 py-2.5 outline-none transition-colors duration-400',
          onChange
            ? 'focus:border-bronze/50 cursor-text'
            : 'text-whisper cursor-default bg-canvas-deep'
        )}
      />
      {hint && <p className="font-sans text-[11px] text-whisper/60 mt-1.5">{hint}</p>}
    </div>
  )
}

function Toggle({ label, hint, value, onChange }: {
  label: string
  hint?: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 px-5 border-b border-muted last:border-0">
      <div>
        <p className="font-sans text-[13px] text-ink">{label}</p>
        {hint && <p className="font-sans text-[11px] text-whisper mt-0.5">{hint}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={cn(
          'relative shrink-0 w-10 h-5 transition-colors duration-400',
          value ? 'bg-ink' : 'bg-muted'
        )}
        aria-pressed={value}
      >
        <span
          className={cn(
            'absolute top-0.5 w-4 h-4 bg-canvas transition-transform duration-400',
            value ? 'translate-x-5' : 'translate-x-0.5'
          )}
        />
      </button>
    </div>
  )
}

export default function Settings() {
  const studioProfile = useStudioStore()
  const updateProfile = useStudioStore((s) => s.updateProfile)
  const { gallery, notifications, updateGallery, updateNotifications } = useSettingsStore()
  const pushToast = useToastStore((s) => s.push)
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')

  // Local profile draft so users can edit then save
  const [draft, setDraft] = useState<StudioProfile>({
    studioName: studioProfile.studioName,
    ownerName: studioProfile.ownerName,
    ownerRole: studioProfile.ownerRole,
    email: studioProfile.email,
    phone: studioProfile.phone,
    city: studioProfile.city,
    instagram: studioProfile.instagram,
    website: studioProfile.website,
    tagline: studioProfile.tagline,
  })

  // Re-sync draft when store changes underneath (e.g. on rehydrate)
  useEffect(() => {
    setDraft({
      studioName: studioProfile.studioName,
      ownerName: studioProfile.ownerName,
      ownerRole: studioProfile.ownerRole,
      email: studioProfile.email,
      phone: studioProfile.phone,
      city: studioProfile.city,
      instagram: studioProfile.instagram,
      website: studioProfile.website,
      tagline: studioProfile.tagline,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    studioProfile.studioName, studioProfile.ownerName, studioProfile.ownerRole,
    studioProfile.email, studioProfile.phone, studioProfile.city,
    studioProfile.instagram, studioProfile.website, studioProfile.tagline,
  ])

  const set = (key: keyof StudioProfile) => (v: string) =>
    setDraft((f) => ({ ...f, [key]: v }))

  const isDirty =
    activeTab === 'profile' &&
    (draft.studioName !== studioProfile.studioName ||
      draft.ownerName !== studioProfile.ownerName ||
      draft.ownerRole !== studioProfile.ownerRole ||
      draft.email !== studioProfile.email ||
      draft.phone !== studioProfile.phone ||
      draft.city !== studioProfile.city ||
      draft.instagram !== studioProfile.instagram ||
      draft.website !== studioProfile.website ||
      draft.tagline !== studioProfile.tagline)

  const saveProfile = () => {
    updateProfile(draft)
    pushToast('Studio profile saved', { detail: 'Updates flow into every gallery.', tone: 'success' })
  }

  const handleSave = () => {
    if (activeTab === 'profile') {
      if (isDirty) saveProfile()
      else pushToast('No changes to save', { tone: 'default' })
    } else if (activeTab === 'gallery' || activeTab === 'notifications') {
      pushToast('Preferences saved', { tone: 'success' })
    } else {
      pushToast('Manage billing in your invoicing portal', { tone: 'default' })
    }
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-canvas pb-24 lg:pb-0">

      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-4 border-b border-muted bg-canvas sticky top-0 z-10">
        <div className="flex-1 flex items-center gap-3">
          {isDirty && (
            <span className="font-sans text-[11px] text-bronze uppercase" style={{ letterSpacing: '0.18em' }}>
              Unsaved changes
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          className={cn('btn-ink flex items-center gap-2', activeTab === 'profile' && !isDirty && 'opacity-60')}
        >
          <Check size={11} strokeWidth={2} />
          <span>Save changes</span>
        </button>
      </div>

      {/* Header */}
      <div className="px-8 pt-10 pb-6">
        <h1 className="serif font-light text-ink" style={{ fontSize: '36px', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
          Studio <em className="text-bronze" style={{ fontStyle: 'italic' }}>Settings</em>
        </h1>
      </div>

      {/* Tab nav */}
      <div className="border-b border-muted px-8 flex items-center gap-0 mb-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'font-sans text-[11px] uppercase px-4 py-3 border-b-2 shrink-0 transition-colors duration-400',
              activeTab === tab.id ? 'border-ink text-ink' : 'border-transparent text-whisper hover:text-ink-soft'
            )}
            style={{ letterSpacing: '0.18em' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-8 pb-10 max-w-2xl">

        {activeTab === 'profile' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <Field label="Studio Name" value={draft.studioName} onChange={set('studioName')} />
              <Field label="Your Name" value={draft.ownerName} onChange={set('ownerName')} />
            </div>
            <Field label="Role / Title" value={draft.ownerRole} onChange={set('ownerRole')} />
            <div className="grid grid-cols-2 gap-5">
              <Field label="Email" value={draft.email} onChange={set('email')} type="email" />
              <Field label="Phone" value={draft.phone} onChange={set('phone')} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <Field label="Base City" value={draft.city} onChange={set('city')} />
              <Field label="Instagram" value={draft.instagram} onChange={set('instagram')} />
            </div>
            <Field label="Website" value={draft.website} onChange={set('website')} />
            <Field
              label="Gallery Tagline"
              value={draft.tagline}
              onChange={set('tagline')}
              hint="Shown as eyebrow text on every client gallery cover."
            />

            {/* Brand preview */}
            <div className="mt-6 pt-6 border-t border-muted">
              <p className="font-sans text-[10px] uppercase text-whisper mb-4" style={{ letterSpacing: '0.18em' }}>
                Brand mark preview
              </p>
              <div className="bg-canvas-deep border border-muted px-6 py-5 inline-block">
                <span className="serif font-normal text-[17px] tracking-tight text-ink">
                  {draft.studioName.split(' ')[0]}
                  <em className="text-bronze font-normal" style={{ fontStyle: 'italic' }}>·</em>
                  {draft.studioName.split(' ').slice(1).join(' ') || 'Studio'}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="border border-muted divide-y divide-muted">
            <Toggle
              label="Watermark photos"
              hint="Adds a subtle studio watermark to all gallery images."
              value={gallery.watermark}
              onChange={(v) => { updateGallery({ watermark: v }); pushToast(v ? 'Watermark on' : 'Watermark off', { tone: 'default' }) }}
            />
            <Toggle
              label="Allow photo downloads"
              hint="Clients can download full-resolution files."
              value={gallery.downloadEnabled}
              onChange={(v) => { updateGallery({ downloadEnabled: v }); pushToast(v ? 'Downloads enabled' : 'Downloads disabled', { tone: 'default' }) }}
            />
            <Toggle
              label="Password protect by default"
              hint="All new galleries require a password to view."
              value={gallery.passwordProtect}
              onChange={(v) => { updateGallery({ passwordProtect: v }); pushToast(v ? 'New galleries will require a password' : 'New galleries will be public', { tone: 'default' }) }}
            />
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="border border-muted divide-y divide-muted">
            <Toggle
              label="Chapter unlock notifications"
              hint="Notify you when a scheduled chapter goes live."
              value={notifications.chapterNotifs}
              onChange={(v) => updateNotifications({ chapterNotifs: v })}
            />
            <Toggle
              label="View alerts"
              hint="Get notified when a client opens their gallery."
              value={notifications.viewAlerts}
              onChange={(v) => updateNotifications({ viewAlerts: v })}
            />
            <Toggle
              label="Favorite alerts"
              hint="Get notified when a client favorites a photo."
              value={notifications.favoriteAlerts}
              onChange={(v) => updateNotifications({ favoriteAlerts: v })}
            />
            <Toggle
              label="Weekly digest"
              hint="A summary of gallery activity every Monday."
              value={notifications.weeklyDigest}
              onChange={(v) => updateNotifications({ weeklyDigest: v })}
            />
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-5">
            <div className="border border-muted bg-canvas-deep p-5">
              <p className="font-sans text-[10px] uppercase text-whisper mb-1" style={{ letterSpacing: '0.18em' }}>
                Current plan
              </p>
              <p className="serif font-normal text-ink text-lg mt-2">Mirror Studio — <em className="text-bronze" style={{ fontStyle: 'italic' }}>Pro</em></p>
              <p className="font-sans text-[12px] text-whisper mt-1">₹4,999 / month · Renews 1 June 2025</p>
            </div>
            <div className="border border-muted bg-canvas-deep p-5">
              <p className="font-sans text-[10px] uppercase text-whisper mb-3" style={{ letterSpacing: '0.18em' }}>
                Usage
              </p>
              {[
                { label: 'Galleries', used: 5, limit: 'Unlimited' },
                { label: 'Storage', used: 12, limit: '100 GB', suffix: 'GB used' },
                { label: 'Team members', used: 1, limit: '5 seats' },
              ].map((u) => (
                <div key={u.label} className="flex items-center justify-between py-2 border-b border-muted last:border-0">
                  <p className="font-sans text-[13px] text-ink-soft">{u.label}</p>
                  <p className="font-sans text-[12px] text-whisper">
                    {u.used}{u.suffix ? ` ${u.suffix}` : ''} · {u.limit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
