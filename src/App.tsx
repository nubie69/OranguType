import Navbar from './components/Navbar'
import Home from './pages/Home'

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />
      <Home />
    </div>
  )
}
