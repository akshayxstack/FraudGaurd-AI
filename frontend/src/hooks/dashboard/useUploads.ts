import { useCallback, useEffect, useState } from 'react';
import { dashboardAPI } from '../../api/dashboard';

export interface UploadedFileType {
  id: string;
  fileName: string;
  fileType: 'XLSX' | 'CSV' | 'PDF' | 'JSON';
  uploaderName: string;
  uploaderRole: string;
  uploadedOnDate: string;
  uploadedOnTime: string;
  records: string | number;
  status: 'Processed' | 'Failed' | 'Pending';
  sizeMB: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useUploads(
  params?: { page?: number; limit?: number; search?: string; status?: string; fileType?: string },
  refetchInterval?: number
) {
  const [data, setData] = useState<UploadedFileType[] | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async (shouldUpdate: () => boolean = () => true) => {
    try {
      const result = await dashboardAPI.getUploads(params);
      if (shouldUpdate()) {
        setData(result.uploads);
        setPagination({
          total: result.total,
          page: result.page,
          limit: result.limit,
          totalPages: result.totalPages
        });
        setIsLoading(false);
        setError(null);
      }
    } catch (err) {
      if (shouldUpdate()) {
        setError(err as Error);
        setIsLoading(false);
      }
    }
  }, [
    params?.page,
    params?.limit,
    params?.search,
    params?.status,
    params?.fileType,
  ]);

  useEffect(() => {
    let isMounted = true;
    let intervalId: ReturnType<typeof setInterval>;

    fetchData(() => isMounted);

    if (refetchInterval) {
      intervalId = setInterval(() => fetchData(() => isMounted), refetchInterval);
    }

    return () => {
      isMounted = false;
      if (intervalId) clearInterval(intervalId);
    };
  }, [fetchData, refetchInterval]);

  return { data, pagination, isLoading, error, refetch: fetchData };
}
