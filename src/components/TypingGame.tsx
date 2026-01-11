import React, { useEffect, useRef } from 'react';
import { useTypingGame } from '@/hooks/useTypingGame';
import { TypingDisplay } from './TypingDisplay';
import { StatsDisplay } from './StatsDisplay';
import { ResultsModal } from './ResultsModal';
import { Button } from '@/components/ui/button';
import { RotateCcw, Keyboard } from 'lucide-react';

export const TypingGame: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
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
  } = useTypingGame(60);

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
        <ResultsModal stats={stats} onRestart={resetGame} />
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
              <span className="hidden md:inline">60 seconds</span>
            </div>
          </div>
        </div>
      </header>

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
                <span>Restart</span> <br /> <br />
                <span>Develop by <a href="https://ahriyad.top/" target="_blank" className='text-yellow-300'> ahriyad </a></span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
