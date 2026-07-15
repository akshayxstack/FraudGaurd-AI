import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/dashboard';

export interface RiskCategory {
  name: string;
  value: number;
  color: string;
}

export function useRiskCategories(refetchInterval?: number) {
  const [data, setData] = useState<RiskCategory[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval>;

    const fetchData = async () => {
      try {
        const result = await dashboardAPI.getRiskCategories();
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
