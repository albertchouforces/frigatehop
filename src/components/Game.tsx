import { useEffect, useRef, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameOverlay } from './GameOverlay';
import { StartScreen } from './StartScreen';
import { useGameAssets } from '../hooks/useGameAssets';
import { TouchControls } from './TouchControls';
import { isMobile } from 'react-device-detect';

const CANVAS_ASPECT_RATIO = 800 / 600;
const MAX_CANVAS_WIDTH = 800;
const BASE_CANVAS_WIDTH = 800;
const BASE_CANVAS_HEIGHT = 600;

export const Game = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: BASE_CANVAS_WIDTH, height: BASE_CANVAS_HEIGHT });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const { assetsLoaded, loadAssets } = useGameAssets();
  const { initGame, handleKeyPress } = useGameLogic(canvasRef, setScore, setGameOver, canvasSize);

  useEffect(() => {
    loadAssets();
  }, []);

  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return;

      // Get the viewport width and account for padding
      const viewportWidth = Math.min(window.innerWidth, window.document.documentElement.clientWidth);
      const padding = isMobile ? 16 : 32; // Less padding on mobile
      const availableWidth = viewportWidth - (padding * 2);
      
      // Determine the maximum width while respecting constraints
      const maxWidth = Math.min(availableWidth, MAX_CANVAS_WIDTH);
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

  const containerStyle = {
    width: '100%',
    maxWidth: `${MAX_CANVAS_WIDTH}px`,
    margin: '0 auto',
    padding: isMobile ? '8px' : '16px',
  };

  const wrapperStyle = {
    position: 'relative' as const,
    width: '100%',
    paddingBottom: `${(1 / CANVAS_ASPECT_RATIO) * 100}%`,
  };

  const contentStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  if (!gameStarted && assetsLoaded) {
    return (
      <div ref={containerRef} style={containerStyle}>
        <div style={wrapperStyle}>
          <div style={contentStyle}>
            <StartScreen onStartGame={handleStartGame} />
          </div>
        </div>
      </div>
    );
  }

  if (!assetsLoaded) {
    return (
      <div ref={containerRef} style={containerStyle}>
        <div style={wrapperStyle}>
          <div style={contentStyle} className="bg-gray-900/50">
            <div className="text-white text-xl">Loading assets...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={wrapperStyle}>
        <canvas
          ref={canvasRef}
          width={BASE_CANVAS_WIDTH}
          height={BASE_CANVAS_HEIGHT}
          className="absolute top-0 left-0 w-full h-full border-2 border-gray-300 rounded-lg shadow-lg"
          style={{
            touchAction: 'none',
            width: canvasSize.width,
            height: canvasSize.height
          }}
        />
        
        <GameOverlay score={score} gameOver={gameOver} />
      </div>

      {isMobile && gameStarted && !gameOver && (
        <div className="mt-4">
          <TouchControls onControlPress={handleControlPress} />
        </div>
      )}
    </div>
  );
};
