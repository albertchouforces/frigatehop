import './index.css'
import { Game } from './components/Game'

function App() {
  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
      <h1 className="text-3xl font-bold mb-2 text-white px-4 mt-safe">
        Frigate Hop
      </h1>
      <Game />
      <div className="mt-2 mb-safe text-gray-300 text-center max-w-md px-4">
        <p>Avoid the obstacles and reach the finish line to advance!</p>
        <p className="text-sm mt-1">Use arrow keys or on-screen controls to move</p>
      </div>
    </div>
  )
}

export default App
