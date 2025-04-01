'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type CountdownContextType = {
  countdown: number | null;
  setCountdown: (value: number | null) => void;
  formatTime: (seconds: number) => string;
  startCountdown: (durationInSeconds: number) => void;
  resetCountdown: () => void;
  isActive: boolean;
};

const CountdownContext = createContext<CountdownContextType | undefined>(undefined);

export function CountdownProvider({ children }: { children: ReactNode }) {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const storedCountdownData = localStorage.getItem('prizeCountdown');
    if (storedCountdownData) {
      const { endTime } = JSON.parse(storedCountdownData);
      const now = Date.now();
      const remainingTime = Math.max(0, Math.floor((endTime - now) / 1000));

      if (remainingTime > 0) {
        setCountdown(remainingTime);
        setIsActive(true);
      } else {
        localStorage.removeItem('prizeCountdown');
        setCountdown(0);
        setIsActive(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!isActive || countdown === null || countdown <= 0) {
      if (countdown === 0) {
        localStorage.removeItem('prizeCountdown');
        setIsActive(false);
      }
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          localStorage.removeItem('prizeCountdown');
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, isActive]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0'),
    ].join(':');
  };

  const startCountdown = (durationInSeconds: number) => {
    setCountdown(durationInSeconds);
    setIsActive(true);

    const endTime = Date.now() + durationInSeconds * 1000;
    localStorage.setItem(
      'prizeCountdown',
      JSON.stringify({
        endTime,
        originalDuration: durationInSeconds,
      }),
    );
  };

  const resetCountdown = () => {
    setCountdown(null);
    setIsActive(false);
    localStorage.removeItem('prizeCountdown');
  };

  const value = {
    countdown,
    setCountdown,
    formatTime,
    startCountdown,
    resetCountdown,
    isActive,
  };

  return <CountdownContext.Provider value={value}>{children}</CountdownContext.Provider>;
}

export function useCountdown() {
  const context = useContext(CountdownContext);
  if (context === undefined) {
    throw new Error('useCountdown must be used within a CountdownProvider');
  }
  return context;
}
