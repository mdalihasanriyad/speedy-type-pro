import React, { useEffect, useState, useRef, useMemo } from 'react';
import { TypingStats, WpmDataPoint, KeyPressData } from '@/hooks/useTypingGame';
import { useLeaderboard, LeaderboardEntry } from '@/hooks/useLeaderboard';
import { useTestHistory } from '@/hooks/useTestHistory';
import { Button } from '@/components/ui/button';
import { RotateCcw, Trophy, Target, Zap, Crown, TrendingUp, ArrowUp, BarChart3 } from 'lucide-react';
import { TypingMode } from '@/data/words';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { KeyboardHeatmap } from './KeyboardHeatmap';

interface ResultsModalProps {
  stats: TypingStats;
  onRestart: () => void;
  duration?: number;
  mode?: TypingMode;
  wpmHistory?: WpmDataPoint[];
  keyPressData?: KeyPressData;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  stats,
  onRestart,
  duration = 60,
  mode = 'words',
  wpmHistory = [],
  keyPressData = {},
}) => {
  const { saveScore, getPersonalBest } = useLeaderboard();
  const { addTestResult } = useTestHistory();
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [previousBest, setPreviousBest] = useState<LeaderboardEntry | null>(null);
  const savedRef = useRef(false);

  // Calculate peak and average WPM
  const wpmStats = useMemo(() => {
    if (wpmHistory.length === 0) {
      return { peak: stats.wpm, average: stats.wpm };
    }
    const wpmValues = wpmHistory.map(d => d.wpm);
    const peak = Math.max(...wpmValues);
    const average = Math.round(wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length);
    return { peak, average };
  }, [wpmHistory, stats.wpm]);

  useEffect(() => {
    // Prevent double-saving on StrictMode re-renders
    if (savedRef.current) return;
    savedRef.current = true;

    // Save to leaderboard (personal bests)
    const result = saveScore(duration, mode, stats.wpm, stats.accuracy);
    setIsNewRecord(result.isNewRecord);
    setPreviousBest(result.previousBest);

    // Save to test history (all tests)
    addTestResult(
      duration,
      mode,
      stats.wpm,
      stats.accuracy,
      stats.correctChars,
      stats.incorrectChars,
      stats.totalChars
    );
  }, [duration, mode, stats, saveScore, addTestResult]);

  const getWPMRating = (wpm: number) => {
    if (wpm >= 80) return { label: 'Exceptional!', color: 'text-primary' };
    if (wpm >= 60) return { label: 'Great!', color: 'text-success' };
    if (wpm >= 40) return { label: 'Good', color: 'text-foreground' };
    if (wpm >= 20) return { label: 'Keep practicing', color: 'text-muted-foreground' };
    return { label: 'Getting started', color: 'text-muted-foreground' };
  };

  const rating = getWPMRating(stats.wpm);

  return (
    <div className="animate-scale-in bg-card rounded-xl p-6 md:p-8 shadow-2xl border border-border max-w-lg w-full mx-4">
      {/* New Record Badge */}
      {isNewRecord && (
        <div className="flex items-center justify-center gap-2 mb-4 py-2 px-4 bg-primary/10 rounded-full animate-pulse">
          <Crown className="w-5 h-5 text-primary" />
          <span className="text-primary font-bold text-sm">New Personal Best!</span>
        </div>
      )}

      <div className="text-center mb-6">
        <Trophy className="w-12 h-12 mx-auto mb-3 text-primary" />
        <h2 className={`text-2xl font-bold ${rating.color}`}>{rating.label}</h2>
        <p className="text-muted-foreground mt-1 text-sm">{duration} second test completed</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Zap className="w-5 h-5 mx-auto mb-1 text-primary" />
          <div className="text-2xl font-bold font-mono text-primary">{stats.wpm}</div>
          <div className="text-xs text-muted-foreground">WPM</div>
        </div>
        
        <div className="bg-secondary/50 rounded-lg p-3 text-center">
          <Target className="w-5 h-5 mx-auto mb-1 text-success" />
          <div className="text-2xl font-bold font-mono text-success">{stats.accuracy}%</div>
          <div className="text-xs text-muted-foreground">Accuracy</div>
        </div>
      </div>

      {/* WPM Graph */}
      {wpmHistory.length >= 2 && (
        <div className="bg-secondary/30 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Speed Progression</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <ArrowUp className="w-3 h-3 text-success" />
                <span className="text-muted-foreground">Peak:</span>
                <span className="font-mono font-bold text-success">{wpmStats.peak}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-primary" />
                <span className="text-muted-foreground">Avg:</span>
                <span className="font-mono font-bold text-primary">{wpmStats.average}</span>
              </div>
            </div>
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={wpmHistory} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  tickFormatter={(value) => `${value}s`}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  width={30}
                  domain={[0, 'auto']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px',
                  }}
                  labelStyle={{ color: 'hsl(var(--muted-foreground))' }}
                  formatter={(value: number) => [`${value} WPM`, 'Speed']}
                  labelFormatter={(label) => `${label}s`}
                />
                <ReferenceLine 
                  y={wpmStats.average} 
                  stroke="hsl(var(--primary))" 
                  strokeDasharray="3 3" 
                  strokeOpacity={0.5}
                />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Keyboard Heatmap */}
      <KeyboardHeatmap keyPressData={keyPressData} />
      {previousBest && !isNewRecord && (
        <div className="bg-secondary/30 rounded-lg p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Personal Best:</span>
          </div>
          <span className="font-mono font-bold text-primary">{previousBest.wpm} WPM</span>
        </div>
      )}

      <div className="flex justify-between text-sm text-muted-foreground mb-6 px-2">
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
