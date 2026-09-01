import { Link } from 'react-router-dom'
import { ServerCrash, RotateCcw } from 'lucide-react'

function ServerErrorPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <ServerCrash size={28} className="text-rose-500" />
      </div>

      <h1
        className="text-2xl font-bold text-(--text-primary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.06s both' }}
      >
        Something went wrong
      </h1>

      <p
        className="mt-2 max-w-sm text-sm text-(--text-secondary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.12s both' }}
      >
        Our server ran into an unexpected error. We're already on it — please
        try again in a moment.
      </p>

      <div
        className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.18s both' }}
      >
        <button
          onClick={() => window.location.reload()}
          className="primary-button flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
        >
          <RotateCcw size={14} />
          Try again
        </button>
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

export default ServerErrorPage
