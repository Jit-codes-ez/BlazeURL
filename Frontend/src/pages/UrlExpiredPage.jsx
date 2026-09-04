import { Link } from 'react-router-dom'
import { Clock, RotateCcw, ArrowRight } from 'lucide-react'
import GlassCard from '../components/GlassCard'

function ExpiredPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <GlassCard
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-500/10"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <Clock size={30} className="text-amber-500" />
      </GlassCard>

      <h1
        className="text-2xl font-bold text-(--text-primary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.06s both' }}
      >
        This link has expired
      </h1>

      <p
        className="mt-2 max-w-sm text-sm text-(--text-secondary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.12s both' }}
      >
        Links created without an account are active for 48 hours. Sign in to
        create links that never expire.
      </p>

      <div
        className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.18s both' }}
      >
        <Link
          to="/"
          className="primary-button flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold no-underline"
        >
          <RotateCcw size={14} />
          Shorten a new URL
        </Link>
        <GlassCard Link
          to="/auth"
          className="flex items-center gap-1.5 text-sm font-medium text-(--accent) hover:brightness-110"
        >
          Sign in for permanent links
          <ArrowRight size={13} />
        </GlassCard>
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

export default ExpiredPage