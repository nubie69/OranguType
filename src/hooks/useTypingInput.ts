import { useEffect, useState } from 'react'
import { getTypingProgress, updateTypedCharacters } from '../utils/typing'

export default function useTypingInput(words: readonly string[]) {
  const [typedCharacters, setTypedCharacters] = useState<readonly string[]>([])
  const characterCount = Array.from(words.join(' ')).length

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
      setTypedCharacters((typed) => updateTypedCharacters(typed, event.key, characterCount))
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [characterCount])

  return {
    ...getTypingProgress(words, typedCharacters),
    typedCharacters,
    resetInput: () => setTypedCharacters([]),
  }
}
