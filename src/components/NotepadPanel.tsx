import { useState, useMemo, Dispatch, SetStateAction } from "react";
import { PatientCase } from "../types";
import { MedicalCode } from "../data/medical_codes";
import { Clipboard, Printer, Trash2, User, FileText, Sparkles, Check, DollarSign, Calculator } from "lucide-react";

interface NotepadPanelProps {
  patientCase: PatientCase;
  setPatientCase: Dispatch<SetStateAction<PatientCase>>;
  onRemoveItem: (code: string, type: 'icd10' | 'yhct_disease' | 'yhct_procedure' | 'herb_tt06') => void;
  onReset: () => void;
}

export default function NotepadPanel({ patientCase, setPatientCase, onRemoveItem, onReset }: NotepadPanelProps) {
  const [patientName, setPatientName] = useState(patientCase.patientName);
  const [insuranceId, setInsuranceId] = useState(patientCase.insuranceId);
  const [customNotes, setCustomNotes] = useState(patientCase.customNotes || "");
  const [copied, setCopied] = useState(false);

  // Maintain separate local price mapping for services and herbal weight/prices
  const [servicePrices, setServicePrices] = useState<Record<string, number>>({
    "DVKT.1849.01": 85000,  // Điện châm default
    "DVKT.1849.02": 120000, // Thủy châm
    "DVKT.1849.03": 45000,  // Cứu ngải
    "DVKT.1849.04": 90000,  // Xoa bóp bấm huyệt
    "DVKT.1849.05": 35000,  // Giác hơi
    "DVKT.1849.06": 40000,  // Ngâm chân
    "DVKT.1849.07": 110000, // Xông hơi
    "DVKT.1849.08": 50000   // Đắp thuốc
  });

  const [herbWeights, setHerbWeights] = useState<Record<string, number>>({}); // weight in grams, default 10g
  const [herbPrices, setHerbPrices] = useState<Record<string, number>>({
    "TT06.HERB.01": 4500, // ginseng per gram
    "TT06.HERB.02": 1500, // đương quy per gram
    "TT06.HERB.03": 1800, // hoàng kỳ per gram
    "TT06.HERB.04": 1200, // đan sâm
    "TT06.HERB.05": 800,  // kim ngân hoa
    "TT06.HERB.06": 1000, // bạch truật
    "TT06.HERB.07": 1400, // thục địa
    "TT06.HERB.08": 600   // cam thảo
  });

  const updateServicePrice = (code: string, price: number) => {
    setServicePrices(prev => ({ ...prev, [code]: price }));
  };

  const updateHerbWeight = (code: string, weight: number) => {
    setHerbWeights(prev => ({ ...prev, [code]: weight }));
  };

  const updateHerbPrice = (code: string, price: number) => {
    setHerbPrices(prev => ({ ...prev, [code]: price }));
  };

  // Calculate dynamic costs
  const totals = useMemo(() => {
    let serviceCost = 0;
    patientCase.procedures.forEach(proc => {
      serviceCost += servicePrices[proc.code] || 0;
    });

    let herbCost = 0;
    patientCase.herbs.forEach(herb => {
      const weight = herbWeights[herb.code] !== undefined ? herbWeights[herb.code] : 10; // default 10g
      const ppg = herbPrices[herb.code] || 500;
      herbCost += weight * ppg;
    });

    return {
      serviceCost,
      herbCost,
      total: serviceCost + herbCost
    };
  }, [patientCase, servicePrices, herbWeights, herbPrices]);

  // Format currency in VND
  const formatVND = (value: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(value);
  };

  // Build raw slate text to copy to HIS terminal
  const buildSlateText = () => {
    let text = `==================================================\n`;
    text += `BẢNG TỔNG HỢP MÃ CHẨN ĐOÁN & CHI PHÍ BHYT (TT 06 & QĐ 1849)\n`;
    text += `==================================================\n`;
    text += `Bệnh nhân: ${patientName || "Chưa nhập họ tên"}\n`;
    text += `Mã số thẻ BHYT: ${insuranceId || "Chưa nhập mã thẻ"}\n`;
    text += `Ngày lập: ${new Date().toLocaleDateString("vi-VN")}\n`;
    text += `Ghi chú lâm sàng: ${customNotes || "Không có"}\n\n`;

    text += `[1] CHẨN ĐOÁN LÂM SÀNG:\n`;
    if (patientCase.diagnoses.length === 0) {
      text += ` - (Chưa chỉ định mã chẩn đoán)\n`;
    } else {
      patientCase.diagnoses.forEach(diag => {
        text += ` - Mã: ${diag.code} | ${diag.name} ${diag.mappingCode ? `(Ánh xạ YHCT tương đương: #${diag.mappingCode})` : ""}\n`;
      });
    }
    text += `\n`;

    text += `[2] DỊCH VỤ KỸ THUẬT & THỦ THUẬT (QĐ 1849):\n`;
    if (patientCase.procedures.length === 0) {
      text += ` - (Chưa chỉ định dịch vụ kỹ thuật)\n`;
    } else {
      patientCase.procedures.forEach(proc => {
        const price = servicePrices[proc.code] || 0;
        text += ` - Mã: ${proc.code} | ${proc.name} | Chi phí BHYT: ${formatVND(price)}\n`;
      });
    }
    text += `\n`;

    text += `[3] THUỐC & DƯỢC LIỆU ÁP DỤNG (TT 06):\n`;
    if (patientCase.herbs.length === 0) {
      text += ` - (Chưa chỉ định vị thuốc)\n`;
    } else {
      patientCase.herbs.forEach(herb => {
        const weight = herbWeights[herb.code] !== undefined ? herbWeights[herb.code] : 10;
        const price = herbPrices[herb.code] || 0;
        text += ` - Mã: ${herb.code} | ${herb.name} | Định lượng: ${weight}g | Đơn giá: ${formatVND(price)}/g | Tổng: ${formatVND(weight * price)}\n`;
      });
    }
    text += `\n`;

    text += `==================================================\n`;
    text += `TỔNG CHI PHÍ DANH MỤC BHYT ĐỀ XUẤT:\n`;
    text += ` - Chi phí Dịch vụ kỹ thuật: ${formatVND(totals.serviceCost)}\n`;
    text += ` - Chi phí Thuốc & Dược liệu: ${formatVND(totals.herbCost)}\n`;
    text += ` => TỔNG CỘNG THANH TOÁN BHYT: ${formatVND(totals.total)}\n`;
    text += `==================================================\n`;
    text += `* Lập hồ sơ tự động từ Ứng dụng Mã Y Khoa Pro - TT06 & QD1849`;

    return text;
  };

  const handleCopy = () => {
    const text = buildSlateText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    // Generate a printable window
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Vui lòng cho phép mở popup để xem trang in.");
      return;
    }

    const htmlContent = `
      <html>
        <head>
          <title>Bản in kê khai thanh toán y khoa BHYT</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; padding: 40px; color: #333; line-height: 1.5; }
            h1, h2 { text-align: center; margin-bottom: 5px; }
            h1 { font-size: 20px; text-transform: uppercase; }
            h2 { font-size: 14px; font-weight: normal; font-style: italic; margin-bottom: 25px; }
            .meta-table, .data-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .meta-table td { padding: 5px 0; font-size: 14px; }
            .data-table th, .data-table td { border: 1px solid #333; padding: 8px; font-size: 13px; text-align: left; }
            .data-table th { background-color: #f2f2f2; font-weight: bold; }
            .total-section { font-size: 14px; font-weight: bold; text-align: right; margin-top: 20px; }
            .signature-section { margin-top: 40px; display: flex; justify-content: space-between; }
            .signature-box { text-align: center; width: 200px; font-size: 13px; }
            .signature-box .title { font-weight: bold; margin-bottom: 60px; }
          </style>
        </head>
        <body>
          <h2>SỞ Y TẾ TỈNH/THÀNH PHỐ</h2>
          <h1>BẢNG TỔNG HỢP KÊ KHAI CHI PHÍ ĐIỀU TRỊ BHYT</h1>
          <h2>(Theo Thông tư 06/2026/TT-BYT & Quyết định 1849/QĐ-BYT)</h2>

          <table class="meta-table">
            <tr>
              <td><b>Họ và tên bệnh nhân:</b> ${patientName || "......................................................."}</td>
              <td><b>Mã thẻ BHYT:</b> ${insuranceId || "........................................."}</td>
            </tr>
            <tr>
              <td><b>Ngày lập bảng kê:</b> ${new Date().toLocaleDateString("vi-VN")}</td>
              <td><b>Trạng thái lâm sàng:</b> ${customNotes || "........................................."}</td>
            </tr>
          </table>

          <h3>I. DANH MỤC MÃ BỆNH TẬT CHẨN ĐOÁN (ICD-10)</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 15%">Mã ICD-10</th>
                <th>Tên bệnh chẩn đoán</th>
                <th style="width: 30%">Mã đối chiếu Đông Y (QĐ 1849)</th>
              </tr>
            </thead>
            <tbody>
              ${patientCase.diagnoses.length === 0 ? "<tr><td colspan='3' style='text-align:center;'>Chưa ghi nhận chẩn đoán</td></tr>" : 
                patientCase.diagnoses.map(diag => `
                  <tr>
                    <td><b>${diag.code}</b></td>
                    <td>${diag.name}</td>
                    <td>${diag.mappingCode ? diag.mappingCode : "Không"}</td>
                  </tr>
                `).join("")
              }
            </tbody>
          </table>

          <h3>II. DANH MỤC THỦ THUẬT / DỊCH VỤ KỸ THUẬT (QĐ 1849/QĐ-BYT)</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 15%">Mã DVKT</th>
                <th>Tên quy trình thủ thuật kỹ thuật</th>
                <th style="width: 25%; text-align: right">Đơn giá BHYT chi trả</th>
              </tr>
            </thead>
            <tbody>
              ${patientCase.procedures.length === 0 ? "<tr><td colspan='3' style='text-align:center;'>Chưa chỉ định thủ thuật</td></tr>" : 
                patientCase.procedures.map(proc => `
                  <tr>
                    <td><b>${proc.code}</b></td>
                    <td>${proc.name}</td>
                    <td style="text-align: right">${formatVND(servicePrices[proc.code] || 0)}</td>
                  </tr>
                `).join("")
              }
            </tbody>
          </table>

          <h3>III. DANH MỤC THUỐC / VỊ THUỐC THẢO DƯỢC (TT 06/2026/TT-BYT)</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th style="width: 15%">Mã vị thuốc</th>
                <th>Tên vị thuốc / Thảo dược cổ truyền</th>
                <th style="width: 15%; text-align: center">Liều lượng</th>
                <th style="width: 20%; text-align: right">Đơn giá (/g)</th>
                <th style="width: 20%; text-align: right">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${patientCase.herbs.length === 0 ? "<tr><td colspan='5' style='text-align:center;'>Chưa chỉ định vị thuốc</td></tr>" : 
                patientCase.herbs.map(herb => {
                  const weight = herbWeights[herb.code] !== undefined ? herbWeights[herb.code] : 10;
                  const price = herbPrices[herb.code] || 0;
                  return `
                    <tr>
                      <td><b>${herb.code}</b></td>
                      <td>${herb.name}</td>
                      <td style="text-align: center">${weight}g</td>
                      <td style="text-align: right">${formatVND(price)}</td>
                      <td style="text-align: right">${formatVND(weight * price)}</td>
                    </tr>
                  `;
                }).join("")
              }
            </tbody>
          </table>

          <div class="total-section">
            <p>Tổng chi phí Thủ thuật: ${formatVND(totals.serviceCost)}</p>
            <p>Tổng chi phí Dược liệu: ${formatVND(totals.herbCost)}</p>
            <p style="font-size: 16px; color: #0f172a; margin-top: 5px;">TỔNG CỘNG CHI PHÍ BHYT: ${formatVND(totals.total)}</p>
          </div>

          <div class="signature-section">
            <div class="signature-box">
              <div class="title">BỆNH NHÂN / NGƯỜI ĐẠI DIỆN</div>
              <div>(Ký, ghi rõ họ tên)</div>
            </div>
            <div class="signature-box">
              <div class="title">GIÁM ĐỊNH VIÊN BHYT</div>
              <div>(Ký, đóng dấu xác nhận)</div>
            </div>
            <div class="signature-box">
              <div class="title">BÁC SĨ ĐIỀU TRỊ</div>
              <div>(Ký, ghi rõ họ tên)</div>
            </div>
          </div>

          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const handlePatientInfoChange = (name: string, insId: string, notes: string) => {
    setPatientName(name);
    setInsuranceId(insId);
    setCustomNotes(notes);

    setPatientCase(prev => ({
      ...prev,
      patientName: name,
      insuranceId: insId,
      customNotes: notes
    }));
  };

  return (
    <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-5 shadow-lg space-y-5 sticky top-24">
      {/* Header section with notepad indicators */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="bg-teal-500 text-slate-900 p-2 rounded-lg">
            <FileText className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display text-slate-100">Hồ sơ bệnh án & Thanh toán</h3>
            <p className="text-[10px] text-slate-400 font-sans">Lập bảng kê BHYT điện tử tức thì</p>
          </div>
        </div>
        <button
          onClick={onReset}
          className="text-[10.5px] text-slate-400 hover:text-rose-400 transition flex items-center gap-1 font-semibold bg-slate-800/60 px-2.5 py-1.5 rounded-lg border border-slate-800 cursor-pointer"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Xóa trắng
        </button>
      </div>

      {/* Patient info inputs */}
      <div className="space-y-3 bg-slate-800/40 p-4 rounded-xl border border-slate-800/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Họ tên bệnh nhân
            </label>
            <div className="relative">
              <User className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                value={patientName}
                onChange={(e) => handlePatientInfoChange(e.target.value, insuranceId, customNotes)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
          <div>
            <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
              Mã thẻ BHYT
            </label>
            <div className="relative">
              <Clipboard className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-500" />
              <input
                type="text"
                placeholder="GD40101XXXXXXXX"
                value={insuranceId}
                onChange={(e) => handlePatientInfoChange(patientName, e.target.value, customNotes)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
              />
            </div>
          </div>
        </div>
        <div>
          <label className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block mb-1">
            Ghi chú diễn tiến lâm sàng
          </label>
          <input
            type="text"
            placeholder="Huyết áp ổn định, khớp gối bớt sưng, thể hàn tà..."
            value={customNotes}
            onChange={(e) => handlePatientInfoChange(patientName, insuranceId, e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-hidden focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Structured added lists */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
        
        {/* Added Diagnoses */}
        <div className="space-y-1.5">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block">
            Chẩn đoán y khoa ({patientCase.diagnoses.length})
          </span>
          {patientCase.diagnoses.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic pl-1">Chưa thêm chẩn đoán nào vào bệnh án...</p>
          ) : (
            patientCase.diagnoses.map((diag) => (
              <div key={diag.code} className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-850 text-xs">
                <div className="min-w-0 flex-1 flex items-center gap-2">
                  <span className="font-mono font-bold text-[10px] text-teal-400 bg-teal-950/50 border border-teal-900/60 px-1 py-0.2 rounded shrink-0">
                    {diag.code}
                  </span>
                  <span className="truncate font-semibold text-slate-200">{diag.name}</span>
                </div>
                <button
                  onClick={() => onRemoveItem(diag.code, diag.type)}
                  className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400 transition shrink-0 cursor-pointer ml-2"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Added Procedures */}
        <div className="space-y-1.5">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block">
            Dịch vụ kỹ thuật (QĐ 1849) ({patientCase.procedures.length})
          </span>
          {patientCase.procedures.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic pl-1">Chưa chọn thủ thuật nào...</p>
          ) : (
            patientCase.procedures.map((proc) => {
              const price = servicePrices[proc.code] !== undefined ? servicePrices[proc.code] : 0;
              return (
                <div key={proc.code} className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-850 text-xs gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[10px] text-indigo-400 bg-indigo-950/50 border border-indigo-900/60 px-1 py-0.2 rounded shrink-0">
                        {proc.code}
                      </span>
                      <span className="truncate font-semibold text-slate-200">{proc.name}</span>
                    </div>
                  </div>
                  {/* Price adjustment */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => updateServicePrice(proc.code, parseInt(e.target.value) || 0)}
                      className="w-[80px] bg-slate-900 border border-slate-800 text-right rounded px-1.5 py-0.5 text-[10.5px] font-mono text-indigo-300 font-bold focus:outline-hidden focus:border-indigo-500"
                    />
                    <span className="text-[10px] text-slate-400 font-sans">đ</span>
                    <button
                      onClick={() => onRemoveItem(proc.code, proc.type)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400 transition shrink-0 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Added Herbs */}
        <div className="space-y-1.5">
          <span className="text-[9.5px] uppercase font-bold text-slate-400 tracking-wider block">
            Vị thuốc đông y (TT 06) ({patientCase.herbs.length})
          </span>
          {patientCase.herbs.length === 0 ? (
            <p className="text-[10px] text-slate-500 italic pl-1">Chưa chọn vị thuốc nào...</p>
          ) : (
            patientCase.herbs.map((herb) => {
              const weight = herbWeights[herb.code] !== undefined ? herbWeights[herb.code] : 10;
              const price = herbPrices[herb.code] !== undefined ? herbPrices[herb.code] : 0;
              return (
                <div key={herb.code} className="flex flex-col p-2 bg-slate-950 rounded-lg border border-slate-850 text-xs gap-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-mono font-bold text-[10px] text-amber-400 bg-amber-950/50 border border-amber-900/60 px-1 py-0.2 rounded shrink-0">
                        {herb.code}
                      </span>
                      <span className="truncate font-semibold text-slate-200">{herb.name}</span>
                    </div>
                    <button
                      onClick={() => onRemoveItem(herb.code, herb.type)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-500 hover:text-rose-400 transition shrink-0 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {/* weight & price configuration per herb */}
                  <div className="flex items-center justify-between gap-2 border-t border-slate-800/40 pt-1.5">
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-slate-400 font-sans">Lượng:</span>
                      <input
                        type="number"
                        value={weight}
                        onChange={(e) => updateHerbWeight(herb.code, parseInt(e.target.value) || 0)}
                        className="w-[45px] bg-slate-900 border border-slate-800 text-center rounded py-0.5 text-[10.5px] font-mono text-amber-300 font-bold focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400 font-sans">g</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-slate-400 font-sans">Đơn giá:</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => updateHerbPrice(herb.code, parseInt(e.target.value) || 0)}
                        className="w-[50px] bg-slate-900 border border-slate-800 text-right rounded py-0.5 text-[10.5px] font-mono text-amber-300 font-bold focus:outline-hidden"
                      />
                      <span className="text-[10px] text-slate-400 font-sans">đ/g</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-300">
                      {formatVND(weight * price)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>

      {/* Aggregate cost calculator panel */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-2">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Calculator className="h-3.5 w-3.5 text-teal-400" />
          Tổng hợp chi phí bảo lãnh đề xuất
        </h4>
        <div className="space-y-1.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Dịch vụ kỹ thuật:</span>
            <span className="font-mono font-semibold">{formatVND(totals.serviceCost)}</span>
          </div>
          <div className="flex justify-between">
            <span>Thuốc & Thảo dược:</span>
            <span className="font-mono font-semibold">{formatVND(totals.herbCost)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-800 pt-1.5 text-slate-100 font-bold">
            <span className="text-teal-400">TỔNG THANH TOÁN BHYT:</span>
            <span className="font-mono text-teal-400 text-sm">{formatVND(totals.total)}</span>
          </div>
        </div>
      </div>

      {/* Action buttons (Copy slate, Print) */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={handleCopy}
          disabled={patientCase.diagnoses.length === 0 && patientCase.procedures.length === 0 && patientCase.herbs.length === 0}
          className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-semibold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 border border-slate-700 transition cursor-pointer disabled:cursor-not-allowed"
        >
          <Clipboard className="h-4 w-4 shrink-0" />
          {copied ? "Đã sao chép!" : "Sao chép mã"}
        </button>
        <button
          onClick={handlePrint}
          disabled={patientCase.diagnoses.length === 0 && patientCase.procedures.length === 0 && patientCase.herbs.length === 0}
          className="bg-teal-500 hover:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer disabled:cursor-not-allowed"
        >
          <Printer className="h-4 w-4 shrink-0" />
          In bảng kê
        </button>
      </div>

    </div>
  );
}
