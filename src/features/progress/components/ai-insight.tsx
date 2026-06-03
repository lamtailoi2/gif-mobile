// src/features/progress/components/ai-insight.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IAiInsight } from '../types/progress';

interface IAiInsightProps {
    data: IAiInsight;
}

export const AiInsight = ({ data }: IAiInsightProps) => {
    const textParts = data.text.split(data.highlight);

    return (
        <View style={styles.card}>
            <Text style={styles.label}>AI INSIGHT</Text>
            <Text style={styles.text}>
                &quot;{textParts[0]}
                {data.highlight && (
                    <Text style={styles.highlight}>{data.highlight}</Text>
                )}
                {textParts[1] || ''}&quot;
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16, marginBottom: 16 },
    label: { color: '#D4FF00', fontSize: 12, fontWeight: 'bold', marginBottom: 8 },
    text: { color: '#FFFFFF', fontSize: 16, lineHeight: 24 },
    highlight: { color: '#D4FF00', fontWeight: 'bold' }
});