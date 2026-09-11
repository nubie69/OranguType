export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-6 py-12 sm:py-16">
      <section
        aria-labelledby="typing-test-heading"
        className="w-full min-w-0 max-w-4xl space-y-6 sm:space-y-8"
      >
        <h1
          id="typing-test-heading"
          className="text-center text-2xl font-semibold tracking-tight sm:text-3xl"
        >
          Typing test
        </h1>
        <div className="flex min-h-64 items-center justify-center rounded-2xl border border-[var(--color-text-secondary)]/20 p-6 sm:min-h-80 sm:p-10">
          <p className="max-w-sm text-center text-sm leading-relaxed text-[var(--color-text-secondary)] sm:text-base">
            Your typing test will appear here.
          </p>
        </div>
      </section>
    </main>
  )
}
