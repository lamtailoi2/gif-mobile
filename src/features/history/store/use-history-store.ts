import { create } from 'zustand';

export interface IHistoryState {
    searchQuery: string;
    selectedDate: Date;
    setSearchQuery: (query: string) => void;
    setSelectedDate: (date: Date) => void;
    resetFilter: () => void;
}

export const useHistoryStore = create<IHistoryState>((set) => ({
    searchQuery: '',
    selectedDate: new Date(),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setSelectedDate: (date) => set({ selectedDate: date }),
    resetFilter: () => set({ searchQuery: '', selectedDate: new Date() }),
}));