import { FileText } from 'lucide-react'

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
    content:
      'For questions about these Terms, please contact us at support@blazeurl.com.',
  },
]

function TermsAndConditions() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {/* Header */}
      <div
        className="mb-10 flex flex-col items-center text-center"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--border-subtle) bg-(--bg-header)">
          <FileText size={24} className="text-(--accent)" />
        </div>
        <h1 className="text-3xl font-bold text-(--text-primary)">Terms & Conditions</h1>
        <p className="mt-2 text-sm text-(--text-secondary)">Last updated: September 2026</p>
      </div>

      {/* Sections */}
      <div className="flex flex-col gap-8">
        {sections.map((s, i) => (
          <div
            key={s.title}
            style={{ animation: `popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) ${0.05 * i}s both` }}
          >
            <h2 className="mb-2 text-base font-semibold text-(--text-primary)">{s.title}</h2>
            <p className="text-sm leading-relaxed text-(--text-secondary)">{s.content}</p>
          </div>
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
