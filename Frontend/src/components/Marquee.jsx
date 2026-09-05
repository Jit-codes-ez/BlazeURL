import { Clock } from "lucide-react"

const MESSAGE =
  "BlazeURL is running on a free server — the first request may take up to a minute to wake up. Thanks for your patience!"

function Marquee() {
  return (
    <div className="pointer-events-none fixed left-0 top-18 z-50 w-full overflow-hidden border-b border-(--border-subtle)">
      <span
        className="animate-marquee inline-flex items-center gap-2 whitespace-nowrap py-1.5 text-xs font-medium"
        style={{ color: "var(--text-secondary)" }}
      >
        <Clock
          className="h-3.5 w-3.5 shrink-0"
          style={{ color: "var(--accent)" }}
        />
        {MESSAGE}
      </span>
    </div>
  )
}

export default Marquee