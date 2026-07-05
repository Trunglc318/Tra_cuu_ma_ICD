import { useState } from "react";
import { Sparkles, BrainCircuit, Activity, Heart, ArrowRight, Plus, RefreshCw, ClipboardCheck, Info, FileText, AlertCircle } from "lucide-react";
import { AiSearchResult } from "../types";
import { MedicalCode } from "../data/medical_codes";

interface AiAssistantPanelProps {
  onSelectCode: (code: MedicalCode) => void;
  onAddToCase: (code: MedicalCode) => void;
}

const PRESET_CLINICAL_CASES = [
  {
    title: "Tăng huyết áp + Mất ngủ (Huyễn vựng)",
    desc: "Bệnh nhân nữ 54 tuổi, thường xuyên đau đầu chóng mặt, huyết áp đo tại nhà dao động 150/90 mmHg. Người mệt mỏi, mất ngủ kéo dài, ăn uống kém, lưỡi nhợt, rêu trắng mỏng, mạch huyễn."
  },
  {
    title: "Đau dây thần kinh tọa + Thoát vị đĩa đệm (Yêu thống)",
    desc: "Bệnh nhân nam 45 tuổi, đau thắt lưng lan dọc xuống chân trái kèm cảm giác tê bì cơ đùi. Đau tăng khi cúi người hoặc vận động nặng. Thận hư hàn, chân tay lạnh, lưỡi bệu có dấu răng, mạch trầm trì."
  },
  {
    title: "Thoái hóa khớp gối + Viêm dạ dày (Hạc tất phong)",
    desc: "Bệnh nhân nữ 68 tuổi, sưng đau khớp gối phải kèm nóng đỏ nhẹ, đau âm ỉ vùng thượng vị mỗi khi đói. Tiền sử loét dạ dày cũ. Thể tỳ vị hư hàn, mạch nhu hoãn."
  }
];

const LOADING_MED_TIPS = [
  "Đang phân tích lâm sàng... Hãy nhớ ghi nhận đầy đủ Vọng, Văn, Vấn, Thiết trong hồ sơ để BHYT thanh toán dịch vụ châm cứu.",
  "Đang truy xuất mã Quyết định 1849... Lưu ý các kỹ thuật Điện châm chỉ được thanh toán tối đa 15 ngày một đợt ngoại trú.",
  "Đang lập đối chiếu Tây y và Đông y... Chẩn đoán kèm theo cực kỳ quan trọng để bác sĩ chỉ định các vị thuốc bổ trợ.",
  "Đang chuẩn hóa vị thuốc theo Thông tư 06... Vị thuốc Nhân sâm cần ghi nhận chỉ định đặc biệt suy kiệt nặng để được chi trả."
];

export default function AiAssistantPanel({ onSelectCode, onAddToCase }: AiAssistantPanelProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiSearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tipIndex, setTipIndex] = useState(0);

  const handleAiSearch = async (textToSearch: string) => {
    if (!textToSearch.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    // Rotate loading tips during processing
    let currentTip = 0;
    const interval = setInterval(() => {
      currentTip = (currentTip + 1) % LOADING_MED_TIPS.length;
      setTipIndex(currentTip);
    }, 4500);

    try {
      const response = await fetch("/api/gemini/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: textToSearch })
      });
      if (!response.ok) {
        throw new Error("Lỗi kết nối máy chủ hoặc GEMINI_API_KEY chưa được cấu hình.");
      }
      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi khi AI phân tích hồ sơ bệnh án.");
    } finally {
      clearInterval(interval);
      setLoading(false);
    }
  };

  const handleSelectPreset = (desc: string) => {
    setQuery(desc);
  };

  const handleAddToCaseWrapper = (code: string, name: string, type: 'icd10' | 'yhct_disease' | 'yhct_procedure' | 'herb_tt06', mappingCode?: string) => {
    const virtualCode: MedicalCode = {
      code,
      name,
      type,
      category: "Gợi ý từ Trợ lý AI",
      mappingCode,
      note: "Do AI đề xuất dựa trên phân tích hồ sơ lâm sàng."
    };
    onAddToCase(virtualCode);
  };

  const handleViewCodeDetailsWrapper = (code: string, name: string, type: 'icd10' | 'yhct_disease' | 'yhct_procedure' | 'herb_tt06', mappingCode?: string) => {
    const virtualCode: MedicalCode = {
      code,
      name,
      type,
      category: "Gợi ý từ Trợ lý AI",
      mappingCode,
      note: "Chẩn đoán được đề xuất bởi trí tuệ nhân tạo Gemini."
    };
    onSelectCode(virtualCode);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
        <div className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-2.5 rounded-lg shadow-sm">
          <BrainCircuit className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800 font-display">Trợ lý mã hóa AI Gemini</h3>
          <p className="text-[11px] text-slate-400 font-sans">Phân tích tóm tắt hồ sơ, tự động gợi ý mã ICD-10 & QĐ 1849</p>
        </div>
      </div>

      {/* Input query and presets */}
      <div className="space-y-3">
        <div>
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Mô tả triệu chứng & Bệnh sử lâm sàng
          </label>
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ví dụ: Bệnh nhân nam 62 tuổi, tiền sử đái tháo đường, vào viện vì đau lưng ê ẩm kéo dài lan xuống hông, hai chân tê mỏi lạnh buốt về đêm, lưỡi bệu nhợt rêu mỏng..."
            rows={4}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all leading-relaxed"
          />
        </div>

        {/* Preset quick buttons */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Các trường hợp lâm sàng mẫu
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_CLINICAL_CASES.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.desc)}
                className="text-[10.5px] bg-slate-100 hover:bg-slate-200/80 text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200/40 font-medium transition cursor-pointer"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Submit action */}
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={() => handleAiSearch(query)}
            disabled={loading || !query.trim()}
            className="bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-semibold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Đang xử lý thông tin...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                AI Phân tích & Đề xuất mã
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading overlay/state */}
      {loading && (
        <div className="py-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-5 space-y-4 animate-pulse">
          <div className="inline-flex p-3 bg-teal-50 rounded-full text-teal-600 animate-spin">
            <RefreshCw className="h-7 w-7" />
          </div>
          <div className="max-w-md mx-auto">
            <h4 className="text-xs font-bold text-slate-700 font-display uppercase tracking-wider">Trí tuệ nhân tạo đang làm việc</h4>
            <p className="text-[11px] text-slate-500 mt-2 italic leading-relaxed">
              &ldquo;{LOADING_MED_TIPS[tipIndex]}&rdquo;
            </p>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl text-xs text-rose-800 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block mb-0.5">Không thể xử lý yêu cầu</strong>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* AI Result View */}
      {result && (
        <div className="space-y-5 border-t border-slate-100 pt-5 animate-fade-in">
          
          {/* Clinical summary and diagnosis analysis */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1.5 uppercase tracking-wider">
              <Activity className="h-3.5 w-3.5 text-teal-600" />
              Tóm tắt Phân tích Bệnh Án
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">{result.clinicalAnalysis}</p>
          </div>

          {/* ICD-10 suggestions */}
          <div className="space-y-2">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              1. Chẩn đoán lâm sàng đề xuất (ICD-10)
            </h5>
            <div className="space-y-1.5">
              {result.icd10Diagnoses.map((diag) => (
                <div key={diag.code} className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-3xs">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                        {diag.code}
                      </span>
                      <strong className="text-xs font-bold text-slate-800">{diag.name}</strong>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 font-sans italic leading-relaxed">
                      <b>Cơ sở chọn:</b> {diag.reason}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 ml-2">
                    <button
                      onClick={() => handleViewCodeDetailsWrapper(diag.code, diag.name, "icd10")}
                      className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 text-[10.5px] font-medium"
                    >
                      Chi tiết
                    </button>
                    <button
                      onClick={() => handleAddToCaseWrapper(diag.code, diag.name, "icd10")}
                      className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded transition cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Traditional medicine diseases suggestions */}
          {result.yhctDiseases && result.yhctDiseases.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                2. Bệnh danh Đông Y đối chiếu tương đương (QĐ 1849)
              </h5>
              <div className="space-y-1.5">
                {result.yhctDiseases.map((diag) => (
                  <div key={diag.code} className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-3xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                          {diag.code}
                        </span>
                        <strong className="text-xs font-bold text-slate-800">{diag.name}</strong>
                        <span className="text-[10px] text-slate-400 font-sans">
                          (Được ánh xạ tương đương ICD-10: <b>#{diag.mappingCode}</b>)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 font-sans leading-relaxed">
                        <b>Biện chứng luận trị:</b> {diag.reason}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={() => handleViewCodeDetailsWrapper(diag.code, diag.name, "yhct_disease", diag.mappingCode)}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 text-[10.5px] font-medium"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleAddToCaseWrapper(diag.code, diag.name, "yhct_disease", diag.mappingCode)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded transition cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Procedures under QD 1849 */}
          {result.yhctProcedures && result.yhctProcedures.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                3. Chỉ định Thủ thuật / Dịch vụ kỹ thuật khuyên dùng
              </h5>
              <div className="space-y-1.5">
                {result.yhctProcedures.map((proc, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-3xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                          {proc.code}
                        </span>
                        <strong className="text-xs font-bold text-slate-800">{proc.name}</strong>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        <b>Mục đích trị liệu:</b> {proc.indication}
                      </p>
                      <p className="text-[10.5px] text-indigo-700 bg-indigo-50/40 p-2 rounded-lg border border-indigo-100/40 mt-1.5 font-sans leading-relaxed flex gap-1.5">
                        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-indigo-500" />
                        <span><b>Căn cứ BHYT:</b> {proc.billingNote}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={() => handleViewCodeDetailsWrapper(proc.code, proc.name, "yhct_procedure")}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 text-[10.5px] font-medium"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleAddToCaseWrapper(proc.code, proc.name, "yhct_procedure")}
                        className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded transition cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Herbs and remedies under TT 06 */}
          {result.herbs && result.herbs.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                4. Đề xuất vị thuốc / thảo dược phù hợp (TT 06/2026/TT-BYT)
              </h5>
              <div className="space-y-1.5">
                {result.herbs.map((herb, idx) => (
                  <div key={idx} className="flex items-start justify-between p-3 rounded-xl border border-slate-100 bg-white shadow-3xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          {herb.code}
                        </span>
                        <strong className="text-xs font-bold text-slate-800">{herb.name}</strong>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        <b>Chủ trị:</b> {herb.purpose}
                      </p>
                      <p className="text-[10.5px] text-amber-800 bg-amber-50/40 p-2 rounded-lg border border-amber-100/40 mt-1.5 font-sans leading-relaxed flex gap-1.5">
                        <Info className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                        <span><b>Thanh toán:</b> {herb.billingNote}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 ml-2">
                      <button
                        onClick={() => handleViewCodeDetailsWrapper(herb.code, herb.name, "herb_tt06")}
                        className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 text-[10.5px] font-medium"
                      >
                        Chi tiết
                      </button>
                      <button
                        onClick={() => handleAddToCaseWrapper(herb.code, herb.name, "herb_tt06")}
                        className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded transition cursor-pointer"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Billing Tips for medical insurance avoidance of claim rejections */}
          <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
              <ClipboardCheck className="h-4 w-4 text-emerald-600 animate-pulse" />
              Khuyến cáo giám định & phòng ngừa xuất toán (BHYT)
            </h4>
            <p className="text-xs text-emerald-700 leading-relaxed font-sans font-medium">{result.billingTips}</p>
          </div>

        </div>
      )}

    </div>
  );
}
