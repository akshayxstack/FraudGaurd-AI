import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, Briefcase, CloudUpload, BarChart2, Sparkles, 
  ChevronRight, Shield, LogOut
} from "lucide-react";
import { LogoIcon } from "@/components/ui/LogoIcon";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, userInitials, logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/cases", label: "Cases", icon: Briefcase },
    { path: "/upload", label: "Upload", icon: CloudUpload },
    { path: "/analytics", label: "Analytics", icon: BarChart2 },
    { path: "/ai-assistant", label: "AI Assistant", icon: Sparkles },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <aside className="w-[260px] h-screen bg-[#090D18] flex flex-col fixed left-0 top-0 border-r border-gray-800 z-50 overflow-y-auto scrollbar-hide shrink-0">
      {/* Top Logo */}
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2 mb-1">
          <LogoIcon className="w-8 h-8 text-[#E50914]" />
          <span className="text-[20px] font-extrabold text-white tracking-tight">
            FraudGuard <span className="text-[#E50914]">AI</span>
          </span>
        </Link>
        <p className="text-[11px] font-semibold text-gray-400 pl-1 mt-1">Intelligent Investigation Platform</p>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-4 mt-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[13.5px] font-bold transition-colors relative group
                ${isActive ? 'bg-[#E50914] text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              {isActive && (
                <div className="absolute left-[-16px] top-[15%] bottom-[15%] w-1 bg-[#E50914] rounded-r-md"></div>
              )}
              <item.icon className="w-[18px] h-[18px]" strokeWidth={2.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Security Card */}
      <div className="px-4 mb-4 mt-6">
        <div className="bg-white/5 border border-white/10 rounded-[14px] p-5 flex flex-col items-start relative overflow-hidden">
           <div className="w-9 h-9 rounded-xl bg-[#E50914]/20 border border-[#E50914]/30 flex items-center justify-center text-[#E50914] mb-4">
             <Shield className="w-[18px] h-[18px]" strokeWidth={2.5} />
           </div>
           <h4 className="text-white text-[13px] font-bold leading-[1.3] mb-1.5">Your investigations, secured end-to-end.</h4>
           <p className="text-gray-400 text-[11px] font-medium leading-relaxed mb-4">Enterprise-grade security for complete peace of mind.</p>
           <Link to="#" className="text-[#E50914] text-[12px] font-bold flex items-center gap-1 hover:underline transition-all">
             Learn more <ChevronRight className="w-3.5 h-3.5" />
           </Link>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10 mb-2">
        <div className="flex items-center gap-3 group px-2 py-1 rounded-xl hover:bg-white/5 transition-colors">
          <div className="w-10 h-10 rounded-full bg-[#E50914] flex items-center justify-center text-white text-[13px] font-extrabold shadow-md shrink-0 border border-white/10">
            {userInitials}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white text-[13px] font-bold truncate">{user?.fullName || "Investigator"}</h4>
            <p className="text-gray-400 text-[11px] font-medium truncate mt-0.5">{user?.role || "Analyst"}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            title="Log out"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
