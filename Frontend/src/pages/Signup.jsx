import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2, Zap } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

function GoogleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      aria-hidden="true"
    >
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

function Signup() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(() => {
      const params = new URLSearchParams(window.location.search)
      if (params.get('error') || params.get('error_description')) {
        return (
          params.get('error_description') ||
          'Sign-in failed or was cancelled. Please try again.'
        )
      }
      return ''
    })
      useEffect(() => {
    // 1. Reset if the page was restored from bfcache (back/forward navigation)
    const onPageShow = (e) => {
      if (e.persisted) {
        setLoading(false)
        setError('')
      }
    }
    window.addEventListener('pageshow', onPageShow)

    // 2. Clean the URL so refresh doesn't re-show the error
    const params = new URLSearchParams(window.location.search)
    if (params.get('error') || params.get('error_description')) {
      window.history.replaceState({}, '', window.location.pathname)
    }

    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  const handleGoogleSignup = async () => {
    setError('')
    setLoading(true)

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (authError) {
      setError('Something went wrong while creating your account. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div className="h-72 w-72 rounded-full bg-(--accent)/15 blur-[110px]" />
      </div>

      <div className="w-full max-w-xl">
        <div className="glass-card p-8 sm:p-9">

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--accent)/15 ring-1 ring-(--accent)/25">
              <Zap
                size={25}
                className="text-(--accent)"
              />
            </div>

            <h1 className="font-display text-2xl font-bold text-(--text-primary)">
              Create your account
            </h1>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-(--text-secondary)">
              Join BlazeURL to manage your links, track clicks, and unlock
              advanced features.
            </p>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignup}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-page) py-3.5 text-sm font-semibold text-(--text-primary) shadow-sm transition hover:bg-(--text-primary)/5 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Redirecting...
              </>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-center text-sm text-rose-500">
              {error}
            </div>
          )}

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-(--border-subtle)" />

            <span className="text-xs text-(--text-secondary)">
              Secure authentication
            </span>

            <div className="h-px flex-1 bg-(--border-subtle)" />
          </div>

          <p className="text-center text-xs leading-5 text-(--text-secondary)">
            By continuing, you agree to BlazeURL's{' '}
            <Link
              to="/terms"
              className="text-(--accent) hover:underline"
            >
              Terms
            </Link>{' '}
            and{' '}
            <Link
              to="/privacy"
              className="text-(--accent) hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-(--text-secondary)">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-(--accent) hover:underline"
          >
            Sign in
          </Link> 
        </p>
        <p className="mt-6 text-center text-sm text-(--text-secondary)">
          <Link to="/" className="hover:text-(--text-primary)">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup