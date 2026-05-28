import { create } from "zustand";
import { IExerciseFilterParams } from "../hooks/use-exercises-filter";

interface IExerciseLibraryStore {
  filters: IExerciseFilterParams;
  selectedExerciseId: string | null;
  setFilters: (filters: IExerciseFilterParams) => void;
  setSelectedExerciseId: (id: string | null) => void;
  clearFilters: () => void;
}

export const useExerciseLibraryStore = create<IExerciseLibraryStore>((set) => ({
  filters: {},
  selectedExerciseId: null,
  setFilters: (filters) => set({ filters }),
  setSelectedExerciseId: (selectedExerciseId) => set({ selectedExerciseId }),
  clearFilters: () => set({ filters: {}, selectedExerciseId: null }),
}));
