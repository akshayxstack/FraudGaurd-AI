import { Rocket, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

import { Shield3D } from "@/components/ui/Shield3D";

export default function FooterCTA() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto w-full max-w-7xl px-6 md:px-12 lg:px-20">
        <div className="relative flex flex-col overflow-hidden items-center justify-between gap-8 rounded-3xl bg-gradient-to-r from-red-50/50 via-red-50/30 to-white border border-red-100 p-8 md:flex-row md:p-12 lg:p-16">
          
          {/* Subtle background circles for depth */}
          <div className="absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full border border-red-100/50" />
          <div className="absolute -right-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full border border-red-50/50" />

          {/* Left: 3D Shield Graphic & Text */}
          <div className="relative z-10 flex flex-col items-center gap-8 text-center md:flex-row md:items-center md:text-left">
            <div className="shrink-0 w-40 h-40">
              <Shield3D className="w-full h-full drop-shadow-xl" />
            </div>
            <div>
              <h2 className="mb-3 text-3xl font-bold text-[#090D18] lg:text-4xl">
                Ready to simplify your<br/>
                <span className="text-[#E50914]">fraud investigations?</span>
              </h2>
              <p className="text-sm font-medium text-[#6B7280]">
                Join thousands of investigators and compliance teams<br className="hidden md:block" /> who trust FraudGuard AI.
              </p>
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="relative z-10 flex shrink-0 flex-col gap-4 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-[#E50914] px-6 text-[15px] font-bold text-white transition-colors hover:bg-red-700 shadow-[0_8px_18px_rgba(229,9,20,0.18)]"
            >
              <Rocket className="mr-2 h-4 w-4" /> Start Free Trial <span className="ml-2">→</span>
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-red-300 bg-white px-6 text-[15px] font-bold text-[#E50914] transition-colors hover:bg-red-50 shadow-sm"
            >
              <Calendar className="mr-2 h-4 w-4" /> Book a Demo
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
