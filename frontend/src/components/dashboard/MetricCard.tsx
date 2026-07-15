import type { ReactNode } from "react";
import { Info } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  subtitleColor: string;
  icon: ReactNode;
  isProgress?: boolean;
  progressValue?: number;
  sparklineData?: { value: number }[];
  sparklineColor?: string;
  isLoading?: boolean;
}

function CircularProgress({ value }: { value: number }) {
  return (
    <div className="relative w-[54px] h-[54px]">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-100" strokeWidth="3" />
        <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#E50914]" strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - value} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[11px] font-heading font-bold text-gray-700">{value}%</div>
    </div>
  );
}

export default function MetricCard({
  title,
  value,
  subtitle,
  subtitleColor,
  icon,
  isProgress,
  progressValue,
  sparklineData,
  sparklineColor = "#16a34a",
  isLoading
}: MetricCardProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-between h-[126px]">
        <div className="animate-pulse flex-1 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3">
            <div className="h-6 w-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-gray-200/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex justify-between items-center relative overflow-hidden h-[126px] group">
      <div className="flex-1 h-full flex flex-col justify-between">
        <div className="flex items-center gap-1.5 mb-3 text-gray-500">
          <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-[#E50914] shrink-0 border border-red-100 group-hover:scale-105 transition-transform duration-300">
            {icon}
          </div>
          <span className="text-[12px] font-heading font-bold text-[#090D18]">{title}</span>
          <Info className="w-3 h-3 text-gray-400" />
        </div>
        <div className="text-[34px] font-heading font-extrabold text-[#090D18] leading-none mb-2 tracking-tight">{value}</div>
        <div className="flex justify-between items-end">
          <div className={`text-[11px] font-bold ${subtitleColor}`}>{subtitle}</div>
          {sparklineData && !isProgress && (
            <div className="w-16 h-5">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <YAxis domain={['dataMin', 'dataMax']} hide />
                  <Line type="monotone" dataKey="value" stroke={sparklineColor} strokeWidth={2} dot={false} isAnimationActive={true} animationDuration={600} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
      {isProgress && progressValue !== undefined && (
        <div className="ml-4 self-center">
          <CircularProgress value={progressValue} />
        </div>
      )}
    </div>
  );
}
