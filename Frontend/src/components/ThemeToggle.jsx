import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

function getInitialTheme() {
  const savedTheme = localStorage.getItem('blaze-theme')

  if (savedTheme) return savedTheme

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('blaze-theme', theme)
    window.dispatchEvent(new Event('theme-change'))
  }, [theme])

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transition')
    setTheme(current => (current === 'dark' ? 'light' : 'dark'))
      window.setTimeout(() => {
    document.documentElement.classList.remove('theme-transition')
    }, 350)
  }

  const isDark = theme === 'dark'

return (
  <button
    type="button"
    onClick={toggleTheme}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    className="relative flex h-7 w-13 shrink-0 items-center rounded-full border border-(--accent)/40 bg-(--accent)/20 px-1 transition-colors duration-300 hover:bg-(--accent)/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent) focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
  >
    <span
      className={`relative flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-900 shadow-sm transition-transform duration-300 ease-in-out ${
        isDark ? 'translate-x-0' : 'translate-x-5.5'
      }`}
    >
      <Sun
        size={13}
        className={`absolute transition-all duration-300 ease-in-out ${
          isDark ? 'scale-0 -rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'
        }`}
      />
      <Moon
        size={13}
        className={`absolute transition-all duration-300 ease-in-out ${
          isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 rotate-90 opacity-0'
        }`}
      />
    </span>
  </button>
)
}

export default ThemeToggle