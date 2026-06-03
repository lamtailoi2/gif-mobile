import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN'];
const WEEKS = Array.from({ length: 18 }); // Giả lập 18 cột (tuần)
const DAYS = Array.from({ length: 7 }); // 7 ngày trong tuần

export const ConsistencyMap = () => {
    // Hàm random để tạo data giả lập hiển thị
    const getSquareColor = () => {
        const rand = Math.random();
        if (rand > 0.8) return '#D4FF00'; // Xanh neon
        if (rand > 0.6) return '#88AA00'; // Xanh lá đậm
        return '#222222'; // Xám đen (không tập)
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Consistency</Text>

            <View style={styles.monthsRow}>
                {MONTHS.map((m, i) => (
                    <Text key={i} style={styles.monthText}>{m}</Text>
                ))}
            </View>

            <View style={styles.gridContainer}>
                {WEEKS.map((_, weekIndex) => (
                    <View key={weekIndex} style={styles.column}>
                        {DAYS.map((_, dayIndex) => (
                            <View
                                key={dayIndex}
                                style={[styles.square, { backgroundColor: getSquareColor() }]}
                            />
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: { backgroundColor: '#1A1A1A', padding: 16, borderRadius: 16, marginBottom: 16 },
    title: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 16 },
    monthsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20, marginBottom: 8 },
    monthText: { color: '#555555', fontSize: 10, fontWeight: 'bold' },
    gridContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    column: { flexDirection: 'column', gap: 4 },
    square: { width: 12, height: 12, borderRadius: 2 }
});