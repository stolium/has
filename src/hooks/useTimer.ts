import { useState, useEffect, useCallback } from 'react';

interface UseTimerResult {
  secondsLeft: number | null;
  isExpired: boolean;
}

export function useTimer(endTimestamp: number | null): UseTimerResult {
  const calcRemaining = useCallback(() => {
    if (endTimestamp === null) return null;
    return Math.max(0, Math.ceil((endTimestamp - Date.now()) / 1000));
  }, [endTimestamp]);

  const [secondsLeft, setSecondsLeft] = useState<number | null>(calcRemaining);

  useEffect(() => {
    setSecondsLeft(calcRemaining());

    if (endTimestamp === null) return;

    const interval = setInterval(() => {
      const remaining = calcRemaining();
      setSecondsLeft(remaining);
      if (remaining === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTimestamp, calcRemaining]);

  return {
    secondsLeft,
    isExpired: secondsLeft === 0,
  };
}
