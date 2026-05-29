import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import {
  IExerciseFilterParams,
  useExerciseFilter,
} from "../hooks/use-exercises-filter";
import { getAllExercisesQuery } from "../queries";
import { IExercise } from "../types/exercise";
import ExerciseCard from "./exercise-card";

interface IExerciseLibraryListProps {
  filters?: IExerciseFilterParams;
  onExercisePress?: (exercise: IExercise) => void;
}

export default function ExerciseLibraryList({
  filters = {},
  onExercisePress,
}: IExerciseLibraryListProps) {
  const { data: exercises = [], isLoading } = useQuery(getAllExercisesQuery());

  const theme = useTheme();

  const filtered = useExerciseFilter(exercises, filters);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  if (!filtered || filtered.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <Text className="text-on-surface">No exercises found</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filtered}
      renderItem={({ item }) => (
        <ExerciseCard exercise={item} onPress={onExercisePress} />
      )}
      keyExtractor={(item) => item.id}
      contentContainerClassName="p-gutter"
    />
  );
}
