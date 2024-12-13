import { useCallback, RefObject } from 'react';
import { ASSETS } from './useGameAssets';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: number;
}

export const useGameLogic = (
  canvasRef: RefObject<HTMLCanvasElement>,
  setScore: (score: number) => void,
  setGameOver: (gameOver: boolean) => void
) => {
  let player = {
    x: 400,
    y: 550,
    width: 60,
    height: 30,
  };

  let obstacles: GameObject[] = [];
  let animationFrameId: number;
  let currentScore = 0;
  let goalAnimation = 0;

  const createObstacles = () => {
    const lanes = [100, 200, 300, 400];
    obstacles = lanes.map((y) => ({
      x: Math.random() * 700,
      y,
      width: 80,
      height: 40,
      speed: 2 + Math.random() * 2,
      direction: Math.random() > 0.5 ? 1 : -1,
    }));
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    if (player.direction === 'left') {
      ctx.scale(-1, 1);
      ctx.drawImage(ASSETS.ship, -player.x - player.width, player.y, player.width, player.height);
    } else {
      ctx.drawImage(ASSETS.ship, player.x, player.y, player.width, player.height);
    }
    ctx.restore();
  };

  const drawObstacles = (ctx: CanvasRenderingContext2D) => {
    obstacles.forEach((obstacle) => {
      ctx.drawImage(ASSETS.iceberg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
  };

  const drawGoalZone = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(ASSETS.goal, 0, 0, 800, 50);
    if (goalAnimation > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${goalAnimation})`;
      ctx.fillRect(0, 0, 800, 50);
      goalAnimation -= 0.02;
    }
  };

  const updateObstacles = () => {
    obstacles.forEach((obstacle) => {
      obstacle.x += obstacle.speed * obstacle.direction;
      if (obstacle.x > 800) obstacle.x = -obstacle.width;
      if (obstacle.x < -obstacle.width) obstacle.x = 800;
    });
  };

  const checkCollision = () => {
    return obstacles.some(
      (obstacle) =>
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y
    );
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw water background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#a8d5ff');
    gradient.addColorStop(1, '#015cc7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGoalZone(ctx);
    updateObstacles();
    drawObstacles(ctx);
    drawPlayer(ctx);

    if (checkCollision()) {
      setGameOver(true);
      cancelAnimationFrame(animationFrameId);
      return;
    }

    if (player.y < 50) {
      currentScore += 100;
      setScore(currentScore);
      player.y = 550;
      goalAnimation = 1; // Start goal animation
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }, [canvasRef, setGameOver, setScore]);

  const handleKeyPress = useCallback((key: string) => {
    const moveDistance = 20;
    switch (key) {
      case 'ArrowUp':
        player.y = Math.max(0, player.y - moveDistance);
        break;
      case 'ArrowDown':
        player.y = Math.min(570, player.y + moveDistance);
        break;
      case 'ArrowLeft':
        player.x = Math.max(0, player.x - moveDistance);
        player.direction = 'left';
        break;
      case 'ArrowRight':
        player.x = Math.min(740, player.x + moveDistance);
        player.direction = 'right';
        break;
    }
  }, []);

  const initGame = useCallback(() => {
    createObstacles();
    gameLoop();
  }, [gameLoop]);

  return { initGame, handleKeyPress };
};
