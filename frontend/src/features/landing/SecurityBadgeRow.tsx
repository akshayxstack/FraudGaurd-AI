import { Lock, Server, FileText, Shield } from "lucide-react";

export default function SecurityBadgeRow() {
  return (
    <div className="mt-1 flex flex-col items-center border-t border-gray-100 bg-white py-8">
      <div className="mb-7 flex w-full items-center justify-center gap-4 px-6">
        <div className="h-[1px] w-full max-w-[190px] bg-gradient-to-l from-gray-300 to-transparent"></div>
        <h4 className="text-center text-[12px] font-bold uppercase tracking-[0.22em] text-[#697386]">Built for Security. Designed for Trust.</h4>
        <div className="h-[1px] w-full max-w-[190px] bg-gradient-to-r from-gray-300 to-transparent"></div>
      </div>
      
      <div className="flex flex-wrap items-center justify-center gap-y-4 text-[15px] font-bold text-[#4B5565]">
        {[
          { icon: Lock, label: "End-to-End Encryption" },
          { icon: Server, label: "No Data Sharing" },
          { icon: FileText, label: "Audit Ready" },
          { icon: Shield, label: "GDPR Compliant" },
        ].map((item, i) => (
          <div key={item.label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0F0]">
                <item.icon className="h-4 w-4 text-[#E50914]" strokeWidth={2.3} />
              </div>
              <span>{item.label}</span>
            </div>
            {i < 3 && <div className="mx-8 hidden h-5 w-[1px] bg-gray-200 sm:block"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
