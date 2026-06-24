import React, { useCallback, useRef } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { useUser } from '@clerk/expo';
import { streamChat } from './ai-service/gemini.service';
import { IChatMessage, IGeminiContent, INutritionContext } from './ai-service/types';
import { useCoachStore } from './store/use-coach-store';
import ChatBubble from './components/chat-bubble';
import ChatInputBar from './components/chat-input-bar';
import SuggestionChips from './components/suggestion-chips';

function buildNutritionContext(user: any): INutritionContext {
  const meta = user?.unsafeMetadata ?? {};
  return {
    goal: meta.goal,
    level: meta.level,
    gender: meta.gender,
    weightKg: meta.weightKg,
    heightCm: meta.heightCm,
    daysPerWeek: meta.daysPerWeek,
  };
}

function buildGeminiHistory(messages: IChatMessage[]): IGeminiContent[] {
  return messages
    .filter((m) => !m.isStreaming || m.content.length > 0)
    .filter((m) => m.id !== 'welcome')
    .map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }],
    }));
}

export default function CoachFeature() {
  const { user } = useUser();
  const flatListRef = useRef<FlatList>(null);

  const {
    messages,
    isStreaming,
    addMessage,
    appendToLastMessage,
    setLastMessageStreaming,
    setIsStreaming,
  } = useCoachStore();

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 80);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || isStreaming) return;

      const userMsg: IChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content,
        timestamp: new Date(),
      };
      addMessage(userMsg);
      scrollToBottom();

      const assistantMsg: IChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      };
      addMessage(assistantMsg);
      setIsStreaming(true);
      scrollToBottom();

      const history = buildGeminiHistory([...messages, userMsg]);
      const context = buildNutritionContext(user);

      await streamChat(
        history,
        context,
        (token) => { appendToLastMessage(token); scrollToBottom(); },
        () => { setLastMessageStreaming(false); setIsStreaming(false); scrollToBottom(); },
        (err) => {
          console.error('[Coach] Stream error:', err);
          appendToLastMessage('\n\n⚠️ Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.');
          setLastMessageStreaming(false);
          setIsStreaming(false);
        }
      );
    },
    [isStreaming, messages, user, addMessage, appendToLastMessage, setLastMessageStreaming, setIsStreaming, scrollToBottom]
  );

  const renderItem = useCallback(
    ({ item, index }: { item: IChatMessage; index: number }) => {
      const isLast = index === messages.length - 1;
      const isWelcome = item.id === 'welcome';
      // Show timestamp on first message only
      const showTimestamp = index === 0;
      return (
        <View style={isLast ? styles.lastItem : undefined}>
          <ChatBubble message={item} showTimestamp={showTimestamp} />
          {isWelcome && isLast && <SuggestionChips onSelect={handleSend} />}
        </View>
      );
    },
    [messages.length, handleSend]
  );

  const keyExtractor = useCallback((item: IChatMessage) => item.id, []);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
    >
      <View style={styles.flex}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
        />

        {/* Floating input bar at bottom */}
        <View style={styles.inputWrapper}>
          <ChatInputBar isStreaming={isStreaming} onSend={handleSend} />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: '#131313',
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 180,
  },
  lastItem: {
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
