import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList } from "react-native";

import {
  ExerciseFilterParams,
  useExerciseFilter,
} from "../hooks/useExercisesFilter";

import { getAllExercisesQuery } from "../queries";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/hooks/use-theme";
import ExerciseCard from "./ExerciseCard";

interface ExerciseLibraryListProps {
  filters?: ExerciseFilterParams;
}

export default function ExerciseLibraryList({
  filters = {},
}: ExerciseLibraryListProps) {
  const { data: exercises = [], isLoading } = useQuery(getAllExercisesQuery());

  const theme = useTheme();

  const filtered = useExerciseFilter(exercises, filters);

  if (isLoading) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color={theme.text} />
      </ThemedView>
    );
  }

  if (!filtered || filtered.length === 0) {
    return (
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ThemedText>No exercises found</ThemedText>
      </ThemedView>
    );
  }

  return (
    <FlatList
      data={filtered}
      renderItem={({ item }) => <ExerciseCard exercise={item} />}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{
        padding: 16,
      }}
    />
  );
}
