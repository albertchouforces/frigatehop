import { useEffect, useRef, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameOverlay } from './GameOverlay';
import { StartScreen } from './StartScreen';
import { useGameAssets } from '../hooks/useGameAssets';
import { TouchControls } from './TouchControls';
import { isMobile } from 'react-device-detect';

export const Game = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { assetsLoaded, loadAssets } = useGameAssets();
  const { initGame, handleKeyPress } = useGameLogic(canvasRef, setScore, setGameOver);

  useEffect(() => {
    loadAssets();
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

  // Function to handle mobile control presses
  const handleControlPress = (key: string) => {
    if (gameStarted && !gameOver) {
      handleKeyPress(key);
    }
  };

  // Calculate canvas size based on device
  const getCanvasSize = () => {
    if (isMobile) {
      const maxWidth = Math.min(window.innerWidth - 32, 800);
      const aspectRatio = 800 / 600;
      return {
        width: maxWidth,
        height: maxWidth / aspectRatio
      };
    }
    return { width: 800, height: 600 };
  };

  const canvasSize = getCanvasSize();

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        className="border-2 border-gray-300 rounded-lg shadow-lg"
        style={{
          width: canvasSize.width,
          height: canvasSize.height
        }}
      />
      <GameOverlay score={score} gameOver={gameOver} />
      {!gameStarted && assetsLoaded && <StartScreen onStartGame={handleStartGame} />}
      {!assetsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
          <div className="text-white text-xl">Loading assets...</div>
        </div>
      )}
      {isMobile && gameStarted && !gameOver && (
        <TouchControls onControlPress={handleControlPress} />
      )}
    </div>
  );
};
