import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Folder, CheckCircle2, Clock, Shield, IndianRupee,
  Calendar, ChevronDown, RefreshCw, Download, Briefcase
} from "lucide-react";
import { 
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, LabelList, Sector
} from "recharts";
import { 
  useAnalyticsSummary, useCasesOverTime, useCasesByStatus, 
  useCasesByRiskLevel, useCasesByType, useTopInvestigators, 
  useAmountAtRiskOverTime 
} from "@/hooks/dashboard/useAnalyticsHooks";

// --- Sub-components for custom charts ---

const CustomTooltip = ({ active, payload, label, formatter }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#090D18] text-white text-[12px] font-medium px-3 py-1.5 rounded-lg shadow-xl border border-gray-700">
        <div className="opacity-80 mb-0.5">{label}</div>
        <div className="font-bold text-[14px]">
          {formatter ? formatter(payload[0].value) : payload[0].value} {formatter ? '' : 'Cases'}
        </div>
      </div>
    );
  }
  return null;
};

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  
  // Radial extension points
  const sx = cx + (outerRadius + 4) * cos;
  const sy = cy + (outerRadius + 4) * sin;
  const mx = cx + (outerRadius + 14) * cos;
  const my = cy + (outerRadius + 14) * sin;
  
  // Horizontal extension
  const isRight = cos >= 0;
  const ex = mx + (isRight ? 1 : -1) * 12;
  const ey = my;
  const textAnchor = isRight ? 'start' : 'end';

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 5}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" strokeWidth={2} />
      <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
      <text 
        x={ex + (isRight ? 1 : -1) * 8} 
        y={ey} 
        dy={1} // Slight vertical nudge to perfectly align font baseline with the line
        textAnchor={textAnchor} 
        fill="#090D18" 
        className="text-[13px] font-extrabold" 
        dominantBaseline="central"
      >
        {value}
      </text>
    </g>
  );
};

// --- Main Page Component ---

export default function Analytics() {
  const { data: summaryData, isLoading: isSummaryLoading } = useAnalyticsSummary();
  const { data: casesOverTime, isLoading: isCasesTimeLoading } = useCasesOverTime();
  const { data: casesByStatus, isLoading: isCasesStatusLoading } = useCasesByStatus();
  const { data: casesByRisk, isLoading: isCasesRiskLoading } = useCasesByRiskLevel();
  const { data: casesByType, isLoading: isCasesTypeLoading } = useCasesByType();
  const { data: topInvestigators, isLoading: isInvestigatorsLoading } = useTopInvestigators();
  const { data: amountOverTime, isLoading: isAmountTimeLoading } = useAmountAtRiskOverTime();

  const [activeIndexStatus, setActiveIndexStatus] = useState<number | undefined>();
  const [activeIndexRisk, setActiveIndexRisk] = useState<number | undefined>();

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `₹${(val / 1000000).toFixed(2)}M`;
    return `₹${val.toLocaleString('en-US')}`;
  };

  const casesOverTimeData = Array.isArray(casesOverTime) ? casesOverTime : [];
  const casesByStatusData = Array.isArray(casesByStatus) ? casesByStatus : [];
  const casesByRiskData = Array.isArray(casesByRisk) ? casesByRisk : [];
  const casesByTypeData = Array.isArray(casesByType) ? casesByType : [];
  const topInvestigatorsData = Array.isArray(topInvestigators) ? topInvestigators : [];
  const amountOverTimeData = Array.isArray(amountOverTime) ? amountOverTime : [];
  const hasValues = (items: any[], key: string) => items.some((item) => Number(item[key] || 0) > 0);
  const totalCases = casesByStatusData.reduce((sum: number, item: any) => sum + Number(item.value || 0), 0);
  const closedCases = casesByStatusData.find((item: any) => item.name === "Closed")?.value || 0;
  const highRiskCases = casesByRiskData
    .filter((item: any) => item.name === "High" || item.name === "Critical")
    .reduce((sum: number, item: any) => sum + Number(item.value || 0), 0);
  const totalAmountAtRisk = amountOverTimeData.reduce((sum: number, item: any) => sum + Number(item.amount || 0), 0);
  const closureRate = totalCases > 0 ? ((closedCases / totalCases) * 100).toFixed(1) : "0.0";

  return (
    <AppLayout 
      title="Analytics" 
      subtitle="Insights and trends to help you stay ahead of fraud."
      searchPlaceholder="Search by Case ID, Customer, Status..."
    >
      
      {/* SECTION 1 - Filter Bar */}
      <div className="flex items-center gap-4 mb-8">
        <button className="flex items-center gap-1.5 h-10 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50 transition-colors">
          <Calendar className="w-4 h-4 text-gray-500" /> Last 30 Days <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <button className="flex items-center gap-1.5 h-10 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50 transition-colors">
          Case Type <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <button className="flex items-center gap-1.5 h-10 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50 transition-colors">
          Risk Level <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <button className="flex items-center gap-1.5 h-10 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50 transition-colors">
          Assigned To <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <div className="flex-1"></div>
        <button className="flex items-center gap-1.5 h-10 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50 transition-colors">
          <RefreshCw className="w-4 h-4 text-gray-500" /> Refresh
        </button>
        <button className="flex items-center gap-1.5 h-10 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4 text-gray-500" /> Export
        </button>
      </div>

      {/* SECTION 2 - Summary Cards */}
      <div className="grid grid-cols-5 gap-6 mb-8">
        {isSummaryLoading || !summaryData ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 h-28 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gray-100"></div>
                <div className="h-4 bg-gray-100 rounded w-20"></div>
              </div>
              <div className="h-6 bg-gray-100 rounded w-16 mb-2"></div>
            </div>
          ))
        ) : summaryData.length === 0 ? (
          <div className="col-span-5 bg-white rounded-2xl p-8 text-center text-[13px] font-semibold text-gray-500 border border-gray-100">
            No analytics summary is available yet.
          </div>
        ) : (
          summaryData.map((card: any, idx: number) => {
            const icons = [Folder, CheckCircle2, Clock, Shield, IndianRupee];
            const colors = ['text-blue-600 bg-blue-50', 'text-emerald-600 bg-emerald-50', 'text-orange-500 bg-orange-50', 'text-[#DC2626] bg-red-50', 'text-purple-600 bg-purple-50'];
            const sparklineColors = ['#2563EB', '#10B981', '#F97316', '#DC2626', '#9333EA'];
            const Icon = icons[idx];
            
            const chartData = card.trendData.map((val: number, i: number) => ({ i, val }));

            return (
              <div key={idx} className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:border-gray-200/60 transition-colors relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors[idx]}`}>
                      <Icon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
                
                <h4 className="text-[12px] font-semibold text-gray-500 absolute top-5 left-[68px]">{card.title}</h4>
                <div className="text-[24px] font-heading font-extrabold text-[#090D18] leading-none mt-2 mb-1.5">{card.value}</div>
                
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-bold text-emerald-600">{card.change}</div>
                  <div className="w-16 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <Line type="monotone" dataKey="val" stroke={sparklineColors[idx]} strokeWidth={2} dot={false} isAnimationActive={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* SECTION 3 - Cases Over Time & Donuts */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        
        {/* Cases Over Time */}
        <div className="col-span-5 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-extrabold text-[16px] text-[#090D18]">Cases Over Time</h3>
            <button className="flex items-center gap-1.5 h-8 px-3 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-semibold text-[#090D18]">
              Daily <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 min-h-[220px]">
            {isCasesTimeLoading ? (
               <div className="w-full h-full bg-gray-50 rounded-xl animate-pulse"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {!hasValues(casesOverTimeData, "cases") ? (
                  <div className="h-full flex items-center justify-center text-[12px] font-semibold text-gray-400">No case trend data yet.</div>
                ) : (
                <AreaChart data={casesOverTimeData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 11, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 11, fontWeight: 600}} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#DC2626', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="cases" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#colorCases)" 
                    activeDot={{ r: 6, fill: '#DC2626', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Cases by Status Donut */}
        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <h3 className="font-heading font-extrabold text-[16px] text-[#090D18] mb-4">Cases by Status</h3>
          <div className="flex-1 flex items-center justify-between">
            {isCasesStatusLoading ? (
               <div className="w-40 h-40 rounded-full border-[20px] border-gray-100 animate-pulse mx-auto"></div>
            ) : (
              <>
                <div className="w-full h-[200px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    {!hasValues(casesByStatusData, "value") ? (
                      <div className="h-full flex items-center justify-center text-[12px] font-semibold text-gray-400">No status data yet.</div>
                    ) : (
                    <PieChart>
                      <Pie
                        data={casesByStatusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={55}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                        activeIndex={activeIndexStatus}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndexStatus(index)}
                        onMouseLeave={() => setActiveIndexStatus(undefined)}
                      >
                        {casesByStatusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                    )}
                  </ResponsiveContainer>
                  {/* Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="font-heading font-extrabold text-[24px] text-[#090D18] leading-none">
                      {totalCases}
                    </span>
                    <span className="text-[12px] font-semibold text-gray-500 mt-1">Total</span>
                  </div>
                </div>
                
                {/* Custom Legend */}
                <div className="flex flex-col gap-3">
                  {casesByStatusData.map((item: any, i: number) => {
                    const percentage = totalCases > 0 ? ((item.value / totalCases) * 100).toFixed(1) : "0.0";
                    return (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></div>
                        <span className="text-[12px] font-semibold text-gray-700 w-[70px]">{item.name}</span>
                        <div className="text-[12px] text-gray-500 font-medium">
                          <span className="text-[#090D18] font-bold mr-1">{item.value}</span>
                          ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cases by Risk Level Donut */}
        <div className="col-span-3 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <h3 className="font-heading font-extrabold text-[16px] text-[#090D18] mb-4">Cases by Risk Level</h3>
          <div className="flex-1 flex flex-col items-center justify-center gap-6">
            {isCasesRiskLoading ? (
               <div className="w-32 h-32 rounded-full border-[16px] border-gray-100 animate-pulse mx-auto"></div>
            ) : (
              <>
                <div className="w-full h-[180px] -mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    {!hasValues(casesByRiskData, "value") ? (
                      <div className="h-full flex items-center justify-center text-[12px] font-semibold text-gray-400">No risk data yet.</div>
                    ) : (
                    <PieChart>
                      <Pie
                        data={casesByRiskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={35}
                        outerRadius={50}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                        activeIndex={activeIndexRisk}
                        activeShape={renderActiveShape}
                        onMouseEnter={(_, index) => setActiveIndexRisk(index)}
                        onMouseLeave={() => setActiveIndexRisk(undefined)}
                      >
                        {casesByRiskData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                    )}
                  </ResponsiveContainer>
                </div>
                
                {/* Custom Legend */}
                <div className="w-full flex flex-col gap-2.5">
                  {casesByRiskData.map((item: any, i: number) => {
                    const total = casesByRiskData.reduce((sum: number, x: any) => sum + x.value, 0);
                    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";
                    return (
                      <div key={i} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }}></div>
                          <span className="text-[12px] font-semibold text-gray-700">{item.name}</span>
                        </div>
                        <div className="text-[12px] text-gray-500 font-medium">
                          <span className="text-[#090D18] font-bold mr-1">{item.value}</span>
                          ({percentage}%)
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 4 - Bar Chart, Investigators, Amount LineChart */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        
        {/* Cases by Type BarChart */}
        <div className="col-span-5 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-extrabold text-[16px] text-[#090D18]">Cases by Category</h3>
            <button className="flex items-center gap-1.5 h-8 px-3 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-semibold text-[#090D18]">
              Total Cases <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 min-h-[220px]">
            {isCasesTypeLoading ? (
               <div className="w-full h-full flex flex-col gap-4 animate-pulse">
                 {Array.from({length: 6}).map((_, i) => (
                   <div key={i} className="h-4 bg-gray-100 rounded-full w-full"></div>
                 ))}
               </div>
            ) : (
              !hasValues(casesByTypeData, "value") ? (
                <div className="h-full flex items-center justify-center text-[12px] font-semibold text-gray-400">No category data yet.</div>
              ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={casesByTypeData} layout="vertical" margin={{ top: 0, right: 30, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4B5563', fontSize: 11, fontWeight: 600}} width={120} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#F3F4F6'}} />
                  <Bar dataKey="value" fill="#DC2626" radius={[0, 4, 4, 0]} barSize={8}>
                    <LabelList dataKey="value" position="right" fill="#DC2626" fontSize={11} fontWeight="bold" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              )
            )}
          </div>
        </div>

        {/* Top Investigators List */}
        <div className="col-span-3 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-extrabold text-[16px] text-[#090D18]">Top Investigators</h3>
            <button className="flex items-center gap-1.5 h-8 px-3 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-semibold text-[#090D18]">
              By Closed Cases <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 flex flex-col gap-5 justify-center">
            {isInvestigatorsLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-gray-100"></div>
                  <div className="flex-1 h-4 bg-gray-100 rounded"></div>
                </div>
              ))
            ) : (
              topInvestigatorsData.length === 0 ? (
                <div className="text-[12px] font-semibold text-gray-400 text-center">No investigator activity yet.</div>
              ) : topInvestigatorsData.map((inv: any, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-[#DC2626] text-[12px] font-bold shrink-0">{inv.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-[#090D18] truncate">{inv.name}</div>
                    <div className="text-[11px] text-gray-500">{inv.casesHandled} cases</div>
                  </div>
                  <div className="text-[12px] font-bold text-emerald-600">{inv.closedRate}%</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Amount at Risk LineChart */}
        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-extrabold text-[16px] text-[#090D18]">Amount at Risk Over Time</h3>
            <button className="flex items-center gap-1.5 h-8 px-3 bg-gray-50 border border-gray-200 rounded-md text-[12px] font-semibold text-[#090D18]">
              Daily <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>
          <div className="flex-1 min-h-[220px]">
            {isAmountTimeLoading ? (
               <div className="w-full h-full bg-gray-50 rounded-xl animate-pulse"></div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                {!hasValues(amountOverTimeData, "amount") ? (
                  <div className="h-full flex items-center justify-center text-[12px] font-semibold text-gray-400">No amount-at-risk trend yet.</div>
                ) : (
                <AreaChart data={amountOverTimeData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#DC2626" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 11, fontWeight: 600}} dy={10} />
                  <YAxis tickFormatter={formatCurrency} axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 11, fontWeight: 600}} />
                  <Tooltip content={<CustomTooltip formatter={formatCurrency} />} cursor={{ stroke: '#DC2626', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="amount" stroke="#DC2626" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" 
                    activeDot={{ r: 6, fill: '#DC2626', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
                )}
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* SECTION 5 - Key Insights */}
      <div className="mb-4">
        <h3 className="font-heading font-extrabold text-[16px] text-[#090D18] mb-4">Key Insights</h3>
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-50 text-[#DC2626] shrink-0 border border-red-100">
              <Briefcase className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <p className="text-[13px] text-[#090D18] font-semibold leading-snug mt-1">
              <span className="font-bold">{totalCases}</span> cases are currently represented in MongoDB analytics.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-orange-50 text-orange-500 shrink-0 border border-orange-100">
              <Clock className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <p className="text-[13px] text-[#090D18] font-semibold leading-snug mt-1">
              <span className="font-bold">{closureRate}%</span> of tracked cases are closed.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600 shrink-0 border border-emerald-100">
              <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <p className="text-[13px] text-[#090D18] font-semibold leading-snug mt-1">
              <span className="font-bold">{highRiskCases}</span> high or critical risk cases require focused review.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600 shrink-0 border border-blue-100">
              <IndianRupee className="w-5 h-5" strokeWidth={2.5} />
            </div>
            <p className="text-[13px] text-[#090D18] font-semibold leading-snug mt-1">
              <span className="font-bold">{formatCurrency(totalAmountAtRisk)}</span> in detected exposure is represented in case records.
            </p>
          </div>
        </div>
      </div>
      
    </AppLayout>
  );
}
