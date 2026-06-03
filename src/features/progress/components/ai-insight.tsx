// src/features/progress/components/ai-insight.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const AiInsight = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.label}>AI INSIGHT</Text>
            <Text style={styles.text}>
                You perform <Text style={styles.highlight}>15% better</Text> on Tuesday mornings. Consider shifting heavy lifts to this window.
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