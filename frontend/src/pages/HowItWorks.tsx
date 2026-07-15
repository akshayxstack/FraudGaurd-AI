import { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { Link } from 'react-router-dom';
import { 
  Sparkles, CloudUpload, FileText, BrainCircuit, ShieldCheck, 
  MonitorPlay, CheckCircle2, ArrowRight, ArrowDown, Settings, 
  BarChart2, Lightbulb, ChevronDown, Calendar, 
  Mail, Users, Lock, ScanLine, Table
} from 'lucide-react';

export default function HowItWorks() {
  const [openFaq, setOpenFaq] = useState<number>(1);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  const faqs = [
    {
      id: 1,
      question: "What is FraudGuard AI?",
      answer: "FraudGuard AI is an intelligent financial investigation platform that uses machine learning to detect suspicious transactions and Explainable AI (Gemini) to provide clear explanations, insights, and recommendations for every case.",
      icon: ShieldCheck
    },
    {
      id: 2,
      question: "How does the fraud detection model work?",
      answer: "Our supervised machine learning model is trained on vast datasets of historical financial records to recognize patterns indicative of fraud. It evaluates dozens of engineered features per transaction to assign a highly accurate probability score.",
      icon: BrainCircuit
    },
    {
      id: 3,
      question: "How is Explainable AI different from regular AI?",
      answer: "While regular AI gives you a prediction (e.g., 'High Risk'), Explainable AI breaks down exactly *why* the model made that decision, translating complex weights into human-readable insights so analysts can trust and verify the results.",
      icon: ShieldCheck
    },
    {
      id: 4,
      question: "What types of files can I upload?",
      answer: "We support standard financial formats including PDF statements, CSV exports, and Excel spreadsheets (XLSX). Our OCR and parsing engine handles the extraction automatically.",
      icon: FileText
    },
    {
      id: 5,
      question: "How secure is my data?",
      answer: "Security is our top priority. All data is encrypted in transit and at rest. We adhere to enterprise-grade security standards and do not use your proprietary data to train our foundational models.",
      icon: Lock
    },
    {
      id: 6,
      question: "Who can use FraudGuard AI?",
      answer: "It is designed for financial analysts, compliance officers, fraud investigators, and risk management teams at banks, fintechs, and financial institutions.",
      icon: Users
    },
    {
      id: 7,
      question: "Can I export or share reports?",
      answer: "Yes, you can easily export investigation summaries and complete case reports in PDF or CSV formats to share with stakeholders or external auditors.",
      icon: FileText
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#111827]">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* Global Page Background Decor */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.22]">
          {/* Dotted grid pattern top-left */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px]" style={{ backgroundImage: 'radial-gradient(#E50914 1.5px, transparent 1.5px)', backgroundSize: '32px 32px' }}></div>
          {/* Dotted grid pattern middle-right */}
          <div className="absolute top-[900px] right-0 w-[450px] h-[600px]" style={{ backgroundImage: 'radial-gradient(#E50914 1.2px, transparent 1.2px)', backgroundSize: '24px 24px' }}></div>
          {/* Dotted grid pattern bottom-left */}
          <div className="absolute top-[1800px] left-0 w-[450px] h-[600px]" style={{ backgroundImage: 'radial-gradient(#E50914 1.2px, transparent 1.2px)', backgroundSize: '24px 24px' }}></div>
          
          {/* Arc 1 (Header & Step 1-2) */}
          <svg className="absolute top-0 w-full h-[800px]" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-200 450 C 300 -150, 1100 -150, 1600 450" stroke="#E50914" strokeWidth="1" strokeDasharray="6 6" />
            <path d="M-200 550 C 400 -50, 1000 -50, 1600 550" stroke="#E50914" strokeWidth="0.75" />
            <path d="M-200 650 C 450 50, 950 50, 1600 650" stroke="#E50914" strokeWidth="0.5" strokeDasharray="3 3" />
            
            {/* Concentric Radar Rings in Center-Left */}
            <circle cx="250" cy="200" r="80" stroke="#E50914" strokeWidth="0.75" strokeDasharray="4 4" />
            <circle cx="250" cy="200" r="160" stroke="#E50914" strokeWidth="0.5" />
            <line x1="250" y1="30" x2="250" y2="370" stroke="#E50914" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="80" y1="200" x2="420" y2="200" stroke="#E50914" strokeWidth="0.5" strokeDasharray="2 2" />
            
            {/* Concentric Radar Rings in Center-Right */}
            <circle cx="1150" cy="350" r="100" stroke="#E50914" strokeWidth="0.75" strokeDasharray="4 4" />
            <circle cx="1150" cy="350" r="200" stroke="#E50914" strokeWidth="0.5" />
            
            {/* Network Node lines */}
            <line x1="500" y1="120" x2="650" y2="80" stroke="#E50914" strokeWidth="0.5" />
            <line x1="650" y1="80" x2="780" y2="150" stroke="#E50914" strokeWidth="0.5" />
            <line x1="780" y1="150" x2="900" y2="100" stroke="#E50914" strokeWidth="0.5" strokeDasharray="4 4" />
            
            <circle cx="500" cy="120" r="3.5" fill="#E50914" />
            <circle cx="650" cy="80" r="4.5" fill="#E50914" />
            <circle cx="780" cy="150" r="3" fill="#E50914" />
            <circle cx="900" cy="100" r="5" fill="#E50914" />
          </svg>
          
          {/* Arc 2 (Step 3-5 & Pipeline area) */}
          <svg className="absolute top-[800px] w-full h-[800px]" viewBox="0 0 1440 800" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-200 550 C 400 50, 1000 50, 1600 550" stroke="#E50914" strokeWidth="1" strokeDasharray="6 6" />
            <path d="M-200 650 C 500 150, 900 150, 1600 650" stroke="#E50914" strokeWidth="0.75" />
            
            {/* Large faint scanning circle */}
            <circle cx="720" cy="400" r="300" stroke="#E50914" strokeWidth="0.5" strokeDasharray="8 8" />
            <circle cx="720" cy="400" r="150" stroke="#E50914" strokeWidth="0.5" />
            
            {/* Network connections */}
            <line x1="120" y1="300" x2="250" y2="450" stroke="#E50914" strokeWidth="0.5" />
            <line x1="250" y1="450" x2="380" y2="350" stroke="#E50914" strokeWidth="0.5" strokeDasharray="2 2" />
            <circle cx="120" cy="300" r="4" fill="#E50914" />
            <circle cx="250" cy="450" r="3" fill="#E50914" />
            <circle cx="380" cy="350" r="4.5" fill="#E50914" />

            <line x1="1080" y1="200" x2="1250" y2="150" stroke="#E50914" strokeWidth="0.5" />
            <line x1="1250" y1="150" x2="1350" y2="300" stroke="#E50914" strokeWidth="0.5" />
            <circle cx="1080" cy="200" r="3" fill="#E50914" />
            <circle cx="1250" cy="150" r="5" fill="#E50914" />
            <circle cx="1350" cy="300" r="4" fill="#E50914" />
          </svg>

          {/* Arc 3 (FAQ & CTA Section) */}
          <svg className="absolute top-[1600px] w-full h-[1000px]" viewBox="0 0 1440 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-200 150 C 400 650, 1000 650, 1600 150" stroke="#E50914" strokeWidth="1" strokeDasharray="6 6" />
            <path d="M-200 50 C 300 550, 1100 550, 1600 50" stroke="#E50914" strokeWidth="0.75" />
            <path d="M-200 250 C 450 750, 950 750, 1600 250" stroke="#E50914" strokeWidth="0.5" strokeDasharray="4 4" />
            
            {/* Radar pattern bottom-right */}
            <circle cx="1200" cy="650" r="120" stroke="#E50914" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="1200" cy="650" r="240" stroke="#E50914" strokeWidth="0.5" />
            <line x1="1200" y1="400" x2="1200" y2="900" stroke="#E50914" strokeWidth="0.5" strokeDasharray="2 2" />
            <line x1="950" y1="650" x2="1450" y2="650" stroke="#E50914" strokeWidth="0.5" strokeDasharray="2 2" />
            
            {/* More Nodes */}
            <line x1="180" y1="500" x2="300" y2="420" stroke="#E50914" strokeWidth="0.5" />
            <line x1="300" y1="420" x2="420" y2="520" stroke="#E50914" strokeWidth="0.5" />
            <circle cx="180" cy="500" r="4.5" fill="#E50914" />
            <circle cx="300" cy="420" r="3" fill="#E50914" />
            <circle cx="420" cy="520" r="5" fill="#E50914" />
          </svg>

          {/* Scattered solid red dots */}
          <div className="absolute top-[180px] left-[15%] w-2 h-2 rounded-full bg-[#E50914]"></div>
          <div className="absolute top-[420px] left-[8%] w-3 h-3 rounded-full bg-[#E50914] opacity-80"></div>
          <div className="absolute top-[520px] right-[20%] w-2.5 h-2.5 rounded-full bg-[#E50914]"></div>
          <div className="absolute top-[950px] left-[45%] w-2 h-2 rounded-full bg-[#E50914]"></div>
          <div className="absolute top-[1150px] right-[35%] w-3 h-3 rounded-full bg-[#E50914] opacity-80"></div>
          <div className="absolute top-[1550px] left-[12%] w-2 h-2 rounded-full bg-[#E50914]"></div>
          <div className="absolute top-[2100px] right-[15%] w-2.5 h-2.5 rounded-full bg-[#E50914]"></div>
          <div className="absolute top-[2450px] left-[25%] w-3 h-3 rounded-full bg-[#E50914] opacity-80"></div>
          <div className="absolute top-[2800px] right-[8%] w-2 h-2 rounded-full bg-[#E50914]"></div>
        </div>

        {/* Header Section */}
        <section className="pt-24 pb-16 relative">
          <div className="relative z-10 mx-auto w-full max-w-[900px] px-6 text-center">
            <div className="mx-auto mb-6 flex w-fit items-center rounded-full border border-red-100 bg-red-50/50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-widest text-[#E50914]">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              HOW IT WORKS
            </div>
            
            <h1 className="mb-6 text-[42px] font-extrabold leading-[1.1] tracking-tight md:text-[56px] lg:text-[64px]">
              <span className="text-[#090D18]">From Financial Data</span><br />
              <span className="text-[#E50914]">to Intelligent Investigation</span>
            </h1>
            
            <p className="mx-auto max-w-[700px] text-[16px] font-medium leading-relaxed text-[#6B7280] md:text-[18px]">
              FraudGuard AI transforms financial statements into explainable fraud investigations using supervised machine learning, intelligent analytics, and AI-powered reasoning—all within a secure, end-to-end workflow.
            </p>
          </div>
        </section>

        {/* 5-Step Pipeline Section */}
        <section className="pb-16 relative">
          <div className="mx-auto w-full max-w-[1432px] px-6 md:px-12 lg:px-[58px]">
            {/* Scrollable Container for Steps */}
            <div className="overflow-x-auto pt-6 pb-8 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide">
              <div className="flex flex-nowrap items-stretch gap-6 min-w-max xl:min-w-0">
                
                {/* STEP 01 */}
                <div className="relative flex-none w-[320px] xl:flex-1 rounded-xl border border-[#E8EBF0] bg-white p-6 shadow-sm flex flex-col">
                  <div className="flex items-start justify-between w-full mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E50914] text-[13px] font-extrabold text-white shadow-sm">
                      01
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF5F5] text-[#E50914] shrink-0">
                      <CloudUpload className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="mb-2 text-[18px] font-extrabold text-[#090D18] leading-tight">Upload Financial<br/>Documents</h3>
                    <p className="mb-5 text-[13px] font-medium leading-relaxed text-[#6B7280]">
                      Upload bank statements or financial records in CSV, Excel, or PDF format. FraudGuard AI securely accepts multiple file formats and prepares them for analysis.
                    </p>
                    
                    <ul className="w-full space-y-1.5 text-left pl-4 mb-5">
                      {["Supports CSV, Excel, PDF", "Max file size 100MB", "Encrypted on upload"].map((check, i) => (
                        <li key={i} className="flex items-center text-[11px] font-bold text-[#090D18]">
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-[#E50914] shrink-0" strokeWidth={2.5} /> {check}
                        </li>
                      ))}
                    </ul>
                    
                    {/* Unique Content: Drop Zone */}
                    <div className="mt-auto w-full rounded-xl border-2 border-dashed border-[#E8EBF0] bg-gray-50/50 p-6 text-center">
                      <CloudUpload className="mx-auto mb-2 h-8 w-8 text-gray-400" strokeWidth={1.5} />
                      <div className="text-[14px] font-bold text-[#090D18]">Drop files here</div>
                      <div className="text-[12px] font-medium text-gray-400 underline decoration-gray-300 underline-offset-2 mb-4">or browse</div>
                      
                      <div className="flex justify-center gap-2">
                        <div className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">CSV</div>
                        <div className="rounded bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">XLSX</div>
                        <div className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-bold text-[#E50914]">PDF</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden xl:flex items-center justify-center -mx-3 z-10 pt-12">
                   <ArrowRight className="text-red-200 h-6 w-6" strokeWidth={3} />
                </div>

                {/* STEP 02 */}
                <div className="relative flex-none w-[320px] xl:flex-1 rounded-xl border border-[#E8EBF0] bg-white p-6 shadow-sm flex flex-col">
                  <div className="flex items-start justify-between w-full mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E50914] text-[13px] font-extrabold text-white shadow-sm">
                      02
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF5F5] text-[#E50914] shrink-0">
                      <FileText className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="mb-2 text-[18px] font-extrabold text-[#090D18] leading-tight">Extract & Prepare<br/>Transactions</h3>
                    <p className="mb-6 text-[13px] font-medium leading-relaxed text-[#6B7280]">
                      FraudGuard AI automatically extracts, cleans, and standardizes transactions data before generating engineered features required for fraud detection.
                    </p>
                    
                    {/* Unique Content: Vertical Flow */}
                    <div className="w-full mt-auto mb-5">
                      <div className="flex flex-col items-center">
                        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8EBF0] bg-gray-50 py-2 shadow-sm">
                          <div className="rounded bg-red-100 p-1 text-[#E50914]"><FileText className="h-3 w-3" /></div>
                          <span className="text-[12px] font-bold text-[#090D18]">PDF Statement</span>
                        </div>
                        <ArrowDown className="h-4 w-4 text-gray-300 my-1" strokeWidth={2} />
                        
                        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8EBF0] bg-gray-50 py-2 shadow-sm">
                          <div className="text-gray-500"><ScanLine className="h-3.5 w-3.5" /></div>
                          <span className="text-[12px] font-bold text-[#090D18]">OCR & Parsing</span>
                        </div>
                        <ArrowDown className="h-4 w-4 text-gray-300 my-1" strokeWidth={2} />

                        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8EBF0] bg-gray-50 py-2 shadow-sm">
                          <div className="text-gray-500"><Table className="h-3.5 w-3.5" /></div>
                          <span className="text-[12px] font-bold text-[#090D18]">Cleaned Transactions</span>
                        </div>
                        <ArrowDown className="h-4 w-4 text-gray-300 my-1" strokeWidth={2} />

                        <div className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E8EBF0] bg-gray-50 py-2 shadow-sm">
                          <div className="text-gray-500"><Settings className="h-3.5 w-3.5" /></div>
                          <span className="text-[12px] font-bold text-[#090D18]">Feature Engineering</span>
                        </div>
                      </div>
                    </div>
                    
                    <ul className="w-full space-y-1.5 text-left pl-4">
                      {["OCR & Parsing", "Data Cleaning", "Feature Engineering"].map((check, i) => (
                        <li key={i} className="flex items-center text-[11px] font-bold text-[#090D18]">
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-[#E50914] shrink-0" strokeWidth={2.5} /> {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden xl:flex items-center justify-center -mx-3 z-10 pt-12">
                   <ArrowRight className="text-red-200 h-6 w-6" strokeWidth={3} />
                </div>

                {/* STEP 03 - FEATURED */}
                <div className="relative flex-none w-[340px] xl:flex-1 rounded-xl border border-red-200 bg-[#FEF2F2] p-6 shadow-md transform xl:scale-105 z-20 flex flex-col">
                  <div className="flex items-start justify-between w-full mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E50914] text-[13px] font-extrabold text-white shadow-sm">
                      03
                    </div>
                    <div className="rounded-full bg-[#E50914] px-2.5 py-1 text-[9px] font-extrabold text-white tracking-wide">
                      ML MODEL
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#E50914] shadow-sm shrink-0">
                      <BrainCircuit className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="mb-2 text-[18px] font-extrabold text-[#090D18] leading-tight">AI Risk Detection<br/>&nbsp;</h3>
                    <p className="mb-6 text-[13px] font-medium leading-relaxed text-[#6B7280]">
                      A supervised machine learning model evaluates every transaction using engineered features and assigns a fraud probability with measurable confidence.
                    </p>
                    
                    {/* Unique Content: Dark Risk Card */}
                    <div className="mt-auto w-full rounded-xl bg-[#090D18] p-4 text-left shadow-lg mb-5 overflow-hidden relative">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="text-[10px] font-medium text-gray-400 mb-0.5">Risk Score</div>
                          <div className="text-[32px] font-extrabold text-[#E50914] leading-none">92%</div>
                          <div className="mt-2 inline-block rounded bg-[#E50914] px-1.5 py-0.5 text-[8px] font-extrabold text-white">HIGH RISK</div>
                        </div>
                        
                        {/* Radar Graphic */}
                        <div className="relative h-16 w-16">
                          <svg viewBox="0 0 100 100" className="w-full h-full opacity-80">
                            {/* Concentric rings */}
                            <circle cx="50" cy="50" r="10" fill="none" stroke="#E50914" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="20" fill="none" stroke="#E50914" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="30" fill="none" stroke="#E50914" strokeWidth="0.5" />
                            <circle cx="50" cy="50" r="40" fill="none" stroke="#E50914" strokeWidth="0.5" opacity="0.5" />
                            {/* Crosshairs */}
                            <line x1="10" y1="50" x2="90" y2="50" stroke="#E50914" strokeWidth="0.5" opacity="0.5" />
                            <line x1="50" y1="10" x2="50" y2="90" stroke="#E50914" strokeWidth="0.5" opacity="0.5" />
                            {/* Glowing dot */}
                            <circle cx="65" cy="35" r="3" fill="#E50914" />
                            <circle cx="65" cy="35" r="6" fill="#E50914" opacity="0.3" />
                          </svg>
                        </div>
                      </div>
                      
                      {/* Mini Table */}
                      <div className="mt-4">
                        <div className="grid grid-cols-4 gap-2 mb-1.5 border-b border-gray-800 pb-1">
                          <div className="col-span-2 text-[8px] font-medium text-gray-500">Transaction</div>
                          <div className="text-[8px] font-medium text-gray-500 text-right">Amount</div>
                          <div className="text-[8px] font-medium text-gray-500 text-right">Risk Score</div>
                        </div>
                        <div className="space-y-1.5">
                          <div className="grid grid-cols-4 gap-2 items-center">
                            <div className="col-span-2 text-[9px] font-bold text-white truncate">Amazon Pay</div>
                            <div className="text-[9px] font-medium text-gray-300 text-right">₹24,850</div>
                            <div className="text-[9px] font-bold text-[#E50914] text-right flex items-center justify-end gap-1">92% <div className="w-1.5 h-1.5 rounded-full bg-[#E50914]"></div></div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 items-center">
                            <div className="col-span-2 text-[9px] font-bold text-white truncate">XYZ Traders</div>
                            <div className="text-[9px] font-medium text-gray-300 text-right">₹18,300</div>
                            <div className="text-[9px] font-bold text-[#E50914] text-right flex items-center justify-end gap-1">78% <div className="w-1.5 h-1.5 rounded-full bg-[#E50914]"></div></div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 items-center">
                            <div className="col-span-2 text-[9px] font-bold text-white truncate">Fuel Station</div>
                            <div className="text-[9px] font-medium text-gray-300 text-right">₹2,150</div>
                            <div className="text-[9px] font-bold text-green-500 text-right flex items-center justify-end gap-1">12% <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div></div>
                          </div>
                          <div className="grid grid-cols-4 gap-2 items-center">
                            <div className="col-span-2 text-[9px] font-bold text-white truncate">Salary Credit</div>
                            <div className="text-[9px] font-medium text-gray-300 text-right">₹75,000</div>
                            <div className="text-[9px] font-bold text-green-500 text-right flex items-center justify-end gap-1">3% <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <ul className="w-full space-y-1.5 text-left pl-2">
                      {["Fraud Probability", "Risk Classification", "Pattern Recognition"].map((check, i) => (
                        <li key={i} className="flex items-center text-[11px] font-bold text-[#090D18]">
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-[#E50914] shrink-0" strokeWidth={2.5} /> {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden xl:flex items-center justify-center -mx-3 z-10 pt-12">
                   <ArrowRight className="text-red-200 h-6 w-6" strokeWidth={3} />
                </div>

                {/* STEP 04 */}
                <div className="relative flex-none w-[320px] xl:flex-1 rounded-xl border border-[#E8EBF0] bg-white p-6 shadow-sm flex flex-col">
                  <div className="flex items-start justify-between w-full mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E50914] text-[13px] font-extrabold text-white shadow-sm">
                      04
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF5F5] text-[#E50914] shrink-0">
                      <Sparkles className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="mb-2 text-[18px] font-extrabold text-[#090D18] leading-tight">Explainable AI<br/>Investigation</h3>
                    <p className="mb-6 text-[13px] font-medium leading-relaxed text-[#6B7280]">
                      Gemini analyzes high-risk transactions and explains why they were flagged, providing investigation summaries, confidence insights, and actionable recommendations.
                    </p>
                    
                    {/* Unique Content: Vertical Flow */}
                    <div className="w-full mt-auto mb-5 text-left">
                      <div className="relative border-l border-gray-200 ml-4 pl-5 space-y-4 py-1">
                        
                        <div className="relative">
                          <div className="absolute -left-[27px] top-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-white border-2 border-red-200 text-[#E50914]">
                            <ShieldCheck className="h-2 w-2" />
                          </div>
                          <div className="text-[11px] font-bold text-[#090D18]">Prediction</div>
                          <div className="text-[9px] font-medium text-[#6B7280]">Transaction flagged as High Risk</div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[27px] top-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-white border-2 border-red-200 text-[#E50914]">
                            <BarChart2 className="h-2 w-2" />
                          </div>
                          <div className="text-[11px] font-bold text-[#090D18]">Feature Importance</div>
                          <div className="text-[9px] font-medium text-[#6B7280]">Top factors contributing to risk</div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[27px] top-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-white border-2 border-red-200 text-[#E50914]">
                            <Sparkles className="h-2 w-2" />
                          </div>
                          <div className="text-[11px] font-bold text-[#090D18]">Gemini Explanation</div>
                          <div className="text-[9px] font-medium text-[#6B7280]">AI explains why it is suspicious</div>
                        </div>

                        <div className="relative">
                          <div className="absolute -left-[27px] top-0.5 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-white border-2 border-red-200 text-[#E50914]">
                            <Lightbulb className="h-2 w-2" />
                          </div>
                          <div className="text-[11px] font-bold text-[#090D18]">Recommendation</div>
                          <div className="text-[9px] font-medium text-[#6B7280]">Suggested next best actions</div>
                        </div>
                      </div>
                    </div>
                    
                    <ul className="w-full space-y-1.5 text-left pl-4">
                      {["AI Summary", "Explainable Predictions", "Smart Recommendations"].map((check, i) => (
                        <li key={i} className="flex items-center text-[11px] font-bold text-[#090D18]">
                          <CheckCircle2 className="mr-2 h-3.5 w-3.5 text-[#E50914] shrink-0" strokeWidth={2.5} /> {check}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Arrow */}
                <div className="hidden xl:flex items-center justify-center -mx-3 z-10 pt-12">
                   <ArrowRight className="text-red-200 h-6 w-6" strokeWidth={3} />
                </div>

                {/* STEP 05 */}
                <div className="relative flex-none w-[320px] xl:flex-1 rounded-xl border border-[#E8EBF0] bg-white p-6 shadow-sm flex flex-col">
                  <div className="flex items-start justify-between w-full mb-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E50914] text-[13px] font-extrabold text-white shadow-sm">
                      05
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF5F5] text-[#E50914] shrink-0">
                      <MonitorPlay className="h-6 w-6" strokeWidth={2} />
                    </div>
                    <h3 className="mb-2 text-[18px] font-extrabold text-[#090D18] leading-tight">Investigation<br/>Workspace</h3>
                    <p className="mb-6 text-[13px] font-medium leading-relaxed text-[#6B7280]">
                      Review suspicious transactions, explore analytics, ask questions through the AI Assistant, and generate investigation-ready reports—all from a single dashboard.
                    </p>
                    
                    {/* Unique Content: Mini Dashboard */}
                    <div className="mt-auto w-full rounded-xl border border-[#E8EBF0] bg-gray-50/50 p-3 shadow-sm mb-5">
                      {/* 4 Metric Cards */}
                      <div className="grid grid-cols-4 gap-1.5 mb-2">
                        <div className="rounded border border-[#E8EBF0] bg-white p-1 text-left">
                           <div className="text-[5px] text-gray-500 font-bold truncate">Overall Risk</div>
                           <div className="text-[10px] font-extrabold text-[#090D18]">82%</div>
                        </div>
                        <div className="rounded border border-[#E8EBF0] bg-white p-1 text-left">
                           <div className="text-[5px] text-gray-500 font-bold truncate">Active Cases</div>
                           <div className="text-[10px] font-extrabold text-[#090D18]">24</div>
                        </div>
                        <div className="rounded border border-[#E8EBF0] bg-white p-1 text-left">
                           <div className="text-[5px] text-gray-500 font-bold truncate">Alerts</div>
                           <div className="text-[10px] font-extrabold text-[#E50914]">7</div>
                        </div>
                        <div className="rounded border border-[#E8EBF0] bg-white p-1 text-left">
                           <div className="text-[5px] text-gray-500 font-bold truncate">At Risk</div>
                           <div className="text-[9px] font-extrabold text-[#090D18]">₹3.45M</div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mb-2">
                        {/* Charts Area */}
                        <div className="flex-1 rounded border border-[#E8EBF0] bg-white p-1.5">
                          <div className="flex justify-between w-full h-full gap-2">
                            <div className="flex-1 flex flex-col justify-end">
                              <div className="text-[5px] font-bold text-gray-400 mb-1">Risk Trend</div>
                              {/* Simple SVG Line */}
                              <svg viewBox="0 0 100 30" className="w-full h-5 overflow-visible">
                                <path d="M0,25 L20,15 L40,20 L60,5 L80,10 L100,0" fill="none" stroke="#E50914" strokeWidth="1.5" />
                              </svg>
                            </div>
                            <div className="flex-1 flex items-center justify-center">
                              {/* CSS Donut */}
                              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#E8EBF0]">
                                <div className="absolute inset-0 rounded-full" style={{ background: 'conic-gradient(#E50914 0% 40%, #F59E0B 40% 70%, #3B82F6 70% 100%)' }}></div>
                                <div className="absolute inset-[3px] bg-white rounded-full"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Chat Snippet */}
                        <div className="w-[85px] rounded border border-[#E8EBF0] bg-white p-1.5 flex flex-col">
                           <div className="text-[5px] font-bold text-[#090D18] mb-1">AI Assistant</div>
                           <div className="rounded bg-gray-100 p-1 text-[4px] text-gray-600 mb-0.5 ml-2">Why was this flagged?</div>
                           <div className="rounded bg-red-50 p-1 text-[4px] text-[#E50914] mr-2">Unusual amount & location mismatch.</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 2x2 Checklist */}
                    <div className="w-full grid grid-cols-2 gap-y-1.5 gap-x-2 text-left pl-2">
                      {["Dashboard & Analytics", "Reports", "AI Assistant", "Case Management"].map((check, i) => (
                        <div key={i} className="flex items-center text-[10px] font-bold text-[#090D18]">
                          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-[#E50914] shrink-0" strokeWidth={2} /> {check}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 relative">
          <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 md:px-12 lg:px-8">
            <div className="text-center mb-12">
              <div className="mx-auto mb-4 flex w-fit items-center text-xs font-extrabold uppercase tracking-widest text-[#E50914]">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                FAQ
              </div>
              <h2 className="mb-4 text-[32px] font-extrabold text-[#090D18] md:text-[40px]">
                Frequently Asked Questions
              </h2>
              <p className="mx-auto max-w-2xl text-[16px] font-medium text-[#6B7280]">
                Everything you need to know about FraudGuard AI
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
              <div className="w-full lg:w-[350px] shrink-0 sticky top-24">
                <div className="rounded-2xl bg-gradient-to-b from-[#FFF5F5] to-white border border-[#FEE2E2] p-8 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                  {/* Subtle dots background inside card */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#E50914 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
                  
                  <div className="relative w-32 h-32 mb-8 mt-4 z-10 flex items-center justify-center">
                    {/* Fake 3D Speech Bubbles */}
                    <div className="absolute top-2 right-0 w-14 h-14 rounded-full bg-red-100 shadow-sm flex items-center justify-center transform rotate-12">
                       <div className="flex gap-1">
                         <div className="w-1.5 h-1.5 rounded-full bg-red-300"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-red-300"></div>
                         <div className="w-1.5 h-1.5 rounded-full bg-red-300"></div>
                       </div>
                    </div>
                    <div className="absolute top-6 left-0 w-20 h-20 rounded-full bg-gradient-to-br from-[#FF4D4D] to-[#E50914] shadow-lg flex items-center justify-center z-10">
                       <span className="text-white text-4xl font-extrabold -mt-1">?</span>
                    </div>
                    {/* Small dot decoration */}
                    <div className="absolute bottom-4 left-0 w-2 h-2 rounded-full bg-[#E50914]"></div>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-[22px] font-extrabold text-[#090D18] mb-3">Got more questions?</h3>
                    <p className="text-[14px] text-[#6B7280] font-medium leading-relaxed mb-8">
                      Our team is here to help you understand how FraudGuard AI can transform your investigations.
                    </p>
                    <a href="mailto:support@fraudguard.ai" className="inline-flex w-full items-center justify-center rounded-[8px] border border-[#E50914] bg-white px-6 py-3 text-[14px] font-extrabold text-[#E50914] transition-colors hover:bg-red-50">
                      <Mail className="mr-2 h-4 w-4" />
                      Contact Support
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column (Accordion) */}
              <div className="w-full lg:flex-1 space-y-4">
                {faqs.map((faq) => {
                  const isOpen = openFaq === faq.id;
                  return (
                    <div 
                      key={faq.id} 
                      className="overflow-hidden rounded-xl border border-[#E8EBF0] bg-white shadow-sm transition-all duration-300 hover:border-red-200"
                    >
                      <button 
                        onClick={() => toggleFaq(faq.id)}
                        className="flex w-full items-center justify-between p-5 text-left md:px-6 md:py-5"
                      >
                        <div className="flex items-center gap-4">
                          {isOpen ? (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E50914] text-white">
                              <faq.icon className="h-4 w-4" strokeWidth={2.5} />
                            </div>
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-[#E50914]">
                              <faq.icon className="h-4 w-4" strokeWidth={2} />
                            </div>
                          )}
                          <span className="text-[15px] font-extrabold text-[#090D18]">{faq.question}</span>
                        </div>
                        {isOpen ? (
                           <ChevronDown className="h-5 w-5 shrink-0 text-[#E50914] rotate-180 transition-transform duration-300" />
                        ) : (
                           <ChevronDown className="h-5 w-5 shrink-0 text-[#090D18] transition-transform duration-300" />
                        )}
                      </button>
                      
                      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                        <p className="pb-5 pl-[76px] pr-6 text-[14px] font-medium leading-relaxed text-[#6B7280]">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="py-12 mb-8">
          <div className="mx-auto w-full max-w-[1200px] px-6 md:px-12 lg:px-8">
            <div className="relative flex flex-col items-center justify-between gap-8 overflow-hidden rounded-[24px] bg-gradient-to-r from-[#FEF2F2] via-[#FFF5F5] to-white p-8 md:flex-row lg:px-12 lg:py-10 border border-red-50 shadow-sm">
              
              {/* Left Graphic */}
              <div className="relative flex h-28 w-28 shrink-0 items-center justify-center lg:mr-2">
                {/* 3D Base */}
                <div className="absolute bottom-2 h-10 w-28 rounded-[100%] bg-white shadow-lg md:w-32"></div>
                <div className="absolute bottom-4 h-8 w-24 rounded-[100%] bg-gray-50 md:w-28 border border-gray-100"></div>
                
                {/* Floating Shield */}
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-[#E50914] shadow-xl transform -translate-y-2">
                  <ShieldCheck className="h-8 w-8 text-white" strokeWidth={2.5} />
                </div>
                
                {/* Floating dots */}
                <div className="absolute top-2 left-2 h-2 w-2 rounded-full bg-[#E50914] opacity-60"></div>
                <div className="absolute bottom-6 right-0 h-2 w-2 rounded-full bg-[#E50914] opacity-40"></div>
              </div>

              {/* Center Content */}
              <div className="flex-grow text-center md:text-left">
                <h2 className="mb-2 text-[26px] font-extrabold leading-tight text-[#090D18] md:text-[30px] lg:text-[32px]">
                  Ready to simplify your <span className="text-[#E50914]">fraud investigations?</span>
                </h2>
                <p className="mx-auto max-w-[600px] text-[14px] font-medium text-[#6B7280] md:mx-0">
                  Join hundreds of investigators and compliance teams who trust FraudGuard AI to detect, explain, and investigate financial fraud.
                </p>
              </div>

              {/* Right Buttons */}
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:gap-4 z-10 mt-4 md:mt-0">
                <Link to="/dashboard" className="inline-flex h-[48px] items-center justify-center rounded-[8px] bg-[#E50914] px-6 text-[14px] font-extrabold text-white shadow-md transition-all hover:bg-red-700">
                  Start Free Trial <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2.5} />
                </Link>
                <button className="inline-flex h-[48px] items-center justify-center rounded-[8px] border border-[#E50914] bg-white px-6 text-[14px] font-extrabold text-[#E50914] transition-all hover:bg-red-50">
                  Book a Demo <Calendar className="ml-2 h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
