export default function Navbar() {
  return (
    <header className="border-b border-[var(--color-text-secondary)]/20 bg-[var(--color-background)]">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-6 py-4"
      >
        <a
          href="/"
          aria-label="TypeLab home"
          className="flex items-center gap-3 rounded-sm text-[var(--color-text-primary)]"
        >
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-lg bg-[var(--color-accent)] font-bold tracking-tight text-[var(--color-background)]"
          >
            TL
          </span>
          <span className="text-xl font-semibold tracking-tight">TypeLab</span>
        </a>

        <ul className="order-last flex w-full items-center justify-center gap-8 text-sm font-medium sm:order-none sm:w-auto sm:justify-start">
          <li>
            <a
              href="/"
              aria-current="page"
              className="inline-flex min-h-11 items-center rounded-sm text-[var(--color-accent)]"
            >
              Type
            </a>
          </li>
          <li>
            <a
              href="#stats"
              className="inline-flex min-h-11 items-center rounded-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
            >
              Stats
            </a>
          </li>
          <li>
            <a
              href="#history"
              className="inline-flex min-h-11 items-center rounded-sm text-[var(--color-text-secondary)] transition-colors hover:text-[var(--color-accent)]"
            >
              History
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            aria-label="Theme (coming soon)"
            title="Theme (coming soon)"
            className="flex size-11 cursor-default items-center justify-center rounded-lg text-[var(--color-text-secondary)]"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.9 13.2A9 9 0 0 1 10.8 3.1 9 9 0 1 0 20.9 13.2Z" />
            </svg>
          </button>
          <button
            type="button"
            disabled
            aria-label="Settings (coming soon)"
            title="Settings (coming soon)"
            className="flex size-11 cursor-default items-center justify-center rounded-lg text-[var(--color-text-secondary)]"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 3-.5 2-2 1-2-.5-2 3.5L4 10.5v3L2.5 15l2 3.5 2-.5 2 1 .5 2h6l.5-2 2-1 2 .5 2-3.5-1.5-1.5v-3L21.5 9l-2-3.5-2 .5-2-1-.5-2Z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  )
}
