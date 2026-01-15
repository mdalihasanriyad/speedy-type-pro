import React from 'react';
import { Target, Trash2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useWeakKeys } from '@/hooks/useWeakKeys';
import { cn } from '@/lib/utils';

export const WeakKeysDashboard: React.FC = () => {
  const { getWeakKeyStats, clearWeakKeys, weakKeyData } = useWeakKeys();
  
  const stats = getWeakKeyStats();
  const totalKeys = Object.keys(weakKeyData).length;
  const totalCorrect = Object.values(weakKeyData).reduce((sum, d) => sum + d.correct, 0);
  const totalIncorrect = Object.values(weakKeyData).reduce((sum, d) => sum + d.incorrect, 0);
  const overallAccuracy = totalCorrect + totalIncorrect > 0 
    ? Math.round((totalCorrect / (totalCorrect + totalIncorrect)) * 100) 
    : 100;

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 95) return 'text-success';
    if (accuracy >= 85) return 'text-primary';
    if (accuracy >= 70) return 'text-warning';
    return 'text-destructive';
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 95) return 'bg-success/20';
    if (accuracy >= 85) return 'bg-primary/20';
    if (accuracy >= 70) return 'bg-warning/20';
    return 'bg-destructive/20';
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Target className="w-4 h-4 mr-1" />
          Weak Keys
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Weak Keys Dashboard
          </DialogTitle>
        </DialogHeader>

        {/* Overall Stats */}
        {totalKeys > 0 && (
          <div className="grid grid-cols-3 gap-3 p-3 bg-secondary/30 rounded-lg mb-4">
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Keys Tracked</div>
              <div className="font-bold font-mono">{totalKeys}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Total Presses</div>
              <div className="font-bold font-mono">{totalCorrect + totalIncorrect}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-muted-foreground mb-1">Overall Acc</div>
              <div className={cn("font-bold font-mono", getAccuracyColor(overallAccuracy))}>
                {overallAccuracy}%
              </div>
            </div>
          </div>
        )}

        {stats.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No key data tracked yet!</p>
            <p className="text-sm mt-2">Complete typing tests to see which keys need practice.</p>
          </div>
        ) : (
          <>
            {/* Keys with errors */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium">Keys Needing Practice</span>
              </div>
              <div className="max-h-[200px] overflow-y-auto space-y-1.5">
                {stats.map((item) => (
                  <div 
                    key={item.key}
                    className="flex items-center gap-3 bg-background/50 rounded-md px-3 py-2"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded flex items-center justify-center",
                      getAccuracyBg(item.accuracy)
                    )}>
                      <span className={cn(
                        "font-mono font-bold text-lg",
                        getAccuracyColor(item.accuracy)
                      )}>
                        {item.key === ' ' ? '␣' : item.key.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 bg-secondary rounded-full h-2 overflow-hidden">
                          <div 
                            className={cn(
                              "h-full transition-all",
                              item.accuracy >= 85 ? "bg-success" : 
                              item.accuracy >= 70 ? "bg-warning" : "bg-destructive"
                            )}
                            style={{ width: `${item.accuracy}%` }}
                          />
                        </div>
                        <span className={cn(
                          "text-sm font-mono font-bold min-w-[3rem] text-right",
                          getAccuracyColor(item.accuracy)
                        )}>
                          {item.accuracy}%
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        <span className="text-success">{item.correct}</span>
                        <span> correct, </span>
                        <span className="text-destructive">{item.incorrect}</span>
                        <span> errors</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Perfect keys summary */}
            {(() => {
              const perfectKeys = Object.entries(weakKeyData)
                .filter(([_, data]) => data.incorrect === 0 && data.correct > 0)
                .map(([key]) => key);
              
              if (perfectKeys.length === 0) return null;
              
              return (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span className="text-sm font-medium">Perfect Keys ({perfectKeys.length})</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {perfectKeys.slice(0, 20).map((key) => (
                      <span 
                        key={key}
                        className="px-2 py-1 bg-success/10 text-success rounded text-xs font-mono font-bold"
                      >
                        {key === ' ' ? '␣' : key.toUpperCase()}
                      </span>
                    ))}
                    {perfectKeys.length > 20 && (
                      <span className="px-2 py-1 text-muted-foreground text-xs">
                        +{perfectKeys.length - 20} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            <div className="pt-4 border-t flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearWeakKeys}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All Data
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
