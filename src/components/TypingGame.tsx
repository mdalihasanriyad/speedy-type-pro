import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTypingGame } from '@/hooks/useTypingGame';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useWeakKeys } from '@/hooks/useWeakKeys';
import { TypingDisplay } from './TypingDisplay';
import { StatsDisplay } from './StatsDisplay';
import { ResultsModal } from './ResultsModal';
import { TimerSelector } from './TimerSelector';
import { ModeSelector } from './ModeSelector';
import { ThemeSelector } from './ThemeSelector';
import { SoundToggle } from './SoundToggle';
import { WpmGraph } from './WpmGraph';
import { Leaderboard } from './Leaderboard';
import { TestHistory } from './TestHistory';
import { WeakKeysDashboard } from './WeakKeysDashboard';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { TypingMode } from '@/data/words';

export const TypingGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  const [selectedMode, setSelectedMode] = useState<TypingMode>('words');
  
  const { updateWeakKeys, getWeakKeys, hasWeakKeys } = useWeakKeys();
  const weakKeys = getWeakKeys();
  
  const {
    text,
    typedText,
    currentIndex,
    isRunning,
    isFinished,
    timeLeft,
    stats,
    wpmHistory,
    keyPressData,
    handleKeyPress,
    resetGame,
  } = useTypingGame(selectedDuration, selectedMode, weakKeys);

  const {
    soundEnabled,
    toggleSound,
    playCorrectSound,
    playIncorrectSound,
  } = useSoundEffects();

  const handleDurationChange = useCallback((newDuration: number) => {
    setSelectedDuration(newDuration);
  }, []);

  const handleModeChange = useCallback((newMode: TypingMode) => {
    setSelectedMode(newMode);
  }, []);

  // Reset game when duration or mode changes
  useEffect(() => {
    resetGame();
  }, [selectedDuration, selectedMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for keys that might interfere
      if (['Tab', 'Enter'].includes(e.key)) {
        if (e.key === 'Tab' && e.shiftKey) {
          e.preventDefault();
          resetGame();
          return;
        }
      }

      // Handle escape to reset
      if (e.key === 'Escape') {
        e.preventDefault();
        resetGame();
        return;
      }

      // Don't process if modifier keys are held (except shift for capitals)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Play sound based on correctness (only for printable characters)
      if (e.key.length === 1 && currentIndex < text.length && !isFinished) {
        const expectedChar = text[currentIndex];
        if (e.key === expectedChar) {
          playCorrectSound();
        } else {
          playIncorrectSound();
        }
      }

      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, resetGame, currentIndex, text, isFinished, playCorrectSound, playIncorrectSound]);

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Update weak keys when test finishes
  useEffect(() => {
    if (isFinished && Object.keys(keyPressData).length > 0) {
      updateWeakKeys(keyPressData);
    }
  }, [isFinished, keyPressData, updateWeakKeys]);

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ResultsModal stats={stats} onRestart={resetGame} duration={selectedDuration} mode={selectedMode} wpmHistory={wpmHistory} keyPressData={keyPressData} />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="min-h-screen flex flex-col bg-background outline-none"
      tabIndex={0}
    >
      {/* Header */}
      <header className="py-6">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">
              Speed Typing
            </h1>
            <div className="flex items-center gap-2">
              <Leaderboard />
              <TestHistory />
              <WeakKeysDashboard />
              <SoundToggle soundEnabled={soundEnabled} onToggle={toggleSound} />
              <ThemeSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Mode & Timer Selectors */}
      <div className="py-2">
        <div className="container max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <ModeSelector
            mode={selectedMode}
            onModeChange={handleModeChange}
            disabled={isRunning}
            hasPracticeData={hasWeakKeys()}
          />
          <TimerSelector
            duration={selectedDuration}
            onDurationChange={handleDurationChange}
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Stats & Graph */}
      <div className="py-4">
        <div className="container max-w-4xl mx-auto px-4">
          <StatsDisplay 
            stats={stats}
            timeLeft={timeLeft}
            isRunning={isRunning}
            isFinished={isFinished}
          />
          {/* <WpmGraph data={wpmHistory} isRunning={isRunning} /> */}
        </div>
      </div>

      {/* Typing Area */}
      <main className="flex-1 flex items-center py-4">
        <div className="container max-w-7xl mx-auto px-4">
          {/* {!isRunning && !isFinished && (
            <p className="text-center text-muted-foreground mb-8 animate-fade-in">
              Start typing to begin the test...
            </p>
          )} */}
          <TypingDisplay 
            text={text}
            typedText={typedText}
            currentIndex={currentIndex}
            isFinished={isFinished}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="ghost"
              size="lg"
              onClick={resetGame}
              className="text-muted-foreground hover:text-foreground hover:bg-secondary"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Restart
            </Button>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">Esc </kbd>
                <span>restart</span>
              </span>
              <span className="hidden md:flex items-center gap-1">
                <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">Shift</kbd>
                <span>+</span>
                <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">Tab</kbd>
                <span>Restart</span>
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              Developed by <a href="https://ahriyad.top/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">{""}ahriyad</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
