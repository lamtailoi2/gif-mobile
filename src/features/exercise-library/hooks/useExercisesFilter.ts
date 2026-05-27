import { Exercise } from "@/types/common";
import { useMemo } from "react";

export interface ExerciseFilterParams {
  category?: "strength" | "cardio" | "flexibility" | "plyometric";
  muscleGroup?: string;
  equipment?: string[];
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export const useExerciseFilter = (
  exercises: Exercise[],
  filters: ExerciseFilterParams,
) => {
  return useMemo(() => {
    let filtered = [...exercises];

    if (filters.category) {
      filtered = filtered.filter((ex) => ex.category === filters.category);
    }

    if (filters.muscleGroup) {
      filtered = filtered.filter((ex) =>
        ex.muscleGroups.includes(filters.muscleGroup!),
      );
    }

    if (filters.difficulty) {
      filtered = filtered.filter((ex) => ex.difficulty === filters.difficulty);
    }

    if (filters.equipment && filters.equipment.length > 0) {
      filtered = filtered.filter((ex) =>
        filters.equipment!.some((eq) => ex.equipment.includes(eq)),
      );
    }

    return filtered;
  }, [exercises, filters]);
};
