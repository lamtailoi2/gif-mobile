import { Stack } from 'expo-router';
import React from 'react';
import { HistoryList } from '../features/history/components';

export default function HistoryScreen() {
    return (
        <>
            {/* Cấu hình header cho trang này nếu muốn */}
            <Stack.Screen options={{ title: 'History', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
            <HistoryList />
        </>
    );
}