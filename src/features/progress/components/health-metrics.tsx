// src/features/progress/components/health-metrics.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const HealthMetrics = () => {
    return (
        <View style={styles.row}>
            <View style={styles.card}>
                <Text style={styles.label}>AVG HRV</Text>
                <Text style={styles.value}>64 <Text style={styles.unit}>ms</Text></Text>
            </View>
            <View style={styles.card}>
                <Text style={styles.label}>SLEEP SCORE</Text>
                <Text style={styles.value}>82<Text style={styles.unit}>/100</Text></Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    card: { flex: 1, backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16, marginHorizontal: 4 },
    label: { color: '#888', fontSize: 12, marginBottom: 8 },
    value: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    unit: { fontSize: 14, color: '#888', fontWeight: 'normal' }
});