type WordDisplayProps = {
  words: readonly string[]
}

export default function WordDisplay({ words }: WordDisplayProps) {
  return (
    <div
      role="region"
      aria-label="Sample typing words"
      className="w-full min-w-0"
    >
      {/* Keep three complete lines visible as the words wrap at each screen size. */}
      <p className="h-[6em] overflow-hidden font-mono text-xl leading-[2] text-[var(--color-text-secondary)] sm:text-2xl lg:text-3xl">
        {words.join(' ')}
      </p>
    </div>
  )
}
