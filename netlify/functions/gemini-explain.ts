import { GoogleGenAI } from "@google/genai";

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
    const { code, type, name } = JSON.parse(event.body || "{}");
    if (!code) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Yêu cầu cung cấp mã cần giải trình." })
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ explanation: response.text })
    };
  } catch (error: any) {
    console.error("Lỗi giải nghĩa mã y khoa:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || "Đã xảy ra lỗi khi xử lý yêu cầu." })
    };
  }
};
