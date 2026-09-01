import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  )
}

function Login() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    // Only reached if Supabase rejects the request before the redirect happens
    // (e.g. misconfigured provider) — on success the browser navigates away.
    if (authError) {
      setError('Something went wrong signing in. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-72 w-72 rounded-full bg-(--accent)/15 blur-[100px]" />
      </div>

      <div className="w-full max-w-sm">

        <div className="glass-card p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-(--text-primary)">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-(--text-secondary)">
            Sign in to set link expiration, generate QR codes, and track
            clicks.
          </p>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-page) py-3 text-sm font-semibold text-(--text-primary) transition-colors hover:bg-(--text-primary)/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Redirecting…
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          {error && (
            <p className="mt-4 text-sm text-rose-500">{error}</p>
          )}

          <p className="mt-6 text-xs leading-5 text-(--text-secondary)">
            By continuing, you agree to BlazeURL's{' '}
            <Link to="/terms" className="text-(--accent) hover:underline">
              Terms
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-(--accent) hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-(--text-secondary)">
          <Link to="/" className="hover:text-(--text-primary)">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
