import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { IChatMessage } from '../ai-service/types';
import TypingIndicator from './typing-indicator';

interface IChatBubbleProps {
  message: IChatMessage;
  showTimestamp?: boolean;
}

/** Highlight numbers & key nutrition keywords in AI messages */
function parseRichText(text: string): React.ReactNode[] {
  const regex = /(\*\*[^*]+\*\*|\d+[\s]?(?:g|kcal|cal|mg|%|kg|ml|lít|giờ|phút|ngày|tuần|h))/gi;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <Text key={i} style={styles.bold}>{part.slice(2, -2)}</Text>;
    }
    if (regex.test(part)) {
      return <Text key={i} style={styles.highlight}>{part}</Text>;
    }
    return <Text key={i}>{part}</Text>;
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).toUpperCase();
}

export default function ChatBubble({ message, showTimestamp }: IChatBubbleProps) {
  const isUser = message.role === 'user';
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const showTyping = !isUser && message.isStreaming && message.content === '';

  return (
    <>
      {/* Timestamp separator */}
      {showTimestamp && (
        <View style={styles.timestampRow}>
          <Text style={styles.timestamp}>
            TODAY {formatTime(message.timestamp)}
          </Text>
        </View>
      )}

      <Animated.View
        style={[
          styles.row,
          isUser ? styles.rowUser : styles.rowAssistant,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        {/* AI avatar dot */}
        {!isUser && (
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarIcon}>G</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>
        )}

        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
          {showTyping ? (
            <TypingIndicator />
          ) : (
            <Text style={[styles.text, isUser && styles.textUser]}>
              {isUser ? message.content : parseRichText(message.content)}
            </Text>
          )}
        </View>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  timestampRow: {
    alignItems: 'center',
    marginVertical: 12,
  },
  timestamp: {
    fontSize: 11,
    color: '#4b5563',
    fontFamily: 'Inter',
    letterSpacing: 0.8,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  rowAssistant: { justifyContent: 'flex-start' },
  rowUser: { justifyContent: 'flex-end' },
  avatarWrap: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 2,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1e2d00',
    borderWidth: 1.5,
    borderColor: '#abd600',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarIcon: {
    fontSize: 13,
    color: '#abd600',
    fontWeight: '800',
    fontFamily: 'Inter',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#abd600',
    borderWidth: 1.5,
    borderColor: '#131313',
  },
  bubble: {
    maxWidth: '76%',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bubbleAssistant: {
    backgroundColor: '#1e1e1e',
    borderTopLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  bubbleUser: {
    backgroundColor: '#1c2600',
    borderTopRightRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(171,214,0,0.3)',
  },
  text: {
    fontSize: 15,
    lineHeight: 23,
    color: '#d1d5db',
    fontFamily: 'Inter',
  },
  textUser: {
    color: '#e8f5a0',
  },
  highlight: {
    color: '#abd600',
    fontWeight: '600',
  },
  bold: {
    color: '#e5e2e1',
    fontWeight: '700',
  },
});
