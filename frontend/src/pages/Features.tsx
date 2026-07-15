import { Link } from "react-router-dom";
import { ArrowRight, BrainCircuit, CheckCircle2, FileDown, MessageSquare, ScanText, Shield, BarChart3, Sparkles, Upload, Download, Calendar, Lock, Zap, ShieldCheck, Globe, Cloud } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Shield3D } from "@/components/ui/Shield3D";

export default function Features() {
  const features = [
    {
      num: "01",
      title: "AI Risk Detection",
      desc: "Automatically identifies suspicious financial transactions using machine learning models trained on fraud patterns.",
      icon: Shield,
      checks: ["Risk Score", "Fraud Probability", "Pattern Detection", "Real-time Alerts"],
      graphic: (
        <div className="w-64 h-40 opacity-100 pointer-events-none translate-y-6 translate-x-4">
          <svg viewBox="0 0 100 60" className="w-full h-full stroke-[#E50914]">
            {/* Smooth bezier curve for the chart */}
            <path d="M0,60 L0,50 Q10,50 20,40 T40,45 T60,30 T80,35 T100,10 L100,60 Z" fill="url(#red-gradient-1)" stroke="none" />
            <path d="M0,50 Q10,50 20,40 T40,45 T60,30 T80,35 T100,10" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            
            {/* Chart points */}
            <circle cx="20" cy="40" r="1.5" fill="white" strokeWidth="1" />
            <circle cx="40" cy="45" r="1.5" fill="white" strokeWidth="1" />
            <circle cx="60" cy="30" r="1.5" fill="white" strokeWidth="1" />
            <circle cx="80" cy="35" r="1.5" fill="white" strokeWidth="1" />
            <circle cx="100" cy="10" r="1.5" fill="white" strokeWidth="1" />
            
            <defs>
              <linearGradient id="red-gradient-1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#E50914" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      )
    },
    {
      num: "02",
      title: "Explainable AI",
      desc: "Don't just detect fraud—understand it. Every prediction includes a human-readable explanation showing why a transaction was flagged.",
      icon: BrainCircuit,
      checks: ["AI Reasoning", "Confidence Score", "Similar Cases", "Transparent Decisions"],
      graphic: (
        <div className="flex flex-col gap-2.5 pointer-events-none mb-6 mr-[-10px] transform scale-110 origin-bottom-right">
          {/* Risk Score Card */}
          <div className="rounded-[10px] border border-[#E8EBF0] bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.04)] w-48 relative z-10 -ml-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="text-[10px] font-bold text-[#090D18]">Risk Score</div>
              <div className="text-[#E50914] font-extrabold text-[12px]">92%</div>
            </div>
            <div className="h-1.5 rounded-full bg-[#E8EBF0] overflow-hidden">
              <div className="h-full bg-[#E50914] w-[92%] rounded-full"></div>
            </div>
          </div>
          {/* Explanation Card */}
          <div className="rounded-[10px] border border-[#E8EBF0] bg-white p-3 shadow-sm w-44 opacity-80">
            <div className="flex items-center justify-between mb-2">
               <div className="text-[9px] font-bold text-[#090D18]">Explanation</div>
               <div className="h-1.5 w-6 rounded-full bg-gray-200"></div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1.5 w-full bg-[#E8EBF0] rounded-full"></div>
              <div className="h-1.5 w-4/5 bg-[#E8EBF0] rounded-full"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: "03",
      title: "AI Assistant",
      desc: "Ask questions. Get intelligent answers. The built-in AI Investigation Assistant understands every case and provides contextual answers about flagged transactions, summaries, anomalies, and recommendations.",
      icon: MessageSquare,
      checks: ["Natural language interaction", "Case-aware conversations", "Investigation summaries", "Contextual recommendations", "Faster case review"],
      graphic: (
        <div className="pointer-events-none scale-100 origin-bottom-right mb-4 mr-0">
          <div className="relative w-48 h-32">
            {/* Top White Bubble */}
            <div className="absolute top-0 right-8 bg-white border border-[#E8EBF0] rounded-xl rounded-br-none px-3 py-2.5 shadow-[0_8px_16px_rgba(0,0,0,0.04)] w-36 z-10">
              <Sparkles className="absolute -top-2.5 -left-2.5 h-5 w-5 text-[#E50914] fill-white" strokeWidth={1.5} />
              <div className="flex items-center gap-1.5 mb-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#E50914]"></div>
                <div className="h-1.5 w-4 bg-[#E50914] opacity-20 rounded-full"></div>
              </div>
              <div className="h-1.5 w-full bg-[#E8EBF0] rounded-full mb-1.5"></div>
              <div className="h-1.5 w-2/3 bg-[#E8EBF0] rounded-full"></div>
            </div>
            {/* Right Pink Bubble */}
            <div className="absolute top-12 -right-2 bg-[#FFF5F5] border border-red-100 rounded-xl rounded-bl-none px-3 py-2.5 shadow-sm w-32 z-20">
              <div className="flex justify-end mb-1.5">
                <div className="h-1.5 w-3/4 bg-white rounded-full"></div>
              </div>
              <div className="flex justify-end">
                <div className="h-1.5 w-1/2 bg-white rounded-full"></div>
              </div>
            </div>
            {/* Bottom White Bubble */}
            <div className="absolute bottom-0 right-16 bg-white border border-[#E8EBF0] rounded-xl rounded-br-none px-3 py-2 shadow-sm w-28 z-30">
               <div className="h-1.5 w-full bg-[#E8EBF0] rounded-full mb-1.5"></div>
               <div className="h-1.5 w-4/5 bg-[#E8EBF0] rounded-full"></div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: "04",
      title: "OCR & Document Analysis",
      desc: "Upload bank statements, invoices, KYC documents, or PDFs. FraudGuard automatically extracts important information.",
      icon: ScanText,
      checks: ["OCR Extraction", "Auto Classification", "Entity Recognition", "Multi-format Upload"],
      graphic: (
        <div className="pointer-events-none mb-6 mr-6 transform scale-110 origin-bottom-right">
          <div className="relative">
            {/* Document outline */}
            <div className="h-32 w-28 rounded-xl border border-[#E8EBF0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-4 relative ml-4">
              <div className="absolute -left-4 top-5 bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
              <div className="space-y-3 mt-3">
                <div className="h-1.5 w-full bg-[#E8EBF0] rounded-full"></div>
                <div className="h-1.5 w-full bg-[#E8EBF0] rounded-full"></div>
                <div className="h-1.5 w-3/4 bg-[#E8EBF0] rounded-full"></div>
                <div className="h-1.5 w-full bg-[#E8EBF0] rounded-full"></div>
                <div className="h-1.5 w-5/6 bg-[#E8EBF0] rounded-full"></div>
              </div>
            </div>
            {/* Upload icon box */}
            <div className="absolute -bottom-4 -left-4 flex h-14 w-14 items-center justify-center rounded-xl bg-white border border-[#FCA5A5] shadow-[0_8px_24px_rgba(229,9,20,0.15)] z-10">
              <Upload className="h-6 w-6 text-[#E50914]" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )
    },
    {
      num: "05",
      title: "Analytics Dashboard",
      desc: "Visualize fraud trends and monitor investigation performance in real time.",
      icon: BarChart3,
      checks: ["Live Dashboard", "Fraud Trends", "Geographic Analysis", "KPI Monitoring"],
      graphic: (
        <div className="pointer-events-none mb-4 mr-4 transform scale-110 origin-bottom-right">
          <div className="flex flex-col items-end gap-3">
            {/* Tiny Line Chart */}
            <div className="w-32 h-14 opacity-90 rounded-lg border border-[#E8EBF0] bg-white shadow-sm p-2">
              <svg viewBox="0 0 100 30" className="w-full h-full stroke-[#E50914]" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M0,25 Q15,25 25,15 T50,20 T75,5 T100,10" />
                <circle cx="75" cy="5" r="2" fill="#E50914" />
                <circle cx="100" cy="10" r="2" fill="#E50914" />
              </svg>
            </div>
            {/* Stats UI */}
            <div className="flex items-center gap-3">
              {/* CSS Donut Chart */}
              <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#E8EBF0] shadow-sm shrink-0">
                 <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#E50914 0% 25%, #3B82F6 25% 100%)' }}></div>
                 <div className="absolute inset-1.5 bg-white rounded-full"></div>
              </div>
              
              <div className="rounded-xl border border-[#E8EBF0] bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.04)] flex gap-4 items-center">
                <div className="flex flex-col items-center">
                  <span className="text-[14px] font-extrabold text-[#090D18] leading-none mb-1">24</span>
                  <span className="text-[8px] font-bold text-[#6B7280] leading-none whitespace-nowrap">Active Cases</span>
                </div>
                <div className="w-[1px] h-6 bg-gray-200"></div>
                <div className="flex flex-col items-center">
                  <span className="text-[14px] font-extrabold text-[#E50914] leading-none mb-1">7</span>
                  <span className="text-[8px] font-bold text-[#6B7280] leading-none">Alerts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      num: "06",
      title: "One-click Report Generator",
      desc: "Generate investigation reports instantly with AI-generated summaries and evidence.",
      icon: FileDown,
      checks: ["AI Summary", "Audit Ready", "Customizable Format", "Share Securely"],
      graphic: (
        <div className="pointer-events-none mb-6 mr-8 transform scale-110 origin-bottom-right">
          <div className="relative">
            {/* Document outline */}
            <div className="h-32 w-28 rounded-xl border border-[#E8EBF0] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-4 relative">
              <div className="absolute -left-4 top-5 bg-[#E50914] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">PDF</div>
              <div className="space-y-3 mt-3">
                <div className="h-1.5 w-full bg-[#E8EBF0] rounded-full"></div>
                <div className="h-1.5 w-full bg-[#E8EBF0] rounded-full"></div>
                <div className="h-1.5 w-3/4 bg-[#E8EBF0] rounded-full"></div>
                <div className="h-1.5 w-full bg-[#E8EBF0] rounded-full"></div>
                <div className="h-1.5 w-5/6 bg-[#E8EBF0] rounded-full"></div>
              </div>
            </div>
            {/* Download Icon circle */}
            <div className="absolute -bottom-4 -right-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E50914] shadow-[0_8px_24px_rgba(229,9,20,0.3)] z-10 border-4 border-white">
              <Download className="h-5 w-5 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#111827]">
      <Navbar />

      <main>
        {/* Header Section */}
        <section className="bg-white pt-24 pb-16 relative overflow-hidden">
          {/* Background Decor */}
          <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
            {/* Concentric red circles */}
            <div className="absolute w-[800px] h-[800px] rounded-full border border-red-50/80 -top-[400px]"></div>
            <div className="absolute w-[1200px] h-[1200px] rounded-full border border-red-50/50 -top-[600px]"></div>
            <div className="absolute w-[1600px] h-[1600px] rounded-full border border-red-50/30 -top-[800px]"></div>
            
            {/* Floating red dots */}
            <div className="absolute top-24 left-[20%] w-2 h-2 bg-[#E50914] rounded-full shadow-[0_0_12px_rgba(229,9,20,0.6)]"></div>
            <div className="absolute top-40 right-[15%] w-2.5 h-2.5 bg-[#E50914] rounded-full shadow-[0_0_15px_rgba(229,9,20,0.6)]"></div>
            <div className="absolute bottom-10 left-[30%] w-1.5 h-1.5 bg-red-300 rounded-full"></div>
            <div className="absolute top-32 left-[8%] w-1 h-1 bg-red-400 rounded-full"></div>
            <div className="absolute bottom-20 right-[25%] w-1.5 h-1.5 bg-red-300 rounded-full"></div>
          </div>

          <div className="relative z-10 mx-auto w-full max-w-[1432px] px-6 md:px-12 lg:px-[58px]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-5 flex items-center gap-2 rounded-full border border-red-100 bg-[#FEF2F2] px-4 py-1.5 text-[#E50914]">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.5} />
                <span className="text-[11px] font-bold tracking-[0.15em] uppercase mt-0.5">Powerful Features</span>
              </div>
              <h2 className="mb-6 max-w-[780px] text-[42px] font-extrabold leading-[1.1] tracking-tight text-[#090D18] md:text-[54px]">
                Everything you need to investigate <span className="text-[#E50914]">financial fraud</span>
              </h2>
              <p className="max-w-[720px] text-[16px] font-medium leading-[1.7] text-[#657084]">
                FraudGuard AI combines machine learning, explainable AI, and intelligent investigation tools into one seamless workflow for analysts, investigators, compliance teams, and financial institutions.
              </p>
            </div>
          </div>
        </section>

        {/* 6-Card Feature Grid */}
        <section className="bg-white pb-20 relative">
          <div className="mx-auto w-full max-w-[1432px] px-6 md:px-12 lg:px-[58px]">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.num} className="relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#E8EBF0] bg-white p-[30px] shadow-[0_4px_24px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_12px_36px_rgba(0,0,0,0.06)] hover:-translate-y-1 min-h-[420px] h-full">
                  
                  <div className="relative z-10 flex flex-col h-full pointer-events-none">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-red-100 bg-[#FFF5F5] text-[#E50914] shadow-sm">
                        <feature.icon className="h-[24px] w-[24px]" strokeWidth={2} />
                      </div>
                      <span className="text-[44px] font-light text-red-200/50 mt-[-8px] tracking-tight">{feature.num}</span>
                    </div>

                    <div className="flex-grow z-10 pr-[140px] sm:pr-[160px] md:pr-[135px] lg:pr-[140px] xl:pr-[160px]">
                      <h3 className="mb-3 text-[21px] font-extrabold text-[#090D18] leading-tight">{feature.title}</h3>
                      <p className="mb-6 text-[14px] font-medium leading-relaxed text-[#6B7280] pr-4">
                        {feature.desc}
                      </p>
                      
                      <ul className="mb-10 space-y-3">
                        {feature.checks.map((check, i) => (
                          <li key={i} className="flex items-center text-[13px] font-bold text-[#090D18]">
                            <CheckCircle2 className="mr-2.5 h-[16px] w-[16px] text-[#E50914] shrink-0" strokeWidth={2.5} /> 
                            {check}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-auto pointer-events-auto w-fit">
                      <Link to="/dashboard" className="inline-flex items-center text-[14px] font-bold text-[#E50914] hover:text-red-700 transition-colors">
                        Learn more <ArrowRight className="ml-1.5 h-4 w-4" strokeWidth={2.5} />
                      </Link>
                    </div>
                  </div>

                  {/* Unique Custom Graphic per Card (Bottom Right) */}
                  <div className="absolute bottom-0 right-0 z-0">
                    {feature.graphic}
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Badges Row */}
        <section className="border-t border-[#E8EBF0] border-b bg-white py-10">
          <div className="mx-auto w-full max-w-[1432px] px-6 md:px-12 lg:px-[58px]">
            <div className="flex flex-wrap items-center justify-center gap-8 md:justify-between opacity-80">
              <div className="flex items-center gap-3">
                <Lock className="h-[22px] w-[22px] text-[#E50914]" strokeWidth={2} />
                <span className="text-[14px] font-bold text-[#090D18]">End-to-End<br/>Encryption</span>
              </div>
              <div className="hidden h-10 w-[1px] bg-gray-200 lg:block"></div>
              <div className="flex items-center gap-3">
                <Zap className="h-[22px] w-[22px] text-[#E50914]" strokeWidth={2} />
                <span className="text-[14px] font-bold text-[#090D18]">Real-time<br/>Processing</span>
              </div>
              <div className="hidden h-10 w-[1px] bg-gray-200 lg:block"></div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-[22px] w-[22px] text-[#E50914]" strokeWidth={2} />
                <span className="text-[14px] font-bold text-[#090D18]">Audit<br/>Ready</span>
              </div>
              <div className="hidden h-10 w-[1px] bg-gray-200 lg:block"></div>
              <div className="flex items-center gap-3">
                <Globe className="h-[22px] w-[22px] text-[#E50914]" strokeWidth={2} />
                <span className="text-[14px] font-bold text-[#090D18]">GDPR<br/>Compliant</span>
              </div>
              <div className="hidden h-10 w-[1px] bg-gray-200 lg:block"></div>
              <div className="flex items-center gap-3">
                <Cloud className="h-[22px] w-[22px] text-[#E50914]" strokeWidth={2} />
                <span className="text-[14px] font-bold text-[#090D18]">Cloud<br/>Secure</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-white py-16">
          <div className="mx-auto w-full max-w-[1432px] px-6 md:px-12 lg:px-[58px]">
            <div className="relative flex flex-col items-center justify-between gap-10 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#FEF2F2] via-[#FFF5F5] to-[#FFEBEB] p-10 md:flex-row lg:p-14 border border-red-50">
              
              {/* Subtle background red dots/lines */}
              <div className="absolute right-1/4 top-4 h-1.5 w-1.5 rounded-full bg-[#E50914] opacity-50" />
              <div className="absolute right-1/3 bottom-8 h-2 w-2 rounded-full bg-[#E50914] opacity-40" />
              <div className="absolute right-10 top-10 h-1 w-1 rounded-full bg-[#E50914] opacity-60" />
              <svg className="absolute right-[20%] top-1/2 -translate-y-1/2 opacity-20" width="300" height="200" viewBox="0 0 300 200" fill="none">
                 <path d="M0,100 Q150,0 300,100" stroke="#E50914" strokeWidth="1" strokeDasharray="4 4" />
              </svg>

              {/* Left: Text Content */}
              <div className="relative z-10 flex-1 max-w-[420px] text-center md:text-left">
                <h2 className="mb-4 text-[28px] font-extrabold leading-[1.15] text-[#090D18] lg:text-[34px]">
                  Ready to transform <br/>
                  <span className="text-[#E50914]">financial investigations?</span>
                </h2>
                <p className="text-[14px] font-medium leading-relaxed text-[#6B7280]">
                  See how FraudGuard AI helps detect fraud faster, explain decisions clearly, and streamline investigations.
                </p>
              </div>

              {/* Middle: Buttons */}
              <div className="relative z-10 flex shrink-0 flex-col gap-4 sm:flex-row md:ml-4">
                <Link
                  to="/dashboard"
                  className="inline-flex h-[46px] items-center justify-center rounded-[8px] bg-[#E50914] px-7 text-[14px] font-bold text-white transition-colors hover:bg-red-700 shadow-[0_8px_18px_rgba(229,9,20,0.18)]"
                >
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2.5} />
                </Link>
                <Link
                  to="/dashboard"
                  className="inline-flex h-[46px] items-center justify-center rounded-[8px] border border-red-200 bg-white px-7 text-[14px] font-bold text-[#E50914] transition-colors hover:bg-red-50 shadow-[0_2px_8px_rgba(229,9,20,0.05)]"
                >
                  Book a Demo <Calendar className="ml-2 h-4 w-4" strokeWidth={2} />
                </Link>
              </div>

              {/* Right: 3D Shield Graphic & Pedestal */}
              <div className="relative z-10 hidden shrink-0 lg:flex items-center justify-end pl-8">
                <div className="w-[280px] h-[220px] relative flex items-center justify-center">
                  
                  {/* Floating decorative dots */}
                  <div className="absolute top-10 left-0 w-2 h-2 bg-[#E50914] rounded-full shadow-[0_0_10px_rgba(229,9,20,0.5)]"></div>
                  <div className="absolute bottom-20 right-4 w-1.5 h-1.5 bg-red-400 rounded-full"></div>
                  <div className="absolute top-24 right-10 w-1 h-1 bg-red-300 rounded-full"></div>

                  {/* 3-Tier Pedestal Base */}
                  <div className="absolute bottom-0 w-[320px] h-[60px] bg-gradient-to-b from-white to-red-50 rounded-[100%] shadow-[0_15px_40px_rgba(229,9,20,0.15)] border-b-4 border-white"></div>
                  <div className="absolute bottom-[10px] w-[260px] h-[50px] bg-[#FFF5F5] rounded-[100%] shadow-inner border border-red-100"></div>
                  <div className="absolute bottom-[20px] w-[200px] h-[40px] bg-white rounded-[100%] border border-red-50 shadow-sm"></div>

                  {/* Shield */}
                  <div className="relative z-10 w-[140px] h-[140px] -translate-y-8">
                    <Shield3D className="w-full h-full drop-shadow-[0_20px_30px_rgba(229,9,20,0.4)]" />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
