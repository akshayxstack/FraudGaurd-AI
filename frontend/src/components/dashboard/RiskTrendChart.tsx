import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { RiskTrendDataPoint } from "@/hooks/dashboard/useRiskTrend";

interface RiskTrendChartProps {
  data: RiskTrendDataPoint[] | null;
  isLoading: boolean;
  timeRange: string;
  onTimeRangeChange: (range: string) => void;
}

export default function RiskTrendChart({ data, isLoading, timeRange, onTimeRangeChange }: RiskTrendChartProps) {
  return (
    <div className="col-span-5 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-gray-200/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full min-h-[300px] group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-extrabold text-[#090D18]">Risk Trend</h3>
        <div className="relative">
          <select 
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value)}
            className="appearance-none text-[12px] font-bold text-gray-700 bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-1.5 outline-none hover:bg-gray-50 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full mt-2 relative">
        {isLoading || !data ? (
          <div className="absolute inset-0 animate-pulse bg-gray-100 rounded-lg"></div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E50914" stopOpacity={0.15}/>
                  <stop offset="100%" stopColor="#E50914" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }} tickFormatter={(val) => `${val}%`} />
              
              <Tooltip 
                cursor={{ stroke: '#E50914', strokeWidth: 1, strokeDasharray: '4 4' }}
                contentStyle={{ borderRadius: '12px', border: '1px solid #F3F4F6', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', padding: '8px 12px', backgroundColor: '#fff' }}
                itemStyle={{ color: '#090D18', fontWeight: '900', fontSize: '15px' }}
                labelStyle={{ color: '#6B7280', fontSize: '11px', marginBottom: '2px', fontWeight: 600 }}
                formatter={(value) => [`${value}%`]}
                labelFormatter={(label) => `${label}`}
              />
              
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#E50914" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#colorRisk)" 
                isAnimationActive={true}
                animationDuration={800}
                activeDot={{ r: 6, fill: '#E50914', stroke: '#fff', strokeWidth: 2 }}
                dot={(props) => {
                  const { cx, cy, index } = props;
                  // Render a pulsing dot for the last data point
                  if (index === data.length - 1) {
                    return (
                      <g key={`last-dot-${index}`}>
                        <circle cx={cx} cy={cy} r={8} fill="#E50914" opacity={0.3} className="animate-ping" style={{ transformOrigin: 'center' }} />
                        <circle cx={cx} cy={cy} r={4} fill="#E50914" stroke="#fff" strokeWidth={2} filter="url(#glow)" />
                      </g>
                    );
                  }
                  return <circle key={`dot-${index}`} cx={cx} cy={cy} r={0} />;
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
