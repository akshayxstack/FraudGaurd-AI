import { apiClient } from './client';
import type { CaseType } from '../hooks/dashboard/useCases';

export const casesAPI = {
  getCases: async (params?: { page?: number; limit?: number; status?: string; riskLevel?: string; search?: string; assignedTo?: string; dateRange?: string }): Promise<any> => {
    const rawData = await apiClient.get<any>('/cases', { params });
    const mappedCases = (rawData.cases || []).map((c: any) => ({
      id: c._id,
      caseId: c.caseId || c._id,
      type: "Fraud", // The backend doesn't have a distinct "type" field currently, defaulting to Fraud
      customerName: c.title || "Unknown Case",
      customerTitle: "Case Investigation",
      riskScore: c.riskScore || 0,
      riskSeverity: c.riskLevel || 'Low',
      status: c.status || 'Open',
      assigneeName: c.uploadedBy?.fullName || "System Analyst",
      assigneeRole: c.uploadedBy?.role || "Investigator",
      createdOnDate: new Date(c.createdAt).toLocaleDateString(),
      createdOnTime: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: c.amountAtRisk || 0,
    }));
    
    return {
      cases: mappedCases,
      total: rawData.total || 0,
      page: rawData.page || 1,
      limit: rawData.limit || 50,
      totalPages: rawData.totalPages || 1
    };
  },
  
  getCaseById: async (id: string): Promise<any> => {
    // Return raw for the detail page as it has more complex data needs
    return await apiClient.get<any>(`/cases/${id}`);
  },

  updateCaseStatus: async (id: string, status: string): Promise<any> => {
    return await apiClient.patch<any>(`/cases/${id}/status`, { status });
  },

  deleteCase: async (id: string): Promise<any> => {
    return await apiClient.delete<any>(`/cases/${id}`);
  }
};
