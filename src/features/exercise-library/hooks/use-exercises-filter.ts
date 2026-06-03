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
    // Maps high-level group ("arms", "back") to detailed muscle names ("biceps", "triceps", etc.)
    // muscleGroups field in Firestore stores detailed names
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
      const category = filters.category;
      filtered = filtered.filter((ex) => ex.category === category);
    }

    // Difficulty
    if (filters.difficulty) {
      const difficulty = filters.difficulty;
      filtered = filtered.filter((ex) => ex.difficulty === difficulty);
    }

    return filtered;
  }, [exercises, filters]);
};
/**
 * Extract unique difficulty values from exercises data
 */
export const getUniqueDifficulties = (exercises: IExercise[]): string[] => {
  const difficulties = new Set<string>();
  exercises.forEach((ex) => {
    if (ex.difficulty) {
      difficulties.add(ex.difficulty);
    }
  });
  return Array.from(difficulties).sort();
};

/**
 * Extract unique category values from exercises data
 */
export const getUniqueCategories = (exercises: IExercise[]): string[] => {
  const categories = new Set<string>();
  exercises.forEach((ex) => {
    if (ex.category) {
      categories.add(ex.category);
    }
  });
  return Array.from(categories).sort();
};
