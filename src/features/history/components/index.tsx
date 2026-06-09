import { useRouter } from 'expo-router'; // 1. Import router
import React, { useMemo } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetWorkoutSessions } from '../queries';
import { useHistoryStore } from '../store/use-history-store';
import { FilterChips } from './filter-chips';
import { TimeSelector } from './time-selector';
import { WeekCalendar } from './week-calendar';
import { WorkoutCard } from './workout-card';

export const HistoryList = () => {
    const router = useRouter();
    const { timeView, selectedDate, searchQuery, selectedFilter, setSearchQuery } = useHistoryStore();

    const { data: workouts = [] as any[], isLoading } = useGetWorkoutSessions();

    const workoutDates = useMemo(() => [...new Set(workouts.map(w => w.date))] as string[], [workouts]);

    const filteredData = useMemo(() => {
        return workouts.filter((w) => {
            const matchSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase());
            const matchFilter = selectedFilter === 'ALL' || w.type.toUpperCase() === selectedFilter;
            const matchDate = timeView === 'Week' ? w.date === selectedDate : true;
            return matchSearch && matchFilter && matchDate;
        });
    }, [workouts, searchQuery, selectedFilter, timeView, selectedDate]);

    const formatDateHeader = (dateString: string) => {
        const d = new Date(dateString);
        return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
    };

    if (isLoading) return <ActivityIndicator style={styles.loader} size="large" color="#D4FF00" />;

    return (
        <View style={styles.container}>
            {/* 3. Thêm nút quay lại */}
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <Text style={styles.backBtnText}>← Back to Progress</Text>
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

    // Style cho nút Back
    backBtn: { marginBottom: 12 },
    backBtnText: { color: '#D4FF00', fontSize: 16, fontWeight: 'bold' },

    // Style cho phần kéo cuộn không bị che
    listContent: { paddingBottom: 120 },

    title: { color: '#D4FF00', fontSize: 28, fontWeight: 'bold', fontFamily: 'serif' },
    subtitle: { color: '#AAA', fontSize: 14, marginBottom: 24 },
    searchInput: { backgroundColor: '#111', color: '#FFF', borderRadius: 12, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: '#222' },
    chipWrapper: { height: 50 },
    dateHeader: { color: '#FFF', fontSize: 12, fontWeight: 'bold', letterSpacing: 1, marginTop: 10, marginBottom: 10 }
});