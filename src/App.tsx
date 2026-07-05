import { useState } from "react";
import MedicalHeader from "./components/MedicalHeader";
import SearchPanel from "./components/SearchPanel";
import AiAssistantPanel from "./components/AiAssistantPanel";
import NotepadPanel from "./components/NotepadPanel";
import CodeDetailsModal from "./components/CodeDetailsModal";
import { PatientCase } from "./types";
import { MedicalCode } from "./data/medical_codes";
import { Sparkles, FileSearch, Heart, Info, Landmark, HelpCircle, GraduationCap } from "lucide-react";

export default function App() {
  const [selectedCodeItem, setSelectedCodeItem] = useState<MedicalCode | null>(null);
  
  const [patientCase, setPatientCase] = useState<PatientCase>({
    id: "case_" + Math.random().toString(36).substr(2, 9),
    patientName: "",
    insuranceId: "",
    diagnoses: [],
    procedures: [],
    herbs: [],
    createdAt: new Date().toISOString()
  });

  const [activeTab, setActiveTab] = useState<'ai' | 'search'>('ai');

  // Add an item to the patient case
  const handleAddToCase = (codeItem: MedicalCode) => {
    setPatientCase(prev => {
      const updated = { ...prev };
      
      if (codeItem.type === 'icd10' || codeItem.type === 'yhct_disease') {
        const exists = updated.diagnoses.some(d => d.code === codeItem.code);
        if (!exists) {
          updated.diagnoses = [...updated.diagnoses, codeItem];
        }
      } else if (codeItem.type === 'yhct_procedure') {
        const exists = updated.procedures.some(p => p.code === codeItem.code);
        if (!exists) {
          updated.procedures = [...updated.procedures, codeItem];
        }
      } else if (codeItem.type === 'herb_tt06') {
        const exists = updated.herbs.some(h => h.code === codeItem.code);
        if (!exists) {
          updated.herbs = [...updated.herbs, codeItem];
        }
      }
      
      return updated;
    });
  };

  // Remove an item from the patient case
  const handleRemoveItem = (code: string, type: 'icd10' | 'yhct_disease' | 'yhct_procedure' | 'herb_tt06') => {
    setPatientCase(prev => {
      const updated = { ...prev };
      
      if (type === 'icd10' || type === 'yhct_disease') {
        updated.diagnoses = updated.diagnoses.filter(d => d.code !== code);
      } else if (type === 'yhct_procedure') {
        updated.procedures = updated.procedures.filter(p => p.code !== code);
      } else if (type === 'herb_tt06') {
        updated.herbs = updated.herbs.filter(h => h.code !== code);
      }
      
      return updated;
    });
  };

  // Reset current patient case
  const handleReset = () => {
    setPatientCase({
      id: "case_" + Math.random().toString(36).substr(2, 9),
      patientName: "",
      insuranceId: "",
      diagnoses: [],
      procedures: [],
      herbs: [],
      createdAt: new Date().toISOString(),
      customNotes: ""
    });
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      
      {/* Dynamic Header */}
      <MedicalHeader />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: AI Assistant and Manual Search Panels (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Tabs Controller */}
            <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-2xs flex gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('ai')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'ai'
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm shadow-teal-600/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <Sparkles className="h-4 w-4" />
                Trợ lý Thông minh AI Gemini
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${activeTab === 'ai' ? "bg-white/20 text-white" : "bg-teal-50 text-teal-700"}`}>
                  Khuyên dùng
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('search')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'search'
                    ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-sm shadow-teal-600/10"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <FileSearch className="h-4 w-4" />
                Tra cứu Danh mục Thủ công
                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                  Ngoại tuyến
                </span>
              </button>
            </div>

            {/* Render selected search utility */}
            {activeTab === 'ai' ? (
              <AiAssistantPanel 
                onSelectCode={setSelectedCodeItem}
                onAddToCase={handleAddToCase}
              />
            ) : (
              <SearchPanel 
                onSelectCode={setSelectedCodeItem}
                onAddToCase={handleAddToCase}
              />
            )}

            {/* Extra Education Card about new Medical Circular laws in Vietnam */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600 shrink-0">
                  <Landmark className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Thông tư 06/2026/TT-BYT</h4>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed mt-1 font-sans">
                    Quy định chi tiết điều kiện thanh toán BHYT cho các vị thuốc cổ truyền, tỷ lệ chi trả vị sâm, dược liệu quý.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-teal-50 rounded-lg text-teal-600 shrink-0">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Quyết định 1849/QĐ-BYT</h4>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed mt-1 font-sans">
                    Quy định bảng mã tương đương Đông - Tây y. Cho phép ánh xạ trực tiếp mã y học cổ truyền sang mã ICD-10 liên thông.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-sky-50 rounded-lg text-sky-600 shrink-0">
                  <HelpCircle className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-display">Ngăn chặn xuất toán</h4>
                  <p className="text-[10.5px] text-slate-500 leading-relaxed mt-1 font-sans">
                    AI tự động kiểm tra sự tương quan bệnh án, đưa ra ghi chú lâm sàng cần thiết trong hồ sơ để phòng tránh thanh tra từ chối.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Persistent Interactive Patient Case Notepad (col-span-5) */}
          <div className="lg:col-span-5">
            <NotepadPanel 
              patientCase={patientCase}
              setPatientCase={setPatientCase}
              onRemoveItem={handleRemoveItem}
              onReset={handleReset}
            />
          </div>

        </div>
      </main>

      {/* Code Details & AI Explanation Modal */}
      <CodeDetailsModal 
        codeItem={selectedCodeItem}
        onClose={() => setSelectedCodeItem(null)}
      />

      {/* Footer bar */}
      <footer className="bg-white border-t border-slate-100 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 font-sans">
          <p>© 2026 Mã Y Khoa Pro. Hệ thống được tinh chỉnh và giám sát bởi Bộ Y Tế Việt Nam.</p>
          <div className="flex items-center gap-1">
            <span>Phát triển với sự tận tâm bởi</span>
            <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500" />
            <span className="font-semibold text-slate-500">Bác sĩ & Lập trình viên Việt Nam</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
