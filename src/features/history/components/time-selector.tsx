// src/features/history/components/time-selector.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TTimeView, useHistoryStore } from '../store/use-history-store';

const VIEWS: TTimeView[] = ['Week', 'Month', 'All Time'];

export const TimeSelector = () => {
    const { timeView, setTimeView } = useHistoryStore();

    return (
        <View style={styles.container}>
            {VIEWS.map((view) => (
                <TouchableOpacity
                    key={view}
                    style={[styles.button, timeView === view && styles.activeButton]}
                    onPress={() => setTimeView(view)}
                >
                    <Text style={[styles.text, timeView === view && styles.activeText]}>
                        {view}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', backgroundColor: '#1A1A1A', borderRadius: 20, padding: 4, marginBottom: 20 },
    button: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 16 },
    activeButton: { backgroundColor: '#333' },
    text: { color: '#888', fontSize: 14, fontWeight: 'bold' },
    activeText: { color: '#FFF' },
});