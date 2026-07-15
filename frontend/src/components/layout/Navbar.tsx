import { Link, useLocation } from "react-router-dom";
import { LogoIcon } from "@/components/ui/LogoIcon";

export default function Navbar() {
  const location = useLocation();
  const isFeaturesActive = location.pathname === "/features";
  const isHowItWorksActive = location.pathname === "/how-it-works";

  return (
    <nav className="flex h-[76px] w-full items-center border-b border-[#E8EBF0] bg-white">
      <div className="mx-auto flex w-full max-w-[1432px] items-center justify-between px-6 md:px-12 lg:px-[58px]">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <LogoIcon className="h-8 w-8" />
          <span className="text-[23px] font-extrabold tracking-normal text-[#090D18]">
            FraudGuard <span className="text-[#E50914]">AI</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-[48px] md:flex h-full">
          <Link to="/" className="text-[14px] font-semibold text-[#090D18] transition-colors hover:text-[#E50914]">Product</Link>
          <Link 
            to="/features" 
            className={`relative text-[14px] font-semibold transition-colors hover:text-[#E50914] ${isFeaturesActive ? "text-[#E50914]" : "text-[#090D18]"}`}
          >
            Features
            {isFeaturesActive && (
              <span className="absolute -bottom-[28px] left-0 right-0 h-[2px] bg-[#E50914] rounded-t-full"></span>
            )}
          </Link>
          <Link 
            to="/how-it-works" 
            className={`relative text-[14px] font-semibold transition-colors hover:text-[#E50914] ${isHowItWorksActive ? "text-[#E50914]" : "text-[#090D18]"}`}
          >
            How it Works
            {isHowItWorksActive && (
              <span className="absolute -bottom-[28px] left-0 right-0 h-[2px] bg-[#E50914] rounded-t-full"></span>
            )}
          </Link>
        </nav>
        <div className="flex items-center gap-8">
          <Link to="/login" className="hidden text-[14px] font-bold text-[#090D18] transition-colors hover:text-[#E50914] md:inline-flex">
            Log in
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex h-11 items-center justify-center rounded-[7px] bg-[#E50914] px-7 py-2 text-[15px] font-bold text-white shadow-[0_8px_18px_rgba(229,9,20,0.18)] transition-colors hover:bg-red-700"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
