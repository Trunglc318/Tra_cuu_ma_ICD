import { useState, useMemo } from "react";
import { Search, Filter, Plus, FileSearch, ArrowRight, Eye } from "lucide-react";
import { MEDICAL_CODES, MedicalCode, MEDICAL_CATEGORIES } from "../data/medical_codes";

interface SearchPanelProps {
  onSelectCode: (code: MedicalCode) => void;
  onAddToCase: (code: MedicalCode) => void;
}

export default function SearchPanel({ onSelectCode, onAddToCase }: SearchPanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Get distinct categories for the selected type to populate second filter
  const categoriesList = useMemo(() => {
    if (selectedType === "all") {
      return Object.values(MEDICAL_CATEGORIES).flat();
    }
    return MEDICAL_CATEGORIES[selectedType as keyof typeof MEDICAL_CATEGORIES] || [];
  }, [selectedType]);

  // Filter and Search logic
  const filteredCodes = useMemo(() => {
    return MEDICAL_CODES.filter((item) => {
      // 1. Filter by type
      if (selectedType !== "all" && item.type !== selectedType) {
        return false;
      }
      // 2. Filter by category
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // 3. Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const codeMatch = item.code.toLowerCase().includes(query);
        const nameMatch = item.name.toLowerCase().includes(query);
        const engMatch = item.englishName?.toLowerCase().includes(query) || false;
        const mappingMatch = item.mappingCode?.toLowerCase().includes(query) || false;

        return codeMatch || nameMatch || engMatch || mappingMatch;
      }
      return true;
    });
  }, [searchQuery, selectedType, selectedCategory]);

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
        return "ICD-10";
      case "yhct_disease":
        return "Bệnh YHCT";
      case "yhct_procedure":
        return "Thủ thuật YHCT";
      case "herb_tt06":
        return "Thuốc TT06";
      default:
        return "Khác";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-4">
      {/* Header section */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="bg-teal-50 text-teal-700 p-2 rounded-lg">
            <FileSearch className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 font-display">Tra cứu nhanh danh mục</h3>
            <p className="text-[11px] text-slate-400 font-sans">Tìm kiếm tức thì theo Mã số hoặc Tên y học</p>
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
          {filteredCodes.length} kết quả
        </span>
      </div>

      {/* Inputs: Search & Filters */}
      <div className="space-y-3">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Nhập mã (M17, E11...) hoặc tên bệnh, vị thuốc..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-hidden focus:bg-white focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all"
          />
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Type Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 border border-slate-200 rounded-xl">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setSelectedCategory("all"); // Reset category filter
              }}
              className="w-full bg-transparent text-xs font-semibold text-slate-600 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Tất cả danh mục mã</option>
              <option value="icd10">Tây y (ICD-10)</option>
              <option value="yhct_disease">Bệnh danh YHCT (1849)</option>
              <option value="yhct_procedure">Thủ thuật / DVKT YHCT</option>
              <option value="herb_tt06">Dược liệu / Thuốc (TT06)</option>
            </select>
          </div>

          {/* Category Selector */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 border border-slate-200 rounded-xl">
            <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-transparent text-xs font-semibold text-slate-600 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Tất cả phân nhóm chương</option>
              {categoriesList.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat.length > 35 ? cat.substring(0, 35) + "..." : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="max-h-[380px] overflow-y-auto space-y-2 pr-1">
        {filteredCodes.length === 0 ? (
          <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
            <FileSearch className="h-8 w-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs font-medium">Không tìm thấy mã y khoa nào</p>
            <p className="text-[11px] mt-0.5">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        ) : (
          filteredCodes.map((item) => (
            <div
              key={item.code}
              className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/40 transition-all shadow-2xs hover:shadow-xs"
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Code badge */}
                <div className="shrink-0 flex flex-col items-center">
                  <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-1 rounded-md min-w-[70px] text-center border border-slate-200">
                    {item.code}
                  </span>
                  <span className={`text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full mt-1 border ${getBadgeStyle(item.type)}`}>
                    {getTypeName(item.type)}
                  </span>
                </div>

                {/* Name and context */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-teal-700 transition-colors line-clamp-2">
                    {item.name}
                  </h4>
                  {item.mappingCode && (
                    <span className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-100/60 rounded px-1.5 py-0.2 mt-1">
                      Đối chiếu: #{item.mappingCode}
                    </span>
                  )}
                  <span className="block text-[10px] text-slate-400 mt-1 truncate">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 shrink-0 ml-3">
                <button
                  onClick={() => onSelectCode(item)}
                  className="p-2 hover:bg-slate-200/60 rounded-lg text-slate-500 hover:text-slate-700 transition cursor-pointer"
                  title="Xem chi tiết & giải trình AI"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onAddToCase(item)}
                  className="p-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition cursor-pointer"
                  title="Thêm vào HS bệnh án"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
