import { isMobile } from 'react-device-detect';

interface GameOverlayProps {
  score: number;
  gameOver: boolean;
}

interface HighScore {
  score: number;
  date: string;
}

const saveHighScore = (score: number) => {
  const scores = localStorage.getItem('highScores');
  const highScores: HighScore[] = scores ? JSON.parse(scores) : [];
  
  // Check if this exact score was already saved in the last minute
  // This prevents duplicate saves when the GameOverlay re-renders
  const now = new Date().getTime();
  const recentDuplicate = highScores.some(existing => {
    const existingDate = new Date(existing.date).getTime();
    const isWithinLastMinute = now - existingDate < 60000; // 60 seconds
    return existing.score === score && isWithinLastMinute;
  });

  if (!recentDuplicate) {
    highScores.push({
      score,
      date: new Date().toISOString()
    });
    
    // Sort and keep only top 5 scores
    const topScores = highScores
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    localStorage.setItem('highScores', JSON.stringify(topScores));
  }
};

export const GameOverlay = ({ score, gameOver }: GameOverlayProps) => {
  if (gameOver) {
    saveHighScore(score);
  }

  const scoreSize = isMobile ? 'text-lg' : 'text-base';
  const gameOverSize = isMobile ? 'text-3xl' : 'text-2xl';
  const buttonSize = isMobile ? 'text-lg' : 'text-base';

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
      <div className={`bg-blue-900/80 text-white px-4 py-2 rounded-lg ${scoreSize}`}>
        Score: {score}
      </div>
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-red-900/90 text-white px-8 py-6 rounded-lg text-center 
                      min-w-[280px] sm:min-w-[320px] shadow-xl border-2 border-red-700">
          <h2 className={`${gameOverSize} font-bold mb-4`}>Game Over</h2>
          <p className={`mb-6 ${scoreSize}`}>Final Score: {score}</p>
          <button
            onClick={() => window.location.reload()}
            className={`${buttonSize} bg-white text-red-900 px-6 py-3 rounded-lg 
                     hover:bg-gray-100 transition-colors duration-200 font-semibold
                     shadow-lg active:scale-95 transform transition-transform`}
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
