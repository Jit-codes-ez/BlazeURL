function App() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <nav className="flex items-center justify-between px-8 py-5">
        <h1 className="text-2xl font-bold">BlazeURL</h1>
        <div className="flex gap-6">
          <a href="#" className="text-gray-600 hover:text-black">Login</a>
          <a href="#" className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800">Sign Up</a>
        </div>
      </nav>

      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-blue-600">
          Simple. Fast. Powerful.
        </p>

        <h2 className="max-w-3xl text-5xl font-bold leading-tight md:text-6xl">
          Shorten your links.
          <br />
          <span className="text-blue-600">Share them anywhere.</span>
        </h2>

        <p className="mt-6 max-w-xl text-lg text-gray-500">
          Turn long URLs into short, easy-to-share links with BlazeURL.
        </p>

        <div className="mt-10 flex w-full max-w-2xl flex-col gap-3 sm:flex-row">
          <input
            type="url"
            placeholder="Paste your long URL here..."
            className="flex-1 rounded-xl border border-gray-300 px-5 py-4 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white transition hover:bg-blue-700"
          >
            Shorten URL
          </button>
        </div>

        <div className="mt-8 flex gap-6 text-sm text-gray-500">
          <span>✓ Fast</span>
          <span>✓ Simple</span>
          <span>✓ Reliable</span>
        </div>
      </section>
    </main>
  )
}

export default App