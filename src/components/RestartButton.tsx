export default function RestartButton() {
  return (
    <button
      type="button"
      aria-label="Restart test (coming soon)"
      aria-disabled="true"
      title="Restart test (coming soon)"
      className="group flex size-11 cursor-default items-center justify-center rounded-lg text-[var(--color-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] focus-visible:text-[var(--color-accent)] motion-reduce:transition-none"
    >
      <svg
        aria-hidden="true"
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="transition-transform duration-300 ease-out group-hover:-rotate-45 group-focus-visible:-rotate-45 motion-reduce:transform-none motion-reduce:transition-none"
      >
        <path d="M3 10a9 9 0 1 1 2.6 8.4" />
        <path d="M3 4v6h6" />
      </svg>
    </button>
  )
}
