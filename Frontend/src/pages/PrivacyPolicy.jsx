import { Shield } from 'lucide-react'

const sections = [
  {
    title: 'Information We Collect',
    content:
      'When you shorten a URL, we store the original URL, the generated short code, and the expiry timestamp. If you create an account, we also store your email address. We do not collect any personally identifiable information beyond what is necessary to provide the service.',
  },
  {
    title: 'How We Use Your Information',
    content:
      'We use the information solely to operate BlazeURL — to redirect short links to their destinations, enforce expiry, and associate links with your account if you are signed in. We do not sell, rent, or share your data with third parties for marketing purposes.',
  },
  {
    title: 'Link Expiry & Data Retention',
    content:
      'Links created without an account expire after 48 hours and are permanently deleted from our database 3 days after expiry. Links created by signed-in users are retained until manually deleted by the user or the account is closed.',
  },
  {
    title: 'Cookies',
    content:
      'BlazeURL uses minimal cookies strictly necessary for session management when you are signed in. We do not use tracking or advertising cookies.',
  },
  {
    title: 'Third-Party Services',
    content:
      'We use Supabase for database hosting. Your data is stored securely on their infrastructure. Please refer to Supabase\'s privacy policy for details on how they handle data.',
  },
  {
    title: 'Security',
    content:
      'We take reasonable technical measures to protect your data. However, no system is completely secure. Please do not shorten URLs containing sensitive personal information.',
  },
  {
    title: 'Changes to This Policy',
    content:
      'We may update this policy from time to time. Continued use of BlazeURL after changes are posted constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact',
    content:
      'If you have any questions about this Privacy Policy, please reach out to us at support@blazeurl.com.',
  },
]

function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {/* Header */}
      <div
        className="mb-10 flex flex-col items-center text-center"
        style={{ animation: 'popUp 0.45s cubic-bezier(0.34,1.56,0.64,1) both' }}
      >
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-(--border-subtle) bg-(--bg-header)">
          <Shield size={24} className="text-(--accent)" />
        </div>
        <h1 className="text-3xl font-bold text-(--text-primary)">Privacy Policy</h1>
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

export default PrivacyPolicy
