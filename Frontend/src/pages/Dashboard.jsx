import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  BarChart3,
  Clock3,
  Copy,
  ExternalLink,
  Link2,
  LogOut,
  Plus,
  QrCode,
  Settings,
  Trash2,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react'

import { supabase } from '../lib/supabaseClient'

function Dashboard() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(null)

  const [urls] = useState([
    {
      id: 1,
      shortCode: 'blaze7x',
      originalUrl: 'https://example.com/my-awesome-project',
      clicks: 124,
      createdAt: 'Today',
      expiresAt: '2 days',
    },
    {
      id: 2,
      shortCode: 'dev42k',
      originalUrl: 'https://github.com/',
      clicks: 87,
      createdAt: 'Yesterday',
      expiresAt: '5 days',
    },
  ])

  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!mounted) return

      if (!user) {
        navigate('/auth', { replace: true })
        return
      }

      setUser(user)
      setLoading(false)
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        navigate('/auth', { replace: true })
        return
      }

      setUser(session.user)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/auth', { replace: true })
  }

  const copyUrl = async (shortCode) => {
    const url = `${window.location.origin}/${shortCode}`

    try {
      await navigator.clipboard.writeText(url)
      setCopied(shortCode)

      setTimeout(() => {
        setCopied(null)
      }, 1500)
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
            <Link
              to="/settings"
              className="hidden rounded-xl p-2.5 text-(--text-secondary) transition hover:bg-(--text-primary)/5 hover:text-(--text-primary) sm:block"
              title="Settings"
            >
              <Settings size={19} />
            </Link>

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
              Create, manage, and track all your shortened links from one
              place.
            </p>
          </div>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-(--accent) px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-(--accent)/20 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Plus size={18} />
            Create Short URL
          </Link>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={<Link2 size={20} />}
            label="Total Links"
            value="12"
            change="+3 this week"
          />

          <StatCard
            icon={<TrendingUp size={20} />}
            label="Total Clicks"
            value="1,248"
            change="+18.4%"
          />

          <StatCard
            icon={<BarChart3 size={20} />}
            label="Avg. Clicks"
            value="104"
            change="per link"
          />

          <StatCard
            icon={<Clock3 size={20} />}
            label="Active Links"
            value="9"
            change="3 expiring soon"
          />
        </section>

        {/* URLs */}
        <section className="glass-card overflow-hidden">
          <div className="flex flex-col gap-4 border-b border-(--border-subtle) p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-(--text-primary)">
                Your URLs
              </h2>

              <p className="mt-1 text-xs text-(--text-secondary)">
                Manage your recently created links.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-(--border-subtle) px-4 py-2.5 text-sm font-medium text-(--text-primary) transition hover:bg-(--text-primary)/5"
            >
              <BarChart3 size={16} />
              View Analytics
            </button>
          </div>

          {urls.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="divide-y divide-(--border-subtle)">
              {urls.map((url) => (
                <div
                  key={url.id}
                  className="group p-5 transition hover:bg-(--text-primary)/[0.02]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                    {/* URL info */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-(--accent)/10 text-(--accent)">
                          <Link2 size={16} />
                        </div>

                        <span className="truncate font-semibold text-(--accent)">
                          {window.location.origin}/{url.shortCode}
                        </span>
                      </div>

                      <p className="truncate text-sm text-(--text-secondary)">
                        {url.originalUrl}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-(--text-secondary)">
                        <span className="flex items-center gap-1.5">
                          <TrendingUp size={13} />
                          {url.clicks} clicks
                        </span>

                        <span>Created {url.createdAt}</span>

                        <span className="flex items-center gap-1.5">
                          <Clock3 size={13} />
                          Expires in {url.expiresAt}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(url.shortCode)}
                        className="inline-flex items-center gap-2 rounded-xl border border-(--border-subtle) px-3 py-2.5 text-xs font-semibold text-(--text-primary) transition hover:bg-(--text-primary)/5"
                      >
                        <Copy size={15} />
                        {copied === url.shortCode ? 'Copied' : 'Copy'}
                      </button>

                      <button
                        type="button"
                        className="rounded-xl border border-(--border-subtle) p-2.5 text-(--text-secondary) transition hover:bg-(--text-primary)/5 hover:text-(--text-primary)"
                        title="QR Code"
                      >
                        <QrCode size={17} />
                      </button>

                      <a
                        href={`/${url.shortCode}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-xl border border-(--border-subtle) p-2.5 text-(--text-secondary) transition hover:bg-(--text-primary)/5 hover:text-(--text-primary)"
                        title="Open URL"
                      >
                        <ExternalLink size={17} />
                      </a>

                      <button
                        type="button"
                        className="rounded-xl border border-rose-500/10 p-2.5 text-rose-500 transition hover:bg-rose-500/10"
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
    </div>
  )
}

function StatCard({ icon, label, value, change }) {
  return (
    <div className="glass-card p-5">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-(--accent)/10 text-(--accent)">
          {icon}
        </div>

        <span className="text-xs font-medium text-(--text-secondary)">
          {change}
        </span>
      </div>

      <p className="text-xs font-medium text-(--text-secondary)">
        {label}
      </p>

      <p className="mt-1 font-display text-2xl font-bold text-(--text-primary)">
        {value}
      </p>
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

      <Link
        to="/"
        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-(--accent) px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
      >
        <Plus size={17} />
        Create Short URL
      </Link>
    </div>
  )
}

export default Dashboard