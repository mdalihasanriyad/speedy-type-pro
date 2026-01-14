import { useState, useCallback, useEffect } from 'react';
import { TypingMode } from '@/data/words';

export interface TestHistoryEntry {
  id: string;
  wpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  duration: number;
  mode: TypingMode;
  date: string;
}

const STORAGE_KEY = 'typing-test-history';
const MAX_HISTORY_ENTRIES = 100; // Limit to prevent localStorage bloat

export function useTestHistory() {
  const [history, setHistory] = useState<TestHistoryEntry[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load test history:', error);
    }
  }, []);

  const saveToStorage = useCallback((data: TestHistoryEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save test history:', error);
    }
  }, []);

  const addTestResult = useCallback((
    duration: number,
    mode: TypingMode,
    wpm: number,
    accuracy: number,
    correctChars: number,
    incorrectChars: number,
    totalChars: number
  ): TestHistoryEntry => {
    const newEntry: TestHistoryEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      wpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      duration,
      mode,
      date: new Date().toISOString(),
    };

    const newHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ENTRIES);
    setHistory(newHistory);
    saveToStorage(newHistory);

    return newEntry;
  }, [history, saveToStorage]);

  const getRecentTests = useCallback((limit: number = 10): TestHistoryEntry[] => {
    return history.slice(0, limit);
  }, [history]);

  const getTestsByMode = useCallback((mode: TypingMode): TestHistoryEntry[] => {
    return history.filter(entry => entry.mode === mode);
  }, [history]);

  const getTestsByDuration = useCallback((duration: number): TestHistoryEntry[] => {
    return history.filter(entry => entry.duration === duration);
  }, [history]);

  const getAverageWpm = useCallback((): number => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, entry) => acc + entry.wpm, 0);
    return Math.round(sum / history.length);
  }, [history]);

  const getAverageAccuracy = useCallback((): number => {
    if (history.length === 0) return 0;
    const sum = history.reduce((acc, entry) => acc + entry.accuracy, 0);
    return Math.round(sum / history.length);
  }, [history]);

  const getTotalTestsCount = useCallback((): number => {
    return history.length;
  }, [history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const deleteTest = useCallback((id: string) => {
    const newHistory = history.filter(entry => entry.id !== id);
    setHistory(newHistory);
    saveToStorage(newHistory);
  }, [history, saveToStorage]);

  return {
    history,
    addTestResult,
    getRecentTests,
    getTestsByMode,
    getTestsByDuration,
    getAverageWpm,
    getAverageAccuracy,
    getTotalTestsCount,
    clearHistory,
    deleteTest,
  };
}
