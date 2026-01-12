import { useState, useCallback, useEffect, useRef } from 'react';
import { generateTypingText, TypingMode } from '@/data/words';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export interface TypingGameState {
  text: string;
  typedText: string;
  currentIndex: number;
  isRunning: boolean;
  isFinished: boolean;
  timeLeft: number;
  stats: TypingStats;
}

export function useTypingGame(duration: number = 60, mode: TypingMode = 'words') {
  const [text, setText] = useState(() => generateTypingText(100, mode));
  const [typedText, setTypedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const calculateStats = useCallback((): TypingStats => {
    const totalChars = correctChars + incorrectChars;
    const elapsedTime = duration - timeLeft;
    const minutes = elapsedTime / 60;
    
    // WPM = (characters / 5) / minutes
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    return {
      wpm: Math.max(0, wpm),
      accuracy: Math.max(0, Math.min(100, accuracy)),
      correctChars,
      incorrectChars,
      totalChars,
    };
  }, [correctChars, incorrectChars, duration, timeLeft]);

  const startGame = useCallback(() => {
    if (!isRunning && !isFinished) {
      setIsRunning(true);
      startTimeRef.current = Date.now();
    }
  }, [isRunning, isFinished]);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setText(generateTypingText(100, mode));
    setTypedText('');
    setCurrentIndex(0);
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(duration);
    setCorrectChars(0);
    setIncorrectChars(0);
    startTimeRef.current = null;
  }, [duration, mode]);

  const handleKeyPress = useCallback((key: string) => {
    if (isFinished) return;

    // Start timer on first keypress
    if (!isRunning) {
      startGame();
    }

    if (key === 'Backspace') {
      if (currentIndex > 0) {
        const deletedChar = typedText[currentIndex - 1];
        const expectedChar = text[currentIndex - 1];
        
        // Adjust counts when backspacing
        if (deletedChar === expectedChar) {
          setCorrectChars(prev => Math.max(0, prev - 1));
        } else {
          setIncorrectChars(prev => Math.max(0, prev - 1));
        }
        
        setTypedText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
      }
      return;
    }

    // Only handle printable characters
    if (key.length === 1 && currentIndex < text.length) {
      const expectedChar = text[currentIndex];
      const isCorrect = key === expectedChar;

      if (isCorrect) {
        setCorrectChars(prev => prev + 1);
      } else {
        setIncorrectChars(prev => prev + 1);
      }

      setTypedText(prev => prev + key);
      setCurrentIndex(prev => prev + 1);

      // Check if reached end of text
      if (currentIndex + 1 >= text.length) {
        setIsFinished(true);
        setIsRunning(false);
      }
    }
  }, [currentIndex, isFinished, isRunning, startGame, text, typedText]);

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning]);

  return {
    text,
    typedText,
    currentIndex,
    isRunning,
    isFinished,
    timeLeft,
    stats: calculateStats(),
    handleKeyPress,
    resetGame,
  };
}
