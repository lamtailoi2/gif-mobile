import React from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { useGetWorkoutSessions } from '../queries';
import { useHistoryStore } from '../store/use-history-store';
import { IWorkoutSession } from '../types/history';

export const HistoryList = () => {
    const { searchQuery, setSearchQuery } = useHistoryStore();

    const { data: sessions, isLoading: isSessionsLoading } = useGetWorkoutSessions();

    const renderWorkoutItem = ({ item }: { item: IWorkoutSession }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.intensity}>{item.intensity}</Text>
            <Text style={styles.details}>
                {item.date} • {item.time}
            </Text>
            <View style={styles.statsRow}>
                <Text style={styles.stat}>{item.durationMinutes} min</Text>
                <Text style={styles.stat}>{item.caloriesBurned} kcal</Text>
                <Text style={styles.stat}>{item.exercisesCount} Exer.</Text>
            </View>
        </View>
    );

    // Chỉ check loading của sessions
    if (isSessionsLoading) {
        return <ActivityIndicator size="large" color="#D4FF00" />;
    }

    return (
        <View style={styles.container}>
            {/* Overview Section */}
            <View style={styles.overviewContainer}>
                <Text style={styles.headerTitle}>Workout History</Text>
            </View>

            {/* Search Section */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search sessions..."
                placeholderTextColor="#888"
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Sessions List */}
            <FlatList
                data={sessions}
                keyExtractor={(item) => item.id}
                renderItem={renderWorkoutItem}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        paddingHorizontal: 16,
    },
    overviewContainer: {
        paddingVertical: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 16,
    },
    searchInput: {
        backgroundColor: '#1A1A1A',
        color: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    listContainer: {
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#111111',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderColor: '#333333',
        borderWidth: 1,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
    intensity: {
        color: '#D4FF00',
        fontSize: 10,
        marginTop: 4,
    },
    details: {
        color: '#888888',
        fontSize: 12,
        marginVertical: 8,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    stat: {
        color: '#CCCCCC',
        fontSize: 14,
    },
});