import { useState, useEffect } from 'react';

export function useRealtimeClock(updateInterval: number = 60000) {
  const [time, setTime] = useState<Date | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTime(new Date());
  }, []);

  useEffect(() => {
    if (!isClient) return;

    let interval: NodeJS.Timeout | null = null;
    const tick = () => setTime(new Date());

    // Align updates to minute boundary so the displayed minute flips on time.
    const now = new Date();
    const msUntilNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
    const timeout = setTimeout(() => {
      tick();
      interval = setInterval(tick, updateInterval);
    }, msUntilNextMinute);

    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [updateInterval, isClient]);

  const formatTime = (date: Date | null) => {
    if (!date) return '--:--';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const formatDate = (date: Date | null) => {
    if (!date) return '-- --, ----';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return {
    time: time,
    formatTime,
    formatDate,
    isClient,
  };
}
