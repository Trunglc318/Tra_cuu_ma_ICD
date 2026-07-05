export interface MedicalCode {
  code: string;
  name: string;
  englishName?: string;
  type: 'icd10' | 'yhct_procedure' | 'yhct_disease' | 'herb_tt06';
  category: string;
  note?: string;
  guideline?: string;
  mappingCode?: string; // e.g. mapping YHCT disease to ICD-10
}

export const MEDICAL_CATEGORIES = {
  icd10: [
    "I. Bệnh nhiễm trùng và ký sinh trùng (A00-B99)",
    "II. Khối u (C00-D48)",
    "IV. Bệnh nội tiết, dinh dưỡng và chuyển hóa (E00-E90)",
    "IX. Bệnh hệ tuần hoàn (I00-I99)",
    "X. Bệnh hệ hô hấp (J00-J99)",
    "XI. Bệnh hệ tiêu hóa (K00-K93)",
    "XIII. Bệnh hệ cơ-xương-khớp và mô liên kết (M00-M99)",
    "XIV. Bệnh hệ sinh dục - tiết niệu (N00-N99)",
    "XVIII. Triệu chứng, dấu hiệu lâm sàng cận lâm sàng (R00-R99)"
  ],
  yhct_disease: [
    "Bệnh tỳ vị (Tiêu hóa)",
    "Bệnh phế quản - Phổi (Hô hấp)",
    "Bệnh Thận - Bàng quang (Tiết niệu)",
    "Bệnh khớp - Cột sống (Cơ xương khớp)",
    "Bệnh can đởm / Tâm mạch (Tuần hoàn - Thần kinh)"
  ],
  yhct_procedure: [
    "Châm cứu và Trị liệu huyệt",
    "Trị liệu vật lý & Cơ học cổ truyền",
    "Xông hơi & Ngâm tẩm thảo dược",
    "Thủ thuật phục hồi chức năng cổ truyền"
  ],
  herb_tt06: [
    "Nhóm bổ khí / bổ dương",
    "Nhóm bổ huyết / dưỡng âm",
    "Nhóm hoạt huyết / hóa ứ",
    "Nhóm thanh nhiệt / giải độc",
    "Nhóm kiện tỳ / vị"
  ]
};

export const MEDICAL_CODES: MedicalCode[] = [
  // --- ICD-10 (Tây y) ---
  {
    code: "A09",
    name: "Tiêu chảy và viêm dạ dày ruột có nguồn gốc nhiễm khuẩn",
    englishName: "Diarrhea and gastroenteritis of infectious origin",
    type: "icd10",
    category: "I. Bệnh nhiễm trùng và ký sinh trùng (A00-B99)",
    note: "Được BHYT chi trả hoàn toàn khi có chẩn đoán xác định lâm sàng và cận lâm sàng.",
    guideline: "Cần bù nước, điện giải. Chỉ định kháng sinh khi có bằng chứng nhiễm khuẩn hoặc phân có máu."
  },
  {
    code: "A16",
    name: "Lao phổi, không được xác định bằng vi khuẩn học hoặc mô học",
    englishName: "Respiratory tuberculosis, not confirmed bacteriologically or histologically",
    type: "icd10",
    category: "I. Bệnh nhiễm trùng và ký sinh trùng (A00-B99)",
    note: "Thanh toán theo chương trình chống lao quốc gia hoặc BHYT tuyến quận/huyện trở lên.",
    guideline: "Phác đồ điều trị lao chuẩn của Bộ Y tế. Cần hội chẩn chuyên khoa trước khi ghi nhận mã."
  },
  {
    code: "E11",
    name: "Đái tháo đường không phụ thuộc insulin (Type 2)",
    englishName: "Non-insulin-dependent diabetes mellitus",
    type: "icd10",
    category: "IV. Bệnh nội tiết, dinh dưỡng và chuyển hóa (E00-E90)",
    note: "Chi trả thuốc hạ đường huyết đường uống và insulin định kỳ.",
    guideline: "Xét nghiệm HbA1c mỗi 3-6 tháng. Xét nghiệm kiểm tra biến chứng thận và mắt hàng năm."
  },
  {
    code: "E11.9",
    name: "Đái tháo đường Type 2, không có biến chứng",
    englishName: "Type 2 diabetes mellitus, without complications",
    type: "icd10",
    category: "IV. Bệnh nội tiết, dinh dưỡng và chuyển hóa (E00-E90)",
    note: "Áp dụng thanh toán ngoại trú định kỳ tại trạm y tế xã hoặc phòng khám đa khoa tuyến huyện.",
    guideline: "Kiểm soát đường huyết đói từ 4.4 - 7.2 mmol/L. Giáo dục lối sống và dinh dưỡng cho người bệnh."
  },
  {
    code: "I10",
    name: "Tăng huyết áp vô căn (nguyên phát)",
    englishName: "Essential (primary) hypertension",
    type: "icd10",
    category: "IX. Bệnh hệ tuần hoàn (I00-I99)",
    note: "BHYT chi trả các nhóm thuốc hạ huyết áp cơ bản theo danh mục tuyến kỹ thuật tương ứng.",
    guideline: "Mục tiêu huyết áp < 140/90 mmHg (hoặc < 130/80 mmHg ở bệnh nhân đái tháo đường hoặc suy thận)."
  },
  {
    code: "I20",
    name: "Cơn đau thắt ngực",
    englishName: "Angina pectoris",
    type: "icd10",
    category: "IX. Bệnh hệ tuần hoàn (I00-I99)",
    note: "Chi trả thuốc giãn vành và can thiệp mạch vành theo tỷ lệ danh mục kỹ thuật cao.",
    guideline: "Cần đo điện tâm đồ cấp, làm xét nghiệm men tim Troponin T/I để loại trừ nhồi máu cơ tim cấp."
  },
  {
    code: "I63",
    name: "Nhồi máu não (Đột quỵ cấp)",
    englishName: "Cerebral infarction",
    type: "icd10",
    category: "IX. Bệnh hệ tuần hoàn (I00-I99)",
    note: "Chi trả điều trị tiêu sợi huyết trong giờ vàng (dưới 4.5 giờ) và hồi sức đột quỵ tích cực.",
    guideline: "Chụp CT/MRI sọ não khẩn cấp. Theo dõi sát thang điểm NIHSS và các dấu hiệu sinh tồn."
  },
  {
    code: "J00",
    name: "Viêm mũi họng cấp (Cảm lạnh thường)",
    englishName: "Acute nasopharyngitis (common cold)",
    type: "icd10",
    category: "X. Bệnh hệ hô hấp (J00-J99)",
    note: "BHYT chi trả các thuốc điều trị triệu chứng (giảm ho, hạ sốt, kháng histamin).",
    guideline: "Hạn chế chỉ định kháng sinh không cần thiết. Chủ yếu điều trị hỗ trợ, nâng cao thể trạng."
  },
  {
    code: "J06.9",
    name: "Viêm đường hô hấp cấp tính đường hô hấp trên, không xác định",
    englishName: "Acute upper respiratory infection, unspecified",
    type: "icd10",
    category: "X. Bệnh hệ hô hấp (J00-J99)",
    note: "Mã phổ biến nhất tại phòng khám ngoại trú. Chi trả thuốc hạ sốt, giảm ho thông thường.",
    guideline: "Rửa mũi bằng nước muối sinh lý, bù nước ấm, chỉ dùng kháng sinh khi có bằng chứng bội nhiễm."
  },
  {
    code: "J20.9",
    name: "Viêm phế quản cấp, không xác định",
    englishName: "Acute bronchitis, unspecified",
    type: "icd10",
    category: "X. Bệnh hệ hô hấp (J00-J99)",
    note: "BHYT thanh toán chụp X-quang phổi thẳng và các xét nghiệm công thức máu kiểm tra.",
    guideline: "Đánh giá mức độ khó thở, nghe phổi phát hiện ran rít/ran ẩm để chỉ định giãn phế quản phù hợp."
  },
  {
    code: "J45",
    name: "Hen phế quản (Suyễn)",
    englishName: "Asthma",
    type: "icd10",
    category: "X. Bệnh hệ hô hấp (J00-J99)",
    note: "BHYT chi trả các loại thuốc xịt/hít dự phòng (ICS, LABA) và cắt cơn ngoại trú.",
    guideline: "Đo hô hấp ký kiểm tra chẩn đoán. Hướng dẫn bệnh nhân kỹ thuật xịt hít và bảng kế hoạch hành động."
  },
  {
    code: "K25",
    name: "Loét dạ dày",
    englishName: "Gastric ulcer",
    type: "icd10",
    category: "XI. Bệnh hệ tiêu hóa (K00-K93)",
    note: "BHYT thanh toán nội soi dạ dày tá tràng chẩn đoán và thuốc ức chế bơm proton (PPI).",
    guideline: "Thực hiện test tìm vi khuẩn H.pylori (loại trừ chống chỉ định). Sử dụng kháng sinh diệt HP nếu dương tính."
  },
  {
    code: "K29.7",
    name: "Viêm dạ dày, không xác định",
    englishName: "Gastritis, unspecified",
    type: "icd10",
    category: "XI. Bệnh hệ tiêu hóa (K00-K93)",
    note: "Chi trả điều trị nội khoa ngoại trú. Giới hạn tỷ lệ thanh toán của một số thuốc bảo vệ niêm mạc.",
    guideline: "Kiểm soát chế độ ăn uống, tránh cay nóng, rượu bia, chất kích thích và căng thẳng tâm lý."
  },
  {
    code: "M17",
    name: "Thoái hóa khớp gối",
    englishName: "Arthrosis of knee (Gonarthrosis)",
    type: "icd10",
    category: "XIII. Bệnh hệ cơ-xương-khớp và mô liên kết (M00-M99)",
    note: "Chi trả thuốc giảm đau, kháng viêm NSAID và các liệu pháp phục hồi chức năng/vật lý trị liệu.",
    guideline: "Chụp X-quang khớp gối tư thế đứng thẳng. Khuyên bệnh nhân giảm cân nếu thừa cân, tập cơ tứ đầu đùi."
  },
  {
    code: "M47.8",
    name: "Thoái hóa cột sống khác (Thoái hóa cột sống cổ/thắt lưng)",
    englishName: "Other spondylosis",
    type: "icd10",
    category: "XIII. Bệnh hệ cơ-xương-khớp và mô liên kết (M00-M99)",
    note: "Được thanh toán kết hợp điều trị Đông - Tây y (điện châm, xoa bóp bấm huyệt kết hợp giảm đau).",
    guideline: "Đánh giá các triệu chứng chèn ép rễ thần kinh (tê tay, đau lan chân) để chụp MRI khi cần thiết."
  },
  {
    code: "M51.2",
    name: "Thoát vị đĩa đệm gian đốt sống khác",
    englishName: "Other specified intervertebral disc displacement",
    type: "icd10",
    category: "XIII. Bệnh hệ cơ-xương-khớp và mô liên kết (M00-M99)",
    note: "BHYT chi trả chụp MRI cột sống khi có chỉ định của bác sĩ chuyên khoa chấn thương/thần kinh.",
    guideline: "Ưu tiên điều trị bảo tồn (vật lý trị liệu, kéo giãn cột sống, điện châm, thuốc). Chỉ định mổ khi liệt hoặc bí tiểu."
  },
  {
    code: "N39.0",
    name: "Nhiễm khuẩn đường tiết niệu, vị trí không xác định",
    englishName: "Urinary tract infection, site not specified",
    type: "icd10",
    category: "XIV. Bệnh hệ sinh dục - tiết niệu (N00-N99)",
    note: "Thanh toán xét nghiệm tổng phân tích nước tiểu, soi tươi vi khuẩn và kháng sinh đồ.",
    guideline: "Uống nhiều nước (> 2 lít/ngày). Kháng sinh đường uống từ 3-7 ngày tùy theo mức độ và đối tượng bệnh nhân."
  },
  {
    code: "R50.9",
    name: "Sốt không rõ nguyên nhân",
    englishName: "Fever, unspecified",
    type: "icd10",
    category: "XVIII. Triệu chứng, dấu hiệu lâm sàng cận lâm sàng (R00-R99)",
    note: "Mã tạm thời trong khi chờ kết quả xét nghiệm tìm nguyên nhân đặc hiệu. BHYT chi trả xét nghiệm tầm soát.",
    guideline: "Theo dõi nhiệt độ mỗi 4 giờ. Tìm ổ nhiễm trùng (tai mũi họng, phổi, nước tiểu, máu), test sốt xuất huyết."
  },

  // --- Bệnh danh Y học cổ truyền (Mapped to ICD-10 under QĐ 1849) ---
  {
    code: "YHCT.D01",
    name: "Tiết tả / Toạt tiết (Tiêu chảy nhiễm khuẩn)",
    type: "yhct_disease",
    category: "Bệnh tỳ vị (Tiêu hóa)",
    mappingCode: "A09",
    note: "Danh mục đối chiếu theo Quyết định 1849/QĐ-BYT phục vụ lập hồ sơ thanh toán BHYT.",
    guideline: "Thanh toán kết hợp điện châm huyệt Thiên khu, Túc tam lý và uống bài thuốc Hương sa lục quân tử cát cánh."
  },
  {
    code: "YHCT.D02",
    name: "Tiêu khát (Đái tháo đường Type 2)",
    type: "yhct_disease",
    category: "Bệnh nội tiết, dinh dưỡng và chuyển hóa (E00-E90)",
    mappingCode: "E11",
    note: "Đối chiếu tương đương đái tháo đường theo Quyết định 1849/QĐ-BYT.",
    guideline: "Phối hợp dùng thuốc hạ đường huyết Tây y với các bài thuốc Đông y dưỡng âm sinh tân (Lục vị địa hoàng hoàn)."
  },
  {
    code: "YHCT.D03",
    name: "Huyễn vựng (Tăng huyết áp / Hội chứng tiền đình)",
    type: "yhct_disease",
    category: "Bệnh can đởm / Tâm mạch (Tuần hoàn - Thần kinh)",
    mappingCode: "I10",
    note: "Chẩn đoán y học cổ truyền đối chiếu tương đương bệnh Tăng huyết áp vô căn.",
    guideline: "Châm cứu bình can tiềm dương (Thái xung, Phong trì). Dùng bài Thiên ma câu đằng ẩm hoặc Lục vị hoàng gia giảm."
  },
  {
    code: "YHCT.D04",
    name: "Cảm mạo phong hàn (Viêm mũi họng cấp / Cảm lạnh)",
    type: "yhct_disease",
    category: "Bệnh phế quản - Phổi (Hô hấp)",
    mappingCode: "J00",
    note: "Thanh toán xông hơi thuốc cổ truyền, cứu ngải tán hàn phục vụ điều trị.",
    guideline: "Huyệt sử dụng: Hợp cốc, Ngoại quan, Liệt khuyết. Bài thuốc: Kinh phòng bại độc tán gia giảm."
  },
  {
    code: "YHCT.D05",
    name: "Tỳ vị hư hàn / Vị quản thống (Loét dạ dày tá tràng)",
    type: "yhct_disease",
    category: "Bệnh tỳ vị (Tiêu hóa)",
    mappingCode: "K25",
    note: "Hội chứng đau dạ dày thể hàn tà phạm vị hoặc tỳ vị hư hàn đối chiếu K25.",
    guideline: "Ôn trung kiện tỳ, hành khí chỉ thống. Cứu ngải huyệt Trung quản, Túc tam lý. Bài thuốc Lý trung thang."
  },
  {
    code: "YHCT.D06",
    name: "Hạc tất phong / Tê thấp (Thoái hóa khớp gối)",
    type: "yhct_disease",
    category: "Bệnh khớp - Cột sống (Cơ xương khớp)",
    mappingCode: "M17",
    note: "Đối chiếu tương đương Thoái hóa khớp gối theo Quyết định 1849/QĐ-BYT.",
    guideline: "Điện châm quanh khớp gối (Hạc đỉnh, Độc tỵ, Tất nhãn). Đắp thuốc thảo dược tiêu sưng tán hàn. Bài Độc hoạt ký sinh thang."
  },
  {
    code: "YHCT.D07",
    name: "Yêu thống (Đau lưng / Thoái hóa cột sống thắt lưng)",
    type: "yhct_disease",
    category: "Bệnh khớp - Cột sống (Cơ xương khớp)",
    mappingCode: "M47.8",
    note: "Đối chiếu thoái hóa cột sống thắt lưng phục vụ bệnh án kết hợp Đông Tây y.",
    guideline: "Hành khí hoạt huyết, bổ can thận. Châm cứu giáp tích thắt lưng, Thận du, Đại trường du. Vật lý trị liệu xoa bóp bấm huyệt."
  },
  {
    code: "YHCT.D08",
    name: "Tọa cốt phong (Đau thần kinh tọa / Thoát vị đĩa đệm)",
    type: "yhct_disease",
    category: "Bệnh khớp - Cột sống (Cơ xương khớp)",
    mappingCode: "M51.2",
    note: "Đối chiếu bệnh lý thoát vị đĩa đệm có chèn ép rễ thần kinh thắt lưng hông.",
    guideline: "Khu phong tán hàn trừ thấp, thông kinh hoạt lạc. Điện châm huyệt Hoàn khiêu, Ủy trung, Côn lôn. Bài thuốc Độc hoạt ký sinh thang."
  },
  {
    code: "YHCT.D09",
    name: "Lâm chứng (Nhiễm trùng đường tiết niệu)",
    type: "yhct_disease",
    category: "Bệnh Thận - Bàng quang (Tiết niệu)",
    mappingCode: "N39.0",
    note: "Thanh nhiệt thông lâm, lợi niệu tiêu thũng đối chiếu N39.0.",
    guideline: "Châm cứu huyệt Khúc cốt, Trung cực, Tam âm giao. Bài thuốc Bát chính tán."
  },

  // --- Dịch vụ kỹ thuật Y học cổ truyền (Procedues under QĐ 1849/QĐ-BYT) ---
  {
    code: "DVKT.1849.01",
    name: "Điện châm (Phương pháp điện châm trị liệu)",
    englishName: "Electro-acupuncture therapy",
    type: "yhct_procedure",
    category: "Châm cứu và Trị liệu huyệt",
    note: "Thanh toán tối đa 1 lần/ngày, không quá 15 ngày cho một đợt điều trị ngoại trú.",
    guideline: "Chỉ định: Các hội chứng đau cấp và mạn tính (đau lưng, đau khớp), liệt nửa người, liệt mặt ngoại biên, mất ngủ."
  },
  {
    code: "DVKT.1849.02",
    name: "Thủy châm (Thủ thuật tiêm thuốc vào huyệt)",
    englishName: "Acupoint injection therapy",
    type: "yhct_procedure",
    category: "Châm cứu và Trị liệu huyệt",
    note: "Chỉ chi trả khi sử dụng các loại thuốc bổ thần kinh nhóm B, thuốc giảm đau được Bộ Y tế cho phép thủy châm.",
    guideline: "Chỉ định: Đau thần kinh tọa, đau vai gáy, di chứng liệt. Chống chỉ định: Huyệt vùng đầu mặt nhạy cảm, vùng da nhiễm trùng."
  },
  {
    code: "DVKT.1849.03",
    name: "Cứu ngải (Phương pháp ôn châm / cứu ngải trị liệu)",
    englishName: "Moxibustion therapy",
    type: "yhct_procedure",
    category: "Châm cứu và Trị liệu huyệt",
    note: "Được thanh toán đồng thời với điện châm khi điều trị các bệnh lý thể hàn (phong hàn, tỳ vị hư hàn).",
    guideline: "Sử dụng điếu ngải hoặc mồi ngải đặt trên kim châm cứu. Đề phòng bỏng da và thông thoáng phòng tránh ngạt khói."
  },
  {
    code: "DVKT.1849.04",
    name: "Xoa bóp bấm huyệt bộ phận / toàn thân",
    englishName: "Traditional therapeutic massage and acupressure",
    type: "yhct_procedure",
    category: "Trị liệu vật lý & Cơ học cổ truyền",
    note: "Giới hạn định mức thời gian tối thiểu 20-30 phút/lần thực hiện bởi kỹ thuật viên Đông y có chứng chỉ hành nghề.",
    guideline: "Chỉ định: Thoái hóa cột sống, co thắt cơ vùng cổ vai gáy, mệt mỏi suy nhược cơ thể. Tránh xoa bóp vùng khớp viêm cấp."
  },
  {
    code: "DVKT.1849.05",
    name: "Giác hơi điều trị",
    englishName: "Cupping therapy",
    type: "yhct_procedure",
    category: "Trị liệu vật lý & Cơ học cổ truyền",
    note: "Thanh toán điều trị cảm cúm phong hàn, đau lưng mỏi cơ cơ năng.",
    guideline: "Chỉ định: Đau mỏi cơ vùng lưng, vai gáy do nhiễm lạnh. Chống chỉ định: Trẻ nhỏ, người suy kiệt, vùng da lở loét."
  },
  {
    code: "DVKT.1849.06",
    name: "Ngâm chân thuốc y học cổ truyền ngoại trú",
    englishName: "Medicinal herbal foot bath",
    type: "yhct_procedure",
    category: "Xông hơi & Ngâm tẩm thảo dược",
    note: "Thanh toán tối đa 10 ngày/đợt điều trị. Chi trả chi phí dược liệu ngâm chân trong danh mục BHYT.",
    guideline: "Nhiệt độ nước ngâm từ 38-40 độ C, ngâm từ 15-20 phút. Chỉ định cho chứng mất ngủ, đau khớp bàn chân, lạnh chi."
  },
  {
    code: "DVKT.1849.07",
    name: "Xông hơi thuốc cổ truyền toàn thân / bộ phận",
    englishName: "Herbal steam sauna therapy",
    type: "yhct_procedure",
    category: "Xông hơi & Ngâm tẩm thảo dược",
    note: "Áp dụng cho bệnh nhân nội trú hoặc ngoại trú điều trị phục hồi chức năng/cảm mạo nặng.",
    guideline: "Theo dõi sát huyết áp trước và sau xông hơi. Ngừng xông khi có biểu hiện hoa mắt, vã mồ hôi nhiều (thoát dương)."
  },
  {
    code: "DVKT.1849.08",
    name: "Đắp thuốc thảo dược tiêu viêm giảm đau tại khớp",
    englishName: "Herbal poultice application",
    type: "yhct_procedure",
    category: "Thủ thuật phục hồi chức năng cổ truyền",
    note: "Áp dụng kết hợp điều trị thoái hóa khớp gối, sưng nề chấn thương phần mềm chu kỳ bán cấp.",
    guideline: "Thời gian bó/đắp thuốc từ 2-4 giờ/ngày. Theo dõi dị ứng da vùng đắp thuốc y học cổ truyền."
  },

  // --- Danh mục thuốc thảo dược Thông tư 06/2026/TT-BYT ---
  {
    code: "TT06.HERB.01",
    name: "Nhân sâm (Radix Ginseng)",
    type: "herb_tt06",
    category: "Nhóm bổ khí / bổ dương",
    note: "Chỉ định đặc biệt được thanh toán BHYT tỷ lệ 50% - 100% khi điều trị suy kiệt nặng, shock, truỵ tim mạch.",
    guideline: "Liều dùng 2g - 10g/ngày. Chống chỉ định khi đang bị tiêu chảy cấp, đầy bụng, tăng huyết áp kịch phát."
  },
  {
    code: "TT06.HERB.02",
    name: "Đương quy (Radix Angelicae Sinensis)",
    type: "herb_tt06",
    category: "Nhóm bổ huyết / dưỡng âm",
    note: "Vị thuốc bổ huyết hàng đầu, thanh toán BHYT đầy đủ trong các thang thuốc y học cổ truyền.",
    guideline: "Liều dùng 4g - 12g/ngày. Chỉ định: Thiếu máu, kinh nguyệt không đều, đau nhức cơ khớp thể huyết hư, táo bón."
  },
  {
    code: "TT06.HERB.03",
    name: "Hoàng kỳ (Radix Astragali)",
    type: "herb_tt06",
    category: "Nhóm bổ khí / bổ dương",
    note: "Vị thuốc bổ khí thăng dương, thanh toán đầy đủ trong danh mục thuốc cổ truyền của cơ sở y tế tuyến 3 trở lên.",
    guideline: "Liều dùng 8g - 24g/ngày. Chỉ định: Suy nhược cơ thể, sa tử cung, sa dạ dày, mồ hôi trộm (tự hãn), vết loét lâu lành."
  },
  {
    code: "TT06.HERB.04",
    name: "Đan sâm (Radix Salviae Miltiorrhizae)",
    type: "herb_tt06",
    category: "Nhóm hoạt huyết / hóa ứ",
    note: "Thanh toán BHYT trong điều trị đau thắt ngực, tai biến mạch máu não, đau kinh niên do ứ huyết.",
    guideline: "Liều dùng 6g - 15g/ngày. Có tác dụng tương tự như hoạt chất chống đông máu, cần thận trọng khi phối hợp thuốc Tây y khác."
  },
  {
    code: "TT06.HERB.05",
    name: "Kim ngân hoa (Flos Lonicerae Japonicae)",
    type: "herb_tt06",
    category: "Nhóm thanh nhiệt / giải độc",
    note: "Được chi trả hoàn toàn. Kháng sinh thực vật lành tính điều trị mụn nhọt, viêm đường hô hấp, dị ứng.",
    guideline: "Liều dùng 8g - 16g/ngày (hoa tươi) hoặc 4g - 12g/ngày (nụ hoa khô). Thận trọng với người tỳ vị hư hàn, tiêu chảy lạnh."
  },
  {
    code: "TT06.HERB.06",
    name: "Bạch truật (Rhizoma Atractylodis Macrocephalae)",
    type: "herb_tt06",
    category: "Nhóm kiện tỳ / vị",
    note: "Thanh toán đầy đủ. Vị thuốc kiện tỳ táo thấp, trị chứng tỳ hư đầy bụng, ăn kém, tiêu chảy kéo dài.",
    guideline: "Liều dùng 6g - 12g/ngày. Sao vàng để tăng tính kiện tỳ, sao cháy để chỉ tả tiêu chảy."
  },
  {
    code: "TT06.HERB.07",
    name: "Địa hoàng / Thục địa (Radix Rehmanniae Praeparata)",
    type: "herb_tt06",
    category: "Nhóm bổ huyết / dưỡng âm",
    note: "Vị thuốc bổ thận âm cốt lõi, thanh toán BHYT đầy đủ trong các bài thuốc bổ can thận (Lục vị địa hoàng).",
    guideline: "Liều dùng 8g - 20g/ngày. Có thể gây đầy bụng nấc cụt ở người có tỳ vị hư hàn (cần gia thêm gừng hoặc sa nhân)."
  },
  {
    code: "TT06.HERB.08",
    name: "Cam thảo bắc (Radix Glycyrrhizae)",
    type: "herb_tt06",
    category: "Nhóm kiện tỳ / vị",
    note: "Sử dụng làm sứ dược điều hòa vị thuốc trong hầu hết các thang thuốc cổ truyền, chi trả đầy đủ.",
    guideline: "Liều dùng 2g - 8g/ngày. Tránh lạm dụng liều cao kéo dài (>4 tuần) vì có thể gây giữ nước, hạ kali máu và tăng huyết áp."
  }
];
