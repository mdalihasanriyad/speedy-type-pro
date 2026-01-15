import { KeyPressData } from '@/hooks/useTypingGame';
import { AlertTriangle, Target, TrendingDown } from 'lucide-react';

interface ErrorAnalysisProps {
  keyPressData: KeyPressData;
}

interface CharacterError {
  char: string;
  incorrect: number;
  correct: number;
  accuracy: number;
  total: number;
}

export function ErrorAnalysis({ keyPressData }: ErrorAnalysisProps) {
  const errorData: CharacterError[] = Object.entries(keyPressData)
    .filter(([_, data]) => data.incorrect > 0)
    .map(([char, data]) => ({
      char,
      incorrect: data.incorrect,
      correct: data.correct,
      total: data.correct + data.incorrect,
      accuracy: Math.round((data.correct / (data.correct + data.incorrect)) * 100),
    }))
    .sort((a, b) => b.incorrect - a.incorrect);

  const topErrors = errorData.slice(0, 5);
  const totalErrors = errorData.reduce((sum, item) => sum + item.incorrect, 0);
  const uniqueErrorKeys = errorData.length;

  if (topErrors.length === 0) {
    return (
      <div className="bg-success/10 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 text-success">
          <Target className="w-5 h-5" />
          <span className="font-semibold">Perfect Accuracy!</span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          No mistyped characters. Excellent work!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-secondary/30 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-4 h-4 text-warning" />
        <span className="font-semibold text-sm">Error Analysis</span>
      </div>
      
      {/* Summary Stats */}
      <div className="flex gap-4 mb-3 text-xs text-muted-foreground">
        <span>
          Total errors: <span className="font-mono font-bold text-destructive">{totalErrors}</span>
        </span>
        <span>
          Unique keys: <span className="font-mono font-bold text-foreground">{uniqueErrorKeys}</span>
        </span>
      </div>

      {/* Most Mistyped Characters */}
      <div className="space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">Most Mistyped</p>
        <div className="grid gap-2">
          {topErrors.map((item, index) => (
            <div 
              key={item.char} 
              className="flex items-center gap-3 bg-background/50 rounded-md px-3 py-2"
            >
              <span className="text-xs text-muted-foreground w-4">#{index + 1}</span>
              <div className="w-8 h-8 rounded bg-destructive/20 flex items-center justify-center">
                <span className="font-mono font-bold text-sm text-destructive">
                  {item.char === ' ' ? '␣' : item.char.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-destructive to-warning transition-all"
                      style={{ width: `${100 - item.accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono">
                  <span className="text-destructive">{item.incorrect}</span>
                  <span className="text-muted-foreground"> / </span>
                  <span className="text-foreground">{item.total}</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {item.accuracy}% acc
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {errorData.length > 5 && (
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <TrendingDown className="w-3 h-3" />
          +{errorData.length - 5} more keys with errors
        </p>
      )}
    </div>
  );
}
