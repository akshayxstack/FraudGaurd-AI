import { apiClient } from './client';

export interface UploadResponse {
  caseId: string;
  summary: {
    totalTransactions: number;
    fraudDetected: number;
    safeTransactions: number;
    highRisk: number;
    mediumRisk: number;
    lowRisk: number;
    averageFraudProbability: number;
    processingTimeMs: number;
  };
  predictions?: any[];
}

export const uploadAPI = {
  uploadFile: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<any>('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Increase timeout for large file uploads
      timeout: 300000,
    });
    
    return response as any;
  },
};
