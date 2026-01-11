import React from 'react';
import { TypingStats } from '@/hooks/useTypingGame';
import { cn } from '@/lib/utils';

interface StatsDisplayProps {
  stats: TypingStats;
  timeLeft: number;
  isRunning: boolean;
  isFinished: boolean;
}

export const StatsDisplay: React.FC<StatsDisplayProps> = ({
  stats,
  timeLeft,
  isRunning,
  isFinished,
}) => {
  return (
    <div className={cn(
      "flex items-center justify-center gap-8 md:gap-16 transition-opacity duration-300",
      !isRunning && !isFinished && "opacity-50"
    )}>
      <div className="text-center">
        <div className="stat-value">{stats.wpm}</div>
        <div className="stat-label">WPM</div>
      </div>
      
      <div className="text-center">
        <div className={cn(
          "stat-value",
          stats.accuracy < 80 && "text-destructive",
          stats.accuracy >= 95 && "text-success"
        )}>
          {stats.accuracy}%
        </div>
        <div className="stat-label">Accuracy</div>
      </div>
      
      <div className="text-center">
        <div className={cn(
          "stat-value",
          timeLeft <= 10 && timeLeft > 0 && "text-destructive animate-pulse"
        )}>
          {timeLeft}
        </div>
        <div className="stat-label">Seconds</div>
      </div>
    </div>
  );
};
