'use client';

import { useCallback, useState } from 'react';

interface UseBeachSearchResult {
  beaches: any[];
  loading: boolean;
  error: string | null;
  searchBeaches: (query: string) => Promise<void>;
}

/**
 * Hook for searching and selecting beaches
 */
export function useBeachSearch(): UseBeachSearchResult {
  const [beaches, setBeaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBeaches = useCallback(async (query: string) => {
    if (query.length < 2) {
      setBeaches([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/beaches/search?q=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error('Failed to search beaches');
      }

      const data = await response.json();
      setBeaches(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setBeaches([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { beaches, loading, error, searchBeaches };
}
