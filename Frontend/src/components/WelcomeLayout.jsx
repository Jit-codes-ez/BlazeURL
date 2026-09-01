import { useEffect, useState } from 'react'
import { X, Zap, Clock, BarChart2, QrCode, Lock, LogIn, Check } from 'lucide-react'

const freeFeatures = [
  { icon: <Zap size={14} />,   text: 'Shorten any URL instantly' },
  { icon: <Clock size={14} />, text: 'Links active for 48 hours' },
  { icon: <Check size={14} />, text: 'Copy & share in one click' },
]

const proFeatures = [
  { icon: <Lock size={14} />,      text: 'Links that never expire' },
  { icon: <BarChart2 size={14} />, text: 'Click analytics & insights' },
  { icon: <QrCode size={14} />,    text: 'QR code generation' },
  { icon: <Zap size={14} />,       text: 'Custom expiry control' },
]

function WelcomeModal() {
  const [visible, setVisible] = useState(false)

useEffect(() => {
  async function checkWelcome() {
    const seen = localStorage.getItem('blaze_welcome_seen')
    if (!seen) {
      setVisible(true)
    }
  }
  checkWelcome()
}, [])

  const dismiss = () => {
    localStorage.setItem('blaze_welcome_seen', '1')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ animation: 'fadeIn 0.2s ease both' }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={dismiss}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0f0f0f] shadow-2xl md:max-w-xl lg:max-w-2xl"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-(--accent) to-transparent opacity-80" />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white md:right-5 md:top-5 md:h-9 md:w-9"
          aria-label="Close"
        >
          <X size={15} />
        </button>

        <div className="p-7 md:p-10">
          {/* Header */}
          <div className="mb-7 flex flex-col items-center text-center md:mb-9">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-(--accent)/15 ring-1 ring-(--accent)/30 md:h-16 md:w-16">
              <Zap size={24} className="text-(--accent) md:h-7 md:w-7" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
              Welcome to BlazeURL
            </h2>
            <p className="mt-1.5 text-sm text-white/50 md:mt-2 md:text-base">
              Here's what you can do — with or without an account.
            </p>
          </div>

          {/* Feature columns */}
          <div className="mb-5 grid grid-cols-2 gap-3 md:mb-8 md:gap-5">
            {/* Without account */}
            <div className="flex flex-col gap-3 rounded-2xl border border-white/8 bg-white/4 p-4 md:gap-4 md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35 md:text-xs">
                No account
              </p>
              <ul className="flex flex-col gap-2.5 md:gap-3.5">
                {freeFeatures.map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 md:gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/8 text-white/50 md:h-7 md:w-7">
                      {icon}
                    </span>
                    <span className="text-xs text-white/70 md:text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* With account */}
            <div className="flex flex-col gap-3 rounded-2xl border border-(--accent)/20 bg-(--accent)/8 p-4 md:gap-4 md:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-(--accent) md:text-xs">
                ✦ With account
              </p>
              <ul className="flex flex-col gap-2.5 md:gap-3.5">
                {proFeatures.map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-2.5 md:gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-(--accent)/15 text-(--accent) md:h-7 md:w-7">
                      {icon}
                    </span>
                    <span className="text-xs text-white/80 md:text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 md:gap-3">
            <a
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-(--accent) py-3 text-sm font-semibold text-white shadow-[0_0_24px_var(--accent-glow)] transition-all hover:brightness-110 no-underline md:py-4 md:text-base"
            >
              <LogIn size={14} />
              Sign in — it's free
            </a>
            <button
              onClick={dismiss}
              className="w-full rounded-xl py-3 text-sm font-medium text-white/40 transition-colors hover:bg-white/5 hover:text-white/70 md:py-3.5 md:text-base"
            >
              Continue without account
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes popUp {
          from { opacity: 0; transform: translateY(24px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default WelcomeModal