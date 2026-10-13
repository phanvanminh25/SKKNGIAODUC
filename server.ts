import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini AI instance
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Helper to call Gemini text generation with error handling
async function callGemini(prompt: string, systemInstruction?: string): Promise<string> {
  if (!ai) {
    throw new Error('GEMINI_API_KEY_NOT_CONFIGURED');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.8-flash',
    contents: prompt,
    config: {
      systemInstruction:
        systemInstruction ||
        'Bạn là chuyên gia giáo dục và cố vấn viết Sáng kiến kinh nghiệm (SKKN) chuẩn Bộ Giáo dục và Đào tạo Việt Nam. Bạn luôn sử dụng ngôn ngữ sư phạm chuẩn mực, tính khoa học, mạch lạc, bám sát Chương trình GDPT 2018 và các văn bản chỉ đạo ngành giáo dục.',
      temperature: 0.7,
    },
  });

  return response.text || '';
}

// 1. Suggest Topics & Titles
app.post('/api/ai/suggest-topics', async (req: Request, res: Response) => {
  try {
    const { gradeLevel, subject, problemStatement, methodFocus } = req.body;
    const prompt = `Hãy gợi ý 5 tên đề tài Sáng kiến kinh nghiệm (SKKN) chuẩn mực, tính khoa học cao theo đúng cấu trúc chuẩn của Bộ GD&ĐT Việt Nam:
- Cấp học / Khối lớp: ${gradeLevel || 'Chung'}
- Môn học / Lĩnh vực: ${subject || 'Giáo dục'}
- Thực trạng / Vấn đề cần giải quyết: ${problemStatement || 'Nâng cao chất lượng dạy và học'}
- Hướng giải pháp / Phương pháp trọng tâm: ${methodFocus || 'Đổi mới phương pháp, ứng dụng CNTT/STEM'}

Yêu cầu:
1. Đặt 5 tên đề tài chuẩn cú pháp sư phạm (sử dụng các tiền tố như "Một số biện pháp...", "Giải pháp...", "Ứng dụng...", "Nâng cao năng lực... thông qua...").
2. Với mỗi đề tài, tóm tắt ngắn gọn:
   - Điểm mới sáng tạo (1-2 câu)
   - Dự kiến biện pháp chính (2-3 gạch đầu dòng)
   - Phù hợp với Chương trình GDPT 2018 như thế nào.

Hãy trả về định dạng JSON array với các trường:
[
  {
    "title": "Tên đề tài chuẩn",
    "novelty": "Điểm mới",
    "keyMethods": ["Biện pháp 1", "Biện pháp 2"],
    "curriculumAlignment": "Độ tương thích GDPT 2018"
  }
]
Chỉ trả về chuỗi JSON thuần túy, không có văn bản dẫn nhập bên ngoài.`;

    const raw = await callGemini(prompt, 'Bạn là chuyên gia thẩm định SKKN của Sở Giáo dục và Đào tạo.');
    let jsonStr = raw.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    
    const parsed = JSON.parse(jsonStr);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error suggesting topics:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Lỗi xử lý gợi ý đề tài',
      fallback: true,
    });
  }
});

// 2. Generate Detailed Outline for a Section or entire SKKN
app.post('/api/ai/generate-outline', async (req: Request, res: Response) => {
  try {
    const { title, sectionId, gradeLevel, subject } = req.body;
    const prompt = `Hãy xây dựng dàn ý chi tiết cho phần "${sectionId || 'Nội dung và giải pháp'}" của đề tài Sáng kiến kinh nghiệm:
- Tên đề tài: ${title}
- Cấp học: ${gradeLevel}
- Môn học: ${subject}

Yêu cầu:
- Bám sát quy chuẩn trình bày SKKN ngành giáo dục Việt Nam.
- Dàn ý có tính logic cao, chỉ rõ từng luận điểm, tiểu mục, ví dụ minh họa và hoạt động cụ thể của giáo viên và học sinh.
- Đưa ra định dạng danh sách Markdown rõ ràng, dễ sao chép vào bài viết.`;

    const result = await callGemini(prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    console.error('Error generating outline:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Expand Section from Teacher's raw notes/bullets
app.post('/api/ai/expand-section', async (req: Request, res: Response) => {
  try {
    const { sectionTitle, rawNotes, context } = req.body;
    const prompt = `Bạn hãy giúp giáo viên phát triển và mở rộng các ý ghi chép thô dưới đây thành đoạn văn hoàn chỉnh, mang tính khoa học sư phạm cao cho mục: "${sectionTitle}".

Ghi chép thô / Ý chính của giáo viên:
"""
${rawNotes}
"""

Bối cảnh đề tài:
${context || 'Đề tài đổi mới phương pháp giảng dạy'}

Yêu cầu viết:
1. Giữ nguyên ý tưởng cốt lõi và số liệu/ví dụ thực tế của giáo viên, không bịa đặt những điều giáo viên không đề cập.
2. Sử dụng ngôn ngữ sư phạm chuẩn mực, câu văn gãy gọn, mạch lạc, lập luận chặt chẽ (lý do -> giải pháp cụ thể -> cách tổ chức dạy học -> kết quả mong đợi).
3. Đảm bảo đúng chuẩn thể thức văn bản hành chính và nghiên cứu khoa học giáo dục.`;

    const result = await callGemini(prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    console.error('Error expanding section:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Transform speech / classroom diary into formal pedagogical language
app.post('/api/ai/transform-tone', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const prompt = `Hãy chuyển đổi đoạn văn bản/nhật ký giảng dạy dưới đây từ văn phong nói, khẩu ngữ hoặc ghi chép thông thường sang văn phong khoa học sư phạm chuẩn mực dùng trong Sáng kiến kinh nghiệm cấp cơ sở/tỉnh:

Văn bản gốc:
"""
${text}
"""

Yêu cầu:
- Nâng cao tính học thuật, tính khách quan và tính sư phạm.
- Thay thế các từ ngữ cảm tính bằng các thuật ngữ giáo dục phù hợp (ví dụ: "mấy đứa lười" -> "một bộ phận học sinh chưa chủ động trong học tập", "chơi game trên lớp" -> "ứng dụng trò chơi học tập có ứng dụng CNTT").
- Giữ nguyên nội dung và ý nghĩa biểu đạt.`;

    const result = await callGemini(prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    console.error('Error transforming tone:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Suggest Modern Methods (STEM, AI tools, Digital Transformation)
app.post('/api/ai/modern-methods', async (req: Request, res: Response) => {
  try {
    const { title, subject, gradeLevel, currentDraft } = req.body;
    const prompt = `Phân tích đề tài SKKN sau và đề xuất 3-4 cách lồng ghép các phương pháp giáo dục hiện đại:
- Đề tài: ${title}
- Môn/Lĩnh vực: ${subject}
- Khối lớp: ${gradeLevel}
- Nội dung tóm tắt hiện tại: ${currentDraft || 'Chưa có nội dung chi tiết'}

Hãy gợi ý cụ thể:
1. Lồng ghép Giáo dục STEM/STEAM hoặc Dạy học theo dự án (Project-Based Learning).
2. Ứng dụng Chuyển đổi số & Công cụ số / AI trong dạy học (như Canva, Padlet, Kahoot, Quizizz, GeoGebra, AI tạo sinh...).
3. Phát triển năng lực và phẩm chất học sinh theo Chương trình GDPT 2018.

Mỗi gợi ý cần có: Tên phương pháp, Cách tổ chức cụ thể trong bài học, và Lợi ích mang lại.`;

    const result = await callGemini(prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    console.error('Error suggesting modern methods:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Analyze Experimental Survey Data
app.post('/api/ai/analyze-data', async (req: Request, res: Response) => {
  try {
    const { statsData, context } = req.body;
    const prompt = `Hãy viết đoạn văn phân tích ý nghĩa số liệu thực nghiệm khoa học sư phạm cho bài Sáng kiến kinh nghiệm dựa trên bảng số liệu đối chứng sau:

Dữ liệu khảo sát:
${JSON.stringify(statsData, null, 2)}

Bối cảnh: ${context || 'Khảo sát chất lượng học tập của học sinh trước và sau khi áp dụng giải pháp'}

Yêu cầu:
1. Phân tích định lượng: Chỉ ra sự chuyển biến rõ rệt về tỷ lệ học sinh đạt mức Tốt/Khá/Đạt, sự giảm thiểu học sinh Chưa đạt, mức độ chênh lệch phần trăm giữa trước và sau tác động (hoặc giữa lớp thực nghiệm và lớp đối chứng).
2. Phân tích định tính: Rút ra ý nghĩa sư phạm, chứng minh tính khả thi, tính hiệu quả và độ tin cậy của các biện pháp đã áp dụng.
3. Sử dụng văn phong phân tích nghiên cứu sư phạm thực nghiệm chuẩn mực.`;

    const result = await callGemini(prompt);
    res.json({ success: true, content: result });
  } catch (error: any) {
    console.error('Error analyzing data:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Plagiarism & Novelty Check
app.post('/api/ai/plagiarism-check', async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const prompt = `Bạn là Hội đồng chấm Sáng kiến kinh nghiệm cấp Tỉnh/Thành phố. Hãy thẩm định tính Mới và nguy cơ Trùng lặp của sáng kiến sau:
- Tên đề tài: ${title}
- Nội dung trích xuất:
"""
${content ? content.slice(0, 3000) : ''}
"""

Hãy đánh giá và trả về kết quả dưới dạng JSON với cấu trúc:
{
  "noveltyScore": 85, // thang điểm 100
  "noveltyLevel": "Cao / Khá / Trung bình / Cần đổi mới",
  "duplicateRiskAreas": [
    "Khu vực/Ý tưởng có nguy cơ trùng lặp với các SKKN đại trà đã công bố (nếu có)"
  ],
  "uniqueStrengths": [
    "Những điểm sáng tạo, điểm mới nổi bật của đề tài"
  ],
  "improvementSuggestions": [
    "Các gợi ý giúp giáo viên gia tăng tính độc bản, gắn kết chặt chẽ hơn với thực tiễn nhà trường/học sinh địa phương để đạt điểm tối đa ở tiêu chí Tính Mới"
  ]
}
Chỉ trả về chuỗi JSON thuần túy, không có văn bản dẫn nhập bên ngoài.`;

    const raw = await callGemini(prompt, 'Bạn là Giám khảo chấm SKKN cấp Tỉnh công tâm, tinh tường.');
    let jsonStr = raw.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    const parsed = JSON.parse(jsonStr);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error checking plagiarism:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Spell & Terminology & Legal Citation Check
app.post('/api/ai/proofread', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    const prompt = `Hãy rà soát văn bản Sáng kiến kinh nghiệm sau về:
1. Lỗi chính tả tiếng Việt, lỗi đánh máy, dấu câu.
2. Thuật ngữ sư phạm và Chương trình GDPT 2018 (ví dụ: dùng đúng "phẩm chất và năng lực", "kế hoạch bài dạy" thay cho từ cũ nếu có).
3. Tên và căn cứ các văn bản quy phạm pháp luật (Nghị định 30/2020/NĐ-CP về công tác văn thư, Thông tư 32/2018/TT-BGDĐT ban hành CT GDPT, Thông tư 22/2021 hoặc Thông tư 27/2020 về đánh giá học sinh...).

Văn bản cần kiểm tra:
"""
${text ? text.slice(0, 3500) : ''}
"""

Trả về JSON có dạng:
{
  "totalIssues": 3,
  "issues": [
    {
      "type": "chinh_ta | thuat_ngu | can_cu_phap_ly",
      "original": "đoạn sai",
      "suggestion": "đoạn sửa gợi ý",
      "explanation": "giải thích vì sao cần sửa"
    }
  ],
  "summary": "Tóm tắt nhận xét về chất lượng diễn đạt và quy chuẩn văn bản"
}
Chỉ trả về JSON thuần túy.`;

    const raw = await callGemini(prompt);
    let jsonStr = raw.trim();
    if (jsonStr.startsWith('```json')) {
      jsonStr = jsonStr.replace(/^```json\s*/, '').replace(/```\s*$/, '');
    } else if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/^```\s*/, '').replace(/```\s*$/, '');
    }
    const parsed = JSON.parse(jsonStr);
    res.json({ success: true, data: parsed });
  } catch (error: any) {
    console.error('Error proofreading:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Pedagogical Consultant Chat
app.post('/api/ai/consultant-chat', async (req: Request, res: Response) => {
  try {
    const { messages, initiativeContext } = req.body;
    const lastMsg = messages[messages.length - 1]?.content || '';
    const systemInstruction = `Bạn là "Cố Vấn Sáng Kiến Kinh Nghiệm" (EduSKKN Advisor) - một chuyên gia hàng đầu về phương pháp giảng dạy, nghiên cứu khoa học sư phạm ứng dụng và đánh giá SKKN theo chuẩn Bộ Giáo dục và Đào tạo Việt Nam.
Thông tin đề tài của giáo viên hiện tại:
${initiativeContext ? JSON.stringify(initiativeContext) : 'Đang trong quá trình biên soạn'}

Hãy trả lời nhiệt tình, sư phạm, dẫn chứng cụ thể theo các Thông tư, Nghị định của Bộ GD&ĐT, chỉ rõ cách áp dụng vào thực tế giảng dạy.`;

    const prompt = `Lịch sử hội thoại:
${messages
  .slice(-4)
  .map((m: any) => `${m.role === 'user' ? 'Giáo viên' : 'Cố vấn'}: ${m.content}`)
  .join('\n')}

Câu hỏi mới nhất của giáo viên: "${lastMsg}"`;

    const result = await callGemini(prompt, systemInstruction);
    res.json({ success: true, reply: result });
  } catch (error: any) {
    console.error('Error in consultant chat:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mount Vite or serve static
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduSKKN Server listening on port ${PORT}`);
  });
}

startServer();
