import { useState, useEffect, useCallback } from 'react';
import { TypingMode } from '@/data/words';

export interface LeaderboardEntry {
  wpm: number;
  accuracy: number;
  date: string;
}

export interface LeaderboardData {
  [key: string]: LeaderboardEntry | null;
}

const STORAGE_KEY = 'typing-leaderboard';

function getStorageKey(duration: number, mode: TypingMode): string {
  return `${mode}-${duration}`;
}

export function useLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardData>({});

  // Load leaderboard from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setLeaderboard(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  }, []);

  // Save to localStorage whenever leaderboard changes
  const saveToStorage = useCallback((data: LeaderboardData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save leaderboard:', error);
    }
  }, []);

  const getPersonalBest = useCallback((duration: number, mode: TypingMode): LeaderboardEntry | null => {
    const key = getStorageKey(duration, mode);
    return leaderboard[key] || null;
  }, [leaderboard]);

  const saveScore = useCallback((
    duration: number,
    mode: TypingMode,
    wpm: number,
    accuracy: number
  ): { isNewRecord: boolean; previousBest: LeaderboardEntry | null } => {
    const key = getStorageKey(duration, mode);
    const previousBest = leaderboard[key] || null;
    
    // Check if this is a new record (higher WPM, or same WPM with better accuracy)
    const isNewRecord = !previousBest || 
      wpm > previousBest.wpm || 
      (wpm === previousBest.wpm && accuracy > previousBest.accuracy);

    if (isNewRecord) {
      const newEntry: LeaderboardEntry = {
        wpm,
        accuracy,
        date: new Date().toISOString(),
      };

      const newLeaderboard = {
        ...leaderboard,
        [key]: newEntry,
      };

      setLeaderboard(newLeaderboard);
      saveToStorage(newLeaderboard);
    }

    return { isNewRecord, previousBest };
  }, [leaderboard, saveToStorage]);

  const getAllPersonalBests = useCallback((): Array<{
    mode: TypingMode;
    duration: number;
    entry: LeaderboardEntry;
  }> => {
    const results: Array<{ mode: TypingMode; duration: number; entry: LeaderboardEntry }> = [];
    
    const modes: TypingMode[] = ['words', 'quotes', 'numbers', 'punctuation'];
    const durations = [15, 30, 60, 120];

    for (const mode of modes) {
      for (const duration of durations) {
        const key = getStorageKey(duration, mode);
        const entry = leaderboard[key];
        if (entry) {
          results.push({ mode, duration, entry });
        }
      }
    }

    // Sort by WPM descending
    return results.sort((a, b) => b.entry.wpm - a.entry.wpm);
  }, [leaderboard]);

  const clearLeaderboard = useCallback(() => {
    setLeaderboard({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    getPersonalBest,
    saveScore,
    getAllPersonalBests,
    clearLeaderboard,
  };
}
