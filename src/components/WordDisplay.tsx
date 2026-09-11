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
  return (
    <div
      role="region"
      aria-label="Sample typing words"
      className="w-full min-w-0"
    >
      {/* Keep three complete lines visible as the words wrap at each screen size. */}
      <p className="h-[6em] overflow-hidden font-mono text-xl leading-[2] text-[var(--color-text-secondary)] sm:text-2xl lg:text-3xl">
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
