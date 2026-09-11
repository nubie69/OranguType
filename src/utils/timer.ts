/** Use elapsed time so delayed browser callbacks cannot slow down the countdown. */
export function getRemainingSeconds(duration: number, startedAt: number | null, now: number) {
  if (startedAt === null) return duration
  const elapsedSeconds = Math.max(0, now - startedAt) / 1000
  return Math.max(0, Math.ceil(duration - elapsedSeconds))
}
