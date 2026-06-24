export type TChatRole = 'user' | 'assistant';

export interface IChatMessage {
  id: string;
  role: TChatRole;
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export interface INutritionContext {
  goal?: string;
  level?: string;
  gender?: string;
  weightKg?: number;
  heightCm?: number;
  daysPerWeek?: number;
}

// Gemini API types
export interface IGeminiContent {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface IGeminiStreamChunk {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
    finishReason?: string;
  }[];
}
