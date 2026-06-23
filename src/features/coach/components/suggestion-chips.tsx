import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

interface ISuggestionChipsProps {
  onSelect: (text: string) => void;
}

const SUGGESTIONS = [
  { label: "How's my recovery?" },
  { label: 'Explain' },
  { label: 'Lên kế hoạch tuần này' },
  { label: 'Tôi nên ăn gì?' },
];

export default function SuggestionChips({ onSelect }: ISuggestionChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {SUGGESTIONS.map((s) => (
        <Pressable
          key={s.label}
          style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
          onPress={() => onSelect(s.label)}
        >
          <Text style={styles.chipText}>{s.label}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    marginTop: 10,
    marginLeft: 46,
  },
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  chipPressed: {
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  chipText: {
    fontSize: 13,
    color: '#c9d1d9',
    fontFamily: 'Inter',
    fontWeight: '500',
  },
});
