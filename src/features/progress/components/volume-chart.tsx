// src/features/progress/components/volume-chart.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const VolumeChart = () => {
    return (
        <View style={styles.card}>
            <Text style={styles.title}>Bench Press Volume</Text>
            <Text style={styles.subtitle}>3 Month Trajectory</Text>

            <View style={styles.chartArea}>
                <View style={styles.horizontalLine} />
                <View style={styles.horizontalLine} />
                <View style={styles.horizontalLine} />

                <View style={styles.mockLineContainer}>
                    <View style={styles.mockLine} />
                </View>
            </View>

            <View style={styles.xAxis}>
                <Text style={styles.xLabel}>SEP</Text>
                <Text style={styles.xLabel}>OCT</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16, marginBottom: 16 },
    title: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
    subtitle: { color: '#888888', fontSize: 12, marginBottom: 16 },
    chartArea: { height: 120, justifyContent: 'space-between', paddingVertical: 10, position: 'relative' },
    horizontalLine: { height: 1, backgroundColor: '#333333', width: '100%' },
    mockLineContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center' },
    mockLine: { height: 40, width: '80%', borderBottomWidth: 4, borderColor: '#D4FF00', borderRadius: 20, transform: [{ rotate: '-10deg' }] },
    xAxis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    xLabel: { color: '#555555', fontSize: 10, fontWeight: 'bold' }
});