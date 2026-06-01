import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import ExerciseGuideScreen from "@/features/exercise-guide/components/exercise-guide";
import { getAllExercisesQuery } from "@/features/exercise-library/queries";
import { useTheme } from "@/hooks/use-theme";
import { useQuery } from "@tanstack/react-query";

export default function ExerciseGuideRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: exercises = [], isLoading } = useQuery(getAllExercisesQuery());
  const theme = useTheme();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  const exercise = exercises.find((ex) => ex.id === id);

  if (!exercise) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  return <ExerciseGuideScreen exercise={exercise} />;
}
