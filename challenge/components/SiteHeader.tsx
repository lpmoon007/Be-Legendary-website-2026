import { SnailMark } from "./Logo";

// Sticky, blurred dark header. Static — no interactivity needed.
export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-white/5"
      style={{
        background: "var(--bg-dark-nav)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      <div className="mx-auto flex max-w-shell items-center justify-between px-6 py-4">
        <a href="/" className="flex items-center gap-3 text-ink-light">
          <SnailMark className="h-7 w-9 text-accent-light" />
          <span className="font-serif text-lg font-500 tracking-wide">
            Be Legendary
          </span>
        </a>
        <nav className="flex items-center gap-6 text-sm font-600 text-ink-light/80">
          <a
            href="https://www.belegendary.org/"
            className="hidden transition-colors hover:text-ink-light sm:inline"
          >
            Mindset Workouts
          </a>
          <a href="#signup" className="btn-cta !px-4 !py-2 !text-sm !shadow-none">
            Start
          </a>
        </nav>
      </div>
    </header>
  );
}
