import { useEffect, useState } from 'react'
import { Check, Copy, Link2, Loader2, QrCode, X } from 'lucide-react'
import GlassCard from '../components/GlassCard'
import { supabase } from '../lib/supabaseClient'

const API_URL = import.meta.env.VITE_API_URL

const EXPIRY_OPTIONS = [
  { value: '2d', label: '2 days' },
  { value: '15d', label: '15 days' },
  { value: '1m', label: '1 month' },
  { value: 'never', label: 'Never' },
]

function getExpiryDate(value) {
  if (value === 'never') return null

  const now = new Date()
  if (value === '2d') {
    now.setDate(now.getDate() + 2)
  } else if (value === '15d') {
    now.setDate(now.getDate() + 15)
  } else if (value === '1m') {
    now.setMonth(now.getMonth() + 1)
  }
  return now.toISOString()
}

function GenerateURL({ open, onClose, onCreated }) {
  const [originalUrl, setOriginalUrl] = useState('')
  const [customAlias, setCustomAlias] = useState('')
  const [title, setTitle] = useState('')
  const [expiry, setExpiry] = useState('15d')
  const [makeQr, setMakeQr] = useState('later')
  const [copyAfter, setCopyAfter] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [created, setCreated] = useState(null)

  // Effect now only handles Escape — an event subscription, which is
  // exactly what effects are for
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !submitting) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, submitting, onClose])

  if (!open) return null

const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  if (!originalUrl.trim()) {
    setError('Please paste a URL.')
    return
  }

  let normalizedUrl = originalUrl.trim()

  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`
  }

  try {
    new URL(normalizedUrl)
  } catch {
    setError('That doesn’t look like a valid URL.')
    return
  }

  setSubmitting(true)

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      throw new Error('Unable to verify your login session.')
    }

    if (!session) {
      throw new Error('Your login session has expired. Please sign in again.')
    }

    const response = await fetch(`${API_URL}/api/urls`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        original_url: normalizedUrl,
        expires_at: getExpiryDate(expiry),
        custom_alias: customAlias.trim() || null,
        title: title.trim() || null,
        generate_qr: makeQr === 'now',
      }),
    })

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
      throw new Error(
        data.detail ||
        data.error ||
        data.message ||
        `Failed to create the short URL. (${response.status})`
      )
    }

    setCreated(data)

    if (copyAfter && data.short_url) {
      try {
        await navigator.clipboard.writeText(data.short_url)
      } catch {
        // Ignore clipboard errors
      }
    }

    onCreated?.(data)
    setSubmitting(false)
  } catch (err) {
    console.error('Create URL error:', err)

    setError(
      err.message || 'Something went wrong. Please try again.'
    )

    setSubmitting(false)
  }
}

  const handleCopy = async () => {
    if (!created?.short_url) return
    try {
      await navigator.clipboard.writeText(created.short_url)
    } catch {
      // Ignore clipboard errors
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => !submitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-title"
    >
      <GlassCard
        className="w-full max-w-lg p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center text-center rounded-xl bg-(--accent)/15 text-(--accent)">
              <Link2 size={18} />
            </div>
            <div>
              <h2
                id="generate-title"
                className="font-display text-lg font-bold text-(--text-primary)"
              >
                Create Short URL
              </h2>
              <p className="text-xs text-(--text-secondary)">
                Shorten a link and set its options.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-xl p-2 text-(--text-secondary) transition hover:bg-(--text-primary)/5 hover:text-(--text-primary)"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {created ? (
          /* ---------- Success state ---------- */
          <div className="mt-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-500">
              <Check size={24} />
            </div>

            <h3 className="mt-4 font-display text-lg font-bold text-(--text-primary)">
              Your short URL is ready!
            </h3>

            <div className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-(--border-subtle) bg-(--bg-page) px-4 py-3">
              <span className="truncate font-semibold text-(--accent)">
                {created.short_url}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 rounded-lg p-1.5 text-(--text-secondary) transition hover:bg-(--text-primary)/5 hover:text-(--text-primary)"
                aria-label="Copy short URL"
              >
                <Copy size={15} />
              </button>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setCreated(null)
                  setSubmitting(false)
                }}
                className="rounded-xl border border-(--border-subtle) px-4 py-2.5 text-sm font-semibold text-(--text-primary) transition hover:bg-(--text-primary)/5"
              >
                Create another
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ---------- Form state ---------- */
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Original URL */}
            <div>
              <label
                htmlFor="gen-original"
                className="mb-1.5 block text-sm font-semibold text-(--text-primary)"
              >
                Original URL
              </label>
              <input
                id="gen-original"
                type="text"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/your-very-long-link"
                autoFocus
                className="w-full rounded-xl border border-(--border-subtle) bg-(--bg-page) px-4 py-3 text-sm text-(--text-primary) placeholder:text-(--text-secondary)/60 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
              />
            </div>

            {/* Optional: custom alias */}
            <div>
              <label
                htmlFor="gen-alias"
                className="mb-1.5 block text-sm font-semibold text-(--text-primary)"
              >
                Custom alias <span className="font-normal text-(--text-secondary)">(optional)</span>
              </label>
              <input
                id="gen-alias"
                type="text"
                value={customAlias}
                onChange={(e) =>
                  setCustomAlias(e.target.value.replace(/[^a-zA-Z0-9-_]/g, ''))
                }
                placeholder="my-links"
                maxLength={30}
                className="w-full rounded-xl border border-(--border-subtle) bg-(--bg-page) px-4 py-3 text-sm text-(--text-primary) placeholder:text-(--text-secondary)/60 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
              />
              <p className="mt-1 text-xs text-(--text-secondary)">
                Letters, numbers, dashes, and underscores only.
              </p>
            </div>

            {/* Optional: title */}
            <div>
              <label
                htmlFor="gen-title"
                className="mb-1.5 block text-sm font-semibold text-(--text-primary)"
              >
                Label <span className="font-normal text-(--text-secondary)">(optional)</span>
              </label>
              <input
                id="gen-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Marketing campaign"
                maxLength={60}
                className="w-full rounded-xl border border-(--border-subtle) bg-(--bg-page) px-4 py-3 text-sm text-(--text-primary) placeholder:text-(--text-secondary)/60 focus:border-(--accent) focus:outline-none focus:ring-2 focus:ring-(--accent)/20"
              />
            </div>

            {/* Expiry */}
            <div>
              <p className="mb-2 text-sm font-semibold text-(--text-primary)">
                Time of expiry
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {EXPIRY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setExpiry(option.value)}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      expiry === option.value
                        ? 'border-(--accent) bg-(--accent)/10 text-(--accent)'
                        : 'border-(--border-subtle) text-(--text-secondary) hover:bg-(--text-primary)/5 hover:text-(--text-primary)'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* QR */}
            <div>
              <p className="mb-2 text-sm font-semibold text-(--text-primary)">
                Generate QR code
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'now', label: 'Now' },
                  { value: 'later', label: 'Later' },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setMakeQr(option.value)}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                      makeQr === option.value
                        ? 'border-(--accent) bg-(--accent)/10 text-(--accent)'
                        : 'border-(--border-subtle) text-(--text-secondary) hover:bg-(--text-primary)/5 hover:text-(--text-primary)'
                    }`}
                  >
                    <QrCode size={15} />
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Copy after create */}
            <label className="flex justify-center cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={copyAfter}
                onChange={(e) => setCopyAfter(e.target.checked)}
                className="h-4 w-4 accent-(--accent)"
              />
              <span className="text-sm text-(--text-primary)">
                Copy the short URL to my clipboard after creating
              </span>
            </label>

            {error && <p className="text-sm text-rose-500">{error}</p>}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-(--border-subtle) px-4 py-2.5 text-sm font-semibold text-(--text-primary) transition hover:bg-(--text-primary)/5 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-xl bg-(--accent) px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-(--accent)/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? 'Creating…' : 'Create Short URL'}
              </button>
            </div>
          </form>
        )}
      </GlassCard>
    </div>
  )
}

export default GenerateURL
