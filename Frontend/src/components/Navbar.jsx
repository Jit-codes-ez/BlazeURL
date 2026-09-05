import { Menu, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { supabase } from '../lib/supabaseClient'

function Navbar() {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const lastScrollY = useRef(0)

  const closeMenu = () => setOpen(false)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY

      if (current < 10) {
        setVisible(true)
      } else if (current > lastScrollY.current) {
        setVisible(false)
        setOpen(false)
      } else {
        setVisible(true)
      }

      lastScrollY.current = current
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Reflects real auth state, not the current route — so the button is
  // correct on every page, not just while on /dashboard.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    closeMenu()
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  const navLinkClass =
    'text-sm font-medium text-(--text-secondary) transition-colors hover:text-(--text-primary)'

  const signInClass =
    'rounded-[10px] bg-(--accent) px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_var(--accent-glow)] transition-colors hover:brightness-110'

  const signOutClass =
    'rounded-[10px] bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_20px_rgba(220,50,50,0.5)] transition-colors hover:brightness-110'


  return (
    <>
      <header
        className="fixed left-0 right-0 top-0 z-50 border-b border-(--border-subtle) bg-(--bg-header) shadow-(--shadow-header) backdrop-blur-xl transition-all duration-300"
        style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)' }}
      >
        <nav className="mx-auto flex h-18 max-w-350 items-center justify-between px-5 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center">
            <img src="/blazeurl-logo.png" alt="BlazeURL" className="h-12 w-auto" />
          </a>

          <div className="hidden items-center gap-7 md:flex">
            <a href="/workings" className={navLinkClass}>
              How It Works
            </a>

            {isAuthenticated ? (
              <button type="button" onClick={handleSignOut} className={signOutClass}>
                Sign Out
              </button>
            ) : (
              <Link to="/auth" className={signInClass}>
                Sign In
              </Link>
            )}

            <ThemeToggle />
          </div>

          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setOpen(current => !current)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-(--border-subtle) bg-(--text-primary)/5 text-(--text-primary)"
            >
              {open ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div

        

          className="fixed left-0 right-0 top-18 z-40 border-b border-(--border-subtle) bg-(--bg-header-mobile) p-5 backdrop-blur-xl transition-all duration-300 md:hidden"
          style={{ transform: visible ? 'translateY(0)' : 'translateY(-200%)' }}
        >
          <div className="flex flex-col gap-2">
            <a
              href="#"
              onClick={closeMenu}
              className="block text-center rounded-xl px-4 py-3 text-(--text-secondary) transition-colors hover:bg-(--text-primary)/5 hover:text-(--text-primary)"
            >
              How It Works
            </a>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-2 rounded-xl bg-red-600 px-4 py-3 text-center font-semibold text-white shadow-[0_0_20px_rgba(239,68,68,0.5)] transition-colors hover:brightness-110"
              >
                Sign Out
              </button>
            ) : (
              <a
                href="/auth"
                onClick={closeMenu}
                className="mt-2 rounded-xl border border-(--accent) bg-(--accent) px-4 py-3 text-center font-semibold text-white transition-colors hover:bg-(--accent)/80"
              >
                Sign In
              </a>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar