import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const OverviewStats = ({ data }: { data: any }) => (
    <View style={styles.row}>
        <View style={styles.box}>
            <Text style={styles.value}>{data?.totalWorkouts || 0}</Text>
            <Text style={styles.label}>WORKOUTS</Text>
        </View>
        <View style={[styles.box, styles.activeBox]}>
            <Text style={styles.value}>{data?.totalHours || 0}</Text>
            <Text style={styles.label}>HRS TOTAL</Text>
        </View>
        <View style={styles.box}>
            <Text style={styles.value}>{data?.dayStreak || 0}</Text>
            <Text style={styles.label}>DAY STREAK</Text>
        </View>
    </View>
);

const styles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    box: { flex: 1, backgroundColor: '#111', padding: 16, borderRadius: 12, marginHorizontal: 4, alignItems: 'center', borderColor: '#333', borderWidth: 1 },
    activeBox: { borderColor: '#D4FF00', backgroundColor: '#1A1A00' },
    value: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    label: { color: '#888', fontSize: 10, marginTop: 4 }
});