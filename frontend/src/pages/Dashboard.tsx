import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  ShieldCheck, Briefcase, Bell, IndianRupee 
} from "lucide-react";

// Hooks
import { useDashboardMetrics } from "@/hooks/dashboard/useDashboardMetrics";
import { useRiskTrend } from "@/hooks/dashboard/useRiskTrend";
import { useRiskCategories } from "@/hooks/dashboard/useRiskCategories";
import { useRecentCases } from "@/hooks/dashboard/useRecentCases";
import { useRecentAlerts } from "@/hooks/dashboard/useRecentAlerts";

// Components
import MetricCard from "@/components/dashboard/MetricCard";
import RiskTrendChart from "@/components/dashboard/RiskTrendChart";
import RiskCategoriesDonut from "@/components/dashboard/RiskCategoriesDonut";
import RecentAlertsList from "@/components/dashboard/RecentAlertsList";
import RecentCasesTable from "@/components/dashboard/RecentCasesTable";
import AIAssistantWidget from "@/components/dashboard/AIAssistantWidget";
import { useAuth } from "@/context/AuthContext";

export default function Dashboard() {
  const [timeRange, setTimeRange] = useState("Last 7 Days");
  const { user } = useAuth();

  // Fetch all data domains with hooks, polling every 15 seconds to simulate real-time updates
  const POLLING_INTERVAL = 15000;
  
  const { data: metricsData, isLoading: metricsLoading } = useDashboardMetrics(POLLING_INTERVAL);
  const { data: riskTrendData, isLoading: riskTrendLoading } = useRiskTrend(timeRange, POLLING_INTERVAL);
  const { data: categoriesData, isLoading: categoriesLoading } = useRiskCategories(POLLING_INTERVAL);
  const { data: casesData, isLoading: casesLoading } = useRecentCases(POLLING_INTERVAL);
  const { data: alertsData, isLoading: alertsLoading } = useRecentAlerts(POLLING_INTERVAL);

  return (
    <AppLayout title="Dashboard" subtitle={`Welcome back, ${user?.fullName || "Investigator"}`}>
      
      {/* Row 1 - 4 Metric Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <MetricCard 
          title="Overall Risk Score"
          value={metricsData ? `${metricsData.overallRiskScore}%` : ""}
          subtitle="High Risk"
          subtitleColor="text-[#E50914]"
          icon={<ShieldCheck className="w-3.5 h-3.5" />}
          isProgress={true}
          progressValue={metricsData?.overallRiskScore}
          isLoading={metricsLoading}
        />
        <MetricCard 
          title="Active Cases"
          value={metricsData?.activeCases.value || ""}
          subtitle={metricsData?.activeCases.changeText || ""}
          subtitleColor="text-green-600"
          icon={<Briefcase className="w-3.5 h-3.5" />}
          sparklineData={metricsData?.activeCases.sparklineData}
          sparklineColor="#16a34a"
          isLoading={metricsLoading}
        />
        <MetricCard 
          title="Alerts"
          value={metricsData?.alerts.value || ""}
          subtitle={metricsData?.alerts.status || ""}
          subtitleColor="text-[#E50914]"
          icon={<Bell className="w-3.5 h-3.5" />}
          sparklineData={metricsData?.alerts.sparklineData}
          sparklineColor="#E50914"
          isLoading={metricsLoading}
        />
        <MetricCard 
          title="Amount at Risk"
          value={metricsData?.amountAtRisk.value || ""}
          subtitle={metricsData?.amountAtRisk.changeText || ""}
          subtitleColor="text-green-600"
          icon={<IndianRupee className="w-3.5 h-3.5" />}
          sparklineData={metricsData?.amountAtRisk.sparklineData}
          sparklineColor="#16a34a"
          isLoading={metricsLoading}
        />
      </div>

      {/* Row 2 - 3 Columns */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <RiskTrendChart 
          data={riskTrendData} 
          isLoading={riskTrendLoading} 
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
        />
        <RiskCategoriesDonut 
          data={categoriesData} 
          isLoading={categoriesLoading} 
        />
        <RecentAlertsList 
          data={alertsData} 
          isLoading={alertsLoading} 
        />
      </div>

      {/* Row 3 - 2 Columns */}
      <div className="grid grid-cols-12 gap-6 pb-6">
        <RecentCasesTable 
          data={casesData} 
          isLoading={casesLoading} 
        />

        <AIAssistantWidget />

      </div>

    </AppLayout>
  );
}
