import { useEffect, useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import GenerateURL from './GenerateUrl'

import {
  BarChart3,
  Clock3,
  Copy,
  ExternalLink,
  Link2,
  LogOut,
  Plus,
  QrCode,
  Trash2,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react'

import { supabase } from '../lib/supabaseClient'
import { QRCodeCanvas } from 'qrcode.react'

const API_URL = import.meta.env.VITE_API_URL

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatExpiry(isoString) {
  if (!isoString) return 'Never'

  const diffMs = new Date(isoString).getTime() - Date.now()
  if (diffMs <= 0) return 'Expired'

  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (days < 1) {
    const hours = Math.ceil(diffMs / (1000 * 60 * 60))
    return `${hours}h`
  }
  return `${days}d`
}

function isActive(url) {
  if (!url.expires_at) return true
  return new Date(url.expires_at).getTime() > Date.now()
}

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)

  const [urls, setUrls] = useState([])
  const [urlsLoading, setUrlsLoading] = useState(true)
  const [urlsError, setUrlsError] = useState('')
  const [deletingId, setDeletingId] = useState(null)
  const [deleteUrlTarget, setDeleteUrlTarget] = useState(null)
  const [qrUrl, setQrUrl] = useState(null)
  const [showGenerateModal, setShowGenerateModal] = useState(false)

  const [deletingAccount, setDeletingAccount] = useState(false)
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

  const fetchUrls = useCallback(async () => {
    setUrlsLoading(true)
    setUrlsError('')

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch(`${API_URL}/api/urls`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to load your URLs.')
      }

      const data = await response.json()
      setUrls(Array.isArray(data) ? data : data.urls || [])
    } catch (err) {
      setUrlsError(err.message || 'Something went wrong loading your URLs.')
    } finally {
      setUrlsLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!mounted) return

      if (!user) {
        navigate('/continue-with-google', { replace: true })
        return
      }

      setUser(user)
      setLoading(false)
      fetchUrls()
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/continue-with-google', { replace: true })
        return
      }
      setUser(session.user)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [navigate, fetchUrls])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/continue-with-google', { replace: true })
  }

  const handleDeleteAccount = async () => {
    setDeletingAccount(true)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch(`${API_URL}/api/users/me`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to delete your account. Please try again.')
      }

      await supabase.auth.signOut()
      navigate('/', { replace: true })
    } catch (err) {
      setDeletingAccount(false)
      setShowDeleteAccountModal(false)
      alert(err.message || 'Something went wrong deleting your account.')
    }
  }

  const handleDeleteUrl = async (urlId) => {
    setDeletingId(urlId)

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) return

      const response = await fetch(`${API_URL}/api/urls/${urlId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      })

      if (!response.ok) {
        throw new Error('Failed to delete this link.')
      }

      setUrls((current) => current.filter((u) => u.id !== urlId))
    } catch (err) {
      alert(err.message || 'Something went wrong deleting this link.')
    } finally {
      setDeletingId(null)
      setDeleteUrlTarget(null)
    }
  }

  const copyUrl = async (shortUrl) => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopied(shortUrl)
      setTimeout(() => setCopied(null), 1500)
    } catch {
      // Ignore clipboard errors
    }
  }

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'User'

  const avatar =
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    null

  const totalClicks = urls.reduce((sum, u) => sum + (u.click_count || 0), 0)
  const avgClicks = urls.length ? Math.round(totalClicks / urls.length) : 0
  const activeCount = urls.filter(isActive).length

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-9 w-9 animate-spin rounded-full border-2 border-(--accent)/20 border-t-(--accent)" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-(--accent)/10 blur-[120px]" />
        <div className="absolute right-0 top-1/3 h-72 w-72 rounded-full bg-(--accent)/5 blur-[110px]" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 border-b border-(--border-subtle) bg-(--bg-page)/75 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-(--accent)/15 ring-1 ring-(--accent)/20">
              <Zap size={18} className="text-(--accent)" />
            </div>
            <span className="font-display text-lg font-bold text-(--text-primary)">
              BlazeURL
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover ring-2 ring-(--accent)/20"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-(--accent)/15 text-(--accent)">
                  <User size={17} />
                </div>
              )}

              <div className="hidden max-w-32 sm:block">
                <p className="truncate text-sm font-semibold text-(--text-primary)">
                  {displayName}
                </p>
                <p className="truncate text-xs text-(--text-secondary)">
                  {user?.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl p-2.5 text-(--text-secondary) transition hover:bg-rose-500/10 hover:text-rose-500"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-1 text-sm font-medium text-(--accent)">
              Your workspace
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
              Welcome back, {displayName.split(' ')[0]}.
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-(--text-secondary)">
              Create, manage, and track all your shortened links from one place.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowDeleteAccountModal(true)}
              disabled={deletingAccount}
              className="box-border inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-red-500 px-5 text-sm font-semibold leading-none text-white shadow-lg shadow-red-500/20 hover:-translate-y-0.5 hover:bg-red-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              title="Delete account"
            >
              <Trash2 size={18} />
              {deletingAccount ? 'Deleting...' : 'Delete Account'}
            </button>

            <button
              type="button"
              onClick={() => setShowGenerateModal(true)}
              className="box-border inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-transparent bg-(--accent) px-5 text-sm font-semibold leading-none text-white shadow-lg shadow-(--accent)/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Plus size={18} />
              Create Short URL
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<Link2 size={20} />}      label="Total Links"   value={urls.length} />
          <StatCard icon={<TrendingUp size={20} />} label="Total Visits"  value={totalClicks} />
          <StatCard icon={<BarChart3 size={20} />}  label="Avg. Visits"   value={avgClicks} />
          <StatCard icon={<Clock3 size={20} />}     label="Active Links"  value={activeCount} />
        </section>

        {/* URLs */}
        <section className="glass-card overflow-hidden">
          <div className="border-b border-(--border-subtle) p-5">
            <h2 className="font-display text-lg font-bold text-(--text-primary)">My URLs</h2>
            <p className="mt-1 text-xs text-(--text-secondary)">Manage your recently created links.</p>
          </div>

          {urlsLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-(--accent)/20 border-t-(--accent)" />
            </div>
          ) : urlsError ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <p className="text-sm text-rose-500">{urlsError}</p>
              <button
                type="button"
                onClick={fetchUrls}
                className="mt-4 rounded-xl border border-(--border-subtle) px-4 py-2 text-sm font-medium text-(--text-primary) transition hover:bg-(--text-primary)/5"
              >
                Try again
              </button>
            </div>
          ) : urls.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-(--border-subtle)">
              {urls.map((url) => (
                <div
                  key={url.id}
                  className="group p-5 transition hover:bg-(--text-primary)/2"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* URL info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--accent)/10 text-(--accent)">
                          <Link2 size={16} />
                        </div>
                        <span className="truncate font-semibold text-(--accent)">
                          {url.short_url}
                        </span>
                      </div>

                      <p className="truncate text-sm text-(--text-secondary)">
                        {url.original_url}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-(--text-secondary)">
                        <span className="flex items-center gap-1.5">
                          <TrendingUp size={13} />
                          {url.click_count} clicks
                        </span>
                        <span>Created {formatDate(url.created_at)}</span>
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={13} />
                          {url.expires_at ? `Expires in ${formatExpiry(url.expires_at)}` : 'Never expires'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(url.short_url)}
                        className="inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) px-3 py-2.5 text-xs font-semibold text-(--text-primary) transition hover:bg-(--text-primary)/5"
                      >
                        <Copy size={15} />
                        {copied === url.short_url ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        type="button"
                        onClick={() => setQrUrl(url.short_url)}
                        className="rounded-xl border border-(--border-subtle) p-2.5 text-(--text-secondary) transition hover:bg-(--text-primary)/5 hover:text-(--accent)"
                        title="Generate QR code"
                        aria-label="Generate QR code"
                      >
                        <QrCode size={17} />
                      </button>

                      <a
                        href={url.short_url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-(--border-subtle) p-2.5 text-(--text-secondary) transition hover:bg-(--text-primary)/5 hover:text-(--text-primary)"
                        title="Open URL"
                      >
                        <ExternalLink size={17} />
                      </a>

                      <button
                        type="button"
                        onClick={() => setDeleteUrlTarget(url.id)}
                        disabled={deletingId === url.id}
                        className="rounded-xl border border-rose-500/10 p-2.5 text-rose-500 transition hover:bg-rose-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete URL"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Delete account confirmation */}
      <ConfirmDialog
        open={showDeleteAccountModal}
        title="Delete your account?"
        message="This will permanently delete your account and all your URLs. This action cannot be undone."
        confirmLabel="Yes, delete everything"
        loading={deletingAccount}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteAccountModal(false)}
      />

      {/* Delete URL confirmation */}
      <ConfirmDialog
        open={deleteUrlTarget !== null}
        title="Delete this link?"
        message="This will permanently delete the short URL and its click history. This cannot be undone."
        confirmLabel="Delete link"
        loading={deletingId !== null}
        onConfirm={() => handleDeleteUrl(deleteUrlTarget)}
        onCancel={() => setDeleteUrlTarget(null)}
      />

      {/* QR code modal */}
      {qrUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setQrUrl(null)}
        >
          <div
            className="glass-card w-full max-w-sm p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display text-xl font-bold text-(--text-primary)">
              QR Code
            </h2>

            <p className="mt-2 text-sm text-(--text-secondary)">
              Scan this QR code to open your short URL.
            </p>

            <div className="mx-auto my-6 flex w-fit rounded-2xl bg-white p-4">
              <QRCodeCanvas
                id="blazeurl-qr"
                value={qrUrl}
                size={220}
                level="H"
                marginSize={4}
              />
            </div>

            <p className="mb-5 break-all text-xs text-(--accent)">
              {qrUrl}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setQrUrl(null)}
                className="flex-1 rounded-xl border border-(--border-subtle) px-4 py-3 text-sm font-semibold text-(--text-primary) transition hover:bg-(--text-primary)/5"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  const canvas = document.querySelector(
                    '#blazeurl-qr'
                  )

                  if (!canvas) return

                  const link = document.createElement('a')
                  link.download = 'blazeurl-qr.png'
                  link.href = canvas.toDataURL('image/png')
                  link.click()
                }}
                className="flex-1 rounded-xl bg-(--accent) px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create short URL modal */}
      <GenerateURL
        open={showGenerateModal}
        onClose={() => setShowGenerateModal(false)}
        onCreated={() => fetchUrls()}
      />
    </div>
  )
}

function StatCard({ icon, label, value }) {
  return (
    <div className="glass-card p-5">
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-(--accent)/10 text-(--accent)">
        {icon}
      </div>
      <p className="text-xs font-medium text-(--text-secondary)">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-(--text-primary)">{value}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--accent)/10 text-(--accent)">
        <Link2 size={24} />
      </div>
      <h3 className="font-display text-lg font-bold text-(--text-primary)">
        No shortened URLs yet
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-(--text-secondary)">
        Create your first short URL and start sharing links with ease.
      </p>
    </div>
  )
}

export default Dashboard