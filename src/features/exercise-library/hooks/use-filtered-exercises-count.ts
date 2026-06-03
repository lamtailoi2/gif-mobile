import { useMemo } from "react";
import { IExercise } from "../types/exercise";
import {
    IExerciseFilterParams,
    useExerciseFilter,
} from "./use-exercises-filter";

export const useFilteredExercisesCount = (
  exercises: IExercise[],
  filters: IExerciseFilterParams,
): number => {
  const filtered = useExerciseFilter(exercises, filters);
  return useMemo(() => filtered.length, [filtered.length]);
};
