import { useLayoutEffect, useRef } from 'react'
import Character from './Character'
import type { CharacterState } from '../types/character'

type WordDisplayProps = {
  words: readonly string[]
  /** Indexed by Unicode code point in words.join(' '), including spaces. */
  characterStates?: readonly CharacterState[]
}

export default function WordDisplay({
  words,
  characterStates = [],
}: WordDisplayProps) {
  const wordsRef = useRef<HTMLParagraphElement>(null)
  const currentPosition = characterStates.indexOf('current')

  useLayoutEffect(() => {
    const viewport = wordsRef.current
    if (!viewport) return
    if (currentPosition === 0) {
      viewport.scrollTop = 0
      return
    }
    const current = viewport.querySelector<HTMLElement>('[data-state="current"]')
    if (!current) return
    const viewportBounds = viewport.getBoundingClientRect()
    const characterBounds = current.getBoundingClientRect()
    const lineHeight = Number.parseFloat(getComputedStyle(viewport).lineHeight)
    if (characterBounds.bottom > viewportBounds.bottom) viewport.scrollTop += lineHeight
    if (characterBounds.top < viewportBounds.top) viewport.scrollTop -= lineHeight
  }, [currentPosition])

  return (
    <div
      role="region"
      aria-label="Typing words. Type to begin. Use Backspace to correct."
      tabIndex={0}
      onClick={(event) => event.currentTarget.focus()}
      className="w-full min-w-0 rounded-sm"
    >
      {/* Keep three complete lines visible as the words wrap at each screen size. */}
      <p ref={wordsRef} className="h-[6em] overflow-hidden font-mono text-xl leading-[2] text-[var(--color-text-secondary)] sm:text-2xl lg:text-3xl">
        {Array.from(words.join(' ')).map((character, index) => (
          <Character
            key={index}
            character={character}
            state={characterStates[index] ?? 'untyped'}
          />
        ))}
      </p>
    </div>
  )
}
