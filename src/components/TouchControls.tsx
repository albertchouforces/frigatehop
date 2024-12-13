import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onControlPress: (key: string) => void;
}

export const TouchControls = ({ onControlPress }: TouchControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-3">
      {/* Up button */}
      <button
        onTouchStart={() => onControlPress('ArrowUp')}
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
          onTouchStart={() => onControlPress('ArrowLeft')}
          className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center 
                     backdrop-blur-sm active:bg-white/40 transition-colors
                     border-2 border-white/30 touch-none shadow-lg
                     active:scale-95 transform transition-transform"
          aria-label="Move Left"
        >
          <ArrowLeft className="w-10 h-10 text-white" strokeWidth={2.5} />
        </button>
        
        <button
          onTouchStart={() => onControlPress('ArrowDown')}
          className="w-20 h-20 bg-white/20 rounded-xl flex items-center justify-center 
                     backdrop-blur-sm active:bg-white/40 transition-colors
                     border-2 border-white/30 touch-none shadow-lg
                     active:scale-95 transform transition-transform"
          aria-label="Move Down"
        >
          <ArrowDown className="w-10 h-10 text-white" strokeWidth={2.5} />
        </button>
        
        <button
          onTouchStart={() => onControlPress('ArrowRight')}
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
        Tap and hold to move
      </p>
    </div>
  );
};
