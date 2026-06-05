import { useCallback, useEffect, useRef, useState } from 'react';
import { CreditBalanceResponse } from '@/types/api';
import { useUIStore } from '@/lib/store/ui-store';

const REFRESH_INTERVAL = 30_000; // 30 seconds

export function useCredits() {
  const swarmsApiKey = useUIStore((state) => state.swarmsApiKey);
  const [credits, setCredits] = useState<CreditBalanceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchCredits = useCallback(
    async (key: string, force = false) => {
      try {
        setIsLoading(true);
        const url = force ? '/api/credits?refresh=1' : '/api/credits';
        const response = await fetch(url, {
          headers: { 'x-api-key': key },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Failed to fetch credit balance');
        }

        const data: CreditBalanceResponse = await response.json();
        setCredits(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch credit balance');
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (!swarmsApiKey) {
      setCredits(null);
      setError(null);
      return;
    }

    fetchCredits(swarmsApiKey);
    intervalRef.current = setInterval(() => {
      fetchCredits(swarmsApiKey);
    }, REFRESH_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [swarmsApiKey, fetchCredits]);

  const refetch = useCallback(() => {
    if (swarmsApiKey) fetchCredits(swarmsApiKey, true);
  }, [swarmsApiKey, fetchCredits]);

  return { credits, isLoading, error, refetch };
}
