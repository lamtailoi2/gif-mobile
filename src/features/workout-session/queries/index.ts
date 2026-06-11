import { queryOptions } from "@tanstack/react-query";
import { getAllRoutines, getRoutineWithExercises } from "../apis/routines";

export enum EWorkoutSessionQueryKeys {
  GetAllRoutines = "getAllRoutines",
  GetRoutineWithExercises = "getRoutineWithExercises",
}

export const getAllRoutinesQuery = () =>
  queryOptions({
    queryKey: [EWorkoutSessionQueryKeys.GetAllRoutines],
    queryFn: getAllRoutines,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

export const getRoutineWithExercisesQuery = (routineId: string) =>
  queryOptions({
    queryKey: [EWorkoutSessionQueryKeys.GetRoutineWithExercises, routineId],
    queryFn: () => getRoutineWithExercises(routineId),
    enabled: !!routineId,
    staleTime: 1000 * 60 * 60,
  });
