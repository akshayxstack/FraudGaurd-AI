import { useState, useEffect } from 'react';
import { casesAPI } from '../../api/cases';

export interface CaseType {
  id: string;
  caseId: string;
  type: string;
  customerName: string;
  customerTitle: string;
  riskScore: number;
  riskSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'In Progress' | 'Under Review' | 'Closed';
  assigneeName: string;
  assigneeRole: string;
  assigneeAvatar?: string;
  createdOnDate: string;
  createdOnTime: string;
  amount: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useCases(
  params?: { page?: number; limit?: number; status?: string; riskLevel?: string; search?: string; assignedTo?: string; dateRange?: string },
  refetchInterval?: number
) {
  const [data, setData] = useState<CaseType[] | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = async () => {
    try {
      const result = await casesAPI.getCases(params);
      setData(result.cases);
      setPagination({
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages
      });
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError(err as Error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    fetchData();

    if (refetchInterval) {
      intervalId = setInterval(fetchData, refetchInterval);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    params?.page,
    params?.limit,
    params?.status,
    params?.riskLevel,
    params?.search,
    params?.assignedTo,
    params?.dateRange,
    refetchInterval
  ]);

  return { data, pagination, isLoading, error, refetch: fetchData };
}
