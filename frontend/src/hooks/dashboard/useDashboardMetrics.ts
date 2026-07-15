import { useState, useEffect } from 'react';
import { dashboardAPI } from '../../api/dashboard';

export interface DashboardMetrics {
  totalCases: number;
  highRiskCases: number;
  amountAtRiskRaw: number;
  overallRiskScore: number;
  activeCases: { value: number; changeText: string; sparklineData: { value: number }[] };
  alerts: { value: number; status: string; sparklineData: { value: number }[] };
  amountAtRisk: { value: string; changeText: string; sparklineData: { value: number }[] };
}

export function useDashboardMetrics(refetchInterval?: number) {
  const [data, setData] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval>;

    const fetchData = async () => {
      try {
        const result = await dashboardAPI.getMetrics();
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
