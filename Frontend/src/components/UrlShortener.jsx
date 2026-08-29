import { useState, useEffect, useCallback } from 'react'
import { Check, Copy, Link2, Loader2, X, Zap, Clock, BarChart2, QrCode, Lock, LogIn } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

function isValidUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/* ─── Toast ─────────────────────────────────────────────────── */
function Toast({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className="toast-item pointer-events-auto flex items-center gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-header) px-4 py-3 text-sm font-medium text-(--text-primary) shadow-xl backdrop-blur-xl"
          style={{ animation: 'toastIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both' }}
        >
          {t.icon && <span className="shrink-0 text-(--accent)">{t.icon}</span>}
          <span>{t.message}</span>
          <button
            onClick={() => onDismiss(t.id)}
            className="ml-1 rounded-md p-0.5 opacity-50 transition-opacity hover:opacity-100"
            aria-label="Dismiss"
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}

/* ─── Hook ───────────────────────────────────────────────────── */
function useToast() {
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, icon = null, duration = 3000) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, message, icon }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), duration)
  }, [])

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return { toasts, push, dismiss }
}

/* ─── Result card ────────────────────────────────────────────── */
function ResultCard({ result, onCopy, copied }) {
  return (
    <div
      className="mt-5 rounded-2xl border border-(--border-subtle) bg-(--bg-header) p-5 text-left backdrop-blur-xl"
      style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
    >
      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <a
          href={result.shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="truncate text-lg font-semibold text-(--accent) hover:brightness-110"
        >
          {result.shortUrl}
        </a>

        <button
          type="button"
          onClick={onCopy}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-(--border-subtle) px-4 py-2 text-sm font-medium text-(--text-primary) transition-colors hover:bg-(--text-primary)/5"
        >
          {copied ? (
            <>
              <Check size={15} />
              Copied!
            </>
          ) : (
            <>
              <Copy size={15} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Upsell banner */}
      <div className="mt-4 overflow-hidden rounded-xl border border-red-200/60 bg-red-50/50 dark:border-red-900/40 dark:bg-red-950/20">
        {/* Expiry warning row */}
        <div className="flex items-center gap-2 border-b border-red-200/60 px-4 py-2.5 dark:border-red-900/40">
          <Clock size={13} className="shrink-0 text-red-500" />
          <p className="text-sm font-semibold text-red-600 dark:text-red-400">
            This link expires in 48 hours
          </p>
        </div>

        {/* Features + CTA row */}
        <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-(--text-secondary)">
              <LogIn size={13} className="shrink-0" />
              Sign in to unlock
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { icon: <BarChart2 size={11} />, label: 'Link analytics' },
                { icon: <QrCode size={11} />,    label: 'QR codes' },
                { icon: <Lock size={11} />,       label: 'Custom expiry' },
              ].map(({ icon, label }) => (
                <span
                  key={label}
                  className="flex items-center gap-1.5 rounded-full border border-(--border-subtle) bg-(--bg-header) px-2.5 py-1 text-xs font-medium text-(--text-primary)"
                >
                  <span className="text-(--text-secondary)">{icon}</span>
                  {label}
                </span>
              ))}
            </div>
          </div>

          <a
            href="/login"
            className="primary-button flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold no-underline"
          >
            <LogIn size={14} />
            Sign in — it's free
          </a>
        </div>
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────── */
function UrlShortener() {
  const [inputUrl, setInputUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [copied, setCopied] = useState(false)
  const { toasts, push, dismiss } = useToast()

  /* Inject keyframes once */
  useEffect(() => {
    const styleId = 'blaze-url-keyframes'
    if (document.getElementById(styleId)) return
    const style = document.createElement('style')
    style.id = styleId
    style.textContent = `
      @keyframes popUp {
        from { opacity: 0; transform: translateY(18px) scale(0.96); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }
      @keyframes toastIn {
        from { opacity: 0; transform: translateY(12px) scale(0.95); }
        to   { opacity: 1; transform: translateY(0)    scale(1); }
      }
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-6px); }
        40%       { transform: translateX(6px); }
        60%       { transform: translateX(-4px); }
        80%       { transform: translateX(4px); }
      }
      .animate-shake { animation: shake 0.4s ease; }
    `
    document.head.appendChild(style)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    const trimmed = inputUrl.trim()
    if (!trimmed) {
      setError('Paste a URL to shorten.')
      return
    }

    const candidate = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

    if (!isValidUrl(candidate)) {
      setError('That doesn\u2019t look like a valid URL.')
      return
    }

    setLoading(true)

    try {
      const res = await fetch(`${API_URL}/api/shorten`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ original_url: candidate }),
      })

      if (!res.ok) throw new Error('Failed to shorten link')

      const data = await res.json()
      setResult({ shortUrl: data.short_url, expiresAt: data.expires_at })

      // 🎉 Success toast
      push('Link shortened!', <Zap size={15} />)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.shortUrl)
    setCopied(true)
    push('Copied to clipboard!', <Check size={15} />)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          className={`flex flex-col gap-3 sm:flex-row ${error ? 'animate-shake' : ''}`}
        >
          <div className="relative flex-1">
            <Link2
              size={18}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-(--text-secondary)"
            />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste a long URL here (e.g. https://www.example.com/..)"
              className="url-input pl-11"
              style={{ paddingLeft: '3rem' }}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="primary-button flex shrink-0 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Shortening…
              </>
            ) : (
              'Shorten URL'
            )}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm text-rose-500">{error}</p>
        )}

        {result && (
          <ResultCard result={result} onCopy={handleCopy} copied={copied} />
        )}
      </div>

      {/* Toast portal */}
      <Toast toasts={toasts} onDismiss={dismiss} />
    </>
  )
}

export default UrlShortener