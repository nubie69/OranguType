import { useEffect, useState } from 'react'
import { getRemainingSeconds } from '../utils/timer'

export default function useCountdown(duration: number | null, startedAt: number | null) {
  const [now, setNow] = useState(() => performance.now())

  useEffect(() => {
    // No ticking on page load or in Words mode.
    if (duration === null || startedAt === null) return

    setNow(performance.now())
    const interval = window.setInterval(() => {
      const currentTime = performance.now()
      setNow(currentTime)
      if (getRemainingSeconds(duration, startedAt, currentTime) === 0) {
        window.clearInterval(interval)
      }
    }, 100)

    return () => window.clearInterval(interval)
  }, [duration, startedAt])

  return duration === null ? null : getRemainingSeconds(duration, startedAt, now)
}
