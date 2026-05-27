import { create } from "zustand";
import { ExerciseFilterParams } from "../hooks/useExercisesFilter";

interface ExerciseLibraryStore {
  filters: ExerciseFilterParams;
  selectedExerciseId: string | null;
  setFilters: (filters: ExerciseFilterParams) => void;
  setSelectedExerciseId: (id: string | null) => void;
  clearFilters: () => void;
}

export const useExerciseLibraryStore = create<ExerciseLibraryStore>((set) => ({
  filters: {},
  selectedExerciseId: null,
  setFilters: (filters) => set({ filters }),
  setSelectedExerciseId: (selectedExerciseId) => set({ selectedExerciseId }),
  clearFilters: () => set({ filters: {}, selectedExerciseId: null }),
}));
