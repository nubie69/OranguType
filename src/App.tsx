import { useCallback, useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Stats from './pages/Stats'
import { parseResults, statsStorageKey } from './utils/stats'
import type { TestResult } from './utils/stats'

export default function App() {
  const [page, setPage] = useState(() => window.location.hash)
  const [results, setResults] = useState<TestResult[]>(() => {
    try { return parseResults(localStorage.getItem(statsStorageKey)) } catch { return [] }
  })
  const [storageError, setStorageError] = useState(false)
  useEffect(() => {
    const navigate = () => setPage(window.location.hash)
    window.addEventListener('hashchange', navigate)
    return () => window.removeEventListener('hashchange', navigate)
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem(statsStorageKey, JSON.stringify(results))
      setStorageError(false)
    } catch { setStorageError(true) }
  }, [results])
  const saveResult = useCallback((result: TestResult) => {
    setResults(previous => [result, ...previous.filter(item => item.id !== result.id)].slice(0, 100))
  }, [])
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar page={page} />
      {page === '#stats' || page === '#history'
        ? <Stats results={results} history={page === '#history'} storageError={storageError} />
        : <Home onComplete={saveResult} />}
    </div>
  )
}
