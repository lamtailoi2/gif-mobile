import { create } from 'zustand';
import { getLocalDateString } from '@/utils/date';

export type TTimeView = 'Week' | 'Month' | 'All Time';

export interface IHistoryState {
    timeView: TTimeView;
    selectedDate: string; // Lưu theo 'YYYY-MM-DD'
    searchQuery: string;
    selectedFilter: string; // 'ALL', 'PUSH', 'PULL'...

    setTimeView: (view: TTimeView) => void;
    setSelectedDate: (date: string) => void;
    setSearchQuery: (query: string) => void;
    setSelectedFilter: (filter: string) => void;
}

// Lấy ngày hôm nay làm mặc định (YYYY-MM-DD)
const today = getLocalDateString();

export const useHistoryStore = create<IHistoryState>((set) => ({
    timeView: 'Week',
    selectedDate: today,
    searchQuery: '',
    selectedFilter: 'ALL',

    setTimeView: (view) => set({ timeView: view }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedFilter: (filter) => set({ selectedFilter: filter }),
}));
