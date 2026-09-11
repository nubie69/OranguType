import { useEffect, useState } from 'react'
import { createTypingSession, getTypingProgress, updateTypingSession } from '../utils/typing'
import type { TypingSession } from '../utils/typing'
import { getTestStatus } from '../utils/timer'
import useCountdown from './useCountdown'

export default function useTypingInput(words: readonly string[], duration: number | null = null) {
  const [session, setSession] = useState<TypingSession>(createTypingSession)
  const { typedCharacters, startedAt } = session
  const characterCount = Array.from(words.join(' ')).length
  const remainingSeconds = useCountdown(duration, startedAt)
  const status = session.finishedAt !== undefined ? 'finished' : getTestStatus(startedAt, remainingSeconds)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.isComposing || event.keyCode === 229
        || event.ctrlKey || event.metaKey || event.altKey) return

      // Leave form controls, navigation, and editable content to the browser.
      const target = event.target
      if (target instanceof HTMLElement && (
        target.isContentEditable
        || target.closest('input, textarea, select, button, a, [role="button"], [role="textbox"]')
      )) return

      if (event.key !== 'Backspace' && Array.from(event.key).length !== 1) return

      event.preventDefault()
      const now = performance.now()
      setSession((current) => updateTypingSession(current, event.key, characterCount, now, duration, true))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [characterCount, duration])

  return {
    ...getTypingProgress(words, typedCharacters, status === 'finished'),
    status,
    remainingSeconds,
    typedCharacters,
    startedAt,
    elapsedSeconds: startedAt === null ? 0 : session.finishedAt !== undefined
      ? Math.max(0.001, (session.finishedAt - startedAt) / 1000)
      : status === 'finished' ? duration ?? 0 : 0,
    resetInput: () => setSession(createTypingSession()),
  }
}
