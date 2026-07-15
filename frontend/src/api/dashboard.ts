import { apiClient } from './client';
import type { DashboardMetrics } from '../hooks/dashboard/useDashboardMetrics';
import type { RecentCase } from '../hooks/dashboard/useRecentCases';
import type { RecentAlert } from '../hooks/dashboard/useRecentAlerts';
import type { RiskCategory } from '../hooks/dashboard/useRiskCategories';
import type { RiskTrendDataPoint } from '../hooks/dashboard/useRiskTrend';

let dashboardCache: { data: any; expiresAt: number } | null = null;
let dashboardRequest: Promise<any> | null = null;

const getDashboardRaw = async () => {
  const now = Date.now();
  if (dashboardCache && dashboardCache.expiresAt > now) {
    return dashboardCache.data;
  }

  if (!dashboardRequest) {
    dashboardRequest = apiClient.get<any>('/dashboard').then((data) => {
      dashboardCache = { data, expiresAt: Date.now() + 1000 };
      return data;
    }).finally(() => {
      dashboardRequest = null;
    });
  }

  return dashboardRequest;
};

export const dashboardAPI = {
  getMetrics: async (): Promise<DashboardMetrics> => {
    const rawData = await getDashboardRaw();
    const amountAtRisk = rawData.amountAtRisk || 0;
    const highRiskCases = (rawData.highRiskCases || 0) + (rawData.criticalCases || 0);
    return {
      totalCases: rawData.totalCases || 0,
      highRiskCases,
      amountAtRiskRaw: amountAtRisk,
      overallRiskScore: rawData.averageRiskScore || 0,
      activeCases: { 
        value: rawData.activeCases || 0, 
        changeText: "Active", 
        sparklineData: Array(7).fill(0).map(() => ({ value: rawData.activeCases })) 
      },
      alerts: { 
        value: rawData.fraudulentTransactions || 0, 
        status: "Action Required", 
        sparklineData: Array(7).fill(0).map(() => ({ value: rawData.fraudulentTransactions })) 
      },
      amountAtRisk: { 
        value: `₹${amountAtRisk.toLocaleString('en-US')}`, 
        changeText: "Total At Risk", 
        sparklineData: Array(7).fill(0).map(() => ({ value: amountAtRisk })) 
      }
    };
  },
  
  getRecentCases: async (): Promise<RecentCase[]> => {
    const rawData = await getDashboardRaw();
    return (rawData.recentCases || []).map((c: any) => ({
      id: c.caseId,
      customer: c.title || "Unknown Case",
      date: new Date(c.createdAt).toLocaleDateString(),
      score: c.riskScore || 0,
      status: c.riskLevel || 'Low',
      amount: `₹${(c.amountAtRisk || 0).toLocaleString('en-US')}`,
      assignedTo: c.uploadedBy?.fullName || "System Analyst"
    }));
  },
  
  getRecentAlerts: async (): Promise<RecentAlert[]> => {
    const rawData = await getDashboardRaw();
    return (rawData.recentAlerts || []).map((a: any) => ({
      title: `${a.riskLevel || 'High'} risk transaction`,
      subtitle: `${a.merchant || "Unknown Merchant"} · ₹${(a.amount || 0).toLocaleString('en-US')}`,
      time: new Date(a.date || a.createdAt).toLocaleDateString(),
      color: a.riskLevel === 'Critical' || a.isFraud ? 'red' : 'orange'
    }));
  },
  
  getRiskCategories: async (): Promise<RiskCategory[]> => {
    const rawData = await apiClient.get<any>('/dashboard/risk-distribution');
    return [
      { name: "Low Risk", value: rawData.Low || 0, color: "#22c55e" },
      { name: "Medium Risk", value: rawData.Medium || 0, color: "#f59e0b" },
      { name: "High Risk", value: rawData.High || 0, color: "#f97316" },
      { name: "Critical Risk", value: rawData.Critical || 0, color: "#ef4444" },
    ];
  },
  
  getRiskTrend: async (timeRange: string): Promise<RiskTrendDataPoint[]> => {
    const interval = timeRange.includes("Days") ? "daily" : "monthly";
    const rawData = await apiClient.get<any>(`/dashboard/trends?interval=${interval}`);
    return rawData.map((d: any) => ({
      name: d._id,
      value: d.amountAtRisk || d.cases || 0
    }));
  },
  
  getUploads: async (params?: { page?: number; limit?: number; search?: string; status?: string; fileType?: string }): Promise<any> => {
    return await apiClient.get<any>('/upload', { params });
  }
};
