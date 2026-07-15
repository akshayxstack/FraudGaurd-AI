import { Link } from "react-router-dom";
import { ArrowDown, Check, MessageSquare, ArrowRight } from "lucide-react";

export default function FeatureHighlights() {
  return (
    <section className="overflow-hidden bg-white pb-7 pt-2">
      <div className="relative z-10 mx-auto w-full max-w-[1432px] px-6 md:px-12 lg:px-[68px]">
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Card 1 */}
          <div className="flex flex-col items-center gap-6 rounded-[8px] border border-[#E9EDF3] bg-white p-8 shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:flex-row sm:items-start lg:flex-col lg:items-center xl:flex-row xl:items-start">
            <div className="relative shrink-0 flex h-[100px] w-[120px] items-center justify-center rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
              {/* Mini UI Mockup */}
              <div className="absolute top-5 left-4 flex flex-col gap-2.5">
                <div className="h-2 w-8 rounded-full bg-[#DC2626]"></div>
                <div className="flex flex-col gap-1.5">
                   <div className="h-1.5 w-14 rounded-full bg-gray-200"></div>
                   <div className="h-1.5 w-10 rounded-full bg-gray-200"></div>
                </div>
              </div>
              {/* Overlapping Icon: Magnifying Glass with Red Check */}
              <div className="absolute -bottom-3 -right-3">
                 <div className="relative w-12 h-12">
                   {/* Handle */}
                   <div className="absolute bottom-1 right-1 w-5 h-5 border-b-4 border-r-4 border-black rounded-sm transform rotate-45"></div>
                   {/* Glass */}
                   <div className="absolute top-0 left-0 w-10 h-10 rounded-full border-[3px] border-black bg-[#DC2626] flex items-center justify-center z-10">
                      <Check className="h-5 w-5 text-white" strokeWidth={4} />
                   </div>
                 </div>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-3 text-[21px] font-extrabold leading-tight text-[#050816]">AI-Powered<br/>Risk Detection</h3>
              <p className="mb-5 text-[14px] font-medium leading-relaxed text-[#657084]">
                Machine learning models analyze transactions and highlight suspicious activities in real-time.
              </p>
              <Link to="/dashboard" className="inline-flex items-center text-[13px] font-bold text-[#E50914] hover:text-red-700">
                Learn more <ArrowRight className="ml-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Card 2 — featured (red-tint background) */}
          <div className="flex flex-col items-center gap-6 rounded-[8px] border border-red-100 bg-[#FFF3F3] p-8 shadow-[0_8px_28px_rgba(229,9,20,0.04)] transition-shadow hover:shadow-[0_12px_36px_rgba(229,9,20,0.07)] sm:flex-row sm:items-start lg:flex-col lg:items-center xl:flex-row xl:items-start">
            <div className="relative shrink-0 flex h-[100px] w-[120px] items-center justify-center rounded-xl bg-white border border-red-100 shadow-sm">
              {/* Mini UI Mockup */}
              <div className="absolute top-4 left-4 right-4 flex flex-col gap-2.5">
                <div className="flex gap-2">
                   <div className="h-2 w-2 rounded-full bg-[#DC2626]"></div>
                   <div className="h-2 w-2 rounded-full bg-[#DC2626]"></div>
                   <div className="h-2 w-2 rounded-full bg-[#DC2626]"></div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-red-100"></div>
                <div className="h-1.5 w-full rounded-full bg-red-100"></div>
                <div className="h-1.5 w-2/3 rounded-full bg-[#DC2626]/40"></div>
              </div>
              {/* Overlapping Icon: Red Speech Bubble */}
              <div className="absolute -bottom-3 -right-3 flex h-10 w-12 items-center justify-center rounded-lg bg-[#E50914] shadow-lg shadow-red-500/30">
                <MessageSquare className="h-5 w-5 text-white" strokeWidth={2.5} fill="white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-3 text-[21px] font-extrabold leading-tight text-[#050816]">Explainable<br/>AI Insights</h3>
              <p className="mb-5 text-[14px] font-medium leading-relaxed text-[#657084]">
                Generative AI explains why transactions are flagged with clear, human-readable insights.
              </p>
              <Link to="/dashboard" className="inline-flex items-center text-[13px] font-bold text-[#E50914] hover:text-red-700">
                Learn more <ArrowRight className="ml-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col items-center gap-6 rounded-[8px] border border-[#E9EDF3] bg-white p-8 shadow-[0_8px_28px_rgba(15,23,42,0.04)] transition-shadow hover:shadow-[0_12px_36px_rgba(15,23,42,0.06)] sm:flex-row sm:items-start lg:flex-col lg:items-center xl:flex-row xl:items-start">
            <div className="relative shrink-0 flex h-[100px] w-[120px] items-center justify-center rounded-xl bg-gray-50 border border-gray-100 shadow-sm">
              {/* Mini UI Mockup */}
              <div className="absolute top-4 left-4 flex gap-3">
                <div className="h-10 w-10 rounded-full bg-[#111827] flex overflow-hidden border-2 border-white shadow-sm relative">
                   <div className="absolute top-0 right-0 w-1/2 h-full bg-[#DC2626]"></div>
                </div>
                <div className="flex flex-col gap-1.5 pt-1">
                  <div className="h-1.5 w-8 rounded-full bg-gray-200"></div>
                  <div className="h-1.5 w-6 rounded-full bg-gray-200"></div>
                  <div className="h-1.5 w-10 rounded-full bg-gray-200 mt-2"></div>
                </div>
              </div>
              
              {/* Overlapping Icon: Red Arrow Down */}
              <div className="absolute -bottom-3 -right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#E50914] shadow-lg shadow-red-500/30 border-2 border-white">
                 <ArrowDown className="h-5 w-5 text-white" strokeWidth={3} />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="mb-3 text-[21px] font-extrabold leading-tight text-[#050816]">Investigation<br/>&amp; Reporting</h3>
              <p className="mb-5 text-[14px] font-medium leading-relaxed text-[#657084]">
                Collaborate, take notes, and generate professional reports in a few clicks.
              </p>
              <Link to="/dashboard" className="inline-flex items-center text-[13px] font-bold text-[#E50914] hover:text-red-700">
                Learn more <ArrowRight className="ml-1.5 h-3.5 w-3.5" strokeWidth={2.5} />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
