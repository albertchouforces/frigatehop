interface StartScreenProps {
  onStartGame: () => void;
}

interface HighScore {
  score: number;
  date: string;
}

const getHighScores = (): HighScore[] => {
  const scores = localStorage.getItem('highScores');
  return scores ? JSON.parse(scores) : [];
};

export const StartScreen = ({ onStartGame }: StartScreenProps) => {
  const highScores = getHighScores();

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/90">
      <div className="text-center p-8 bg-gray-800 rounded-lg shadow-2xl border-2 border-blue-500 max-w-xl w-full mx-4">
        <h2 className="text-3xl font-bold text-white mb-6">Frigate Hop</h2>
        <div className="mb-6">
          <svg
            width="400"
            height="120"
            viewBox="0 0 400 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto mb-4"
          >
            {/* Hull */}
            <path d="M20 70L40 60H360L380 70L360 80H40L20 70Z" fill="#4A5568"/>
            
            {/* Main deck structures */}
            <path d="M50 55H340V65H50V55Z" fill="#718096"/>
            
            {/* Forward gun deck */}
            <path d="M45 50H95V60H45V50Z" fill="#4A5568"/>
            
            {/* Bridge and operations room */}
            <path d="M140 35H220V55H140V35Z" fill="#4A5568"/>
            <path d="M150 25H210V35H150V25Z" fill="#2D3748"/>
            
            {/* Main mast */}
            <path d="M175 15L185 15L185 25L175 25Z" fill="#718096"/>
            <path d="M170 10H190L185 5H175L170 10Z" fill="#718096"/>
            
            {/* Radar arrays */}
            <path d="M165 8L195 8L190 12L170 12Z" fill="#A0AEC0"/>
            
            {/* Forward CIWS */}
            <path d="M70 45H85V50H70V45Z" fill="#2D3748"/>
            
            {/* Aft CIWS */}
            <path d="M315 45H330V50H315V45Z" fill="#2D3748"/>
            
            {/* Harpoon missile launchers */}
            <path d="M240 45H260V50H240V45Z" fill="#2D3748"/>
            <path d="M270 45H290V50H270V45Z" fill="#2D3748"/>
            
            {/* Helicopter hangar */}
            <path d="M300 40H350V60H300V40Z" fill="#4A5568"/>
            
            {/* Flight deck */}
            <path d="M320 60H370V65H320V60Z" fill="#718096"/>
            
            {/* Details and markings */}
            <path d="M45 67H55V73H45V67Z" fill="#CBD5E0"/>
            <path d="M345 67H355V73H345V67Z" fill="#CBD5E0"/>
            
            {/* Windows */}
            <path d="M155 40H165V45H155V40Z" fill="#90CDF4"/>
            <path d="M175 40H185V45H175V40Z" fill="#90CDF4"/>
            <path d="M195 40H205V45H195V40Z" fill="#90CDF4"/>
            
            {/* Water line */}
            <path d="M30 70H370" stroke="#90CDF4" strokeWidth="1" strokeDasharray="4 4"/>
          </svg>
        </div>
        <div className="space-y-2 text-gray-300 mb-6">
          <p>Navigate the Frigate through dangerous waters</p>
          <p>Avoid sea mines and icebergs</p>
          <p>Use arrow keys to move</p>
          <p>Reach the finish line to score points!</p>
        </div>

        {/* High Scores Section */}
        <div className="mb-6 bg-gray-900/50 rounded-lg p-4">
          <h3 className="text-xl font-semibold text-white mb-3">High Scores</h3>
          <div className="space-y-2">
            {highScores.length > 0 ? (
              highScores
                .sort((a, b) => b.score - a.score)
                .slice(0, 5)
                .map((score, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center text-gray-300 border-b border-gray-700 last:border-0 pb-2"
                  >
                    <span className="font-medium">
                      #{index + 1}
                    </span>
                    <span className="font-bold text-blue-400">
                      {score.score} pts
                    </span>
                    <span className="text-sm text-gray-400">
                      {new Date(score.date).toLocaleDateString()}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-gray-400 text-center">No scores yet. Be the first!</p>
            )}
          </div>
        </div>

        <button
          onClick={onStartGame}
          className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold
                     hover:bg-blue-700 transition-colors duration-200 shadow-lg"
        >
          Start Mission
        </button>
      </div>
    </div>
  );
};
