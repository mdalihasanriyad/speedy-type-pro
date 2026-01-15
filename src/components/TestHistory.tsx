import React from 'react';
import { History, Trash2, Target, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useTestHistory, TestHistoryEntry } from '@/hooks/useTestHistory';
import { TypingMode } from '@/data/words';

const modeLabels: Record<TypingMode, string> = {
  words: 'Words',
  quotes: 'Quotes',
  numbers: 'Numbers',
  punctuation: 'Punctuation',
  practice: 'Practice',
};

export const TestHistory: React.FC = () => {
  const { 
    history, 
    clearHistory, 
    deleteTest,
    getAverageWpm,
    getAverageAccuracy,
    getTotalTestsCount 
  } = useTestHistory();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalTests = getTotalTestsCount();
  const avgWpm = getAverageWpm();
  const avgAccuracy = getAverageAccuracy();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <History className="w-4 h-4 mr-1" />
          History
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            Test History
          </DialogTitle>
        </DialogHeader>

        {/* Stats Summary */}
        {totalTests > 0 && (
          <div className="grid grid-cols-3 gap-3 p-3 bg-secondary/30 rounded-lg mb-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                <TrendingUp className="w-3 h-3" />
                Avg WPM
              </div>
              <div className="font-bold text-primary font-mono">{avgWpm}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                <Target className="w-3 h-3" />
                Avg Acc
              </div>
              <div className="font-bold text-success font-mono">{avgAccuracy}%</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                <Clock className="w-3 h-3" />
                Tests
              </div>
              <div className="font-bold font-mono">{totalTests}</div>
            </div>
          </div>
        )}
        
        {history.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No test history yet!</p>
            <p className="text-sm mt-2">Complete a typing test to see your history.</p>
          </div>
        ) : (
          <>
            <div className="max-h-[350px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="text-xs text-muted-foreground border-b">
                    <th className="text-left py-2 font-medium">Date</th>
                    <th className="text-left py-2 font-medium">Mode</th>
                    <th className="text-center py-2 font-medium">Time</th>
                    <th className="text-center py-2 font-medium">WPM</th>
                    <th className="text-center py-2 font-medium">Acc</th>
                    <th className="text-center py-2 font-medium">Chars</th>
                    <th className="text-right py-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((entry) => (
                    <tr 
                      key={entry.id}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors group"
                    >
                      <td className="py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(entry.date)}
                      </td>
                      <td className="py-2.5 text-sm capitalize">{modeLabels[entry.mode]}</td>
                      <td className="py-2.5 text-center text-sm font-mono">{entry.duration}s</td>
                      <td className="py-2.5 text-center font-bold text-primary font-mono">{entry.wpm}</td>
                      <td className="py-2.5 text-center text-sm text-success font-mono">{entry.accuracy}%</td>
                      <td className="py-2.5 text-center text-xs text-muted-foreground font-mono">
                        <span className="text-success">{entry.correctChars}</span>
                        <span className="text-muted-foreground/50">/</span>
                        <span className="text-destructive">{entry.incorrectChars}</span>
                      </td>
                      <td className="py-2.5 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                          onClick={() => deleteTest(entry.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="pt-4 border-t flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Showing {history.length} test{history.length !== 1 ? 's' : ''}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearHistory}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
