import type { RecentCase } from "@/hooks/dashboard/useRecentCases";
import { ArrowRight, Inbox } from "lucide-react";

interface RecentCasesTableProps {
  data: RecentCase[] | null;
  isLoading: boolean;
}

export default function RecentCasesTable({ data, isLoading }: RecentCasesTableProps) {
  return (
    <div className="col-span-8 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 hover:border-gray-200/60 hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300 min-h-[350px] flex flex-col group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[15px] font-extrabold text-[#090D18]">Recent Cases</h3>
        <a href="#" className="text-[#E50914] text-[12px] font-bold hover:underline">View All Cases</a>
      </div>
      
      {isLoading || !data ? (
        <div className="flex-1 animate-pulse">
          <div className="h-8 bg-gray-50 mb-4 rounded"></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-gray-50/50 mb-2 rounded border-b border-gray-100"></div>
          ))}
        </div>
      ) : data.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-12">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Inbox className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-[14px] font-bold text-gray-600">No cases found</p>
          <p className="text-[12px] font-medium mt-1">There are no recent cases to display.</p>
        </div>
      ) : (
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="pb-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Case ID</th>
                <th className="pb-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Customer</th>
                <th className="pb-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Date</th>
                <th className="pb-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Risk Score</th>
                <th className="pb-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="pb-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="pb-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Assigned To</th>
                <th className="pb-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-[12px] font-semibold">
              {data.map((c, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/70 transition-colors group">
                  <td className="py-4 text-[#090D18] pr-2">{c.id}</td>
                  <td className="py-4 text-gray-700 pr-2">{c.customer}</td>
                  <td className="py-4 text-gray-500 pr-2">{c.date}</td>
                  <td className="py-4 pr-2">
                    <span className={`font-extrabold ${c.score >= 80 ? 'text-[#E50914]' : c.score >= 60 ? 'text-orange-500' : 'text-green-600'}`}>
                      {c.score}%
                    </span>
                  </td>
                  <td className="py-4 pr-2">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide ${
                      c.status === 'Critical' ? 'bg-red-50 text-[#E50914]' : 
                      c.status === 'High' ? 'bg-red-50 text-[#E50914]' : 
                      c.status === 'Medium' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-4 text-gray-700 pr-2">{c.amount}</td>
                  <td className="py-4 text-gray-500 pr-2">{c.assignedTo}</td>
                  <td className="py-4 text-right">
                    <button className="w-7 h-7 inline-flex items-center justify-center rounded-md bg-white border border-gray-200 text-gray-400 hover:text-[#E50914] hover:border-red-200 hover:bg-red-50 transition-all shadow-sm">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
