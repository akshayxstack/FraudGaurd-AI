import { apiClient } from './client';

export interface HealthResponse {
  status: string;
  mlService?: {
    status: string;
    model_loaded: boolean;
  };
}

export const healthAPI = {
  checkHealth: async (): Promise<HealthResponse> => {
    const response = await apiClient.get<HealthResponse>('/health');
    return response as any;
  },
};
