import { queryOptions } from "@tanstack/react-query";
import { getAllExercises, getExerciseByCategory } from "../apis";
import { exerciseLibraryQueryKeys } from "./key";

export const getAllExercisesQuery = () => {
  return queryOptions({
    queryKey: [exerciseLibraryQueryKeys.GetAllExercises],
    queryFn: async () => await getAllExercises(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
};

export const getExercisesByCategoryQuery = (category: string) => {
  return queryOptions({
    queryKey: [exerciseLibraryQueryKeys.GetExercisesByCategory, category],
    queryFn: async () => await getExerciseByCategory(category),
  });
};
