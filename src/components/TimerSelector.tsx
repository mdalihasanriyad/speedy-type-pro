import React from 'react';
import { cn } from '@/lib/utils';
import { Clock } from 'lucide-react';

interface TimerSelectorProps {
  duration: number;
  onDurationChange: (duration: number) => void;
  disabled?: boolean;
}

const TIMER_OPTIONS = [15, 30, 60, 120];

export const TimerSelector: React.FC<TimerSelectorProps> = ({
  duration,
  onDurationChange,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-center gap-1 bg-secondary/50 rounded-lg p-1">
      <Clock className="w-4 h-4 text-muted-foreground mx-2" />
      {TIMER_OPTIONS.map((time) => (
        <button
          key={time}
          onClick={() => onDurationChange(time)}
          disabled={disabled}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
            "hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-accent",
            duration === time
              ? "bg-accent text-accent-foreground shadow-sm"
              : "text-muted-foreground hover:bg-secondary",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          {time}
        </button>
      ))}
    </div>
  );
};
