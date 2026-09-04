import { useState, useEffect, useRef, useId } from 'react'
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

// module scope — shared across every instance of this component
let activeInstance = null

export default function WelcomeModal() {
  const [state, setState] = useState('hidden')
  const dismissed = useRef(false)
  const instanceId = useId()

  useEffect(() => {
    const t = setTimeout(() => {
      if (sessionStorage.getItem('bwseen')) return
      if (activeInstance && activeInstance !== instanceId) {
        // another instance already claimed the modal — don't open a second one
        return
      }
      activeInstance = instanceId
      setState('open')
    }, 50)
    return () => {
      clearTimeout(t)
      if (activeInstance === instanceId) activeInstance = null
    }
  }, [instanceId])

  const dismiss = (then) => {
    if (dismissed.current) return
    dismissed.current = true
    sessionStorage.setItem('bwseen', '1')
    if (activeInstance === instanceId.current) activeInstance = null
    setState('closing')
    setTimeout(() => {
      setState('hidden')
      if (typeof then === 'function') then()
    }, 380)
  }

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') dismiss() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  if (state === 'hidden') return null

  const closing = state === 'closing'

  return (
    <>
      <style>{`
        @keyframes wmBgIn  { from{opacity:0} to{opacity:1} }
        @keyframes wmBgOut { from{opacity:1} to{opacity:0} }
        @keyframes wmIn  { from{opacity:0;transform:translateY(28px) scale(.93)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes wmOut { from{opacity:1;transform:translateY(0) scale(1)} to{opacity:0;transform:translateY(18px) scale(.95)} }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={(e) => { e.stopPropagation(); dismiss() }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
          animation: closing ? 'wmBgOut 0.38s ease forwards' : 'wmBgIn 0.3s ease forwards',
        }}
      >
        {/* Modal */}
        <div
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%', maxWidth: 440,
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.10)',
            background: '#0f0f0f',
            boxShadow: '0 32px 80px rgba(0,0,0,0.65)',
            overflow: 'hidden',
            animation: closing
              ? 'wmOut 0.38s cubic-bezier(0.4,0,1,1) forwards'
              : 'wmIn 0.45s cubic-bezier(0.22,1,0.36,1) forwards',
          }}
        >
          {/* Accent bar */}
          <div style={{ height: 3, background: 'linear-gradient(90deg,transparent,var(--accent),transparent)', opacity: .85 }} />

          {/* Close button */}
          <button
            onClick={() => dismiss()}
            style={{
              position: 'absolute', top: 14, right: 14,
              width: 30, height: 30, borderRadius: '50%',
              border: 'none', background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.45)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <X size={14} />
          </button>

          <div style={{ padding: 28 }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 22 }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, margin: '0 auto 14px',
                background: 'rgba(249,115,22,0.14)',
                boxShadow: '0 0 0 1px rgba(249,115,22,0.28)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Zap size={22} color="var(--accent)" />
              </div>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.3px' }}>
                Welcome to BlazeURL
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: 'rgba(255,255,255,0.42)' }}>
                Here's what you can do — with or without an account.
              </p>
            </div>

            {/* Columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>

              <div style={{ borderRadius: 14, border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)', padding: 14 }}>
                <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.30)' }}>No account</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {freeFeatures.map(({ icon, text }) => (
                    <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.60)' }}>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderRadius: 14, border: '1px solid rgba(249,115,22,0.22)', background: 'rgba(249,115,22,0.08)', padding: 14 }}>
                <p style={{ margin: '0 0 10px', fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent)' }}>✦ With account</p>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 9 }}>
                  {proFeatures.map(({ icon, text }) => (
                    <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ width: 24, height: 24, borderRadius: 7, background: 'rgba(249,115,22,0.15)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a
                href="/auth"
                onClick={e => { e.preventDefault(); dismiss(() => { window.location.href = '/auth' }) }}
                className="primary-button"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textDecoration: 'none', borderRadius: 13, padding: '13px 20px', fontSize: 14 }}
              >
                <LogIn size={14} /> Continue with Google
              </a>
              <button
                onClick={() => dismiss()}
                style={{ padding: 12, borderRadius: 13, border: 'none', background: 'transparent', fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.35)', cursor: 'pointer' }}
              >
                Continue without account
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}