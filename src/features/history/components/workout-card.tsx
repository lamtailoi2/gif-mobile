import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IWorkoutSession } from '../types/history';

export const WorkoutCard = ({ item }: { item: IWorkoutSession }) => (
    <View style={styles.card}>
        <View style={styles.header}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.intensity}>{item.intensity}</Text>
        </View>
        <Text style={styles.details}>{item.date} • {item.time}</Text>
        <View style={styles.statsRow}>
            <Text style={styles.stat}>🕒 {item.durationMinutes} min</Text>
            <Text style={styles.stat}>🔥 {item.caloriesBurned} kcal</Text>
            <Text style={styles.stat}>🏋️ {item.exercisesCount} Exer.</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    card: { backgroundColor: '#111', borderRadius: 16, padding: 16, marginBottom: 12, borderColor: '#333', borderWidth: 1 },
    header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    title: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
    intensity: { color: '#000', backgroundColor: '#D4FF00', fontSize: 10, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: 'bold' },
    details: { color: '#888', fontSize: 12, marginVertical: 8 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    stat: { color: '#CCC', fontSize: 14 },
});