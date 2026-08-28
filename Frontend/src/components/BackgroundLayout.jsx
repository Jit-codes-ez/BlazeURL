import { useEffect, useState } from 'react'
import Background from './Background'

const BACKGROUND_COLORS = {
  dark: '#fe6446',
  light: '#f97316',
}

function BackgroundLayout({ children }) {
  const [theme, setTheme] = useState(
    localStorage.getItem('blaze-theme') || 'dark'
  )

  useEffect(() => {
    const handleThemeChange = () => {
      setTheme(localStorage.getItem('blaze-theme') || 'dark')
    }

    window.addEventListener('theme-change', handleThemeChange)
    return () => window.removeEventListener('theme-change', handleThemeChange)
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-(--bg-base)">
      <div className="fixed inset-0 z-0">
        <Background
          color={BACKGROUND_COLORS[theme]}
          speed={0.7}
          direction="forward"
          scale={2.3}
          opacity={theme === 'dark' ? 0.65 : 0.35}
          mouseInteractive={true}
          renderScale={0.55}
          maxDpr={1.5}
          targetFps={60}
          iterations={60}
        />
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default BackgroundLayout