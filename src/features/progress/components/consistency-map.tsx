import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ALL_MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

const TOTAL_WEEKS = 18;
const DAYS_PER_WEEK = 7;

interface IConsistencyMapProps {
    data: string[];
}

const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const ConsistencyMap = ({ data = [] }: IConsistencyMapProps) => {

    const dynamicMonths = useMemo(() => {
        const currentMonth = new Date().getMonth();
        const result = [];
        for (let i = 5; i >= 0; i--) {
            let mIndex = currentMonth - i;
            if (mIndex < 0) mIndex += 12;
            result.push(ALL_MONTHS[mIndex]);
        }
        return result;
    }, []);

    const gridData = useMemo(() => {
        const workoutDatesSet = new Set(data);

        const weeksArray = [];

        const endDay = new Date();
        endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));

        for (let week = 0; week < TOTAL_WEEKS; week++) {
            const currentWeek = [];

            for (let day = 0; day < DAYS_PER_WEEK; day++) {
                const totalDaysBack = ((TOTAL_WEEKS - 1 - week) * DAYS_PER_WEEK) + (6 - day);
                const currentDay = new Date(endDay);
                currentDay.setDate(endDay.getDate() - totalDaysBack);

                const dateStr = formatDate(currentDay);

                const isWorkoutDay = workoutDatesSet.has(dateStr);

                let color = '#222222';
                if (currentDay > new Date()) {
                    color = '#111111';
                } else if (isWorkoutDay) {
                    color = '#D4FF00';
                }

                currentWeek.push(color);
            }
            weeksArray.push(currentWeek);
        }
        return weeksArray;
    }, [data]);

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Consistency</Text>

            <View style={styles.monthsRow}>
                {dynamicMonths.map((m, i) => (
                    <Text key={i} style={styles.monthText}>{m}</Text>
                ))}
            </View>

            <View style={styles.gridContainer}>
                {gridData.map((week, weekIndex) => (
                    <View key={weekIndex} style={styles.column}>
                        {week.map((color, dayIndex) => (
                            <View
                                key={dayIndex}
                                style={[styles.square, { backgroundColor: color }]}
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