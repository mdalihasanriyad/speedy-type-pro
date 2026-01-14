import { useState, useCallback, useEffect, useRef } from 'react';
import { generateTypingText, TypingMode } from '@/data/words';

export interface TypingStats {
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
}

export interface WpmDataPoint {
  time: number;
  wpm: number;
}

export interface KeyPressData {
  [key: string]: {
    correct: number;
    incorrect: number;
  };
}

export interface TypingGameState {
  text: string;
  typedText: string;
  currentIndex: number;
  isRunning: boolean;
  isFinished: boolean;
  timeLeft: number;
  stats: TypingStats;
  wpmHistory: WpmDataPoint[];
  keyPressData: KeyPressData;
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
  const [wpmHistory, setWpmHistory] = useState<WpmDataPoint[]>([]);
  const [keyPressData, setKeyPressData] = useState<KeyPressData>({});
  
  const startTimeRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const correctCharsRef = useRef(0);

  // Keep ref in sync with state for timer callback
  useEffect(() => {
    correctCharsRef.current = correctChars;
  }, [correctChars]);

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
    setWpmHistory([]);
    setKeyPressData({});
    startTimeRef.current = null;
    correctCharsRef.current = 0;
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

      // Track key press data
      const keyLower = key.toLowerCase();
      setKeyPressData(prev => ({
        ...prev,
        [keyLower]: {
          correct: (prev[keyLower]?.correct || 0) + (isCorrect ? 1 : 0),
          incorrect: (prev[keyLower]?.incorrect || 0) + (isCorrect ? 0 : 1),
        }
      }));

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
          const newTimeLeft = prev - 1;
          const elapsedTime = duration - newTimeLeft;
          const minutes = elapsedTime / 60;
          const currentWpm = minutes > 0 ? Math.round((correctCharsRef.current / 5) / minutes) : 0;
          
          // Record WPM every second
          setWpmHistory(history => [...history, { time: elapsedTime, wpm: Math.max(0, currentWpm) }]);
          
          if (newTimeLeft <= 0) {
            setIsFinished(true);
            setIsRunning(false);
            return 0;
          }
          return newTimeLeft;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, duration]);

  return {
    text,
    typedText,
    currentIndex,
    isRunning,
    isFinished,
    timeLeft,
    stats: calculateStats(),
    wpmHistory,
    keyPressData,
    handleKeyPress,
    resetGame,
  };
}
