import React from 'react';
import { TypingStats } from '@/hooks/useTypingGame';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Target, Zap } from 'lucide-react';

interface ResultsModalProps {
  stats: TypingStats;
  onRestart: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  stats,
  onRestart,
}) => {
  const getWPMRating = (wpm: number) => {
    if (wpm >= 80) return { label: 'Exceptional!', color: 'text-primary' };
    if (wpm >= 60) return { label: 'Great!', color: 'text-success' };
    if (wpm >= 40) return { label: 'Good', color: 'text-foreground' };
    if (wpm >= 20) return { label: 'Keep practicing', color: 'text-muted-foreground' };
    return { label: 'Getting started', color: 'text-muted-foreground' };
  };

  const rating = getWPMRating(stats.wpm);

  return (
    <div className="animate-scale-in bg-card rounded-xl p-8 md:p-12 shadow-2xl border border-border max-w-md w-full mx-4">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 mx-auto mb-4 text-primary" />
        <h2 className={`text-2xl font-bold ${rating.color}`}>{rating.label}</h2>
        <p className="text-muted-foreground mt-2">Test completed</p>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-secondary/50 rounded-lg p-4 text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-primary" />
          <div className="text-3xl font-bold font-mono text-primary">{stats.wpm}</div>
          <div className="text-sm text-muted-foreground">WPM</div>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-4 text-center">
          <Target className="w-6 h-6 mx-auto mb-2 text-success" />
          <div className="text-3xl font-bold font-mono text-success">{stats.accuracy}%</div>
          <div className="text-sm text-muted-foreground">Accuracy</div>
        </div>
      </div>

      <div className="flex justify-between text-sm text-muted-foreground mb-8 px-2">
        <span>Correct: <span className="text-success font-mono">{stats.correctChars}</span></span>
        <span>Errors: <span className="text-destructive font-mono">{stats.incorrectChars}</span></span>
      </div>

      <Button 
        onClick={onRestart}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold py-6"
        size="lg"
      >
        <RotateCcw className="w-5 h-5 mr-2" />
        Try Again
      </Button>
    </div>
  );
};
