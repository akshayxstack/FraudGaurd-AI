import { apiClient } from './client';

export const analyticsAPI = {
  getSummary: async (params?: any) => {
    const response = await apiClient.get('/analytics/summary', { params });
    return response;
  },
  
  getCasesOverTime: async (params?: any) => {
    const response = await apiClient.get('/analytics/cases-over-time', { params });
    return response;
  },
  
  getCasesByStatus: async (params?: any) => {
    const response = await apiClient.get('/analytics/cases-by-status', { params });
    return response;
  },
  
  getCasesByRiskLevel: async (params?: any) => {
    const response = await apiClient.get('/analytics/cases-by-risk', { params });
    return response;
  },
  
  getCasesByType: async (params?: any) => {
    const response = await apiClient.get('/analytics/cases-by-type', { params });
    return response;
  },
  
  getTopInvestigators: async (params?: any) => {
    const response = await apiClient.get('/analytics/top-investigators', { params });
    return response;
  },
  
  getAmountAtRiskOverTime: async (params?: any) => {
    const response = await apiClient.get('/analytics/amount-at-risk', { params });
    return response;
  }
};
