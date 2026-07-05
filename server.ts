import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to lazily initialize Gemini client
  let aiInstance: GoogleGenAI | null = null;
  function getGeminiClient() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY chưa được cấu hình. Vui lòng thêm trong Settings > Secrets.");
    }
    if (!aiInstance) {
      aiInstance = new GoogleGenAI({
        apiKey: key,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiInstance;
  }

  // API endpoints
  app.post("/api/gemini/search", async (req, res) => {
    try {
      const { query } = req.body;
      if (!query) {
        return res.status(400).json({ error: "Yêu cầu cung cấp thông tin lâm sàng." });
      }

      const ai = getGeminiClient();

      const systemInstruction = `Bạn là Trợ lý Mã hóa Y tế và Giám định BHYT chuyên nghiệp tại Việt Nam.
Nhiệm vụ của bạn là phân tích mô tả lâm sàng, triệu chứng, hoặc bệnh danh tiếng Việt (kể cả Tây y hoặc Đông y) và tra cứu/gợi ý mã hóa phù hợp nhất theo các quy định sau:
1. Phân loại bệnh tật quốc tế ICD-10 (Tây y).
2. Quyết định số 1849/QĐ-BYT ban hành Danh mục mã chuẩn đối chiếu dịch vụ kỹ thuật y học cổ truyền và kết hợp YHCT với YHHĐ.
3. Thông tư số 06/2026/TT-BYT (hoặc bổ sung mới nhất) về danh mục vị thuốc thảo dược và điều kiện thanh toán BHYT.

Hãy trả về kết quả dưới định dạng JSON chính xác khớp với schema được yêu cầu. Đảm bảo ngôn ngữ phản hồi là tiếng Việt chuẩn y khoa. Lời khuyên thanh toán BHYT phải thực tế và phòng tránh xuất toán.`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          clinicalAnalysis: {
            type: Type.STRING,
            description: "Phân tích tóm tắt tình trạng lâm sàng của bệnh nhân dưới góc độ Đông y và Tây y."
          },
          icd10Diagnoses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING, description: "Mã ICD-10 chính xác (ví dụ M17, I10, E11...)" },
                name: { type: Type.STRING, description: "Tên bệnh theo danh mục Bộ Y tế Việt Nam" },
                reason: { type: Type.STRING, description: "Lý do lựa chọn mã này dựa trên thông tin lâm sàng cung cấp" }
              },
              required: ["code", "name", "reason"]
            }
          },
          yhctDiseases: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING, description: "Mã chuẩn hóa bệnh danh YHCT (ví dụ YHCT.D01, YHCT.D03... hoặc mã tương đương)" },
                name: { type: Type.STRING, description: "Tên bệnh danh YHCT (ví dụ Huyễn vựng, Yêu thống, Tiết tả...)" },
                mappingCode: { type: Type.STRING, description: "Mã ICD-10 đối chiếu tương đương theo Quyết định 1849/QĐ-BYT" },
                reason: { type: Type.STRING, description: "Lý do chẩn đoán Đông y tương ứng" }
              },
              required: ["code", "name", "mappingCode", "reason"]
            }
          },
          yhctProcedures: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING, description: "Mã dịch vụ kỹ thuật theo Quyết định 1849/QĐ-BYT (ví dụ DVKT.1849.01 hoặc mã tương ứng)" },
                name: { type: Type.STRING, description: "Tên kỹ thuật trị liệu (Điện châm, Thủy châm, Xoa bóp bấm huyệt, Cứu ngải...)" },
                indication: { type: Type.STRING, description: "Chỉ định y khoa phù hợp" },
                billingNote: { type: Type.STRING, description: "Ghi chú điều kiện thanh toán BHYT để tránh xuất toán" }
              },
              required: ["code", "name", "indication", "billingNote"]
            }
          },
          herbs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                code: { type: Type.STRING, description: "Mã vị thuốc/bài thuốc theo Thông tư 06 (ví dụ TT06.HERB.01 hoặc tương đương)" },
                name: { type: Type.STRING, description: "Tên vị thuốc thảo dược cổ truyền" },
                purpose: { type: Type.STRING, description: "Công năng chủ trị phù hợp với bệnh án" },
                billingNote: { type: Type.STRING, description: "Quy định thanh toán BHYT đặc thù (giới hạn tỷ lệ chi trả nếu có)" }
              },
              required: ["code", "name", "purpose", "billingNote"]
            }
          },
          billingTips: {
            type: Type.STRING,
            description: "Lời khuyên thực tế cho cán bộ y tế để tối ưu hóa hồ sơ bệnh án BHYT, tránh bị giám định viên từ chối thanh toán."
          }
        },
        required: ["clinicalAnalysis", "icd10Diagnoses", "yhctDiseases", "yhctProcedures", "herbs", "billingTips"]
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Hãy phân tích tình trạng lâm sàng sau và đề xuất mã hóa Y khoa phù hợp: "${query}"`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema
        }
      });

      const responseText = response.text;
      if (!responseText) {
        return res.status(500).json({ error: "Không nhận được phản hồi từ mô hình AI." });
      }

      res.json(JSON.parse(responseText.trim()));
    } catch (error: any) {
      console.error("Lỗi tìm kiếm mã y khoa:", error);
      res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi xử lý yêu cầu." });
    }
  });

  app.post("/api/gemini/explain-code", async (req, res) => {
    try {
      const { code, type, name } = req.body;
      if (!code) {
        return res.status(400).json({ error: "Yêu cầu cung cấp mã cần giải trình." });
      }

      const ai = getGeminiClient();

      const prompt = `Hãy giải thích chi tiết mã y khoa sau:
Mã: "${code}"
Tên danh mục: "${name || 'Không rõ'}"
Loại mã: "${type || 'Không rõ'}"

Vui lòng cung cấp thông tin bằng tiếng Việt có cấu trúc đẹp mắt gồm các mục sau:
1. Định nghĩa & Ý nghĩa Lâm sàng dưới góc nhìn chuyên môn.
2. Tiêu chuẩn chẩn đoán / Chỉ định kỹ thuật chuẩn để được thanh toán BHYT.
3. Hướng dẫn ghi hồ sơ bệnh án tránh bị xuất toán theo Thông tư 06/2026/TT-BYT hoặc Quyết định 1849/QĐ-BYT.
4. Gợi ý các vị thuốc thảo dược hoặc thủ thuật Đông - Tây y phối hợp khuyên dùng.
5. Những lỗi thường gặp khi giám định BHYT đối với mã này (Ví dụ: thiếu chẩn đoán kèm theo, chỉ định quá ngày quy định, sai tuyến...).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: "Bạn là một Giám định viên BHYT kỳ cựu và Chuyên gia mã hóa lâm sàng của Bộ Y tế Việt Nam. Hãy phản hồi bằng tiếng Việt chuẩn xác, chi tiết, chuyên nghiệp, hỗ trợ tối đa cho y bác sĩ điều trị."
        }
      });

      res.json({ explanation: response.text });
    } catch (error: any) {
      console.error("Lỗi giải nghĩa mã y khoa:", error);
      res.status(500).json({ error: error.message || "Đã xảy ra lỗi khi xử lý yêu cầu." });
    }
  });

  // Vite middleware setup for development, or static file serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server đang chạy trên cổng http://0.0.0.0:${PORT}`);
  });
}

startServer();
