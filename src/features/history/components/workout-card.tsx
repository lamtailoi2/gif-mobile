import React from 'react';
import { StyleSheet, Text, View } from 'react-native'; // Đổi TouchableOpacity thành View
import { IWorkoutSession } from '../types/history';

export const WorkoutCard = ({ item }: { item: IWorkoutSession }) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.titleRow}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.intensity}>{item.intensity}</Text>
                </View>
                {/* Đã xóa thẻ Text chứa mũi tên ở đây */}
            </View>
            <Text style={styles.time}>{item.time}</Text>
            <View style={styles.statsRow}>
                <Text style={styles.stat}>⏱ {item.durationMinutes} min</Text>
                <Text style={styles.stat}>🔥 {item.caloriesBurned} kcal</Text>
                <Text style={styles.stat}>🏋️ {item.exercisesCount} exercises</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#111',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#D4FF00',
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#222'
    },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    intensity: { color: '#000', backgroundColor: '#D4FF00', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold' },
    time: { color: '#888', fontSize: 12, marginVertical: 8 },
    statsRow: { flexDirection: 'row', gap: 16, marginTop: 8 },
    stat: { color: '#CCC', fontSize: 12 },
});