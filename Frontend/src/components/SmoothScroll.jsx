import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { LenisContext } from '../lib/lenis-context'

function SmoothScroll({ children }) {
  const lenisRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    // Respect accessibility preference — fall back to native scroll entirely
    if (prefersReducedMotion) return

    const instance = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3), // classy cubic ease-out, not linear
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    })

    lenisRef.current = instance

    let rafId
    function raf(time) {
      instance.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Intercept in-page anchor links so they scroll smoothly through Lenis
    // instead of jumping natively, offset for the fixed 72px header.
    function handleClick(e) {
      const anchor = e.target.closest('a[href*="#"]')
      if (!anchor) return

      const url = new URL(anchor.href)
      const isSamePage = url.pathname === window.location.pathname
      if (!isSamePage || !url.hash) return

      const target = document.querySelector(url.hash)
      if (!target) return

      e.preventDefault()
      instance.scrollTo(target, { offset: -72, duration: 1.1 })
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
      cancelAnimationFrame(rafId)
      instance.destroy()
      lenisRef.current = null
    }
  }, [])

  return (
    <LenisContext.Provider value={lenisRef}>{children}</LenisContext.Provider>
  )
}

export default SmoothScroll