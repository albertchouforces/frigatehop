import './index.css'
import { Game } from './components/Game'

function App() {
  return (
    <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center bg-gray-900 overflow-hidden">
      <h1 className="text-3xl font-bold mb-4 text-white px-4">
        Frigate Hop
      </h1>
      <Game />
      <div className="mt-4 text-gray-300 text-center max-w-md px-4">
        <p>Avoid the obstacles and reach the finish line to advance!</p>
        <p className="text-sm mt-2">Use arrow keys or on-screen controls to move</p>
      </div>
    </div>
  )
}

export default App
