import type { RecentAlert } from "@/hooks/dashboard/useRecentAlerts";
import { Ghost, ShieldAlert } from "lucide-react";

interface RecentAlertsListProps {
  data: RecentAlert[] | null;
  isLoading: boolean;
}

export default function RecentAlertsList({ data, isLoading }: RecentAlertsListProps) {
  return (
    <div className="col-span-3 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-gray-200/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[300px] group">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[15px] font-extrabold text-[#090D18]">Recent Alerts</h3>
        <a href="#" className="text-[#E50914] text-[11px] font-bold hover:underline">View All</a>
      </div>
      
      <div className="flex-1 flex flex-col justify-start overflow-hidden">
        {isLoading || !data ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-3/4 bg-gray-100 rounded"></div>
                  <div className="h-2 w-1/2 bg-gray-100 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
            <Ghost className="w-10 h-10 mb-2 opacity-50" />
            <p className="text-[12px] font-bold">No recent alerts</p>
            <p className="text-[10px] font-medium mt-1">Everything looks quiet.</p>
          </div>
        ) : (
          <div className="flex flex-col justify-between h-full gap-1">
            {data.map((alert, idx) => (
              <div key={idx} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0 relative group cursor-pointer hover:bg-gray-50/50 transition-colors rounded-lg -mx-2 px-2">
                <div className="w-8 h-8 rounded-lg bg-[#FEF2F2] border border-[#FEE2E2] flex items-center justify-center text-[#E50914] shrink-0 mt-0.5">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0 pr-12 pb-1">
                  <h4 className="text-[11px] font-extrabold text-[#090D18] leading-snug">{alert.title}</h4>
                  <p className="text-[10px] text-gray-500 font-semibold mt-0.5">{alert.subtitle}</p>
                </div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-gray-400">{alert.time}</span>
                  <div className={`w-1.5 h-1.5 rounded-full ${alert.color === 'red' ? 'bg-[#E50914]' : 'bg-orange-500'}`}></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
