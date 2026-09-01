import { Link } from 'react-router-dom'
import { LogIn, ShieldAlert } from 'lucide-react'

function SessionExpiredPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <ShieldAlert size={28} className="text-amber-500" />
      </div>

      <h1
        className="text-2xl font-bold text-(--text-primary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.06s both' }}
      >
        Session expired
      </h1>

      <p
        className="mt-2 max-w-sm text-sm text-(--text-secondary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.12s both' }}
      >
        You've been signed out due to inactivity. Sign back in to continue
        managing your links.
      </p>

      <div
        className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.18s both' }}
      >
        <Link
          to="/login"
          className="primary-button flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold no-underline"
        >
          <LogIn size={14} />
          Sign in again
        </Link>
        <Link
          to="/"
          className="flex items-center gap-1.5 text-sm font-medium text-(--accent) hover:brightness-110"
        >
          Back to home
        </Link>
      </div>

      <style>{`
        @keyframes popUp {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default SessionExpiredPage
