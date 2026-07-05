import { GoogleGenAI, Type } from "@google/genai";

export const handler = async (event: any, context: any) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8"
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "Successful preflight" })
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { query } = JSON.parse(event.body || "{}");
    if (!query) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Yêu cầu cung cấp thông tin lâm sàng." })
      };
    }

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "GEMINI_API_KEY chưa được cấu hình trên Netlify." })
      };
    }

    const ai = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

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
              name: { type: Type.STRING, description: "Tên bệnh danh YHCT (ví dụ Huyễn vựng, Yêu thông, Tiết tả...)" },
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
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: "Không nhận được phản hồi từ mô hình AI." })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: responseText.trim()
    };
  } catch (error: any) {
    console.error("Lỗi tìm kiếm mã y khoa:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Đã xảy ra lỗi khi xử lý yêu cầu." })
    };
  }
};
