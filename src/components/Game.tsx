import { useEffect, useRef, useState } from 'react';
import { useGameLogic } from '../hooks/useGameLogic';
import { GameOverlay } from './GameOverlay';
import { StartScreen } from './StartScreen';
import { useGameAssets } from '../hooks/useGameAssets';
import { TouchControls } from './TouchControls';
import { isMobile } from 'react-device-detect';

// Base canvas dimensions
const BASE_CANVAS_WIDTH = 800;
const BASE_CANVAS_HEIGHT = 600;
const ASPECT_RATIO = BASE_CANVAS_WIDTH / BASE_CANVAS_HEIGHT;

// Mobile-optimized constants
const MOBILE = {
  MIN_WIDTH: 320,
  CONTROLS_HEIGHT: 140,
  PADDING: 4,
  MAX_WIDTH: 1200, // For tablets
};

// Desktop constants
const DESKTOP = {
  PADDING: 16,
  MAX_WIDTH: 800,
};

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

  // Mobile-first canvas sizing logic
  useEffect(() => {
    const updateCanvasSize = () => {
      if (!containerRef.current) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Use mobile or desktop constants based on device
      const { PADDING, MAX_WIDTH } = isMobile ? MOBILE : DESKTOP;
      
      // Calculate available space
      let availableWidth = Math.min(viewportWidth - (PADDING * 2), MAX_WIDTH);
      const controlsSpace = isMobile ? MOBILE.CONTROLS_HEIGHT : 0;
      let availableHeight = viewportHeight - (PADDING * 2) - controlsSpace;

      // Account for header and footer space in mobile
      if (isMobile) {
        availableHeight -= 140; // Approximate space for header and footer
      }

      let width: number;
      let height: number;

      if (isMobile) {
        // Mobile-first: maximize width first
        width = Math.max(MOBILE.MIN_WIDTH, availableWidth);
        height = width / ASPECT_RATIO;

        // If height exceeds available space, scale down proportionally
        if (height > availableHeight) {
          height = availableHeight;
          width = height * ASPECT_RATIO;
        }
      } else {
        // Desktop approach
        width = Math.min(availableWidth, DESKTOP.MAX_WIDTH);
        height = width / ASPECT_RATIO;

        if (height > availableHeight) {
          height = availableHeight;
          width = height * ASPECT_RATIO;
        }
      }

      // Round values to prevent subpixel rendering issues
      setCanvasSize({
        width: Math.round(width),
        height: Math.round(height)
      });
    };

    // Initial update
    updateCanvasSize();

    // Handle resize and orientation changes
    const handleResize = () => {
      requestAnimationFrame(updateCanvasSize);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
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
    maxWidth: isMobile ? `${MOBILE.MAX_WIDTH}px` : `${DESKTOP.MAX_WIDTH}px`,
    margin: '0 auto',
    padding: `${isMobile ? MOBILE.PADDING : DESKTOP.PADDING}px`,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    gap: isMobile ? '8px' : '16px',
    flex: 1,
  };

  const canvasContainerStyle = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    touchAction: 'none' as const,
  };

  // Loading state
  if (!assetsLoaded) {
    return (
      <div ref={containerRef} style={containerStyle} className="h-full">
        <div style={canvasContainerStyle}>
          <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg shadow-lg">
            <div className="text-white text-xl">Loading assets...</div>
          </div>
        </div>
      </div>
    );
  }

  // Start screen
  if (!gameStarted) {
    return (
      <div ref={containerRef} style={containerStyle} className="h-full">
        <div style={canvasContainerStyle} className="flex-1">
          <StartScreen onStartGame={handleStartGame} />
        </div>
      </div>
    );
  }

  // Game screen
  return (
    <div ref={containerRef} style={containerStyle} className="h-full">
      <div style={canvasContainerStyle} className="flex-1">
        <canvas
          ref={canvasRef}
          width={BASE_CANVAS_WIDTH}
          height={BASE_CANVAS_HEIGHT}
          className="border-2 border-gray-300/30 rounded-lg shadow-lg"
          style={{
            touchAction: 'none',
            width: canvasSize.width,
            height: canvasSize.height,
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
            imageRendering: 'crisp-edges',
          }}
        />
        <GameOverlay score={score} gameOver={gameOver} />
      </div>

      {isMobile && gameStarted && !gameOver && (
        <div 
          className="w-full px-2" 
          style={{ maxWidth: `${canvasSize.width}px`, height: `${MOBILE.CONTROLS_HEIGHT}px` }}
        >
          <TouchControls onControlPress={handleControlPress} />
        </div>
      )}
    </div>
  );
};
