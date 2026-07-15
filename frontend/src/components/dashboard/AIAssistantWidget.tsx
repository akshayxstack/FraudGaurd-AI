import { Sparkles, Send, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AIAssistantWidget() {
  const navigate = useNavigate();

  const handleNavigate = (prompt?: string) => {
    navigate("/ai-assistant", { state: { initialPrompt: prompt } });
  };

  return (
    <div className="col-span-4 bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-gray-200/50 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden h-full group">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#E50914] group-hover:scale-110 transition-transform duration-300" />
          <h3 className="text-[14px] font-heading font-extrabold text-[#090D18]">AI Assistant</h3>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 px-2 py-1 rounded-full border border-green-100">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
          <span className="text-[9px] font-bold text-green-700 uppercase tracking-wide">Online</span>
        </div>
      </div>

      <div className="flex-1 p-5 relative flex min-h-0 flex-col bg-white">
        <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: 'radial-gradient(#E50914 1px, transparent 1px)', backgroundSize: '24px 24px', backgroundPosition: '-12px -12px' }}></div>

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          {/* Main content: Bot avatar + Welcome message */}
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-4">
            <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#E50914] flex items-center justify-center border border-red-100 shadow-sm animate-pulse">
              <Bot className="w-7 h-7" strokeWidth={2} />
            </div>
            <div className="flex flex-col gap-1.5 max-w-[240px]">
              <h4 className="text-[14px] font-heading font-extrabold text-[#090D18]">
                How can I help you?
              </h4>
              <p className="text-[11px] text-gray-500 font-sans font-medium leading-relaxed">
                Ask me anything about your cases, transaction risks, or fraud patterns.
              </p>
            </div>
          </div>

          <div className="mt-auto pt-4 relative z-10 w-full">
            {/* Suggested Prompt Chips */}
            <div className="flex gap-2 mb-3 px-1 overflow-x-auto pb-1 shrink-0" style={{ scrollbarWidth: 'none' }}>
              <button 
                onClick={() => handleNavigate("Show risk distribution")}
                className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-[10px] font-bold hover:border-[#E50914] hover:text-[#E50914] transition-colors whitespace-nowrap shadow-sm cursor-pointer"
              >
                Risk Distribution
              </button>
              <button 
                onClick={() => handleNavigate("Who are the top risky customers?")}
                className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-[10px] font-bold hover:border-[#E50914] hover:text-[#E50914] transition-colors whitespace-nowrap shadow-sm cursor-pointer"
              >
                Top Risky Customers
              </button>
              <button 
                onClick={() => handleNavigate("Show me recently flagged users")}
                className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-gray-600 text-[10px] font-bold hover:border-[#E50914] hover:text-[#E50914] transition-colors whitespace-nowrap shadow-sm cursor-pointer"
              >
                Flagged Users
              </button>
            </div>

            {/* Simulated input box routing to AI Assistant */}
            <div className="relative shrink-0 cursor-pointer" onClick={() => handleNavigate()}>
              <input 
                type="text" 
                readOnly
                placeholder="Ask a question..." 
                className="w-full h-10 pl-4 pr-10 bg-white border border-gray-200 rounded-xl text-[12px] font-medium shadow-sm hover:border-gray-300 transition-colors cursor-pointer"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 bg-[#E50914] hover:bg-red-700 text-white rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer">
                <Send className="w-3.5 h-3.5 ml-[-1px]" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}