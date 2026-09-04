import { Link } from 'react-router-dom'
import {
  BarChart3,
  Gauge,
  LockKeyhole,
  QrCode,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import WelcomeLayout from '../components/WelcomeLayout'
import GlassCard from '../components/GlassCard'
import UrlShortener from '../components/UrlShortener'

const features = [
  {
    icon: Zap,
    title: 'Blazing Fast',
    description:
      'Create short links instantly with a lightweight and responsive experience.',
    color: 'text-(--accent)',
  },
  {
    icon: BarChart3,
    title: 'Powerful Analytics',
    description:
      'Track clicks and understand how your links are performing.',
    color: 'text-amber-500',
  },
  {
    icon: ShieldCheck,
    title: 'Secure Links',
    description:
      'Keep your links reliable with secure infrastructure and controlled access.',
    color: 'text-(--accent-contrast)',
  },
  {
    icon: QrCode,
    title: 'QR Codes',
    description:
      'Turn your shortened links into QR codes whenever you need them.',
    color: 'text-rose-500',
  },
  {
    icon: LockKeyhole,
    title: 'Protected URLs',
    description:
      'Support advanced link controls for private and protected destinations.',
    color: 'text-(--accent)',
  },
  {
    icon: Gauge,
    title: 'Simple Dashboard',
    description:
      'Manage your links and view important metrics from one clean workspace.',
    color: 'text-amber-500',
  },
]

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <WelcomeLayout />
      <div className="relative z-10">

        <main>
          <section className="mx-auto flex min-h-screen max-w-300 items-center px-5 pb-20 pt-32 sm:px-6 lg:px-8">
            <div className="mx-auto w-full max-w-4xl text-center">
              <div className="animate-fade-up">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-(--accent)/20 bg-(--accent)/10 px-4 py-2 text-xs font-medium text-(--accent) backdrop-blur-xl">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                  The simple way to manage your links
                </div>
                <div className="relative">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 -z-10 bg-(--accent)/20 blur-[80px]"
                />
                <h1 className="relative font-display text-[42px] font-bold leading-[1.1] tracking-[-0.04em] text-(--text-primary) sm:text-[50px] lg:text-[56px]">
                    Shorten your links.
                    <br />
                    <span className="bg-linear-to-r from-(--accent) via-(--gradient-mid) to-(--gradient-end) bg-clip-text text-transparent">
                    Share them anywhere.
                    </span>
                </h1>
                </div>

                <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-(--text-secondary) sm:text-lg">
                  Turn long URLs into short, easy-to-share links with BlazeURL.
                  Fast, simple, and built for the modern web.
                </p>
              </div>

              <div className="mx-auto mt-10 max-w-3xl animate-fade-up">
                <UrlShortener />
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-(--text-secondary)">
                <span>✓ No complicated setup</span>
                <span>✓ Instant shortening</span>
                <span>✓ Built for speed</span>
              </div>
            </div>
          </section>

          <section
            id="features"
            className="mx-auto max-w-300 px-5 py-24 sm:px-6 lg:px-8"
          >
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-(--accent)">
                Everything you need
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-(--text-primary) sm:text-4xl">
                Powerful links without the complexity.
              </h2>

              <p className="mt-4 text-(--text-secondary)">
                A focused toolkit for creating, sharing and understanding your
                shortened links.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <GlassCard key={feature.title} className="p-6">
                    <div
                      className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-(--text-primary)/5 ${feature.color}`}
                    >
                      <Icon size={24} />
                    </div>

                    <h3 className="font-display text-xl font-semibold text-(--text-primary)">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-(--text-secondary)">
                      {feature.description}
                    </p>
                  </GlassCard>
                )
              })}
            </div>
          </section>

          <section className="mx-auto max-w-300 px-5 pb-24 sm:px-6 lg:px-8">
            <GlassCard className="overflow-hidden p-8 text-center sm:p-12">
              <p className="text-sm font-medium text-(--accent)">
                Ready to get started?
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold text-(--text-primary)">
                Make your next link a BlazeURL.
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-(--text-secondary)">
                Create an account to manage your links, monitor performance and
                unlock the full BlazeURL experience.
              </p>

              <Link to="/auth" className="primary-button mt-7 inline-flex">
                Create Free Account
              </Link>
            </GlassCard>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Home