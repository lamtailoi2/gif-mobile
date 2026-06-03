import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useGetHistoryOverview, useGetWorkoutSessions } from '../queries';
import { useHistoryStore } from '../store/use-history-store';

import { OverviewStats } from './overview-stats';
import { WeeklyCalendar } from './weekly-calendar';
import { WorkoutCard } from './workout-card';

export const HistoryList = () => {
    const router = useRouter();
    const { searchQuery, setSearchQuery } = useHistoryStore();

    const { data: overview, isLoading: isOverviewLoading } = useGetHistoryOverview();
    const { data: sessions, isLoading: isSessionsLoading } = useGetWorkoutSessions();

    if (isOverviewLoading || isSessionsLoading) {
        return <ActivityIndicator style={styles.loader} size="large" color="#D4FF00" />;
    }

    const renderHeader = () => (
        <View>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                <Text style={styles.backBtnText}>← Back to Progress</Text>
            </TouchableOpacity>

            <Text style={styles.topLabel}>ACTIVITY OVERVIEW</Text>
            <Text style={styles.headerTitle}>Workout History</Text>

            <OverviewStats data={overview} />

            {/* Chèn Calendar vào đây */}
            <WeeklyCalendar />

            <TextInput
                style={styles.searchInput}
                placeholder="Search sessions..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />
        </View>
    );

    const renderFooter = () => (
        <View style={styles.footer}>
            <View style={styles.monthlyGoalCard}>
                <View>
                    <Text style={styles.goalLabel}>MONTHLY GOAL</Text>
                    <Text style={styles.goalValue}>12/15</Text>
                    <Text style={styles.goalSub}>Workouts completed</Text>
                </View>
                <View style={styles.mockCircle}><Text style={styles.circleText}>80%</Text></View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <WorkoutCard item={item} />}
                ListHeaderComponent={renderHeader}
                ListFooterComponent={renderFooter}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

// ... (Giữ nguyên các styles ở dưới)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    loader: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
    listContent: { padding: 16, paddingBottom: 100 },
    backBtn: { marginBottom: 16, marginTop: 10 },
    backBtnText: { color: '#D4FF00', fontSize: 16, fontWeight: 'bold' },
    topLabel: { color: '#888', fontSize: 12, fontWeight: 'bold', letterSpacing: 1 },
    headerTitle: { color: '#FFF', fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
    searchInput: { backgroundColor: '#1A1A1A', color: '#FFF', borderRadius: 12, padding: 16, marginBottom: 20 },
    footer: { marginTop: 20 },
    monthlyGoalCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#111', padding: 20, borderRadius: 16, borderColor: '#333', borderWidth: 1, alignItems: 'center' },
    goalLabel: { color: '#888', fontSize: 10, fontWeight: 'bold' },
    goalValue: { color: '#FFF', fontSize: 24, fontWeight: 'bold', marginVertical: 4 },
    goalSub: { color: '#CCC', fontSize: 12 },
    mockCircle: { width: 60, height: 60, borderRadius: 30, borderColor: '#D4FF00', borderWidth: 4, justifyContent: 'center', alignItems: 'center' },
    circleText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' }
});