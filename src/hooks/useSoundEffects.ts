import { useCallback, useRef, useState, useEffect } from 'react';

export function useSoundEffects() {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const saved = localStorage.getItem('typing-sound-enabled');
    return saved !== null ? saved === 'true' : true;
  });
  
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem('typing-sound-enabled', String(soundEnabled));
  }, [soundEnabled]);

  const getAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number, type: OscillatorType = 'sine', volume: number = 0.1) => {
    if (!soundEnabled) return;

    try {
      const audioContext = getAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;

      gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Audio playback failed:', error);
    }
  }, [soundEnabled, getAudioContext]);

  const playCorrectSound = useCallback(() => {
    playTone(600, 0.08, 'sine', 0.08);
  }, [playTone]);

  const playIncorrectSound = useCallback(() => {
    playTone(200, 0.15, 'square', 0.06);
  }, [playTone]);

  const playKeySound = useCallback(() => {
    playTone(400, 0.05, 'sine', 0.03);
  }, [playTone]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  return {
    soundEnabled,
    toggleSound,
    playCorrectSound,
    playIncorrectSound,
    playKeySound,
  };
}
