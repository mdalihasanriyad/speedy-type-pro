import { useState, useCallback, useEffect } from 'react';
import { KeyPressData } from './useTypingGame';

const STORAGE_KEY = 'typing-weak-keys';

export interface WeakKeyData {
  [key: string]: {
    correct: number;
    incorrect: number;
    lastUpdated: number;
  };
}

export function useWeakKeys() {
  const [weakKeyData, setWeakKeyData] = useState<WeakKeyData>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weakKeyData));
  }, [weakKeyData]);

  const updateWeakKeys = useCallback((keyPressData: KeyPressData) => {
    setWeakKeyData(prev => {
      const updated = { ...prev };
      const now = Date.now();
      
      Object.entries(keyPressData).forEach(([key, data]) => {
        const existing = updated[key] || { correct: 0, incorrect: 0, lastUpdated: now };
        updated[key] = {
          correct: existing.correct + data.correct,
          incorrect: existing.incorrect + data.incorrect,
          lastUpdated: now,
        };
      });
      
      return updated;
    });
  }, []);

  const getWeakKeys = useCallback((limit: number = 10): string[] => {
    return Object.entries(weakKeyData)
      .filter(([_, data]) => data.incorrect > 0)
      .map(([key, data]) => ({
        key,
        errorRate: data.incorrect / (data.correct + data.incorrect),
        totalErrors: data.incorrect,
      }))
      .sort((a, b) => {
        // Sort by error rate first, then by total errors
        if (Math.abs(a.errorRate - b.errorRate) > 0.1) {
          return b.errorRate - a.errorRate;
        }
        return b.totalErrors - a.totalErrors;
      })
      .slice(0, limit)
      .map(item => item.key);
  }, [weakKeyData]);

  const hasWeakKeys = useCallback((): boolean => {
    return Object.values(weakKeyData).some(data => data.incorrect > 0);
  }, [weakKeyData]);

  const getWeakKeyStats = useCallback(() => {
    const entries = Object.entries(weakKeyData).filter(([_, data]) => data.incorrect > 0);
    return entries.map(([key, data]) => ({
      key,
      correct: data.correct,
      incorrect: data.incorrect,
      accuracy: Math.round((data.correct / (data.correct + data.incorrect)) * 100),
    })).sort((a, b) => a.accuracy - b.accuracy);
  }, [weakKeyData]);

  const clearWeakKeys = useCallback(() => {
    setWeakKeyData({});
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    weakKeyData,
    updateWeakKeys,
    getWeakKeys,
    hasWeakKeys,
    getWeakKeyStats,
    clearWeakKeys,
  };
}
