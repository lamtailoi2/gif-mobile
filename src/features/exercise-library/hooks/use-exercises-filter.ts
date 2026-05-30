import type { MuscleSlug } from "@/features/home/types/dashboard";
import { useMemo } from "react";
import { MuscleGroup } from "../constants/filter-constants";
import { MUSCLE_GROUP_MAPPING } from "../constants/muscle-group-mapping";
import { IExercise } from "../types/exercise";

export interface IExerciseFilterParams {
  muscleGroup?: MuscleGroup;
  bodyParts?: MuscleSlug[];
  category?: string;
  difficulty?: string;
}

export const useExerciseFilter = (
  exercises: IExercise[],
  filters: IExerciseFilterParams,
) => {
  return useMemo(() => {
    let filtered = [...exercises];

    // Filter by Muscle Group (high-level)
    // Maps to detailed body parts and uses OR logic within the group
    if (filters.muscleGroup) {
      const mappedBodyParts = MUSCLE_GROUP_MAPPING[filters.muscleGroup];
      if (mappedBodyParts) {
        filtered = filtered.filter((ex) =>
          mappedBodyParts.some((bp) => ex.muscleGroups?.includes(bp)),
        );
      }
    }

    // Filter by Body Parts (detailed, multi-select)
    // Uses OR logic: exercise must include ANY of the selected body parts
    if (filters.bodyParts && filters.bodyParts.length > 0) {
      filtered = filtered.filter((ex) =>
        filters.bodyParts!.some((bp) => ex.muscleGroups?.includes(bp)),
      );
    }

    // Category
    if (filters.category) {
      filtered = filtered.filter((ex) => ex.category === filters.category);
    }

    // Difficulty
    if (filters.difficulty) {
      filtered = filtered.filter((ex) => ex.difficulty === filters.difficulty);
    }

    return filtered;
  }, [exercises, filters]);
};
