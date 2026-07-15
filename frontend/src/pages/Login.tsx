import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, BrainCircuit, BarChart2, MessageSquare, 
  Eye, EyeOff, Mail, Lock, User, UserPlus, Shield, ArrowRight, Check
} from 'lucide-react';
import { LogoIcon } from "@/components/ui/LogoIcon";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, login, register } = useAuth();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [from, isAuthenticated, navigate]);

  const getErrorMessage = (error: unknown) => {
    const maybeAxiosError = error as { response?: { data?: { message?: string } }; message?: string };
    return maybeAxiosError.response?.data?.message || maybeAxiosError.message || 'Authentication failed. Please try again.';
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (activeTab === 'register' && password !== confirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (activeTab === 'login') {
        await login({ email, password });
      } else {
        await register({ fullName, email, password });
      }
      navigate(from, { replace: true });
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row relative overflow-hidden font-sans bg-[#FEF2F2]">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.4]">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#E50914 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.2 }}></div>
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 1000" fill="none">
          <circle cx="300" cy="400" r="300" stroke="#E50914" strokeWidth="0.75" strokeDasharray="4 4" />
          <circle cx="300" cy="400" r="500" stroke="#E50914" strokeWidth="0.5" />
          <path d="M-200 800 C 400 200, 1000 200, 1600 800" stroke="#E50914" strokeWidth="1" strokeDasharray="6 6" />
          <circle cx="80%" cy="20%" r="4" fill="#E50914" />
          <circle cx="90%" cy="80%" r="3" fill="#E50914" opacity="0.6" />
          <circle cx="10%" cy="85%" r="5" fill="#E50914" opacity="0.8" />
        </svg>
      </div>

      {/* Left Column - Marketing Panel */}
      <div className="hidden lg:flex w-[55%] flex-col justify-between p-10 xl:p-14 relative z-10 h-screen overflow-y-auto scrollbar-hide">
        
        {/* Top Logo */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2 mb-1">
            <LogoIcon className="h-8 w-8" />
            <span className="text-[22px] font-extrabold text-[#090D18] tracking-tight">FraudGuard <span className="text-[#E50914]">AI</span></span>
          </Link>
          <p className="text-[12px] font-bold text-gray-500">Intelligent Financial Investigation Platform</p>
        </div>

        {/* Hero Text */}
        <div className="mt-8">
          <h1 className="text-[40px] xl:text-[46px] leading-[1.15] font-extrabold tracking-tight mb-4">
            <span className="text-[#090D18]">Investigate Smarter.</span><br/>
            <span className="text-[#E50914]">Decide with Confidence.</span>
          </h1>
          <p className="text-[15px] text-gray-600 font-medium max-w-[500px] leading-relaxed">
            FraudGuard AI combines the power of Machine Learning and Explainable AI to help you detect, understand, and investigate financial fraud—faster.
          </p>
        </div>

        {/* 3D Graphic Area */}
        <div className="relative flex-1 flex items-center justify-center min-h-[360px] my-6 max-w-[650px] self-center w-full">
          {/* Connector Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 600 360">
            {/* TL to center */}
            <path d="M 120 80 C 200 80, 200 180, 300 180" fill="none" stroke="#FCA5A5" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* TR to center */}
            <path d="M 480 80 C 400 80, 400 180, 300 180" fill="none" stroke="#FCA5A5" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* BL to center */}
            <path d="M 120 280 C 200 280, 200 180, 300 180" fill="none" stroke="#FCA5A5" strokeWidth="1.5" strokeDasharray="4 4" />
            {/* BR to center */}
            <path d="M 480 280 C 400 280, 400 180, 300 180" fill="none" stroke="#FCA5A5" strokeWidth="1.5" strokeDasharray="4 4" />
          </svg>

          {/* Top Left Stat */}
          <div className="absolute top-[5%] left-[0%] bg-white p-4 rounded-xl shadow-[0_8px_20px_rgb(0,0,0,0.06)] border border-[#FEE2E2] w-[130px] z-20">
            <div className="text-[9px] text-gray-500 font-extrabold mb-0.5 uppercase tracking-wide">Risk Score</div>
            <div className="text-[24px] text-[#E50914] font-extrabold leading-none mb-1">92%</div>
            <div className="text-[10px] text-[#E50914] font-bold mb-2">High Risk</div>
            <svg className="w-full h-6" viewBox="0 0 100 20" preserveAspectRatio="none">
              <path d="M0 15 L20 10 L40 18 L60 5 L80 12 L100 2" fill="none" stroke="#E50914" strokeWidth="2" />
            </svg>
          </div>

          {/* Top Right Stat */}
          <div className="absolute top-[0%] right-[0%] bg-white p-4 rounded-xl shadow-[0_8px_20px_rgb(0,0,0,0.06)] border border-[#FEE2E2] w-[140px] z-20">
            <div className="text-[9px] text-gray-500 font-extrabold mb-0.5 uppercase tracking-wide">Transactions Scanned</div>
            <div className="text-[20px] text-[#090D18] font-extrabold leading-none mb-3">24,851</div>
            <div className="flex items-end gap-1 h-6">
              <div className="w-full bg-red-100 rounded-t-sm h-[40%]"></div>
              <div className="w-full bg-red-200 rounded-t-sm h-[60%]"></div>
              <div className="w-full bg-red-300 rounded-t-sm h-[30%]"></div>
              <div className="w-full bg-[#E50914] rounded-t-sm h-[100%]"></div>
              <div className="w-full bg-red-200 rounded-t-sm h-[70%]"></div>
              <div className="w-full bg-red-100 rounded-t-sm h-[50%]"></div>
            </div>
          </div>

          {/* Bottom Left Stat */}
          <div className="absolute bottom-[5%] left-[5%] bg-white p-4 rounded-xl shadow-[0_8px_20px_rgb(0,0,0,0.06)] border border-[#FEE2E2] w-[130px] z-20">
            <div className="text-[9px] text-gray-500 font-extrabold mb-0.5 uppercase tracking-wide">Cases Resolved</div>
            <div className="text-[20px] text-[#090D18] font-extrabold leading-none mb-1">1,248</div>
            <div className="text-[10px] text-green-600 font-bold">↑ 18.6%</div>
          </div>

          {/* Bottom Right Stat */}
          <div className="absolute bottom-[0%] right-[5%] bg-white p-4 rounded-xl shadow-[0_8px_20px_rgb(0,0,0,0.06)] border border-[#FEE2E2] w-[130px] z-20 flex flex-col items-center">
            <div className="text-[9px] text-gray-500 font-extrabold mb-1 w-full text-left uppercase tracking-wide">Accuracy</div>
            <div className="relative w-12 h-12 mt-1">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-gray-100" strokeWidth="4" />
                <circle cx="18" cy="18" r="16" fill="none" className="stroke-[#E50914]" strokeWidth="4" strokeDasharray="100" strokeDashoffset="3.3" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[11px] font-extrabold text-[#090D18]">96.7%</div>
            </div>
          </div>

          {/* Center 3D Shield */}
          <div className="relative w-56 h-56 flex items-center justify-center z-30">
            {/* Base platform */}
            <div className="absolute bottom-4 w-52 h-14 bg-white rounded-[100%] shadow-xl border border-[#FEE2E2] flex items-center justify-center">
              <div className="w-40 h-8 bg-[#FEF2F2] rounded-[100%] border border-[#FCA5A5] flex items-center justify-center">
                <div className="w-24 h-4 bg-red-100 rounded-[100%]"></div>
              </div>
            </div>
            {/* The shield */}
            <div className="relative z-10 bg-gradient-to-br from-[#FF3B30] to-[#C90000] rounded-3xl w-32 h-[150px] flex items-center justify-center shadow-[0_15px_35px_rgba(229,9,20,0.4)] transform mb-4" style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%)' }}>
              <div className="absolute inset-1 bg-gradient-to-br from-[#FF4F45] to-[#D60A0A] z-0" style={{ clipPath: 'polygon(50% 0%, 100% 15%, 100% 75%, 50% 100%, 0% 75%, 0% 15%)' }}></div>
              <ShieldCheck className="w-16 h-16 text-white relative z-10" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Features Row */}
        <div className="grid grid-cols-4 gap-3 bg-white/70 backdrop-blur-md p-5 rounded-2xl border border-white/50 shadow-sm mb-4">
          <div className="flex flex-col items-center text-center px-1">
            <div className="w-9 h-9 rounded-full bg-[#FFF5F5] flex items-center justify-center text-[#E50914] mb-2">
              <Shield className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h4 className="text-[11px] font-extrabold text-[#090D18] mb-1">AI Risk Detection</h4>
            <p className="text-[9px] text-gray-500 font-bold leading-relaxed">Detect suspicious transactions with high accuracy.</p>
          </div>
          <div className="flex flex-col items-center text-center px-1">
            <div className="w-9 h-9 rounded-full bg-[#FFF5F5] flex items-center justify-center text-[#E50914] mb-2">
              <BrainCircuit className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h4 className="text-[11px] font-extrabold text-[#090D18] mb-1">Explainable AI</h4>
            <p className="text-[9px] text-gray-500 font-bold leading-relaxed">Understand why a transaction is flagged.</p>
          </div>
          <div className="flex flex-col items-center text-center px-1">
            <div className="w-9 h-9 rounded-full bg-[#FFF5F5] flex items-center justify-center text-[#E50914] mb-2">
              <BarChart2 className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h4 className="text-[11px] font-extrabold text-[#090D18] mb-1">Advanced Analytics</h4>
            <p className="text-[9px] text-gray-500 font-bold leading-relaxed">Interactive dashboards for deeper investigation.</p>
          </div>
          <div className="flex flex-col items-center text-center px-1">
            <div className="w-9 h-9 rounded-full bg-[#FFF5F5] flex items-center justify-center text-[#E50914] mb-2">
              <MessageSquare className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h4 className="text-[11px] font-extrabold text-[#090D18] mb-1">AI Assistant</h4>
            <p className="text-[9px] text-gray-500 font-bold leading-relaxed">Ask questions. Get insights. Stay ahead.</p>
          </div>
        </div>

        {/* Footer text */}
        <div className="text-center flex justify-center items-center gap-2 text-[#E50914] opacity-80">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
          <span className="text-[11px] font-bold text-gray-500">Trusted by investigators and compliance teams worldwide</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>
        </div>
      </div>

      {/* Right Column - Auth Card */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 lg:p-12 relative z-10 bg-transparent min-h-screen">
        <div className="w-full max-w-[440px] bg-white rounded-[24px] p-8 lg:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex flex-col relative z-20">
          
          <div className="text-center mb-8">
            <h2 className="text-[28px] font-extrabold text-[#090D18] mb-2 tracking-tight">Welcome <span className="text-[#E50914]">Back</span></h2>
            <p className="text-gray-500 text-[14px] font-medium">Sign in to continue your investigations</p>
          </div>

          {/* Tabs */}
          <div className="flex w-full border-b border-gray-100 mb-8">
            <button 
              type="button"
              onClick={() => { setActiveTab('login'); setAuthError(null); }} 
              className={`flex-1 pb-3 text-[14px] font-bold flex justify-center items-center gap-2 relative transition-colors ${activeTab === 'login' ? 'text-[#E50914]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <User className="w-4 h-4" /> Login
              {activeTab === 'login' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#E50914] rounded-t-full"></div>}
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('register'); setAuthError(null); }} 
              className={`flex-1 pb-3 text-[14px] font-bold flex justify-center items-center gap-2 relative transition-colors ${activeTab === 'register' ? 'text-[#E50914]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <UserPlus className="w-4 h-4" /> Register
              {activeTab === 'register' && <div className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-[#E50914] rounded-t-full"></div>}
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {activeTab === 'register' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[12px] font-bold text-[#090D18] mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    required={activeTab === 'register'}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-[14px] font-medium focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-colors placeholder:font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            <div className="animate-in fade-in duration-300">
              <label className="block text-[12px] font-bold text-[#090D18] mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="w-full h-11 pl-10 pr-4 rounded-xl border border-gray-200 text-[14px] font-medium focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-colors placeholder:font-medium placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-[12px] font-bold text-[#090D18]">Password</label>
                {activeTab === 'login' && <Link to="#" className="text-[11px] font-bold text-[#E50914] hover:underline">Forgot Password?</Link>}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 text-[14px] font-medium focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-colors placeholder:font-medium placeholder:text-gray-400"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {activeTab === 'register' && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[12px] font-bold text-[#090D18] mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required={activeTab === 'register'}
                    minLength={6}
                    className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 text-[14px] font-medium focus:outline-none focus:border-[#E50914] focus:ring-1 focus:ring-[#E50914] transition-colors placeholder:font-medium placeholder:text-gray-400"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'login' && (
              <div className="flex items-center animate-in fade-in duration-300">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input type="checkbox" id="remember" defaultChecked className="peer appearance-none w-4 h-4 bg-white border border-gray-300 rounded checked:bg-[#E50914] checked:border-[#E50914] transition-colors cursor-pointer" />
                  <Check className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" strokeWidth={3} />
                </div>
                <label htmlFor="remember" className="ml-2 text-[13px] font-bold text-gray-600 cursor-pointer">Remember me</label>
              </div>
            )}

            {authError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-semibold text-red-700">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 mt-2 bg-[#E50914] hover:bg-[#C90000] disabled:bg-red-300 disabled:cursor-not-allowed text-white font-bold rounded-lg flex items-center justify-center transition-colors shadow-md shadow-red-500/20"
            >
              {isSubmitting ? 'Please wait...' : activeTab === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight className="ml-2 w-4 h-4" />
            </button>
          </form>

          {/* Callout */}
          <div className="mt-8 bg-[#FEF2F2] rounded-xl p-4 flex gap-3 items-center border border-[#FEE2E2]">
            <div className="bg-white rounded-full p-2 shadow-sm shrink-0 border border-red-100">
              <ShieldCheck className="w-4 h-4 text-[#E50914]" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[12px] font-extrabold text-[#090D18] mb-0.5">Your data is safe with us.</p>
              <p className="text-[11px] font-medium text-gray-500 leading-snug pr-4">We use enterprise-grade encryption to protect your information.</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
