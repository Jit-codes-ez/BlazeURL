import { LoaderCircle } from 'lucide-react'

function Button({
  children,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  disabled = false,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`primary-button inline-flex min-h-11 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading && <LoaderCircle size={18} className="animate-spin" />}
      {children}
    </button>
  )
}

export default Button