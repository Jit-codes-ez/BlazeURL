import { Clock } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const MESSAGE =
  'BlazeURL is running on a free server — the first request may take up to a minute to wake up. Thanks for your patience!'

function Marquee() {
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY

      if (current < 10) {
        setVisible(true)
      } else if (current > lastScrollY.current) {
        setVisible(false)
      } else {
        setVisible(true)
      }

      lastScrollY.current = current
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="fixed left-0 right-0 top-18 z-40 h-8 overflow-hidden border-b border-(--border-subtle) transition-transform duration-300"
        style={{
        transform: visible
            ? 'translateY(0)'
            : 'translateY(calc(-100% - 72px))',
        }}
    >
      <div className="relative flex h-full items-center overflow-hidden">
        <div className="animate-marquee inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-(--text-secondary)">
          <Clock className="h-4 w-4 shrink-0 text-(--accent)" />
          <span>{MESSAGE}</span>
        </div>
      </div>
    </div>
  )
}

export default Marquee