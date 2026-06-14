import { useUser } from '@clerk/expo';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetWorkoutSessions } from '../queries';
import { useHistoryStore } from '../store/use-history-store';
import { IWorkoutSession } from '../types/history';
import { FilterChips } from './filter-chips';
import { TimeSelector } from './time-selector';
import { WeekCalendar } from './week-calendar';
import { WorkoutCard } from './workout-card';

export const HistoryList = () => {
    const router = useRouter();
    const { timeView, selectedDate, searchQuery, selectedFilter, setSearchQuery } = useHistoryStore();
    const { user } = useUser();

    // 1. Đã xóa biến isError thừa
    const { data: workouts = [] as IWorkoutSession[], isLoading } = useGetWorkoutSessions(user?.id);

    // 2. KHAI BÁO USEMEMO TRƯỚC BẤT KỲ LỆNH RETURN NÀO
    const workoutDates = useMemo(() => [...new Set(workouts.map(w => w.date))] as string[], [workouts]);

    const filteredData = useMemo(() => {
        return workouts.filter((w) => {
            const safeType = w.type || '';
            const safeSearch = searchQuery || '';
            const matchSearch = safeType.toLowerCase().includes(safeSearch.toLowerCase());
            const matchFilter = selectedFilter === 'ALL' || safeType.toUpperCase() === selectedFilter;
            const matchDate = timeView === 'Week' ? w.date === selectedDate : true;
            return matchSearch && matchFilter && matchDate;
        });
    }, [workouts, searchQuery, selectedFilter, timeView, selectedDate]);

    const formatDateHeader = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    };

    if (!user || isLoading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#D4FF00" />;
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color="#AAAAAA" />
            </TouchableOpacity>

            <Text style={styles.title}>Workout History</Text>
            <Text style={styles.subtitle}>View all your past workouts</Text>

            <TimeSelector />

            {timeView === 'Week' && <WeekCalendar workoutDates={workoutDates} />}

            <TextInput
                style={styles.searchInput}
                placeholder="Search workouts..."
                placeholderTextColor="#666"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <View style={styles.chipWrapper}>
                <FilterChips />
            </View>

            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item, index }) => {
                    const showHeader = index === 0 || filteredData[index - 1].date !== item.date;
                    return (
                        <View>
                            {showHeader && <Text style={styles.dateHeader}>{formatDateHeader(item.date)}</Text>}
                            <WorkoutCard item={item} />
                        </View>
                    );
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0A0A0A', paddingHorizontal: 16, paddingTop: 40 },
    loader: { flex: 1, backgroundColor: '#0A0A0A', justifyContent: 'center' },
    backBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#222222', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    listContent: { paddingBottom: 120 },
    title: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold' },
    subtitle: { color: '#888888', fontSize: 14, marginBottom: 24 },
    searchInput: { backgroundColor: '#111', color: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#222' },
    chipWrapper: { height: 50 },
    dateHeader: { color: '#FFF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginTop: 10, marginBottom: 10 }
});