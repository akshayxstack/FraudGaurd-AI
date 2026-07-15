import { ReactNode } from "react";
import { Search, Bell, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ title, subtitle, searchPlaceholder }: { title: ReactNode, subtitle?: string, searchPlaceholder?: string }) {
  const navigate = useNavigate();

  return (
    <header className="h-[76px] bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40 w-full shadow-sm">
      {/* Left */}
      <div>
        <h1 className="text-[22px] font-extrabold text-[#090D18]">{title}</h1>
        {subtitle && <p className="text-[13px] text-gray-500 font-medium">{subtitle}</p>}
      </div>

      {/* Right */}
      <div className="flex items-center gap-6">
        <div className="relative w-[340px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder={searchPlaceholder || "Search cases, transactions, users..."} 
            className="w-full h-10 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-[13px] font-medium focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
          />
        </div>
        
        <button className="relative p-2.5 text-gray-500 hover:text-[#090D18] transition-colors rounded-full hover:bg-gray-100">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#E50914] rounded-full border-2 border-white text-[9px] font-bold text-white flex items-center justify-center">3</span>
        </button>
        
        <button 
          onClick={() => navigate("/upload")}
          className="h-10 px-5 bg-[#E50914] hover:bg-red-700 text-white text-[13px] font-bold rounded-lg flex items-center gap-2 transition-colors shadow-md shadow-red-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" strokeWidth={3} />
          New Case
        </button>
      </div>
    </header>
  );
}
