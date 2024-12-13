import { useEffect, useRef, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameOverlay } from './GameOverlay';
import { StartScreen } from './StartScreen';
import { useGameAssets } from '../hooks/useGameAssets';
import { TouchControls } from './TouchControls';
import { isMobile } from 'react-device-detect';

const CANVAS_ASPECT_RATIO = 800 / 600;

export const Game = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
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
      
      if (isMobile) {
        // On mobile, use the full viewport width and calculate height
        const controlsHeight = 180; // Height reserved for controls
        const availableHeight = viewportHeight - controlsHeight;
        
        // Calculate dimensions maintaining aspect ratio
        let width = viewportWidth;
        let height = width / CANVAS_ASPECT_RATIO;

        // If height exceeds available height, scale based on height
        if (height > availableHeight) {
          height = availableHeight;
          width = height * CANVAS_ASPECT_RATIO;
        }

        setCanvasSize({
          width,
          height
        });
      } else {
        // For desktop, keep the existing logic
        const padding = 32;
        const availableWidth = viewportWidth - padding;
        const availableHeight = viewportHeight - padding;

        let width = Math.min(800, availableWidth);
        let height = width / CANVAS_ASPECT_RATIO;

        if (height > availableHeight) {
          height = availableHeight;
          width = height * CANVAS_ASPECT_RATIO;
        }

        setCanvasSize({
          width,
          height
        });
      }
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
    <div ref={containerRef} style={containerStyle} className="h-[100dvh] overflow-hidden">
      <div style={canvasContainerStyle}>
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
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
        <div className="w-full px-2 pb-safe">
          <TouchControls onControlPress={handleControlPress} />
        </div>
      )}
    </div>
  );
};
