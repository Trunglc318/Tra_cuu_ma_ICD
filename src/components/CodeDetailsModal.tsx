import { useState, useEffect } from "react";
import { X, Sparkles, AlertCircle, CheckCircle, FileText, Pill, ShieldAlert, Copy, RefreshCw } from "lucide-react";
import { MedicalCode } from "../data/medical_codes";

interface CodeDetailsModalProps {
  codeItem: MedicalCode | null;
  onClose: () => void;
}

export default function CodeDetailsModal({ codeItem, onClose }: CodeDetailsModalProps) {
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Reset state when code item changes
    setExplanation(null);
    setError(null);
    setCopied(false);
  }, [codeItem]);

  if (!codeItem) return null;

  const fetchAiExplanation = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/gemini/explain-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeItem.code,
          type: codeItem.type,
          name: codeItem.name
        })
      });
      if (!response.ok) {
        throw new Error("Lỗi khi tải thông tin giải thích từ Gemini API.");
      }
      const data = await response.json();
      setExplanation(data.explanation);
    } catch (err: any) {
      setError(err.message || "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getBadgeStyle = (type: string) => {
    switch (type) {
      case "icd10":
        return "bg-teal-50 text-teal-800 border-teal-100";
      case "yhct_disease":
        return "bg-emerald-50 text-emerald-800 border-emerald-100";
      case "yhct_procedure":
        return "bg-indigo-50 text-indigo-800 border-indigo-100";
      case "herb_tt06":
        return "bg-amber-50 text-amber-800 border-amber-100";
      default:
        return "bg-slate-50 text-slate-800 border-slate-100";
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "icd10":
        return "Mã Bệnh Hiện Đại (ICD-10)";
      case "yhct_disease":
        return "Bệnh Danh YHCT (QĐ 1849)";
      case "yhct_procedure":
        return "Thủ Thuật/DVKT (QĐ 1849)";
      case "herb_tt06":
        return "Dược Liệu/Vị Thuốc (TT 06)";
      default:
        return "Mã chuẩn hóa";
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-100 transition-all duration-300 transform scale-100">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-md border ${getBadgeStyle(codeItem.type)}`}>
              {getTypeName(codeItem.type)}
            </span>
            <span className="font-mono text-sm font-bold text-slate-500">#{codeItem.code}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-400 hover:text-slate-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Main Title */}
          <div>
            <h2 className="text-xl font-bold text-slate-800 font-display leading-snug">{codeItem.name}</h2>
            {codeItem.englishName && (
              <p className="text-sm text-slate-400 font-sans italic mt-1">{codeItem.englishName}</p>
            )}
          </div>

          {/* Quick specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Phân nhóm / Chương</span>
              <span className="text-xs font-medium text-slate-700 mt-1 block">{codeItem.category}</span>
            </div>
            {codeItem.mappingCode && (
              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                <span className="text-[10px] uppercase font-bold text-emerald-600 block tracking-wider">Mã ICD-10 đối chiếu</span>
                <span className="text-xs font-mono font-bold text-emerald-800 mt-1 block">#{codeItem.mappingCode}</span>
              </div>
            )}
          </div>

          {/* Guidelines and notes */}
          <div className="space-y-4">
            {codeItem.note && (
              <div className="flex gap-2.5 bg-sky-50/40 p-4 rounded-xl border border-sky-100/60 text-xs text-sky-800 leading-relaxed">
                <FileText className="h-4 w-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Hướng dẫn thanh toán BHYT</strong>
                  {codeItem.note}
                </div>
              </div>
            )}

            {codeItem.guideline && (
              <div className="flex gap-2.5 bg-teal-50/40 p-4 rounded-xl border border-teal-100/60 text-xs text-teal-800 leading-relaxed">
                <CheckCircle className="h-4 w-4 text-teal-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold block mb-0.5">Chỉ định / Tiêu chuẩn áp dụng</strong>
                  {codeItem.guideline}
                </div>
              </div>
            )}
          </div>

          {/* AI Explanation Area */}
          <div className="border-t border-slate-100 pt-5">
            {!explanation ? (
              <div className="text-center py-6 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <div className="inline-flex p-3 bg-teal-50 rounded-full text-teal-600 mb-3 animate-pulse">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">Cần phân tích chuyên sâu của Giám định viên?</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                  Sử dụng mô hình AI Gemini 3.5 để trích xuất điều kiện thanh toán, chống chỉ định, hồ sơ bệnh án chuẩn và các lỗi dễ xuất toán.
                </p>
                <button
                  onClick={fetchAiExplanation}
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Đang xử lý phân tích dữ liệu...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Giải trình chuyên sâu bằng AI Gemini
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-teal-700 font-semibold text-xs uppercase tracking-wider">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Báo cáo Phân tích Giám định AI Gemini
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(explanation)}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition flex items-center gap-1 text-[11px] font-medium"
                      title="Sao chép toàn bộ giải trình"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copied ? "Đã chép!" : "Sao chép"}
                    </button>
                    <button
                      onClick={fetchAiExplanation}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition flex items-center gap-1 text-[11px]"
                      title="Làm mới phân tích"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Styled explanation response */}
                <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl font-mono text-xs overflow-x-auto leading-relaxed max-h-[350px] overflow-y-auto whitespace-pre-wrap border border-slate-800 shadow-inner">
                  {explanation}
                </div>

                <div className="flex items-center gap-2 text-[10px] text-amber-600 bg-amber-50/50 p-3 rounded-lg border border-amber-100/60 leading-relaxed">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>
                    <b>Lưu ý:</b> Báo cáo AI chỉ mang tính chất tham khảo dựa trên tài liệu pháp luật hiện hành của Bộ Y Tế. Người dùng cần tự đối chiếu lại với văn bản gốc của Thông tư và Quyết định liên quan trước khi ký bệnh án.
                  </span>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-3 bg-rose-50 text-rose-800 p-3.5 rounded-xl text-xs border border-rose-100 flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium border border-slate-200 transition cursor-pointer"
          >
            Đóng cửa sổ
          </button>
        </div>

      </div>
    </div>
  );
}
