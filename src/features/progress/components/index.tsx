import { Href, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Hooks và Components
import { useGetProgressDashboard } from '../queries';
import { AiInsight } from './ai-insight';
import { ConsistencyMap } from './consistency-map';
import { HealthMetrics } from './health-metrics';
import { RecoveryChart } from './recovery-chart';
import { VolumeChart } from './volume-chart';

export const ProgressDashboard = () => {
    const router = useRouter();
    const { data, isLoading, isError } = useGetProgressDashboard();

    const handleGoToHistory = () => {
        router.push('/progress/history' as Href);
    };

    if (isLoading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#D4FF00" />
            </View>
        );
    }

    if (isError || !data) {
        return (
            <View style={styles.centerContainer}>
                <Text style={{ color: 'white' }}>Không thể tải dữ liệu Progress</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>Deep dive into your biometrics and progression.</Text>

            {/* Các component nhận dữ liệu động */}
            <AiInsight data={data.aiInsight} />

            {/* Các component giữ UI tĩnh chờ update data sau */}
            <VolumeChart />
            <ConsistencyMap />

            {/* Các component nhận dữ liệu động */}
            <RecoveryChart data={data.recoveryData} />
            <HealthMetrics data={data.healthMetrics} />

            <TouchableOpacity style={styles.historyButton} onPress={handleGoToHistory}>
                <Text style={styles.historyButtonText}>View Workout History</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000000' },
    centerContainer: { flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' },
    content: { padding: 16, paddingBottom: 100 },
    title: { color: '#FFFFFF', fontSize: 28, fontWeight: 'bold', marginBottom: 4 },
    subtitle: { color: '#888888', fontSize: 14, marginBottom: 24 },
    historyButton: {
        backgroundColor: '#D4FF00',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    historyButtonText: {
        color: '#000000',
        fontSize: 16,
        fontWeight: 'bold',
    }
});