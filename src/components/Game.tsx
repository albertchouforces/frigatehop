import { useEffect, useRef, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameOverlay } from './GameOverlay';
import { StartScreen } from './StartScreen';
import { useGameAssets } from '../hooks/useGameAssets';
import { TouchControls } from './TouchControls';
import { isMobile } from 'react-device-detect';

const CANVAS_ASPECT_RATIO = 800 / 600;
const MAX_CANVAS_WIDTH = isMobile ? 1200 : 800; // Increased max width for mobile
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

      // Get the viewport dimensions
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate available space with mobile-optimized padding
      const padding = isMobile ? 12 : 16;
      const availableWidth = viewportWidth - (padding * 2);
      // On mobile, reserve more space for controls
      const controlsHeight = isMobile ? 180 : 0;
      const availableHeight = viewportHeight - (padding * 2) - controlsHeight;

      // Calculate dimensions maintaining aspect ratio
      let width = availableWidth;
      let height = width / CANVAS_ASPECT_RATIO;

      // If height exceeds available height, scale based on height instead
      if (height > availableHeight) {
        height = availableHeight;
        width = height * CANVAS_ASPECT_RATIO;
      }

      // Apply max width constraint
      if (width > MAX_CANVAS_WIDTH) {
        width = MAX_CANVAS_WIDTH;
        height = width / CANVAS_ASPECT_RATIO;
      }

      // On mobile, ensure minimum size for playability
      if (isMobile) {
        const minWidth = 320;
        if (width < minWidth) {
          width = minWidth;
          height = width / CANVAS_ASPECT_RATIO;
        }
      }

      setCanvasSize({
        width,
        height
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
    height: '100%',
    maxWidth: `${MAX_CANVAS_WIDTH}px`,
    margin: '0 auto',
    padding: isMobile ? '12px' : '16px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '16px' : '8px',
  };

  const canvasContainerStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  };

  if (!gameStarted && assetsLoaded) {
    return (
      <div ref={containerRef} style={containerStyle}>
        <div style={canvasContainerStyle}>
          <StartScreen onStartGame={handleStartGame} />
        </div>
      </div>
    );
  }

  if (!assetsLoaded) {
    return (
      <div ref={containerRef} style={containerStyle}>
        <div style={canvasContainerStyle}>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <div className="text-white text-xl">Loading assets...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={canvasContainerStyle}>
        <canvas
          ref={canvasRef}
          width={BASE_CANVAS_WIDTH}
          height={BASE_CANVAS_HEIGHT}
          className="border-2 border-gray-300 rounded-lg shadow-lg"
          style={{
            touchAction: 'none',
            width: canvasSize.width,
            height: canvasSize.height,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain'
          }}
        />
        <GameOverlay score={score} gameOver={gameOver} />
      </div>

      {isMobile && gameStarted && !gameOver && (
        <div className="w-full max-w-[500px] px-2">
          <TouchControls onControlPress={handleControlPress} />
        </div>
      )}
    </div>
  );
};
