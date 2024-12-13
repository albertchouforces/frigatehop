import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onControlPress: (key: string) => void;
}

export const TouchControls = ({ onControlPress }: TouchControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-2">
      {/* Up button */}
      <button
        onTouchStart={() => onControlPress('ArrowUp')}
        className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center 
                   backdrop-blur-sm active:bg-white/30 transition-colors
                   border-2 border-white/30 touch-none"
        aria-label="Move Up"
      >
        <ArrowUp className="w-8 h-8 text-white" strokeWidth={2.5} />
      </button>

      {/* Middle row with Left, Down, Right buttons */}
      <div className="flex justify-center gap-2">
        <button
          onTouchStart={() => onControlPress('ArrowLeft')}
          className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center 
                     backdrop-blur-sm active:bg-white/30 transition-colors
                     border-2 border-white/30 touch-none"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-8 h-8 text-white" strokeWidth={2.5} />
        </button>
        
        <button
          onTouchStart={() => onControlPress('ArrowDown')}
          className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center 
                     backdrop-blur-sm active:bg-white/30 transition-colors
                     border-2 border-white/30 touch-none"
          aria-label="Move Down"
        >
          <ArrowDown className="w-8 h-8 text-white" strokeWidth={2.5} />
        </button>
        
        <button
          onTouchStart={() => onControlPress('ArrowRight')}
          className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center 
                     backdrop-blur-sm active:bg-white/30 transition-colors
                     border-2 border-white/30 touch-none"
          aria-label="Move Right"
        >
          <ArrowRight className="w-8 h-8 text-white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Help text */}
      <p className="mt-2 text-white/60 text-sm font-medium text-center">
        Tap and hold to move
      </p>
    </div>
  );
};
