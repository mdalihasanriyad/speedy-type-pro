import React from 'react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { Trophy, Medal, Award, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const modeLabels: Record<string, string> = {
  words: 'Words',
  quotes: 'Quotes',
  numbers: 'Numbers',
  punctuation: 'Punctuation',
};

export const Leaderboard: React.FC = () => {
  const { getAllPersonalBests, clearLeaderboard } = useLeaderboard();
  const personalBests = getAllPersonalBests();

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-muted-foreground font-mono text-sm">{index + 1}</span>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
        >
          <Trophy className="w-4 h-4 mr-1" />
          Records
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            Personal Bests
          </DialogTitle>
        </DialogHeader>
        
        {personalBests.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No records yet!</p>
            <p className="text-sm mt-2">Complete a typing test to set your first record.</p>
          </div>
        ) : (
          <>
            <div className="max-h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-background">
                  <tr className="text-xs text-muted-foreground border-b">
                    <th className="text-left py-2 font-medium">#</th>
                    <th className="text-left py-2 font-medium">Mode</th>
                    <th className="text-center py-2 font-medium">Time</th>
                    <th className="text-center py-2 font-medium">WPM</th>
                    <th className="text-center py-2 font-medium">Acc</th>
                    <th className="text-right py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {personalBests.map((record, index) => (
                    <tr 
                      key={`${record.mode}-${record.duration}`}
                      className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="py-3">{getRankIcon(index)}</td>
                      <td className="py-3 text-sm capitalize">{modeLabels[record.mode]}</td>
                      <td className="py-3 text-center text-sm font-mono">{record.duration}s</td>
                      <td className="py-3 text-center font-bold text-primary font-mono">{record.entry.wpm}</td>
                      <td className="py-3 text-center text-sm text-success font-mono">{record.entry.accuracy}%</td>
                      <td className="py-3 text-right text-xs text-muted-foreground">
                        {formatDate(record.entry.date)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="pt-4 border-t flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearLeaderboard}
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
