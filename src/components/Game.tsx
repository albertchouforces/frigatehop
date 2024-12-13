import { useEffect, useRef, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameOverlay } from './GameOverlay';
import { StartScreen } from './StartScreen';
import { useGameAssets } from '../hooks/useGameAssets';
import { TouchControls } from './TouchControls';
import { isMobile } from 'react-device-detect';

const CANVAS_ASPECT_RATIO = 800 / 600;
const MAX_CANVAS_WIDTH = 800;

export const Game = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { assetsLoaded, loadAssets } = useGameAssets();
  const { initGame, handleKeyPress } = useGameLogic(canvasRef, setScore, setGameOver);

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return;

      const containerWidth = containerRef.current.clientWidth;
      const maxWidth = Math.min(containerWidth, MAX_CANVAS_WIDTH);
      const height = maxWidth / CANVAS_ASPECT_RATIO;

      setCanvasSize({
        width: maxWidth,
        height: height
      });
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);

  useEffect(() => {
    if (assetsLoaded && gameStarted) {
      initGame();
      
      const handleKeyDown = (e: KeyboardEvent) => {
        handleKeyPress(e.key);
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [initGame, handleKeyPress, assetsLoaded, gameStarted]);

  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  const handleControlPress = (key: string) => {
    if (gameStarted && !gameOver) {
      handleKeyPress(key);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-[800px] mx-auto px-4"
    >
      <div 
        className="relative"
        style={{ 
          paddingBottom: `${(1 / CANVAS_ASPECT_RATIO) * 100}%`,
          touchAction: 'none'
        }}
      >
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="absolute top-0 left-0 w-full h-full border-2 border-gray-300 rounded-lg shadow-lg"
          style={{
            touchAction: 'none'
          }}
        />
        
        <GameOverlay score={score} gameOver={gameOver} />
        
        {!gameStarted && assetsLoaded && (
          <div className="absolute inset-0">
            <StartScreen onStartGame={handleStartGame} />
          </div>
        )}
        
        {!assetsLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
            <div className="text-white text-xl">Loading assets...</div>
          </div>
        )}
      </div>

      {isMobile && gameStarted && !gameOver && (
        <div className="mt-4">
          <TouchControls onControlPress={handleControlPress} />
        </div>
      )}
    </div>
  );
};
