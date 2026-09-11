import type { CharacterState } from '../types/character.ts'

export function updateTypedCharacters(
  typed: readonly string[],
  key: string,
  characterCount: number,
): readonly string[] {
  if (key === 'Backspace') return typed.slice(0, -1)
  if (Array.from(key).length !== 1 || typed.length >= characterCount) return typed
  return [...typed, key]
}

export function getTypingProgress(words: readonly string[], typed: readonly string[]) {
  const characters = Array.from(words.join(' '))
  const position = Math.min(typed.length, characters.length)
  const characterStates: CharacterState[] = characters.map((character, index) => {
    if (index < position) return typed[index] === character ? 'correct' : 'incorrect'
    return index === position ? 'current' : 'untyped'
  })
  const preceding = characters.slice(0, position)

  return {
    characterStates,
    position,
    currentWordIndex: preceding.filter((character) => character === ' ').length,
    currentCharacterIndex: position - (preceding.lastIndexOf(' ') + 1),
    isComplete: position === characters.length,
  }
}
