import { ChevronRight, Send, Sparkles, Share2, Briefcase, Tag, Puzzle, Flag, Lock, ShieldCheck, Database, ClipboardCheck, Cloud } from "lucide-react";
import { LogoIcon } from "@/components/ui/LogoIcon";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-[#F1F1F1] pt-16">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        {/* Top 3-column section */}
        <div className="grid gap-12 md:grid-cols-12 mb-12">
          
          <div className="md:col-span-5 lg:col-span-4">
            <div className="flex items-center gap-2 mb-4">
              <LogoIcon className="h-8 w-8" />
              <span className="text-[23px] font-extrabold tracking-normal text-[#090D18]">
                FraudGuard <span className="text-[#E50914]">AI</span>
              </span>
            </div>
            <p className="text-[14px] font-medium text-[#090D18] mb-4">Intelligent Financial Investigation Platform</p>
            <p className="text-[14px] font-medium text-[#6B7280] mb-6 max-w-sm leading-relaxed">
              Detect, explain, and investigate financial fraud with the power of Machine Learning and Explainable AI.
            </p>
            <div className="flex gap-4">
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fca5a5] bg-white text-[#E50914] hover:bg-[#E50914] hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fca5a5] bg-white text-[#E50914] hover:bg-[#E50914] hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fca5a5] bg-white text-[#E50914] hover:bg-[#E50914] hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55a3.016 3.016 0 0 0-2.122 2.136C0 8.071 0 12 0 12s0 3.929.501 5.814a3.016 3.016 0 0 0 2.122 2.136c1.872.55 9.377.55 9.377.55s7.505 0 9.377-.55a3.016 3.016 0 0 0 2.122-2.136C24 15.929 24 12 24 12s0-3.929-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full border border-[#fca5a5] bg-white text-[#E50914] hover:bg-[#E50914] hover:text-white transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
          
          <div className="md:col-span-3 lg:col-span-3 lg:col-start-6">
            <h4 className="text-sm font-bold tracking-widest text-[#E50914] uppercase">
              Product
            </h4>
            <div className="h-1 w-8 bg-[#E50914] mt-2 mb-6 rounded-full"></div>
            <ul className="space-y-4">
              {[
                { name: 'Features', Icon: Sparkles },
                { name: 'How It Works', Icon: Share2 },
                { name: 'Use Cases', Icon: Briefcase },
                { name: 'Pricing', Icon: Tag },
                { name: 'Integrations', Icon: Puzzle },
                { name: 'Roadmap', Icon: Flag }
              ].map((link) => (
                <li key={link.name}>
                  <a href="#" className="group flex items-center justify-between text-sm font-bold text-[#090D18] hover:text-[#E50914] transition-colors">
                    <span className="flex items-center gap-3">
                      <link.Icon className="h-4 w-4 text-[#E50914]" strokeWidth={2.5} /> {link.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#E50914]" strokeWidth={2.5} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="text-sm font-bold tracking-widest text-[#E50914] uppercase">
              Stay Updated
            </h4>
            <div className="h-1 w-8 bg-[#E50914] mt-2 mb-6 rounded-full"></div>
            <p className="text-[14px] font-medium text-[#090D18] mb-4 leading-relaxed">
              Subscribe to our newsletter for the latest updates, features, and insights.
            </p>
            <form className="mb-4 flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex h-11 w-full rounded-l-md border border-[#E8EBF0] bg-white px-4 py-2 text-[14px] font-medium placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#E50914] focus:border-[#E50914]"
              />
              <button type="submit" className="flex h-11 w-14 shrink-0 items-center justify-center rounded-r-md bg-[#E50914] text-white transition-colors hover:bg-red-700">
                <Send className="h-5 w-5" />
              </button>
            </form>
            <div className="flex gap-2">
              <Lock className="h-4 w-4 text-gray-500 mt-0.5" />
              <p className="text-[13px] font-medium text-gray-500 leading-tight">We respect your privacy.<br/>Unsubscribe anytime.</p>
            </div>
          </div>
          
        </div>
        
        <div className="h-[1px] w-full bg-[#E8EBF0]"></div>
        
        {/* Trust Badges Row */}
        <div className="py-12 flex flex-wrap justify-between gap-6">
          {[
            { Icon: Lock, title: "End-to-End\nEncryption", sub: "Your data is always safe" },
            { Icon: ShieldCheck, title: "GDPR\nCompliant", sub: "Privacy by design" },
            { Icon: Database, title: "No Data\nSharing", sub: "Your data stays yours" },
            { Icon: ClipboardCheck, title: "Audit\nReady", sub: "Built for compliance" },
            { Icon: Cloud, title: "Cloud\nSecure", sub: "Enterprise-grade security" }
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FEF2F2] text-[#E50914]">
                <badge.Icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div className="text-left">
                <p className="whitespace-pre-line text-[14px] font-bold leading-tight text-[#090D18]">
                  {badge.title}
                </p>
                <p className="mt-1 text-[11px] text-gray-500">{badge.sub}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="h-[1px] w-full bg-[#E8EBF0]"></div>
        
        {/* Bottom Bar */}
        <div className="py-6 flex flex-col items-center justify-between gap-4 lg:flex-row text-[13px] font-medium text-[#090D18]">
          <p>Copyright 2026 <span className="font-bold text-[#E50914]">FraudGuard AI.</span> All rights reserved.</p>
          <div className="hidden lg:block h-6 w-[1px] bg-[#E8EBF0]"></div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#E50914]" />
            <span>Trusted by investigators and compliance teams worldwide.</span>
          </div>
          <div className="hidden lg:block h-6 w-[1px] bg-[#E8EBF0]"></div>
          <div className="flex gap-6">
            <a href="#" className="font-bold text-[#E50914] hover:text-red-700">Privacy Policy</a>
            <a href="#" className="font-bold text-[#E50914] hover:text-red-700">Terms of Service</a>
            <a href="#" className="font-bold text-[#E50914] hover:text-red-700">Cookie Policy</a>
          </div>
        </div>
        
      </div>
    </footer>
  );
}
