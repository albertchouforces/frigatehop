import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface TouchControlsProps {
  onControlPress: (key: string) => void;
}

export const TouchControls = ({ onControlPress }: TouchControlsProps) => {
  // Track active buttons
  const activeButtons = useRef(new Set<string>());
  const intervalRef = useRef<number | null>(null);

  // Handle continuous movement while touching
  useEffect(() => {
    const processActiveButtons = () => {
      activeButtons.current.forEach(key => {
        onControlPress(key);
      });
    };

    // Set up interval for continuous movement
    intervalRef.current = window.setInterval(processActiveButtons, 16); // ~60fps

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [onControlPress]);

  const handleTouchStart = (key: string, e: React.TouchEvent) => {
    e.preventDefault(); // Prevent default to avoid unwanted behaviors
    activeButtons.current.add(key);
  };

  const handleTouchEnd = (key: string, e: React.TouchEvent) => {
    e.preventDefault();
    activeButtons.current.delete(key);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* Up button */}
      <button
        onTouchStart={(e) => handleTouchStart('ArrowUp', e)}
        onTouchEnd={(e) => handleTouchEnd('ArrowUp', e)}
        className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center 
                   backdrop-blur-sm active:bg-white/40 transition-colors
                   border-2 border-white/30 touch-none shadow-lg
                   active:scale-95 transform transition-transform"
        aria-label="Move Up"
      >
        <ArrowUp className="w-10 h-10 text-white" strokeWidth={2.5} />
      </button>

      {/* Middle row with Left, Down, Right buttons */}
      <div className="flex justify-center gap-3">
        <button
          onTouchStart={(e) => handleTouchStart('ArrowLeft', e)}
          onTouchEnd={(e) => handleTouchEnd('ArrowLeft', e)}
          className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center 
                     backdrop-blur-sm active:bg-white/40 transition-colors
                     border-2 border-white/30 touch-none shadow-lg
                     active:scale-95 transform transition-transform"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-10 h-10 text-white" strokeWidth={2.5} />
        </button>
        
        <button
          onTouchStart={(e) => handleTouchStart('ArrowDown', e)}
          onTouchEnd={(e) => handleTouchEnd('ArrowDown', e)}
          className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center 
                     backdrop-blur-sm active:bg-white/40 transition-colors
                     border-2 border-white/30 touch-none shadow-lg
                     active:scale-95 transform transition-transform"
          aria-label="Move Down"
        >
          <ArrowDown className="w-10 h-10 text-white" strokeWidth={2.5} />
        </button>
        
        <button
          onTouchStart={(e) => handleTouchStart('ArrowRight', e)}
          onTouchEnd={(e) => handleTouchEnd('ArrowRight', e)}
          className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center 
                     backdrop-blur-sm active:bg-white/40 transition-colors
                     border-2 border-white/30 touch-none shadow-lg
                     active:scale-95 transform transition-transform"
          aria-label="Move Right"
        >
          <ArrowRight className="w-10 h-10 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Help text */}
      <p className="mt-1 text-white/70 text-sm font-medium text-center">
        Touch and hold to move continuously
      </p>
    </div>
  );
};
