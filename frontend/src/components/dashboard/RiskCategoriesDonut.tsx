import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Sector } from "recharts";
import type { RiskCategory } from "@/hooks/dashboard/useRiskCategories";

interface RiskCategoriesDonutProps {
  data: RiskCategory[] | null;
  isLoading: boolean;
}

// Custom active shape for the hover effect
const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, cornerRadius, paddingAngle } = props;
  
  const RADIAN = Math.PI / 180;
  const midAngle = (startAngle + endAngle) / 2;
  // Translate radially outward by 7px
  const dx = Math.cos(-midAngle * RADIAN) * 7;
  const dy = Math.sin(-midAngle * RADIAN) * 7;

  return (
    <g transform={`translate(${dx}, ${dy})`}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        cornerRadius={cornerRadius}
        paddingAngle={paddingAngle}
        stroke="none"
      />
    </g>
  );
};

const getGradientId = (name: string) => {
  switch (name) {
    case "Critical Risk":
      return "grad-critical-risk";
    case "High Risk":
      return "grad-high-risk";
    case "Medium Risk":
      return "grad-medium-risk";
    case "Low Risk":
      return "grad-low-risk";
    default:
      return "grad-default";
  }
};

const getLegendColor = (name: string) => {
  switch (name) {
    case "Critical Risk":
      return "linear-gradient(to bottom, #EF4444, #991B1B)";
    case "High Risk":
      return "linear-gradient(to bottom, #F97316, #C2410C)";
    case "Medium Risk":
      return "linear-gradient(to bottom, #F59E0B, #B45309)";
    case "Low Risk":
      return "linear-gradient(to bottom, #10B981, #047857)";
    default:
      return "#cbd5e1";
  }
};

export default function RiskCategoriesDonut({ data, isLoading }: RiskCategoriesDonutProps) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
  const PieWithActive = Pie as any;

  return (
    <div className="col-span-4 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-gray-200/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col min-h-[300px] group">
      <h3 className="text-[15px] font-heading font-extrabold text-[#090D18] mb-4">Top Risk Categories</h3>
      
      {isLoading || !data ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-[150px] h-[150px] rounded-full border-[20px] border-gray-100 animate-pulse"></div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-between w-full gap-4">
          {/* Donut Chart */}
          <div className="h-[180px] w-[180px] relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart style={{ filter: 'drop-shadow(0px 10px 25px rgba(9,13,24,0.08))' }}>
                <defs>
                  <linearGradient id="grad-critical-risk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#991B1B" />
                  </linearGradient>
                  <linearGradient id="grad-high-risk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F97316" />
                    <stop offset="100%" stopColor="#C2410C" />
                  </linearGradient>
                  <linearGradient id="grad-medium-risk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#B45309" />
                  </linearGradient>
                  <linearGradient id="grad-low-risk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>
                  <linearGradient id="grad-default" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#94a3b8" />
                  </linearGradient>
                </defs>
                <PieWithActive
                  activeIndex={activeIndex === undefined ? -1 : activeIndex}
                  activeShape={(props: any) => {
                    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, cornerRadius, paddingAngle } = props;
                    const RADIAN = Math.PI / 180;
                    const midAngle = (startAngle + endAngle) / 2;
                    const dx = Math.cos(-midAngle * RADIAN) * 7;
                    const dy = Math.sin(-midAngle * RADIAN) * 7;
                    return (
                      <g transform={`translate(${dx}, ${dy})`}>
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius}
                          outerRadius={outerRadius}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                          cornerRadius={cornerRadius}
                          paddingAngle={paddingAngle}
                          stroke="none"
                        />
                      </g>
                    );
                  }}
                  data={data}
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  cornerRadius={9}
                  dataKey="value"
                  stroke="none"
                  label={false}
                  labelLine={false}
                  onMouseEnter={(_: any, index: number) => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                  isAnimationActive={false}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={`url(#${getGradientId(entry.name)})`} 
                      className="transition-opacity duration-75" 
                      opacity={activeIndex !== undefined && activeIndex !== index ? 0.3 : 1} 
                    />
                  ))}
                </PieWithActive>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Vertical Custom Legend */}
          <div className="flex-1 flex flex-col justify-center gap-1.5 min-w-0 pr-1">
            {data.map((entry, index) => {
              const total = data.reduce((sum, item) => sum + item.value, 0);
              const percentage = total > 0 ? Math.round((entry.value / total) * 100) : 0;
              return (
                <div 
                  key={index} 
                  className={`flex items-center justify-between p-2 rounded-xl transition-all duration-150 border border-transparent ${
                    activeIndex === index ? 'bg-gray-50 border-gray-100 shadow-sm' : 'bg-transparent'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseLeave={() => setActiveIndex(undefined)}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ 
                        background: getLegendColor(entry.name)
                      }} 
                    />
                    <span className="text-[11px] font-extrabold text-gray-600 truncate">{entry.name}</span>
                  </div>
                  <span className="text-[11px] font-black text-[#090D18] ml-2 shrink-0">
                    {entry.value} ({percentage}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
