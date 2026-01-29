'use client';

import { useCallback, useState } from 'react';
import { SurfForecast } from '@/types';

interface UseForecastResult {
  forecast: SurfForecast | null;
  loading: boolean;
  error: string | null;
  fetchForecast: (beachId: string) => Promise<void>;
}

/**
 * Hook for fetching surf forecasts
 */
export function useForecast(): UseForecastResult {
  const [forecast, setForecast] = useState<SurfForecast | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForecast = useCallback(async (beachId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/forecasts/${beachId}`);

      if (!response.ok) {
        throw new Error('Failed to fetch forecast');
      }

      const data = await response.json();
      setForecast(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { forecast, loading, error, fetchForecast };
}
