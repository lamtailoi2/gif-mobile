import { queryOptions } from "@tanstack/react-query";
import { getExerciseGuideById } from "../apis";
import { exerciseGuideQueryKeys } from "./key";

export const getExerciseGuideQuery = (exerciseId: string) => {
  return queryOptions({
    queryKey: [exerciseGuideQueryKeys.GetGuideById, exerciseId],
    queryFn: () => getExerciseGuideById(exerciseId),
    staleTime: 1000 * 60 * 30,
  });
};
