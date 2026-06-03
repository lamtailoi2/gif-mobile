import { Href, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

import { AiInsight } from './ai-insight';
import { ConsistencyMap } from './consistency-map';
import { HealthMetrics } from './health-metrics';
import { RecoveryChart } from './recovery-chart';
import { VolumeChart } from './volume-chart';

export const ProgressDashboard = () => {
    const router = useRouter();

    const handleGoToHistory = () => {
        router.push('/history' as Href);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.title}>Analytics</Text>
            <Text style={styles.subtitle}>Deep dive into your biometrics and progression.</Text>

            <AiInsight />
            <VolumeChart />
            <ConsistencyMap />
            <RecoveryChart />
            <HealthMetrics />

            <TouchableOpacity style={styles.historyButton} onPress={handleGoToHistory}>
                <Text style={styles.historyButtonText}>View Workout History</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000'
    },
    content: {
        padding: 16,
        paddingBottom: 40
    },
    title: {
        color: '#FFFFFF',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 4
    },
    subtitle: {
        color: '#888888',
        fontSize: 14,
        marginBottom: 24
    },
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