export type TestCategory = 'english' | 'numbers'

export type TestSettings = {
  category: TestCategory
  mode: 'time' | 'words'
  time: 15 | 30 | 60 | 120
  words: 10 | 25 | 50 | 100
}
