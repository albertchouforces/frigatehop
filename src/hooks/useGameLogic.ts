import { useCallback, RefObject } from 'react';
import { ASSETS } from './useGameAssets';

interface GameObject {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  direction: number;
  type: 'iceberg' | 'mine';
  rotation?: number;
}

interface WakeParticle {
  x: number;
  y: number;
  alpha: number;
  size: number;
  velocityX: number;
  velocityY: number;
}

interface CollisionBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CanvasSize {
  width: number;
  height: number;
}

const BASE_WIDTH = 800;
const BASE_HEIGHT = 600;

export const useGameLogic = (
  canvasRef: RefObject<HTMLCanvasElement>,
  setScore: (score: number) => void,
  setGameOver: (gameOver: boolean) => void,
  canvasSize: CanvasSize
) => {
  const scaleX = canvasSize.width / BASE_WIDTH;
  const scaleY = canvasSize.height / BASE_HEIGHT;

  let player = {
    x: 400,
    y: 550,
    width: 80,
    height: 30,
    lastX: 400,
    lastY: 550,
    velocity: { x: 0, y: 0 },
    orientation: 'up' as 'up' | 'down' | 'left' | 'right'
  };

  let wakeParticles: WakeParticle[] = [];
  let obstacles: GameObject[] = [];
  let animationFrameId: number;
  let currentScore = 0;
  let goalAnimation = 0;
  let isGameOver = false;
  let currentLevel = 1;
  let baseSpeed = 0.8;
  let lastMoveTime = Date.now();
  let isTransitioning = false;
  let transitionStartTime = 0;

  const createWakeParticle = () => {
    const particleCount = 3;
    const shipCenterX = player.x + player.width / 2;
    const shipCenterY = player.y + player.height / 2;
    
    for (let i = 0; i < particleCount; i++) {
      let spawnX: number;
      let spawnY: number;
      let velocityX = 0;
      let velocityY = 0;
      const spreadFactor = 8;
      
      switch (player.orientation) {
        case 'up':
          spawnX = shipCenterX + (Math.random() * spreadFactor - spreadFactor/2);
          spawnY = player.y + player.height - 5;
          velocityX = (Math.random() - 0.5) * 0.5;
          velocityY = 0.5 + Math.random() * 0.5;
          break;
        case 'down':
          spawnX = shipCenterX + (Math.random() * spreadFactor - spreadFactor/2);
          spawnY = player.y + 5;
          velocityX = (Math.random() - 0.5) * 0.5;
          velocityY = -0.5 - Math.random() * 0.5;
          break;
        case 'left':
          spawnX = player.x + player.width - 5;
          spawnY = shipCenterY + (Math.random() * spreadFactor - spreadFactor/2);
          velocityX = 0.5 + Math.random() * 0.5;
          velocityY = (Math.random() - 0.5) * 0.5;
          break;
        case 'right':
          spawnX = player.x + 5;
          spawnY = shipCenterY + (Math.random() * spreadFactor - spreadFactor/2);
          velocityX = -0.5 - Math.random() * 0.5;
          velocityY = (Math.random() - 0.5) * 0.5;
          break;
      }

      wakeParticles.push({
        x: spawnX,
        y: spawnY,
        alpha: 0.6,
        size: 2 + Math.random() * 2,
        velocityX: velocityX * scaleX,
        velocityY: velocityY * scaleY
      });
    }
  };

  const updateWakeParticles = () => {
    wakeParticles = wakeParticles.filter(particle => {
      particle.x += particle.velocityX;
      particle.y += particle.velocityY;
      particle.size += 0.15 * scaleX;
      particle.alpha -= 0.025;
      return particle.alpha > 0;
    });
  };

  const drawWakeParticles = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    wakeParticles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha})`;
      ctx.fill();
    });
    ctx.restore();
  };

  const getLevelConfig = (level: number) => {
    return {
      rows: Math.min(1 + Math.floor((level - 1) / 2), 6),
      speed: (baseSpeed + (level * 0.2)) * scaleX,
      mineChance: Math.min(0.1 + (level * 0.03), 0.5),
      rowSpacing: Math.min(80 + (level * 5), 120) * scaleY
    };
  };

  const createObstacles = () => {
    const config = getLevelConfig(currentLevel);
    
    const rows = Array.from(
      { length: config.rows }, 
      (_, i) => (100 + (i * config.rowSpacing)) * scaleY
    );
    
    obstacles = rows.flatMap((y) => {
      const obstaclesInRow = Math.min(1 + Math.floor(currentLevel / 3), 3);
      
      return Array.from({ length: obstaclesInRow }, () => {
        const isWide = Math.random() > 0.5;
        return {
          x: Math.random() * (BASE_WIDTH * scaleX),
          y,
          width: (isWide ? 80 : 40) * scaleX,
          height: (isWide ? 60 : 40) * scaleY,
          speed: config.speed + (Math.random() * 0.5 * scaleX),
          direction: Math.random() > 0.5 ? 1 : -1,
          type: Math.random() < config.mineChance ? 'mine' : 'iceberg',
          rotation: Math.random() * Math.PI * 2,
        };
      });
    });
  };

  const getPlayerCollisionBox = (): CollisionBox => {
    const padding = (player.orientation === 'up' || player.orientation === 'down' ? 12 : 8) * scaleX;
    return {
      x: player.x + padding,
      y: player.y + padding,
      width: player.width - (padding * 2),
      height: player.height - (padding * 2)
    };
  };

  const drawPlayer = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    
    const centerX = player.x + player.width / 2;
    const centerY = player.y + player.height / 2;
    
    ctx.translate(centerX, centerY);
    
    switch (player.orientation) {
      case 'up':
        ctx.rotate(-Math.PI / 2);
        break;
      case 'down':
        ctx.rotate(Math.PI / 2);
        break;
      case 'left':
        ctx.rotate(Math.PI);
        break;
      case 'right':
        ctx.rotate(0);
        break;
    }
    
    ctx.drawImage(
      ASSETS.ship,
      -player.width / 2,
      -player.height / 2,
      player.width,
      player.height
    );
    
    ctx.restore();
  };

  const drawObstacles = (ctx: CanvasRenderingContext2D) => {
    obstacles.forEach((obstacle) => {
      ctx.save();
      const centerX = obstacle.x + obstacle.width / 2;
      const centerY = obstacle.y + obstacle.height / 2;

      if (obstacle.type === 'mine') {
        const bobAmount = Math.sin(Date.now() / 500) * 3 * scaleY;
        ctx.translate(centerX, centerY + bobAmount);
        ctx.rotate(obstacle.rotation || 0);
        ctx.drawImage(
          ASSETS.mine,
          -obstacle.width / 2,
          -obstacle.height / 2,
          obstacle.width,
          obstacle.height
        );
      } else {
        ctx.translate(centerX, centerY);
        ctx.drawImage(
          ASSETS.iceberg,
          -obstacle.width / 2,
          -obstacle.height / 2,
          obstacle.width,
          obstacle.height
        );
      }
      ctx.restore();
    });
  };

  const drawLevel = (ctx: CanvasRenderingContext2D) => {
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = `bold ${24 * scaleY}px Inter`;
    ctx.fillText(`Level ${currentLevel}`, 20 * scaleX, 580 * scaleY);
    
    const config = getLevelConfig(currentLevel);
    ctx.font = `${16 * scaleY}px Inter`;
    ctx.fillText(`Rows: ${config.rows}`, 140 * scaleX, 580 * scaleY);
    ctx.restore();
  };

  const drawLevelComplete = (ctx: CanvasRenderingContext2D) => {
    if (isTransitioning) {
      const alpha = Math.min((Date.now() - transitionStartTime) / 1000, 1);
      ctx.save();
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
      ctx.font = `bold ${36 * scaleY}px Inter`;
      const text = `Level ${currentLevel} Complete!`;
      const metrics = ctx.measureText(text);
      const x = (ctx.canvas.width - metrics.width) / 2;
      const y = ctx.canvas.height / 2;
      ctx.fillText(text, x, y);
      ctx.restore();
    }
  };

  const drawGoalZone = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(ASSETS.goal, 0, 0, canvasSize.width, 50 * scaleY);
    if (goalAnimation > 0) {
      ctx.fillStyle = `rgba(255, 255, 255, ${goalAnimation})`;
      ctx.fillRect(0, 0, canvasSize.width, 50 * scaleY);
      goalAnimation -= 0.02;
    }
  };

  const updateObstacles = () => {
    if (isTransitioning) return;
    
    obstacles.forEach((obstacle) => {
      obstacle.x += obstacle.speed * obstacle.direction;
      if (obstacle.x > canvasSize.width) obstacle.x = -obstacle.width;
      if (obstacle.x < -obstacle.width) obstacle.x = canvasSize.width;
      
      if (obstacle.type === 'mine') {
        obstacle.rotation = (obstacle.rotation || 0) + 0.01;
      }
    });
  };

  const checkCollision = () => {
    if (isTransitioning) return false;
    
    const playerBox = getPlayerCollisionBox();
    
    return obstacles.some((obstacle) => {
      const padding = (obstacle.type === 'mine' ? 12 : 8) * scaleX;
      const obstacleBox = {
        x: obstacle.x + padding,
        y: obstacle.y + padding,
        width: obstacle.width - (padding * 2),
        height: obstacle.height - (padding * 2)
      };

      return playerBox.x < obstacleBox.x + obstacleBox.width &&
             playerBox.x + playerBox.width > obstacleBox.x &&
             playerBox.y < obstacleBox.y + obstacleBox.height &&
             playerBox.y + playerBox.height > obstacleBox.y;
    });
  };

  const startLevelTransition = () => {
    isTransitioning = true;
    transitionStartTime = Date.now();
    goalAnimation = 1;
    
    setTimeout(() => {
      currentLevel++;
      player.y = 550 * scaleY;
      player.lastY = 550 * scaleY;
      createObstacles();
      isTransitioning = false;
    }, 1000);
  };

  const gameLoop = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    const gradient = ctx.createLinearGradient(0, 0, 0, canvasSize.height);
    gradient.addColorStop(0, '#a8d5ff');
    gradient.addColorStop(1, '#015cc7');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2 * scaleX;
    for (let i = 0; i < canvasSize.height; i += 20 * scaleY) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      for (let x = 0; x < canvasSize.width; x += 50 * scaleX) {
        const y = i + Math.sin((x + Date.now() / 1000) / (30 * scaleX)) * (5 * scaleY);
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    drawGoalZone(ctx);
    updateWakeParticles();
    drawWakeParticles(ctx);
    updateObstacles();
    drawObstacles(ctx);
    drawPlayer(ctx);
    drawLevel(ctx);
    drawLevelComplete(ctx);

    if (checkCollision()) {
      isGameOver = true;
      setGameOver(true);
      cancelAnimationFrame(animationFrameId);
      return;
    }

    if (player.y < 50 * scaleY && !isTransitioning) {
      startLevelTransition();
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }, [canvasRef, setGameOver, setScore, canvasSize]);

  const handleKeyPress = useCallback((key: string) => {
    if (isGameOver || isTransitioning) return;

    const moveDistance = 15 * scaleX;
    const now = Date.now();
    const timeDiff = now - lastMoveTime;
    
    if (timeDiff > 32) {
      createWakeParticle();
      lastMoveTime = now;
    }

    const oldY = player.y;
    const oldX = player.x;
    
    switch (key) {
      case 'ArrowUp':
        player.y = Math.max(0, player.y - moveDistance);
        player.orientation = 'up';
        if (player.y < player.lastY) {
          currentScore += 1;
          setScore(currentScore);
        }
        break;
      case 'ArrowDown':
        player.y = Math.min(canvasSize.height - player.height, player.y + moveDistance);
        player.orientation = 'down';
        break;
      case 'ArrowLeft':
        player.x = Math.max(0, player.x - moveDistance);
        player.orientation = 'left';
        break;
      case 'ArrowRight':
        player.x = Math.min(canvasSize.width - player.width, player.x + moveDistance);
        player.orientation = 'right';
        break;
    }
    
    player.lastY = oldY;
    player.lastX = oldX;
    
    player.velocity = {
      x: player.x - oldX,
      y: player.y - oldY
    };
  }, [setScore, canvasSize]);

  const initGame = useCallback(() => {
    isGameOver = false;
    currentLevel = 1;
    currentScore = 0;
    wakeParticles = [];
    isTransitioning = false;
    setScore(0);

    // Initialize player position with scaled coordinates
    player = {
      ...player,
      x: 400 * scaleX,
      y: 550 * scaleY,
      lastX: 400 * scaleX,
      lastY: 550 * scaleY,
      width: 80 * scaleX,
      height: 30 * scaleY,
    };

    createObstacles();
    gameLoop();
  }, [gameLoop, setScore, canvasSize]);

  return { initGame, handleKeyPress };
};
