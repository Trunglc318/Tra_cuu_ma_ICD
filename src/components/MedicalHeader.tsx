import { Activity, ShieldCheck, FileText, HelpCircle } from "lucide-react";

export default function MedicalHeader() {
  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Branding & Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-teal-500 text-white p-2.5 rounded-xl shadow-md shadow-teal-500/10 flex items-center justify-center">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
              Mã Y Khoa Pro
              <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full font-medium font-sans">
                v1.2 (2026)
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-sans mt-0.5">
              Hệ thống tra cứu chẩn đoán & thanh toán BHYT chuẩn Bộ Y Tế
            </p>
          </div>
        </div>

        {/* Regulatory Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-100 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Thông tư <b>06/2026/TT-BYT</b></span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-100 text-xs">
            <FileText className="h-4 w-4 text-teal-600 shrink-0" />
            <span>Quyết định <b>1849/QĐ-BYT</b></span>
          </div>
          <div className="flex items-center gap-1.5 bg-sky-50 text-sky-800 px-3 py-1.5 rounded-lg border border-sky-100 text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>
            <span>BHYT Liên thông dữ liệu</span>
          </div>
        </div>
      </div>
    </header>
  );
}
