import { IGeminiContent, INutritionContext } from './types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

function getApiKey(): string {
  // Use Groq API Key which is already proven to work in this project
  return process.env.GROQ_API_KEY ?? process.env.EXPO_PUBLIC_GROQ_API_KEY ?? '';
}

function buildSystemPrompt(context: INutritionContext): string {
  const goalMap: Record<string, string> = {
    LoseWeight: 'giảm cân, tạo thâm hụt calo',
    BuildMuscle: 'tăng cơ, tăng khối lượng',
    ImproveEndurance: 'cải thiện sức bền, cardio',
    GeneralFitness: 'duy trì sức khỏe tổng thể',
  };
  const levelMap: Record<string, string> = {
    Beginner: 'mới bắt đầu',
    Intermediate: 'trung cấp',
    Advanced: 'nâng cao',
  };
  const genderMap: Record<string, string> = {
    Male: 'nam',
    Female: 'nữ',
    Other: 'khác',
  };

  const goalDesc = goalMap[context.goal ?? ''] ?? context.goal ?? 'chưa xác định';
  const levelDesc = levelMap[context.level ?? ''] ?? context.level ?? 'chưa xác định';
  const genderDesc = genderMap[context.gender ?? ''] ?? context.gender ?? 'chưa xác định';

  let bmiNote = '';
  if (context.weightKg && context.heightCm) {
    const heightM = context.heightCm / 100;
    const bmi = context.weightKg / (heightM * heightM);
    bmiNote = `BMI hiện tại: ${bmi.toFixed(1)}.`;
  }

  let tdeeNote = '';
  if (context.weightKg && context.heightCm) {
    const bmr =
      context.gender === 'Female'
        ? 447.6 + 9.2 * context.weightKg + 3.1 * context.heightCm
        : 88.4 + 13.4 * context.weightKg + 4.8 * context.heightCm;
    const activityMultiplier =
      (context.daysPerWeek ?? 3) >= 5 ? 1.55 : (context.daysPerWeek ?? 3) >= 3 ? 1.375 : 1.2;
    const tdee = Math.round(bmr * activityMultiplier);
    tdeeNote = `TDEE ước tính: ~${tdee} kcal/ngày.`;
  }

  return `Bạn là AI Coach dinh dưỡng của ứng dụng G.I.F (Get In Form) — chuyên gia tư vấn dinh dưỡng cho người tập gym.

THÔNG TIN NGƯỜI DÙNG:
- Giới tính: ${genderDesc}
- Cân nặng: ${context.weightKg ? context.weightKg + ' kg' : 'chưa cập nhật'}
- Chiều cao: ${context.heightCm ? context.heightCm + ' cm' : 'chưa cập nhật'}
- Mục tiêu: ${goalDesc}
- Trình độ: ${levelDesc}
- Số ngày tập/tuần: ${context.daysPerWeek ?? 'chưa cập nhật'}
${bmiNote ? '- ' + bmiNote : ''}
${tdeeNote ? '- ' + tdeeNote : ''}

PHONG CÁCH TRẢ LỜI:
- Trả lời hoàn toàn bằng tiếng Việt
- Ngắn gọn, rõ ràng, thực tế — không lan man
- Dùng số liệu cụ thể (gram protein, kcal, tỉ lệ macro)
- Ưu tiên thực phẩm phổ biến tại Việt Nam (cơm, gà, trứng, đậu phụ, rau muống...)
- Luôn cá nhân hóa theo thông tin user ở trên
- Nếu user hỏi ngoài dinh dưỡng/tập luyện, nhắc nhở nhẹ nhàng và gợi ý câu hỏi phù hợp hơn
- Dùng emoji hợp lý để dễ đọc (không lạm dụng)`;
}

export async function streamChat(
  history: IGeminiContent[],
  context: INutritionContext,
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (err: Error) => void
): Promise<void> {
  const apiKey = getApiKey();
  if (!apiKey) {
    onError(new Error('GROQ_API_KEY chưa được cấu hình. Vui lòng thêm vào file .env'));
    return;
  }

  const systemInstruction = buildSystemPrompt(context);

  // Convert internal history format (Gemini-like) to OpenAI format for Groq
  const messages = [
    { role: 'system', content: systemInstruction },
    ...history.map((msg) => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.parts[0]?.text ?? '',
    })),
  ];

  const requestBody = {
    model: 'llama-3.3-70b-versatile',
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1024,
  };

  try {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', GROQ_API_URL);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('Authorization', `Bearer ${apiKey}`);

      let processedIndex = 0;
      let buffer = '';

      xhr.onreadystatechange = () => {
        // XMLHttpRequest.LOADING (3) or XMLHttpRequest.DONE (4)
        if (xhr.readyState === 3 || xhr.readyState === 4) {
          if (xhr.status >= 400) return; // Handled in onload

          const currentText = xhr.responseText || '';
          const newText = currentText.substring(processedIndex);
          processedIndex = currentText.length;

          buffer += newText;
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? ''; // Keep the incomplete line in buffer

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;

            const jsonStr = trimmed.slice(5).trim();
            if (!jsonStr || jsonStr === '[DONE]') continue;

            try {
              const chunk = JSON.parse(jsonStr);
              const text = chunk.choices?.[0]?.delta?.content;
              if (text) onToken(text);
            } catch {
              // Bỏ qua chunk bị lỗi parse
            }
          }

          if (xhr.readyState === 4) {
            onDone();
            resolve();
          }
        }
      };

      xhr.onerror = () => {
        const error = new Error('Lỗi kết nối mạng khi stream từ Groq API');
        onError(error);
        reject(error);
      };

      xhr.onload = () => {
        if (xhr.status >= 400) {
          const error = new Error(`Groq API error ${xhr.status}: ${xhr.responseText}`);
          onError(error);
          reject(error);
        }
      };

      xhr.send(JSON.stringify(requestBody));
    });
  } catch (err) {
    onError(err instanceof Error ? err : new Error(String(err)));
  }
}
