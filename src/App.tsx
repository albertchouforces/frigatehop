import './index.css'
import { Game } from './components/Game'

function App() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
      <h1 className="text-3xl font-bold text-white px-4 pt-safe">
        Frigate Hop
      </h1>
      <Game />
    </div>
  )
}

export default App
