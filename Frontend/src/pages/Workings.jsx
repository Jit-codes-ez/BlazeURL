import { Link2, MousePointerClick, BarChart3, User, Globe, Server,
  ArrowRight, Shield, Zap, Clock, QrCode, Trash2, Route } from 'lucide-react'

import GlassCard from '../components/GlassCard'

const STEPS = [
  {
    icon: Link2,
    step: '01',
    title: 'Paste your link',
    desc: 'Drop any long URL into the app — add an optional alias, label, and expiry time.',
  },
  {
    icon: Zap,
    step: '02',
    title: 'We shorten it instantly',
    desc: 'A unique short code is generated and mapped to your destination on our servers.',
  },
  {
    icon: MousePointerClick,
    step: '03',
    title: 'Share it anywhere',
    desc: 'Use the short link in posts, emails, QR codes — anywhere a clean link matters.',
  },
  {
    icon: BarChart3,
    step: '04',
    title: 'Track every click',
    desc: 'Click counts update in real time on your dashboard. Pause or delete links anytime.',
  },
]

const FEATURES = [
  {
    icon: Clock,
    title: 'Smart expiry',
    desc: 'Set links to expire after 2 days, 15 days, a month — or let them live forever. Expired links are cleaned up automatically.',
  },
  {
    icon: QrCode,
    title: 'Instant QR codes',
    desc: 'Every short link can become a scannable QR code — perfect for print, packaging, and offline campaigns.',
  },
  {
    icon: Shield,
    title: 'Private by default',
    desc: 'Your links belong to your account. Nobody sees your dashboard, your labels, or your analytics but you.',
  },
  {
    icon: Trash2,
    title: 'Full control',
    desc: 'Pause, rename, or delete any link at any time. Deleted links stop redirecting immediately.',
  },
]

function DiagramNode({ icon: Icon, label, sub, accent }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`flex h-16 w-16 items-center justify-center rounded-2xl border ${
          accent
            ? 'border-(--accent)/40 bg-(--accent)/15 text-(--accent) shadow-lg shadow-(--accent)/20'
            : 'border-(--border-subtle) bg-(--bg-page) text-(--text-secondary)'
        }`}
      >
        <Icon size={26} />
      </div>

      <p className="mt-3 text-sm font-bold text-(--text-primary)">
        {label}
      </p>

      <p className="text-xs text-(--text-secondary)">
        {sub}
      </p>
    </div>
  )
}

function Connector({ label }) {
  return (
    <div className="flex flex-col items-center sm:mx-4 sm:min-w-24">
      <div className="relative hidden h-px w-full items-center sm:flex">
        <span className="h-px w-full bg-gradient-to-r from-transparent via-(--accent)/50 to-transparent" />

        <ArrowRight
          size={14}
          className="absolute -right-1 top-1/2 -translate-y-1/2 text-(--accent)"
        />

        {label && (
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-(--border-subtle) bg-(--bg-card) px-2 py-0.5 text-[10px] font-bold text-(--accent)">
            {label}
          </span>
        )}
      </div>

      <ArrowRight
        size={16}
        className="rotate-90 text-(--accent) sm:hidden"
      />
    </div>
  )
}

function FlowDiagram() {
  return (
    <GlassCard className="p-8 sm:p-10">
      <h2 className="text-center font-display text-xl font-bold text-(--text-primary)">
        The journey of a link
      </h2>

      <p className="mt-1 text-center text-sm text-(--text-secondary)">
        From your dashboard to your audience, in one redirect.
      </p>

      {/* Diagram */}
      <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:gap-0">
        <DiagramNode
          icon={User}
          label="You"
          sub="Dashboard"
        />

        <Connector />

        <DiagramNode
          icon={Server}
          label="BlazeURL"
          sub="Redirect service"
          accent
        />

        <Connector label="302" />

        <DiagramNode
          icon={Globe}
          label="Visitor"
          sub="Destination site"
        />
      </div>

      {/* Data packets */}
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          {
            icon: Shield,
            text: 'Short code resolved in milliseconds',
          },
          {
            icon: BarChart3,
            text: 'Click recorded to your analytics',
          },
          {
            icon: Clock,
            text: 'Expiry checked automatically',
          },
        ].map((item) => (
          <div
            key={item.text}
            className="flex items-center gap-3 rounded-xl border border-(--border-subtle) bg-(--bg-page) px-4 py-3"
          >
            <item.icon
              size={16}
              className="shrink-0 text-(--accent)"
            />

            <span className="text-xs font-medium text-(--text-secondary)">
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

export default function HowItWorks() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 pt-24 pb-10 sm:pt-28 sm:pb-14">      {/* Hero */}
      <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-(--accent)/30 bg-(--accent)/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-(--accent)">
            <Route size={14} strokeWidth={2.5} />
            How it works
            </span>

        <h1 className="mt-5 font-display text-3xl font-bold text-(--text-primary) sm:text-4xl">
          Long links in.{' '}
          <span className="text-(--accent)">
            Clean links out.
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm text-(--text-secondary) sm:text-base">
          Everything happens from your dashboard — shorten, customize,
          and track. No clutter, no guess.
        </p>
      </div>

      {/* Flow diagram */}
      <div className="mt-10">
        <FlowDiagram />
      </div>

      {/* Steps */}
      <div className="mt-14">
        <h2 className="text-center font-display text-xl font-bold text-(--text-primary)">
          Four steps. That's it.
        </h2>

        <div className="relative mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line behind cards */}
          <div className="pointer-events-none absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-(--accent)/30 to-transparent lg:block" />

          {STEPS.map((s) => (
            <GlassCard
              key={s.step}
              className="relative p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-(--accent)/15 text-(--accent)">
                  <s.icon size={20} />
                </div>

                <span className="font-display text-2xl font-bold text-(--text-primary)/10">
                  {s.step}
                </span>
              </div>

              <h3 className="mt-4 font-display text-base font-bold text-(--text-primary)">
                {s.title}
              </h3>

              <p className="mt-1.5 text-xs leading-relaxed text-(--text-secondary)">
                {s.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-14">
        <h2 className="text-center font-display text-xl font-bold text-(--text-primary)">
          Built into every link
        </h2>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <GlassCard
              key={f.title}
              className="flex gap-4 p-6"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--accent)/15 text-(--accent)">
                <f.icon size={20} />
              </div>

              <div>
                <h3 className="font-display text-base font-bold text-(--text-primary)">
                  {f.title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-(--text-secondary)">
                  {f.desc}
                </p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* CTA */}
      <GlassCard className="mt-14 p-8 text-center sm:p-10">
        <h2 className="font-display text-xl font-bold text-(--text-primary)">
          Ready to shorten your first link?
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm text-(--text-secondary)">
          Head to your dashboard and create a short URL in under ten
          seconds.
        </p>

        <a
          href="/auth"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-(--accent) px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-(--accent)/20 transition hover:opacity-90"
        >
          Sign In to your dashboard
          <ArrowRight size={16} />
        </a>
      </GlassCard>
    </div>
  )
}