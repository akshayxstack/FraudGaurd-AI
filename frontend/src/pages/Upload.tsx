import { useState, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { 
  CloudUpload, FileText, Lock, Shield,
  UploadCloud, FileUp, AlertTriangle, Download, Filter, 
  ChevronLeft, ChevronRight, FileJson, FileSpreadsheet,
  FileBox, File, RefreshCw, MoreVertical, ArrowUpDown,
  Loader2, CheckCircle2, XCircle
} from "lucide-react";
import { useUploads } from "@/hooks/dashboard/useUploads";
import { uploadAPI } from "@/api/upload";
import type { UploadResponse } from "@/api/upload";

export default function Upload() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fileTypeFilter, setFileTypeFilter] = useState("All");
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: uploadsData, pagination, isLoading, refetch } = useUploads({
    page,
    limit: 10,
    search: search.trim() || undefined,
    status: statusFilter !== "All" ? (statusFilter as any) : undefined,
    fileType: fileTypeFilter !== "All" ? (fileTypeFilter as any) : undefined,
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New state for real uploads
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadSummary, setUploadSummary] = useState<UploadResponse['summary'] | null>(null);

  // Summary Cards Data based on live uploads
  const totalUploads = uploadsData?.length || 0;
  const processedFiles = uploadsData?.filter(u => u.status === 'Processed').length || 0;
  const failedFiles = uploadsData?.filter(u => u.status === 'Failed').length || 0;
  const storageUsedMB = uploadsData?.reduce((sum, u) => sum + (parseFloat(u.sizeMB) || 0), 0).toFixed(2) || "0.00";

  const defaultSummaryCards = [
    {
      title: "Total Uploads",
      value: totalUploads.toString(),
      change: "Current uploaded files",
      icon: UploadCloud,
      colorClass: "text-blue-600",
      bgClass: "bg-blue-50",
      borderClass: "border-blue-100",
      trendColor: "text-blue-600"
    },
    {
      title: "Processed Files",
      value: processedFiles.toString(),
      change: "Successfully parsed",
      icon: FileUp,
      colorClass: "text-green-600",
      bgClass: "bg-green-50",
      borderClass: "border-green-100",
      trendColor: "text-green-600"
    },
    {
      title: "Failed Files",
      value: failedFiles.toString(),
      change: "Requires review",
      icon: AlertTriangle,
      colorClass: "text-orange-500",
      bgClass: "bg-orange-50",
      borderClass: "border-orange-100",
      trendColor: "text-red-600"
    },
    {
      title: "Storage Used",
      value: `${storageUsedMB} MB`,
      change: "Total disk space used",
      icon: Download,
      colorClass: "text-purple-600",
      bgClass: "bg-purple-50",
      borderClass: "border-purple-100",
      trendColor: "text-purple-600"
    }
  ];

  const processUpload = async (file: window.File | null | undefined) => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadError(null);
    setValidationErrors([]);
    setUploadSuccess(false);
    setUploadSummary(null);

    try {
      const response = await uploadAPI.uploadFile(file);
      setUploadSummary(response.summary);
      setUploadSuccess(true);
      refetch();
    } catch (err: any) {
      setUploadError(err.response?.data?.message || err.message || "An error occurred during upload.");
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        setValidationErrors(err.response.data.errors);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Handlers for drag & drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChooseFilesClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processUpload(e.target.files[0]);
    }
  };

  // Helpers for table styling
  const getAvatarInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2);
  };

  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'Processed': return 'bg-emerald-50 text-emerald-700';
      case 'Failed': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFileTypeBadgeStyles = (type: string) => {
    switch (type) {
      case 'XLSX':
      case 'CSV': return 'bg-emerald-50 text-emerald-700';
      case 'PDF': return 'bg-red-50 text-red-700';
      case 'JSON': return 'bg-blue-50 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'XLSX':
      case 'CSV': return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'PDF': return <FileText className="w-4 h-4 text-red-600" />;
      case 'JSON': return <FileJson className="w-4 h-4 text-blue-600" />;
      default: return <FileBox className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <AppLayout 
      title="Upload" 
      subtitle="Upload and manage data files for investigations."
      searchPlaceholder="Search cases, transactions, users..."
    >
      
      {/* SECTION 1 - Top Row (Drop Zone & Guidelines) */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        
        {/* Left: Drop Zone Card (60%) */}
        <div 
          className={`flex-1 min-w-[500px] rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center transition-colors
            ${isDragging ? 'border-[#DC2626] bg-red-50/50' : 'border-red-200 bg-[#FEF2F2]'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center py-6">
              <Loader2 className="w-12 h-12 text-[#DC2626] animate-spin mb-4" />
              <h3 className="font-heading font-extrabold text-[20px] text-[#090D18] mb-1">Processing Upload...</h3>
              <p className="text-[14px] text-gray-500 font-medium">Validating and analyzing data</p>
            </div>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-white border border-red-100 flex items-center justify-center mb-4 shadow-sm">
                <CloudUpload className="w-8 h-8 text-[#DC2626]" strokeWidth={2} />
              </div>
              <h3 className="font-heading font-extrabold text-[20px] text-[#090D18] mb-1">Drag & drop files here</h3>
              <p className="text-[14px] text-gray-500 font-medium mb-6">or click to browse</p>
              
              <div className="text-center mb-6">
                <p className="text-[13px] text-gray-500 font-semibold">Supports CSV, XLSX, XLS, PDF, JSON</p>
                <p className="text-[13px] text-gray-500 font-semibold">Max file size: 250MB</p>
              </div>
              
              <button 
                onClick={handleChooseFilesClick}
                className="flex items-center gap-2 bg-[#DC2626] hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold text-[14px] transition-colors shadow-sm"
              >
                <File className="w-4 h-4" />
                Choose Files
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept=".csv,.xlsx,.xls,.pdf,.json"
                onChange={handleFileInputChange} 
              />
            </>
          )}
        </div>

        {/* Right: Upload Guidelines (40%) */}
        <div className="lg:w-[480px] bg-white rounded-2xl p-7 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col">
          <h3 className="font-heading font-extrabold text-[16px] text-[#090D18] mb-5">Upload Guidelines</h3>
          <div className="space-y-4 mb-6 flex-1">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                Ensure your files are in supported formats (CSV, XLSX, XLS, PDF, JSON).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                Maximum file size allowed is 250MB per file.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                <FileBox className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                Ensure data is accurate and properly formatted for best results.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-3.5 h-3.5 text-gray-600" />
              </div>
              <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
                Sensitive data is encrypted and stored securely.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3.5 flex items-center gap-3 mt-auto">
            <Shield className="w-5 h-5 text-blue-600 shrink-0" />
            <p className="text-[13px] text-blue-800 font-semibold">All uploads are secure and encrypted</p>
          </div>
        </div>
        
      </div>

      {/* Upload Notification Messages */}
      {uploadError && (
        <div className="mb-8 bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl shadow-sm">
          <div className="flex items-center gap-3">
            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
            <div className="text-sm font-medium">{uploadError}</div>
          </div>
          {validationErrors.length > 0 && (
            <div className="ml-8 mt-3">
              <p className="text-[11px] font-bold mb-2 text-red-700 uppercase tracking-wider">Validation Details:</p>
              <ul className="list-disc pl-5 space-y-1.5">
                {validationErrors.map((error, idx) => (
                  <li key={idx} className="text-[13px] font-medium leading-relaxed">{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {uploadSuccess && (
        <div className="mb-8 bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <div className="text-sm font-medium">File successfully processed and analyzed!</div>
        </div>
      )}

      {/* SECTION 2 - Summary Cards (Shows latest upload summary if available) */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {uploadSummary ? (
          <>
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:border-gray-200/60 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-blue-50 text-blue-600 border-blue-100">
                  <FileUp className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-gray-500">Total Transactions</h4>
                  <div className="text-[28px] font-heading font-extrabold text-[#090D18] leading-none mt-1 tracking-tight">{uploadSummary.totalTransactions}</div>
                </div>
              </div>
              <div className="text-[12px] font-semibold text-gray-500">Analyzed in {uploadSummary.processingTimeMs}ms</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:border-gray-200/60 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-red-50 text-red-600 border-red-100">
                  <AlertTriangle className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-gray-500">Fraud Detected</h4>
                  <div className="text-[28px] font-heading font-extrabold text-[#090D18] leading-none mt-1 tracking-tight">{uploadSummary.fraudDetected}</div>
                </div>
              </div>
              <div className="text-[12px] font-semibold text-red-600">{uploadSummary.totalTransactions > 0 ? ((uploadSummary.fraudDetected / uploadSummary.totalTransactions) * 100).toFixed(2) : '0.00'}% of total</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:border-gray-200/60 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-orange-50 text-orange-500 border-orange-100">
                  <Shield className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-gray-500">High Risk</h4>
                  <div className="text-[28px] font-heading font-extrabold text-[#090D18] leading-none mt-1 tracking-tight">{uploadSummary.highRisk}</div>
                </div>
              </div>
              <div className="text-[12px] font-semibold text-orange-500">Needs immediate review</div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col hover:border-gray-200/60 transition-colors">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center border bg-green-50 text-green-600 border-green-100">
                  <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[13px] font-semibold text-gray-500">Safe Transactions</h4>
                  <div className="text-[28px] font-heading font-extrabold text-[#090D18] leading-none mt-1 tracking-tight">{uploadSummary.safeTransactions}</div>
                </div>
              </div>
              <div className="text-[12px] font-semibold text-green-600">{uploadSummary.lowRisk} Low Risk, {uploadSummary.mediumRisk} Med Risk</div>
            </div>
          </>
        ) : (
          defaultSummaryCards.map((card, idx) => (
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
              <div className={`text-[12px] font-semibold ${card.trendColor}`}>{card.change}</div>
            </div>
          ))
        )}
      </div>

      {/* SECTION 3 - Uploaded Files Table */}
      <div className="bg-white rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-heading font-extrabold text-[#090D18] text-[18px]">Uploaded Files</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search files..."
                className="w-[240px] h-10 pl-9 pr-4 bg-gray-50 border border-gray-200 rounded-lg text-[13px] font-medium focus:outline-none focus:border-gray-300 focus:bg-white transition-colors"
              />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 h-10 px-4 border rounded-lg text-[13px] font-semibold transition-colors shadow-sm cursor-pointer
                  ${isFilterOpen || statusFilter !== 'All' || fileTypeFilter !== 'All' 
                    ? 'border-[#DC2626] bg-red-50/10 text-[#DC2626]' 
                    : 'border-gray-200 bg-white text-[#090D18] hover:bg-gray-50'}`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-4 z-30 flex flex-col gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Status</label>
                    <select 
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                      }}
                      className="w-full h-8 px-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-semibold text-gray-700 outline-none"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Processed">Processed</option>
                      <option value="Failed">Failed</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">File Type</label>
                    <select 
                      value={fileTypeFilter}
                      onChange={(e) => {
                        setFileTypeFilter(e.target.value);
                        setPage(1);
                      }}
                      className="w-full h-8 px-2 bg-gray-50 border border-gray-200 rounded-lg text-[12px] font-semibold text-gray-700 outline-none"
                    >
                      <option value="All">All Types</option>
                      <option value="CSV">CSV</option>
                      <option value="XLSX">XLSX</option>
                      <option value="PDF">PDF</option>
                      <option value="JSON">JSON</option>
                    </select>
                  </div>

                  {(statusFilter !== 'All' || fileTypeFilter !== 'All' || search !== '') && (
                    <button 
                      onClick={() => {
                        setStatusFilter('All');
                        setFileTypeFilter('All');
                        setSearch('');
                        setPage(1);
                        setIsFilterOpen(false);
                      }}
                      className="text-[11px] font-bold text-[#DC2626] hover:underline mt-1 text-left cursor-pointer"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">File Name</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">File Type</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Uploaded By</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Uploaded On <ArrowUpDown className="inline-block w-3.5 h-3.5 ml-1 text-gray-400" /></th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Records <ArrowUpDown className="inline-block w-3.5 h-3.5 ml-1 text-gray-400" /></th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Status</th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500">Size <ArrowUpDown className="inline-block w-3.5 h-3.5 ml-1 text-gray-400" /></th>
                <th className="px-6 py-4 text-[12px] font-semibold text-gray-500 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                // Loading Skeleton
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-5 bg-gray-200 rounded w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
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
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-14"></div></td>
                    <td className="px-6 py-4 text-center"><div className="w-16 h-6 bg-gray-200 rounded mx-auto"></div></td>
                  </tr>
                ))
              ) : !uploadsData || uploadsData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-500 font-medium">No files uploaded yet.</td>
                </tr>
              ) : (
                // Table Rows
                uploadsData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border bg-white shadow-sm ${
                          item.fileType === 'XLSX' || item.fileType === 'CSV' ? 'border-emerald-100' :
                          item.fileType === 'PDF' ? 'border-red-100' : 'border-blue-100'
                        }`}>
                          {getFileIcon(item.fileType)}
                        </div>
                        <span className="font-heading font-bold text-[#090D18] text-[13px]">{item.fileName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getFileTypeBadgeStyles(item.fileType)}`}>
                        {item.fileType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-[11px] font-bold shadow-sm shrink-0">
                          {getAvatarInitials(item.uploaderName)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-heading font-bold text-[#090D18] text-[13px] truncate">{item.uploaderName}</div>
                          <div className="text-[11px] text-gray-500 font-medium truncate">{item.uploaderRole}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-[13px] font-semibold text-[#090D18]">{item.uploadedOnDate}</div>
                      <div className="text-[12px] text-gray-500 font-medium mt-0.5">{item.uploadedOnTime}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-heading font-bold text-[#090D18] text-[13px]">
                        {item.records}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border border-current/10 ${getStatusBadgeStyles(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-heading font-bold text-[#090D18] text-[13px]">
                        {item.sizeMB} MB
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2 opacity-100 group-hover:opacity-100">
                        {item.status === 'Processed' ? (
                          <button className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        ) : (
                          <button 
                            className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                            disabled
                            title="Retry"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 4 - Pagination */}
      {pagination && pagination.totalPages > 0 && (
        <div className="flex items-center justify-between pt-2 pb-8">
          <div className="text-[13px] font-medium text-gray-500">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} files
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
      
    </AppLayout>
  );
}
