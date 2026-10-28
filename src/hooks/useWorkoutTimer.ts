import { useState, useEffect, useRef, useCallback } from 'react';
import { AudioService } from '../services/audioService';
import { VibrationService } from '../services/vibrationService';

interface TimerOptions {
  soundEnabled?: boolean;
  vibrationEnabled?: boolean;
  onComplete?: () => void;
}

export function useWorkoutTimer(options: TimerOptions = {}) {
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Store absolute end timestamp (ms) to eliminate background throttling drift
  const endTimeRef = useRef<number | null>(null);
  const pausedRemainingRef = useRef<number>(0);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Sound tick tracking for last 3 seconds
  const lastTickSecondRef = useRef<number | null>(null);

  const startTimer = useCallback((seconds: number) => {
    if (seconds <= 0) return;
    const now = Date.now();
    endTimeRef.current = now + seconds * 1000;
    setTotalSeconds(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(true);
    setIsPaused(false);
    lastTickSecondRef.current = null;
  }, []);

  const pauseTimer = useCallback(() => {
    if (!isRunning || isPaused || !endTimeRef.current) return;
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - now) / 1000));
    pausedRemainingRef.current = remaining;
    endTimeRef.current = null;
    setIsPaused(true);
  }, [isRunning, isPaused]);

  const resumeTimer = useCallback(() => {
    if (!isRunning || !isPaused) return;
    const now = Date.now();
    endTimeRef.current = now + pausedRemainingRef.current * 1000;
    setIsPaused(false);
  }, [isRunning, isPaused]);

  const extendTimer = useCallback((addSeconds: number) => {
    if (!isRunning) {
      startTimer(addSeconds);
      return;
    }
    if (isPaused) {
      pausedRemainingRef.current += addSeconds;
      setRemainingSeconds(pausedRemainingRef.current);
      setTotalSeconds(prev => prev + addSeconds);
    } else if (endTimeRef.current) {
      endTimeRef.current += addSeconds * 1000;
      setTotalSeconds(prev => prev + addSeconds);
    }
  }, [isRunning, isPaused, startTimer]);

  const resetTimer = useCallback(() => {
    if (totalSeconds > 0) {
      startTimer(totalSeconds);
    }
  }, [totalSeconds, startTimer]);

  const stopTimer = useCallback(() => {
    endTimeRef.current = null;
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
  }, []);

  useEffect(() => {
    if (!isRunning || isPaused) return;

    const interval = setInterval(() => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const remainingMs = endTimeRef.current - now;
      const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));

      setRemainingSeconds(remainingSec);

      // Play tick sound on 3, 2, 1 if enabled
      if (
        optionsRef.current.soundEnabled &&
        remainingSec <= 3 &&
        remainingSec > 0 &&
        lastTickSecondRef.current !== remainingSec
      ) {
        lastTickSecondRef.current = remainingSec;
        AudioService.playCountdownTick();
      }

      if (remainingMs <= 0) {
        // Timer completed!
        clearInterval(interval);
        endTimeRef.current = null;
        setIsRunning(false);
        setIsPaused(false);
        setRemainingSeconds(0);

        if (optionsRef.current.soundEnabled) {
          AudioService.playRestCompleteChime();
        }
        if (optionsRef.current.vibrationEnabled) {
          VibrationService.restFinished();
        }
        if (optionsRef.current.onComplete) {
          optionsRef.current.onComplete();
        }
      }
    }, 200);

    return () => clearInterval(interval);
  }, [isRunning, isPaused]);

  return {
    remainingSeconds,
    totalSeconds,
    isRunning,
    isPaused,
    startTimer,
    pauseTimer,
    resumeTimer,
    extendTimer,
    resetTimer,
    stopTimer
  };
}
