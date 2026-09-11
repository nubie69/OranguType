export const practiceCategories = ['english', 'numbers', 'punctuation', 'code', 'quotes'] as const
export type TestCategory = typeof practiceCategories[number]

export const categoryDetails: Record<TestCategory, { label: string; unit: string; description: string }> = {
  english: { label: 'English', unit: 'words', description: 'Common English words.' },
  numbers: { label: 'Numbers', unit: 'groups', description: 'Groups of two to six digits.' },
  punctuation: { label: 'Punctuation', unit: 'words', description: 'Words with punctuation and symbols. Use Shift when needed.' },
  code: { label: 'Code', unit: 'snippets', description: 'Short JavaScript snippets. Type spaces and symbols exactly as shown.' },
  quotes: { label: 'Quotes', unit: 'sentences', description: 'Original practice sentences with capitals and punctuation.' },
}

export type TestSettings = {
  category: TestCategory
  mode: 'time' | 'words'
  time: 15 | 30 | 60 | 120
  words: 10 | 25 | 50 | 100
}
