import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

// Paper-plane send icon drawn in SVG — guaranteed to render on Android
function SendIcon({ color = '#161e00', size = 24 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Outer triangle (body) */}
      <Path
        d="M22 2L11 13"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={color}
        fillOpacity={0.15}
      />
    </Svg>
  );
}

function MicIcon({ color = '#161e00', size = 22 }: { color?: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
        fill={color}
      />
      <Path
        d="M19 10v2a7 7 0 0 1-14 0v-2"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M12 19v4M8 23h8"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

interface IChatInputBarProps {
  isStreaming: boolean;
  onSend: (text: string) => void;
}

export default function ChatInputBar({ isStreaming, onSend }: IChatInputBarProps) {
  const [localText, setLocalText] = useState('');
  const inputRef = useRef<TextInput>(null);
  const hasText = localText.trim().length > 0;

  const handleSend = () => {
    if (hasText && !isStreaming) {
      onSend(localText.trim());
      setLocalText('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Input field */}
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={localText}
        onChangeText={setLocalText}
        placeholder="Type or speak..."
        placeholderTextColor="#6b7280"
        multiline
        maxLength={500}
        editable={!isStreaming}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />

      {/* Neon green circle send/mic button */}
      <Pressable
        style={({ pressed }) => [
          styles.circleBtn,
          pressed && styles.circleBtnPressed,
          isStreaming && hasText && styles.circleBtnDisabled,
        ]}
        onPress={hasText ? handleSend : undefined}
        disabled={isStreaming && hasText}
        accessibilityLabel={hasText ? 'Send message' : 'Voice input'}
      >
        {isStreaming && hasText ? (
          <ActivityIndicator size="small" color="#ffffff" />
        ) : hasText ? (
          <SendIcon color="#ffffff" size={22} />
        ) : (
          <MicIcon color="#ffffff" size={20} />
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 108,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 28,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 15,
    color: '#e5e2e1',
    fontFamily: 'Inter',
    maxHeight: 110,
    lineHeight: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  circleBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    // Neon green — matches primaryFixedDim from the design system
    backgroundColor: '#abd600',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    // Glow effect matching design system
    elevation: 8,
    shadowColor: '#abd600',
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 4 },
  },
  circleBtnPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.92 }],
  },
  circleBtnDisabled: {
    opacity: 0.5,
  },
});
