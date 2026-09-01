import { FileText } from 'lucide-react'
import GlassCard from '../components/GlassCard'

const sections = [
  {
    title: 'Acceptance of Terms',
    content:
      'By using BlazeURL, you agree to these Terms and Conditions. If you do not agree, please do not use the service.',
  },
  {
    title: 'Use of the Service',
    content:
      'BlazeURL is provided for lawful purposes only. You may not use BlazeURL to shorten URLs that lead to illegal content, malware, phishing pages, spam, or any content that violates applicable laws or third-party rights.',
  },
  {
    title: 'Link Expiry',
    content:
      'Links created without an account expire after 48 hours. BlazeURL is not responsible for any loss resulting from link expiry. Sign in to create permanent links.',
  },
  {
    title: 'Account Responsibility',
    content:
      'If you create an account, you are responsible for maintaining the confidentiality of your credentials and for all activity that occurs under your account.',
  },
  {
    title: 'Prohibited Content',
    content:
      'You may not use BlazeURL to distribute links to adult content, hate speech, violence, malware, or any other content we deem harmful. We reserve the right to remove any link and suspend any account at our discretion.',
  },
  {
    title: 'Disclaimer of Warranties',
    content:
      'BlazeURL is provided "as is" without warranties of any kind. We do not guarantee uptime, availability, or that the service will be error-free.',
  },
  {
    title: 'Limitation of Liability',
    content:
      'BlazeURL and its creators shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service.',
  },
  {
    title: 'Changes to Terms',
    content:
      'We reserve the right to modify these terms at any time. Continued use of BlazeURL after changes are posted constitutes your acceptance of the new terms.',
  },
  {
  title: 'Contact',
  content: (
    <>
      For questions about these Terms, please mail the developer at{' '}
      <a href="mailto:jithazra00@gmail.com" className="text-(--accent) hover:underline">
        jithazra00@gmail.com
      </a>.
    </>
  ),
},
]

function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 pt-28">

      {/* Header */}
      <div
        className="mb-12 flex flex-col items-center text-center"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <GlassCard className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-(--accent)/30 bg-(--accent)/10">
          <FileText size={30} className="text-(--accent)" />
        </GlassCard>
        <h1 className="text-4xl font-bold text-(--text-primary)">Terms & Conditions</h1>
        <p className="mt-3 max-w-md text-sm text-(--text-secondary)">
          Please read these terms carefully before using BlazeURL. By accessing the service, you agree to be bound by them.
        </p>
        <div className="mt-4 rounded-full border border-(--border-subtle) bg-(--bg-header) px-4 py-1.5 text-xs text-(--text-secondary)">
          Last updated: September 2026
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-4">
        {sections.map((s, i) => (
          <GlassCard
            key={s.title}
            className="p-6"
            style={{ animation: `popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) ${0.04 * i}s both` }}
          >
            <div className="flex items-start gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-(--accent)/15 text-xs font-bold text-(--accent)">
                {i + 1}
              </span>
              <div>
                <h2 className="mb-1.5 text-sm font-semibold text-(--text-primary)">{s.title}</h2>
                <p className="text-sm leading-relaxed text-(--text-secondary)">{s.content}</p>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <style>{`
        @keyframes popUp {
          from { opacity: 0; transform: translateY(14px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

export default TermsAndConditions
