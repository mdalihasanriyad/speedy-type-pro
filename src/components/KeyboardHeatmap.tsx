import React, { useMemo } from 'react';
import { Keyboard } from 'lucide-react';

export interface KeyPressData {
  [key: string]: {
    correct: number;
    incorrect: number;
  };
}

interface KeyboardHeatmapProps {
  keyPressData: KeyPressData;
}

const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  [' '],
];

const KEY_DISPLAY_MAP: Record<string, string> = {
  ' ': 'Space',
  ';': ';',
  "'": "'",
  ',': ',',
  '.': '.',
  '/': '/',
  '[': '[',
  ']': ']',
  '\\': '\\',
  '-': '-',
  '=': '=',
  '`': '`',
};

export const KeyboardHeatmap: React.FC<KeyboardHeatmapProps> = ({ keyPressData }) => {
  const stats = useMemo(() => {
    let maxPresses = 0;
    let totalCorrect = 0;
    let totalIncorrect = 0;
    
    Object.values(keyPressData).forEach(data => {
      const total = data.correct + data.incorrect;
      if (total > maxPresses) maxPresses = total;
      totalCorrect += data.correct;
      totalIncorrect += data.incorrect;
    });
    
    return { maxPresses, totalCorrect, totalIncorrect };
  }, [keyPressData]);

  const getKeyStyle = (key: string) => {
    const data = keyPressData[key.toLowerCase()] || keyPressData[key];
    if (!data) return {};
    
    const total = data.correct + data.incorrect;
    if (total === 0) return {};
    
    const accuracy = data.correct / total;
    const intensity = Math.min(total / Math.max(stats.maxPresses, 1), 1);
    const opacity = Math.max(0.15, intensity * 0.7);
    
    if (accuracy >= 0.9) {
      return { backgroundColor: `hsl(var(--success) / ${opacity})` };
    } else if (accuracy >= 0.7) {
      return { backgroundColor: `hsl(45 93% 47% / ${opacity})` };
    } else {
      return { backgroundColor: `hsl(var(--destructive) / ${opacity})` };
    }
  };

  const getKeyData = (key: string) => {
    return keyPressData[key.toLowerCase()] || keyPressData[key] || { correct: 0, incorrect: 0 };
  };

  if (Object.keys(keyPressData).length === 0) {
    return null;
  }

  return (
    <div className="bg-secondary/30 rounded-lg p-3 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">Keyboard Heatmap</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-success/60" />
            <span className="text-muted-foreground">Accurate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded bg-destructive/60" />
            <span className="text-muted-foreground">Errors</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-1">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1 justify-center">
            {row.map((key) => {
              const data = getKeyData(key);
              const total = data.correct + data.incorrect;
              const isSpace = key === ' ';
              
              return (
                <div
                  key={key}
                  className={`
                    ${isSpace ? 'w-32' : 'w-6 md:w-7'} 
                    h-6 md:h-7 
                    rounded 
                    flex items-center justify-center 
                    text-[10px] md:text-xs font-mono
                    border border-border/50
                    transition-all duration-200
                    ${total > 0 ? 'text-foreground' : 'text-muted-foreground/50'}
                  `}
                  style={getKeyStyle(key)}
                  title={total > 0 ? `${key === ' ' ? 'Space' : key.toUpperCase()}: ${data.correct}✓ ${data.incorrect}✗` : undefined}
                >
                  {KEY_DISPLAY_MAP[key] || key.toUpperCase()}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      {/* Summary stats */}
      <div className="flex justify-center gap-4 mt-3 text-xs text-muted-foreground">
        <span>
          Keys pressed: <span className="font-mono font-bold text-foreground">{stats.totalCorrect + stats.totalIncorrect}</span>
        </span>
        <span>
          Accuracy: <span className="font-mono font-bold text-success">
            {stats.totalCorrect + stats.totalIncorrect > 0 
              ? Math.round((stats.totalCorrect / (stats.totalCorrect + stats.totalIncorrect)) * 100)
              : 100}%
          </span>
        </span>
      </div>
    </div>
  );
};
