import { useEffect } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import GlassCard from './GlassCard'

function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  loading = false,
  onConfirm,
  onCancel,
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, loading, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={() => !loading && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
    >
      <GlassCard
        className="w-full justify-center max-w-md p-6 shadow-xl "
        // stop clicks inside the card from closing the dialog
      >
        <div onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center gap-4 ">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-rose-500/15 text-red-500">
              <AlertTriangle size={40} />
            </div>
            </div>
            <br />
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2
                id="confirm-title"
                className="font-display text-center text-lg font-bold text-(--text-primary)"
              >
                {title}
              </h2>
              <p className="mt-1.5 text-sm text-center leading-6 text-(--text-secondary)">
                {message}
              </p>
            </div>
          </div>

          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-xl border border-(--border-subtle) px-4 py-2.5 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--text-primary)/5 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="flex items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? 'Deleting…' : confirmLabel}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default ConfirmDialog
