import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="border-t border-(--border-subtle) bg-(--bg-header) backdrop-blur-xl transition-colors duration-300">
      <div className="mx-auto max-w-300 px-5 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
          <a href="/" className="flex items-center">
            <img src="/blazeurl-logo.png" alt="BlazeURL" className="h-12 w-auto" />
          </a>

            <p className="mt-3 max-w-sm text-sm leading-1 text-(--text-secondary)">
              Fast, Reliable & Concise.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-sm text-(--text-secondary)">

            <Link
              to="#"
              className="transition-colors hover:text-(--text-primary)"
            >
              Privacy
            </Link>

            <Link
              to = "#"
              className="transition-colors hover:text-(--text-primary)"
            >
              Terms & Conditions
            </Link>

          </div>
        </div>

        <div className="mt-8 border-t border-(--border-subtle) pt-6">
          <p className="text-center text-xs text-(--text-secondary)">
            © {new Date().getFullYear()} BlazeURL. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer