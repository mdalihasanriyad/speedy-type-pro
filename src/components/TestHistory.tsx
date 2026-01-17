import React, { useState, useMemo } from 'react';
import { History, Trash2, Target, Clock, TrendingUp, Filter, X, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Area, ComposedChart } from 'recharts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTestHistory } from '@/hooks/useTestHistory';
import { TypingMode } from '@/data/words';

const modeLabels: Record<TypingMode, string> = {
  words: 'Words',
  quotes: 'Quotes',
  numbers: 'Numbers',
  punctuation: 'Punctuation',
  practice: 'Practice',
};

interface Filters {
  mode: TypingMode | 'all';
  dateFrom: string;
  dateTo: string;
  minWpm: string;
  maxWpm: string;
}

const defaultFilters: Filters = {
  mode: 'all',
  dateFrom: '',
  dateTo: '',
  minWpm: '',
  maxWpm: '',
};

export const TestHistory: React.FC = () => {
  const { 
    history, 
    clearHistory, 
    deleteTest,
  } = useTestHistory();

  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredHistory = useMemo(() => {
    return history.filter((entry) => {
      // Mode filter
      if (filters.mode !== 'all' && entry.mode !== filters.mode) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        fromDate.setHours(0, 0, 0, 0);
        if (new Date(entry.date) < fromDate) {
          return false;
        }
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (new Date(entry.date) > toDate) {
          return false;
        }
      }

      // WPM threshold filter
      if (filters.minWpm && entry.wpm < parseInt(filters.minWpm)) {
        return false;
      }

      if (filters.maxWpm && entry.wpm > parseInt(filters.maxWpm)) {
        return false;
      }

      return true;
    });
  }, [history, filters]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.mode !== 'all' ||
      filters.dateFrom !== '' ||
      filters.dateTo !== '' ||
      filters.minWpm !== '' ||
      filters.maxWpm !== ''
    );
  }, [filters]);

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  // Calculate stats for filtered results
  const filteredStats = useMemo(() => {
    if (filteredHistory.length === 0) {
      return { avgWpm: 0, avgAccuracy: 0, count: 0 };
    }
    const avgWpm = Math.round(
      filteredHistory.reduce((sum, e) => sum + e.wpm, 0) / filteredHistory.length
    );
    const avgAccuracy = Math.round(
      filteredHistory.reduce((sum, e) => sum + e.accuracy, 0) / filteredHistory.length
    );
    return { avgWpm, avgAccuracy, count: filteredHistory.length };
  }, [filteredHistory]);

  // Prepare chart data (chronological order - oldest first)
  const chartData = useMemo(() => {
    if (filteredHistory.length < 2) return [];
    
    // Reverse to get chronological order (oldest first)
    const chronological = [...filteredHistory].reverse();
    
    // Calculate rolling average (last 5 tests)
    return chronological.map((entry, index) => {
      const start = Math.max(0, index - 4);
      const slice = chronological.slice(start, index + 1);
      const rollingAvg = Math.round(slice.reduce((sum, e) => sum + e.wpm, 0) / slice.length);
      
      return {
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        wpm: entry.wpm,
        rollingAvg,
        accuracy: entry.accuracy,
        index: index + 1,
      };
    });
  }, [filteredHistory]);

  const [showChart, setShowChart] = useState(true);

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

        {/* Filter Toggle */}
        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "secondary" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="text-xs"
            >
              <Filter className="w-3 h-3 mr-1" />
              Filters
              {hasActiveFilters && (
                <span className="ml-1 px-1.5 py-0.5 bg-primary text-primary-foreground rounded-full text-[10px]">
                  Active
                </span>
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <X className="w-3 h-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && history.length > 0 && (
          <div className="p-3 bg-secondary/30 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Mode Filter */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Mode</Label>
                <Select
                  value={filters.mode}
                  onValueChange={(value) => setFilters({ ...filters, mode: value as TypingMode | 'all' })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All Modes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modes</SelectItem>
                    {Object.entries(modeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* WPM Range */}
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">WPM Range</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filters.minWpm}
                    onChange={(e) => setFilters({ ...filters, minWpm: e.target.value })}
                    className="h-8 text-xs w-full"
                    min={0}
                  />
                  <span className="text-muted-foreground text-xs">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filters.maxWpm}
                    onChange={(e) => setFilters({ ...filters, maxWpm: e.target.value })}
                    className="h-8 text-xs w-full"
                    min={0}
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">From Date</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">To Date</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {filteredHistory.length > 0 && (
          <div className="grid grid-cols-3 gap-3 p-3 bg-secondary/30 rounded-lg">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                <TrendingUp className="w-3 h-3" />
                Avg WPM
              </div>
              <div className="font-bold text-primary font-mono">{filteredStats.avgWpm}</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                <Target className="w-3 h-3" />
                Avg Acc
              </div>
              <div className="font-bold text-success font-mono">{filteredStats.avgAccuracy}%</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground text-xs mb-1">
                <Clock className="w-3 h-3" />
                Tests
              </div>
              <div className="font-bold font-mono">{filteredStats.count}</div>
            </div>
          </div>
        )}

        {/* WPM Progress Chart */}
        {chartData.length >= 2 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <BarChart3 className="w-3 h-3" />
                <span>WPM Progress Over Time</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChart(!showChart)}
                className="text-xs h-6 px-2"
              >
                {showChart ? 'Hide' : 'Show'}
              </Button>
            </div>
            
            {showChart && (
              <div className="h-32 w-full bg-secondary/20 rounded-lg p-2">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                    <defs>
                      <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="index" 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                      interval="preserveStartEnd"
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                      domain={['dataMin - 5', 'dataMax + 5']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                      formatter={(value: number, name: string) => [
                        `${value} WPM`,
                        name === 'wpm' ? 'Score' : 'Avg (5 tests)'
                      ]}
                      labelFormatter={(label) => `Test #${label}`}
                    />
                    <ReferenceLine 
                      y={filteredStats.avgWpm} 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="3 3"
                      strokeOpacity={0.5}
                    />
                    <Area
                      type="monotone"
                      dataKey="wpm"
                      stroke="none"
                      fill="url(#wpmGradient)"
                    />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ r: 3, fill: 'hsl(var(--primary))' }}
                      activeDot={{ r: 5, fill: 'hsl(var(--primary))' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="rollingAvg"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            )}
            
            {showChart && (
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-primary rounded"></span>
                  Individual
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-success rounded" style={{ opacity: 0.8 }}></span>
                  Rolling Avg
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 bg-muted-foreground rounded opacity-50" style={{ borderStyle: 'dashed' }}></span>
                  Overall Avg
                </span>
              </div>
            )}
          </div>
        )}
        
        {history.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <History className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No test history yet!</p>
            <p className="text-sm mt-2">Complete a typing test to see your history.</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <Filter className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No tests match your filters</p>
            <p className="text-sm mt-2">Try adjusting your filter criteria.</p>
          </div>
        ) : (
          <>
            <div className="max-h-[280px] overflow-y-auto">
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
                  {filteredHistory.map((entry) => (
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
                Showing {filteredHistory.length} of {history.length} test{history.length !== 1 ? 's' : ''}
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
