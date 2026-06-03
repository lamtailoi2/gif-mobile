import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const DATA = [
    { day: 'M', recovery: 40, intensity: 60 },
    { day: 'T', recovery: 80, intensity: 30 },
    { day: 'W', recovery: 50, intensity: 70 },
    { day: 'T', recovery: 30, intensity: 90 },
    { day: 'F', recovery: 85, intensity: 45 },
    { day: 'S', recovery: 70, intensity: 80 },
    { day: 'S', recovery: 40, intensity: 20 },
];

export const RecoveryChart = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Recovery vs Intensity</Text>
            <Text style={styles.subtitle}>7 Day Average</Text>

            <View style={styles.chartContainer}>
                {/* Các đường gióng ngang */}
                <View style={styles.gridLines}>
                    <View style={styles.horizontalLine} />
                    <View style={styles.horizontalLine} />
                    <View style={styles.horizontalLine} />
                    <View style={styles.horizontalLine} />
                </View>

                {/* Các cột biểu đồ */}
                <View style={styles.barsArea}>
                    {DATA.map((item, index) => (
                        <View key={index} style={styles.dayColumn}>
                            <View style={styles.barGroup}>
                                <View style={[styles.bar, styles.barRecovery, { height: `${item.recovery}%` }]} />
                                <View style={[styles.bar, styles.barIntensity, { height: `${item.intensity}%` }]} />
                            </View>
                            <Text style={styles.dayText}>{item.day}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Chú thích (Legend) */}
            <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#88AAFF' }]} />
                    <Text style={styles.legendText}>RECOVERY</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: '#D4FF00' }]} />
                    <Text style={styles.legendText}>INTENSITY</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16, marginBottom: 16 },
    title: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    subtitle: { color: '#888888', fontSize: 12, marginBottom: 20 },
    chartContainer: { height: 160, position: 'relative' },
    gridLines: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between' },
    horizontalLine: { height: 1, backgroundColor: '#333333', width: '100%' },
    barsArea: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 10, zIndex: 2 },
    dayColumn: { alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
    barGroup: { flexDirection: 'row', alignItems: 'flex-end', flex: 1, gap: 2, marginBottom: 8 },
    bar: { width: 10, borderRadius: 2 },
    barRecovery: { backgroundColor: '#88AAFF' },
    barIntensity: { backgroundColor: '#D4FF00' },
    dayText: { color: '#555555', fontSize: 10, fontWeight: 'bold' },
    legendContainer: { flexDirection: 'row', justifyContent: 'center', gap: 20, marginTop: 16 },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendColor: { width: 8, height: 8, borderRadius: 2 },
    legendText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' }
});