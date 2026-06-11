import { useQuery } from "@tanstack/react-query";
import { getRoutineWithExercisesQuery } from "../queries";

/**
 * Load một routine cụ thể kèm danh sách exercises đã resolved từ Firestore.
 *
 * @param routineId - ID của document trong workoutRoutines collection.
 */
export const useRoutineWithExercises = (routineId: string) => {
  return useQuery(getRoutineWithExercisesQuery(routineId));
};
