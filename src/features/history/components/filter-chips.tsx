import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useHistoryStore } from '../store/use-history-store';

const FILTERS = ['ALL', 'PUSH', 'PULL', 'LEGS', 'CARDIO', 'CUSTOM'];

export const FilterChips = () => {
    const { selectedFilter, setSelectedFilter } = useHistoryStore();

    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            {FILTERS.map((filter) => (
                <TouchableOpacity
                    key={filter}
                    style={[styles.chip, selectedFilter === filter && styles.chipActive]}
                    onPress={() => setSelectedFilter(filter)}
                >
                    <Text style={[styles.text, selectedFilter === filter && styles.textActive]}>
                        {filter}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flexDirection: 'row', marginBottom: 20 },
    chip: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#333', marginRight: 12 },
    chipActive: { borderColor: '#D4FF00', backgroundColor: 'rgba(212, 255, 0, 0.1)' },
    text: { color: '#888', fontSize: 12, fontWeight: 'bold' },
    textActive: { color: '#D4FF00' }
});