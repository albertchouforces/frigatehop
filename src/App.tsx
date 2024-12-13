import './index.css'
import { Game } from './components/Game'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">
        Frigate Hop
      </h1>
      <Game />
      <div className="mt-8 text-gray-300 text-center">
        <p>Avoid the obstacles and reach the finish line to advance!</p>
        <p className="text-sm mt-2">Use arrow keys or on-screen controls to move</p>
      </div>
    </div>
  )
}

export default App
