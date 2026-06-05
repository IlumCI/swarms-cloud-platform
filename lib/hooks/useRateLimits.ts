import { useState, useEffect, useRef } from 'react';
import { RateLimitsResponse } from '@/types/api';
import { useUIStore } from '@/lib/store/ui-store';

// Cache for rate limits data
interface RateLimitsCache {
  data: RateLimitsResponse | null;
  timestamp: number;
  error: string | null;
  apiKey: string;
}

let rateLimitsCache: RateLimitsCache = {
  data: null,
  timestamp: 0,
  error: null,
  apiKey: '',
};

const CACHE_DURATION = 20000; // 20 seconds
let fetchPromise: Promise<RateLimitsResponse | null> | null = null;

const fetchRateLimitsFromAPI = async (apiKey: string): Promise<RateLimitsResponse | null> => {
  try {
    const response = await fetch('/api/rate-limits', {
      headers: { 'x-api-key': apiKey },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch rate limits');
    }

    const data = await response.json();
    return data;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to fetch rate limits';
    throw new Error(errorMessage);
  }
};

const updateCache = async (apiKey: string): Promise<void> => {
  if (rateLimitsCache.apiKey !== apiKey) {
    rateLimitsCache = {
      data: null,
      timestamp: 0,
      error: null,
      apiKey,
    };
  }

  // If there's already a fetch in progress, wait for it
  if (fetchPromise) {
    try {
      const data = await fetchPromise;
      if (data) {
        rateLimitsCache = {
          data,
          timestamp: Date.now(),
          error: null,
          apiKey,
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch rate limits';
      rateLimitsCache.error = errorMessage;
    }
    return;
  }

  // Start new fetch
  fetchPromise = fetchRateLimitsFromAPI(apiKey);
  
  try {
    const data = await fetchPromise;
    if (data) {
      rateLimitsCache = {
        data,
        timestamp: Date.now(),
        error: null,
        apiKey,
      };
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch rate limits';
    rateLimitsCache.error = errorMessage;
  } finally {
    fetchPromise = null;
  }
};

export function useRateLimits() {
  const swarmsApiKey = useUIStore((state) => state.swarmsApiKey);
  const [rateLimits, setRateLimits] = useState<RateLimitsResponse | null>(rateLimitsCache.data);
  const [isLoading, setIsLoading] = useState(!rateLimitsCache.data && !!swarmsApiKey);
  const [error, setError] = useState<string | null>(rateLimitsCache.error);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // Get toast function from store
  const getAddToast = () => useUIStore.getState().addToast;

  const fetchRateLimits = async (showErrorToast = false) => {
    if (!swarmsApiKey) {
      setRateLimits(null);
      setError('Missing swarms_api_key. Please enter your API key first.');
      setIsLoading(false);
      return;
    }

    const now = Date.now();
    const cacheAge = now - rateLimitsCache.timestamp;

    // If cache is still valid, use it
    if (
      rateLimitsCache.data &&
      rateLimitsCache.apiKey === swarmsApiKey &&
      cacheAge < CACHE_DURATION
    ) {
      setRateLimits(rateLimitsCache.data);
      setError(null);
      setIsLoading(false);
      return;
    }

    // If cache is stale or doesn't exist, fetch new data
    if (isInitialMount.current || cacheAge >= CACHE_DURATION) {
      setIsLoading(isInitialMount.current);
      setError(null);
      
      await updateCache(swarmsApiKey);
      
      setRateLimits(rateLimitsCache.data);
      setError(rateLimitsCache.error);
      
      // Show error toast if needed
      if (rateLimitsCache.error && showErrorToast) {
        getAddToast()({
          type: 'error',
          message: rateLimitsCache.error,
          duration: 5000,
        });
      }
      
      setIsLoading(false);
      isInitialMount.current = false;
    }
  };

  useEffect(() => {
    if (!swarmsApiKey) {
      return;
    }

    // Initial load
    fetchRateLimits(true);

    // Set up interval to refresh every 20 seconds
    intervalRef.current = setInterval(() => {
      fetchRateLimits(false); // Don't show toast on auto-refresh
    }, CACHE_DURATION);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [swarmsApiKey]);

  // Manual refetch function
  const refetch = async () => {
    if (!swarmsApiKey) {
      setError('Missing swarms_api_key. Please enter your API key first.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    await updateCache(swarmsApiKey);
    setRateLimits(rateLimitsCache.data);
    setError(rateLimitsCache.error);
    
    // Show error toast on manual refresh if there's an error
    if (rateLimitsCache.error) {
      getAddToast()({
        type: 'error',
        message: rateLimitsCache.error,
        duration: 5000,
      });
    }
    
    setIsLoading(false);
  };

  return {
    rateLimits,
    isLoading,
    error,
    refetch,
  };
}
