import { Link } from 'react-router-dom'
import { LinkIcon, RotateCcw } from 'lucide-react'

function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-(--border-subtle) bg-(--bg-header)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <LinkIcon size={26} className="text-(--text-secondary)" />
      </div>

      <h1
        className="text-2xl font-bold text-(--text-primary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.06s both' }}
      >
        Link not found
      </h1>

      <p
        className="mt-2 max-w-sm text-sm text-(--text-secondary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.12s both' }}
      >
        This link doesn't exist. It may have been deleted or the URL could be
        wrong. Double-check and try again.
      </p>

      <div
        className="mt-8"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.18s both' }}
      >
        <Link
          to="/"
          className="primary-button flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold no-underline"
        >
          <RotateCcw size={14} />
          Back to BlazeURL
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

export default NotFoundPage