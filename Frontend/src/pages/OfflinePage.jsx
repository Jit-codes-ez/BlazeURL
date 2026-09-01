import { useEffect, useState } from 'react'
import { WifiOff, RotateCcw } from 'lucide-react'

function OfflinePage() {
  const [isBack, setIsBack] = useState(false)

  useEffect(() => {
    function handleOnline() {
      setIsBack(true)
      setTimeout(() => window.location.reload(), 1500)
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <WifiOff size={28} className="text-blue-400" />
      </div>

      <h1
        className="text-2xl font-bold text-(--text-primary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.06s both' }}
      >
        {isBack ? 'Connection restored!' : 'You\'re offline'}
      </h1>

      <p
        className="mt-2 max-w-sm text-sm text-(--text-secondary)"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.12s both' }}
      >
        {isBack
          ? 'Reloading the page for you…'
          : "Check your internet connection and try again. The page will reload automatically when you're back online."}
      </p>

      {!isBack && (
        <div
          className="mt-8"
          style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) 0.18s both' }}
        >
          <button
            onClick={() => window.location.reload()}
            className="primary-button flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold"
          >
            <RotateCcw size={14} />
            Retry
          </button>
        </div>
      )}

      <style>{`
        @keyframes popUp {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default OfflinePage