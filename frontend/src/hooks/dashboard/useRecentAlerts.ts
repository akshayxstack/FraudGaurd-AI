import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/dashboard';

export interface RecentAlert {
  title: string;
  subtitle: string;
  time: string;
  color: 'red' | 'orange';
}

export function useRecentAlerts(refetchInterval?: number) {
  const [data, setData] = useState<RecentAlert[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval>;

    const fetchData = async () => {
      try {
        const result = await dashboardAPI.getRecentAlerts();
        if (isMounted) {
          setData(result);
          setIsLoading(false);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err as Error);
          setIsLoading(false);
        }
      }
    };

    fetchData();

    if (refetchInterval) {
      intervalId = setInterval(fetchData, refetchInterval);
    }

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [refetchInterval]);

  return { data, isLoading, error };
}
