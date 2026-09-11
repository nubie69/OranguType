type TimerDisplayProps = {
  seconds: number
}

export default function TimerDisplay({ seconds }: TimerDisplayProps) {
  return (
    <output
      aria-label="Selected test duration"
      className="block text-center font-mono text-3xl tabular-nums text-[var(--color-accent)] sm:text-4xl"
    >
      {seconds}
      <span className="sr-only"> seconds</span>
    </output>
  )
}
