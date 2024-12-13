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

  return (
    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
      <div className="bg-blue-900/80 text-white px-4 py-2 rounded-lg">
        Score: {score}
      </div>
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                      bg-red-900/90 text-white px-8 py-4 rounded-lg text-center min-w-[300px]">
          <h2 className="text-2xl font-bold mb-2">Game Over</h2>
          <p className="mb-4">Final Score: {score}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-white text-red-900 px-4 py-2 rounded-lg hover:bg-gray-100 
                     transition-colors duration-200 font-semibold"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};
