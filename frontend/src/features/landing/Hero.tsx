import { Calendar, Shield, ShieldCheck, LayoutDashboard, FolderOpen, Upload, BarChart3, Bot, LogOut, Bell, Search, Sparkles, ArrowRight, Lock, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { LogoIcon } from "@/components/ui/LogoIcon";

export default function Hero() {
  return (
    <section className="relative isolate flex flex-col items-center overflow-hidden bg-white pb-5 pt-12 lg:pb-6 lg:pt-[50px]">
      
      {/* Decorative Background Concentric Circles */}
      <div className="pointer-events-none absolute right-[-260px] top-[42px] z-0 hidden h-[680px] w-[920px] rounded-full border border-[#F05454]/30 lg:block" />
      <div className="pointer-events-none absolute right-[-120px] top-[72px] z-0 hidden h-[600px] w-[800px] rounded-full border border-[#F05454]/20 lg:block" />
      <div className="pointer-events-none absolute right-[20px] top-[112px] z-0 hidden h-[500px] w-[640px] rounded-full border border-[#F05454]/15 lg:block" />

      <div className="pointer-events-none absolute left-[35%] top-[46px] z-0 hidden lg:block">
        <svg className="h-[540px] w-[950px]" viewBox="0 0 950 540" fill="none">
          <path d="M6 268C95 44 319-26 517 59C738 154 882 304 944 532" stroke="#E50914" strokeWidth="1" strokeDasharray="4 7" opacity=".28" />
          <path d="M330 50C520-10 729 5 889 146" stroke="#E50914" strokeWidth="1.1" />
          <circle cx="694" cy="48" r="6" fill="#E50914" />
          <circle cx="936" cy="456" r="6" fill="#E50914" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1432px] px-6 sm:px-8 lg:px-[58px]">
        <div className="grid items-start gap-9 lg:grid-cols-[460px_minmax(0,1fr)] lg:gap-[64px]">
          
          {/* Left Column */}
          <div className="flex flex-col justify-center pt-4 lg:pt-[16px]">
            {/* Eyebrow */}
            <div className="mb-7 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#E50914]" />
              <span className="text-[12px] font-extrabold uppercase tracking-[0.13em] text-[#E50914]">
                AI-Powered Financial Investigation Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="mb-6 text-[50px] font-extrabold leading-[1.02] tracking-normal text-[#050816] sm:text-[58px] lg:text-[62px]">
              Detect. Explain.<br />
              <span className="text-[#E50914]">Investigate.</span>
            </h1>

            {/* Sub-text */}
            <p className="mb-9 max-w-[465px] text-[17px] font-medium leading-[1.55] text-[#657084]">
              FraudGuard AI combines the power of Machine Learning and Generative AI to detect suspicious financial
              activity, explain risks, and empower investigators.
            </p>

            {/* CTAs */}
            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/dashboard"
                className="inline-flex h-[46px] items-center justify-center rounded-[7px] bg-[#E50914] px-7 text-[15px] font-bold text-white shadow-[0_10px_22px_rgba(229,9,20,0.18)] transition-colors hover:bg-red-700"
              >
                Start for Free <span className="ml-2 text-lg font-normal leading-none">→</span>
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex h-[46px] items-center justify-center rounded-[7px] border border-[#D7DCE5] bg-white px-7 text-[15px] font-bold text-[#101828] shadow-sm transition-colors hover:bg-gray-50"
              >
                Book a Demo <Calendar className="ml-2 h-4 w-4 text-gray-500" />
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap xl:flex-nowrap">
              {[
                { icon: <Shield className="h-[18px] w-[18px] text-[#E50914]" strokeWidth={1.7} />, title: "ML-Powered", sub: "Risk Detection" },
                { icon: <MessageSquare className="h-[18px] w-[18px] text-[#E50914]" strokeWidth={1.7} />, title: "AI Explanations", sub: "You Can Trust" },
                { icon: <Lock className="h-[18px] w-[18px] text-[#E50914]" strokeWidth={1.7} />, title: "Secure &", sub: "Privacy First" },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FFF0F0]">
                    {b.icon}
                  </div>
                  <div className="text-[13px] font-bold leading-tight text-[#1B2434]">
                    {b.title}<br />
                    <span className="font-medium text-[#657084]">{b.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dashboard Mockup */}
          <div className="relative flex justify-start overflow-x-auto pb-3 lg:overflow-visible">
            
            {/* Dashboard Container */}
            <div className="relative z-10 flex h-[528px] w-[760px] shrink-0 overflow-hidden rounded-[14px] border border-[#EAEEF5] bg-white shadow-[0_24px_70px_rgba(15,23,42,0.13)] sm:w-[790px]">
              
              {/* Floating shield badge */}
              <div className="absolute -right-5 -top-6 z-50 flex h-[74px] w-[74px] items-center justify-center rounded-full bg-white shadow-[0_16px_35px_rgba(229,9,20,0.15)]">
                <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#E50914]">
                  <ShieldCheck className="h-7 w-7 text-white" strokeWidth={2.6} />
                </div>
              </div>

              {/* Sidebar */}
              <div className="flex w-[148px] shrink-0 flex-col bg-gradient-to-b from-[#151D2D] to-[#0B1120] p-[18px] text-white">
                <div className="mb-8 mt-1 flex items-center gap-2">
                  <LogoIcon className="h-5 w-5" />
                  <span className="text-[12px] font-bold">FraudGuard <span className="text-[#E50914]">AI</span></span>
                </div>
                
                <nav className="flex-1 space-y-[7px]">
                  {[
                    { Icon: LayoutDashboard, label: "Dashboard", active: true },
                    { Icon: FolderOpen, label: "Cases", active: false },
                    { Icon: Upload, label: "Upload", active: false },
                    { Icon: BarChart3, label: "Analytics", active: false },
                    { Icon: Bot, label: "AI Assistant", active: false },
                  ].map(({ Icon, label, active }) => (
                    <div
                      key={label}
                      className={`flex h-[34px] items-center gap-2 rounded-[6px] px-3 text-[11px] font-bold transition-colors ${
                        active ? "bg-[#B8292C] text-white shadow-sm" : "text-[#AAB1C0] hover:text-gray-200"
                      }`}
                    >
                      <Icon className="h-[14px] w-[14px] opacity-85" strokeWidth={2} /> {label}
                    </div>
                  ))}
                </nav>
                
                <div className="mt-auto mb-2">
                  <div className="flex h-[34px] cursor-pointer items-center gap-2 rounded-[6px] px-3 text-[11px] font-bold text-[#AAB1C0] hover:text-gray-200">
                    <LogOut className="h-[14px] w-[14px] opacity-85" /> Log out
                  </div>
                </div>
              </div>

              {/* Main Area */}
              <div className="flex min-w-0 flex-1 flex-col bg-white p-[18px] pb-4">
                
                {/* Header */}
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="mb-1 text-[18px] font-extrabold text-[#111827]">Dashboard</h2>
                    <p className="text-[12px] font-semibold text-[#5F687A]">Welcome back, Investigator</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-[28px] w-[170px] items-center gap-2 rounded-[8px] border border-[#E8EBF0] bg-[#F9FAFC] px-3">
                      <Search className="h-3.5 w-3.5 text-gray-400" strokeWidth={2} />
                      <span className="text-[9px] font-semibold text-gray-400">Search anything...</span>
                    </div>
                    <Bell className="h-[18px] w-[18px] text-[#1F2937]" strokeWidth={2} />
                    <div className="h-8 w-8 overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-[#F3C7B9] via-[#9BA7B8] to-[#252F45] shadow-sm">
                      <div className="h-full w-full bg-[radial-gradient(circle_at_45%_28%,#f7d5c7_0_18%,transparent_19%),radial-gradient(circle_at_45%_48%,#1f2937_0_18%,transparent_19%)]" />
                    </div>
                  </div>
                </div>

                {/* Metric Cards Row */}
                <div className="mb-4 grid grid-cols-4 gap-[10px]">
                  {[
                    { title: "Overall Risk Score", val: "82%", sub: "High Risk", subColor: "text-[#DC2626]", trend: "down" },
                    { title: "Active Cases", val: "24", sub: "+12% vs last week", subColor: "text-green-500", trend: "up" },
                    { title: "Amount at Risk", val: "₹3.45M", sub: "+18% vs last week", subColor: "text-green-500", trend: "up" },
                    { title: "High Risk Cases", val: "32", sub: "+16% vs last week", subColor: "text-[#DC2626]", trend: "down" },
                  ].map((m, i) => (
                    <div key={i} className="h-[101px] rounded-[9px] border border-[#EAEEF5] bg-white p-[13px] shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                      <p className="mb-3 text-[9px] font-extrabold text-[#111827]">{m.title}</p>
                      <p className="mb-3 text-[24px] font-heading font-extrabold leading-none text-[#111827]">{m.val}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-bold ${m.subColor}`}>{m.sub}</span>
                        {/* Mini sparkline */}
                        <svg width="36" height="14" viewBox="0 0 36 14" fill="none">
                          <path d={m.trend === 'up' ? "M0 10 Q 8 2 16 8 T 32 2" : "M0 2 Q 8 10 16 4 T 32 10"} 
                                stroke={m.trend === 'up' ? "#74D8B2" : "#FF4B4B"} 
                                strokeWidth="1.5" strokeLinecap="round" fill="none" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts Row */}
                <div className="mb-3 grid grid-cols-[1.08fr_.92fr] gap-[10px]">
                  
                  {/* Line Chart Card */}
                  <div className="flex h-[176px] flex-col rounded-[9px] border border-[#EAEEF5] bg-white p-[14px] shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-[12px] font-extrabold text-[#111827]">Risk Trend</h3>
                      <div className="flex items-center gap-1 rounded-[6px] border border-gray-200 px-2 py-1">
                        <span className="text-[9px] font-bold text-[#6B7280]">Last 7 Days</span>
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400"><path d="m6 9 6 6 6-6"/></svg>
                      </div>
                    </div>
                    
                    <div className="relative min-h-0 w-full flex-1">
                      {/* Chart Background Grid/Axes */}
                      <div className="absolute inset-0 flex flex-col justify-between pb-6">
                         {[100, 75, 50, 25, 0].map(val => (
                            <div key={val} className="flex items-center gap-2">
                               <span className="w-6 text-right text-[8px] font-medium text-gray-400">{val}%</span>
                               <div className="flex-1 border-b border-gray-100 border-dashed" />
                            </div>
                         ))}
                      </div>
                      {/* X-Axis labels */}
                      <div className="absolute bottom-0 right-0 left-8 flex justify-between text-[8px] font-medium text-gray-400 px-2">
                         <span>May 12</span><span>May 13</span><span>May 14</span><span>May 15</span><span>May 16</span><span>May 17</span><span>May 18</span>
                      </div>
                      {/* SVG Line */}
                      <svg className="absolute inset-0 w-full h-[calc(100%-24px)] ml-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <defs>
                          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E50914" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d="M0 80 C 10 90, 15 50, 30 70 C 45 90, 50 60, 65 40 C 80 20, 85 45, 100 20 L 100 100 L 0 100 Z" fill="url(#chart-grad)" />
                        <path d="M0 80 C 10 90, 15 50, 30 70 C 45 90, 50 60, 65 40 C 80 20, 85 45, 100 20" fill="none" stroke="#E50914" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="30" cy="70" r="3" fill="#E50914" stroke="white" strokeWidth="1.5" />
                        <circle cx="65" cy="40" r="3" fill="#E50914" stroke="white" strokeWidth="1.5" />
                        <circle cx="100" cy="20" r="3" fill="#E50914" stroke="white" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>

                  {/* Donut Chart Card */}
                  <div className="h-[176px] rounded-[9px] border border-[#EAEEF5] bg-white p-[14px] shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                    <h3 className="mb-4 text-[12px] font-extrabold text-[#111827]">Top Risk Categories</h3>
                    
                    <div className="flex items-center gap-4">
                      {/* CSS Donut */}
                      <div className="relative h-[84px] w-[84px] shrink-0 rounded-full" style={{
                        background: "conic-gradient(#176FC6 0% 42%, #E50914 42% 70%, #FF8B18 70% 88%, #11A58D 88% 100%)"
                      }}>
                         <div className="absolute inset-0 m-auto h-[48px] w-[48px] rounded-full bg-white shadow-inner" />
                      </div>
                      
                      {/* Legend */}
                      <div className="w-full space-y-2">
                        {[
                          ["bg-[#176FC6]", "Card Fraud", "42%"],
                          ["bg-[#E50914]", "Account Takeover", "28%"],
                          ["bg-[#FF8B18]", "Money Laundering", "18%"],
                          ["bg-[#11A58D]", "Synthetic Identity", "12%"],
                        ].map(([dot, name, pct]) => (
                          <div key={name} className="flex items-center justify-between w-full text-[10px]">
                            <div className="flex items-center gap-2">
                              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${dot}`} />
                              <span className="font-bold text-[#111827]">{name}</span>
                            </div>
                            <span className="font-extrabold text-[#111827]">{pct}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Recent Cases Table */}
                <div className="flex flex-1 flex-col rounded-[9px] border border-[#EAEEF5] bg-white shadow-[0_6px_20px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center justify-between border-b border-gray-50 px-[14px] py-3">
                    <h3 className="text-[12px] font-extrabold text-[#111827]">Recent Cases</h3>
                    <span className="cursor-pointer text-[9px] font-bold text-[#E50914] hover:underline">View All Cases</span>
                  </div>
                  
                  <div className="px-[14px] pb-3 pt-2">
                    <table className="w-full min-w-max whitespace-nowrap text-left text-[10px]">
                      <thead>
                        <tr className="text-[#6B7280]">
                          <th className="pb-3 pr-4 font-bold">Case ID</th>
                          <th className="pb-3 pr-4 font-bold">Customer</th>
                          <th className="pb-3 pr-4 font-bold">Date</th>
                          <th className="pb-3 pr-4 font-bold">Risk Score</th>
                          <th className="pb-3 pr-4 font-bold">Status</th>
                          <th className="pb-3 pr-4 font-bold">Amount</th>
                          <th className="pb-3 pr-4 text-right font-bold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="pr-4 pt-1 font-extrabold text-[#111827]">CASE-1024</td>
                          <td className="pr-4 pt-1 font-bold text-[#111827]">Aarav Mehta</td>
                          <td className="pr-4 pt-1 font-bold text-[#111827]">May 18, 2025</td>
                          <td className="pr-4 pt-1 font-extrabold text-[#E50914]">92%</td>
                          <td className="pr-4 pt-1">
                            <span className="inline-flex items-center rounded-[5px] bg-red-50 px-2 py-0.5 text-[9px] font-bold text-[#E50914]">Critical</span>
                          </td>
                          <td className="pr-4 pt-1 font-extrabold text-[#111827]">₹1,250,000</td>
                          <td className="pr-4 pt-1 text-right">
                             <ArrowRight className="h-4 w-4 inline-block text-gray-400" />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
