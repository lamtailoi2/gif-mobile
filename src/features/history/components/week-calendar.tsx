import React, { useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useHistoryStore } from '../store/use-history-store';

interface IProps {
    workoutDates: string[];
}

export const WeekCalendar = ({ workoutDates }: IProps) => {
    const { selectedDate, setSelectedDate } = useHistoryStore();

    const weekDays = useMemo(() => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

        const monday = new Date(today);
        monday.setDate(today.getDate() - daysToMonday);

        const days = [];
        const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            const dateString = date.toISOString().split('T')[0];

            days.push({
                name: dayNames[i],
                dayNumber: date.getDate().toString(),
                fullDate: dateString,
                hasWorkout: workoutDates.includes(dateString)
            });
        }
        return days;
    }, [workoutDates]);

    return (
        <View style={styles.row}>
            {weekDays.map((d) => {
                const isSelected = selectedDate === d.fullDate;
                return (
                    <TouchableOpacity
                        key={d.fullDate}
                        style={styles.dayCol}
                        onPress={() => setSelectedDate(d.fullDate)}
                    >
                        <Text style={[styles.dayName, isSelected && styles.selectedText]}>{d.name}</Text>
                        <View style={[
                            styles.circle,
                            d.hasWorkout && !isSelected && styles.hasWorkoutCircle,
                            isSelected && styles.selectedCircle
                        ]}>
                            <Text style={[styles.dayNumber, isSelected && styles.selectedNumber]}>
                                {d.dayNumber}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    dayCol: { alignItems: 'center', gap: 8 },
    dayName: { color: '#888', fontSize: 10, fontWeight: 'bold' },
    circle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111', borderWidth: 1, borderColor: '#111' },
    hasWorkoutCircle: { borderColor: '#D4FF00' },
    selectedCircle: { backgroundColor: '#D4FF00', borderColor: '#D4FF00', shadowColor: '#D4FF00', shadowOpacity: 0.5, shadowRadius: 10 },
    dayNumber: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    selectedText: { color: '#D4FF00' },
    selectedNumber: { color: '#000' }
});