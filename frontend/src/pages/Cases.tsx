import React, { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  Briefcase, Activity, Clock, CheckCircle2, 
  ChevronDown, Filter, Download, Calendar, MoreHorizontal,
  ChevronLeft, ChevronRight, IndianRupee
} from "lucide-react";
import { useCases } from "@/hooks/dashboard/useCases";
import { useDashboardMetrics } from "@/hooks/dashboard/useDashboardMetrics";
import { casesAPI } from "@/api/cases";

export default function Cases() {
  const POLLING_INTERVAL = 15000;
  const [activeTab, setActiveTab] = useState("All Cases");
  const [search, setSearch] = useState("");
  const [riskLevel, setRiskLevel] = useState("All");
  const [statusDropdown, setStatusDropdown] = useState("All");
  const [assignedTo, setAssignedTo] = useState("All");
  const [caseType, setCaseType] = useState("All");
  const [dateRange, setDateRange] = useState("All Time");
  const [page, setPage] = useState(1);

  const [selectedCaseIds, setSelectedCaseIds] = useState<Set<string>>(new Set());
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [statusUpdateCase, setStatusUpdateCase] = useState<{ id: string; currentStatus: string } | null>(null);

  // Synchronize Tab status vs Dropdown status filter
  const computedStatus = activeTab !== "All Cases" 
    ? activeTab 
    : (statusDropdown !== "All" ? statusDropdown : undefined);

  const { data: casesData, pagination, isLoading, refetch } = useCases({
    page,
    limit: 10,
    status: computedStatus,
    riskLevel: riskLevel !== "All" ? riskLevel : undefined,
    search: search.trim() || undefined,
    assignedTo: assignedTo !== "All" ? assignedTo : undefined,
    dateRange: dateRange !== "All Time" ? dateRange : undefined,
  }, POLLING_INTERVAL);

  const { data: metricsData } = useDashboardMetrics(POLLING_INTERVAL);

  // Summary Cards Data (Dynamic)
  const summaryCards = [
    {
      title: "Active Cases",
      value: metricsData?.activeCases?.value?.toString() || "0",
      change: "Current active workload",
      icon: Activity,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      borderClass: "border-blue-100"
    },
    {
      title: "Amount at Risk",
      value: metricsData?.amountAtRisk?.value?.toString() || "₹0",
      change: "Total exposed capital",
      icon: IndianRupee,
      colorClass: "text-red-600",
      bgClass: "bg-red-50",
      borderClass: "border-red-100"
    },
    {
      title: "Fraudulent Alerts",
      value: metricsData?.alerts?.value?.toString() || "0",
      change: "Requires immediate attention",
      icon: Clock,
      colorClass: "text-orange-500",
      bgClass: "bg-orange-50",
      borderClass: "border-orange-100"
    },
    {
      title: "Average Risk Score",
      value: `${metricsData?.overallRiskScore || 0}%`,
      change: "System-wide average",
      icon: CheckCircle2,
      colorClass: "text-green-600",
      bgClass: "bg-green-50",
      borderClass: "border-green-100"
    }
  ];

  const tabs = ["All Cases", "Open", "In Progress", "Under Review", "Closed"];

  // Helpers for table badges
  const getTypeBadgeStyles = (type: string) => {
    switch (type) {
      case 'Fraud': return 'bg-red-50 text-red-700';
      case 'Card Fraud': return 'bg-red-100 text-red-800';
      case 'Account Takeover': 
      case 'Policy Violation': return 'bg-orange-50 text-orange-700';
      case 'Money Laundering': return 'bg-blue-50 text-blue-700';
      case 'Identity Theft': 
      case 'AML': return 'bg-purple-50 text-purple-700';
      case 'Suspicious Activity': return 'bg-teal-50 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRiskScoreStyles = (score: number) => {
    if (score >= 90) return 'text-red-600';
    if (score >= 70) return 'text-orange-600';
    if (score >= 40) return 'text-amber-500';
    return 'text-green-600';
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-emerald-50 text-emerald-700'; // light green background/gray-green text
      case 'In Progress': return 'bg-blue-50 text-blue-700';
      case 'Under Review': return 'bg-amber-50 text-amber-700';
      case 'Closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const handleExportCSV = () => {
    if (!casesData || casesData.length === 0) return;
    const headers = ["Case ID", "Type", "Customer/Title", "Risk Score", "Status", "Assigned To", "Created On", "Amount"];
    const rows = casesData.map(c => [
      c.caseId,
      c.type,
      c.customerName,
      `${c.riskScore}%`,
      c.status,
      c.assigneeName,
      c.createdOnDate,
      `INR ${c.amount}`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `cases_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked && casesData) {
      setSelectedCaseIds(new Set(casesData.map(c => c.id)));
    } else {
      setSelectedCaseIds(new Set());
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    const updated = new Set(selectedCaseIds);
    if (checked) {
      updated.add(id);
    } else {
      updated.delete(id);
    }
    setSelectedCaseIds(updated);
  };

  const handleStatusUpdate = (id: string, currentStatus: string) => {
    setStatusUpdateCase({ id, currentStatus });
  };

  const handleConfirmStatusUpdate = async (newStatus: string) => {
    if (!statusUpdateCase) return;
    try {
      await casesAPI.updateCaseStatus(statusUpdateCase.id, newStatus);
      setStatusUpdateCase(null);
      refetch();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const handleDeleteCase = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this case?")) return;
    try {
      await casesAPI.deleteCase(id);
      refetch();
    } catch (err: any) {
      alert(`Failed to delete case: ${err.message}`);
    }
  };

  return (
    <AppLayout 
      title="Cases" 
      subtitle="Manage and investigate all cases in one place."
      searchPlaceholder="Search by Case ID, Customer, Status..."
    >
      
      {/* SECTION 1 - Summary Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:border-gray-200/60 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${card.bgClass} ${card.colorClass} ${card.borderClass}`}>
                <card.icon className="w-5 h-5" strokeWidth={2.5} />
              </div>
              <div>
                <h4 className="text-[13px] font-semibold text-gray-500">{card.title}</h4>
                <div className="text-[28px] font-heading font-extrabold text-[#090D18] leading-none mt-1 tracking-tight">{card.value}</div>
              </div>
            </div>
            <div className="text-[12px] font-semibold text-green-600">{card.change}</div>
          </div>
        ))}
      </div>

      {/* SECTION 2 - Tab Filter Row */}
      <div className="flex items-center border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3.5 text-[14px] font-bold border-b-2 transition-colors relative -mb-[1px] ${
              activeTab === tab 
                ? "border-[#DC2626] text-[#DC2626]" 
                : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* SECTION 3 - Filter Bar */}
      <div className="flex items-end justify-between gap-4 mb-6 flex-wrap">
        <div className="flex items-end gap-4 flex-wrap">
          {/* Search Input */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-1">Search Cases</span>
            <input 
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search ID, Title..."
              className="w-40 h-10 px-3 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-sm focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          {/* Risk Level Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-1">Risk Level</span>
            <select
              value={riskLevel}
              onChange={(e) => { setRiskLevel(e.target.value); setPage(1); }}
              className="w-36 h-10 pl-3 pr-8 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-sm hover:border-gray-300 outline-none transition-colors cursor-pointer"
            >
              <option value="All">All Risks</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Status Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-1">Status</span>
            <select
              value={statusDropdown}
              onChange={(e) => { setStatusDropdown(e.target.value); setPage(1); }}
              disabled={activeTab !== 'All Cases'}
              className="w-36 h-10 pl-3 pr-8 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-sm hover:border-gray-300 outline-none transition-colors disabled:opacity-50 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Under Review">Under Review</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Assigned To Select */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-1">Assigned To</span>
            <select
              value={assignedTo}
              onChange={(e) => { setAssignedTo(e.target.value); setPage(1); }}
              className="w-36 h-10 pl-3 pr-8 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-sm hover:border-gray-300 outline-none transition-colors cursor-pointer"
            >
              <option value="All">All Analysts</option>
              <option value="System Analyst">System Analyst</option>
              <option value="Investigator">Investigator</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide px-1">Date Range</span>
            <select
              value={dateRange}
              onChange={(e) => { setDateRange(e.target.value); setPage(1); }}
              className="w-36 h-10 pl-3 pr-8 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-sm hover:border-gray-300 outline-none transition-colors cursor-pointer"
            >
              <option value="All Time">All Time</option>
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-lg text-[13px] font-semibold text-[#090D18] shadow-sm hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-500" />
            Export
          </button>
        </div>
      </div>

      {/* SECTION 4 - Cases Table */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    onChange={handleSelectAll}
                    checked={casesData ? casesData.length > 0 && selectedCaseIds.size === casesData.length : false}
                    className="w-4 h-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]/20 cursor-pointer" 
                  />
                </th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Case ID</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Type <ChevronDown className="inline-block w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Customer / Title</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Risk Score</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Status <ChevronDown className="inline-block w-3 h-3 ml-1" /></th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Assigned To <span className="inline-flex flex-col ml-1 align-middle"><ChevronDown className="w-2.5 h-2.5 rotate-180 -mb-1" /><ChevronDown className="w-2.5 h-2.5" /></span></th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Created On</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Amount</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                // Loading Skeleton
                Array.from({ length: 3 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4"><div className="w-4 h-4 bg-gray-200 rounded"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-1.5"></div>
                      <div className="h-3 bg-gray-200 rounded w-40"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-10 mb-1.5"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-1.5"></div>
                        <div className="h-3 bg-gray-200 rounded w-20"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1.5"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-6 py-4 text-center"><div className="w-6 h-6 bg-gray-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : !casesData || casesData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-6 py-12 text-center text-gray-500 font-medium">No cases found</td>
                </tr>
              ) : (
                // Table Rows
                casesData.map((item) => (
                  <React.Fragment key={item.id}>
                    <tr className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4 text-center">
                        <input 
                          type="checkbox" 
                          onChange={(e) => handleSelectRow(item.id, e.target.checked)}
                          checked={selectedCaseIds.has(item.id)}
                          className="w-4 h-4 rounded border-gray-300 text-[#DC2626] focus:ring-[#DC2626]/20 cursor-pointer" 
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-heading font-extrabold text-[#DC2626] text-[13px]">{item.caseId}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${getTypeBadgeStyles(item.type)}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-heading font-bold text-[#090D18] text-[14px]">{item.customerName}</div>
                        <div className="text-[12px] text-gray-500 font-medium mt-0.5">{item.customerTitle}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`font-heading font-extrabold text-[14px] ${getRiskScoreStyles(item.riskScore)}`}>
                          {item.riskScore}%
                        </div>
                        <div className={`text-[11px] font-bold mt-0.5 ${getRiskScoreStyles(item.riskScore)}`}>
                          {item.riskSeverity}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold border border-current/10 ${getStatusBadgeStyles(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-[11px] font-bold shadow-sm">
                            {getAvatarInitials(item.assigneeName)}
                          </div>
                          <div>
                            <div className="font-heading font-bold text-[#090D18] text-[13px]">{item.assigneeName}</div>
                            <div className="text-[11px] text-gray-500 font-medium">{item.assigneeRole}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-[13px] font-semibold text-[#090D18]">{item.createdOnDate}</div>
                        <div className="text-[12px] text-gray-500 font-medium mt-0.5">{item.createdOnTime}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-heading font-bold text-[#090D18] text-[14px]">
                          ₹{item.amount.toLocaleString('en-US')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center relative">
                        <button 
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors border border-transparent hover:border-gray-200 cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                        
                        {activeMenuId === item.id && (
                          <div className="absolute right-6 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-30 flex flex-col">
                            <button 
                              onClick={() => {
                                setExpandedCaseId(expandedCaseId === item.id ? null : item.id);
                                setActiveMenuId(null);
                              }}
                              className="px-4 py-2 text-left text-[12px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              {expandedCaseId === item.id ? "Hide Details" : "View Details"}
                            </button>
                            <button 
                              onClick={() => {
                                handleStatusUpdate(item.id, item.status);
                                setActiveMenuId(null);
                              }}
                              className="px-4 py-2 text-left text-[12px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                              Update Status
                            </button>
                            <button 
                              onClick={() => {
                                handleDeleteCase(item.id);
                                setActiveMenuId(null);
                              }}
                              className="px-4 py-2 text-left text-[12px] font-semibold text-[#E50914] hover:bg-red-50/30 transition-colors cursor-pointer"
                            >
                              Delete Case
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>

                    {/* EXPANDABLE ROW DETAILS */}
                    {expandedCaseId === item.id && (
                      <tr className="bg-red-50/5">
                        <td colSpan={10} className="px-6 py-4 border-t border-b border-gray-100">
                          <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm flex flex-col gap-4 max-w-4xl">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="text-[14px] font-bold text-[#090D18] mb-1">Case Detail Information</h5>
                                <p className="text-[12px] text-gray-500 font-medium">Assigned to: {item.assigneeName} ({item.assigneeRole})</p>
                              </div>
                              <span className="px-3 py-1 bg-red-50 text-[#E50914] rounded-full text-[11px] font-bold">
                                {item.type} Classification
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Risk Assessment</div>
                                <div className="text-[14px] font-bold text-gray-700 mt-1">{item.riskSeverity} ({item.riskScore}%)</div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Funds Vulnerable</div>
                                <div className="text-[14px] font-bold text-gray-700 mt-1">₹{item.amount.toLocaleString('en-US')}</div>
                              </div>
                              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <div className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wide">Reported At</div>
                                <div className="text-[14px] font-bold text-gray-700 mt-1">{item.createdOnDate} {item.createdOnTime}</div>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button 
                                onClick={() => handleStatusUpdate(item.id, item.status)}
                                className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-[11px] font-bold text-gray-700 cursor-pointer"
                              >
                                Edit Status
                              </button>
                              <button 
                                onClick={() => handleDeleteCase(item.id)}
                                className="px-3 py-1.5 bg-red-50/50 hover:bg-red-50 border border-red-200 rounded-md text-[11px] font-bold text-[#E50914] cursor-pointer"
                              >
                                Delete Case
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 5 - Pagination */}
      {pagination && pagination.totalPages > 0 && (
        <div className="flex items-center justify-between pt-2 pb-8">
          <div className="text-[13px] font-medium text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} cases
          </div>
          
          <div className="flex items-center gap-1.5">
            <button 
              disabled={pagination.page <= 1}
              onClick={() => setPage(pagination.page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {Array.from({ length: pagination.totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isCurrent = pageNum === pagination.page;
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md border text-[13px] font-bold transition-colors cursor-pointer
                    ${isCurrent 
                      ? 'border-[#DC2626] text-[#DC2626] bg-red-50/30' 
                      : 'border-transparent text-gray-600 hover:bg-gray-100'}`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button 
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => setPage(pagination.page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      {/* Status Update Modal */}
      {statusUpdateCase && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setStatusUpdateCase(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 w-[360px] flex flex-col gap-4 animate-[scaleUp_0.18s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h4 className="text-[16px] font-heading font-extrabold text-[#090D18]">Update Case Status</h4>
              <p className="text-[12px] text-gray-500 font-medium mt-1">Select the new investigation status for this case.</p>
            </div>

            <div className="flex flex-col gap-2">
              {["Open", "In Progress", "Under Review", "Closed"].map((st) => (
                <button
                  key={st}
                  onClick={() => handleConfirmStatusUpdate(st)}
                  className={`h-11 px-4 rounded-xl text-[13px] font-bold text-left transition-all border flex items-center justify-between cursor-pointer
                    ${statusUpdateCase.currentStatus === st
                      ? 'border-[#DC2626] bg-red-50/30 text-[#DC2626]'
                      : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                >
                  {st}
                  {statusUpdateCase.currentStatus === st && (
                    <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex justify-end mt-1">
              <button
                onClick={() => setStatusUpdateCase(null)}
                className="px-4 h-9 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-[12px] font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </AppLayout>
  );
}
