import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTypingGame } from '@/hooks/useTypingGame';
import { TypingDisplay } from './TypingDisplay';
import { StatsDisplay } from './StatsDisplay';
import { ResultsModal } from './ResultsModal';
import { TimerSelector } from './TimerSelector';
import { Button } from '@/components/ui/button';
import { RotateCcw, Keyboard } from 'lucide-react';

export const TypingGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedDuration, setSelectedDuration] = useState(60);
  
  const {
    text,
    typedText,
    currentIndex,
    isRunning,
    isFinished,
    timeLeft,
    stats,
    handleKeyPress,
    resetGame,
  } = useTypingGame(selectedDuration);

  const handleDurationChange = useCallback((newDuration: number) => {
    setSelectedDuration(newDuration);
  }, []);

  // Reset game when duration changes
  useEffect(() => {
    resetGame();
  }, [selectedDuration]);

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

      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, resetGame]);

  // Focus container on mount
  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  if (isFinished) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <ResultsModal stats={stats} onRestart={resetGame} duration={selectedDuration} />
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
      <header className="py-6 md:py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl md:text-3xl font-bold text-gradient">
              Triwebic Typing
            </h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Keyboard className="w-4 h-4" />
              <span className="hidden md:inline">{selectedDuration} seconds</span>
            </div>
          </div>
        </div>
      </header>

      {/* Timer Mode Selector */}
      <div className="py-2">
        <div className="container max-w-4xl mx-auto px-4 flex justify-center">
          <TimerSelector
            duration={selectedDuration}
            onDurationChange={handleDurationChange}
            disabled={isRunning}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="py-6 md:py-8">
        <div className="container max-w-4xl mx-auto px-4">
          <StatsDisplay 
            stats={stats}
            timeLeft={timeLeft}
            isRunning={isRunning}
            isFinished={isFinished}
          />
        </div>
      </div>

      {/* Typing Area */}
      <main className="flex-1 flex items-center py-8">
        <div className="container max-w-4xl mx-auto px-4">
          {!isRunning && !isFinished && (
            <p className="text-center text-muted-foreground mb-8 animate-fade-in">
              Start typing to begin the test...
            </p>
          )}
          <TypingDisplay 
            text={text}
            typedText={typedText}
            currentIndex={currentIndex}
            isFinished={isFinished}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 md:py-8">
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
                <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">Esc</kbd>
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
              Developed by <a href="https://ahriyad.top/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">ahriyad</a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};
