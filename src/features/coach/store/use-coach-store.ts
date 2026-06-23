import { create } from 'zustand';
import { IChatMessage } from '../ai-service/types';

interface ICoachStore {
  messages: IChatMessage[];
  isStreaming: boolean;

  addMessage: (message: IChatMessage) => void;
  appendToLastMessage: (token: string) => void;
  setLastMessageStreaming: (isStreaming: boolean) => void;
  setIsStreaming: (value: boolean) => void;
  clearMessages: () => void;
}

const initialMessages: IChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content: 'Xin chào! Tôi là G.I.F Coach, chuyên gia dinh dưỡng và tập luyện AI của bạn. Dựa trên mục tiêu của bạn, tôi có thể tư vấn thực đơn, macro và các kiến thức fitness. Bạn muốn hỏi gì hôm nay?',
    timestamp: new Date(),
  },
];

export const useCoachStore = create<ICoachStore>((set) => ({
  messages: initialMessages,
  isStreaming: false,

  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),

  appendToLastMessage: (token) =>
    set((state) => {
      const messages = [...state.messages];
      if (messages.length === 0) return state;
      const last = messages[messages.length - 1];
      messages[messages.length - 1] = {
        ...last,
        content: last.content + token,
      };
      return { messages };
    }),

  setLastMessageStreaming: (isStreaming) =>
    set((state) => {
      const messages = [...state.messages];
      if (messages.length === 0) return state;
      const last = messages[messages.length - 1];
      messages[messages.length - 1] = { ...last, isStreaming };
      return { messages };
    }),

  setIsStreaming: (value) => set({ isStreaming: value }),

  clearMessages: () => set({ messages: initialMessages }),
}));
