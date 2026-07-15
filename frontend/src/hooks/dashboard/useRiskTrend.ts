import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/dashboard';

export interface RiskTrendDataPoint {
  name: string;
  value: number;
}

export function useRiskTrend(timeRange: string = 'Last 7 Days', refetchInterval?: number) {
  const [data, setData] = useState<RiskTrendDataPoint[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval>;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await dashboardAPI.getRiskTrend(timeRange);
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
  }, [timeRange, refetchInterval]);

  return { data, isLoading, error };
}
