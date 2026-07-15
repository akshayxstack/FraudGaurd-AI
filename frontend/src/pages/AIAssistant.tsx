import { useCallback, useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Bot, RefreshCw, Paperclip, Send,
  ShieldAlert, Activity, FileText, Search,
  Briefcase, CheckCircle2,
  Sparkles, User, TrendingUp, IndianRupee,
  BarChart2, Hand, Trash2
} from "lucide-react";
import { assistantAPI, type AssistantSidebarData } from "../api/assistant";
import { useDashboardMetrics } from "@/hooks/dashboard/useDashboardMetrics";
import { useAuth } from "@/context/AuthContext";

type ChatMessage = {
  sender: "assistant" | "user";
  text: string;
  time: string;
  avatar?: string;
  isError?: boolean;
};

export default function AIAssistant() {
  const location = useLocation();
  const { user, userInitials } = useAuth();
  const hasTriggeredInit = useRef(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem("fraud_guard_ai_chats");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        localStorage.removeItem("fraud_guard_ai_chats");
      }
    }
    return [{
      sender: "assistant",
      text: "Hi! I'm your FraudGuard AI Assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }];
  });
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarData, setSidebarData] = useState<AssistantSidebarData | null>(null);
  const [sidebarLoading, setSidebarLoading] = useState(true);
  const [sidebarError, setSidebarError] = useState<string | null>(null);
  const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics(15000);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const commonCardClasses = "bg-white rounded-3xl border border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]";
  const sessionId = "ai-assistant-global";

  const fetchSidebarData = useCallback(async () => {
    try {
      const data = await assistantAPI.getSidebarData();
      setSidebarData(data);
      setSidebarError(null);
    } catch (error) {
      setSidebarError("Assistant sidebar data is unavailable.");
    } finally {
      setSidebarLoading(false);
    }
  }, []);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("fraud_guard_ai_chats", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    fetchSidebarData();
  }, [fetchSidebarData]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages: ChatMessage[] = [
      ...messages,
      {
        sender: "user",
        text: query,
        time: userTime,
        avatar: userInitials
      }
    ];
    setMessages(newMessages);
    if (!textToSend) setChatInput("");
    setIsTyping(true);

    try {
      const response = await assistantAPI.askQuestion(query, { sessionId });
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      setMessages(prev => [
        ...prev,
        {
          sender: "assistant",
          text: response.answer,
          time: aiTime
        }
      ]);
      
      // Update sidebar insights/history in real-time
      fetchSidebarData();
    } catch (error) {
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [
        ...prev,
        {
          sender: "assistant",
          text: "AI Assistant is temporarily unavailable. Please try again later.",
          time: aiTime,
          isError: true,
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Trigger initial prompt from navigation state if present
  useEffect(() => {
    if (location.state?.initialPrompt && !hasTriggeredInit.current) {
      hasTriggeredInit.current = true;
      handleSendMessage(location.state.initialPrompt);
    }
  }, [location.state]);

  const formatConversationTime = (timestamp: string) =>
    new Date(timestamp).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const insightStats = [
    {
      label: "High Risk Cases Detected",
      value: sidebarData?.insights.highRiskCases ?? 0,
      icon: ShieldAlert,
      colorClass: "text-[#DC2626]",
      bgClass: "bg-red-50",
      borderClass: "border-red-100",
    },
    {
      label: "Anomalies Found",
      value: sidebarData?.insights.anomalousTransactions ?? 0,
      icon: TrendingUp,
      colorClass: "text-purple-600",
      bgClass: "bg-purple-50",
      borderClass: "border-purple-100",
    },
    {
      label: "Queries Answered",
      value: sidebarData?.insights.queriesAnswered ?? 0,
      icon: Search,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      borderClass: "border-blue-100",
    },
  ];

  const contextOverview = {
    totalCases: metricsData?.totalCases ?? 0,
    activeCases: metricsData?.activeCases.value ?? 0,
    highRiskCases: metricsData?.highRiskCases ?? 0,
    amountAtRisk: metricsData?.amountAtRisk.value ?? "₹0",
  };
  const firstName = user?.fullName?.split(" ")[0] || "Investigator";

  return (
    <AppLayout 
      title={<span className="flex items-center gap-2 font-heading font-bold">AI Assistant <Sparkles className="w-5 h-5 text-purple-500" /></span>}
      subtitle="Your intelligent partner for faster, smarter investigations."
      searchPlaceholder="Ask anything about cases, patterns, risks..."
    >
      <div className="flex flex-col gap-5 w-full min-w-0 h-auto max-h-none overflow-visible pb-10">
        
        {/* TOP SECTION: Welcome & Insights */}
        <div className="grid grid-cols-12 gap-5 shrink-0 w-full">
          
          {/* Welcome/Greeting Card (Wider) */}
          <div className={`col-span-12 lg:col-span-8 p-5 flex items-center gap-5 ${commonCardClasses}`}>
            <div className="w-20 h-20 shrink-0 rounded-full bg-white flex items-center justify-center relative overflow-hidden border border-gray-100 shadow-sm">
              <img src="/robot-avatar.png" alt="AI Assistant" className="w-full h-full object-cover" />
              {/* Decorative Sparkles */}
              <Sparkles className="absolute top-1 left-1 w-3 h-3 text-purple-400 opacity-70" />
              <Sparkles className="absolute bottom-1 right-1 w-4 h-4 text-amber-400 opacity-70" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <h2 className="text-[18px] font-heading font-extrabold text-[#090D18]">
                  Hello, {firstName}!
                </h2>
                <Hand className="w-5 h-5 text-amber-400 animate-bounce" />
              </div>
              <p className="text-[12px] text-gray-500 font-sans font-medium leading-relaxed mb-3.5 max-w-xl">
                I'm your AI Assistant. I can help you analyze cases, detect risks, find patterns, and answer any questions about your data.
              </p>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2.5">
                <button 
                  onClick={() => handleSendMessage("Summarize my cases")}
                  className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-colors border border-purple-100/50 cursor-pointer"
                >
                  <BarChart2 className="w-3.5 h-3.5" /> Summarize Cases
                </button>
                <button 
                  onClick={() => handleSendMessage("Analyze Case Trends")}
                  className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-[#DC2626] rounded-lg text-[11px] font-bold flex items-center gap-2 transition-colors border border-red-100/50 cursor-pointer"
                >
                  <ShieldAlert className="w-3.5 h-3.5" /> Analyze Case Trends
                </button>
                <button 
                  onClick={() => handleSendMessage("Risk Distribution")}
                  className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-colors border border-blue-100/50 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5" /> Risk Distribution
                </button>
                <button 
                  onClick={() => handleSendMessage("Draft an investigation report from my current case data")}
                  className="px-3.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg text-[11px] font-bold flex items-center gap-2 transition-colors border border-green-100/50 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5" /> Draft Reports
                </button>
              </div>
            </div>
          </div>
 
          {/* Insights Card (Narrower) */}
          <div className={`col-span-12 lg:col-span-4 p-5 flex flex-col justify-between ${commonCardClasses}`}>
            <h3 className="text-[13px] font-heading font-extrabold text-[#090D18]">
              Assistant Insights ({sidebarData?.insights.windowLabel || "Last 7 days"})
            </h3>
            
            <div className="grid grid-cols-3 gap-3 mt-3">
              {insightStats.map((item) => (
                <div key={item.label} className="flex flex-col gap-1.5">
                  <div className={`w-7 h-7 rounded-full ${item.bgClass} ${item.colorClass} flex items-center justify-center border ${item.borderClass}`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[18px] font-heading font-extrabold text-[#090D18]">
                    {sidebarLoading ? "..." : item.value}
                  </div>
                  <div className="text-[10px] font-sans font-medium text-gray-500 leading-tight">{item.label}</div>
                </div>
              ))}
            </div>
            {sidebarError && <div className="mt-2 text-[10px] font-sans font-medium text-red-500">{sidebarError}</div>}
          </div>
        </div>
        
        {/* MAIN WORKSPACE: 2 Columns */}
        <div className="grid grid-cols-12 gap-5 w-full min-w-0 flex-1 h-auto">
          
          {/* Chat Column (Widest: ~65%) */}
          <div className={`col-span-12 lg:col-span-8 flex flex-col min-w-0 p-5 h-[800px] lg:h-[calc(100vh-170px)] overflow-hidden ${commonCardClasses}`}>
             
             {/* Messages Area */}
             <div className="flex flex-col gap-6 w-full pb-4 flex-1 h-full overflow-y-auto overflow-x-hidden scrollbar-hide">
                
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    {msg.sender === "user" ? (
                      /* User Message */
                      <div className="flex items-start justify-end gap-3.5 w-full min-w-0 mb-4">
                        <div className="flex flex-col items-end gap-1.5 max-w-[80%] min-w-0">
                          <div className="bg-red-50 text-[#DC2626] px-5 py-3.5 rounded-2xl rounded-tr-sm text-[13px] font-sans font-medium break-words">
                            {msg.text}
                          </div>
                          <span className="text-[10px] font-sans font-medium text-gray-400 mr-1">{msg.time}</span>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-[#DC2626] text-white flex items-center justify-center text-[11px] font-heading font-extrabold shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-red-200 shrink-0">
                          {msg.avatar}
                        </div>
                      </div>
                    ) : (
                      /* Assistant Message */
                      <div className="flex items-start gap-3.5 w-full min-w-0 max-w-full overflow-hidden mb-4">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-red-50 flex items-center justify-center border border-red-100 mt-1 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
                          <ShieldAlert className="w-4 h-4 text-[#DC2626]" />
                        </div>
                        
                        <div className="flex flex-col gap-3.5 flex-1 min-w-0 max-w-full overflow-hidden">
                          <div className="flex flex-col gap-1 w-full min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-heading font-extrabold text-[#090D18]">FraudGuard AI</span>
                              <span className="text-[10px] font-sans font-medium text-gray-400">{msg.time}</span>
                            </div>
                            <div className={`text-[13px] font-sans font-medium leading-relaxed break-words mt-1 whitespace-pre-line ${msg.isError ? "text-red-600" : "text-gray-600"}`}>
                              {msg.text}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Typing animation bubble */}
                {isTyping && (
                  <div className="flex items-start gap-3.5 w-full min-w-0">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-red-50 flex items-center justify-center border border-red-100 mt-1 shadow-sm animate-pulse">
                      <Bot className="w-4 h-4 text-[#DC2626]" strokeWidth={2.5} />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-heading font-extrabold text-[#090D18]">FraudGuard AI</span>
                      </div>
                      <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm max-w-[80px] mt-1 shadow-sm">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Anchor for scroll */}
                <div ref={messagesEndRef} />
             </div>
             
             {/* Chat Input Container */}
             <div className="bg-white pt-3 w-full flex flex-col gap-4 border-t border-gray-100 mt-4 sticky bottom-0 z-20">
               
               {/* Input Pill */}
               <div className="relative flex items-center w-full bg-white rounded-full border border-gray-200 focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all p-1.5 pl-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]">
                 <div className="flex items-center gap-2 shrink-0 mr-3">
                   <Sparkles className="w-4 h-4 text-purple-500 animate-pulse" />
                   <button 
                     onClick={() => {
                       if (window.confirm("Clear all chat messages?")) {
                         const initial: ChatMessage[] = [{
                           sender: "assistant",
                           text: "Hi! I'm your FraudGuard AI Assistant. How can I help you today?",
                           time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                         }];
                         setMessages(initial);
                         localStorage.setItem("fraud_guard_ai_chats", JSON.stringify(initial));
                       }
                     }}
                     title="Clear Chat History"
                     className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-red-500 flex items-center justify-center"
                   >
                     <Trash2 className="w-3.5 h-3.5" />
                   </button>
                 </div>
                 <input
                   type="text"
                   value={chatInput}
                   onChange={(e) => setChatInput(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === "Enter") handleSendMessage();
                   }}
                   placeholder="Ask anything about your cases, transactions, risks..."
                   className="flex-grow bg-transparent border-none outline-none text-[13px] font-sans font-medium text-[#090D18] placeholder:text-gray-400 py-2 min-w-0"
                 />
                 <div className="flex items-center gap-2 shrink-0 ml-2">
                   <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100/50 cursor-pointer">
                     <Paperclip className="w-5 h-5" />
                   </button>
                   <button 
                     onClick={() => handleSendMessage()}
                     className={`p-2.5 rounded-full transition-all flex items-center justify-center cursor-pointer ${chatInput.length > 0 ? 'bg-[#DC2626] text-white shadow-md shadow-red-500/20' : 'bg-red-400 text-white'}`}
                   >
                     <Send className="w-4 h-4 translate-x-[1px] translate-y-[1px]" />
                   </button>
                 </div>
               </div>

               {/* Prompt Chips */}
               <div className="flex flex-wrap gap-2.5 px-1">
                 <button 
                   onClick={() => handleSendMessage("Show me high risk cases from the last 7 days")}
                   className="whitespace-nowrap px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
                 >
                   <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626]" /> Show me high risk cases from the last 7 days
                 </button>
                 <button 
                   onClick={() => handleSendMessage("Analyze Case Trends")}
                   className="whitespace-nowrap px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
                 >
                   <TrendingUp className="w-3.5 h-3.5 text-orange-500" /> Analyze Case Trends
                 </button>
                 <button 
                   onClick={() => handleSendMessage("Risk Distribution")}
                   className="whitespace-nowrap px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
                 >
                   <Activity className="w-3.5 h-3.5 text-blue-500" /> Risk Distribution
                 </button>
                 <button 
                   onClick={() => handleSendMessage("Top Risky Customers")}
                   className="whitespace-nowrap px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
                 >
                   <User className="w-3.5 h-3.5 text-green-500" /> Top Risky Customers
                 </button>
                 <button 
                   onClick={() => handleSendMessage("Unusual Activity")}
                   className="whitespace-nowrap px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
                 >
                   <FileText className="w-3.5 h-3.5 text-purple-500" /> Unusual Activity
                 </button>
                 <button 
                   onClick={() => handleSendMessage("Compare Time Periods")}
                   className="whitespace-nowrap px-3.5 py-1.5 bg-white hover:bg-gray-50 text-gray-600 rounded-lg text-[11px] font-sans font-medium flex items-center gap-1.5 transition-colors border border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] cursor-pointer"
                 >
                   <BarChart2 className="w-3.5 h-3.5 text-purple-500" /> Compare Time Periods
                 </button>
               </div>

             </div>
          </div>

          {/* Right Sidebar (~35%) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 min-w-0 h-[800px] lg:h-[calc(100vh-170px)] pb-2">
             
             {/* Card 1: What I Can Do */}
             <div className={`p-4 ${commonCardClasses}`}>
               <h3 className="text-[12px] font-heading font-extrabold text-[#090D18] mb-3">What I Can Do</h3>
               <div className="space-y-2.5">
                 <div className="flex items-center gap-2.5">
                   <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                   <span className="text-[11.5px] font-sans font-medium text-gray-600">Analyze cases & transactions</span>
                 </div>
                 <div className="flex items-center gap-2.5">
                   <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                   <span className="text-[11.5px] font-sans font-medium text-gray-600">Detect risks & anomalies</span>
                 </div>
                 <div className="flex items-center gap-2.5">
                   <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                   <span className="text-[11.5px] font-sans font-medium text-gray-600">Find patterns & trends</span>
                 </div>
                 <div className="flex items-center gap-2.5">
                   <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                   <span className="text-[11.5px] font-sans font-medium text-gray-600">Generate summaries</span>
                 </div>
                 <div className="flex items-center gap-2.5">
                   <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                   <span className="text-[11.5px] font-sans font-medium text-gray-600">Draft investigation notes</span>
                 </div>
                 <div className="flex items-center gap-2.5">
                   <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                   <span className="text-[11.5px] font-sans font-medium text-gray-600">Answer questions</span>
                 </div>
               </div>
             </div>

             {/* Card 2: Context Overview */}
             <div className={`p-4 ${commonCardClasses}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-heading font-extrabold text-[#090D18]">Context Overview</h3>
                  <button
                    onClick={fetchSidebarData}
                    className="text-gray-400 hover:text-[#DC2626] transition-colors p-0.5"
                    aria-label="Refresh assistant context"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
                {metricsError && (
                  <div className="mb-2 text-[10px] font-sans font-medium text-red-500">
                    Dashboard context is unavailable.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-2.5 text-[11px]">
                  <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="text-gray-500 font-sans font-medium truncate">Total Cases</span>
                    </div>
                    <span className="font-heading font-bold text-[#090D18] ml-1">
                      {metricsLoading ? "..." : contextOverview.totalCases}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <Activity className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="text-gray-500 font-sans font-medium truncate">Active Cases</span>
                    </div>
                    <span className="font-heading font-bold text-[#090D18] ml-1">
                      {metricsLoading ? "..." : contextOverview.activeCases}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <ShieldAlert className="w-3.5 h-3.5 text-[#DC2626] shrink-0" />
                      <span className="text-gray-500 font-sans font-medium truncate">High Risk</span>
                    </div>
                    <span className="font-heading font-bold text-[#090D18] ml-1">
                      {metricsLoading ? "..." : contextOverview.highRiskCases}
                    </span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50/50 p-2.5 rounded-xl border border-gray-100/50">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <IndianRupee className="w-3.5 h-3.5 text-green-500 shrink-0" />
                      <span className="text-gray-500 font-sans font-medium truncate">At Risk</span>
                    </div>
                    <span className="font-heading font-bold text-[#090D18] ml-1">
                      {metricsLoading ? "..." : contextOverview.amountAtRisk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 3: Recent Conversations */}
              <div className={`p-4 flex-1 flex flex-col min-h-0 ${commonCardClasses}`}>
                <div className="flex items-center justify-between mb-3 shrink-0">
                  <h3 className="text-[12px] font-heading font-extrabold text-[#090D18]">Recent Conversations</h3>
                  <button
                    onClick={fetchSidebarData}
                    className="text-[10.5px] font-heading font-bold text-[#DC2626] hover:underline"
                  >
                    Refresh
                  </button>
                </div>
                <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1 scrollbar-thin">
                  {sidebarLoading ? (
                    <div className="text-[11px] font-sans font-medium text-gray-400 text-center mt-10">
                      Loading conversations...
                    </div>
                  ) : sidebarData?.recentConversations.length ? (
                    sidebarData.recentConversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => handleSendMessage(conversation.question)}
                        className="text-left rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 p-3 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="text-[11px] font-heading font-bold text-[#090D18] truncate">
                            {conversation.caseId || "Global Assistant"}
                          </span>
                          <span className="text-[9.5px] font-sans font-medium text-gray-400 shrink-0">
                            {formatConversationTime(conversation.timestamp)}
                          </span>
                        </div>
                        <div className="text-[11px] font-sans font-semibold text-gray-600 line-clamp-2">
                          {conversation.question}
                        </div>
                        <div className="text-[10.5px] font-sans font-medium text-gray-400 line-clamp-2 mt-1">
                          {conversation.answer}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="text-[11px] font-sans font-medium text-gray-400 text-center mt-10">
                      No recent conversations
                    </div>
                  )}
                </div>
              </div>
             
          </div>

        </div>

      </div>
    </AppLayout>
  );
}
