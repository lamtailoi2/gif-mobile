import { useQuery } from "@tanstack/react-query";
import {
    ExerciseFilterParams,
    useExerciseFilter,
} from "../hooks/useExercisesFilter";
import { getAllExercisesQuery } from "../queries";

interface ExerciseLibraryListProps {
  filters?: ExerciseFilterParams;
}

export default function ExerciseLibraryList({
  filters = {},
}: ExerciseLibraryListProps) {
  const { data: exercises = [], isLoading } = useQuery(getAllExercisesQuery());

  const filtered = useExerciseFilter(exercises, filters);
}
